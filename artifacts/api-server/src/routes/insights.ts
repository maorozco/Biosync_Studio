import { Router, type IRouter } from "express";
import { isDbConfigured } from "@workspace/db";

const router: IRouter = Router();

// Mock seed for the "top 5 pain points" widget. Derived from research docs
// so the Dashboard has something credible when there's no DB yet.
const MOCK_PAIN_POINTS: Array<{
  category: string;
  count: number;
  severity_avg: number;
  example_quote: string;
}> = [
  {
    category: "Scale-up lab → pilot",
    count: 18,
    severity_avg: 4.4,
    example_quote: "Iterations lab→pilot→full scale: very tough, error prone (Geertz-Hansen, 21st.BIO)",
  },
  {
    category: "Contamination / DO crash",
    count: 14,
    severity_avg: 4.7,
    example_quote: "Contamination events: lost batches, investigations, compliance issues (Blackwell, Windshire)",
  },
  {
    category: "Cost of incumbents (Benchling, SIMCA)",
    count: 12,
    severity_avg: 3.8,
    example_quote: "Benchling will cost your startup $246,000 over 2 years (Studebaker, LinkedIn)",
  },
  {
    category: "OFAT / slow optimization",
    count: 11,
    severity_avg: 3.9,
    example_quote: "10 factors sequentially = several months of 5L-reactor time (Peppers, BioProcess Intl)",
  },
  {
    category: "Tribal knowledge / data silos",
    count: 9,
    severity_avg: 4.2,
    example_quote: "Instruments excrete face-palm inducing data formats (Feala, Medium)",
  },
];

/**
 * GET /api/insights/pain-points?window=7d
 * Returns top pain categories aggregated from reddit_posts + waitlist_responses.
 */
router.get("/insights/pain-points", async (req, res) => {
  const window = (req.query.window as string) ?? "7d";

  if (!isDbConfigured()) {
    res.json({ mock: true, window, top: MOCK_PAIN_POINTS });
    return;
  }

  try {
    const { getDb } = await import("@workspace/db");
    const { sql } = await import("drizzle-orm");
    const db = getDb();

    const interval =
      window === "30d" ? "30 days" : window === "24h" ? "1 day" : "7 days";

    const result = await db.execute(
      sql`
        SELECT classification,
               COUNT(*)::int AS count,
               COALESCE(AVG(severity_score)::float, 0) AS severity_avg
        FROM reddit_posts
        WHERE classification IS NOT NULL
          AND scraped_at > NOW() - (${interval}::interval)
        GROUP BY classification
        ORDER BY count DESC
        LIMIT 5;
      `,
    );

    const rows = result.rows as Array<{
      classification: string;
      count: number;
      severity_avg: number;
    }>;

    const top = rows.length
      ? rows.map((r) => ({
          category: r.classification,
          count: r.count,
          severity_avg: Number(r.severity_avg.toFixed(2)),
          example_quote: "",
        }))
      : MOCK_PAIN_POINTS;

    res.json({ mock: false, window, top });
  } catch (err) {
    req.log?.error?.({ err }, "insights/pain-points failed");
    res.json({ mock: true, window, top: MOCK_PAIN_POINTS, error: "db_unreachable" });
  }
});

export default router;
