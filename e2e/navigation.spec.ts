import { test, expect } from "@playwright/test";

const publicPages = [
  { path: "/", heading: /Adelaja Obanijesu Israel/i },
  { path: "/about", heading: /developer, creator, and problem-solver/i },
  { path: "/skills", heading: /skills & tools/i },
  { path: "/projects", heading: /projects/i },
  { path: "/blog", heading: /blog/i },
  { path: "/testimonials", heading: /testimonials/i },
  { path: "/resume", heading: /adelaja obanijesu israel/i },
  { path: "/contact", heading: /let.s build something/i },
];

for (const { path, heading } of publicPages) {
  test(`${path} loads with no console errors and a real heading`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(heading);
    expect(errors, `console/page errors on ${path}:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("navbar links route to the right pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/projects/i);
});

test("unknown route shows the branded 404 with working way back", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("This page doesn't exist")).toBeVisible();

  await page.getByRole("link", { name: /back to home/i }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("unknown project slug 404s within the site chrome (nav still present)", async ({ page }) => {
  const response = await page.goto("/projects/this-project-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("This page doesn't exist")).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Projects", exact: true })
  ).toBeVisible();
});
