---
id: physics
title: Physics Modules
---

UCLCHEM is built using Fortran modules and one advantage of this is the ability to swap out the physical model that the code uses with relative ease. UCLCHEM comes with the following files:
- cloud.f90
- collapse.f90
- cshock.f90
- hydro.f90
- jshock.f90

Each of which can be set as the physics module in ```src/Makefile```. They control aspects of the model such as the density and temperature evolution as well any sublimation that occurs due to processes such as warming and sputtering. The general structure of these modules is discussed below and each module has it's own page describing the physics model.

### Phases
Most modules act in different ways based on the ```phase``` parameter. ```phase=1``` will make the code model a cloud of gas with a constant temperature and a density that is either static or collapses in freefall ```collapse=0/1```. Typically, UCLCHEM users set ```phase=1; collapse=1; readAbund=0``` to collapse a cloud of low density gas to the starting density of the object they wish to model. This creates a file containing the gas properties and abundances of a cloud of gas at the required density where the chemical abundances have been self-consistently generated from the network rather than assumed.

One can then model the intended physics by setting ```phase=2; readAbund=1```. For example, in the shock models if ```phase=2``` the density and temperature of the gas to follow the profile of a gas undergoing a shock and the ices are sputtered accordingly. The change to readAbund will have the code read in the starting conditions that were written after the first phase.