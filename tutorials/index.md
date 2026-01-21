# Tutorials

Interactive tutorials to help you master UCLCHEM through practical examples.

## Tutorial Structure

Our tutorials are organized by topic and difficulty level:

::::{grid} 1 1 2 2
:gutter: 3

:::{grid-item-card} 🎯 Basics
:link: basics/index
:link-type: doc

Essential concepts and your first models
:::

:::{grid-item-card} � Analysis
:link: analysis/index
:link-type: doc

Analyzing and visualizing results
:::

:::{grid-item-card} 🚀 Advanced
:link: advanced/index
:link-type: doc

Complex models and advanced features
:::

:::{grid-item-card} ⚙️ Customization
:link: customization/index
:link-type: doc

Custom networks and advanced settings
:::

::::

## Learning Path

We recommend following tutorials in this order:

1. **First Model** - Run your first UCLCHEM simulation
2. **In-Memory Modelling** - Work with models in memory
3. **Parameter Grids** - Run parameter surveys efficiently
4. **Chemical Analysis** - Analyze reaction pathways and networks
5. **Heating & Cooling** - Understand thermal processes
6. **Advanced Settings** - Fine-tune your models

## All Tutorials

```{toctree}
:maxdepth: 2

basics/index
analysis/index
advanced/index
customization/index
legacy/index
```

## Running the Tutorials

All tutorials are available as Jupyter notebooks in the UCLCHEM repository:

```bash
# Clone the repository if you haven't already
git clone https://github.com/uclchem/UCLCHEM.git
cd UCLCHEM/notebooks

# Launch Jupyter
jupyter notebook
```

```{tip}
You can also view and run tutorials directly on [GitHub](https://github.com/uclchem/UCLCHEM/tree/main/notebooks) or [Binder](https://mybinder.org) (link coming soon).
```

## Prerequisites

Most tutorials assume you have:

- UCLCHEM installed (see [Installation Guide](../getting-started/installation.md))
- Basic Python knowledge
- Familiarity with NumPy and Matplotlib
- Basic understanding of astrochemistry concepts

Don't worry if you're new to some of these - we explain as we go!

## Need Help?

If you get stuck:

1. Check the [API Reference](../api/index.rst) for function details
2. Review the [User Guide](../user-guide/index.md) for conceptual explanations
3. Look at [examples](https://github.com/uclchem/UCLCHEM/tree/main/examples) in the repository
4. Open an issue on [GitHub](https://github.com/uclchem/UCLCHEM/issues)
