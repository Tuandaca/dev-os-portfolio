import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, description, children }: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-12 max-w-3xl">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-dev-accent">{eyebrow}</p>
      <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
      {description ? <p className="mt-5 text-lg leading-8 text-dev-secondary">{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}
