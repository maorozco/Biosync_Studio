#!/usr/bin/env tsx
/**
 * scrape-reddit.ts — Manual Apify-based Reddit scraper.
 *
 * Corre standalone cuando querés poblar la tabla reddit_posts (o solamente
 * un JSON en disco, si DATABASE_URL no está configurado).
 *
 * Uso:
 *   APIFY_API_KEY=... pnpm --filter @workspace/scripts exec tsx src/scrape-reddit.ts
 *   APIFY_API_KEY=... DATABASE_URL=... pnpm --filter @workspace/scripts exec tsx src/scrape-reddit.ts --persist
 *
 * Parámetros opcionales:
 *   --subreddits=r/labrats,r/biotech   (default: lista curada abajo)
 *   --limit=100                        (posts por sub, default 50)
 *   --persist                          (insertar en DB; si no, solo dump a JSON)
 *   --out=./reddit-sample.json         (ruta del dump, default ./scripts/out/reddit-<timestamp>.json)
 *
 * Actor Apify usado: practicaltools/apify-reddit-api ($2/1K resultados).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// ---------- Config ---------------------------------------------------------

const DEFAULT_SUBREDDITS = [
  "labrats",
  "biotech",
  "bioengineering",
  "synbio",
  "fermentation",
  "precisionfermentation",
  "microbiology",
  "composting",
  "wastewater",
  "environmental_science",
];

const APIFY_ACTOR = "practicaltools~apify-reddit-api";
const APIFY_API = "https://api.apify.com/v2";

interface Args {
  subreddits: string[];
  limit: number;
  persist: boolean;
  out: string;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (k: string): string | undefined => {
    const found = argv.find((a) => a.startsWith(`--${k}=`));
    return found?.split("=", 2)[1];
  };
  const subs = get("subreddits")?.split(",").filter(Boolean) ?? DEFAULT_SUBREDDITS;
  return {
    subreddits: subs.map((s) => s.replace(/^r\//, "")),
    limit: Number(get("limit") ?? 50),
    persist: argv.includes("--persist"),
    out: get("out") ?? resolve(HERE, "..", "out", `reddit-${Date.now()}.json`),
  };
}

// ---------- Apify runner ----------------------------------------------------

interface ApifyRunMeta {
  id: string;
  defaultDatasetId: string;
  status: string;
}

async function runActor(apiKey: string, input: unknown): Promise<ApifyRunMeta> {
  const res = await fetch(`${APIFY_API}/acts/${APIFY_ACTOR}/runs?token=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Apify run failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { data: ApifyRunMeta };
  return data.data;
}

async function pollRun(apiKey: string, runId: string): Promise<ApifyRunMeta> {
  const maxPolls = 60; // ~5 min con 5s de sleep
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await fetch(`${APIFY_API}/actor-runs/${runId}?token=${apiKey}`);
    if (!res.ok) throw new Error(`poll failed: ${res.status}`);
    const data = (await res.json()) as { data: ApifyRunMeta };
    if (["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"].includes(data.data.status)) {
      return data.data;
    }
    process.stdout.write(`. (${data.data.status})\n`);
  }
  throw new Error("poll timeout");
}

interface RedditItem {
  id?: string;
  title?: string;
  selftext?: string;
  url?: string;
  author?: string;
  subreddit?: string;
  score?: number;
  num_comments?: number;
  created_utc?: number;
  searchQuery?: string;
  scrape?: string;
}

async function fetchDataset(apiKey: string, datasetId: string): Promise<RedditItem[]> {
  const res = await fetch(
    `${APIFY_API}/datasets/${datasetId}/items?token=${apiKey}&format=json&clean=1`,
  );
  if (!res.ok) throw new Error(`dataset failed: ${res.status}`);
  return (await res.json()) as RedditItem[];
}

// ---------- Main ------------------------------------------------------------

async function main() {
  const apiKey = process.env.APIFY_API_KEY;
  if (!apiKey) {
    console.error(
      "APIFY_API_KEY not set. Run: APIFY_API_KEY=<your-key> pnpm exec tsx src/scrape-reddit.ts",
    );
    process.exit(1);
  }

  const args = parseArgs();
  console.log(
    `→ Scraping ${args.subreddits.length} subs × ${args.limit} posts each (≈${args.subreddits.length * args.limit} total)`,
  );

  // Apify input shape per actor docs (adjust if actor changes):
  const input = {
    startUrls: args.subreddits.map((s) => ({
      url: `https://www.reddit.com/r/${s}/top.json?t=month&limit=${args.limit}`,
    })),
    maxItems: args.subreddits.length * args.limit,
    proxy: { useApifyProxy: true },
  };

  const run = await runActor(apiKey, input);
  console.log(`Run started: ${run.id} (dataset ${run.defaultDatasetId})`);
  const final = await pollRun(apiKey, run.id);
  if (final.status !== "SUCCEEDED") {
    throw new Error(`run ${final.status}`);
  }

  const items = await fetchDataset(apiKey, run.defaultDatasetId);
  console.log(`→ fetched ${items.length} items`);

  // Normalize into our DB shape
  const normalized = items.map((it) => ({
    source_id: it.id ?? "",
    subreddit: (it.subreddit ?? "").replace(/^r\//, ""),
    title: it.title ?? "",
    body_text: it.selftext ?? "",
    url: it.url ?? "",
    author: it.author ?? "",
    score: it.score ?? 0,
    num_comments: it.num_comments ?? 0,
    created_utc: it.created_utc ?? 0,
    scraped_at: new Date().toISOString(),
    query_used: it.searchQuery ?? `r/${it.subreddit}/top`,
    audience: inferAudience(it.subreddit ?? ""),
    classification: null,
    severity_score: null,
    is_biosync_fit: null,
    processed: 0,
  }));

  // Dump to JSON always (safety net)
  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, JSON.stringify(normalized, null, 2));
  console.log(`→ wrote ${args.out}`);

  if (args.persist) {
    if (!process.env.DATABASE_URL) {
      console.warn("⚠ DATABASE_URL not set — skipping DB insert. Use the JSON dump manually.");
      return;
    }
    await persistToDb(normalized);
  }
}

function inferAudience(subreddit: string): "biomfg" | "waste-general" {
  const biomfg = [
    "labrats", "biotech", "bioengineering", "synbio", "fermentation",
    "precisionfermentation", "microbiology", "biochemistry", "cellbiology",
  ];
  return biomfg.includes(subreddit.toLowerCase()) ? "biomfg" : "waste-general";
}

async function persistToDb(rows: Array<Record<string, unknown>>) {
  const { getDb, redditPostsTable } = await import("@workspace/db");
  const db = getDb();
  let inserted = 0;
  for (const row of rows) {
    try {
      await db
        .insert(redditPostsTable)
        .values(row as never)
        .onConflictDoNothing({ target: redditPostsTable.sourceId });
      inserted++;
    } catch (err) {
      console.warn(`skip row ${row.source_id}: ${String(err)}`);
    }
  }
  console.log(`→ inserted ${inserted}/${rows.length} rows`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
