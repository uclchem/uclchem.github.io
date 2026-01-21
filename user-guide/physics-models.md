# Physics Models

UCLCHEM includes several physics modules that model different astrophysical environments. Each module implements specific physical processes — density evolution, temperature profiles, shock physics — alongside the chemical network. This guide introduces the available models and helps you choose the right one for your research.

## Available Models

UCLCHEM provides six physics modules:

::::{grid} 1 1 2 3
:gutter: 3

:::{grid-item-card} {octicon}`cloud` Cloud
:link: ../user_docs/physics-cloud
:link-type: doc

Static or collapsing spherical clouds with depth-dependent chemistry
+++
{bdg-link-primary}`uclchem.model.cloud() <../api/uclchem/model/index.rst>`
:::

:::{grid-item-card} {octicon}`graph` Collapse
:link: ../user_docs/physics-collapse
:link-type: doc

Power-law density evolution for gravitational collapse
+++
{bdg-link-primary}`uclchem.model.collapse() <../api/uclchem/model/index.rst>`
:::

:::{grid-item-card} {octicon}`flame` Hot Core
:link: ../user_docs/physics-hotcore
:link-type: doc

Warm-up from cold core to hot protostellar environment
+++
{bdg-link-primary}`uclchem.model.hot_core() <../api/uclchem/model/index.rst>`
:::

:::{grid-item-card} {octicon}`broadcast` C-Shock
:link: ../user_docs/physics-shocks
:link-type: doc

C-type magnetohydrodynamic shocks with ion-neutral drift
+++
{bdg-link-primary}`uclchem.model.cshock() <../api/uclchem/model/index.rst>`
:::

:::{grid-item-card} {octicon}`zap` J-Shock
:link: ../user_docs/physics-shocks
:link-type: doc

J-type jump shocks with discontinuous fronts
+++
{bdg-link-primary}`uclchem.model.jshock() <../api/uclchem/model/index.rst>`
:::

:::{grid-item-card} {octicon}`repo` Hydro
:link: ../user_docs/hydro
:link-type: doc

Post-process hydrodynamical simulation outputs
+++
{bdg-link-primary}`Python postprocess module <../api/uclchem/index.rst>`
:::

::::

## Quick Guide: Choosing a Model

**For static molecular clouds:** Use [Cloud](../user_docs/physics-cloud.md) with `freefall=0`. Good for UV-shielded regions with constant density and temperature.

**For collapsing clouds:** Use [Cloud](../user_docs/physics-cloud.md) with `freefall=1` for simple freefall, or [Collapse](../user_docs/physics-collapse.md) for specific density profiles.

**For prestellar cores:** Use [Prestellar Core](../user_docs/physics-hotcore.md) to model warm-up from a cold initial state to protostellar temperatures with ice sublimation.

**For shock chemistry:** Use [C-Shock](../user_docs/physics-shocks.md) for magnetized shocks or [J-Shock](../user_docs/physics-shocks.md) for fast, discontinuous shocks.

**For hydrodynamical simulations:** Use the [Hydro postprocessing module](../user_docs/hydro.md) to integrate UCLCHEM chemistry along particle trajectories.

## Common Features

All physics modules share core capabilities:

- **1D spatial structure**: Most models support multi-point calculations with depth-dependent UV shielding. See Tram et al 2026 for a detailed treatment.
- **Time integration**: ODE solver advances chemistry and physics together
- **Output control**: Flexible frequency and format options
- **Multi-stage workflows**: Link models in sequence (e.g., cloud → prestellar core → shock model)

## Getting Started

The best way to learn is through examples:

**Tutorials:**
- [First Model](../notebooks/1_first_model.ipynb) — Run a basic cloud model
- [Multi-stage Modelling](../notebooks/2a_modelling_objects_on_disk.ipynb) — Chain physics modules
- [Advanced Settings](../notebooks/6_advanced_settings.ipynb) — Custom physics

**Detailed Documentation:**
Each model has comprehensive documentation covering physics equations, parameters, and best practices. See the linked pages above or the [User Guide index](index.md#physics-models).

**API Reference:**
All physics functions are documented in the [API section](../api/uclchem/model/index.rst) with complete parameter lists and return values.

```{seealso}
- [Parameters Reference](parameters.md) for model-specific parameters  
- [Chemical Networks](chemical-networks.md) for chemistry alongside physics  
- [Tutorial Notebooks](../notebooks/) for hands-on examples
```
