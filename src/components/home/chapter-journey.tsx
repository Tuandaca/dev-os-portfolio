"use client";

import { useState } from "react";
import Link from "next/link";
import { workExperience, education, certifications } from "@/content/experience";
import { cn } from "@/components/ui/class-names";

type FilterTab = "all" | "experience" | "education";

export function ChapterJourney() {
  const [filter, setFilter] = useState<FilterTab>("all");

  const timelineItems = [
    {
      id: "vlu-dev",
      type: "work" as const,
      period: workExperience[0].period,
      title: workExperience[0].role,
      organization: workExperience[0].context,
      kindLabel: "University IT Role",
      kindTone: "border-dev-accent/40 bg-dev-accent/10 text-dev-accent",
      responsibilities: workExperience[0].responsibilities,
      skills: ["ASP.NET Core", ".NET APIs", "Vue.js", "SQL Server", "UML Modeling", "Functional Testing"],
      note: "Contributed to student Q&A and university information platform in the IT Department.",
    },
    {
      id: "freelance-eval",
      type: "work" as const,
      period: workExperience[1].period,
      title: workExperience[1].role,
      organization: workExperience[1].context,
      kindLabel: "Freelance",
      kindTone: "border-dev-border-bright bg-dev-surface text-dev-secondary",
      responsibilities: workExperience[1].responsibilities,
      skills: ["Data Quality Evaluation", "Search Intent Alignment", "Relevance Rating", "Content Trustworthiness"],
      note: "Evaluated web page relevance, search intent, and content authority against standardized guidelines.",
    },
    {
      id: "tdtu-degree",
      type: "education" as const,
      period: education.period,
      title: education.degree,
      organization: education.institution,
      kindLabel: "Higher Education",
      kindTone: "border-dev-neon/40 bg-dev-neon/10 text-dev-neon",
      responsibilities: [
        `Cumulative GPA: ${education.gpa}`,
        "Core foundational coursework: Software Architecture, Object-Oriented Analysis & Design, Database Systems, Data Structures & Algorithms, Network Systems.",
      ],
      skills: ["Computer Science Foundations", "Software Architecture", "Data Structures", "Database Systems"],
      note: `Formal engineering curriculum completed at ${education.institution} with a verified GPA of ${education.gpa}.`,
    },
    {
      id: "aptis-cert",
      type: "education" as const,
      period: certifications[0].year,
      title: `${certifications[0].name} — Level ${certifications[0].level}`,
      organization: "British Council Assessment",
      kindLabel: "Language Certification",
      kindTone: "border-dev-border-bright bg-dev-surface text-dev-accent",
      responsibilities: [
        `Achieved Level ${certifications[0].level} in Aptis ESOL English assessment (${certifications[0].year}).`,
        "Demonstrated working proficiency in English for technical engineering documentation, API specification, and cross-team collaboration.",
      ],
      skills: ["English Professional Working Proficiency", "Technical Documentation", "Cross-team Collaboration"],
      note: `Official CEFR ${certifications[0].level} certification achieved in ${certifications[0].year}.`,
    },
  ];

  const visibleItems = timelineItems.filter((item) => {
    if (filter === "experience") return item.type === "work";
    if (filter === "education") return item.type === "education";
    return true;
  });

  return (
    <section
      id="chapter-03"
      aria-labelledby="chapter-journey-heading"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-16 px-4 py-20 sm:scroll-mt-20 sm:px-6 md:py-28 lg:px-8"
    >
      {/* Chapter header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-dev-border bg-dev-surface/90 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-dev-accent backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-dev-neon shadow-glow-neon animate-pulse" />
            <span>{"Chapter 03 // The Journey"}</span>
          </div>
          <h2
            id="chapter-journey-heading"
            className="mt-4 font-display text-3xl font-bold tracking-tight text-dev-text sm:text-5xl lg:text-6xl"
          >
            Verified Career &amp; <br className="hidden sm:inline" />
            <span className="text-dev-accent">Academic Timeline</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-dev-secondary sm:text-lg">
            Strictly transcribed from the verified CV baseline with distinct university roles, freelance evaluation,
            formal computer science degree, and credentials. Zero fabricated commercial roles.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-dev-border bg-dev-surface p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-all duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon",
              filter === "all"
                ? "bg-dev-elevated text-dev-text shadow-sm border border-dev-border-bright"
                : "text-dev-muted hover:text-dev-text"
            )}
          >
            All Milestones ({timelineItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("experience")}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-all duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon",
              filter === "experience"
                ? "bg-dev-elevated text-dev-text shadow-sm border border-dev-border-bright"
                : "text-dev-muted hover:text-dev-text"
            )}
          >
            Work History (2)
          </button>
          <button
            type="button"
            onClick={() => setFilter("education")}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-all duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon",
              filter === "education"
                ? "bg-dev-elevated text-dev-text shadow-sm border border-dev-border-bright"
                : "text-dev-muted hover:text-dev-text"
            )}
          >
            Education &amp; Certs (2)
          </button>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative mt-16 pl-6 sm:pl-8 md:pl-10">
        {/* Continuous vertical timeline line */}
        <div
          aria-hidden="true"
          className="absolute left-2.5 sm:left-3.5 md:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-dev-neon via-dev-accent to-dev-border"
        />

        <div className="space-y-12">
          {visibleItems.map((item, index) => {
            return (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-6 sm:-left-8 md:-left-10 top-1.5 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 bg-dev-bg transition-all duration-standard",
                    "border-dev-neon shadow-glow-neon group-hover:scale-110"
                  )}
                >
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-dev-neon" />
                </div>

                {/* Milestone card */}
                <div className="rounded-2xl border border-dev-border bg-dev-surface/90 p-6 shadow-window transition-all duration-standard hover:border-dev-border-bright hover:bg-dev-elevated sm:p-8">
                  {/* Metadata bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded bg-dev-elevated px-2.5 py-1 font-bold text-dev-neon border border-dev-border-bright">
                        {item.period}
                      </span>
                      <span className={cn("rounded-full border px-2.5 py-0.5 uppercase tracking-wider", item.kindTone)}>
                        {item.kindLabel}
                      </span>
                    </div>

                    <span className="text-dev-muted">
                      {`Milestone 0${index + 1} // Sourced from CV`}
                    </span>
                  </div>

                  {/* Role and Organization */}
                  <div className="mt-4">
                    <h3 className="font-display text-xl font-bold text-dev-text sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-mono text-sm text-dev-accent">
                      {item.organization}
                    </p>
                  </div>

                  {/* Responsibilities list */}
                  <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-dev-secondary">
                    {item.responsibilities.map((resp) => (
                      <li key={resp} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dev-accent" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technology / Competency Tags */}
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-dev-border/60 pt-4">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-dev-border-bright/80 bg-dev-bg/90 px-2.5 py-1 font-mono text-xs text-dev-text"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Footnote & Action Navigation */}
      <div className="mt-14 flex flex-col gap-6 rounded-2xl border border-dev-border-bright bg-dev-elevated p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-dev-accent">
            Verifiable Credentials &amp; Verification Notes
          </p>
          <p className="mt-1 text-sm text-dev-secondary">
            Review detailed context notes and source traceability in the dedicated experience ledger.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 font-mono text-xs">
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 rounded-md border border-dev-accent bg-dev-accent px-4 py-2.5 font-semibold text-dev-bg transition-colors hover:bg-dev-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
          >
            <span>Full Experience Ledger</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-md border border-dev-border-bright bg-dev-surface px-4 py-2.5 font-medium text-dev-text transition-colors hover:border-dev-accent hover:text-dev-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
          >
            <span>Resume &amp; PDF</span>
            <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
