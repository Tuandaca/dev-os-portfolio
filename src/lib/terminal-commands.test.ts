import { describe, expect, it } from "vitest";
import { runTerminalCommand } from "./terminal-commands";

describe("runTerminalCommand", () => {
  it("normalizes allowlisted navigation commands", () => {
    expect(runTerminalCommand("  PROJECTS  ")).toEqual({
      kind: "open",
      appId: "projects",
      message: "Opening projects.",
    });
  });

  it("does not execute or echo arbitrary input", () => {
    expect(runTerminalCommand("rm -rf /")).toEqual({
      kind: "unknown",
      message: "Unknown command. Type help to see available commands.",
    });
  });

  it("handles help and clear as local actions", () => {
    expect(runTerminalCommand("help").kind).toBe("help");
    expect(runTerminalCommand("clear")).toEqual({ kind: "clear" });
  });
});
