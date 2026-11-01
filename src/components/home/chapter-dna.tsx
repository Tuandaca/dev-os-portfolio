"use client";

import { useState } from "react";
import Link from "next/link";
import { skillClusters, type SkillClusterId } from "@/content/skill-universe";
import { cn } from "@/components/ui/class-names";

export function ChapterDna() {
  const [selectedId, setSelectedId] = useState<SkillClusterId>("frontend");
  const selectedCluster = skillClusters.find((cluster) => cluster.id === selectedId) ?? skillClusters[0];

  return (
    <section
      id="chapter-02"
      aria-labelledby="chapter-dna-heading"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-16 px-4 py-20 sm:scroll-mt-20 sm:px-6 md:py-28 lg:px-8"
    >
      {/* Chapter header */}
      <div className="mb-12 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-dev-border bg-dev-surface/90 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-dev-accent backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-dev-neon shadow-glow-neon animate-pulse" />
          <span>{"Chapter 02 // Engineering DNA"}</span>
        </div>
        <h2
          id="chapter-dna-heading"
          className="mt-4 font-display text-3xl font-bold tracking-tight text-dev-text sm:text-5xl lg:text-6xl"
        >
          Architectural Breadth &amp; <br className="hidden sm:inline" />
          <span className="text-dev-accent">Engineering Capabilities</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-dev-secondary sm:text-lg">
          Six foundational engineering domains backed by verified CV competencies. Select any domain to inspect the core
          toolchains, conceptual system loops, and architectural flow.
        </p>
      </div>

      {/* 6 Category Cards Grid */}
      <div
        role="tablist"
        aria-label="Engineering skill categories"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillClusters.map((cluster, index) => {
          const isSelected = cluster.id === selectedId;
          const indexFormatted = String(index + 1).padStart(2, "0");

          return (
            <button
              key={cluster.id}
              role="tab"
              id={`dna-tab-${cluster.id}`}
              aria-selected={isSelected}
              aria-controls={`dna-panel-${cluster.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedId(cluster.id)}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl p-5 text-left transition-all duration-standard sm:p-6",
                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon focus-visible:ring-offset-2 focus-visible:ring-offset-dev-bg",
                isSelected
                  ? "border-dev-neon bg-dev-elevated shadow-glow-neon"
                  : "border-dev-border bg-dev-surface/80 hover:border-dev-border-bright hover:bg-dev-elevated/70"
              )}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-dev-muted">
                  <span className={cn("transition-colors", isSelected ? "text-dev-neon font-semibold" : "group-hover:text-dev-accent")}>
                    {`CLUSTER // ${indexFormatted}`}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider transition-colors",
                      isSelected
                        ? "bg-dev-neon/15 text-dev-neon border border-dev-neon/40"
                        : "bg-dev-surface text-dev-muted border border-dev-border group-hover:text-dev-text"
                    )}
                  >
                    {isSelected ? "Active" : "Inspect"}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-xl font-semibold text-dev-text group-hover:text-dev-accent transition-colors">
                  {cluster.label}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-dev-secondary sm:text-sm line-clamp-2">
                  {cluster.description}
                </p>
              </div>

              {/* Technologies preview chips */}
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-dev-border/50 pt-3">
                {cluster.items.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-dev-bg/80 px-2 py-0.5 font-mono text-[11px] text-dev-secondary border border-dev-border/60"
                  >
                    {tech}
                  </span>
                ))}
                {cluster.items.length > 4 ? (
                  <span className="rounded bg-dev-bg/40 px-1.5 py-0.5 font-mono text-[10px] text-dev-muted">
                    +{cluster.items.length - 4}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Inspector Panel */}
      <div
        id={`dna-panel-${selectedCluster.id}`}
        role="tabpanel"
        aria-labelledby={`dna-tab-${selectedCluster.id}`}
        className="mt-8 rounded-2xl border border-dev-border-bright bg-dev-elevated p-6 shadow-window sm:p-8 lg:p-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-dev-accent/40 bg-dev-accent/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-dev-accent">
                Verified CV Inventory
              </span>
              <span className="font-mono text-xs text-dev-muted">
                Domain ID: <code className="text-dev-text">skill.{selectedCluster.id}</code>
              </span>
            </div>

            <h3 className="mt-3 font-display text-2xl font-bold text-dev-text sm:text-3xl">
              {selectedCluster.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dev-secondary sm:text-base">
              {selectedCluster.description}
            </p>
          </div>

          {/* Quick link actions */}
          <div className="flex flex-wrap gap-3 font-mono text-xs">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 rounded-md border border-dev-accent bg-dev-accent/10 px-4 py-2 font-medium text-dev-accent transition-colors hover:bg-dev-accent hover:text-dev-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
            >
              <span>Skills Matrix</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/universe"
              className="inline-flex items-center gap-2 rounded-md border border-dev-border-bright bg-dev-surface px-4 py-2 font-medium text-dev-text transition-colors hover:border-dev-accent hover:text-dev-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
            >
              <span>Explore in 3D Universe</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Verified Tools and Technologies */}
        <div className="mt-8 border-t border-dev-border/70 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dev-muted">
            Verified Technologies &amp; Capabilities
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCluster.items.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dev-border-bright bg-dev-surface px-3 py-1.5 font-mono text-xs text-dev-text transition-colors hover:border-dev-accent/60 hover:text-dev-accent"
              >
                <span className="h-1 w-1 rounded-full bg-dev-neon" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Conceptual Architecture Cycle */}
        <div className="mt-8 rounded-xl border border-dev-border bg-dev-surface/90 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-dev-accent">
              {`Architecture Concept // ${selectedCluster.concept.label}`}
            </p>
            <span className="font-mono text-[11px] text-dev-muted">Conceptual model · Not a live trace</span>
          </div>

          {/* Stepped Flow Diagram */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            {selectedCluster.concept.steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-dev-border-bright bg-dev-elevated px-3.5 py-2 font-mono text-xs text-dev-text shadow-sm">
                  <span className="rounded bg-dev-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-dev-accent">
                    0{idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < selectedCluster.concept.steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden text-dev-accent/60 font-mono text-sm sm:inline"
                  >
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-4 font-mono text-xs leading-relaxed text-dev-secondary">
            {selectedCluster.concept.explanation}
          </p>
        </div>
      </div>
    </section>
  );
}
