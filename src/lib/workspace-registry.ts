import { getFeaturedProject } from "@/content/projects";

/** Stable IDs shared by the URL, desktop, launcher, and command interfaces. */
export const workspaceApps = [
  { id: "about", label: "About", href: "/about" },
  { id: "experience", label: "Experience", href: "/experience" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "skills", label: "Skills", href: "/skills" },
  { id: "resume", label: "Resume", href: "/resume" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "terminal", label: "Terminal", href: "/workspace?app=terminal" },
] as const;

export type WorkspaceAppId = (typeof workspaceApps)[number]["id"];
export type WorkspaceSelection = { appId: WorkspaceAppId; projectSlug?: string };
export type WorkspaceQuery = {
  app?: string | string[];
  project?: string | string[];
};

export const defaultWorkspaceApp: WorkspaceAppId = "about";

export function isWorkspaceAppId(value: unknown): value is WorkspaceAppId {
  return typeof value === "string" && workspaceApps.some((app) => app.id === value);
}

export function getWorkspaceApp(id: WorkspaceAppId) {
  return workspaceApps.find((app) => app.id === id) ?? workspaceApps[0];
}

/** Query values are allowlisted before they affect visible desktop state. */
export function parseWorkspaceSelection(query: WorkspaceQuery): WorkspaceSelection {
  const appId = isWorkspaceAppId(query.app) ? query.app : defaultWorkspaceApp;
  const projectSlug = typeof query.project === "string" && getFeaturedProject(query.project)
    ? query.project
    : undefined;

  return appId === "projects" && projectSlug ? { appId, projectSlug } : { appId };
}

export function workspaceHref(appId: WorkspaceAppId, projectSlug?: string): string {
  const params = new URLSearchParams({ app: appId });
  if (appId === "projects" && projectSlug && getFeaturedProject(projectSlug)) {
    params.set("project", projectSlug);
  }
  return `/workspace?${params.toString()}`;
}
