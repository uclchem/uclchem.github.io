---
id: grids
title: Advanced Usage
---

## Python Module
A python module can be compiled through the command ```make python```. This produces ```uclchem.so``` which can be imported into python scripts and used to run UCLCHEM. This module contains each of the subroutines in ```src/wrap.f90``` as python functions with arguments that match the inputs of those subroutines.

```general()``` is a subroutine in wrap.f90 which takes a dictionary of parameters and a list of species as inputs. The dictionary can contain any of the parameters in ```src/defaultparameters.f90``` with the desired value as a key-value pair.

For more specific uses further subroutines can be added to wrap.f90. For example, a user may wish to create a copy of wrap.f90 where the abundances of certain species are outputs. This will allow those arrays to be returned as numpy arrays to the python script.

## Running Model Grids
The python module offers the simplest way to run a grid of models. ```scripts/grid.py``` uses pythons multiprocessing library to run a simple grid of models in parallel. 