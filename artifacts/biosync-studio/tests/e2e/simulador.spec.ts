import { expect, test } from "@playwright/test";

test.describe("Simulador (/simulador)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/simulador");
  });

  test("renderiza panel de configuración con selects y sliders", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Simulador de Bioprocesos — Gemelo Digital/i })).toBeVisible();
    await expect(page.getByRole("combobox").nth(0)).toBeVisible();
    const sliders = page.locator('input[type="range"]');
    await expect(sliders).toHaveCount(4);
  });

  test("estado inicial muestra placeholder sin resultados", async ({ page }) => {
    await expect(page.getByText(/Configura los parámetros y haz clic/i)).toBeVisible();
  });

  test("cambiar organismo a S. cerevisiae cambia lista de productos", async ({ page }) => {
    const organismoSelect = page.getByRole("combobox").nth(0);
    await organismoSelect.selectOption({ label: "Saccharomyces cerevisiae" });
    const productoSelect = page.getByRole("combobox").nth(1);
    await expect(productoSelect).toHaveValue("Etanol");
  });

  test("simular con E. coli K-12 + Vitamina B12 produce curvas y costos", async ({ page }) => {
    test.setTimeout(30_000);
    await page.getByRole("button", { name: /Simular Bioproceso/i }).click();
    await expect(page.getByRole("heading", { name: /Curvas.*PINN|Curvas de Simulaci/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Biomasa observada \(OD600\)|Biomasa \(OD600\)/).first()).toBeVisible();
    await expect(page.getByText(/Sustrato observado \(g\/L\)|Sustrato \(g\/L\)/).first()).toBeVisible();
    await expect(page.getByText(/Producto observado \(g\/L\)|^Producto \(g\/L\)$/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Resultados Predichos/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Estimación de Costos/i })).toBeVisible();
    await expect(page.getByText(/Con optimización BioSync \(ahorro 10x\)/i)).toBeVisible();
  });

  test("las 5 fases del loading animado se muestran", async ({ page }) => {
    await page.getByRole("button", { name: /Simular Bioproceso/i }).click();
    await expect(page.getByRole("heading", { name: /Ejecutando simulación/i })).toBeVisible();
    await expect(page.getByText(/Cargando parámetros cinéticos/i)).toBeVisible();
  });
});
