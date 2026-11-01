import type { ComponentProps } from "react";
import { cn } from "./class-names";

type Tone = "neutral" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "border-dev-border-bright bg-dev-elevated text-dev-text",
  success: "border-dev-accent/40 bg-dev-accent/10 text-dev-accent",
  warning: "border-dev-amber/40 bg-dev-amber/10 text-dev-amber",
  danger: "border-dev-red/40 bg-dev-red/10 text-dev-red",
};

export type StatusPillProps = ComponentProps<"span"> & {
  tone?: Tone;
};

export function StatusPill({
  tone = "neutral",
  className,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-xs leading-none", tones[tone], className)}
      {...props}
    />
  );
}
