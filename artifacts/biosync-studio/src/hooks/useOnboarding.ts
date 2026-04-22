import { createContext, useContext } from "react";
import type {
  OnboardingState,
  OnboardingTaskId,
  Persona,
} from "../lib/onboarding-config";

export interface OnboardingContextValue {
  state: OnboardingState;
  setPersona: (p: Persona) => void;
  markComplete: (task: OnboardingTaskId) => void;
  restart: () => void;
  dismiss: () => void;
  openHelp: () => void;
  closeHelp: () => void;
  isHelpOpen: boolean;
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  }
  return ctx;
}
