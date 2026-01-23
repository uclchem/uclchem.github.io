#!/usr/bin/env python3
"""
Utility functions for multi-version documentation builds.
Provides reusable operations for git, package management, and Sphinx builds.
"""

import os
import shutil
import subprocess
import sys
import time
import requests
import zipfile
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class LogLevel(Enum):
    """Log levels for build output."""
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    SUCCESS = "SUCCESS"


class BuildError(Exception):
    """Custom exception for build failures."""
    pass


def log(message: str, level: LogLevel = LogLevel.INFO) -> None:
    """Print colored log message based on level."""
    colors = {
        LogLevel.INFO: "\033[0;34m",      # Blue
        LogLevel.WARNING: "\033[1;33m",   # Yellow
        LogLevel.ERROR: "\033[0;31m",     # Red
        LogLevel.SUCCESS: "\033[0;32m",   # Green
    }
    reset = "\033[0m"
    
    prefix = {
        LogLevel.INFO: "ℹ",
        LogLevel.WARNING: "⚠",
        LogLevel.ERROR: "✗",
        LogLevel.SUCCESS: "✓",
    }
    
    color = colors.get(level, "")
    symbol = prefix.get(level, "")
    print(f"{color}{symbol} {message}{reset}", flush=True)


def run_command(
    cmd: List[str],
    cwd: Optional[Path] = None,
    env: Optional[Dict[str, str]] = None,
    capture_output: bool = False,
    log_file: Optional[Path] = None
) -> Tuple[int, str, str]:
    """
    Run a shell command with optional logging.
    
    Args:
        cmd: Command and arguments as list
        cwd: Working directory
        env: Environment variables (merged with current env)
        capture_output: If True, return stdout/stderr
        log_file: If provided, write output to this file
        
    Returns:
        Tuple of (return_code, stdout, stderr)
    """
    # Merge environment variables
    full_env = os.environ.copy()
    if env:
        full_env.update(env)
    
    # Run command
    if log_file:
        with open(log_file, 'w') as f:
            process = subprocess.Popen(
                cmd,
                cwd=cwd,
                env=full_env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            
            output_lines = []
            for line in process.stdout:
                f.write(line)
                f.flush()
                output_lines.append(line)
            
            process.wait()
            stdout = ''.join(output_lines)
            return process.returncode, stdout, ""
    else:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            env=full_env,
            capture_output=capture_output,
            text=True
        )
        return result.returncode, result.stdout or "", result.stderr or ""


def git_extract(
    repo_path: Path,
    git_ref: str,
    target_dir: Path,
    subpath: Optional[str] = None
) -> int:
    """
    Extract files from a git reference using git archive.
    
    Args:
        repo_path: Path to git repository
        git_ref: Git ref (branch, tag, commit)
        target_dir: Destination directory
        subpath: Optional subdirectory to extract (e.g., 'notebooks')
        
    Returns:
        Number of files extracted
    """
    if not repo_path.exists():
        raise BuildError(f"Repository not found: {repo_path}")
    
    # Verify git ref exists
    returncode, _, stderr = run_command(
        ["git", "rev-parse", "--verify", git_ref],
        cwd=repo_path,
        capture_output=True
    )
    
    if returncode != 0:
        raise BuildError(f"Git ref '{git_ref}' not found in {repo_path}")
    
    # Create target directory
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Build git archive command
    cmd = ["git", "archive", git_ref]
    if subpath:
        cmd.append(subpath)
    
    # Extract using tar
    returncode, _, stderr = run_command(
        cmd + ["|", "tar", "-x", "-C", str(target_dir)],
        cwd=repo_path,
        capture_output=True
    )
    
    # Git archive | tar pattern needs shell
    archive_cmd = f"cd {repo_path} && git archive {git_ref}"
    if subpath:
        archive_cmd += f" {subpath}"
    archive_cmd += f" | tar -x -C {target_dir}"
    
    returncode = os.system(archive_cmd)
    
    if returncode != 0:
        raise BuildError(f"Failed to extract {git_ref} from repository")
    
    # Count extracted files
    file_count = sum(1 for _ in target_dir.rglob('*') if _.is_file())
    return file_count


def install_package(
    package_path: Path,
    python_path: Path,
    pip_path: Path,
    log_file: Optional[Path] = None
) -> bool:
    """
    Install a Python package using pip.
    
    Args:
        package_path: Path to package directory (with pyproject.toml or setup.py)
        python_path: Path to Python executable
        pip_path: Path to pip executable
        log_file: Optional path to save installation log
        
    Returns:
        True if installation succeeded
    """
    if not package_path.exists():
        raise BuildError(f"Package path not found: {package_path}")
    
    if not (package_path / "pyproject.toml").exists() and not (package_path / "setup.py").exists():
        raise BuildError(f"No pyproject.toml or setup.py found in {package_path}")
    
    log(f"Installing package from {package_path}...")
    
    returncode, stdout, stderr = run_command(
        [str(pip_path), "install", "."],
        cwd=package_path,
        log_file=log_file,
        capture_output=True
    )
    
    if returncode != 0:
        log(f"Installation failed: {stderr}", LogLevel.ERROR)
        return False
    
    # Verify package installed
    returncode, stdout, _ = run_command(
        [str(python_path), "-c", "import uclchem"],
        capture_output=True
    )
    
    if returncode != 0:
        log("Failed to import uclchem after installation", LogLevel.ERROR)
        return False
    
    return True


def check_fortran_available(python_path: Path) -> bool:
    """
    Check if uclchemwrap (Fortran extension) is available.
    
    Args:
        python_path: Path to Python executable
        
    Returns:
        True if uclchemwrap can be imported
    """
    returncode, _, _ = run_command(
        [str(python_path), "-c", "import uclchemwrap"],
        capture_output=True
    )
    return returncode == 0


def run_sphinx_build(
    source_dir: Path,
    build_dir: Path,
    sphinx_build_path: Path,
    env_vars: Optional[Dict[str, str]] = None,
    log_file: Optional[Path] = None
) -> bool:
    """
    Run Sphinx build command.
    
    Args:
        source_dir: Source directory with conf.py
        build_dir: Output directory for built documentation
        sphinx_build_path: Path to sphinx-build executable
        env_vars: Additional environment variables
        log_file: Optional path to save build log
        
    Returns:
        True if build succeeded
    """
    if not source_dir.exists():
        raise BuildError(f"Source directory not found: {source_dir}")
    
    if not (source_dir / "conf.py").exists():
        raise BuildError(f"No conf.py found in {source_dir}")
    
    # Create build directory
    build_dir.mkdir(parents=True, exist_ok=True)
    
    log(f"Building Sphinx documentation...")
    log(f"  Source: {source_dir}")
    log(f"  Output: {build_dir}")
    
    cmd = [
        str(sphinx_build_path),
        "-b", "html",
        str(source_dir),
        str(build_dir)
    ]
    
    returncode, stdout, stderr = run_command(
        cmd,
        env=env_vars,
        log_file=log_file
    )
    
    if returncode != 0:
        log(f"Sphinx build failed with return code {returncode}", LogLevel.ERROR)
        return False
    
    # Check if index.html was created
    if not (build_dir / "index.html").exists():
        log("Build completed but no index.html found", LogLevel.ERROR)
        return False
    
    return True


def create_symlink(source: Path, target: Path, force: bool = True) -> None:
    """
    Create symbolic link from target to source.
    
    Args:
        source: Path to source (will be linked to)
        target: Path where symlink will be created
        force: If True, remove existing target first
    """
    if target.exists() or target.is_symlink():
        if force:
            if target.is_symlink():
                target.unlink()
            elif target.is_dir():
                shutil.rmtree(target)
            else:
                target.unlink()
        else:
            raise BuildError(f"Target already exists: {target}")
    
    # Ensure parent directory exists
    target.parent.mkdir(parents=True, exist_ok=True)
    
    # Create symlink
    target.symlink_to(source)


def clean_directory(path: Path, pattern: str = "*") -> None:
    """
    Remove all contents matching pattern in directory.
    
    Args:
        path: Directory to clean
        pattern: Glob pattern for files to remove (default: all)
    """
    if not path.exists():
        return
    
    for item in path.glob(pattern):
        if item.is_dir():
            shutil.rmtree(item)
        else:
            item.unlink()


def detect_environment() -> str:
    """
    Detect execution environment.
    
    Returns:
        'ci' for GitHub Actions, 'local' for local development, 'unknown' otherwise
    """
    if os.getenv('GITHUB_ACTIONS'):
        return 'ci'
    elif os.getenv('CONDA_PREFIX'):
        return 'local'
    else:
        return 'unknown'


def get_python_paths() -> Tuple[Path, Path, Path]:
    """
    Get paths to Python, pip, and sphinx-build executables.
    Respects CONDA_PREFIX if set.
    
    Returns:
        Tuple of (python_path, pip_path, sphinx_build_path)
    """
    conda_prefix = os.getenv('CONDA_PREFIX')
    
    if conda_prefix:
        bin_dir = Path(conda_prefix) / 'bin'
        python_path = bin_dir / 'python'
        pip_path = bin_dir / 'pip'
        sphinx_build_path = bin_dir / 'sphinx-build'
    else:
        # Use system paths
        python_path = Path(sys.executable)
        pip_path = Path(shutil.which('pip') or 'pip')
        sphinx_build_path = Path(shutil.which('sphinx-build') or 'sphinx-build')
    
    return python_path, pip_path, sphinx_build_path


def validate_prerequisites(uclchem_repo: Path, docs_repo: Path) -> None:
    """
    Validate that all prerequisites are met before building.
    
    Args:
        uclchem_repo: Path to UCLCHEM repository
        docs_repo: Path to documentation repository
        
    Raises:
        BuildError if prerequisites not met
    """
    errors = []
    
    # Check UCLCHEM repo
    if not uclchem_repo.exists():
        errors.append(f"UCLCHEM repository not found: {uclchem_repo}")
    elif not (uclchem_repo / ".git").exists():
        errors.append(f"Not a git repository: {uclchem_repo}")
    
    # Check docs repo
    if not docs_repo.exists():
        errors.append(f"Documentation repository not found: {docs_repo}")
    elif not (docs_repo / "conf.py").exists():
        errors.append(f"No conf.py found in: {docs_repo}")
    
    # Check Python environment
    python_path, pip_path, sphinx_build_path = get_python_paths()
    
    if not python_path.exists():
        errors.append(f"Python executable not found: {python_path}")
    if not pip_path.exists():
        errors.append(f"Pip executable not found: {pip_path}")
    if not sphinx_build_path.exists():
        errors.append(f"Sphinx-build executable not found: {sphinx_build_path}")
    
    if errors:
        for error in errors:
            log(error, LogLevel.ERROR)
        raise BuildError("Prerequisites validation failed")


# =============================================================================
# GitHub API Functions for Notebook Artifacts
# =============================================================================

def _parse_artifact_name(artifact_name: str) -> Dict[str, str]:
    """Parse artifact name to extract version, commit, and date.
    
    Handles names like: executed_notebooks-my-feature-branch-abc123-20260123.zip
    Parses from right to left to handle dashes in version names.
    
    Args:
        artifact_name: Name of the artifact
        
    Returns:
        Dict with parsed components
    """
    # Remove .zip extension and split by dashes
    base_name = artifact_name.replace('.zip', '').replace('.tar.gz', '')
    parts = base_name.split('-')
    
    if len(parts) < 3 or not base_name.startswith('executed_notebooks'):
        return {'version': 'unknown', 'commit': 'unknown', 'date': 'unknown'}
    
    try:
        # Parse from right: date (YYYYMMDD), commit (usually 7 chars), version (everything else)
        date = parts[-1] if parts[-1].isdigit() and len(parts[-1]) == 8 else 'unknown'
        commit = parts[-2] if len(parts) >= 4 else 'unknown'
        
        # Version is everything between 'executed_notebooks' and the last 2 parts
        if len(parts) >= 4:
            version_parts = parts[1:-2]  # Skip first 'executed_notebooks' and last 2 (commit, date)
            version = '-'.join(version_parts) if version_parts else 'unknown'
        else:
            version = 'unknown'
            
        return {
            'version': version,
            'commit': commit, 
            'date': date
        }
    except (IndexError, ValueError):
        return {'version': 'unknown', 'commit': 'unknown', 'date': 'unknown'}


def check_release_artifacts(git_ref: str, github_token: Optional[str] = None) -> Optional[Dict]:
    """Check for pre-executed notebooks in GitHub releases.
    
    Args:
        git_ref: Git reference to look for
        github_token: Optional GitHub token for private repos
        
    Returns:
        Dict with artifact info or None if not found
    """
    log(f"Checking for release artifacts for {git_ref}...")
    
    headers = {}
    if github_token:
        headers['Authorization'] = f'token {github_token}'
    
    try:
        # Check for release matching the git_ref
        url = f"https://api.github.com/repos/uclchem/UCLCHEM/releases/tags/{git_ref}"
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            release = response.json()
            assets = release.get('assets', [])
            
            # Look for notebook artifacts in release assets
            notebook_assets = []
            for asset in assets:
                name = asset.get('name', '')
                if ('executed_notebooks' in name.lower() or 
                    'executed-notebooks' in name.lower() or
                    'notebook' in name.lower()):
                    
                    # Parse asset name if it has version info
                    version_info = _parse_artifact_name(name)
                    asset['parsed_info'] = version_info
                    asset['score'] = 100  # Release assets get high priority
                    asset['source'] = 'release'
                    notebook_assets.append(asset)
            
            if notebook_assets:
                log(f"Found {len(notebook_assets)} release artifacts", LogLevel.SUCCESS)
                return {
                    'release_tag': git_ref,
                    'artifacts': notebook_assets,
                    'created_at': release['published_at'],
                    'source': 'release'
                }
        
        # If no exact match, check all releases for partial matches
        url = "https://api.github.com/repos/uclchem/UCLCHEM/releases"
        response = requests.get(url, headers=headers, params={'per_page': 20}, timeout=30)
        response.raise_for_status()
        
        releases = response.json()
        for release in releases:
            # Check if this release might contain artifacts for our git_ref
            tag_name = release.get('tag_name', '')
            assets = release.get('assets', [])
            
            for asset in assets:
                name = asset.get('name', '')
                if ('executed_notebooks' in name.lower() or 
                    'executed-notebooks' in name.lower()):
                    
                    # Parse asset name to see if it matches our git_ref
                    version_info = _parse_artifact_name(name)
                    parsed_version = version_info.get('version', '')
                    
                    # Score based on match quality
                    score = 0
                    if parsed_version == git_ref:
                        score = 100  # Exact match
                    elif git_ref in parsed_version or parsed_version in git_ref:
                        score = 75   # Partial match
                    elif 'main' in parsed_version and git_ref.startswith('v'):
                        score = 50   # Main branch for version tag
                    
                    if score > 0:
                        asset['parsed_info'] = version_info
                        asset['score'] = score
                        asset['source'] = 'release'
                        
                        log(f"Found matching release asset: {name} (score: {score})", LogLevel.SUCCESS)
                        return {
                            'release_tag': tag_name,
                            'artifacts': [asset],
                            'created_at': release['published_at'],
                            'source': 'release'
                        }
        
        log(f"No release artifacts found for {git_ref}", LogLevel.INFO)
        return None
        
    except requests.RequestException as e:
        log(f"Error checking release artifacts: {e}", LogLevel.ERROR)
        return None


def check_notebook_artifacts(git_ref: str, github_token: Optional[str] = None) -> Optional[Dict]:
    """Check for pre-executed notebooks from both GitHub releases and Actions.
    
    Args:
        git_ref: Git reference (branch, tag, commit)
        github_token: GitHub API token (optional, for higher rate limits)
        
    Returns:
        Dict with artifact info if found, None otherwise
    """
    log(f"Checking for notebook artifacts for {git_ref}...")
    
    # First try GitHub releases (often more reliable for tags)
    release_artifacts = check_release_artifacts(git_ref, github_token)
    if release_artifacts:
        return release_artifacts
    
    # Then try GitHub Actions artifacts
    headers = {}
    if github_token:
        headers['Authorization'] = f'token {github_token}'
    
    try:
        # Get recent workflow runs for the git ref
        url = f"https://api.github.com/repos/uclchem/UCLCHEM/actions/runs"
        params = {
            'branch': git_ref,
            'status': 'completed',
            'per_page': 10
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        
        runs = response.json().get('workflow_runs', [])
        
        for run in runs:
            # Look for successful runs with 'notebook' in workflow name
            if (run.get('conclusion') == 'success' and 
                'notebook' in run.get('name', '').lower()):
                
                # Check for artifacts
                artifacts_url = f"https://api.github.com/repos/uclchem/UCLCHEM/actions/runs/{run['id']}/artifacts"
                artifacts_response = requests.get(artifacts_url, headers=headers, timeout=30)
                artifacts_response.raise_for_status()
                
                artifacts = artifacts_response.json().get('artifacts', [])
                # Look for executed_notebooks-* artifacts specifically
                notebook_artifacts = []
                for a in artifacts:
                    name = a.get('name', '').lower()
                    if (name.startswith('executed_notebooks') or 
                        'executed-notebooks' in name or
                        'notebook' in name):
                        # Parse artifact name to extract version info
                        artifact_name = a.get('name', '')
                        version_info = _parse_artifact_name(artifact_name)
                        a['parsed_info'] = version_info
                        notebook_artifacts.append(a)
                
                if notebook_artifacts:
                    # Sort by relevance: prefer artifacts matching git_ref, then by name
                    def artifact_score(a):
                        parsed = a.get('parsed_info', {})
                        version = parsed.get('version', '')
                        
                        # Higher score = better match
                        score = 0
                        if version == git_ref:
                            score += 100  # Exact match
                        elif git_ref in version or version in git_ref:
                            score += 50   # Partial match
                        
                        # Prefer more recent (reverse alphabetical by name as proxy)
                        score += ord('z') - ord(a.get('name', 'z')[0].lower())
                        
                        # Store score in the artifact for debugging
                        a['score'] = score
                        return score
                    
                    notebook_artifacts.sort(key=artifact_score, reverse=True)
                    best_artifact = notebook_artifacts[0]
                    parsed = best_artifact['parsed_info']
                    
                    log(f"Selected artifact: {best_artifact['name']} (version: {parsed['version']}, commit: {parsed['commit']})", LogLevel.SUCCESS)
                    return {
                        'run_id': run['id'],
                        'artifacts': notebook_artifacts,
                        'created_at': run['created_at']
                    }
        
        log(f"No notebook artifacts found for {git_ref}", LogLevel.WARNING)
        return None
        
    except requests.RequestException as e:
        log(f"Error checking artifacts: {e}", LogLevel.ERROR)
        return None


def download_notebook_artifacts(artifact_info: Dict, output_dir: Path, github_token: Optional[str] = None) -> bool:
    """Download and extract notebook artifacts from GitHub Actions or releases.
    
    Args:
        artifact_info: Artifact info from check_notebook_artifacts()
        output_dir: Directory to extract notebooks to
        github_token: GitHub API token
        
    Returns:
        True if successful, False otherwise
    """
    log("Downloading pre-executed notebooks...")
    
    headers = {}
    if github_token:
        headers['Authorization'] = f'token {github_token}'
    
    try:
        # Download the first notebook artifact
        artifact = artifact_info['artifacts'][0]
        source = artifact_info.get('source', 'actions')
        
        if source == 'release':
            # Release assets use browser_download_url
            download_url = artifact['browser_download_url']
            log(f"Downloading from release: {artifact['name']}")
        else:
            # GitHub Actions artifacts use archive_download_url
            download_url = artifact['archive_download_url']
            log(f"Downloading from GitHub Actions: {artifact['name']}")
        
        response = requests.get(download_url, headers=headers, timeout=300, stream=True)
        response.raise_for_status()
        
        # Save zip file temporarily
        temp_zip = output_dir / "notebooks_temp.zip"
        output_dir.mkdir(parents=True, exist_ok=True)
        
        with open(temp_zip, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Extract zip file
        with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
            # List contents to understand structure
            file_list = zip_ref.namelist()
            log(f"Artifact contains {len(file_list)} files")
            
            # Extract all files
            zip_ref.extractall(output_dir)
            
            # Check if notebooks are in a subdirectory or at root
            extracted_notebooks = output_dir / "notebooks"
            if not extracted_notebooks.exists():
                # Files might be at root level, create notebooks/ directory
                extracted_notebooks.mkdir()
                
                # Move all .ipynb files to notebooks/ subdirectory
                for file_path in output_dir.glob("*.ipynb"):
                    file_path.rename(extracted_notebooks / file_path.name)
                    
                # Also move any subdirectories that might contain notebooks
                for item in output_dir.iterdir():
                    if item.is_dir() and item.name != "notebooks":
                        # Check if this directory contains notebooks
                        if any(item.glob("*.ipynb")):
                            # This is likely the notebooks directory, rename it
                            if item.name in ["executed_notebooks", "notebook"]:
                                item.rename(extracted_notebooks)
                                break
        
        # Clean up temp file
        temp_zip.unlink()
        
        log(f"Downloaded {len(artifact_info['artifacts'])} notebook artifacts", LogLevel.SUCCESS)
        return True
        
    except Exception as e:
        log(f"Error downloading artifacts: {e}", LogLevel.ERROR)
        return False


def trigger_notebook_action(git_ref: str, github_token: str, wait_for_completion: bool = True) -> bool:
    """Trigger the notebook execution GitHub Action.
    
    Args:
        git_ref: Git reference to process
        github_token: GitHub API token with workflow permissions
        wait_for_completion: Whether to wait for action to complete
        
    Returns:
        True if successful (or successfully triggered), False otherwise
    """
    log(f"Triggering notebook execution action for {git_ref}...")
    
    headers = {
        'Authorization': f'token {github_token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    try:
        # Trigger workflow dispatch
        url = "https://api.github.com/repos/uclchem/UCLCHEM/actions/workflows/notebooks.yml/dispatches"
        data = {
            'ref': git_ref,
            'inputs': {
                'notebooks_only': 'true'
            }
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        
        log("Notebook action triggered successfully", LogLevel.SUCCESS)
        
        if not wait_for_completion:
            return True
        
        # Wait for completion
        log("Waiting for notebook execution to complete...")
        
        max_wait_time = 20 * 60  # 20 minutes
        check_interval = 30  # 30 seconds
        waited = 0
        
        while waited < max_wait_time:
            time.sleep(check_interval)
            waited += check_interval
            
            # Check for new artifacts
            artifact_info = check_notebook_artifacts(git_ref, github_token)
            if artifact_info:
                # Check if artifact is recent (within last 30 minutes)
                import datetime
                created = datetime.datetime.fromisoformat(artifact_info['created_at'].replace('Z', '+00:00'))
                now = datetime.datetime.now(datetime.timezone.utc)
                age_minutes = (now - created).total_seconds() / 60
                
                if age_minutes < 30:
                    log(f"Fresh notebook artifacts available (age: {age_minutes:.1f} min)", LogLevel.SUCCESS)
                    return True
            
            if waited % 120 == 0:  # Log every 2 minutes
                log(f"Still waiting for notebooks... ({waited//60} min elapsed)")
        
        log("Timeout waiting for notebook execution", LogLevel.WARNING)
        return False
        
    except requests.RequestException as e:
        log(f"Error triggering notebook action: {e}", LogLevel.ERROR)
        return False
    
    log("Prerequisites validated successfully", LogLevel.SUCCESS)
