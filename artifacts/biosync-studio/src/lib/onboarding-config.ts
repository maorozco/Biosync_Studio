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
    label: "Pegá tus datos",
    hint: "Pegá un Excel o CSV sobre el Dashboard (⌘V) o probá con el dataset demo — vas a ver los gráficos al instante.",
    ctaLabel: "Ir al Dashboard",
    ctaHref: "/dashboard",
    aha: 5,
  },
  "ask-assistant": {
    id: "ask-assistant",
    icon: "💬",
    label: "Hacele una pregunta a la IA",
    hint: "Preguntale lo que quieras sobre tu proceso. Te responde al instante citando papers científicos reales.",
    ctaLabel: "Abrir Asistente",
    ctaHref: "/asistente",
    aha: 4,
  },
  "run-simulation": {
    id: "run-simulation",
    icon: "🧪",
    label: "Simulá un lote",
    hint: "Simulamos tu próxima corrida antes de gastar reactivos reales — con margen de error del 10 %.",
    ctaLabel: "Ir al Simulador",
    ctaHref: "/simulador",
    aha: 3,
  },
  "export-model-card": {
    id: "export-model-card",
    icon: "❄️",
    label: "Exportá el informe certificable",
    hint: "PDF con el registro completo del modelo de IA — listo para cumplir con las normas sanitarias 2026.",
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
    title: "Trabajo en un laboratorio",
    hint: "Hago experimentos con biorreactores. Me interesa producir más, fallar menos y pasar del laboratorio a la planta.",
  },
  founder: {
    emoji: "🚀",
    title: "Dirijo una empresa o proyecto",
    hint: "Decido dónde se invierte. Me importa que cumpla con normas, que sea difícil de copiar y que dé resultados.",
  },
  other: {
    emoji: "🧭",
    title: "Estoy explorando",
    hint: "Todavía no conozco BioSync. Quiero un recorrido rápido para entender qué es.",
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
