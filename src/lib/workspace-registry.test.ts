import { describe, expect, it } from "vitest";
import { parseWorkspaceSelection, workspaceHref } from "./workspace-registry";

describe("workspace deep links", () => {
  it("restores an allowlisted app and known project", () => {
    expect(parseWorkspaceSelection({ app: "projects", project: "cinema" })).toEqual({
      appId: "projects",
      projectSlug: "cinema",
    });
    expect(workspaceHref("projects", "cinema")).toBe("/workspace?app=projects&project=cinema");
  });

  it("falls back safely for unknown and repeated query values", () => {
    expect(parseWorkspaceSelection({ app: "unknown", project: "cinema" })).toEqual({ appId: "about" });
    expect(parseWorkspaceSelection({ app: ["projects", "terminal"] })).toEqual({ appId: "about" });
    expect(parseWorkspaceSelection({ app: "projects", project: "missing" })).toEqual({ appId: "projects" });
    expect(workspaceHref("projects", "missing")).toBe("/workspace?app=projects");
  });

  it("ignores a project parameter for other apps", () => {
    expect(parseWorkspaceSelection({ app: "contact", project: "cinema" })).toEqual({ appId: "contact" });
  });
});
