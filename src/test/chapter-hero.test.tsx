import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChapterHero } from "@/components/home/chapter-hero";
import { LiquidBackdrop } from "@/components/home/liquid-backdrop";
import { profile } from "@/content/profile";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Chapter 01: The Engineer (ChapterHero)", () => {
  it("renders display headline and verified profile content", () => {
    render(<ChapterHero />);

    // Display headline
    const heading = screen.getByRole("heading", { level: 1, name: /Ngo Anh Tuan/i });
    expect(heading).toBeInTheDocument();

    // Eyebrow and Status pill
    expect(screen.getByText(/DEV\.OS \/\/ CHAPTER 01/i)).toBeInTheDocument();
    expect(screen.getByText(/OPERATIONAL \/\/ FULLSTACK & AI/i)).toBeInTheDocument();

    // Profile headline & summary
    expect(screen.getByText(profile.headline)).toBeInTheDocument();
    expect(screen.getByText(profile.summary)).toBeInTheDocument();

    // Architecture callout
    expect(screen.getByText(/CORE ARCHITECTURE:/i)).toBeInTheDocument();
  });

  it("renders all essential navigation actions and recruiter CTAs", () => {
    render(<ChapterHero />);

    // Primary CTA
    const enterLink = screen.getByRole("link", { name: /Enter DEV\.OS universe/i });
    expect(enterLink).toHaveAttribute("href", "/universe");

    // Portfolio CTA
    const browseLink = screen.getByRole("link", { name: /Browse portfolio/i });
    expect(browseLink).toHaveAttribute("href", "/projects");

    // Quick View CTA
    const quickViewLink = screen.getByRole("link", { name: /Quick View/i });
    expect(quickViewLink).toHaveAttribute("href", "/workspace");

    // Skip intro
    const skipLink = screen.getByRole("link", { name: /Skip intro/i });
    expect(skipLink).toHaveAttribute("href", "/universe");

    // Quick scan links
    const resumeLink = screen.getByRole("link", { name: /View resume/i });
    expect(resumeLink).toHaveAttribute("href", "/resume");

    const githubLink = screen.getByRole("link", { name: /GitHub ↗/i });
    expect(githubLink).toHaveAttribute("href", profile.githubUrl);
  });

  it("exposes the data-scene-status and data-intro-phase test contracts", () => {
    const { container } = render(<ChapterHero />);

    const sceneWrapper = container.querySelector("[data-scene-status]");
    expect(sceneWrapper).toBeInTheDocument();
    expect(sceneWrapper).toHaveAttribute("data-intro-phase", "idle");

    // Accessible desk illustration is present
    const stage = screen.getByRole("img", { name: /A dark developer desk with a laptop/i });
    expect(stage).toBeInTheDocument();
  });

  it("handles Skip intro click by updating session and navigation", () => {
    render(<ChapterHero />);

    const skipLink = screen.getByRole("link", { name: /Skip intro/i });
    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    clickEvent.preventDefault();
    skipLink.dispatchEvent(clickEvent);

    expect(sessionStorage.getItem("dev-os-universe-arrival")).toBe("1");
  });
});

describe("LiquidBackdrop", () => {
  it("renders the static CSS radial gradient fallback with zero DOM distortion", () => {
    const { container } = render(<LiquidBackdrop />);

    const backdrop = container.firstElementChild as HTMLElement;
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass("pointer-events-none");
    expect(backdrop).toHaveClass("z-0");
  });

  it("accepts paused prop without throwing", () => {
    expect(() => render(<LiquidBackdrop paused={true} />)).not.toThrow();
  });
});
