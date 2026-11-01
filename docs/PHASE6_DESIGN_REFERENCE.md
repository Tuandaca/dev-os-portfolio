# Phase 6 Design Reference — Dark Neon Liquid × Premium Cyber Minimalism

## 1. Executive Summary & Art Direction Baseline

Phase 6 of DEV.OS implements the **Dark Neon Liquid × Premium Cyber Minimalism** art direction. This visual aesthetic fuses deep obsidian/emerald organic depths with surgical developer console minimalism. The design establishes an immersive, cinematic atmosphere while maintaining unimpeachable contrast, instant accessibility, and zero-compromise legibility for technical recruiters, hiring managers, and engineers.

### 1.1 Reference File Documentation
- **Status on Disk**: The external reference document `docs/references/kimi-grido1-design-reference.txt` was **not found on disk** upon repository inspection.
- **Specification Authority**: In accordance with the system integrity guidelines and `ORIGINAL_REQUEST.md § Reference Material`, specifications have been derived directly from the explicit visual direction and interaction requirements defined in `ORIGINAL_REQUEST.md` and `PROJECT.md`. No fictitious reference contents were invented.

### 1.2 Core Architectural Principles
1. **Developer Workstation Precision**: Interfaces feel like a high-end developer cockpit rather than a decorative tech demo. Typography, grid alignment, and micro-metrics dominate over arbitrary ornament.
2. **Strictly NO Cyan Primary Accents**: Primary action vectors and brand identity strictly employ emerald (`#6EE7A0`) and hyper-intense neon green (`#39FF88`). Cyan (`#38BDF8`) is retained exclusively as an informational semantic status indicator (e.g. system alerts), never as a brand or primary UI accent.
3. **Decoupled Ambient Depth**: Three-dimensional background phenomena (fluid domain warping, procedural shaders, lighting) operate strictly on a decoupled background plane (`z-index: 0`). Semantic DOM content (`z-index: 10+`) is never distorted or occluded.

---

## 2. Design Tokens & Palette Specification

Design tokens are maintained in `src/styles/tokens.css` as raw space-separated RGB channel values. This architecture ensures complete compatibility with Tailwind CSS opacity modifiers (e.g., `bg-dev-surface/90`, `border-dev-border/60`, `text-dev-accent/80`) while preventing arbitrary hex-string sprawl across components.

### 2.1 Complete Color Token Table

| Role | CSS Variable | Tailwind Utility | Hex Code | RGB Channels | Purpose / Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Canvas / Background** | `--dev-color-bg` | `dev-bg` | `#070A09` | `7 10 9` | Deepest viewport base, body canvas, backdrop plane |
| **Surface** | `--dev-color-surface` | `dev-surface` | `#0E1512` | `14 21 18` | Standard container panels, cards, dialog bodies, taskbar |
| **Raised Surface** | `--dev-color-elevated` | `dev-elevated` | `#121A16` | `18 26 22` | Hovered cards, foreground windows, elevated badges |
| **Structural Border** | `--dev-color-border` | `dev-border` | `#1A2820` | `26 40 32` | Subtle panel dividers, inactive card outlines, grid lines |
| **Emphasized Border** | `--dev-color-border-bright` | `dev-border-bright` | `#22382B` | `34 56 43` | Active boundaries, interactive hover borders, window chrome |
| **Primary Accent** | `--dev-color-accent` | `dev-accent` | `#6EE7A0` | `110 231 160` | Primary CTAs, active tab indicators, keyboard focus outlines |
| **Supportive Emerald** | `--dev-color-accent-dim` | `dev-accent-dim` | `#22C55E` | `34 197 94` | Dimmed accents, secondary indicators, success states |
| **High-Intensity Neon** | `--dev-color-neon` | `dev-neon` | `#39FF88` | `57 255 136` | Laser highlights, active radar nodes, glow emitters, badges |
| **Primary Text** | `--dev-color-text` | `dev-text` | `#E4F2ED` | `228 242 237` | High-contrast headings, hero titles, body paragraphs |
| **Secondary Text** | `--dev-color-secondary` | `dev-secondary` | `#94A3B8` | `148 163 184` | Subheadings, dates, role metadata, secondary links |
| **Muted Text** | `--dev-color-muted` | `dev-muted` | `#788A9D` | `120 138 157` | Footers, disabled hints, table headers, breadcrumbs |
| **Status Warning** | `--dev-color-amber` | `dev-amber` | `#FBBF24` | `251 191 36` | Non-blocking warnings, in-progress indicators |
| **Status Error** | `--dev-color-red` | `dev-red` | `#F87171` | `248 113 113` | Critical failures, WebGL error states, validation errors |
| **Status Information** | `--dev-color-cyan` | `dev-cyan` | `#38BDF8` | `56 189 248` | System info notifications only (STRICTLY non-primary) |
| **Status Accent** | `--dev-color-purple` | `dev-purple` | `#C084FC` | `192 132 252` | Special categories, experimental flags |

### 2.2 Surface Elevation & Shadows

```css
--dev-shadow-window: 0 20px 40px -15px rgb(0 0 0 / 0.8), 0 0 0 1px rgb(var(--dev-color-border) / 0.6);
--dev-shadow-window-focus: 0 25px 50px -12px rgb(0 0 0 / 0.9), 0 0 20px rgb(var(--dev-color-accent) / 0.2), 0 0 0 1px rgb(var(--dev-color-border-bright));
--dev-shadow-neon-glow: 0 0 20px rgb(var(--dev-color-neon) / 0.4), 0 0 40px rgb(var(--dev-color-neon) / 0.15);
```

- **`shadow-window`**: Grounding shadow for baseline floating panels, combining low-frequency diffuse occlusion with a crisp 1px structural border.
- **`shadow-window-focus`**: Elevated focus state emitting a subtle 20px emerald aura (`rgb(110 231 160 / 0.2)`).
- **`shadow-neon-glow` / `shadow-glow-neon`**: Dual-radius laser aura reserved for active telemetry nodes, hero chapter numbers, and focal interactive elements.

---

## 3. Contrast Ratios & WCAG 2.1 Verification

All primary, secondary, and accent color pairs have been verified against the W3C Web Content Accessibility Guidelines (WCAG 2.1) relative luminance and contrast ratio formulas:

$$L = 0.2126 \times R_{\text{linear}} + 0.7152 \times G_{\text{linear}} + 0.0722 \times B_{\text{linear}}$$
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### 3.1 Measured Contrast Matrix

| Foreground Element | Background Surface | Contrast Ratio | WCAG 2.1 AA | WCAG 2.1 AAA | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Text (`#E4F2ED`)** | Canvas Background (`#070A09`) | **17.02 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |
| **Primary Text (`#E4F2ED`)** | Surface Panel (`#0E1512`) | **16.32 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |
| **Primary Text (`#E4F2ED`)** | Raised Surface (`#121A16`) | **15.48 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |
| **High-Intensity Neon (`#39FF88`)** | Canvas Background (`#070A09`) | **14.80 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |
| **Primary Accent (`#6EE7A0`)** | Canvas Background (`#070A09`) | **12.68 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |
| **Primary Accent (`#6EE7A0`)** | Surface Panel (`#0E1512`) | **12.16 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |
| **Secondary Text (`#94A3B8`)** | Canvas Background (`#070A09`) | **7.66 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |
| **Muted Text (`#788A9D`)** | Canvas Background (`#070A09`) | **5.58 : 1** | Pass (req. 4.5:1) | Pass (large type) | **Pass AA** |
| **Muted Text (`#788A9D`)** | Surface Panel (`#0E1512`) | **5.35 : 1** | Pass (req. 4.5:1) | Pass (large type) | **Pass AA** |
| **Canvas Background (`#070A09`)** | Primary Button Fill (`#6EE7A0`) | **12.68 : 1** | Pass (req. 4.5:1) | Pass (req. 7.0:1) | **Optimal AAA** |

### 3.2 Non-Text Contrast Compliance
- **Structural borders (`#1A2820`, `#22382B`)**: Intentionally low-contrast dividers designed to avoid visual noise. In accordance with WCAG 1.4.11 (Non-text Contrast), borders are **never** the sole visual indicator of interactive focus or selection state. Focus indicators employ a 2px solid `#6EE7A0` ring with a 2px offset (`outline-dev-accent`).

---

## 4. Typography System

The typography architecture uses a dual-engine font stack optimized for rapid local rendering, zero external font-service latency, and seamless graceful degradation across client operating systems.

### 4.1 Font Stacks

```css
--dev-font-display: "Space Grotesk", "Geist Sans", Inter, Arial, Helvetica, sans-serif;
--dev-font-sans: "Space Grotesk", "Geist Sans", Inter, Arial, Helvetica, sans-serif;
--dev-font-mono: "JetBrains Mono", "Geist Mono", Consolas, "Courier New", monospace;
```

1. **Display & Headings (`font-display` / `font-sans`)**:
   - **Lead Family**: **Space Grotesk**
   - **Role**: Hero title, editorial chapter indices (`01`, `02`), section headlines, prominent metrics, modal headers.
   - **Characteristics**: Geometric sans-serif with idiosyncratic technical incisions, wide aperture, and commanding editorial presence.
2. **Code, System & Telemetry (`font-mono`)**:
   - **Lead Family**: **JetBrains Mono**
   - **Role**: Subtitles, status pill text, terminal commands, architecture node labels, timestamps, skill categories, metric units.
   - **Characteristics**: Crisp programmer monospace with high x-height, distinct character distinction (0 vs O, 1 vs l), and engineered tabular alignment.

### 4.2 Typographic Hierarchy & Scale

| Level | Size (Mobile) | Size (Desktop) | Weight | Line Height | Tracking | Applied Utility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `36px` (`text-4xl`) | `72px` (`text-7xl`) | 700 (Bold) | `1.05` | `-0.03em` | `font-display font-bold tracking-tight text-dev-text` |
| **Chapter Title** | `28px` (`text-3xl`) | `48px` (`text-5xl`) | 600 (Semibold) | `1.15` | `-0.02em` | `font-display font-semibold tracking-tight text-dev-text` |
| **Section Header** | `20px` (`text-xl`) | `30px` (`text-3xl`) | 600 (Semibold) | `1.25` | `-0.01em` | `font-display font-semibold text-dev-text` |
| **Card Header** | `18px` (`text-lg`) | `20px` (`text-xl`) | 600 (Semibold) | `1.30` | `0` | `font-sans font-semibold text-dev-text` |
| **Body Standard** | `15px` (`text-sm`) | `16px` (`text-base`) | 400 (Regular) | `1.60` | `0` | `font-sans text-dev-secondary` |
| **Monospace Eyebrow** | `11px` (`text-xs`) | `12px` (`text-xs`) | 500 (Medium) | `1.40` | `0.20em` | `font-mono uppercase tracking-[0.2em] text-dev-accent` |
| **Telemetry / Data** | `12px` (`text-xs`) | `13px` (`text-sm`) | 400 (Regular) | `1.45` | `0.05em` | `font-mono text-dev-secondary` |

---

## 5. Zero-Distortion Liquid Shader Architectural Rule

A cornerstone of the Phase 6 art direction is the **Strict Zero-Distortion Rule** governing WebGL fluid and liquid shaders:

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 3: Interactive Overlays & Modals       [z-index: 50+] │
│  - Command Palette, Dialogs, Skip Intro                      │
├──────────────────────────────────────────────────────────────┤
│  LAYER 2: Semantic Editorial DOM Content      [z-index: 10+] │
│  - Typography (h1..h5, p), CTAs, CV data, Nav                │
│  - Crisp, selectable, 100% distortion-free                   │
├──────────────────────────────────────────────────────────────┤
│  LAYER 1: Procedural 3D Stage (Laptop)         [z-index: 5]  │
│  - WebGL Canvas: isolated bounded canvas                     │
├──────────────────────────────────────────────────────────────┤
│  LAYER 0: Ambient Liquid Backdrop Quad         [z-index: 0]  │
│  - Slow viscous fluid domain-warped noise                    │
│  - Color bounds: #070A09 -> #0E1512 -> #121A16               │
└──────────────────────────────────────────────────────────────┘
```

### 5.1 Mandate & Constraints
1. **Background Isolation (`z-index: 0`)**: The liquid shader quad (`LiquidBackdrop` / `LiquidShaderCanvas`) renders strictly behind all DOM elements in an absolute background canvas with `pointer-events: none`.
2. **Zero Text Distortion**: Under NO circumstances may fragment shaders, post-processing passes, chromatic aberration, fluid displacement vectors, or barrel warp affect the DOM reading surface. Text, buttons, links, and CV data must remain standard browser-rendered HTML elements with flawless pixel sharpness and native OS text selection.
3. **Viscous Domain Warping Palette**: The fluid shader generates slow, gentle fractal Brownian motion (`fbm`) domain warping restricted to deep obsidian blacks and dark emeralds:
   - Base Color: `#070A09` (rgb: `0.027, 0.039, 0.035`)
   - Mid Color: `#0E1512` (rgb: `0.055, 0.082, 0.071`)
   - High Peak Glow: `#121A16` with restrained `#39FF88` bioluminescent highlights (max alpha 0.08).
4. **Instant Fallback**: When `prefers-reduced-motion: reduce` is enabled or WebGL is unsupported, the shader canvas is completely unmounted and replaced with a static CSS mesh radial gradient:
   ```css
   background: radial-gradient(circle at 50% 30%, rgb(18 26 22 / 0.6) 0%, rgb(7 10 9) 70%);
   ```

---

## 6. Motion & Reduced-Motion Contracts

All motion adheres to the physics of high-performance developer tools: instantaneous tactile feedback, crisp exponential reveals, and absolute deference to user accessibility preferences.

### 6.1 Standard Motion Durations
- **Fast / Micro-feedback (`--dev-duration-fast: 120ms`)**: Button hover states, tag highlights, tab focus shifts.
- **Standard / Panel Transition (`--dev-duration-standard: 180ms`)**: Dropdown reveals, badge toggle, dialog presence.
- **Reveal / Scroll Storytelling (`--dev-duration-reveal: 320ms`)**: Sticky chapter card entrances, narrative step transitions.

### 6.2 Reduced Motion Fallback (`prefers-reduced-motion: reduce`)
When active:
- CSS duration tokens drop to `0ms`.
- Fluid WebGL render loop halts immediately (`frameloop="never"` or canvas unmounted).
- Laptop lid procedural rotation snaps directly to its final open state (`openProgress = 1.0`).
- Sticky scroll transforms collapse into standard sequential block flow with zero scroll-jacking.

---

## 7. Responsive Breakpoint Standards

Layouts adapt gracefully across all device form factors with strict testing down to **320px width**:

| Breakpoint | Viewport Width | Device Target | Layout Strategy |
| :--- | :--- | :--- | :--- |
| **`xs`** | `320px` – `479px` | Ultra-compact phones (iPhone SE, etc.) | Single-column stacked cards, full-width touch targets (min 44px height), padded gutters (16px) |
| **`sm`** | `480px` – `639px` | Standard mobile devices | Single-column with inline metric chips |
| **`md`** | `640px` – `767px` | Large phones / small tablets | 2-column grid for skill categories and timeline items |
| **`lg`** | `768px` – `1023px` | Tablets & iPad portrait | 2-column with sticky progress indicator |
| **`xl`** | `1024px` – `1279px` | Laptops / Desktop standard | 3-column skill universe, side-by-side timeline and interactive stage |
| **`2xl`** | `1280px+` | Wide monitors / Retina displays | Constrained `max-w-7xl` container with balanced margins and editorial breathing room |
