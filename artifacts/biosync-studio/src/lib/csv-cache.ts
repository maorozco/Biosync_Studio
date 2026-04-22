// Mock cache para el "Paste CSV → Dashboard lleno en 3s" magic moment.
// Si el hash de la primera línea del CSV matchea, se responde INSTANTÁNEO
// sin red. Si no, se llama al endpoint real /api/infer-schema + /api/insights.

export interface CsvSchema {
  time: string; // column name for time axis
  biomass?: string;
  ph?: string;
  do?: string;
  temp?: string;
  glucose?: string;
  titer?: string;
  [key: string]: string | undefined;
}

export interface Insight {
  type: "warning" | "info" | "success" | "alert";
  msg: string;
  detail?: string;
  evidence_url?: string;
  severity: 1 | 2 | 3 | 4 | 5;
}

export interface CsvAnalysis {
  rows: Record<string, string | number | null>[];
  schema: CsvSchema;
  insights: Insight[];
  summary: {
    organism?: string;
    product?: string;
    duration_h?: number;
    final_titer?: number;
    yield_estimated?: number;
    confidence?: number;
  };
  cached: boolean;
}

// FNV-1a hash 32-bit (rápido, determinista, solo primeros 200 chars)
export function hashCsvPreview(text: string): string {
  const preview = text.slice(0, 200);
  let hash = 2166136261;
  for (let i = 0; i < preview.length; i++) {
    hash ^= preview.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// Heurística rápida — el texto parece CSV? (coma/tab + al menos 2 lines + header con palabras)
export function looksLikeCSV(text: string): boolean {
  if (!text || text.length < 20) return false;
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 3) return false;
  const sep = lines[0].includes("\t") ? "\t" : lines[0].includes(",") ? "," : null;
  if (!sep) return false;
  const headerParts = lines[0].split(sep);
  if (headerParts.length < 2) return false;
  // Al menos una celda header debe parecer palabra (letras)
  const hasHeaderLike = headerParts.some((h) => /[a-zA-Z]{2,}/.test(h.trim()));
  return hasHeaderLike;
}

// ---------------------------------------------------------------------------
// Pre-cacheadas (3 CSVs canónicos del pitch demo)
// ---------------------------------------------------------------------------
// Estos se seleccionan intencionalmente para cover los 3 casos demo que Manu
// practica. Los hashes se computan con `hashCsvPreview` sobre los primeros
// 200 chars del archivo canónico.

const ECOLI_B12_INSIGHTS: Insight[] = [
  {
    type: "warning",
    msg: "pH drifted +0.42 unidades entre las horas 18 y 24",
    detail: "Patrón típico de acumulación de acetato por overfeeding. 12 posts de r/labrats reportan el mismo comportamiento con E. coli K-12.",
    evidence_url: "https://www.bioprocessonline.com/doc/troubleshooting-bacterial-contamination-in-bioreactors-0001",
    severity: 4,
  },
  {
    type: "alert",
    msg: "DO crash predicho para h≈34 (probabilidad 0.78)",
    detail: "Trayectoria actual de glucosa residual + OD600 indica alta demanda O₂. Sugerencia: bajar feed rate 25% en h=28.",
    severity: 4,
  },
  {
    type: "success",
    msg: "Yield estimado 8.2 g/L — dentro del rango Series-A-ready (≥3 g/L)",
    detail: "Consistente con Biotechnology & Bioengineering 2025 para B12 fed-batch en 20L.",
    severity: 2,
  },
];

const KOMAGATAELLA_MYCO_INSIGHTS: Insight[] = [
  {
    type: "info",
    msg: "Crecimiento aún en fase exponencial temprana a h=36",
    detail: "K. phaffii con metanol como C-source es lento. Esperá fase de inducción fuerte h=40-60.",
    severity: 2,
  },
  {
    type: "warning",
    msg: "Temperatura subió a 31.2°C (objetivo 30°C)",
    detail: "K. phaffii es sensible >32°C — ajustar cooling. Literatura: loss of titer 15-20% por cada °C sobre 30.",
    severity: 3,
  },
  {
    type: "success",
    msg: "Patrón de glucosa-metanol consistente con high-titer runs",
    severity: 2,
  },
];

const BSUBTILIS_RIBO_INSIGHTS: Insight[] = [
  {
    type: "info",
    msg: "B. subtilis en fase estacionaria — fase productiva de riboflavina",
    detail: "Expect titer ramp de h=20 en adelante.",
    severity: 2,
  },
  {
    type: "warning",
    msg: "Glucosa residual elevada (2.3 g/L)",
    detail: "Riesgo overflow metabolism → acetato. Sugerencia: reducir feed glucosa 15% por 4h.",
    severity: 3,
  },
];

// Intentionally unused hash keys — matching logic está en findCachedCsv()
// que hace comparación por "firma" de contenido (nombres de columnas clave).
// Los hash exactos dependerían del CSV canónico binario.

export const CACHED_CSVS: Array<{
  signature: string[]; // column names que deben estar presentes (case-insensitive)
  analysis: Omit<CsvAnalysis, "rows" | "cached">;
}> = [
  {
    signature: ["time", "biomass", "ph", "glucose"],
    analysis: {
      schema: {
        time: "time_h",
        biomass: "od600",
        ph: "pH",
        do: "DO_pct",
        glucose: "glucose_gL",
        titer: "b12_mgL",
      },
      insights: ECOLI_B12_INSIGHTS,
      summary: {
        organism: "E. coli K-12",
        product: "Vitamina B12",
        duration_h: 48,
        final_titer: 8.2,
        yield_estimated: 0.34,
        confidence: 0.87,
      },
    },
  },
  {
    signature: ["time", "biomass", "methanol", "temp"],
    analysis: {
      schema: {
        time: "time_h",
        biomass: "OD600",
        temp: "temp_C",
        ph: "pH",
        do: "DO_pct",
      },
      insights: KOMAGATAELLA_MYCO_INSIGHTS,
      summary: {
        organism: "K. phaffii (Pichia pastoris)",
        product: "Mycoprotein",
        duration_h: 36,
        final_titer: 4.5,
        yield_estimated: 0.28,
        confidence: 0.81,
      },
    },
  },
  {
    signature: ["time", "riboflavin", "glucose"],
    analysis: {
      schema: {
        time: "time_h",
        biomass: "OD600",
        ph: "pH",
        glucose: "glucose_gL",
        titer: "riboflavin_gL",
      },
      insights: BSUBTILIS_RIBO_INSIGHTS,
      summary: {
        organism: "B. subtilis",
        product: "Riboflavina (B2)",
        duration_h: 24,
        final_titer: 2.8,
        yield_estimated: 0.22,
        confidence: 0.79,
      },
    },
  },
];

export function findCachedCsv(
  columnNames: string[],
): (typeof CACHED_CSVS)[number] | null {
  const lower = columnNames.map((c) => c.toLowerCase());
  // Coincidencia más alta por número de signatures matched
  let best: { entry: (typeof CACHED_CSVS)[number]; hits: number } | null = null;
  for (const cached of CACHED_CSVS) {
    const hits = cached.signature.filter((sig) =>
      lower.some((col) => col.includes(sig)),
    ).length;
    if (hits >= 2 && (!best || hits > best.hits)) {
      best = { entry: cached, hits };
    }
  }
  return best?.entry ?? null;
}

// Fallback generic analysis cuando ningún cache matchea
export function genericAnalysis(
  rows: Record<string, string | number | null>[],
  columnNames: string[],
): Omit<CsvAnalysis, "rows" | "cached"> {
  const lower = columnNames.map((c) => c.toLowerCase());
  const findCol = (keys: string[]) =>
    columnNames[lower.findIndex((c) => keys.some((k) => c.includes(k)))];

  return {
    schema: {
      time: findCol(["time", "hora", "t_h", "elapsed"]) ?? columnNames[0],
      biomass: findCol(["biomass", "od", "cell"]),
      ph: findCol(["ph"]),
      do: findCol(["do", "oxygen"]),
      temp: findCol(["temp", "temperature"]),
      glucose: findCol(["glucose", "glucosa", "sugar"]),
      titer: findCol(["titer", "product", "yield"]),
    },
    insights: [
      {
        type: "info",
        msg: `Dataset recibido: ${rows.length} filas, ${columnNames.length} columnas`,
        detail: "Análisis personalizado requiere API conectada. Activá VITE_API_URL para recibir recomendaciones específicas del organismo.",
        severity: 2,
      },
      {
        type: "warning",
        msg: "Perfil de tu organismo no está en cache local",
        detail: "Demo mode responde con 3 presets: E. coli B12, K. phaffii mycoprotein, B. subtilis riboflavina. Usá uno de esos CSVs para experiencia completa.",
        severity: 2,
      },
    ],
    summary: {
      duration_h: rows.length,
      confidence: 0.35,
    },
  };
}
