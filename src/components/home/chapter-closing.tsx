"use client";

import { useState } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { cn } from "@/components/ui/class-names";

export function ChapterClosing() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(false);
    }
  };

  return (
    <section
      id="chapter-05"
      aria-labelledby="chapter-closing-heading"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-16 px-4 py-20 sm:scroll-mt-20 sm:px-6 md:py-28 lg:px-8"
    >
      {/* Chapter header pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-dev-border bg-dev-surface/90 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-dev-accent backdrop-blur-sm">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-dev-neon shadow-glow-neon animate-pulse" />
        <span>{"Chapter 05 // Closing Callout"}</span>
      </div>

      {/* Main Closing Card */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-dev-border-bright bg-dev-elevated p-8 shadow-window sm:p-12 lg:p-16">
        <div className="max-w-4xl">
          <h2
            id="chapter-closing-heading"
            className="font-display text-3xl font-extrabold tracking-tight text-dev-text sm:text-5xl lg:text-6xl"
          >
            Ready to Engineer <br />
            <span className="text-dev-accent">Reliable &amp; Modern Systems?</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-dev-secondary sm:text-lg">
            {profile.headline} with {profile.experienceContext} building web applications, scalable APIs, and
            AI-augmented tools. Open to technical engineering roles, full-stack development, and ambitious product teams.
          </p>

          {/* Direct Action CTAs Grid */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-dev-neon bg-dev-neon px-6 py-3 font-mono text-sm font-semibold text-dev-bg shadow-glow-neon transition-all duration-fast hover:bg-dev-text hover:border-dev-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon focus-visible:ring-offset-2 focus-visible:ring-offset-dev-bg"
            >
              <span>Initiate Conversation</span>
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-dev-border-bright bg-dev-surface px-6 py-3 font-mono text-sm font-medium text-dev-text transition-colors duration-fast hover:border-dev-accent hover:text-dev-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
            >
              <span>GitHub Profile</span>
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href={profile.resumeUrl}
              download
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-dev-border-bright bg-dev-surface px-6 py-3 font-mono text-sm font-medium text-dev-text transition-colors duration-fast hover:border-dev-accent hover:text-dev-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
            >
              <span>Download CV (PDF)</span>
              <span aria-hidden="true">↓</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy verified email address to clipboard"
              className={cn(
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 py-3 font-mono text-sm transition-all duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon",
                copied
                  ? "border-dev-neon bg-dev-neon/15 text-dev-neon"
                  : "border-dev-border bg-dev-surface text-dev-secondary hover:border-dev-accent/60 hover:text-dev-text"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-dev-accent" />
              <span>{copied ? "Email Copied!" : "Copy Email"}</span>
            </button>
          </div>
        </div>

        {/* Recruiter Fast-Path Specification Panel */}
        <div className="mt-14 rounded-2xl border border-dev-border bg-dev-surface/90 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dev-border/70 pb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-dev-accent font-semibold">
              Recruiter Quick Reference Ledger
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-dev-neon/10 border border-dev-neon/30 px-2.5 py-0.5 font-mono text-[11px] text-dev-neon">
              <span className="h-1.5 w-1.5 rounded-full bg-dev-neon animate-pulse" />
              Available for Opportunities
            </span>
          </div>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-mono text-xs uppercase text-dev-muted">Direct Email</dt>
              <dd className="mt-1 font-mono text-sm text-dev-text">
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-dev-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
                >
                  {profile.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-mono text-xs uppercase text-dev-muted">Direct Phone</dt>
              <dd className="mt-1 font-mono text-sm text-dev-text">
                <a
                  href={`tel:${profile.phone}`}
                  className="hover:text-dev-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
                >
                  {profile.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-mono text-xs uppercase text-dev-muted">Based In</dt>
              <dd className="mt-1 font-mono text-sm text-dev-text">{profile.location}</dd>
            </div>

            <div>
              <dt className="font-mono text-xs uppercase text-dev-muted">Work Authorization</dt>
              <dd className="mt-1 font-mono text-sm text-dev-text">Vietnam (Remote / Hybrid / On-site)</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-dev-border/60 pt-4">
            <p className="font-mono text-xs text-dev-muted">
              <strong className="text-dev-text font-normal">Primary Engineering Stack:</strong> TypeScript, Next.js,
              React, ASP.NET Core, Python, Node.js/NestJS, PostgreSQL, Redis, Three.js, Gemini AI.
            </p>
          </div>
        </div>

        {/* Terminal Status & Copyright Footer */}
        <div className="mt-10 flex flex-col gap-4 border-t border-dev-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between font-mono text-xs text-dev-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-dev-neon shadow-glow-neon" />
            <span>{"DEV.OS_KERNEL_V6.0 // SYSTEM_STATUS: OPERATIONAL"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/about"
              className="hover:text-dev-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
            >
              About
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/universe"
              className="hover:text-dev-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
            >
              Spatial Universe
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/workspace"
              className="hover:text-dev-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dev-neon"
            >
              2D Workspace
            </Link>
            <span aria-hidden="true">·</span>
            <span>© 2026 {profile.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
