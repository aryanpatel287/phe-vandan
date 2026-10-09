# Engineering Tools Technical Reference: Standards, Formulas & Algorithms

This reference document outlines the engineering specifications, applicable Indian Standards (IS), National Building Code (NBC/NBCS), and calculation formulas powering each tool in the Atomep Enteam suite.

---

## 1. Water Demand Calculator
- **File**: [`NBC2026_Water_Demand_Calculator_v2.html`](../NBC2026_Water_Demand_Calculator_v2.html)
- **Codes & Standards**:
  - NBC 2016 Part 9 Section 1 (Water Supply)
  - NBCS 2026 (National Building Construction Standards)
  - IS 1172:1993 (Code of basic requirements for water supply, drainage and sanitation)
- **Key Equations & Parameters**:
  - $Q_{\text{domestic}} = \sum (\text{Occupants} \times \text{LPCD}_{\text{domestic}})$
  - $Q_{\text{flushing}} = \sum (\text{Occupants} \times \text{LPCD}_{\text{flushing}})$
  - $Q_{\text{total}} = Q_{\text{domestic}} + Q_{\text{flushing}} + Q_{\text{landscape}} + Q_{\text{HVAC}} + Q_{\text{misc}}$
  - Storage Tank Sizing:
    - Underground Tank (UGT): Typically 1.0 to 1.5 days total demand.
    - Overhead Tank (OHT): Typically 0.33 to 0.5 days total demand.
    - Raw vs Treated vs Flushing compartmentalization.

---

## 2. Pipe Size Calculator
- **File**: [`NBCS_2026_Pipe_Size_Calculator.html`](../NBCS_2026_Pipe_Size_Calculator.html)
- **Codes & Standards**:
  - NBCS 2026 Part E / IS 2065:1983 (Water Supply in Buildings)
  - Hazen-Williams Formula / Darcy-Weisbach Equation
- **Key Equations & Parameters**:
  - Velocity: $v = \frac{4Q}{\pi D^2}$ (Allowable velocity: 0.9 m/s to 2.4 m/s)
  - Head Loss (Hazen-Williams):
    $$h_f = 10.67 \times L \times Q^{1.852} \times C^{-1.852} \times D^{-4.87}$$
    *(where $C$ = Roughness coefficient: CPVC=150, GI=120, Copper=140, HDPE=140)*
  - Loading Unit (LU) / Fixture Unit to Peak Flow conversion via Hunter's curve.

---

## 3. Drainage System Calculator
- **File**: [`NBCS_2026_Drainage_Calculator.html`](../NBCS_2026_Drainage_Calculator.html)
- **Codes & Standards**:
  - NBCS 2026 Part E Section 2 (Drainage and Sanitation)
  - IS 1742:1983 (Code of practice for building drainage)
- **Key Equations & Parameters**:
  - Discharge Fixture Unit (DFU) method for waste and soil stacks.
  - Manning's Formula for gravity sewer pipes:
    $$V = \frac{1}{n} R^{2/3} S^{1/2}, \quad Q = A \cdot V$$
  - Self-cleansing velocity ($\ge 0.75\text{ m/s}$) and maximum velocity ($\le 2.5\text{ m/s}$).
  - Minimum gradients (1:50, 1:100, 1:150 depending on pipe diameter).

---

## 4. Storm Sump Design Tool
- **File**: [`Storm_Sump_Design_Tool.html`](../Storm_Sump_Design_Tool.html)
- **Codes & Standards**:
  - IS 16220:2014 / CPHEEO Manual on Storm Water Drainage
  - NBC 2016 Fire Fighting Drainage discharge
- **Key Equations & Parameters**:
  - Rational Formula: $Q = \frac{C \cdot I \cdot A}{360}$ ($Q$ in $\text{m}^3/\text{s}$ or $\text{LPM}$)
  - Runoff coefficients ($C$): Paved=0.85-0.90, Roof=0.90-0.95, Landscape=0.20-0.30.
  - Sump Volume: $V = (Q_{\text{storm}} + Q_{\text{fire\_drainage}} - Q_{\text{pump\_discharge}}) \times t_{\text{retention}}$
  - Dual pump setup (1 Duty + 1 Standby) with auto-float switch levels.

---

## 5. Water Treatment Plant (WTP) Designer
- **File**: [`Water_Treatment_Plant_Designer.html`](../Water_Treatment_Plant_Designer.html)
- **Codes & Standards**:
  - IS 10500:2012 (Drinking Water Specification)
  - CPHEEO Manual on Water Supply and Treatment
- **Key Modules & Sizing**:
  - Cascade Aerator: Sizing based on loading rate ($0.03\text{--}0.045\text{ m}^2/\text{m}^3/\text{hr}$).
  - Flash Mixer: Retention time 30–60s, Velocity gradient $G = 300\text{--}900\text{ s}^{-1}$.
  - Clariflocculator: Flocculation time 20–30 min, Surface overflow rate (SOR) 20–35 $\text{m}^3/\text{m}^2/\text{day}$.
  - Dual Media / Rapid Sand Filters: Filtration velocity 5–12 $\text{m/hr}$, backwash air/water scour rates.
  - Disinfection: Sodium hypochlorite / Chlorine gas dosage ($1\text{--}3\text{ mg/L}$) with 30 min contact time.

---

## 6. Water Softener Plant Designer
- **File**: [`Water_Softener_Plant_Designer.html`](../Water_Softener_Plant_Designer.html)
- **Codes & Standards**:
  - Ion Exchange Technology Principles / IS Water Conditioning Standards
- **Key Equations & Parameters**:
  - Total Hardness Load: $H_{\text{total}} = \text{Flow (m}^3/\text{day)} \times \text{Hardness (mg/L as }\text{CaCO}_3)$
  - Resin Volume ($V_{\text{resin}}$):
    $$V_{\text{resin}} = \frac{H_{\text{total}}}{\text{Operating Exchange Capacity (eq/L or g/L)}}$$
  - Salt (NaCl) Requirement for Regeneration:
    $$\text{Salt (kg)} = V_{\text{resin}} \times \text{Salt Dosage (100--160 g NaCl/L resin)}$$
  - Service Flow Rate: 10–25 Bed Volumes per hour (BV/h).

---

## 7. RO Plant Sizing Calculator
- **File**: [`RO_Plant_Sizing_Calculator.html`](../RO_Plant_Sizing_Calculator.html)
- **Codes & Standards**:
  - FilmTec / Hydranautics / Toray Industrial RO Design Guidelines
- **Key Equations & Parameters**:
  - Recovery Ratio: $R = \frac{Q_p}{Q_f} \times 100\%$ (Typically 60%–75% for brackish water)
  - Membrane Area & Count:
    $$\text{Membranes} = \frac{Q_p}{\text{Flux Rate (LMH)} \times \text{Membrane Area (400 sq.ft / 37.2 m}^2)}$$
  - Array Configuration: 2:1 staging for 70%–75% recovery.
  - High Pressure Pump Hydraulic Power:
    $$P_{\text{hyd}} = \frac{Q_f (\text{m}^3/\text{hr}) \times P_{\text{bar}}}{36 \times \eta}$$

---

## 8. AI DM Plant Platform
- **File**: [`AI_DM_Plant_Platform.html`](../AI_DM_Plant_Platform.html)
- **Codes & Standards**:
  - Hospital Grade / Pharmacopoeia (IP/USP) Purified Water Standards
  - Strong Acid Cation (SAC) + Strong Base Anion (SBA) + Mixed Bed (MB)
- **Key Features**:
  - Water conductivity target $< 0.1\ \mu\text{S/cm}$, Silica $< 0.02\text{ mg/L}$.
  - Cation/Anion Bed throughput calculation before breakthrough.
  - Regeneration chemical balancing (HCl for SAC, NaOH for SBA).

---

## 9. STP Design Calculator
- **File**: [`STP_Design_Calculator.html`](../STP_Design_Calculator.html)
- **Codes & Standards**:
  - CPCB / NGT Effluent Discharge Norms (BOD $<10\text{ mg/L}$, TSS $<20\text{ mg/L}$, COD $<50\text{ mg/L}$)
  - CPHEEO Manual on Sewerage & Sewage Treatment
  - Technologies: MBBR (Moving Bed Biofilm Reactor), MBR (Membrane Bioreactor), SBR (Sequential Batch Reactor), ASP.
- **Key Equations & Parameters**:
  - Biological Organic Load: $\text{BOD Load (kg/day)} = Q (\text{KLD}) \times \text{BOD}_{\text{in}} (\text{mg/L}) / 1000$
  - Oxygen Requirement: $O_2 = a'(\text{BOD removed}) + b'(\text{MLSS in basin}) + 4.57(\text{TKN nitrified})$
  - Blower Air Flow (CFM/$\text{m}^3/\text{hr}$) based on SOTE (Standard Oxygen Transfer Efficiency) and diffuser depth.
  - Sludge Generation & Filter Press / Centrifuge sizing.

---

## 10. Heat Pump Sizing Tool
- **File**: [`heat_pump_sizing_tool.html`](../heat_pump_sizing_tool.html)
- **Codes & Standards**:
  - ISHRAE / ASHRAE HVAC Applications
  - ECBC (Energy Conservation Building Code)
- **Key Equations & Parameters**:
  - Heat Energy Required:
    $$Q_{\text{thermal}} = m \times C_p \times \Delta T = \text{Liters} \times 1.163 \times (T_{\text{hot}} - T_{\text{cold}}) / 1000\text{ (kWh)}$$
  - Heat Pump Thermal Output ($\text{kW}_{\text{th}}$) = $\frac{Q_{\text{thermal}}}{\text{Operating Hours (typically 4--8 hrs)}}$
  - Electrical Power Input ($\text{kW}_{\text{elec}}$) = $\frac{\text{kW}_{\text{th}}}{\text{COP}}$ (COP typically 3.5–4.2)
  - Storage buffer tank volume calculation based on peak hourly diversity.

---

## 11. Pump Head Calculator
- **File**: [`pump-head-calculator.html`](../pump-head-calculator.html)
- **Codes & Standards**:
  - Hydraulic Institute Standards / IS 1520 & IS 9079
- **Key Equations & Parameters**:
  - Total Dynamic Head:
    $$\text{TDH} = H_{\text{static\_discharge}} - H_{\text{static\_suction}} + h_{f,\text{discharge}} + h_{f,\text{suction}} + h_{\text{fittings}} + H_{\text{residual}}$$
  - Pump Hydraulic Power:
    $$P_{\text{hyd}} (\text{kW}) = \frac{\rho \cdot g \cdot Q (\text{m}^3/\text{s}) \cdot \text{TDH} (\text{m})}{1000} = \frac{Q (\text{m}^3/\text{hr}) \cdot \text{TDH} (\text{m})}{367}$$
  - Motor Rating ($P_{\text{motor}}$): $\frac{P_{\text{hyd}}}{\eta_{\text{pump}} \times \eta_{\text{motor}}} \times \text{Safety Factor (1.15--1.20)}$

---

## 12. Fire Fighting Calculator
- **File**: [`firefighting_calculator.html`](../firefighting_calculator.html)
- **Codes & Standards**:
  - NBC 2016 Part 4 (Fire and Life Safety) & NBCS 2026
  - IS 15105 (Design and Installation of Fixed Automatic Sprinkler Fire Extinguishing Systems)
  - IS 3844 (Installation and Maintenance of Internal Fire Hydrants and Hose Reels on Premises)
- **Key Calculations**:
  - Building Hazard Grouping: Group A (Residential), Group B (Educational), Group C (Institutional), Group D (Assembly), Group E (Business), Group F (Mercantile), Group G (Industrial), Group H (Storage).
  - Minimum Water Static Storage: Underground Static Tank (100 kL to 400 kL+) + Terrace Tank (10 kL to 25 kL).
  - Main Fire Pump: 2280 LPM / 2850 LPM / 4500 LPM at minimum 5.5 to 7.0 bar.
  - Standby Diesel Pump + Electric Jockey Pump (180 LPM at 7 bar).
  - Sprinkler hydraulics (K-factor 80 or 115, minimum 0.5 bar at remote head).
