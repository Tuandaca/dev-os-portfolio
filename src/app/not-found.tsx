import Link from "next/link";

const linkClass = "font-mono text-sm text-dev-accent underline-offset-4 hover:underline focus-visible:underline";

export default function NotFound() {
  return (
    <section className="dev-panel max-w-2xl rounded-panel p-7 sm:p-10" aria-labelledby="not-found-heading">
      <p className="font-mono text-xs uppercase tracking-widest text-dev-muted">DEV.OS / 404</p>
      <h1 id="not-found-heading" className="mt-4 text-3xl font-semibold">Page not found.</h1>
      <p className="mt-4 leading-7 text-dev-secondary">The address may be outdated. Continue through one of the direct portfolio pages.</p>
      <nav aria-label="Portfolio fallback pages" className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
        <Link href="/" className={linkClass}>Home</Link>
        <Link href="/projects" className={linkClass}>Projects</Link>
        <Link href="/resume" className={linkClass}>Resume</Link>
        <Link href="/contact" className={linkClass}>Contact</Link>
      </nav>
    </section>
  );
}
