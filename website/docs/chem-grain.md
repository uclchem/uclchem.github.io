---
id: grain
title: Grain Surface Reactions
---

Whilst the basic treatment of gas phase chemistry is well established, grain surface chemistry is more complex. There are three possible ways to treat grain surface chemistry in UCLCHEM. In general we assume that:
- All dust grains are well covered by the species in question so we can take a rate equation approach based on fractional abundance rather than tracking if molecule A is on the same dust grain as molecule B.
- Ice mantles on dust grains can be treated as a single layer.
- Grains are spherical objects of a uniform size.

This allows a fairly straight forward treatment of the grain chemistry. Below we list several processes that are important in UCLCHEM's treatment of the grain chemistry.

### Langmuir-Hinshelwood Mechanism

Reactions via diffusion of reactants across the grain surface was added to UCLCHEM by [Quenard et al. 2018](https://dx.doi.org/10.1093/mnras/stx2960), drawing their formalism from [Hasegawa et al. 1992](http://adsabs.harvard.edu/doi/10.1086/191713), [Garrod & Pauly 2011](https://dx.doi.org/10.1088/0004-637X/735/1/15), and [Ruaud et al. 2016](https://dx.doi.org/10.1093/mnras/stw887). These reactions can be included in your grain file in the form,

```
#H,#CO,LH,#HCO,,,,alpha,0.0,gamma,,,
```
where alpha is a branching ratio if you include multiple versions of the same reaction and gamma is the energy barrier to the reaction. Including this reaction in your MakeRates input will result in two reactions being created in the actual network: one with gas phase products and one with grain surface products. This is to account for the desorption of products of exothermic reactions and the branching ratio is determined within UCLCHEM using the binding energy of the products and energy released by the reaction following [Minissale et al. 2016](https://www.aanda.org/10.1051/0004-6361/201525981).

If we follow the rate of change of the absolute number of a species on the surface of a grain ($N_S$), we get

$$
\frac{dN_s(i)}{dt} = -\frac{k_{ij} k_{diff}}{N_{sites}} N_s(i)N_s(j)
$$

where $k_{ij}$ is the reaction rate when species i and j are in adjacent sites, $k_{diff}$ is the rate at which these species diffuse between sites and $N_{sites}$ is the number of binding sites on the surface. For reactions in the bulk ice, we multiply the number of sites per layer by the number of mantle layers. If we multiply both sides by the dust concentration, we get the LHS in the standard form of rate of change of concentration and convert one N on the RHS to a concentration. We can also multiply the RHS by $n_d$/$n_d$ to convert the other N.

$$
\frac{dn_s(i)}{dt} = -\frac{k_{ij} k_{diff}}{N_{sites} n_d} n_s(i)n_s(j)
$$

Finally, we want a rate of change of fractional abundance so we can divide through by $n_H$. Since $n_d = X_d n_H$, we can also cancel a factor of $n_H$ in the RHS.

$$
\frac{dX_s(i)}{dt} = -\frac{k_{ij} k_{diff}}{N_{sites} X_d} X_s(i)X_s(j)
$$

This is the final rate of change which is sent to the ODE solver. See [Quenard et al. 2018](https://dx.doi.org/10.1093/mnras/stx2960) for a discussion of $k_{ij}$ and $K_{diff}$.

Note, these reactions can become *very* fast at high temperatures and will eventually break the integrator with a careful, network depedent choice of tolerances. To avoid this, we stop all grain chemistry at MAX_GRAIN_TEMP in UCLCHEM which is set by default to 150 K. By this temperature, the ice will have almost entirely sublimated and so stopping the chemistry will have a negligible effect on abundances.

### Eley-Rideal Mechanism

Reactions that occur when a species colliding with a dust grain lands on a binding site occupied by another reactant are also included in UCLCHEM. They can be included in your grain file in the form,
```
H,#CO,ER,#HCO,,,,alpha,0.0,gamma,,,
```
and produce gas and grain surface products in the same way as the Langmuir-Hinshelwood reactions. These reactions have an ODE of the form

$$
\frac{dn_s(i)}{dt} = -k_{i,freeze} \exp(\frac{-E}{T}) \frac{n_s(j)}{n_{s}} n_s(i)
$$

where $k_{i,freeze}$ is the freeze out rate of the gas phase reactant (ie the rate at which it collides with the grains), $\exp(\frac{-E}{T})$ is the probability of a reaction occuring given the energy barrier, $n_s$ is the total concentration of ice species, and therefore $\frac{n_s(j)}{n_{s,total}}$ is the fraction of surface sites occupied by the surface reactant. This reduces to

$$
\frac{dX_s(i)}{dt} = -k_{i,freeze} \exp(\frac{-E}{T}) \frac{X_s(j)}{X_{s}} X_s(i)
$$