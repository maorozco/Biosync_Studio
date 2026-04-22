import { Router, type IRouter } from "express";
import { z } from "zod";
import { isDbConfigured } from "@workspace/db";
import { computeScore, type CallIntent, type Role, type Sector, type Solution, type Timeline } from "../lib/scoring.js";

const router: IRouter = Router();

// In-memory fallback for mock mode (non-persistent, resets on restart)
const mockWaitlist: Array<{ email: string; lang: "es" | "en"; createdAt: Date }> = [];
const mockResponses: Array<{ email: string; tier: string; score: number; createdAt: Date; category: string }> = [];
const COUNTER_BASELINE = Number(process.env.COUNTER_BASELINE ?? 25);

// ----------------------- POST /api/waitlist ---------------------------------

const signupSchema = z.object({
  email: z.string().email(),
  lang: z.enum(["es", "en"]).default("es"),
});

router.post("/waitlist", async (req, res) => {
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "invalid_body", issues: parse.error.issues });
    return;
  }
  const { email, lang } = parse.data;

  if (!isDbConfigured()) {
    if (!mockWaitlist.find((w) => w.email === email)) {
      mockWaitlist.push({ email, lang, createdAt: new Date() });
    }
    res.json({
      ok: true,
      count: Math.max(mockWaitlist.length, COUNTER_BASELINE),
      mock: true,
    });
    return;
  }

  try {
    const { getDb, waitlistTable } = await import("@workspace/db");
    const db = getDb();
    const { sql } = await import("drizzle-orm");
    await db
      .insert(waitlistTable)
      .values({ email, lang })
      .onConflictDoNothing({ target: waitlistTable.email });

    const result = await db.execute(
      sql`SELECT COUNT(*)::int AS count FROM waitlist`,
    );
    const row = result.rows[0] as { count?: number } | undefined;
    const count = Math.max(row?.count ?? 0, COUNTER_BASELINE);
    res.json({ ok: true, count, mock: false });
  } catch (err) {
    req.log?.error?.({ err }, "waitlist signup db failed");
    res.status(500).json({ error: "db_failed" });
  }
});

// ----------------------- GET /api/waitlist/count ----------------------------

router.get("/waitlist/count", async (_req, res) => {
  if (!isDbConfigured()) {
    res.json({
      count: Math.max(mockWaitlist.length, COUNTER_BASELINE),
      mock: true,
    });
    return;
  }
  try {
    const { getDb } = await import("@workspace/db");
    const { sql } = await import("drizzle-orm");
    const db = getDb();
    const result = await db.execute(
      sql`SELECT COUNT(*)::int AS count FROM waitlist`,
    );
    const row = result.rows[0] as { count?: number } | undefined;
    res.json({
      count: Math.max(row?.count ?? 0, COUNTER_BASELINE),
      mock: false,
    });
  } catch (err) {
    (_req as { log?: { error: (x: unknown) => void } }).log?.error?.({ err });
    res.json({ count: COUNTER_BASELINE, mock: true, error: "db_unreachable" });
  }
});

// ----------------------- POST /api/waitlist-responses -----------------------

const responseSchema = z.object({
  email: z.string().email(),
  lang: z.enum(["es", "en"]).default("es"),
  role: z.string(),
  country: z.string().min(2).max(8),
  sector: z.string(),
  painText: z.string().min(2).max(2000),
  solutions: z.array(z.string()).default([]),
  timeline: z.string(),
  callIntent: z.string(),
});

router.post("/waitlist-responses", async (req, res) => {
  const parse = responseSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "invalid_body", issues: parse.error.issues });
    return;
  }
  const body = parse.data;
  const scoring = computeScore({
    role: body.role as Role,
    country: body.country,
    sector: body.sector as Sector,
    painText: body.painText,
    solutions: body.solutions as Solution[],
    timeline: body.timeline as Timeline,
    callIntent: body.callIntent as CallIntent,
  });

  if (!isDbConfigured()) {
    mockResponses.push({
      email: body.email,
      tier: scoring.tier,
      score: scoring.score,
      createdAt: new Date(),
      category: "unclassified",
    });
    res.json({ ok: true, ...scoring, mock: true });
    return;
  }

  try {
    const { getDb, waitlistTable, waitlistResponsesTable } = await import(
      "@workspace/db"
    );
    const { eq } = await import("drizzle-orm");
    const db = getDb();

    const [wl] = await db
      .select({ id: waitlistTable.id })
      .from(waitlistTable)
      .where(eq(waitlistTable.email, body.email))
      .limit(1);

    if (!wl) {
      res.status(404).json({ error: "waitlist_row_not_found" });
      return;
    }

    await db.insert(waitlistResponsesTable).values({
      waitlistId: wl.id,
      role: body.role,
      country: body.country,
      sector: body.sector,
      painText: body.painText,
      solutions: body.solutions,
      timeline: body.timeline,
      callIntent: body.callIntent,
      score: scoring.score,
      tier: scoring.tier,
    });

    res.json({ ok: true, ...scoring, mock: false });
  } catch (err) {
    req.log?.error?.({ err }, "waitlist-responses db failed");
    res.status(500).json({ error: "db_failed" });
  }
});

export default router;
