# Project: DEV.OS Phase 6 — Dark Neon Liquid Editorial Homepage Redesign

## Architecture
DEV.OS is a Next.js 15 App Router portfolio application with React 19, TypeScript strict mode, Tailwind CSS, Three.js 0.173, and React Three Fiber 9.8.
The Phase 6 homepage redesign transforms the landing experience at `/` into a 5-chapter cinematic editorial journey conforming to the **Dark Neon Liquid × Premium Cyber Minimalism** art direction.

### Data Flow & Component Architecture
1. **Design Tokens Layer**: `src/styles/tokens.css` and `tailwind.config.ts` define the Dark Neon Liquid palette:
   - Canvas / Background: `#070A09`
   - Raised Surface: `#121A16`
   - Border / Structural: `#1A2820` / `#22382B`
   - Accents: `#6EE7A0` (primary green) & `#39FF88` (high-intensity neon green)
   - Display Typography: Space Grotesk; Monospace Typography: JetBrains Mono
   - Strictly NO cyan primary accents.
2. **Background WebGL Layer (`z-index: 0`)**:
   - Liquid shader quad or ambient fluid noise (`LiquidShaderCanvas` / `LiquidBackdrop`) rendered behind DOM content.
   - Fractional Brownian motion (`fbm`) domain warping with deep green/black luminescence.
   - Strictly decoupled from DOM text, ensuring zero distortion of essential text, navigation, or recruiter actions.
3. **Procedural 3D Stage (`Chapter 01`)**:
   - `LaptopScene` in `src/components/scene/laptop-scene.tsx` adapted with Dark Neon Liquid materials and lighting.
   - Rotatable lid with scroll-linked reveal and mouse-tilt pointer parallax.
   - Strict lifecycle: `frameloop="demand"` and `frameloop="never"` when off-screen via `IntersectionObserver`.
4. **Cinematic 5-Chapter Editorial DOM Structure (`z-index: 10+`)**:
   - `Chapter 01: The Engineer` (Hero display, "NGO ANH TUAN", status pill, Skip Intro button, CTAs to `/universe` and `/workspace`).
   - `Chapter 02: Engineering DNA` (6 verified skill categories from `src/content/skill-universe.ts`, interactive cards, category chips).
   - `Chapter 03: The Journey` (Vertical progress rail, verified career milestones from `src/content/experience.ts`).
   - `Chapter 04: Inside the System` (Interactive architecture diagrams, subsystem cards, deep links to `/universe` and case studies).
   - `Chapter 05: Let's Build Something` (Closing CTA, verified contact details from `src/content/profile.ts`, resume download).
5. **Route Preservation**:
   - All 8 functional routes (`/universe`, `/workspace`, `/projects`, `/about`, `/experience`, `/skills`, `/resume`, `/contact`) remain 100% functional Server Components wrapped in `SiteShell`.
   - Content strictly reads from verified sources in `src/content/` (`profile.ts`, `experience.ts`, `skills.ts`, `projects.ts`, `skill-universe.ts`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Dark Neon Liquid Design Tokens | Implement `#070A09`, `#121A16`, `#6EE7A0`, `#39FF88`, purge cyan, configure fonts | M1 | ORIGINAL_REQUEST §R2 |
| 2 | Subtle Liquid Shader Ambient Backdrop | WebGL background quad with slow viscous noise, zero distortion of DOM text | M2 | ORIGINAL_REQUEST §R2 |
| 3 | Chapter 01 (The Engineer Hero) | Procedural 3D laptop adaptation, display typography, Skip Intro, CTAs | M2 | ORIGINAL_REQUEST §R3 |
| 4 | Chapter 02 (Engineering DNA) | 6 verified skill categories with interactive feedback & detail view | M3 | ORIGINAL_REQUEST §R3 |
| 5 | Chapter 03 (The Journey) | Career/education timeline with verified CV dates & vertical progress rail | M3 | ORIGINAL_REQUEST §R3 |
| 6 | Chapter 04 (Inside the System) | Conceptual systems architecture visual, navigation to `/universe` & `/workspace` | M4 | ORIGINAL_REQUEST §R3 |
| 7 | Chapter 05 (Closing CTA) | High-impact closing, verified contact CTAs, GitHub profile, resume download | M4 | ORIGINAL_REQUEST §R3 |
| 8 | Scroll Storytelling & WebGL Lifecycle | Sticky section stacking, scroll reveals, off-screen pause, pointer parallax | M5 | ORIGINAL_REQUEST §R4 |
| 9 | Accessibility & Reduced-Motion | Semantic HTML, single h1, prefers-reduced-motion fallback, mobile <=320px | M5 | ORIGINAL_REQUEST §R5 |
| 10 | Quality Gates, E2E & Git Push | Typecheck, Vitest, Playwright e2e, build, documentation update, commit & push | M6 | ORIGINAL_REQUEST §R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design Tokens & Art Direction | Update `tokens.css`, `tailwind.config.ts`, verify palette and font setup | none | DONE |
| M2 | Chapter 01 Hero & Liquid 3D Stage | Adapt `LaptopScene`, implement `LiquidBackdrop`, hero layout & CTAs | M1 | DONE |
| M3 | Chapters 02 & 03 (DNA & Journey) | Implement Engineering DNA cards & Journey timeline with vertical progress | M1 | DONE |
| M4 | Chapters 04 & 05 (Systems & Closing) | Implement Inside the System architecture visual & Closing contact section | M1 | DONE |
| M5 | Homepage Assembly, Scroll Motion & Lifecycle | Assemble 5 chapters in `page.tsx`, sticky stacking, WebGL offscreen pause | M2, M3, M4 | DONE |
| M6 | QA Review, Forensic Audit & Git Checkpoint | E2E test verification, accessibility audit, documentation & safe git push | M5 | PLANNED |

## Interface Contracts
### `src/components/scene/laptop-scene.tsx`
- Props:
  ```typescript
  export interface LaptopSceneProps {
    phase?: "idle" | "opening" | "boot" | "entering";
    isOpen?: boolean;
    scrollProgress?: number;
    onReady?: () => void;
    onOpenComplete?: () => void;
    onEnterComplete?: () => void;
    onError?: (error?: unknown) => void;
  }
  ```

### `src/components/home/liquid-backdrop.tsx`
- Component: `LiquidBackdrop({ paused?: boolean }: { paused?: boolean })`
- Renders lightweight WebGL quad with custom `ShaderMaterial` at `z-index: 0`.
- Unmounts or disables animation when `prefers-reduced-motion: reduce` or when scrolled off-screen.

### `src/components/home/chapters/`
- `ChapterHero`: Chapter 01 (The Engineer)
- `ChapterDna`: Chapter 02 (Engineering DNA)
- `ChapterJourney`: Chapter 03 (The Journey)
- `ChapterSystem`: Chapter 04 (Inside the System)
- `ChapterClosing`: Chapter 05 (Let's Build Something)

## Code Layout
- `src/styles/tokens.css`: Design tokens and CSS custom properties
- `tailwind.config.ts`: Tailwind theme extensions
- `src/components/home/`: Phase 6 homepage components
  - `liquid-backdrop.tsx`: Ambient fluid shader background
  - `chapter-hero.tsx`: Chapter 01 component
  - `chapter-dna.tsx`: Chapter 02 component
  - `chapter-journey.tsx`: Chapter 03 component
  - `chapter-system.tsx`: Chapter 04 component
  - `chapter-closing.tsx`: Chapter 05 component
  - `scroll-progress-rail.tsx`: Vertical progress indicator
- `src/components/scene/laptop-scene.tsx`: Procedural 3D laptop
- `src/app/page.tsx`: 5-chapter homepage container
- `docs/PHASE6_DESIGN_REFERENCE.md`: Art direction and design tokens specification
- `docs/PHASE6_IMPLEMENTATION_PLAN.md`: Implementation breakdown and task checklist
