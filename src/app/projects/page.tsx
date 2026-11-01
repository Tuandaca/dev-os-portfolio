import type { Metadata } from "next";
import { ProjectsContent } from "@/components/portfolio/content-sections";
import { PageIntro } from "@/components/portfolio/page-intro";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected full-stack and AI/RAG projects, grounded in the CV and inspected repository code.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="03 / Projects" title="Selected engineering work" description="Two CV-selected projects, with repository-backed implementation details kept distinct from prototype work." />
      <ProjectsContent />
    </>
  );
}
