#!/bin/bash
# GitHub Pages Setup Verification Script
# Run this to check if everything is configured correctly

echo "================================================="
echo "  UCLCHEM Documentation - GitHub Pages Check"
echo "================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "conf.py" ]; then
    check_fail "Not in uclchem.github.io root directory"
    echo "Please run this script from the repository root"
    exit 1
fi
check_pass "In correct directory"

# Check workflow file exists
if [ -f ".github/workflows/deploy-docs.yml" ]; then
    check_pass "Workflow file exists"
else
    check_fail "Workflow file missing at .github/workflows/deploy-docs.yml"
    exit 1
fi

# Check workflow uses new deployment method
if grep -q "actions/deploy-pages@v4" ".github/workflows/deploy-docs.yml"; then
    check_pass "Using modern GitHub Pages deployment"
else
    check_warn "Still using legacy deployment method (peaceiris/actions-gh-pages)"
fi

# Check if permissions are set
if grep -q "pages: write" ".github/workflows/deploy-docs.yml"; then
    check_pass "Workflow has correct permissions"
else
    check_warn "Workflow may be missing pages: write permission"
fi

# Check requirements.txt exists
if [ -f "requirements.txt" ]; then
    check_pass "requirements.txt exists"
    
    # Check for key dependencies
    if grep -q "sphinx" requirements.txt; then
        check_pass "Sphinx listed in requirements"
    else
        check_warn "Sphinx not found in requirements.txt"
    fi
    
    if grep -q "myst-nb" requirements.txt; then
        check_pass "myst-nb (notebook support) in requirements"
    else
        check_warn "myst-nb not found in requirements.txt"
    fi
    
    if grep -q "sphinx-autoapi" requirements.txt; then
        check_pass "sphinx-autoapi (API docs) in requirements"
    else
        check_warn "sphinx-autoapi not found in requirements.txt"
    fi
else
    check_fail "requirements.txt missing"
fi

# Check conf.py exists
if [ -f "conf.py" ]; then
    check_pass "conf.py exists"
else
    check_fail "conf.py missing"
fi

# Check notebooks directory
if [ -d "notebooks" ]; then
    notebook_count=$(ls -1 notebooks/*.ipynb 2>/dev/null | wc -l)
    if [ "$notebook_count" -gt 0 ]; then
        check_pass "Notebooks directory exists with $notebook_count notebooks"
    else
        check_warn "Notebooks directory exists but is empty"
    fi
else
    check_warn "Notebooks directory not found (will be created by workflow)"
fi

# Check Makefile
if [ -f "Makefile" ]; then
    check_pass "Makefile exists"
else
    check_warn "Makefile missing (optional)"
fi

# Test if we can check GitHub API (requires gh CLI)
if command -v gh &> /dev/null; then
    echo ""
    echo "Checking GitHub repository settings..."
    
    # Check Pages configuration
    pages_info=$(gh api repos/uclchem/uclchem.github.io/pages 2>/dev/null)
    if [ $? -eq 0 ]; then
        source=$(echo "$pages_info" | grep -o '"build_type":"[^"]*"' | cut -d'"' -f4)
        if [ "$source" = "workflow" ]; then
            check_pass "GitHub Pages source set to 'GitHub Actions'"
        else
            check_fail "GitHub Pages source is '$source' (should be 'workflow')"
            echo "   → Go to Settings → Pages → Source → Select 'GitHub Actions'"
        fi
    else
        check_warn "Could not check Pages configuration (may not be enabled yet)"
        echo "   → Enable Pages in Settings → Pages → Source → GitHub Actions"
    fi
    
    # Check latest workflow run
    echo ""
    echo "Checking latest workflow runs..."
    gh run list --workflow=deploy-docs.yml --limit=3 2>/dev/null || check_warn "Could not fetch workflow runs"
else
    check_warn "GitHub CLI (gh) not installed - skipping API checks"
    echo "   Install with: brew install gh (macOS) or see https://cli.github.com/"
fi

# Summary
echo ""
echo "================================================="
echo "  Summary"
echo "================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Ensure GitHub Pages is enabled:"
echo "   Settings → Pages → Source → GitHub Actions"
echo ""
echo "2. Trigger first workflow run:"
echo "   Actions → Build and Deploy Documentation → Run workflow"
echo ""
echo "3. Wait for deployment (~10-15 minutes)"
echo ""
echo "4. Visit: https://uclchem.github.io"
echo ""

# Test local build capability
echo "================================================="
echo "  Optional: Test Local Build"
echo "================================================="
echo ""
echo "To test the build locally before pushing:"
echo ""
echo "  pip install -r requirements.txt"
echo "  pip install git+https://github.com/uclchem/UCLCHEM.git"
echo "  make html"
echo "  open _build/html/index.html"
echo ""
