---
id: network
title: Creating a Network
---

## MakeRates
In order to make a chemical model flexible, the ability to solve a user supplied chemical network is a must. UCLCHEM uses a preprocessing python script to turn csv lists of species and reactions into fortran files for use in the main code. This script is called MakeRates and can be found in a subdirectory of the repository. It combines a gas phase reaction database with user supplied lists of species and additional reactions into odes.f90 and network.f90 which contain all necessary information. It also supplies a number of human readable outputs.

**Any output from MakeRates requires that the code be recompiled from scratch (make clean, then make)**

## Inputs
Inputs for MakeRates can be found in ```MakeRates/inputFiles/``` and the specific files used by MakeRates can be changed in ```MakeRates/MakeRates.py```. MakeRates requires three inputs:

- A species list containing all species and their properties
- A gas phase reaction database in UMIST or KIDA formats
- A user supplied reaction database including all freeze out reactions at a minimum

A basic version of each of these is supplied with UCLCHEM include KIDA2014 and UMIST12. **We do not endorse the resulting network**, we have simply produced a grain surface network that was relatively up to date in 2018. It produces reasonable ice mantle abundances for major species and ignores larger COMs.  We strongly suggest any published work be based on a network in which the user has confidence. However, where the user is not greatly concerned with grain surface chemistry, the default network is a good starting point.

## Outputs

Outputs from MakeRates can be found in ```MakeRates/outputFiles/``` and must be copied to ```src``` to be included in UCLCHEM. They include:

- Network.f90 - Fortran arrays containing lists of species names and properties (mass, binding energy etc) as well as reaction reactants, products and rate coefficients.
- odes.f90 - Code to calculate the rate of change of each species' abundance for the numerical solver
- species.csv - A list of all species in the network and their properties. Made for humans not UCLCHEM.
- reactions.csv - A list of all reactions including reactants, products and coefficients. Made for humans not UCLCHEM.

## What MakeRates Does

MakeRates does the following:

- Combines the two input reaction lists
- Filters to remove any reactions containing species not in the input species list
- Checks all species freeze out
- Adds non-thermal desorption reactions for all frozen species
- Does basic network consistency checks and alerts user of problems
- Writes fortran files for UCLCHEM
- Writes other output files

## Creating your own Network
To create your own network you need to produce a species list and a reaction list.

##### Species list
The species list should simply be a list with one row per species in the network. Each row should contain the species name, mass, binding energy and enthalpy. The latter two are only used for surface species so can be set to zero for the gas phase species. MakeRates will check the mass is correct for each species and alert you of discrepancies.

##### Reaction list
The second reaction list is intended to contain your surface network but can also be used to augment the gas phase databases by including additional gas phase reactions. The reaction list should be a list with one row per reaction and each row should be a comma separated list of 3 reactants, 4 products, three coefficients (alpha,beta,gamma) and a minimum and maximum temperature. Any missing values such as a third reactant can be left blank. In particular, the temperatures are optional but you can including multiple versions of the same reaction and UCLCHEM will only use each one within its specified temperature range if included.

The third reactant can be used as a keyword to tell MakeRates what kind of reaction is occuring. In the absence of a keyword, MakeRates and UCLCHEM will treat any reaction as a gas-phase two body reaction. Two keywords the user may wish to use are ER and LH for Eley-Rideal and Langmuir-Hinshelwood reactions respectively (see [Grain Chemisty](grain/)). If LH is not added, UCLCHEM will assume a reaction between two surface reactions follows a  Kooji-Arrhenius equation.

For every species, the user reaction file should contain at least one freeze out route. This plus UMIST12 is the minimum possible reaction network. Some users may wish to freeze a species out as something other than itself and so MakeRates does not automatically add these reactions.

## Three Phase Chemistry

Whilst not strictly an input, there is a flag in ```MakeRates.py``` called ```three_phase```. If this is set to true, the chemical network will have gas, grain surface, and bulk ice chemistry. If it set to false, the ice mantles will be treated as a single phase. 

When true, MakeRates will create the bulk ice chemistry by adding a bulk version of each species with a binding energy equal to the H2O binding energy. It will also duplicate all LH reactions so they take place in the bulk and it will add terms to the ODEs to allow transfer between the bulk and the surface. See the chemistry sections for more information.