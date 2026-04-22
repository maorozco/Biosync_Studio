import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface EventMarker {
  t: number; // hours
  type: "alert" | "setpoint";
  label: string;
}

interface ReplayDatum {
  t: number; // hours elapsed
  ph: number;
  od: number;
  do: number;
  temp: number;
  titer: number;
}

// Genera fixture determinística de una corrida de 48h de E. coli para B12
function generateReplayFixture(): { data: ReplayDatum[]; events: EventMarker[] } {
  const N = 500;
  const duration = 48;
  const rand = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const data: ReplayDatum[] = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * duration;
    const od = Math.min(14, 0.1 * Math.exp((0.35 * t) / (1 + Math.exp(-0.1 * (t - 18)))));
    const phBase = 7.2;
    // pH drift en h≈32-36: acumulación acetato
    const phDrift = t > 30 && t < 38 ? -0.35 * Math.sin((t - 30) / 2) : 0;
    const ph = phBase + phDrift + (rand(i) - 0.5) * 0.04;
    // DO crash en h≈34
    const doPct = Math.max(5, 55 - (t > 32 && t < 36 ? 30 : 0) - t * 0.4 + (rand(i + 100) - 0.5) * 3);
    const temp = 37 + (rand(i + 200) - 0.5) * 0.2;
    const titer = Math.min(8.5, 0.15 * (od - 0.1) + (rand(i + 300) - 0.5) * 0.1);
    return {
      t: parseFloat(t.toFixed(2)),
      ph: parseFloat(ph.toFixed(2)),
      od: parseFloat(od.toFixed(2)),
      do: parseFloat(doPct.toFixed(1)),
      temp: parseFloat(temp.toFixed(2)),
      titer: parseFloat(Math.max(0, titer).toFixed(2)),
    };
  });

  const events: EventMarker[] = [
    { t: 4, type: "setpoint", label: "Feed start" },
    { t: 18, type: "setpoint", label: "pH ajustado a 7.2" },
    { t: 28, type: "setpoint", label: "RPM 450→500" },
    { t: 31.5, type: "alert", label: "pH drift detectado" },
    { t: 34, type: "alert", label: "DO crash" },
    { t: 35, type: "setpoint", label: "Feed −30% + antifoam" },
    { t: 42, type: "setpoint", label: "Inducción IPTG" },
  ];

  return { data, events };
}

interface Props {
  open: boolean;
  onClose: () => void;
}

type PlaySpeed = 1 | 5 | 10;

export default function CycleReplay({ open, onClose }: Props) {
  const { data, events } = useMemo(() => generateReplayFixture(), []);
  const maxT = data[data.length - 1]?.t ?? 48;

  const [tCurrent, setTCurrent] = useState(maxT);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaySpeed>(5);
  const rafRef = useRef<number | null>(null);

  // Play loop — avanza tCurrent según speed
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000; // seconds
      last = now;
      setTCurrent((prev) => {
        const next = prev + dt * speed * 1.5; // 1.5h por segundo real a 1×
        if (next >= maxT) {
          setPlaying(false);
          return maxT;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, speed, maxT]);

  const visibleData = useMemo(() => data.filter((d) => d.t <= tCurrent), [data, tCurrent]);

  const currentEvents = useMemo(() => events.filter((e) => e.t <= tCurrent), [events, tCurrent]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        background: "rgba(4, 20, 30, 0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] rounded-xl overflow-hidden flex flex-col"
        style={{
          background: "var(--bs-bg-2)",
          border: "1px solid var(--bs-border-strong)",
          boxShadow: "var(--bs-shadow-elevated)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--bs-border-subtle)" }}
        >
          <div>
            <h2 className="text-lg font-bold bs-h-tight" style={{ color: "var(--bs-text-primary)" }}>
              🎬 Cycle Replay — Batch #42 · E. coli K-12 · B12
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--bs-text-muted)" }}>
              48h de datos reconstruidos · reproducí a 1× / 5× / 10× para revisar cualquier evento
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
            style={{ color: "var(--bs-text-muted)" }}
          >
            ✕
          </button>
        </div>

        {/* Chart + events */}
        <div className="flex-1 p-5 overflow-y-auto">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={visibleData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="t"
                type="number"
                domain={[0, maxT]}
                tickFormatter={(v) => `${Math.round(v)}h`}
                tick={{ fontSize: 10, fill: "#aaa" }}
                tickCount={10}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#aaa" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#aaa" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bs-bg-3)",
                  border: "1px solid var(--bs-border-strong)",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                labelFormatter={(l) => `Hora ${Number(l).toFixed(1)}h`}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#ccc" }} />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="do"
                name="DO (%)"
                stroke="#3B82F6"
                fill="rgba(59,130,246,0.15)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
              <Line yAxisId="left" type="monotone" dataKey="od" name="OD600" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="left" type="monotone" dataKey="ph" name="pH" stroke="#F5A623" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="left" type="monotone" dataKey="titer" name="Titer B12 (g/L)" stroke="#A78BFA" strokeWidth={2} dot={false} isAnimationActive={false} />
              {/* Event markers */}
              {currentEvents.map((ev, i) => (
                <ReferenceLine
                  key={i}
                  x={ev.t}
                  yAxisId="left"
                  stroke={ev.type === "alert" ? "var(--bs-alert)" : "var(--bs-accent)"}
                  strokeDasharray="3 2"
                  strokeOpacity={0.6}
                  label={{
                    value: ev.type === "alert" ? "⚠" : "●",
                    position: "top",
                    fontSize: 12,
                    fill: ev.type === "alert" ? "var(--bs-alert)" : "var(--bs-accent)",
                  }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>

          {/* Event timeline */}
          <div className="mt-4 space-y-1.5">
            <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--bs-text-muted)" }}>
              Eventos ({currentEvents.length} de {events.length})
            </p>
            {currentEvents.map((ev, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-xs rounded px-2 py-1"
                style={{
                  background: ev.type === "alert" ? "rgba(239, 68, 68, 0.08)" : "rgba(0, 229, 204, 0.06)",
                  color: "var(--bs-text-secondary)",
                }}
              >
                <span
                  className="bs-mono text-[10px] w-12 flex-shrink-0"
                  style={{ color: ev.type === "alert" ? "var(--bs-alert)" : "var(--bs-accent)" }}
                >
                  h {ev.t.toFixed(1)}
                </span>
                <span style={{ color: ev.type === "alert" ? "var(--bs-alert)" : "var(--bs-accent)" }}>
                  {ev.type === "alert" ? "⚠" : "●"}
                </span>
                <span className="flex-1">{ev.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrubber + controls */}
        <div
          className="px-5 py-4 border-t"
          style={{
            borderColor: "var(--bs-border-subtle)",
            background: "var(--bs-bg-3)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => {
                if (tCurrent >= maxT) setTCurrent(0);
                setPlaying((v) => !v);
              }}
              className="w-10 h-10 rounded-lg font-bold transition-all hover:scale-105"
              style={{
                background: "var(--bs-accent)",
                color: "var(--bs-bg-1)",
                boxShadow: playing ? "0 0 16px rgba(0, 229, 204, 0.4)" : "none",
              }}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <div className="flex gap-1">
              {([1, 5, 10] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className="px-2 py-1 rounded text-xs bs-mono font-semibold transition-colors"
                  style={{
                    background: speed === s ? "var(--bs-accent)" : "rgba(0, 229, 204, 0.08)",
                    color: speed === s ? "var(--bs-bg-1)" : "var(--bs-text-secondary)",
                    border: "1px solid var(--bs-border-default)",
                  }}
                >
                  {s}×
                </button>
              ))}
            </div>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={maxT}
                step={0.1}
                value={tCurrent}
                onChange={(e) => {
                  setTCurrent(Number(e.target.value));
                  setPlaying(false);
                }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--bs-accent)]"
                style={{
                  background: `linear-gradient(to right, var(--bs-accent) 0%, var(--bs-accent) ${(tCurrent / maxT) * 100}%, var(--bs-bg-2) ${(tCurrent / maxT) * 100}%, var(--bs-bg-2) 100%)`,
                }}
              />
            </div>
            <span className="bs-mono text-xs font-semibold flex-shrink-0" style={{ color: "var(--bs-accent)" }}>
              {tCurrent.toFixed(1)}h / {maxT}h
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--bs-text-muted)" }}>
            Arrastrá el slider o presioná ▶ para reproducir. Los marcadores ⚠ (alertas) y ● (setpoint changes) aparecen conforme avanzás en la timeline.
          </p>
        </div>
      </div>
    </div>
  );
}
