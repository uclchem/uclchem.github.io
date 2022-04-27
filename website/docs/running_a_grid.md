# Running a Grid

A common task is to run UCLCHEM over a grid of parameter combinations. This notebook sets up a simple approach to doing so for regular grids.


```python
import uclchem
import numpy as np
import pandas as pd
from multiprocessing import Pool
import os
```

## A Simple Grid
### Define Parameter Space
First, we define our parameter space. We do this by using numpy and pandas to produce a table of all possible combinations of some parameters of interest.


```python
# This part can be substituted with any choice of grid
#here we just vary the density, temperature and zeta 
temperatures = np.linspace(10, 50, 3)
densities = np.logspace(4,6,3)
zetas = np.logspace(1, 3, 3)

#meshgrid will give all combinations, then we shape into columns and put into a table
parameterSpace = np.asarray(np.meshgrid(temperatures,densities,zetas)).reshape(3, -1)
model_table=pd.DataFrame(parameterSpace.T, columns=['temperature','density','zeta'])

#keep track of where each model output will be saved and make sure that folder exists
model_table["outputFile"]=model_table.apply(lambda row: f"../grid_folder/{row.temperature}_{row.density}_{row.zeta}.csv", axis=1)
print(f"{model_table.shape[0]} models to run")
if not os.path.exists("../grid_folder"):
    os.makedirs("../grid_folder")
```

    27 models to run


### Set up the model
Next, we need a function that will run our model. We write a quick function that takes a row from our dataframe and uses it to populate a parameter dictionary for UCLCHEM and then run a cloud model. We can then map our dataframe to that function.


```python
def run_model(row):
    #basic set of parameters we'll use for this grid. 
    ParameterDictionary = {"endatfinaldensity":False,
                           "freefall": False,
                           "initialDens": row.density,
                           "initialTemp": row.temperature,
                           "zeta": row.zeta,
                           "outputFile": row.outputFile,
                           "finalTime":1.0e6,
                           "baseAv":10}
    result = uclchem.model.cloud(param_dict=ParameterDictionary)
    return result
```

### Run Grid 

#### The Simple Way
We can use pandas apply to simply pass each row to our helper function in turn. This will take some time since we're running the models one by one. I'll use the `head` function just to run five rows as an example here.


```python
result=model_table.head().apply(run_model, axis=1)
```

#### The Fast Way
Alternatively, we can use multiprocessing to run the models in parallel. That will allow us to run many models simulataneously and make use of all the cores available on our machine.


```python
def pool_func(x):
    i,row=x
    return run_model(row)

with Pool(processes=6) as pool:
    results = pool.map(pool_func, model_table.iterrows())
```

## Checking Your Grid
After running, we should do two things. First, let's add `results` to our dataframe as a new column. Positive results mean a successful UCLCHEM run and negative ones are unsuccessful. Then we can run each model through `check_element_conservation` to check the integration was successful. We'll use both these things to flag models that failed in some way.


```python
def element_check(output_file):
    df=uclchem.analysis.read_output_file(output_file)
    #get conservation values
    conserves=uclchem.analysis.check_element_conservation(df)
    #check if any error is greater than 1%
    return all([float(x[:-1])<1 for x in conserves.values()])
```


```python
model_table["run_result"]=results
model_table["elements_conserved"]=model_table["outputFile"].map(element_check)
#check both conditions are met
model_table["Successful"]=(model_table.run_result>=0) & (model_table.elements_conserved)
```


```python
model_table.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
<tr>
      <th></th>
      <th>temperature</th>
      <th>density</th>
      <th>zeta</th>
      <th>outputFile</th>
      <th>run_result</th>
      <th>elements_conserved</th>
      <th>Successful</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>../grid_folder/10.0_10000.0_10.0.csv</td>
      <td>1</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>1</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>100.0</td>
      <td>../grid_folder/10.0_10000.0_100.0.csv</td>
      <td>1</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>2</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>1000.0</td>
      <td>../grid_folder/10.0_10000.0_1000.0.csv</td>
      <td>1</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>3</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>../grid_folder/30.0_10000.0_10.0.csv</td>
      <td>1</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>100.0</td>
      <td>../grid_folder/30.0_10000.0_100.0.csv</td>
      <td>1</td>
      <td>True</td>
      <td>True</td>
    </tr>
  </tbody>
</table>
</div>



## Complex Grid

The above was straightforward enough but what about a modelling a grid of shocks? Not only do we want to loop over relevant parameters, we also need to run a few preliminary models to give ourselves starting abundances. We'll start by defining two helper functions, one to run our preliminary cloud and one to run the shock.

Let's further imagine that we want to obtain the abundances of several species at the end of the model. We can use the `out_species` parameter to specify which species we want to track and return them to our dataframe.


```python
out_species=["CO","H2O","CH3OH"]

def run_prelim(density):
    #basic set of parameters we'll use for this grid. 
    ParameterDictionary = {"endatfinaldensity":True,
                           "freefall": True,
                           "initialDens":1e2,
                           "finalDens": density,
                           "initialTemp": 10.0,
                           "abundSaveFile": f"../grid_folder/starts/{density:.0f}.csv",
                           "baseAv":1}
    result = uclchem.model.cloud(param_dict=ParameterDictionary)
    return result

def run_model(row):
    i,row=row # we know we're receiving the iterrows() tuple
    #basic set of parameters we'll use for this grid. 
    ParameterDictionary = {"endatfinaldensity":False,
                           "freefall": False,
                           "initialDens": row.density,
                           "initialTemp": 10.0,
                           "outputFile": row.outputFile,
                            "abundSaveFile": f"../grid_folder/starts/{row.density:.0f}.csv",
                           "finalTime":1.0e5,
                           "baseAv":1}
    result = uclchem.model.cshock(row.shock_velocity,param_dict=ParameterDictionary,out_species=out_species)
    #UCLCHEM is going to return our 3 abundances on a success or an integer flag on a failure. 
    #so we check if the result is a list of size len(out_species) and return NaNs if not
    if len(list(result[0]))==len(out_species):
        return result[0]
    else:
        print(result)
        return([np.nan]*len(out_species))
```

Then we define our parameter space again. We'll create two folders, one to store a set of initial abundances for each starting density in our model and another to store our shock outputs.


```python
# This part can be substituted with any choice of grid
# here we just combine various initial and final densities into an easily iterable array
shock_velocities = np.linspace(10, 50, 3)
densities = np.logspace(4,6,3)

parameterSpace = np.asarray(np.meshgrid(shock_velocities,densities)).reshape(2, -1)
model_table=pd.DataFrame(parameterSpace.T, columns=['shock_velocity','density'])
model_table["outputFile"]=model_table.apply(lambda row: f"../grid_folder/shocks/{row.shock_velocity}_{row.density}.csv", axis=1)
print(f"{model_table.shape[0]} models to run")

for folder in ["starts","shocks"]:
    if not os.path.exists(f"../grid_folder/{folder}"):
        os.makedirs(f"../grid_folder/{folder}")
```

    9 models to run


We can then run our preliminary models followed by our science models. The science models will return the abundances at the final time step of each run so we can unpack those directly to our dataframe.


```python
with Pool(processes=3) as pool:
    results = pool.map(run_prelim, densities)
```


```python
with Pool(processes=3) as pool:
    results = pool.map(run_model, model_table.iterrows())
model_table[out_species]=results
```

     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2113241378513D+12
     ISTATE -1: MAXSTEPS will be increased
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1596634158767D+11
     ISTATE -1: MAXSTEPS will be increased



```python
model_table
```




<div>
<table border="1" class="dataframe">
  <thead>
<tr>
      <th></th>
      <th>shock_velocity</th>
      <th>density</th>
      <th>outputFile</th>
      <th>CO</th>
      <th>H2O</th>
      <th>CH3OH</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/10.0_10000.0.csv</td>
      <td>5.350002e-05</td>
      <td>3.478598e-06</td>
      <td>1.531139e-10</td>
    </tr>
    <tr>
      <th>1</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/30.0_10000.0.csv</td>
      <td>3.114690e-05</td>
      <td>2.197236e-05</td>
      <td>6.430248e-10</td>
    </tr>
    <tr>
      <th>2</th>
      <td>50.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/50.0_10000.0.csv</td>
      <td>1.894493e-05</td>
      <td>6.431733e-06</td>
      <td>1.704588e-09</td>
    </tr>
    <tr>
      <th>3</th>
      <td>10.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/10.0_100000.0.csv</td>
      <td>6.688131e-08</td>
      <td>9.581838e-10</td>
      <td>4.158561e-10</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/30.0_100000.0.csv</td>
      <td>1.632991e-10</td>
      <td>3.793513e-10</td>
      <td>4.614506e-10</td>
    </tr>
    <tr>
      <th>5</th>
      <td>50.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/50.0_100000.0.csv</td>
      <td>2.712864e-10</td>
      <td>3.173975e-10</td>
      <td>5.334553e-10</td>
    </tr>
    <tr>
      <th>6</th>
      <td>10.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/10.0_1000000.0.csv</td>
      <td>1.785068e-10</td>
      <td>1.320640e-10</td>
      <td>1.156020e-11</td>
    </tr>
    <tr>
      <th>7</th>
      <td>30.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/30.0_1000000.0.csv</td>
      <td>2.468740e-10</td>
      <td>6.324375e-11</td>
      <td>1.476467e-12</td>
    </tr>
    <tr>
      <th>8</th>
      <td>50.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/50.0_1000000.0.csv</td>
      <td>1.713577e-10</td>
      <td>1.076491e-11</td>
      <td>2.124396e-13</td>
    </tr>
  </tbody>
</table>
</div>



## Summary

There are many ways to run grids of models and users will naturally develop their own methods. This notebook is just a simple example of how to run UCLCHEM for many parameter combinations whilst producing a useful output (the model_table) to keep track of all the combinations that were run. In a real script, we'd save the model file to csv at the end.

For much larger grids, it's recommended that you find a way to make your script robust to failure. Over a huge range of parameters, it is quite likely UCLCHEM will hit integration trouble for at least a few parameter combinations. Very occasionally, UCLCHEM will get caught in a loop where it fails to integrate and cannot adjust its strategy to manage it. This isn't a problem for small grids as the model can be stopped and the tolerances adjusted. However, for very large grids, you may end up locking all threads as they each get stuck on a different model. The best solution we've found for this case is to add a check so that models in your dataframe are skipped if their file already exists, this allows you to stop and restart the grid script as needed.

