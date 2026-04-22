import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export type Severity = "ok" | "warn" | "alert" | "neutral";

const SEV_COLOR: Record<Severity, string> = {
  ok: "#10B981",
  warn: "#F5A623",
  alert: "#EF4444",
  neutral: "#A4C8C4",
};

interface KpiCardProps {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  /** Series de últimos N puntos para sparkline (8-60 típico). */
  sparkline?: number[];
  delta?: number;
  deltaLabel?: string;
  severity?: Severity;
  /** segundos desde última muestra; si undefined no renderiza pulse */
  updatedSecondsAgo?: number;
}

/**
 * KPI card premium — ticker animado + sparkline inline + pulse freshness dot.
 * Target: Linear / Vercel polish. Tabular nums para no bailar al actualizar.
 */
export default function KpiCard({
  label,
  value,
  unit,
  decimals = 2,
  sparkline,
  delta,
  deltaLabel,
  severity = "neutral",
  updatedSecondsAgo,
}: KpiCardProps) {
  const color = SEV_COLOR[severity];
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 });
  const rendered = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  const sparkData = useMemo(() => {
    if (!sparkline) return [];
    return sparkline.map((y, i) => ({ x: i, y }));
  }, [sparkline]);

  const deltaDisplay = useMemo(() => {
    if (delta === undefined) return null;
    const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "●";
    return `${arrow} ${delta > 0 ? "+" : ""}${delta.toFixed(decimals)}${unit ?? ""}${deltaLabel ? ` · ${deltaLabel}` : ""}`;
  }, [delta, decimals, unit, deltaLabel]);

  const deltaColor = useMemo(() => {
    if (delta === undefined) return "var(--bs-text-muted)";
    if (severity === "alert" || severity === "warn") return color;
    if (delta > 0) return "var(--bs-ok)";
    if (delta < 0) return "var(--bs-warn)";
    return "var(--bs-text-muted)";
  }, [delta, severity, color]);

  const freshLabel = useMemo(() => {
    if (updatedSecondsAgo === undefined) return null;
    if (updatedSecondsAgo < 60) return `hace ${Math.max(1, Math.round(updatedSecondsAgo))}s`;
    if (updatedSecondsAgo < 3600) return `hace ${Math.round(updatedSecondsAgo / 60)}min`;
    return `hace ${Math.round(updatedSecondsAgo / 3600)}h`;
  }, [updatedSecondsAgo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.2, 0, 0, 1] }}
      className="relative p-4 rounded-xl overflow-hidden"
      style={{
        background: "var(--bs-bg-2)",
        border: `1px solid ${severity === "alert" ? "rgba(239,68,68,0.4)" : "var(--bs-border-default)"}`,
        boxShadow: severity === "alert" ? "0 0 24px rgba(239,68,68,0.2)" : "var(--bs-shadow-sm)",
      }}
    >
      {/* Header: label + freshness pulse */}
      <div className="flex items-center justify-between mb-1">
        <p
          className="text-[11px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--bs-text-muted)" }}
        >
          {label}
        </p>
        {freshLabel && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 6px ${color}`,
                animation: "pulse-dot 1.2s ease-in-out infinite",
              }}
            />
            <span
              className="bs-mono text-[10px]"
              style={{ color: "var(--bs-text-muted)" }}
            >
              {freshLabel}
            </span>
          </div>
        )}
      </div>

      {/* Value row: animated ticker + unit */}
      <div className="flex items-baseline gap-2">
        <motion.span
          className="bs-kpi-value text-3xl font-bold"
          style={{ color: "var(--bs-text-primary)" }}
        >
          {rendered}
        </motion.span>
        {unit && (
          <span
            className="text-sm font-medium"
            style={{ color: "var(--bs-text-secondary)" }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Delta + sparkline row */}
      <div className="flex items-end justify-between mt-2 gap-3">
        {deltaDisplay && (
          <p
            className="text-[11px] font-medium bs-tabular flex-shrink min-w-0 truncate"
            style={{ color: deltaColor }}
            title={deltaDisplay}
          >
            {deltaDisplay}
          </p>
        )}
        {sparkData.length > 1 && (
          <div className="w-20 h-6 flex-shrink-0 opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={color}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
