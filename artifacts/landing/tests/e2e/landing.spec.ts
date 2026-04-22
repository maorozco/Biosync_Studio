import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = resolve(HERE, "..", "..", ".qa-screenshots", "landing");
mkdirSync(SHOT_DIR, { recursive: true });

// ------------------------------------------------------------------
// ES flow — hero → thank-you → green tier → Calendly CTA
// ------------------------------------------------------------------

test.describe("ES flow", () => {
  test("root redirects to /es or /en", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/\/(es|en)/);
    expect(page.url()).toMatch(/\/(es|en)/);
  });

  test("full signup + green tier", async ({ page }) => {
    await page.goto("/es");

    // Hero renders with expected H1 (Spanish)
    const heroH1 = page.getByRole("heading", { level: 1 });
    await expect(heroH1).toContainText(/lote|muestrear/i);
    await page.screenshot({
      path: `${SHOT_DIR}/e2e-es-01-hero.png`,
      fullPage: true,
    });

    // Submit email from hero form
    const email = "daniela@alt-protein-mx.example";
    await page.locator("form#hero input[type=email]").fill(email);
    await page.locator("form#hero button[type=submit]").click();

    // Navigated to ES thank-you with email query param
    await page.waitForURL(/\/es\/gracias/);
    await expect(page).toHaveURL(
      new RegExp(`/es/gracias\\?email=${encodeURIComponent(email)}`),
    );
    await expect(
      page.getByRole("heading", { name: /Un último paso/i }),
    ).toBeVisible();
    await page.screenshot({
      path: `${SHOT_DIR}/e2e-es-02-thankyou-step1.png`,
      fullPage: true,
    });

    // Step 1 · role → PD Scientist (+3)
    await page
      .getByRole("radio", { name: /PD Scientist \(I \/ II \/ Sr\)/ })
      .check();
    await page.getByRole("button", { name: /Siguiente/ }).click();

    // Step 2 · country MX (+2) + sector precision-fermentation (+3)
    await page.locator("#country").selectOption("MX");
    await page.locator("#sector").selectOption("precision-fermentation");
    await page.getByRole("button", { name: /Siguiente/ }).click();

    // Step 3 · pain with multiple keyword hits
    await page
      .locator("#pain")
      .fill(
        "muestreo manual 2 veces al dia, OFAT eterno, perdemos batch cada semana por scale-up",
      );
    await page.getByRole("button", { name: /Siguiente/ }).click();

    // Step 4 · solutions: Benchling (+2)
    await page.getByRole("checkbox", { name: "Benchling" }).check();
    await page.getByRole("button", { name: /Siguiente/ }).click();

    // Step 5 · timeline: this-week (+4)
    await page
      .getByRole("radio", {
        name: /Esta semana \(decido sola/,
      })
      .check();
    await page.getByRole("button", { name: /Siguiente/ }).click();

    // Step 6 · call intent: yes-calendly (+3)
    await page.getByRole("radio", { name: /Sí, quiero agendar/ }).check();
    await page.screenshot({
      path: `${SHOT_DIR}/e2e-es-03-form-complete.png`,
      fullPage: true,
    });

    // Submit — expected total score: 3+2+3+3+2+4+3 = 20 → green
    await page.getByRole("button", { name: /^Enviar$/ }).click();

    // Green tier panel
    await expect(
      page.getByRole("heading", { name: /Estás en la lista/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Agendar 15 min con Manuela/i }),
    ).toBeVisible();
    await page.screenshot({
      path: `${SHOT_DIR}/e2e-es-04-green-result.png`,
      fullPage: true,
    });
  });
});

// ------------------------------------------------------------------
// EN flow — symmetric happy path
// ------------------------------------------------------------------

test.describe("EN flow", () => {
  test("hero renders English + toggle works", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /batch|sampling/i,
    );
    await page.screenshot({
      path: `${SHOT_DIR}/e2e-en-01-hero.png`,
      fullPage: true,
    });

    // Toggle to ES
    await page.getByRole("button", { name: "ES" }).click();
    await page.waitForURL(/\/es$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /lote|muestrear/i,
    );
  });

  test("full EN signup + green tier", async ({ page }) => {
    await page.goto("/en");

    const email = "evan@boston-alt.example";
    await page.locator("form#hero input[type=email]").fill(email);
    await page.locator("form#hero button[type=submit]").click();

    await page.waitForURL(/\/en\/thank-you/);
    await expect(page).toHaveURL(
      new RegExp(`/en/thank-you\\?email=${encodeURIComponent(email)}`),
    );

    await page
      .getByRole("radio", { name: /PD Scientist \(I \/ II \/ Sr\)/ })
      .check();
    await page.getByRole("button", { name: /Next/ }).click();

    await page.locator("#country").selectOption("US");
    await page.locator("#sector").selectOption("precision-fermentation");
    await page.getByRole("button", { name: /Next/ }).click();

    await page
      .locator("#pain")
      .fill(
        "manual sampling twice a day, OFAT takes months, losing batches on scale-up",
      );
    await page.getByRole("button", { name: /Next/ }).click();

    await page.getByRole("checkbox", { name: "Benchling" }).check();
    await page.getByRole("button", { name: /Next/ }).click();

    await page
      .getByRole("radio", {
        name: /This week \(I decide alone/,
      })
      .check();
    await page.getByRole("button", { name: /Next/ }).click();

    await page
      .getByRole("radio", { name: /Yes, let's schedule/ })
      .check();
    await page.getByRole("button", { name: /^Submit$/ }).click();

    await expect(
      page.getByRole("heading", { name: /Done\. You're in/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Book 15 min with Manuela/i }),
    ).toBeVisible();
    await page.screenshot({
      path: `${SHOT_DIR}/e2e-en-02-green-result.png`,
      fullPage: true,
    });
  });
});
