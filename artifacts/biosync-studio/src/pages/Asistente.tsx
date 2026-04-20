import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { streamAskAssistant, type Citation, type Recommendation } from "../lib/api";
import CitationGraph from "../components/CitationGraph";

interface Message {
  role: "user" | "bot";
  text: string;
  time: string;
  citations?: Citation[];
  recommendations?: Recommendation;
  meta?: { mock: boolean; cached: boolean };
  query?: string;
}

function getTime() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

const suggestions = [
  "Perdí pH en mi reactor a las 3am, ¿qué hago?",
  "DO crash en mi biorreactor — pasos",
  "¿Cómo escalo de 5L a 50L?",
  "¿Cuánto cuesta Benchling?",
  "¿Qué dice el Annex 22 hoy?",
  "¿Qué alternativa hay a OFAT?",
];

const initialMessages: Message[] = [
  {
    role: "bot",
    text: `¡Bienvenido al Asistente BioSync! 👋

Respondo con retrieval + grounding sobre un corpus curado de quejas reales de ingenieros (Reddit, BioProcess Intl, LinkedIn) + papers clave. **No invento citas** — cada respuesta trae fuentes verificables.

Escribe tu pregunta o seleccioná una rápida abajo.`,
    time: getTime(),
  },
];

// --- Web Speech API typings (compat webkit + standard) ---
interface SpeechRecognitionEventCompat extends Event {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
interface SpeechRecognitionCompat {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventCompat) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionCompat;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function Asistente() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionCompat | null>(null);
  const [, navigate] = useLocation();

  const startListening = () => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      alert("Tu navegador no soporta reconocimiento de voz. Probá Chrome o Edge.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "es-CO";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput(transcript);
        setTimeout(() => void handleSend(transcript), 100);
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speakAnswer = (text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.slice(0, 600));
    u.lang = "es-CO";
    u.rate = 1.05;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-submit query from ?q=... (usado por Command Palette "Preguntarle al Asistente")
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const q = qs.get("q");
    if (!q || !q.trim()) return;
    setInput(q);
    const t = setTimeout(() => {
      void handleSend(q);
      window.history.replaceState({}, "", window.location.pathname);
    }, 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    const q = text.trim();
    const userMsg: Message = { role: "user", text: q, time: getTime() };
    const botIndex = messages.length + 1; // index of the bot placeholder we'll append
    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "bot", text: "", time: getTime(), query: q },
    ]);
    setInput("");
    setLoading(true);

    let accumulated = "";
    let citations: Citation[] = [];

    try {
      await streamAskAssistant(q, {
        onToken: (delta) => {
          accumulated += delta;
          setMessages((prev) => {
            const next = [...prev];
            if (next[botIndex]) {
              next[botIndex] = { ...next[botIndex], text: accumulated };
            }
            return next;
          });
        },
        onCitations: (c) => {
          citations = c;
          setMessages((prev) => {
            const next = [...prev];
            if (next[botIndex]) {
              next[botIndex] = { ...next[botIndex], citations: c };
            }
            return next;
          });
        },
        onRecommendations: (r) => {
          setMessages((prev) => {
            const next = [...prev];
            if (next[botIndex]) {
              next[botIndex] = { ...next[botIndex], recommendations: r };
            }
            return next;
          });
        },
        onDone: (meta) => {
          setMessages((prev) => {
            const next = [...prev];
            if (next[botIndex]) {
              next[botIndex] = {
                ...next[botIndex],
                meta: { mock: meta.mock, cached: meta.cached },
              };
            }
            // TTS si está habilitado
            if (voiceEnabled && accumulated) speakAnswer(accumulated);
            return next;
          });
        },
      });
    } finally {
      setLoading(false);
      // reference citations so TS doesn't complain in case future wiring needs them
      void citations;
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div
      className="page-enter flex flex-col"
      style={{ background: "#06191A", height: "calc(100vh - 56px)" }}
    >
      {/* Header */}
      <div className="px-4 lg:px-8 pt-5 pb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-white mb-1">
          💬 Asistente BioSync — RAG con citas verificables
        </h1>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          Retrieval + grounding sobre corpus curado. Cada respuesta cita fuentes
          reales (Reddit, BioProcess Intl, papers). Sin alucinaciones.
        </p>
      </div>

      {/* Suggested questions */}
      <div className="px-4 lg:px-8 pb-3 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : ""}`}>
              {msg.role === "bot" && (
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(0,229,204,0.2)", color: "#00E5CC" }}
                  >
                    🔬
                  </div>
                  <span className="text-xs text-white/40">
                    BioSync · {msg.time}
                    {msg.meta?.mock && (
                      <span
                        className="ml-2 px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(255,200,87,0.15)",
                          color: "#ffc857",
                          fontSize: "10px",
                        }}
                        title={
                          msg.meta.cached
                            ? "Respuesta pre-validada (cache)"
                            : "Corriendo en modo mock (sin LLM externo)"
                        }
                      >
                        {msg.meta.cached ? "pre-validada" : "mock"}
                      </span>
                    )}
                  </span>
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
                {msg.text || (msg.role === "bot" && loading && i === messages.length - 1 ? "…" : msg.text)}
              </div>

              {/* Recommendations chips (tool-use style) */}
              {msg.role === "bot" && msg.recommendations && (
                <div
                  className="mt-3 rounded-xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(167, 139, 250, 0.08), rgba(0, 229, 204, 0.05))",
                    border: "1px solid rgba(167, 139, 250, 0.3)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2 border-b"
                    style={{ borderColor: "rgba(167, 139, 250, 0.2)" }}
                  >
                    <span style={{ fontSize: 14 }}>⚡</span>
                    <p className="text-xs font-semibold flex-1" style={{ color: "var(--bs-ml)" }}>
                      {msg.recommendations.title}
                    </p>
                    <span
                      className="bs-mono text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(167, 139, 250, 0.15)",
                        color: "var(--bs-ml)",
                      }}
                    >
                      confianza {(msg.recommendations.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  {msg.recommendations.setpoints && (
                    <div className="flex flex-wrap gap-2 px-3 py-2">
                      {Object.entries(msg.recommendations.setpoints).map(([key, val]) => (
                        <span
                          key={key}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bs-mono"
                          style={{
                            background: "rgba(167, 139, 250, 0.1)",
                            color: "var(--bs-text-primary)",
                            border: "1px solid rgba(167, 139, 250, 0.25)",
                          }}
                        >
                          <span style={{ color: "var(--bs-text-muted)" }}>{key}</span>
                          <span className="font-bold" style={{ color: "var(--bs-ml)" }}>
                            {val}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.recommendations.actions &&
                    msg.recommendations.actions.length > 0 && (
                      <ul className="px-3 pb-2 space-y-1">
                        {msg.recommendations.actions.map((a, ai) => (
                          <li
                            key={ai}
                            className="text-xs flex items-start gap-2"
                            style={{ color: "var(--bs-text-secondary)" }}
                          >
                            <span style={{ color: "var(--bs-ml)" }}>•</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  <div className="flex gap-2 px-3 pb-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const r = msg.recommendations!;
                        const params = new URLSearchParams();
                        if (r.preset_id) params.set("preset", r.preset_id);
                        if (r.setpoints?.ph) params.set("ph", String(r.setpoints.ph));
                        if (r.setpoints?.temp) params.set("temp", String(r.setpoints.temp));
                        if (r.setpoints?.do) params.set("do", String(r.setpoints.do));
                        if (r.setpoints?.rpm) params.set("rpm", String(r.setpoints.rpm));
                        navigate(`/dashboard?${params.toString()}`);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{
                        background: "var(--bs-accent)",
                        color: "var(--bs-bg-1)",
                        boxShadow: "0 0 16px rgba(0, 229, 204, 0.3)",
                      }}
                    >
                      ⚡ Aplicar al Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/simulador")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                      style={{
                        color: "var(--bs-text-secondary)",
                        border: "1px solid var(--bs-border-default)",
                      }}
                    >
                      📊 Ver simulación
                    </button>
                  </div>
                </div>
              )}

              {/* Citations */}
              {msg.role === "bot" && msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 space-y-2">
                  {/* Citation graph */}
                  <CitationGraph citations={msg.citations} query={msg.query} />
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Fuentes ({msg.citations.length}) · cada una abrís en nueva pestaña:
                  </p>
                  {msg.citations.map((c, ci) => (
                    <a
                      key={c.id + ci}
                      href={c.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/5"
                      style={{
                        background: "rgba(0,229,204,0.05)",
                        border: "1px solid rgba(0,229,204,0.12)",
                      }}
                    >
                      <div
                        className="font-semibold mb-1"
                        style={{ color: "#00E5CC" }}
                      >
                        [{ci + 1}] {c.source_name}
                        <span
                          className="ml-2 font-mono"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          sim: {c.similarity.toFixed(2)}
                        </span>
                      </div>
                      <p
                        className="leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        "{c.text}"
                      </p>
                    </a>
                  ))}
                </div>
              )}

              {msg.role === "user" && (
                <p className="text-xs text-white/30 text-right mt-1">{msg.time}</p>
              )}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.text === "" && (
          <div className="flex justify-start">
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-2"
              style={{
                background: "rgba(10,46,46,0.85)",
                border: "1px solid rgba(0,229,204,0.15)",
              }}
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
        style={{
          borderColor: "rgba(0,229,204,0.1)",
          background: "rgba(10,46,46,0.5)",
        }}
      >
        <div className="flex gap-2 max-w-4xl mx-auto items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={listening ? "🎤 Escuchando — hablá ahora" : "Escribe tu pregunta sobre bioprocesos…"}
            disabled={loading}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: listening ? "1px solid var(--bs-alert)" : "1px solid rgba(0,229,204,0.25)",
              color: "white",
            }}
          />
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            disabled={loading}
            title={listening ? "Parar reconocimiento" : "Hablar (ES-CO)"}
            className="w-11 h-11 rounded-xl font-semibold transition-all hover:scale-105 flex-shrink-0 flex items-center justify-center"
            style={{
              background: listening ? "var(--bs-alert)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${listening ? "var(--bs-alert)" : "rgba(0,229,204,0.25)"}`,
              color: listening ? "white" : "var(--bs-accent)",
              animation: listening ? "pulse-dot 1.2s ease-in-out infinite" : "none",
            }}
          >
            🎤
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (!next && "speechSynthesis" in window) window.speechSynthesis.cancel();
            }}
            title={voiceEnabled ? "TTS activado — click para desactivar" : "Leer respuestas en voz (ES-CO)"}
            className="w-11 h-11 rounded-xl font-semibold transition-colors flex-shrink-0 flex items-center justify-center"
            style={{
              background: voiceEnabled ? "rgba(0, 229, 204, 0.2)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${voiceEnabled ? "var(--bs-accent)" : "rgba(0,229,204,0.25)"}`,
              color: voiceEnabled ? "var(--bs-accent)" : "var(--bs-text-muted)",
            }}
          >
            🔊
          </button>
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
            {loading ? "…" : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
