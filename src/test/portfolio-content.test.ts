import { describe, expect, it } from "vitest";
import { featuredProjects, getFeaturedProject } from "@/content/projects";

describe("published project content guardrails", () => {
  it("has unique URL-safe slugs and all required sourced or TODO sections", () => {
    const slugs = featuredProjects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(["cinema", "travel-ai", "gymlvl", "business-websites"]);

    for (const project of featuredProjects) {
      expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getFeaturedProject(project.slug)).toBe(project);
      for (const section of Object.values(project.caseStudy)) {
        if (section.status === "TODO") {
          expect(section.note.trim().length).toBeGreaterThan(10);
        } else {
          expect(section.items.length).toBeGreaterThan(0);
          for (const item of section.items) {
            expect(item.text.trim().length).toBeGreaterThan(10);
            expect(["CV", "Repository code", "Repository documentation"]).toContain(item.source);
          }
        }
      }
    }
  });

  it("withholds unresolved links and individual contribution claims", () => {
    const travel = getFeaturedProject("travel-ai")!;
    expect(travel.title).toContain("Multimodal RAG Q&A System");
    expect(travel.repositoryUrl).toBeUndefined();
    expect(travel.repositoryLinks).toBeUndefined();
    expect(travel.liveDemoLinks).toBeUndefined();

    for (const slug of ["gymlvl", "business-websites"]) {
      const project = getFeaturedProject(slug)!;
      expect(project.kind).toBe("Public repository sample");
      expect(project.caseStudy.contributions.status).toBe("TODO");
      expect(project.caseStudy.verifiedResults.status).toBe("TODO");
    }

    const business = getFeaturedProject("business-websites")!;
    expect(business.liveDemoLinks?.map((link) => link.url)).toEqual([
      "https://bussiness-website-v1.vercel.app/",
    ]);
  });
});
