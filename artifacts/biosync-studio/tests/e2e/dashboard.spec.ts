import { expect, test } from "@playwright/test";

test.describe("Dashboard (/dashboard)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("renderiza encabezado y 4 KPIs en vivo", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Monitor de Biorreactor en Tiempo Real/i })).toBeVisible();
    for (const label of ["pH actual", "Oxígeno disuelto", "Temperatura", "Rendimiento predicho"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("muestra 5 gráficas de series temporales (Recharts)", async ({ page }) => {
    for (const chart of ["Oxígeno Disuelto (%)", "Temperatura (°C)", "Glucosa (g/L)", "Densidad celular (OD600)"]) {
      await expect(page.getByText(chart, { exact: true }).first()).toBeVisible();
    }
    // 5 charts principales + 4 sparklines inline de los KpiCards = 9 recharts-surface total.
    await expect(page.locator(".recharts-surface")).toHaveCount(9);
  });

  test("panel de recomendaciones IA muestra 5 tarjetas", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Recomendaciones de la IA/i })).toBeVisible();
    for (const tag of [/ALERTA/, /OPTIMIZACIÓN/, /ESTADO/, /PREDICCIÓN/, /COMPARACIÓN/]) {
      await expect(page.getByText(tag)).toBeVisible();
    }
  });

  test("expander '🤖 Modelo de IA' muestra detalles al abrir", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Modelo de IA/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByText("Gradient Boosting Regressor + Physics-Informed Neural Network (PINN)")).toBeVisible();
    await expect(page.getByText("R² Score")).toBeVisible();
  });

  test("sliders de setpoints son interactivos y 'Aplicar' recalcula eficiencia", async ({ page }) => {
    const sliders = page.locator('input[type="range"]');
    await expect(sliders).toHaveCount(4);
    const phSlider = sliders.nth(0);
    await phSlider.focus();
    for (let i = 0; i < 5; i++) {
      await phSlider.press("ArrowRight");
    }
    await page.getByRole("button", { name: /Aplicar setpoints/i }).click();
    await expect(page.getByText(/Eficiencia recalculada/i)).toBeVisible();
  });
});
