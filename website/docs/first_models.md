---
id: pythonstart
title: Python Examples
---

# Running Your First Models

A Jupyter notebook in the `Python/` demonstrates how to use the Python UCLCHEM module. This page was automatically generated from that notebook.

In this example, we'll run three UCLCHEM models using the cloud model and the python wrapper. We'll also use the python module to plot the results.

Note, we ran this from the `Python/` directory meaning `Python/uclchem/` was in our PATH. You can run scripts elsewhere but `Python/uclchem/` must either be copied to that location or added to your PYTHON_PATH environmental variable.


```python
import uclchem
import pandas as pd
import matplotlib.pyplot as plt
```

# Phase 1

It's typical when running UCLCHEM to run the model in two phases. If, for example, one wishes to model a hot core, the gas should be well processed by the time the protostar "turns on". This could be achieved by initializing the abundances to some known values for a prestellar core but instead we do the following:

- Run a model starting from some very diffuse, atomic gas
- Allow it to collapse in freefall to the density of the object we wish to model
- Store the abundances as the initial abundances for the hot core model

UCLCHEM is set up to do this through the ```phase``` parameter. All physics modules will model a homogenous cloud that can collapse under freefall when ```phase=1``` and then they do their specific physical model when ```phase=2```


```python
#set a parameter dictionary for phase 1 collapse model

outSpecies="SO CO"
param_dict = {"phase": 1, "switch": 1, "collapse": 1, "writeStep": 1,
               "outSpecies": outSpecies, "initialDens": 1e2, "initialTemp":10.0,
               "finalDens":1e5, "finalTime":5.0e6,
               "outputFile":"../examples/test-output/phase1-full.dat",
               "abundSaveFile":"../examples/test-output/startcollapse.dat"}
uclchem.run_model(param_dict)

```

We can look at the output for that model by using pandas to read the file (skipping 2 rows to miss the header) and matplotlib to view abundances.


```python
phase1_df=uclchem.read_output_file("../examples/test-output/phase1-full.dat")
```


```python
species=["CO","#CO","HCN","#HCN"]
fig,ax=uclchem.create_abundance_plot(phase1_df,species)
ax=ax.set(xscale="log")
```


    
![png](/img/first_models_6_0.png)
    


# Phase 2

Note the ```abundFile``` and ```readAbunds``` parameters in our phase 1 model. If ```readAbunds``` is set to 0 then the abundances at the end of the model are written to ```abundFile```. If, instead, ```readAbunds``` is set to 1, the initial abundances are read from that file. Thus by switching ```readAbunds``` over, we can run phase 2 starting from the final abundances of the previous model.


```python
#read old abundances and do hot core behaviour
param_dict["phase"]=2

#change other bits of input to set up phase 2
param_dict["initialDens"]=1e5
param_dict["tempindx"]=3 #selects mass of protostar (see cloud.f90)
param_dict["finalTime"]=1e6
param_dict["switch"]=0

param_dict.pop("abundSaveFile") #this is still set to startcollapse.dat from phase 1 so remove it or change it.
param_dict["abundLoadFile"]="../examples/test-output/startcollapse.dat"
param_dict["outputFile"]="../examples/test-output/phase1-full.dat"


uclchem.run_model(param_dict)
```


```python
phase2_df=uclchem.read_output_file("../examples/test-output/phase2-full.dat")
```




```python
species=["CO","H2O","CH3OH","#CO","#H2O","#CH3OH"]

fig,[ax,ax2]=plt.subplots(1,2,figsize=(16,9))
ax=uclchem.plot_species(ax,phase2_df,species)
settings=ax.set(yscale="log",xlim=(1,1e6),ylim=(1e-10,1e-2),
            xlabel="Time / years", 
            ylabel="Fractional Abundance",xscale="log")

ax2.plot(phase2_df["Time"],phase2_df["Density"],color="black")
ax3=ax2.twinx()
ax3.plot(phase2_df["Time"],phase2_df["gasTemp"],color="red")
ax2.set(xlabel="Time / year",ylabel="Density")
ax3.set(ylabel="Temperature",facecolor="red",xlim=(0,1e6))
ax3.tick_params(axis='y', colors='red')
```


    
![png](/img/first_models_10_0.png)
    

