import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  findCachedCsv,
  genericAnalysis,
  looksLikeCSV,
  type CsvAnalysis,
} from "../lib/csv-cache";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export type PasteStatus = "idle" | "parsing" | "inferring" | "done" | "error";

export interface UsePasteCSVResult {
  status: PasteStatus;
  analysis: CsvAnalysis | null;
  error: string | null;
  rowsCount: number;
  cached: boolean;
  reset: () => void;
}

/**
 * Hook global: escucha `paste` events, detecta CSVs, los parsea + analiza.
 * Flow:
 *   1. User hace ⌘V en cualquier parte del dashboard.
 *   2. Parseamos client-side con Papa.parse (10ms).
 *   3. Intentamos cache local (instantáneo).
 *   4. Si no hay cache + hay API → llamamos /api/infer-schema + /api/insights.
 *   5. Si nada funciona → generic analysis.
 */
export function usePasteCSV(): UsePasteCSVResult {
  const [status, setStatus] = useState<PasteStatus>("idle");
  const [analysis, setAnalysis] = useState<CsvAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rowsCount, setRowsCount] = useState(0);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      // No interceptar pastes en inputs editables
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (target?.isContentEditable) return;

      const text = e.clipboardData?.getData("text/plain");
      if (!text || !looksLikeCSV(text)) return;

      e.preventDefault();
      setStatus("parsing");
      setError(null);
      setCached(false);

      // 1. Parse
      const parsed = Papa.parse<Record<string, string | number>>(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0 && parsed.data.length === 0) {
        setStatus("error");
        setError(`CSV parse failed: ${parsed.errors[0]?.message ?? "unknown"}`);
        return;
      }

      const rows = parsed.data as Record<string, string | number | null>[];
      const columnNames = parsed.meta.fields ?? Object.keys(rows[0] ?? {});
      setRowsCount(rows.length);

      // 2. Cache hit (instantáneo)
      const hit = findCachedCsv(columnNames);
      if (hit) {
        setStatus("done");
        setCached(true);
        setAnalysis({
          rows,
          schema: hit.analysis.schema,
          insights: hit.analysis.insights,
          summary: hit.analysis.summary,
          cached: true,
        });
        return;
      }

      // 3. Remote API (si hay URL)
      if (API_URL && API_URL.trim() !== "") {
        setStatus("inferring");
        try {
          const res = await fetch(`${API_URL}/api/csv/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              columns: columnNames,
              sample: rows.slice(0, 10),
              row_count: rows.length,
            }),
          });
          if (!res.ok) throw new Error(`http ${res.status}`);
          const data = await res.json();
          setAnalysis({
            rows,
            schema: data.schema,
            insights: data.insights,
            summary: data.summary,
            cached: false,
          });
          setStatus("done");
          return;
        } catch {
          // fallthrough to generic
        }
      }

      // 4. Fallback generic
      const generic = genericAnalysis(rows, columnNames);
      setAnalysis({
        rows,
        schema: generic.schema,
        insights: generic.insights,
        summary: generic.summary,
        cached: false,
      });
      setStatus("done");
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const reset = () => {
    setStatus("idle");
    setAnalysis(null);
    setError(null);
    setRowsCount(0);
    setCached(false);
  };

  return { status, analysis, error, rowsCount, cached, reset };
}
