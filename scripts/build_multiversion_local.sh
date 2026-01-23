#!/usr/bin/env bash
# Thin wrapper for local multi-version documentation builds
# Calls the Python orchestrator with appropriate environment

set -e

# Get script directory and repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Check for conda environment
if [ -z "$CONDA_PREFIX" ]; then
    echo "⚠ Warning: No conda environment detected"
    echo "   Some features may not work correctly"
    echo ""
fi

# Run Python orchestrator
python3 "$SCRIPT_DIR/build_docs.py" \
    --config "$SCRIPT_DIR/versions.yaml" \
    "$@"
