/** Roles and dates are transcribed from the supplied CV; work types stay distinct. */
export const workExperience = [
  {
    role: "Software Developer",
    context: "IT Department, Van Lang University",
    period: "2025–2026",
    kind: "university-role",
    responsibilities: [
      "Contributed to a web platform that helps students find university information and ask or answer study-related questions.",
      "Designed Use Case, Class, and Sequence diagrams and translated requirements into implementation tasks.",
      "Worked with ASP.NET Core/.NET APIs, Vue.js, and SQL Server; supported functional testing, debugging, and iterative improvements with the mentor and team.",
    ],
  },
  {
    role: "Web Data Evaluator",
    context: "Freelance · Rating Task",
    period: "2021–2025",
    kind: "freelance",
    responsibilities: [
      "Evaluated web page quality, relevance, and search intent alignment against standardized guidelines.",
      "Reviewed digital content for accuracy, authority, and trustworthiness.",
    ],
  },
] as const;

export const education = {
  degree: "Bachelor of Software Engineering",
  institution: "Ton Duc Thang University",
  period: "2021–2026",
  gpa: "7.01/10",
} as const;

export const certifications = [
  { name: "Aptis ESOL", level: "B2", year: "2024" },
] as const;
