import type { Metadata } from "next";
import { SkillsContent } from "@/components/portfolio/content-sections";
import { PageIntro } from "@/components/portfolio/page-intro";

export const metadata: Metadata = {
  title: "Skills",
  description: "CV-sourced languages, frontend and backend tools, data systems, AI/RAG workflow, and engineering practice.",
};

export default function SkillsPage() {
  return (
    <>
      <PageIntro eyebrow="04 / Skills" title="Technical skills" description="The tools and practices listed in the CV, grouped by the work they support." />
      <SkillsContent />
    </>
  );
}
