# DEV.OS software architecture

Status: Phase 2 design specification with Phase 3 OS, Phase 4 cinematic, and Phase 5B immersive workspace implementation notes, 2026-11-01. Recruiter pages and typed CV content remain the source of truth.

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

## Phase 5B immersive workspace contract (2026-11-01)

Phase 5B adds `/universe` as the optional 3D-first route. The existing `/workspace` is the 2D **Quick View**; `/projects`, `/about`, `/skills`, `/resume`, and `/contact` remain ordinary server-rendered pages. The landing laptop's Enter and Skip paths may lead to `/universe`, but the HTML recruiter links and Quick View link must work before scene loading and when JavaScript or WebGL is unavailable. Keep the Phase 4 laptop scene intact; the new environment lives under `src/components/scene/immersive/` and loads only on `/universe`.

```mermaid
flowchart LR
  Home["HTML landing + laptop"] --> Universe["/universe: HTML shell"]
  Home --> Quick["/workspace: 2D Quick View"]
  Home --> Recruiter[Direct recruiter routes]
  Universe --> Nav[HTML view controls and detail panels]
  Nav --> Scene[Lazy R3F spatial workstation]
  Scene -->|selection callback| Nav
  Universe --> Quick
  Universe --> Recruiter
  Skills[src/content/skills.ts] --> Mapping[Typed skill-cluster mapping]
  Mapping --> Nav
  Mapping --> Scene
```

### Scene graph and ownership

| Boundary | Owner | Contract |
| --- | --- | --- |
| `/universe` page and shell | UI engineer | Server-readable heading, route metadata, direct links, lazy scene decision, fallback and live HTML panel. Own camera-view state and keyboard focus; no OS-store reuse. |
| Spatial workstation | 3D engineer | Procedural desk, monitor, signal paths, skill nodes and contact horizon in one Canvas. Own geometry, materials, lighting, fixed camera targets, and frame invalidation. No portfolio facts or direct navigation. |
| Skill mapping | Portfolio engineer | Six stable IDs: `frontend`, `backend`, `data`, `ai`, `architecture`, `workflow`. Map only CV-backed `skillGroups` items; no inferred proficiency, seniority, results, or live telemetry. |
| QA | QA reviewer | Exercise view changes, object selection, fallback, keyboard and touch equivalents, direct routes, and existing cinematic/OS regressions. |

The scene's public props are `view`, `activeSkillId`, `onSelectView`, `onSelectSkill`, `onReady`, and `onError`. `view` is one of `overview | skills | systems | contact`; the shell passes a valid value and owns state. Mesh clicks emit selection callbacks. The shell renders the same actions as visible HTML buttons and the selected information in semantic HTML. The Canvas is `aria-hidden`; it is never the only way to understand or operate a scene. A selected technical object opens a readable panel rather than relying on a tiny 3D label.

| View | Camera intent | Interactive object and HTML result |
| --- | --- | --- |
| Overview | Three-quarter establishing shot of the desk and monitor array | Select the workstation to reveal the four destinations. |
| Skills | Dolly toward the six structured signal nodes | Select a node to read its verified skill list and practical explanation. |
| Systems | Lateral move toward a connected monitor and data path | Select the flow console to reveal a **conceptual** API → service → database explanation; it is not a live or project-specific topology. |
| Contact | Pull back to a calm terminal/contact surface | HTML actions link to Resume, GitHub, Contact, and Quick View. |

Use fixed camera positions and look targets with bounded easing; avoid free-orbit navigation that can hide content or break mobile layout. A view change replaces any in-flight camera transition. Pause animation and invalidate calls while the page is hidden. Respect reduced motion by snapping to a final camera target or using the static shell. Do not mount a second Canvas for detail panels. Pointer interactions should have a visible cursor or affordance, but the HTML controls are the authoritative keyboard/touch route.

### Loading, failure, and performance targets

- Render the page heading, direct navigation, selected panel, and fallback illustration as HTML before importing the 3D module. On narrow screens or `prefers-reduced-motion`, use the HTML experience by default; offer the same four destinations and six clusters without timed transitions. If WebGL probing, import, Canvas creation, or context operation fails, retain all controls and mark the visual unavailable once. An explicit “Use static view” action lets a capable desktop visitor remove the Canvas on demand.
- Keep the scene procedural for this MVP: one Canvas, no downloaded models/textures, no new post-processing, physics, shaders, GSAP, or asset service. Reuse installed React 19, Three, Fiber and Drei. Use shared geometry/materials or instancing where many similar nodes appear. Cap DPR at 1.5 and use demand rendering with explicit invalidation only during bounded camera motion or interaction.
- **Targets, not measured results:** scene ready within 2.5 seconds on a local desktop production run; camera transitions complete within 900 ms; at least 30 FPS during motion on a representative midrange device. Instrument browser timings/resource counts and report the actual observation and environment. Do not claim a Core Web Vitals or device-FPS pass from headless Chromium alone.
- The scene must not delay direct recruiter navigation or the existing 2D workspace. Keep exact URL matching to known views and avoid arbitrary query-driven scene state. A scene exception must never break the route's HTML content.

Phase 5B's MVP implements this shared spatial frame and one meaningful technical object plus initial skill selection. Richer RAG and multi-agent visualizations are later work; any demonstration added now must be labeled conceptual and must not imply a live production system. Production audit, Travel AI credential remediation, and deployment remain separate gates recorded in the release documents.
