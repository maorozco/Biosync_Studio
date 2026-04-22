import { AnimatePresence, motion } from "framer-motion";
import { useOnboarding } from "../../hooks/useOnboarding";

/**
 * Dialog lateral de ayuda — invocable desde botón ? del TopBar, Command Palette
 * o shortcut ⌘?. 4 opciones: re-lanzar tour, abrir docs, hablar con Manu, cerrar.
 */
export default function HelpDialog() {
  const { isHelpOpen, closeHelp, restart } = useOnboarding();

  const actions = [
    {
      id: "restart-tour",
      icon: "▶️",
      title: "Ver el tour otra vez",
      hint: "Re-abre el welcome modal + checklist desde el inicio",
      onClick: () => {
        restart();
      },
    },
    {
      id: "video",
      icon: "🎥",
      title: "Video 75s — cómo funciona",
      hint: "Manu explica el producto en un minuto y quince segundos",
      onClick: () => {
        window.open("https://bio-sync-stu.replit.app", "_blank");
        closeHelp();
      },
    },
    {
      id: "docs",
      icon: "📖",
      title: "Docs + guía de inicio rápido",
      hint: "README técnico · deploy playbook · API reference",
      onClick: () => {
        window.open("https://github.com/JustinWebconnex", "_blank");
        closeHelp();
      },
    },
    {
      id: "contact",
      icon: "💬",
      title: "Hablá con Manu 15 min",
      hint: "WhatsApp o agendá en Calendly — feedback honesto sobre tu proceso",
      onClick: () => {
        window.open("mailto:hola@biosync.studio?subject=BioSync%20%E2%80%94%2015min", "_blank");
        closeHelp();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isHelpOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[45] flex items-start justify-end p-4"
          onClick={closeHelp}
          style={{
            background: "rgba(4, 20, 30, 0.65)",
            backdropFilter: "blur(6px)",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-heading"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className="w-full max-w-sm rounded-2xl overflow-hidden mt-14"
            style={{
              background: "var(--bs-bg-2)",
              border: "1px solid var(--bs-border-strong)",
              boxShadow: "var(--bs-shadow-elevated)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "var(--bs-border-subtle)" }}
            >
              <div>
                <h2
                  id="help-heading"
                  className="text-base font-bold bs-h-tight"
                  style={{ color: "var(--bs-text-primary)" }}
                >
                  ¿Cómo te ayudo?
                </h2>
                <p
                  className="text-[11px] mt-0.5 bs-mono"
                  style={{ color: "var(--bs-text-muted)" }}
                >
                  atajo ⌘? desde cualquier pantalla
                </p>
              </div>
              <button
                type="button"
                onClick={closeHelp}
                aria-label="Cerrar ayuda"
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5"
                style={{ color: "var(--bs-text-muted)" }}
              >
                ✕
              </button>
            </div>

            <ul className="p-2">
              {actions.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={a.onClick}
                    data-testid={`help-${a.id}`}
                    className="w-full flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-white/5 text-left"
                  >
                    <span style={{ fontSize: 18 }}>{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--bs-text-primary)" }}
                      >
                        {a.title}
                      </p>
                      <p
                        className="text-[11px] mt-0.5 leading-snug"
                        style={{ color: "var(--bs-text-muted)" }}
                      >
                        {a.hint}
                      </p>
                    </div>
                    <span
                      style={{ color: "var(--bs-text-muted)", fontSize: 14 }}
                    >
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div
              className="px-5 py-3 border-t text-center"
              style={{
                borderColor: "var(--bs-border-subtle)",
                background: "var(--bs-bg-3)",
              }}
            >
              <p className="text-[11px]" style={{ color: "var(--bs-text-muted)" }}>
                💡 <kbd className="bs-mono">⌘K</kbd> abre búsqueda universal · <kbd className="bs-mono">⌘?</kbd> abre ayuda
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
