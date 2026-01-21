::: warning
**Note:** This documentation website has been recently revived and is under active restoration. Some pages or notebooks may be incomplete or missing outputs. Please do report any missing things or problems.
:::

## About UCLCHEM

UCLCHEM is a gas-grain chemical code for astrochemical modelling that can be used with Python. It evolves the abundances of chemical species through a chemical network of user-defined reactions including both ice and gas-phase chemistry.

UCLCHEM integrates with our **MakeRates** system, a Python tool that produces all files required for the chemical network. By combining reaction lists from astrochemistry databases such as UMIST and KIDA with custom (ice) reactions, users can quickly generate complex networks tailored to their research. We provide no warranty for the chemical networks you choose to use.

UCLCHEM is freely available for use and modification for any astrochemical purpose. We ask that users reference [our release paper](https://doi.org/10.3847/1538-3881/aa773f) if UCLCHEM is used in published work, and we welcome questions and suggestions. If you wish to contribute code, please refer to the contributing section.

::::{grid} 1 1 2 2
:gutter: 3

:::{grid-item-card} 🚀 Getting Started
:link: getting-started/index
:link-type: doc

New to UCLCHEM? Start here to install and run your first model.
:::

:::{grid-item-card} 📚 Tutorials
:link: tutorials/index
:link-type: doc

Step-by-step guides covering all aspects of UCLCHEM modelling.
:::

:::{grid-item-card} 📖 API Reference
:link: api/index
:link-type: doc

Complete reference documentation for all Python modules and functions.
:::

:::{grid-item-card} 🔬 User Guide
:link: user-guide/index
:link-type: doc

In-depth guides on physics models, chemical networks, and parameters.
:::

::::

## Key Features

- **Multiple Physics Models**: Static clouds, collapse models, prestellar cores, shocks (C-type and J-type).
- **Flexible Chemical Networks**: MakeRates generates custom networks from database and user-defined reactions
- **Modern Python Interface**: Object-oriented API wrapping an efficient Fortran core
- **Comprehensive Analysis**: Built-in tools for analyzing reaction pathways and element conservation
- **Multi-Stage Modelling**: Easily chain physical stages with different conditions

## Quick Example

```python
import uclchem

# Define model parameters
params = {
    "initialDens": 1e2,     # cm^-3
    "initialTemp": 10.0,    # K
    "finalTime": 1e6,       # years
    "freefall": True        # Enable collapse
}

# Create and run a cloud model
cloud = uclchem.model.Cloud(
    param_dict=params,
    out_species=["CO", "H2O", "CH3OH"]
)

# Check results
cloud.check_error()
print(f"Final CO abundance: {cloud.final_abundances['CO']:.2e}")

# Plot results
cloud.create_abundance_plot(species=["CO", "$CO", "H2O", "$H2O"])
```

## Getting Started

Install UCLCHEM via pip; this will compile the Fortran (you need a Fortran compiler!) core modules and install the Python module to your environment:

```bash
git clone https://github.com/uclchem/UCLCHEM.git
cd UCLCHEM
pip install .
```

We recommend using conda or virtual environments, since each installation compiles a single chemical network. See the [installation guide](getting-started/installation.md) for platform-specific instructions (macOS, Linux, Windows/WSL).

## Citation

If UCLCHEM is used in published work, please cite [our release paper](https://doi.org/10.3847/1538-3881/aa773f):

> Holdship, J., et al. (2017). "UCLCHEM: A Gas-Grain Chemical Code for Clouds, Cores, and C-Shocks." *The Astronomical Journal*, 154(2), 38.

## Explore the Ecosystem

::::{grid} 1 1 2 3
:gutter: 2

:::{grid-item-card} 📰 Papers
:link: papers/index
:link-type: doc

Publications using UCLCHEM and related research papers.
:::

:::{grid-item-card} 🔗 Other Projects
:link: projects/index
:link-type: doc

Related tools and projects in the UCLCHEM ecosystem.
:::

:::{grid-item-card} ✍️ Blog
:link: blog/index
:link-type: doc

News, updates, and announcements from the UCLCHEM team.
:::

::::

```{toctree}
:hidden:
:maxdepth: 2

getting-started/index
tutorials/index
user-guide/index
api/index
api/fortran/index
papers/index
projects/index
blog/index
contributing/index
```
