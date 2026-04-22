import { expect, test, type ConsoleMessage } from "@playwright/test";

const routes: Array<{ path: string; heading: RegExp }> = [
  { path: "/", heading: /BioSync Studio/i },
  { path: "/dashboard", heading: /Monitor de Biorreactor/i },
  { path: "/red", heading: /Red Global de Bio-Conocimiento/i },
  { path: "/simulador", heading: /Simulador de Bioprocesos/i },
  { path: "/asistente", heading: /Asistente BioSync/i },
];

test.describe("Smoke — 5 rutas sin errores de consola", () => {
  for (const { path, heading } of routes) {
    test(`${path} carga y su heading principal es visible`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg: ConsoleMessage) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(path);
      expect(response?.ok(), `HTTP status para ${path}`).toBeTruthy();
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();

      const filtered = errors.filter((e) => !/favicon|replit|cartographer/i.test(e));
      expect(filtered, `errores de consola en ${path}: ${filtered.join("; ")}`).toHaveLength(0);
    });
  }

  test("sidebar navega entre las 5 rutas", async ({ page }) => {
    await page.goto("/");
    for (const { path, heading } of routes.slice(1)) {
      const navLabel = {
        "/dashboard": /Dashboard de Biorreactor/i,
        "/red": /Red de Bio-Conocimiento/i,
        "/simulador": /Simulador de Bioprocesos/i,
        "/asistente": /Asistente BioSync/i,
      }[path]!;
      await page.getByRole("link", { name: navLabel }).first().click();
      await expect(page).toHaveURL(new RegExp(path.replace("/", "\\/") + "$"));
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
    }
  });
});
