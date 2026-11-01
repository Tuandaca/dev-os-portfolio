# DEV.OS software architecture

Status: Phase 2 design specification with Phase 3 OS and Phase 4 cinematic implementation notes, 2026-11-01. Recruiter pages and typed CV content remain the source of truth.

## Architectural rule

The portfolio is a set of directly addressable, server-rendered pages. The desktop and 3D laptop add interaction around the same verified content. A visitor can reach professional information without waiting for WebGL, animation, or a simulated boot.

```mermaid
flowchart LR
  Evidence[Verified CV and repository evidence] --> Content[src/content typed modules]
  Content --> Routes[App Router recruiter pages]
  Content --> Apps[Portfolio app views]
  Apps --> OS[Client OS shell]
  OS --> Workspace[/workspace]
  Scene[Optional 3D laptop island] --> Landing[/]
  Landing --> Workspace
  Landing --> Routes
```

## Current foundation and planned modules

| Area | Current repository | Intended boundary |
| --- | --- | --- |
| Routes | `src/app/` has `/`, `/workspace`, `/projects`, `/projects/[slug]`, `/about`, `/experience`, `/skills`, `/contact`, `/resume` | Keep page modules as Server Components unless an interaction needs a Client Component. Add route metadata and stable deep links. |
| Verified content | `src/content/profile.ts`, `experience.ts`, `skills.ts`, `projects.ts` | Server-readable source for pages, app views, and metadata. `docs/CONTENT_SOURCE.md` records provenance. |
| Shared UI | `src/components/portfolio/` and Phase 2 primitives in `src/components/ui/` | Accessible links, buttons, surfaces, status labels, and key hints; no OS state in base primitives. |
| OS shell | `/workspace` uses `src/components/os/` for desktop, windows, launcher, taskbar, command palette, and finite terminal | Keep the OS state within the workspace; direct recruiter routes remain independent. |
| Cinematic scene | `src/components/scene/laptop-scene.tsx` owns the procedural R3F laptop and camera; `src/components/landing/` owns the CSS fallback, boot state, navigation, and error boundary | Scene emits only ready/phase/error callbacks and contains no portfolio facts. |
| Case studies | Typed project summaries | Future `src/content/case-studies/` may hold reviewed MDX bodies. Keep project metadata in `projects.ts`. |
| Diagrams | No interactive diagrams | Future `src/components/diagrams/` may use React Flow only when a diagram adds project evidence; provide equivalent text/static SVG. |
| Tests | Vitest and Testing Library configured | Add behavior-focused Vitest and Playwright tests when those behaviors ship. |

Suggested target tree; create directories only as features are implemented:

```text
src/
  app/                  # SEO routes, metadata, server composition
  components/
    ui/                 # reusable design primitives
    portfolio/          # recruiter content presentation
    os/                 # desktop and window interactions
    scene/              # lazy 3D laptop island and fallback
    diagrams/           # evidence diagrams
  content/
    profile.ts          # CV-backed facts
    experience.ts
    skills.ts
    projects.ts         # project metadata and evidence labels
    case-studies/       # later reviewed MDX narratives
  lib/                  # pure utilities, command registry, route mapping
  stores/               # future client-only OS state
  test/                 # shared test setup
tests/e2e/              # future Playwright journeys
```

`src/data/portfolioData.ts` remains legacy, unverified data and is not a source for new pages. Read `docs/CONTENT_SOURCE.md` before showing any owner-specific claim.

## Route contract

| Route | Purpose | Delivery |
| --- | --- | --- |
| `/` | Identity, concise summary, featured work, choices to enter DEV.OS or browse directly | Server-rendered content first; optional deferred scene after the page is useful. |
| `/workspace` | Interactive desktop and portfolio app launcher | Reachable directly; HTML fallback and standard links if client features fail. |
| `/projects` | Index of verified featured work | Server-rendered cards linking to case-study routes. |
| `/projects/[slug]` | Evidence-led case study | Generate known slugs from typed content; explicit metadata; unknown slug resolves to 404. |
| `/about` | Professional summary, education, working approach | Server-rendered HTML. |
| `/contact` | CV-approved contact paths | Server-rendered HTML. |
| `/resume` | Resume context and owner-approved original PDF link | Server-rendered HTML; keep PDF URL stable while publication approval stands. |
| `/experience`, `/skills` | Existing recruiter routes | Preserve direct paths. |

The workspace can open an app through a URL such as `/workspace?app=projects&project=cinema`. Treat the URL as the shareable selection and validate it against a finite app registry. Window geometry, focus order, and launcher visibility are ephemeral client state. Direct `/projects/cinema` remains the canonical case-study URL for search and sharing. Never require the workspace for recruiter navigation.

## State and data ownership

- Server components import `src/content/` directly. They do not read the OS store.
- A future client-only Zustand store controls open app IDs, focused window, minimized state, window positions, taskbar/launcher visibility, and command palette state. The app registry defines IDs, titles, icons, routes, and loaders; commands map only to those IDs or real URLs.
- Use a store scoped to the workspace boundary. Never mutate a module-global store during React Server Component rendering, per the [Zustand Next.js guide](https://zustand.docs.pmnd.rs/learn/guides/nextjs). Do not persist window state or command history until a user need is demonstrated. A later optional “skip intro” preference must be read on the client.
- Boot sequence state is local presentation state. It never gates data loading or navigation and can be skipped immediately.
- Terminal commands form a finite local navigation/help interface. No shell execution, arbitrary code evaluation, server process access, or credentials.
- React Flow, if added, consumes reviewed diagram data for a specific case study. It does not become the source of project claims.

## Dependency decisions and compatibility

Installed versions came from `npm ls --depth=0` on 2026-11-01. Planned compatibility is based on official documentation and npm peer metadata checked the same day; it is **not** an integration test. Install only in the milestone that uses each package, then run the build.

| Capability | Installed now | Later decision |
| --- | --- | --- |
| App framework | Next 15.5.28, React/React DOM 19.3.1, TypeScript strict, Tailwind 3.4.19 | Keep App Router and current Tailwind major. Match `@next/mdx` to the installed Next version if added. |
| Workspace state | Zustand 5.0.16 | Client workspace store; no RSC store access. |
| Motion | `framer-motion` 12.43.0 | Future motion uses `motion` and `motion/react` in Client Components, following [Motion installation](https://motion.dev/docs/react-installation). Migrate deliberately; avoid two animation APIs without need. |
| WebGL | Three 0.173.0, Fiber 9.8.2, Drei 10.7.9 | [R3F installation](https://r3f.docs.pmnd.rs/getting-started/installation) pairs Fiber 9 with React 19; installed peer ranges fit React 19.3.1 and Three 0.173.0. The Phase 4 production build and browser Canvas path passed. R3F 10 migration is outside this milestone. |
| Architecture diagrams | None | `@xyflow/react` only for evidence-backed interactive diagrams. The package's 12.x peer range includes React 19; verify in build. See [React Flow documentation](https://reactflow.dev/learn). |
| Case-study prose | Typed TypeScript summaries; no MDX runtime | `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, and `mdx-components.tsx` only when reviewed narratives exist. Follow the [Next MDX guide](https://nextjs.org/docs/app/guides/mdx). Keep metadata/provenance in TypeScript. |
| Tests | Vitest 3.2.7, jsdom, Testing Library | Add `@playwright/test` for route, keyboard, reduced-motion, and fallback journeys. Follow [Playwright installation](https://playwright.dev/docs/intro). |
| GSAP | Not installed | Add only if a measured scene timeline cannot be expressed clearly with Motion plus R3F; document the specific need first. |

## Loading and performance policy

The hero and navigation render as HTML before the 3D bundle loads. After hydration, desktop clients with motion allowed and a WebGL context load the scene dynamically; a CSS laptop remains available as a static fallback. Missing WebGL, module/Canvas errors, slow scene loading, reduced motion, and narrow viewports preserve the `/workspace` link and recruiter routes. The browser never needs the scene to render resume, contact, or project HTML.

The scene has no external model or texture files, uses 40 instanced keyboard keys, caps device pixel ratio at 1.5, renders on demand, and pauses animation when the document is hidden. It does not load on recruiter routes or narrow/reduced-motion landing paths. Local production Chromium measurements are in `docs/PROGRESS.md`; midrange device FPS and Core Web Vitals remain unmeasured. Defer React Flow and MDX bundles to pages that use them.

Use Motion for short UI transitions. Never animate layout in a way that hides focus or delays controls. Prefer CSS for simple hover/focus states.

## Accessibility and failure behavior

- One `h1` per page, logical headings, landmarks, visible focus, semantic buttons/links, contrast checked against design tokens.
- All app actions work by keyboard. Launcher and command palette support Escape and return focus to the trigger. Windows have a clear title, close/minimize controls, predictable tab order, and no keyboard trap.
- Boot has a skip control from its first frame. Reduced-motion users bypass timed animation. Screen readers receive a concise status once; decorative frames are silent.
- Static routes and content fallback cover disabled JavaScript, unsupported WebGL, scene errors, and slow connections. A terminal failure cannot remove ordinary navigation.
- Never place credentials in content or client bundles.

## Milestones and verification

| Milestone | Scope | Evidence before DONE |
| --- | --- | --- |
| Phase 2 design | Architecture, UX flow, content schema, tokens and primitives | Lint, strict typecheck, production build; inspect routes and dependency decisions. No OS or scene implementation. |
| Phase 3 OS shell | App registry, window/taskbar/launcher, keyboard behavior, local terminal commands | Targeted store/component tests; Playwright keyboard/deep-link journey; build and accessibility review. |
| Phase 4 cinematic scene | Optional laptop, boot transition, static fallback | WebGL failure and reduced-motion journeys, mobile performance measurement, bundle review, build. |
| Phase 5 case studies and release | Reviewed narratives/diagrams, metadata, final UX and security checks | Claim-to-source review, route/404/PDF/link checks, accessibility and browser checks, authorized deployment only. |

Suggested implementation dependencies: finish Phase 2 tokens, primitive semantics, and route specification before the OS shell; build the OS app registry and deep-link parser before windows, launcher, palette, or terminal; complete keyboard and fallback behavior before adding cinematic entry; review each case-study claim before MDX or React Flow rendering. The scene can be developed independently after the static landing contract is stable, then integrated only after performance and reduced-motion checks. No later milestone is a prerequisite for the existing recruiter routes.

Keep dependencies and completion evidence in `docs/TASKS.md`; record measured results in `docs/PROGRESS.md`. Do not convert design targets into completed claims.
