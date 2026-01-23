# Multi-Version Documentation Build System

A Python-based system for building documentation for multiple UCLCHEM versions with version-specific APIs, notebooks, and content. Features intelligent notebook artifact handling and GitHub Actions integration.

## Quick Start

### Local Development

```bash
# Simple build (uses notebooks without outputs)
bash scripts/build_multiversion_local.sh

# With GitHub token (downloads pre-executed notebooks)
GITHUB_TOKEN=your_token bash scripts/build_multiversion_local.sh

# Direct Python usage with artifacts
python3 scripts/build_docs.py --github-token your_token
```

### CI/CD Build

```bash
# In GitHub Actions (token available automatically)
python3 scripts/build_docs.py --ci
```

### View Built Documentation

```bash
cd _build/html
python3 -m http.server 8000
# Open http://localhost:8000
```

## Key Features

### 🚀 Pre-Executed Notebooks
- Automatically downloads pre-executed notebooks from GitHub Actions artifacts
- Falls back to notebooks without outputs if artifacts unavailable  
- Can trigger notebook execution remotely and wait for completion

### 📋 Multi-Version Support
- Build documentation for multiple UCLCHEM versions simultaneously
- Version-specific APIs, notebooks, and content
- Automatic version switching in built documentation

### 🔧 Intelligent Workflow
The build system follows this workflow:
1. **Check for artifacts**: Look for pre-executed notebooks in GitHub Actions artifacts
2. **Download if available**: Use existing notebooks with outputs
3. **Trigger if missing**: Start GitHub Actions to execute notebooks remotely
4. **Wait for completion**: Monitor action progress and download fresh artifacts
5. **Fallback gracefully**: Use notebooks without outputs if all else fails

### 🏗️ Robust Architecture
- Modular Python design replacing legacy bash scripts
- Comprehensive error handling and logging
- Cross-platform compatibility

## Architecture

### Components

```
scripts/
├── versions.yaml                    # Version configuration (EDIT THIS to add versions)
├── build_docs.py                    # Main Python orchestrator
├── build_utils.py                   # Utility functions
├── build_multiversion_local.sh      # Bash wrapper for local use
└── build_multiversion_local.sh.old  # Legacy bash script (for reference)
```

### GitHub Token Configuration

For artifact access, set up a GitHub token:

```bash
# Option 1: Environment variable
export GITHUB_TOKEN=your_personal_access_token

# Option 2: Command line argument  
python3 scripts/build_docs.py --github-token your_token

# Option 3: In GitHub Actions (automatic)
# Token is available as ${{ secrets.GITHUB_TOKEN }}
```

**Token Requirements:**
- `repo` scope for private repositories
- `actions:read` for downloading artifacts
- `actions:write` for triggering workflows

### Configuration: versions.yaml

```yaml
versions:
  - git_ref: develop              # Git branch/tag/commit
    version_name: develop         # URL path component
    display_name: Development     # Human-readable name
    url_path: /develop/
    preferred: false              # Set one version as default

  - git_ref: main
    version_name: v3.5.4
    display_name: v3.5.4 (stable)
    url_path: /v3.5.4/
    preferred: true               # This version loads by default

build:
  default_version: v3.5.4         # Root redirect target
```

## How It Works

### Notebook Workflow

For each version, the system:

1. **Check GitHub Actions artifacts** for pre-executed notebooks
2. **Download artifacts** if available (includes outputs)
3. **Trigger notebook execution** if artifacts missing
4. **Wait for completion** (up to 20 minutes)
5. **Fallback to git extraction** if GitHub Actions fails

### Build Process

For each version in `versions.yaml`:

1. **Acquire notebooks** (artifacts or git extraction)
2. **Extract full repo** for UCLCHEM installation  
3. **Install UCLCHEM** in conda environment
4. **Create notebooks symlink** to version-specific notebooks
5. **Run Sphinx** with version-specific environment variables
6. **Clean up** temporary files between versions

### Environment Variables

The build sets these for each Sphinx build:

- `DOCS_VERSION`: Version identifier (e.g., "develop")
- `DOCS_DISPLAY_NAME`: Human-readable name
- `NOTEBOOKS_PATH`: Path to notebooks (with or without outputs)
- `UCLCHEM_SOURCE_PATH`: Path to source code for AutoAPI

### Version-Specific Content

Each version gets:
- ✅ Version-specific notebooks from that git ref (with outputs if available)
- ✅ Version-specific Python API (different modules per version)
- ✅ Version-specific Fortran API (if `uclchem.advanced` available)
- ✅ Independent Sphinx build with its own dependencies

## Features

### Automatic Version Detection

- **Local mode**: Uses existing conda environment
- **CI mode**: Detects GitHub Actions environment

### Robust Error Handling

- Prerequisites validation before build
- Clear error messages with context
- Build logs saved to `_build/logs/`
- Per-version install and build logs

### Cross-Platform

- Pure Python implementation
- Works on macOS, Linux, Windows (with WSL)
- No bash-specific features in core code

## Adding a New Version

1. Edit `scripts/versions.yaml`:

```yaml
versions:
  # ... existing versions ...
  
  - git_ref: v3.6.0          # Your new git ref
    version_name: v3.6.0     # URL component
    display_name: v3.6.0     # Display name
    url_path: /v3.6.0/
    preferred: false         # Set to true to make default
```

2. Run the build:

```bash
bash scripts/build_multiversion_local.sh
```

That's it! The new version will be built and added to the version switcher.

## Output Structure

```
_build/html/
├── index.html           # Root redirect to default version
├── versions.json        # Version switcher configuration
├── develop/            # Development version docs
│   ├── api/
│   │   ├── fortran/   # Fortran API (if available)
│   │   └── uclchem/   # Python API
│   ├── notebooks/
│   ├── tutorials/
│   └── ...
├── v3.5.4/            # Stable version docs
│   ├── api/
│   │   └── uclchem/   # Python API (no Fortran in this version)
│   ├── notebooks/
│   ├── tutorials/
│   └── ...
└── logs/              # Build logs
    ├── install_develop.log
    ├── build_develop.log
    ├── install_v3.5.4.log
    └── build_v3.5.4.log
```

## Troubleshooting

### Build Fails with "UCLCHEM repository not found"

**Solution**: The build script looks for `../uclchem` relative to the docs repo. Either:
- Clone both repos side-by-side, OR
- Specify path explicitly:
  ```bash
  python3 scripts/build_docs.py --uclchem-repo /path/to/uclchem
  ```

### Build Fails with "Prerequisites validation failed"

**Solution**: Check that you have:
- Conda environment activated
- `sphinx`, `sphinx-autoapi`, `myst-nb` installed
- Git repositories properly cloned

### "No module named 'uclchem'" after install

**Solution**: The package installation may have failed. Check:
- Install log in `_build/logs/install_{version}.log`
- Ensure gfortran is available for Meson builds
- Check that `pyproject.toml` exists in the extracted source

### Version built but API docs missing

**Solution**: 
- Check build log in `_build/logs/build_{version}.log`
- For Fortran API: Only available if `uclchem.advanced` exists in that version
- For Python API: Verify `UCLCHEM_SOURCE_PATH` points to correct directory

## For CI/CD (GitHub Actions)

### Basic Workflow

```yaml
name: Build Documentation

on: [push, pull_request]

jobs:
  build-docs:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout docs repo
        uses: actions/checkout@v4
        with:
          path: uclchem.github.io
      
      - name: Checkout UCLCHEM repo
        uses: actions/checkout@v4
        with:
          repository: uclchem/UCLCHEM
          path: uclchem
      
      - name: Setup Conda
        uses: conda-incubator/setup-miniconda@v3
        with:
          auto-update-conda: true
          python-version: "3.12"
      
      - name: Install dependencies
        shell: bash -l {0}
        run: |
          conda install -c conda-forge gfortran
          pip install -r uclchem.github.io/requirements.txt
      
      - name: Build multi-version docs
        shell: bash -l {0}
        run: |
          cd uclchem.github.io
          python3 scripts/build_docs.py --config scripts/versions.yaml --ci
      
      - name: Upload documentation
        uses: actions/upload-artifact@v4
        with:
          name: documentation
          path: uclchem.github.io/_build/html/
```

## Comparison: Old vs New

| Feature | Old (Bash) | New (Python) |
|---------|-----------|--------------|
| Lines of code | 288 | 897 (but modular) |
| Testable | ❌ | ✅ |
| Error handling | Basic | Comprehensive |
| Logging | Minimal | Detailed + per-version |
| Cross-platform | Bash only | Python (cross-platform) |
| Configuration | Hardcoded | YAML file |
| Extensibility | Difficult | Easy (add to YAML) |
| Maintainability | Low | High |

## Development

### Running Tests (Future)

```bash
pytest scripts/test_build_*.py
```

### Code Structure

**build_utils.py** - Pure functions:
- `git_extract()` - Extract files from git refs
- `install_package()` - Install Python packages
- `run_sphinx_build()` - Execute Sphinx builds
- `check_fortran_available()` - Check for Fortran wrapper
- Environment detection and path utilities

**build_docs.py** - Orchestration:
- `MultiVersionBuilder` class
- Config loading and validation
- Build loop coordination
- Manifest and redirect generation

## License

Same as UCLCHEM project (MIT).

## Support

- Issues: https://github.com/uclchem/uclchem.github.io/issues
- Docs: This README
- Legacy script: `scripts/build_multiversion_local.sh.old` (for reference)
