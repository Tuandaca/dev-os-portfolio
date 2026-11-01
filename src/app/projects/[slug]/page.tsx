import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featuredProjects, getFeaturedProject } from "@/content/projects";
import { PageIntro } from "@/components/portfolio/page-intro";
import { ProjectDetail } from "@/components/portfolio/content-sections";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return featuredProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFeaturedProject(slug);
  return project ? { title: project.title, description: project.summary } : { title: "Project not found" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getFeaturedProject(slug);
  if (!project) notFound();

  return (
    <>
      <PageIntro eyebrow="03 / Project case study" title={project.title} description={`${project.kind}${project.period ? ` · ${project.period}` : ""}`} />
      <ProjectDetail project={project} />
    </>
  );
}
