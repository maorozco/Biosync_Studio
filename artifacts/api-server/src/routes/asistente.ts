import { Router, type IRouter } from "express";
import { z } from "zod";
import { retrieveForQuery, streamAnswer } from "../lib/rag.js";
import { isLlmConfigured } from "../lib/openai.js";

const router: IRouter = Router();

const askSchema = z.object({
  q: z.string().min(2).max(600),
  lang: z.enum(["es", "en"]).optional(),
});

/**
 * POST /api/asistente/ask
 * Body: { q: string, lang?: "es" | "en" }
 * Returns: SSE stream (events: token, citations, done)
 */
router.post("/asistente/ask", async (req, res) => {
  const parse = askSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "invalid_body", issues: parse.error.issues });
    return;
  }
  const { q, lang } = parse.data;

  try {
    const retrieval = await retrieveForQuery(q, 5);
    await streamAnswer(q, retrieval, res, { lang });
  } catch (err) {
    req.log?.error?.({ err }, "asistente/ask failed");
    if (!res.headersSent) {
      res.status(500).json({
        error: "rag_failed",
        message: err instanceof Error ? err.message : "unknown",
      });
    } else {
      res.end();
    }
  }
});

/**
 * GET /api/asistente/status
 * Returns: { mock: boolean, llm: "openai" | "azure" | "none", corpus_size: number }
 */
router.get("/asistente/status", (_req, res) => {
  const llm = process.env.AZURE_OPENAI_API_KEY
    ? "azure"
    : process.env.OPENAI_API_KEY
      ? "openai"
      : "none";
  res.json({
    mock: !isLlmConfigured(),
    llm,
    corpus_size: 22, // keep in sync with data/pain-corpus.json entries count
  });
});

export default router;
