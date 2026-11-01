import Link from "next/link";
import type { WorkspaceAppId } from "@/lib/workspace-registry";
import { getFeaturedProject } from "@/content/projects";
import {
  AboutContent,
  ContactContent,
  ExperienceContent,
  ProjectDetail,
  ProjectsContent,
  ResumeContent,
  SkillsContent,
} from "./content-sections";

export type PortfolioAppId = Exclude<WorkspaceAppId, "terminal">;

export function WorkspaceContent({
  appId,
  projectSlug,
}: {
  appId: PortfolioAppId;
  projectSlug?: string;
}) {
  switch (appId) {
    case "about":
      return <AboutContent />;
    case "experience":
      return <ExperienceContent />;
    case "skills":
      return <SkillsContent />;
    case "resume":
      return <ResumeContent />;
    case "contact":
      return <ContactContent />;
    case "projects": {
      const project = projectSlug ? getFeaturedProject(projectSlug) : undefined;
      if (!project) return <ProjectsContent />;

      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold text-dev-text">{project.title}</p>
            <Link
              href={`/projects/${project.slug}`}
              className="font-mono text-sm text-dev-accent hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent"
            >
              Open case study ↗
            </Link>
          </div>
          <ProjectDetail project={project} />
        </div>
      );
    }
  }
}
