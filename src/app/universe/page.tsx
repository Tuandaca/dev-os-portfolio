import type { Metadata } from "next";
import Link from "next/link";
import { UniverseExperience } from "@/components/immersive/universe-experience";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Immersive universe",
  description: `Explore ${profile.name}'s CV-backed skills through an interactive 3D developer workspace, or use the direct portfolio pages.`,
};

export default function UniversePage() {
  return (
    <div className="space-y-6">
      <header className="max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-dev-accent">DEV.OS / Spatial workspace</p>
        <h1 id="universe-heading" tabIndex={-1} className="mt-3 text-4xl font-semibold leading-tight outline-none sm:text-6xl">
          Explore the <span className="text-dev-accent">DEV.OS universe.</span>
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-dev-secondary sm:text-lg">
          Explore a spatial workstation built from CV-backed skills and conceptual engineering flows. Every scene has a direct HTML path.
        </p>
        <nav aria-label="Fast portfolio access" className="mt-4 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
          <Link href="/workspace" className="text-dev-accent underline-offset-4 hover:underline focus-visible:underline">Quick View / 2D workspace →</Link>
          <Link href="/projects" className="text-dev-text underline-offset-4 hover:text-dev-accent hover:underline focus-visible:underline">Project case studies →</Link>
          <Link href="/resume" className="text-dev-text underline-offset-4 hover:text-dev-accent hover:underline focus-visible:underline">Resume →</Link>
        </nav>
      </header>

      <UniverseExperience />

      <section className="border-t border-dev-border/80 pt-8" aria-labelledby="universe-direct-heading">
        <h2 id="universe-direct-heading" className="text-xl font-semibold">Explore the portfolio directly</h2>
        <p className="mt-2 max-w-2xl leading-7 text-dev-secondary">The 3D scene is optional. These pages contain the same verified professional information as ordinary HTML.</p>
        <nav aria-label="Direct recruiter pages" className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm text-dev-accent">
          <Link href="/about" className="underline-offset-4 hover:underline focus-visible:underline">About</Link>
          <Link href="/experience" className="underline-offset-4 hover:underline focus-visible:underline">Experience</Link>
          <Link href="/skills" className="underline-offset-4 hover:underline focus-visible:underline">Skills</Link>
          <Link href="/projects" className="underline-offset-4 hover:underline focus-visible:underline">Projects</Link>
          <Link href="/contact" className="underline-offset-4 hover:underline focus-visible:underline">Contact</Link>
        </nav>
      </section>
    </div>
  );
}
