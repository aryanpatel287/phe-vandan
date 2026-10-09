#!/usr/bin/env bash

# ==============================================================================
# Atomep Enteam — Consolidate CSS & Extract Inline Styles Script
# ==============================================================================

set -Eeuo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="${REPO_DIR}/scripts/consolidate-css.js"

if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required to run this script." >&2
    exit 1
fi

chmod +x "${SCRIPT}" 2>/dev/null || true

node "${SCRIPT}" "$@"
