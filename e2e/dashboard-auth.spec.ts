import { test, expect } from "@playwright/test";

test.describe("dashboard auth gate", () => {
  test("visiting /dashboard while signed out redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?redirectTo=%2Fdashboard/);
    await expect(page.getByRole("heading", { name: /sign in to manage the site/i })).toBeVisible();
  });

  test("visiting a nested dashboard route while signed out redirects to /login with that path preserved", async ({
    page,
  }) => {
    await page.goto("/dashboard/projects");
    await expect(page).toHaveURL(/\/login\?redirectTo=%2Fdashboard%2Fprojects/);
  });

  test("submitting the wrong credentials shows an error and stays on /login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email or password|site isn.t connected/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page).toHaveURL(/\/login/);
  });
});
