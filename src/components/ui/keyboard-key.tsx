import type { ComponentProps } from "react";
import { cn } from "./class-names";

export function KeyboardKey({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn("inline-flex min-h-6 items-center rounded-control border border-dev-border-bright bg-dev-elevated px-1.5 font-mono text-xs text-dev-text", className)}
      {...props}
    />
  );
}
