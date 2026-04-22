import { motion, AnimatePresence } from "framer-motion";
import type { CsvAnalysis, Insight } from "../lib/csv-cache";
import type { PasteStatus } from "../hooks/usePasteCSV";

interface Props {
  status: PasteStatus;
  analysis: CsvAnalysis | null;
  cached: boolean;
  rowsCount: number;
  onReset: () => void;
}

const INSIGHT_ICON: Record<Insight["type"], string> = {
  success: "✅",
  info: "ℹ️",
  warning: "⚠️",
  alert: "🚨",
};

const INSIGHT_COLOR: Record<Insight["type"], string> = {
  success: "var(--bs-ok)",
  info: "var(--bs-info)",
  warning: "var(--bs-warn)",
  alert: "var(--bs-alert)",
};

export default function PasteCSVBanner({
  status,
  analysis,
  cached,
  rowsCount,
  onReset,
}: Props) {
  const show = status !== "idle";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className="px-4 lg:px-8 mb-4"
        >
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--bs-bg-2)",
              border: `1px solid ${cached ? "var(--bs-accent)" : "var(--bs-border-default)"}`,
              boxShadow: cached ? "var(--bs-shadow-glow)" : "var(--bs-shadow-md)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--bs-border-subtle)" }}
            >
              <div className="flex items-center gap-3">
                {status === "parsing" || status === "inferring" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 rounded-full"
                    style={{
                      border: "2px solid transparent",
                      borderTopColor: "var(--bs-accent)",
                      borderRightColor: "var(--bs-accent)",
                    }}
                  />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "var(--bs-accent)",
                      boxShadow: "0 0 6px var(--bs-accent)",
                    }}
                  />
                )}
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--bs-text-primary)" }}>
                    {status === "parsing" && "Parseando CSV…"}
                    {status === "inferring" && "Inferiendo schema + insights via IA…"}
                    {status === "done" && (cached ? "CSV analizado — respuesta pre-validada ✨" : "CSV analizado")}
                    {status === "error" && "Error parseando CSV"}
                  </p>
                  {analysis?.summary && (
                    <p className="text-xs mt-0.5 bs-tabular" style={{ color: "var(--bs-text-muted)" }}>
                      {analysis.summary.organism && <>{analysis.summary.organism} · </>}
                      {analysis.summary.product && <>{analysis.summary.product} · </>}
                      <>{rowsCount} filas</>
                      {analysis.summary.duration_h && <> · {analysis.summary.duration_h}h</>}
                      {analysis.summary.final_titer && <> · titer final {analysis.summary.final_titer} g/L</>}
                      {analysis.summary.confidence !== undefined && (
                        <>
                          {" · "}
                          <span style={{ color: analysis.summary.confidence > 0.7 ? "var(--bs-ok)" : "var(--bs-warn)" }}>
                            confianza {(analysis.summary.confidence * 100).toFixed(0)}%
                          </span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cached && (
                  <span
                    className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(0, 229, 204, 0.15)",
                      color: "var(--bs-accent)",
                    }}
                  >
                    Pre-validada
                  </span>
                )}
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors"
                  style={{ color: "var(--bs-text-muted)" }}
                >
                  ✕ cerrar
                </button>
              </div>
            </div>

            {/* Insights */}
            {analysis && analysis.insights.length > 0 && (
              <div className="p-3 space-y-2">
                {analysis.insights.map((ins, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.25 }}
                    className="rounded-lg px-3 py-2"
                    style={{
                      background: "rgba(0, 0, 0, 0.25)",
                      border: `1px solid ${INSIGHT_COLOR[ins.type]}33`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm" style={{ marginTop: "1px" }}>
                        {INSIGHT_ICON[ins.type]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium"
                          style={{ color: INSIGHT_COLOR[ins.type] }}
                        >
                          {ins.msg}
                        </p>
                        {ins.detail && (
                          <p
                            className="text-xs mt-1 leading-relaxed"
                            style={{ color: "var(--bs-text-secondary)" }}
                          >
                            {ins.detail}
                          </p>
                        )}
                        {ins.evidence_url && (
                          <a
                            href={ins.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs mt-1 inline-block underline underline-offset-2"
                            style={{ color: "var(--bs-accent)" }}
                          >
                            Ver evidencia →
                          </a>
                        )}
                      </div>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: `${INSIGHT_COLOR[ins.type]}18`,
                          color: INSIGHT_COLOR[ins.type],
                        }}
                      >
                        sev {ins.severity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
