---
id: grids
title: Advanced Usage
---

## Python Module
A python module can be compiled through the command ```make python```. This produces ```uclchem.so``` which can be imported into python scripts and used to run UCLCHEM. This module contains each of the subroutines in ```src/wrap.f90``` as python functions with arguments that match the inputs of those subroutines. The are accessed in python as functions ```uclchem.wrap.subroutine_name()``` in all lowercase.

```run_model_to_file()``` is a subroutine in wrap.f90 which takes a dictionary of parameters and a list of species as inputs. The dictionary can contain any of the parameters in ```src/defaultparameters.f90``` with the desired value as a key-value pair. The result is a standard run of UCLCHEM. If an outputFile and/or columnFile is provided in the dictionary, the abundances are written to file.

```run_model_for_abundances()``` is a subroutine which runs UCLCHEM and returns an array of species abundances. It returns the species listed in ```OutSpeciesIn``` but F2PY can not handle variably sized arrays for inputs/outputs. As such, this subroutine needs to be updated and recompiled to change the number of output species.

For more specific uses further subroutines can be added to wrap.f90. We have abstract the core chemical solver loop and the dictionary parser so they can be easily included in additional subroutines, the user only needs to code the interface.

## Running Model Grids
The python module offers the simplest way to run a grid of models. ```scripts/grid.py``` uses pythons multiprocessing library to run a simple grid of models in parallel by calling ```run_model_for_abundances()``` repeatedly. This should serve as a useful example for most use cases but do get in touch if you'd like to use the wrap and cannot get it to do precisely what you'd like.