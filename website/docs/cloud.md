---
id: cloud
title: Cloud Core Model
---
**Main Contributors**: Serena Viti, Jon Holdship

The cloud model can be found in `src/cloud.f90` and is intended to model spherical clouds of gas and hot cores/corinos).

### Phase 1

In phase 1, the temperature is held constant and density can be kept constant (collapse=0) or made to increase in freefall (collapse=1). An arbitrary number of gas parcels can be modelled and are spaced evenly between rin and rout. That position is used to calculate the Av, H2 column density and CO column density between the parcel and cloud edge for interactions with UV. Due to the simplistic treatment of UV in UCLCHEM, the code should not be trusted at low Av.

Phase 1 is typically used to create a self-consistent set of gas conditions and chemical abundances for phase 2. The final state of the gas in this run can be written to `abundFile` by setting `readAbunds = 0`.

### Phase 2

In phase 2, the temperature increases following the temperature profiles given in [Viti et al. 2004](https://dx.doi.org/10.1111/j.1365-2966.2004.08273.x) with modifications by [Awad et al. 2010](https://dx.doi.org/10.1111/j.1365-2966.2010.17077.x). This is a time and radially dependent temperature profile intended to match the heat up of the gas around a hot core.

$$
T = 10 + A t^B \left(\frac{r}{R}\right)^{\frac{1}{2}} K
$$

Where $r$ is the distance from the centre of the core to the current point, $R$ is the radius of the core (`rout`) and $A$ and $B$ are empirically derived constants. These constants are determined by the mass of the hot core(ino) and cloud.f90 has the values for 1, 5, 10, 15, 25, and 60 solar masses, set by the `tempIndx` variable.