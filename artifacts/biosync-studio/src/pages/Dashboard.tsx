import { useState, useCallback, useMemo, useEffect } from "react";
import PainPointsWidget from "../components/PainPointsWidget";
import KpiCard from "../components/KpiCard";
import PasteCSVBanner from "../components/PasteCSVBanner";
import { usePasteCSV } from "../hooks/usePasteCSV";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

function generateData() {
  const n = 200;
  const hours: number[] = [];
  const ph: number[] = [];
  const doVal: number[] = [];
  const temp: number[] = [];
  const glucose: number[] = [];
  const od600: number[] = [];

  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * 72;
    hours.push(parseFloat(t.toFixed(2)));
    ph.push(parseFloat((7.2 - 0.004 * t + (Math.random() - 0.5) * 0.06).toFixed(3)));
    doVal.push(
      parseFloat(
        Math.max(
          20,
          Math.min(60, 50 - 20 * Math.exp(-0.001 * Math.pow(t - 36, 2) / 100) + (Math.random() - 0.5) * 2)
        ).toFixed(2)
      )
    );
    temp.push(parseFloat((37 + 0.3 * Math.sin(t / 6) + (Math.random() - 0.5) * 0.2).toFixed(2)));
    glucose.push(
      parseFloat(Math.max(0, 20 / (1 + Math.exp(0.08 * (t - 35))) + (Math.random() - 0.5) * 0.6).toFixed(2))
    );
    od600.push(
      parseFloat(
        Math.max(0, Math.min(13, 12 / (1 + Math.exp(-0.15 * (t - 20))) + (Math.random() - 0.5) * 0.4)).toFixed(2)
      )
    );
  }

  return hours.map((h, i) => ({
    hora: h,
    ph: ph[i],
    do: doVal[i],
    temp: temp[i],
    glucose: glucose[i],
    od600: od600[i],
  }));
}

const data = generateData();

interface ChartCardProps {
  title: string;
  dataKey: string;
  color: string;
  unit: string;
  yDomain: [number, number];
  refLineValue?: number;
  refLineLabel?: string;
  refAreaLow?: number;
  refAreaHigh?: number;
}

function ChartCard({
  title,
  dataKey,
  color,
  unit,
  yDomain,
  refLineValue,
  refLineLabel,
  refAreaLow,
  refAreaHigh,
}: ChartCardProps) {
  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm" style={{ color: "#0A2E2E" }}>
          {title}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E8F5F3", color: "#0A2E2E" }}>
          {unit}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="hora"
            tickFormatter={(v) => `${v}h`}
            tick={{ fontSize: 10, fill: "#666" }}
            tickCount={7}
          />
          <YAxis domain={yDomain} tick={{ fontSize: 10, fill: "#666" }} />
          <Tooltip
            formatter={(v: number) => [`${v} ${unit}`, title]}
            labelFormatter={(l) => `Hora ${l}h`}
            contentStyle={{ fontSize: 11, border: "1px solid #e5e7eb", borderRadius: 6 }}
          />
          {refAreaLow !== undefined && refAreaHigh !== undefined && (
            <ReferenceArea
              y1={refAreaLow}
              y2={refAreaHigh}
              fill="#00E5CC"
              fillOpacity={0.08}
              label={{ value: "Rango óptimo", position: "insideTopRight", fontSize: 9, fill: "#00E5CC" }}
            />
          )}
          {refLineValue !== undefined && (
            <ReferenceLine
              y={refLineValue}
              stroke="#EF4444"
              strokeDasharray="4 4"
              label={{ value: refLineLabel, position: "insideTopRight", fontSize: 9, fill: "#EF4444" }}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.8}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const aiRecommendations = [
  {
    icon: "⚠️",
    type: "ALERTA",
    text: "Glucosa se agotará en ~4 horas al ritmo actual de consumo. Recomendado: alimentar 5 g/L de glucosa concentrada.",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
  {
    icon: "📈",
    type: "OPTIMIZACIÓN",
    text: "El pH ha bajado a 7.12 (óptimo: 7.2). Agregar 0.5 mL de NaOH 1M. Rendimiento estimado: +3.1%.",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
  {
    icon: "✅",
    type: "ESTADO",
    text: "Cultivo en fase estacionaria (hora 42/72). Densidad celular OD600 = 8.7/12 objetivo. Rendimiento estimado: 94.2% del objetivo.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  {
    icon: "🔮",
    type: "PREDICCIÓN",
    text: "Si se mantienen las condiciones actuales, el cultivo alcanzará el rendimiento máximo en las próximas 12 horas.",
    color: "#00E5CC",
    bg: "rgba(0,229,204,0.06)",
    border: "rgba(0,229,204,0.22)",
  },
  {
    icon: "📊",
    type: "COMPARACIÓN",
    text: "Este cultivo está en el percentil 87 de rendimiento comparado con 234 protocolos similares en la Red de Bio-Conocimiento.",
    color: "#818CF8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.25)",
  },
];

const modelDetails = [
  { label: "Algoritmo", value: "Gradient Boosting Regressor + Physics-Informed Neural Network (PINN)" },
  { label: "Datos de entrenamiento", value: "45 cultivos publicados + datos de la Red de Bio-Conocimiento" },
  { label: "R² Score", value: "0.89" },
  { label: "Variables monitoreadas", value: "pH, DO, temperatura, glucosa, OD600, CO₂, agitación" },
  { label: "Frecuencia de predicción", value: "Cada 30 segundos" },
  { label: "Fuentes", value: "Pfizer MI Edge (AWS), Algocell, bioRxiv 2024, Biotechnology & Bioengineering" },
];

interface AppliedPreset {
  preset?: string;
  ph?: number;
  temp?: number;
  do?: number;
  rpm?: number;
}

function PresetAppliedBanner() {
  const [preset, setPreset] = useState<AppliedPreset | null>(null);

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const raw: AppliedPreset = {
      preset: qs.get("preset") ?? undefined,
      ph: qs.has("ph") ? Number(qs.get("ph")) : undefined,
      temp: qs.has("temp") ? Number(qs.get("temp")) : undefined,
      do: qs.has("do") ? Number(qs.get("do")) : undefined,
      rpm: qs.has("rpm") ? Number(qs.get("rpm")) : undefined,
    };
    const hasAny =
      raw.preset || raw.ph !== undefined || raw.temp !== undefined || raw.do !== undefined || raw.rpm !== undefined;
    if (!hasAny) return;
    setPreset(raw);
    window.history.replaceState({}, "", window.location.pathname);
    const timer = setTimeout(() => setPreset(null), 12_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {preset && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32 }}
          className="px-4 lg:px-8 mb-4"
        >
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(167, 139, 250, 0.12), rgba(0, 229, 204, 0.08))",
              border: "1px solid rgba(167, 139, 250, 0.4)",
              boxShadow: "0 0 24px rgba(167, 139, 250, 0.2)",
            }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--bs-ml)" }}>
                Preset del Asistente aplicado
                {preset.preset && (
                  <span className="ml-2 bs-mono text-[11px]" style={{ color: "var(--bs-text-muted)" }}>
                    · {preset.preset}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {preset.ph !== undefined && (
                  <span className="bs-mono text-[11px]" style={{ color: "var(--bs-text-secondary)" }}>
                    pH <strong style={{ color: "var(--bs-accent)" }}>{preset.ph}</strong>
                  </span>
                )}
                {preset.temp !== undefined && (
                  <span className="bs-mono text-[11px]" style={{ color: "var(--bs-text-secondary)" }}>
                    · Temp <strong style={{ color: "var(--bs-accent)" }}>{preset.temp}°C</strong>
                  </span>
                )}
                {preset.do !== undefined && (
                  <span className="bs-mono text-[11px]" style={{ color: "var(--bs-text-secondary)" }}>
                    · DO <strong style={{ color: "var(--bs-accent)" }}>{preset.do}%</strong>
                  </span>
                )}
                {preset.rpm !== undefined && (
                  <span className="bs-mono text-[11px]" style={{ color: "var(--bs-text-secondary)" }}>
                    · RPM <strong style={{ color: "var(--bs-accent)" }}>{preset.rpm}</strong>
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreset(null)}
              className="text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors flex-shrink-0"
              style={{ color: "var(--bs-text-muted)" }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PasteCSVResults() {
  const { status, analysis, cached, rowsCount, reset } = usePasteCSV();
  return (
    <PasteCSVBanner
      status={status}
      analysis={analysis}
      cached={cached}
      rowsCount={rowsCount}
      onReset={reset}
    />
  );
}

function KpiStrip() {
  // Genera sparkline data estable (no client re-render en cada tick)
  const spark = useMemo(() => {
    const rand = (seed: number) => {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return {
      ph: Array.from({ length: 30 }, (_, i) => 7.2 - 0.08 * Math.sin(i / 4) + (rand(i) - 0.5) * 0.05),
      do: Array.from({ length: 30 }, (_, i) => 42 + 3 * Math.cos(i / 3) + (rand(i + 100) - 0.5) * 2),
      temp: Array.from({ length: 30 }, (_, i) => 37.1 + 0.1 * Math.sin(i / 5) + (rand(i + 200) - 0.5) * 0.1),
      yield: Array.from({ length: 30 }, (_, i) => 90 + (i / 30) * 4 + (rand(i + 300) - 0.5) * 0.8),
    };
  }, []);

  return (
    <div className="px-4 lg:px-8 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="pH actual"
          value={7.12}
          unit="pH"
          decimals={2}
          sparkline={spark.ph}
          delta={-0.08}
          deltaLabel="vs óptimo 7.2"
          severity="warn"
          updatedSecondsAgo={3}
        />
        <KpiCard
          label="Oxígeno disuelto"
          value={42.3}
          unit="%"
          decimals={1}
          sparkline={spark.do}
          delta={2.1}
          deltaLabel="vs −1h"
          severity="ok"
          updatedSecondsAgo={3}
        />
        <KpiCard
          label="Temperatura"
          value={37.2}
          unit="°C"
          decimals={1}
          sparkline={spark.temp}
          delta={0.2}
          deltaLabel="estable"
          severity="neutral"
          updatedSecondsAgo={3}
        />
        <KpiCard
          label="Rendimiento predicho"
          value={94.2}
          unit="%"
          decimals={1}
          sparkline={spark.yield}
          delta={3.1}
          deltaLabel="con ajustes IA"
          severity="ok"
          updatedSecondsAgo={3}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [phSP, setPhSP] = useState(7.2);
  const [tempSP, setTempSP] = useState(37);
  const [doSP, setDoSP] = useState(40);
  const [rpmSP, setRpmSP] = useState(400);
  const [applied, setApplied] = useState(false);
  const [newYield, setNewYield] = useState("94.2");
  const [modelExpanded, setModelExpanded] = useState(false);

  const handleApply = useCallback(() => {
    const pHDiff = (phSP - 7.0) * 2;
    const tempDiff = -(Math.abs(tempSP - 37) * 0.5);
    const doDiff = (doSP - 40) * 0.05;
    const rpmDiff = (rpmSP - 400) * 0.005;
    const calcYield = Math.min(99, Math.max(60, 94.2 + pHDiff + tempDiff + doDiff + rpmDiff));
    setNewYield(calcYield.toFixed(1));
    setApplied(true);
    setTimeout(() => setApplied(false), 5000);
  }, [phSP, tempSP, doSP, rpmSP]);

  return (
    <div className="page-enter min-h-screen" style={{ background: "#06191A" }}>
      {/* Header */}
      <div className="px-4 lg:px-8 pt-6 pb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold bs-h-tight" style={{ color: "var(--bs-text-primary)" }}>
            📊 Monitor de Biorreactor en Tiempo Real
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--bs-text-muted)" }}>
            Datos simulados de un cultivo de E. coli para producción de Vitamina B12 ·{" "}
            <span className="bs-mono text-xs" style={{ color: "var(--bs-accent)" }}>
              pega un CSV (⌘V) para analizar el tuyo
            </span>
          </p>
        </div>
      </div>

      {/* PRESET APPLIED BANNER — triggered by Asistente "Aplicar" chip */}
      <PresetAppliedBanner />

      {/* PASTE CSV BANNER (magic moment #1) */}
      <PasteCSVResults />

      {/* PAIN POINTS WIDGET — data del API (mock si VITE_API_URL vacío) */}
      <div className="px-4 lg:px-8">
        <PainPointsWidget />
      </div>

      {/* TOP METRICS — premium KPI cards con animated ticker + sparkline + pulse */}
      <KpiStrip />

      {/* MAIN CONTENT */}
      <div className="px-4 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Charts */}
          <div className="lg:col-span-3">
            <ChartCard
              title="pH"
              dataKey="ph"
              color="#10B981"
              unit="pH"
              yDomain={[6.5, 7.6]}
              refAreaLow={7.0}
              refAreaHigh={7.3}
            />
            <ChartCard
              title="Oxígeno Disuelto (%)"
              dataKey="do"
              color="#3B82F6"
              unit="%"
              yDomain={[20, 62]}
            />
            <ChartCard
              title="Temperatura (°C)"
              dataKey="temp"
              color="#F59E0B"
              unit="°C"
              yDomain={[35, 39]}
            />
            <ChartCard
              title="Glucosa (g/L)"
              dataKey="glucose"
              color="#A78BFA"
              unit="g/L"
              yDomain={[0, 22]}
              refLineValue={2}
              refLineLabel="⚠️ Nivel crítico"
            />
            <ChartCard
              title="Densidad celular (OD600)"
              dataKey="od600"
              color="#EC4899"
              unit="OD600"
              yDomain={[0, 14]}
            />
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Recommendations */}
            <div className="rounded-xl p-5" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
              <h3 className="font-bold text-white mb-4 text-sm">🧠 Recomendaciones de la IA</h3>
              <div className="space-y-3">
                {aiRecommendations.map((r) => (
                  <div
                    key={r.type}
                    className="rounded-lg p-3"
                    style={{ background: r.bg, border: `1px solid ${r.border}` }}
                  >
                    <p className="text-xs font-bold mb-1" style={{ color: r.color }}>
                      {r.icon} {r.type}
                    </p>
                    <p className="text-xs text-white/75 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Model expander */}
            <div className="rounded-xl overflow-hidden" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white hover:bg-white/5 transition"
                onClick={() => setModelExpanded(!modelExpanded)}
              >
                <span>🤖 Modelo de IA</span>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className={`transition-transform ${modelExpanded ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {modelExpanded && (
                <div className="px-5 pb-5 space-y-2">
                  {modelDetails.map((d) => (
                    <div key={d.label}>
                      <span className="text-xs font-semibold" style={{ color: "#00E5CC" }}>{d.label}: </span>
                      <span className="text-xs text-white/70">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Setpoints */}
            <div className="rounded-xl p-5" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
              <h3 className="font-bold text-white mb-4 text-sm">⚙️ Ajuste de Setpoints</h3>
              <div className="space-y-4">
                {[
                  { label: "pH setpoint", value: phSP, min: 6.0, max: 8.0, step: 0.1, set: setPhSP, unit: "" },
                  { label: "Temperatura (°C)", value: tempSP, min: 25, max: 42, step: 1, set: setTempSP, unit: "°C" },
                  { label: "DO objetivo (%)", value: doSP, min: 20, max: 80, step: 1, set: setDoSP, unit: "%" },
                  { label: "Agitación (RPM)", value: rpmSP, min: 100, max: 800, step: 10, set: setRpmSP, unit: "" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-white/60">{s.label}</span>
                      <span className="text-xs font-bold" style={{ color: "#00E5CC" }}>
                        {s.value}{s.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={s.value}
                      onChange={(e) => s.set(parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none"
                      style={{
                        accentColor: "#00E5CC",
                        background: `linear-gradient(to right, #00E5CC ${((s.value - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.15) 0%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-white/30 mt-0.5">
                      <span>{s.min}{s.unit}</span>
                      <span>{s.max}{s.unit}</span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleApply}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  style={{
                    background: "#00E5CC",
                    color: "#0A2E2E",
                  }}
                >
                  🔄 Aplicar setpoints
                </button>
                {applied && (
                  <div
                    className="rounded-lg p-3 text-xs text-center"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}
                  >
                    ✅ Setpoints actualizados. Eficiencia recalculada: <strong>{newYield}%</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
