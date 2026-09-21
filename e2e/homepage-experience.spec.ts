import { test, expect } from "@playwright/test";

test.describe("homepage experience", () => {
  test("hero call-to-action is above the fold on a 1440x900 desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const cta = page.getByRole("link", { name: /view my work/i }).first();
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  });

  test("reduced-motion visitors get no runtime or hydration errors", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
    await context.close();
  });

  test("shows the real client reviews and the pipeline sample video", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Excellent work, fast and super professional/i)).toBeVisible();
    await expect(page.getByText(/results were absolutely extraordinary/i)).toBeVisible();
    await expect(page.locator("video[src*='final-output']").first()).toBeAttached();
  });

  test("project page for the Seraman pipeline includes its sample video", async ({ page }) => {
    await page.goto("/projects/seraman-ai-product-video-pipeline");
    await expect(page.locator("video").first()).toBeAttached();
  });

  test("about page shows the looping clip and the services banner", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("video").first()).toBeAttached();
    await expect(page.getByRole("img", { name: /AI workflow automation services/i })).toBeVisible();
  });
});
