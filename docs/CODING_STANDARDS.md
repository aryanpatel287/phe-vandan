# Coding & Development Standards

## 1. Core Principles
1. **Single-File Encapsulation with Modular Logic**:
   - Each tool must remain self-contained or cleanly refer to shared `./assets/vendor/` and `./assets/icons/`.
   - Never load critical libraries from external CDNs that would fail when running offline.
2. **Defensive Mathematical Computations**:
   - Always guard against division by zero (e.g., zero pipe length, zero delta T, zero flux).
   - Sanitize and clamp all numeric inputs with fallbacks: `const val = parseFloat(input.value) || 0;`.
   - Explicitly handle and prevent `NaN`, `Infinity`, and `-Infinity` from appearing in the UI or exported documents.
3. **PWA & Offline Integrity**:
   - Whenever a new tool, icon, or vendor script is added or modified, update `OFFLINE_URLS` and bump `CACHE_NAME` in [`sw.js`](../sw.js).
   - Maintain the standard PWA registration snippet in the `<head>` of each HTML document.

---

## 2. JavaScript & DOM Practices
- **ES6+ Standards**: Use `const`/`let`, arrow functions, template literals, and destructuring.
- **Event Handling**: Prefer `addEventListener` over inline event attributes when possible.
- **Performance**: Debounce heavy recalculations or real-time chart redraws when listening to continuous `input` slider events.
- **State Management**: Keep UI state accessible and structured so export functions (PDF, Excel, Word) can cleanly serialize calculation models without re-querying raw DOM elements repeatedly.

---

## 3. UI/UX & Responsive Layouts
- **Semantic HTML5**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **CSS Variables (`:root`)**: Define semantic design tokens for background, surfaces, borders, primary/accent colors, shadows, and status colors.
- **Dark & Light Mode**: Support `@media (prefers-color-scheme: dark)` or manual toggles with high contrast readability.
- **Mobile First & Responsive**: CSS Grid and Flexbox layouts with breakpoints at `480px`, `768px`, `1024px`, and `1400px`.
- **Accessibility (a11y)**:
  - Form inputs must have descriptive `<label>` elements.
  - High contrast text (`4.5:1` minimum for body text).
  - Clear focus rings (`outline: none; box-shadow: 0 0 0 3px ...`).

---

## 4. Export & Reporting Standards
- **PDF Export**:
  - Must include the company title ("Atomep Enteam Pvt Ltd"), calculation title, date/time stamp, input parameter table, calculated engineering results, and regulatory code disclaimers.
- **Excel Export**:
  - Formatted columns with proper widths, styled headers, and clean numeric cell types (avoid dumping raw text strings into numeric cells).
- **Word / DOCX Export**:
  - Clean HTML layout with inline styles compatible with `html-docx.js`.

---

## 5. Security & Isolation Rules
- **No Unsafe `eval()` or unescaped `innerHTML` injection** of untrusted data.
- **No External Data Leakage**: Calculations must remain strictly client-side.
- **Offline Self-Sufficiency**: All required JS assets must reside in `assets/vendor/`.
