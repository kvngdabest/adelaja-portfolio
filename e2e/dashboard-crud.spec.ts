import { test, expect } from "@playwright/test";

/**
 * Full dashboard CRUD round-trip against a real Supabase project. Needs a
 * live project (see README) plus an admin account's credentials passed via
 * E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD — skips entirely otherwise rather
 * than failing, since no live project is connected in most environments
 * this runs in yet.
 *
 * Run once Supabase is set up:
 *   E2E_ADMIN_EMAIL=you@example.com E2E_ADMIN_PASSWORD=... npm run test:e2e
 */
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe("dashboard CRUD (requires a live Supabase project + admin credentials)", () => {
  test.skip(!email || !password, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run this.");

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });
  });

  test("create, edit, and delete a project", async ({ page }) => {
    const title = `E2E Test Project ${Date.now()}`;
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    await page.goto("/dashboard/projects/new");
    await page.getByLabel("Title").fill(title);
    await expect(page.getByLabel("Slug")).toHaveValue(slug);
    await page.getByLabel("Summary").fill("Created by the Playwright E2E suite.");
    await page.getByRole("button", { name: /create project/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/projects$/, { timeout: 10_000 });
    await expect(page.getByRole("cell", { name: title })).toBeVisible();

    await page.getByRole("link", { name: title }).click();
    await page.getByLabel("Summary").fill("Updated by the Playwright E2E suite.");
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/projects$/, { timeout: 10_000 });

    const row = page.getByRole("row", { name: new RegExp(title) });
    await row.getByRole("button").last().click(); // delete trigger
    await page.getByRole("button", { name: /^delete$/i }).click();
    await expect(page.getByRole("cell", { name: title })).toHaveCount(0);
  });

  test("contact messages submitted publicly show up in the inbox", async ({ page, context }) => {
    const uniqueName = `E2E Contact ${Date.now()}`;

    const publicPage = await context.newPage();
    await publicPage.goto("/contact");
    await publicPage.getByLabel("Name").fill(uniqueName);
    await publicPage.getByLabel("Email").fill("e2e-test@example.com");
    await publicPage
      .getByLabel("Message")
      .fill("This message was submitted by the Playwright E2E suite.");
    await publicPage.getByRole("button", { name: /send message/i }).click();
    await expect(publicPage.getByRole("heading", { name: "Message sent" })).toBeVisible({
      timeout: 10_000,
    });

    await page.goto("/dashboard/messages");
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 10_000 });
  });
});
