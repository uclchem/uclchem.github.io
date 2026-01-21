# UCLCHEM Documentation Website

[![Build and Deploy](https://github.com/uclchem/uclchem.github.io/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/uclchem/uclchem.github.io/actions/workflows/deploy-docs.yml)

This repository contains the source code for the [UCLCHEM](https://github.com/uclchem/uclchem) documentation website, built with [Sphinx](https://www.sphinx-doc.org/) and the [PyData Sphinx Theme](https://pydata-sphinx-theme.readthedocs.io/).

## 🌐 Live Site

The documentation is published at: **https://uclchem.github.io**

## 🚀 Automated Deployment

This site is automatically built and deployed using GitHub Actions:

- **Trigger:** Push to `main` branch, weekly schedule (Sundays), or manual dispatch
- **Process:** 
  1. Syncs notebooks from [uclchem/UCLCHEM](https://github.com/uclchem/UCLCHEM) repository
  2. Installs UCLCHEM package from GitHub
  3. Builds Sphinx documentation with AutoAPI
  4. Deploys to GitHub Pages
- **Build time:** ~10-15 minutes (first build), ~5-7 minutes (cached)

### Setup Instructions

See [.github/SETUP.md](.github/SETUP.md) for detailed GitHub Actions configuration.

**Quick check:**
```bash
.github/check-setup.sh
```

## 📋 Prerequisites

- Python 3.10+
- Conda (recommended for environment management)
- A working installation of UCLCHEM (the package being documented)

## 🚀 Quick Start

### 1. Clone this repository

```bash
git clone https://github.com/uclchem/uclchem.github.io.git
cd uclchem.github.io
```

### 2. Install dependencies

```bash
# Create and activate a conda environment (recommended)
conda create -n uclchem-docs python=3.13
conda activate uclchem-docs

# Install Sphinx and theme dependencies
pip install -r requirements.txt

# Install UCLCHEM (the package being documented)
pip install uclchem
```

### 3. Build the documentation

```bash
make html
```

The built documentation will be in `_build/html/`.

### 4. Preview locally

```bash
cd _build/html
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## 📁 Repository Structure

```
.
├── .github/
│   ├── workflows/
│   │   └── deploy-docs.yml  # Automated deployment workflow
│   ├── SETUP.md             # GitHub Actions setup guide
│   ├── MIGRATION.md         # Migration from old deployment method
│   └── check-setup.sh       # Setup verification script
├── _static/                 # Custom CSS and assets
│   └── custom.css           # Leiden Blue branding
├── blog/                    # Blog posts (ABlog format)
├── getting-started/         # Installation and quickstart guides
├── tutorials/               # Step-by-step tutorials
├── notebooks/               # Jupyter notebook examples (synced from main repo)
├── user-guide/              # Comprehensive user documentation
├── user_docs/               # Detailed documentation files
├── papers/                  # Publication list and citations
├── projects/                # Related projects and ecosystem
├── contributing/            # Contribution guidelines
├── examples/                # Code examples
├── conf.py                  # Sphinx configuration
├── index.md                 # Homepage
└── requirements.txt         # Python dependencies
```

## 🔧 Development

### Local Build

```bash
# Install dependencies
pip install -r requirements.txt
pip install git+https://github.com/uclchem/UCLCHEM.git

# Sync notebooks (optional - workflow does this automatically)
cp ../uclchem/notebooks/[0-9]*.ipynb notebooks/

# Build
make html

# Preview
cd _build/html && python -m http.server 8000
```

### Clean build

```bash
make clean html
```

## 🤖 GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy-docs.yml`) performs:

1. **Notebook Sync:** Copies latest numbered notebooks from uclchem/UCLCHEM
2. **Package Install:** Installs UCLCHEM from GitHub main branch
3. **Documentation Build:** Runs Sphinx with AutoAPI and notebook execution
4. **Deployment:** Uploads to GitHub Pages using native Actions

**Monitoring:**
- View builds: [Actions tab](https://github.com/uclchem/uclchem.github.io/actions)
- Check setup: Run `.github/check-setup.sh`
- Manual trigger: Actions → Build and Deploy Documentation → Run workflow

## 📝 Contributing

We welcome contributions! See the [Contributing](contributing/index.md) section for guidelines.

### Making Changes

1. Edit documentation files (`.md` files in various directories)
2. Test locally: `make html`
3. Commit and push to `main` branch
4. GitHub Actions will automatically rebuild and deploy

## 📚 Documentation

- **[Setup Guide](.github/SETUP.md)** - Complete GitHub Actions configuration
- **[Migration Guide](.github/MIGRATION.md)** - Notes on deployment method updates
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - General deployment information

## 🔍 Troubleshooting

**Build fails?**
- Check [Actions tab](https://github.com/uclchem/uclchem.github.io/actions) for error logs
- Run `.github/check-setup.sh` to verify configuration
- Test locally with `make html`

**Old content showing?**
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- Wait 5-10 minutes for CDN propagation
- Check deployment succeeded in Actions tab

**Notebooks not updating?**
- Workflow syncs notebooks weekly (Sundays)
- Manually trigger: Actions → Run workflow
- Check notebook path in uclchem/UCLCHEM matches workflow

### Development Notes

- **Cache behavior:** By default, notebook execution results are cached in `_build/.jupyter_cache/` to speed up local builds. To force fresh execution (matching CI behavior), run `rm -rf _build/.jupyter_cache` before `make html`.
- **UCLCHEM updates:** If the UCLCHEM package is updated, reinstall it locally: `pip install --upgrade --force-reinstall git+https://github.com/uclchem/UCLCHEM.git`
- **Notebooks:** Tutorial notebooks are copied from the main repository. To test with latest notebooks, copy them manually from the UCLCHEM repo or let CI handle the sync.

## Contributing

Documentation improvements are welcome! To contribute:

1. **Fork this repository**
2. **Make your changes** to markdown files, notebooks, or configuration
3. **Test locally** using the instructions above
4. **Submit a pull request** with a clear description of your changes

For code changes to UCLCHEM itself, please contribute to the [main UCLCHEM repository](https://github.com/uclchem/UCLCHEM).

## Technology Stack

- **[Sphinx](https://www.sphinx-doc.org/)** - Documentation generator
- **[PyData Sphinx Theme](https://pydata-sphinx-theme.readthedocs.io/)** - Modern, responsive theme
- **[MyST-NB](https://myst-nb.readthedocs.io/)** - Jupyter notebook integration with execution
- **[Sphinx-AutoAPI](https://sphinx-autoapi.readthedocs.io/)** - Automatic Python API documentation
- **[GitHub Actions](https://github.com/features/actions)** - Automated build and deployment
- **[GitHub Pages](https://pages.github.com/)** - Free hosting

## Repository Structure

```
uclchem.github.io/
├── .github/workflows/     # GitHub Actions CI/CD
│   └── deploy-docs.yml    # Build and deployment workflow
├── _static/               # Static assets (CSS, images, logo)
│   ├── custom.css
│   └── logo.png
├── notebooks/             # Tutorial notebooks (synced from main repo)
│   ├── *.ipynb
│   └── assets/
├── getting-started/       # Getting started guide
├── tutorials/             # Tutorial organization pages
├── user-guide/            # User guide pages
├── api/                   # Auto-generated API reference
├── papers.md              # Publications
├── projects.md            # Related projects
├── blog/                  # Blog/news
├── contributing.md        # Contribution guide
├── index.md               # Homepage
├── conf.py                # Sphinx configuration
├── requirements.txt       # Python dependencies
├── Makefile               # Build commands
└── README.md              # This file
```

## Support

- **Documentation issues:** Open an issue in this repository
- **UCLCHEM bugs/features:** Open an issue in the [main UCLCHEM repository](https://github.com/uclchem/UCLCHEM/issues)
- **Questions:** Check the [documentation](https://uclchem.github.io/) first, then open a discussion

## License

The documentation follows the same license as UCLCHEM. See the [main repository](https://github.com/uclchem/UCLCHEM) for details.

---

**Live site:** [https://uclchem.github.io/](https://uclchem.github.io/)  
**Main repository:** [https://github.com/uclchem/UCLCHEM](https://github.com/uclchem/UCLCHEM)



