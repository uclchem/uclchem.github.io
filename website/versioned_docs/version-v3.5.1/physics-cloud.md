---
id: physics-cloud
title: Cloud Model
author: Jon Holdship
---
**Main Contributors**: Serena Viti, Jon Holdship

**Source**: src/fortran_src/cloud.f90

The cloud model is our simplest physical model and is intended to model spherical clouds of gas with constant physical conditions. The exception to this is the density which can be modified using the `freefall` parameter. 

Cloud is a 1D model that models positions through the cloud that are evenly spaced between some inner radius `rin` and the outer radius `rout`. The number of positions is set by the `points` parameter and each position is treated almost independently with no transfer of material between them. The one interaction they have is that positions closer to the edge of the cloud (rout) are used to calculate column densities for the positions further into the cloud. Since UCLCHEM treats self-shielding of H2, C and CO, it does a fair job of properly modelling UV processes in a 1D cloud.

However, we caution UCLCHEM's cloud is not a PDR model. It does not consider heating and cooling and uses a fixed temperature for all positions. Moreover, it is unlikely one will model enough positions in the low Av parts of the cloud to properly capture the self-shielding. Therefore, we recommend using [3D-PDR](https://uclchem.github.io/3dpdr) for your PDR modelling needs.

Cloud is more suitable for studing the UV shielded parts of molecular clouds. If we assume the only depth dependent effect on the chemistry in these clouds is the UV radiation, it becomes reasonable to assume the UV shielded parts of the cloud are homogeneous and can be modelled with a single point code. Thus, most users will use cloud with `points=1` and some combination of `rout`, `baseAv`, and density that produce a large Av.

<img src="/img/dark_cloud.png" width="600" margin-left="40%"/>


The other major use of cloud is to model a simple cloud of gas in order to calculate reasonable starting abundances for another model. We may wish to run a hot core or shock model for some investigation and require reasonable initial conditions for the gas. We do this by starting a cloud model with a low density gas of atoms and ions with no molecules or ices. We then allow it to collapse using the `freefall` parameter to reach the density of the gas in our science model. Whatever abundances are reached are then used as the starting abundances in the science model.