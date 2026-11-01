"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/class-names";

interface ChapterItem {
  id: string;
  number: string;
  title: string;
  shortLabel: string;
}

const chapters: readonly ChapterItem[] = [
  { id: "chapter-01", number: "01", title: "The Engineer", shortLabel: "HERO" },
  { id: "chapter-02", number: "02", title: "Engineering DNA", shortLabel: "DNA" },
  { id: "chapter-03", number: "03", title: "The Journey", shortLabel: "JOURNEY" },
  { id: "chapter-04", number: "04", title: "Inside the System", shortLabel: "SYSTEM" },
  { id: "chapter-05", number: "05", title: "Let's Build", shortLabel: "CLOSING" },
];

export function ScrollProgressRail() {
  const [activeId, setActiveId] = useState<string>("chapter-01");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    // Collect all existing chapter target elements
    const elements = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;
    if (typeof window === "undefined" || typeof window.IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible sections sorted by intersection ratio
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: [0.1, 0.3, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="Chapter progress rail"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:flex flex-col items-center"
    >
      <div className="relative flex flex-col items-center gap-4 rounded-full border border-dev-border/90 bg-dev-surface/80 p-2.5 shadow-window backdrop-blur-md">
        {/* Background connector track line */}
        <div
          aria-hidden="true"
          className="absolute top-4 bottom-4 w-px bg-dev-border/60"
        />

        {chapters.map((chapter) => {
          const isActive = activeId === chapter.id;
          const isHovered = hoveredId === chapter.id;

          return (
            <div
              key={chapter.id}
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHoveredId(chapter.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip on hover / active */}
              {(isHovered || isActive) && (
                <div
                  role="tooltip"
                  id={`tooltip-${chapter.id}`}
                  className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-dev-border-bright bg-dev-elevated/95 px-2.5 py-1 font-mono text-[11px] text-dev-text shadow-window backdrop-blur-sm transition-opacity duration-fast"
                >
                  <span className={cn("font-bold mr-1.5", isActive ? "text-dev-neon" : "text-dev-accent")}>
                    {chapter.number}
                  </span>
                  <span>{chapter.title}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleScrollTo(chapter.id)}
                aria-label={`Jump to Chapter ${chapter.number}: ${chapter.title}`}
                aria-current={isActive ? "location" : undefined}
                aria-describedby={`tooltip-${chapter.id}`}
                className={cn(
                  "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-fast",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon focus-visible:ring-offset-2 focus-visible:ring-offset-dev-bg",
                  isActive
                    ? "bg-dev-elevated ring-1 ring-dev-neon/50 scale-110"
                    : "hover:bg-dev-elevated/80"
                )}
              >
                {/* Visual pip */}
                <span
                  className={cn(
                    "block rounded-full transition-all duration-fast",
                    isActive
                      ? "h-2.5 w-2.5 bg-dev-neon shadow-glow-neon ring-1 ring-dev-neon"
                      : "h-2 w-2 bg-dev-border-bright hover:bg-dev-accent/70"
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
