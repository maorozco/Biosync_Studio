import { expect, test } from "@playwright/test";

test.describe("Red de Bio-Conocimiento (/red)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/red");
  });

  test("renderiza encabezado y barra de estadísticas globales", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Red Global de Bio-Conocimiento/i })).toBeVisible();
    await expect(page.getByText("234 protocolos compartidos", { exact: false })).toBeVisible();
    await expect(page.getByText("89 laboratorios conectados", { exact: false })).toBeVisible();
    await expect(page.getByText("18 países", { exact: false })).toBeVisible();
  });

  test("muestra los 6 filtros de categoría", async ({ page }) => {
    for (const cat of ["Todos", "Vitaminas", "Proteínas", "Enzimas", "Pigmentos", "Bioplásticos"]) {
      await expect(page.getByRole("button", { name: cat, exact: true })).toBeVisible();
    }
  });

  test("filtro 'Bioplásticos' reduce el listado a tarjetas de bioplástico", async ({ page }) => {
    await page.getByRole("button", { name: "Bioplásticos", exact: true }).click();
    await expect(page.getByRole("heading", { name: /PHB.*bioplástico/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Vitamina B12.*E\. coli/i })).not.toBeVisible();
  });

  test("buscador filtra por texto libre (ej: 'riboflavina')", async ({ page }) => {
    await page.getByPlaceholder(/Buscar protocolo/i).fill("riboflavina");
    await expect(page.getByRole("heading", { name: /Riboflavina.*B\. subtilis/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Vitamina B12/i })).not.toBeVisible();
  });

  test("muestra al menos 1 tarjeta con país LATAM visible por defecto", async ({ page }) => {
    await expect(page.getByText(/Universidad Nacional de Colombia/i)).toBeVisible();
  });

  test("expander '¿Cómo funciona la Red?' revela texto de aprendizaje federado", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /¿Cómo funciona la Red\?/i });
    await toggle.click();
    await expect(page.getByText(/aprendizaje federado/i)).toBeVisible();
  });
});
