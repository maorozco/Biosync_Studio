// RAG pipeline — embed query → retrieve top-K → compose prompt → stream
// completion. Supports both REAL mode (OpenAI/Azure) and MOCK mode (keyword
// similarity over offline corpus).
//
// The public surface is:
//   - retrieveForQuery(query): RetrievalResult       (sync-ish, ~50ms)
//   - streamAnswer(query, retrieval, res, { lang })  (async, SSE)
//
// SSE event shape:
//   event: token  data: {"delta": "..."}
//   event: citations  data: {"citations": [...]}
//   event: done  data: {"ok": true, "mock": bool, "cached": bool}

import type { Response } from "express";
import {
  CORPUS,
  type CorpusEntry,
  findCachedCorpusId,
  getCorpusById,
  normalizeQuery,
} from "./corpus.js";
import { getOpenAIClient, getChatModelId, getEmbedModelId } from "./openai.js";

export interface Citation {
  id: string;
  text: string;
  source_url: string;
  source_name: string;
  similarity: number;
}

export interface RetrievalResult {
  hits: Array<{ entry: CorpusEntry; similarity: number }>;
  cacheHit: string | null;
  mock: boolean;
}

// ---------------------------------------------------------------------------
// Token-overlap similarity (used in mock + as cheap first pass in real mode)
// ---------------------------------------------------------------------------

function jaccard(aTokens: Set<string>, bTokens: Set<string>): number {
  if (aTokens.size === 0 || bTokens.size === 0) return 0;
  let inter = 0;
  for (const t of aTokens) if (bTokens.has(t)) inter++;
  return inter / new Set([...aTokens, ...bTokens]).size;
}

function tokenize(text: string): Set<string> {
  return new Set(
    normalizeQuery(text)
      .split(" ")
      .filter((t) => t.length > 2),
  );
}

// ---------------------------------------------------------------------------
// Corpus embeddings cache (populated lazily in real mode)
// ---------------------------------------------------------------------------

let corpusEmbeddingsReady = false;

async function ensureCorpusEmbeddings(): Promise<void> {
  if (corpusEmbeddingsReady) return;
  const client = getOpenAIClient();
  if (!client) return;
  const missing = CORPUS.filter((e) => !e.embedding);
  if (missing.length === 0) {
    corpusEmbeddingsReady = true;
    return;
  }
  // Batch embed (single request; ≤20 entries fits comfortably)
  const resp = await client.embeddings.create({
    model: getEmbedModelId(),
    input: missing.map((e) => `${e.text}\nTags: ${e.tags.join(", ")}`),
  });
  resp.data.forEach((d, i) => {
    missing[i].embedding = d.embedding;
  });
  corpusEmbeddingsReady = true;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ---------------------------------------------------------------------------
// Public: retrieve
// ---------------------------------------------------------------------------

export async function retrieveForQuery(
  query: string,
  topK: number = 5,
): Promise<RetrievalResult> {
  const cacheHit = findCachedCorpusId(query);
  const client = getOpenAIClient();
  const mock = !client;

  // Cache hit short-circuits everything — always prioritized (it's our manual
  // pre-validation for "judge-likely" queries).
  if (cacheHit) {
    const entry = getCorpusById(cacheHit);
    if (entry) {
      const rest = CORPUS.filter((e) => e.id !== cacheHit).slice(0, topK - 1);
      return {
        hits: [
          { entry, similarity: 0.95 },
          ...rest.map((e) => ({ entry: e, similarity: 0.5 })),
        ],
        cacheHit,
        mock,
      };
    }
  }

  if (mock) {
    // Token-overlap scoring
    const qTokens = tokenize(query);
    const scored = CORPUS.map((entry) => {
      const textScore = jaccard(qTokens, tokenize(entry.text));
      const tagScore = jaccard(qTokens, new Set(entry.tags.map((t) => t.toLowerCase())));
      return { entry, similarity: Math.max(textScore, tagScore * 0.8) };
    });
    scored.sort((a, b) => b.similarity - a.similarity);
    return { hits: scored.slice(0, topK), cacheHit: null, mock: true };
  }

  // Real mode: embed query + cosine over corpus
  await ensureCorpusEmbeddings();
  const qEmbed = await client!.embeddings.create({
    model: getEmbedModelId(),
    input: query,
  });
  const qVec = qEmbed.data[0].embedding;

  const scored = CORPUS.map((entry) => ({
    entry,
    similarity: entry.embedding ? cosine(qVec, entry.embedding) : 0,
  }));
  scored.sort((a, b) => b.similarity - a.similarity);
  return { hits: scored.slice(0, topK), cacheHit: null, mock: false };
}

// ---------------------------------------------------------------------------
// SSE helpers
// ---------------------------------------------------------------------------

function sseSend(res: Response, event: string, data: unknown): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function citationsFromRetrieval(r: RetrievalResult): Citation[] {
  return r.hits.slice(0, 3).map((h) => ({
    id: h.entry.id,
    text: h.entry.text.slice(0, 280),
    source_url: h.entry.source_url,
    source_name: h.entry.source_name,
    similarity: Number(h.similarity.toFixed(3)),
  }));
}

// ---------------------------------------------------------------------------
// Public: stream answer
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT_ES = `Eres el Asistente de BioSync Studio. Tu rol es responder preguntas de PD Scientists, Fermentation Engineers y otros biólogos que corren biorreactores de <20L.

REGLAS DURAS:
1. Cita SOLO información presente en el CONTEXTO. Si no está, di "no tengo ese dato preciso acá" y orienta.
2. Jamás inventes URLs. Jamás prometas lo que BioSync no hace hoy.
3. Evita overclaim: no digas "IA mágica", "garantizado 100%", "predicción perfecta".
4. Hedge donde corresponda: "si tenés ≥20 batches etiquetados", "con sensores en tiempo real", "según paper X".
5. Responde en español, tono técnico pero accesible, máximo 150 palabras.
6. Si la pregunta es off-topic (no relacionada a bioprocesos/biorremediación/SaaS BioSync), responde amable y redirige.`;

const SYSTEM_PROMPT_EN = `You are the BioSync Studio Assistant. Your role: answer PD Scientists, Fermentation Engineers, and biologists running <20L bioreactors.

HARD RULES:
1. Cite ONLY info present in CONTEXT. If missing, say "I don't have that exact data here" and redirect.
2. Never invent URLs. Never promise what BioSync doesn't do today.
3. Avoid overclaim: no "magic AI", "100% guaranteed", "perfect prediction".
4. Hedge where appropriate: "with ≥20 labeled batches", "with real-time sensors", "per paper X".
5. Answer in English, technical but accessible, max 150 words.
6. If off-topic (not bioprocess/bioremediation/BioSync SaaS), be polite and redirect.`;

export async function streamAnswer(
  query: string,
  retrieval: RetrievalResult,
  res: Response,
  opts: { lang?: "es" | "en" } = {},
): Promise<void> {
  const lang = opts.lang ?? "es";
  const citations = citationsFromRetrieval(retrieval);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering

  const client = getOpenAIClient();
  const context = retrieval.hits
    .slice(0, 5)
    .map(
      (h, i) =>
        `[${i + 1}] (${h.entry.source_name}) ${h.entry.text}\nURL: ${h.entry.source_url}`,
    )
    .join("\n\n");

  // ---------- MOCK MODE (no LLM) ----------
  if (!client || retrieval.cacheHit) {
    // If cacheHit, the top hit IS the pre-validated answer — stream it word
    // by word. Else, compose a templated response from the top hit.
    const top = retrieval.hits[0]?.entry;
    const body = top
      ? `${top.text}\n\n(Respuesta validada ${retrieval.cacheHit ? "pre-cache" : "por similaridad"}. Fuente: ${top.source_name}.)`
      : "No encuentro información directamente aplicable a esa pregunta en nuestro corpus. ¿Podés reformularla con más detalle sobre el organismo o la variable?";

    // Stream in 20-char chunks to simulate typing
    const chunks = body.match(/[\s\S]{1,24}/g) ?? [body];
    for (const chunk of chunks) {
      sseSend(res, "token", { delta: chunk });
      await new Promise((r) => setTimeout(r, 20));
    }
    sseSend(res, "citations", { citations });
    sseSend(res, "done", {
      ok: true,
      mock: true,
      cached: !!retrieval.cacheHit,
    });
    res.end();
    return;
  }

  // ---------- REAL MODE ----------
  const systemPrompt = lang === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ES;
  const stream = await client.chat.completions.create({
    model: getChatModelId(),
    temperature: 0.3,
    max_tokens: 400,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `CONTEXTO:\n${context}\n\nPREGUNTA: ${query}\n\nResponde citando [1]–[${retrieval.hits.length}] cuando uses información del contexto.`,
      },
    ],
  });

  try {
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) sseSend(res, "token", { delta });
    }
    sseSend(res, "citations", { citations });
    sseSend(res, "done", { ok: true, mock: false, cached: false });
    res.end();
  } catch (err) {
    sseSend(res, "done", {
      ok: false,
      mock: false,
      cached: false,
      error: err instanceof Error ? err.message : "unknown error",
    });
    res.end();
  }
}
