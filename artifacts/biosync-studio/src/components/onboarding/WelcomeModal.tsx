import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  PERSONA_LABELS,
  orderedTasks,
  type Persona,
} from "../../lib/onboarding-config";

interface Props {
  open: boolean;
  onSelectPersona: (p: Persona) => void;
  onSkip: () => void;
}

type Slide = "welcome" | "persona" | "preview";

export default function WelcomeModal({ open, onSelectPersona, onSkip }: Props) {
  const [slide, setSlide] = useState<Slide>("welcome");
  const [selected, setSelected] = useState<Persona | null>(null);

  const reset = () => {
    setSlide("welcome");
    setSelected(null);
  };

  const handleSkip = () => {
    reset();
    onSkip();
  };

  const handleConfirm = () => {
    if (!selected) return;
    onSelectPersona(selected);
    reset();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: "rgba(4, 20, 30, 0.85)",
            backdropFilter: "blur(12px)",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-heading"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
            className="w-full max-w-2xl rounded-2xl overflow-hidden relative"
            style={{
              background: "var(--bs-bg-2)",
              border: "1px solid var(--bs-border-strong)",
              boxShadow: "var(--bs-shadow-elevated)",
            }}
          >
            {/* Skip button siempre visible top-right */}
            <button
              type="button"
              onClick={handleSkip}
              className="absolute top-4 right-4 text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors z-10"
              style={{ color: "var(--bs-text-muted)" }}
              aria-label="Saltar tour"
            >
              Saltar ✕
            </button>

            {/* Slide content */}
            <div className="min-h-[420px] p-8 flex flex-col">
              <AnimatePresence mode="wait">
                {slide === "welcome" && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-center"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                      style={{
                        background: "rgba(0, 229, 204, 0.15)",
                        border: "1px solid var(--bs-border-strong)",
                        fontSize: 32,
                        boxShadow: "var(--bs-shadow-glow)",
                      }}
                    >
                      🔬
                    </div>
                    <h1
                      id="welcome-heading"
                      className="text-3xl font-bold bs-h-tight mb-3"
                      style={{ color: "var(--bs-text-primary)" }}
                    >
                      Hola — soy Manuela.
                    </h1>
                    <p
                      className="text-base leading-relaxed mb-2"
                      style={{ color: "var(--bs-text-secondary)" }}
                    >
                      Construí BioSync Studio para que los biólogos dejen de perder lotes por muestrear una vez al día.
                    </p>
                    <p
                      className="text-base leading-relaxed mb-8"
                      style={{ color: "var(--bs-text-muted)" }}
                    >
                      Te voy a mostrar el producto en <strong style={{ color: "var(--bs-accent)" }}>3 minutos</strong>. Sin jerga. Con data real que podés probar en vivo.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSlide("persona")}
                        className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                        style={{
                          background: "var(--bs-accent)",
                          color: "var(--bs-bg-1)",
                          boxShadow: "0 0 20px rgba(0, 229, 204, 0.3)",
                        }}
                      >
                        Empezar el tour →
                      </button>
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="px-5 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
                        style={{
                          color: "var(--bs-text-secondary)",
                          border: "1px solid var(--bs-border-default)",
                        }}
                      >
                        Ya conozco — saltar
                      </button>
                    </div>
                  </motion.div>
                )}

                {slide === "persona" && (
                  <motion.div
                    key="persona"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col"
                  >
                    <h2
                      className="text-2xl font-bold bs-h-tight mb-2"
                      style={{ color: "var(--bs-text-primary)" }}
                    >
                      ¿Qué describe mejor tu rol?
                    </h2>
                    <p
                      className="text-sm mb-6"
                      style={{ color: "var(--bs-text-muted)" }}
                    >
                      El tour se adapta — vas a ver lo relevante para tu flujo primero.
                    </p>

                    <div className="space-y-2 mb-6">
                      {(Object.keys(PERSONA_LABELS) as Persona[]).map((p) => {
                        const info = PERSONA_LABELS[p];
                        const isSelected = selected === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setSelected(p)}
                            data-testid={`persona-${p}`}
                            className="w-full text-left p-4 rounded-xl transition-all flex items-start gap-3"
                            style={{
                              background: isSelected
                                ? "rgba(0, 229, 204, 0.08)"
                                : "var(--bs-bg-3)",
                              border: `1px solid ${isSelected ? "var(--bs-accent)" : "var(--bs-border-subtle)"}`,
                              boxShadow: isSelected ? "var(--bs-shadow-glow)" : "none",
                            }}
                          >
                            <span style={{ fontSize: 24 }}>{info.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-semibold"
                                style={{
                                  color: isSelected
                                    ? "var(--bs-accent)"
                                    : "var(--bs-text-primary)",
                                }}
                              >
                                {info.title}
                              </p>
                              <p
                                className="text-xs mt-1"
                                style={{ color: "var(--bs-text-muted)" }}
                              >
                                {info.hint}
                              </p>
                            </div>
                            {isSelected && (
                              <span style={{ color: "var(--bs-accent)", fontSize: 18 }}>✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setSlide("welcome")}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                        style={{
                          color: "var(--bs-text-muted)",
                          border: "1px solid var(--bs-border-default)",
                        }}
                      >
                        ← Atrás
                      </button>
                      <button
                        type="button"
                        onClick={() => selected && setSlide("preview")}
                        disabled={!selected}
                        className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--bs-accent)",
                          color: "var(--bs-bg-1)",
                        }}
                      >
                        Continuar →
                      </button>
                    </div>
                  </motion.div>
                )}

                {slide === "preview" && selected && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col"
                  >
                    <h2
                      className="text-2xl font-bold bs-h-tight mb-2"
                      style={{ color: "var(--bs-text-primary)" }}
                    >
                      Tus 4 primeras misiones
                    </h2>
                    <p
                      className="text-sm mb-5"
                      style={{ color: "var(--bs-text-muted)" }}
                    >
                      Diseñé el orden para vos como <strong style={{ color: "var(--bs-accent)" }}>{PERSONA_LABELS[selected].title}</strong>.
                      El checklist queda abajo a la derecha mientras explorás.
                    </p>

                    <ol className="space-y-2 mb-6">
                      {orderedTasks(selected).map((task, i) => (
                        <li
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{
                            background: "var(--bs-bg-3)",
                            border: "1px solid var(--bs-border-subtle)",
                          }}
                        >
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bs-mono flex-shrink-0"
                            style={{
                              background: "rgba(0, 229, 204, 0.12)",
                              color: "var(--bs-accent)",
                              border: "1px solid var(--bs-border-default)",
                            }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ fontSize: 16 }}>{task.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "var(--bs-text-primary)" }}
                            >
                              {task.label}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "var(--bs-text-muted)" }}
                            >
                              {task.hint}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className="flex gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setSlide("persona")}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                        style={{
                          color: "var(--bs-text-muted)",
                          border: "1px solid var(--bs-border-default)",
                        }}
                      >
                        ← Atrás
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirm}
                        data-testid="welcome-confirm"
                        className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                        style={{
                          background: "var(--bs-accent)",
                          color: "var(--bs-bg-1)",
                          boxShadow: "0 0 20px rgba(0, 229, 204, 0.3)",
                        }}
                      >
                        ¡Dale, arranquemos!
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress indicator */}
            <div
              className="flex items-center justify-center gap-2 py-3 border-t"
              style={{ borderColor: "var(--bs-border-subtle)" }}
            >
              {(["welcome", "persona", "preview"] as Slide[]).map((s) => (
                <span
                  key={s}
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: slide === s ? 24 : 6,
                    background:
                      slide === s
                        ? "var(--bs-accent)"
                        : "var(--bs-border-default)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
