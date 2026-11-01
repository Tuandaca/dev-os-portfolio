# DEV.OS content contract

Status: current typed content mapped on 2026-11-01; MDX case studies are a future extension. `docs/CONTENT_SOURCE.md` is the evidence ledger and must be consulted before changing owner facts.

## Source order and publication

The supplied CV is the baseline for identity, summary, experience, education, certification, skill inventory, and selected projects. The owner supplied the current display headline and confirmed the Travel AI/Multimodal RAG project identity on 2026-11-01; those two clarifications do not replace the CV's dated facts. Inspected repository code and documentation can supplement implementation details at a recorded commit. Runtime results, deployment status, metrics, employment type, and achievements need separate evidence. Preserve the distinction between the CV's “2 years of hands-on, project-based experience,” the university IT role (2025–2026), and freelance Web Data Evaluator work (2021–2025).

The owner approved publishing the byte-identical original CV, including its contact details, on 2026-11-01. The website asset is `public/resume/NgoAnhTuan2y_fullstack_Eng.pdf`; its source hash and verification status are in `docs/CONTENT_SOURCE.md`. Future scope changes must update the asset and all links. The Travel AI repository URL is intentionally absent from `featuredProjects` while its public credential exposure is reviewed.

## Current modules and types

| Module | Export | Current contract | Consumers |
| --- | --- | --- | --- |
| `src/content/profile.ts` | `profile` | Literal name, headline, location, `experienceContext`, summary, email, phone, GitHub and portfolio URLs, resume URL. | Root metadata, About, contact and shell. |
| `src/content/experience.ts` | `workExperience`, `education`, `certifications` | Roles have `role`, `context`, CV `period`, `kind`, and responsibilities. Education has degree, institution, period, GPA. Certification has name, level, year. | About and Experience routes/apps. |
| `src/content/skills.ts` | `skillGroups`, `developmentPractice` | Named groups with skill items; no invented proficiency levels. | Skills route/app and summary. |
| `src/content/projects.ts` | `ProjectSource`, `CaseStudySection`, `FeaturedProject`, `featuredProjects`, `getFeaturedProject` | Projects have unique slug/title/kind/summary, optional period and verified source/demo URLs, CV/code technologies, sourced highlights, and required case-study sections with explicit TODO states. | Projects index, detail, metadata, app. |

Current `FeaturedProject` contract:

```ts
type ProjectSource = "CV" | "Repository code" | "Repository documentation";

type CaseStudySection =
  | { status: "verified"; items: readonly { text: string; source: ProjectSource; ref?: string }[] }
  | { status: "TODO"; note: string };

interface FeaturedProject {
  slug: string;
  title: string;
  kind: "Personal project" | "Collaborative capstone" | "Public repository sample";
  period?: string;
  summary: string;
  cvTechnologies: readonly string[];
  codeTechnologies: readonly string[];
  highlights: readonly { text: string; source: ProjectSource; ref?: string }[];
  caseStudy: {
    problem: CaseStudySection;
    objectives: CaseStudySection;
    contributions: CaseStudySection;
    architecture: CaseStudySection;
    engineeringDecisions: CaseStudySection;
    challenges: CaseStudySection;
    verifiedResults: CaseStudySection;
  };
  repositoryUrl?: string;
  repositoryLinks?: readonly { label: string; url: string }[];
  liveDemoLinks?: readonly { label: string; url: string }[];
}
```

These are the actual current fields. Do not introduce an invented result, live URL, employer, contribution percentage, or project status to satisfy a layout. An absent optional field should produce no link or label; a TODO must visibly say what evidence is missing. Do not render a CV technology list as proof of the current code architecture; keep the two arrays separate. If a claim mixes sources, split it into separate evidence items. “Public repository sample” does not imply the owner's individual contribution or a client engagement. The Travel AI repository URL is omitted pending credential review.

## Later case-study extension

Keep `featuredProjects` as the single metadata registry. The required case-study sections now render from typed data and semantic HTML; MDX and React Flow are optional future enhancements. A reviewed MDX file may supply extra long-form narrative and static diagram captions for a matching slug, with a frontmatter or typed export containing only `slug` and `reviewedAt`. The page resolves metadata by slug from `projects.ts`, renders MDX content only after evidence review, and falls back to the current typed sections when no MDX exists. Never duplicate title, links, dates, technologies, or source labels in MDX frontmatter. This avoids diverging facts between the recruiter route and workspace app.

Recommended sections when evidence exists: **Context**, **My role**, **Architecture**, **Implementation**, **Verification**, **Trade-offs**, **What I learned**. Each concrete technical claim should map to a CV statement or a repository file/commit in `docs/CONTENT_SOURCE.md`. “My role” must not be inferred from a collaborative repository. Metrics and deployment claims require runtime or owner evidence; omit the section when unavailable. Interactive React Flow diagrams may enrich an architecture section, but equivalent text and a static diagram remain available.

Add `@next/mdx`, `@mdx-js/loader`, and `@mdx-js/react` only when the first reviewed narrative is ready. The [Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx) specifies `mdx-components.tsx`. Match the MDX integration package to the installed Next release, make MDX components an explicit allowlist, and avoid unreviewed embedded JavaScript. Build and render-test a case-study route after integration.

## Validation rules for future editors

1. A slug is unique, stable, URL-safe, and maps to `/projects/[slug]`; unknown values return a 404 rather than generic project content.
2. Every displayed project implementation claim has a `CV`, `Repository code`, or `Repository documentation` source label and a ledger entry at a known source revision. Repository documentation may describe intent but does not prove runtime behavior. If evidence changes, update the label and source record together.
3. Employment, freelance, university-role, and personal/collaborative project labels remain distinct. Preserve the CV date precision: years stay years; month-level dates appear only where given.
4. Optional URLs are shown only when approved and verified. External links use descriptive text and safe browser attributes. Contact values come from `profile`, not copied literals in components.
5. Shared recruiter pages, workspace apps, metadata, and future MDX read the same typed modules. `src/data/portfolioData.ts` is legacy unverified material and must not be imported into new owner-facing UI.
6. When the schema changes, update this file, `docs/CONTENT_SOURCE.md` for changed facts, focused content tests if behavior warrants, and the relevant route metadata. Verify lint, typecheck, and build before marking a content task done.
