// Thin API client for biosync-studio. Mirrors the pattern in artifacts/landing/src/lib/api.ts.
// If VITE_API_URL is unset → mock mode (client-side fallback responses).
//
// Used by: pages/Asistente.tsx (RAG SSE), pages/Dashboard.tsx (insights widget).

export const API_URL: string = import.meta.env.VITE_API_URL ?? "";
export const isMockMode: boolean = !API_URL || API_URL.trim() === "";

// ---------------------------------------------------------------------------
// Types mirrored from api-server (keep in sync)
// ---------------------------------------------------------------------------

export interface Citation {
  id: string;
  text: string;
  source_url: string;
  source_name: string;
  similarity: number;
}

export interface Recommendation {
  title: string;
  confidence: number;
  setpoints?: {
    ph?: number;
    temp?: number;
    do?: number;
    rpm?: number;
  };
  actions?: string[];
  preset_id?: string;
  source_id?: string;
  source_name?: string;
}

export interface PainPoint {
  category: string;
  count: number;
  severity_avg: number;
  example_quote: string;
}

// ---------------------------------------------------------------------------
// Mock fallbacks (used only when API_URL is unset)
// ---------------------------------------------------------------------------

const MOCK_FALLBACK_RECS: Record<string, Recommendation> = {
  ph: {
    title: "Ajustes recomendados para recuperar pH",
    confidence: 0.82,
    setpoints: { ph: 7.0, temp: 37.0, do: 45, rpm: 500 },
    actions: [
      "Bajar feed rate 30% por 45 min",
      "Verificar glucosa residual <5 g/L",
      "Muestra microscopía si pH <6.8",
    ],
    preset_id: "ph-recovery-ecoli",
  },
  "scale-up": {
    title: "Setpoints sugeridos para scale-up 5L → 50L",
    confidence: 0.76,
    setpoints: { ph: 7.2, temp: 37.0, do: 40, rpm: 450 },
    actions: [
      "Mantené kLa constante",
      "Tracer dye test — tiempo mezcla <30s",
      "Verificá gradientes DO/pH antes de scale",
    ],
    preset_id: "scale-up-5l-50l",
  },
};

const MOCK_FALLBACK_ANSWERS: Array<{
  match: RegExp;
  answer: string;
  citations: Citation[];
  recKey?: keyof typeof MOCK_FALLBACK_RECS;
}> = [
  {
    recKey: "ph",
    match: /ph.*(3 ?am|noche|madrugada|drift|deriv|bajo|baj[oó]|cay)/i,
    answer:
      "Si el pH bajó rápidamente, lo más probable es acumulación de ácido orgánico (acetato, lactato) por glucosa excedente. Acciones: (1) medir glucosa residual; si >8 g/L el feed está sobre-inyectando. (2) bajar feed rate 30% o pausar 20 min. (3) si continúa bajando a pesar del feed-stop, sospechar contaminación bacteriana — tomar muestra para microscopía.",
    citations: [
      {
        id: "offline-1",
        text: "Contamination events: lost batches, investigations, compliance issues.",
        source_url: "https://www.bioprocessonline.com/doc/troubleshooting-bacterial-contamination-in-bioreactors-0001",
        source_name: "James Blackwell · BioProcessOnline",
        similarity: 0.8,
      },
    ],
  },
  {
    match: /benchling|precio|cuesta|costo/i,
    answer:
      "Benchling cuesta aproximadamente $246K por 24 meses para biotechs pequeñas (Brendan Studebaker, LinkedIn 2023). Enterprise escala a $1M+. BioSync Studio es $99/mes por reactor — aproximadamente 20-40× más barato, con pricing público.",
    citations: [
      {
        id: "offline-2",
        text: "Benchling will cost your startup $246,000 over the first 2 years.",
        source_url: "https://www.linkedin.com/posts/brendan-studebaker-3671b911b_benchling-will-cost-your-startup-246000-activity-7074122045839605760-KR1S",
        source_name: "Brendan Studebaker · LinkedIn",
        similarity: 0.9,
      },
    ],
  },
  {
    match: /annex ?22|ema|gmp|regulat/i,
    answer:
      "EMA Annex 22 draft (publicado 7 jul 2025). Regla final esperada Q2 2026, enforcement 2027-2028. El draft dice: 'adaptive and generative models are explicitly prohibited in GMP-critical decisions'. BioSync diseñamos con weights fijos + audit trail ALCOA+ desde día uno.",
    citations: [
      {
        id: "offline-3",
        text: "Adaptive and generative models are explicitly prohibited in GMP-critical decisions.",
        source_url: "https://www.gmp-compliance.org/files/guidemgr/mp_vol4_chap4_annex22_consultation_guideline_en.pdf",
        source_name: "EMA Annex 22 draft PDF",
        similarity: 0.9,
      },
    ],
  },
  {
    recKey: "scale-up",
    match: /scale.?up|escal|50l|5l.*50|pilot/i,
    answer:
      "Scale-up de 5L a 50L: mantené kLa constante (no rpm constante — la física cambia). P/V (potencia por volumen) es proxy razonable. Verificá: tiempo de mezcla (en 50L puede duplicarse), gradientes locales de DO/pH (pueden diferir 10-15%), shear stress si bajaste rpm.",
    citations: [
      {
        id: "offline-4",
        text: "Batch raw material and resource costs often greater than $1–2 million (Junker, Merck).",
        source_url: "https://www.bioprocessintl.com/bioanalytical-methods/biotech-facilities-average-a-batch-failure-every-40-6-weeks",
        source_name: "Beth Junker · BioProcess International",
        similarity: 0.75,
      },
    ],
  },
];

function mockAnswer(query: string): { answer: string; citations: Citation[]; recommendation?: Recommendation } {
  for (const entry of MOCK_FALLBACK_ANSWERS) {
    if (entry.match.test(query)) {
      return {
        answer: entry.answer,
        citations: entry.citations,
        recommendation: entry.recKey ? MOCK_FALLBACK_RECS[entry.recKey] : undefined,
      };
    }
  }
  return {
    answer:
      "No tengo ese dato preciso acá. Podés consultar la Red de Bio-Conocimiento para protocolos, o preguntarme sobre: pH, DO crash, scale-up, contaminación, costo Benchling, Annex 22.",
    citations: [],
  };
}

// ---------------------------------------------------------------------------
// Public: streamAskAssistant
// ---------------------------------------------------------------------------

export interface StreamCallbacks {
  onToken: (delta: string) => void;
  onCitations: (citations: Citation[]) => void;
  onRecommendations?: (recommendations: Recommendation) => void;
  onDone: (meta: { mock: boolean; cached: boolean; ok: boolean; error?: string }) => void;
}

export async function streamAskAssistant(
  query: string,
  callbacks: StreamCallbacks,
  opts: { lang?: "es" | "en" } = {},
): Promise<void> {
  const lang = opts.lang ?? "es";

  // Mock fallback — no API URL configured.
  if (isMockMode) {
    const { answer, citations, recommendation } = mockAnswer(query);
    const chunks = answer.match(/[\s\S]{1,24}/g) ?? [answer];
    for (const chunk of chunks) {
      callbacks.onToken(chunk);
      await new Promise((r) => setTimeout(r, 20));
    }
    callbacks.onCitations(citations);
    if (recommendation && callbacks.onRecommendations) callbacks.onRecommendations(recommendation);
    callbacks.onDone({ mock: true, cached: false, ok: true });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/asistente/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({ q: query, lang }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`http ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events: event: NAME\ndata: JSON\n\n
      let sep;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const lines = rawEvent.split("\n");
        let eventName = "message";
        let dataStr = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) eventName = line.slice(7).trim();
          else if (line.startsWith("data: ")) dataStr += line.slice(6);
        }
        if (!dataStr) continue;
        let data: unknown;
        try {
          data = JSON.parse(dataStr);
        } catch {
          continue;
        }
        if (eventName === "token") {
          const d = (data as { delta?: string }).delta;
          if (d) callbacks.onToken(d);
        } else if (eventName === "citations") {
          const c = (data as { citations?: Citation[] }).citations;
          if (c) callbacks.onCitations(c);
        } else if (eventName === "recommendations") {
          const r = (data as { recommendations?: Recommendation }).recommendations;
          if (r && callbacks.onRecommendations) callbacks.onRecommendations(r);
        } else if (eventName === "done") {
          callbacks.onDone(data as { mock: boolean; cached: boolean; ok: boolean });
          return;
        }
      }
    }

    callbacks.onDone({ mock: false, cached: false, ok: true });
  } catch (err) {
    // Network or CORS error → fall back to mock inline so the UI never hangs.
    const { answer, citations, recommendation } = mockAnswer(query);
    const chunks = answer.match(/[\s\S]{1,24}/g) ?? [answer];
    for (const chunk of chunks) {
      callbacks.onToken(chunk);
      await new Promise((r) => setTimeout(r, 15));
    }
    callbacks.onCitations(citations);
    if (recommendation && callbacks.onRecommendations) callbacks.onRecommendations(recommendation);
    callbacks.onDone({
      mock: true,
      cached: false,
      ok: false,
      error: err instanceof Error ? err.message : "network",
    });
  }
}

// ---------------------------------------------------------------------------
// Public: pain-points (dashboard widget)
// ---------------------------------------------------------------------------

const MOCK_PAIN_POINTS: PainPoint[] = [
  {
    category: "Scale-up lab → pilot",
    count: 18,
    severity_avg: 4.4,
    example_quote:
      "Iterations lab→pilot→full scale: very tough, error prone (Geertz-Hansen, 21st.BIO)",
  },
  {
    category: "Contamination / DO crash",
    count: 14,
    severity_avg: 4.7,
    example_quote:
      "Contamination events: lost batches, investigations, compliance issues (Blackwell)",
  },
  {
    category: "Cost of incumbents (Benchling, SIMCA)",
    count: 12,
    severity_avg: 3.8,
    example_quote:
      "Benchling will cost your startup $246,000 over 2 years (Studebaker)",
  },
  {
    category: "OFAT / slow optimization",
    count: 11,
    severity_avg: 3.9,
    example_quote:
      "10 factors sequentially = several months of 5L-reactor time (Peppers)",
  },
  {
    category: "Tribal knowledge / data silos",
    count: 9,
    severity_avg: 4.2,
    example_quote:
      "Instruments excrete face-palm inducing data formats (Feala, Medium)",
  },
];

export async function fetchPainPoints(): Promise<{ mock: boolean; top: PainPoint[] }> {
  if (isMockMode) return { mock: true, top: MOCK_PAIN_POINTS };
  try {
    const res = await fetch(`${API_URL}/api/insights/pain-points?window=7d`);
    if (!res.ok) throw new Error(`http ${res.status}`);
    const data = (await res.json()) as { mock: boolean; top: PainPoint[] };
    return data;
  } catch {
    return { mock: true, top: MOCK_PAIN_POINTS };
  }
}
