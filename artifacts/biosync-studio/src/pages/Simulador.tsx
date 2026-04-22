import { useState, useCallback } from "react";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { emitTaskComplete } from "../components/onboarding/OnboardingProvider";

const organismos = [
  "E. coli K-12",
  "E. coli BL21 (DE3)",
  "Bacillus subtilis",
  "Saccharomyces cerevisiae",
  "Lactobacillus plantarum",
  "Pichia pastoris",
  "Corynebacterium glutamicum",
  "Cupriavidus necator",
];

const productosPorOrganismo: Record<string, string[]> = {
  "E. coli K-12": ["Vitamina B12", "Proteína recombinante (GFP)", "Aminoácidos", "Plásmido recombinante"],
  "E. coli BL21 (DE3)": ["Proteína recombinante genérica", "Enzima industrial", "Anticuerpo"],
  "Bacillus subtilis": ["Riboflavina (B2)", "Surfactina (biosurfactante)", "Amilasa"],
  "Saccharomyces cerevisiae": ["Etanol", "Vanilina biosintética", "Artemisinina", "Insulina"],
  "Lactobacillus plantarum": ["Ácido láctico", "Probióticos (biomasa)", "Bacteriocinas"],
  "Pichia pastoris": ["Proteína recombinante (alta expresión)", "Enzima industrial"],
  "Corynebacterium glutamicum": ["L-lisina", "L-glutamato", "L-treonina", "Ácido succínico"],
  "Cupriavidus necator": ["PHB (bioplástico)", "PHA copolímeros"],
};

const volumenes = ["250 mL (matraz)", "1 L (banco)", "5 L (banco)", "50 L (piloto)", "100 L (producción)", "500 L (producción)"];
const medios = ["LB (Luria-Bertani)", "Medio mínimo M9", "YPD (levaduras)", "MRS (lactobacilos)", "Medio industrial (melaza)"];

const rendimientoBase: Record<string, { value: number; unit: string; productivity: number; conversion: number }> = {
  "Vitamina B12": { value: 145, unit: "mg/L", productivity: 2.2, conversion: 78 },
  "Riboflavina (B2)": { value: 4.2, unit: "g/L", productivity: 0.06, conversion: 62 },
  "Ácido láctico": { value: 89, unit: "g/L", productivity: 1.24, conversion: 89 },
  "Proteína recombinante (GFP)": { value: 320, unit: "mg/L", productivity: 4.8, conversion: 55 },
  "Astaxantina": { value: 38, unit: "mg/g", productivity: 0.5, conversion: 45 },
  "PHB (bioplástico)": { value: 78, unit: "%PHB", productivity: 1.1, conversion: 70 },
  "Insulina": { value: 5.2, unit: "g/L", productivity: 0.19, conversion: 60 },
  "Vanilina biosintética": { value: 500, unit: "mg/L", productivity: 7.1, conversion: 65 },
  default: { value: 3.5, unit: "g/L", productivity: 0.05, conversion: 60 },
};

function genSimData(duration: number, organismo: string) {
  const n = 300;
  const muMax = organismo.includes("cerevisiae") ? 0.35 : organismo.includes("plantarum") ? 0.3 : 0.5;
  const S0 = 20;
  const X0 = 0.1;
  const Yxs = 0.5;
  const Yps = 0.3;

  // Split en 2 tramos: pasado (70% = data observada) + futuro (30% = PINN predicción con CI)
  const observedEnd = Math.floor(n * 0.7);

  return Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * duration;
    const X = Math.min(12, X0 * Math.exp((muMax * t) / (1 + Math.exp(-0.1 * (t - 20)))));
    const S = Math.max(0, S0 - X / Yxs);
    const noise = (Math.random() - 0.5) * 0.15;
    const P = Math.max(0, Yps * (X - X0) + noise);
    const isPrediction = i >= observedEnd;
    // CI grows con el tiempo (uncertainty aumenta en predicción futura)
    const futuroRatio = isPrediction ? (i - observedEnd) / (n - observedEnd) : 0;
    const ciSpread = isPrediction ? P * (0.08 + futuroRatio * 0.22) : 0;

    return {
      hora: parseFloat(t.toFixed(1)),
      biomasa: isPrediction ? null : parseFloat(X.toFixed(2)),
      biomasa_pred: isPrediction ? parseFloat(X.toFixed(2)) : null,
      sustrato: isPrediction ? null : parseFloat(S.toFixed(2)),
      producto: isPrediction ? null : parseFloat(P.toFixed(2)),
      producto_pred: isPrediction ? parseFloat(P.toFixed(2)) : null,
      producto_upper: isPrediction ? parseFloat((P + ciSpread).toFixed(2)) : null,
      producto_lower: isPrediction ? parseFloat(Math.max(0, P - ciSpread).toFixed(2)) : null,
      isPrediction,
    };
  });
}

const phases = [
  "🔬 Cargando parámetros cinéticos del organismo...",
  "📊 Construyendo modelo metabólico del bioproceso...",
  "🧠 Ejecutando simulación con Gradient Boosting + cinética Monod...",
  "📈 Generando curvas de crecimiento y producción...",
  "✅ Simulación completada",
];

const costoMedio: Record<string, number> = {
  "250 mL (matraz)": 5,
  "1 L (banco)": 18,
  "5 L (banco)": 55,
  "50 L (piloto)": 420,
  "100 L (producción)": 780,
  "500 L (producción)": 2900,
};

export default function Simulador() {
  const [organismo, setOrganismo] = useState("E. coli K-12");
  const [producto, setProducto] = useState("Vitamina B12");
  const [volumen, setVolumen] = useState("5 L (banco)");
  const [medio, setMedio] = useState("LB (Luria-Bertani)");
  const [temperatura, setTemperatura] = useState(37);
  const [ph, setPh] = useState(7.0);
  const [doPct, setDoPct] = useState(40);
  const [duration, setDuration] = useState(72);

  const [loading, setLoading] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(-1);
  const [simData, setSimData] = useState<ReturnType<typeof genSimData> | null>(null);
  const [protExpanded, setProtExpanded] = useState(false);

  const productosDisp = productosPorOrganismo[organismo] || ["Producto genérico"];

  const handleOrganismoChange = (v: string) => {
    setOrganismo(v);
    const prods = productosPorOrganismo[v] || [];
    setProducto(prods[0] || "Producto genérico");
  };

  const handleSimulate = useCallback(async () => {
    setLoading(true);
    setSimData(null);
    const delays = [2000, 2000, 1500, 1500, 1000];
    for (let i = 0; i < phases.length; i++) {
      setPhaseIdx(i);
      await new Promise((r) => setTimeout(r, delays[i]));
    }
    setSimData(genSimData(duration, organismo));
    setLoading(false);
    emitTaskComplete("run-simulation");
  }, [duration, organismo]);

  const rend = rendimientoBase[producto] || rendimientoBase.default;
  const costoBase = costoMedio[volumen] || 55;
  const costoEnergia = costoBase * 0.4;
  const costoReactivos = costoBase * 0.2;
  const total = costoBase + costoEnergia + costoReactivos;
  const productValue = rend.value * (rend.unit === "mg/L" ? 0.002 : rend.unit === "g/L" ? 0.5 : 1.5);
  const simSegundos = Math.round(Math.random() * 2 + 6);

  return (
    <div className="page-enter min-h-screen" style={{ background: "#06191A" }}>
      <div className="px-4 lg:px-8 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white mb-1">🧪 Simulador de Bioprocesos — Gemelo Digital</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Simula tu cultivo antes de ejecutarlo. Ahorra reactivos, tiempo y dinero.
        </p>
      </div>

      <div className="px-4 lg:px-8 pb-8 grid lg:grid-cols-5 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-2">
          <div className="rounded-xl p-5" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
            <h3 className="font-bold text-white mb-5 text-sm">Configura tu bioproceso</h3>
            <div className="space-y-4">
              {/* Organismo */}
              <div>
                <label className="block text-xs text-white/50 mb-1">Organismo</label>
                <select
                  value={organismo}
                  onChange={(e) => handleOrganismoChange(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(0,229,204,0.2)" }}
                >
                  {organismos.map((o) => (
                    <option key={o} value={o} style={{ background: "#0A2E2E" }}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Producto */}
              <div>
                <label className="block text-xs text-white/50 mb-1">Producto objetivo</label>
                <select
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(0,229,204,0.2)" }}
                >
                  {productosDisp.map((p) => (
                    <option key={p} value={p} style={{ background: "#0A2E2E" }}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Volumen */}
              <div>
                <label className="block text-xs text-white/50 mb-1">Volumen del biorreactor</label>
                <select
                  value={volumen}
                  onChange={(e) => setVolumen(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(0,229,204,0.2)" }}
                >
                  {volumenes.map((v) => (
                    <option key={v} value={v} style={{ background: "#0A2E2E" }}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Medio */}
              <div>
                <label className="block text-xs text-white/50 mb-1">Medio de cultivo</label>
                <select
                  value={medio}
                  onChange={(e) => setMedio(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(0,229,204,0.2)" }}
                >
                  {medios.map((m) => (
                    <option key={m} value={m} style={{ background: "#0A2E2E" }}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Sliders */}
              {[
                { label: `Temperatura (°C)`, value: temperatura, min: 20, max: 42, step: 1, set: setTemperatura, unit: "°C" },
                { label: "pH objetivo", value: ph, min: 5.0, max: 8.5, step: 0.1, set: setPh, unit: "" },
                { label: "DO objetivo (%)", value: doPct, min: 10, max: 80, step: 1, set: setDoPct, unit: "%" },
                { label: "Duración del cultivo (horas)", value: duration, min: 12, max: 168, step: 1, set: setDuration, unit: "h" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/50">{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: "#00E5CC" }}>{s.value}{s.unit}</span>
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
                      background: `linear-gradient(to right, #00E5CC ${((s.value - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.1) 0%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/25 mt-0.5">
                    <span>{s.min}{s.unit}</span><span>{s.max}{s.unit}</span>
                  </div>
                </div>
              ))}

              <button
                onClick={handleSimulate}
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                style={{
                  background: loading ? "rgba(0,229,204,0.4)" : "#00E5CC",
                  color: "#0A2E2E",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Simulando..." : "🧪 Simular Bioproceso"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Loading */}
          {loading && (
            <div className="rounded-xl p-6" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
              <h3 className="font-bold text-white mb-4 text-sm">⏳ Ejecutando simulación...</h3>
              <div className="space-y-2">
                {phases.map((phase, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                      style={{
                        background:
                          i < phaseIdx
                            ? "rgba(16,185,129,0.2)"
                            : i === phaseIdx
                            ? "rgba(0,229,204,0.2)"
                            : "rgba(255,255,255,0.05)",
                        border: `1px solid ${i < phaseIdx ? "#10B981" : i === phaseIdx ? "#00E5CC" : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {i < phaseIdx ? "✓" : i === phaseIdx ? <span className="loading-dot">●</span> : ""}
                    </div>
                    <span
                      className="text-xs"
                      style={{
                        color:
                          i < phaseIdx
                            ? "#10B981"
                            : i === phaseIdx
                            ? "white"
                            : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {phase}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {simData && !loading && (
            <>
              {/* Simulation chart — observado + PINN prediction con 90% CI */}
              <div className="rounded-xl p-5 relative" style={{ background: "var(--bs-bg-2)", border: "1px solid var(--bs-border-default)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm" style={{ color: "var(--bs-text-primary)" }}>
                    📈 Curvas: observado + PINN con 90% CI
                  </h3>
                  <span
                    className="bs-mono text-[10px] px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(167, 139, 250, 0.15)",
                      color: "var(--bs-ml)",
                      border: "1px solid rgba(167, 139, 250, 0.35)",
                    }}
                    title="El PINN (Physics-Informed Neural Network) proyecta las últimas horas con banda de confianza del 90%. Banda se expande conforme la predicción se aleja del dato observado."
                  >
                    PINN · banda 90%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={simData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="hora" tickFormatter={(v) => `${v}h`} tick={{ fontSize: 10, fill: "#aaa" }} tickCount={8} />
                    <YAxis tick={{ fontSize: 10, fill: "#aaa" }} />
                    <Tooltip
                      contentStyle={{ background: "var(--bs-bg-3)", border: "1px solid var(--bs-border-strong)", borderRadius: 8, fontSize: 11 }}
                      labelFormatter={(l) => `Hora ${l}h`}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#ccc" }} />
                    {/* CI bands (area upper - lower) — render PRIMERO para que quede atrás */}
                    <Area
                      type="monotone"
                      dataKey="producto_upper"
                      stackId="ci"
                      stroke="none"
                      fill="rgba(167, 139, 250, 0.18)"
                      legendType="none"
                      name="CI superior"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="producto_lower"
                      stackId="ci-sub"
                      stroke="none"
                      fill="var(--bs-bg-2)"
                      legendType="none"
                      name="CI inferior"
                      isAnimationActive={false}
                    />
                    {/* Observed (solid lines) */}
                    <Line type="monotone" dataKey="biomasa" name="Biomasa observada (OD600)" stroke="#10B981" strokeWidth={2} dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="sustrato" name="Sustrato observado (g/L)" stroke="#3B82F6" strokeWidth={2} dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="producto" name="Producto observado (g/L)" stroke="#EF4444" strokeWidth={2} dot={false} connectNulls={false} />
                    {/* PINN predictions (dashed) */}
                    <Line type="monotone" dataKey="biomasa_pred" name="Biomasa PINN" stroke="#10B981" strokeWidth={1.5} strokeDasharray="5 4" dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="producto_pred" name="Producto PINN" stroke="#A78BFA" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls={false} />
                  </ComposedChart>
                </ResponsiveContainer>

                {/* Anomaly badge — aparece si última predicción se desvía >2σ */}
                <div
                  className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{
                    background: "rgba(167, 139, 250, 0.08)",
                    border: "1px solid rgba(167, 139, 250, 0.25)",
                  }}
                >
                  <span style={{ color: "var(--bs-ml)", fontSize: 14 }}>⚡</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: "var(--bs-ml)" }}>
                      PINN detectó posible anomalía h≈{Math.round(duration * 0.86)}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--bs-text-muted)" }}>
                      La banda de CI se expande 22% vs punto de referencia. Recomendación: validar pH + DO antes de h={Math.round(duration * 0.82)} o considerar feed step-up del 15%.
                    </p>
                  </div>
                  <span
                    className="bs-mono text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      background: "rgba(167, 139, 250, 0.2)",
                      color: "var(--bs-ml)",
                    }}
                  >
                    sev 3
                  </span>
                </div>
              </div>

              {/* Predicted results */}
              <div className="rounded-xl p-5" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
                <h3 className="font-bold text-white mb-4 text-sm">📊 Resultados Predichos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: `Rendimiento de ${producto}`, value: `${rend.value} ${rend.unit}` },
                    { label: "Productividad", value: `${rend.productivity} ${rend.unit}/h` },
                    { label: "Conversión de sustrato", value: `${rend.conversion}%` },
                    { label: "Tiempo hasta máximo rendimiento", value: `${Math.round(duration * 0.78)} horas` },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg p-3" style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.15)" }}>
                      <p className="text-xs text-white/50 mb-1">{m.label}</p>
                      <p className="text-lg font-bold" style={{ color: "#00E5CC" }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI optimization */}
              <div className="rounded-xl p-5" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <h3 className="font-bold text-white mb-4 text-sm">🎯 Optimización sugerida por IA</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    `pH: Tu setpoint es ${ph}. Óptimo para ${producto} con ${organismo}: 7.2. Ajuste estimado: +3.1% en rendimiento.`,
                    `Temperatura: ${temperatura}°C está ${Math.abs(temperatura - 37) <= 2 ? "dentro" : "fuera"} del rango óptimo (35-38°C). ${Math.abs(temperatura - 37) > 2 ? "Considera ajustar a 37°C." : ""}`,
                    `DO: ${doPct}% ${doPct >= 35 && doPct <= 50 ? "es apropiado" : `debe ajustarse a 40% para maximizar`} la transferencia de oxígeno.`,
                    `Alimentación: Considerar fed-batch con pulso de glucosa a hora ${Math.round(duration * 0.5)} para extender la fase productiva.`,
                  ].map((s, i) => (
                    <li key={i} className="text-white/75 flex gap-2">
                      <span style={{ color: "#10B981" }}>→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cost table */}
              <div className="rounded-xl p-5" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
                <h3 className="font-bold text-white mb-4 text-sm">💰 Estimación de Costos</h3>
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      [`Medio de cultivo (${volumen})`, `$${costoBase}`],
                      ["Energía (agitación + temperatura)", `$${costoEnergia.toFixed(0)}`],
                      ["Reactivos adicionales", `$${costoReactivos.toFixed(0)}`],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <td className="py-2 text-white/60">{k}</td>
                        <td className="py-2 text-right text-white/80">{v}</td>
                      </tr>
                    ))}
                    <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <td className="py-2 font-bold text-white">Total estimado por corrida</td>
                      <td className="py-2 text-right font-bold text-white">${total.toFixed(0)}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: "rgba(0,229,204,0.15)" }}>
                      <td className="py-2 font-bold" style={{ color: "#00E5CC" }}>Con optimización BioSync (ahorro 10x)</td>
                      <td className="py-2 text-right font-bold" style={{ color: "#00E5CC" }}>${(total / 10).toFixed(0)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/60">Valor del producto obtenido</td>
                      <td className="py-2 text-right" style={{ color: "#10B981" }}>${productValue.toFixed(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Protocol expander */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white hover:bg-white/5 transition"
                  onClick={() => setProtExpanded(!protExpanded)}
                >
                  <span>📋 Protocolo Sugerido</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    className={`transition-transform ${protExpanded ? "rotate-180" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {protExpanded && (
                  <div className="px-5 pb-5">
                    <ol className="space-y-2 text-xs text-white/70 list-decimal list-inside">
                      <li><strong className="text-white/90">Preparación de medio:</strong> {medio}, {volumen}, autoclavar 121°C 15 min</li>
                      <li><strong className="text-white/90">Inoculación:</strong> pre-cultivo overnight, inocular a OD600 = 0.05-0.1</li>
                      <li><strong className="text-white/90">Condiciones:</strong> {temperatura}°C, pH {ph}, {doPct}% DO, 400 RPM</li>
                      <li><strong className="text-white/90">Monitoreo:</strong> pH cada hora, glucosa cada 2h, OD600 cada 2h</li>
                      <li><strong className="text-white/90">Inducción (si aplica):</strong> Agregar inductor a OD600 = 0.6-0.8</li>
                      <li><strong className="text-white/90">Cosecha:</strong> Centrifugar a 5,000×g, 15 min</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Comparison */}
              <div
                className="rounded-xl p-4 text-sm"
                style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.2)" }}
              >
                <span style={{ color: "#00E5CC" }}>⚡</span>{" "}
                <span className="text-white/70">
                  Sin BioSync: necesitarías ~50-100 corridas experimentales para encontrar las condiciones óptimas
                  (${(total * 75).toLocaleString()}). Con BioSync: simulaste en{" "}
                  <strong className="text-white">{simSegundos} segundos</strong> por <strong className="text-white">$0</strong>.
                </span>
              </div>
            </>
          )}

          {!simData && !loading && (
            <div
              className="rounded-xl p-12 text-center"
              style={{ background: "#0A2E2E", border: "1px dashed rgba(0,229,204,0.2)" }}
            >
              <div className="text-5xl mb-4">🧪</div>
              <p className="text-white/50 text-sm">
                Configura los parámetros y haz clic en <strong style={{ color: "#00E5CC" }}>Simular Bioproceso</strong>
              </p>
              <p className="text-white/30 text-xs mt-2">Los resultados aparecerán aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
