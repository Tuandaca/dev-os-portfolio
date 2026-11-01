"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CommandPalette } from "./command-palette";
import { Launcher } from "./launcher";
import { Taskbar } from "./taskbar";
import { Terminal } from "./terminal";
import { OsWindow } from "./window";
import { WorkspaceContent } from "@/components/portfolio/workspace-content";
import {
  getWorkspaceApp,
  parseWorkspaceSelection,
  workspaceHref,
  type WorkspaceAppId,
  type WorkspaceSelection,
} from "@/lib/workspace-registry";
import { OsStoreProvider, useOsStore } from "@/stores/os-store-provider";

function updateWorkspaceUrl(href: string, replace = false) {
  if (`${window.location.pathname}${window.location.search}` === href) return;
  window.history[replace ? "replaceState" : "pushState"](null, "", href);
}

function DesktopBody({ initialSelection }: { initialSelection: WorkspaceSelection }) {
  const openApps = useOsStore((state) => state.openApps);
  const focusedApp = useOsStore((state) => state.focusedApp);
  const minimizedApps = useOsStore((state) => state.minimizedApps);
  const launcherOpen = useOsStore((state) => state.launcherOpen);
  const paletteOpen = useOsStore((state) => state.paletteOpen);
  const openApp = useOsStore((state) => state.openApp);
  const focusApp = useOsStore((state) => state.focusApp);
  const minimizeApp = useOsStore((state) => state.minimizeApp);
  const closeApp = useOsStore((state) => state.closeApp);
  const setLauncherOpen = useOsStore((state) => state.setLauncherOpen);
  const setPaletteOpen = useOsStore((state) => state.setPaletteOpen);
  const [projectSlug, setProjectSlug] = useState(initialSelection.projectSlug);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);

  const selectApp = useCallback((id: WorkspaceAppId) => {
    setProjectSlug(undefined);
    openApp(id);
    updateWorkspaceUrl(workspaceHref(id));
  }, [openApp]);

  const restoreApp = (id: WorkspaceAppId) => {
    openApp(id);
    updateWorkspaceUrl(workspaceHref(id, id === "projects" ? projectSlug : undefined));
  };

  const focusWindow = (id: WorkspaceAppId) => {
    if (focusedApp === id) return;
    focusApp(id);
    updateWorkspaceUrl(workspaceHref(id, id === "projects" ? projectSlug : undefined), true);
  };

  const closeOrMinimize = (id: WorkspaceAppId, action: "close" | "minimize") => {
    const remaining = openApps.filter((app) => app !== id && !minimizedApps.includes(app));
    if (action === "close") closeApp(id);
    else minimizeApp(id);
    const next = focusedApp === id ? remaining[remaining.length - 1] : focusedApp;
    updateWorkspaceUrl(next ? workspaceHref(next, next === "projects" ? projectSlug : undefined) : "/workspace", true);
    if (!next) launcherButtonRef.current?.focus();
  };

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const selection = parseWorkspaceSelection({ app: params.get("app") ?? undefined, project: params.get("project") ?? undefined });
      setProjectSlug(selection.projectSlug);
      openApp(selection.appId);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [openApp]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setPaletteOpen]);

  const visibleApps = openApps.filter((id) => !minimizedApps.includes(id));

  return (
    <section aria-label="Interactive DEV.OS desktop" className="relative overflow-hidden rounded-window border border-dev-border-bright bg-dev-bg shadow-window">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dev-border bg-dev-surface px-4 py-3 font-mono text-xs text-dev-secondary">
        <span><span aria-hidden="true" className="mr-2 text-dev-accent">●</span>DEV.OS / workspace</span>
        <span>Portfolio applications · Direct pages above</span>
      </div>
      <div className="min-h-[420px] bg-[radial-gradient(circle_at_10%_10%,rgb(var(--dev-color-accent)/0.06),transparent_40%)] p-3 sm:p-5">
        {visibleApps.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleApps.map((id) => {
              const app = getWorkspaceApp(id);
              return (
                <OsWindow
                  key={id}
                  appId={id}
                  title={app.label}
                  href={id === "terminal" ? undefined : app.href}
                  focused={focusedApp === id}
                  onFocus={() => focusWindow(id)}
                  onMinimize={() => closeOrMinimize(id, "minimize")}
                  onClose={() => closeOrMinimize(id, "close")}
                >
                  {id === "terminal"
                    ? <Terminal onOpenApp={selectApp} />
                    : <WorkspaceContent appId={id} projectSlug={id === "projects" ? projectSlug : undefined} />}
                </OsWindow>
              );
            })}
          </div>
        ) : (
          <div className="grid min-h-[380px] place-content-center gap-4 text-center">
            <p className="font-mono text-lg text-dev-text">All windows are closed or minimized.</p>
            <button type="button" onClick={() => { setLauncherOpen(true); launcherButtonRef.current?.focus(); }} className="rounded-control border border-dev-accent px-4 py-3 font-mono text-sm text-dev-accent hover:bg-dev-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">Open applications</button>
            <Link href="/projects" className="text-sm text-dev-secondary hover:text-dev-accent focus-visible:text-dev-accent">Browse projects directly ↗</Link>
          </div>
        )}
      </div>
      <Launcher
        open={launcherOpen}
        onSelect={selectApp}
        onClose={() => setLauncherOpen(false)}
        triggerRef={launcherButtonRef}
      />
      <Taskbar
        openApps={openApps}
        focusedApp={focusedApp}
        minimizedApps={minimizedApps}
        launcherOpen={launcherOpen}
        launcherButtonRef={launcherButtonRef}
        onToggleLauncher={() => setLauncherOpen(!launcherOpen)}
        onOpenApp={restoreApp}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={selectApp}
      />
      <p className="sr-only" role="status" aria-live="polite">
        {focusedApp ? `${getWorkspaceApp(focusedApp).label} window active` : "No window active"}
      </p>
    </section>
  );
}

export function Desktop({ initialSelection }: { initialSelection: WorkspaceSelection }) {
  return (
    <OsStoreProvider initialApp={initialSelection.appId}>
      <DesktopBody initialSelection={initialSelection} />
    </OsStoreProvider>
  );
}
