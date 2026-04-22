import { useEffect, useState } from "react";
import { fetchPainPoints, type PainPoint } from "../lib/api";

export default function PainPointsWidget() {
  const [data, setData] = useState<PainPoint[] | null>(null);
  const [mock, setMock] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    void fetchPainPoints().then((r) => {
      if (!alive) return;
      setData(r.top);
      setMock(r.mock);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const maxCount = data ? Math.max(...data.map((d) => d.count), 1) : 1;

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{
        background: "rgba(10,46,46,0.85)",
        border: "1px solid rgba(0,229,204,0.15)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            🔥 Top 5 Pain Points · últimos 7 días
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Agregado de quejas scrapeadas de Reddit + waitlist responses — el ranking ajusta el roadmap semanal
          </p>
        </div>
        {mock && (
          <span
            className="px-2 py-0.5 rounded text-[10px] font-mono"
            style={{
              background: "rgba(255,200,87,0.12)",
              color: "#ffc857",
              border: "1px solid rgba(255,200,87,0.25)",
            }}
          >
            mock mode
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          Cargando…
        </p>
      ) : data && data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((p, i) => {
            const pct = Math.round((p.count / maxCount) * 100);
            const severityColor =
              p.severity_avg >= 4.5 ? "#EF4444" : p.severity_avg >= 3.5 ? "#ffc857" : "#00E5CC";
            return (
              <li
                key={p.category + i}
                className="rounded-lg px-3 py-2"
                style={{
                  background: "rgba(0,229,204,0.04)",
                  border: "1px solid rgba(0,229,204,0.08)",
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-white truncate">
                    {i + 1}. {p.category}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] flex-shrink-0">
                    <span
                      className="font-mono"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {p.count}
                    </span>
                    <span
                      className="font-mono px-1.5 rounded"
                      style={{
                        background: `${severityColor}22`,
                        color: severityColor,
                      }}
                      title="severidad promedio 1–5"
                    >
                      sev {p.severity_avg.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full transition-[width] duration-500"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, #00E5CC, #00B3A0)",
                    }}
                  />
                </div>
                {p.example_quote && (
                  <p
                    className="text-[11px] italic mt-1 truncate"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    title={p.example_quote}
                  >
                    "{p.example_quote}"
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          No hay data aún — el worker de ingesta corre mañana a las 8am.
        </p>
      )}
    </div>
  );
}
