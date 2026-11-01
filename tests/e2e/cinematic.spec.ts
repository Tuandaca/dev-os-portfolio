import { expect, test } from "@playwright/test";

test.describe("cinematic landing", () => {
  test("the laptop opens and hands focus to the workspace", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 850 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const scene = page.locator("[data-scene-status]");
    await expect(scene).toHaveAttribute("data-scene-status", "ready", { timeout: 30_000 });
    await expect(scene.locator("canvas")).toBeVisible();

    await page.getByRole("link", { name: /Enter DEV\.OS/ }).click();
    await expect(page.getByRole("link", { name: /Skip intro/i })).toBeVisible();
    await expect(page.locator("[data-intro-phase]")).toHaveAttribute("data-intro-phase", "boot", { timeout: 5_000 });
    await expect(page).toHaveURL(/\/workspace$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Explore DEV.OS" })).toBeFocused();

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Browse portfolio" })).toBeVisible();
  });

  test("Skip intro is available as soon as the animated entry starts", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 850 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await expect(page.locator("[data-scene-status]")).toHaveAttribute("data-scene-status", "ready", { timeout: 30_000 });

    await page.getByRole("link", { name: /Enter DEV\.OS/ }).focus();
    await page.keyboard.press("Enter");
    const skip = page.getByRole("link", { name: /Skip intro/i });
    await expect(skip).toBeVisible();
    await skip.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/workspace$/);
    await expect(page.getByRole("heading", { name: "Explore DEV.OS" })).toBeFocused();
  });

  test("reduced motion bypasses WebGL and the timed intro", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 850 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("link", { name: /Enter DEV\.OS/ })).toBeVisible();
    await expect(page.locator("[data-scene-status]")).toHaveAttribute("data-scene-status", "fallback");
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.getByRole("link", { name: /Enter DEV\.OS/ }).click();
    await expect(page).toHaveURL(/\/workspace$/);
    await expect(page.getByRole("heading", { name: "Explore DEV.OS" })).toBeFocused();
  });

  test("unavailable WebGL leaves both ordinary routes usable", async ({ page }) => {
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId, ...args) {
        if (contextId === "webgl" || contextId === "webgl2" || contextId === "experimental-webgl") return null;
        return getContext.call(this, contextId, ...args);
      } as typeof HTMLCanvasElement.prototype.getContext;
    });
    await page.setViewportSize({ width: 1365, height: 850 });
    await page.goto("/");

    await expect(page.locator("[data-scene-status]")).toHaveAttribute("data-scene-status", "fallback");
    await expect(page.getByRole("link", { name: "Browse portfolio" })).toHaveAttribute("href", "/projects");
    await page.getByRole("link", { name: /Enter DEV\.OS/ }).click();
    await expect(page).toHaveURL(/\/workspace$/);
    await expect(page.getByRole("heading", { name: "Explore DEV.OS" })).toBeFocused();
  });

  test("mobile renders a static hero and keeps recruiter navigation readable", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/");

    await expect(page.locator("[data-scene-status]")).toHaveAttribute("data-scene-status", "fallback");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Enter DEV\.OS/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse portfolio" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.getByRole("link", { name: "Browse portfolio" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("heading", { name: "Selected engineering work" })).toBeVisible();
  });

  test("links remain usable with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto("/");
      await expect(page.getByRole("heading", { name: /Ngo Anh Tuan/ })).toBeVisible();
      await expect(page.locator("canvas")).toHaveCount(0);
      await page.getByRole("link", { name: /Enter DEV\.OS/ }).click();
      await expect(page).toHaveURL(/\/workspace$/);
      await expect(page.getByRole("heading", { name: "Explore DEV.OS" })).toBeVisible();

      await page.goto("/");
      await page.getByRole("link", { name: "Browse portfolio" }).click();
      await expect(page).toHaveURL(/\/projects$/);
    } finally {
      await context.close();
    }
  });
});
