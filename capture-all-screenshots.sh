#!/usr/bin/env bash

set -Eeuo pipefail

# ============================================================
# Atomep Enteam - Full Website Screenshot Automation
# Ubuntu + Node.js + Playwright + Chromium
# ============================================================

# -----------------------------
# Configuration
# -----------------------------

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-8000}"
HOST="127.0.0.1"
BASE_URL="http://${HOST}:${PORT}"

SCREENSHOT_DIR="${REPO_DIR}/screenshots"
PLAYWRIGHT_DIR="${REPO_DIR}/screenshot-runner"

SERVER_PID=""

# -----------------------------
# Helper functions
# -----------------------------

log() {
    printf '\n\033[1;34m[SCREENSHOT]\033[0m %s\n' "$1"
}

success() {
    printf '\033[1;32m[OK]\033[0m %s\n' "$1"
}

warn() {
    printf '\033[1;33m[WARN]\033[0m %s\n' "$1"
}

error() {
    printf '\033[1;31m[ERROR]\033[0m %s\n' "$1"
}

cleanup() {
    if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
        log "Stopping local HTTP server..."
        kill "${SERVER_PID}" 2>/dev/null || true
        wait "${SERVER_PID}" 2>/dev/null || true
    fi
}

trap cleanup EXIT INT TERM

# -----------------------------
# Check repository
# -----------------------------

log "Repository: ${REPO_DIR}"

if [[ ! -f "${REPO_DIR}/index.html" ]]; then
    error "index.html was not found."
    exit 1
fi

success "index.html found."

# -----------------------------
# Check Node.js
# -----------------------------

if ! command -v node >/dev/null 2>&1; then

    warn "Node.js is not installed."

    if command -v apt >/dev/null 2>&1; then
        log "Installing Node.js and npm..."

        sudo apt update
        sudo apt install -y nodejs npm
    else
        error "APT is unavailable. Please install Node.js manually."
        exit 1
    fi
fi

NODE_VERSION="$(node --version)"
NPM_VERSION="$(npm --version)"

success "Node.js ${NODE_VERSION}"
success "npm ${NPM_VERSION}"

# -----------------------------
# Create Playwright workspace
# -----------------------------

mkdir -p "${PLAYWRIGHT_DIR}"

cd "${PLAYWRIGHT_DIR}"

# -----------------------------
# Initialize npm project
# -----------------------------

if [[ ! -f package.json ]]; then
    log "Creating local npm project..."
    npm init -y >/dev/null
fi

# -----------------------------
# Install Playwright
# -----------------------------

if [[ ! -d node_modules/playwright ]]; then
    log "Installing Playwright..."

    npm install --save-dev playwright
else
    success "Playwright already installed."
fi

# -----------------------------
# Install Chromium
# -----------------------------

log "Checking Chromium..."

npx playwright install chromium

success "Playwright Chromium ready."

# -----------------------------
# Create screenshot directory
# -----------------------------

mkdir -p "${SCREENSHOT_DIR}"

# Do not delete old screenshots automatically.
# Instead create a timestamped run directory.

RUN_TIMESTAMP="$(date '+%Y-%m-%d_%H-%M-%S')"

RUN_DIR="${SCREENSHOT_DIR}/${RUN_TIMESTAMP}"

mkdir -p "${RUN_DIR}"

log "Screenshots will be saved to:"
echo "${RUN_DIR}"

# -----------------------------
# Create Playwright script
# -----------------------------

cat > "${PLAYWRIGHT_DIR}/capture.js" <<'NODE_SCRIPT'

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const repoDir = process.env.REPO_DIR;
const baseUrl = process.env.BASE_URL;
const outputDir = process.env.OUTPUT_DIR;

const indexPath = path.join(repoDir, "index.html");

function safeFilename(filename) {
    return filename
        .replace(/\.html$/i, "")
        .replace(/[^a-zA-Z0-9._-]+/g, "_")
        .replace(/^_+|_+$/g, "") || "page";
}

function extractLocalHtmlLinks(html) {

    const links = [];
    const seen = new Set();

    /*
     * Match:
     *
     * href="something.html"
     * href='something.html'
     *
     * Ignore:
     * - anchors (#tools)
     * - external URLs
     * - javascript:
     * - mailto:
     * - non-html links
     */

    const regex = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi;

    let match;

    while ((match = regex.exec(html)) !== null) {

        let href = match[1].trim();

        if (!href) continue;

        if (
            href.startsWith("#") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("//") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:")
        ) {
            continue;
        }

        // Remove URL fragment.
        href = href.split("#")[0];

        // Remove query string.
        href = href.split("?")[0];

        if (!/\.html$/i.test(href)) {
            continue;
        }

        // Normalize path.
        const normalized = path.normalize(href);

        // Security: only accept files within repository.
        const absolute = path.resolve(repoDir, normalized);

        if (
            absolute !== repoDir &&
            !absolute.startsWith(repoDir + path.sep)
        ) {
            continue;
        }

        const relative = path.relative(repoDir, absolute);

        if (!fs.existsSync(absolute)) {
            console.warn(`[WARN] Linked file does not exist: ${relative}`);
            continue;
        }

        if (!seen.has(relative)) {
            seen.add(relative);
            links.push(relative);
        }
    }

    return links;
}

async function waitForPageToSettle(page) {

    // Give JavaScript applications time to execute.
    await page.waitForLoadState("domcontentloaded", {
        timeout: 30000
    }).catch(() => {});

    await page.waitForLoadState("load", {
        timeout: 30000
    }).catch(() => {});

    // Allow fonts/images/charts and other JS rendering to settle.
    await page.waitForTimeout(1500);

    // Wait for document fonts.
    await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
    }).catch(() => {});

    // Give canvas/chart rendering a little extra time.
    await page.waitForTimeout(1000);
}

async function main() {

    console.log("");
    console.log("==============================================");
    console.log(" Atomep Enteam Screenshot Automation");
    console.log("==============================================");
    console.log("");

    const indexHtml = fs.readFileSync(indexPath, "utf8");

    const discoveredLinks = extractLocalHtmlLinks(indexHtml);

    /*
     * Always include index.html first.
     */
    const pages = [
        "index.html",
        ...discoveredLinks.filter(
            file => file.toLowerCase() !== "index.html"
        )
    ];

    /*
     * Remove duplicates while preserving order.
     */
    const uniquePages = [...new Set(pages)];

    console.log(`Discovered ${uniquePages.length} HTML pages:`);
    console.log("");

    uniquePages.forEach((page, i) => {
        console.log(`  ${String(i + 1).padStart(2, "0")}. ${page}`);
    });

    console.log("");

    const browser = await chromium.launch({
        headless: true
    });

    const context = await browser.newContext({
        viewport: {
            width: 1920,
            height: 1080
        },

        deviceScaleFactor: 1,

        /*
         * Keep animations/transitions from producing inconsistent
         * screenshots.
         */
        colorScheme: "light",

        locale: "en-US"
    });

    const results = [];

    for (let i = 0; i < uniquePages.length; i++) {

        const relativeFile = uniquePages[i];

        const urlPath = relativeFile
            .split(path.sep)
            .map(encodeURIComponent)
            .join("/");

        const url = `${baseUrl}/${urlPath}`;

        const number = String(i + 1).padStart(2, "0");

        const filename =
            `${number}-${safeFilename(path.basename(relativeFile))}.png`;

        const outputPath = path.join(outputDir, filename);

        console.log(
            `[${number}/${String(uniquePages.length).padStart(2, "0")}] ` +
            `Opening ${relativeFile}`
        );

        const page = await context.newPage();

        // Capture browser/page errors but don't immediately abort.
        const pageErrors = [];

        page.on("pageerror", error => {
            pageErrors.push(`PAGE ERROR: ${error.message}`);
        });

        page.on("console", message => {

            if (message.type() === "error") {
                pageErrors.push(`CONSOLE ERROR: ${message.text()}`);
            }

        });

        try {

            await page.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: 60000
            });

            await waitForPageToSettle(page);

            /*
             * Disable CSS animations/transitions for stable screenshots.
             */
            await page.addStyleTag({
                content: `
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0s !important;
                        animation-delay: 0s !important;
                        transition-duration: 0s !important;
                        transition-delay: 0s !important;
                        scroll-behavior: auto !important;
                    }
                `
            }).catch(() => {});

            await page.waitForTimeout(500);

            /*
             * Full-page screenshot.
             */
            await page.screenshot({
                path: outputPath,
                fullPage: true,
                animations: "disabled"
            });

            const title = await page.title().catch(() => "");

            const dimensions = await page.evaluate(() => ({
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight
            })).catch(() => ({
                width: 0,
                height: 0
            }));

            results.push({
                file: relativeFile,
                screenshot: filename,
                status: "SUCCESS",
                title,
                width: dimensions.width,
                height: dimensions.height,
                errors: pageErrors
            });

            console.log(
                `       ✓ Saved ${filename} ` +
                `(${dimensions.width} × ${dimensions.height}px)`
            );

            if (pageErrors.length > 0) {
                console.log(
                    `       ⚠ Page reported ${pageErrors.length} error(s)`
                );
            }

        } catch (error) {

            results.push({
                file: relativeFile,
                screenshot: filename,
                status: "FAILED",
                error: error.message,
                errors: pageErrors
            });

            console.error(
                `       ✗ Failed: ${error.message}`
            );
        }

        await page.close();
    }

    await browser.close();

    /*
     * Write report.
     */
    const reportPath = path.join(outputDir, "screenshot-report.txt");

    const successful =
        results.filter(result => result.status === "SUCCESS");

    const failed =
        results.filter(result => result.status === "FAILED");

    let report = "";

    report += "Atomep Enteam Screenshot Report\n";
    report += "================================\n\n";

    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Base URL: ${baseUrl}\n`;
    report += `Viewport: 1920 × 1080\n`;
    report += `Total pages: ${results.length}\n`;
    report += `Successful: ${successful.length}\n`;
    report += `Failed: ${failed.length}\n\n`;

    for (const result of results) {

        report += "----------------------------------------\n";
        report += `File: ${result.file}\n`;
        report += `Status: ${result.status}\n`;

        if (result.screenshot) {
            report += `Screenshot: ${result.screenshot}\n`;
        }

        if (result.title) {
            report += `Title: ${result.title}\n`;
        }

        if (result.width) {
            report +=
                `Page dimensions: ${result.width} × ${result.height}px\n`;
        }

        if (result.error) {
            report += `Error: ${result.error}\n`;
        }

        if (result.errors && result.errors.length) {
            report += "\nBrowser/page errors:\n";

            for (const error of result.errors) {
                report += `  - ${error}\n`;
            }
        }

        report += "\n";
    }

    fs.writeFileSync(reportPath, report);

    console.log("");
    console.log("==============================================");
    console.log(" Screenshot run completed");
    console.log("==============================================");
    console.log("");
    console.log(`Total:      ${results.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed:     ${failed.length}`);
    console.log("");
    console.log(`Output:     ${outputDir}`);
    console.log(`Report:     ${reportPath}`);
    console.log("");

    if (failed.length > 0) {
        process.exitCode = 1;
    }
}

main().catch(error => {
    console.error("");
    console.error("FATAL ERROR:");
    console.error(error);
    process.exit(1);
});

NODE_SCRIPT

# -----------------------------
# Start local HTTP server
# -----------------------------

cd "${REPO_DIR}"

log "Starting local HTTP server..."

python3 -m http.server \
    "${PORT}" \
    --bind "${HOST}" \
    --directory "${REPO_DIR}" \
    > "${PLAYWRIGHT_DIR}/http-server.log" 2>&1 &

SERVER_PID=$!

# -----------------------------
# Wait for server
# -----------------------------

log "Waiting for local server..."

SERVER_READY=0

for i in {1..30}; do

    if curl -fsS "${BASE_URL}/index.html" >/dev/null 2>&1; then
        SERVER_READY=1
        break
    fi

    sleep 0.5

done

if [[ "${SERVER_READY}" -ne 1 ]]; then
    error "Local HTTP server did not start."

    if [[ -f "${PLAYWRIGHT_DIR}/http-server.log" ]]; then
        cat "${PLAYWRIGHT_DIR}/http-server.log"
    fi

    exit 1
fi

success "Local server running at ${BASE_URL}"

# -----------------------------
# Run Playwright
# -----------------------------

export REPO_DIR
export BASE_URL
export OUTPUT_DIR="${RUN_DIR}"

log "Starting screenshot capture..."

cd "${PLAYWRIGHT_DIR}"

node capture.js

# -----------------------------
# Final output
# -----------------------------

echo ""
success "All processing finished."

echo ""
echo "Screenshots:"
echo "  ${RUN_DIR}"

echo ""
echo "To open the screenshot folder:"
echo "  xdg-open \"${RUN_DIR}\""

echo ""
echo "To open the report:"
echo "  xdg-open \"${RUN_DIR}/screenshot-report.txt\""

echo ""
