---
id: parameters
title: Model Parameters
---

Chemical models such as UCLCHEM depend on a huge number of parameters. Listed on this page are all parameters made to be easily modified by a user. They largely reflect the physical conditions of the gas in and control the behaviour of the model.

All other parameters are listed in the header of the relevant Fortran module and we do not recommend that they are altered.

## Physical Variables
|Parameter |Description|
| ----- | ------ |
| initialTemp | Initial gas temperature for all gas parcels in model|
| maxTemp | Maximum temperature the gas can reach |
| initialDens | Initial gas density for all gas parcels in model |
|finalDens|Final gas density achieve through any collapse process|
|currentTime|Time at start of model|
|finalTime|Time at model finish (see switch)|
|radfield|Interstellar radiatin field in Habing|
|zeta|Cosmic ray ionisation rate as multiple of 1.3e-17|
|rout|Outer radius of cloud being modelled|
|rin |Minimum radial distance from center of cloud to consider|
|baseAV|Extinction at cloud edge - Av of a parcel at rout|
|points|Number of gas parcels equally distributed between rin and rout to consider|

## Behavioural Modifiers
|Parameter |Description|
| ----- | ------ |
|phase| Most physics modules will simulate a static cloud for phase=1 and the intended physics for phase=2|
|fr|Scale freeze out efficiency by an aribtrary value.0.0-1.0 |
|switch | Choose if model ends at finalTime (switch=0) of when gas reachees finalDens (1)|
|collapse | Controls whether gas collapses in freefall (0/1). collapse.f90 uses 2/3/4 for different collapse modes|
|bc| Scale factor 0-1.0 controlling speed of freefall.|
|readAbunds| *Deprecated*. Older versions of UCLCHEM use this flag to determine whether to read abundances at the start (0) from abundFile or write to that file at the end (1). This has been replaced with `abundSaveFile` and `abundLoadFile` allowing you to do both or neither.|
|desorb| Turns all non-thermal desorption processes off if set to 0 otherwise allows them|
|h2desorb| Individually turn on and off non-thermal desorption due to H2 formation|
|crdesorb| Individually turn on and off non-thermal desorption due to cosmic rays|
|uvcr| Individually turn on and off non-thermal desorption due to UV photons|
|instantSublimation| If set to 1 will immediately inject all grain surface material into gas otherwise will follow physics module|
|ion|Control how much elemental C is initialised in atomic and ionic form (see chemistry.initialize_chemistry)|
|Tempindx| Only for phase=2 of cloud model. Sets mass of protostar for hot core 1=1Msol,2=5,3=10M,4=15M,5=25M,6=60M|
|vs | Shock velocity for cshock.f90 and jshock.f90|

## Input and Output
|Parameter |Description|
| ----- | ------ |
| outputFile | A full output of abundances is written by default and is written to this file|
| columnFile | If outSpecies is set a columnated output of time,density,temperature and abundances of those species is written to this file|
|abundSaveFile| File to store final abundances at the end of the model so future models can use them as the initial abundances. If not provided, no file will be produced.|
|abundLoadFile| File from which to load initial abundances for the model, created through `abundSaveFile`. If not provided, the model starts from elemental gas. |
|outSpecies| Array of species names for writing to column file. Fortran will reject this array if species names are not padded with spaces to all be the same length.|
|writeStep| Sets how often columns written out. Columns written every n steps for writeStep=n.|