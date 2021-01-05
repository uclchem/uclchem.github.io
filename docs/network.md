---
id: network
title: Creating a Network
---

## Makerates
In order to make a chemical model flexible, the ability to solve a user supplied chemical network is a must. UCLCHEM uses a preprocessing python script the turns csv lists of species and reactions into fortran files for use in the main code. This script is called Makerates and can be found in a subdirectory of the repository. It combines the UMIST-12 gas phase reaction database with user supplied lists of species and additional reactions into odes.f90 and network.f90 which contain all necessary information. It also supplies a number of human readable outputs.

**Any output from Makerates requires that the code be recompiled**

## Inputs
Inputs for Makerates can be found in ```Makerates/inputFiles/``` and the specific files used by Makerates can be changed in ```Makerates/Makerates.py```. Makerates requires three inputs:

- A species list containing all species and their properties
- The UMIST12 gas phase reaction database
- A user supplied reaction database including all freeze out reactions at a minimum

A basic version of each of these is supplied with UCLCHEM. **We do not endorse that network**, we have simply produced a simple grain surface network that was relatively up to date in 2018 and produces reasonable ice mantle abundances for major species and ignores larger COMs.  We strongly suggest any published work be based on a network in which the user has confidence. However, where the user is not greatly concerned with grain surface chemistry, the default network is a good starting point.

## Outputs

Outputs from Makerates can be found in ```Makerates/outputFiles/``` and must be copied to ```src``` to be included in UCLCHEM. They include:

- Network.f90 - Fortran arrays containing lists of species names and properties (mass, binding energy etc) as well as reaction reactants, products and rate coefficients.
- odes.f90 - Code to calculate the rate of change of each species' abundance for the numerical solver
- species.csv - A list of all species in the network and their properties. Made for humans not UCLCHEM.
- reactions.csv - A list of all reactions including reactants, products and coefficients. Made for humans not UCLCHEM.

## What Makerates Does

Makerates does the following:

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
The species list should simply be a list with one row per species in the network. Each row should contain the species name, mass, binding energy and enthalpy. The latter two are only used for surface species so can be set to zero for the gas phase species. Makerates will check the mass is correct for each species and alert you of discrepancies.

##### Reaction list
The reaction list should be a list with one row per reaction and each row should be a comma separated list of 3 reactants, 4 products and three coefficients (alpha,beta,gamma). Any missing values such as a third reactant can be left blank. Any type of reaction that UCLCHEM can calculate can be placed in this file.

For every species, the user reaction file should contain at least one freeze out route. This plus UMIST12 is the minimum possible reaction network. The user may wish to freeze a species out as something other than itself and so Makerates does not automatically add these reactions. The reason for this is so that we can force reasonable behaviour without fully solving the grain surface chemistry. For example, we can freeze all O as H2O simply assuming that if we froze O and allowed hydrogenation to occur, it would be efficient enough that we don't notice the effects of immediately turning O to H2O on freeze out.

The user can go further and define multiple freeze out routes. For example, the freeze out of CO may follow two routes:

CO + Freeze → #CO (1)

CO + Freeze → #HCO (2)

Allowing us to build up the hydrogenation of CO all the way to CH3OH. If we assume that 90% of CO freezes as itself (#CO) and 10% to #HCO, the alphas should be 0.9 and 0.1 respectively. This will make the overall freeze out rate of CO correct for the model, whilst setting the proportions according to the assumptions.

More complicated surface chemistry can be obtained in two ways. Firstly, Quénard et al. [2018] describes a modification to UCLCHEM to include a diffusion formalism for the reaction of surface species. These are recognized by the code when a third reactant called either ”CHEMDES” or ”DIFF” is included in a surface reaction.

Secondly, in the absence of that keyword, Makerates and UCLCHEM will treat any reaction with two surface reactants exactly the same way as a gas-phase two body reaction. It may be possible to parameterize the rate of a surface reaction using the alpha, beta and gamma values of the Kooji-Arrhenius equation.