import { Router, type IRouter } from "express";
import { z } from "zod";
import { getOpenAIClient, getChatModelId } from "../lib/openai.js";

const router: IRouter = Router();

const analyzeSchema = z.object({
  columns: z.array(z.string()).min(1).max(50),
  sample: z.array(z.record(z.unknown())).min(1).max(20),
  row_count: z.number().int().min(1).max(100_000),
});

/**
 * POST /api/csv/analyze
 * Body: { columns, sample (primeros 10 rows), row_count }
 * Returns: { schema, insights, summary, mock }
 *
 * Mock mode: heurística por nombres de columna + ranges del sample.
 * Real mode: structured output con Claude/GPT.
 */
router.post("/csv/analyze", async (req, res) => {
  const parse = analyzeSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "invalid_body", issues: parse.error.issues });
    return;
  }
  const { columns, sample, row_count } = parse.data;
  const client = getOpenAIClient();

  // ---------- MOCK MODE ----------
  if (!client) {
    res.json(analyzeHeuristic(columns, sample, row_count));
    return;
  }

  // ---------- REAL MODE ----------
  try {
    const prompt = buildAnalyzePrompt(columns, sample, row_count);
    const completion = await client.chat.completions.create({
      model: getChatModelId(),
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en bioprocesos. Analiza CSVs de corridas de biorreactor. Responde SIEMPRE con JSON válido con las claves: schema, insights, summary.",
        },
        { role: "user", content: prompt },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = analyzeHeuristic(columns, sample, row_count);
    }
    res.json({ ...parsed, mock: false });
  } catch (err) {
    req.log?.error?.({ err }, "csv/analyze llm failed");
    res.json(analyzeHeuristic(columns, sample, row_count));
  }
});

// ---------------------------------------------------------------------------
// Heurística mock
// ---------------------------------------------------------------------------

function analyzeHeuristic(
  columns: string[],
  sample: Array<Record<string, unknown>>,
  rowCount: number,
) {
  const lower = columns.map((c) => c.toLowerCase());
  const findCol = (keys: string[]): string | undefined => {
    const idx = lower.findIndex((c) => keys.some((k) => c.includes(k)));
    return idx >= 0 ? columns[idx] : undefined;
  };

  const schema = {
    time: findCol(["time", "hora", "t_h", "elapsed", "hour"]) ?? columns[0],
    biomass: findCol(["biomass", "od600", "od", "cell"]),
    ph: findCol(["ph"]),
    do: findCol(["do", "oxygen", "dissolved"]),
    temp: findCol(["temp", "temperature"]),
    glucose: findCol(["glucose", "glucosa", "sugar"]),
    titer: findCol(["titer", "product", "yield", "b12", "riboflavin"]),
  };

  const insights: Array<{
    type: "info" | "warning" | "success" | "alert";
    msg: string;
    detail?: string;
    severity: number;
  }> = [
    {
      type: "info",
      msg: `Dataset: ${rowCount} filas, ${columns.length} columnas detectadas`,
      detail: `Inferimos columnas: ${Object.entries(schema).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(", ")}`,
      severity: 2,
    },
  ];

  // Detectar drift simple si hay pH en el sample
  if (schema.ph) {
    const phValues = sample
      .map((r) => Number(r[schema.ph!]))
      .filter((v) => !isNaN(v));
    if (phValues.length >= 2) {
      const delta = Math.abs(phValues[phValues.length - 1] - phValues[0]);
      if (delta > 0.3) {
        insights.push({
          type: "warning",
          msg: `pH derivó ${delta.toFixed(2)} unidades en la muestra observada`,
          detail:
            "Patrón típico de acumulación de ácido orgánico. Verificá feed rate + glucosa residual.",
          severity: 3,
        });
      }
    }
  }

  if (schema.do) {
    const doValues = sample
      .map((r) => Number(r[schema.do!]))
      .filter((v) => !isNaN(v));
    const last = doValues[doValues.length - 1];
    if (!isNaN(last) && last < 20) {
      insights.push({
        type: "alert",
        msg: `DO crítico: ${last.toFixed(1)}% en última muestra`,
        detail: "Verificá overfeed + RPM + espuma. Regla: subir RPM 15% antes de tocar feed.",
        severity: 4,
      });
    }
  }

  return {
    schema,
    insights,
    summary: {
      duration_h: rowCount,
      confidence: 0.45,
    },
    mock: true,
  };
}

function buildAnalyzePrompt(
  columns: string[],
  sample: Array<Record<string, unknown>>,
  rowCount: number,
): string {
  return `CSV de biorreactor con ${rowCount} filas. Primeras 10 filas:

Columnas: ${columns.join(", ")}
Sample:
${sample.map((r, i) => `  ${i + 1}. ${JSON.stringify(r)}`).join("\n")}

Devuelve JSON con estas claves:
- schema: { time: string, biomass?: string, ph?: string, do?: string, temp?: string, glucose?: string, titer?: string } — mapeo de roles conceptuales → nombres reales de columna.
- insights: array de máximo 4 objetos { type: "info"|"warning"|"success"|"alert", msg: string, detail?: string, severity: 1-5 }. Incluí al menos 1 warning o alert si detectás drift/crash/contaminación.
- summary: { organism?: string, product?: string, duration_h?: number, final_titer?: number, yield_estimated?: number, confidence: 0-1 }.

Sé conservador: si no podés inferir organism/product, deja undefined. Nunca inventes cifras — solo reporta lo observable.`;
}

export default router;
