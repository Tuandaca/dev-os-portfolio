import type { Metadata } from "next";
import Link from "next/link";
import { Desktop } from "@/components/os/desktop";
import { WorkspaceArrivalFocus } from "@/components/os/workspace-arrival-focus";
import { PageIntro } from "@/components/portfolio/page-intro";
import { parseWorkspaceSelection, workspaceApps } from "@/lib/workspace-registry";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Explore DEV.OS content applications or use the direct recruiter pages.",
};

type WorkspacePageProps = {
  searchParams: Promise<{ app?: string | string[]; project?: string | string[] }>;
};

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const initialSelection = parseWorkspaceSelection(await searchParams);

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="DEV.OS / Workspace"
        title="Explore DEV.OS"
        titleId="workspace-heading"
        description="Open the portfolio applications, or follow a direct page link for a focused reading path."
      />
      <WorkspaceArrivalFocus />
      <nav aria-label="Direct portfolio pages" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dev-secondary">
        <span className="font-mono text-xs uppercase tracking-wider text-dev-muted">Direct pages</span>
        {workspaceApps.filter((app) => app.id !== "terminal").map((app) => (
          <Link key={app.id} href={app.href} className="text-dev-text underline-offset-4 hover:text-dev-accent hover:underline focus-visible:text-dev-accent focus-visible:underline">
            {app.label}
          </Link>
        ))}
      </nav>
      <Desktop initialSelection={initialSelection} />
    </div>
  );
}
