"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import Link from "next/link";
import type { WorkspaceAppId } from "@/lib/workspace-registry";

export function OsWindow({
  appId,
  title,
  href,
  focused,
  onFocus,
  onMinimize,
  onClose,
  children,
}: {
  appId: WorkspaceAppId;
  title: string;
  href?: string;
  focused: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const windowRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);

  useEffect(() => {
    const element = windowRef.current;
    if (focused && element && !element.contains(document.activeElement)) {
      element.focus({ preventScroll: true });
    }
  }, [focused]);

  useEffect(() => {
    const resetPosition = () => setOffset({ x: 0, y: 0 });
    window.addEventListener("resize", resetPosition);
    return () => window.removeEventListener("resize", resetPosition);
  }, []);

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !window.matchMedia("(min-width: 768px)").matches) return;
    const element = windowRef.current;
    const canvas = element?.parentElement?.parentElement;
    if (!element || !canvas) return;

    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const left = Math.max(0, canvasRect.left);
    const right = Math.min(window.innerWidth, canvasRect.right);
    const top = Math.max(0, canvasRect.top);
    const bottom = Math.min(window.innerHeight, canvasRect.bottom);
    const minX = offset.x + left - rect.left;
    const maxX = offset.x + right - rect.right;
    const minY = offset.y + top - rect.top;
    const maxY = offset.y + bottom - rect.bottom;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
      minX: minX <= maxX ? minX : offset.x,
      maxX: minX <= maxX ? maxX : offset.x,
      minY: minY <= maxY ? minY : offset.y,
      maxY: minY <= maxY ? maxY : offset.y,
    };
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setOffset({
      x: Math.max(drag.minX, Math.min(drag.maxX, drag.startOffsetX + event.clientX - drag.startX)),
      y: Math.max(drag.minY, Math.min(drag.maxY, drag.startOffsetY + event.clientY - drag.startY)),
    });
  }

  function stopDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section
      ref={windowRef}
      tabIndex={-1}
      aria-labelledby={`os-window-title-${appId}`}
      onPointerDown={(event) => {
        if (!(event.target as HTMLElement).closest("[data-window-control]")) onFocus();
      }}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-window-control]")) onFocus();
      }}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      className={`relative min-w-0 overflow-hidden rounded-window border outline-none focus-visible:ring-2 focus-visible:ring-dev-accent ${focused
        ? "z-10 order-first border-dev-border-bright bg-dev-elevated shadow-window-focus md:col-span-2 md:w-full md:max-w-[50rem] md:justify-self-start"
        : "hidden border-dev-border bg-dev-surface shadow-window md:block"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dev-border bg-dev-bg/70 px-4 py-3">
        <div
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          className="flex min-w-0 flex-1 select-none items-center gap-3 md:cursor-grab md:touch-none md:active:cursor-grabbing"
          title="Drag window within the desktop"
        >
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${focused ? "bg-dev-accent" : "bg-dev-muted"}`} />
          <h2 id={`os-window-title-${appId}`} className="truncate font-mono text-sm font-semibold text-dev-text">{title}</h2>
          <span aria-hidden="true" className="hidden font-mono text-[10px] uppercase tracking-wider text-dev-muted md:inline">Drag</span>
          {focused ? <span className="sr-only">Active window</span> : null}
        </div>
        <div className="flex items-center gap-2">
          {href ? (
            <Link href={href} className="mr-1 rounded-control px-2 py-2 font-mono text-xs text-dev-secondary hover:text-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">
              Direct page ↗
            </Link>
          ) : null}
          <button data-window-control type="button" aria-label={`Minimize ${title}`} onClick={onMinimize} className="grid h-9 w-9 place-items-center rounded-control border border-dev-border-bright font-mono text-dev-secondary hover:bg-dev-surface hover:text-dev-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">−</button>
          <button data-window-control type="button" aria-label={`Close ${title}`} onClick={onClose} className="grid h-9 w-9 place-items-center rounded-control border border-dev-border-bright font-mono text-dev-secondary hover:bg-dev-surface hover:text-dev-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">×</button>
        </div>
      </div>
      <div className="max-h-[66vh] min-h-64 overflow-y-auto p-4 sm:p-6">{children}</div>
    </section>
  );
}
