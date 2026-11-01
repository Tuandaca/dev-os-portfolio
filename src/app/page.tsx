import Link from "next/link";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { workExperience } from "@/content/experience";
import { ProjectsContent } from "@/components/portfolio/content-sections";

const primaryAction = "inline-flex items-center justify-center rounded-md border border-dev-accent bg-dev-accent px-5 py-3 font-mono text-sm font-semibold text-dev-bg hover:bg-dev-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";
const secondaryAction = "inline-flex items-center justify-center rounded-md border border-dev-border-bright px-5 py-3 font-mono text-sm text-dev-text hover:border-dev-accent hover:text-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="grid min-h-[520px] items-center gap-10 border-b border-dev-border/80 pb-16 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-dev-accent">DEV.OS / Portfolio</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            {profile.name}<span className="text-dev-accent">.</span>
          </h1>
          <p className="mt-5 text-xl font-medium text-dev-text sm:text-2xl">{profile.headline}</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-dev-secondary sm:text-lg">{profile.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/workspace" className={primaryAction}>Enter DEV.OS →</Link>
            <Link href="/projects" className={secondaryAction}>Browse portfolio</Link>
          </div>
          <p className="mt-5 text-sm text-dev-secondary">
            Prefer a quick scan? <Link href="/resume" className="text-dev-accent underline-offset-4 hover:underline focus-visible:underline">View resume</Link>
            <span aria-hidden="true"> · </span>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-dev-accent underline-offset-4 hover:underline focus-visible:underline">GitHub ↗</a>
          </p>
        </div>
        <div className="dev-panel rounded-2xl p-6 font-mono text-sm shadow-window sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-dev-accent">Profile / Overview</p>
          <dl className="mt-8 space-y-5">
            <div className="border-b border-dev-border pb-4">
              <dt className="text-xs uppercase text-dev-muted">Focus</dt>
              <dd className="mt-1 text-dev-text">Full-stack applications · REST APIs · software architecture · AI/RAG</dd>
            </div>
            <div className="border-b border-dev-border pb-4">
              <dt className="text-xs uppercase text-dev-muted">Experience context</dt>
              <dd className="mt-1 text-dev-text">{profile.experienceContext}</dd>
            </div>
            <div className="border-b border-dev-border pb-4">
              <dt className="text-xs uppercase text-dev-muted">Based in</dt>
              <dd className="mt-1 text-dev-text">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-dev-muted">Work history</dt>
              <dd className="mt-1 text-dev-text">University IT role and freelance evaluation</dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="projects-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-dev-accent">01 / Selected work</p>
            <h2 id="projects-heading" className="mt-3 text-3xl font-semibold sm:text-4xl">Featured projects</h2>
            <p className="mt-3 max-w-2xl leading-7 text-dev-secondary">Read the implementation evidence, decisions, and open questions behind each project.</p>
          </div>
          <Link href="/projects" className="font-mono text-sm text-dev-accent hover:underline focus-visible:underline">All projects →</Link>
        </div>
        <ProjectsContent />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="dev-panel rounded-xl p-7 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-dev-accent">02 / Work</p>
          <h2 className="mt-3 text-3xl font-semibold">Experience</h2>
          <p className="mt-5 leading-8 text-dev-secondary">{workExperience[0].role} in the {workExperience[0].context}, {workExperience[0].period}. The CV also records a separate freelance web data evaluation role.</p>
          <Link href="/experience" className="mt-6 inline-block font-mono text-sm text-dev-accent hover:underline focus-visible:underline">View work history and education →</Link>
        </div>
        <div className="dev-panel rounded-xl p-7 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-dev-accent">03 / Toolkit</p>
          <h2 className="mt-3 text-3xl font-semibold">Technical stack</h2>
          <p className="mt-5 leading-8 text-dev-secondary">{skillGroups[1].items.slice(0, 4).join(" · ")} · {skillGroups[3].items.slice(0, 4).join(" · ")}</p>
          <Link href="/skills" className="mt-6 inline-block font-mono text-sm text-dev-accent hover:underline focus-visible:underline">Explore skills and workflow →</Link>
        </div>
      </section>

      <section className="dev-panel flex flex-wrap items-center justify-between gap-6 rounded-xl p-7 sm:p-9">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-dev-accent">04 / Connect</p>
          <h2 className="mt-3 text-2xl font-semibold">See the CV or start a conversation.</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className={primaryAction}>Contact →</Link>
          <Link href="/workspace" className={secondaryAction}>Open DEV.OS workspace</Link>
        </div>
      </section>
    </div>
  );
}
