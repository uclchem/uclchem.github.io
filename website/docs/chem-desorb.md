---
id: desorb
title: Adsorption & Desorption Reactions
---

Coupling between the gas and the grain chemistry primarily comes from the freeze out of material from the gas phase onto the dust grains (adsorption) and the sublimation of material from the grains into the gas phase (desorption). The major processes considered by UCLCHEM are listed below.

## Freeze out
We assume that up to 30 K, molecules freeze out at a rate given by the rate of collision between a species and the dust grains:
$$
k=\alpha v_{th} A_g C_{ion}
$$
where $\alpha$ is a branching ratio, $V_{th}$ is the thermal velocity of the particle and $A_g$ is the dust grain cross sectional area per hydrogen nuclei. $C_{ion}$ is a factor that increases the freeze out rate of ions due to electrostatic forces.

The branching ratio is an artefact of older versions of UCLCHEM which allows the user to include some grain processing of species without surface reactions. For a given species (eg C) we can determine several species that will rapidly form on the grain (CH,CH4) and freeze some portion of the original species (C) out to these products. This allows fast processes like hydrogenation to be treated without a network of surface reactions. *However, users should default to using a branching ratio of 1 and allowing surface reactions to take place*.

## Thermal Desorption

We include thermal desorption of material from the grains based on the binding energy of each species to the ices. 
$$

k = \nu_{diff} \exp(\frac{-E_B}{T})
$$

This can be simply multiplied by the surface abundance of a species to get its rate of change when using a three phase network. However, for two phases, we multiply by the fraction of the total ice particle which are a given species and by the number of surface sites per volume. This accounts for the fact a majority of the ice material cannot thermally desorb as it not on the surface.

Thermal desorption is most relevant to cloud.f90 which can be used to model hot cores. As the temperature increases, sublimation can occur. However, TPD experiments (Collings et al. 2004) show that this happens in bursts rather than as a continuous process. These bursts happen naturally in the three phase model as the surface is removed and then the bulk. However, for a two phase network, such bursts need to be simulated. Thus cloud.f90 handles these bursts in the two phase case and the user should turn off thermal desorption.

## Non-thermal Desorption Methods

##### H2 Formation
H2 molecules form when H atoms meet briefly on grain surfaces. The reaction is sufficiently exothermic that not only is the product is released into the gas phase but the surrounding grain material is also heated. 

##### Cosmic Rays
Cosmic rays which impact the grains can free molecules from the surface.

##### UV photons
Surface molecules which absorb a UV photon may gain sufficient energy to escape the surface. We consider secondary photons created by cosmic rays as well as the interstellar radiation field.

##### Chemical Desorption
Other than H2 formation, the desorption of species due to exothermic reactions happening nearby on the grain is not treated. However, as described in the grain surface reaction section, any exothermic grain surface reaction has a probability of releasing the products into the gas phase and this is accounted for.