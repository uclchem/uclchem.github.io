# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------
# Standalone setup: Use installed UCLCHEM package (no relative paths)
import os
import sys

# Add _ext directory for custom extensions
sys.path.insert(0, os.path.abspath('_ext'))

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'UCLCHEM'
copyright = '2026, UCLCHEM Team'
author = 'UCLCHEM Team'

# Multi-version build support
# Check for environment variables set by build script
docs_version = os.environ.get('DOCS_VERSION', None)
docs_display_name = os.environ.get('DOCS_DISPLAY_NAME', None)

if docs_version:
    # Building as part of multi-version build
    release = docs_version
    version = '.'.join(release.split('.')[:2]) if '.' in release else release
else:
    # Single build: Dynamic version detection from installed package
    try:
        import importlib.metadata

        import uclchem
        release = importlib.metadata.version('uclchem')
    except (ImportError, importlib.metadata.PackageNotFoundError):
        # Fallback: try git tag
        import subprocess
        try:
            release = subprocess.check_output(
                ['git', 'describe', '--tags', '--abbrev=0'],
                stderr=subprocess.DEVNULL
            ).decode().strip()
        except Exception:
            release = 'development'

    version = '.'.join(release.split('.')[:2]) if '.' in release else release

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'myst_nb',                      # Jupyter notebook integration
    'sphinx.ext.autodoc',           # Python docstrings
    'sphinx.ext.napoleon',          # NumPy/Google docstring styles
    'sphinx.ext.viewcode',          # Source code links
    'sphinx.ext.intersphinx',       # Cross-referencing external docs
    'sphinx.ext.mathjax',           # Math rendering
    'sphinx_design',                # UI components (cards, grids, tabs)
    'sphinx_copybutton',            # Copy button for code blocks
    'sphinx_togglebutton',          # Collapsible content
    'autoapi.extension',            # Auto API documentation
    'ablog',                        # Blog support
    'fortran_params_doc',           # Custom: Generate Fortran parameter docs
]

templates_path = ['_templates']
exclude_patterns = [
    '_build', 
    'Thumbs.db', 
    '.DS_Store', 
    '**.ipynb_checkpoints',
    'notebooks/dev_notebooks/**',      # Development notebooks (not for docs)
    'notebooks/functional_form/**',    # Old functional interface (deprecated)
    'notebooks/1_first_model.ipynb',   # Duplicate of object-oriented version
    'notebooks/*.py',                  # Python script versions of notebooks
    'README.md',                       # Repository README (not for docs site)
    'DEPLOYMENT.md',                   # Deployment instructions (not for docs site)
    'user_docs/installation instructions.md',  # Merged into getting-started/installation.md
    'user_docs/style-guide.md',        # Internal style guide (not for users)
    'user_docs/writing-style-prompt.md',  # Internal prompts (not for users)
]

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'pydata_sphinx_theme'
html_static_path = ['_static']
html_css_files = ['custom.css']

# Leiden University Blue branding
html_theme_options = {
    "logo": {
        "text": "UCLCHEM",
        "image_light": "_static/logo.png",
        "image_dark": "_static/logo.png",
    },
    "icon_links": [
        {
            "name": "GitHub",
            "url": "https://github.com/uclchem/UCLCHEM",
            "icon": "fab fa-github-square",
            "type": "fontawesome",
        },
    ],
    "navbar_start": ["navbar-logo"],
    "navbar_center": ["navbar-nav"],
    "navbar_end": ["version-switcher", "navbar-icon-links", "theme-switcher"],
    "navbar_persistent": ["search-button"],
    "primary_sidebar_end": ["indices.html"],
    "footer_start": ["copyright"],
    "footer_end": ["sphinx-version"],
    "show_nav_level": 2,
    "navigation_depth": 3,
    "show_toc_level": 2,
    "header_links_before_dropdown": 5,
    # Clean, less busy appearance
    "collapse_navigation": False,
    "navigation_with_keys": True,
    # Version switcher configuration
    "switcher": {
        "json_url": "/versions.json",
        "version_match": docs_version if docs_version else version,
    },
}

# Custom colors - Leiden University Blue
html_context = {
    "default_mode": "light"
}

# -- Extension configuration -------------------------------------------------

# MyST-NB configuration for notebooks
# Execution modes:
#   "off"   - Use pre-executed outputs stored in .ipynb files (fastest, most reliable)
#   "cache" - Execute once and cache results (good for development)
#   "auto"  - Execute every build (slowest, ensures fresh outputs)
# Default: off for local development. Can be enabled on CI by setting
# environment variable UCLCHEM_EXECUTE_NOTEBOOKS to a truthy value.
_exec_notebooks_env = os.environ.get("UCLCHEM_EXECUTE_NOTEBOOKS", "false").lower()
if _exec_notebooks_env in ("1", "true", "yes", "on"):
    nb_execution_mode = "auto"
else:
    nb_execution_mode = "off"  # Use pre-executed notebook outputs

# Timeout and error handling
nb_execution_timeout = int(os.environ.get("UCLCHEM_NB_TIMEOUT", "600"))   # seconds per notebook
nb_execution_raise_on_error = False  # Don't fail build on notebook errors
nb_merge_streams = True
nb_execution_cache_path = "_build/.jupyter_cache"  # Cache location

# MyST parser configuration
myst_enable_extensions = [
    "dollarmath",       # LaTeX math with $ and $$
    "amsmath",          # Advanced math
    "deflist",          # Definition lists
    "colon_fence",      # ::: fences
    "substitution",     # Variable substitution
]

# AutoAPI configuration for Python API documentation
# For multiversion builds, look for source in extracted directory first
autoapi_type = 'python'

# Check for extracted source from git ref (set during multiversion builds)
source_path = os.environ.get('UCLCHEM_SOURCE_PATH')

if source_path and os.path.exists(os.path.join(source_path, 'uclchem')):
    # Use extracted source from specific git ref
    autoapi_dirs = [os.path.join(source_path, 'uclchem')]
elif os.path.exists('../src/uclchem'):
    # Use local source for single-version builds
    autoapi_dirs = ['../src/uclchem']
else:
    # Fallback: empty (will skip autoapi if no source found)
    autoapi_dirs = []
    
autoapi_root = 'api'
autoapi_add_toctree_entry = True
autoapi_options = [
    'members',
    'undoc-members',
    'show-inheritance',
    'show-module-summary',
    'imported-members',
]
autoapi_ignore = [
    '*/__pycache__/*',
    '*/tests/*',
    '**/test_*.py',
]
autoapi_member_order = 'groupwise'
autoapi_python_class_content = 'both'

# Template directory for custom autoAPI templates
autoapi_template_dir = '_templates/autoapi'

# Keep the generated RST files for debugging
autoapi_keep_files = False

# Suppress warnings for missing documentation
suppress_warnings = ['autoapi.python_import_resolution']

# Intersphinx configuration - link to other projects
intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
    'numpy': ('https://numpy.org/doc/stable/', None),
    'pandas': ('https://pandas.pydata.org/docs/', None),
    'matplotlib': ('https://matplotlib.org/stable/', None),
}

# Copy button configuration
copybutton_prompt_text = r">>> |\.\.\. |\$ "
copybutton_prompt_is_regexp = True

# Napoleon settings for NumPy-style docstrings
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = False
napoleon_use_admonition_for_notes = False
napoleon_use_admonition_for_references = False
napoleon_use_ivar = False
napoleon_use_param = True
napoleon_use_rtype = True
napoleon_preprocess_types = False
napoleon_type_aliases = None
napoleon_attr_annotations = True

# -- ABlog configuration -----------------------------------------------------
# https://ablog.readthedocs.io/

blog_title = "UCLCHEM Blog"
blog_path = "blog"
blog_post_pattern = "blog/*.md"
blog_feed_fulltext = True
blog_feed_length = 10
post_auto_excerpt = 1  # Use first paragraph as excerpt
post_date_format = "%d %B %Y"
post_date_format_short = "%d %b %Y"

# Blog authors (loaded from blog/authors.yml if present)
blog_authors = {
    "UCLCHEM Team": ("UCLCHEM Team", "https://uclchem.github.io"),
}

# ---------------------------------------------------------------------------
# Compatibility shim: ensure Sphinx builder provides a docwriter attribute
# This addresses incompatibilities where extensions (e.g. ablog) expect the
# builder to have a `docwriter` writer object. We attach an HTMLWriter on
# `builder-inited` if it is missing to avoid AttributeError during rendering.
# ---------------------------------------------------------------------------
def _ensure_docwriter(app):
    try:
        from sphinx.writers.html import HTMLWriter
        if not hasattr(app.builder, "docwriter"):
            app.builder.docwriter = HTMLWriter(app.builder)
            app.logger.debug("Attached HTMLWriter to app.builder for ablog compatibility")
    except Exception as exc:
        # Use logger to surface the issue in build logs without failing the build
        try:
            app.logger.warning(f"Could not attach HTMLWriter to builder: {exc}")
        except Exception:
            pass


def setup(app):
    app.connect("builder-inited", _ensure_docwriter)
    return {"version": "0.1"}

# ---------------------------------------------------------------------------
# Site versioning - allow CI to set SITE_VERSION (preferred). If unset,
# fall back to the previously-detected `release` value.
# ---------------------------------------------------------------------------
SITE_VERSION = os.environ.get("SITE_VERSION")
if SITE_VERSION:
    release = SITE_VERSION

# Make site version available to templates
html_context.setdefault("site_version", release)

# Include the version footer template
if "_templates" not in templates_path:
    templates_path.insert(0, "_templates")

# Sphinx: add the footer template to be included in the theme (pydata supports adding extra templates)
html_sidebars = {
    "**": [
        "sidebar-nav-bs.html",
    ]
}
html_context.setdefault("extra_footer", "footer_versions.html")
