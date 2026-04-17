import { Link } from "wouter";

const products = [
  { icon: "💊", name: "Vitaminas y nutrientes", desc: "B12, B2 (riboflavina), ácido fólico, vitamina C. Producción microbiana escalable y accesible." },
  { icon: "🧬", name: "Proteínas recombinantes", desc: "Insulina, factores de crecimiento, colágeno. El futuro de la biomedicina." },
  { icon: "🎨", name: "Pigmentos naturales", desc: "Colorantes alimentarios sin químicos. Mercado global en expansión." },
  { icon: "🧪", name: "Enzimas industriales", desc: "Para detergentes, textil, alimentos. Mercado de $7B en crecimiento." },
  { icon: "🌿", name: "Bioplásticos", desc: "PHA, PLA producidos por fermentación. Reemplazan petroquímicos contaminantes." },
  { icon: "🍺", name: "Aromas y fragancias", desc: "Biosintéticos por fermentación de precisión. Mercado de $5B para 2028." },
];

const metrics = [
  { value: "10x", label: "Reducción de costo por corrida experimental" },
  { value: "3-30x", label: "Menos experimentos necesarios (bioRxiv 2024)" },
  { value: "2,880x", label: "Más datos (de 1/día a cada 30 seg)" },
  { value: "$99", label: "Precio starter vs $500K de Siemens" },
];

const steps = [
  {
    icon: "📡",
    title: "Conecta",
    desc: "Conecta los sensores de tu biorreactor (pH, DO, temperatura, glucosa). Compatible con sensores estándar (Hamilton, Mettler Toledo).",
  },
  {
    icon: "🧠",
    title: "Aprende",
    desc: "Nuestra IA (Gradient Boosting + PINN) analiza tus datos históricos, detecta patrones, y predice el rendimiento óptimo.",
  },
  {
    icon: "🚀",
    title: "Optimiza",
    desc: "Recibe recomendaciones de setpoints, alertas predictivas, y protocolos optimizados de la red global.",
  },
];

export default function Inicio() {
  return (
    <div className="page-enter" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* HERO */}
      <section
        className="relative min-h-[88vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontFamily: "system-ui" }}
          >
            BioSync Studio
          </h1>
          <p className="font-semibold mb-4 text-lg" style={{ color: "#00E5CC", fontSize: "1.35rem" }}>
            El cerebro digital de la biofabricación
          </p>
          <p className="text-white/85 mb-10 mx-auto leading-relaxed" style={{ maxWidth: 700, fontSize: "1.05rem" }}>
            Plataforma de inteligencia artificial que optimiza bioprocesos en tiempo real con monitoreo continuo,
            predicción ML, y una red global de conocimiento para que ningún laboratorio empiece de cero.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <button
                className="px-7 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "#00E5CC",
                  color: "#0A2E2E",
                  border: "none",
                  boxShadow: "0 0 24px rgba(0,229,204,0.35)",
                }}
              >
                📊 Ver Dashboard Demo
              </button>
            </Link>
            <Link href="/red">
              <button
                className="px-7 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.6)",
                }}
              >
                🌐 Explorar Red de Conocimiento
              </button>
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" fill="none" stroke="#00E5CC" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section className="py-16 px-4" style={{ background: "#0A2E2E" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">El problema que resolvemos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="rounded-xl p-6"
              style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)" }}
            >
              <h3 className="font-bold text-lg mb-5 text-red-400">Así funciona un laboratorio HOY</h3>
              <ul className="space-y-3 text-sm text-white/80 leading-relaxed">
                <li>❌ Toman UNA muestra al día — si el cultivo muere a las 3am, se enteran a las 9am</li>
                <li>❌ Optimizan por prueba y error — cambian una variable a la vez durante 1-2 años</li>
                <li>❌ Cada corrida fallida cuesta $500-$5,000 en reactivos</li>
                <li>❌ Cada laboratorio empieza de cero — no comparten protocolos</li>
                <li>❌ Solo Pfizer y Novartis pueden pagar IA para bioprocesos ($500K+)</li>
              </ul>
            </div>
            <div
              className="rounded-xl p-6"
              style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.25)" }}
            >
              <h3 className="font-bold text-lg mb-5" style={{ color: "#00E5CC" }}>Así funciona con BioSync Studio</h3>
              <ul className="space-y-3 text-sm text-white/80 leading-relaxed">
                <li>✅ Monitoreo cada 30 segundos — alertas predictivas antes de que algo falle</li>
                <li>✅ ML optimiza condiciones en semanas, no meses — 3-30x menos experimentos</li>
                <li>✅ Simulación antes de ejecutar — reduce costo por corrida en 10x</li>
                <li>✅ Red global de protocolos — si alguien ya lo optimizó, tú lo sabes</li>
                <li>✅ Desde $99/mes — la inteligencia de Pfizer al alcance de cualquier laboratorio</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-16 px-4" style={{ background: "#07201F" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            ¿Qué puedes producir con BioSync Studio?
          </h2>
          <p className="text-center text-white/50 text-sm mb-10">
            Optimiza la producción de cualquier molécula de alto valor
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div key={p.name} className="protocol-card p-6">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-white mb-2">{p.name}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section className="py-14 px-4" style={{ background: "#0D4F4F" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Números que hablan</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.value} className="text-center p-5 rounded-xl metric-card">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: "#00E5CC", fontFamily: "system-ui" }}
                >
                  {m.value}
                </div>
                <p className="text-white/70 text-xs leading-snug">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 px-4" style={{ background: "#0A2E2E" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                <div
                  className="rounded-xl p-7 text-center h-full"
                  style={{ background: "rgba(0,229,204,0.07)", border: "1px solid rgba(0,229,204,0.2)" }}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: "#00E5CC" }}
                  >
                    Paso {i + 1}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                    <svg width="20" height="20" fill="none" stroke="#00E5CC" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESPALDADOS POR CIENCIA */}
      <section className="py-10 px-4" style={{ background: "#06191A" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#00E5CC" }}>
            Respaldados por ciencia
          </p>
          <p className="text-white/40 text-sm">
            Nature | Science | Biotechnology &amp; Bioengineering | Trends in Biotechnology | Pfizer MI Edge (AWS) |
            Proyecto BALANCE (Canadá-UK)
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 text-center" style={{ background: "#0A2E2E" }}>
        <p className="text-white/40 text-xs">
          BioSync Studio © 2026 | Red Bull Basement | Democratizando la biofabricación mundial
        </p>
      </footer>
    </div>
  );
}
