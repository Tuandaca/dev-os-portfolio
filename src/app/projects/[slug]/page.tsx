import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredProjects, getFeaturedProject } from "@/content/projects";
import { PageIntro } from "@/components/portfolio/page-intro";
import { ProjectDetail } from "@/components/portfolio/content-sections";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return featuredProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFeaturedProject(slug);
  return project
    ? {
        title: project.title,
        description: project.summary,
        openGraph: { title: project.title, description: project.summary, type: "article" },
      }
    : { title: "Project not found" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getFeaturedProject(slug);
  if (!project) notFound();

  return (
    <>
      <PageIntro eyebrow="03 / Project case study" title={project.title} description={`${project.kind}${project.period ? ` · ${project.period}` : ""}`} />
      <ProjectDetail project={project} />
      <nav aria-label="More portfolio pages" className="mt-12 flex flex-wrap gap-5 border-t border-dev-border pt-8 font-mono text-sm">
        <Link href="/projects" className="text-dev-accent hover:underline focus-visible:underline">← All projects</Link>
        <Link href="/resume" className="text-dev-accent hover:underline focus-visible:underline">Resume →</Link>
        <Link href="/contact" className="text-dev-accent hover:underline focus-visible:underline">Contact →</Link>
      </nav>
    </>
  );
}
