# System Architecture: Atomep Enteam PHE Calculation Platform

## 1. Architectural Philosophy
The Atomep Enteam engineering suite is built as a **Distributed Single-File Application (SFA)** architecture. Each calculation tool is a self-contained, zero-dependency HTML5 application with embedded styling, domain math logic, DOM event listeners, and export drivers, linked to unified offline vendor assets and a central service worker.

### Core Architectural Pillars
1. **Zero Server Dependency**: 100% of mathematical computation, fluid hydraulic equations, unit conversions, report compiling, and file serialization occurs on the client runtime (V8 / JavaScript engine).
2. **Offline-First PWA**: PWA Service Worker (`sw.js`) intercepts network requests using a cache-first strategy.
3. **Data Sovereignty & Privacy**: No project metrics, hospital flow rates, or proprietary plant dimensions are transmitted over the wire.
4. **Instant Reactive Feedback**: Inputs trigger live recalculation on `input` and `change` events with millisecond response time.

---

## 2. Platform Component Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Browser / PWA                            │
├────────────────────────────────────────────────────────────────────────┤
│  [index.html] Portal Hub                                               │
│    ├── Navigation Drawer (Sticky Glassmorphic Nav)                     │
│    ├── PWA Installation Banner (beforeinstallprompt handler)           │
│    └── 12 Tool Cards (Direct Hash Routing & Local File Links)          │
├────────────────────────────────────────────────────────────────────────┤
│  Calculation Tools (12 Independent SFA Modules)                        │
│    ├── UI Layer: CSS Grid/Flex, Dark/Light Themes, KPI Metric Badges   │
│    ├── State & Input Layer: Typed Forms, Sliders, Preset Selectors    │
│    ├── Engineering Compute Engine: IS/NBC Mathematical Models          │
│    └── Export Engine: PDF (jsPDF), Excel (SheetJS), DOCX (html-docx)   │
├────────────────────────────────────────────────────────────────────────┤
│  Asset & Vendor Subsystem                                              │
│    ├── /assets/vendor/ (SheetJS, jsPDF, Three.js, Chart.js, etc.)      │
│    └── /assets/icons/ (PWA Favicons, Web App Manifest icons)           │
├────────────────────────────────────────────────────────────────────────┤
│  Service Worker Layer (`sw.js`)                                        │
│    └── Pre-caching Cache-First Strategy (`aepl-phe-v2.0`)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dataflow & Execution Lifecycle

Each tool follows a standard reactive execution cycle:

```
[User Input Event] (Change / Typing / Preset Selection)
       │
       ▼
[Input Validation & Normalization] (Defaults fallback, Clamp limits, Unit conversion)
       │
       ▼
[Core Engineering Calculation] (Hydraulics, Mass Balance, Kinetic Equations)
       │
       ▼
[State & KPI Update] (DOM Mutation, Gauge Animations, Status Alerts)
       │
       ├───► [Dynamic Visualizations] (Canvas 2D / Three.js 3D / Chart.js)
       │
       └───► [Export Pipeline Ready] (PDF / Excel / DOCX / JSON state)
```

---

## 4. Export Subsystem Architecture

Every tool integrates an export suite using self-hosted, offline vendor scripts:

1. **PDF Export Engine**:
   - Library: `jspdf.umd.min.js` + `jspdf.plugin.autotable.min.js`
   - Structure: AEPL Corporate Header, Project Metadata, Key Design KPIs, Auto-Table of Parameters, Calculation Breakdown, Code Compliance Disclaimer.
2. **Excel Export Engine**:
   - Library: `xlsx.full.min.js` (SheetJS)
   - Structure: Multi-sheet workbook including "Design Summary", "Equipment Schedule", and "Bill of Quantities (BOQ)".
3. **Word DOCX Export Engine**:
   - Library: `html-docx.js` + `FileSaver.min.js`
   - Structure: Formatted HTML-to-Word document generator for engineering reports and tender submissions.
4. **Visual & 3D Renderers**:
   - Library: `chart.umd.min.js` for mass balance / diurnal curve plots; `three.min.js` for isometric 3D tank visualization.

---

## 5. Offline & Service Worker Strategy

- **Service Worker**: `sw.js` (Cache identifier: `aepl-phe-v2.0`)
- **Pre-cached Bundle**: All 13 HTML documents, 8 vendor scripts, icons, and manifest.
- **Cache Invalidation**: Controlled via cache version bump (`v2.0` -> `v2.1`), activating cleanup of previous caches on the `activate` event.
