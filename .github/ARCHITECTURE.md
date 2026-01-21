# GitHub Actions Workflow Architecture

## Overview

This document describes the GitHub Actions workflow used to build and deploy the site at https://uclchem.github.io.

### Triggers

- Push to `main` (automatic deploy)
- Weekly scheduled run (Sunday 00:00 UTC)
- Manual `workflow_dispatch` from Actions tab

### Build job (summary)

1. Checkout this repository (`uclchem/uclchem.github.io`, branch: `main`)
2. Set up Python environment (Ubuntu, Python 3.12) and enable pip caching
3. Install system dependencies (e.g., `gfortran`)
4. Sync notebooks and assets from the main UCLCHEM repository:
   - Clone `https://github.com/uclchem/UCLCHEM.git`
   - Copy numbered notebooks into `./notebooks/` and any notebook assets
   - Copy `answer/uclchem.png` → `./_static/logo.png` (if present)
5. Install UCLCHEM (pip install from GitHub) and documentation dependencies (`pip install -r requirements.txt`)
6. Clear caches (`rm -rf _build/.jupyter_cache`)
7. Build Sphinx docs (`make html`): execute notebooks (optional), generate API via AutoAPI, render blog
8. Upload build artifact (`./_build/html`) for deployment

### Deploy job (summary)

- Runs after a successful build on `main`
- Uses `actions/deploy-pages@v4` with the uploaded artifact
- Deploys to GitHub Pages environment `github-pages` at `https://uclchem.github.io`

## Data flow (concise)

- Source repo: `uclchem/UCLCHEM` (notebooks, package source, assets)
- Doc repo: `uclchem/uclchem.github.io` (Sphinx sources, config)
- On build: notebooks and assets are pulled from the source repo → Sphinx builds → `_build/html` → GitHub Pages

---

(See the sections below for features, triggers, permissions, timings and verification steps.)


## Data Flow

```
uclchem/UCLCHEM                    uclchem/uclchem.github.io
(main repository)                  (documentation repository)
      │                                     │
      │                                     │
      ├─ notebooks/*.ipynb ────────────────▶│ notebooks/*.ipynb
      │                                     │
      ├─ src/uclchem/ ──┐                  │
      │                 │                  │
      │         [pip install] ────────────▶│ (UCLCHEM package)
      │                                     │
      └─ answer/uclchem.png ───────────────▶│ _static/logo.png
                                            │
                                            ├─ conf.py
                                            ├─ *.md files
                                            ├─ blog/*.md
                                            ├─ user_docs/*.md
                                            │
                                    [Sphinx Build]
                                            │
                                            ▼
                                      _build/html/
                                            │
                                    [GitHub Pages]
                                            │
                                            ▼
                                https://uclchem.github.io
```

## Key Features

### Automatic Synchronization
- **Source:** uclchem/UCLCHEM repository notebooks
- **Destination:** uclchem.github.io/notebooks
- **Frequency:** On every build (push, weekly, or manual)
- **Pattern:** `[0-9]*.ipynb` (numbered notebooks only)

### Build Process
- **Sphinx:** Converts .md/.rst → HTML
- **myst-nb:** Executes and renders Jupyter notebooks
- **AutoAPI:** Generates Python API documentation from UCLCHEM source
- **ABlog:** Renders blog posts with timestamps and categories

### Deployment Method
- **Type:** GitHub Actions native (modern)
- **Old method:** ~~peaceiris/actions-gh-pages~~ (deprecated)
- **New method:** actions/upload-pages-artifact + actions/deploy-pages
- **Branch:** No gh-pages branch needed
- **Environment:** github-pages (tracked in repo)

## Triggers

| Event | When | Description |
|-------|------|-------------|
| `push` | On commit to `main` | Immediate deployment of changes |
| `schedule` | Sunday 00:00 UTC | Weekly sync of notebooks from main repo |
| `workflow_dispatch` | Manual | Trigger from Actions tab |

## Permissions Required

```yaml
permissions:
  contents: read    # Read repository content
  pages: write      # Deploy to GitHub Pages
  id-token: write   # OIDC token for Pages deployment
```

## Concurrency Control

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: true
```

- Only one deployment at a time
- New deployments cancel pending ones
- Prevents conflicts from simultaneous builds

## Build Time

| Phase | Duration | Notes |
|-------|----------|-------|
| Setup (Python, gfortran) | ~1-2 min | Cached |
| Notebook sync | ~30 sec | Shallow clone |
| UCLCHEM install | ~2-3 min | From GitHub |
| Sphinx build | ~5-10 min | Notebook execution |
| Upload & deploy | ~1-2 min | Artifact transfer |
| **Total** | **~10-15 min** | First run |
| **Total (cached)** | **~5-7 min** | Subsequent runs |

## Verification Steps

After deployment:

1. ✅ Check Actions tab for green checkmark
2. ✅ Verify deployment environment shows correct URL
3. ✅ Visit https://uclchem.github.io
4. ✅ Check notebooks are present and rendered
5. ✅ Verify API documentation exists at /api/
6. ✅ Check blog posts at /blog/

## Monitoring

### Success Indicators
- Build job completes without errors
- Deploy job shows deployment URL
- Site is accessible at https://uclchem.github.io
- Notebooks, API docs, and blog are all present

### Failure Indicators
- Red X in Actions tab
- Error messages in job logs
- 404 errors on site
- Missing content sections

### Debugging
1. Click failed workflow run
2. Expand failed step
3. Review error messages
4. Check logs for specific issues
5. Test locally: `make html`

## Repository Settings

Required GitHub Pages configuration:

```
Settings → Pages
  Source: GitHub Actions  ← CRITICAL!
  
Settings → Actions → General
  Workflow permissions: Read and write
```

## File Locations

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-docs.yml` | Main workflow definition |
| `.github/SETUP.md` | Complete setup instructions |
| `.github/MIGRATION.md` | Migration notes from old method |
| `.github/check-setup.sh` | Setup verification script |
| `requirements.txt` | Python dependencies |
| `conf.py` | Sphinx configuration |
| `Makefile` | Build shortcuts |
