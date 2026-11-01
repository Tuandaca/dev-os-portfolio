import type { ReactNode } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dev-bg text-dev-text">
      <div aria-hidden="true" className="dev-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-dev-accent/5 blur-3xl" />
      <a href="#main-content" className="sr-only rounded bg-dev-accent px-4 py-2 font-semibold text-dev-bg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <header className="relative z-10 border-b border-dev-border/80 bg-dev-bg/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="group inline-flex items-center gap-3 font-mono text-lg font-bold tracking-tight text-dev-text focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent">
            <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded border border-dev-accent/60 bg-dev-accent/10 text-sm text-dev-accent">&gt;_</span>
            DEV<span className="text-dev-accent">.</span>OS
          </Link>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wider text-dev-secondary sm:text-sm">
            {navigation.map(({ href, label }) => (
              <Link key={href} href={href} className="transition-colors hover:text-dev-accent focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent">
                {label}
              </Link>
            ))}
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-dev-accent hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent">GitHub ↗</a>
          </nav>
        </div>
      </header>
      <main id="main-content" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        {children}
      </main>
      <footer className="relative z-10 border-t border-dev-border/80 bg-dev-bg/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 font-mono text-xs text-dev-muted sm:px-8">
          <p>{profile.name} / {profile.headline}</p>
          <div className="flex items-center gap-5">
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-dev-accent focus-visible:text-dev-accent">GitHub ↗</a>
            <Link href="/workspace" className="hover:text-dev-accent focus-visible:text-dev-accent">DEV.OS workspace →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
