# Advanced Physical Modelling

In the previous tutorial, we simply modelled the chemistry of a static cloud for 1 Myr. This is unlikely to meet everybody's modelling needs and UCLCHEM is capable of modelling much more complex environments such as hot cores and shocks. In this tutorial, we model both a hot core and a shock to explore how these models work and to demonstrate the workflow that the UCLCHEM team normally follow.


```python
import uclchem
import matplotlib.pyplot as plt
```

## The Hot Core

### Initial Conditions
UCLCHEM typically starts with the gas in atomic/ionic form with no molecules. However, this clearly is not appropriate when modelling an object such as a hot core. In these objects, the gas is already evolved and there should be molecules in the gas phase as well as ice mantles on the dust. To allow for this, one must provide some initial abundances to the model. There are many ways to do this but we typically chose to run a preliminary model to produce our abundances.

For this case, we will use `uclchem.model.cloud()` to run a model where a cloud of gas collapses from a density of $10^2 cm^{-3}$ to our hot core density of $10^6 cm^{-3}$. During this collapse, chemistry will occur and we can assume the final abundances of this model will be reasonable starting abundances for the hot core. 


```python
# set a parameter dictionary for cloud collapse model
param_dict = {
    "endAtFinalDensity": False,#stop at finalTime
    "freefall": True,#increase density in freefall
    "initialDens": 1e2, #starting density
    "finalDens":1e6, #final density
    "initialTemp": 10.0,#temperature of gas
    "finalTime": 6.0e6, #final time
    "rout":0.1, #radius of cloud in pc
    "baseAv":1.0, #visual extinction at cloud edge.
    "abundSaveFile": "../examples/test-output/startcollapse.dat",#save final abundances to file
    "outputFile":"../examples/test-output/phase1-full.dat"

}
result = uclchem.model.cloud(param_dict=param_dict)

```

With that done, we now have a file containing the final abundances of a cloud of gas after this collapse: `param_dict["abundSaveFile"]` we can pass this to our hot core model to use those abundances as our initial abundances.

### Running the Science Model

We need to change just a few things in `param_dict` to set up the hot core model. The key one is that UCLCHEM saves final abundances to `abundSaveFile` but loads them from `abundLoadFile` so we need to swap that key over to make the abundances we just produced our initial abundances. 

We also want to turn off freefall and change how long the model runs for.



```python
#change other bits of input to set up phase 2
param_dict["initialDens"]=1e6
param_dict["finalTime"]=1e6
param_dict["freefall"]=False

#phase 2 never cools so freeze out should be negligible
#can really speed integrator by just turning it off
param_dict["freezeFactor"]=0 
param_dict["abstol_factor"]=1e-18
param_dict["reltol"]=1e-12
param_dict["abundLoadFile"]=param_dict.pop("abundSaveFile") #this is still set to startcollapse.dat from phase 1 so remove it or change it.
param_dict["outputFile"]="../examples/test-output/phase2-full.dat"

result=uclchem.model.hot_core(temp_indx=3,max_temperature=300.0,param_dict=param_dict)
```

Note that we've changed abstol and reltol here. They control the integrator accuracy and whilst making them smaller does slow down successful runs, it can make runs complete that stall completely otherwise. In this case, we found that when we didn't alter the defaults, the model completed but `uclchem.check_element_conservation()` showed C and O were not conserved. By reducing these tolerances, we were fix this as shown below.

If your model run does not complete, try running it in a python script rather the notebook. In notebooks, the fortran output is only printed when the function returns which may be never on a stalled run. In python scripts, the output is printed as the code is executed and you will see warnings if the integrator gets stuck.

### Checking the Result
With a successful run, we can check the output. We first load the file and check the abundance conservation, then we can plot it up.


```python
phase2_df=uclchem.analysis.read_output_file("../examples/test-output/phase2-full.dat")
uclchem.analysis.check_element_conservation(phase2_df)
```




    {'H': '0.002%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%'}




```python
species=["CO","H2O","CH3OH","#CO","#H2O","#CH3OH","@H2O","@CO","@CH3OH"]

fig,[ax,ax2]=plt.subplots(1,2,figsize=(16,9))
ax=uclchem.analysis.plot_species(ax,phase2_df,species)
settings=ax.set(yscale="log",xlim=(1e2,1e6),ylim=(1e-10,1e-2),
            xlabel="Time / years", 
            ylabel="Fractional Abundance",xscale="log")

ax2.plot(phase2_df["Time"],phase2_df["Density"],color="black")
ax2.set(xscale="log")
ax3=ax2.twinx()
ax3.plot(phase2_df["Time"],phase2_df["gasTemp"],color="red")
ax2.set(xlabel="Time / year",ylabel="Density")
ax3.set(ylabel="Temperature",facecolor="red",xlim=(1e2,1e6))
ax3.tick_params(axis='y', colors='red')
```


![png](./assets/modelling_objects_8_0.png)


Here, we see the value of running a collapse phase before the science run. Having run a collapse, we start this model with well developed ices and having material in the surface and bulk allows us to properly model the effect of warm up in a hot core. For example, the @CO abundance is $\sim10^{-4}$ and #CO is $\sim10^{-6}$. As the gas warms to around 30K, the #CO abundance drops drastically as CO's binding energy is such that it is efficiently desorbed from the surface at this temperature. However, the rest of the CO is trapped in the bulk, surrounded by more strongly bound H2O molecules. Thus, the @CO abundance stays high until the gas reaches around 130K, when the H2O molecules are released along with the entire bulk.

## Shocks

Essentially the same process should be followed for shocks. Let's run a C-type and J-type shock through a gas of density $10^4 cm^{-3}$. Again, we first run a simple cloud model to obtain some reasonable starting abundances, then we can run the shocks.


```python
# set a parameter dictionary for phase 1 collapse model

param_dict = {
    "endAtFinalDensity": False,#stop at finalTime
    "freefall": True,#increase density in freefall
    "initialDens": 1e2, #starting density
    "finalDens":1e4, #final density
    "initialTemp": 10.0,#temperature of gas
    "finalTime": 6.0e6, #final time
    "rout":0.1, #radius of cloud in pc
    "baseAv":1.0, #visual extinction at cloud edge.
    "abundSaveFile": "../examples/test-output/shockstart.dat",
}
result = uclchem.model.cloud(param_dict=param_dict)
```

### C-shock

We'll first run a c-shock. We'll run a 40 km s $^{-1}$ shock through a gas of density $10^4$ cm $^{-3}$, using the abundances we just produced.


```python
#change other bits of input to set up phase 2
param_dict["initialDens"]=1e4
param_dict["finalTime"]=1e6
if "abundSaveFile" in param_dict:
    param_dict.pop("abundSaveFile")
param_dict["abundLoadFile"]="../examples/test-output/shockstart.dat"
param_dict["outputFile"]="../examples/test-output/cshock.dat"


result=uclchem.model.cshock(shock_vel=40,param_dict=param_dict)
result,dissipation_time=result
```

     Cannot have freefall on during cshock
     setting freefall=0 and continuing
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1931420520843D+12
     ISTATE -1: Reducing time step


The code completes fine. We do get a couple of warnings though. First, we're informed that `freefall` must be set to False for the C-shock model. Then we get a few integrator warnings. These are not important and can be ignored as long as the element conservation looks ok. However, it is an indication that the integrator did struggle with these ODEs under these conditions.


```python
phase2_df=uclchem.analysis.read_output_file("../examples/test-output/cshock.dat")
uclchem.analysis.check_element_conservation(phase2_df)
```




    {'H': '0.007%', 'N': '0.042%', 'C': '0.151%', 'O': '0.039%'}




```python
species=["CO","H2O","CH3OH","#CO","#H2O","#CH3OH","@H2O","@CO","@CH3OH"]

fig,[ax,ax2]=plt.subplots(1,2,figsize=(16,9))
ax=uclchem.analysis.plot_species(ax,phase2_df,species)
settings=ax.set(yscale="log",xlim=(1,20*dissipation_time),ylim=(1e-10,1e-2),
            xlabel="Time / years", 
            ylabel="Fractional Abundance",xscale="log")

ax2.plot(phase2_df["Time"],phase2_df["Density"],color="black")
ax2.set(xscale="log")
ax3=ax2.twinx()
ax3.plot(phase2_df["Time"],phase2_df["gasTemp"],color="red")
ax2.set(xlabel="Time / year",ylabel="Density")
ax3.set(ylabel="Temperature",facecolor="red",xlim=(1,20*dissipation_time))
ax3.tick_params(axis='y', colors='red')
```


![png](./assets/modelling_objects_16_0.png)


### J-shock
Running a j-shock is a simple case of changing function. We'll run a 10 km s $^{-1}$ shock through a gas of density $10^3$ cm $^{-3}$ gas this time. Note that nothing stops us using the intial abundances we produced for the c-shock. UCLCHEM will not check that the initial density matches the density of the `abundLoadFile`. It may not always be a good idea to do this but we should remember the intial abundances really are just a rough approximation.


```python
param_dict["initialDens"]=1e3
param_dict["freefall"]=False #lets remember to turn it off this time
param_dict["reltol"]=1e-12

shock_vel=10.0

if "abundSaveFile" in param_dict:
    param_dict.pop("abundSaveFile")
param_dict["abundLoadFile"]="../examples/test-output/shockstart.dat"
param_dict["outputFile"]="../examples/test-output/jshock.dat"


result=uclchem.model.jshock(shock_vel=shock_vel,param_dict=param_dict)
```

This time, we've turned off the freefall option and made reltol a little more stringent. The j-shock ends up running a bit slower but we get no warnings on this run.


```python
phase2_df=uclchem.analysis.read_output_file(param_dict["outputFile"])
uclchem.analysis.check_element_conservation(phase2_df)
```




    {'H': '0.003%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%'}




```python
species=["CO","H2O","CH3OH","#CO","#H2O","#CH3OH","@H2O","@CO","@CH3OH"]

fig,[ax,ax2]=plt.subplots(1,2,figsize=(16,9))
ax=uclchem.analysis.plot_species(ax,phase2_df,species)
settings=ax.set(yscale="log",xlim=(1e-7,1e6),ylim=(1e-10,1e-2),
            xlabel="Time / years", 
            ylabel="Fractional Abundance",xscale="log")

ax2.plot(phase2_df["Time"],phase2_df["Density"],color="black")
ax2.set(xscale="log",yscale="log")
ax3=ax2.twinx()
ax3.plot(phase2_df["Time"],phase2_df["gasTemp"],color="red")
ax2.set(xlabel="Time / year",ylabel="Density")
ax3.set(ylabel="Temperature",facecolor="red",xlim=(1e-7,1e6))
ax3.tick_params(axis='y', colors='red')
```


![png](./assets/modelling_objects_21_0.png)


That's everything! We've run various science models using reasonable starting abundances that we produced by running a simple UCLCHEM model beforehand. One benefit of this method is that the abundances are consistent with the network. If we start with arbitrary, perhaps observationally motivated, abundances, it would be possible to initiate the model in a state our network could never produce. 

However, one should be aware of the limitations of this method. A freefall collapse from low density to high is not really how a molecular cloud forms and so the abundances are only approximately similar to values they'd truly have in a real cloud. Testing whether your results are sensitive to things like the time you run the preliminary for or the exact density is a good way to make sure these approximations are not problematic.

Bear in mind that you can use `abundSaveFile` and `abundLoadFile` in the same model run. This lets you chain model runs together. For example, you could run a c-shock from a cloud model as we did here and then a j-shock with the c-shock's abundances as the initial abundances.


