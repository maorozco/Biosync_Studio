import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.E2E_PORT ? Number(process.env.E2E_PORT) : 4173;
const BASE_PATH = "/";
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Pre-seed localStorage para que el welcome modal del onboarding no bloquee
// los tests existentes. El spec `onboarding.spec.ts` limpia localStorage en
// su propio beforeEach para testear la experiencia first-visit.
const ONBOARDING_DISMISSED_STATE = JSON.stringify({
  persona: null,
  completedTasks: [],
  dismissedAt: "2026-01-01T00:00:00.000Z",
  tourCompletedAt: null,
  welcomeShownAt: "2026-01-01T00:00:00.000Z",
});

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    storageState: {
      cookies: [],
      origins: [
        {
          origin: BASE_URL,
          localStorage: [
            { name: "biosync_onboarding_v1", value: ONBOARDING_DISMISSED_STATE },
            { name: "biosync_spotlight_shown_v1", value: "2026-01-01T00:00:00.000Z" },
          ],
        },
      ],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      PORT: String(PORT),
      BASE_PATH,
    },
  },
});
