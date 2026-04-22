import { expect, test } from "@playwright/test";

test.describe("Onboarding — welcome + checklist + help", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage antes de cada test para simular first-visit.
    // Requiere navegar primero para tener acceso a storage.
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("welcome modal aparece en primera visita", async ({ page }) => {
    await page.reload();
    await expect(page.getByRole("heading", { name: /Hola — soy Manuela/i })).toBeVisible({
      timeout: 8_000,
    });
    // Slide 1 con CTA visible
    await expect(page.getByRole("button", { name: /Empezar el tour/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Ya conozco — saltar/i })).toBeVisible();
  });

  test("persona picker funciona y guarda en localStorage", async ({ page }) => {
    await page.reload();
    await page.getByRole("button", { name: /Empezar el tour/i }).click();

    // Slide 2 — persona picker
    await expect(page.getByRole("heading", { name: /Qué describe mejor tu rol/i })).toBeVisible();
    await page.getByTestId("persona-pd-scientist").click();
    await page.getByRole("button", { name: /Continuar/i }).click();

    // Slide 3 — preview checklist
    await expect(page.getByRole("heading", { name: /Tus 4 primeras misiones/i })).toBeVisible();
    await page.getByTestId("welcome-confirm").click();

    // Checklist sidebar debe aparecer
    await expect(page.getByText(/Tour BioSync.*0\/4/i)).toBeVisible();

    // localStorage persiste la persona
    const stored = await page.evaluate(() => localStorage.getItem("biosync_onboarding_v1"));
    expect(stored).toContain("pd-scientist");
  });

  test("skip cierra modal y no reaparece en mismo session", async ({ page }) => {
    await page.reload();
    await page.getByRole("button", { name: /Ya conozco — saltar/i }).click();
    // Welcome modal ya no está visible
    await expect(page.getByRole("heading", { name: /Hola — soy Manuela/i })).not.toBeVisible();

    // Reload → welcome NO vuelve (porque dismissedAt se guardó)
    await page.reload();
    await expect(page.getByRole("heading", { name: /Hola — soy Manuela/i })).not.toBeVisible({
      timeout: 3_000,
    });
  });

  test("botón ? TopBar abre HelpDialog con 4 opciones", async ({ page }) => {
    await page.reload();
    // Cerrar welcome modal primero (dismiss)
    await page.getByRole("button", { name: /Ya conozco — saltar/i }).click();

    // Click botón ? en TopBar
    await page.getByTestId("help-button").click();
    await expect(page.getByRole("heading", { name: /Cómo te ayudo/i })).toBeVisible();

    // 4 opciones visibles
    await expect(page.getByTestId("help-restart-tour")).toBeVisible();
    await expect(page.getByTestId("help-video")).toBeVisible();
    await expect(page.getByTestId("help-docs")).toBeVisible();
    await expect(page.getByTestId("help-contact")).toBeVisible();
  });

  test("click 'Reiniciar tour' desde help re-dispara welcome", async ({ page }) => {
    await page.reload();
    await page.getByRole("button", { name: /Ya conozco — saltar/i }).click();
    await page.getByTestId("help-button").click();
    await page.getByTestId("help-restart-tour").click();
    // Welcome modal reabre
    await expect(page.getByRole("heading", { name: /Hola — soy Manuela/i })).toBeVisible({
      timeout: 5_000,
    });
  });
});
