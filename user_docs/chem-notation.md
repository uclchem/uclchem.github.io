---
id: notation
title: Notation
---

# Notation

UCLCHEM uses notation, which differentiates between species types. Here, we'll give an overview of this notation and associated processes. 

| **Species type** | **Symbol** | **Example** |
|:----------------:|:----------:|:-----------:|
|     Gas phase    |            |     H2O     |
|        Ice       |      $     |     $H2O    |
|      Surface     |      #     |     #H2O    |
|       Bulk       |      @     |     @H2O    |


## Gas phase
The gas phase, i.e., the total abundance of a given species in the gas phase, is marked without any symbol. Hence, in order to analyze a given gas phase species, we need to use the name of the species without any additions, e.g., **H2O**. You can read more on reactions occurring in the gas phase [here](chem-gas.md).

## Ice
When we need to consider the total ice abundance of a given species, we would have to use the $ symbol in front of the molecule. Following the example from the previous section, this would be **$H2O**. However, what is the total ice abundance? If you run a three-phase model, i.e., the one considering gas, surface, and bulk: *ice = surface + bulk*. 
In the case of a simpler two-phase model, it will simply correspond to the abundance on the surface. 

## Surface
The surface species starts with #, and the abundance of water on the surface of the grain would be **#H2O**. The grain surface is the outermost part of the grain, from which species get released to the gas phase but are also frozen onto. Hence, the [adsorption & desorption reactions](chem-desorb.md) only consider the surface. Details of the reactions happening on the dust grain surface are described [here](chem-grain.md). 

## Bulk
In three-phase models, we also account for the bulk of the dust grain, which corresponds to everything below the surface. The bulk is marked with @, so we can access it through **@H2O**. The species from the bulk can diffuse into the surface but also get released into the gas phase (or destroyed) in fast shocks. Bulk ice processes are described in greater detail in a separate [page](chem-bulk.md).
