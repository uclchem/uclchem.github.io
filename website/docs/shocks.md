---
id: shocks
title: Shock Models
---
**Main Contributors**: Izaskun Jimenez-Serra, Tom James, Jon Holdship

### Shock Profiles
UCLCHEM has two physics modules to deal with shocks: cshock.f90 and jshock.f90. c-shock.f90 is based on [Jimenez-Serra et al. 2008](https://dx.doi.org/10.1051/0004-6361:20078054) which parameterizes the density, temperature and velocity profiles of c-shocks as a function of shock velocity, initial gas density and magnetic field. These were validated against the results of the detailed shock modelling of [Flower et al. 2003](https://dx.doi.org/10.1046/j.1365-8711.2003.06716.x)

jshock.f90 is a similar parameterization for j-shocks from [James et al.](https://dx.doi.org/10.1051/0004-6361/201936536) validated against more recent results from MHDvode ([Flower et al. 2015](https://dx.doi.org/10.1051/0004-6361/201525740)).

A key assumption of these parameterizations is that the chemistry and microphysics of the MHD models was sufficiently accurate that the chemistry and physics can be decoupled. That is to say, including the more detailed chemistry of UCLCHEM in MHDvode would not improve their shock profiles. Thus, more detailed chemistry can be safely post-processed using the physical outputs from those models.

### Sputtering
Both models use the same sputtering process described by [Jimenez-Serra et al. 2008](https://dx.doi.org/10.1051/0004-6361:20078054). Briefly, we calculate the average energy imparted on the grains from a collision between the shocked gas and the grains. We then combine this with the collision rate and average yield for a given energy to calculate the sputtering rate which we integrate through time.

Once the shock reaches 130 K, all remaining grain surface material is injected into the gas phase. This is the temperature at which water ice sublimates and we expect all material to co-desorb with that sublimation. 