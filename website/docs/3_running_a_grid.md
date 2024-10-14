# Running a Grid

A common task is to run UCLCHEM over a grid of parameter combinations. This notebook sets up a simple approach to doing so for regular grids.


```python
import uclchem
import numpy as np
import pandas as pd
import os
from joblib import Parallel, delayed
```

## A Simple Grid
### Define Parameter Space
First, we define our parameter space. We do this by using numpy and pandas to produce a table of all possible combinations of some parameters of interest.


```python
# This part can be substituted with any choice of grid
# here we just vary the density, temperature and zeta
temperatures = np.linspace(10, 50, 3)
densities = np.logspace(4, 6, 3)
zetas = np.logspace(1, 3, 3)

# meshgrid will give all combinations, then we shape into columns and put into a table
parameterSpace = np.asarray(np.meshgrid(temperatures, densities, zetas)).reshape(3, -1)
model_table = pd.DataFrame(parameterSpace.T, columns=["temperature", "density", "zeta"])

# keep track of where each model output will be saved and make sure that folder exists
model_table["outputFile"] = model_table.apply(
    lambda row: f"../grid_folder/{row.temperature}_{row.density}_{row.zeta}.csv", axis=1
)
print(f"{model_table.shape[0]} models to run")
if not os.path.exists("../grid_folder"):
    os.makedirs("../grid_folder")
```

    27 models to run



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
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>../grid_folder/10.0_10000.0_10.0.csv</td>
    </tr>
    <tr>
      <th>1</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>100.0</td>
      <td>../grid_folder/10.0_10000.0_100.0.csv</td>
    </tr>
    <tr>
      <th>2</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>1000.0</td>
      <td>../grid_folder/10.0_10000.0_1000.0.csv</td>
    </tr>
    <tr>
      <th>3</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>../grid_folder/30.0_10000.0_10.0.csv</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>100.0</td>
      <td>../grid_folder/30.0_10000.0_100.0.csv</td>
    </tr>
  </tbody>
</table>
</div>



### Set up the model
Next, we need a function that will run our model. We write a quick function that takes a row from our dataframe and uses it to populate a parameter dictionary for UCLCHEM and then run a cloud model. We can then map our dataframe to that function.


```python
def run_model(row):
    # basic set of parameters we'll use for this grid.
    ParameterDictionary = {
        "endatfinaldensity": False,
        "freefall": False,
        "initialDens": row.density,
        "initialTemp": row.temperature,
        "zeta": row.zeta,
        "outputFile": row.outputFile,
        "finalTime": 1.0e6,
        "baseAv": 10,
    }
    result = uclchem.model.cloud(param_dict=ParameterDictionary)
    return result[0]  # just the integer error code
```

### Run Grid 

#### The Simple Way
We can use pandas apply to simply pass each row to our helper function in turn. This will take some time since we're running the models one by one. I'll use the `head` function just to run five rows as an example here.


```python
%%time
result = model_table.head().apply(run_model, axis=1)
```

    CPU times: user 56.3 s, sys: 1.04 s, total: 57.4 s
    Wall time: 57.4 s


#### The Fast Way
Alternatively, we can use multiprocessing to run the models in parallel. That will allow us to run many models simulataneously and make use of all the cores available on our machine.


```python
%%time
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.


    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:    6.3s


    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:    7.5s


    [Parallel(n_jobs=4)]: Done   3 tasks      | elapsed:   13.1s


    [Parallel(n_jobs=4)]: Done   4 tasks      | elapsed:   17.7s


    [Parallel(n_jobs=4)]: Done   5 tasks      | elapsed:   19.4s


    [Parallel(n_jobs=4)]: Done   6 tasks      | elapsed:   26.3s


    [Parallel(n_jobs=4)]: Done   7 tasks      | elapsed:   27.5s


    [Parallel(n_jobs=4)]: Done   8 tasks      | elapsed:   31.1s


    [Parallel(n_jobs=4)]: Done   9 tasks      | elapsed:   37.9s


    [Parallel(n_jobs=4)]: Done  10 tasks      | elapsed:   43.6s


    [Parallel(n_jobs=4)]: Done  11 tasks      | elapsed:   50.6s


    [Parallel(n_jobs=4)]: Done  12 tasks      | elapsed:   53.4s


    [Parallel(n_jobs=4)]: Done  13 tasks      | elapsed:   56.0s


    [Parallel(n_jobs=4)]: Done  14 tasks      | elapsed:   59.9s
    [Parallel(n_jobs=4)]: Done  15 tasks      | elapsed:   60.0s


    [Parallel(n_jobs=4)]: Done  16 tasks      | elapsed:  1.1min


    [Parallel(n_jobs=4)]: Done  17 tasks      | elapsed:  1.2min


    [Parallel(n_jobs=4)]: Done  18 tasks      | elapsed:  1.2min


    [Parallel(n_jobs=4)]: Done  19 tasks      | elapsed:  1.4min


    [Parallel(n_jobs=4)]: Done  20 tasks      | elapsed:  1.7min


    [Parallel(n_jobs=4)]: Done  21 out of  27 | elapsed:  1.8min remaining:   31.2s


    [Parallel(n_jobs=4)]: Done  22 out of  27 | elapsed:  2.1min remaining:   28.2s


    [Parallel(n_jobs=4)]: Done  23 out of  27 | elapsed:  2.4min remaining:   24.6s


    [Parallel(n_jobs=4)]: Done  24 out of  27 | elapsed:  3.0min remaining:   22.4s


    [Parallel(n_jobs=4)]: Done  25 out of  27 | elapsed:  3.3min remaining:   15.9s


    [Parallel(n_jobs=4)]: Done  27 out of  27 | elapsed:  7.1min finished
    CPU times: user 148 ms, sys: 189 ms, total: 337 ms
    Wall time: 7min 4s


## Checking Your Grid
After running, we should do two things. First, let's add `results` to our dataframe as a new column. Positive results mean a successful UCLCHEM run and negative ones are unsuccessful. Then we can run each model through `check_element_conservation` to check the integration was successful. We'll use both these things to flag models that failed in some way.


```python
def element_check(output_file):
    df = uclchem.analysis.read_output_file(output_file)
    # get conservation values
    conserves = uclchem.analysis.check_element_conservation(df)
    # check if any error is greater than 1%
    return all([float(x[:-1]) < 1 for x in conserves.values()])
```


```python
model_table["run_result"] = results
model_table["elements_conserved"] = model_table["outputFile"].map(element_check)
# check both conditions are met
model_table["Successful"] = (model_table.run_result >= 0) & (
    model_table.elements_conserved
)
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
      <td>0</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>1</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>100.0</td>
      <td>../grid_folder/10.0_10000.0_100.0.csv</td>
      <td>0</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>2</th>
      <td>10.0</td>
      <td>10000.0</td>
      <td>1000.0</td>
      <td>../grid_folder/10.0_10000.0_1000.0.csv</td>
      <td>0</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>3</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>../grid_folder/30.0_10000.0_10.0.csv</td>
      <td>0</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>100.0</td>
      <td>../grid_folder/30.0_10000.0_100.0.csv</td>
      <td>0</td>
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
out_species = ["CO", "H2O", "CH3OH"]


def run_prelim(density):
    # basic set of parameters we'll use for this grid.
    ParameterDictionary = {
        "endatfinaldensity": True,
        "freefall": True,
        "initialDens": 1e2,
        "finalDens": density,
        "initialTemp": 10.0,
        "abundSaveFile": f"../grid_folder/starts/{density:.0f}.csv",
        "baseAv": 1,
    }
    result = uclchem.model.cloud(param_dict=ParameterDictionary)
    return result


def run_model(row):
    # basic set of parameters we'll use for this grid.
    ParameterDictionary = {
        "endatfinaldensity": False,
        "freefall": False,
        "initialDens": row.density,
        "initialTemp": 10.0,
        "outputFile": row.outputFile,
        "abundLoadFile": f"../grid_folder/starts/{row.density:.0f}.csv",
        "finalTime": 1.0e5,
        "abstol_factor": 1e-18,
        "reltol": 1e-12,
        "baseAv": 1,
    }
    result = uclchem.model.cshock(
        row.shock_velocity, param_dict=ParameterDictionary, out_species=out_species
    )
    # First check UCLCHEM's result flag to seeif it ran succesfully, if it is return the abundances
    if result[0] == 0:
        return result[:]
    # if not, return NaNs because model failed
    else:
        return [np.nan] * len(out_species)
```

Then we define our parameter space again. We'll create two folders, one to store a set of initial abundances for each starting density in our model and another to store our shock outputs.


```python
# This part can be substituted with any choice of grid
# here we just combine various initial and final densities into an easily iterable array
shock_velocities = np.linspace(10, 50, 3)
densities = np.logspace(4, 6, 3)

parameterSpace = np.asarray(np.meshgrid(shock_velocities, densities)).reshape(2, -1)
model_table = pd.DataFrame(parameterSpace.T, columns=["shock_velocity", "density"])
model_table["outputFile"] = model_table.apply(
    lambda row: f"../grid_folder/shocks/{row.shock_velocity}_{row.density}.csv", axis=1
)
print(f"{model_table.shape[0]} models to run")

for folder in ["starts", "shocks"]:
    if not os.path.exists(f"../grid_folder/{folder}"):
        os.makedirs(f"../grid_folder/{folder}")
```

    9 models to run


We can then run our preliminary models followed by our science models. The science models will return the abundances at the final time step of each run so we can unpack those directly to our dataframe.


```python
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_prelim)(dens) for dens in densities
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.


    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:   10.6s


    [Parallel(n_jobs=4)]: Done   3 out of   3 | elapsed:   12.5s finished



```python
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5361390561899D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634436816610D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634443908606D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634444475704D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634445267662D+09
     ISTATE -1: Reducing time step
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1198836793972D+12
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1755591237616D+12
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634446564434D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4184642941939D+11
     ISTATE -1: Reducing time step


    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:   33.1s


    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:   36.2s


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634449071896D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634449159144D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634450811761D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634451402906D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5634452060703D+09
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1930738706164D+11
     ISTATE -1: Reducing time step


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1204645445248D+11
     ISTATE -1: Reducing time step


    [Parallel(n_jobs=4)]: Done   3 out of   9 | elapsed:  1.2min remaining:  2.4min


    [Parallel(n_jobs=4)]: Done   4 out of   9 | elapsed:  1.2min remaining:  1.5min


    [Parallel(n_jobs=4)]: Done   5 out of   9 | elapsed:  1.2min remaining:   59.6s


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1926895081933D+10
     ISTATE -1: Reducing time step


    [Parallel(n_jobs=4)]: Done   6 out of   9 | elapsed:  1.8min remaining:   54.9s


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3152653017700D+13
     ISTATE -1: Reducing time step


    [Parallel(n_jobs=4)]: Done   7 out of   9 | elapsed:  1.9min remaining:   32.7s


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3225829114572D+13
     ISTATE -1: Reducing time step


    [Parallel(n_jobs=4)]: Done   9 out of   9 | elapsed:  2.2min finished



```python
model_table[["Result", "Dissipation Time"] + out_species] = results
```


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
      <th>Result</th>
      <th>Dissipation Time</th>
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
      <td>0.0</td>
      <td>1171.898734</td>
      <td>6.050423e-05</td>
      <td>1.799220e-05</td>
      <td>4.355616e-11</td>
    </tr>
    <tr>
      <th>1</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/30.0_10000.0.csv</td>
      <td>0.0</td>
      <td>1171.898734</td>
      <td>2.548076e-05</td>
      <td>2.171342e-05</td>
      <td>9.807034e-12</td>
    </tr>
    <tr>
      <th>2</th>
      <td>50.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/50.0_10000.0.csv</td>
      <td>0.0</td>
      <td>1171.898734</td>
      <td>1.348972e-05</td>
      <td>9.403126e-06</td>
      <td>4.224774e-07</td>
    </tr>
    <tr>
      <th>3</th>
      <td>10.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/10.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.298209e-07</td>
      <td>1.870964e-10</td>
      <td>4.175648e-11</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/30.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>2.552004e-10</td>
      <td>2.813474e-12</td>
      <td>4.269849e-12</td>
    </tr>
    <tr>
      <th>5</th>
      <td>50.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/50.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.873639e-10</td>
      <td>3.185265e-12</td>
      <td>4.827968e-12</td>
    </tr>
    <tr>
      <th>6</th>
      <td>10.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/10.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>8.357922e-11</td>
      <td>5.023763e-12</td>
      <td>4.726787e-12</td>
    </tr>
    <tr>
      <th>7</th>
      <td>30.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/30.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>5.069261e-11</td>
      <td>4.962231e-12</td>
      <td>9.160685e-12</td>
    </tr>
    <tr>
      <th>8</th>
      <td>50.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/50.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>3.825184e-11</td>
      <td>5.034514e-12</td>
      <td>1.166106e-11</td>
    </tr>
  </tbody>
</table>
</div>



## Summary

There are many ways to run grids of models and users will naturally develop their own methods. This notebook is just a simple example of how to run UCLCHEM for many parameter combinations whilst producing a useful output (the model_table) to keep track of all the combinations that were run. In a real script, we'd save the model file to csv at the end.

For much larger grids, it's recommended that you find a way to make your script robust to failure. Over a huge range of parameters, it is quite likely UCLCHEM will hit integration trouble for at least a few parameter combinations. Very occasionally, UCLCHEM will get caught in a loop where it fails to integrate and cannot adjust its strategy to manage it. This isn't a problem for small grids as the model can be stopped and the tolerances adjusted. However, for very large grids, you may end up locking all threads as they each get stuck on a different model. The best solution we've found for this case is to add a check so that models in your dataframe are skipped if their file already exists, this allows you to stop and restart the grid script as needed.

