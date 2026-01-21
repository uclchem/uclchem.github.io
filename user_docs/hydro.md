---
id: hydro
title: Hydro Post Processing
---

# Hydro Post Processing

**Main Contributors**: Jon Holdship

## Python Postprocessing Module

UCLCHEM now includes a Python postprocessing module (`uclchem.postprocess`) that provides a modern interface for post-processing hydrodynamical simulations. This module offers similar functionality to the [NEATH](https://github.com/feredean/neath) tool but is integrated directly into UCLCHEM's Python interface.

The postprocessing module allows you to:
- Read outputs from hydrodynamical simulations
- Interpolate physical conditions (density, temperature, etc.)
- Run UCLCHEM chemistry along particle trajectories  
- Analyze chemical evolution in dynamic environments

See the [API documentation](../api/uclchem/index.rst) for details on the postprocessing module functions.

## Legacy Fortran Template

For advanced users who need custom behavior, UCLCHEM also includes a Fortran post-processing template `src/fortran_src/hydro.f90` which requires manual editing. The module reads in a columnated file of physical properties such as the output from a hydrodynamical model and creates interpolation functions.

As `updatePhysics` is called by UCLCHEM's main loop, these interpolation functions are called to get the physical properties of the gas at the current simulation time.

Whilst the maximum amount of information that can be read from the input file is set by the physical properties UCLCHEM deals with, this is naturally a user dependent process. The input file format and the gas properties that are supplied (eg just density/temperature or density/temperature/Av) depend on the model being post processed. Thus `src/fortran_src/hydro.f90` needs to be edited to account for this.

**Note**: Most users should prefer the Python postprocessing module over manual Fortran template editing.
