import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsContent } from "@/components/portfolio/content-sections";
import { PageIntro } from "@/components/portfolio/page-intro";

export const metadata: Metadata = {
  title: "Projects",
  description: "CV-selected engineering projects and additional public repository samples, with evidence and unknowns clearly separated.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="03 / Projects" title="Selected engineering work" description="Explore CV-selected projects and public repository samples. Each case study separates verified code details from information still awaiting confirmation." />
      <ProjectsContent />
      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-dev-border pt-8 font-mono text-sm">
        <Link href="/experience" className="text-dev-accent hover:underline focus-visible:underline">View professional experience →</Link>
        <Link href="/contact" className="text-dev-accent hover:underline focus-visible:underline">Discuss a project →</Link>
      </div>
    </>
  );
}
