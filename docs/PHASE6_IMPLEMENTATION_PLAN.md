# Phase 6 Implementation Plan — 5-Chapter Cinematic Editorial Homepage

## 1. Executive Summary & Architecture Strategy

Phase 6 evolves the DEV.OS portfolio from a standalone 3D laptop landing screen into a continuous, scroll-driven, 5-chapter cinematic editorial portfolio homepage at `/`. This architecture seamlessly combines **Dark Neon Liquid** WebGL aesthetics with **Premium Cyber Minimalism** editorial typography and rigorous software engineering standards.

### 1.1 Non-Negotiable System Contracts
1. **Route Preservation**: All 8 pre-existing functional recruiter and workstation routes remain fully intact, accessible, and performant:
   - `/universe` — Spatial interactive workstation universe
   - `/workspace` — Multi-window desktop workstation OS
   - `/projects` — Verified project catalogue and case studies
   - `/about` — Professional summary and biography
   - `/experience` — Career timeline and milestones
   - `/skills` — Technical skill matrix
   - `/resume` — Downloadable CV and credentials
   - `/contact` — Communication channels and contact form
2. **CV-Backed Integrity**: Zero fabricated roles, dates, metrics, or technologies. All displayed data must originate from verified sources in `src/content/` (`profile.ts`, `experience.ts`, `skills.ts`, `projects.ts`, `skill-universe.ts`).
3. **Zero-Distortion Shaders**: Background WebGL shaders are strictly isolated at `z-index: 0`. Semantic DOM reading surfaces, typography, navigation, and recruiter actions at `z-index: 10+` are never distorted, warped, or obscured.
4. **Resilient Degradation**: WebGL context loss, disabled JavaScript, or `prefers-reduced-motion` must cleanly fall back to high-contrast, fully functional semantic HTML.

---

## 2. Five-Chapter Editorial Roadmap

The homepage at `src/app/page.tsx` is structured into five sequential editorial chapters. Each chapter is implemented as an isolated, independently testable component in `src/components/home/chapters/`.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HOMEPAGE (src/app/page.tsx)                     │
│                                                                        │
│  [z-index: 0]   LiquidBackdrop (WebGL fbm shader quad / CSS fallback)  │
│  [z-index: 20]  ScrollProgressRail (Fixed vertical chapter tracker)    │
│                                                                        │
│  Chapter 01: The Engineer (Hero) ──────────── Procedural 3D Laptop     │
│  Chapter 02: Engineering DNA ──────────────── 6 Verified Categories    │
│  Chapter 03: The Journey ──────────────────── Career & Edu Milestones  │
│  Chapter 04: Inside the System ────────────── Full-stack Architecture  │
│  Chapter 05: Let's Build Something ────────── Direct Recruiter CTAs    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Chapter 01: The Engineer (Hero Stage)
- **Component**: `src/components/home/chapters/chapter-hero.tsx`
- **Visual Assets**: Adapted procedural 3D laptop (`src/components/scene/laptop-scene.tsx`) in Dark Neon Liquid materials with subtle green display backlighting.
- **Content Elements**:
  - Eyebrow tag: `DEV.OS / PORTFOLIO V6.0` (monospace uppercase)
  - Display Headline: `NGO ANH TUAN` (Space Grotesk, 700 bold, `text-5xl` to `text-7xl`)
  - Subtitle: `Senior Full-Stack & AI Systems Engineer`
  - Status Pill: `● OPEN FOR OPPORTUNITIES / TECHNICAL LEAD` (`dev-neon` pulsating indicator)
  - Primary CTA: `Explore Universe →` (links to `/universe`)
  - Secondary CTA: `Launch Workspace` (links to `/workspace`)
  - Skip Intro Link: Immediate focusable bypass to `/universe` or scroll anchor
- **Interaction & Scroll**:
  - Initial view displays closed or opening laptop.
  - Scroll progress links directly to lid rotation and camera elevation.
  - Pointer parallax responds to cursor tilt within bounded ranges ($\pm 0.15$ rad).

### 2.2 Chapter 02: Engineering DNA (Skill Universe)
- **Component**: `src/components/home/chapters/chapter-dna.tsx`
- **Data Source**: `src/content/skill-universe.ts` (`skillUniverseCategories`)
- **Structure**:
  - Section Header: `CHAPTER 02 / ENGINEERING DNA` with narrative summary of architectural breadth.
  - Six Verified Skill Category Cards:
    1. *Frontend Engineering & Interactive Systems* (Next.js, React 19, TypeScript, Three.js, Tailwind CSS)
    2. *Backend Architecture & Scalable APIs* (Node.js, Express, Go, Python, REST, GraphQL)
    3. *AI, RAG & Intelligent Systems* (LangChain, LlamaIndex, Vector DBs, Embedding pipelines)
    4. *Cloud Infrastructure & DevOps* (Docker, Kubernetes, AWS, Vercel, CI/CD pipelines)
    5. *Databases & High-Throughput Storage* (PostgreSQL, MongoDB, Redis, Prisma)
    6. *Engineering Practice & System Design* (Distributed Systems, Clean Architecture, TDD)
- **Interactive Affordances**:
  - Interactive selection chips showing proficiency tier and highlighted projects.
  - Keyboard accessible tablist with arrow key navigation.
  - Direct deep links to `/skills` for full granular breakdowns.

### 2.3 Chapter 03: The Journey (Career & Education Timeline)
- **Component**: `src/components/home/chapters/chapter-journey.tsx`
- **Data Source**: `src/content/experience.ts` (`experiences`, `education`)
- **Structure**:
  - Section Header: `CHAPTER 03 / THE JOURNEY`
  - Vertical progress rail with illuminated node points matching scroll position.
  - Chronological milestones presenting verified CV roles:
    - Company name, role title, verified employment period (e.g. `2022 — Present`).
    - Core engineering impact bullets (architecture modernization, microservices, AI RAG systems).
    - Technology badges rendered in `JetBrains Mono`.
  - Education summary highlighting university credentials and formal computer science foundations.
- **Scroll Synchronization**:
  - As each milestone scrolls into the viewport focal zone, its rail node transitions from `dev-border` to `dev-neon` glow.

### 2.4 Chapter 04: Inside the System (Interactive Architecture)
- **Component**: `src/components/home/chapters/chapter-system.tsx`
- **Data Source**: `src/content/projects.ts` (`featuredProjects`)
- **Structure**:
  - Section Header: `CHAPTER 04 / INSIDE THE SYSTEM`
  - Conceptual system diagram illustrating modern full-stack & AI architecture:
    - Client / Edge Presentation Layer (Next.js App Router, Three.js Stage, Web Workers)
    - Application & Orchestration Layer (Node.js, Go Services, RAG Retrieval Coordinator)
    - Persistence & Vector Storage Layer (PostgreSQL, pgvector, Redis Cache)
  - Subsystem cards linking directly to verified project case studies:
    - *Cinema Platform*: Real-time seat reservation engine & distributed transaction management (`/projects/cinema`).
    - *Travel AI System*: Multimodal RAG Q&A retrieval pipeline (`/projects/travel-ai`).
    - *Business Workspaces*: Enterprise web systems (`/projects/business-websites`).
- **Recruiter Affordances**:
  - Quick action buttons to launch live demos or review GitHub repositories (where available and permitted).

### 2.5 Chapter 05: Let's Build Something (Closing Action Hub)
- **Component**: `src/components/home/chapters/chapter-closing.tsx`
- **Data Source**: `src/content/profile.ts` (`profile.contact`, `profile.socials`)
- **Structure**:
  - Section Header: `CHAPTER 05 / LET'S BUILD SOMETHING`
  - High-impact closing callout: `Available for Senior Engineering & Technical Leadership Roles.`
  - Direct Action Grid:
    - Primary Button: `Send Email` (`mailto:` link to verified address)
    - Resume Action: `Download CV / Resume` (direct link to `/resume`)
    - Social Profiles: LinkedIn, GitHub, Telegram profiles with external link security (`rel="noopener noreferrer"`).
  - Recruiter Fast Path: Summary card providing instant answers to common recruiter questions (Location, Notice Period, Work Authorization, Tech Stack).
  - Terminal-styled closing footer with copyright and system status indicator.

---

## 3. WebGL Lifecycle Management & Performance Budgets

To ensure silky 60fps interaction and zero memory leaks across sustained user sessions, WebGL scenes adhere to strict lifecycle protocols:

### 3.1 Lifecycle & Resource Disposal Rules
1. **Demand-Driven Rendering**:
   - Canvas elements utilize `frameloop="demand"` where continuous rendering is unnecessary.
   - For interactive animations, frameloops transition to `demand` or `never` whenever sections leave the viewport via `IntersectionObserver`.
2. **Explicit Three.js Disposal**:
   - Geometries, materials, textures, and render targets implement explicit `.dispose()` calls on component unmount:
     ```typescript
     useEffect(() => {
       return () => {
         geometry.dispose();
         material.dispose();
         if (texture) texture.dispose();
       };
     }, [geometry, material, texture]);
     ```
3. **Animation Frame Cancellation**:
   - All `requestAnimationFrame` IDs are captured and cancelled during cleanup:
     ```typescript
     cancelAnimationFrame(frameId.current);
     ```
4. **Listener Cleanup**:
   - Resize, pointermove, scroll, and orientation listeners are bound with passive flags and strictly unbound upon unmount.

### 3.2 Performance Targets

| Metric | Target Budget | Measurement Method |
| :--- | :--- | :--- |
| **First Contentful Paint (FCP)** | `< 1.2s` | Lighthouse / Chrome DevTools |
| **Largest Contentful Paint (LCP)** | `< 2.2s` | DOM typography renders independently of WebGL |
| **Cumulative Layout Shift (CLS)** | `< 0.05` | Aspect-ratio bounding containers for all 3D stages |
| **Steady-State Frame Rate** | `60 fps` | Three.js stats / DevTools Performance panel |
| **WebGL Memory Footprint** | `< 65 MB` | Chrome Task Manager / WebGL context memory |
| **JavaScript Main Thread Long Tasks** | `0 tasks > 50ms` | Performance profiler |

---

## 4. Accessibility, Responsiveness & Reduced Motion

### 4.1 Accessibility Standards (WCAG 2.1 AA / AAA Compliance)
- **Semantic Landmark Hierarchy**:
  - Exactly one `<h1>` per page ("Ngo Anh Tuan — Senior Full-Stack & AI Systems Engineer").
  - Semantic `<section>` containers for each chapter with explicit `aria-labelledby` IDs.
  - Logical header, navigation (`<nav>`), main (`<main>`), and footer (`<footer>`) landmarks.
- **Keyboard Navigation**:
  - Full tab-sequence traversal through all interactive elements (buttons, links, tab chips).
  - Highly visible focus rings using `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent`.
  - Skip Navigation link at top of document bypassing the 3D hero directly to main content.
- **Screen Reader Announcements**:
  - WebGL canvases receive `aria-hidden="true"`.
  - Accessible hidden text (`sr-only`) provides full context for visual-only indicators.

### 4.2 Mobile Responsiveness (Tested down to 320px)
- **Viewport Resilience**:
  - Responsive layout dynamically switches from side-by-side desktop viewports to stacked single-column cards on mobile viewports (`< 768px`).
  - No horizontal scrollbars or clipped text down to 320px screen width.
  - Touch targets maintain minimum dimensions of `44px × 44px`.
  - Fluid padding using `px-4 sm:px-6 lg:px-8` prevents content collision with viewport edges.

### 4.3 Reduced Motion Fallbacks (`prefers-reduced-motion: reduce`)
- Fluid shader animation stops completely.
- 3D laptop renders in fixed open orientation without rotation animations.
- Scroll-linked transformations and parallax calculations are disabled.
- CSS transitions and animations drop to `0ms`.
- All chapter content remains immediately visible and navigable via normal document scroll.

---

## 5. Milestone Breakdown & Delivery Sequence

```
  ┌────────────────────────────────────────────────────────┐
  │ M1: Design Tokens, Art Direction & Docs (CURRENT)      │
  │ - tokens.css & tailwind.config.ts updated              │
  │ - PHASE6_DESIGN_REFERENCE.md & IMPLEMENTATION_PLAN.md  │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ M2: Chapter 01 (Hero Stage) & Liquid Backdrop          │
  │ - LaptopScene adaptation (Dark Neon Liquid materials)  │
  │ - LiquidBackdrop (z:0 WebGL shader + fallback)         │
  │ - Hero typography, CTAs, Skip Intro                    │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ M3: Chapters 02 & 03 (Engineering DNA & The Journey)   │
  │ - 6 verified skill categories with interactive cards   │
  │ - Career & education timeline with scroll progress rail│
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ M4: Chapters 04 & 05 (System Architecture & Closing)   │
  │ - Inside the System interactive architecture diagram   │
  │ - High-impact closing CTA & direct recruiter hub       │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ M5: Homepage Assembly & Scroll Motion Integration      │
  │ - src/app/page.tsx complete 5-chapter composition      │
  │ - ScrollProgressRail sticky tracking                   │
  │ - WebGL IntersectionObserver pause & disposal          │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ M6: Full QA Verification, E2E Testing & Safe Git Push  │
  │ - Playwright e2e test suite execution                  │
  │ - Unit tests, lint, typecheck verification             │
  │ - Documentation update & safe git push                 │
  └────────────────────────────────────────────────────────┘
```

---

## 6. Verification & Quality Gates Protocol

Every milestone change must execute and pass the four core repository verification gates from `D:\Projects\tuandacadev3D`:

1. **Linting**:
   ```powershell
   npm run lint
   ```
   *Requirement*: 0 ESLint errors and warnings.
2. **Type Checking**:
   ```powershell
   npm run typecheck
   ```
   *Requirement*: 0 TypeScript compiler diagnostic errors (`tsc --noEmit`).
3. **Unit & Integration Tests**:
   ```powershell
   npm test
   ```
   *Requirement*: 100% test pass rate across all Vitest suites (`src/test/`, `src/lib/`, `src/stores/`).
4. **End-to-End Suite**:
   ```powershell
   npm run test:e2e
   ```
   *Requirement*: Playwright browser tests pass across desktop and mobile viewports.
5. **Production Build**:
   ```powershell
   npm run build
   ```
   *Requirement*: Flawless static page generation and bundle compilation.
