import type { ComponentProps } from "react";
import { cn } from "./class-names";

export type PanelProps = ComponentProps<"div"> & {
  elevation?: "flat" | "raised";
};

export function Panel({
  elevation = "flat",
  className,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-dev-border p-4 text-dev-text sm:p-6",
        elevation === "raised" ? "bg-dev-elevated shadow-window" : "bg-dev-surface",
        className,
      )}
      {...props}
    />
  );
}
