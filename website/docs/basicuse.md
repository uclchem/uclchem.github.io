---
id: basicuse
title: Basic Use
slug: /
---
## Compiling

UCLCHEM can be compiled and run from the top directory in the following way:

```

cd src
make
cd ..
./uclchem

```

The makefile `src/Makefile` contains a small number of user choices. Namely, the compiler and physics module. UCLCHEM comes with various physical models which can be chosen by setting the variable `PHYSICS` in the makefile to the correct fortran file. See [Physics](physics) for more information.

## Input parameters

All possible input parameters for UCLCHEM can be found in `src/defaultparameters.f90`. When the code is compiled, each parameter is set the value given in this file. Any changes to this file require a recompile.

Beyond this, any subset of parameters can be written to a file and the file path given to UCLCHEM at run time. This will modify the parameters for a single run. For example if we create a file called test.inp:

```

initialDens 1.0d2
finalDens 1.0d4
collapse 1

```

and then run UCLCHEM:

```

./uclchem test.inp

```

The code will run using the values in `src/defaultparameters.f90` except for the three parameters listed in test.inp which will take the values from that file.

## Outputs

UCLCHEM has two major outputs. The first is the ”full” output including the major gas properties and the fractional abundance of every single species in the network. This is written to the file given by the `outputFile` parameter and is written at every timestep.

Optionally, a cut down output can be created by suppling the `columnFile` and `outputSpecies` as inputs. This produces columnated file of time, density and temperature along with the abundances of the species in the `outputSpecies` array. The parameter `writeStep` sets how often this is written.
