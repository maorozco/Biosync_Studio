import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useOnboarding } from "../../hooks/useOnboarding";
import {
  orderedTasks,
  progressPercent,
  type Persona,
} from "../../lib/onboarding-config";

export default function ChecklistSidebar() {
  const { state, restart } = useOnboarding();
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);

  // useEffect DEBE ir antes de los early returns (Rules of Hooks).
  useEffect(() => {
    if (state.completedTasks.length === 0) return;
    setJustCompleted(true);
    const t = setTimeout(() => setJustCompleted(false), 2400);
    return () => clearTimeout(t);
  }, [state.completedTasks.length]);

  // No renderizar si user no seleccionó persona aún
  if (state.persona === null) return null;
  // Auto-ocultar si dismissed sin progreso (user skipped el welcome)
  if (state.dismissedAt && state.completedTasks.length === 0) return null;

  const tasks = orderedTasks(state.persona as Persona);
  const pct = progressPercent(state);
  const complete = state.completedTasks.length === 4;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 w-[320px] max-w-[calc(100vw-2rem)]"
      role="complementary"
      aria-label="Tour checklist"
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--bs-bg-2)",
              border: "1px solid var(--bs-border-default)",
              boxShadow: "var(--bs-shadow-elevated)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b cursor-pointer"
              onClick={() => setExpanded(false)}
              style={{ borderColor: "var(--bs-border-subtle)" }}
            >
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold flex items-center gap-2"
                  style={{ color: "var(--bs-accent)" }}
                >
                  {complete ? "🎉 Tour BioSync — completo" : `🧭 Tour BioSync · ${state.completedTasks.length}/4`}
                  {justCompleted && !complete && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] bs-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "var(--bs-ok)",
                      }}
                    >
                      +1 ✓
                    </motion.span>
                  )}
                </p>
                {/* Progress bar */}
                <div
                  className="h-1 rounded-full mt-2 overflow-hidden"
                  style={{ background: "rgba(255, 255, 255, 0.06)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
                    className="h-full"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--bs-accent), var(--bs-accent-hover))",
                      boxShadow: "0 0 8px rgba(0, 229, 204, 0.4)",
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
                aria-label="Colapsar checklist"
                className="ml-2 w-6 h-6 rounded flex items-center justify-center hover:bg-white/5"
                style={{ color: "var(--bs-text-muted)" }}
              >
                ⌄
              </button>
            </div>

            {/* Tasks */}
            <ul className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
              {tasks.map((task, i) => {
                const done = state.completedTasks.includes(task.id);
                return (
                  <li key={task.id}>
                    <button
                      type="button"
                      data-testid={`checklist-task-${task.id}`}
                      onClick={() => navigate(task.ctaHref)}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/5 text-left"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] bs-mono font-bold mt-0.5"
                        style={{
                          background: done
                            ? "var(--bs-ok)"
                            : "rgba(0, 229, 204, 0.08)",
                          color: done ? "white" : "var(--bs-text-muted)",
                          border: done
                            ? "1px solid var(--bs-ok)"
                            : "1px solid var(--bs-border-default)",
                        }}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold leading-tight"
                          style={{
                            color: done
                              ? "var(--bs-text-muted)"
                              : "var(--bs-text-primary)",
                            textDecoration: done ? "line-through" : "none",
                          }}
                        >
                          {task.icon} {task.label}
                        </p>
                        <p
                          className="text-[11px] mt-0.5 leading-snug"
                          style={{ color: "var(--bs-text-muted)" }}
                        >
                          {task.hint}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div
              className="px-4 py-2 border-t flex items-center justify-between"
              style={{ borderColor: "var(--bs-border-subtle)" }}
            >
              {complete ? (
                <button
                  type="button"
                  onClick={restart}
                  className="text-[11px] font-medium"
                  style={{ color: "var(--bs-accent)" }}
                >
                  Reiniciar tour
                </button>
              ) : (
                <p className="text-[11px]" style={{ color: "var(--bs-text-muted)" }}>
                  Click una misión para ir
                </p>
              )}
              <kbd
                className="bs-mono text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(0, 229, 204, 0.08)",
                  color: "var(--bs-text-muted)",
                }}
              >
                ⌘? ayuda
              </kbd>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => setExpanded(true)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22 }}
            className="px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-semibold hover:scale-105 transition-transform"
            style={{
              background: "var(--bs-bg-2)",
              color: "var(--bs-accent)",
              border: "1px solid var(--bs-border-default)",
              boxShadow: "var(--bs-shadow-glow)",
            }}
            aria-label="Expandir checklist del tour"
          >
            {complete ? "🎉 Tour ✓" : `🧭 ${state.completedTasks.length}/4`}
            <span
              className="h-1 rounded-full"
              style={{
                width: 32,
                background: "rgba(0, 229, 204, 0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "var(--bs-accent)",
                }}
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
