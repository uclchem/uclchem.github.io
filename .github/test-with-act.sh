#!/bin/bash
# Test GitHub Actions workflow locally with act

set -e

echo "================================================="
echo "  Testing GitHub Actions Workflow with act"
echo "================================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi
echo "✓ Docker is running"

# Check if act is installed
if ! command -v act &> /dev/null; then
    echo "❌ Error: act is not installed"
    echo "Install with: brew install act"
    exit 1
fi
echo "✓ act is installed ($(act --version))"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo ""
    echo "⚠ Warning: Not in a git repository"
    echo "Initializing temporary git repo for testing..."
    git init
    git config user.email "test@example.com"
    git config user.name "Test User"
    git add .
    git commit -m "Test commit for act" > /dev/null
    echo "✓ Temporary git repo initialized"
fi

echo ""
echo "================================================="
echo "  Workflow Validation"
echo "================================================="

# Validate YAML syntax
if python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-docs.yml'))" 2>/dev/null; then
    echo "✓ YAML syntax is valid"
else
    echo "❌ YAML syntax error"
    exit 1
fi

# List workflows
echo ""
echo "Available workflows and jobs:"
act --container-architecture linux/amd64 --list 2>/dev/null | grep -v "^INFO" | grep -v "^WARN"

echo ""
echo "================================================="
echo "  Dry-Run Test"
echo "================================================="
echo ""
echo "Running dry-run (no actual execution)..."
echo ""

# Run dry-run
act --container-architecture linux/amd64 -n workflow_dispatch 2>&1 | \
    grep -E "(\*DRYRUN\*|Job|Step)" | \
    grep -v "Cannot connect" | \
    head -50

echo ""
echo "================================================="
echo "  Test Options"
echo "================================================="
echo ""
echo "The workflow is syntactically valid and ready to use."
echo ""
echo "To test individual jobs locally with act:"
echo ""
echo "1. Test the build job only (dry-run):"
echo "   act -n -j build workflow_dispatch"
echo ""
echo "2. Actually run the build job (will take 10-15 minutes):"
echo "   act -j build workflow_dispatch --container-architecture linux/amd64"
echo ""
echo "3. Full workflow test (build + deploy):"
echo "   act workflow_dispatch --container-architecture linux/amd64"
echo ""
echo "Note: Full execution requires:"
echo "  - Docker with ~10GB free space"
echo "  - 10-15 minutes for first run"
echo "  - Internet connection for package downloads"
echo ""
echo "================================================="
echo "  GitHub Actions Setup"
echo "================================================="
echo ""
echo "To deploy for real on GitHub:"
echo ""
echo "1. Push this repository to uclchem/uclchem.github.io"
echo "2. Go to Settings → Pages → Source → 'GitHub Actions'"
echo "3. Go to Actions → Build and Deploy Documentation → Run workflow"
echo ""
echo "The workflow will automatically:"
echo "  ✓ Sync notebooks from uclchem/UCLCHEM"
echo "  ✓ Install UCLCHEM package"
echo "  ✓ Build Sphinx documentation"
echo "  ✓ Deploy to https://uclchem.github.io"
echo ""
