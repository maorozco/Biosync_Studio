import { useState, useMemo } from "react";

interface Protocol {
  id: number;
  badge?: string;
  badgeColor?: string;
  title: string;
  lab: string;
  conditions: string;
  result: string;
  rating: string;
  category: string;
}

const protocols: Protocol[] = [
  {
    id: 1,
    badge: "🏆 Top rendimiento",
    badgeColor: "#F59E0B",
    title: "Producción de Vitamina B12 con E. coli K-12",
    lab: "Lab de Biotecnología — Universidad Nacional de Colombia",
    conditions: "37°C | pH 7.2 | DO 40% | Medio LB + cobalto 10µM",
    result: "Rendimiento: 145 mg/L (percentil 95)",
    rating: "⭐ 4.8/5 (23 replicaciones exitosas)",
    category: "Vitaminas",
  },
  {
    id: 2,
    badge: "📈 Más replicado",
    badgeColor: "#10B981",
    title: "Producción de Riboflavina (B2) con B. subtilis",
    lab: "Instituto de Fermentación — Universidad de São Paulo",
    conditions: "35°C | pH 6.8 | DO 50% | Medio mínimo + ribosa",
    result: "Rendimiento: 4.2 g/L (62% mejora vs baseline)",
    rating: "⭐ 4.6/5 (45 replicaciones)",
    category: "Vitaminas",
  },
  {
    id: 3,
    title: "Producción de Ácido Láctico con Lactobacillus plantarum",
    lab: "Centro de Bioprocesos — UNAM México",
    conditions: "37°C | pH 6.0 | Anaerobio | Medio MRS + glucosa 50g/L",
    result: "Rendimiento: 89 g/L (conversión 89%)",
    rating: "⭐ 4.5/5 (31 replicaciones)",
    category: "Enzimas",
  },
  {
    id: 4,
    title: "Producción de GFP recombinante en E. coli BL21",
    lab: "Laboratorio de Proteínas — Universidad de los Andes",
    conditions: "30°C | pH 7.0 | DO 30% | IPTG 0.5mM a OD600=0.6",
    result: "Rendimiento: 320 mg/L proteína soluble",
    rating: "⭐ 4.7/5 (18 replicaciones)",
    category: "Proteínas",
  },
  {
    id: 5,
    title: "Producción de Astaxantina (pigmento) con Haematococcus pluvialis",
    lab: "Lab de Microalgas — Technion, Israel",
    conditions: "22°C | pH 7.5 | Luz intensa fase 2 | Nitrato limitante",
    result: "Rendimiento: 38 mg/g biomasa seca",
    rating: "⭐ 4.3/5 (12 replicaciones)",
    category: "Pigmentos",
  },
  {
    id: 6,
    title: "Producción de PHB (bioplástico) con Cupriavidus necator",
    lab: "Centro de Biopolímeros — ETH Zurich",
    conditions: "30°C | pH 7.0 | DO 20% | Limitación de nitrógeno",
    result: "Rendimiento: 78% PHB/biomasa seca",
    rating: "⭐ 4.4/5 (15 replicaciones)",
    category: "Bioplásticos",
  },
  {
    id: 7,
    title: "Producción de Insulina recombinante en E. coli",
    lab: "Lab de Biofarma — Universidad de Buenos Aires",
    conditions: "28°C | pH 7.2 | DO 35% | IPTG 0.3mM a OD600=0.8",
    result: "Rendimiento: 5.2 g/L en cuerpos de inclusión",
    rating: "⭐ 4.2/5 (8 replicaciones)",
    category: "Proteínas",
  },
  {
    id: 8,
    badge: "🆕 Nuevo",
    badgeColor: "#00E5CC",
    title: "Producción de Vanilina biosintética con S. cerevisiae",
    lab: "Lab de Biología Sintética — DTU Dinamarca",
    conditions: "30°C | pH 5.5 | Glucosa fed-batch | Gene pathway: 4 genes",
    result: "Rendimiento: 500 mg/L vanilina (vs 0 sin ingeniería)",
    rating: "⭐ 4.1/5 (6 replicaciones)",
    category: "Pigmentos",
  },
];

const categories = ["Todos", "Vitaminas", "Proteínas", "Enzimas", "Pigmentos", "Bioplásticos"];

export default function RedConocimiento() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [howExpanded, setHowExpanded] = useState(false);

  const filtered = useMemo(() => {
    return protocols.filter((p) => {
      const matchCat = activeCategory === "Todos" || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.lab.toLowerCase().includes(q) ||
        p.conditions.toLowerCase().includes(q) ||
        p.result.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="page-enter min-h-screen" style={{ background: "#06191A" }}>
      {/* Header */}
      <div className="px-4 lg:px-8 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white mb-1">🌐 Red Global de Bio-Conocimiento</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Protocolos optimizados compartidos por laboratorios de todo el mundo
        </p>
      </div>

      {/* Stats bar */}
      <div className="px-4 lg:px-8 mb-6">
        <div
          className="rounded-xl px-6 py-4 text-sm font-semibold"
          style={{ background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.2)" }}
        >
          <span style={{ color: "#00E5CC" }}>
            🔬 234 protocolos compartidos
          </span>
          <span className="text-white/30 mx-3">|</span>
          <span className="text-white/70">👥 89 laboratorios conectados</span>
          <span className="text-white/30 mx-3">|</span>
          <span className="text-white/70">🌍 18 países</span>
          <span className="text-white/30 mx-3">|</span>
          <span className="text-white/70">📈 +34% rendimiento promedio</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 lg:px-8 mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="16"
            height="16"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar protocolo (ej: 'vitamina B12', 'riboflavina', 'E. coli', 'enzima'...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 transition"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,229,204,0.2)",
              color: "rgba(255,255,255,0.9)",
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="px-4 lg:px-8 mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
            style={{
              background: activeCategory === cat ? "#00E5CC" : "rgba(255,255,255,0.07)",
              color: activeCategory === cat ? "#0A2E2E" : "rgba(255,255,255,0.65)",
              border: `1px solid ${activeCategory === cat ? "#00E5CC" : "rgba(255,255,255,0.12)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="px-4 lg:px-8 pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm">
            No se encontraron protocolos con esos criterios.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="protocol-card p-5">
                {p.badge && (
                  <span
                    className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-3"
                    style={{
                      background: `${p.badgeColor}20`,
                      color: p.badgeColor,
                      border: `1px solid ${p.badgeColor}40`,
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                <h3 className="font-bold text-white text-sm mb-1">{p.title}</h3>
                <p className="text-xs mb-3" style={{ color: "#00E5CC" }}>
                  🏛 {p.lab}
                </p>
                <div
                  className="rounded-lg p-3 mb-3 text-xs"
                  style={{ background: "rgba(0,229,204,0.05)", border: "1px solid rgba(0,229,204,0.12)" }}
                >
                  <p className="text-white/60 mb-1 font-semibold">Condiciones:</p>
                  <p className="text-white/75 font-mono">{p.conditions}</p>
                </div>
                <p className="text-xs font-semibold text-white mb-1">{p.result}</p>
                <p className="text-xs" style={{ color: "#F59E0B" }}>
                  {p.rating}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="px-4 lg:px-8 pb-8">
        <div className="rounded-xl overflow-hidden" style={{ background: "#0A2E2E", border: "1px solid rgba(0,229,204,0.2)" }}>
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-white hover:bg-white/5 transition"
            onClick={() => setHowExpanded(!howExpanded)}
          >
            <span>🌐 ¿Cómo funciona la Red?</span>
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className={`transition-transform ${howExpanded ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {howExpanded && (
            <div className="px-6 pb-5">
              <p className="text-sm text-white/70 leading-relaxed">
                La Red de Bio-Conocimiento funciona con aprendizaje federado: cada laboratorio comparte únicamente
                los metadatos de sus experimentos (condiciones, rendimientos) sin compartir sus datos propietarios ni
                protocolos completos. BioSync Studio aprende de todos y mejora las recomendaciones para cada uno. Es
                como un GPS colectivo donde nadie comparte su destino exacto ni su posición, y todos se benefician de
                la inteligencia colectiva.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
