# DEV.OS technical vision

DEV.OS is a premium developer portfolio for Ngo Anh Tuan (Tuandaca). The first path should make identity and verified engineering work easy to read. Interactive OS and 3D elements are later, optional layers.

## Foundation

- Next.js App Router serves the site from `src/app/`. Keep pages and metadata server-renderable by default.
- TypeScript strict mode and the `@/*` alias apply to application code in `src/`.
- Tailwind CSS provides design tokens through `tailwind.config.ts`; `src/app/globals.css` holds only global base styles.
- `src/components/` will hold reusable UI and, later, isolated OS and 3D features. `src/lib/` will hold shared pure utilities when needed.
- `src/data/` and `src/types/` hold content and contracts. Legacy `src/data/portfolioData.ts` is retained but its claims require evidence review before display.
- `src/test/` holds test setup. Add focused tests alongside new behavior when they catch a concrete regression risk.
- `docs/` records architecture, tasks, and verified progress. `scripts/` contains existing checkpoint helpers; review those separately before operational use.

## Planned milestones

1. **Foundation:** runnable App Router shell, lint, strict typecheck, production build, and agent ownership.
2. **Verified content:** owner-confirmed identity, project evidence, clear case-study schema, and direct recruiter routes.
3. **Interactive workspace:** OS shell, terminal command model, state management, and keyboard accessibility.
4. **3D scene:** optional laptop transition with a fast static fallback, skip control, and measured performance.
5. **Release readiness:** accessibility, responsive behavior, SEO, regression checks, security review, and authorized deployment.

## Boundaries

Keep recruiter content usable without JavaScript-heavy effects. Load the OS and 3D layers only where they serve the experience. Do not publish unverified achievements, metrics, or project outcomes. Avoid adding backend or persistence until a specific feature requires it.
