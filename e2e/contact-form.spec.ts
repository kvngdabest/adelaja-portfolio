import { test, expect } from "@playwright/test";

test.describe("contact form", () => {
  test("shows client-side validation errors without hitting the network", async ({ page }) => {
    await page.goto("/contact");

    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Enter a valid email")).toBeVisible();
    await expect(page.getByText(/message must be at least/i)).toBeVisible();
  });

  test("rejects an invalid email without submitting", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Message").fill("This is a long enough message to pass validation.");
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText("Enter a valid email")).toBeVisible();
  });

  test("a well-formed submission is handled gracefully (no live Supabase project in this environment)", async ({
    page,
  }) => {
    await page.goto("/contact");

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Message").fill("I'd like to talk about an automation project.");
    await page.getByRole("button", { name: /send message/i }).click();

    // Without NEXT_PUBLIC_SUPABASE_URL configured, the server action can't
    // reach a database — it should fail with a friendly toast rather than
    // crash or hang. Once a real Supabase project is connected, this
    // resolves to the success panel instead; either is an acceptable,
    // non-broken outcome for this test.
    const errorToast = page.getByText(/site isn.t connected to a database yet/i);
    const successPanel = page.getByRole("heading", { name: "Message sent" });
    await expect(errorToast.or(successPanel)).toBeVisible({ timeout: 10_000 });
  });
});
