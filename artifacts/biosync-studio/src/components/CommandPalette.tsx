import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useOnboarding } from "../hooks/useOnboarding";

interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon?: string;
  action: () => void;
  keywords?: string;
}

interface Props {
  basePath?: string;
}

export default function CommandPalette({ basePath = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { openHelp, restart } = useOnboarding();

  // Global keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (path: string) => {
    const url = basePath + path;
    navigate(url);
    setOpen(false);
  };

  const items: PaletteItem[] = [
    // Ayuda / Tour (primer grupo — siempre visible)
    { id: "help-open", group: "Ayuda", icon: "🆘", label: "Abrir ayuda", hint: "⌘? · tour, docs, contacto", action: () => { setOpen(false); openHelp(); }, keywords: "help ayuda ? question docs" },
    { id: "help-restart-tour", group: "Ayuda", icon: "▶️", label: "Reiniciar tour", hint: "Re-abre welcome + checklist", action: () => { setOpen(false); restart(); }, keywords: "tour onboarding restart reset reiniciar" },

    // Nav
    { id: "nav-home", group: "Ir a", icon: "🏠", label: "Inicio", hint: "Landing + hero", action: () => go("/"), keywords: "home landing" },
    { id: "nav-dash", group: "Ir a", icon: "📊", label: "Dashboard de Biorreactor", hint: "KPIs en vivo + IA recomendaciones", action: () => go("/dashboard"), keywords: "monitor kpi metrics sensor" },
    { id: "nav-red", group: "Ir a", icon: "🌐", label: "Red de Bio-Conocimiento", hint: "234 protocolos + aprendizaje federado", action: () => go("/red"), keywords: "protocol network federated knowledge" },
    { id: "nav-sim", group: "Ir a", icon: "🧪", label: "Simulador de Bioprocesos", hint: "Gemelo digital + cinética Monod", action: () => go("/simulador"), keywords: "simulator twin monod kinetics" },
    { id: "nav-asis", group: "Ir a", icon: "💬", label: "Asistente BioSync", hint: "RAG + citas verificables", action: () => go("/asistente"), keywords: "assistant chatbot rag llm" },

    // Quick actions
    { id: "act-ask-ph", group: "Preguntarle al Asistente", icon: "❓", label: "Perdí pH en mi reactor a las 3am", hint: "Troubleshoot ↑ acetato + feed", action: () => go("/asistente?q=" + encodeURIComponent("Perdí pH en mi reactor a las 3am, ¿qué hago?")), keywords: "ph drift acetato 3am" },
    { id: "act-ask-do", group: "Preguntarle al Asistente", icon: "❓", label: "DO crash — pasos", hint: "Oxígeno disuelto se cayó", action: () => go("/asistente?q=" + encodeURIComponent("DO crash en mi biorreactor — pasos")), keywords: "dissolved oxygen crash" },
    { id: "act-ask-scale", group: "Preguntarle al Asistente", icon: "❓", label: "Cómo escalar de 5L a 50L", hint: "kLa constante + P/V", action: () => go("/asistente?q=" + encodeURIComponent("¿Cómo escalo de 5L a 50L?")), keywords: "scale up 5l 50l kla" },
    { id: "act-ask-annex", group: "Preguntarle al Asistente", icon: "❓", label: "Qué dice el Annex 22 hoy", hint: "Regulación EMA 2026", action: () => go("/asistente?q=" + encodeURIComponent("¿Qué dice el Annex 22 hoy?")), keywords: "annex 22 ema gmp regulation" },

    // Productos del simulador
    { id: "sim-b12", group: "Simular producto", icon: "💊", label: "Vitamina B12 (cianocobalamina)", action: () => go("/simulador?producto=b12"), keywords: "b12 cianocobalamin vitamin" },
    { id: "sim-b2", group: "Simular producto", icon: "💊", label: "Vitamina B2 (riboflavina)", action: () => go("/simulador?producto=b2"), keywords: "riboflavina b2" },
    { id: "sim-asta", group: "Simular producto", icon: "🟠", label: "Astaxantina (pigmento)", action: () => go("/simulador?producto=astaxantina"), keywords: "astaxantina pigment color" },
    { id: "sim-phb", group: "Simular producto", icon: "♻️", label: "PHB (bioplástico)", action: () => go("/simulador?producto=phb"), keywords: "phb bioplastic polyhydroxybutyrate" },

    // Protocol search (placeholder linking to /red)
    { id: "proto-fedbatch", group: "Protocolo", icon: "📋", label: "Fed-batch E. coli para B12", action: () => go("/red?q=" + encodeURIComponent("fed-batch E coli B12")), keywords: "fedbatch ecoli b12" },
    { id: "proto-komagataella", group: "Protocolo", icon: "📋", label: "K. phaffii + mycoprotein scale-up", action: () => go("/red?q=" + encodeURIComponent("Komagataella phaffii mycoprotein")), keywords: "komagataella phaffii mycoprotein pichia" },
    { id: "proto-bsubtilis", group: "Protocolo", icon: "📋", label: "B. subtilis riboflavina industrial", action: () => go("/red?q=" + encodeURIComponent("B subtilis riboflavin industrial")), keywords: "bsubtilis riboflavin bacillus" },
  ];

  const grouped = items.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
      style={{ background: "rgba(4, 20, 30, 0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl overflow-hidden"
        style={{
          background: "rgba(6, 25, 26, 0.92)",
          border: "1px solid var(--bs-border-default)",
          boxShadow: "var(--bs-shadow-elevated)",
          backdropFilter: "blur(24px)",
        }}
      >
        <Command
          label="Command Menu"
          shouldFilter
          loop
        >
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: "var(--bs-border-subtle)" }}
          >
            <span style={{ color: "var(--bs-accent)" }}>⌘</span>
            <Command.Input
              placeholder="Buscar página, protocolo, producto…"
              className="flex-1 bg-transparent outline-none text-sm bs-tabular"
              style={{ color: "var(--bs-text-primary)" }}
              autoFocus
            />
            <kbd
              className="text-[10px] px-1.5 py-0.5 rounded bs-mono"
              style={{
                background: "rgba(0,229,204,0.08)",
                color: "var(--bs-text-muted)",
                border: "1px solid var(--bs-border-subtle)",
              }}
            >
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto py-2">
            <Command.Empty
              className="py-8 text-center text-sm"
              style={{ color: "var(--bs-text-muted)" }}
            >
              Sin resultados — probá "asistente", "dashboard" o "B12".
            </Command.Empty>
            {Object.entries(grouped).map(([group, groupItems]) => (
              <Command.Group
                key={group}
                heading={
                  <div
                    className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: "var(--bs-text-muted)" }}
                  >
                    {group}
                  </div>
                }
              >
                {groupItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.keywords ?? ""}`}
                    onSelect={item.action}
                    className="flex items-center gap-3 mx-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors data-[selected=true]:bg-[rgba(0,229,204,0.12)]"
                    style={{ color: "var(--bs-text-primary)" }}
                  >
                    <span style={{ fontSize: "14px" }}>{item.icon ?? "•"}</span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.hint && (
                      <span
                        className="text-xs"
                        style={{ color: "var(--bs-text-muted)" }}
                      >
                        {item.hint}
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
          <div
            className="flex items-center justify-between px-4 py-2 border-t text-[10px] bs-mono"
            style={{
              borderColor: "var(--bs-border-subtle)",
              color: "var(--bs-text-muted)",
            }}
          >
            <span>
              <kbd className="px-1 rounded" style={{ background: "rgba(0,229,204,0.08)" }}>↑↓</kbd> navegar ·{" "}
              <kbd className="px-1 rounded" style={{ background: "rgba(0,229,204,0.08)" }}>↵</kbd> ejecutar
            </span>
            <span>BioSync Studio · ⌘K desde cualquier pantalla</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
