"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { workspaceApps, type WorkspaceAppId } from "@/lib/workspace-registry";
import { runTerminalCommand, type TerminalCommandResult } from "@/lib/terminal-commands";

type Output = Exclude<TerminalCommandResult, { kind: "clear" }>;
type Entry = { id: number; command: string; output: Output };

export function Terminal({ onOpenApp }: { onOpenApp: (id: WorkspaceAppId) => void }) {
  const inputId = useId();
  const nextId = useRef(0);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const output = runTerminalCommand(input);
    if (output.kind === "clear") {
      setEntries([]);
    } else {
      setEntries((current) => [...current.slice(-49), { id: ++nextId.current, command: input.trim(), output }]);
      if (output.kind === "open") onOpenApp(output.appId);
    }
    setInput("");
  }

  return (
    <section aria-label="DEV.OS terminal" className="space-y-4 font-mono text-sm text-dev-text">
      <div className="rounded-control border border-dev-border bg-dev-bg p-4 sm:p-5">
        <p className="text-dev-secondary">Local portfolio navigation. Type <code className="text-dev-accent">help</code> for commands.</p>
        <div role="log" aria-label="Terminal output" className="mt-5 max-h-80 min-h-32 space-y-4 overflow-y-auto break-words">
          {entries.map(({ id, command, output }) => (
            <div key={id} className="space-y-1">
              <p><span aria-hidden="true" className="text-dev-accent">&gt; </span>{command}</p>
              {output.kind === "help" ? (
                <ul className="space-y-1 text-dev-secondary">
                  {output.lines.map((line) => <li key={line}>{line}</li>)}
                </ul>
              ) : (
                <p className={output.kind === "unknown" ? "text-dev-amber" : "text-dev-secondary"}>
                  {output.message}
                  {output.kind === "open" ? (
                    <>
                      {" "}
                      <Link href={workspaceApps.find((app) => app.id === output.appId)?.href ?? "/projects"} className="text-dev-accent underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">
                        Open direct page
                      </Link>
                    </>
                  ) : null}
                </p>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="mt-5 flex items-center gap-2 border-t border-dev-border pt-4">
          <label htmlFor={inputId} className="shrink-0 text-dev-accent">Command &gt;</label>
          <input
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={80}
            autoComplete="off"
            spellCheck={false}
            className="min-h-11 min-w-0 flex-1 rounded-control bg-dev-surface px-3 text-dev-text outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent"
            placeholder="help"
          />
          <button type="submit" className="min-h-11 rounded-control border border-dev-accent bg-dev-accent px-3 text-dev-bg hover:bg-dev-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">
            Run
          </button>
        </form>
      </div>
      <p className="text-xs leading-5 text-dev-muted">Commands only open portfolio apps. Standard pages are available through the site navigation.</p>
    </section>
  );
}
