import Link from "next/link";
import { profile } from "@/content/profile";
import { certifications, education, workExperience } from "@/content/experience";
import { developmentPractice, skillGroups } from "@/content/skills";
import { featuredProjects, type FeaturedProject } from "@/content/projects";

const actionClass = "inline-flex items-center justify-center rounded-md border border-dev-accent bg-dev-accent px-5 py-3 font-mono text-sm font-semibold text-dev-bg transition-colors hover:bg-dev-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";
const secondaryActionClass = "inline-flex items-center justify-center rounded-md border border-dev-border-bright px-5 py-3 font-mono text-sm text-dev-text transition-colors hover:border-dev-accent hover:text-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";

export function AboutContent() {
  return (
    <div className="space-y-8">
      <div className="dev-panel rounded-xl p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dev-accent">Professional summary</p>
        <p className="mt-5 text-base leading-8 text-dev-text sm:text-lg">{profile.summary}</p>
        <p className="mt-6 border-l-2 border-dev-accent pl-4 font-mono text-sm text-dev-secondary">
          {profile.experienceContext}. Dated work roles are listed separately under Experience.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="dev-panel rounded-xl p-6">
          <h2 className="text-lg font-semibold">Full-stack applications</h2>
          <p className="mt-3 leading-7 text-dev-secondary">ASP.NET Core, Vue.js, Next.js, Node.js/NestJS, and REST APIs.</p>
        </div>
        <div className="dev-panel rounded-xl p-6">
          <h2 className="text-lg font-semibold">Data &amp; retrieval</h2>
          <p className="mt-3 leading-7 text-dev-secondary">Relational data with SQL Server and PostgreSQL, plus MongoDB, Neo4j, and RAG workflows.</p>
        </div>
        <div className="dev-panel rounded-xl p-6">
          <h2 className="text-lg font-semibold">Engineering practice</h2>
          <p className="mt-3 leading-7 text-dev-secondary">AI-assisted development with code review, API testing, debugging, and behavior validation.</p>
        </div>
      </div>
      <section className="dev-panel rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Engineering approach</h2>
        <p className="mt-3 leading-8 text-dev-secondary">
          The CV records Use Case, Class, and Sequence diagrams used to translate requirements into implementation tasks at Van Lang University. The Cinema repository separates its Next.js web app from a NestJS API. Those examples show how requirements and application boundaries are documented in practice.
        </p>
        <p className="mt-4 leading-8 text-dev-secondary">{developmentPractice}</p>
      </section>
    </div>
  );
}

export function ExperienceContent() {
  return (
    <div className="space-y-12">
      <section aria-labelledby="work-heading">
        <h2 id="work-heading" className="mb-5 text-2xl font-semibold">Work experience</h2>
        <div className="space-y-4">
          {workExperience.map((item) => (
            <article key={`${item.role}-${item.period}`} className="dev-panel rounded-xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-dev-accent">
                    {item.kind === "freelance" ? "Freelance" : "University IT role"}
                  </p>
                  <h3 className="text-xl font-semibold">{item.role}</h3>
                  <p className="mt-1 text-dev-secondary">{item.context}</p>
                </div>
                <p className="font-mono text-sm text-dev-secondary">{item.period}</p>
              </div>
              <ul className="mt-5 list-disc space-y-2 pl-5 leading-7 text-dev-secondary marker:text-dev-accent">
                {item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby="education-heading" className="dev-panel rounded-xl p-6 sm:p-8">
          <h2 id="education-heading" className="text-2xl font-semibold">Education</h2>
          <p className="mt-5 text-lg font-medium">{education.degree}</p>
          <p className="mt-1 text-dev-secondary">{education.institution}</p>
          <p className="mt-4 font-mono text-sm text-dev-accent">{education.period} · GPA {education.gpa}</p>
        </section>
        <section aria-labelledby="certification-heading" className="dev-panel rounded-xl p-6 sm:p-8">
          <h2 id="certification-heading" className="text-2xl font-semibold">Certification</h2>
          {certifications.map((item) => (
            <div key={item.name} className="mt-5">
              <p className="text-lg font-medium">{item.name}</p>
              <p className="mt-1 font-mono text-sm text-dev-accent">Level {item.level} · {item.year}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export function SkillsContent() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        {skillGroups.map((group) => (
          <section key={group.name} aria-label={group.name} className="dev-panel rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li key={skill} className="rounded border border-dev-border-bright/80 bg-dev-bg/50 px-3 py-1.5 font-mono text-xs text-dev-secondary">{skill}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="dev-panel rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold">AI-augmented development</h2>
        <p className="mt-3 leading-8 text-dev-secondary">{developmentPractice}</p>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  const technologies = project.cvTechnologies.length ? project.cvTechnologies : project.codeTechnologies;

  return (
    <article className="dev-panel flex h-full flex-col rounded-xl p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-dev-accent">
        {project.kind}{project.period ? ` · ${project.period}` : ""}
      </p>
      <h3 className="mt-4 text-2xl font-semibold leading-snug">{project.title}</h3>
      <p className="mt-4 flex-1 leading-7 text-dev-secondary">{project.summary}</p>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
        {technologies.slice(0, 5).map((technology) => (
          <li key={technology} className="rounded border border-dev-border-bright px-2.5 py-1 font-mono text-xs text-dev-muted">{technology}</li>
        ))}
      </ul>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href={`/projects/${project.slug}`} className={secondaryActionClass} aria-label={`Read ${project.title} case study`}>Read case study →</Link>
        {project.repositoryUrl ? (
          <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 font-mono text-sm text-dev-accent hover:underline focus-visible:underline">Repository ↗</a>
        ) : null}
      </div>
    </article>
  );
}

export function ProjectsContent() {
  return (
    <section aria-label="Featured projects" className="grid gap-5 lg:grid-cols-2">
      <h2 className="sr-only">Featured projects</h2>
      {featuredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
    </section>
  );
}

export function ProjectDetail({ project }: { project: FeaturedProject }) {
  const sectionEntries = [
    ["problem", "Problem"],
    ["objectives", "Objectives"],
    ["contributions", "My contributions"],
    ["architecture", "Architecture"],
    ["engineeringDecisions", "Engineering decisions"],
    ["challenges", "Challenges"],
    ["verifiedResults", "Verified results"],
  ] as const;
  const repositoryLinks = project.repositoryLinks ?? (project.repositoryUrl ? [{ label: "Repository", url: project.repositoryUrl }] : []);
  const liveDemoLinks = project.liveDemoLinks ?? [];

  return (
    <div className="space-y-8">
      <section className="dev-panel rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">At a glance</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-dev-secondary">{project.summary}</p>
        <p className="mt-5 font-mono text-sm text-dev-accent">{project.kind}{project.period ? ` · ${project.period}` : ""}</p>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        {sectionEntries.slice(0, 2).map(([key, title]) => (
          <CaseStudySection key={key} id={`${project.slug}-${key}`} title={title} section={project.caseStudy[key]} />
        ))}
      </div>
      <CaseStudySection id={`${project.slug}-contributions`} title="My contributions" section={project.caseStudy.contributions} />
      <CaseStudySection id={`${project.slug}-architecture`} title="Architecture" section={project.caseStudy.architecture} />
      <section aria-labelledby={`${project.slug}-stack`} className="dev-panel rounded-xl p-6 sm:p-8">
        <h2 id={`${project.slug}-stack`} className="text-xl font-semibold">Technology stack</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <TechnologyList title="Listed in the CV" technologies={project.cvTechnologies} />
          <TechnologyList title="Visible in repository code" technologies={project.codeTechnologies} />
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        {sectionEntries.slice(4).map(([key, title]) => (
          <CaseStudySection key={key} id={`${project.slug}-${key}`} title={title} section={project.caseStudy[key]} />
        ))}
      </div>
      <section aria-labelledby={`${project.slug}-sources`} className="dev-panel rounded-xl p-6 sm:p-8">
        <h2 id={`${project.slug}-sources`} className="text-xl font-semibold">Source and live demo</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-sm font-medium text-dev-text">Source</h3>
            {repositoryLinks.length ? (
              <ul className="mt-3 space-y-2">
                {repositoryLinks.map((link) => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-dev-accent underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">{link.label} ↗</a></li>)}
              </ul>
            ) : <p className="mt-3 text-sm leading-6 text-dev-secondary"><span className="font-mono text-dev-amber">TODO</span> · No repository link is approved for this page.</p>}
          </div>
          <div>
            <h3 className="font-mono text-sm font-medium text-dev-text">Live demo</h3>
            {liveDemoLinks.length ? (
              <ul className="mt-3 space-y-2">
                {liveDemoLinks.map((link) => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-dev-accent underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">{link.label} ↗</a></li>)}
              </ul>
            ) : <p className="mt-3 text-sm leading-6 text-dev-secondary"><span className="font-mono text-dev-amber">TODO</span> · A public live demo has not been verified.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function CaseStudySection({
  id,
  title,
  section,
}: {
  id: string;
  title: string;
  section: FeaturedProject["caseStudy"]["problem"];
}) {
  return (
    <section aria-labelledby={id} className="dev-panel rounded-xl p-6 sm:p-8">
      <h2 id={id} className="text-xl font-semibold">{title}</h2>
      {section.status === "verified" ? (
        <ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-dev-secondary marker:text-dev-accent">
          {section.items.map((item) => (
            <li key={item.text}>
              <span>{item.text}</span>
              <span className="ml-2 whitespace-nowrap font-mono text-xs text-dev-muted">[{item.source}]</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm leading-7 text-dev-secondary"><span className="font-mono font-semibold text-dev-amber">TODO</span> · {section.note}</p>
      )}
    </section>
  );
}

function TechnologyList({ title, technologies }: { title: string; technologies: readonly string[] }) {
  return (
    <div>
      <h3 className="font-mono text-sm font-medium text-dev-text">{title}</h3>
      {technologies.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {technologies.map((technology) => <li key={technology} className="rounded border border-dev-border-bright px-3 py-1.5 font-mono text-xs text-dev-secondary">{technology}</li>)}
        </ul>
      ) : <p className="mt-3 text-sm text-dev-secondary"><span className="font-mono text-dev-amber">TODO</span> · Not established by this source.</p>}
    </div>
  );
}

export function ResumeContent() {
  return (
    <section aria-label="Resume" className="space-y-6">
      <div className="dev-panel rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Original CV</h2>
        <p className="mt-3 leading-7 text-dev-secondary">Read the owner-provided CV for full work history, projects, education, and contact details.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={profile.resumeUrl} download className={actionClass}>Download PDF ↓</a>
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={secondaryActionClass}>Open in browser ↗</a>
        </div>
      </div>
      <iframe title={`${profile.name} resume PDF`} src={profile.resumeUrl} loading="lazy" className="h-[70vh] min-h-[420px] w-full rounded-xl border border-dev-border bg-white" />
    </section>
  );
}

export function ContactContent() {
  return (
    <section aria-label="Contact options" className="grid gap-4 md:grid-cols-2">
      <a href={`mailto:${profile.email}`} className="dev-panel rounded-xl p-6 transition-colors hover:border-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-dev-accent">
        <span className="font-mono text-xs uppercase tracking-widest text-dev-accent">Email</span>
        <span className="mt-3 block break-all text-lg font-medium">{profile.email}</span>
      </a>
      <a href={`tel:${profile.phone}`} className="dev-panel rounded-xl p-6 transition-colors hover:border-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-dev-accent">
        <span className="font-mono text-xs uppercase tracking-widest text-dev-accent">Phone</span>
        <span className="mt-3 block text-lg font-medium">{profile.phone}</span>
      </a>
      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="dev-panel rounded-xl p-6 transition-colors hover:border-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-dev-accent">
        <span className="font-mono text-xs uppercase tracking-widest text-dev-accent">GitHub</span>
        <span className="mt-3 block text-lg font-medium">github.com/Tuandaca ↗</span>
      </a>
      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="dev-panel rounded-xl p-6 transition-colors hover:border-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-dev-accent">
        <span className="font-mono text-xs uppercase tracking-widest text-dev-accent">Portfolio</span>
        <span className="mt-3 block text-lg font-medium">tuandacadev.vercel.app ↗</span>
      </a>
    </section>
  );
}
