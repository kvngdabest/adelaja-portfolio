import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // e2e/ holds Playwright specs (run via `npm run test:e2e`), not Vitest
    // unit tests — Vitest's default glob would otherwise pick them up too
    // and fail trying to run @playwright/test's `test`/`expect` as its own.
    exclude: ["e2e/**", "node_modules/**"],
  },
});
