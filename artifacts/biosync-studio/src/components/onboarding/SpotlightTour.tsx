import { useEffect } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { useLocation } from "wouter";
import { useOnboarding } from "../../hooks/useOnboarding";

/**
 * SpotlightTour — wrapper de driver.js para 4 tooltips post-welcome.
 * Se dispara automáticamente la primera vez que el user llega al Dashboard
 * post-persona. Skippable. Los styles están en index.css (`.driver-popover`).
 */
export default function SpotlightTour() {
  const { state } = useOnboarding();
  const [location] = useLocation();

  useEffect(() => {
    // Condiciones: persona seleccionada + NO se mostró antes + NO dismissed
    if (!state.persona) return;
    if (state.completedTasks.length > 0) return; // ya empezó, skip tour
    const shown = window.localStorage.getItem("biosync_spotlight_shown_v1");
    if (shown) return;
    // Solo dispara en /dashboard (necesita elementos mounted)
    if (!location.startsWith("/dashboard")) return;

    const steps: DriveStep[] = [
      {
        element: '[data-spotlight="cmdk"]',
        popover: {
          title: "⌘K abre todo",
          description:
            "Tu hub de navegación + acciones. Probá escribir “simular” o “asistente” después del tour.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: '[data-spotlight="paste-csv"]',
        popover: {
          title: "Acá vive la magia",
          description:
            "Pegá cualquier CSV de biorreactor (⌘V) y el dashboard se llena en 3 segundos. O usá el dataset demo más abajo.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-spotlight="frozen-badge"]',
        popover: {
          title: "Annex 22-ready",
          description:
            "Modelo congelado con hash SHA-256. Click “Exportar Model Card” y recibís un PDF listo para compliance.",
          side: "bottom",
          align: "start",
        },
      },
    ];

    // Dar un poco de tiempo para que los targets se monten
    const t = setTimeout(() => {
      const d = driver({
        showProgress: true,
        progressText: "Paso {{current}} de {{total}}",
        nextBtnText: "Siguiente →",
        prevBtnText: "← Atrás",
        doneBtnText: "¡Listo!",
        smoothScroll: true,
        allowClose: true,
        overlayOpacity: 0.7,
        stagePadding: 6,
        stageRadius: 12,
        steps,
        onDestroyed: () => {
          window.localStorage.setItem("biosync_spotlight_shown_v1", new Date().toISOString());
        },
      });
      d.drive();
    }, 600);

    return () => clearTimeout(t);
  }, [state.persona, state.completedTasks.length, location]);

  return null;
}
