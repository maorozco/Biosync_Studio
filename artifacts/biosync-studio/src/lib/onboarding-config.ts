// Onboarding config — definición de tasks + persona-based ordering.
// Los trigger IDs matchean los dispatch() de los pages listeners.

export type Persona = "pd-scientist" | "founder" | "other";

export type OnboardingTaskId =
  | "paste-csv"
  | "ask-assistant"
  | "run-simulation"
  | "export-model-card";

export interface OnboardingTask {
  id: OnboardingTaskId;
  icon: string;
  label: string;
  hint: string;
  ctaLabel: string;
  ctaHref: string;
  aha: 1 | 2 | 3 | 4 | 5; // star rating
}

export const TASKS: Record<OnboardingTaskId, OnboardingTask> = {
  "paste-csv": {
    id: "paste-csv",
    icon: "📊",
    label: "Pegá tu primer CSV",
    hint: "⌘V sobre el Dashboard o usá el dataset demo · el más wow de los 4",
    ctaLabel: "Ir al Dashboard",
    ctaHref: "/dashboard",
    aha: 5,
  },
  "ask-assistant": {
    id: "ask-assistant",
    icon: "💬",
    label: "Preguntale al Asistente",
    hint: "Streaming + citas verificables + chips de setpoints",
    ctaLabel: "Abrir Asistente",
    ctaHref: "/asistente",
    aha: 4,
  },
  "run-simulation": {
    id: "run-simulation",
    icon: "🧪",
    label: "Simulá un batch",
    hint: "Gemelo digital PINN con banda 90% CI",
    ctaLabel: "Ir al Simulador",
    ctaHref: "/simulador",
    aha: 3,
  },
  "export-model-card": {
    id: "export-model-card",
    icon: "❄️",
    label: "Exportá la Model Card",
    hint: "Annex 22-ready PDF con hash SHA-256",
    ctaLabel: "Ver Frozen Badge",
    ctaHref: "/dashboard",
    aha: 2,
  },
};

/**
 * Persona-based ordering. PD Scientist empieza por el aha #1 (paste CSV).
 * Founder empieza por el aha regulatorio (export model card).
 */
export function orderedTasks(persona: Persona): OnboardingTask[] {
  const ordering: Record<Persona, OnboardingTaskId[]> = {
    "pd-scientist": ["paste-csv", "ask-assistant", "run-simulation", "export-model-card"],
    founder: ["export-model-card", "paste-csv", "ask-assistant", "run-simulation"],
    other: ["paste-csv", "ask-assistant", "run-simulation", "export-model-card"],
  };
  return ordering[persona].map((id) => TASKS[id]);
}

export const PERSONA_LABELS: Record<Persona, { title: string; hint: string; emoji: string }> = {
  "pd-scientist": {
    emoji: "🔬",
    title: "PD Scientist / Fermentation Engineer",
    hint: "Corrés biorreactores · te interesan yields + troubleshooting + scale-up",
  },
  founder: {
    emoji: "🚀",
    title: "Founder / PI / CTO",
    hint: "Decidís la inversión · te interesa compliance, moat técnico y ROI",
  },
  other: {
    emoji: "🧭",
    title: "Explorador",
    hint: "Curioseando BioSync · vas a ver un tour breve del producto",
  },
};

// LocalStorage schema ------------------------------------------------------

export const STORAGE_KEY = "biosync_onboarding_v1";

export interface OnboardingState {
  persona: Persona | null;
  completedTasks: OnboardingTaskId[];
  dismissedAt: string | null; // ISO timestamp when user skipped the welcome
  tourCompletedAt: string | null; // ISO when 4/4 achieved
  welcomeShownAt: string | null; // ISO first time
}

export const INITIAL_STATE: OnboardingState = {
  persona: null,
  completedTasks: [],
  dismissedAt: null,
  tourCompletedAt: null,
  welcomeShownAt: null,
};

export function isFirstVisit(state: OnboardingState): boolean {
  return state.welcomeShownAt === null && state.dismissedAt === null;
}

export function progressPercent(state: OnboardingState): number {
  return Math.round((state.completedTasks.length / 4) * 100);
}
