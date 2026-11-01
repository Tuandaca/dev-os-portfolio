"use client";

import type { RefObject } from "react";
import type { WorkspaceAppId } from "@/lib/workspace-registry";
import { getWorkspaceApp } from "@/lib/workspace-registry";

export function Taskbar({
  openApps,
  focusedApp,
  minimizedApps,
  launcherOpen,
  launcherButtonRef,
  onToggleLauncher,
  onOpenApp,
  onOpenPalette,
}: {
  openApps: WorkspaceAppId[];
  focusedApp: WorkspaceAppId | null;
  minimizedApps: WorkspaceAppId[];
  launcherOpen: boolean;
  launcherButtonRef: RefObject<HTMLButtonElement | null>;
  onToggleLauncher: () => void;
  onOpenApp: (id: WorkspaceAppId) => void;
  onOpenPalette: () => void;
}) {
  return (
    <nav aria-label="DEV.OS taskbar" className="sticky bottom-0 z-20 flex flex-wrap items-center gap-2 border-t border-dev-border-bright bg-dev-bg/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] font-mono text-xs backdrop-blur sm:px-4">
      <button ref={launcherButtonRef} type="button" aria-controls="workspace-launcher" aria-expanded={launcherOpen} onClick={onToggleLauncher} className="min-h-11 rounded-control border border-dev-accent bg-dev-accent/10 px-3 font-semibold text-dev-accent hover:bg-dev-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">
        Apps
      </button>
      <div className="flex min-w-0 flex-1 flex-wrap gap-2" role="group" aria-label="Open applications">
        {openApps.map((id) => {
          const minimized = minimizedApps.includes(id);
          const active = focusedApp === id && !minimized;
          return (
            <button key={id} type="button" aria-pressed={active} aria-label={`${getWorkspaceApp(id).label}${minimized ? ", minimized" : active ? ", active" : ", open"}`} onClick={() => onOpenApp(id)} className={`min-h-11 rounded-control border px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent ${active ? "border-dev-accent bg-dev-accent/15 text-dev-accent" : minimized ? "border-dev-border text-dev-muted hover:text-dev-text" : "border-dev-border-bright text-dev-secondary hover:bg-dev-elevated hover:text-dev-text"}`}>
              {getWorkspaceApp(id).label}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onOpenPalette} className="min-h-11 rounded-control border border-dev-border-bright px-3 text-dev-text hover:border-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">
        Search <span className="hidden text-dev-muted sm:inline">Ctrl K</span>
      </button>
    </nav>
  );
}
