import { skillGroups } from "@/content/skills";

type CvSkill = (typeof skillGroups)[number]["items"][number];

export interface SkillCluster {
  id: string;
  label: string;
  /** Exact names from the CV-backed inventory in skills.ts; no proficiency is implied. */
  items: readonly CvSkill[];
  description: string;
  concept: {
    label: string;
    steps: readonly string[];
    explanation: string;
  };
}

/**
 * Spatial groupings for the immersive interface. Concepts explain software ideas;
 * they are not traces of a live service or claims of project outcomes.
 */
export const skillClusters = [
  {
    id: "frontend",
    label: "Frontend Engineering",
    items: ["TypeScript", "Next.js", "React", "Vue.js", "Tailwind CSS"],
    description: "Interface frameworks and presentation tools listed in the CV.",
    concept: {
      label: "Conceptual interface cycle",
      steps: ["User action", "UI state", "Accessible feedback"],
      explanation: "A simplified interaction model, not a recorded product session.",
    },
  },
  {
    id: "backend",
    label: "Backend & APIs",
    items: ["C#", "Python", "ASP.NET Core", "Node.js", "NestJS", "FastAPI", "RESTful APIs"],
    description: "Languages, server frameworks, and API work named in the CV.",
    concept: {
      label: "Conceptual API cycle",
      steps: ["Request", "Service", "Response"],
      explanation: "A simplified request path, not a live endpoint trace.",
    },
  },
  {
    id: "data",
    label: "Databases & Infrastructure",
    items: ["SQL", "SQL Server", "PostgreSQL", "MongoDB", "Neo4j", "Prisma", "Redis", "Docker"],
    description: "Relational, document, graph, cache, and infrastructure tools in the CV inventory.",
    concept: {
      label: "Conceptual data path",
      steps: ["Application", "Data access", "Store"],
      explanation: "A general data-flow sketch, not a diagram of a deployed project.",
    },
  },
  {
    id: "ai",
    label: "AI & RAG Engineering",
    items: ["Python", "RAG", "LLM integration", "Knowledge Graph", "FAISS", "Gemini"],
    description: "Retrieval, graph, and language-model concepts represented in the CV.",
    concept: {
      label: "Conceptual RAG flow",
      steps: ["Question", "Retrieval", "Context", "Generated answer"],
      explanation: "An illustrative flow, not a Travel AI runtime trace or evaluation result.",
    },
  },
  {
    id: "architecture",
    label: "Software Architecture",
    items: ["UML", "RESTful APIs", "API testing", "debugging", "refactoring"],
    description: "Modeling and engineering practices stated in the CV.",
    concept: {
      label: "Conceptual design loop",
      steps: ["Requirements", "UML model", "API contract", "Test feedback"],
      explanation: "A simplified engineering loop, not a claim about a specific deliverable.",
    },
  },
  {
    id: "workflow",
    label: "AI-Augmented Development",
    items: ["AI coding agents (Antigravity)", "Gemini", "API testing", "debugging", "refactoring"],
    description: "AI-assisted work paired with review and validation, as described in the CV.",
    concept: {
      label: "Conceptual review loop",
      steps: ["Draft", "Review", "Test", "Integrate"],
      explanation: "A general workflow illustration; generated code still needs human review.",
    },
  },
] as const satisfies readonly SkillCluster[];

export type SkillClusterId = (typeof skillClusters)[number]["id"];

export function getSkillCluster(id: string) {
  return skillClusters.find((cluster) => cluster.id === id);
}
