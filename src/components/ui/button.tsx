import type { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "./class-names";

type Variant = "primary" | "secondary" | "quiet";
type Size = "default" | "compact";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control border font-medium leading-none transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "border-dev-accent bg-dev-accent text-dev-bg hover:bg-dev-text hover:border-dev-text active:bg-dev-secondary",
  secondary:
    "border-dev-border-bright bg-dev-surface text-dev-text hover:border-dev-accent hover:bg-dev-elevated active:bg-dev-bg",
  quiet:
    "border-transparent bg-transparent text-dev-text hover:bg-dev-elevated active:bg-dev-surface",
};

const sizes: Record<Size, string> = {
  default: "min-h-11 px-4 text-sm",
  compact: "min-h-9 px-3 text-xs",
};

function buttonClass(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "default",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
