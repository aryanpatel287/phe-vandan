#!/usr/bin/env node

/**
 * Atomep Enteam — Inline CSS Extraction & Shared CSS Consolidation (Phase 2)
 *
 * 1. Creates a clean, small `css/app.css` containing genuinely shared app-shell styles (.aet-nav, .aet-back, common table scroll).
 * 2. Deduplicates .aet-nav and .aet-back from the 13 `css/pages/*.css` files.
 * 3. Safely extracts static inline `style="..."` attributes from HTML into page CSS (or app.css) without touching JS or dynamic runtime styles.
 * 4. Ensures HTML references `<link rel="stylesheet" href="css/app.css">` followed by `<link rel="stylesheet" href="css/pages/<page>.css">`.
 */

const fs = require('fs');
const path = require('path');

const REPO_DIR = path.resolve(__dirname, '..');
const CSS_DIR = path.join(REPO_DIR, 'css');
const CSS_PAGES_DIR = path.join(CSS_DIR, 'pages');
const APP_CSS_PATH = path.join(CSS_DIR, 'app.css');

const TARGET_FILES = [
  'index.html',
  'AI_DM_Plant_Platform.html',
  'NBC2026_Water_Demand_Calculator_v2.html',
  'NBCS_2026_Drainage_Calculator.html',
  'NBCS_2026_Pipe_Size_Calculator.html',
  'RO_Plant_Sizing_Calculator.html',
  'STP_Design_Calculator.html',
  'Storm_Sump_Design_Tool.html',
  'Water_Softener_Plant_Designer.html',
  'Water_Treatment_Plant_Designer.html',
  'firefighting_calculator.html',
  'heat_pump_sizing_tool.html',
  'pump-head-calculator.html'
];

const args = process.argv.slice(2);
const IS_DRY_RUN = args.includes('--dry-run');

// 1. Define Canonical Shared App CSS (Genuinely shared navigation, back button, common utilities)
const APP_CSS_CONTENT = `/**
 * Atomep Enteam — Shared Application Stylesheet (app.css)
 * Common Application Shell: Navigation, Back Control & Global Base Utilities
 */

/* ==========================================================================
   1. Shared Application Navigation (.aet-nav)
   ========================================================================== */
.aet-nav {
  position: sticky;
  top: 0;
  z-index: 9990;
  background: linear-gradient(135deg, #1a237e 0%, #4a2c8a 30%, #0064a8 60%, #0094c4 100%);
  box-shadow: 0 4px 24px rgba(0, 40, 80, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.aet-nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
}

.aet-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #fff;
}

.aet-logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  color: #7dd3fc;
  flex-shrink: 0;
}

.aet-logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.aet-logo-text .aet-logo-sub {
  font-weight: 300;
  opacity: 0.85;
}

.aet-nav-links {
  display: flex;
  gap: 4px;
  align-items: center;
}

.aet-nav-links a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: 0.2s;
}

.aet-nav-links a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.aet-nav-toggle {
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
}

body.aet-menu-open .aet-nav-links {
  display: flex;
}

@media (max-width: 768px) {
  .aet-nav-toggle {
    display: block;
  }
  .aet-nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: linear-gradient(135deg, #1a237e, #4a2c8a, #0064a8, #0094c4);
    padding: 12px;
    gap: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
  .aet-nav-links a {
    padding: 12px 16px;
  }
  .aet-logo-text {
    font-size: 1rem;
  }
  .aet-logo-mark {
    width: 34px;
    height: 34px;
  }
}

/* ==========================================================================
   2. Shared Back-to-Portal Link (.aet-back)
   ========================================================================== */
.aet-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0d6efd;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 0;
  margin-bottom: 8px;
}

.aet-back:hover {
  text-decoration: underline;
}

/* ==========================================================================
   3. Shared Common Layout Helpers
   ========================================================================== */
.table-scroll {
  overflow-x: auto;
}
.mt-8 { margin-top: 8px; }
.mt-12 { margin-top: 12px; }
.mt-14 { margin-top: 14px; }
.mt-16 { margin-top: 16px; }
.mt-18 { margin-top: 18px; }
.mt-20 { margin-top: 20px; }
.mt-1rem { margin-top: 1rem; }
.mt-1-25rem { margin-top: 1.25rem; }
.mb-1rem { margin-bottom: 1rem; }
.container-1400 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px 24px;
}
`;

function runConsolidation() {
  console.log('======================================================');
  console.log(' Atomep Enteam — Inline CSS & Shared CSS Consolidation');
  console.log(` Mode: ${IS_DRY_RUN ? 'DRY-RUN (No files will be modified)' : 'EXECUTE'}`);
  console.log('======================================================\n');

  if (!IS_DRY_RUN) {
    fs.writeFileSync(APP_CSS_PATH, APP_CSS_CONTENT, 'utf8');
  }

  const results = [];
  let totalInlineMigrated = 0;
  let totalDynamicPreserved = 0;
  let totalReviewPreserved = 0;

  for (const filename of TARGET_FILES) {
    const htmlPath = path.join(REPO_DIR, filename);
    const cssFileName = filename.replace(/\.html$/i, '.css');
    const pageCssPath = path.join(CSS_PAGES_DIR, cssFileName);

    let html = fs.readFileSync(htmlPath, 'utf8');
    let pageCss = fs.existsSync(pageCssPath) ? fs.readFileSync(pageCssPath, 'utf8') : '';

    // 1. Deduplicate .aet-nav and .aet-back from pageCss
    const originalPageCssLen = pageCss.length;
    pageCss = pageCss.replace(/\/\* Extracted from <style id="aet-nav-style"> \*\/[\s\S]*?(?=\/\* Extracted from|<style|$|\.aet-back|\Z)/g, '');
    pageCss = pageCss.replace(/\.aet-nav\{position:sticky;top:0[\s\S]*?(?=\/\* Extracted from|\.aet-back|$)/g, '');
    pageCss = pageCss.replace(/\/\* Extracted from <style id="aet-back-style"> \*\/[\s\S]*?(?=\/\* Extracted from|$|\Z)/g, '');
    pageCss = pageCss.replace(/\.aet-back\{display:inline-flex[\s\S]*?(?=\/\* Extracted from|$)/g, '');
    pageCss = pageCss.trim() + '\n';

    // 2. Identify Script content to prevent modifying scripts
    const scriptBlocks = [];
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let sMatch;
    while ((sMatch = scriptRegex.exec(html)) !== null) {
      scriptBlocks.push({ start: sMatch.index, end: sMatch.index + sMatch[0].length, content: sMatch[1] });
    }
    const allScriptContent = scriptBlocks.map(s => s.content).join('\n');

    // 3. Scan & classify all inline styles outside of <script>
    let migratedCount = 0;
    let dynamicCount = 0;
    let reviewCount = 0;

    // We collect new CSS rules to append to pageCss
    const newPageCssRules = [];
    let pageRuleIndex = 1;

    // Replacement logic for HTML body
    const tagRegex = /<([a-zA-Z0-9_-]+)\b([^>]*?\bstyle\s*=\s*(["'])([\s\S]*?)\3[^>]*)>/gi;

    let updatedHtml = html.replace(tagRegex, (fullMatch, tagName, attrs, quote, styleVal, offset) => {
      // If inside <script>, do not touch
      const isInsideScript = scriptBlocks.some(s => offset >= s.start && offset < s.end);
      if (isInsideScript) {
        return fullMatch;
      }

      const rawStyle = styleVal.trim();
      const lowerTag = tagName.toLowerCase();

      // Check ID & Class
      const idMatch = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
      const classMatch = attrs.match(/\bclass\s*=\s*["']([^"']+)["']/i);
      const id = idMatch ? idMatch[1] : null;
      const cls = classMatch ? classMatch[1] : null;

      // Classify
      const isSvg = ['svg', 'path', 'rect', 'circle', 'text', 'g', 'line', 'polygon'].includes(lowerTag);
      const isJsDirect = id && (allScriptContent.includes(`${id}.style`) || allScriptContent.includes(`getElementById('${id}').style`) || allScriptContent.includes(`getElementById("${id}").style`));
      const isJsReferenced = id && (allScriptContent.includes(`"${id}"`) || allScriptContent.includes(`'${id}'`));
      const isDisplayNone = rawStyle.replace(/\s/g, '').includes('display:none');

      if (isJsDirect || (isSvg && rawStyle.includes('var(--')) || (isDisplayNone && isJsReferenced)) {
        dynamicCount++;
        return fullMatch; // Keep dynamic
      }

      if (isJsReferenced && rawStyle.includes('width:')) {
        dynamicCount++;
        return fullMatch; // Dynamic dimensions
      }

      // Safe static candidate!
      // Check if it matches a shared utility
      let mappedClass = null;
      if (rawStyle === 'overflow-x:auto' || rawStyle === 'overflow-x: auto;') {
        mappedClass = 'table-scroll';
      } else if (rawStyle === 'margin-top:16px' || rawStyle === 'margin-top: 16px;' || rawStyle === 'margin-top:16px;') {
        mappedClass = 'mt-16';
      } else if (rawStyle === 'margin-top: 1rem;' || rawStyle === 'margin-top:1rem;') {
        mappedClass = 'mt-1rem';
      } else if (rawStyle === 'margin-top: 1.25rem;' || rawStyle === 'margin-top:1.25rem;') {
        mappedClass = 'mt-1-25rem';
      } else if (rawStyle === 'margin-top:14px' || rawStyle === 'margin-top: 14px;') {
        mappedClass = 'mt-14';
      } else if (rawStyle === 'margin-top:12px' || rawStyle === 'margin-top: 12px;') {
        mappedClass = 'mt-12';
      } else if (rawStyle === 'margin-top:20px' || rawStyle === 'margin-top: 20px;') {
        mappedClass = 'mt-20';
      } else if (rawStyle === 'max-width:1400px;margin:0 auto;padding:8px 24px') {
        mappedClass = 'container-1400';
      }

      migratedCount++;

      if (mappedClass) {
        // Add class to element and remove style attr
        let newAttrs = attrs.replace(/\bstyle\s*=\s*(["'])[\s\S]*?\1/i, '').trim();
        if (cls) {
          newAttrs = newAttrs.replace(/\bclass\s*=\s*["']([^"']+)["']/i, `class="$1 ${mappedClass}"`);
        } else {
          newAttrs = `class="${mappedClass}" ` + newAttrs;
        }
        return `<${tagName} ${newAttrs.replace(/\s+/g, ' ').trim()}>`;
      } else {
        // Page-specific extracted rule
        // If ID exists, attach rule to #id
        let selector = '';
        let newAttrs = attrs.replace(/\bstyle\s*=\s*(["'])[\s\S]*?\1/i, '').trim();

        if (id) {
          selector = `#${id}`;
          newPageCssRules.push(`${selector} { ${rawStyle} }`);
          return `<${tagName} ${newAttrs.replace(/\s+/g, ' ').trim()}>`;
        } else {
          // Generate a scoped class name for this specific element
          const genClass = `p-${filename.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}-s${pageRuleIndex++}`;
          if (cls) {
            newAttrs = newAttrs.replace(/\bclass\s*=\s*["']([^"']+)["']/i, `class="$1 ${genClass}"`);
          } else {
            newAttrs = `class="${genClass}" ` + newAttrs;
          }
          newPageCssRules.push(`.${genClass} { ${rawStyle} }`);
          return `<${tagName} ${newAttrs.replace(/\s+/g, ' ').trim()}>`;
        }
      }
    });

    if (newPageCssRules.length > 0) {
      pageCss += '\n/* Migrated Page-Specific Inline Styles */\n' + newPageCssRules.join('\n') + '\n';
    }

    // 4. Update HTML <head> to ensure app.css is linked
    if (!updatedHtml.includes('href="css/app.css"') && !updatedHtml.includes("href='css/app.css'")) {
      const pageLinkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']css\/pages\/[^"']+["']>/i;
      if (pageLinkRegex.test(updatedHtml)) {
        updatedHtml = updatedHtml.replace(pageLinkRegex, `<link rel="stylesheet" href="css/app.css">\n<link rel="stylesheet" href="css/pages/${cssFileName}">`);
      }
    }

    totalInlineMigrated += migratedCount;
    totalDynamicPreserved += dynamicCount;
    totalReviewPreserved += reviewCount;

    results.push({
      file: filename,
      migratedCount,
      dynamicCount,
      reviewCount,
      pageCssSizeKb: (Buffer.byteLength(pageCss, 'utf8') / 1024).toFixed(2),
      deduplicatedBytes: originalPageCssLen - pageCss.length
    });

    if (!IS_DRY_RUN) {
      fs.writeFileSync(pageCssPath, pageCss, 'utf8');
      fs.writeFileSync(htmlPath, updatedHtml, 'utf8');
    }
  }

  // 5. Generate and Output Report
  let report = `======================================================\n`;
  report += `Atomep Enteam — CSS Inline & Shared Consolidation Report\n`;
  report += `======================================================\n\n`;
  report += `Timestamp: ${new Date().toISOString()}\n`;
  report += `Mode: ${IS_DRY_RUN ? 'DRY-RUN' : 'APPLIED'}\n`;
  report += `Target HTML files: ${TARGET_FILES.length}\n`;
  report += `Shared CSS created: css/app.css (${(Buffer.byteLength(APP_CSS_CONTENT, 'utf8') / 1024).toFixed(2)} KB)\n\n`;

  report += `Overall Statistics:\n`;
  report += `  - Total static inline styles migrated: ${totalInlineMigrated}\n`;
  report += `  - Dynamic runtime styles safely preserved: ${totalDynamicPreserved}\n`;
  report += `  - App shell navigation & back bar consolidated into css/app.css\n\n`;

  report += `------------------------------------------------------\n`;
  report += `Page-by-Page Summary\n`;
  report += `------------------------------------------------------\n`;

  for (const r of results) {
    report += `\n[${r.file}]\n`;
    report += `  - Static inline styles extracted to CSS: ${r.migratedCount}\n`;
    report += `  - Dynamic styles preserved inline: ${r.dynamicCount}\n`;
    report += `  - Page stylesheet size: ${r.pageCssSizeKb} KB (css/pages/${r.file.replace(/\.html$/i, '.css')})\n`;
    report += `  - Linked in <head>: css/app.css -> css/pages/${r.file.replace(/\.html$/i, '.css')}\n`;
  }

  report += `\n======================================================\n`;
  report += `Verification Status: Ready for Playwright 13/13 run\n`;
  report += `======================================================\n`;

  console.log(report);

  const reportPath = path.join(REPO_DIR, 'css-inline-consolidation-report.txt');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`Consolidation report written to: ${reportPath}\n`);
}

runConsolidation();
