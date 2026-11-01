"use client";

import { useEffect } from "react";

/** Focus the destination after the optional cinematic route transition. */
export function WorkspaceArrivalFocus() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("dev-os-intro-arrival") !== "1") return;
    } catch {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("workspace-heading")?.focus();
      try {
        window.sessionStorage.removeItem("dev-os-intro-arrival");
      } catch {
        // Storage may become unavailable after navigation; focus still works.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
}
