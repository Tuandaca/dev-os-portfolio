"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { workspaceApps, type WorkspaceAppId } from "@/lib/workspace-registry";

export function CommandPalette({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: WorkspaceAppId) => void;
}) {
  const searchId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    return () => previousFocus.current?.focus();
  }, [open]);

  if (!open) return null;

  const results = workspaceApps.filter((app) => app.label.toLowerCase().includes(query.trim().toLowerCase()));

  function choose(id: WorkspaceAppId) {
    setQuery("");
    onSelect(id);
    onClose();
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) return;
    const resultButtons = Array.from(dialog.querySelectorAll<HTMLButtonElement>("[data-palette-result]"));
    const currentIndex = resultButtons.indexOf(event.target as HTMLButtonElement);

    if (event.key === "ArrowDown" && resultButtons.length > 0) {
      event.preventDefault();
      resultButtons[(currentIndex + 1) % resultButtons.length].focus();
      return;
    }
    if (event.key === "ArrowUp" && currentIndex >= 0) {
      event.preventDefault();
      if (currentIndex === 0) inputRef.current?.focus();
      else resultButtons[currentIndex - 1].focus();
      return;
    }
    if (event.key === "Enter" && event.target === inputRef.current && results[0]) {
      event.preventDefault();
      choose(results[0].id);
      return;
    }
    if (event.key === "Tab") {
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("input:not([disabled]), button:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-dev-bg/80 px-4 pt-[12vh]"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeys}
        className="w-full max-w-xl rounded-panel border border-dev-border-bright bg-dev-surface p-4 text-dev-text shadow-window-focus sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={searchId} className="font-mono text-sm font-medium text-dev-accent">Open an app</label>
          <button type="button" onClick={onClose} aria-label="Close command palette" className="min-h-9 rounded-control px-3 text-dev-secondary hover:bg-dev-elevated hover:text-dev-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">Esc</button>
        </div>
        <input
          ref={inputRef}
          id={searchId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="mt-3 min-h-11 w-full rounded-control border border-dev-border-bright bg-dev-bg px-3 font-mono text-sm text-dev-text outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent"
          placeholder="Search About, Projects, Resume…"
        />
        <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto" aria-label="Available applications">
          {results.map((app) => (
            <li key={app.id}>
              <button
                type="button"
                data-palette-result
                onClick={() => choose(app.id)}
                className="flex min-h-11 w-full items-center justify-between rounded-control px-3 text-left font-mono text-sm text-dev-text hover:bg-dev-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent"
              >
                <span>{app.label}</span>
                <span className="text-xs text-dev-muted">{app.href}</span>
              </button>
            </li>
          ))}
          {results.length === 0 ? <li className="px-3 py-4 text-sm text-dev-secondary">No matching app.</li> : null}
        </ul>
        <p className="mt-3 font-mono text-xs text-dev-muted">Use Enter or arrow keys to select. Escape returns to your previous control.</p>
      </div>
    </div>
  );
}
