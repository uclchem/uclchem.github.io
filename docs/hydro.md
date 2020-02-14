---
id: hydro
title:Hydro (Post Processing)
---
**Main Contributors**: Jon Holdship

UCLCHEM includes a post-processing module ```src/hydro.f90``` which is effectively a template as it necessarily requires user editing. The module reads in a columnated file of physical properties such as the output from a hydrodynamical model and creates interpolation functions.

As ```updatePhysics``` is called by UCLCHEM's main loop, these interpolation functions are called to get the physical properties of the gas at the current simulation time.

Whilst the maximum amount of information that can be read from the input file is set by the physical properties  UCLCHEM deals with, this is naturally a user dependent process. The input file format and the gas properties that are supplied (eg just density/temperature or density/temperature/Av) depend on the model being post processed. Thus ```src/hydro.f90``` needs to be edited to account for this.