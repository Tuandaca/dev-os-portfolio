"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/components/ui/class-names";

interface Subsystem {
  id: string;
  name: string;
  layer: string;
  shortDescription: string;
  technologies: readonly string[];
  responsibilities: readonly string[];
  dataFlow: {
    inputs: string;
    processing: string;
    outputs: string;
  };
  projectReference?: {
    title: string;
    slug: string;
    evidenceText: string;
  };
}

const subsystems: readonly Subsystem[] = [
  {
    id: "client-edge",
    name: "Presentation & Edge Interface",
    layer: "01 // CLIENT TIER",
    shortDescription:
      "Next.js App Router presentation architecture with decoupled WebGL 3D stages, Server Components, and responsive accessibility.",
    technologies: ["Next.js 15", "React 19", "TypeScript", "Three.js", "Tailwind CSS", "Web Workers"],
    responsibilities: [
      "Zero-distortion background WebGL shader isolation (z-index: 0) decoupled from semantic DOM reading surfaces.",
      "High-contrast Dark Neon Liquid design tokens ensuring WCAG 2.1 AAA contrast ratios across all devices.",
      "Instant fallbacks for reduced-motion preferences (prefers-reduced-motion) and unsupported WebGL contexts.",
    ],
    dataFlow: {
      inputs: "User scroll, pointer parallax events, keyboard navigation, URL routes",
      processing: "R3F demand rendering loop, DOM state reconciliation, responsive layout reflows",
      outputs: "Accessible HTML DOM nodes, 60fps canvas frames, smooth section transitions",
    },
    projectReference: {
      title: "DEV.OS Web Workstation",
      slug: "/workspace",
      evidenceText: "Multi-window 2D desktop OS and spatial 3D universe with full keyboard accessibility.",
    },
  },
  {
    id: "realtime-streaming",
    name: "Realtime Coordination & Locking",
    layer: "02 // COORDINATION TIER",
    shortDescription:
      "Low-latency event streaming and distributed seat reservation coordination engine backed by Redis seat locking.",
    technologies: ["Socket.IO", "Redis Cache", "Node.js Events", "Atomic Locks", "Optimistic State"],
    responsibilities: [
      "Coordinates concurrent seat selection and reservation locks to prevent race conditions during ticket booking.",
      "Broadcasts real-time seat status updates across connected client sessions via WebSocket events.",
      "Implements TTL-based lock expiration ensuring unconfirmed seats automatically return to the open pool.",
    ],
    dataFlow: {
      inputs: "Seat lock requests, client heartbeats, reservation confirmations",
      processing: "Redis atomic key-value operations with TTL expiration, Socket.IO room broadcast",
      outputs: "Real-time room seat status events, reservation tokens, lock confirmation payloads",
    },
    projectReference: {
      title: "Cinema Ticket Booking Platform",
      slug: "/projects/cinema",
      evidenceText: "Repository separates Next.js and NestJS API with Redis-backed seat locking and Socket.IO events.",
    },
  },
  {
    id: "microservices-data",
    name: "Application Services & Storage",
    layer: "03 // SERVICE & DATA TIER",
    shortDescription:
      "Modular API services with relational data modeling, migrations, and scalable query structures.",
    technologies: ["ASP.NET Core", "NestJS", "FastAPI", "PostgreSQL", "Prisma ORM", "SQL Server"],
    responsibilities: [
      "Structured RESTful API endpoints with request validation, structured error handling, and auditability.",
      "Relational schema design with Prisma and PostgreSQL for booking, customer orders, and catalogs.",
      "Enterprise ASP.NET Core and SQL Server API implementation based on UML Use Case and Sequence models.",
    ],
    dataFlow: {
      inputs: "Authenticated REST requests, booking payloads, structured search queries",
      processing: "Controller validation, ORM entity modeling, relational joins, transactional commit",
      outputs: "Serialized JSON responses, ACID-compliant database writes, relational data integrity",
    },
    projectReference: {
      title: "Cinema Platform & VLU Web System",
      slug: "/projects/cinema",
      evidenceText: "PostgreSQL & Prisma models in Cinema; ASP.NET Core & SQL Server API work at Van Lang University.",
    },
  },
  {
    id: "ai-rag-engine",
    name: "AI & Multimodal RAG Engine",
    layer: "04 // INTELLIGENCE TIER",
    shortDescription:
      "Retrieval-Augmented Generation pipeline combining dense vector embeddings, graph routing, and generative LLMs.",
    technologies: ["Python", "FastAPI", "sentence-transformers", "FAISS", "Neo4j Vector Index", "Gemini API"],
    responsibilities: [
      "Multilingual text chunking, preparation of PDF/JSON sources, and dense sentence-embedding computation.",
      "Vector similarity retrieval prototypes with FAISS and graph-routed vector querying in Neo4j.",
      "Grounded answer generation using Gemini API with strict system prompts keeping user booking actions under user control.",
    ],
    dataFlow: {
      inputs: "User natural language questions, tourism queries, prepared document datasets",
      processing: "Embedding vector generation, cosine similarity search, Neo4j graph context retrieval",
      outputs: "Grounded conversational responses, cited source snippets, recommendation summaries",
    },
    projectReference: {
      title: "Travel AI Multimodal RAG System",
      slug: "/projects/travel-ai",
      evidenceText: "Collaborative capstone with FastAPI, sentence embeddings, Neo4j vector index, and Gemini.",
    },
  },
];

export function ChapterSystem() {
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string>("client-edge");
  const activeSubsystem =
    subsystems.find((s) => s.id === selectedSubsystemId) ?? subsystems[0];

  return (
    <section
      id="chapter-04"
      aria-labelledby="chapter-system-heading"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-16 px-4 py-20 sm:scroll-mt-20 sm:px-6 md:py-28 lg:px-8"
    >
      {/* Chapter header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-dev-border bg-dev-surface/90 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-dev-accent backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-dev-neon shadow-glow-neon animate-pulse" />
          <span>{"Chapter 04 // Inside the System"}</span>
        </div>
        <h2
          id="chapter-system-heading"
          className="mt-4 font-display text-3xl font-bold tracking-tight text-dev-text sm:text-5xl lg:text-6xl"
        >
          Full-Stack Architecture &amp; <br className="hidden sm:inline" />
          <span className="text-dev-accent">System Pipelines</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-dev-secondary sm:text-lg">
          An interactive conceptual architecture diagram illustrating how presentation, real-time coordination,
          microservices, and AI RAG pipelines connect. Select any subsystem to trace data flow and inspected case studies.
        </p>
      </div>

      {/* Subsystems interactive diagram grid */}
      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        {/* Left column: 4 Subsystem Cards */}
        <div className="space-y-3 lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dev-muted">
            {"Architecture Tiers // Click to inspect"}
          </p>

          <div role="tablist" aria-label="System architecture layers" className="space-y-3">
            {subsystems.map((subsystem) => {
              const isSelected = subsystem.id === selectedSubsystemId;

              return (
                <button
                  key={subsystem.id}
                  type="button"
                  role="tab"
                  id={`system-tab-${subsystem.id}`}
                  aria-selected={isSelected}
                  aria-controls={`system-panel-${subsystem.id}`}
                  onClick={() => setSelectedSubsystemId(subsystem.id)}
                  className={cn(
                    "w-full rounded-xl p-4 text-left transition-all duration-standard sm:p-5",
                    "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon",
                    isSelected
                      ? "border-dev-neon bg-dev-elevated shadow-glow-neon ring-1 ring-dev-neon/30"
                      : "border-dev-border bg-dev-surface/80 hover:border-dev-border-bright hover:bg-dev-elevated/60"
                  )}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className={isSelected ? "font-bold text-dev-neon" : "text-dev-muted"}>
                      {subsystem.layer}
                    </span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider",
                        isSelected
                          ? "bg-dev-neon/15 text-dev-neon border border-dev-neon/30"
                          : "bg-dev-surface text-dev-muted border border-dev-border"
                      )}
                    >
                      {isSelected ? "Active" : "Inspect"}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-semibold text-dev-text">
                    {subsystem.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-dev-secondary line-clamp-2">
                    {subsystem.shortDescription}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {subsystem.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-dev-bg/80 px-2 py-0.5 font-mono text-[10px] text-dev-secondary border border-dev-border/50"
                      >
                        {tech}
                      </span>
                    ))}
                    {subsystem.technologies.length > 3 ? (
                      <span className="rounded bg-dev-bg/50 px-1.5 py-0.5 font-mono text-[10px] text-dev-muted">
                        +{subsystem.technologies.length - 3}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Active Subsystem Telemetry & Evidence */}
        <div
          id={`system-panel-${activeSubsystem.id}`}
          role="tabpanel"
          aria-labelledby={`system-tab-${activeSubsystem.id}`}
          className="rounded-2xl border border-dev-border-bright bg-dev-elevated p-6 shadow-window sm:p-8 lg:col-span-7 flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dev-border/80 pb-4">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-dev-accent">
                  {activeSubsystem.layer}
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-dev-text sm:text-3xl">
                  {activeSubsystem.name}
                </h3>
              </div>
              <span className="rounded-full border border-dev-neon/40 bg-dev-neon/10 px-3 py-1 font-mono text-xs uppercase text-dev-neon">
                Verified Module
              </span>
            </div>

            {/* Core Responsibilities */}
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-dev-muted">
                Architectural Responsibilities
              </p>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-dev-secondary">
                {activeSubsystem.responsibilities.map((resp) => (
                  <li key={resp} className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dev-neon" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Flow Trace (Input -> Processing -> Output) */}
            <div className="mt-6 rounded-xl border border-dev-border bg-dev-surface/90 p-4 sm:p-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-dev-accent">
                Data Pipeline &amp; Signal Path
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-dev-border-bright bg-dev-elevated p-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-dev-muted">{"01 // Input"}</span>
                  <p className="mt-1 font-mono text-xs text-dev-text">{activeSubsystem.dataFlow.inputs}</p>
                </div>
                <div className="rounded-lg border border-dev-border-bright bg-dev-elevated p-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-dev-accent">{"02 // Processing"}</span>
                  <p className="mt-1 font-mono text-xs text-dev-text">{activeSubsystem.dataFlow.processing}</p>
                </div>
                <div className="rounded-lg border border-dev-border-bright bg-dev-elevated p-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-dev-neon">{"03 // Output"}</span>
                  <p className="mt-1 font-mono text-xs text-dev-text">{activeSubsystem.dataFlow.outputs}</p>
                </div>
              </div>
            </div>

            {/* Verified Project Traceability */}
            {activeSubsystem.projectReference && (
              <div className="mt-6 rounded-xl border border-dev-accent/30 bg-dev-accent/5 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-dev-accent font-semibold">
                    {`Verified Repository Evidence // ${activeSubsystem.projectReference.title}`}
                  </span>
                  <Link
                    href={activeSubsystem.projectReference.slug}
                    className="font-mono text-xs text-dev-accent underline-offset-4 hover:underline focus-visible:underline"
                  >
                    View Case Study →
                  </Link>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-dev-secondary sm:text-sm">
                  {activeSubsystem.projectReference.evidenceText}
                </p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-dev-border/70 pt-6">
            <span className="font-mono text-xs text-dev-muted">
              Deep link targets: Case studies &amp; environments
            </span>

            <div className="flex flex-wrap gap-2.5 font-mono text-xs">
              <Link
                href="/projects/cinema"
                className="inline-flex items-center gap-1.5 rounded-md border border-dev-border-bright bg-dev-surface px-3 py-2 text-dev-text transition-colors hover:border-dev-accent hover:text-dev-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
              >
                <span>Cinema Study</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/projects/travel-ai"
                className="inline-flex items-center gap-1.5 rounded-md border border-dev-border-bright bg-dev-surface px-3 py-2 text-dev-text transition-colors hover:border-dev-accent hover:text-dev-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
              >
                <span>Travel AI Study</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 rounded-md border border-dev-accent bg-dev-accent/15 px-3 py-2 text-dev-accent font-medium transition-colors hover:bg-dev-accent hover:text-dev-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
              >
                <span>Launch Workstation</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
