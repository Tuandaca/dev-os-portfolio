# DEV.OS experience flow

Status: Phase 2 specification, 2026-11-01. This document describes future interactions; the current workspace remains a lightweight content switcher.

## Entry points

The landing page presents the name, “Full-Stack Developer | Software Engineer,” a short CV-backed summary, featured work, and two equally clear actions: **Enter DEV.OS** and **Browse portfolio**. The second action goes to the server-rendered project/about routes. Header links expose About, Experience, Projects, Skills, Resume, and Contact without requiring boot or workspace interaction.

The cinematic laptop is an optional layer behind the first content view. Its screen can preview the workspace, but text, calls to action, and links remain real HTML outside the Canvas. Tone is restrained: dark surfaces, precise type, sparse green signal accents, and no decorative glitch or flashing sequences.

## Main journeys

```mermaid
flowchart TD
  Landing[/ Landing: summary + choices] --> Browse[Recruiter HTML routes]
  Landing --> Enter{Enter DEV.OS}
  Enter -->|motion allowed| Boot[Short, skippable boot]
  Enter -->|reduced motion or skip| Workspace[/workspace]
  Boot -->|complete or Skip| Workspace
  Workspace --> App[Open content app]
  App --> Direct[Open canonical HTML page]
  Browse --> Direct
  Direct --> Workspace
```

| Journey | Interaction contract | Completion |
| --- | --- | --- |
| Recruiter scan | From `/`, choose a visible direct link; review summary, actual roles/dates, featured projects, skills, GitHub, resume, and contact in HTML pages. | Information is discoverable within ordinary navigation and usable without animation. |
| Enter workspace | Press Enter DEV.OS. If motion is allowed, show a brief boot with an immediately available Skip button. | Navigate to `/workspace`; focus the workspace heading or first meaningful control. |
| Open app | Activate launcher/taskbar/app shortcut by pointer or keyboard. | App window opens, receives a readable title, and can be closed/minimized/reopened. Content matches direct routes. |
| Share work | Choose “View case study” inside Projects app. | Navigate to canonical `/projects/[slug]` URL, not a window-only state. |
| Command palette | Use visible launcher control or keyboard shortcut while workspace is focused; type an app or page name. | Selected command opens a known app or navigates to an existing route; Escape closes and restores focus. |
| Terminal | Open Terminal app and enter finite commands such as `help`, `about`, `projects`, `resume`, `contact`, `clear`. | Commands reveal navigation/help output or open a route. Unknown commands explain available help. No shell access. |

## Workspace interaction specification

The desktop has one primary content region and a taskbar with app launcher, open app indicators, and a route back to the plain portfolio. The launcher is a named menu/list of available apps. The initial app set mirrors verified content: About, Experience, Projects, Skills, Resume, Contact, plus a local Terminal. Do not add fictional system tools or facts.

Windows use a small set of stable behaviors: open, focus, minimize, restore, close, and, on large screens only, drag within a visible viewport. A single window is focused at a time. Position and size are conveniences, not the only way to reach content; each window offers an ordinary page link. Default placement leaves the title bar and close control visible. Opening a deep link selects the requested app after the workspace loads; malformed or unknown app IDs lead to the default workspace and visible launcher, without a crash.

The command palette and launcher are dialogs or menus with accessible names, keyboard navigation, focus management, and Escape. Use a shortcut only as an enhancement; visible controls remain. A terminal command registry maps allowlisted command strings to safe local actions. Never evaluate user input as code or call a backend shell.

## Boot and motion

Boot is a brief visual transition, not a loading gate. Navigation to the workspace begins promptly. A Skip button is visible and keyboard reachable from the first frame. `prefers-reduced-motion: reduce` skips camera movement, typing effects, and timed boot. If the user skips once in a session, subsequent entries can go directly to the workspace; do not persist this choice across visits in Phase 2. Animation must not delay content or cause focus to jump. Screen readers receive only a simple transition status, not a stream of decorative terminal lines.

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
