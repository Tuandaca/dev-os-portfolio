# DEV.OS experience flow

Status: Phase 2–4 journeys and the Phase 5B `/universe` MVP implemented, 2026-11-01.

## Entry points

The landing page presents the CV-backed identity and owner-approved headline, a short summary, featured work, and clear actions to **Enter DEV.OS**, open **Quick View**, or **Browse portfolio**. Enter leads to `/universe`; Quick View leads to the existing 2D `/workspace`; Browse uses server-rendered project/about routes. Header links expose About, Experience, Projects, Skills, Resume, and Contact without requiring boot or workspace interaction.

The cinematic laptop is an optional layer behind the first content view. Its screen can preview the workspace, but text, calls to action, and links remain real HTML outside the Canvas. Tone is restrained: dark surfaces, precise type, sparse green signal accents, and no decorative glitch or flashing sequences.

## Main journeys

```mermaid
flowchart TD
  Landing[/ Landing: summary + choices] --> Browse[Recruiter HTML routes]
  Landing --> Enter{Enter DEV.OS}
  Enter -->|motion allowed| Boot[Short, skippable boot]
  Enter -->|reduced motion or skip| Universe["/universe"]
  Boot -->|complete or Skip| Universe
  Universe --> Skills[Select skill cluster]
  Universe --> Systems[Inspect conceptual flow]
  Universe --> Quick["/workspace Quick View"]
  Universe --> Direct
  Quick --> App[Open content app]
  App --> Direct[Open canonical HTML page]
  Browse --> Direct
  Direct --> Quick
```

| Journey | Interaction contract | Completion |
| --- | --- | --- |
| Recruiter scan | From `/`, choose a visible direct link; review summary, actual roles/dates, featured projects, skills, GitHub, resume, and contact in HTML pages. | Information is discoverable within ordinary navigation and usable without animation. |
| Enter immersive universe | Press Enter DEV.OS. If motion is allowed, show a brief boot with an immediately available Skip button. | Navigate to `/universe`; focus its heading or first meaningful control. |
| Open Quick View | Use the visible Quick View link from the landing or universe. | Navigate directly to the existing 2D `/workspace`, with all portfolio apps intact. |
| Explore skills and systems | Select one of four scene views, a CV-backed skill cluster, or the conceptual flow console by 3D pointer or equivalent HTML button. | The camera settles at a fixed view where supported, while a semantic HTML panel shows the same selected information. |
| Open app | Activate launcher/taskbar/app shortcut by pointer or keyboard. | App window opens, receives a readable title, and can be closed/minimized/reopened. Content matches direct routes. |
| Share work | Choose “View case study” inside Projects app. | Navigate to canonical `/projects/[slug]` URL, not a window-only state. |
| Command palette | Use visible launcher control or keyboard shortcut while workspace is focused; type an app or page name. | Selected command opens a known app or navigates to an existing route; Escape closes and restores focus. |
| Terminal | Open Terminal app and enter finite commands such as `help`, `about`, `projects`, `resume`, `contact`, `clear`. | Commands reveal navigation/help output or open a route. Unknown commands explain available help. No shell access. |

## Workspace interaction specification

The desktop has one primary content region and a taskbar with app launcher, open app indicators, and a route back to the plain portfolio. The launcher is a named menu/list of available apps. The initial app set mirrors verified content: About, Experience, Projects, Skills, Resume, Contact, plus a local Terminal. Do not add fictional system tools or facts.

Windows use a small set of stable behaviors: open, focus, minimize, restore, close, and, on large screens only, drag within a visible viewport. A single window is focused at a time. Position and size are conveniences, not the only way to reach content; each window offers an ordinary page link. Default placement leaves the title bar and close control visible. Opening a deep link selects the requested app after the workspace loads; malformed or unknown app IDs lead to the default workspace and visible launcher, without a crash.

The command palette and launcher are dialogs or menus with accessible names, keyboard navigation, focus management, and Escape. Use a shortcut only as an enhancement; visible controls remain. A terminal command registry maps allowlisted command strings to safe local actions. Never evaluate user input as code or call a backend shell.

## Boot and motion

Boot is a brief visual transition, not a loading gate. The Skip link is visible and keyboard reachable before the animation starts and navigates immediately. `prefers-reduced-motion: reduce` bypasses WebGL and timed boot. The current implementation does not persist a skip preference. A one-time session flag should focus the immersive route heading after client navigation; no-JavaScript links still navigate normally. Screen readers receive one concise transition status, while decorative terminal lines are hidden from them.

## Mobile and fallback

At small viewports, use a single-panel workspace with a full-width app list and taskbar. Do not require dragging, hover, precision taps, or multitouch. The direct recruiter routes are the preferred mobile reading path. The laptop becomes a static illustration or CSS treatment, with no WebGL requirement.

When Canvas cannot initialize, assets fail, JavaScript is disabled, or the connection is slow, the landing hero and direct routes still provide the same factual content. The workspace route retains server-rendered heading, navigation, and app links before client enhancement. Failure to load a window or terminal shows a clear error and a link to the corresponding HTML page. The PDF route and contact links remain independent of OS state.

## Information hierarchy and content checks

1. Identity and professional summary.
2. Work experience with exact CV periods and kind; project-based experience is separately labeled.
3. Featured Cinema and Travel AI projects, with claims separated by CV or verified repository code.
4. Skills without inferred proficiency levels.
5. GitHub, approved original resume, and contact.

Use `src/content/` and `docs/CONTENT_SOURCE.md` as the owner-data contract. The Travel AI repository link remains withheld from prominent public UI pending credential review noted in the source record. The project page may still describe verified code in prose. Never turn evaluation targets into achieved results or imply employment duration from the two-year project-based summary.

## Acceptance for later implementation

- All required routes open directly and expose page-specific metadata and a single main heading.
- A keyboard-only visitor can enter, skip, launch, switch, close, and return to direct pages; focus is visible and restored after dismissing overlays.
- Reduced-motion and mobile paths avoid the 3D boot, preserve all content, and need no drag gesture.
- Deep links to valid apps and project slugs work after reload; unknown values fail safely.
- Playwright checks the recruiter journey, workspace keyboard journey, reduced-motion skip, scene failure fallback, and direct case-study URL. Run these only when the features exist.

## Phase 5B universe journey

The `/universe` route is a spatial orientation layer around the existing portfolio, not a replacement source of facts. The first HTML paint presents a title, four view controls (Overview, Skills, Systems, Contact), direct recruiter links, and Quick View. On capable desktop devices, one lazy WebGL Canvas draws the workstation. The active view, selected skill, and conceptual flow explanation live in the UI shell so an unavailable scene cannot erase them.

View changes use bounded camera moves between fixed compositions. Selecting a 3D skill node or its HTML button highlights the same cluster and updates a readable detail panel with CV-backed skill names. The Systems console explains an API → service → database request as a conceptual demonstration; it is not linked to a specific project or live infrastructure. The final Contact view presents ordinary Resume, GitHub, Contact, and Quick View links. The scene never triggers an external navigation directly.

On mobile, reduced motion, missing WebGL, module error, or slow loading, keep the same four view controls and skill detail panel with a static workstation treatment. A desktop visitor can also select “Use static view” to remove WebGL while retaining the same controls. The visitor can skip the landing transition immediately and access all direct pages. Keyboard selection, visible focus, and one concise live status are required; the Canvas stays hidden from assistive technology. The existing 2D desktop retains its launcher, terminal, windows, and deep links unchanged.
