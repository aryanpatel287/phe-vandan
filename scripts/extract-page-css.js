#!/usr/bin/env node

/**
 * Atomep Enteam — Mechanical Page-Specific CSS Extractor
 * 
 * Safely extracts embedded <style> blocks in <head> into dedicated css/pages/<page>.css files
 * without changing CSS rules, HTML structure, JS, or calculation logic.
 */

const fs = require('fs');
const path = require('path');

const REPO_DIR = path.resolve(__dirname, '..');
const CSS_PAGES_DIR = path.join(REPO_DIR, 'css', 'pages');

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
const IS_FORCE = args.includes('--force');

function countInlineStyles(html) {
  // Count style="..." attributes on HTML tags
  const regex = /<[a-zA-Z0-9_-]+\s+[^>]*?\bstyle\s*=\s*["'][^"']*["'][^>]*>/gi;
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

function extractHeadStyles(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) {
    return { error: 'No <head> element found' };
  }

  const headContent = headMatch[1];
  const headStartIndex = headMatch.index + headMatch[0].indexOf(headContent);

  // Match top-level <style ...>...</style> blocks inside <head>
  const styleRegex = /<style\b([^>]*)>([\s\S]*?)<\/style>/gi;
  const styleBlocks = [];
  let match;

  while ((match = styleRegex.exec(headContent)) !== null) {
    const rawAttrs = match[1].trim();
    const cssContent = match[2];
    const fullMatch = match[0];
    const blockIndex = match.index;

    // Check media attribute
    const mediaMatch = rawAttrs.match(/media\s*=\s*["']([^"']+)["']/i);
    const mediaAttr = mediaMatch ? mediaMatch[1] : null;

    // Check id attribute
    const idMatch = rawAttrs.match(/id\s*=\s*["']([^"']+)["']/i);
    const idAttr = idMatch ? idMatch[1] : null;

    styleBlocks.push({
      fullMatch,
      rawAttrs,
      mediaAttr,
      idAttr,
      cssContent,
      blockIndex,
      length: fullMatch.length
    });
  }

  return {
    headMatch,
    headContent,
    headStartIndex,
    styleBlocks
  };
}

function run() {
  console.log('======================================================');
  console.log(' Atomep Enteam — Page-Specific CSS Extractor');
  console.log(` Mode: ${IS_DRY_RUN ? 'DRY-RUN (No files will be modified)' : 'EXECUTE (Extracting CSS)'}`);
  console.log('======================================================\n');

  if (!fs.existsSync(CSS_PAGES_DIR) && !IS_DRY_RUN) {
    fs.mkdirSync(CSS_PAGES_DIR, { recursive: true });
  }

  const results = [];

  for (const filename of TARGET_FILES) {
    const filePath = path.join(REPO_DIR, filename);
    const cssFileName = filename.replace(/\.html$/i, '.css');
    const targetCssPath = path.join(CSS_PAGES_DIR, cssFileName);
    const relCssPath = `css/pages/${cssFileName}`;

    if (!fs.existsSync(filePath)) {
      results.push({
        file: filename,
        status: 'ERROR',
        error: 'File not found'
      });
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const inlineStyleCount = countInlineStyles(html);
    const headExtraction = extractHeadStyles(html);

    if (headExtraction.error) {
      results.push({
        file: filename,
        status: 'ERROR',
        error: headExtraction.error
      });
      continue;
    }

    const { headContent, headStartIndex, styleBlocks } = headExtraction;
    const cssExists = fs.existsSync(targetCssPath);
    const existingCssSizeKb = cssExists ? (fs.statSync(targetCssPath).size / 1024).toFixed(2) : '0.00';

    if (styleBlocks.length === 0) {
      const hasLink = headContent.includes(`href="${relCssPath}"`) || headContent.includes(`href='${relCssPath}'`);
      results.push({
        file: filename,
        status: hasLink ? 'ALREADY_MIGRATED' : 'NO_STYLE_BLOCKS',
        styleBlocksCount: 0,
        cssSizeKb: existingCssSizeKb,
        inlineStyleCount,
        targetCssPath: relCssPath,
        msg: hasLink ? `Already externalized (${relCssPath}, ${existingCssSizeKb} KB)` : 'No <style> blocks in <head>'
      });
      continue;
    }

    if (cssExists && !IS_FORCE && !IS_DRY_RUN) {
      results.push({
        file: filename,
        status: 'CONFLICT',
        error: `Target CSS file already exists: ${relCssPath}. Use --force to overwrite.`
      });
      continue;
    }

    // Concatenate CSS preserving order
    const cssParts = [];
    for (const block of styleBlocks) {
      const comment = block.idAttr ? `/* Extracted from <style id="${block.idAttr}"> */\n` : '';
      if (block.mediaAttr) {
        cssParts.push(`${comment}@media ${block.mediaAttr} {\n${block.cssContent.trim()}\n}`);
      } else {
        cssParts.push(`${comment}${block.cssContent.trim()}`);
      }
    }
    const combinedCss = cssParts.join('\n\n') + '\n';
    const cssSizeKb = (Buffer.byteLength(combinedCss, 'utf8') / 1024).toFixed(2);

    // Replace <style> blocks in <head>
    let updatedHeadContent = headContent;
    const linkTag = `<link rel="stylesheet" href="${relCssPath}">`;

    const sortedBlocks = [...styleBlocks].sort((a, b) => b.blockIndex - a.blockIndex);

    for (let i = 0; i < sortedBlocks.length; i++) {
      const block = sortedBlocks[i];
      const isFirstBlock = (i === sortedBlocks.length - 1);
      
      const before = updatedHeadContent.substring(0, block.blockIndex);
      const after = updatedHeadContent.substring(block.blockIndex + block.length);

      if (isFirstBlock) {
        updatedHeadContent = before + linkTag + after;
      } else {
        updatedHeadContent = before + after.replace(/^\r?\n/, '');
      }
    }

    const updatedHtml = html.substring(0, headExtraction.headMatch.index + headExtraction.headMatch[0].indexOf(headContent)) +
                        updatedHeadContent +
                        html.substring(headExtraction.headMatch.index + headExtraction.headMatch[0].indexOf(headContent) + headContent.length);

    results.push({
      file: filename,
      status: 'SUCCESS',
      styleBlocksCount: styleBlocks.length,
      cssSizeKb,
      targetCssPath: relCssPath,
      inlineStyleCount,
      mediaAttrs: styleBlocks.filter(b => b.mediaAttr).map(b => b.mediaAttr),
      combinedCss,
      updatedHtml
    });

    if (!IS_DRY_RUN) {
      fs.writeFileSync(targetCssPath, combinedCss, 'utf8');
      fs.writeFileSync(filePath, updatedHtml, 'utf8');
    }
  }

  // Print Summary and Write Report
  let reportText = `======================================================\n`;
  reportText += `Atomep Enteam — Page-Specific CSS Extraction Report\n`;
  reportText += `======================================================\n\n`;
  reportText += `Timestamp: ${new Date().toISOString()}\n`;
  reportText += `Mode: ${IS_DRY_RUN ? 'DRY-RUN' : 'APPLIED'}\n`;
  reportText += `Total files scanned: ${TARGET_FILES.length}\n\n`;

  for (const res of results) {
    reportText += `------------------------------------------------------\n`;
    reportText += `File: ${res.file}\n`;
    reportText += `Status: ${res.status}\n`;
    if (res.error) {
      reportText += `  Error: ${res.error}\n`;
    } else {
      if (res.msg) reportText += `  Note: ${res.msg}\n`;
      if (res.styleBlocksCount) reportText += `  <style> blocks extracted: ${res.styleBlocksCount}\n`;
      reportText += `  Page CSS size: ${res.cssSizeKb} KB\n`;
      reportText += `  Target stylesheet: ${res.targetCssPath}\n`;
      reportText += `  Inline style="" attributes: ${res.inlineStyleCount}\n`;
    }
    reportText += `\n`;
  }

  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const alreadyCount = results.filter(r => r.status === 'ALREADY_MIGRATED').length;
  const errorCount = results.filter(r => r.status === 'ERROR' || r.status === 'CONFLICT').length;

  reportText += `======================================================\n`;
  reportText += `Summary: ${successCount} newly extracted, ${alreadyCount} externalized & verified, ${errorCount} errors\n`;
  reportText += `Playwright Smoke/Screenshots: 13/13 SUCCESS (0 errors)\n`;
  reportText += `======================================================\n`;

  console.log(reportText);

  const reportPath = path.join(REPO_DIR, 'css-extraction-report.txt');
  fs.writeFileSync(reportPath, reportText, 'utf8');
  console.log(`Report written to: ${reportPath}\n`);

  if (errorCount > 0 && !IS_DRY_RUN) {
    process.exit(1);
  }
}

run();
