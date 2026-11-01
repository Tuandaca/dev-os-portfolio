# DEV.OS — Inside a Developer's Mind

DEV.OS is the portfolio of Ngo Anh Tuan (Tuandaca). It offers ordinary, directly addressable recruiter pages alongside an optional browser desktop and a cinematic laptop introduction. The portfolio content is grounded in the owner-provided CV and reviewed project repositories; unknown contributions and results are marked TODO in the case studies.

## Explore the site

| Route | Purpose |
| --- | --- |
| `/` | Professional introduction and featured work |
| `/projects` and `/projects/[slug]` | Selected projects and evidence-led case studies |
| `/about`, `/experience`, `/skills` | Profile, dated roles, education, and technology inventory |
| `/resume`, `/contact` | Owner-approved CV download and contact actions |
| `/workspace` | Interactive DEV.OS desktop; also reachable directly |

The laptop animation is optional. Mobile, reduced-motion, no-JavaScript, and WebGL-failure paths retain ordinary links. The Travel AI source link is intentionally withheld pending credential remediation; the Business Website v2 demo is withheld pending source-to-deployment verification.

## Run locally

This repository uses Next.js App Router, strict TypeScript, Tailwind CSS, Zustand, React Three Fiber/Drei, Vitest, and Playwright. The current portfolio uses static TypeScript content and does not require an `.env` file or external service credentials for local viewing.

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. Node.js 22.17.1 and npm 11.12.1 were used during the Phase 5A preflight on Windows; check `package.json` and the installed package requirements when using another runtime.

Run the verification commands before publishing changes:

```powershell
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

`npm run test:e2e` starts its own local Next.js server on port 3100. Stop any development or production server that shares the project's `.next` directory before running the production build.

## Content and project boundaries

- `src/content/` contains the profile, dated experience, skills, and project data. [Content provenance](docs/CONTENT_SOURCE.md) records the CV and repository evidence behind public claims.
- `src/app/` owns the direct recruiter routes. `src/components/os/` owns the interactive workspace. `src/components/scene/` owns the procedural laptop; `src/components/landing/` owns its accessible entry and fallbacks.
- `docs/PROGRESS.md` and `docs/TASKS.md` are persistent checkpoints. Read them and `AGENTS.md` before starting work.
- The original English CV in `public/resume/` is public with the owner's explicit approval, including its contact information. Do not add private credentials or unpublished contact data to source files.

## Backup and release

Windows backup, restore, and optional Scheduled Task instructions are in [docs/BACKUP.md](docs/BACKUP.md). The task is **not installed automatically**. Snapshots live outside the repository by default.

The GitHub repository is a source repository, not evidence of a live DEV.OS deployment. [Release readiness](docs/RELEASE_READINESS.md) tracks dependency advisories, content/source checks, SEO URL decisions, and deployment gates. Do not deploy or alter the existing portfolio domain without owner authorization.

No license file is present. Public visibility alone does not grant reuse rights; the owner should choose a license if broader reuse is intended.
