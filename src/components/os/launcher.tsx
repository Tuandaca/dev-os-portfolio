"use client";

import { useEffect, useRef, type RefObject } from "react";
import { workspaceApps, type WorkspaceAppId } from "@/lib/workspace-registry";

export function Launcher({
  open,
  onSelect,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onSelect: (id: WorkspaceAppId) => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) firstButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, triggerRef]);

  return (
    <nav id="workspace-launcher" hidden={!open} aria-label="Application launcher" className="absolute bottom-20 left-3 z-30 w-[min(22rem,calc(100%-1.5rem))] rounded-panel border border-dev-border-bright bg-dev-surface p-3 shadow-window-focus sm:left-4">
      <div className="flex items-center justify-between gap-2 px-2 py-1">
        <p className="font-mono text-xs uppercase tracking-wider text-dev-accent">Applications</p>
        <button type="button" onClick={() => { onClose(); triggerRef.current?.focus(); }} className="rounded-control px-2 py-1 font-mono text-xs text-dev-secondary hover:text-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-dev-accent">Close</button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {workspaceApps.map((app, index) => (
          <button key={app.id} ref={index === 0 ? firstButtonRef : undefined} type="button" onClick={() => onSelect(app.id)} className="min-h-11 rounded-control border border-dev-border bg-dev-bg/60 px-3 text-left font-mono text-sm text-dev-text hover:border-dev-accent hover:bg-dev-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">
            {app.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
