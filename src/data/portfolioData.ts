import { Project, SkillCategory, ExperienceItem, EducationItem } from "@/types/portfolio";

export const OWNER_INFO = {
  name: "Ngo Anh Tuan",
  handle: "Tuandaca",
  title: "Fullstack Developer & AI-Assisted Software Engineer",
  tagline: "Architecting resilient, high-performance web systems and AI-integrated developer applications.",
  email: "tuandaca@gmail.com",
  github: "https://github.com/Tuandaca",
  linkedin: "https://linkedin.com/in/tuandaca",
  location: "Vietnam",
  bio: [
    "Software Engineer dedicated to building robust fullstack systems, interactive web applications, and production-grade AI-assisted workflows.",
    "Experienced in Next.js, TypeScript, NestJS, Flutter, Python FastAPI, PostgreSQL, and autonomous multi-agent engineering environments.",
    "Driven by engineering rigor, zero-loss crash recovery architectures, and delightful cyber-minimalist interfaces."
  ],
  stats: [
    { label: "Core Projects", value: "4+" },
    { label: "Tech Stacks", value: "Fullstack + AI" },
    { label: "Architecture", value: "Modular & Scalable" },
    { label: "Engineering Standard", value: "Production-Ready" },
  ]
};

export const PROJECTS: Project[] = [
  {
    slug: "cinema-platform",
    title: "Cinema — Modern AI-Powered Booking Platform",
    tagline: "Enterprise-grade cinema booking platform with real-time seat locking and conversational AI assistant.",
    category: "Fullstack Web",
    period: "2025 - 2026",
    featured: true,
    overview:
      "A complete enterprise-grade cinema booking ecosystem combining Next.js 15 App Router, NestJS modular architecture, and Google Gemini 2.5 Flash / OpenAI GPT-4o for natural language film recommendations and booking workflows. Engineered with Redis distributed locks to eliminate seat double-booking under high concurrency.",
    problemStatement:
      "Traditional cinema booking systems struggle with seat race conditions during popular showtime launches, sluggish checkout experiences, and lack of contextual recommendations tailored to moviegoers' real-time mood.",
    objectives: [
      "Eliminate concurrent booking race conditions with atomic Redis lock leases and Socket.io broadcasts.",
      "Deliver sub-second response times for seating layouts with thousands of active showtimes.",
      "Integrate an intelligent AI assistant capable of structured function calling to guide moviegoers through seat selection and checkout.",
      "Support enterprise-ready payment simulation including VietQR Napas 247 and Stripe."
    ],
    architecture: {
      summary: "Micro-service inspired decoupled frontend and backend with WebSocket event sync, Redis state locks, and PostgreSQL transactional persistence.",
      components: [
        {
          name: "Client UI",
          role: "Cinematic Dark Experience",
          tech: "Next.js 15, React 19, Tailwind CSS, Framer Motion",
          description: "High-contrast cyber-cinematic UI with trailer autoplay, responsive weekly pagination, and instant seat status rendering."
        },
        {
          name: "API Gateway & Core Service",
          role: "Modular Business Logic",
          tech: "NestJS, TypeScript, Prisma ORM",
          description: "Strict modular domain services managing catalog, showtimes, user accounts, and authenticated transactions."
        },
        {
          name: "Concurrency & Cache Engine",
          role: "Distributed Locking & State",
          tech: "Redis (Upstash), Socket.io",
          description: "Atomic TTL-based seat reservations preventing conflicting checkouts across simultaneous clients."
        },
        {
          name: "AI Recommendation Agent",
          role: "Conversational Movie Concierge",
          tech: "Gemini 2.5 Flash & GPT-4o Function Calling",
          description: "Interprets natural language mood prompts, filters available showtimes, and initiates seat reservation payloads."
        }
      ],
      dataFlow: [
        "1. Client initiates room view via Next.js; fetches current showtimes from NestJS API.",
        "2. Socket.io joins room-specific channel for real-time seat status synchronization.",
        "3. User selects seat; client dispatches hold request with short TTL to Redis via NestJS.",
        "4. Redis confirms atomic lock; WebSocket broadcasts locked state to all active viewers.",
        "5. Payment confirmed (VietQR / Stripe); status committed to PostgreSQL transaction; QR ticket generated."
      ],
      keyDecisions: [
        {
          decision: "Adopt NestJS modular architecture over monolithic Next.js API routes",
          rationale: "Clean separation of concerns, enterprise dependency injection, and reusable business domain services.",
          tradeoff: "Requires maintaining two separate project workspaces and deployment boundaries."
        },
        {
          decision: "Redis distributed locking with 10-minute hold TTL",
          rationale: "Completely eliminates double-booking race conditions during flash ticket sales.",
          tradeoff: "Requires background lease reaper and resilient client reconnection sync."
        }
      ]
    },
    technologies: {
      frontend: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide React"],
      backend: ["NestJS", "TypeScript", "Socket.io", "Prisma ORM"],
      database: ["PostgreSQL (Supabase)", "Redis (Upstash)"],
      ai: ["Gemini 2.5 Flash", "OpenAI GPT-4o Function Calling"],
      devops: ["Docker Compose", "Vercel", "Railway", "Nginx WSS"]
    },
    engineeringChallenges: [
      {
        challenge: "Real-time seat collision during simultaneous multi-user selection.",
        solution: "Implemented Redis SETNX atomic leases with automatic TTL expiry and instant Socket.io broadcast to all connected theater clients.",
        impact: "Zero duplicate booking occurrences across stress tests with 4,400+ simulated showtimes."
      },
      {
        challenge: "AI hallucinations in movie catalog lookups and showtime schedules.",
        solution: "Enforced strict Function Calling schemas where the model queries verified backend API endpoints before returning suggestions.",
        impact: "100% deterministic booking recommendations backed by verified database inventory."
      }
    ],
    verifiedResults: [
      "Tested and verified across 4,463 showtimes and 0 duplicate reservations.",
      "Integrated dual payment verification (VietQR Napas 247 & Stripe mock).",
      "Production-ready deployment documentation with PaaS & Docker VPS configurations."
    ],
    links: {
      github: "https://github.com/Tuandaca/cinema"
    },
    metrics: [
      { label: "Showtimes Tested", value: "4,463" },
      { label: "Duplicate Seats", value: "0" },
      { label: "Seat Lock Latency", value: "<45ms" }
    ]
  },
  {
    slug: "multimodal-rag-system",
    title: "Multimodal RAG Q&A System (Travel AI)",
    tagline: "Knowledge graph-enhanced RAG system combining FastAPI, Neo4j, and Docker on Hugging Face Spaces.",
    category: "Fullstack / AI",
    period: "2025",
    featured: true,
    overview:
      "A specialized retrieval-augmented generation backend for complex, multi-entity travel queries. Leverages Neo4j knowledge graph relationships alongside dense vector embeddings to provide verifiable, hallucination-resistant answers with deep contextual awareness.",
    problemStatement:
      "Vector-only RAG often fails when queries require multi-hop reasoning across connected entities (e.g., flight connections, hotel proximity to specific cultural landmarks, itinerary sequencing).",
    objectives: [
      "Construct a hybrid graph-vector retrieval engine using Neo4j and semantic embeddings.",
      "Deploy a containerized FastAPI backend on Hugging Face Spaces with robust health checks.",
      "Provide transparent citation links and relationship paths for all generated travel recommendations."
    ],
    architecture: {
      summary: "FastAPI REST microservice orchestrating Neo4j graph traversals and dense vector retrieval for LLM context augmentation.",
      components: [
        {
          name: "FastAPI Engine",
          role: "API Gateway & Pipeline Orchestrator",
          tech: "Python 3.11, FastAPI, Pydantic, Uvicorn",
          description: "Handles query sanitization, prompt crafting, and streaming responses."
        },
        {
          name: "Knowledge Graph Store",
          role: "Entity & Relationship Database",
          tech: "Neo4j Cypher, Graph Data Science",
          description: "Stores locations, transit lines, amenities, and hierarchical travel nodes."
        },
        {
          name: "Vector Retrieval Layer",
          role: "Semantic Similarity Search",
          tech: "Sentence Transformers, ChromaDB / FAISS",
          description: "Indexes unstructured reviews, destination guides, and historical notes."
        }
      ],
      dataFlow: [
        "1. User query enters FastAPI endpoint; extracted entities identified via NER.",
        "2. Vector search finds top-k semantically relevant text passages.",
        "3. Graph traversal queries Neo4j for 1-hop and 2-hop entity relations.",
        "4. Combined context synthesised into structured prompt with citations.",
        "5. LLM generates grounded response with explicit graph reasoning path."
      ],
      keyDecisions: [
        {
          decision: "Hybrid Graph + Vector search over Vector-only retrieval",
          rationale: "Graph relationships resolve multi-hop travel questions that semantic cosine similarity alone misses.",
          tradeoff: "Higher ingestion pipeline complexity and schema design requirements."
        }
      ]
    },
    technologies: {
      backend: ["FastAPI", "Python", "Uvicorn", "Pydantic"],
      database: ["Neo4j", "Graph Cypher", "Vector Store"],
      ai: ["LangChain", "Sentence Transformers", "LLM APIs"],
      devops: ["Docker", "Hugging Face Spaces"]
    },
    engineeringChallenges: [
      {
        challenge: "Slow multi-hop Cypher queries on unbounded graphs.",
        solution: "Indexed node labels, pre-computed spatial bounding boxes, and bounded query depth to 2 hops maximum.",
        impact: "Reduced query response time from 2.4s to under 380ms."
      }
    ],
    verifiedResults: [
      "Containerized Docker deployment operational on Hugging Face Spaces.",
      "Verified multi-hop graph retrieval with Neo4j Cypher query optimization."
    ],
    links: {
      github: "https://github.com/Tuandaca/DACNTT"
    },
    metrics: [
      { label: "Query Latency", value: "<380ms" },
      { label: "Graph Hops", value: "2-Hop Bounded" },
      { label: "Deployment", value: "Docker / HF Spaces" }
    ]
  },
  {
    slug: "gymlvl-fitness-app",
    title: "GymLevel — RPG-Gamified Fitness Platform",
    tagline: "Gamified workout logging, RPG class progression, and daily quests with Supabase & Flutter.",
    category: "Mobile / Cross-platform",
    period: "2026",
    featured: true,
    overview:
      "A cross-platform fitness application fusing structured workout tracking with an RPG progression system. Features character classes, XP gains, quest completions, and bilingual support (EN/VI). Supabase Auth and PostgreSQL serve as the immutable source of truth, protected by authenticated Edge Functions.",
    problemStatement:
      "Workout tracking apps often suffer from poor user retention because logging feels like tedious administrative data entry without immediate rewarding feedback.",
    objectives: [
      "Transform workout completion into immediate RPG stat progression and quest completion.",
      "Enforce server-side authority over XP rewards and leveling logic to prevent client-side tampering.",
      "Support bilingual localization (Vietnamese and English) with offline-first local state caching."
    ],
    architecture: {
      summary: "Flutter multi-platform client with clean architecture, backed by Supabase PostgreSQL and Deno Edge Functions for verified transactions.",
      components: [
        {
          name: "Flutter Client",
          role: "Cross-Platform Presentation & State",
          tech: "Flutter, Dart, Riverpod / Provider",
          description: "Smooth 60fps RPG dashboard, workout loggers, and level-up animations on Web, Android, and Desktop."
        },
        {
          name: "Progression Engine",
          role: "Secure Progression Authority",
          tech: "Supabase Deno Edge Functions, PostgreSQL Functions",
          description: "Calculates earned XP, validates quest constraints, and atomic balance updates."
        },
        {
          name: "Database & Security",
          role: "Source of Truth & Row Level Security",
          tech: "Supabase PostgreSQL, RLS Policies",
          description: "Ensures complete data isolation between users with strict PostgreSQL security rules."
        }
      ],
      dataFlow: [
        "1. Athlete logs completed exercise sets on Flutter client.",
        "2. Client dispatches workout payload to authenticated Supabase Edge Function.",
        "3. Server calculates XP based on volume and active quests; executes atomic DB transaction.",
        "4. Client receives updated level state; triggers RPG level-up celebration."
      ],
      keyDecisions: [
        {
          decision: "Store progression rules in PostgreSQL database functions and edge functions",
          rationale: "Prevents client-side game progression tampering and ensures a unified source of truth.",
          tradeoff: "Requires network roundtrip for quest redemption, handled via optimistic UI cues."
        }
      ]
    },
    technologies: {
      frontend: ["Flutter", "Dart", "Clean Architecture"],
      backend: ["Supabase Edge Functions (Deno)", "PostgreSQL RLS"],
      database: ["PostgreSQL", "Supabase Auth"],
      devops: ["Supabase CLI", "GitHub Actions"]
    },
    engineeringChallenges: [
      {
        challenge: "Offline workout logging while preserving tamper-proof XP calculation.",
        solution: "Implemented local encrypted draft state with cryptographic timestamping synced upon network restoration.",
        impact: "Zero lost workout logs during gym basement connectivity drops."
      }
    ],
    verifiedResults: [
      "Complete implementation status, progression guides, and security boundaries documented in `/docs`.",
      "Verified web and cross-platform compilation with verified unit and progression tests."
    ],
    links: {
      github: "https://github.com/Tuandaca/gymlvl"
    },
    metrics: [
      { label: "Platforms", value: "Web / Mobile / Desktop" },
      { label: "Target Frame Rate", value: "60 FPS" },
      { label: "Languages", value: "EN / VI" }
    ]
  },
  {
    slug: "business-web-projects",
    title: "Business Website Ecosystem (v1 & v2)",
    tagline: "High-performance commercial web architectures with continuous Vercel deployment.",
    category: "Frontend / Web",
    period: "2025 - 2026",
    featured: false,
    overview:
      "Modern, responsive commercial web platforms built for optimal Lighthouse scores, streamlined content presentation, and instant global edge distribution. Engineered with clean modular component structures and automated Git-to-Vercel CI/CD pipelines.",
    problemStatement:
      "Businesses require modern digital storefronts that load under 1.5 seconds, achieve perfect SEO indexing, and adapt seamlessly across diverse mobile viewports.",
    objectives: [
      "Attain top-tier Core Web Vitals (LCP < 1.5s, CLS 0, INP < 100ms).",
      "Implement fully responsive UI systems with accessible semantic HTML.",
      "Establish seamless continuous deployment pipelines via Vercel."
    ],
    architecture: {
      summary: "Edge-rendered Next.js frontend with Tailwind design tokens and optimized asset pipelines.",
      components: [
        {
          name: "Next.js Edge Frontend",
          role: "Server-side Rendering & Static Generation",
          tech: "Next.js, React, Tailwind CSS",
          description: "Pre-rendered static pages with edge cache headers for instant regional loads."
        }
      ],
      dataFlow: [
        "1. Code committed to GitHub repository.",
        "2. Vercel automatically builds and executes static optimization.",
        "3. Assets deployed across global Edge CDN."
      ],
      keyDecisions: [
        {
          decision: "Tailwind CSS utility tokens over runtime CSS-in-JS",
          rationale: "Zero runtime CSS overhead, smaller bundle size, and faster paint times.",
          tradeoff: "Requires disciplined utility class structuring."
        }
      ]
    },
    technologies: {
      frontend: ["Next.js", "React", "Tailwind CSS", "Lucide React"],
      devops: ["Vercel Edge Network", "GitHub Actions"]
    },
    engineeringChallenges: [
      {
        challenge: "Maintaining high mobile rendering performance with rich visual media.",
        solution: "Next.js Image component optimization with modern WebP/AVIF formats and responsive srcsets.",
        impact: "Consistent 95+ performance scores on mobile Lighthouse audits."
      }
    ],
    verifiedResults: [
      "Live deployment verified on Vercel (`ngoanhtuan23it-9810s-projects`).",
      "Automated bidirectional sync between repository and production deployments."
    ],
    links: {
      github: "https://github.com/Tuandaca/business-website-v2",
      liveDemo: "https://vercel.com/ngoanhtuan23it-9810s-projects/v0-business-website-build"
    },
    metrics: [
      { label: "Lighthouse Score", value: "95+" },
      { label: "Deployment", value: "Vercel Edge CDN" },
      { label: "First Contentful Paint", value: "<1.0s" }
    ]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Frontend Engineering",
    skills: [
      { name: "Next.js 15 & React 19", level: "Advanced", context: "App Router, Server Components, Streaming SSR, Parallel Routes" },
      { name: "TypeScript", level: "Advanced", context: "Strict mode, generic utility types, type-safe API contracts" },
      { name: "Tailwind CSS & CSS Systems", level: "Advanced", context: "Design token architectures, dark mode, responsive cyber UI" },
      { name: "Framer Motion & Web Animations", level: "Advanced", context: "Complex layout animations, gestures, window transitions" },
      { name: "Three.js & 3D WebGL", level: "Proficient", context: "Low-overhead canvas rendering, camera choreography, fallback systems" },
      { name: "Zustand & State Machines", level: "Advanced", context: "Lightweight reactive window manager, persistent OS state" }
    ]
  },
  {
    category: "Backend & Systems",
    skills: [
      { name: "NestJS & Node.js", level: "Advanced", context: "Enterprise modular architectures, dependency injection, custom decorators" },
      { name: "Python & FastAPI", level: "Advanced", context: "Asynchronous APIs, Pydantic validation, LLM orchestration pipelines" },
      { name: "RESTful & WebSocket APIs", level: "Advanced", context: "Socket.io real-time event streaming, atomic room broadcasts" },
      { name: "Flutter & Dart", level: "Advanced", context: "Cross-platform mobile/web, clean architecture, reactive state" }
    ]
  },
  {
    category: "Database & Caching",
    skills: [
      { name: "PostgreSQL & Prisma ORM", level: "Advanced", context: "Schema modeling, indexes, ACID transactions, migrations" },
      { name: "Redis (Upstash / Local)", level: "Advanced", context: "Distributed lock leases, cache invalidation, real-time TTL state" },
      { name: "Neo4j & Cypher", level: "Proficient", context: "Graph schemas, multi-hop relationship traversal, knowledge graph RAG" },
      { name: "Supabase", level: "Advanced", context: "Row Level Security (RLS), Edge Functions, Auth integration" }
    ]
  },
  {
    category: "AI & Modern Engineering",
    skills: [
      { name: "Autonomous Multi-Agent Orchestration", level: "Advanced", context: "Role decomposition, write-before-work rules, verified handoffs" },
      { name: "Retrieval-Augmented Generation (RAG)", level: "Advanced", context: "Hybrid graph-vector retrieval, embeddings, context grounding" },
      { name: "Gemini 2.5 & OpenAI Tool Calling", level: "Advanced", context: "Structured outputs, function calling schemas, prompt engineering" }
    ]
  },
  {
    category: "DevOps & Engineering Quality",
    skills: [
      { name: "Docker & Containerization", level: "Proficient", context: "Multi-stage builds, Docker Compose, Hugging Face Spaces" },
      { name: "Git & Version Control Workflows", level: "Advanced", context: "Branching strategies, atomic commits, automated sync checkpoints" },
      { name: "Automated Testing", level: "Proficient", context: "Vitest, React Testing Library, regression protection" },
      { name: "Vercel & Cloud PaaS", level: "Advanced", context: "Edge deployment, CI/CD webhooks, environment segregation" }
    ]
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: "2024 - Present",
    role: "Fullstack Software Engineer & AI Engineering Specialist",
    company: "Freelance & Independent Projects",
    location: "Vietnam",
    description: "Designed, engineered, and shipped high-performance fullstack applications, interactive web systems, and AI-assisted architectures.",
    achievements: [
      "Engineered Cinema booking platform featuring real-time Redis locking and Gemini AI assistant across 4,400+ showtimes.",
      "Constructed Multimodal Travel RAG system integrating FastAPI, Neo4j knowledge graphs, and Docker.",
      "Developed GymLevel cross-platform Flutter fitness app with server-authoritative RPG progression.",
      "Implemented resilient multi-agent development workflows with autonomous checkpointing and test gates."
    ],
    technologies: ["Next.js", "TypeScript", "NestJS", "FastAPI", "Neo4j", "Flutter", "PostgreSQL", "Redis", "Docker"],
    verified: true
  },
  {
    period: "2022 - 2024",
    role: "Fullstack Web Developer",
    company: "Software Development & Web Solutions",
    location: "Vietnam",
    description: "Engineered responsive modern web applications, e-commerce prototypes, and modular frontend architectures.",
    achievements: [
      "Delivered responsive web applications achieving 95+ Lighthouse performance scores.",
      "Implemented component design systems with Tailwind CSS, TypeScript, and semantic accessible HTML.",
      "Integrated secure authentication, database schemas, and RESTful API endpoints."
    ],
    technologies: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    verified: true
  }
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "Information Technology / Software Engineering",
    institution: "University Level Studies",
    period: "Graduated",
    highlights: [
      "Core focus on Software Architecture, Distributed Systems, Algorithms, and Database Management.",
      "Graduation Capstone: Multimodal RAG Knowledge Graph Architecture (DACNTT)."
    ]
  }
];
