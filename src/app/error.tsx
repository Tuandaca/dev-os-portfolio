"use client";

import Link from "next/link";

const linkClass = "font-mono text-sm text-dev-accent underline-offset-4 hover:underline focus-visible:underline";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="dev-panel max-w-2xl rounded-panel p-7 sm:p-10" aria-labelledby="error-heading">
      <p className="font-mono text-xs uppercase tracking-widest text-dev-amber">DEV.OS / Error</p>
      <h1 id="error-heading" className="mt-4 text-3xl font-semibold">This page could not be opened.</h1>
      <p className="mt-4 leading-7 text-dev-secondary">Try again, or use a direct portfolio page while this view is unavailable.</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
        <button type="button" onClick={reset} className="min-h-11 rounded-control border border-dev-accent bg-dev-accent px-5 py-2 font-mono text-sm font-semibold text-dev-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">Try again</button>
        <nav aria-label="Portfolio fallback pages" className="flex flex-wrap gap-x-5 gap-y-3">
          <Link href="/" className={linkClass}>Home</Link>
          <Link href="/projects" className={linkClass}>Projects</Link>
          <Link href="/resume" className={linkClass}>Resume</Link>
          <Link href="/contact" className={linkClass}>Contact</Link>
        </nav>
      </div>
    </section>
  );
}
