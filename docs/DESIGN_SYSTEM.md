# DEV.OS design system

**Phase:** 2 — specification and foundations. **Visual direction:** Hacker Terminal × Developer Workstation × Premium Cyber Minimalism. The interface should feel like a precise developer tool with the ease of a conventional portfolio. Glow, scan lines, and decorative terminal copy are accents, never the reading surface.

## Principles

1. Put identity, experience, projects, stack, resume, and contact within obvious reach. The desktop metaphor must never hide these destinations.
2. Use the accent to direct attention and show focus. Use spacing, type, and borders for hierarchy.
3. Keep text selectable, routes linkable, controls keyboard operable, and core content available without WebGL or animation.
4. Prefer one composed transition to many ambient effects. A still interface must remain complete.

## Tokens and color

`src/styles/tokens.css` owns the palette as RGB channels. `tailwind.config.ts` exposes the same names as `dev-*` utilities and supports Tailwind opacity modifiers such as `bg-dev-surface/90`. Do not scatter new hex values in components.

| Role | Token / utility | Value | Use |
| --- | --- | --- | --- |
| Canvas | `--dev-color-bg` / `dev-bg` | `#080D12` | Page and desktop backdrop |
| Surface | `--dev-color-surface` / `dev-surface` | `#111C24` | Cards, taskbar, window body |
| Structural border | `--dev-color-border` / `dev-border` | `#294039` | Dividers and quiet outlines |
| Accent | `--dev-color-accent` / `dev-accent` | `#6EE7A0` | Primary action, selected state, keyboard focus |
| Primary text | `--dev-color-text` / `dev-text` | `#E4F2ED` | Headings and body text |
| Raised surface | `dev-elevated` | `#16242F` | Hover and foreground panel |
| Emphasized border | `dev-border-bright` | `#3D6257` | Control outlines |
| Secondary text | `dev-secondary` | `#94A3B8` | Supportive labels |
| Muted text | `dev-muted` | `#788A9D` | Metadata on dark surfaces |

Semantic status hues `dev-amber`, `dev-red`, and `dev-cyan` are reserved for warning, error, and information. Every state needs text or an icon label as well as color. Avoid status green for decorative details where it would imply success.

Contrast targets: primary text on canvas is about 16.9:1; accent on canvas about 12.6:1; accent on surface about 11.2:1; muted text on surface about 4.9:1. The structural border has low contrast by design and cannot be the only signal of focus, selection, or a control's hit area. Use an accent outline for focus.

## Typography

`font-sans` resolves **Geist Sans → Space Grotesk → Inter → Arial/Helvetica → system sans**. `font-mono` resolves **JetBrains Mono → Geist Mono → Consolas → Courier New → system monospace**. The fonts are declared as stacks; Phase 2 does not download font files or depend on a font service. The fallback layout must remain sound.

| Role | Mobile | Desktop | Weight / line height |
| --- | --- | --- | --- |
| Hero display | `text-4xl` | `text-6xl` to `text-7xl` | 600–700 / 1.05–1.1 |
| Page title | `text-3xl` | `text-4xl` | 600 / 1.15 |
| Section title | `text-xl` | `text-2xl` | 600 / 1.25 |
| Body | `text-base` | `text-base` | 400 / 1.6 |
| Supporting | `text-sm` | `text-sm` | 400–500 / 1.5 |
| UI label / code | `text-xs` to `text-sm` | same | mono 500 / 1.35–1.5 |

Use mono for commands, keyboard hints, metadata, and short labels. Long biography and case study copy stays sans. Limit prose to roughly 65–75 characters per line. Sentence case is the default. Uppercase microcopy is sparse.

## Layout and spacing

Use Tailwind's 4 px spacing unit. Common gaps are 8, 12, 16, 24, 32, and 48 px. Minimum comfortable pointer target is 44 × 44 px for main actions; compact controls may be 36 px high when they sit in dense desktop chrome with a larger accessible target nearby. Keep 16 px horizontal page gutters on small screens, 24–32 px within desktop panels, and a readable max width for prose.

The desktop shell may fill the viewport, but recruiter routes should behave like normal documents with visible scroll, headings, and content. On narrow screens, stack content rather than scaling a desktop scene into unreadable miniature windows. Respect safe area insets around bottom navigation.

## Surfaces, borders, and elevation

Use `rounded-control` (6 px) for controls, `rounded-panel` (12 px) for cards, and `rounded-window` (16 px) for full application windows. A flat panel is `dev-surface` with a 1 px `dev-border` outline. A raised or active window uses `dev-elevated`, `shadow-window`, and a stronger border. `shadow-window-focus` is reserved for the foreground window; do not apply it to every card. Keep panel translucency limited so underlying patterns cannot lower text contrast.

## Interaction states

- **Focus:** 2 px `dev-accent` outline with 2 px offset on keyboard focus. Never remove the native outline without replacing it. A window becoming active must also change its title/bar label or layer position, not merely its border color.
- **Hover:** subtle surface or border shift over `--dev-duration-fast` (120 ms). No movement is needed for routine controls.
- **Pressed:** slightly darker fill or clear state change. Retain focus visibility.
- **Disabled:** lower opacity and `not-allowed` cursor; avoid using a disabled control where an explanation or link would be clearer.
- **Loading:** use explicit text such as “Opening project…”. An indeterminate animation may supplement it.
- **Error/warning/success:** pair semantic hue with a readable label or message and a stable location; avoid color-only badges.

`Button`, `ButtonLink`, `Panel`, `StatusPill`, and `KeyboardKey` are the Phase 2 primitives in `src/components/ui/`. Import them directly from their files. `Button` defaults to `type="button"`; choose `type="submit"` explicitly for forms. `ButtonLink` is for navigation so links retain native browser behavior. `Panel` is a visual container with no implied interactive semantics. `StatusPill` requires meaningful child text supplied by its caller. `KeyboardKey` emits `<kbd>`.

## Motion and reduced motion

Use 120 ms for state feedback, 180 ms for a small panel transition, and at most 320 ms for a reveal. These are CSS variables and Tailwind duration names. Animate opacity and transform where possible. For the landing transition, one staged animation is enough; no continuous flicker, cursor blinking across prose, or mandatory boot wait. With `prefers-reduced-motion: reduce`, token durations become 0 ms, scroll behavior is automatic, and all destinations remain available without timing or animation. Background video/WebGL must not play as the only path to content.

## DEV.OS affordances for later phases

**Laptop landing:** dark canvas, one focal laptop silhouette, restrained green light, and a visible text action to enter the workspace. Hero title and routes remain HTML. A static image or CSS composition replaces WebGL for reduced motion, unsupported devices, or low capability.

**Boot sequence:** show identity and progress in actual text. Provide a “Skip intro” action and a direct link to `/workspace`. Do not hold the visitor behind a timed animation.

**Desktop and windows:** application titlebars need a text title, optional icon, clear active state, a close button with an accessible label, and predictable tab order. Minimum window size must preserve readable content. On mobile, use full screen views or a simple stacked route, not draggable miniature windows.

**Taskbar and launcher:** each app gets a recognizable label in addition to its icon. Active and open states are distinct. A launcher is a normal button that opens a keyboard navigable list; no custom key handling is required for Phase 2.

**Terminal and command palette:** mono type, generous line height, clear prompt/output contrast, visible command hints, and explicit errors. Provide accessible form labels and focus management when these overlays are implemented. Terminal content must never be the sole way to reach portfolio information.

**Recruiter mode:** standard pages and links for `/about`, `/projects`, `/resume`, and `/contact`, with a visible path from the cinematic landing. Plain HTML headings, metadata, and project links provide deep linking, search indexing, and printing.

## QA bar

Review at 320, 375, 768, and 1440 px widths; with keyboard only; at 200% zoom; with reduced motion; and with WebGL unavailable. Check visible focus, no clipped labels, readable text contrast, and a direct route to resume/contact. Later interactive components need targeted behavior and accessibility checks when implemented.
