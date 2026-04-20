// Loads the offline pain corpus (research quotes + curated Q&A answers).
// Used by the RAG pipeline as the retrieval source when there's no Postgres/
// pgvector backend yet.

import corpusData from "../data/pain-corpus.json";
import cacheData from "../data/rag-cache.json";

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
}

export interface CorpusEntry {
  id: string;
  type: "answer" | "quote";
  text: string;
  tags: string[];
  source_url: string;
  source_name: string;
  audience: "biomfg" | "waste-general";
  /** Tool-use style — setpoints + actions recomendadas. Se emiten como SSE event "recommendations" */
  recommendations?: Recommendation;
  /** populated lazily by embedder; never serialized */
  embedding?: number[];
}

export interface CacheEntry {
  query: string;
  corpus_id: string;
  alias_queries: string[];
}

export const CORPUS: CorpusEntry[] = corpusData as CorpusEntry[];
export const CACHE_ENTRIES: CacheEntry[] = (cacheData as { entries: CacheEntry[] }).entries;

export function getCorpusById(id: string): CorpusEntry | undefined {
  return CORPUS.find((e) => e.id === id);
}

/**
 * Normalizes a query for cache lookup: lowercase, strip punctuation/accents,
 * collapse whitespace.
 */
export function normalizeQuery(q: string): string {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cache lookup — returns corpus entry ID if query matches any cached query
 * or alias, else null. Uses token-overlap Jaccard ≥ 0.55 threshold.
 */
export function findCachedCorpusId(query: string): string | null {
  const qNorm = normalizeQuery(query);
  const qTokens = new Set(qNorm.split(" ").filter((t) => t.length > 2));
  if (qTokens.size === 0) return null;

  let best: { id: string; score: number } | null = null;
  for (const entry of CACHE_ENTRIES) {
    const candidates = [entry.query, ...entry.alias_queries].map(normalizeQuery);
    for (const cand of candidates) {
      const candTokens = new Set(cand.split(" ").filter((t) => t.length > 2));
      const intersection = [...qTokens].filter((t) => candTokens.has(t)).length;
      const union = new Set([...qTokens, ...candTokens]).size;
      if (union === 0) continue;
      const jaccard = intersection / union;
      if (jaccard >= 0.55 && (!best || jaccard > best.score)) {
        best = { id: entry.corpus_id, score: jaccard };
      }
    }
  }
  return best?.id ?? null;
}
