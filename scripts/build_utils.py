#!/usr/bin/env python3
"""
Utility functions for multi-version documentation builds.
Provides reusable operations for git, package management, and Sphinx builds.
"""

import os
import subprocess
import sys
import shutil
from pathlib import Path
from typing import Optional, Dict, List, Tuple
from enum import Enum


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
    
    log("Prerequisites validated successfully", LogLevel.SUCCESS)
