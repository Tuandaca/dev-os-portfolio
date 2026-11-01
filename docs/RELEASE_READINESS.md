# DEV.OS release readiness

Status: Phase 5A local review completed, 2026-11-01; Git synchronization is tracked in `docs/PROGRESS.md`. This is **not** deployment approval. The existing `tuandacadev.vercel.app` site is not verified as a DEV.OS deployment target.

## Reviewed surfaces

| Area | Evidence and current state | Release action |
| --- | --- | --- |
| Repository | Public `Tuandaca/dev-os-portfolio`, default branch `main`; GitHub root contains source, docs, tests, scripts, lockfile, and Cursor agent definitions. README was absent before this review. No `.github` workflow or license file is present in the inspected root. | Keep source-only publishing distinct from deployment. Decide whether CI and a reuse license are wanted; do not invent a license. |
| Local setup | `package.json` provides dev, lint, typecheck, Vitest, Playwright, and build scripts. No `process.env` or `NEXT_PUBLIC_` reads were found in the current app source during this review; static pages need no app secret for local viewing. | Validate a clean `npm ci` and all checks on the final lockfile. Document any future required environment variables before adding them. |
| Dependency security | Initial audit: 19 findings, including two critical dev-tool and two production findings. Vitest 4.1.12 and PostCSS 8.5.32 with a root override passed clean `npm ci`, lint, tests, and build. Final `npm audit --omit=dev`: 0 findings; full audit: 14 moderate findings, all in the ESLint/minimatch development chain, with 0 high/critical. | Use lint only on trusted repository inputs; evaluate a compatible ESLint/tooling update separately. No blind `npm audit fix --force` or Next major migration was used. A clean production audit is not a security certification. |
| Ignore policy | `.gitignore` excludes dependency/build/test output, `.env*`, common credentials, databases, logs, and local snapshots. This review added narrowly scoped key/certificate/keystore and `.ssh` patterns; source, tests, docs, Cursor agents, and scripts remain trackable. | Check staged names and run a content-level secret scan before every push; filename filters alone are insufficient. |
| Portfolio evidence | `src/content/` is the public fact source, with CV baseline and repository evidence in `docs/CONTENT_SOURCE.md`. TODO sections remain for unsupported contribution/result claims. | Keep Travel AI source URL withheld until rotation and history review; keep mismatched Business Website v2 demo withheld. Do not turn repository ownership into individual achievement claims. |
| Resume/contact | `public/resume/NgoAnhTuan2y_fullstack_Eng.pdf` SHA256 is `2F7154E61F5DB72E9E272C9BA3F69A5D56836C1EB13185E7D918C1F79F10880A`, matching the owner-supplied CV in the prior checkpoint. The owner approved public contact details in that original PDF. `/resume` links to the PDF and `/contact` uses CV-backed `mailto:`, `tel:`, GitHub, and portfolio links. | Recheck PDF response/download and contact link attributes in the final browser run. Email/phone delivery itself has not been tested. |
| SEO | Direct recruiter routes and known project slugs have HTML content and page titles/descriptions; project slugs use `generateStaticParams` and unknown slugs return 404. Root Open Graph/Twitter metadata is present. No verified DEV.OS production URL, `metadataBase`, canonical URL, sitemap, or robots route is configured. | Verify the actual DEV.OS deployment URL and publishing scope with the owner before adding canonical, absolute OG image URLs, sitemap, and robots policy. Do not point canonical at the older portfolio by assumption. |
| Errors and fallbacks | The landing scene has an error boundary and static fallback. Root `error.tsx` now provides reset and ordinary Home/Projects/Resume/Contact links; `not-found.tsx` provides the same routes. Browser QA confirmed unknown paths return 404 with usable fallback links. Workspace and recruiter routes remain directly addressable without WebGL. | Keep these fallbacks in regression checks; review any future server error path separately. |
| App behavior | Terminal commands are finite local navigation actions; `runTerminalCommand` does not evaluate text or call a shell. Project routes use a known slug allowlist. External links inspected in the portfolio use `rel="noopener noreferrer"` with `target="_blank"`. | Keep deep-link validation and direct routes in the final regression suite. Review any new external input, data fetch, or upload path separately. |
| Backups | `docs/BACKUP.md` describes independent ZIP snapshots, integrity verification, isolated restore, and optional Windows Scheduled Task installation/removal. The task was not installed in the prior checkpoint. | Confirm current task status if operations depend on scheduled backups; do not install it silently. |

## Required evidence before release

1. **Completed locally:** final `npm audit` and `npm audit --omit=dev` results are above; 14 moderate dev-tool findings remain. A clean production audit alone does not establish application security.
2. **Completed locally:** clean `npm ci`, lint, typecheck, 14 Vitest tests, 19 Playwright tests (recruiter, workspace, cinematic/fallback, release paths), and production build passed.
3. **Completed locally:** four case studies were rechecked against `docs/CONTENT_SOURCE.md`; safe source/demo links and withheld Travel AI and Business Website v2 links were rechecked. No unsupported TODO became a claim.
4. Confirm the owner-selected DEV.OS deployment URL and the exact public content scope before setting canonical/sitemap/robots metadata. Production domain changes and deployment need separate authorization.
5. Inspect the staged diff, scan source for accidental secrets, verify `origin/main` ancestry, and push only verified changes without force.

## Current known decisions

- The original CV is publicly downloadable by owner approval. It contains contact details.
- A public repository can show code and README claims, but it cannot establish deployed behavior, achieved metrics, client results, or individual contributions on its own.
- Travel AI's read-only audit identified two Neo4j password candidates and five Google/Gemini key candidates across current files and Git history; provider validity was not tested. Remediation is tracked separately in `docs/TRAVEL_AI_SECURITY.md`; DEV.OS must not reproduce credential values or link to the affected repository until remediation is verified.
- The Business Website v2 demo remains unlinked because its observed page identity differed from the inspected repository source.
