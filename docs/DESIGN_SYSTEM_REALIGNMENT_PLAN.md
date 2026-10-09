# Atomep Enteam — Design System Realignment & CSS Architecture Implementation Plan (Final)

> **Scope**: Implementation Plan (Planning Phase — Finalized with Full Conformance & Audit Framework)  
> **Authoritative Specification**: `DESIGN.md` (Campsite / Warm Paper Workspace — Light Theme Only)  
> **Architectural Roadmap Context**: `docs/AtomepEnteam _Future_Architecture_&_Refactoring_Roadmap.md`  
> **Status**: Ready for Step 0 Execution

---

## 1. Executive Summary

This implementation plan defines the surgical, risk-managed process for bringing the Atomep Enteam engineering calculation platform into complete visual and structural alignment with `DESIGN.md` (Warm Paper Workspace / Campsite aesthetic — Light Theme Only) while guaranteeing **100% preservation of all fluid mechanics equations, mathematical models, NBC/IS lookup tables, calculation outputs, and JavaScript runtime interactions** across all 13 HTML entry points.

The plan establishes:
* **Step 0 Verification Gate**: An explicit initial phase to audit `DESIGN.md` line-by-line, extract verified canonical tokens, and establish a baseline before modifying code.
* **Shared CSS Primitives (Not Premature React Components)**: Lightweight, consistent visual primitives in vanilla CSS without designing premature component abstractions.
* **Strict DOM & JavaScript Semantic Invariance**: Hard constraints preventing class renaming, ID removal, DOM hierarchy modifications, or state class alteration.
* **Two-Tier Validation Framework**: Separates **Functional Regression** (identical calculations, outputs, and DOM state) from **Design Conformance** (visual review against `DESIGN.md`).
* **Comprehensive Computed-Style Conformance Suite**: Comprehensive browser-applied style assertions across 14+ design dimensions.
* **Automated Legacy Residue Audit**: Machine-readable post-migration scans to ensure obsolete declarations, gradients, and dark themes do not linger underneath the cascade.
* **Nuanced Variable Classification**: Pruning dead variables while safely preserving legitimate page-specific engineering constants.
* **Safe "Replace $\rightarrow$ Verify $\rightarrow$ Remove" Migration Protocol**: Eliminates mass-deletion in favor of verified incremental refactoring.
* **Deferred Offline Service Worker Updates**: Stages `sw.js` cache synchronization after CSS stability is established.

---

## 2. Core Architectural Philosophy & Scope Boundaries

```text
CURRENT VANILLA CSS PHASE
─────────────────────────────────────────────────────────────────
• Authoritative DESIGN.md Tokens (tokens.css)
• Base Reset & Typography (base.css)
• Application Shell & Navigation (app.css)
• Shared CSS Primitives (components.css — cards, inputs, tables, KPIs)
• Utility Helpers & Print Rules (utilities.css)
• Purified Engineering Page Styles (pages/*.css)
• Strict DOM & JavaScript Behavior Preservation

FUTURE ROADMAP LAYERS (Separate Phases)
─────────────────────────────────────────────────────────────────
• Domain Logic Extraction (Pure calculation JS modules)
• State Management & Event Orchestration
• React Component Architecture & React Native Portability
```

### Architectural Principle: Same Appearance $\neq$ Same Responsibility
A specialized engineering calculation result panel or schematic container may visually resemble a generic card, but must not be forced into `.card` if it possesses unique layout rules or calculation-specific behaviors.

---

## 3. Strict Semantic & Engineering Safety Rules

To prevent accidental breakage of calculation engines, event handlers, and DOM bindings, the implementation strictly enforces the following **Hard Constraints**:

1. **Class Name Invariance**: DO NOT rename, remove, or alter class names targeted by JavaScript (`document.querySelector`, `getElementsByClassName`, `.classList.toggle`).
2. **ID Preservation**: DO NOT remove, rename, or reassign any HTML `id=""` attribute.
3. **Data Attribute Invariance**: DO NOT alter or remove `data-*` attributes used for calculation lookups, state tracking, or export generation.
4. **DOM Hierarchy Preservation**: DO NOT change parent-child DOM nesting, form control hierarchies, or table row/cell structures unless explicitly required for accessibility.
5. **Element Type Invariance**: DO NOT convert `<button>` to `<a>` or `<div>` to `<button>` where event handlers (`onclick`, `addEventListener`) are attached.
6. **Script-Generated Markup Safety**: Any DOM structures created dynamically by JavaScript functions (e.g. `renderTable()`, `drawDiagram()`) must retain their expected CSS selectors.
7. **Calculation & Lookup Integrity**: Zero changes to formulas, fluid mechanics equations, stoichiometry constants, and lookup tables.

---

## 4. Current vs Target CSS Architecture Map

```text
                    DESIGN.md (Authoritative Source)
                                   │
                                   ▼
                            css/tokens.css
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
              css/base.css                  css/app.css
             (Reset & Fonts)             (Minimalist Shell)
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                          css/components.css
                        (Shared CSS Primitives)
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            css/utilities.css              css/pages/*.css
           (Grid, Flex, Print)        (Domain Engineering Styles)
                                                  │
                                                  ▼
                                         13 HTML Entry Points
```

### 4.1 Layer Responsibilities & Boundaries

| Layer | Responsibility | What it Contains | What it Must NOT Contain |
| :--- | :--- | :--- | :--- |
| `css/tokens.css` | Design Tokens | `:root` custom properties for colors, typography, spacing, radii, shadows, layout. | Selectors, element styles, media queries. |
| `css/base.css` | Global Foundation | Box-sizing reset, `body` background (`#fffdf9`), Inter typography defaults, `:focus-visible` accessibility. | Components, layout wrappers, page overrides. |
| `css/app.css` | Application Shell | Top application bar (`.aet-nav`), logo mark, navigation links, mobile drawer toggle, back button (`.aet-back`). | Calculator form inputs, KPI result panels, tables. |
| `css/components.css`| Shared CSS Primitives | Genuinely reusable primitives: pill buttons, form inputs, 12px cards, KPI result boxes, data tables, badges. | Complex engineering schematics, Three.js canvases, pipe slope diagrams. |
| `css/utilities.css` | Utility Helpers | Layout containers (`1200px`), flex/grid helpers, `@media (prefers-reduced-motion)`, `@media print`. | Color utility classes, typography classes. |
| `css/pages/index.css`| Portal Page Only | Hub-specific tool category tabs, hero layout, search/filter presentation. | Global site-level styles or reusable primitives. |
| `css/pages/<calc>.css`| Engineering Domain | SVG process flows, Three.js 3D canvas wrappers, Chart.js curve containers, calculation layouts. | Redundant `:root` blocks, dark mode themes, duplicate generic resets. |

---

## 5. Design Token Verification & Migration Plan

### 5.1 Step 0: Line-by-Line `DESIGN.md` Audit
Before modifying `tokens.css`, an exhaustive line-by-line audit of the root `DESIGN.md` will be performed to generate a verified token registry.

### 5.2 Canonical Token Registry (From `DESIGN.md`)

```css
:root {
  /* Surfaces (Warm Paper Workspace — Light Theme Only) */
  --color-warm-canvas: #fffdf9;      /* Level 0: Base Page Background */
  --color-pure-white: #ffffff;       /* Level 1: Elevated Cards & Panels */
  --color-ash-mist: #f5f5f5;         /* Level 2: Nested Content & Input Backgrounds */
  --color-soft-fog: #f0f0f0;         /* Level 3: Dividers, Inactive Fills, Borders */
  --color-charcoal-card: #1e1e1e;    /* Featured Mockup Surface */

  /* Ink & Typography */
  --color-ink: #171717;              /* Primary Text, Headings, Icons */
  --color-graphite: #525252;         /* Secondary Text, Metadata */
  --color-steel: #737373;            /* Tertiary Text, Timestamps, Labels */
  --color-silver: #a3a3a3;           /* Muted Text, Placeholders */

  /* Functional Punctuation (Rationed <2% of UI) */
  --color-resolve-green: #22c55e;    /* Resolved Actions, Completion Badges */
  --color-highlight-wash: #fef3c7;   /* Warning/Highlight Callout Background */
  --color-sienna-brand: #451a03;     /* Decorative Brand Mark Accent */
  --color-alert-red: #ef4444;        /* Destructive / Error Accent */

  /* Typography Fallback Policy:
     Inter is the canonical UI font; the declared fallback stack is permitted
     only for environments where Inter is unavailable. */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Type Scale & Metrics */
  --text-caption: 11px;       --leading-caption: 1.4;
  --text-body: 15px;          --leading-body: 1.56;       --tracking-body: -0.27px;
  --text-body-lg: 18px;       --leading-body-lg: 1.63;
  --text-subheading: 22px;    --leading-subheading: 1.4;
  --text-heading: 29px;       --leading-heading: 1.33;    --tracking-heading: -0.52px;
  --text-display: 58px;       --leading-display: 1.2;     --tracking-display: -1.8px;

  /* 4px Base Spacing Grid */
  --spacing-4: 4px;   --spacing-8: 8px;   --spacing-12: 12px;  --spacing-16: 16px;
  --spacing-20: 20px; --spacing-24: 24px; --spacing-32: 32px;  --spacing-48: 48px;
  --spacing-64: 64px; --spacing-80: 80px; --spacing-96: 96px;  --spacing-160: 160px;

  /* Border Radii */
  --radius-buttons: 9999px;
  --radius-tags: 9999px;
  --radius-full: 9999px;
  --radius-cards: 12px;
  --radius-inputs: 8px;
  --radius-images: 8px;
  --radius-md: 4px;

  /* Multi-Layered Low-Opacity Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px, rgba(0, 0, 0, 0.05) 0px 1px 1px -1px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1px 0px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.32) 0px 0.5px 0px 0px inset;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
}
```

---

## 6. Cascade, Specificity & Pragmatic `!important` Policy

### 6.1 Stylesheet Loading Order in `<head>`
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/app.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/utilities.css">
<link rel="stylesheet" href="css/pages/<page>.css">
```

### 6.2 Pragmatic Cascade Layers (@layer) Policy
* **Evaluation**: Evaluate CSS Cascade Layers (`@layer`) during implementation.
* **Adoption Criterion**: Introduce `@layer` **only** if it demonstrably simplifies specificity overrides without adding unnecessary abstraction or migration risk to the 6-file cascade.

### 6.3 Pragmatic `!important` Handling
* Remove `!important` where cascade restructuring and stylesheet ordering make it redundant.
* Retain `!important` **only** where required to preserve intentional runtime behavior (e.g. `.hidden`, `@media print`), with each retained instance documented.

---

## 7. Nuanced Variable Classification & "Replace $\rightarrow$ Verify $\rightarrow$ Remove"

### 7.1 Page-Level Variable Classification Tree

```text
Page-Level Variable
 ├── Global Design Token? ────────► Move to css/tokens.css
 ├── Shared UI Primitive? ────────► Move to css/components.css
 ├── Engineering Constant in CSS? ─► Retain locally in css/pages/<page>.css
 └── Dead / Legacy Variable? ─────► Safely remove after verification
```

### 7.2 Six-Step Refactoring Loop
1. **Inventory**: Inspect the page CSS and classify every selector and variable.
2. **Map**: Align with `DESIGN.md` tokens or shared primitives.
3. **Apply**: Update the stylesheet to consume canonical variables.
4. **Test**: Run Playwright headless browser check to confirm 0 JS errors and calculation correctness.
5. **Prune**: Remove obsolete legacy declarations only after functional and visual confirmation.
6. **Commit**: Save the milestone atomically.

---

## 8. Page-by-Page Visual Inventory & Migration Plan

Before modifying any page stylesheet, a **10-Point Visual Inventory** is completed:

```text
Page Visual Inventory Structure:
 ├── 1. App Shell & Navigation
 ├── 2. Header & Title Hierarchy
 ├── 3. Form Input Controls & Parameter Sliders
 ├── 4. Action Buttons & Export Download Bars
 ├── 5. Content Cards & Calculation Panels
 ├── 6. KPI Result Cards & Tabular Numbers
 ├── 7. Data Tables & Scroll Wrappers
 ├── 8. Engineering Schematics & Diagrams (SVG/Canvas/Three.js)
 ├── 9. Status Badges & Callout Alerts
 └── 10. Responsive Behavior & Print Layout
```

### 8.1 13-Page Migration Matrix

| Page | Primary Risk Area | Shared Primitives to Consume | Domain-Specific Styles to Retain | Functional Verification Target |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | Card grid & install banner | `.aet-nav`, `.card`, `.badge-pill` | Category filter tabs, tool search layout | Tool card links and filter switching |
| `AI_DM_Plant_Platform.html` | Chat panel & train schematic | `.card`, `.field`, `.result-card`, `.data-table` | AI chat layout, ion exchange sequence diagram (`.pipeline__step`) | Chat input state, dynamic DM calculation |
| `NBC2026_Water_Demand_Calculator_v2.html` | LPCD dynamic grid | `.aet-nav`, `.aet-back`, `.card`, `.field`, `.data-table` | Occupancy breakdown grid, LPCD banner | Occupancy input updates total water demand |
| `NBCS_2026_Drainage_Calculator.html` | Hydraulic slope profile | `.card`, `.field`, `.result-card`, `.table-scroll` | Manning's formula diagram, slope summary banner | Fixture unit sum and pipe velocity output |
| `NBCS_2026_Pipe_Size_Calculator.html` | Friction loss matrix | `.card`, `.field`, `.result-card`, `.table-scroll` | Hazen-Williams friction curve layout | Fixture unit to flow conversion and sizing |
| `RO_Plant_Sizing_Calculator.html` | Membrane staging SVG flow | `.card`, `.field`, `.result-card`, `.kpi-row`, `.data-table` | Multi-stage RO membrane flow schematic, flux meters | 2-stage recovery calculation and SVG update |
| `STP_Design_Calculator.html` | 6 treatment unit flowcharts | `.card`, `.input-panel`, `.result-card`, `.kpi-row`, `.data-table` | Biological treatment process flow, aeration tank schematic | 6 treatment modules (Grit, Screen, Aeration, Clarifier, Sludge, Disinfection) |
| `Storm_Sump_Design_Tool.html` | Wet well SVG visualizer | `.card`, `.field`, `.result-card`, `.kpi-row`, `.data-table` | Dual pump sump cross-section schematic, level triggers | Rainfall intensity input and pump sizing |
| `Water_Softener_Plant_Designer.html` | Resin bed visualizer | `.card`, `.field`, `.result-card`, `.table-scroll` | Brine tank & ion exchange resin graphic | Hardness parameter calculation and salt dosing |
| `Water_Treatment_Plant_Designer.html` | WebGL Three.js canvas | `.card`, `.field`, `.result-card`, `.data-table` | `#three-canvas` WebGL container, clarifier visualizer | Three.js 3D tank rendering and chemical dosing |
| `firefighting_calculator.html` | NBC Part 4 risk tables | `.aet-nav`, `.aet-back`, `.card`, `.field`, `.result-card` | Hazard classification layout, fire pump summary | Building type classification and pump flow |
| `heat_pump_sizing_tool.html` | Thermodynamics COP curve | `.card`, `.field`, `.result-card`, `.kpi-row` | Hot water storage visualizer, COP curve layout | Heating capacity (kW) and COP calculations |
| `pump-head-calculator.html` | Dynamic Chart.js curve | `.card`, `.field`, `.result-card`, `.kpi-row`, `.data-table` | Chart.js curve canvas (`#pumpCurveChart`), fitting matrix | Dynamic static head, friction head, Chart.js re-render |

---

## 9. Comprehensive Conformance & Legacy Residue Audit

### 9.1 Two-Tier Verification Framework (Baseline $\neq$ Target)

```text
TWO-TIER VERIFICATION
├── 1. FUNCTIONAL REGRESSION TESTING (Automated Pass/Fail)
│   ├── Automated Playwright test suite execution
│   ├── Zero uncaught JavaScript errors or console exceptions
│   ├── Input event triggers produce exact numerical outputs
│   └── Table calculations, export buttons, and tab toggles function identically
│
└── 2. DESIGN CONFORMANCE REVIEW (Visual & Computed-Style Inspection)
    ├── Does the page conform to DESIGN.md Warm Canvas (#fffdf9) & Ink (#171717)?
    ├── Are interactive buttons 9999px pill-shaped?
    ├── Are cards 12px radius with hairline borders (#f0f0f0) and subtle shadows?
    └── Are engineering schematics clearly legible and unclipped?
```

### 9.2 Expanded Computed-Style Conformance Suite
The automated test runner will assert browser-computed CSS properties across all 13 pages:
1. `document.body` $\rightarrow$ `background-color: rgb(255, 253, 249)` (`#fffdf9`)
2. `document.body` $\rightarrow$ `color: rgb(23, 23, 23)` (`#171717`)
3. `document.body` $\rightarrow$ `font-family` starts with `'Inter'` (or permitted system fallback)
4. `h1, h2, h3` $\rightarrow$ `color: rgb(23, 23, 23)`, `font-family` starts with `'Inter'`
5. `.btn-primary` $\rightarrow$ `border-radius: 9999px`, background `#171717` or `#22c55e`, text `#ffffff` or `#171717`
6. `input[type="number"], input[type="text"], select` $\rightarrow$ `border-radius: 8px`, `background-color: rgb(245, 245, 245)` or `rgb(255, 255, 255)`
7. `.card` $\rightarrow$ `border-radius: 12px`, `background-color: rgb(255, 255, 255)`, `border-color: rgb(240, 240, 240)`
8. `.aet-nav` $\rightarrow$ `background-color: rgb(255, 255, 255)`, `background-image: none`
9. `:focus-visible` $\rightarrow$ 2px solid outline present on interactive focus
10. Absence of legacy Google Fonts `<link>` tags in `<head>`
11. Presence of all 6 expected stylesheets linked in exact canonical cascade order

### 9.3 Machine-Readable Legacy Residue Audit
A dedicated automated script will scan the codebase post-migration to confirm zero legacy residue:

```text
LEGACY RESIDUE AUDIT
 ├── Old Color Literals (Hex values outside DESIGN.md palette)
 ├── Old CSS Custom Properties (--bg, --pri, --sec, --navy-900, etc.)
 ├── Dark-Mode Media Queries (@media (prefers-color-scheme: dark))
 ├── Legacy Font Families ('DM Sans', 'IBM Plex', 'Segoe UI', 'Courier New', 'Instrument Serif')
 ├── Unwanted Gradients (linear-gradient headers, gradient result cards)
 ├── Duplicate Component Selectors
 ├── Unclassified Page-Level :root Blocks
 ├── Obsolete Button/Card Definitions
 ├── Unnecessary !important Declarations
 └── External Font References in HTML or CSS
```

---

## 10. Service Worker / Offline Staging Strategy

To prevent active development from being obstructed by stale cached stylesheets:
1. **During Active CSS Migration**: Do NOT modify `sw.js` while tokens and page styles are shifting.
2. **After Complete CSS Verification**:
   - Collect the final canonical CSS file list (`tokens.css`, `base.css`, `app.css`, `components.css`, `utilities.css`, `pages/*.css`).
   - Update `OFFLINE_URLS` in `sw.js`.
   - Bump cache version to `aepl-phe-v2.2`.
   - Verify offline standalone execution via headless Chromium with network disabled.

---

## 11. Step-by-Step Implementation Sequence

```text
Step 0: Verification Baseline & DESIGN.md Audit (Current Milestone)
  ├── Line-by-line audit of DESIGN.md → Build canonical token registry
  ├── Establish Playwright baseline tests across 13 pages
  └── Present Step 0 findings for review before any CSS edits
        ↓
Step 1: Foundation Layer Realignment
  ├── Update css/tokens.css with verified DESIGN.md variables
  └── Update css/base.css (Reset, Inter typography, :focus-visible rings)
        ↓
Step 2: Shell & Navigation Modernization
  ├── Update css/app.css (.aet-nav, .aet-logo, .aet-back)
  └── Clean <head> stylesheet links across all 13 HTML files
        ↓
Step 3: Shared CSS Primitives Harmonization
  └── Update css/components.css (Pill buttons, cards, form fields, tables, KPIs)
        ↓
Step 4: Progressive Page-by-Page Migration (Replace → Verify → Remove)
  ├── Batch A (Standard Forms): NBC2026_Water_Demand, Drainage, Pipe Size, index.html
  ├── Batch B (Complex Layouts): pump-head, firefighting, heat_pump, Storm_Sump
  └── Batch C (Process Schematics): STP, RO_Plant, AI_DM_Plant, Softener, Treatment
        ↓
Step 5: Offline Service Worker Cache Sync
  ├── Update sw.js manifest with all CSS paths
  └── Bump cache name to aepl-phe-v2.2
        ↓
Step 6: Final Two-Tier Verification & Legacy Residue Audit
  ├── Run automated Playwright functional test suite (0 JS errors)
  ├── Run 11-point computed-style conformance suite
  ├── Execute Legacy Residue Audit scan
  └── Capture full-page screenshot set for design conformance sign-off
```

---

## 12. Definition of Done

1. ✅ `DESIGN.md` audited line-by-line; `css/tokens.css` matches verified variables.
2. ✅ `css/base.css` enforces warm canvas background (`#fffdf9`), Ink (`#171717`), and Inter typography.
3. ✅ `css/app.css` renders a clean, minimalist navigation shell with ink brand mark and ghost back button.
4. ✅ `css/components.css` houses shared visual primitives without premature React abstractions.
5. ✅ All 13 page stylesheets in `css/pages/*.css` purified using the *Replace $\rightarrow$ Verify $\rightarrow$ Remove* cycle.
6. ✅ All JavaScript hooks, class names, IDs, data attributes, and DOM structures 100% preserved.
7. ✅ All mathematical calculations and engineering formulas 100% verified and unchanged.
8. ✅ `sw.js` offline cache updated to `aepl-phe-v2.2` and verified offline.
9. ✅ Playwright automated suite passes **13/13 pages with 0 JS errors**.
10. ✅ Expanded computed-style conformance suite passes across all 13 pages.
11. ✅ Machine-readable legacy residue audit passes with 0 unexpected legacy remnants.

---

## Recommended Next Step

Upon your confirmation, we will execute **Step 0**:
1. Perform the line-by-line audit of `DESIGN.md` to establish the exact canonical token inventory.
2. Capture the baseline test and screenshot snapshot across all 13 pages.
3. Present the Step 0 findings for your review before touching `tokens.css` or `base.css`.
