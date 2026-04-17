import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
  time: string;
}

function getTime() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function getResponse(input: string): string {
  const q = input.toLowerCase();

  if (q.includes("hola") || q.includes("ayuda") || q.includes("buenos") || q.includes("buenas")) {
    return `¡Hola! 👋 Soy el asistente de BioSync Studio. Puedo ayudarte con:

🧪 Optimización de bioprocesos
📊 Interpretación de datos de biorreactor
📏 Problemas de scale-up
🔧 Selección de equipos y sensores
🌐 Búsqueda de protocolos en la Red de Bio-Conocimiento

¿En qué estás trabajando?`;
  }

  if (q.includes("ph") || q.includes("óptimo") || q.includes("optimo")) {
    return `🧪 Los rangos de pH óptimos por organismo son:

- E. coli: 6.8–7.4 (óptimo 7.2)
- B. subtilis: 6.5–7.5 (óptimo 7.0)
- S. cerevisiae: 4.5–6.0 (óptimo 5.5)
- L. plantarum: 5.5–6.5 (óptimo 6.0)

Para producción de Vitamina B12 con E. coli K-12: pH 7.2 es el setpoint ideal.

📖 Fuente: Biotechnology & Bioengineering, 2025`;
  }

  if (q.includes("rendimiento") || q.includes("bajó") || q.includes("bajo") || q.includes("problema") || q.includes("fallo") || q.includes("cayó")) {
    return `🔍 Las causas más comunes de caída de rendimiento son:

1. pH fuera de rango (verificar electrodo)
2. Agotamiento de sustrato (medir glucosa residual)
3. Acumulación de subproductos tóxicos (acetato en E. coli si glucosa >10 g/L)
4. Contaminación (verificar pureza del inóculo)
5. Transferencia de oxígeno insuficiente (aumentar agitación o flujo de aire)

¿En qué organismo y producto estás trabajando? Te puedo dar recomendaciones más específicas.`;
  }

  if (q.includes("escal") || q.includes("scale") || q.includes("1l") || q.includes("50l") || q.includes("volumen")) {
    return `📏 Los factores críticos de scale-up son:

1. kLa (transferencia de oxígeno): mantener constante
2. Tiempo de mezcla: aumenta con el volumen — verificar homogeneidad
3. Relación superficie/volumen: cambia la disipación de calor
4. Gradientes: en >50 L pueden existir gradientes locales de pH y DO

Regla práctica: mantener P/V (potencia por volumen) constante y verificar el kLa antes de scale-out.

📖 Fuente: Proyecto BALANCE (Canadá-UK, $2M, 2025)`;
  }

  if (q.includes("costo") || q.includes("precio") || q.includes("cuánto") || q.includes("cuanto") || q.includes("dinero")) {
    return `💰 Costos estimados de producción por corrida:

- Matraz 250 mL: $5–15 USD (reactivos básicos)
- Biorreactor 1 L: $50–150 USD
- Biorreactor 5 L: $200–500 USD
- Biorreactor 50 L: $1,000–3,000 USD
- Biorreactor 100–500 L: $3,000–8,000 USD

BioSync Studio reduce estos costos ~10x al simular antes de ejecutar y optimizar condiciones con IA.

Biorreactor usado funcional (5 L): desde $5,000 USD en mercado secundario (eBay, Labx, BioSurplus, Bioreactor3000)`;
  }

  if (q.includes("sensor") || q.includes("hardware") || q.includes("equipo") || q.includes("instrumento")) {
    return `📡 Sensores básicos para monitoreo de biorreactor:

- pH: Hamilton EasyFerm Plus (~$300–500)
- Oxígeno disuelto: Hamilton VisiFerm DO (~$400–700)
- Temperatura: PT100 estándar (~$50–150)
- Biomasa en línea: Aber Futura (capacitancia, ~$2,000+)
- Glucosa inline: Raman spectroscopy (~$80,000+)

Set mínimo viable (pH + DO + temp): ~$800–1,300 USD
BioSync Studio es compatible con cualquier sensor con salida digital o analógica.`;
  }

  if (q.includes("biosync") || q.includes("funciona") || q.includes("qué es") || q.includes("que es") || q.includes("plataforma")) {
    return `🔬 BioSync Studio es una plataforma de IA para optimización de bioprocesos:

1. 📊 Dashboard: Monitoreo en tiempo real con alertas predictivas
2. 🌐 Red de Bio-Conocimiento: Protocolos optimizados compartidos por labs del mundo (aprendizaje federado)
3. 🧪 Simulador Gemelo Digital: Predice el resultado ANTES de ejecutar el cultivo
4. 🤖 IA Predictiva: Recomienda setpoints óptimos y detecta problemas antes de que ocurran

Precio: desde $99/mes (Starter) hasta $499/mes (Enterprise)
Competencia más cercana: Siemens ($500K+), Algocell ($50K+/año) — BioSync es 500x más barato.`;
  }

  if (q.includes("b12") || q.includes("vitamina") || q.includes("riboflavina") || q.includes("cobalamina")) {
    return `💊 Producción de Vitamina B12 (cobalamina):

Organismo recomendado: E. coli K-12 o Propionibacterium freudenreichii

Condiciones óptimas:
- Temperatura: 37°C (E. coli) / 30°C (Propionibacterium)
- pH: 7.0–7.2
- DO: 30–40%
- Medio: LB + cobalto (CoCl₂) 10–50 µM (¡esencial!)
- Tiempo: 48–72 horas

Rendimiento típico: 50–150 mg/L en E. coli (sin optimización)
Con BioSync: hasta 145 mg/L (percentil 95 de la Red)

📖 Fuente: Biotechnology & Bioengineering 2024, Nature Biotechnology 2023`;
  }

  return `Gracias por tu pregunta. Te recomiendo explorar:

- 📊 Dashboard para ver el estado en tiempo real de tu biorreactor
- 🧪 Simulador para probar tu bioproceso virtualmente
- 🌐 Red de Bio-Conocimiento para protocolos optimizados

¿Quieres que te ayude con algo específico sobre tu cultivo o bioproceso?`;
}

const suggestions = [
  "¿Cuál es el pH óptimo para B12 con E. coli?",
  "Mi rendimiento bajó, ¿qué puede estar pasando?",
  "¿Cómo escalo de 1L a 50L?",
  "¿Cuánto cuesta producir riboflavina?",
  "¿Qué sensores necesito?",
  "¿Cómo funciona BioSync Studio?",
];

const initialMessages: Message[] = [
  {
    role: "bot",
    text: `¡Bienvenido al Asistente BioSync! 👋

Soy tu experto en bioprocesos disponible 24/7. Puedo ayudarte con optimización de cultivos, interpretación de datos, scale-up, costos, equipos y mucho más.

Escribe tu pregunta o selecciona una de las opciones rápidas abajo.`,
    time: getTime(),
  },
];

export default function Asistente() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text: text.trim(), time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    const botMsg: Message = { role: "bot", text: getResponse(text), time: getTime() };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="page-enter flex flex-col" style={{ background: "#06191A", height: "calc(100vh - 56px)" }}>
      {/* Header */}
      <div className="px-4 lg:px-8 pt-5 pb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-white mb-1">💬 Asistente BioSync — Tu experto en bioprocesos 24/7</h1>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          Respuestas basadas en literatura científica y datos de la Red de Bio-Conocimiento
        </p>
      </div>

      {/* Suggested questions */}
      <div className="px-4 lg:px-8 pb-3 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(0,229,204,0.08)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(0,229,204,0.2)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-2 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : ""}`}>
              {msg.role === "bot" && (
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(0,229,204,0.2)", color: "#00E5CC" }}
                  >
                    🔬
                  </div>
                  <span className="text-xs text-white/40">BioSync · {msg.time}</span>
                </div>
              )}
              <div
                className="rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                style={
                  msg.role === "user"
                    ? {
                        background: "rgba(0,229,204,0.15)",
                        border: "1px solid rgba(0,229,204,0.25)",
                        color: "white",
                        borderRadius: "12px 12px 2px 12px",
                      }
                    : {
                        background: "rgba(10,46,46,0.85)",
                        border: "1px solid rgba(0,229,204,0.15)",
                        color: "rgba(255,255,255,0.85)",
                        borderRadius: "2px 12px 12px 12px",
                      }
                }
              >
                {msg.text}
              </div>
              {msg.role === "user" && (
                <p className="text-xs text-white/30 text-right mt-1">{msg.time}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-2"
              style={{ background: "rgba(10,46,46,0.85)", border: "1px solid rgba(0,229,204,0.15)" }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: "#00E5CC",
                    animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex-shrink-0 px-4 lg:px-8 py-4 border-t"
        style={{ borderColor: "rgba(0,229,204,0.1)", background: "rgba(10,46,46,0.5)" }}
      >
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Escribe tu pregunta sobre bioprocesos..."
            disabled={loading}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(0,229,204,0.25)",
              color: "white",
            }}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              background: loading || !input.trim() ? "rgba(0,229,204,0.3)" : "#00E5CC",
              color: "#0A2E2E",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
