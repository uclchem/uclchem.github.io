---
id: collapse
title:Collapse Models
---
**Main Contributors**: Felix Priestley

The freefall collapse function used to control the density in most UCLCHEM models is fairly simplistic. [Priestley et al. 2018](https://dx.doi.org/10.3847/1538-3881/aac957) created the collapse module which parameterizes the density profile of a collapsing core as a function of time and radius. The following collapse modes are possible:

- collapse = 2: Bonnor-Ebert sphere, overdensity factor 1.1 (Aikawa+2005)
- collapse = 3: Bonnor-Ebert sphere, overdensity factor 4 (Aikawa+2005)
- collapse = 4: magnetised filament, initially unstable to collapse (Nakamura+1995)
- collapse = 5: magnetised cloud, initially stable, collapse due to ambipolar diffusion (Fiedler+1993)