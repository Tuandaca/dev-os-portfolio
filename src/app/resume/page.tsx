import type { Metadata } from "next";
import { ResumeContent } from "@/components/portfolio/content-sections";
import { PageIntro } from "@/components/portfolio/page-intro";

export const metadata: Metadata = {
  title: "Resume",
  description: "View or download Ngo Anh Tuan's original CV.",
};

export default function ResumePage() {
  return (
    <>
      <PageIntro eyebrow="05 / Resume" title="Curriculum vitae" description="The original owner-provided CV is available to view and download." />
      <ResumeContent />
    </>
  );
}
