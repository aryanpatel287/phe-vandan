# Atomep Enteam PHE Engineering Calculation Suite

[![Standards: NBC 2016 / NBCS 2026 / IS Codes](https://img.shields.io/badge/Standards-NBC%20%7C%20NBCS%20%7C%20IS%20Codes-0d6efd.svg)](#standards--compliance)
[![Platform: 100% Client-Side PWA](https://img.shields.io/badge/Platform-Client--Side%20PWA-059669.svg)](#offline--pwa-capability)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25%20Functional-7c3aed.svg)](#offline--pwa-capability)

A comprehensive suite of **12 Public Health Engineering (PHE), Water Treatment, Environmental, and Fire Protection** sizing and design tools developed for **Atomep Enteam Pvt Ltd**. 

The portal operates 100% client-side in the browser, requires zero server installation, and provides offline functionality with full export support to PDF, Excel, and Word.

---

## 🛠️ Included Engineering Calculators

| # | Calculator | File | Summary |
|---|------------|------|---------|
| 1 | **Fire Fighting Design Calculator** | [`firefighting_calculator.html`](firefighting_calculator.html) | NBC Part IV & NBCS 2026 fire protection sizing — static water storage, fire pump capacities, wet risers, yard hydrants, and sprinkler hydraulics. |
| 2 | **Water Demand Calculator** | [`NBC2026_Water_Demand_Calculator_v2.html`](NBC2026_Water_Demand_Calculator_v2.html) | NBCS 2026 water demand for residential, commercial, institutional, industrial, and transport buildings with fixture unit breakdowns and UGT/OHT storage sizing. |
| 3 | **Pipe Size Calculator** | [`NBCS_2026_Pipe_Size_Calculator.html`](NBCS_2026_Pipe_Size_Calculator.html) | Water supply pipe sizing per NBCS 2026 with flow rate, velocity limits, and Hazen-Williams head loss gradient analysis. |
| 4 | **Drainage System Calculator** | [`NBCS_2026_Drainage_Calculator.html`](NBCS_2026_Drainage_Calculator.html) | Internal and external drainage design with DFU-based stack sizing, horizontal sewer sizing, Manning's velocity, and invert slopes. |
| 5 | **Storm Sump Designer** | [`Storm_Sump_Design_Tool.html`](Storm_Sump_Design_Tool.html) | Basement storm water sump design using the Rational Method (IS 16220:2014 + CPHEEO) combined with fire fighting runoff. |
| 6 | **Water Treatment Plant (WTP)** | [`Water_Treatment_Plant_Designer.html`](Water_Treatment_Plant_Designer.html) | IS-code-compliant water treatment plant designer covering raw intake, cascade aeration, flash mixing, clariflocculation, dual media filtration, and disinfection. |
| 7 | **Water Softener Plant Designer** | [`Water_Softener_Plant_Designer.html`](Water_Softener_Plant_Designer.html) | Ion exchange water softener design with SAC resin volume, salt requirement, and regeneration cycle calculations. |
| 8 | **RO Plant Sizing Calculator** | [`RO_Plant_Sizing_Calculator.html`](RO_Plant_Sizing_Calculator.html) | Reverse osmosis plant sizing for commercial, hospital, and industrial applications with flux, recovery, staging arrays, and power calculations. |
| 9 | **AI DM Plant Platform** | [`AI_DM_Plant_Platform.html`](AI_DM_Plant_Platform.html) | Demineralised water plant design intelligence for hospitals — resin selection, bed throughput, conductivity targets, and chemical regeneration. |
| 10 | **STP Design Calculator** | [`STP_Design_Calculator.html`](STP_Design_Calculator.html) | Sewage treatment plant sizing and design covering MBBR, MBR, SBR, and ASP biological kinetics, aeration air CFM, and sludge handling. |
| 11 | **Heat Pump Sizing Tool** | [`heat_pump_sizing_tool.html`](heat_pump_sizing_tool.html) | Heat pump sizing and thermal kW calculator for hospitals, hotels, hostels, schools, and residential buildings based on hot water delta-T and COP. |
| 12 | **Pump Head Calculator** | [`pump-head-calculator.html`](pump-head-calculator.html) | Total Dynamic Head (TDH), static suction/discharge, pipe friction losses, fitting equivalent lengths, and motor kW/HP sizing. |

---

## 🏛️ Standards & Compliance

- **NBC 2016 / NBCS 2026**: National Building Code & National Building Construction Standards (Water Supply, Drainage, Fire & Life Safety).
- **CPHEEO Manuals**: Central Public Health and Environmental Engineering Organisation manuals for Water Supply, Sewerage & Storm Drainage.
- **Indian Standards (IS Codes)**: IS 1172, IS 2065, IS 1742, IS 16220, IS 10500, IS 15105, IS 3844, IS 1520.
- **CPCB / NGT**: Central Pollution Control Board and National Green Tribunal effluent discharge norms.

---

## 🚀 Running Locally & Offline Deployment

Simply open [`index.html`](index.html) in any modern web browser, or serve it using any local static file server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx serve)
npx serve .
```

### PWA Offline Installation
1. Visit the portal over `http://localhost` or `https://`.
2. Click the **"Install Offline Android App / Desktop App"** banner.
3. All 12 calculators will be cached locally and can be accessed with zero internet connection.

---

## 📄 Export Features
All tools support client-side exports without uploading data to external servers:
- 📕 **PDF Report**: Branded engineering design summary with auto-tables.
- 📗 **Excel Spreadsheet**: Structured workbooks with formulas and schedules.
- 📘 **Word Document**: Formatted `.docx` for tender submission and project reports.

---

## 🏢 Organization
**Atomep Enteam Pvt Ltd**  
Water, Wastewater & Environmental Engineering Consultancy  
Pan India
