# Contributing to UCLCHEM

Thank you for your interest in contributing to UCLCHEM! This guide will help you get started.

## Ways to Contribute

::::{grid} 1 1 2 2
:gutter: 3

:::{grid-item-card} 🐛 Report Bugs
:link: https://github.com/uclchem/UCLCHEM/issues

Found a bug? Let us know!
:::

:::{grid-item-card} 💡 Suggest Features
:link: https://github.com/uclchem/UCLCHEM/issues

Have an idea? We'd love to hear it!
:::

:::{grid-item-card} 📝 Improve Docs
:link: https://github.com/uclchem/UCLCHEM/pulls

Help make our docs better
:::

:::{grid-item-card} 💻 Write Code
:link: https://github.com/uclchem/UCLCHEM/pulls

Contribute new features or fixes
:::

::::

## Getting Started

### 1. Set Up Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/UCLCHEM.git
cd UCLCHEM

# Create a development branch
git checkout -b feature-name develop

# Install in development mode
pip install -e ".[dev]"
```

### 2. Make Your Changes

Follow our coding standards (see below).

### 3. Test Your Changes

```bash
# Run the test suite
pytest tests/

# Run specific tests
pytest tests/test_install.py
```

### 4. Submit a Pull Request

1. Push your branch to your fork
2. Open a pull request against the `develop` branch
3. Describe your changes clearly
4. Wait for review and feedback

## Coding Standards

### Python Code

- **Formatter**: Use [Black](https://github.com/psf/black)
- **Style**: PEP 8 conventions
- **Naming**: snake_case for variables and functions
- **Docstrings**: Required for all public functions (NumPy style)

Example:

```python
def calculate_abundance(species, time, density):
    """Calculate species abundance at given time.
    
    Parameters
    ----------
    species : str
        Species name
    time : float
        Time in years
    density : float
        Gas density in cm^-3
        
    Returns
    -------
    abundance : float
        Species abundance relative to H nuclei
    """
    pass  # Implementation
```

### Fortran Code

- **Style**: camelCase for variables and subroutines
- **Built-ins**: CAPITALIZED (e.g., `ALLOCATE`, `OPEN`)
- **Modules**: Group related functionality
- **Comments**: Explain non-obvious logic

Example:

```fortran
SUBROUTINE calculateRate(temperature, rate)
    ! Calculate reaction rate at given temperature
    REAL(dp), INTENT(IN) :: temperature
    REAL(dp), INTENT(OUT) :: rate
    
    rate = alpha * (temperature / 300.0_dp)**beta
END SUBROUTINE calculateRate
```

## Git Workflow

### Branches

- **`main`**: Stable releases only
- **`develop`**: Active development (target for PRs)
- **Feature branches**: Your development work

### Commit Messages

Write clear, descriptive commit messages:

```bash
# Good
git commit -m "Add support for custom heating rates"
git commit -m "Fix integration error in collapse model"

# Less good
git commit -m "Fix bug"
git commit -m "Update code"
```

### Pull Requests

- Target the `develop` branch
- Include a clear description of changes
- Reference related issues (e.g., "Fixes #123")
- Squash and merge is preferred

## Testing

### Running Tests

```bash
# All tests
pytest tests/

# Parallel execution
pytest -n auto tests/

# Specific test file
pytest tests/test_run_stages_memory.py

# With coverage report
pytest --cov=uclchem tests/
```

### Writing Tests

Add tests for new features:

```python
# tests/test_my_feature.py
import uclchem
import pytest

def test_my_new_feature():
    """Test description."""
    result = uclchem.my_new_function()
    assert result == expected_value
```

## Documentation

### Building Documentation Locally

```bash
cd docs
pip install -r requirements.txt
sphinx-build -b html . _build/html

# Or use autobuild for live reload
sphinx-autobuild . _build/html
```

### Writing Documentation

- Use MyST Markdown for all docs
- Include code examples
- Add cross-references with Sphinx roles
- Follow the existing structure

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what's best for the community
- Accept constructive criticism gracefully

## Questions?

- **GitHub Issues**: General questions and discussions
- **Pull Requests**: Code-related questions
- **Email**: Contact the development team

## Recognition

Contributors are acknowledged in:
- The README file
- Release notes
- Academic papers (for significant contributions)

Thank you for contributing to UCLCHEM! 🎉

```{toctree}
:maxdepth: 1
:hidden:

style-guide
```
