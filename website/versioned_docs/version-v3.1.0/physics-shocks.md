---
id: physics-shocks
title: Shock Models
---
**Main Contributors**: Izaskun Jimenez-Serra, Tom James, Jon Holdship

## Shock Profiles
UCLCHEM uses two different shock parameterizations. These provide the physical properties of a gas through time as it is subjected to a shock. Whilst the most accurate MHD shock models solve the chemistry, MHD and radiative transfer problems simulataneously, few of these models include chemistry as detailed as UCLCHEM. We assume that the MHD models on which our parameterizations were validated used detailed enough chemistry that the shock profiles could be accurately calculated. This means that more detailed chemistry can be safely post-processed using UCLCHEM, a parameterization simply means the user can select parameters freely rather than from a preset selection of profiles from another code such as [MHDvode](http://cdsads.u-strasbg.fr/abs/2015A&A...578A..63F).

### C-Shocks
The C-shock is based on the parameterization by [Jimenez-Serra et al. 2008](https://dx.doi.org/10.1051/0004-6361:20078054). It parameterizes the density, temperature and velocity profiles of c-shocks as a function of shock velocity, initial gas density and magnetic field. These were validated against the results of the detailed shock modelling of [Flower et al. 2003](https://dx.doi.org/10.1046/j.1365-8711.2003.06716.x). Details of it's use can be found in [the c-shock function docs](/docs/pythonapi#uclchem.model.cshock).

A key value in this model is the dissipation length, which is the distance over which the velocity of the ions and the neutrals equalizes. In some sense, this is the extent of the C-shock, although post-shock cooling does continue for some distance after. The C-shock function will return the dissipation time (see [below](/docs/physics-shocks#dimensions)) and will also uses shorter timesteps for a number of years equal to twice the dissipation time in order to fully resolve the shock. The number of these time steps is controlled by an optional parameter.

### J-shocks
jshock is a similar parameterization for j-shocks from [James et al.](https://dx.doi.org/10.1051/0004-6361/201936536) validated against more recent results from MHDvode ([Flower et al. 2015](https://dx.doi.org/10.1051/0004-6361/201525740)). See the [j-shock function docs](/docs/pythonapi#uclchem.model.jshock) for details.

## Dimensions 
Both shock models are intended to be run as single point models only and the code will return an error for `points > 1`. However, you can look at the 1D profile of a shock by converting between time and distance. If we assume the shock is stationary, that is that it's structure is unchanged as it moves through a cloud of gas, then the points that are far away in time are the same as those far away in space.

<img src="/img/shock.png" width="600" margin-left="40%"/>


As an illustration, as a shock front moves through a cloud and first hits a parcel of gas, this is t=0 in our shock model output. 5000 years later, the shock front has moved on, thus the output of UCLCHEM at t=5000 years is the state of a parcel of gas that was first hit 5000 years ago and is now far behind the shock front.

By using the shock velocity, you can translate 5000 years to the distance between the parcel that was shocked 5000 years ago and the parcel that is just being reached by the shock front,
$$
 z= v_s t
$$

Thus the history of a single point in a shocked cloud that is output by UCLCHEM can also be translated to a snapshot of a cloud that covers distance z.



## Sputtering
The C-shock model uses the sputtering process described by [Jimenez-Serra et al. 2008](https://dx.doi.org/10.1051/0004-6361:20078054). Briefly, we calculate the average energy imparted on the grains from a collision between the shocked gas and the grains. We then combine this with the collision rate and average yield for a given energy to calculate the sputtering rate which we integrate through time. In practice, this sputtering is so quick that it happens almost instantaneously at $t_{sat}$, the saturation time. This is the time at which the silicon abundance stops increasing in more detailed models, used as a proxy for when the ices are fully sputtered. Thus it is likely that you will see a step change in the ice abundances where sputtering has not occurred yet in one time step and is complete in the second unless your timestep is very small.

The J-shock would begin with $V_s$ as the initial drift velocity of the sputtering routine described above and would instantaneously sputter at t = 0 yr. Furthermore, temperatures typically reach a minimum of 1000 K meaning the thermal sublimation is almost complete. Thus, we do not need to worry about the sputtering process in the J-shock, we simply remove all grain material and add it to the gas at t = 0 yr.