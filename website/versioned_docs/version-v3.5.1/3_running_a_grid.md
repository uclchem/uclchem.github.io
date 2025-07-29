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
    lambda row: f"../grid_folder/\{row.temperature\}_\{row.density\}_\{row.zeta\}.csv", axis=1
)
print(f"\{model_table.shape[0]\} models to run")
if not os.path.exists("../grid_folder"):
    os.makedirs("../grid_folder")
```

    The history saving thread hit an unexpected error (OperationalError('database is locked')).History will not be written to the database.27 models to run
    



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
    ParameterDictionary = \{
        "endatfinaldensity": False,
        "freefall": False,
        "initialDens": row.density,
        "initialTemp": row.temperature,
        "zeta": row.zeta,
        "outputFile": row.outputFile,
        "finalTime": 1.0e6,
        "baseAv": 10,
        "abstol_min": 1e-22,
    \}
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

    CPU times: user 13.5 s, sys: 104 ms, total: 13.7 s
    Wall time: 14.1 s


#### The Fast Way
Alternatively, we can use multiprocessing to run the models in parallel. That will allow us to run many models simulataneously and make use of all the cores available on our machine.


```python
%%time
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.
    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:    3.6s
    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:    3.6s
    [Parallel(n_jobs=4)]: Done   3 tasks      | elapsed:    4.9s
    [Parallel(n_jobs=4)]: Done   4 tasks      | elapsed:    5.1s
    [Parallel(n_jobs=4)]: Done   5 tasks      | elapsed:    6.0s
    [Parallel(n_jobs=4)]: Done   6 tasks      | elapsed:    6.9s
    [Parallel(n_jobs=4)]: Done   7 tasks      | elapsed:    9.3s
    [Parallel(n_jobs=4)]: Done   8 tasks      | elapsed:    9.7s
    [Parallel(n_jobs=4)]: Done   9 tasks      | elapsed:   10.0s
    [Parallel(n_jobs=4)]: Done  10 tasks      | elapsed:   10.5s
    [Parallel(n_jobs=4)]: Done  11 tasks      | elapsed:   13.5s
    [Parallel(n_jobs=4)]: Done  12 tasks      | elapsed:   14.0s
    [Parallel(n_jobs=4)]: Done  13 tasks      | elapsed:   16.2s
    [Parallel(n_jobs=4)]: Done  14 tasks      | elapsed:   19.9s
    [Parallel(n_jobs=4)]: Done  15 tasks      | elapsed:   20.2s
    [Parallel(n_jobs=4)]: Done  16 tasks      | elapsed:   21.1s
    [Parallel(n_jobs=4)]: Done  17 tasks      | elapsed:   24.0s
    [Parallel(n_jobs=4)]: Done  18 tasks      | elapsed:   30.3s
    [Parallel(n_jobs=4)]: Done  19 tasks      | elapsed:   34.5s
    [Parallel(n_jobs=4)]: Done  20 tasks      | elapsed:   38.3s
    [Parallel(n_jobs=4)]: Done  21 out of  27 | elapsed:   41.1s remaining:   11.8s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5420390619776D+13
     ISTATE -1: Reducing time step to    2846.8651697111809      years
    [Parallel(n_jobs=4)]: Done  22 out of  27 | elapsed:   47.6s remaining:   10.8s
    [Parallel(n_jobs=4)]: Done  23 out of  27 | elapsed:   49.8s remaining:    8.7s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4424755090641D+13
     ISTATE -1: Reducing time step to    5997.6105620254693      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1510028566773D+14
     ISTATE -1: Reducing time step to    2214.2858945997809      years
    [Parallel(n_jobs=4)]: Done  24 out of  27 | elapsed:  1.1min remaining:    8.3s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1510273608501D+14
     ISTATE -1: Reducing time step to    2206.5314094235591      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1511517391500D+14
     ISTATE -1: Reducing time step to    2167.1711873652989      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1766686033805D+14
     ISTATE -1: Reducing time step to    4092.2141810675225      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1531154171706D+14
     ISTATE -1: Reducing time step to    1545.7540829610052      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1545649366864D+14
     ISTATE -1: Reducing time step to    1087.0453686011194      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7587022168435D+13
     ISTATE -1: Reducing time step to    5990.4362651020092      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1723966018059D+14
     ISTATE -1: Reducing time step to    5444.1134336897267      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1809164622554D+14
     ISTATE -1: Reducing time step to    2747.9550234119088      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1834181794112D+14
     ISTATE -1: Reducing time step to    1956.2723673707405      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1863447383140D+14
     ISTATE -1: Reducing time step to    1030.1461185290964      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1934445817870D+14
     ISTATE -1: Reducing time step to    8783.3603248775798      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2082621384708D+14
     ISTATE -1: Reducing time step to    4094.2600385892688      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2160050345378D+14
     ISTATE -1: Reducing time step to    1643.9764365701894      years
    [Parallel(n_jobs=4)]: Done  25 out of  27 | elapsed:  2.1min remaining:    9.9s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2160190532656D+14
     ISTATE -1: Reducing time step to    1639.5401302650730      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2197505087832D+14
     ISTATE -1: Reducing time step to    458.69975897567269      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2345699360048D+14
     ISTATE -1: Reducing time step to    5769.0076793959342      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2524993563442D+14
     ISTATE -1: Reducing time step to    95.140398814817217      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2058277284731D+14
     ISTATE -1: Reducing time step to    4864.6429607439832      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2365087022242D+14
     ISTATE -1: Reducing time step to    5155.4740565119273      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2516300977557D+14
     ISTATE -1: Reducing time step to    370.22223471493385      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2677813811846D+14
     ISTATE -1: Reducing time step to    5259.0566655122120      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2826934651741D+14
     ISTATE -1: Reducing time step to    540.04267446427968      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2992030036454D+14
     ISTATE -1: Reducing time step to    5315.5052547010564      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3139069739274D+14
     ISTATE -1: Reducing time step to    662.35003285171183      years
    [Parallel(n_jobs=4)]: Done  27 out of  27 | elapsed:  8.5min finished
    CPU times: user 250 ms, sys: 207 ms, total: 457 ms
    Wall time: 8min 27s


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
    ParameterDictionary = \{
        "endatfinaldensity": True,
        "freefall": True,
        "initialDens": 1e2,
        "finalDens": float(density),
        "initialTemp": 10.0,
        "abundSaveFile": f"../grid_folder/starts/\{density:.0f\}.csv",
        "baseAv": 1,
    \}
    result = uclchem.model.cloud(param_dict=ParameterDictionary)
    return result


def run_model(row):
    # basic set of parameters we'll use for this grid.
    ParameterDictionary = \{
        "endatfinaldensity": False,
        "freefall": False,
        "initialDens": float(row.density),
        "initialTemp": 10.0,
        "outputFile": row.outputFile,
        "abundLoadFile": f"../grid_folder/starts/\{row.density:.0f\}.csv",
        "finalTime": 1.0e5,
        "abstol_factor": 1e-14,
        "abstol_min": 1e-20,
        "reltol": 1e-6,
        "baseAv": 1,
    \}
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
    lambda row: f"../grid_folder/shocks/\{row.shock_velocity\}_\{row.density\}.csv", axis=1
)
print(f"\{model_table.shape[0]\} models to run")

for folder in ["starts", "shocks"]:
    if not os.path.exists(f"../grid_folder/\{folder\}"):
        os.makedirs(f"../grid_folder/\{folder\}")
```

    9 models to run


We can then run our preliminary models followed by our science models. The science models will return the abundances at the final time step of each run so we can unpack those directly to our dataframe.


```python
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_prelim)(dens) for dens in densities
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.
    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:    6.7s
    [Parallel(n_jobs=4)]: Done   3 out of   3 | elapsed:   11.0s finished



```python
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5555072688004D+10
     ISTATE -1: Reducing time step to    1.1710358149066824      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5453500486064D+09
     ISTATE -1: Reducing time step to    3.2056808685381549E-002 years
    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:   14.3s
    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:   14.9s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5460756899794D+09
     ISTATE -1: Reducing time step to    2.9760475192172148E-002 years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5466416037936D+09
     ISTATE -1: Reducing time step to    2.7969608664746726E-002 years
    [Parallel(n_jobs=4)]: Done   3 out of   9 | elapsed:   31.5s remaining:  1.0min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5471627180622D+09
     ISTATE -1: Reducing time step to    2.6320512853633089E-002 years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3433397345882D+12
     ISTATE -1: Reducing time step to    86.181029870392564      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5476122844365D+09
     ISTATE -1: Reducing time step to    2.4897834432691505E-002 years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3483394360526D+12
     ISTATE -1: Reducing time step to    70.359189557628682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4170618273373D+11   R2 =   0.1535517761528D-04
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4255772348301D+11   R2 =   0.3001885586907D+04
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8737658505997D+11   R2 =   0.1877467548302D-04
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1160553814970D+12   R2 =   0.3821104104389D+02
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1167025811267D+12   R2 =   0.7503035345693D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1179624678685D+12   R2 =   0.5413832331125D+03
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1181205917751D+12   R2 =   0.4847459913324D+03
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1187708411209D+12   R2 =   0.1717481419864D+04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5480744156327D+09
     ISTATE -1: Reducing time step to    2.3435393916656340E-002 years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3643344903081D+12
     ISTATE -1: Reducing time step to    19.741928501098617      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2256545072280D+12   R2 =   0.6343591611890D-06
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277696351376D+12   R2 =   0.1098561819390D-02
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2280248955479D+12   R2 =   0.2483136661560D+04
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308909751986D+12   R2 =   0.1113089789672D+04
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2319014017919D+12   R2 =   0.3275358079127D-05
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2403170106619D+12   R2 =   0.9231347720209D+03
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2407792768300D+12   R2 =   0.9247156312582D+03
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2411192234463D+12   R2 =   0.8944531650105D+02
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2419608234644D+12   R2 =   0.3686880397387D+03
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4623947642440D+12   R2 =   0.1088945172159D-05
     ISTATE -5 - shortening step at time   14189.660644914280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2435155814136D+12   R2 =   0.6433857762208D+03
     ISTATE -5 - shortening step at time   7136.4422398628958      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2436740036815D+12   R2 =   0.1148447490842D-05
     ISTATE -5 - shortening step at time   7706.1892852418741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5595003834295D+12   R2 =   0.2353751692689D+05
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2483756024415D+12   R2 =   0.6840478750807D-05
     ISTATE -5 - shortening step at time   7706.1892852418741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2484175043991D+12   R2 =   0.2115692099931D+03
     ISTATE -5 - shortening step at time   7706.1892852418741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6649580148376D+12   R2 =   0.9173512392501D-04
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2679880442324D+12   R2 =   0.1870444536259D-05
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6669527746500D+12   R2 =   0.1678054321124D-03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6734388019913D+12   R2 =   0.1649773199858D+05
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2686418971492D+12   R2 =   0.2116035510419D-05
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6749339646675D+12   R2 =   0.1731448622400D-03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2778753156236D+12   R2 =   0.1828554258268D-04
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780112653670D+12   R2 =   0.3497122217640D+03
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2850941527643D+12   R2 =   0.7913651485786D+03
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2853331986556D+12   R2 =   0.2548204883083D+03
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2856562449162D+12   R2 =   0.6065518559723D+03
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2891549177978D+12   R2 =   0.6739076925853D+03
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2904654239903D+12   R2 =   0.3925878948863D+03
     ISTATE -5 - shortening step at time   8476.8083974959318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2947614606453D+12   R2 =   0.1175260481260D-06
     ISTATE -5 - shortening step at time   9324.4894393483864      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2960277839650D+12   R2 =   0.2346037426533D+02
     ISTATE -5 - shortening step at time   9324.4894393483864      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1417367635667D+13   R2 =   0.6455514545244D+04
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4346506317134D+12
     ISTATE -1: Reducing time step to    43.489382502032868      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1471612431321D+13   R2 =   0.8063972223078D+04
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2991949809575D+12   R2 =   0.3733259762072D+03
     ISTATE -5 - shortening step at time   9324.4894393483864      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1557932664808D+13   R2 =   0.1714684117339D+04
     ISTATE -5 - shortening step at time   48986.570789261357      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3242129442120D+12   R2 =   0.1827027241134D-04
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3244279687549D+12   R2 =   0.4390896041633D-03
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1706320713451D+13   R2 =   0.5085408983182D-04
     ISTATE -5 - shortening step at time   53885.229036118355      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3249755269472D+12   R2 =   0.2485513790487D+03
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3250267873910D+12   R2 =   0.9787798646037D-05
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3382626386472D+12   R2 =   0.6821846927164D+03
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3385300528400D+12   R2 =   0.2571719741959D-04
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2101185799992D+13   R2 =   0.2924466773245D-03
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3385622064525D+12   R2 =   0.1327826730540D-04
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3396086382158D+12   R2 =   0.6728724105116D+03
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2112632681528D+13   R2 =   0.1774580506306D-03
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3396723563802D+12   R2 =   0.5581915908705D+02
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2113096774884D+13   R2 =   0.1301152640825D+04
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3396991097656D+12   R2 =   0.1793514066145D+03
     ISTATE -5 - shortening step at time   10256.938605596377      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3401202439378D+12   R2 =   0.5539746075599D+02
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2114807521197D+13   R2 =   0.1732255828332D-03
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3406856702008D+12   R2 =   0.6598697493379D+03
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3414610471650D+12   R2 =   0.3972066950706D+03
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2116133372339D+13   R2 =   0.4460179620030D-03
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3424532354737D+12   R2 =   0.5472765131886D+02
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2116597273108D+13   R2 =   0.5163079040663D-03
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2118377911758D+13   R2 =   0.3142731114728D+04
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3567299626139D+12   R2 =   0.1721805430646D+04
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3568197185573D+12   R2 =   0.1247762590089D+03
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3568543999905D+12   R2 =   0.2355088229207D-04
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2149175120227D+13   R2 =   0.2616384674919D-03
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3592819072806D+12   R2 =   0.8677261361209D-04
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2173653224440D+13   R2 =   0.4217375355424D+03
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2178545072307D+13   R2 =   0.3300533493168D+04
     ISTATE -5 - shortening step at time   65201.129960095983      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3593208047763D+12   R2 =   0.1725952679074D-03
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2200334246788D+13   R2 =   0.3798618239013D+04
     ISTATE -5 - shortening step at time   68941.299756550477      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3708877082492D+12   R2 =   0.2452128511364D+03
     ISTATE -5 - shortening step at time   10749.971828026086      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3829014666518D+12   R2 =   0.3073566195438D+04
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2345692681989D+13   R2 =   0.1609467283568D+05
     ISTATE -5 - shortening step at time   68941.299756550477      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3927917128358D+12   R2 =   0.1602116386307D-04
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3928197099629D+12   R2 =   0.1816893699888D-04
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2350490330820D+13   R2 =   0.6245025570311D-03
     ISTATE -5 - shortening step at time   68941.299756550477      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3936416759580D+12   R2 =   0.2687294461535D+02
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379628528904D+13   R2 =   0.3206919492960D+04
     ISTATE -5 - shortening step at time   68941.299756550477      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3937833863843D+12   R2 =   0.2172067666776D+03
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2391376402188D+13   R2 =   0.1088324007592D+05
     ISTATE -5 - shortening step at time   68941.299756550477      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2418726731931D+13   R2 =   0.3779087479123D+04
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3939849184143D+12   R2 =   0.6326054167182D-04
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3940325102023D+12   R2 =   0.1982199236004D+03
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2419927092917D+13   R2 =   0.2468469122132D-03
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3970042177785D+12   R2 =   0.5590883331969D+03
     ISTATE -5 - shortening step at time   11736.952792696618      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2445247775472D+13   R2 =   0.3330473289983D+04
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2485778101484D+13   R2 =   0.4016482720386D+04
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2536948093570D+13   R2 =   0.3222959550658D+04
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7586912023693D+09
     ISTATE -1: Reducing time step to    6.0065816182161322E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4894824124626D+12   R2 =   0.1627634803275D+04
     ISTATE -5 - shortening step at time   14201.713494790589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2538239642139D+13   R2 =   0.1297559372030D-02
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4895776556952D+12   R2 =   0.8524488675157D+02
     ISTATE -5 - shortening step at time   14201.713494790589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628855558470D+13   R2 =   0.3461251638779D+04
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2630262541444D+13   R2 =   0.1453914601441D+04
     ISTATE -5 - shortening step at time   75835.431375894201      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5256943299225D+12   R2 =   0.1021711736506D+04
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2666635579993D+13   R2 =   0.1541784913869D+04
     ISTATE -5 - shortening step at time   83418.976321541195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5257282472091D+12   R2 =   0.2226588933931D+02
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2666885182476D+13   R2 =   0.4285759715902D-04
     ISTATE -5 - shortening step at time   83418.976321541195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5257661263820D+12   R2 =   0.2587018173999D-04
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2743465282107D+13   R2 =   0.3792573481033D+04
     ISTATE -5 - shortening step at time   83418.976321541195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5257899451402D+12   R2 =   0.1105208569980D-04
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2769508836589D+13   R2 =   0.3685509802679D+04
     ISTATE -5 - shortening step at time   83418.976321541195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5268683211799D+12   R2 =   0.7867909480668D+03
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5270799029038D+12   R2 =   0.1933088581499D+03
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2770730958945D+13   R2 =   0.3998484604689D-04
     ISTATE -5 - shortening step at time   83418.976321541195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5314333031511D+12   R2 =   0.8063068894952D+03
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2784571509499D+13   R2 =   0.5540594987679D+04
     ISTATE -5 - shortening step at time   83418.976321541195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5315516579981D+12   R2 =   0.4678937839083D+03
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5336425074770D+12   R2 =   0.4334759506205D+03
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2805370031904D+13   R2 =   0.3624437033912D-03
     ISTATE -5 - shortening step at time   83418.976321541195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5336638616359D+12   R2 =   0.1227545241225D+03
     ISTATE -5 - shortening step at time   15621.885182864882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2946322587061D+13   R2 =   0.2783467720737D+04
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5774371249346D+12   R2 =   0.1429934552241D+04
     ISTATE -5 - shortening step at time   16888.096887211708      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2977944987805D+13   R2 =   0.3424027419902D+05
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5775159477606D+12   R2 =   0.1230059469100D+03
     ISTATE -5 - shortening step at time   16888.096887211708      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3001905661975D+13   R2 =   0.3377968610868D+04
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3003243653880D+13   R2 =   0.2597704581629D+04
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5775485308577D+12   R2 =   0.3070715653015D-04
     ISTATE -5 - shortening step at time   16888.096887211708      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3003969533461D+13   R2 =   0.4269537183488D-03
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5775880918342D+12   R2 =   0.3750582742448D-04
     ISTATE -5 - shortening step at time   16888.096887211708      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3006039809163D+13   R2 =   0.2688178242834D+04
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3010583475613D+13   R2 =   0.3459915020554D+04
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5817114803749D+12   R2 =   0.4474040515574D+03
     ISTATE -5 - shortening step at time   16888.096887211708      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5817893483353D+12   R2 =   0.1983421215871D+03
     ISTATE -5 - shortening step at time   16888.096887211708      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3012546708817D+13   R2 =   0.5277716421637D-03
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5853489390102D+12   R2 =   0.1806887654474D+03
     ISTATE -5 - shortening step at time   16888.096887211708      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3110574241304D+13   R2 =   0.3044310127488D+04
     ISTATE -5 - shortening step at time   91760.875942558690      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3124367223770D+13   R2 =   0.1109745100322D+05
     ISTATE -5 - shortening step at time   91760.875942558690      years
    [Parallel(n_jobs=4)]: Done   4 out of   9 | elapsed:  1.4min remaining:  1.7min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4745204530163D+12
     ISTATE -1: Reducing time step to    59.215702437677287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5946459644736D+12   R2 =   0.1109541181673D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5946889595608D+12   R2 =   0.7956567040909D+02
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5951561533340D+12   R2 =   0.4265746109109D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5954713795702D+12   R2 =   0.2660499775193D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5955094863862D+12   R2 =   0.2118841644198D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5958116705151D+12   R2 =   0.1109633411181D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5960188285226D+12   R2 =   0.3817028928988D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5973069324562D+12   R2 =   0.3559496794981D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5973315194710D+12   R2 =   0.2226598126193D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5976834734205D+12   R2 =   0.1795412563217D+03
     ISTATE -5 - shortening step at time   18576.906978576484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6888253296901D+12   R2 =   0.2215705051626D+04
     ISTATE -5 - shortening step at time   20805.437816847698      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7546927469017D+12   R2 =   0.2733018108670D-05
     ISTATE -5 - shortening step at time   22885.982094572759      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7558610834067D+12   R2 =   0.9242323105705D-05
     ISTATE -5 - shortening step at time   22885.982094572759      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7580759343194D+12   R2 =   0.2133260127371D+03
     ISTATE -5 - shortening step at time   22885.982094572759      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7956549927829D+12   R2 =   0.4524858426992D-05
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7959409299543D+12   R2 =   0.7914642311050D+02
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7961013685442D+12   R2 =   0.1206956940264D+03
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7639036326715D+09
     ISTATE -1: Reducing time step to    4.3570783334314793E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7970518717924D+12   R2 =   0.1701539193151D+03
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8024192231778D+12   R2 =   0.4356662530162D+03
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8024494514151D+12   R2 =   0.1578410518320D+03
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8027535565859D+12   R2 =   0.1231897520399D+03
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8028408740649D+12   R2 =   0.1199110646099D+03
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8078286380724D+12   R2 =   0.9936415667550D+02
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8078513168469D+12   R2 =   0.1357897473859D+03
     ISTATE -5 - shortening step at time   25174.580849674367      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8080720781430D+12   R2 =   0.6536389716201D+02
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8081647285816D+12   R2 =   0.1366155551679D-04
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8083788360198D+12   R2 =   0.4079606958924D+03
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8115159757686D+12   R2 =   0.2171078363688D+03
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8115386835415D+12   R2 =   0.2665753431408D+02
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8116412832308D+12   R2 =   0.1452527133151D+03
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8116534106709D+12   R2 =   0.8209820360569D-05
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8119337028502D+12   R2 =   0.1857354432609D+03
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8152871696198D+12   R2 =   0.1223731687267D+03
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8186007168073D+12   R2 =   0.2299056622890D-04
     ISTATE -5 - shortening step at time   25564.915090091359      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8186654025834D+12   R2 =   0.4048883795565D+02
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8748515289369D+12   R2 =   0.6896252313188D+03
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8806011411882D+12   R2 =   0.9338652679485D-05
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8890287922207D+12   R2 =   0.5054811753210D+03
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8890393852229D+12   R2 =   0.7737782567689D-06
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8890828450788D+12   R2 =   0.2118452083846D+03
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8891869982290D+12   R2 =   0.3271127326546D+03
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8910360556682D+12   R2 =   0.4248266215118D-04
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8946046133822D+12   R2 =   0.2157410152872D+03
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8959811904768D+12   R2 =   0.6804934054905D-06
     ISTATE -5 - shortening step at time   25905.085974913211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9099416241242D+12   R2 =   0.2450817233614D-04
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9163650852654D+12   R2 =   0.1921252187415D+03
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9164434051668D+12   R2 =   0.1346704735296D-05
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9184714583052D+12   R2 =   0.6648515269839D-05
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9186099434612D+12   R2 =   0.1694878566321D+03
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9186904005784D+12   R2 =   0.1733253212572D+03
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9187140652125D+12   R2 =   0.1586654525661D-05
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9190388952304D+12   R2 =   0.3739705104999D+03
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9191176009597D+12   R2 =   0.1064121158342D+03
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9194581663209D+12   R2 =   0.5990889746586D+03
     ISTATE -5 - shortening step at time   28353.835141669995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9610522572769D+12   R2 =   0.3243751100408D+03
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9616605773114D+12   R2 =   0.2333372889322D+03
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9616970149634D+12   R2 =   0.5674035887242D+02
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7704922645139D+09
     ISTATE -1: Reducing time step to    2.2720682256614458E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9621658970596D+12   R2 =   0.2021808982612D+03
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9623286388346D+12   R2 =   0.1953644209346D+03
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9628326954462D+12   R2 =   0.9093678490569D-05
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9657445318471D+12   R2 =   0.1394194873843D+03
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9657742126061D+12   R2 =   0.6568353225944D-05
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4941302842544D+12
     ISTATE -1: Reducing time step to    153.24558356102494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9678804294669D+12   R2 =   0.6419032878969D-04
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9679211651884D+12   R2 =   0.7854482253604D+02
     ISTATE -5 - shortening step at time   29096.777415216911      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4005640185175D+11   R2 =   0.7179749780469D-07
     ISTATE -5 - shortening step at time   1166.8648517584941      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4008606681229D+11   R2 =   0.4539277143236D+02
     ISTATE -5 - shortening step at time   1166.8648517584941      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9934812667485D+12   R2 =   0.1402298026267D+03
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9941361825165D+12   R2 =   0.6627709048370D-05
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9960369725092D+12   R2 =   0.1564398520555D+03
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4880352910690D+11   R2 =   0.2168295955571D-05
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9961124295759D+12   R2 =   0.7504137805181D+02
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4895828874741D+11   R2 =   0.9249666583269D+03
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9961237886198D+12   R2 =   0.6944794084515D-05
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5011299975201D+11   R2 =   0.7822052805304D-04
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9961634049034D+12   R2 =   0.7567466458245D-04
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9961837518829D+12   R2 =   0.3563572575312D-05
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9992056925060D+12   R2 =   0.1982846580180D+03
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9992416051549D+12   R2 =   0.8557548882595D+02
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7250441786773D+11   R2 =   0.6502760376029D+02
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9992698286288D+12   R2 =   0.7465232810117D-05
     ISTATE -5 - shortening step at time   30630.416619886324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7318794752641D+11   R2 =   0.3702619618239D-04
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9993005839285D+12   R2 =   0.3131312148880D+01
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7361831582313D+11   R2 =   0.8285205794850D+03
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1026374201186D+13   R2 =   0.2709076496315D+04
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1029952264718D+13   R2 =   0.3648998197390D+03
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7527070019277D+11   R2 =   0.3468197248314D-04
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1030381062190D+13   R2 =   0.4482169136778D+03
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7543489877740D+11   R2 =   0.4714794656650D-04
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1038921212647D+13   R2 =   0.2055449062341D+03
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7563866053087D+11   R2 =   0.4814919190993D-03
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7607038514296D+11   R2 =   0.5516904589268D+03
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1042310045705D+13   R2 =   0.2499799683416D+03
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7620920485050D+11   R2 =   0.5927488194296D-05
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1063222333846D+13   R2 =   0.8734860677969D-05
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7952993759645D+11   R2 =   0.1017003916937D-05
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1063240320796D+13   R2 =   0.2204880153629D-05
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1063373709122D+13   R2 =   0.2056714614079D+03
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9823564619702D+11   R2 =   0.4555144554431D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1063400597809D+13   R2 =   0.4987510636126D-05
     ISTATE -5 - shortening step at time   31622.462931289934      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1000329860020D+12   R2 =   0.4804072285436D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1063429735936D+13   R2 =   0.1358299871811D-06
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1000842705246D+12   R2 =   0.1639719548702D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1013902306094D+12   R2 =   0.1836001875085D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1015272186418D+12   R2 =   0.1630282290237D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1102629541368D+13   R2 =   0.1979493143565D+03
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1103584361547D+13   R2 =   0.5850096863395D+02
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4963329639147D+12
     ISTATE -1: Reducing time step to    146.27507820323058      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1103602382902D+13   R2 =   0.1831927220977D-05
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1105561955772D+13   R2 =   0.5201250695300D+03
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1254194210978D+12   R2 =   0.2456593133231D+04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7726614701899D+09
     ISTATE -1: Reducing time step to    1.5856107230113364E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1105574149511D+13   R2 =   0.1234881488350D-04
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1257774772469D+12   R2 =   0.1272144010597D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1105747439961D+13   R2 =   0.3004123652917D+03
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1259816680131D+12   R2 =   0.6654779364048D+03
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1105893526376D+13   R2 =   0.2100182731759D+03
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1261528572827D+12   R2 =   0.3272270417984D+03
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1107179309054D+13   R2 =   0.2402934813730D+03
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1262093951848D+12   R2 =   0.4691455462370D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1107209372464D+13   R2 =   0.2643726053402D-05
     ISTATE -5 - shortening step at time   33651.917652183314      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1265297601614D+12   R2 =   0.2155990057817D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1107273706538D+13   R2 =   0.2108851211796D-06
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1266829207382D+12   R2 =   0.7985775430651D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1267190947116D+12   R2 =   0.1702806541953D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1110268100376D+13   R2 =   0.5167404615121D-04
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1110371630372D+13   R2 =   0.2308502725239D+03
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1110507225514D+13   R2 =   0.4326563323644D+02
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1267713527594D+12   R2 =   0.1669073665410D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1110600686106D+13   R2 =   0.2344476672017D+03
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1268061831330D+12   R2 =   0.3396323514558D-04
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1110611449180D+13   R2 =   0.2280436579116D-05
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1110662913335D+13   R2 =   0.7680530198757D+02
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1270707812350D+12   R2 =   0.3406068321599D-05
     ISTATE -5 - shortening step at time   4012.8538966154042      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1111473983685D+13   R2 =   0.1434113534004D+03
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1111489424013D+13   R2 =   0.5929748822904D+02
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1114524162854D+13   R2 =   0.8142032866355D+03
     ISTATE -5 - shortening step at time   35038.271280507492      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1284241333890D+12   R2 =   0.6657120719659D-06
     ISTATE -5 - shortening step at time   4012.8538966154042      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1158267985636D+13   R2 =   0.1556212837506D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1162680839243D+13   R2 =   0.2076028497596D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1165603506606D+13   R2 =   0.7051011904661D-04
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2719487531216D+12   R2 =   0.3162264681765D-06
     ISTATE -5 - shortening step at time   8601.9102004805864      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720244341219D+12   R2 =   0.4062699391570D+02
     ISTATE -5 - shortening step at time   8601.9102004805864      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720926436169D+12   R2 =   0.3622120927410D+02
     ISTATE -5 - shortening step at time   8601.9102004805864      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1179174447211D+13   R2 =   0.2585417294883D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1179237112736D+13   R2 =   0.2499553305891D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1184734077400D+13   R2 =   0.4565706980170D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2725683786863D+12   R2 =   0.1013347568784D-05
     ISTATE -5 - shortening step at time   8601.9102004805864      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1184767318614D+13   R2 =   0.1671225974256D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1192050112150D+13   R2 =   0.1938927913915D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1195588486245D+13   R2 =   0.2369537985863D+03
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1197039311850D+13   R2 =   0.7850296535386D+02
     ISTATE -5 - shortening step at time   35269.751989038006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1197060864322D+13   R2 =   0.1679634467369D+01
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3478720051920D+12   R2 =   0.9830072834753D-06
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3479808720363D+12   R2 =   0.2003919909318D+03
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5172877715416D+12
     ISTATE -1: Reducing time step to    79.962394851334139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3480096517222D+12   R2 =   0.1323139191123D-04
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1236670793574D+13   R2 =   0.4267797535614D-05
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3480551428098D+12   R2 =   0.1075292269609D+03
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1236714731817D+13   R2 =   0.9374636880046D+02
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3483908389311D+12   R2 =   0.4704316849505D+03
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3484014725667D+12   R2 =   0.3547685959818D-04
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3484574812275D+12   R2 =   0.3069055833402D+02
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1246164979532D+13   R2 =   0.7924490397759D-05
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1246312501622D+13   R2 =   0.2141868595079D+03
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3485158130817D+12   R2 =   0.6922059935401D-05
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1249504062571D+13   R2 =   0.2297811724996D+03
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3485713163910D+12   R2 =   0.6481913823313D-03
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3486091795477D+12   R2 =   0.8143514206550D+02
     ISTATE -5 - shortening step at time   10408.311793769661      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1249519087953D+13   R2 =   0.7564393616806D-05
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1249576676776D+13   R2 =   0.1383208942550D+03
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3486763084873D+12   R2 =   0.2016568485816D-05
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3487118785784D+12   R2 =   0.2401585335478D+02
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1249598339601D+13   R2 =   0.2543212122967D-04
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3498806429446D+12   R2 =   0.3364539461280D+03
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3498892769711D+12   R2 =   0.5006510580448D+02
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3499588858941D+12   R2 =   0.8656800220732D+02
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1257770190421D+13   R2 =   0.1368023775259D-04
     ISTATE -5 - shortening step at time   37880.990881338235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3639184868136D+12   R2 =   0.2621941590108D+03
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3639654513882D+12   R2 =   0.1022788130310D+03
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3640331828460D+12   R2 =   0.2030347361708D+03
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3640891983731D+12   R2 =   0.2165391370160D+03
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1260326578832D+13   R2 =   0.9264494667631D+02
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3641295075945D+12   R2 =   0.7820405575056D+02
     ISTATE -5 - shortening step at time   11031.936061637502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3642171587469D+12   R2 =   0.9679377822180D-06
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1277190722708D+13   R2 =   0.6637725523389D-05
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3643702448936D+12   R2 =   0.3823890731349D-05
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3644604037040D+12   R2 =   0.1561384221327D-04
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1277295566156D+13   R2 =   0.4345901515383D-05
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5268448362329D+12
     ISTATE -1: Reducing time step to    49.718518795359351      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3645031367899D+12   R2 =   0.1769898399441D-05
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3645611512913D+12   R2 =   0.7301596347582D+02
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3653156680670D+12   R2 =   0.3283494478907D+03
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1279245132893D+13   R2 =   0.8245489917689D-05
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1279632549125D+13   R2 =   0.7059949604695D+02
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3653467439569D+12   R2 =   0.1143175681831D-04
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1279643654053D+13   R2 =   0.3456050343472D-05
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3681913076198D+12   R2 =   0.9343350889579D+02
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3682435998746D+12   R2 =   0.1119633014506D+03
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3682840518296D+12   R2 =   0.6016331196562D+02
     ISTATE -5 - shortening step at time   11523.085683371140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1279654751516D+13   R2 =   0.1350017372523D-05
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1279741279084D+13   R2 =   0.2146848086485D+03
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1280954877398D+13   R2 =   0.2043072595755D+03
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1281045538781D+13   R2 =   0.2066455218497D+03
     ISTATE -5 - shortening step at time   39802.854127254715      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4052073954081D+12   R2 =   0.1170303662980D-06
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4053157198060D+12   R2 =   0.2349297317512D-04
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4054699544081D+12   R2 =   0.1588793238596D-05
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329128890120D+13   R2 =   0.4827356851811D+03
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329329891513D+13   R2 =   0.7284090947599D+02
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4132325295717D+12   R2 =   0.3307920163991D-04
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4132477896330D+12   R2 =   0.1209179606199D+03
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329339910604D+13   R2 =   0.3126688991673D-05
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4132688204730D+12   R2 =   0.5087014191160D-05
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329371375458D+13   R2 =   0.1031334054365D-03
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329427112988D+13   R2 =   0.1998047774159D+03
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4132873162913D+12   R2 =   0.6596392805255D-05
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4147937619795D+12   R2 =   0.1312151839580D+03
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329460295509D+13   R2 =   0.1446317055320D-04
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4148606829337D+12   R2 =   0.4103162396390D+02
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4151092746111D+12   R2 =   0.1136075421651D+03
     ISTATE -5 - shortening step at time   12820.014740290735      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329477863377D+13   R2 =   0.1754730893276D-04
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329488246692D+13   R2 =   0.1478916428625D-04
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4290030155632D+12   R2 =   0.3457522861149D-05
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6102972923015D+12   R2 =   0.9134837125270D-06
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329496899697D+13   R2 =   0.3185313867697D-05
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1329628855976D+13   R2 =   0.9593415509303D+02
     ISTATE -5 - shortening step at time   40539.415784198944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4492949782203D+12   R2 =   0.3268390591915D+03
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6120459311293D+12   R2 =   0.5777459364917D-07
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4493732726972D+12   R2 =   0.6369460141054D+02
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4494649143533D+12   R2 =   0.1823986786768D+03
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6121175235745D+12   R2 =   0.7740636298845D-04
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1358495713713D+13   R2 =   0.6349648348272D+03
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4495104713930D+12   R2 =   0.6637757250441D-05
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1360699888474D+13   R2 =   0.1954896816080D+03
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6122045709404D+12   R2 =   0.2329048756585D-05
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1362666700051D+13   R2 =   0.2890355134566D+03
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4525745414062D+12   R2 =   0.6569119228299D+02
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6258745562548D+12   R2 =   0.4588809041960D-07
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1362711061242D+13   R2 =   0.7217361608390D-06
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4529826330274D+12   R2 =   0.7175796264898D-04
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1366987400170D+13   R2 =   0.2204542868866D+03
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6258983441222D+12   R2 =   0.6547292486218D-05
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1396994930059D+13   R2 =   0.6210262170189D+03
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4530092354740D+12   R2 =   0.1038689342245D-04
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1397268396071D+13   R2 =   0.2069693238477D+03
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6321069106388D+12   R2 =   0.3037894882982D-07
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4530496450524D+12   R2 =   0.9277444642463D-06
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1397276884162D+13   R2 =   0.3965920600259D-05
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1397334246854D+13   R2 =   0.6730877489857D+02
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6336052227699D+12   R2 =   0.6466464033622D-03
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4530664177048D+12   R2 =   0.7095599454735D-05
     ISTATE -5 - shortening step at time   13136.369449716805      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6340515440818D+12   R2 =   0.1434544238236D+04
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1397724303097D+13   R2 =   0.8913096011277D-05
     ISTATE -5 - shortening step at time   42076.862530901482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4531681951436D+12   R2 =   0.1313459250244D-05
     ISTATE -5 - shortening step at time   14337.544864074767      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1398441190169D+13   R2 =   0.3793226810789D-06
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1410188292656D+13   R2 =   0.7874756938741D+03
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7366027081421D+12   R2 =   0.2484475042408D-05
     ISTATE -5 - shortening step at time   22852.592841823789      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4985323729032D+12   R2 =   0.5058256642222D-07
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1410204189120D+13   R2 =   0.4263627100675D-05
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4986260336665D+12   R2 =   0.3120258204530D-05
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4986586460626D+12   R2 =   0.1628462005807D-04
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4987061996440D+12   R2 =   0.4265395692117D+02
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4990784126584D+12   R2 =   0.1775450465786D+03
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1411835846492D+13   R2 =   0.2315639538830D-04
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8930911457909D+12   R2 =   0.1818831612870D-05
     ISTATE -5 - shortening step at time   27651.638537272993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4997772364707D+12   R2 =   0.4205226002817D+03
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8938820021879D+12   R2 =   0.1947373785189D+04
     ISTATE -5 - shortening step at time   27651.638537272993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1423419753161D+13   R2 =   0.1482257579637D+03
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4997943613432D+12   R2 =   0.1955716354715D-05
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5000285244705D+12   R2 =   0.8119571875159D+02
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1423767244128D+13   R2 =   0.9202601443851D-05
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9672718451696D+12   R2 =   0.3782324108350D-05
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9675222312776D+12   R2 =   0.1612175610611D+04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9680589709992D+12   R2 =   0.5460221761168D+03
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1427463445220D+13   R2 =   0.9316705359662D+02
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5000422625461D+12   R2 =   0.4541182714230D-05
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1042406555946D+13   R2 =   0.7907146098038D+05
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1042740668589D+13   R2 =   0.2580042737418D+04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1429275714863D+13   R2 =   0.2118854503349D+03
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1429411580013D+13   R2 =   0.1307708106628D+03
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1043072964230D+13   R2 =   0.5676719203277D-04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5017515116143D+12   R2 =   0.2134677139803D-05
     ISTATE -5 - shortening step at time   15771.299692315952      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1043445517224D+13   R2 =   0.4018507587706D-04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1437006656226D+13   R2 =   0.1049068384691D-04
     ISTATE -5 - shortening step at time   44231.781743572530      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1073680383781D+13   R2 =   0.1709204694802D+04
     ISTATE -5 - shortening step at time   33458.484080486494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1074005490287D+13   R2 =   0.1729715267264D-03
     ISTATE -5 - shortening step at time   33458.484080486494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5773562669110D+12   R2 =   0.2112782869254D+03
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1074540235952D+13   R2 =   0.2096022799681D+04
     ISTATE -5 - shortening step at time   33458.484080486494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1470350478696D+13   R2 =   0.2021773862423D+03
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5774441900350D+12   R2 =   0.1543870278026D+03
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5774617666216D+12   R2 =   0.6005816095434D+03
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1075203333482D+13   R2 =   0.1839397540401D-04
     ISTATE -5 - shortening step at time   33458.484080486494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1470359514837D+13   R2 =   0.4243707824961D-04
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1494931339501D+13   R2 =   0.2583802173146D+03
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1159576368265D+13   R2 =   0.3450087024996D-05
     ISTATE -5 - shortening step at time   33458.484080486494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5828212867210D+12   R2 =   0.7865572220040D+02
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1495803249558D+13   R2 =   0.2284564862829D+03
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1160623475201D+13   R2 =   0.4963849581280D+03
     ISTATE -5 - shortening step at time   33458.484080486494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5830742095747D+12   R2 =   0.7260842644367D+02
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1160944910773D+13   R2 =   0.1781818173276D+04
     ISTATE -5 - shortening step at time   33458.484080486494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5831394166036D+12   R2 =   0.9398078952998D+02
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5834206757395D+12   R2 =   0.2699512386900D+03
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1495815065603D+13   R2 =   0.9407392361829D-06
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5834437345427D+12   R2 =   0.5840808117080D+02
     ISTATE -5 - shortening step at time   17466.034010710657      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1495837604858D+13   R2 =   0.2531054772915D-05
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1300995735032D+13   R2 =   0.3121742847602D+04
     ISTATE -5 - shortening step at time   40484.767492356004      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1495970568832D+13   R2 =   0.1083384359781D+03
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1301318151735D+13   R2 =   0.2790065100079D-04
     ISTATE -5 - shortening step at time   40484.767492356004      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1495982403486D+13   R2 =   0.2408306265714D-05
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1498729343671D+13   R2 =   0.2391829907406D+03
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1498754065514D+13   R2 =   0.5147982857791D+02
     ISTATE -5 - shortening step at time   45474.894184363031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1410488426727D+13   R2 =   0.9565573549640D-06
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1410610352309D+13   R2 =   0.8227692424376D+03
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1411177066131D+13   R2 =   0.8983413804462D+03
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1498786990298D+13   R2 =   0.4827996140218D-06
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1411234927194D+13   R2 =   0.3652105313204D+03
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1411922509184D+13   R2 =   0.9934119172771D+03
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1498905038353D+13   R2 =   0.1821648479458D-05
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1499176163154D+13   R2 =   0.3982336321441D+02
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412309787780D+13   R2 =   0.1478977387215D-03
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412458932686D+13   R2 =   0.1054862228908D+04
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1414285840127D+13   R2 =   0.7785409221927D+04
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1499183148161D+13   R2 =   0.7787621039531D-05
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1414838366789D+13   R2 =   0.3939444049645D-03
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7073693552654D+12   R2 =   0.2863371657494D-05
     ISTATE -5 - shortening step at time   21133.902069089847      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1499190645772D+13   R2 =   0.3070523591309D-06
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1414963133644D+13   R2 =   0.1012795989528D-03
     ISTATE -5 - shortening step at time   44533.245206823682      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1417390335748D+13   R2 =   0.6635791882722D+03
     ISTATE -5 - shortening step at time   44777.314355822462      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7074026476737D+12   R2 =   0.7489283216606D-05
     ISTATE -5 - shortening step at time   21133.902069089847      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1499194429269D+13   R2 =   0.1365489764488D-05
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1499208434213D+13   R2 =   0.1325654691740D+03
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1517993882381D+13   R2 =   0.1958817966729D-04
     ISTATE -5 - shortening step at time   44777.314355822462      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1502915116925D+13   R2 =   0.4379191702015D-05
     ISTATE -5 - shortening step at time   47428.926123871352      years
    [Parallel(n_jobs=4)]: Done   5 out of   9 | elapsed:  2.4min remaining:  1.9min
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1540286563138D+13   R2 =   0.1278427744675D-04
     ISTATE -5 - shortening step at time   44777.314355822462      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503087924656D+13   R2 =   0.6560814215657D-05
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1563735605890D+13   R2 =   0.1313590009559D+04
     ISTATE -5 - shortening step at time   49255.046858979076      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503144984913D+13   R2 =   0.1006493063032D+03
     ISTATE -5 - shortening step at time   47428.926123871352      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1563803571083D+13   R2 =   0.3757750181051D+03
     ISTATE -5 - shortening step at time   49255.046858979076      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1714817921454D+13   R2 =   0.8105504807404D-05
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537651208209D+13   R2 =   0.4040112078043D+03
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537665252136D+13   R2 =   0.3431661583608D+02
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1714884306738D+13   R2 =   0.1680495333152D+01
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537700299554D+13   R2 =   0.1296185721067D+03
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7804863312384D+12   R2 =   0.4643612165111D+02
     ISTATE -5 - shortening step at time   23247.292779870320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1714939061829D+13   R2 =   0.4294395337828D-04
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537743816301D+13   R2 =   0.2457979796146D-04
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537762737940D+13   R2 =   0.5073447406610D+02
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1714993433858D+13   R2 =   0.9766675747217D-05
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7819372638054D+12   R2 =   0.7649644608244D-05
     ISTATE -5 - shortening step at time   23247.292779870320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537803255583D+13   R2 =   0.4058116763803D+02
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1715044960727D+13   R2 =   0.1416610685823D-04
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537831316714D+13   R2 =   0.2260264024543D-05
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1715094246972D+13   R2 =   0.2237534650084D-04
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537837230216D+13   R2 =   0.1388171789492D-05
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8089265322593D+12   R2 =   0.7394726393599D-05
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537943605418D+13   R2 =   0.6479227074104D+02
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1859689586248D+13   R2 =   0.1989348460071D-04
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1860099007093D+13   R2 =   0.2840551298225D+04
     ISTATE -5 - shortening step at time   54180.552719208812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537947963523D+13   R2 =   0.4101348893058D-06
     ISTATE -5 - shortening step at time   47567.879269408644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1885805920331D+13   R2 =   0.1215630370159D+04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1538133923231D+13   R2 =   0.6804767931526D+02
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8146398198305D+12   R2 =   0.2426541537829D-04
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1886404921503D+13   R2 =   0.2408671915351D-04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8172686587907D+12   R2 =   0.1056591526539D+03
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1886485225814D+13   R2 =   0.6788662081074D-04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8173843716023D+12   R2 =   0.3386832447169D-05
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1886608696238D+13   R2 =   0.8998949425971D+03
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8173906934461D+12   R2 =   0.2169462592290D+02
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1887035859245D+13   R2 =   0.8294834410221D+03
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1887200177760D+13   R2 =   0.1116646313402D+04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1887918348690D+13   R2 =   0.1099400995821D+04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8173960799746D+12   R2 =   0.1574404724460D-05
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1888385874947D+13   R2 =   0.1893073215742D+04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1888732037030D+13   R2 =   0.2490060782626D+04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1889096600588D+13   R2 =   0.2554425538199D+04
     ISTATE -5 - shortening step at time   59598.609282894729      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1890985619236D+13   R2 =   0.5203070037410D+03
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8175318218747D+12   R2 =   0.2330425006620D-05
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8175411653576D+12   R2 =   0.2000184446190D+02
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1891038854971D+13   R2 =   0.8824069339908D-04
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8175478921196D+12   R2 =   0.4682039930204D-05
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1595672066752D+13
     ISTATE -1: Reducing time step to    304.02130133569261      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1595683721317D+13   R2 =   0.2582719478128D+02
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1912904221071D+13   R2 =   0.6463386998394D-04
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1595722158581D+13   R2 =   0.4218015312205D+02
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8175531527679D+12   R2 =   0.3053618950376D-05
     ISTATE -5 - shortening step at time   25572.022612116005      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1912993723685D+13   R2 =   0.5666087703693D+03
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1913094763999D+13   R2 =   0.5250425357540D+03
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1597442849537D+13   R2 =   0.6018288344014D+02
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1913285834525D+13   R2 =   0.3292081685812D-03
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1913562320687D+13   R2 =   0.1355494097521D+04
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1913682539407D+13   R2 =   0.5466058031776D+03
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1597743375934D+13   R2 =   0.1328901483601D-04
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1597785396273D+13   R2 =   0.3051194084106D-04
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1913747317502D+13   R2 =   0.1750239494838D-04
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1913890233310D+13   R2 =   0.1648670502557D+04
     ISTATE -5 - shortening step at time   59781.537993285943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1597845812062D+13   R2 =   0.1302947162725D-04
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2115121469701D+13   R2 =   0.2434357210507D+04
     ISTATE -5 - shortening step at time   66622.762730132672      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9314018173775D+12   R2 =   0.1120534396338D+03
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1600679522473D+13   R2 =   0.1086640528334D-05
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2321392397689D+13   R2 =   0.2461802056698D+03
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1600697259684D+13   R2 =   0.4963428596780D+02
     ISTATE -5 - shortening step at time   48669.239351986507      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9314522568848D+12   R2 =   0.4652806765467D-05
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379453530267D+13   R2 =   0.1149251239332D-04
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1609515079508D+13   R2 =   0.3409782369915D+03
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9318457207417D+12   R2 =   0.9189391145757D-05
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379517167288D+13   R2 =   0.7710599342632D-05
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1609618796841D+13   R2 =   0.8053761277659D-05
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1609627390500D+13   R2 =   0.7370275725489D+02
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9318514788128D+12   R2 =   0.7077017479228D-06
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379586544167D+13   R2 =   0.1218737951569D-03
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1609659426490D+13   R2 =   0.1099379485869D+03
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9319128105198D+12   R2 =   0.8153282612811D+02
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379718408282D+13   R2 =   0.4000088306161D+03
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379750845069D+13   R2 =   0.1655438829231D+03
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613196697787D+13   R2 =   0.5446263212861D+02
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379853127933D+13   R2 =   0.5608401224488D+03
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613365136269D+13   R2 =   0.6716284841330D-05
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9337297223288D+12   R2 =   0.8408919020664D-05
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379928355501D+13   R2 =   0.1907273813464D-04
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2379962417334D+13   R2 =   0.1758695921972D+03
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2382330226173D+13   R2 =   0.3634539377816D+04
     ISTATE -5 - shortening step at time   73285.040591556375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613381111401D+13   R2 =   0.1482839224553D-04
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2383681309167D+13   R2 =   0.1800685472065D+03
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613431941081D+13   R2 =   0.2096626575635D+03
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613488660621D+13   R2 =   0.1774515099936D+03
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613651280838D+13   R2 =   0.1827382436269D-05
     ISTATE -5 - shortening step at time   50654.976572271349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9489277743108D+12   R2 =   0.6232771471098D-06
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2415363222712D+13   R2 =   0.3621139382640D-05
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9490892346558D+12   R2 =   0.2227301075940D+03
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2417188049393D+13   R2 =   0.1771466821511D+04
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1614149362825D+13   R2 =   0.2227728103264D+03
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9493187417208D+12   R2 =   0.8394527196852D+02
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2417244715550D+13   R2 =   0.3268295255962D+03
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1614166100227D+13   R2 =   0.5127523311763D-05
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1614178393045D+13   R2 =   0.3785600679331D+03
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2417358734902D+13   R2 =   0.1009905051717D-04
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1614204212935D+13   R2 =   0.1383513747766D+03
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2417885120787D+13   R2 =   0.2166616367078D+04
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1614225349012D+13   R2 =   0.9684144397128D+02
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617293771753D+13   R2 =   0.5637526134433D+02
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9571137786692D+12   R2 =   0.1031658518664D-05
     ISTATE -5 - shortening step at time   28459.129352426691      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2470367449022D+13   R2 =   0.4552840302404D-05
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617368160226D+13   R2 =   0.4134944668280D+02
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2470832769112D+13   R2 =   0.2005898362423D+04
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2470912284134D+13   R2 =   0.5804007228346D+02
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2483910302616D+13   R2 =   0.8128070826724D+04
     ISTATE -5 - shortening step at time   75390.197030796931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617481299459D+13   R2 =   0.8578483134024D-05
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2485293591077D+13   R2 =   0.1271990009009D+03
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617521216152D+13   R2 =   0.2721261281377D-05
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2553929630345D+13   R2 =   0.1134268135020D+05
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617533832110D+13   R2 =   0.6218155864605D-06
     ISTATE -5 - shortening step at time   51064.913950582399      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2615870932141D+13   R2 =   0.7389329045884D-05
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1051299104483D+13   R2 =   0.1125464844036D+03
     ISTATE -5 - shortening step at time   30288.410717379171      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2616036383320D+13   R2 =   0.1719208107120D-04
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2616250540339D+13   R2 =   0.3914317478626D+03
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1051323777016D+13   R2 =   0.4398893606208D-05
     ISTATE -5 - shortening step at time   30288.410717379171      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1644091601620D+13   R2 =   0.6770351073532D-06
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1644147664790D+13   R2 =   0.5689765583439D+02
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2616471387791D+13   R2 =   0.3986855399636D-04
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1644175065102D+13   R2 =   0.8014494370946D+02
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1644207262581D+13   R2 =   0.3440280907805D+02
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2636157024754D+13   R2 =   0.1269701347083D-04
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2636299074006D+13   R2 =   0.1643026874127D+04
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1644282697894D+13   R2 =   0.4560009689498D-04
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2721813195448D+13   R2 =   0.4337295559048D+05
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722019849145D+13   R2 =   0.5489836474872D+03
     ISTATE -5 - shortening step at time   78604.756411913448      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1067191008377D+13   R2 =   0.1103231095096D+03
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646157420823D+13   R2 =   0.2292235827772D-05
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1067200578794D+13   R2 =   0.3100994562966D-05
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2940682515818D+13   R2 =   0.5320439570933D-04
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1067277916948D+13   R2 =   0.3588102965424D-03
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2941027387428D+13   R2 =   0.1081823725645D+04
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646186913725D+13   R2 =   0.8115986456551D-06
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2941450305737D+13   R2 =   0.1070746578909D+04
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2941801364839D+13   R2 =   0.2486284171732D+04
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646356250301D+13   R2 =   0.9785890432717D+02
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1067913885575D+13   R2 =   0.1876779532262D+02
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2942255616254D+13   R2 =   0.2827327110567D+04
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2942529914995D+13   R2 =   0.6610908633152D+03
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2942583896127D+13   R2 =   0.1772756391123D+03
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1069565952946D+13   R2 =   0.9316175735802D+02
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2942649308949D+13   R2 =   0.7105771980119D+03
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646497710765D+13   R2 =   0.3373173417388D-05
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1069574477802D+13   R2 =   0.4608312184491D+02
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2942789613958D+13   R2 =   0.8989702727023D+03
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2942891694182D+13   R2 =   0.6419112304517D+03
     ISTATE -5 - shortening step at time   86139.868643830239      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1069693227306D+13   R2 =   0.1339687112617D+03
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646528089431D+13   R2 =   0.3882783840131D+02
     ISTATE -5 - shortening step at time   51187.779497138807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3093203422285D+13   R2 =   0.3643285946225D+04
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1069766009013D+13   R2 =   0.9156508899021D-06
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3098957070909D+13   R2 =   0.3285454303437D+04
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646555283202D+13   R2 =   0.2037300204478D-06
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1069803445067D+13   R2 =   0.5240049988531D+02
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3099012524189D+13   R2 =   0.3226878549149D+03
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646630200964D+13   R2 =   0.6566410282478D+02
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3100759606988D+13   R2 =   0.1503829987227D+04
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1069820111423D+13   R2 =   0.2171112915128D-05
     ISTATE -5 - shortening step at time   33317.252511249069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1646632536535D+13   R2 =   0.4988489945865D-06
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033412631828D+10
     ISTATE -1: Reducing time step to    2.5116159027469771      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3100824277678D+13   R2 =   0.4228470240538D-04
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649339850172D+13   R2 =   0.7380810786446D+03
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1069820273038D+13   R2 =   0.3913344333910D-07
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649344016131D+13   R2 =   0.3040072605843D+02
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1070481928309D+13   R2 =   0.5789316832431D+03
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3103430501391D+13   R2 =   0.2481300073419D-05
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1070492149821D+13   R2 =   0.4554278457145D+02
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1070510698775D+13   R2 =   0.5996032410691D+02
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649351575862D+13   R2 =   0.1072536258857D-04
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649363864532D+13   R2 =   0.6059651878728D+02
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3103483453143D+13   R2 =   0.4705684738740D-03
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649375979386D+13   R2 =   0.5421911911943D+02
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1072115006672D+13   R2 =   0.1417947068822D-04
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649383870068D+13   R2 =   0.4661313244194D-05
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3104015296467D+13   R2 =   0.7949052180017D-04
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3104132782491D+13   R2 =   0.5759556474281D+03
     ISTATE -5 - shortening step at time   93129.483993107235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3104233632371D+13   R2 =   0.5209681511173D+03
     ISTATE -5 - shortening step at time   93129.483993107235      years
    [Parallel(n_jobs=4)]: Done   6 out of   9 | elapsed:  2.7min remaining:  1.4min
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1072305408390D+13   R2 =   0.3761241445969D-05
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649393999760D+13   R2 =   0.3874553327823D-05
     ISTATE -5 - shortening step at time   52105.319285785525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1072323985411D+13   R2 =   0.4500902290356D-04
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1073314773126D+13   R2 =   0.1196149961114D+03
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649968531934D+13   R2 =   0.5389483957901D-05
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1073358667703D+13   R2 =   0.1020401712640D+03
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649987695520D+13   R2 =   0.4321469491184D+02
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1650626200199D+13   R2 =   0.8698550319083D+02
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1650726479770D+13   R2 =   0.5808256352693D+02
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1073551258195D+13   R2 =   0.3497661544115D-05
     ISTATE -5 - shortening step at time   33855.066817184786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1650734170691D+13   R2 =   0.4042561953104D+02
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1650784619361D+13   R2 =   0.6000593526819D+02
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1650802837508D+13   R2 =   0.3450294047341D-05
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183272661835D+13   R2 =   0.4094659065702D+02
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183476554707D+13   R2 =   0.1521889431230D-04
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183479941252D+13   R2 =   0.2592788929997D-05
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183508433520D+13   R2 =   0.2364618669384D+02
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183552602258D+13   R2 =   0.5524732938055D+02
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1712348918350D+13
     ISTATE -1: Reducing time step to    322.73582984308490      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183563706096D+13   R2 =   0.5611476894309D-05
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1712707614260D+13   R2 =   0.6596205563702D-06
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183600824469D+13   R2 =   0.8802179425407D-05
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1712722632947D+13   R2 =   0.5994325227970D-05
     ISTATE -5 - shortening step at time   52196.012650625817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183616779776D+13   R2 =   0.5236900109564D-05
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1712763068218D+13   R2 =   0.3298033812400D+02
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183664093202D+13   R2 =   0.9809722948665D+01
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183666996440D+13   R2 =   0.1754785853323D-05
     ISTATE -5 - shortening step at time   37370.456000331636      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183690760694D+13   R2 =   0.2548751619160D-05
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1183901529355D+13   R2 =   0.5286580829961D+02
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1748764992075D+13   R2 =   0.2864121550496D+02
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1748786707708D+13   R2 =   0.9331590066929D+02
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1748804943647D+13   R2 =   0.9988025144466D+02
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1748818826355D+13   R2 =   0.2046980294538D+02
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1184003980069D+13   R2 =   0.2183248581738D-04
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033428962302D+10
     ISTATE -1: Reducing time step to    2.5115642240326950      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1184007892702D+13   R2 =   0.2437988504753D-06
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1203276587209D+13   R2 =   0.2024539098756D-05
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1770022714883D+13   R2 =   0.2573572680958D-05
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779347042375D+13   R2 =   0.2590075965623D-04
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779374522117D+13   R2 =   0.4167416545157D+02
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1203579033569D+13   R2 =   0.1431739461294D-05
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779584261045D+13   R2 =   0.9108910350849D+02
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1203583773964D+13   R2 =   0.4737144158414D-05
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1203593026403D+13   R2 =   0.5609470838354D+01
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779781753332D+13   R2 =   0.1535051171693D-04
     ISTATE -5 - shortening step at time   54200.083321113736      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1203606814426D+13   R2 =   0.5448134956851D+02
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1203620712138D+13   R2 =   0.2172927709177D+02
     ISTATE -5 - shortening step at time   37457.816343043851      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779809104294D+13   R2 =   0.1450338330515D-05
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1203646695643D+13   R2 =   0.1594201928423D-06
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779840272613D+13   R2 =   0.1829767462167D-05
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1204150802291D+13   R2 =   0.1291260433170D-05
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779855631896D+13   R2 =   0.3407977961940D-06
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1204402488395D+13   R2 =   0.2553318820257D+02
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1205181269077D+13   R2 =   0.4486062599230D+02
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779862323652D+13   R2 =   0.8336169685784D-06
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1205198266702D+13   R2 =   0.5473930145567D+02
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780373164802D+13   R2 =   0.1073024799840D+02
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780382487385D+13   R2 =   0.1344592452792D+02
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1207483318080D+13   R2 =   0.2069587752356D+03
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780386380925D+13   R2 =   0.1117952625221D-05
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1207973803056D+13   R2 =   0.2581822048099D+02
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208002055991D+13   R2 =   0.2931209759533D+02
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780889416581D+13   R2 =   0.1179298240613D+03
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780899956557D+13   R2 =   0.7763472199162D-03
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208010107975D+13   R2 =   0.7909330066897D-06
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780919964901D+13   R2 =   0.9437207741109D+02
     ISTATE -5 - shortening step at time   56322.207383914116      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780945969198D+13   R2 =   0.5880947831972D+00
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208018865324D+13   R2 =   0.6475102980877D-06
     ISTATE -5 - shortening step at time   38089.263042333630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780997553237D+13   R2 =   0.1056182678846D+03
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1781031922707D+13   R2 =   0.1030877967359D+03
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208101257589D+13   R2 =   0.1214159399275D+03
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1782772479969D+13   R2 =   0.1029460655409D+03
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1782775781377D+13   R2 =   0.2684197116918D+02
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1782815400197D+13   R2 =   0.5589725985651D+02
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208157432638D+13   R2 =   0.2470022201958D-05
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208162207634D+13   R2 =   0.2780840519141D-06
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1782823481084D+13   R2 =   0.1258863392345D-05
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208181237536D+13   R2 =   0.6664369172485D+02
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1782984821754D+13   R2 =   0.2054252037267D+03
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208903628715D+13   R2 =   0.9391575088961D-06
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208910588465D+13   R2 =   0.4855599509165D+02
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1788197246886D+13   R2 =   0.1421741946231D-04
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208927524336D+13   R2 =   0.1971055414760D-04
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1788207725721D+13   R2 =   0.8406143418287D-05
     ISTATE -5 - shortening step at time   56358.226737366276      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033442578635D+10
     ISTATE -1: Reducing time step to    2.5115211343705424      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208935480501D+13   R2 =   0.1068717922996D-04
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208940068404D+13   R2 =   0.6949225797478D-05
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1209047855262D+13   R2 =   0.3185510313004D-04
     ISTATE -5 - shortening step at time   38228.445105174273      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1209577821843D+13   R2 =   0.1873239736542D+03
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836609168909D+13   R2 =   0.8419302826673D-05
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1210150002534D+13   R2 =   0.3407676059115D+02
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836713088266D+13   R2 =   0.1043401563213D+03
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1210159950744D+13   R2 =   0.2512768755566D+02
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836725593908D+13   R2 =   0.6201253374901D+02
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1211450957717D+13   R2 =   0.6499396244744D+02
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836735129757D+13   R2 =   0.9969529128869D-06
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836747552419D+13   R2 =   0.8690025722866D+02
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1211457504638D+13   R2 =   0.2925477893510D-05
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836826956395D+13   R2 =   0.6802046144649D-06
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1211464750547D+13   R2 =   0.1541274151899D-04
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836905643718D+13   R2 =   0.4924421461378D+02
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836957874104D+13   R2 =   0.3002063807052D+02
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1211471296253D+13   R2 =   0.1142767496794D-05
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1211492239657D+13   R2 =   0.2760157371947D+02
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1836979642393D+13   R2 =   0.1061512719236D-03
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1211516142000D+13   R2 =   0.2697176416287D+02
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1211547973491D+13   R2 =   0.9413337074754D+02
     ISTATE -5 - shortening step at time   38261.008077916333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1837086238014D+13   R2 =   0.1272332035752D+03
     ISTATE -5 - shortening step at time   56588.852079764139      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1837132326771D+13   R2 =   0.4130067460460D+02
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1212116950555D+13   R2 =   0.2754673688892D-05
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1221575474967D+13   R2 =   0.5769990406273D+02
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1221619050001D+13   R2 =   0.1392205429880D-04
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1873511877593D+13   R2 =   0.9059441834759D-04
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1873896420486D+13   R2 =   0.1103098594268D+03
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1225899447777D+13   R2 =   0.1207769569928D+03
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1225924125863D+13   R2 =   0.1857478813830D+02
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1874155251952D+13   R2 =   0.6321931467829D-05
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1874201320266D+13   R2 =   0.1003521300480D+02
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1874229295123D+13   R2 =   0.9007638209341D-05
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1874246496203D+13   R2 =   0.1412719267396D-04
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1874255402352D+13   R2 =   0.2504494582280D+02
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1874268035957D+13   R2 =   0.3681917296699D+02
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1874933810237D+13   R2 =   0.1148855333489D+03
     ISTATE -5 - shortening step at time   58135.640443469994      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1263101267600D+13
     ISTATE -1: Reducing time step to    220.25801633981777      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1263185268369D+13   R2 =   0.5079828574985D+02
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1263246579820D+13   R2 =   0.1107457195131D+03
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033453925544D+10
     ISTATE -1: Reducing time step to    2.5114852264306822      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1263251404757D+13   R2 =   0.9762080961465D-06
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1893058736954D+13   R2 =   0.6235207175587D-05
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1263277975867D+13   R2 =   0.1540017713936D-05
     ISTATE -5 - shortening step at time   38340.125743396369      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1893061766996D+13   R2 =   0.2601139670755D+02
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1893067032768D+13   R2 =   0.1503144487693D-05
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1894777789971D+13   R2 =   0.8061319713217D+02
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1895745715841D+13   R2 =   0.1089764727249D+03
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1286181711644D+13   R2 =   0.1009669411455D+03
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1895778702106D+13   R2 =   0.4826744461571D+02
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1286185933964D+13   R2 =   0.8332752537983D-06
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1286229738244D+13   R2 =   0.6855470244254D+02
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1286270575197D+13   R2 =   0.3574598479832D+03
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1897334283463D+13   R2 =   0.1009940815815D-04
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1898477184875D+13   R2 =   0.1025294272753D+03
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943333579178D+13   R2 =   0.4071471719390D+03
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943369366424D+13   R2 =   0.8753207613528D+02
     ISTATE -5 - shortening step at time   59333.348425227807      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1292878441530D+13   R2 =   0.2085893122293D-05
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1292893086245D+13   R2 =   0.2314382691641D+02
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943392146087D+13   R2 =   0.1347985699496D-06
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1292897154984D+13   R2 =   0.5762376687493D-06
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943529845469D+13   R2 =   0.2421219353466D+02
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1292905031681D+13   R2 =   0.4005913695405D-05
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943541449317D+13   R2 =   0.2076069361820D-05
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943545400550D+13   R2 =   0.1356255010756D+02
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1292910169508D+13   R2 =   0.2737903251803D-05
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1292927255746D+13   R2 =   0.3695477432080D-04
     ISTATE -5 - shortening step at time   39977.151135045198      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943567436127D+13   R2 =   0.1674471668499D-05
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943696261629D+13   R2 =   0.1338128498951D+03
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943798613444D+13   R2 =   0.4704342027648D-05
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1292945445074D+13   R2 =   0.1242783337336D-06
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943813673037D+13   R2 =   0.1915119507060D+02
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293274033692D+13   R2 =   0.2484048142809D+03
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293276954236D+13   R2 =   0.9898725947724D+01
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1943839611118D+13   R2 =   0.4946574677287D-05
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293283104188D+13   R2 =   0.2458458472118D-04
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293706985330D+13   R2 =   0.3776137889038D+03
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1950448049145D+13   R2 =   0.1082223719108D+03
     ISTATE -5 - shortening step at time   61499.030583050087      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1950491817507D+13   R2 =   0.5228158728171D+02
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293716496486D+13   R2 =   0.5395027537755D-05
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293754558028D+13   R2 =   0.9159483255384D-05
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293770493964D+13   R2 =   0.2747696962350D-05
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1982956944636D+13   R2 =   0.4674808820331D+02
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293792250191D+13   R2 =   0.1565514228568D-05
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1293803728121D+13   R2 =   0.2909648584550D-05
     ISTATE -5 - shortening step at time   40915.419485634309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1993963003093D+13   R2 =   0.8320313931571D+02
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1994032427895D+13   R2 =   0.1181092993217D+03
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1994124729886D+13   R2 =   0.5410304040277D+02
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033465855184D+10
     ISTATE -1: Reducing time step to    2.5114474744024027      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1995708567622D+13   R2 =   0.1170763715228D+03
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1995723927761D+13   R2 =   0.3161371318077D-05
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1995828041282D+13   R2 =   0.1523071713576D+03
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1995841167564D+13   R2 =   0.1246863643151D-04
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1997021924781D+13   R2 =   0.1182219322414D+03
     ISTATE -5 - shortening step at time   61723.039529908470      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1371563986372D+13   R2 =   0.1374388627655D+03
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1371572000863D+13   R2 =   0.3874847723251D+02
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1371616049721D+13   R2 =   0.4199441452792D+02
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1371620975460D+13   R2 =   0.2615304427024D-04
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1371645791352D+13   R2 =   0.6824774050445D+02
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2034435402403D+13   R2 =   0.6080349292660D-05
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2034455841164D+13   R2 =   0.5335012178724D-04
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1377172054596D+13   R2 =   0.7090256775067D+02
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1377212785717D+13   R2 =   0.4885084933943D+02
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2039989480666D+13   R2 =   0.1163525724013D+03
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1377292758877D+13   R2 =   0.1091380672303D+03
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2040018075082D+13   R2 =   0.5455722682724D+02
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2040088811647D+13   R2 =   0.2529884501236D-05
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2040323020780D+13   R2 =   0.4349286642690D+02
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1387682310269D+13   R2 =   0.6403319654226D+02
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2042487123480D+13   R2 =   0.1080529500798D+03
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2042562519184D+13   R2 =   0.9664296168156D+02
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1387703590862D+13   R2 =   0.6655448278878D-05
     ISTATE -5 - shortening step at time   40943.155953194786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1387728505468D+13   R2 =   0.1092970106188D-05
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2049268329210D+13   R2 =   0.1515880677722D-05
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389161528806D+13   R2 =   0.1024694998863D-05
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2049286059998D+13   R2 =   0.1061772280471D-03
     ISTATE -5 - shortening step at time   63196.896353823511      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389165615599D+13   R2 =   0.1874074713181D-05
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2049302653052D+13   R2 =   0.1370951769421D-06
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389199535641D+13   R2 =   0.6432258096276D-06
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389209935789D+13   R2 =   0.5695547379842D+02
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2049308266062D+13   R2 =   0.6228426070884D-06
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389229637101D+13   R2 =   0.4008164484132D-05
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389232739309D+13   R2 =   0.1893890513524D+02
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2049314819158D+13   R2 =   0.1022808870352D-04
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2049797918954D+13   R2 =   0.7378632138655D-06
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389785611437D+13   R2 =   0.1069507815654D-05
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2050842340695D+13   R2 =   0.3670483819274D-05
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2050894283604D+13   R2 =   0.4132681625877D+02
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389790501710D+13   R2 =   0.2086260908700D-05
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2051156606477D+13   R2 =   0.5811898481515D+02
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2051172654525D+13   R2 =   0.4804996688046D+02
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1390486423046D+13   R2 =   0.5407506599048D+02
     ISTATE -5 - shortening step at time   43914.670596904303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2051206728999D+13   R2 =   0.1273740980646D+03
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2051237633244D+13   R2 =   0.1134923140399D+03
     ISTATE -5 - shortening step at time   64850.824683475599      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033476240805D+10
     ISTATE -1: Reducing time step to    2.5114146085139510      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2063605419326D+13   R2 =   0.7538003812156D+02
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064350068583D+13   R2 =   0.4529099346672D+03
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064375866956D+13   R2 =   0.1065119249893D-04
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064403203543D+13   R2 =   0.5037934537636D+02
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064958500984D+13   R2 =   0.4776498430767D-06
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064989350687D+13   R2 =   0.1151055820795D+03
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2069897207097D+13   R2 =   0.4514575505217D+03
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2087505463451D+13   R2 =   0.5015511347312D+03
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482060227789D+13   R2 =   0.3870623495098D-05
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482088002931D+13   R2 =   0.9211763757298D-06
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2092958935281D+13   R2 =   0.5480397660423D-05
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2092985723344D+13   R2 =   0.6206796237718D+02
     ISTATE -5 - shortening step at time   64912.583330506379      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482270220532D+13   R2 =   0.6772006902316D-05
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2092986695950D+13   R2 =   0.6241837210079D-07
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482291032346D+13   R2 =   0.4928492023854D-05
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482298289245D+13   R2 =   0.2208137950510D+03
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093010857728D+13   R2 =   0.1010248501350D-05
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482308199562D+13   R2 =   0.5804034177986D-06
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093020087125D+13   R2 =   0.7662837609068D-05
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093112142577D+13   R2 =   0.1585467474543D+03
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482316055613D+13   R2 =   0.3414682332279D-05
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093288814917D+13   R2 =   0.1658895617635D+02
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482324227370D+13   R2 =   0.3824478681856D+02
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482342068140D+13   R2 =   0.6663871674511D+02
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093507981678D+13   R2 =   0.2565789831808D+03
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093534808513D+13   R2 =   0.3803666190277D+02
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093570073620D+13   R2 =   0.1213628716035D+03
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482355218080D+13   R2 =   0.3101463172852D-04
     ISTATE -5 - shortening step at time   44002.734906503320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093577779992D+13   R2 =   0.1484116476192D-05
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482378400874D+13   R2 =   0.4519205833664D-06
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093738002793D+13   R2 =   0.3174928192584D-05
     ISTATE -5 - shortening step at time   66233.725422281888      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482382596931D+13   R2 =   0.9146558382559D-06
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482459767974D+13   R2 =   0.1050721357138D+03
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482497744927D+13   R2 =   0.2712477043952D+02
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482579489531D+13   R2 =   0.1108564584289D-05
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482689501304D+13   R2 =   0.1480158404387D+03
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482700294091D+13   R2 =   0.9457091239126D+01
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1482975804777D+13   R2 =   0.2094711645186D+03
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1483251267084D+13   R2 =   0.2830734834769D+02
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033486376532D+10
     ISTATE -1: Reducing time step to    2.5113825334270428      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1483444967754D+13   R2 =   0.7858693558422D-06
     ISTATE -5 - shortening step at time   46909.975255695143      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1483582077922D+13   R2 =   0.2070645202866D-06
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1483588530276D+13   R2 =   0.1919635135959D-04
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2174673574854D+13
     ISTATE -1: Reducing time step to    406.45025332434420      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174682767310D+13   R2 =   0.4797979026441D+02
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174692326700D+13   R2 =   0.5639998089825D+02
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174709461843D+13   R2 =   0.4912981595478D+03
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516548797403D+13   R2 =   0.2438009820212D+02
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174722329219D+13   R2 =   0.7076706773344D-05
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516559047061D+13   R2 =   0.6476752361411D+02
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174736082925D+13   R2 =   0.3687549147072D-05
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516562305998D+13   R2 =   0.1859436144311D-05
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516573482200D+13   R2 =   0.3235032227579D-05
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174747589920D+13   R2 =   0.3031001549403D-05
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516608025015D+13   R2 =   0.5095255984660D+02
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516612134468D+13   R2 =   0.1374561715058D+02
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516616697672D+13   R2 =   0.7423028202869D+01
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174765232998D+13   R2 =   0.4677235259097D-05
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1517649299947D+13   R2 =   0.1734153780027D+03
     ISTATE -5 - shortening step at time   46944.461004870704      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174774784636D+13   R2 =   0.1403641603304D-05
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174801215834D+13   R2 =   0.1083422762629D+03
     ISTATE -5 - shortening step at time   66257.531733958589      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174828480614D+13   R2 =   0.2122407688021D-06
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174954673273D+13   R2 =   0.5508659951081D-04
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2175044187996D+13   R2 =   0.1269869835766D+03
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2175059754848D+13   R2 =   0.1026891336015D-04
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2175253804613D+13   R2 =   0.3766747438598D+02
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2175312748714D+13   R2 =   0.1031140093675D+03
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2177764163527D+13   R2 =   0.1569255178626D-04
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183078727100D+13   R2 =   0.1232622672834D+03
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183086277402D+13   R2 =   0.2481068105256D+03
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183094173639D+13   R2 =   0.5219829312463D-05
     ISTATE -5 - shortening step at time   68822.823285896258      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183223517887D+13   R2 =   0.8083330355763D+02
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183377860953D+13   R2 =   0.1894655876923D-05
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183392578720D+13   R2 =   0.8827610062922D+02
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183671087668D+13   R2 =   0.4210232607388D+03
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183697706635D+13   R2 =   0.6160617645871D+02
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183722901336D+13   R2 =   0.7377752078507D+03
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183736307812D+13   R2 =   0.1021202402719D-05
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033495465467D+10
     ISTATE -1: Reducing time step to    2.5113537709751705      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183784147895D+13   R2 =   0.5349266445156D+02
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183799586619D+13   R2 =   0.7058137176665D+02
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183940735102D+13   R2 =   0.2640887401129D-05
     ISTATE -5 - shortening step at time   69085.258659472922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718101821617D+13   R2 =   0.6783388285184D+02
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184002598724D+13   R2 =   0.6787671470657D+02
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718105390132D+13   R2 =   0.2731774809333D+02
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718108777453D+13   R2 =   0.3097208297997D+02
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184007758563D+13   R2 =   0.4433298812611D-06
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718115570564D+13   R2 =   0.1951545786414D-05
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184031242369D+13   R2 =   0.4744683801215D-03
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718207674002D+13   R2 =   0.6077136488698D+02
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184257575852D+13   R2 =   0.3554187197400D+03
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718211350636D+13   R2 =   0.4725608607339D-05
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184284055692D+13   R2 =   0.2738921632390D-04
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184296656703D+13   R2 =   0.4786890453954D-05
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718218278553D+13   R2 =   0.1161814534110D-05
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1718278098525D+13   R2 =   0.3388690307719D-04
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2200158092207D+13   R2 =   0.1721976340277D-04
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2200166975174D+13   R2 =   0.2605794859368D+03
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2200515584187D+13   R2 =   0.3485553043242D-05
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1727556920307D+13   R2 =   0.6672153828413D+02
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1727561209323D+13   R2 =   0.1318965081803D-05
     ISTATE -5 - shortening step at time   52829.565383703288      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2200542395218D+13   R2 =   0.1823998603472D-03
     ISTATE -5 - shortening step at time   69112.048579185663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1727574592165D+13   R2 =   0.9108293202982D-07
     ISTATE -5 - shortening step at time   54669.658522875776      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1727975887496D+13   R2 =   0.3172101416875D+03
     ISTATE -5 - shortening step at time   54669.658522875776      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2230908407364D+13   R2 =   0.2000982579750D+03
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1727979452287D+13   R2 =   0.3219158949294D+02
     ISTATE -5 - shortening step at time   54669.658522875776      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2230915620410D+13   R2 =   0.5837855347202D-06
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2230946403448D+13   R2 =   0.4379508423541D+03
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1727985199565D+13   R2 =   0.7868433207147D-06
     ISTATE -5 - shortening step at time   54669.658522875776      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1728135511037D+13   R2 =   0.7288127085511D+02
     ISTATE -5 - shortening step at time   54669.658522875776      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2231014971330D+13   R2 =   0.4179361169658D-05
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1728140787541D+13   R2 =   0.6222960973832D-06
     ISTATE -5 - shortening step at time   54669.658522875776      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2237586327401D+13   R2 =   0.1226126607047D-04
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239653543273D+13   R2 =   0.1502666028996D-05
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239672523400D+13   R2 =   0.4056191442436D+03
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239679878814D+13   R2 =   0.4745322555344D-05
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239686437364D+13   R2 =   0.4059041352907D-05
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033504888970D+10
     ISTATE -1: Reducing time step to    2.5113239497632129      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239717054266D+13   R2 =   0.1155436409423D+03
     ISTATE -5 - shortening step at time   69637.417570201185      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239736165078D+13   R2 =   0.2322057957537D-06
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239880681330D+13   R2 =   0.1098842678606D-04
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239892442795D+13   R2 =   0.7530335848656D-05
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2240154950079D+13   R2 =   0.1316835018364D+03
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2240262570980D+13   R2 =   0.1173633266665D-05
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241118503571D+13   R2 =   0.1032089965787D+03
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1883468787497D+13   R2 =   0.4094385884262D-05
     ISTATE -5 - shortening step at time   54669.658522875776      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241126598328D+13   R2 =   0.9251555040851D-06
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241378983546D+13   R2 =   0.4276129171862D+02
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241396030974D+13   R2 =   0.3841213971620D+03
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241404523572D+13   R2 =   0.1558392797738D-05
     ISTATE -5 - shortening step at time   70877.121970446053      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241603294867D+13   R2 =   0.4108666890591D+02
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900332889407D+13   R2 =   0.8233204933593D-07
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241608227583D+13   R2 =   0.6617337697007D-06
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900437142054D+13   R2 =   0.1143596595658D+03
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2241836964966D+13   R2 =   0.5048146468140D+02
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900784909076D+13   R2 =   0.1424238963440D-05
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2243925762865D+13   R2 =   0.1259247524195D+03
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900794064088D+13   R2 =   0.4331971825050D-04
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2254213150713D+13   R2 =   0.1648370924328D+03
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900797647161D+13   R2 =   0.1115463334306D-05
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900803378083D+13   R2 =   0.1871360447373D+02
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2254233933426D+13   R2 =   0.1221060066564D-03
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900820176549D+13   R2 =   0.1651369941108D-05
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2254295118820D+13   R2 =   0.2514131601317D-05
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900826272651D+13   R2 =   0.1564185015706D+02
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1900988372626D+13   R2 =   0.5199618073399D+02
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2260627220120D+13   R2 =   0.7846753746108D+02
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1906948398970D+13   R2 =   0.1227262303686D-04
     ISTATE -5 - shortening step at time   60136.625678589582      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2260633846114D+13   R2 =   0.6337967053309D-05
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2262332340953D+13   R2 =   0.7737473262502D+02
     ISTATE -5 - shortening step at time   70930.522897842457      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2301610005537D+13   R2 =   0.1379995938542D+03
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033514188020D+10
     ISTATE -1: Reducing time step to    2.5112945223897785      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315598623870D+13   R2 =   0.6565421278766D-05
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315617606130D+13   R2 =   0.1046257812534D+03
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315690583067D+13   R2 =   0.5735729929600D+02
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315694774951D+13   R2 =   0.7240867650740D-06
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2318515328627D+13   R2 =   0.7419197791058D+02
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2318522006774D+13   R2 =   0.6504965342178D-06
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2318565425161D+13   R2 =   0.8374302252432D+02
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2318855105544D+13   R2 =   0.5594043816134D+02
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2067607084164D+13   R2 =   0.2473497126135D-05
     ISTATE -5 - shortening step at time   60346.468321830762      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2067610013290D+13   R2 =   0.5080527143367D-05
     ISTATE -5 - shortening step at time   60346.468321830762      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2067612474749D+13   R2 =   0.1498533144577D+02
     ISTATE -5 - shortening step at time   60346.468321830762      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2323118487614D+13   R2 =   0.1278904298873D+03
     ISTATE -5 - shortening step at time   71592.795599784702      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2067618326694D+13   R2 =   0.2684083044451D-05
     ISTATE -5 - shortening step at time   60346.468321830762      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2067649366636D+13   R2 =   0.2964756067409D-05
     ISTATE -5 - shortening step at time   60346.468321830762      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2346867142903D+13   R2 =   0.8423260010345D-06
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2348203277067D+13   R2 =   0.3544532761197D+03
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2348238970578D+13   R2 =   0.1303810580216D+03
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2348714531595D+13   R2 =   0.1195317659894D+03
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2350032919873D+13   R2 =   0.4966792009625D-04
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2355283897086D+13   R2 =   0.1308555130191D+03
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2355296480314D+13   R2 =   0.1352680056587D-04
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2355317805868D+13   R2 =   0.6792225222387D-04
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2355327148103D+13   R2 =   0.2424549224677D-05
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2356845552991D+13   R2 =   0.3236891383350D+03
     ISTATE -5 - shortening step at time   73516.407835894686      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2374668221449D+13   R2 =   0.7742022749008D+02
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2376022970273D+13   R2 =   0.3309312009411D-05
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2376102893362D+13   R2 =   0.1194042830668D+03
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033515997611D+10
     ISTATE -1: Reducing time step to    2.5422462427701999      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2376112539552D+13   R2 =   0.2156390753342D-05
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2376141041178D+13   R2 =   0.5834847521781D+03
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2384714241159D+13   R2 =   0.7746531199768D+02
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2384719417986D+13   R2 =   0.9872399222870D-06
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2384723450848D+13   R2 =   0.2352995949527D-05
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2384733741274D+13   R2 =   0.5937068643891D-05
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2384787511576D+13   R2 =   0.4848808800446D+02
     ISTATE -5 - shortening step at time   74583.720031354649      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2430865503048D+13   R2 =   0.4194732158465D-04
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2430870328541D+13   R2 =   0.9778869762869D-06
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2442746108092D+13   R2 =   0.4838327642539D+02
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2442759221747D+13   R2 =   0.6286437705381D+02
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2442925027123D+13   R2 =   0.1282143323107D+03
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2505615839945D+13
     ISTATE -1: Reducing time step to    372.31164999664338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2512724145602D+13   R2 =   0.1087594370772D+03
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2512728119653D+13   R2 =   0.3739648890343D+02
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2512736222662D+13   R2 =   0.1438570166331D-04
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2516659433563D+13   R2 =   0.4055356959893D+03
     ISTATE -5 - shortening step at time   75467.959227077910      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033517835030D+10
     ISTATE -1: Reducing time step to    2.5422404281512812      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2516774692213D+13   R2 =   0.4638118817390D-06
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2517247163910D+13   R2 =   0.1045084999080D-04
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2517292660350D+13   R2 =   0.1491966211998D-04
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2532508715013D+13   R2 =   0.1390344722694D-04
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2532712212813D+13   R2 =   0.6448904861303D-05
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2532732510285D+13   R2 =   0.1079362382479D+03
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2532772940238D+13   R2 =   0.1007500845908D+03
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2532790823577D+13   R2 =   0.1797030097996D-05
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2532805475707D+13   R2 =   0.1254614669717D-05
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2536462204666D+13   R2 =   0.3043549975765D+03
     ISTATE -5 - shortening step at time   79641.121315275072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2536480196202D+13   R2 =   0.9632154153206D+01
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2536731731451D+13   R2 =   0.2562607381750D+03
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2536747593261D+13   R2 =   0.2112172364151D-04
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2536769305294D+13   R2 =   0.5406932256588D+02
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2537182386729D+13   R2 =   0.1068598827213D-04
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2537189018878D+13   R2 =   0.4389012500123D-06
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2537193701402D+13   R2 =   0.2727744019408D-06
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2537211804551D+13   R2 =   0.4109952569723D-05
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2537221112042D+13   R2 =   0.3162029037224D+03
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2537232354374D+13   R2 =   0.8486189364284D-05
     ISTATE -5 - shortening step at time   80267.791286884996      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2543400928870D+13   R2 =   0.3186995394935D-05
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033519713791D+10
     ISTATE -1: Reducing time step to    2.5422344827059931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2556305676750D+13   R2 =   0.3663659816503D+03
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2556384432427D+13   R2 =   0.7306047633347D+02
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2557307209393D+13   R2 =   0.6219608839135D+02
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2586142179478D+13   R2 =   0.9149502051392D-04
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2586176609109D+13   R2 =   0.4667338185689D+02
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2586214375647D+13   R2 =   0.3562173839505D+02
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2586237742540D+13   R2 =   0.6102658265221D+02
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2586322540644D+13   R2 =   0.6309059725869D-05
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2586328560129D+13   R2 =   0.4282077959077D-05
     ISTATE -5 - shortening step at time   80292.163113105809      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2595133162490D+13   R2 =   0.1546711415020D-05
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2599657890286D+13   R2 =   0.1604299628856D+03
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2605702799702D+13   R2 =   0.8199313898886D+02
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2605726143512D+13   R2 =   0.5275761003327D+02
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610014015167D+13   R2 =   0.7282862329058D+02
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610315513971D+13   R2 =   0.1225185470371D+03
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610366275023D+13   R2 =   0.5555384512161D+02
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610370579181D+13   R2 =   0.6293967310667D-06
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610416282122D+13   R2 =   0.5042145462139D+02
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610430720186D+13   R2 =   0.9522073107459D+02
     ISTATE -5 - shortening step at time   81845.840510406240      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033521610130D+10
     ISTATE -1: Reducing time step to    2.5422284816331557      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2635726011712D+13   R2 =   0.3713468941647D-05
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2635746581971D+13   R2 =   0.2064948550774D-04
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2635775060490D+13   R2 =   0.6047035933560D+02
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2665548999899D+13   R2 =   0.2366472594609D+03
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2665565021365D+13   R2 =   0.1394976711130D-03
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2669483094172D+13   R2 =   0.1372573066254D+03
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2669493142469D+13   R2 =   0.7717318879892D+02
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2669504637646D+13   R2 =   0.2504156645504D-04
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2683510862826D+13   R2 =   0.2289938201324D+03
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2686933439751D+13   R2 =   0.6087090222875D+02
     ISTATE -5 - shortening step at time   82608.567094502650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2729385108406D+13   R2 =   0.5834139245381D+02
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2729478342548D+13   R2 =   0.9584677100307D+02
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2730544314421D+13   R2 =   0.1572106169569D+02
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2733179491222D+13   R2 =   0.1565060056874D+03
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2733226231936D+13   R2 =   0.1725227318130D-04
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2733243566016D+13   R2 =   0.7315509596649D-05
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2737248183041D+13   R2 =   0.4655643281023D+03
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2737258019410D+13   R2 =   0.2847735465612D+03
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2737263168279D+13   R2 =   0.3927204737288D-06
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2742142618417D+13   R2 =   0.4684424268662D+02
     ISTATE -5 - shortening step at time   85029.539232630152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2742334598309D+13   R2 =   0.6298895893391D+02
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033523446862D+10
     ISTATE -1: Reducing time step to    2.5422226691899068      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2742995009971D+13   R2 =   0.2686472269009D+03
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744151568204D+13   R2 =   0.6227211718536D+02
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744158302059D+13   R2 =   0.3548629203703D-05
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744161448640D+13   R2 =   0.1293455973003D-05
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744218499636D+13   R2 =   0.1192418373604D+03
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744231542220D+13   R2 =   0.3535514616759D-04
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744240861574D+13   R2 =   0.1171639083258D-05
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744246722549D+13   R2 =   0.6437013020339D+02
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744253978020D+13   R2 =   0.1831257111541D+02
     ISTATE -5 - shortening step at time   86776.665139777135      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744783986618D+13   R2 =   0.6765240814557D+02
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744832548481D+13   R2 =   0.1039876822546D+03
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2744977966085D+13   R2 =   0.9019125676490D-04
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746249209711D+13   R2 =   0.9807473608740D+02
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2753583017281D+13   R2 =   0.6479340058561D+02
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2753590002129D+13   R2 =   0.3630578093646D-05
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2753607120927D+13   R2 =   0.2488121372793D+02
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2753615674090D+13   R2 =   0.1266859633000D-04
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2754012360351D+13   R2 =   0.9902772636927D-05
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2754025282114D+13   R2 =   0.1123757854092D-04
     ISTATE -5 - shortening step at time   86843.480317103196      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2770591636354D+13   R2 =   0.1750895380366D+03
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2771276185582D+13   R2 =   0.6113871478503D+02
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2771279547891D+13   R2 =   0.2412506407099D+02
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033525511701D+10
     ISTATE -1: Reducing time step to    2.5422161348895180      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2771829755243D+13   R2 =   0.6105548660481D+02
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2771842580682D+13   R2 =   0.1723367124541D-05
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2771852787496D+13   R2 =   0.4520420054593D-05
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2772427044491D+13   R2 =   0.6134705305496D+02
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2772458682055D+13   R2 =   0.1276858171773D+03
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776063614341D+13   R2 =   0.6042281973728D-05
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2788090236883D+13   R2 =   0.1465802169855D-05
     ISTATE -5 - shortening step at time   87152.698801069666      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2788749211725D+13   R2 =   0.9705706993821D-06
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2788751489761D+13   R2 =   0.5445622899387D-06
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2788753767750D+13   R2 =   0.5445620674406D-06
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2788757784339D+13   R2 =   0.1280204226216D-05
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2788769828407D+13   R2 =   0.2483365809273D+02
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2789053978179D+13   R2 =   0.7881975162088D+02
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2789076108497D+13   R2 =   0.5889567409782D+02
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2789145463188D+13   R2 =   0.6134306493631D+02
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2801265770595D+13   R2 =   0.5665181770195D+02
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2801307738830D+13   R2 =   0.1341085379906D+03
     ISTATE -5 - shortening step at time   88230.703698816375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2807356972584D+13   R2 =   0.9572355271427D+02
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2807410199381D+13   R2 =   0.1146493540371D+03
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033527456514D+10
     ISTATE -1: Reducing time step to    2.5422099804166889      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810491471315D+13   R2 =   0.9434575188326D+02
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810582544297D+13   R2 =   0.7939939958730D+02
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810799821380D+13   R2 =   0.9990846775241D+02
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810845959072D+13   R2 =   0.9457145843674D+02
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810888087681D+13   R2 =   0.6912970788079D-06
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810892944276D+13   R2 =   0.9952443342805D-05
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810910921820D+13   R2 =   0.1549326811740D-04
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810917835849D+13   R2 =   0.1354255428728D-05
     ISTATE -5 - shortening step at time   88648.979076897973      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2810975770407D+13   R2 =   0.3224371591482D-05
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2811095244732D+13   R2 =   0.1730399798786D+03
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2811112217608D+13   R2 =   0.2819100230354D-05
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2812351817667D+13   R2 =   0.2357015579293D+03
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2812421781152D+13   R2 =   0.5714804373445D+02
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2812956200027D+13   R2 =   0.3827256202241D-04
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2812965614380D+13   R2 =   0.7863585550579D-05
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2812979156021D+13   R2 =   0.2390400026370D+02
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2813020552065D+13   R2 =   0.7984247446185D+02
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2815360002419D+13   R2 =   0.1649001582481D-04
     ISTATE -5 - shortening step at time   88953.096071167412      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2815389118394D+13   R2 =   0.2169064760563D+02
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2815459613821D+13   R2 =   0.1019502768357D+03
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2815656541962D+13   R2 =   0.5621046756970D+02
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816029108922D+13   R2 =   0.7130040710728D+02
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816032598939D+13   R2 =   0.1940287183355D-05
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816036785148D+13   R2 =   0.1072576507187D-04
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816041063848D+13   R2 =   0.5342241937993D-06
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816111482971D+13   R2 =   0.5771986392433D+02
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816139786696D+13   R2 =   0.3674988952592D+02
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816149071038D+13   R2 =   0.1365782910726D-04
     ISTATE -5 - shortening step at time   89093.670962633638      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816215668904D+13   R2 =   0.2631794908091D+02
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033529433145D+10
     ISTATE -1: Reducing time step to    2.5422037252564937      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2817165141626D+13   R2 =   0.6377628260832D-05
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2817174726700D+13   R2 =   0.2790192406525D+03
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2817181016495D+13   R2 =   0.4026567933797D-05
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2817203340943D+13   R2 =   0.8270439305367D-05
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2840837063283D+13   R2 =   0.6821151329569D+02
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2840847788945D+13   R2 =   0.1195861969012D-03
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2840868551471D+13   R2 =   0.9444356054960D+02
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2884817057957D+13   R2 =   0.2446978887190D-04
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2884900693667D+13   R2 =   0.1573818553352D-05
     ISTATE -5 - shortening step at time   89118.641488532856      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033531437763D+10
     ISTATE -1: Reducing time step to    2.5421973815298240      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2884915616396D+13   R2 =   0.3109318007614D-06
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885052383537D+13   R2 =   0.9216564083583D+02
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885208252085D+13   R2 =   0.1633593742911D+03
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885223480259D+13   R2 =   0.1421192495604D-04
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885238736814D+13   R2 =   0.6284514241644D-05
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885373473535D+13   R2 =   0.2131359869636D-04
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885378109186D+13   R2 =   0.5453676168740D-06
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885387044784D+13   R2 =   0.2357754820833D+02
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885490865211D+13   R2 =   0.1074589830641D+03
     ISTATE -5 - shortening step at time   91294.325748967836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2885496966107D+13   R2 =   0.3582074622855D+02
     ISTATE -5 - shortening step at time   91294.325748967836      years
    [Parallel(n_jobs=4)]: Done   7 out of   9 | elapsed:  5.3min remaining:  1.5min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033533429442D+10
     ISTATE -1: Reducing time step to    2.5421910787479525      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033535374879D+10
     ISTATE -1: Reducing time step to    2.5422519019372269      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307423403610D+13   R2 =   0.9738477502620D-08
     ISTATE -5 - shortening step at time   73019.229834713493      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2309851564990D+13   R2 =   0.7513576327769D+02
     ISTATE -5 - shortening step at time   73019.229834713493      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2309860425882D+13   R2 =   0.4421484704676D-06
     ISTATE -5 - shortening step at time   73019.229834713493      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2309863200999D+13   R2 =   0.1600129191459D+02
     ISTATE -5 - shortening step at time   73019.229834713493      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033537368623D+10
     ISTATE -1: Reducing time step to    2.5422455926201506      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033539385839D+10
     ISTATE -1: Reducing time step to    2.5422392090251806      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033541398961D+10
     ISTATE -1: Reducing time step to    2.5422328383850550      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033543303210D+10
     ISTATE -1: Reducing time step to    2.5422268122818945      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033545363778D+10
     ISTATE -1: Reducing time step to    2.5422202914969363      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033547410559D+10
     ISTATE -1: Reducing time step to    2.5422138143419151      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033549490291D+10
     ISTATE -1: Reducing time step to    2.5422072329102376      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033551464336D+10
     ISTATE -1: Reducing time step to    2.5422009859321428      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033553557589D+10
     ISTATE -1: Reducing time step to    2.5421943617155116      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033555608516D+10
     ISTATE -1: Reducing time step to    2.5422579377771339      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033557720994D+10
     ISTATE -1: Reducing time step to    2.5422512527188541      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033559705858D+10
     ISTATE -1: Reducing time step to    2.5422449715046622      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2495809288890D+13
     ISTATE -1: Reducing time step to    133.98479686160115      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033561748017D+10
     ISTATE -1: Reducing time step to    2.5422385089747253      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033563711087D+10
     ISTATE -1: Reducing time step to    2.5422322967292801      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033565782864D+10
     ISTATE -1: Reducing time step to    2.5422257404732505      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2593673487915D+13   R2 =   0.1079817161450D+03
     ISTATE -5 - shortening step at time   80321.154559098941      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2593678323760D+13   R2 =   0.2357069240593D+02
     ISTATE -5 - shortening step at time   80321.154559098941      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2593693168178D+13   R2 =   0.3967241099216D-04
     ISTATE -5 - shortening step at time   80321.154559098941      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2593703522868D+13   R2 =   0.3678829086193D+02
     ISTATE -5 - shortening step at time   80321.154559098941      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033567830433D+10
     ISTATE -1: Reducing time step to    2.5422192608220802      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033569862479D+10
     ISTATE -1: Reducing time step to    2.5422128302991167      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8033572060127D+10
     ISTATE -1: Reducing time step to    2.5422058757146351      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6183175568839D+11   R2 =   0.3454153665491D-07
     ISTATE -5 - shortening step at time   1881.3395989338633      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6185683815732D+11   R2 =   0.4947852223126D-05
     ISTATE -5 - shortening step at time   1881.3395989338633      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6189450257679D+11   R2 =   0.1376214426944D-03
     ISTATE -5 - shortening step at time   1881.3395989338633      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6736204942339D+11   R2 =   0.7042530826029D-07
     ISTATE -5 - shortening step at time   2069.4736036818808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6739971596857D+11   R2 =   0.3880477892679D-05
     ISTATE -5 - shortening step at time   2069.4736036818808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6746772752419D+11   R2 =   0.5733992543072D+03
     ISTATE -5 - shortening step at time   2069.4736036818808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6754626052451D+11   R2 =   0.9439462034639D-04
     ISTATE -5 - shortening step at time   2069.4736036818808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6832769717999D+11   R2 =   0.4841617826342D-03
     ISTATE -5 - shortening step at time   2069.4736036818808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7978758484168D+11   R2 =   0.2430725287429D+03
     ISTATE -5 - shortening step at time   2504.0631690032874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9043760877431D+11   R2 =   0.1269660626417D+03
     ISTATE -5 - shortening step at time   2754.4695456051345      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9130627420349D+11   R2 =   0.7134344108280D+02
     ISTATE -5 - shortening step at time   2754.4695456051345      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1331637738966D+12   R2 =   0.3501311952463D+03
     ISTATE -5 - shortening step at time   4032.8192113564678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1336659015046D+12   R2 =   0.4151476092092D+03
     ISTATE -5 - shortening step at time   4032.8192113564678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1344016372946D+12   R2 =   0.1750955406567D-04
     ISTATE -5 - shortening step at time   4032.8192113564678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1344878978873D+12   R2 =   0.5715130716292D-04
     ISTATE -5 - shortening step at time   4032.8192113564678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1488430588329D+12   R2 =   0.1058087486290D+04
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492034614447D+12   R2 =   0.1372544289589D+03
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492478990173D+12   R2 =   0.2066873894061D-03
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1514199542485D+12   R2 =   0.4818961694980D+04
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1532641504463D+12   R2 =   0.1917402035230D-04
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1533503537540D+12   R2 =   0.2571408833387D+03
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1535634166319D+12   R2 =   0.3762280129354D+03
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1536874032095D+12   R2 =   0.4099719619241D+03
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1537404215356D+12   R2 =   0.1317013195236D+03
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1538989741370D+12   R2 =   0.5322836415126D-04
     ISTATE -5 - shortening step at time   4436.1012286420173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1545286723519D+12   R2 =   0.2296281080895D-06
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1548982030740D+12   R2 =   0.3995879013574D+03
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1549781229476D+12   R2 =   0.2925852819618D+03
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1582085768746D+12   R2 =   0.8199323724119D+03
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1582896454519D+12   R2 =   0.1447154933023D-03
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1584245877900D+12   R2 =   0.1773626028196D+03
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1587209216019D+12   R2 =   0.3490669972107D+03
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1587726418630D+12   R2 =   0.4103548018826D-05
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1588083655940D+12   R2 =   0.2207539232644D-04
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1589175354655D+12   R2 =   0.3565478366742D-04
     ISTATE -5 - shortening step at time   4870.2207005365199      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1593320244504D+12   R2 =   0.8420222642839D-07
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1594110541125D+12   R2 =   0.2221483595026D+03
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1596758359545D+12   R2 =   0.3393997099788D+03
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1597715276143D+12   R2 =   0.1115593120486D+04
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1598310809275D+12   R2 =   0.2762693835249D-03
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1600107956851D+12   R2 =   0.1979794098746D-04
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1624290576478D+12   R2 =   0.2689370451581D+03
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1624601548113D+12   R2 =   0.1325512935054D+03
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1627139555812D+12   R2 =   0.2014159054554D+03
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1645680628867D+12   R2 =   0.3367140789214D+03
     ISTATE -5 - shortening step at time   5029.0359324532674      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1672589883977D+12   R2 =   0.9010666698135D+03
     ISTATE -5 - shortening step at time   5207.8500913502176      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690211389881D+12   R2 =   0.1707100387191D-04
     ISTATE -5 - shortening step at time   5207.8500913502176      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1693617855837D+12   R2 =   0.1098933185672D-04
     ISTATE -5 - shortening step at time   5207.8500913502176      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1694379834062D+12   R2 =   0.7395847438282D-05
     ISTATE -5 - shortening step at time   5207.8500913502176      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1812989439186D+12   R2 =   0.4402261285004D-06
     ISTATE -5 - shortening step at time   5728.6352246500610      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1814382361842D+12   R2 =   0.4014364875215D+02
     ISTATE -5 - shortening step at time   5728.6352246500610      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1815430976768D+12   R2 =   0.1566847308245D-04
     ISTATE -5 - shortening step at time   5728.6352246500610      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1816565798264D+12   R2 =   0.3478050147131D-04
     ISTATE -5 - shortening step at time   5728.6352246500610      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1817010047349D+12   R2 =   0.2463910946871D+03
     ISTATE -5 - shortening step at time   5728.6352246500610      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1824589686867D+12   R2 =   0.5577993539560D+03
     ISTATE -5 - shortening step at time   5728.6352246500610      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1993293192286D+12   R2 =   0.1278496883300D-03
     ISTATE -5 - shortening step at time   6301.4988836963739      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2192304584018D+12   R2 =   0.2360695262901D+02
     ISTATE -5 - shortening step at time   6931.6489223054523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2196085261919D+12   R2 =   0.9574690797012D+02
     ISTATE -5 - shortening step at time   6931.6489223054523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2196768784621D+12   R2 =   0.3476198901165D-03
     ISTATE -5 - shortening step at time   6931.6489223054523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2197156682481D+12   R2 =   0.4783080120123D-04
     ISTATE -5 - shortening step at time   6931.6489223054523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2200381093974D+12   R2 =   0.2098673111619D+03
     ISTATE -5 - shortening step at time   6931.6489223054523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3525630587448D+12   R2 =   0.8701288320509D+03
     ISTATE -5 - shortening step at time   10148.628067009724      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3752194236437D+12   R2 =   0.4808892188893D-05
     ISTATE -5 - shortening step at time   11163.491115672845      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4240806424760D+12   R2 =   0.1837552083985D+03
     ISTATE -5 - shortening step at time   12279.840493398498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4241275522117D+12   R2 =   0.7414305278265D-05
     ISTATE -5 - shortening step at time   12279.840493398498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4241532986318D+12   R2 =   0.2099090727955D+02
     ISTATE -5 - shortening step at time   12279.840493398498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4261223802932D+12   R2 =   0.7346698725518D+02
     ISTATE -5 - shortening step at time   12279.840493398498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4279263151232D+12   R2 =   0.9442658171484D+02
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4287453853099D+12   R2 =   0.4370746112227D+03
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4287670974049D+12   R2 =   0.5988961505964D+02
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4293748579237D+12   R2 =   0.1167422274361D-04
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4293880721191D+12   R2 =   0.8816534127456D-05
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4297708923748D+12   R2 =   0.1525638010275D+03
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4298075496719D+12   R2 =   0.1251439944423D+03
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4311030572151D+12   R2 =   0.2338527416079D+03
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4311117065890D+12   R2 =   0.5357809566415D+02
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4311418351006D+12   R2 =   0.6183796408372D+02
     ISTATE -5 - shortening step at time   13507.824835512560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4312172710090D+12   R2 =   0.2046084652027D-06
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4315881446330D+12   R2 =   0.1808071340973D+03
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4342759760718D+12   R2 =   0.2489121374472D+03
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4351394212719D+12   R2 =   0.9641310720078D+02
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4432496597125D+12   R2 =   0.3739683339388D-05
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4433310580111D+12   R2 =   0.1231213528320D+03
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4433784768876D+12   R2 =   0.1166115573423D-05
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4434251199126D+12   R2 =   0.6975664880635D+02
     ISTATE -5 - shortening step at time   13643.728958878559      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4743479887600D+12   R2 =   0.4415033589631D-06
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4765960920367D+12   R2 =   0.2082352155044D+03
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4778667820303D+12   R2 =   0.2435795513405D+03
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4783203485655D+12   R2 =   0.6736230042108D-05
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4783468486196D+12   R2 =   0.1939886187587D-05
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4973584271515D+12   R2 =   0.2133808965950D+03
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4977291546945D+12   R2 =   0.7420673887573D-05
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4977524790045D+12   R2 =   0.4060434388287D-05
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4978084276993D+12   R2 =   0.8506073842069D-05
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5026828282533D+12   R2 =   0.1379450391426D+04
     ISTATE -5 - shortening step at time   15008.102180058262      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5530271587802D+12   R2 =   0.2680088606495D+02
     ISTATE -5 - shortening step at time   17498.453261505281      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6083088929542D+12   R2 =   0.2588106184197D-05
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6387500910941D+12   R2 =   0.2593919612183D+03
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6387679770131D+12   R2 =   0.6257905692908D-05
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6387797456757D+12   R2 =   0.3596720847460D+02
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6388251624419D+12   R2 =   0.8621167024796D-05
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6388317259371D+12   R2 =   0.8488323717956D-06
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6388488203616D+12   R2 =   0.7928178475930D+02
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6389165719099D+12   R2 =   0.6258061290003D+02
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6389516812687D+12   R2 =   0.8419256874310D+02
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6389976084865D+12   R2 =   0.6270670198005D+02
     ISTATE -5 - shortening step at time   19248.299004851444      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7732309584966D+12   R2 =   0.1151286745030D-05
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7732508664116D+12   R2 =   0.2401688230085D+02
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7736888445655D+12   R2 =   0.1103186424133D+03
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7737039397611D+12   R2 =   0.2969564058212D+02
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7737364446852D+12   R2 =   0.8860241339542D-06
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7738072920890D+12   R2 =   0.1372336082101D-04
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7738197393446D+12   R2 =   0.2604680723881D-05
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7738356280861D+12   R2 =   0.2332823517719D-04
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7738457886690D+12   R2 =   0.1406363768967D-05
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7738555868659D+12   R2 =   0.5958843903954D-06
     ISTATE -5 - shortening step at time   24467.947461565342      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7741267489904D+12   R2 =   0.2053885860654D-05
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7745328904361D+12   R2 =   0.5417745167068D+03
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8395052796430D+12
     ISTATE -1: Reducing time step to    37.138875109349144      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8395810216655D+12   R2 =   0.7200231767277D+02
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8398808847860D+12   R2 =   0.4771881220594D-05
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8405411930619D+12   R2 =   0.5054202566459D-05
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8405626928778D+12   R2 =   0.1037729518451D+03
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8406252633059D+12   R2 =   0.4926288558966D+03
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8406336533347D+12   R2 =   0.3955295139131D-05
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8406409648008D+12   R2 =   0.4818871707231D+02
     ISTATE -5 - shortening step at time   24489.100850187817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8406938729940D+12   R2 =   0.6107185356490D-07
     ISTATE -5 - shortening step at time   26602.562177241591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9213266873192D+12   R2 =   0.2662872576246D+03
     ISTATE -5 - shortening step at time   26602.562177241591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9213629051286D+12   R2 =   0.1868005655088D-04
     ISTATE -5 - shortening step at time   26602.562177241591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9213721608774D+12   R2 =   0.7357453586088D+02
     ISTATE -5 - shortening step at time   26602.562177241591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007465585163D+13   R2 =   0.9454838288940D-05
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007473863712D+13   R2 =   0.3818563892173D-05
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007510527472D+13   R2 =   0.5477953750331D-05
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007637207083D+13   R2 =   0.1144319588471D+03
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007664148768D+13   R2 =   0.2156617178253D-04
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007668485912D+13   R2 =   0.1533133379429D-05
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007871965401D+13   R2 =   0.2266088475706D+03
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007880748923D+13   R2 =   0.3842789199821D-04
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007909600798D+13   R2 =   0.4779364154859D+02
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007950871572D+13   R2 =   0.8453682698335D+02
     ISTATE -5 - shortening step at time   29262.819029220256      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1021082613490D+13   R2 =   0.2822868635444D-04
     ISTATE -5 - shortening step at time   31897.179480112474      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1021171609303D+13   R2 =   0.6943007680973D+02
     ISTATE -5 - shortening step at time   31897.179480112474      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2709488415884D+13
     ISTATE -1: Reducing time step to    260.99676687791970      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1054608727956D+13   R2 =   0.5245713358058D-05
     ISTATE -5 - shortening step at time   31897.179480112474      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1057092667457D+13   R2 =   0.1542413259517D+02
     ISTATE -5 - shortening step at time   31897.179480112474      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1145705356107D+13   R2 =   0.9845814433051D-05
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1155068617188D+13   R2 =   0.1250036052815D+04
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1155299190637D+13   R2 =   0.1477249363548D+03
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1156318545985D+13   R2 =   0.3335201232411D+03
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1156510830809D+13   R2 =   0.8314783883684D-05
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1158014425698D+13   R2 =   0.8380641840093D-06
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1159277864152D+13   R2 =   0.7273302084701D+02
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164180298323D+13   R2 =   0.1978882466157D+03
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164250009114D+13   R2 =   0.5516595593122D-05
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164261227837D+13   R2 =   0.9384470758379D+01
     ISTATE -5 - shortening step at time   35086.898188611733      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164295806209D+13   R2 =   0.2572741880369D+02
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164299436258D+13   R2 =   0.6117547545592D-06
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164428217289D+13   R2 =   0.1635313236209D+03
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164473475059D+13   R2 =   0.2738287787503D-05
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164489050384D+13   R2 =   0.1656146861261D-04
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164583434546D+13   R2 =   0.1018179709089D+03
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164648269875D+13   R2 =   0.6705481342767D+02
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164659396740D+13   R2 =   0.1485745813370D+02
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1164669939686D+13   R2 =   0.2703621364684D+02
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1165255189063D+13   R2 =   0.9021223265916D-05
     ISTATE -5 - shortening step at time   36843.709741669489      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1270899405740D+13   R2 =   0.8286051524853D+03
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1270919476077D+13   R2 =   0.3734423330158D-05
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1272693139696D+13   R2 =   0.9753354364215D-05
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1272739560817D+13   R2 =   0.4748637798182D+02
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1274489179471D+13   R2 =   0.3857704899666D+03
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1275185255774D+13   R2 =   0.1124136402110D+03
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1275328165300D+13   R2 =   0.9535521909329D+02
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1276100945987D+13   R2 =   0.1443355808388D+03
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1278173297776D+13   R2 =   0.5850340532766D-05
     ISTATE -5 - shortening step at time   36875.164210861498      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2791977079891D+13   R2 =   0.4014081721642D-06
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2791984886856D+13   R2 =   0.1182194946233D+02
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1349330264143D+13   R2 =   0.5931968283825D-05
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1349340375445D+13   R2 =   0.7378415102449D-06
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1349363578039D+13   R2 =   0.2694135737652D+02
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2808846310922D+13
     ISTATE -1: Reducing time step to    830.10598683351213      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356520916585D+13   R2 =   0.2923252676662D-05
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808853931073D+13   R2 =   0.5349071872734D-06
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356549532482D+13   R2 =   0.5428767797257D+02
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808855392273D+13   R2 =   0.9783482600246D-07
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808858285581D+13   R2 =   0.1379300707291D+02
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356636792152D+13   R2 =   0.3138645728163D-05
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356672722301D+13   R2 =   0.5278703508457D+02
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356675704385D+13   R2 =   0.1755798978553D+02
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808860043244D+13   R2 =   0.6420804797585D-06
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356694722902D+13   R2 =   0.5833010826729D+02
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808864416843D+13   R2 =   0.5380996028790D+01
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356713684620D+13   R2 =   0.2424806534779D-05
     ISTATE -5 - shortening step at time   40562.681511120070      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808867288795D+13   R2 =   0.4098257683102D-06
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808873118288D+13   R2 =   0.1763672154543D+02
     ISTATE -5 - shortening step at time   88353.271930014394      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1495546387012D+13   R2 =   0.2996996773029D-05
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1495984169912D+13   R2 =   0.2195081790362D-04
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1500994542220D+13   R2 =   0.1296477558801D+03
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1500997134821D+13   R2 =   0.1340947951702D+02
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501010718371D+13   R2 =   0.7659545905553D-06
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501026887873D+13   R2 =   0.4471533323659D-04
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501029957720D+13   R2 =   0.1684668471898D-05
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501310615746D+13   R2 =   0.1660936036124D-06
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501316293094D+13   R2 =   0.1290617805300D-05
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501320720427D+13   R2 =   0.1554701911211D+02
     ISTATE -5 - shortening step at time   47227.376121148918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501339228555D+13   R2 =   0.9335168867906D-07
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501829532773D+13   R2 =   0.1866897931973D+03
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1502440926581D+13   R2 =   0.1299869741797D-05
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1502775477777D+13   R2 =   0.1382456550919D+03
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1502973492362D+13   R2 =   0.1942370230149D-05
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1502975986825D+13   R2 =   0.2078739066782D+02
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503034769186D+13   R2 =   0.5060217199934D+02
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503077964413D+13   R2 =   0.7986285870232D-02
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503105078580D+13   R2 =   0.5380265204372D+02
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503109315737D+13   R2 =   0.1304417977837D-05
     ISTATE -5 - shortening step at time   47510.149380599811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503127283516D+13   R2 =   0.4166735234128D-06
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505038721083D+13   R2 =   0.2998209908200D-06
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505048915914D+13   R2 =   0.7241723801744D-05
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505152110011D+13   R2 =   0.3068749624718D+02
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505157008805D+13   R2 =   0.8186370872019D-03
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505163655388D+13   R2 =   0.2457142938090D-05
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505169368006D+13   R2 =   0.2991084880176D+02
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505195370397D+13   R2 =   0.5560101152592D+02
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505233074652D+13   R2 =   0.3149367403355D+02
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505329725710D+13   R2 =   0.1373593143546D+03
     ISTATE -5 - shortening step at time   47566.750497996611      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505948628055D+13   R2 =   0.2638477264384D-06
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505958096002D+13   R2 =   0.1330746448711D+02
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505967619472D+13   R2 =   0.4160961781897D+02
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505969776998D+13   R2 =   0.2827087936671D-05
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505972364214D+13   R2 =   0.4092282017958D-06
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505975693838D+13   R2 =   0.3206963015436D-06
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505981738563D+13   R2 =   0.6388471848264D-06
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505984412224D+13   R2 =   0.1562340648301D-05
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505991289391D+13   R2 =   0.1325232833400D-05
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505993446861D+13   R2 =   0.1104357081912D-05
     ISTATE -5 - shortening step at time   47637.016636401284      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506017976002D+13   R2 =   0.4896918137851D-05
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506061437506D+13   R2 =   0.5718447083293D+02
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506066018664D+13   R2 =   0.1055237056255D-05
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506071657580D+13   R2 =   0.6826299876729D-06
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506181050380D+13   R2 =   0.7435327419579D+02
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506188312088D+13   R2 =   0.1801740469054D-05
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506195066284D+13   R2 =   0.4595246190626D+02
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506344428391D+13   R2 =   0.1025767563604D+03
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506423585235D+13   R2 =   0.3279248074393D-05
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506482473215D+13   R2 =   0.4292096663670D+02
     ISTATE -5 - shortening step at time   47658.020470269301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1651107895570D+13   R2 =   0.3791954665705D-05
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1651371094682D+13   R2 =   0.3326130341071D+03
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1651391379193D+13   R2 =   0.6447024812015D+02
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1651490914598D+13   R2 =   0.1194235479123D+03
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1651499137953D+13   R2 =   0.8975282596670D-06
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1652014683875D+13   R2 =   0.1566798539502D+03
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1654510854304D+13   R2 =   0.1043059418636D+03
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1654898319161D+13   R2 =   0.3079300915509D+02
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1654982270148D+13   R2 =   0.4886526133258D-06
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1654989919999D+13   R2 =   0.4828057975877D+02
     ISTATE -5 - shortening step at time   47673.495987806440      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1654993289648D+13   R2 =   0.1894804458057D-05
     ISTATE -5 - shortening step at time   52373.098734153267      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1820514100934D+13   R2 =   0.4326724761159D-06
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1820526659781D+13   R2 =   0.5141848494122D+02
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861397369461D+13   R2 =   0.1301826295540D+03
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1862137852896D+13   R2 =   0.6118800510551D-06
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1862142793449D+13   R2 =   0.3032447187150D-05
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1914068562971D+13   R2 =   0.7970777271214D+01
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1940100581383D+13   R2 =   0.1660145326459D+02
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1940258308781D+13   R2 =   0.3803850167861D-06
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1940262717856D+13   R2 =   0.2653239584555D-06
     ISTATE -5 - shortening step at time   57610.409856240578      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1973356981420D+13
     ISTATE -1: Reducing time step to    92.344648804034904      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2059691283771D+13   R2 =   0.4953491513296D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2059779460754D+13   R2 =   0.5331977628336D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2059787668067D+13   R2 =   0.5014567350591D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2059790152974D+13   R2 =   0.3571646435690D-06
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060095100763D+13   R2 =   0.6034612964697D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060212758084D+13   R2 =   0.6064313278358D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060263749877D+13   R2 =   0.4525267762693D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060275394997D+13   R2 =   0.1853878731845D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060279746487D+13   R2 =   0.1028984700925D-05
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060316322404D+13   R2 =   0.4110014747612D+02
     ISTATE -5 - shortening step at time   62448.005741123918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060332442790D+13   R2 =   0.1935335312090D+01
     ISTATE -5 - shortening step at time   65199.883620378503      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2060340978678D+13   R2 =   0.1038680008722D-05
     ISTATE -5 - shortening step at time   65199.883620378503      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3087752973806D+13
     ISTATE -1: Reducing time step to    6.3529218656403721      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3087754527674D+13   R2 =   0.3922913932555D-06
     ISTATE -5 - shortening step at time   88888.389819252028      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3090667724833D+13   R2 =   0.2334792456818D+03
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3090669771867D+13   R2 =   0.6838167992501D+01
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3090837819207D+13   R2 =   0.2496829584463D+03
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3091058961258D+13   R2 =   0.4252029243521D+02
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2155856270390D+13
     ISTATE -1: Reducing time step to    349.65738931224678      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3146212639445D+13
     ISTATE -1: Reducing time step to    799.12653410679502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3146233931505D+13   R2 =   0.2337187381798D+02
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3146238477436D+13   R2 =   0.1754062148905D+02
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3146240275144D+13   R2 =   0.1086735706307D+02
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3146242019698D+13   R2 =   0.1851696520147D+02
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3146243764251D+13   R2 =   0.1851703377371D+02
     ISTATE -5 - shortening step at time   97777.230920441594      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2250492733163D+13
     ISTATE -1: Reducing time step to    50.174907718050740      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2250525066508D+13   R2 =   0.3083875185931D-05
     ISTATE -5 - shortening step at time   65199.883620378503      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2250558329394D+13   R2 =   0.1300646021790D-04
     ISTATE -5 - shortening step at time   65199.883620378503      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2492998761800D+13   R2 =   0.8165831541297D-06
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2715815920167D+13
     ISTATE -1: Reducing time step to    83.750897654951032      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715818191092D+13   R2 =   0.1251200039030D+02
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715820045976D+13   R2 =   0.6136285630824D+01
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715824799010D+13   R2 =   0.1953631102006D-04
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715828520032D+13   R2 =   0.4126007066198D-06
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715838466723D+13   R2 =   0.2715407563118D-05
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715851279777D+13   R2 =   0.3115458040984D-05
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715857296278D+13   R2 =   0.9574593184931D-05
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715863866912D+13   R2 =   0.4072357223320D+02
     ISTATE -5 - shortening step at time   78891.862600528009      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716539343178D+13   R2 =   0.2378351335954D+02
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716629040296D+13   R2 =   0.3349161410847D+02
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716635725472D+13   R2 =   0.2213723588992D+02
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716637932110D+13   R2 =   0.1391009178529D-05
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716654617191D+13   R2 =   0.2198813941699D+02
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716658436483D+13   R2 =   0.2209330315892D+02
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716675670790D+13   R2 =   0.2284875985677D+02
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716679959612D+13   R2 =   0.8498805626674D-06
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716682035453D+13   R2 =   0.1386280696457D-05
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716684929945D+13   R2 =   0.9941425598528D-06
     ISTATE -5 - shortening step at time   85945.059079482671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716721997139D+13   R2 =   0.3792637045463D+02
     ISTATE -5 - shortening step at time   85971.042086854883      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2988368753264D+13   R2 =   0.7788185982733D-07
     ISTATE -5 - shortening step at time   94568.148345249734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2988438043061D+13   R2 =   0.1255507606085D-05
     ISTATE -5 - shortening step at time   94568.148345249734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2988458664461D+13   R2 =   0.2686342744259D+02
     ISTATE -5 - shortening step at time   94568.148345249734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2988462706428D+13   R2 =   0.1336151155233D-04
     ISTATE -5 - shortening step at time   94568.148345249734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2988518298023D+13   R2 =   0.1489164199929D-05
     ISTATE -5 - shortening step at time   94568.148345249734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2989523321412D+13   R2 =   0.9319566035451D+02
     ISTATE -5 - shortening step at time   94568.148345249734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2989535031522D+13   R2 =   0.1891577540942D+02
     ISTATE -5 - shortening step at time   94568.148345249734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2994136399864D+13   R2 =   0.9652826824278D+02
     ISTATE -5 - shortening step at time   94568.148345249734      years
    [Parallel(n_jobs=4)]: Done   9 out of   9 | elapsed: 18.6min finished



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
      <td>6.338175e-05</td>
      <td>2.481009e-05</td>
      <td>3.812081e-07</td>
    </tr>
    <tr>
      <th>1</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/30.0_10000.0.csv</td>
      <td>0.0</td>
      <td>1171.898734</td>
      <td>2.675607e-05</td>
      <td>2.080557e-05</td>
      <td>5.211700e-08</td>
    </tr>
    <tr>
      <th>2</th>
      <td>50.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/50.0_10000.0.csv</td>
      <td>0.0</td>
      <td>1171.898734</td>
      <td>1.653688e-05</td>
      <td>8.131760e-09</td>
      <td>1.640905e-10</td>
    </tr>
    <tr>
      <th>3</th>
      <td>10.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/10.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.113537e-07</td>
      <td>7.410863e-11</td>
      <td>1.540536e-11</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/30.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.000000e-30</td>
      <td>5.270446e-21</td>
      <td>3.736306e-21</td>
    </tr>
    <tr>
      <th>5</th>
      <td>50.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/50.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>4.960610e-25</td>
    </tr>
    <tr>
      <th>6</th>
      <td>10.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/10.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>1.000000e-30</td>
      <td>5.598034e-22</td>
      <td>7.015782e-22</td>
    </tr>
    <tr>
      <th>7</th>
      <td>30.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/30.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>1.000000e-30</td>
      <td>6.516804e-22</td>
      <td>4.424483e-22</td>
    </tr>
    <tr>
      <th>8</th>
      <td>50.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/50.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>1.000000e-30</td>
      <td>5.799569e-22</td>
      <td>4.800265e-22</td>
    </tr>
  </tbody>
</table>
</div>



## Summary

There are many ways to run grids of models and users will naturally develop their own methods. This notebook is just a simple example of how to run UCLCHEM for many parameter combinations whilst producing a useful output (the model_table) to keep track of all the combinations that were run. In a real script, we'd save the model file to csv at the end.

For much larger grids, it's recommended that you find a way to make your script robust to failure. Over a huge range of parameters, it is quite likely UCLCHEM will hit integration trouble for at least a few parameter combinations. Very occasionally, UCLCHEM will get caught in a loop where it fails to integrate and cannot adjust its strategy to manage it. This isn't a problem for small grids as the model can be stopped and the tolerances adjusted. However, for very large grids, you may end up locking all threads as they each get stuck on a different model. The best solution we've found for this case is to add a check so that models in your dataframe are skipped if their file already exists, this allows you to stop and restart the grid script as needed.



