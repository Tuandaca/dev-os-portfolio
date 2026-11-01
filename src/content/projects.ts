export type ProjectSource = "CV" | "Repository code" | "Repository documentation";

export interface EvidenceItem {
  text: string;
  source: ProjectSource;
  /** Maintainer source pointer; public rendering uses the source label only. */
  ref?: string;
}

export type CaseStudySection =
  | { status: "verified"; items: readonly EvidenceItem[] }
  | { status: "TODO"; note: string };

export interface ProjectCaseStudy {
  problem: CaseStudySection;
  objectives: CaseStudySection;
  contributions: CaseStudySection;
  architecture: CaseStudySection;
  engineeringDecisions: CaseStudySection;
  challenges: CaseStudySection;
  verifiedResults: CaseStudySection;
}

export interface FeaturedProject {
  slug: string;
  title: string;
  kind: "Personal project" | "Collaborative capstone" | "Public repository sample";
  period?: string;
  summary: string;
  cvTechnologies: readonly string[];
  codeTechnologies: readonly string[];
  highlights: readonly EvidenceItem[];
  caseStudy: ProjectCaseStudy;
  repositoryUrl?: string;
  repositoryLinks?: readonly { label: string; url: string }[];
  liveDemoLinks?: readonly { label: string; url: string }[];
}

const todo = (note: string): CaseStudySection => ({ status: "TODO", note });
const verified = (...items: EvidenceItem[]): CaseStudySection => ({ status: "verified", items });

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
    caseStudy: {
      problem: todo("A specific user problem or business brief has not been supplied beyond the booking concept in the CV."),
      objectives: verified({ text: "The CV describes a platform for seat selection, reservations, order management, and AI-assisted movie guidance.", source: "CV" }),
      contributions: verified({ text: "The CV presents Cinema as a personal project and lists the booking and AI-assisted features. It does not isolate a dated commercial role or measured outcome for this work.", source: "CV" }),
      architecture: verified({ text: "The inspected repository separates a Next.js web app from a NestJS API, with Prisma/PostgreSQL seat and booking models.", source: "Repository code" }),
      engineeringDecisions: verified(
        { text: "Booking code uses Redis-backed seat locking and Socket.IO events to coordinate seat state.", source: "Repository code" },
        { text: "The Gemini guidance service leaves booking and payment actions under user control.", source: "Repository code" },
      ),
      challenges: todo("No source confirms specific implementation obstacles, trade-offs, or how they were resolved."),
      verifiedResults: todo("No independent runtime, reliability, payment-completion, or deployment results have been verified."),
    },
    repositoryUrl: "https://github.com/Tuandaca/cinema",
  },
  {
    slug: "travel-ai",
    title: "Travel AI — Multimodal RAG Q&A System",
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
    caseStudy: {
      problem: verified({ text: "The CV frames the prototype around answering Ho Chi Minh City transport, culture, and tourism questions from prepared sources.", source: "CV" }),
      objectives: verified({ text: "The CV describes combining retrieval with a knowledge graph for travel question answering and evaluating Recall@k, nDCG@10, and latency as targets, without reported scores.", source: "CV" }),
      contributions: verified({ text: "The CV records preparation of PDF, JSON, and Excel data, multilingual sentence embeddings, and a FAISS retrieval prototype. The repository is collaborative, so individual ownership of its current backend is not inferred.", source: "CV" }),
      architecture: verified({ text: "Inspected backend code exposes FastAPI chat and image-chat endpoints, Neo4j graph routing, sentence-embedding retrieval through a Neo4j vector index, and Gemini answer generation. The image-chat endpoint does not establish multimodal retrieval.", source: "Repository code" }),
      engineeringDecisions: verified({ text: "The current backend queries a Neo4j vector index; the FAISS work is documented by the CV as a prototype and is not presented as the current serving index.", source: "Repository code" }),
      challenges: todo("Specific obstacles, trade-offs, and the owner's individual role in resolving them need source or owner confirmation."),
      verifiedResults: todo("The CV lists evaluation targets but no achieved scores. Deployment and runtime outcomes have not been independently verified."),
    },
  },
  {
    slug: "gymlvl",
    title: "GymLVL — Fitness RPG",
    kind: "Public repository sample",
    summary:
      "A public Flutter fitness-app repository containing dashboard, workout, quests, and profile routes, with Supabase-backed data structures.",
    cvTechnologies: [],
    codeTechnologies: ["Flutter", "Dart", "Riverpod", "GoRouter", "Supabase", "PostgreSQL"],
    highlights: [
      { text: "The Flutter router defines dashboard, workout, quests, profile, onboarding, and coach routes.", source: "Repository code" },
      { text: "The manifest includes Riverpod, GoRouter, and Supabase Flutter; the repository includes Supabase migrations and Edge Functions.", source: "Repository code" },
    ],
    caseStudy: {
      problem: todo("A specific user problem and product brief have not been confirmed by the CV or owner."),
      objectives: verified(
        { text: "The route map and screen modules cover dashboard, workout, quests, and profile flows.", source: "Repository code" },
        { text: "The README describes RPG-style progression and Vietnamese/English interfaces.", source: "Repository documentation" },
      ),
      contributions: todo("The CV does not list GymLVL. Individual design, implementation, and review responsibilities need owner confirmation."),
      architecture: verified({ text: "Flutter screens are routed with GoRouter and Riverpod; Supabase client dependencies, PostgreSQL migrations, and Edge Function directories are present.", source: "Repository code" }),
      engineeringDecisions: verified({ text: "The router uses a StatefulShellRoute for the four main dashboard, workout, quests, and profile branches.", source: "Repository code" }),
      challenges: todo("Repository reports describe an ongoing verification pass, but the owner's specific challenges and resolutions are unconfirmed."),
      verifiedResults: todo("A public production release and complete end-to-end runtime outcome have not been independently verified."),
    },
    repositoryUrl: "https://github.com/Tuandaca/gymlvl",
  },
  {
    slug: "business-websites",
    title: "Business Website Projects",
    kind: "Public repository sample",
    summary:
      "Two public Next.js landing-page repositories with composed sections for generic business offerings and contact paths.",
    cvTechnologies: [],
    codeTechnologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    highlights: [
      { text: "The first repository composes hero, features, about, testimonials, contact, and footer components on its homepage.", source: "Repository code" },
      { text: "The second repository composes a similar landing page and dynamically loads AOS for entrance effects.", source: "Repository code" },
    ],
    caseStudy: {
      problem: todo("The CV and repositories do not identify a client, business brief, or measured problem to solve."),
      objectives: verified({ text: "The page code presents generic service messaging, feature sections, and contact calls to action in two landing-page variants.", source: "Repository code" }),
      contributions: todo("The CV does not list these repositories, and their v0 sync does not establish the owner's individual design or coding contribution."),
      architecture: verified({ text: "Both codebases use Next.js App Router pages that compose separate presentation components; package manifests include React, TypeScript, and Tailwind CSS.", source: "Repository code" }),
      engineeringDecisions: verified({ text: "The v2 homepage dynamically imports AOS in a client component; the v1 homepage composes its page sections without that effect loader.", source: "Repository code" }),
      challenges: todo("No verified source describes engineering obstacles or trade-offs for either sample."),
      verifiedResults: todo("No business results or client outcomes are verified. Only the v1 demo's public response and business-themed page title were checked."),
    },
    repositoryLinks: [
      { label: "Business website v1 source", url: "https://github.com/Tuandaca/business-website-v1" },
      { label: "Business website v2 source", url: "https://github.com/Tuandaca/business-website-v2" },
    ],
    liveDemoLinks: [
      { label: "Business website v1 demo", url: "https://bussiness-website-v1.vercel.app/" },
    ],
  },
];

export function getFeaturedProject(slug: string): FeaturedProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}
