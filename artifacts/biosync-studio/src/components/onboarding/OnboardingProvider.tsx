import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  INITIAL_STATE,
  STORAGE_KEY,
  type OnboardingState,
  type OnboardingTaskId,
  type Persona,
} from "../../lib/onboarding-config";
import { OnboardingContext } from "../../hooks/useOnboarding";
import WelcomeModal from "./WelcomeModal";
import ChecklistSidebar from "./ChecklistSidebar";
import HelpDialog from "./HelpDialog";

function loadState(): OnboardingState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed } as OnboardingState;
  } catch {
    return INITIAL_STATE;
  }
}

function persistState(state: OnboardingState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full/disabled — silently ignore
  }
}

export default function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(loadState);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const initialCheckDone = useRef(false);

  // Primer mount — decide si abrir welcome
  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;
    const s = loadState();
    if (s.persona === null && s.dismissedAt === null) {
      setWelcomeOpen(true);
    }
  }, []);

  // Sync state → localStorage
  useEffect(() => {
    persistState(state);
  }, [state]);

  const setPersona = useCallback((persona: Persona) => {
    setState((prev) => ({
      ...prev,
      persona,
      welcomeShownAt: prev.welcomeShownAt ?? new Date().toISOString(),
    }));
    setWelcomeOpen(false);
  }, []);

  const markComplete = useCallback((task: OnboardingTaskId) => {
    setState((prev) => {
      if (prev.completedTasks.includes(task)) return prev;
      const completedTasks = [...prev.completedTasks, task];
      const tourCompletedAt =
        completedTasks.length === 4 && !prev.tourCompletedAt
          ? new Date().toISOString()
          : prev.tourCompletedAt;
      return { ...prev, completedTasks, tourCompletedAt };
    });
  }, []);

  const restart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dismissedAt: null,
      // dejamos persona + completedTasks para no perder progreso
    }));
    setWelcomeOpen(true);
    setHelpOpen(false);
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dismissedAt: new Date().toISOString(),
      welcomeShownAt: prev.welcomeShownAt ?? new Date().toISOString(),
    }));
    setWelcomeOpen(false);
  }, []);

  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  // Listen for a global custom event emitted by pages to report task completion.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ task: OnboardingTaskId }>).detail;
      if (detail?.task) markComplete(detail.task);
    };
    window.addEventListener("biosync:task-complete", handler);
    return () => window.removeEventListener("biosync:task-complete", handler);
  }, [markComplete]);

  // ⌘? shortcut global — abre Help
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "?") {
        e.preventDefault();
        setHelpOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setPersona,
        markComplete,
        restart,
        dismiss,
        openHelp,
        closeHelp,
        isHelpOpen: helpOpen,
      }}
    >
      {children}
      <WelcomeModal
        open={welcomeOpen}
        onSelectPersona={setPersona}
        onSkip={dismiss}
      />
      <ChecklistSidebar />
      <HelpDialog />
    </OnboardingContext.Provider>
  );
}

/**
 * Helper para que cualquier page dispare la completion sin imports.
 * Uso: `emitTaskComplete("paste-csv")`.
 */
export function emitTaskComplete(task: OnboardingTaskId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("biosync:task-complete", { detail: { task } }));
}
