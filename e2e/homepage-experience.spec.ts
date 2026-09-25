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

  test("shows the real client reviews", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Excellent work, fast and super professional/i)).toBeVisible();
    await expect(page.getByText(/results were absolutely extraordinary/i)).toBeVisible();
  });

  test("each showcase section plays its own project's video", async ({ page }) => {
    await page.goto("/");
    // Seraman client work and the owner's own n8n system are separate projects;
    // neither section may show the other's video.
    const seraman = page.locator("section", { hasText: "One product image in" }).first();
    await expect(
      seraman.locator("video[src*='seraman-ai-product-video-pipeline']")
    ).toBeAttached();

    const system = page.locator("section", { hasText: "AI operations system I run" }).first();
    await expect(system.locator("video[src*='oba-ai-operations-system']")).toBeAttached();
  });

  test("project page for the Seraman pipeline includes its sample video", async ({ page }) => {
    await page.goto("/projects/seraman-ai-product-video-pipeline");
    await expect(page.locator("video").first()).toBeAttached();
  });

  test("about page shows the intro video, headshot, email and services banner", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("video[src*='intro.mp4']")).toBeAttached();
    await expect(page.getByRole("img", { name: "Adelaja Obanijesu Israel" })).toBeVisible();
    await expect(page.getByRole("link", { name: "adelajaobanijesu@gmail.com" })).toBeVisible();
    await expect(page.getByRole("img", { name: /AI workflow automation services/i })).toBeVisible();
  });
});
