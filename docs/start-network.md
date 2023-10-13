---
id: network
title: Creating a Network
---

## MakeRates
In order to make a chemical model flexible, the ability to solve a user supplied chemical network is a must. UCLCHEM uses a preprocessing python script to turn csv lists of species and reactions into fortran files for use in the main code. This script is called MakeRates and can be found in the Makerates subdirectory of the repository. It combines a gas phase reaction database with user supplied lists of species and additional reactions into the necessary Fortran code to run UCLCHEM. It also supplies a number of human readable outputs.

In the sections below, we discuss how to build your network and set the inputs for MakeRates but once that is done, you can run MakeRates with the following commands:

```bash
cd MakeRates
python MakeRates.py
cd ..
pip install -e .
```

**Note the pip install at the end of the process. Any output from MakeRates requires that the code be recompiled because MakeRates produces new source code for UCLCHEM!**


## Input
Makerates is controlled using a yaml file `Makerates/user_settings.yaml`. By changing the values in this file, you can create different networks. The default values of this file are copied below.

```yaml
#Your list of all species
species_file : inputFiles/default_species.csv

#core reactions from gas phase database
database_reaction_file : inputFiles/umist12-ucledit.csv
database_reaction_type : UMIST

#set of additional reactions: eg grain network
custom_reaction_file : inputFiles/default_grain_network.csv
custom_reaction_type : UCL

#whether to automatically expand to three phase network
three_phase : True
```

**species_file** is a csv list of species and their properties. We provide a default list and detailed instructions below.

**database_reaction_file** is your first reaction file, we expect most users to use UMIST12 or KIDA2014 for this but you could create your own file from an alternative database. Makerates can read files formatted in the same manner as the UMIST or KIDA databases as well as our own simple csv format, the `database_reaction_type` setting lets MakeRates know which and should be set to 'UMIST', 'KIDA', or 'UCL'.

**custom_reaction_file** is an additional reaction file. In the example file, we include all of our grain surface reactions which is the intended use of this file. 

**three_phase** is a toggle that tells MakeRates whether to automatically expand your network into a three phase model.

## Default Network
A basic version of each of the required file is supplied in the repository. The network that MakeRates produces from those files is also include in the source code so that a new user who simply installs UCLCHEM without running MakeRates will be using our default network. These default files serve largely as examples of how the files should be formatted and we also describe each one below so that the user can produce their own network.

**We do not endorse the default network**, we have simply produced a grain surface network that was relatively up to date in 2018. It produces reasonable ice mantle abundances for major species and ignores larger COMs.  We strongly suggest any published work be based on a network in which the user has confidence. However, where the user is not greatly concerned with grain surface chemistry, the default network is a good starting point.

## Outputs

Outputs from MakeRates are automatically moved to the `src/` directory so the user can `pip install .` and update their installation of UCLCHEM to use their new network. However, by adding the parameter `output_directory` to the yaml file, you can have all the files moved to a directory instead without copying them to your UCLCHEM src folder. If you do, the following files will be produced:

- network.f90 - Fortran arrays containing lists of species names and properties (mass, binding energy etc) as well as reaction reactants, products and rate coefficients.
- odes.f90 - Code to calculate the rate of change of each species' abundance for the numerical solver
- species.csv - A list of all species in the network and their properties. Made for humans not UCLCHEM.
- reactions.csv - A list of all reactions including reactants, products and coefficients. Made for humans not UCLCHEM.

## What MakeRates Does

MakeRates does the following:

- Combines the two input reaction lists
- Filters to remove any reactions containing species not in the input species list
- Adds freeze out and desorption reactions for all species
- Creates branching reactions for Langmuir-Hinshelwood and Eley-Rideal reactions where products chemically desorb
- Optionally: creates additional reactions and species needed for a three phase network
- Does basic network consistency checks and alerts user of problems
- Writes fortran files for UCLCHEM
- Writes other output files

## Creating your own Network
To create your own network you need to produce a species list and a reaction list.

#### Species list
The species list should simply be a list with one row per species in the network. Each row should contain the species name, mass, binding energy and enthalpy of formation. The latter two are only used for surface species so can be set to zero for the gas phase species. MakeRates will check the mass is correct for each species and alert you of discrepancies.

```
C,12,0,0,0,0,0
#CH4,16,960,0,0.7,0.667,-15.9
```

In the above example, C is a gas phase species so we have set the mass but ignored the other variables. #CH4 is methane in the ice so we have additionally set a binding energy of 960 K and enthalpy of formation of -15.9 kcal/mol. The other three values (0, 0.7, 0.667) are desorption fractions that three phase chemistry networks ignore. For two phase networks, we mimic the multiple desorption events seen in TPD experiments by setting these fractions. See [Viti et al. 2004](https://ui.adsabs.harvard.edu/abs/2004MNRAS.354.1141V/abstract) for more information.

The enthalpy of formation for essentially any species can be found in chemical databases such as the [NIST web book](https://webbook.nist.gov/). They're usually in kj/mol but the conversion to kcal/mol is easy enough and NIST has an option to switch values to kcal. A fantastic resource for binding energies is [Wakelam et al. 2017](https://dx.doi.org/10.1016/j.molap.2017.01.002) but these are harder to find in general. In the absolute worse case, you can sum up the binding energies of sub-groups in your molecule but this is pretty inaccurate.

#### Reaction list
The second reaction list is intended to contain your surface network but can also be used to augment the gas phase databases by including additional gas phase reactions. The reaction list should be a list with one row per reaction and each row should be a comma separated list of 3 reactants, 4 products, three coefficients (alpha,beta,gamma) and a minimum and maximum temperature. Any missing values such as a third reactant can be left blank. In particular, the temperatures are optional but can be useful when you include multiple versions of the same reaction. In that case, UCLCHEM will only use each one within its specified temperature range.

The third reactant can be used as a keyword to tell MakeRates what kind of reaction is occuring. In the absence of a keyword, MakeRates and UCLCHEM will treat any reaction as a gas-phase two body reaction. Two keywords the user may wish to use are ER and LH for Eley-Rideal and Langmuir-Hinshelwood reactions respectively (see [Grain Chemisty](grain/)). If a keyword is not added, UCLCHEM will assume a reaction between two surface reactions follows a Kooji-Arrhenius equation.

Two other useful reactions types to include are FREEZE and DESORB. Makerates adds freeze out and desorption reactions for every species, assuming they remain unchanged by the process. For example, CO in the gas becomes #CO on the grain. If you would instead like to specify the products, you can include a reaction:

```
H3O+,FREEZE,,#H2O,H,,,1,0,0,,,
#HPN,DESORB,,HPN+,,,,1,0,0,,,
```
which will override the desorption or freeze out products of a species. 

## Three Phase Chemistry

The input ```three_phase``` controls whether the ices are treated as a single phase or the surface is treated separated to the bulk. If `three_phase` is set to true, the chemical network will have gas, grain surface, and bulk ice chemistry. If `three_phase` is set to false, the chemical network will have gas and grain surface chemistry.

When true, MakeRates will create the bulk ice chemistry by duplicating the surface species and reactions in your input files. The difference will be that, unless you specifically override the bulk binding energy, every species in the bulk has a binding energy equal to the H2O binding energy. It will also add terms to the ODEs to allow transfer between the bulk and the surface. See the chemistry sections for more information.

You can override the binding energy of material in the bulk by explicitly including the bulk species in your species file rather than allowing MakeRates to automatically add it. Bulk species are designated with an "@". For example, "H2O" is gas phase H$_2$O, "#H2O" is surface H$_2$O and "@H2O" is H$_2$O in the bulk. If you set the binding energy to "Inf", the species will not leave the grains during thermal desorption. This allows you to model refractory species in the bulk.
