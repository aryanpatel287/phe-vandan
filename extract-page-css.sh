#!/usr/bin/env bash

# ==============================================================================
# Atomep Enteam — Extract Page-Specific CSS Script
# ==============================================================================

set -Eeuo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="${REPO_DIR}/scripts/extract-page-css.js"

if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required to run this script." >&2
    exit 1
fi

chmod +x "${SCRIPT}" 2>/dev/null || true

node "${SCRIPT}" "$@"
