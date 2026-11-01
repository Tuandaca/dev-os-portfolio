import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChapterDna } from "@/components/home/chapter-dna";
import { ScrollProgressRail } from "@/components/home/scroll-progress-rail";
import { ChapterJourney } from "@/components/home/chapter-journey";
import { ChapterSystem } from "@/components/home/chapter-system";
import { ChapterClosing } from "@/components/home/chapter-closing";
import { profile } from "@/content/profile";

describe("Chapter 02: Engineering DNA", () => {
  it("renders all six verified skill clusters and allows category selection", () => {
    render(<ChapterDna />);

    // Check heading
    expect(screen.getByRole("heading", { level: 2, name: /Architectural Breadth/i })).toBeInTheDocument();

    // Check all 6 clusters are rendered
    expect(screen.getByRole("tab", { name: /Frontend Engineering/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Backend & APIs/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Databases & Infrastructure/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /AI & RAG Engineering/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Software Architecture/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /AI-Augmented Development/i })).toBeInTheDocument();

    // Default selection is frontend
    expect(screen.getByRole("tab", { name: /Frontend Engineering/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/Conceptual interface cycle/i)).toBeInTheDocument();

    // Select Backend & APIs
    fireEvent.click(screen.getByRole("tab", { name: /Backend & APIs/i }));
    expect(screen.getByRole("tab", { name: /Backend & APIs/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/Conceptual API cycle/i)).toBeInTheDocument();
    expect(screen.getByText("FastAPI")).toBeInTheDocument();
  });
});

describe("ScrollProgressRail", () => {
  it("renders 5 chapter indicators with accessibility attributes", () => {
    render(<ScrollProgressRail />);

    const nav = screen.getByRole("navigation", { name: "Chapter progress rail" });
    expect(nav).toBeInTheDocument();

    // 5 buttons for chapters 01 to 05
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    expect(buttons[0]).toHaveAttribute("aria-label", "Jump to Chapter 01: The Engineer");
    expect(buttons[1]).toHaveAttribute("aria-label", "Jump to Chapter 02: Engineering DNA");
    expect(buttons[2]).toHaveAttribute("aria-label", "Jump to Chapter 03: The Journey");
    expect(buttons[3]).toHaveAttribute("aria-label", "Jump to Chapter 04: Inside the System");
    expect(buttons[4]).toHaveAttribute("aria-label", "Jump to Chapter 05: Let's Build");
  });
});

describe("Chapter 03: The Journey", () => {
  it("renders verified CV milestones and filters correctly", () => {
    render(<ChapterJourney />);

    expect(screen.getByRole("heading", { level: 2, name: /Verified Career/i })).toBeInTheDocument();

    // Check all 4 verified CV milestones are present
    expect(screen.getByText("IT Department, Van Lang University")).toBeInTheDocument();
    expect(screen.getByText("Freelance · Rating Task")).toBeInTheDocument();
    expect(screen.getByText("Ton Duc Thang University")).toBeInTheDocument();
    expect(screen.getByText("British Council Assessment")).toBeInTheDocument();

    // Verify GPA 7.01/10
    expect(screen.getByText(/Cumulative GPA: 7.01\/10/i)).toBeInTheDocument();

    // Filter by Work History
    fireEvent.click(screen.getByRole("button", { name: /Work History/i }));
    expect(screen.getByText("IT Department, Van Lang University")).toBeInTheDocument();
    expect(screen.getByText("Freelance · Rating Task")).toBeInTheDocument();
    expect(screen.queryByText("Ton Duc Thang University")).not.toBeInTheDocument();

    // Filter by Education
    fireEvent.click(screen.getByRole("button", { name: /Education & Certs/i }));
    expect(screen.queryByText("IT Department, Van Lang University")).not.toBeInTheDocument();
    expect(screen.getByText("Ton Duc Thang University")).toBeInTheDocument();
    expect(screen.getByText("British Council Assessment")).toBeInTheDocument();
  });
});

describe("Chapter 04: Inside the System", () => {
  it("renders conceptual system diagram and clickable subsystem cards", () => {
    render(<ChapterSystem />);

    expect(screen.getByRole("heading", { level: 2, name: /Full-Stack Architecture/i })).toBeInTheDocument();

    // Subsystem tabs
    expect(screen.getByRole("tab", { name: /Presentation & Edge Interface/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Realtime Coordination & Locking/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Application Services & Storage/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /AI & Multimodal RAG Engine/i })).toBeInTheDocument();

    // Switch to Realtime tier
    fireEvent.click(screen.getByRole("tab", { name: /Realtime Coordination & Locking/i }));
    expect(screen.getByText(/Cinema Ticket Booking Platform/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cinema Study/i })).toHaveAttribute("href", "/projects/cinema");

    // Switch to AI tier
    fireEvent.click(screen.getByRole("tab", { name: /AI & Multimodal RAG Engine/i }));
    expect(screen.getByText(/Travel AI Multimodal RAG System/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Travel AI Study/i })).toHaveAttribute("href", "/projects/travel-ai");
  });
});

describe("Chapter 05: Let's Build Something", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders verified profile contact information and CTAs", async () => {
    render(<ChapterClosing />);

    expect(screen.getByRole("heading", { level: 2, name: /Ready to Engineer/i })).toBeInTheDocument();

    // Verified contact info
    expect(screen.getByText(profile.email)).toBeInTheDocument();
    expect(screen.getByText(profile.phone)).toBeInTheDocument();
    expect(screen.getByText(profile.location)).toBeInTheDocument();

    // Action CTAs
    expect(screen.getByRole("link", { name: /Initiate Conversation/i })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: /GitHub Profile/i })).toHaveAttribute("href", profile.githubUrl);
    expect(screen.getByRole("link", { name: /Download CV/i })).toHaveAttribute("href", profile.resumeUrl);

    // Copy email button
    const copyButton = screen.getByRole("button", { name: /Copy verified email address/i });
    expect(copyButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(profile.email);
  });
});
