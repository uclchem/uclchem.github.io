---
id: grain
title: Grain Surface Reactions
---
Whilst the basic treatment of gas phase chemistry is well established, grain surface chemistry is more complex. There are three possible ways to treat grain surface chemistry in UCLCHEM. In general we assume that:
- All dust grains are well covered by the species in question so we can take a rate equation approach based on fractional abundance rather than tracking if molecule A is on the same dust grain as molecule B.
- Ice mantles on dust grains can be treated as a single layer.
- Grains are spherical objects of a uniform size.

This allows a fairly straight forward treatment of the grain chemistry. Below we list several processes that are important in UCLCHEM's treatment of the grain chemistry.

## Freeze out
We assume that up to 30 K, molecules freeze out at a rate given by the rate of collision between a species and the dust grains:
	k=4.57e4 \alpha \sqrt{T/m}*A_g*c_ion
where alpha is a branching ratio, T is the gas temperature, m is the molecular mass and A_g is the dust grain surface area per hydrogen nuclei. C_ion is a factor that increases the freeze out rate of ions due to electrostatic forces.

The branching ratio is the simplest way to treat grain surface chemistry. For a given species (eg C) we can determine several species that will rapidly form on the grain (CH,CH4) and freeze some portion of the original species (C) out to these products. This allows fast processes like hydrogenation to be treated without a network of surface reactions.

## Surface Reactions
If the users adds surface reactions to their Makerates input reaction file such as ```#C + #O -> #CO```, the rate coefficients will be used to calculate the reaction rate as if the reaction were a standard two-body gas-phase reaction. It may be possible to use this to force a rudimentary treatment of the grain surface chemistry.

However, [Quenard et al. 2018](https://dx.doi.org/10.1093/mnras/stx2960) modified UCLCHEM to properly treat grain surface chemistry using the treatment first proposed by [Hasegawa et al. 1992](https://dx.doi.org/10.1086/191713). The appendix of Quenard et al. 2018 provides a detailed explanation of how this process is implemented in UCLCHEM which we summarize below.

This treatment considers the rate at which species are likely to meet on the surface based on their diffusion rates and multiplies this by the probability of a reaction occuring when they do to give the overall reaction rate. The probability of a reaction occuring is given by the probability considering only the reaction energy barrier normalized by the combined probability of any of three processes occuring: reaction, further diffusion, or desorption of one of the reactants.

This treatment of the surface reaction is widely used and UCLCHEM will use this treatment for surface reactions where the third reactant is either "DIFF" or "CHEMDES". This keyword denotes whether the products desorb or remain bound to the surface. UCLCHEM calculates the correct ratio of these two reactions when both are provided.

To create a reaction that follows this process one should provide both a CHEMDES and DIFF reaction in the Makerates reaction input file. The alpha constant should give the branching ratio if the same reactants have multiple products. The beta and gamma coefficients are unused. For example, the reaction between C and H on the grain would be written:
```
#H,#C,DIFF,#CH,,,,1,0,0,,,
#H,#C,CHEMDES,CH,,,,1,0,0,,,
```
As CH is the only product so there is no branching to be considered. Whereas the reaction between H2CO and H on the surface would be:
```
#H,#H2CO,DIFF,#CH2OH,,,,0.33,0,5400,,,
#H,#H2CO,CHEMDES,CH2OH,,,,0.33,0,5400,,,
#H,#H2CO,DIFF,#H3CO,,,,0.33,0,2200,,,
#H,#H2CO,CHEMDES,H3CO,,,,0.33,0,2200,,,
#H,#H2CO,DIFF,#HCO,#H2,,,0.33,0,1740,,,
#H,#H2CO,CHEMDES,HCO,H2,,,0.33,0,1740,,,
```
Due to the possibility of a H abstraction occuring as well as the existence of two H3CO isomers.