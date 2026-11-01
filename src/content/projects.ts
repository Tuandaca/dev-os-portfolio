export type ProjectSource = "CV" | "Repository code";

export interface FeaturedProject {
  slug: string;
  title: string;
  kind: "Personal project" | "Collaborative capstone";
  period?: string;
  summary: string;
  cvTechnologies: readonly string[];
  codeTechnologies: readonly string[];
  highlights: readonly { text: string; source: ProjectSource }[];
  repositoryUrl?: string;
}

/** CV is the baseline; code claims were checked at the commits in docs/CONTENT_SOURCE.md. */
export const featuredProjects: readonly FeaturedProject[] = [
  {
    slug: "cinema",
    title: "Cinema — Movie Ticket Booking Platform",
    kind: "Personal project",
    summary:
      "A full-stack cinema booking concept covering seat selection, reservations, order management, and AI-assisted movie guidance.",
    cvTechnologies: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Redis", "Socket.IO", "AI/LLM"],
    codeTechnologies: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Redis", "Socket.IO", "Gemini"],
    highlights: [
      { text: "The CV describes seat selection, reservations, order management, and AI-assisted recommendations.", source: "CV" },
      { text: "The repository separates a Next.js web app from a NestJS API and defines seat and booking data with Prisma/PostgreSQL.", source: "Repository code" },
      { text: "Booking code uses Redis-backed seat locking and Socket.IO seat events.", source: "Repository code" },
      { text: "The AI service provides Gemini-based guidance; its prompt keeps booking and payment actions under user control.", source: "Repository code" },
    ],
    repositoryUrl: "https://github.com/Tuandaca/cinema",
  },
  {
    slug: "travel-ai",
    title: "Travel AI — RAG & Knowledge Graph QA",
    kind: "Collaborative capstone",
    period: "Sep–Dec 2025",
    summary:
      "A collaborative capstone prototype for questions about Ho Chi Minh City transport, culture, and tourism, combining retrieval and knowledge graph ideas.",
    cvTechnologies: ["Python", "FastAPI", "sentence-transformers", "FAISS", "RAG", "Knowledge Graph/Neo4j", "LLM"],
    codeTechnologies: ["Python", "FastAPI", "sentence-transformers", "Neo4j vector index", "Gemini"],
    highlights: [
      { text: "The CV records PDF, JSON, and Excel data preparation, multilingual sentence embeddings, and a FAISS retrieval prototype.", source: "CV" },
      { text: "The CV describes evaluation using Recall@k, nDCG@10, and latency targets; it does not report achieved scores.", source: "CV" },
      { text: "The current repository backend exposes FastAPI chat endpoints, Neo4j graph routing, and tourism retrieval using sentence embeddings and a Neo4j vector index.", source: "Repository code" },
      { text: "The repository includes Gemini integration for generated answers; the current backend does not show FAISS as its serving index.", source: "Repository code" },
    ],
  },
];

export function getFeaturedProject(slug: string): FeaturedProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}
