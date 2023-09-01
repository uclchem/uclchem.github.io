---
id: gas
title: Gas Phase Reactions
---

## Gas phase ODEs
The rate of change of the concentration of a gas phase species due to a single two body reaction is

$$ 
\frac{dn_i}{dt} = k_{jk} n_j n_k 
$$

where $k_{jk}$ is the rate of that reaction in units of $cm^{3} s^{-1}$. Since we work in fractional abundances rather than concentrations, we can remove factors of $n_H$ since $n_j=X_jn_H$

$$ 
\frac{dX_i}{dt} = k_{jk} X_j X_k n_H
$$

For reactions between involving only a single body such as ionization by a cosmic ray, we have

$$ 
\frac{dX_i}{dt} = k_{i} X_i
$$

The total rate of change of the fractional abundance of a species due to gas phase reactions is then just the sum of these terms for all reactions where it is a product minus the sum of all reactions where it is a reactant.

As a rule, any part of a reaction ODE which does not depend on abundance (eg the rate itself) is calculated between timesteps by the subroutine ```calculateReactionRates``` in ```rates.f90```. The abundances are include in the ODE calculation itself so they can be updated between steps by the solver.


## Reaction Rates
Gas phase chemistry in UCLCHEM uses the UMIST12 database. This is a database listing reactants and products with up to three rate constants which we label $\alpha, \beta, and \gamma$ for thousands of gas phase reactions. We briefly list here the way in which the rates in the above equations are calculated for each reaction type and more information can be found in [McElroy et al. 2013](https://ui.adsabs.harvard.edu/abs/2013A&A...550A..36M/abstract)

**Two Body Reactions** use the Kooji-Arrhenius equation.

$$
k = \alpha (\frac{T}{300K})^\beta exp(-\gamma/T)
$$

**Cosmic Ray Protons**
$$
k = \alpha \zeta
$$
**Cosmic Ray induced photons**
$$
k = \alpha (\frac{T}{300K})^\beta \frac{E}{1-\omega} \zeta
$$
**UV Photons**
$$
k = \alpha F_{UV}\exp(-kA_v)
$$

where $\zeta$ is the cosmic ray ionization rate in units of 1.3 10$^-17$ s$^{-1}$, E is the efficiency with which cosmic rays cause ionization, $\omega$ is the dust grain albedo, $F_{UV} \exp(-kA_v)$ is the attenuated UV field.
