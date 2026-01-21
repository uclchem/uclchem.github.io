# User Guide

Comprehensive guides covering UCLCHEM's features, physics models, and parameters.

## Guide Sections

::::{grid} 1 1 2 2
:gutter: 3

:::{grid-item-card} 🌌 Physics Models
:link: physics-models
:link-type: doc

Understanding UCLCHEM's different physics modules
:::

:::{grid-item-card} ⚙️ Parameters
:link: parameters
:link-type: doc

Complete reference for all model parameters
:::

:::{grid-item-card} 🔬 Chemical Networks
:link: chemical-networks
:link-type: doc

How UCLCHEM handles gas-grain chemistry
:::

:::{grid-item-card} 🛠️ MakeRates
:link: makerates
:link-type: doc

Creating and modifying chemical networks
:::

::::

```{toctree}
:maxdepth: 2
:caption: Core Guides

physics-models
parameters
chemical-networks
makerates
```

```{toctree}
:maxdepth: 2
:caption: Physics Models

../user_docs/physics-cloud
../user_docs/physics-collapse
../user_docs/physics-core
../user_docs/physics-hotcore
../user_docs/physics-shocks
../user_docs/hydro
```

```{toctree}
:maxdepth: 2
:caption: Chemistry

../user_docs/chem-notation
../user_docs/chem-gas
../user_docs/chem-grain
../user_docs/chem-desorb
../user_docs/chem-bulk
../user_docs/start-network
```

```{toctree}
:maxdepth: 2
:caption: Development

../user_docs/dev-overview
../user_docs/dev-debugging
../user_docs/dev-python-wrap
../user_docs/dev-web
```

```{toctree}
:maxdepth: 2
:caption: Troubleshooting

../user_docs/trouble-compile
../user_docs/trouble-integration
```

## Overview

UCLCHEM is designed to model the time-dependent chemistry of astrophysical environments. It solves the ordinary differential equations (ODEs) describing the evolution of chemical abundances under various physical conditions.

### Key Concepts

**Hybrid Architecture**: UCLCHEM combines Python (user interface) with Fortran (numerical computation) for both ease of use and performance.

**Gas-Grain Chemistry**: Models both gas-phase reactions and surface chemistry on dust grains.

**Flexible Physics**: Multiple physics modules support different astrophysical scenarios (clouds, cores, shocks).

**Customizable Networks**: Create specialized chemical networks with the MakeRates tool.

## Quick Reference

### Physics Models

| Model | Function | Use Case |
|-------|----------|----------|
| Cloud | `uclchem.model.cloud()` | Static or collapsing spherical clouds |
| Collapse | `uclchem.model.collapse()` | Specific collapse profiles (BE, filament, etc.) |
| C-Shock | `uclchem.model.cshock()` | Magnetohydrodynamic shocks |
| J-Shock | `uclchem.model.jshock()` | Discontinuous shocks |

See [Physics Models](physics-models.md) for details.

### Common Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialDens` | float | Initial gas density (cm⁻³) |
| `initialTemp` | float | Initial temperature (K) |
| `finalTime` | float | Simulation end time (years) |
| `freefall` | bool | Enable gravitational collapse |
| `zeta` | float | Cosmic ray ionization rate (s⁻¹) |
| `radfield` | float | UV radiation field (Habing units) |

See [Parameters](parameters.md) for the complete list.

## Workflow Overview

A typical UCLCHEM workflow:

1. **Choose a physics model** - Select the appropriate model for your scenario
2. **Set parameters** - Define initial conditions and physical parameters
3. **Run the model** - Execute the simulation
4. **Analyze results** - Extract abundances, reaction rates, etc.
5. **Iterate** - Refine parameters or try different conditions

## Best Practices

```{tip}
**Start with defaults**: All parameters have sensible defaults. Override only what you need.
```

```{tip}
**Check convergence**: Monitor the success flag and consider adjusting solver tolerances if needed.
```

```{tip}
**Document your models**: Keep track of parameter choices for reproducibility.
```

```{warning}
**Network modifications require reinstallation**: After running MakeRates, always `pip install .` to recompile.
```

## Getting Help

- **Tutorials**: See [Tutorials](../tutorials/index.md) for worked examples
- **API Reference**: Check [API docs](../api/index.rst) for function details
- **GitHub**: Report issues or ask questions on [GitHub](https://github.com/uclchem/UCLCHEM/issues)
- **Papers**: Read published [papers](../papers/index.md) using UCLCHEM
