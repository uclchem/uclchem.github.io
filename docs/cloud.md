---
id: cloud
title: Cloud/Core Model
---
**Main Contributors**: Serena Viti, Jon Holdship

The cloud model can be found in ```src/cloud.f90``` and is intended to model spherical clouds of gas and hot cores/corinos).

### Phase 1
In phase 1, the temperature is held constant and density can be kept constant (collapse=0) or made to increase in freefall (collapse=1). An arbitrary number of gas parcels can be modelled and are spaced evenly between rin and rout. That position is used to calculate the Av, H2 column density and CO column density between the parcel and cloud edge for interactions with UV. Due to the simplistic treatment of UV in UCLCHEM, the code should not be trusted at low Av.

Phase 1 is typically used to create a self-consistent set of gas conditions and chemical abundances for phase 2. The final state of the gas in this run can be written to ```abundFile``` by setting ```readAbunds = 0```.

### Phase 2
In phase 2, the temperature increases following the temperature profiles given in Viti et al. 2004. This is a time and radially dependent temperature profile intended to match the heat up of the gas around a hot core.