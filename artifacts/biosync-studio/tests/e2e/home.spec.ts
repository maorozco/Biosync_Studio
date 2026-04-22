import { expect, test } from "@playwright/test";

test.describe("Inicio (/)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renderiza hero con título, tagline y CTAs", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "BioSync Studio" })).toBeVisible();
    await expect(page.getByText("El cerebro digital de la biofabricación")).toBeVisible();
    await expect(page.getByRole("button", { name: /Ver Dashboard Demo/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Explorar Red de Conocimiento/i })).toBeVisible();
  });

  test("muestra sección Antes/Después con 5 viñetas por lado", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Así funciona un laboratorio HOY" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Así funciona con BioSync Studio" })).toBeVisible();
    await expect(page.getByText(/UNA muestra al día/i)).toBeVisible();
    await expect(page.getByText(/Monitoreo cada 30 segundos/i)).toBeVisible();
  });

  test("muestra las 6 categorías de productos biofabricables", async ({ page }) => {
    const categories = [
      "Vitaminas y nutrientes",
      "Proteínas recombinantes",
      "Pigmentos naturales",
      "Enzimas industriales",
      "Bioplásticos",
      "Aromas y fragancias",
    ];
    for (const cat of categories) {
      await expect(page.getByRole("heading", { name: cat })).toBeVisible();
    }
  });

  test("muestra las 4 métricas clave incluyendo pricing $99", async ({ page }) => {
    await expect(page.getByText("10x").first()).toBeVisible();
    await expect(page.getByText("3-30x").first()).toBeVisible();
    await expect(page.getByText("2,880x").first()).toBeVisible();
    await expect(page.getByText("$99").first()).toBeVisible();
  });

  test("CTA 'Ver Dashboard Demo' navega a /dashboard", async ({ page }) => {
    await page.getByRole("button", { name: /Ver Dashboard Demo/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: /Monitor de Biorreactor/i })).toBeVisible();
  });
});
