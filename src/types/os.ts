import type { ReactElement } from "react";

export type AppId =
  | "about"
  | "projects"
  | "stack"
  | "architecture"
  | "agents"
  | "experience"
  | "contact"
  | "terminal"
  | "settings";

export interface AppMetadata {
  id: AppId;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  badge?: string;
  category: "core" | "engineering" | "interactive";
}

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevRect?: { x: number; y: number; width: number; height: number };
  zIndex: number;
  minSize: { width: number; height: number };
}

export interface TerminalCommand {
  command: string;
  description: string;
  usage?: string;
  handler: (args: string[]) => string | ReactElement;
}
