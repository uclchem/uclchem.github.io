---
id: desorb
title: Desorption Reactions
---

UCLCHEM considers a number of non-thermal desorption mechanisms that are automatically added to the network by Makerates. With small updates, the non-thermal desorption process considered by UCLCHEM are described by Roberts et al. 2007.

## Thermal Desorption

Whilst Makerates is capable of adding thermal desorption following the Hasegawa et al. 1992 formalism, this is activated by a flag in ```src/Makerates.py``` which is turned of by default. Where a physics model includes heating, we prefer to have that model deal with the thermal sublimation rather than a general reaction.

Thermal desorption is most relevant to cloud.f90 which can be used to model hot cores. As the temperature increases, sublimation can occur. However, TPD experiments (Collings et al. 2004) show that this happens in bursts rather than as a continuous process. Thus cloud.f90 handles these bursts rather than calling a thermal desorption reaction in the chemical network.

## Non-thermal Desorption Methods

##### H2 Formation
H2 molecules form when H atoms meet briefly on grain surfaces. The reaction is sufficiently exothermic that not only is the product is released into the gas phase but the surrounding grain material is also heated. 

##### Cosmic Rays
Cosmic rays which impact the grains can free molecules from the surface.

##### UV photons
Surface molecules which absorb a UV photon may gain sufficient energy to escape the surface. We consider secondary photons created by cosmic rays as well as the interstellar radiation field.