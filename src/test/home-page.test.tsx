import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import { profile } from "@/content/profile";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Homepage Assembly (Milestone 5)", () => {
  it("assembles all five sequential chapters with valid section IDs", () => {
    const { container } = render(<Home />);

    // Verify all 5 chapter anchors are present in the DOM
    const chapter1 = container.querySelector("#chapter-01");
    const chapter2 = container.querySelector("#chapter-02");
    const chapter3 = container.querySelector("#chapter-03");
    const chapter4 = container.querySelector("#chapter-04");
    const chapter5 = container.querySelector("#chapter-05");

    expect(chapter1).toBeInTheDocument();
    expect(chapter2).toBeInTheDocument();
    expect(chapter3).toBeInTheDocument();
    expect(chapter4).toBeInTheDocument();
    expect(chapter5).toBeInTheDocument();
  });

  it("enforces semantic hierarchy with exactly one h1 on the entire homepage", () => {
    render(<Home />);

    const h1Headings = screen.getAllByRole("heading", { level: 1 });
    expect(h1Headings).toHaveLength(1);
    expect(h1Headings[0]).toHaveTextContent(profile.name);
  });

  it("contains direct route links to all verified portfolio destinations", () => {
    render(<Home />);

    // Chapter 01 CTAs
    expect(screen.getByRole("link", { name: /Enter DEV\.OS/i })).toHaveAttribute("href", "/universe");
    expect(screen.getByRole("link", { name: /Skip intro/i })).toHaveAttribute("href", "/universe");
    expect(screen.getByRole("link", { name: /Browse portfolio/i })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: /Quick View/i })).toHaveAttribute("href", "/workspace");

    // Route continuity destinations
    const aboutLinks = screen.getAllByRole("link", { name: /^About$/i });
    expect(aboutLinks.length).toBeGreaterThanOrEqual(1);
    expect(aboutLinks[0]).toHaveAttribute("href", "/about");

    const resumeLinks = screen.getAllByRole("link", { name: /resume|cv/i });
    expect(resumeLinks.length).toBeGreaterThanOrEqual(1);

    const contactLinks = screen.getAllByRole("link", { name: /Initiate Conversation|contact/i });
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);

    const skillsLinks = screen.getAllByRole("link", { name: /Skills Matrix/i });
    expect(skillsLinks.length).toBeGreaterThanOrEqual(1);
    expect(skillsLinks[0]).toHaveAttribute("href", "/skills");

    const experienceLinks = screen.getAllByRole("link", { name: /Full Experience Ledger/i });
    expect(experienceLinks.length).toBeGreaterThanOrEqual(1);
    expect(experienceLinks[0]).toHaveAttribute("href", "/experience");
  });

  it("renders ScrollProgressRail navigation with 5 chapter anchor controls", () => {
    render(<Home />);

    const rail = screen.getByRole("navigation", { name: "Chapter progress rail" });
    expect(rail).toBeInTheDocument();

    const buttons = screen.getAllByRole("button", { name: /Jump to Chapter/i });
    expect(buttons).toHaveLength(5);
  });

  it("preserves test contract data attributes on ChapterHero", () => {
    const { container } = render(<Home />);

    const sceneStatusEl = container.querySelector("[data-scene-status]");
    expect(sceneStatusEl).toBeInTheDocument();

    const introPhaseEl = container.querySelector("[data-intro-phase]");
    expect(introPhaseEl).toBeInTheDocument();
  });
});
