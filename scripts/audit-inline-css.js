#!/usr/bin/env node

/**
 * Atomep Enteam — Inline CSS Audit & Analysis Tool
 */

const fs = require('fs');
const path = require('path');

const REPO_DIR = path.resolve(__dirname, '..');
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

function findInlineStylesInHtml(html, filename) {
  // Extract all script content to check for JS DOM references
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptContent = '';
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    scriptContent += scriptMatch[1] + '\n';
  }

  // Regex to match HTML tags with style="..."
  // Captures tag name, full opening tag, and style attribute value
  const tagRegex = /<([a-zA-Z0-9_-]+)\b([^>]*?\bstyle\s*=\s*(["'])([\s\S]*?)\3[^>]*)>/gi;
  const items = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[1].toLowerCase();
    const fullTag = match[0];
    const attrs = match[2];
    const styleValue = match[4].trim();

    // Extract id if present
    const idMatch = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : null;

    // Extract class if present
    const classMatch = attrs.match(/\bclass\s*=\s*["']([^"']+)["']/i);
    const className = classMatch ? classMatch[1] : null;

    // Check if ID or class or style is referenced in JS
    let isJsReferenced = false;
    let jsReason = '';

    if (id && (scriptContent.includes(`"${id}"`) || scriptContent.includes(`'${id}'`) || scriptContent.includes(`\`${id}\``))) {
      isJsReferenced = true;
      if (scriptContent.includes(`${id}.style`) || scriptContent.includes(`getElementById('${id}').style`) || scriptContent.includes(`getElementById("${id}").style`)) {
        jsReason = `ID '${id}' style is directly manipulated by JS`;
      } else {
        jsReason = `ID '${id}' is referenced by JS`;
      }
    }

    // Check for SVG presentation attributes or dynamic CSS variables in style
    const isSvg = ['svg', 'path', 'rect', 'circle', 'text', 'g', 'line', 'polygon'].includes(tagName);
    const hasCssVars = styleValue.includes('var(--');
    const isDisplayNone = styleValue.replace(/\s/g, '').includes('display:none');

    let classification = 'STATIC';
    let reason = 'Static styling attribute';

    if (jsReason.includes('style is directly manipulated')) {
      classification = 'DYNAMIC';
      reason = jsReason;
    } else if (isSvg && (hasCssVars || isJsReferenced)) {
      classification = 'DYNAMIC';
      reason = 'SVG dynamic presentation / JS referenced element';
    } else if (isJsReferenced) {
      classification = 'REVIEW';
      reason = jsReason;
    } else if (styleValue.includes('width:') && isJsReferenced) {
      classification = 'DYNAMIC';
      reason = 'Dynamic dimensional styling';
    }

    items.push({
      file: filename,
      tagName,
      fullTag: fullTag.substring(0, 120),
      id,
      className,
      styleValue,
      classification,
      reason
    });
  }

  return items;
}

function runAudit() {
  console.log('Auditing inline styles across 13 HTML files...\n');
  const allItems = [];
  const pageStats = {};

  for (const filename of TARGET_FILES) {
    const filePath = path.join(REPO_DIR, filename);
    const html = fs.readFileSync(filePath, 'utf8');
    const items = findInlineStylesInHtml(html, filename);
    allItems.push(...items);

    const staticCount = items.filter(i => i.classification === 'STATIC').length;
    const dynamicCount = items.filter(i => i.classification === 'DYNAMIC').length;
    const reviewCount = items.filter(i => i.classification === 'REVIEW').length;

    pageStats[filename] = {
      total: items.length,
      staticCount,
      dynamicCount,
      reviewCount,
      items
    };
  }

  let report = '======================================================\n';
  report += 'Atomep Enteam — Inline CSS Audit Report\n';
  report += '======================================================\n\n';
  report += `Timestamp: ${new Date().toISOString()}\n`;
  report += `Pages scanned: ${TARGET_FILES.length}\n`;
  report += `Total inline style="" attributes found: ${allItems.length}\n\n`;

  const totalStatic = allItems.filter(i => i.classification === 'STATIC').length;
  const totalDynamic = allItems.filter(i => i.classification === 'DYNAMIC').length;
  const totalReview = allItems.filter(i => i.classification === 'REVIEW').length;

  report += `Overall Classification:\n`;
  report += `  - Static candidates (Safe to migrate): ${totalStatic}\n`;
  report += `  - Dynamic candidates (Must preserve inline / runtime): ${totalDynamic}\n`;
  report += `  - Review-required candidates: ${totalReview}\n\n`;

  report += '------------------------------------------------------\n';
  report += 'Page-by-Page Breakdown\n';
  report += '------------------------------------------------------\n';

  for (const filename of TARGET_FILES) {
    const stat = pageStats[filename];
    report += `\n[${filename}]\n`;
    report += `  Total inline styles: ${stat.total}\n`;
    report += `  Static: ${stat.staticCount} | Dynamic: ${stat.dynamicCount} | Review: ${stat.reviewCount}\n`;

    if (stat.items.length > 0) {
      report += `  Sample items:\n`;
      for (const item of stat.items.slice(0, 10)) {
        report += `    - <${item.tagName}${item.id ? ` id="${item.id}"` : ''}${item.className ? ` class="${item.className}"` : ''}> style="${item.styleValue}" -> [${item.classification}] (${item.reason})\n`;
      }
      if (stat.items.length > 10) {
        report += `    ... and ${stat.items.length - 10} more items\n`;
      }
    }
  }

  const reportPath = path.join(REPO_DIR, 'css-inline-audit-report.txt');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(report);
  console.log(`Audit report written to: ${reportPath}\n`);
}

runAudit();
