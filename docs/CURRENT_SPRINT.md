# Current Sprint: Design System Refactor & Layer 1 Stabilization

## Active Sprint Status
- **Current Phase**: Layer 1 — Complete Light Theme Realignment & Verification (Steps 0–6)
- **Status**: 100% Complete & Verified (13/13 pages, 0 JS errors, 0 legacy CSS residue, 44 offline assets synced)
- **Next Milestone**: Final review and sign-off of design system realignment

---

## 1. Objectives & Deliverables

- [x] **Milestone 1: Project Memory & Architecture Context**
  - [x] Create `./docs/PROJECT_OVERVIEW.md` (Domain scope, tool registry, tech stack)
  - [x] Create `./docs/SYSTEM_ARCHITECTURE.md` (Architecture, dataflow, export engines, service worker)
  - [x] Create `./docs/TOOLS_REFERENCE.md` (Engineering formulas, IS/NBC standards, math models)
  - [x] Create `./docs/CODING_STANDARDS.md` (Coding conventions, validation, safety, offline protocols)
  - [x] Create `DESIGN.md` (Design system, typography, color palettes, component library)
  - [x] Create `README.md` (Repository documentation)
  - [x] Create `.gitignore` (Standard web ignores)

- [x] **Milestone 2: Git Repository Initialization**
  - [x] Initialize Git repository (`git init`)
  - [x] Stage files and create initial commit on `main` / `development`

- [x] **Milestone 3: Comprehensive Repository Audit**
  - [x] Static AST & Node VM script analysis across all 13 HTML files
  - [x] Identification & root cause diagnosis of the 7 P0 JavaScript syntax errors
  - [x] Generate comprehensive audit report in [`docs/REPOSITORY_AUDIT.md`](./REPOSITORY_AUDIT.md)

- [x] **Milestone 4: Design System (Light Theme Only per `DESIGN.md`)**
  - [x] Create canonical `css/tokens.css` (Pure black `#000000`, ink `#171717`, canvas `#ffffff`, sky wash `#cfe7ff`, typography & spacing scale)
  - [x] Create canonical `css/base.css` (Clean reset, Inter/mono typography, `:focus-visible` accessibility)
  - [x] Create canonical `css/components.css` (Navbars, buttons, form controls, cards, KPI boxes, scrollable tables, badges)
  - [x] Create canonical `css/utilities.css` (Layout helpers, `@media print`, `@media (prefers-reduced-motion)`)
  - [x] Link all 4 CSS files across `index.html` and all 12 calculator pages
  - [x] Update `sw.js` pre-cache manifest with `css/*.css` and bump version to `aepl-phe-v2.1`

- [x] **Milestone 5: Layer 1 Stabilization & Baseline Recovery**
  - [x] Fix all 7 P0 fatal script crashes from PWA meta/script injection in template strings:
    - `AI_DM_Plant_Platform.html`
    - `NBCS_2026_Drainage_Calculator.html`
    - `NBCS_2026_Pipe_Size_Calculator.html`
    - `STP_Design_Calculator.html`
    - `Water_Softener_Plant_Designer.html`
    - `firefighting_calculator.html`
    - `pump-head-calculator.html`
  - [x] Fix missing parameter bug in `AI_DM_Plant_Platform.html` (`drawForecast`)
  - [x] Verify complete test suite with Playwright: **13/13 pages SUCCESS, 0 JS errors**

- [x] **Milestone 6: Step 0 — DESIGN.md Verification & Baseline Capture**
  - [x] Line-by-line audit of `DESIGN.md` canonical token registry
  - [x] Baseline screenshot and error capture across all 13 pages (13/13 PASS, 0 errors)
  - [x] Finalize `docs/DESIGN_SYSTEM_REALIGNMENT_PLAN.md`

- [x] **Milestone 7: Step 1 — Foundation Layer**
  - [x] Authoritative `css/tokens.css` and `css/base.css` (warm paper canvas `#fffdf9`, Inter single-font scale)

- [x] **Milestone 8: Step 2 — Shell & Navigation**
  - [x] Authoritative `css/app.css` (`.aet-nav` background `#ffffff`, hairline border `#f0f0f0`, sienna brand mark `#451a03`)
  - [x] Standardized 6-file cascade order across all 13 HTML entry points

- [x] **Milestone 9: Step 3 — Shared CSS Primitives Harmonization (components.css)**
  - [x] Update `css/components.css` with 9999px pill buttons, 12px cards, 8px inputs, KPI boxes, data tables, and badges
  - [x] Remove `.aet-nav` from `components.css` to grant single ownership to `app.css` (`navBg: #ffffff`)
  - [x] Preserve all JavaScript hooks, state classes (`active`, `hidden`, etc.), and domain-specific styling
  - [x] Verify complete test suite with Playwright: **13/13 pages SUCCESS, 0 JS errors**

- [x] **Milestone 10: Step 4 — Page Stylesheet Purification (css/pages/*.css)**
  - [x] **Batch A Completed & Verified**:
    - `css/pages/index.css`: Purified portal hero metrics, stats cards, about/contact panels, and PWA install banner.
    - `css/pages/NBC2026_Water_Demand_Calculator_v2.css`: Purified header, LPCD breakdown, storage options, tab bar, category badges, and multi-block selectors.
    - `css/pages/NBCS_2026_Drainage_Calculator.css`: Purified header, sub-navigation pill buttons, fixture calculation panels, total bars, and export controls.
    - `css/pages/NBCS_2026_Pipe_Size_Calculator.css`: Purified header, tab buttons, fixture calculation tables, summary bars, sizing comparison matrix, and calculation action buttons.
  - [x] **Batch B Completed & Verified**:
    - `css/pages/pump-head-calculator.css`: Purified layout and controls while preserving exact Chart.js canvas sizing (`542px × 380px`), KPI row, and TDH calculation outputs.
    - `css/pages/firefighting_calculator.css`: Purified project card, tabs, and layout while preserving NBC Part IV risk matrix, occupancy dropdowns, and calculation logic.
    - `css/pages/heat_pump_sizing_tool.css`: Purified warm palette and controls while preserving thermodynamic chartbox (`361px × 296px`), COP KPIs (`849 kW`), and calculation tables.
    - `css/pages/Storm_Sump_Design_Tool.css`: Purified sections and toolbars while preserving Rational Method calculation cards (`2,736 LPM`, `18.1 m`), collapsible sections, and status indicators.
  - [x] **Batch C Completed & Verified**:
    - `css/pages/STP_Design_Calculator.css`: Purified 6 biological treatment units, process diagrams, and KPI rows.
    - `css/pages/RO_Plant_Sizing_Calculator.css`: Purified multi-stage membrane flow diagram, hospital department tabs, and comparison cards.
    - `css/pages/AI_DM_Plant_Platform.css`: Purified AI sidebar, chat layout, train pipeline step diagram, and SVG schematic. Added `min-width: 0` for responsive safety.
    - `css/pages/Water_Softener_Plant_Designer.css`: Purified resin bed visualizer, specs table, and preserved 3D viewport `#threeD canvas` (`724px × 438px`).
    - `css/pages/Water_Treatment_Plant_Designer.css`: Purified clarifier controls and preserved Three.js 3D canvas `#three-canvas` (`577px × 420px`) and `#pfd-canvas` / `#pid-canvas`.

- [x] **Milestone 11: Step 5 — Offline Service Worker Cache Synchronization (`sw.js`)**
  - [x] Updated `sw.js` cache manifest with all 18 CSS files (`tokens`, `base`, `app`, `components`, `utilities`, and all 13 `css/pages/*.css`)
  - [x] Bumped cache identifier to `aepl-phe-v2.2`
  - [x] Verified all 44 offline asset URLs exist in filesystem

- [x] **Milestone 12: Step 6 — Final Full-Suite Verification & Residue Audit**
  - [x] 0 dark mode media queries in CSS
  - [x] 0 legacy color variables (`--navy-*`, `--paper-*`, etc.)
  - [x] Exact 6-file cascade order across 13/13 HTML entry points
  - [x] 0 unextracted `<head>` `<style>` tags
  - [x] Automated Playwright test run: **13/13 pages SUCCESS, 0 JS errors** (`screenshots/2026-09-30_23-04-28/`)

---

## 2. Active Context Notes
- **Workspace**: `/media/shared/Code/AEPL_HTML_PHE/atomenteam_website`
- **Total Standalone Tools**: 12 engineering calculators + 1 main portal hub (`index.html`)
- **Audit Deliverable**: [`docs/REPOSITORY_AUDIT.md`](./REPOSITORY_AUDIT.md)
- **Latest Screenshot Verification**: `screenshots/2026-09-30_23-04-28/screenshot-report.txt` (13/13 PASS)
