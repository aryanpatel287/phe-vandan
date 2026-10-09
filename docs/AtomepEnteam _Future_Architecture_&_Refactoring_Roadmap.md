# Atomep Enteam Engineering Suite
## Future Architecture & Refactoring Roadmap

> **Document Purpose:** Define the long-term architectural direction, refactoring order, and engineering goals for transforming the current multi-page vanilla HTML/CSS/JavaScript engineering suite into a clean, modular, maintainable, scalable application — while preserving the existing engineering calculations and keeping a future React / React Native migration possible.

---

# 1. Current State

The current project is a static multi-page engineering calculation suite consisting of:

- 1 portal / landing page
- 12 engineering calculator / designer pages
- Vanilla HTML5
- Embedded CSS
- Embedded JavaScript
- Client-side engineering calculations
- Export functionality
- Progressive Web App functionality
- Offline support
- No frontend framework currently required

The repository currently behaves largely as a collection of independent Single-File Applications.

The audit identified several architectural problems that make future maintenance and expansion increasingly difficult:

- 13 largely independent HTML applications
- ~19,673 lines of code
- ~130 KB of embedded CSS
- Significant duplication of navigation, design tokens, cards, tables, buttons, and other UI patterns
- JavaScript executed in the global `window` scope
- Calculation logic mixed with DOM manipulation
- Repeated export implementations
- Repeated PWA/service-worker registration code
- Inline event handlers
- Accessibility inconsistencies
- Unsafe dynamic DOM construction in some areas
- 7 of 13 pages currently failing JavaScript execution because of syntax errors
- Mobile overflow issues on some large engineering tables
- External font dependencies affecting offline behavior

These findings are documented in the repository audit.

---

# 2. Primary Architectural Objective

The immediate objective is **not to rewrite the entire application**.

The objective is to transform the existing codebase incrementally into a system where:

1. Engineering calculations are independent from the UI.
2. Shared UI behavior is centralized.
3. Shared styling is centralized.
4. Page-specific functionality remains isolated.
5. Global JavaScript pollution is eliminated.
6. HTML becomes primarily responsible for structure.
7. CSS becomes primarily responsible for presentation.
8. JavaScript becomes responsible for behavior and orchestration.
9. Engineering/domain logic becomes pure and independently testable.
10. Repeated functionality has one source of truth.
11. Existing numerical results remain unchanged.
12. The application remains lightweight and usable without unnecessary framework complexity.
13. The architecture leaves a clean migration path toward React.
14. Platform-independent business logic can eventually be reused by a React Native application.

---

# 3. Core Architectural Principle

The project should gradually move toward the following separation:

```text
                    APPLICATION
                         │
          ┌──────────────┴──────────────┐
          │                             │
       UI LAYER                    DOMAIN LAYER
          │                             │
   HTML / React UI              Engineering calculations
   CSS / RN styles              Validation rules
   Components                   Constants
   User interaction             Lookup tables
          │                             │
          └──────────────┬──────────────┘
                         │
                  SHARED SERVICES
                         │
          Formatting / Export / Storage
          PWA / Utilities / Data helpers
```

The most important separation is:

```text
UI
│
├── Input collection
├── Event handling
├── Rendering
└── Presentation

DOMAIN
│
├── Engineering formulas
├── Constants
├── Lookup tables
├── Validation rules
└── Calculation orchestration
```

A calculator should conceptually become:

```javascript
const input = collectInputs();

const result = calculate(input);

renderResults(result);
```

instead of:

```javascript
function calculate() {
    // Read DOM
    // Parse input
    // Perform engineering calculation
    // Update DOM
    // Build tables
    // Update SVG
    // Trigger exports
}
```

---

# 4. Five-Layer Refactoring Strategy

The project will be refactored through **five major layers**.

We will **not implement all five layers simultaneously**.

Each layer will be planned, implemented, tested, and stabilized before moving to the next layer.

---

## Layer 1 — Stabilization & Baseline Recovery

### Goal

Bring the current application into a known, working, measurable state before making architectural changes.

### Main objectives

- Fix all P0 JavaScript syntax errors.
- Restore functionality to the 7 currently broken pages.
- Ensure all 13 pages load without runtime errors.
- Preserve existing engineering formulas.
- Preserve existing numerical outputs.
- Establish a known-good baseline.
- Remove accidental/broken PWA injections where necessary.
- Verify calculator interactions.
- Verify calculation buttons.
- Verify reset functionality.
- Verify export functionality.
- Verify dynamic result rendering.
- Verify SVG / visual calculation outputs.
- Record baseline screenshots.
- Record baseline console/runtime status.

### Important rule

**No architectural rewrite should begin until the existing application has a reliable baseline.**

The first objective is:

```text
13/13 pages
      ↓
0 fatal JavaScript errors
      ↓
existing calculations working
      ↓
baseline captured
```

### Regression principle

Every calculator must retain its current numerical behavior unless a separate, explicitly approved engineering correction is being made.

Existing:

- constants
- equations
- lookup tables
- engineering assumptions
- unit conversions
- calculation algorithms

must be treated as protected behavior during refactoring.

---

# Layer 2 — Structural Separation & Shared Foundation

### Goal

Remove the "single-file application" architecture without changing the visual design unnecessarily.

The application should move toward:

```text
HTML
  ↓
CSS
  ↓
Shared JavaScript
  ↓
Page JavaScript
  ↓
Domain calculations
```

### Main objectives

- Extract embedded CSS.
- Extract embedded JavaScript.
- Introduce ES modules.
- Remove global variables.
- Remove unnecessary inline event handlers.
- Centralize shared utilities.
- Centralize common DOM helpers.
- Centralize formatters.
- Centralize export functionality.
- Centralize PWA registration.
- Keep page-specific code isolated.

### Target structure

```text
atomenteam_website/
│
├── index.html
├── calculator-pages/
│
├── css/
│   ├── base.css
│   ├── tokens.css
│   ├── components.css
│   ├── utilities.css
│   └── responsive.css
│
├── js/
│   ├── core/
│   │   ├── dom.js
│   │   ├── validation.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── services/
│   │   ├── export.js
│   │   ├── storage.js
│   │   └── pwa.js
│   │
│   ├── calculators/
│   │   ├── firefighting/
│   │   ├── water-demand/
│   │   ├── drainage/
│   │   ├── pipe-sizing/
│   │   ├── ro-plant/
│   │   ├── stp-design/
│   │   ├── storm-sump/
│   │   ├── water-softener/
│   │   ├── water-treatment/
│   │   ├── heat-pump/
│   │   └── pump-head/
│   │
│   └── app/
│       └── bootstrap.js
│
├── assets/
│   ├── icons/
│   └── vendor/
│
├── docs/
│
└── tests/
```

The exact structure may change during implementation.

The important architectural goal is **separation of responsibility**, not blindly following a particular folder structure.

---

# Layer 3 — Design System & CSS Architecture

### Goal

Create one consistent visual system instead of maintaining 13 slightly different versions of the same interface.

The audit found duplicated navigation styling across all 13 pages and repeated implementations of cards, tables, buttons, pills, range hints, and design tokens.

### Main objectives

Create centralized:

- Color tokens
- Typography tokens
- Spacing scale
- Border radius
- Shadows
- Breakpoints
- Container widths
- Navigation
- Buttons
- Cards
- KPI cards
- Forms
- Inputs
- Selects
- Tables
- Badges
- Tabs
- Alerts
- Result panels
- Export controls
- Loading states
- Error states

### Proposed CSS layers

```text
tokens.css
    ↓
base.css
    ↓
components.css
    ↓
utilities.css
    ↓
responsive.css
```

### Design token example

```css
:root {
    --color-primary: ...;
    --color-surface: ...;
    --color-background: ...;
    --color-text: ...;
    --color-text-muted: ...;

    --space-1: ...;
    --space-2: ...;
    --space-3: ...;

    --radius-sm: ...;
    --radius-md: ...;
    --radius-lg: ...;
}
```

The exact values will be derived from the existing visual system rather than arbitrarily redesigning the application.

### Responsive objective

Every calculator should behave intentionally across:

```text
320px
375px
768px
1024px
1440px+
```

Large engineering tables should use deliberate horizontal scrolling rather than causing page-level overflow.

---

# Layer 4 — Domain Logic & Application Logic Separation

### Goal

This is the most important layer for the future React / React Native direction.

Engineering calculations must become independent from HTML and browser APIs.

### Current problem

The audit identifies calculation functions that simultaneously:

- read DOM values
- parse values
- calculate engineering formulas
- manipulate DOM elements
- format results

This makes the calculations difficult to test and reuse.

### Target architecture

```text
User Input
    ↓
Input Adapter
    ↓
Validation
    ↓
Domain Calculation
    ↓
Calculation Result
    ↓
UI Renderer
```

Example:

```javascript
const input = {
    flow,
    head
};

const result = calculateTDH(input);

renderTDHResult(result);
```

The calculation module should contain something conceptually like:

```javascript
export function calculateTDH({ flow, head }) {
    return head + (flow * 0.05);
}
```

It should NOT know that:

```text
document.getElementById(...)
```

exists.

---

## Domain Layer Responsibilities

The domain layer should contain:

### Calculations

```text
calculateTDH()
calculatePipeVelocity()
calculateFlowRate()
calculateTankVolume()
calculateBODLoading()
calculateOxygenDemand()
...
```

### Constants

```text
engineering constants
design coefficients
conversion factors
```

### Lookup tables

```text
pipe material data
fixture unit data
resin capacity data
engineering reference tables
```

### Validation rules

```text
minimum diameter
maximum population
non-zero power
valid flow rate
valid pressure
etc.
```

### Result models

Instead of directly producing DOM strings:

```javascript
{
    value: 125.42,
    unit: "m³/hr",
    status: "valid"
}
```

The UI can decide how this result should visually appear.

---

# Layer 5 — Quality, Testing & Future Platform Architecture

### Goal

Make the application reliable enough that future development does not repeatedly break existing calculators.

This layer also establishes the foundation for a future React and React Native implementation.

---

## Testing Architecture

Introduce multiple levels of testing.

### 1. Domain/unit tests

Test engineering calculations independently.

```text
input
  ↓
calculation
  ↓
expected numerical result
```

### 2. Component/UI tests

Verify:

- inputs
- buttons
- forms
- result rendering
- validation
- tabs
- tables

### 3. End-to-end tests

Using Playwright:

```text
open calculator
    ↓
enter values
    ↓
calculate
    ↓
verify results
    ↓
reset
    ↓
export
```

### 4. Regression tests

Every refactor should verify that numerical results remain consistent with the established baseline.

---

# 5. Future React Architecture

React should be considered a **future UI architecture**, not the first refactoring step.

Once the domain and shared logic are properly separated, a React application can consume those modules instead of rebuilding the engineering logic.

Conceptually:

```text
                    SHARED DOMAIN
                         │
             ┌───────────┴───────────┐
             │                       │
         Web UI                 Mobile UI
             │                       │
          React                 React Native
             │                       │
          Browser                iOS/Android
```

The goal is:

```text
Same engineering logic
        │
        ├── Vanilla Web UI
        │
        ├── React Web UI
        │
        └── React Native UI
```

---

# 6. React Native Compatibility Strategy

React Native should influence the architecture **without forcing the current website to become React Native prematurely**.

## What should be reusable?

### Highly reusable

- Engineering calculations
- Validation logic
- Constants
- Lookup tables
- Unit conversions
- Data transformation
- Calculation orchestration
- Business/domain rules
- Pure utility functions

### Potentially reusable with adaptation

- Design tokens
- Typography definitions
- Spacing system
- Color system
- Component concepts
- Form schemas
- State models

### Not directly reusable

- HTML
- DOM APIs
- `document`
- `window`
- HTML-specific CSS
- browser-specific event handling
- browser-only APIs

Therefore, the architectural goal should NOT be:

> "Make the CSS reusable directly in React Native."

Instead, the goal should be:

> "Make the design system and domain logic platform-independent, while allowing each UI platform to implement its own presentation layer."

---

# 7. Separation of Responsibilities

The final architecture should conceptually follow:

```text
                    DOMAIN
             Engineering Intelligence
                       │
                       ▼
              Application Services
                       │
            ┌──────────┴──────────┐
            │                     │
        Web Adapter          Mobile Adapter
            │                     │
            ▼                     ▼
       Web Components       RN Components
            │                     │
            ▼                     ▼
       Web Styling          RN Styling
```

This means engineering logic should not know whether it is being executed by:

```text
HTML
React
React Native
```

---

# 8. Non-Negotiable Architectural Rules

During refactoring, the following rules should be maintained.

## Rule 1 — Preserve numerical behavior

Do not casually modify engineering formulas during architectural refactoring.

## Rule 2 — No unnecessary framework migration

Do not introduce React merely to solve problems that can be solved through clean architecture.

## Rule 3 — No global mutable state

Avoid unnecessary variables attached to `window`.

## Rule 4 — No calculation logic inside DOM handlers

Event handlers should collect input and invoke application/domain logic.

## Rule 5 — No duplicated shared CSS

A shared component should have one canonical implementation.

## Rule 6 — No duplicated utilities

Formatters, export helpers, DOM utilities, and PWA registration should have one source of truth.

## Rule 7 — Prefer pure functions

Engineering calculations should be deterministic:

```text
same input
    ↓
same result
```

## Rule 8 — Keep platform-specific code at the edges

Browser-specific and mobile-specific behavior should stay outside the domain layer.

## Rule 9 — Accessibility is part of architecture

Accessibility should not be treated as a final cosmetic pass.

## Rule 10 — Every layer must remain testable

A refactor is not complete merely because the folder structure looks cleaner.

---

# 9. Recommended Implementation Order

The overall sequence is:

```text
LAYER 1
Stabilize
   ↓
LAYER 2
Separate structure
   ↓
LAYER 3
Centralize design system
   ↓
LAYER 4
Separate domain logic
   ↓
LAYER 5
Testing + platform readiness
```

More concretely:

```text
1. Fix broken JavaScript
2. Establish regression baseline
3. Extract CSS
4. Extract shared JavaScript
5. Introduce modules
6. Remove global scope pollution
7. Centralize design tokens
8. Centralize common components/styles
9. Separate calculation logic
10. Separate validation
11. Separate rendering
12. Centralize exports/PWA utilities
13. Improve accessibility
14. Improve responsive behavior
15. Add unit tests
16. Add Playwright regression tests
17. Verify numerical parity
18. Prepare shared domain package
19. Evaluate React web migration
20. Evaluate React Native application
```

---

# 10. What We Will NOT Do

To prevent unnecessary complexity, we will explicitly avoid:

- Rewriting everything at once
- Introducing React before the architecture is understood
- Introducing TypeScript solely for the sake of modernization
- Introducing a state-management library without a real requirement
- Introducing a backend without a requirement
- Rebuilding engineering formulas during UI refactoring
- Changing the visual design unnecessarily
- Creating abstractions before repeated patterns are understood
- Building a React Native app before the web application is stable
- Optimizing prematurely

---

# 11. Definition of Success

The refactoring should eventually result in a project where:

### Maintainability

A change to the navigation does not require editing 13 HTML files.

### Styling

A change to the primary button design happens in one place.

### JavaScript

A shared formatter is implemented once.

### Engineering

A calculation can be tested without launching a browser.

### Safety

Dynamic content is rendered safely.

### Accessibility

Forms and interactive controls have proper semantic behavior.

### Responsiveness

Calculators work intentionally on mobile, tablet, and desktop.

### PWA

Offline functionality does not depend on external CDN resources.

### Testing

Every calculator can be automatically regression-tested.

### Future React

React can become a new presentation layer without rewriting engineering calculations.

### Future React Native

React Native can reuse the platform-independent domain/application logic while implementing its own native presentation layer.

---

# 12. Working Method

We will work **layer by layer**, not attempt the entire roadmap simultaneously.

For each layer:

```text
1. Inspect
      ↓
2. Plan
      ↓
3. Modify
      ↓
4. Test
      ↓
5. Compare against baseline
      ↓
6. Fix regressions
      ↓
7. Commit
      ↓
8. Move to next layer
```

Each layer should produce a stable checkpoint.

---

# 13. Immediate Next Step

## Layer 1 — Stabilization & Baseline Recovery

We will start only with Layer 1.

The first task is to understand and repair the existing runtime failures and establish a trustworthy baseline.

We will **not** begin CSS extraction, React conversion, or major architectural restructuring until the current application is known to work.

After Layer 1 is complete, we will proceed to Layer 2.

---

# Final Architectural Vision

The long-term vision is:

```text
                    ATOME P ENTEAM
                          │
                 ┌────────┴────────┐
                 │                 │
             DOMAIN             SERVICES
          Engineering Logic     Shared Logic
                 │                 │
                 └────────┬────────┘
                          │
                  APPLICATION LAYER
                          │
             ┌────────────┼────────────┐
             │            │            │
          Web UI       React Web    React Native
             │            │            │
          Browser      Browser      iOS / Android
```

The website remains the **primary product**.

React is a potential future web architecture.

React Native is a potential future mobile platform.

The engineering/domain layer remains the stable core shared by these platforms.

The objective is therefore not simply to "clean up the HTML."

The objective is to create a **platform-independent engineering core with replaceable presentation layers**, while keeping the current website lightweight, reliable, accessible, and maintainable.