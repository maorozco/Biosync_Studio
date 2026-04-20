import { expect, test } from "@playwright/test";

// Nota: estos tests corren contra biosync-studio SIN VITE_API_URL seteado.
// → streamAskAssistant usa el mock fallback de `artifacts/biosync-studio/src/lib/api.ts`.
// → las respuestas mock se definen ahí y deben alinearse con estas aserciones.

test.describe("Asistente (/asistente) — RAG con citas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/asistente");
  });

  test("renderiza heading + welcome + 6 preguntas sugeridas nuevas", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Asistente BioSync/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Bienvenido al Asistente BioSync/i),
    ).toBeVisible();
    const suggestions = [
      "Perdí pH en mi reactor a las 3am, ¿qué hago?",
      "DO crash en mi biorreactor — pasos",
      "¿Cómo escalo de 5L a 50L?",
      "¿Cuánto cuesta Benchling?",
      "¿Qué dice el Annex 22 hoy?",
      "¿Qué alternativa hay a OFAT?",
    ];
    for (const s of suggestions) {
      await expect(page.getByRole("button", { name: s })).toBeVisible();
    }
  });

  test("click en sugerencia de pH devuelve respuesta streaming con citas", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Perdí pH en mi reactor a las 3am/i }).click();
    // Mock responde con contenido sobre "acumulación de ácido" o "feed"
    await expect(page.getByText(/feed|acetato|acumulaci/i).first()).toBeVisible({
      timeout: 10_000,
    });
    // Badge "mock" se renderiza en modo offline
    await expect(page.getByText(/mock/i).first()).toBeVisible({
      timeout: 10_000,
    });
    // Al menos una citation card se muestra con link (puede haber múltiples: citation card + citation graph legend + SVG link)
    await expect(page.getByRole("link").filter({ hasText: /BioProcess|Blackwell/i }).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("click en sugerencia de Benchling cita a Studebaker/LinkedIn", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Cuánto cuesta Benchling/i }).click();
    await expect(page.getByText(/246K|246,000/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("link").filter({ hasText: /Studebaker|LinkedIn/i }).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("escribir pregunta custom y enviar con Enter dispara stream", async ({
    page,
  }) => {
    const input = page.getByPlaceholder(/Escribe tu pregunta sobre bioprocesos/i);
    await input.fill("que dice el annex 22");
    await input.press("Enter");
    await expect(page.getByText(/EMA Annex 22|Q2 2026|weights fijos/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("botón 'Enviar' queda deshabilitado con input vacío", async ({ page }) => {
    const sendBtn = page.getByRole("button", { name: "Enviar", exact: true });
    await expect(sendBtn).toBeDisabled();
  });
});
