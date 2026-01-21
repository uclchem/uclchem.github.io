---
id: physics-hotcore
title: Hot Core
author: Jon Holdship
---

# Hot Core

**Main Contributors**: Serena Viti, Jon Holdship

**Source**: src/fortran_src/hotcore.f90

The hot core model can be used to model the envelopes around hot cores as a single point or a 1D line of gas parels. The temperature in this model increases following the temperature profiles given in [Viti et al. 2004](https://dx.doi.org/10.1111/j.1365-2966.2004.08273.x) with modifications by [Awad et al. 2010](https://dx.doi.org/10.1111/j.1365-2966.2010.17077.x). These are time and radially dependent temperature profiles intended to match the heat up of the gas around a hot core.

$$
T = 10 + A t^B \left(\frac{r}{R}\right)^{\frac{1}{2}} K
$$

Where $r$ is the distance from the centre of the core to the current point, $R$ is the radius of the core (`rout`) and $A$ and $B$ are empirically derived constants. These constants have been determined for specific protostellar masses and the user can choose from 1, 5, 10, 15, 25, and 60 solar masses using the `tempIndx` variable when calling [uclchem.model.hot_core](../api/uclchem/model/index.rst)

A key aspect of hot cores is the sublimation of ices as the gas heats. TPD experiments have shown that this happens in multiple desorptions events per species rather than a single desorption once the temperature is enough to overcome the binding energy of a given species. In three phase models, this is achieved by the fact the binding energy of species in the bulk is assumed to be equal to the water binding energy, meaning a species will usually desorb from the surface earlier than from the bulk. In two phase networks, the hot core model uses the fixed desorption events of [Viti et al. 2004](https://dx.doi.org/10.1111/j.1365-2966.2004.08273.x) to mimic this.
