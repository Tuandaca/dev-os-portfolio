"use client";

import { useState } from "react";
import Link from "next/link";
import { AboutContent, ExperienceContent, ProjectsContent, ResumeContent, SkillsContent } from "@/components/portfolio/content-sections";

const apps = [
  { id: "about", label: "About", href: "/about" },
  { id: "experience", label: "Experience", href: "/experience" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "skills", label: "Skills", href: "/skills" },
  { id: "resume", label: "Resume", href: "/resume" },
] as const;

type AppId = (typeof apps)[number]["id"];

function AppContent({ id }: { id: AppId }) {
  switch (id) {
    case "about": return <AboutContent />;
    case "experience": return <ExperienceContent />;
    case "projects": return <ProjectsContent />;
    case "skills": return <SkillsContent />;
    case "resume": return <ResumeContent />;
  }
}

export function WorkspaceApps() {
  const [activeApp, setActiveApp] = useState<AppId>("about");
  const active = apps.find((app) => app.id === activeApp) ?? apps[0];

  return (
    <div className="overflow-hidden rounded-xl border border-dev-border-bright bg-dev-surface shadow-window">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dev-border bg-dev-elevated px-5 py-3 font-mono text-xs text-dev-secondary">
        <span><span aria-hidden="true" className="mr-3 text-dev-accent">●</span>DEV.OS / workspace</span>
        <span>Content apps · Recruiter pages available</span>
      </div>
      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Workspace applications" className="border-b border-dev-border bg-dev-bg/60 p-4 lg:border-b-0 lg:border-r">
          <p className="px-3 pb-3 font-mono text-xs uppercase tracking-widest text-dev-muted">Applications</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-1">
            {apps.map((app) => (
              <button
                key={app.id}
                type="button"
                aria-pressed={activeApp === app.id}
                aria-controls="workspace-content"
                onClick={() => setActiveApp(app.id)}
                className={`rounded-md px-3 py-3 text-left font-mono text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent ${activeApp === app.id ? "bg-dev-accent/15 text-dev-accent" : "text-dev-secondary hover:bg-dev-elevated hover:text-dev-text"}`}
              >
                <span aria-hidden="true" className="mr-2">{activeApp === app.id ? "▸" : "·"}</span>{app.label}
              </button>
            ))}
          </div>
          <p className="mt-5 px-3 text-xs leading-5 text-dev-muted">The direct pages remain available for fast reading and sharing.</p>
        </nav>
        <section id="workspace-content" aria-labelledby="workspace-app-title" className="min-h-[500px] p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-dev-border pb-4">
            <h2 id="workspace-app-title" className="font-mono text-lg font-semibold text-dev-accent">{active.label}.exe</h2>
            <Link href={active.href} className="font-mono text-xs text-dev-secondary hover:text-dev-accent focus-visible:text-dev-accent">Open direct page ↗</Link>
          </div>
          <AppContent id={activeApp} />
        </section>
      </div>
    </div>
  );
}
