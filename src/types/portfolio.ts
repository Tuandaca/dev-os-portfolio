export interface ProjectArchitecture {
  summary: string;
  components: Array<{
    name: string;
    role: string;
    tech: string;
    description: string;
  }>;
  dataFlow: string[];
  keyDecisions: Array<{
    decision: string;
    rationale: string;
    tradeoff: string;
  }>;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: "Fullstack / AI" | "Fullstack Web" | "Mobile / Cross-platform" | "Frontend / Web";
  period: string;
  featured: boolean;
  overview: string;
  problemStatement: string;
  objectives: string[];
  architecture: ProjectArchitecture;
  technologies: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    ai?: string[];
    devops?: string[];
    tools?: string[];
  };
  engineeringChallenges: Array<{
    challenge: string;
    solution: string;
    impact: string;
  }>;
  verifiedResults: string[];
  links: {
    github?: string;
    liveDemo?: string;
    docs?: string;
  };
  metrics?: { label: string; value: string }[];
}

export interface SkillCategory {
  category: string;
  skills: Array<{
    name: string;
    level: "Core" | "Advanced" | "Proficient";
    context: string;
    icon?: string;
  }>;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  verified: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  highlights: string[];
}
