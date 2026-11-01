/** CV skill inventory; no proficiency levels are inferred. */
export const skillGroups = [
  { name: "Languages", items: ["C#", "JavaScript", "TypeScript", "Python", "SQL"] },
  { name: "Backend & APIs", items: ["ASP.NET Core", "Node.js", "NestJS", "FastAPI", "RESTful APIs"] },
  { name: "Frontend", items: ["Next.js", "React", "Vue.js", "Tailwind CSS"] },
  { name: "Data & Infrastructure", items: ["SQL Server", "PostgreSQL", "MongoDB", "Neo4j", "Prisma", "Redis", "Git", "Docker"] },
  { name: "AI & Engineering Workflow", items: ["RAG", "LLM integration", "Knowledge Graph", "FAISS", "AI coding agents (Antigravity)", "Gemini", "UML", "API testing", "debugging", "refactoring"] },
] as const;

export const developmentPractice =
  "Uses AI-assisted workflows for boilerplate, error investigation, refactoring suggestions, test ideas, and documentation; reviews generated code and validates API/UI behavior before integration.";
