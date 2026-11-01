import type { Metadata } from "next";
import { PageIntro } from "@/components/portfolio/page-intro";
import { WorkspaceApps } from "@/components/portfolio/workspace-apps";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Explore DEV.OS content applications or use the direct recruiter pages.",
};

export default function WorkspacePage() {
  return (
    <>
      <PageIntro eyebrow="DEV.OS / Workspace" title="Explore the content apps" description="About, work history, projects, skills, and the original CV in one lightweight workspace." />
      <WorkspaceApps />
    </>
  );
}
