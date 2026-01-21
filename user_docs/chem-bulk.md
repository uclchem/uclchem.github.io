---
id: bulk
title: Bulk Ice Processes
---

# Bulk Ice Processes

For a three phase network, we must include reactions in the bulk and the process by which it is formed. To do this, MakeRates automatically duplicates all LH reactions so that a reaction on the surface and one in the bulk ice exists in the network. We then include two methods by which material can move between the bulk and the surface. First is the accumulation of the bulk as new surface layers are formed and second is the individual swapping of a particle from the bulk with one on the surface ([Hasegawa & Herbst 1993](https://ui.adsabs.harvard.edu/abs/1993MNRAS.263..589H/abstract)). Both of these processes are taken from [Garrod & Pauly 2011](https://dx.doi.org/10.1088/0004-637X/735/1/15)

## Surface Transfer
Once the surface layer of an ice mantle is full, any further material deposited will form a new layer and the old one becomes part of the bulk. Likewise, if any suface is removed then some of the bulk becomes surface. Therefore, we calculate the total rate of change of all species on the surface $[\frac{dns}{dt}]$ $_{chem}$ due to chemistry, freeze out and desorption and use it to calculate the rate of surface to bulk transfer for each species.

$$
\frac{dn_s(i)}{dt} = \alpha_{acc}[\frac{dns}{dt}]_{chem} \frac{n_s(i)}{n_s}
$$

where the first two terms give the total rate of surface to bulk transfer and the final fraction divides this amongst the species on the surface. We subtract this ODE from each surface species and add it to the equivalent bulk species. If the rate of change of the surface is negative, the bulk is transferred to the surface.

## Individual Swapping
Any species in the bulk has the possibilty of diffusing to the surface. It will then displace a surface particle (which will join the bulk) and become part of the surface. We follow Ruaud et al. 2016 by first calculating the rate at which bulk species diffuse to the surface,

$$
K_{swap} = \frac{1}{t_{hop} N_{lay}}
$$

where $t_{hop}$ is our usual diffusion timescale and $N_{lay}$ is the number of mantle layers with a minimum of 1. This gives a simple ODE

$$
\frac{dX_s(i)}{dt} = K_{swap}X_b(i)
$$

and we get the rate at which things move from the surface to the bulk by summing this rate of change over all mantle species to get a total rate of swapping from the bulk to the surface. We then divide that by the fraction of the surface which is made up of a species to get its rate of swapping to the bulk.

$$
\frac{dX_m(i)}{dt} = \Sigma_j K_{swap,j}X_b(j) \frac{X_s(i)}{X_s}
$$
 
This ensures that the net movement between the surface and the bulk from this process is zero.
