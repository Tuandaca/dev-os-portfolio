import { expect, test } from "@playwright/test";

test("unknown routes return a usable portfolio fallback", async ({ page }) => {
  const response = await page.goto("/not-a-real-dev-os-route");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found." })).toBeVisible();

  const fallback = page.getByRole("navigation", { name: "Portfolio fallback pages" });
  for (const [name, href] of [
    ["Home", "/"],
    ["Projects", "/projects"],
    ["Resume", "/resume"],
    ["Contact", "/contact"],
  ]) {
    await expect(fallback.getByRole("link", { name })).toHaveAttribute("href", href);
  }
});

test("contact actions, metadata, and keyboard skip link stay usable", async ({ page }) => {
  await page.goto("/contact");
  await expect(page).toHaveTitle(/Contact.*DEV\.OS/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Contact Ngo Anh Tuan/);

  const contact = page.getByRole("region", { name: "Contact options" });
  await expect(contact.getByRole("link", { name: /Email/ })).toHaveAttribute("href", "mailto:ngoanhtuan23.it@gmail.com");
  await expect(contact.getByRole("link", { name: /Phone/ })).toHaveAttribute("href", "tel:0917940833");
  await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute("rel", /noopener noreferrer/);

  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /Enter DEV\.OS/ })).toBeFocused();
});
