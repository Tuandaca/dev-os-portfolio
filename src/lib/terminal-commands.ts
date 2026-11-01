import type { WorkspaceAppId } from "@/lib/workspace-registry";

const pageCommands = {
  about: "about",
  experience: "experience",
  projects: "projects",
  skills: "skills",
  resume: "resume",
  contact: "contact",
} as const satisfies Record<string, WorkspaceAppId>;

export const terminalHelp = [
  "help — show available commands",
  "about, experience, projects, skills, resume, contact — open a portfolio app",
  "clear — clear this terminal's output",
] as const;

export type TerminalCommandResult =
  | { kind: "help"; lines: readonly string[] }
  | { kind: "open"; appId: WorkspaceAppId; message: string }
  | { kind: "clear" }
  | { kind: "unknown"; message: string };

/** A finite navigation vocabulary. Visitor input is never evaluated or sent to a server. */
export function runTerminalCommand(input: string): TerminalCommandResult {
  const command = input.trim().toLowerCase();

  if (command === "help") return { kind: "help", lines: terminalHelp };
  if (command === "clear") return { kind: "clear" };
  if (Object.prototype.hasOwnProperty.call(pageCommands, command)) {
    const appId = pageCommands[command as keyof typeof pageCommands];
    return { kind: "open", appId, message: `Opening ${command}.` };
  }
  return { kind: "unknown", message: "Unknown command. Type help to see available commands." };
}
