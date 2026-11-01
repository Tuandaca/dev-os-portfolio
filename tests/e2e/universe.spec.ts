import { expect, test } from "@playwright/test";

const stationNav = (page: import("@playwright/test").Page) => page.getByRole("navigation", { name: "Universe stations" });

test("the immersive route connects all four camera stops to useful HTML content", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1365, height: 850 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/universe");

  await expect(page.getByRole("heading", { name: /Explore the DEV\.OS universe/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Fast portfolio access" }).getByRole("link", { name: /Quick View/ })).toHaveAttribute("href", "/workspace");
  const scene = page.locator("[data-universe-scene-status]");
  await expect(scene).toHaveAttribute("data-universe-scene-status", "ready", { timeout: 30_000 });
  await expect(scene.locator("canvas")).toBeVisible();
  await expect(scene.locator("[data-camera-view]")).toHaveAttribute("data-camera-view", "overview", { timeout: 5_000 });

  const nav = stationNav(page);
  for (const label of ["Overview", "Skills", "Systems", "Connect"]) {
    await expect(nav.getByRole("button", { name: new RegExp(label) })).toBeVisible();
  }

  await nav.getByRole("button", { name: /Skills/ }).click();
  await expect(scene).toHaveAttribute("data-universe-view", "skills");
  await expect(scene.locator("[data-camera-view]")).toHaveAttribute("data-camera-view", "skills", { timeout: 5_000 });

  const clusters = page.getByRole("region", { name: "Skill clusters" });
  for (const label of ["Frontend Engineering", "Backend & APIs", "Databases & Infrastructure", "AI & RAG Engineering", "Software Architecture", "AI-Augmented Development"]) {
    await expect(clusters.getByRole("button", { name: label })).toBeVisible();
  }
  await clusters.getByRole("button", { name: "AI & RAG Engineering" }).click();
  const detail = page.getByRole("region", { name: "Skill detail" });
  await expect(detail).toHaveAttribute("data-active-skill", "ai");
  await expect(detail).toContainText("FAISS");
  await expect(detail).toContainText("RAG");

  await nav.getByRole("button", { name: /Systems/ }).click();
  await expect(scene).toHaveAttribute("data-universe-view", "systems");
  await expect(scene.locator("[data-camera-view]")).toHaveAttribute("data-camera-view", "systems", { timeout: 5_000 });
  await expect(page.getByRole("heading", { name: "Conceptual system flow" })).toBeVisible();
  await expect(page.getByText(/not live systems/)).toBeVisible();
  const flows = page.getByLabel("Conceptual flow selector");
  await expect(flows.getByRole("button", { name: "API request" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Next step/ }).click();
  await expect(page.locator('[aria-current="step"]')).toContainText("REST API");
  await flows.getByRole("button", { name: "RAG retrieval" }).click();
  await expect(page.locator("[data-active-flow]")).toHaveAttribute("data-active-flow", "rag");
  await expect(page.locator('[aria-current="step"]')).toContainText("Question");
  await flows.getByRole("button", { name: "AI-assisted workflow" }).click();
  await expect(page.locator("[data-active-flow]")).toHaveAttribute("data-active-flow", "agents");

  await nav.getByRole("button", { name: /Connect/ }).click();
  await expect(scene).toHaveAttribute("data-universe-view", "contact");
  await expect(scene.locator("[data-camera-view]")).toHaveAttribute("data-camera-view", "contact", { timeout: 5_000 });
  await expect(scene.getByRole("link", { name: /View resume/ })).toHaveAttribute("href", "/resume");
  await expect(page.getByRole("link", { name: /Explore GitHub/ })).toHaveAttribute("rel", /noopener noreferrer/);

  await page.getByRole("button", { name: "Use static view" }).click();
  await expect(scene).toHaveAttribute("data-universe-scene-status", "fallback");
  await expect(scene.locator("canvas")).toHaveCount(0);
  await nav.getByRole("button", { name: /Skills/ }).click();
  await expect(page.getByRole("region", { name: "Skill detail" })).toBeVisible();
});

test("station and skill controls work by keyboard without requiring the Canvas", async ({ page }) => {
  await page.setViewportSize({ width: 1365, height: 850 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/universe");

  const scene = page.locator("[data-universe-scene-status]");
  await expect(scene).toHaveAttribute("data-universe-scene-status", "fallback");
  await expect(scene.locator("canvas")).toHaveCount(0);
  const skills = stationNav(page).getByRole("button", { name: /Skills/ });
  await skills.focus();
  await page.keyboard.press("Enter");
  await expect(skills).toHaveAttribute("aria-pressed", "true");
  await expect(scene).toHaveAttribute("data-universe-view", "skills");

  const architecture = page.getByRole("region", { name: "Skill clusters" }).getByRole("button", { name: "Software Architecture" });
  await architecture.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("region", { name: "Skill detail" })).toHaveAttribute("data-active-skill", "architecture");
  await expect(architecture).toHaveAttribute("aria-pressed", "true");
});

test("mobile uses the HTML workstation without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/universe");

  const scene = page.locator("[data-universe-scene-status]");
  await expect(scene).toHaveAttribute("data-universe-scene-status", "fallback");
  await expect(scene.locator("canvas")).toHaveCount(0);
  await stationNav(page).getByRole("button", { name: /Systems/ }).click();
  await expect(page.getByRole("heading", { name: "Conceptual system flow" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("navigation", { name: "Fast portfolio access" }).getByRole("link", { name: /Quick View/ }).click();
  await expect(page).toHaveURL(/\/workspace$/);
});

test("WebGL failure keeps station controls and recruiter links usable", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId, ...args) {
      if (contextId === "webgl" || contextId === "webgl2" || contextId === "experimental-webgl") return null;
      return getContext.call(this, contextId, ...args);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.setViewportSize({ width: 1365, height: 850 });
  await page.goto("/universe");

  const scene = page.locator("[data-universe-scene-status]");
  await expect(scene).toHaveAttribute("data-universe-scene-status", "fallback");
  await expect(scene.locator("canvas")).toHaveCount(0);
  await stationNav(page).getByRole("button", { name: /Connect/ }).click();
  await expect(page.getByRole("link", { name: /View resume/ })).toHaveAttribute("href", "/resume");
  await page.getByRole("link", { name: /Contact →/ }).click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("the universe keeps direct portfolio routes usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/universe");
    await expect(page.getByRole("heading", { name: /Explore the DEV\.OS universe/ })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Direct recruiter pages" }).getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");
    await page.getByRole("navigation", { name: "Fast portfolio access" }).getByRole("link", { name: /Quick View/ }).click();
    await expect(page).toHaveURL(/\/workspace$/);
  } finally {
    await context.close();
  }
});
