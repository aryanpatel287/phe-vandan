# Project Overview: Atomep Enteam PHE Engineering Calculation Suite

## 1. Executive Summary
**Atomep Enteam Pvt Ltd (AEPL)** Engineering Suite is a production-grade, standalone web-based portal providing 12 specialized Public Health Engineering (PHE), Water Treatment, Environmental, and Fire Protection sizing calculators.

The platform is designed to operate 100% client-side in modern browsers, with zero backend dependency, and supports offline execution through Progressive Web App (PWA) service workers.

---

## 2. Core Capabilities & Domain Scope

| # | Tool Name | File | Primary Standard / Code | Core Functions |
|---|-----------|------|-------------------------|----------------|
| 1 | **Landing Portal** | [`index.html`](../index.html) | Modern Web / PWA | Central launcher, PWA install prompt, company overview, navigation |
| 2 | **Water Demand Calculator** | [`NBC2026_Water_Demand_Calculator_v2.html`](../NBC2026_Water_Demand_Calculator_v2.html) | NBCS 2026, NBC 2016 | Occupancy & fixture-based domestic/flushing water estimation, UGT/OHT storage sizing |
| 3 | **Pipe Size Calculator** | [`NBCS_2026_Pipe_Size_Calculator.html`](../NBCS_2026_Pipe_Size_Calculator.html) | NBCS 2026, Hazen-Williams | Water supply piping diameter, flow velocity, head loss gradient |
| 4 | **Drainage System Calculator** | [`NBCS_2026_Drainage_Calculator.html`](../NBCS_2026_Drainage_Calculator.html) | NBCS 2026 Part E Sec 2 | Drainage Fixture Units (DFU), stack sizing, horizontal sewers, slope/invert levels |
| 5 | **Storm Sump Designer** | [`Storm_Sump_Design_Tool.html`](../Storm_Sump_Design_Tool.html) | IS 16220:2014, CPHEEO | Rational Method runoff, catchment storm volume, basement sump & pump sizing |
| 6 | **Water Treatment Plant (WTP)** | [`Water_Treatment_Plant_Designer.html`](../Water_Treatment_Plant_Designer.html) | IS 10500, CPHEEO Water Manual | Raw water intake, cascade aerator, flash mixer, clariflocculator, dual media filter, chlorination |
| 7 | **Water Softener Plant Designer** | [`Water_Softener_Plant_Designer.html`](../Water_Softener_Plant_Designer.html) | IS Standards, Water Quality Specs | Hardness ion exchange, SAC resin volume, salt dosage, regeneration cycle |
| 8 | **RO Plant Calculator** | [`RO_Plant_Sizing_Calculator.html`](../RO_Plant_Sizing_Calculator.html) | Industrial Membrane Guidelines | Permeate flux, recovery %, 4040/8040 membrane array, high pressure pump kW, antiscalant |
| 9 | **AI DM Plant Platform** | [`AI_DM_Plant_Platform.html`](../AI_DM_Plant_Platform.html) | High Purity / Hospital Standards | Demineralisation intelligence (SAC + SBA + MB), throughput capacity, chemical regeneration |
| 10 | **STP Design Calculator** | [`STP_Design_Calculator.html`](../STP_Design_Calculator.html) | CPCB, NGT Norms, CPHEEO Sewerage | Sewage Treatment (MBBR, MBR, ASP, SBR), BOD/COD/TSS kinetics, aeration blowers, sludge dewatering |
| 11 | **Heat Pump Sizing Tool** | [`heat_pump_sizing_tool.html`](../heat_pump_sizing_tool.html) | ASHRAE, ISHRAE, ECBC | Hot water peak heating load, thermal kW, heat pump COP, storage buffer tank sizing |
| 12 | **Pump Head Calculator** | [`pump-head-calculator.html`](../pump-head-calculator.html) | Hydraulic Institute / IS Standards | Total Dynamic Head (TDH), static head, friction head, fittings equivalent length, kW/BHP |
| 13 | **Fire Fighting Calculator** | [`firefighting_calculator.html`](../firefighting_calculator.html) | NBC 2016 Part IV, NBCS 2026 | Hazard classification, underground/terrace static water tanks, hydrant & sprinkler pumps, riser sizing |

---

## 3. Technology Stack & Architecture

- **Frontend Core**: Vanilla HTML5, Semantic Elements, CSS3 (CSS Variables, Flexbox, CSS Grid, Responsive Media Queries), Modern JavaScript (ES6+).
- **Offline / PWA Engine**:
  - `sw.js`: Cache-First service worker caching all pages, styles, scripts, fonts, and assets.
  - `manifest.webmanifest`: PWA manifest for Android / Desktop standalone installation.
- **Client-Side Export Engines (Vendors in `assets/vendor/`)**:
  - `jspdf.umd.min.js` & `jspdf.plugin.autotable.min.js`: Client-side branded PDF engineering report export.
  - `xlsx.full.min.js`: Multi-tab Microsoft Excel workbook generation with formulas and structured tables.
  - `html-docx.js` & `FileSaver.min.js`: Editable Microsoft Word report export.
  - `html2canvas.min.js`: High-resolution canvas/image snapshotting of charts and tables.
  - `chart.umd.min.js`: Dynamic interactive charts (pie, bar, line, radar).
  - `three.min.js`: 3D plant & tank spatial visualization.

---

## 4. Key Directory & File Structure

```
atomenteam_website/
├── docs/                                  # Project Documentation & Architecture
│   ├── PROJECT_OVERVIEW.md                # High-level overview & tool registry
│   ├── SYSTEM_ARCHITECTURE.md            # Dataflow, modules & calculation engines
│   ├── TOOLS_REFERENCE.md                 # Mathematical models & Indian Standards reference
│   ├── CODING_STANDARDS.md                # Code quality, UI/UX & security rules
│   └── CURRENT_SPRINT.md                  # Active sprint & milestone tracking
├── DESIGN.md                              # AEPL Design System, UI guidelines & palettes
├── README.md                              # Main repository README
├── index.html                             # Main portal homepage
├── sw.js                                  # Service Worker (PWA offline cache)
├── manifest.webmanifest                   # Web App Manifest
├── atomep_enteam_logo.png                 # Official brand logo
├── favicon.ico                            # Favicon
│
├── AI_DM_Plant_Platform.html              # Demineralised Water Plant Platform
├── NBC2026_Water_Demand_Calculator_v2.html # Water Demand Calculator
├── NBCS_2026_Drainage_Calculator.html     # Drainage System Calculator
├── NBCS_2026_Pipe_Size_Calculator.html    # Water Supply Pipe Sizer
├── RO_Plant_Sizing_Calculator.html        # Reverse Osmosis Sizer
├── STP_Design_Calculator.html             # Sewage Treatment Plant Sizer
├── Storm_Sump_Design_Tool.html            # Storm Water Sump Sizer
├── Water_Softener_Plant_Designer.html     # Water Softener Designer
├── Water_Treatment_Plant_Designer.html    # Water Treatment Plant Designer
├── firefighting_calculator.html           # Fire Protection & Hydrant Sizer
├── heat_pump_sizing_tool.html             # Central Hot Water Heat Pump Sizer
├── pump-head-calculator.html              # Pump Total Dynamic Head Sizer
│
└── assets/
    ├── icons/                             # PWA Application Icons (192x192, 512x512)
    │   ├── icon-192.png
    │   └── icon-512.png
    └── vendor/                            # Self-hosted vendor JS libraries (offline ready)
        ├── FileSaver.min.js
        ├── chart.umd.min.js
        ├── html-docx.js
        ├── html2canvas.min.js
        ├── jspdf.plugin.autotable.min.js
        ├── jspdf.umd.min.js
        ├── three.min.js
        └── xlsx.full.min.js
```
