#!/usr/bin/env python3
"""
Multi-version documentation build orchestrator.
Builds documentation for multiple UCLCHEM versions from different git refs.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional

import yaml
from build_utils import (
    BuildError,
    LogLevel,
    check_fortran_available,
    check_notebook_artifacts,
    clean_directory,
    create_symlink,
    detect_environment,
    download_notebook_artifacts,
    get_python_paths,
    git_extract,
    install_package,
    log,
    run_sphinx_build,
    trigger_notebook_action,
    validate_prerequisites,
)


class MultiVersionBuilder:
    """Orchestrates multi-version documentation builds."""
    
    def __init__(self, config_path: Path, uclchem_repo: Optional[Path] = None, github_token: Optional[str] = None):
        """
        Initialize builder.
        
        Args:
            config_path: Path to versions.yaml configuration file
            uclchem_repo: Optional path to UCLCHEM repository (auto-detect if not provided)
            github_token: Optional GitHub token for artifact access
        """
        self.config_path = config_path.resolve()
        self.config = self._load_config()
        self.github_token = github_token or os.getenv('GITHUB_TOKEN')
        
        # Determine paths
        self.docs_root = self.config_path.parent.parent  # scripts/versions.yaml -> repo root
        self.uclchem_repo = uclchem_repo or (self.docs_root.parent / "uclchem")
        
        # Resolve all paths to absolute
        self.docs_root = self.docs_root.resolve()
        self.uclchem_repo = self.uclchem_repo.resolve()
        self.build_root = self.docs_root / "_build" / "html"
        self.temp_dir = self.docs_root / "_build" / "multiversion_temp"
        
        # Get Python environment paths
        self.python_path, self.pip_path, self.sphinx_build_path = get_python_paths()
        
        # Detect environment
        self.environment = detect_environment()
        
        log(f"Environment: {self.environment}")
        log(f"Documentation root: {self.docs_root}")
        log(f"UCLCHEM repository: {self.uclchem_repo}")
        log(f"Build output: {self.build_root}")
        
        if self.github_token:
            log("GitHub token available for artifact access", LogLevel.SUCCESS)
        else:
            log("No GitHub token - artifacts will not be available", LogLevel.WARNING)
    
    def _load_config(self) -> Dict:
        """Load and validate configuration from YAML file."""
        if not self.config_path.exists():
            raise BuildError(f"Configuration file not found: {self.config_path}")
        
        with open(self.config_path) as f:
            config = yaml.safe_load(f)
        
        # Validate required fields
        if 'versions' not in config:
            raise BuildError("Configuration must contain 'versions' list")
        
        if not config['versions']:
            raise BuildError("At least one version must be defined")
        
        return config
    
    def validate_prerequisites(self) -> None:
        """Validate all prerequisites before building."""
        log("Validating prerequisites...")
        validate_prerequisites(self.uclchem_repo, self.docs_root)
    
    def clean_previous_builds(self) -> None:
        """Remove previous build artifacts."""
        log("Cleaning previous builds...")
        
        if self.build_root.exists():
            clean_directory(self.build_root)
        
        if self.temp_dir.exists():
            clean_directory(self.temp_dir)
        
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        log("Cleanup complete", LogLevel.SUCCESS)
    
    def _handle_notebooks(self, git_ref: str, version_name: str, notebooks_temp: Path) -> bool:
        """
        Handle notebook acquisition - try artifacts first, fallback to git extraction.
        
        Args:
            git_ref: Git reference
            version_name: Version identifier
            notebooks_temp: Directory to place notebooks
            
        Returns:
            True if notebooks acquired successfully
        """
        log(f"Acquiring notebooks for {git_ref}...")
        
        if self.github_token:
            # Try to get pre-executed notebooks from artifacts
            artifact_info = check_notebook_artifacts(git_ref, self.github_token)
            
            if artifact_info:
                # Show which artifact was selected
                best_artifact = artifact_info['artifacts'][0]
                parsed = best_artifact.get('parsed_info', {})
                artifact_version = parsed.get('version', 'unknown')
                artifact_commit = parsed.get('commit', 'unknown')
                
                if artifact_version == git_ref:
                    log(f"Found exact match artifact for {git_ref} (commit: {artifact_commit})", LogLevel.SUCCESS)
                elif git_ref in artifact_version or artifact_version in git_ref:
                    log(f"Found partial match artifact: {artifact_version} for {git_ref} (commit: {artifact_commit})", LogLevel.INFO)
                else:
                    log(f"Using closest available artifact: {artifact_version} for {git_ref} (commit: {artifact_commit})", LogLevel.WARNING)
                
                # Download existing artifacts
                if download_notebook_artifacts(artifact_info, notebooks_temp, self.github_token):
                    log("Using pre-executed notebooks from artifacts", LogLevel.SUCCESS)
                    return True
                else:
                    log("Failed to download artifacts, trying to trigger action...", LogLevel.WARNING)
            else:
                log("No matching artifacts found, attempting to trigger notebook execution...", LogLevel.WARNING)
            
            # Try to trigger notebook execution action
            if trigger_notebook_action(git_ref, self.github_token, wait_for_completion=True):
                # Try downloading again after trigger
                artifact_info = check_notebook_artifacts(git_ref, self.github_token)
                if artifact_info and download_notebook_artifacts(artifact_info, notebooks_temp, self.github_token):
                    log("Successfully obtained fresh notebook artifacts", LogLevel.SUCCESS)
                    return True
        
        # Fallback: extract notebooks without outputs from git
        log("Falling back to notebooks without outputs", LogLevel.WARNING)
        notebooks_temp.mkdir(parents=True, exist_ok=True)
        
        file_count = git_extract(
            self.uclchem_repo,
            git_ref,
            notebooks_temp,
            subpath="notebooks"
        )
        
        if file_count > 0 and (notebooks_temp / "notebooks").exists():
            log(f"Extracted {file_count} notebook files (no outputs)", LogLevel.SUCCESS)
            return True
        else:
            log("Failed to extract notebooks", LogLevel.ERROR)
            return False
    
    def build_version(self, version_config: Dict) -> bool:
        """
        Build documentation for a single version.
        
        Args:
            version_config: Version configuration dict from YAML
            
        Returns:
            True if build succeeded
        """
        git_ref = version_config['git_ref']
        version_name = version_config['version_name']
        display_name = version_config.get('display_name', version_name)
        
        log("=" * 60)
        log(f"Building version: {display_name}")
        log(f"Git ref: {git_ref}")
        log("=" * 60)
        
        # Create temp directories for this version
        notebooks_temp = self.temp_dir / f"notebooks_{version_name}"
        source_temp = self.temp_dir / f"source_{version_name}"
        output_dir = self.build_root / version_name
        
        try:
            # Step 1: Handle notebooks (artifacts or git extraction)
            if not self._handle_notebooks(git_ref, version_name, notebooks_temp):
                raise BuildError(f"Failed to acquire notebooks for {git_ref}")
            
            # Verify notebooks directory exists
            if not (notebooks_temp / "notebooks").exists():
                raise BuildError(f"No notebooks directory found after acquisition")
            
            # Count notebooks
            notebook_files = list((notebooks_temp / "notebooks").glob("*.ipynb"))
            log(f"Found {len(notebook_files)} notebook files", LogLevel.SUCCESS)
            
            # Step 2: Extract full repository for installation
            log(f"Extracting repository from {git_ref}...")
            source_temp.mkdir(parents=True, exist_ok=True)
            
            git_extract(
                self.uclchem_repo,
                git_ref,
                source_temp
            )
            
            if not (source_temp / "pyproject.toml").exists():
                raise BuildError(f"No pyproject.toml found in {git_ref}")
            
            log("Repository extracted", LogLevel.SUCCESS)
            
            # Step 3: Install UCLCHEM
            log(f"Installing UCLCHEM from {git_ref}...")
            install_log = self.build_root.parent / "logs" / f"install_{version_name}.log"
            install_log.parent.mkdir(parents=True, exist_ok=True)
            
            if not install_package(source_temp, self.python_path, self.pip_path, install_log):
                raise BuildError("UCLCHEM installation failed")
            
            # Check for Fortran wrapper
            has_fortran = check_fortran_available(self.python_path)
            fortran_status = "with Fortran wrapper" if has_fortran else "Fortran wrapper not available"
            log(f"UCLCHEM {version_name} installed ({fortran_status})", LogLevel.SUCCESS)
            
            # Step 4: Set up notebooks symlink
            log("Setting up notebooks symlink...")
            notebooks_link = self.docs_root / "notebooks"
            create_symlink(notebooks_temp / "notebooks", notebooks_link)
            log("Notebooks symlink created", LogLevel.SUCCESS)
            
            # Step 5: Build Sphinx documentation
            log("Building Sphinx documentation...")
            
            # Set environment variables for version-aware build
            env_vars = {
                "DOCS_VERSION": version_name,
                "DOCS_DISPLAY_NAME": display_name,
                "NOTEBOOKS_PATH": str(notebooks_temp / "notebooks"),
                "UCLCHEM_SOURCE_PATH": str(source_temp / "src")  # Point to src directory, not src/uclchem
            }
            
            build_log = self.build_root.parent / "logs" / f"build_{version_name}.log"
            
            if not run_sphinx_build(
                self.docs_root,
                output_dir,
                self.sphinx_build_path,
                env_vars=env_vars,
                log_file=build_log
            ):
                raise BuildError("Sphinx build failed")
            
            log(f"Successfully built version {display_name}", LogLevel.SUCCESS)
            log(f"Output: {output_dir}")
            
            # Clean up api/fortran and api/site-packages to prevent cross-contamination
            api_fortran = self.docs_root / "api" / "fortran"
            if api_fortran.exists():
                clean_directory(api_fortran)
            
            api_site_packages = self.docs_root / "api" / "site-packages"
            if api_site_packages.exists():
                clean_directory(api_site_packages)
            
            return True
            
        except BuildError as e:
            log(f"Failed to build version {display_name}: {e}", LogLevel.ERROR)
            return False
        except Exception as e:
            log(f"Unexpected error building {display_name}: {e}", LogLevel.ERROR)
            return False
    
    def generate_manifest(self) -> None:
        """Generate versions.json manifest for version switcher."""
        log("Creating versions manifest...")
        
        manifest = []
        for version_config in self.config['versions']:
            manifest.append({
                "name": version_config.get('display_name', version_config['version_name']),
                "version": version_config['version_name'],
                "url": version_config['url_path'],
                "preferred": version_config.get('preferred', False)
            })
        
        manifest_path = self.build_root / "versions.json"
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        log("Created versions.json", LogLevel.SUCCESS)
    
    def create_root_redirect(self) -> None:
        """Create root index.html that redirects to default version."""
        log("Creating root index page...")
        
        # Find default version (preferred=true in config)
        default_version = self.config['build'].get('default_version', 'develop')
        
        # Find the preferred version from config
        for version_config in self.config['versions']:
            if version_config.get('preferred', False):
                default_version = version_config['version_name']
                break
        
        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url={default_version}/">
    <title>UCLCHEM Documentation</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }}
        .container {{
            text-align: center;
        }}
        h1 {{
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }}
        p {{
            font-size: 1.2rem;
            opacity: 0.9;
        }}
        a {{
            color: #fff;
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>UCLCHEM Documentation</h1>
        <p>Redirecting to <a href="{default_version}/">{default_version}</a>...</p>
        <p><small>If not redirected, click the link above.</small></p>
    </div>
</body>
</html>
"""
        
        index_path = self.build_root / "index.html"
        with open(index_path, 'w') as f:
            f.write(html_content)
        
        log("Created root index.html", LogLevel.SUCCESS)
    
    def cleanup_temp_files(self, keep_logs: bool = True) -> None:
        """Clean up temporary files after build."""
        log("Cleaning up temporary files...")
        
        # Remove temp directory
        if self.temp_dir.exists():
            clean_directory(self.temp_dir)
        
        # Remove notebooks symlink
        notebooks_link = self.docs_root / "notebooks"
        if notebooks_link.is_symlink():
            notebooks_link.unlink()
        
        if not keep_logs:
            log_dir = self.build_root.parent / "logs"
            if log_dir.exists():
                clean_directory(log_dir)
        
        log("Cleanup complete", LogLevel.SUCCESS)
    
    def build_all(self) -> int:
        """
        Build all versions defined in configuration.
        
        Returns:
            Exit code: 0 if all builds succeeded, 1 if any failed
        """
        log("=" * 60)
        log("Multi-Version Documentation Builder")
        log("=" * 60)
        log("")
        
        # Validate prerequisites
        try:
            self.validate_prerequisites()
        except BuildError as e:
            log(f"Prerequisites validation failed: {e}", LogLevel.ERROR)
            return 1
        
        # Clean previous builds
        self.clean_previous_builds()
        
        # Build each version
        log("")
        success_count = 0
        failed_versions = []
        
        for version_config in self.config['versions']:
            if self.build_version(version_config):
                success_count += 1
            else:
                failed_versions.append(version_config['version_name'])
            log("")  # Blank line between versions
        
        # Generate manifest and root redirect
        if success_count > 0:
            self.generate_manifest()
            self.create_root_redirect()
        
        # Cleanup
        self.cleanup_temp_files(keep_logs=True)
        
        # Summary
        log("=" * 60)
        log("Multi-version build complete!")
        log("=" * 60)
        log("")
        log(f"Built versions: {success_count}/{len(self.config['versions'])}")
        
        if failed_versions:
            log(f"Failed versions: {', '.join(failed_versions)}", LogLevel.WARNING)
        
        built_versions = [v for v in self.config['versions'] if v['version_name'] not in failed_versions]
        if built_versions:
            log("")
            log("Built versions:")
            for version_config in built_versions:
                log(f"  • {version_config['display_name']}: {self.build_root / version_config['version_name']}/")
        
        log("")
        log("Build logs:")
        log(f"  ls -lh {self.build_root.parent / 'logs'}/")
        
        log("")
        log("To view locally, run:")
        log(f"  cd {self.build_root} && python3 -m http.server 8000")
        log("Then open: http://localhost:8000")
        
        return 0 if not failed_versions else 1


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Build multi-version documentation for UCLCHEM"
    )
    parser.add_argument(
        "--config",
        type=Path,
        default=Path(__file__).parent / "versions.yaml",
        help="Path to versions.yaml configuration file"
    )
    parser.add_argument(
        "--uclchem-repo",
        type=Path,
        help="Path to UCLCHEM repository (auto-detected if not provided)"
    )
    parser.add_argument(
        "--github-token",
        help="GitHub API token for accessing artifacts (or set GITHUB_TOKEN env var)"
    )
    parser.add_argument(
        "--ci",
        action="store_true",
        help="Run in CI mode (non-interactive)"
    )
    
    args = parser.parse_args()
    
    try:
        builder = MultiVersionBuilder(
            config_path=args.config,
            uclchem_repo=args.uclchem_repo,
            github_token=args.github_token
        )
        exit_code = builder.build_all()
        sys.exit(exit_code)
        
    except BuildError as e:
        log(f"Build error: {e}", LogLevel.ERROR)
        sys.exit(1)
    except KeyboardInterrupt:
        log("\nBuild interrupted by user", LogLevel.WARNING)
        sys.exit(130)
    except Exception as e:
        log(f"Unexpected error: {e}", LogLevel.ERROR)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
