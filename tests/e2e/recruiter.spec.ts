import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";

const mainRoutes = ["/", "/about", "/experience", "/projects", "/skills", "/resume", "/contact"];
const projects = ["cinema", "travel-ai", "gymlvl", "business-websites"];
const caseStudyHeadings = [
  "Problem", "Objectives", "My contributions", "Architecture", "Technology stack",
  "Engineering decisions", "Challenges", "Verified results", "Source and live demo",
];

test("recruiter routes have semantic content and navigation", async ({ page }) => {
  for (const route of mainRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1"), route).toHaveCount(1);
    await expect(page.locator("main"), route).toBeVisible();
    expect(await page.title(), route).toContain("DEV.OS");
  }

  await page.goto("/");
  for (const [name, href] of [
    ["About", "/about"], ["Experience", "/experience"], ["Projects", "/projects"],
    ["Skills", "/skills"], ["Resume", "/resume"], ["Contact", "/contact"],
  ]) {
    await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name })).toHaveAttribute("href", href);
  }
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
});

test("four project slugs render the required case-study sections", async ({ page }) => {
  await page.goto("/projects");
  for (const slug of projects) {
    await expect(page.locator(`a[href="/projects/${slug}"]`)).toBeVisible();
  }
  for (const slug of projects) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status(), slug).toBe(200);
    await expect(page.locator("main h1"), slug).toHaveCount(1);
    for (const heading of caseStudyHeadings) {
      await expect(page.getByRole("heading", { name: heading, exact: true }), `${slug}: ${heading}`).toBeVisible();
    }
  }

  const missing = await page.goto("/projects/unknown-project");
  expect(missing?.status()).toBe(404);
});

test("case-study links reflect verified source and demo scope", async ({ page }) => {
  await page.goto("/projects/travel-ai");
  await expect(page.locator("main h1")).toContainText("Multimodal RAG Q&A System");
  await expect(page.locator('a[href*="github.com/Tuandaca/DACNTT"]')).toHaveCount(0);
  await expect(page.getByText("TODO", { exact: true }).first()).toBeVisible();

  await page.goto("/projects/gymlvl");
  await expect(page.locator('a[href="https://github.com/Tuandaca/gymlvl"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "My contributions" }).locator(".." )).toContainText("TODO");

  await page.goto("/projects/business-websites");
  await expect(page.locator('a[href="https://bussiness-website-v1.vercel.app/"]')).toBeVisible();
  await expect(page.locator('a[href*="v0-business-website-build-gamma.vercel.app"]')).toHaveCount(0);
});

test("the approved resume link serves the original PDF", async ({ page, request }) => {
  await page.goto("/resume");
  const href = "/resume/NgoAnhTuan2y_fullstack_Eng.pdf";
  const downloadLink = page.getByRole("link", { name: /Download PDF/ });
  await expect(downloadLink).toHaveAttribute("href", href);
  await expect(downloadLink).toHaveAttribute("download", "");
  const [download] = await Promise.all([page.waitForEvent("download"), downloadLink.click()]);
  expect(download.suggestedFilename()).toBe("NgoAnhTuan2y_fullstack_Eng.pdf");
  const response = await request.get(href);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(createHash("sha256").update(await response.body()).digest("hex").toUpperCase()).toBe(
    "2F7154E61F5DB72E9E272C9BA3F69A5D56836C1EB13185E7D918C1F79F10880A",
  );
});

test("recruiter pages stay usable at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const route of ["/", "/projects", "/projects/business-websites", "/contact", "/resume"]) {
    await page.goto(route);
    await expect(page.locator("main h1"), route).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
  }
});
