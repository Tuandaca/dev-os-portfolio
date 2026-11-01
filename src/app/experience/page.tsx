import type { Metadata } from "next";
import { ExperienceContent } from "@/components/portfolio/content-sections";
import { PageIntro } from "@/components/portfolio/page-intro";

export const metadata: Metadata = {
  title: "Experience",
  description: "CV-sourced university IT work, freelance web data evaluation, education, and certification for Ngo Anh Tuan.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageIntro eyebrow="02 / Experience" title="Work, education, and certification" description="Dated roles from the CV are shown separately from hands-on project experience." />
      <ExperienceContent />
    </>
  );
}
