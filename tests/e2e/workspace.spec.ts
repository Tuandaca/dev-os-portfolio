import { expect, test } from "@playwright/test";

test("landing offers direct and workspace paths", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Enter DEV\.OS/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse portfolio" })).toHaveAttribute("href", "/projects");
  await page.getByRole("link", { name: /Enter DEV\.OS/ }).click();
  await expect(page).toHaveURL(/\/workspace$/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Explore DEV.OS" })).toBeVisible();
});

test("known deep link opens a project and unknown app falls back", async ({ page }) => {
  await page.goto("/workspace?app=projects&project=cinema");
  await expect(page.locator("#os-window-title-projects")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open case study/ })).toHaveAttribute("href", "/projects/cinema");

  await page.goto("/workspace?app=unlisted");
  await expect(page.locator("#os-window-title-about")).toBeVisible();
});

test("launcher and command palette open apps by keyboard", async ({ page }) => {
  await page.goto("/workspace");
  await page.getByRole("button", { name: "Apps", exact: true }).click();
  await page.getByRole("button", { name: "Terminal", exact: true }).click();
  await expect(page.locator("#os-window-title-terminal")).toBeVisible();
  await page.getByRole("textbox", { name: /Command/ }).fill("projects");
  await page.getByRole("button", { name: "Run" }).click();
  await expect(page.locator("#os-window-title-projects")).toBeVisible();

  await page.getByRole("button", { name: /Search Ctrl K/ }).click();
  await page.getByRole("textbox", { name: "Open an app" }).fill("contact");
  await page.keyboard.press("Enter");
  await expect(page.locator("#os-window-title-contact")).toBeVisible();
  await expect(page).toHaveURL(/app=contact/);
});

test("workspace retains direct links without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/workspace");
    await expect(page.getByRole("heading", { name: "Explore DEV.OS" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Direct portfolio pages" }).getByRole("link", { name: "Projects" })).toBeVisible();
  } finally {
    await context.close();
  }
});

test("mobile workspace keeps one readable window and restores browser history", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/workspace?app=about");
  await page.getByRole("button", { name: "Apps", exact: true }).click();
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await expect(page.locator("#os-window-title-projects")).toBeVisible();
  await expect(page.locator("#os-window-title-about")).toBeHidden();
  await page.goBack();
  await expect(page.locator("#os-window-title-about")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("desktop window drag stays within the visible workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/workspace");
  const windowFrame = page.locator('section[aria-labelledby="os-window-title-about"]');
  const handle = page.getByTitle("Drag window within the desktop");
  const before = await windowFrame.boundingBox();
  const handleBox = await handle.boundingBox();
  expect(before && handleBox).toBeTruthy();
  if (!before || !handleBox) return;

  await page.mouse.move(handleBox.x + 40, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + 180, handleBox.y + handleBox.height / 2, { steps: 5 });
  await page.mouse.up();
  const after = await windowFrame.boundingBox();
  expect(after).not.toBeNull();
  expect(after!.x).toBeGreaterThan(before.x + 20);
  expect(after!.x + after!.width).toBeLessThanOrEqual(1440);
});
