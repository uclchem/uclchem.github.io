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

    CPU times: user 37.2 s, sys: 303 ms, total: 37.5 s
    Wall time: 38.2 s


#### The Fast Way
Alternatively, we can use multiprocessing to run the models in parallel. That will allow us to run many models simulataneously and make use of all the cores available on our machine.


```python
%%time
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.
    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:    3.4s
    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:    4.4s
    [Parallel(n_jobs=4)]: Done   3 tasks      | elapsed:    4.9s
    [Parallel(n_jobs=4)]: Done   4 tasks      | elapsed:    6.4s
    [Parallel(n_jobs=4)]: Done   5 tasks      | elapsed:   10.5s
    [Parallel(n_jobs=4)]: Done   6 tasks      | elapsed:   10.6s
    [Parallel(n_jobs=4)]: Done   7 tasks      | elapsed:   11.3s
    [Parallel(n_jobs=4)]: Done   8 tasks      | elapsed:   21.6s
    [Parallel(n_jobs=4)]: Done   9 tasks      | elapsed:   27.9s
    [Parallel(n_jobs=4)]: Done  10 tasks      | elapsed:   31.4s
    [Parallel(n_jobs=4)]: Done  11 tasks      | elapsed:   34.7s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2198109471612D+14
     ISTATE -1: Reducing time step to    439.57368972945028      years
    [Parallel(n_jobs=4)]: Done  12 tasks      | elapsed:   37.8s
    [Parallel(n_jobs=4)]: Done  13 tasks      | elapsed:   42.5s
    [Parallel(n_jobs=4)]: Done  14 tasks      | elapsed:   43.8s
    [Parallel(n_jobs=4)]: Done  15 tasks      | elapsed:   46.9s
    [Parallel(n_jobs=4)]: Done  16 tasks      | elapsed:   48.0s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2503359552070D+14
     ISTATE -1: Reducing time step to    779.76102206855091      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2482539199817D+14
     ISTATE -1: Reducing time step to    1438.6329386134655      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4562874072369D+13
     ISTATE -1: Reducing time step to    5560.5251702977621      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2822429565467D+14
     ISTATE -1: Reducing time step to    682.60869793503730      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1454904683242D+14
     ISTATE -1: Reducing time step to    3958.7126146251189      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5784408393190D+13
     ISTATE -1: Reducing time step to    1694.9101733893931      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2778782082717D+14
     ISTATE -1: Reducing time step to    2063.8581726193647      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3133514120636D+14
     ISTATE -1: Reducing time step to    838.16075184872068      years
    [Parallel(n_jobs=4)]: Done  17 tasks      | elapsed:  1.9min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7577918329233D+13
     ISTATE -1: Reducing time step to    6019.2458832586690      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8794256142577D+13
     ISTATE -1: Reducing time step to    2170.0755305119005      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3048989377582D+14
     ISTATE -1: Reducing time step to    3512.9944326741643      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4414523737590D+13
     ISTATE -1: Reducing time step to    6029.9882620378521      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1725008644503D+14
     ISTATE -1: Reducing time step to    5411.1189254737628      years
    [Parallel(n_jobs=4)]: Done  18 tasks      | elapsed:  3.0min
    [Parallel(n_jobs=4)]: Done  19 tasks      | elapsed:  3.1min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1075705665705D+14
     ISTATE -1: Reducing time step to    5958.6815538374249      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1868555858678D+14
     ISTATE -1: Reducing time step to    868.48549782547855      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1203783519874D+14
     ISTATE -1: Reducing time step to    1905.5848425127560      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5209890914707D+13
     ISTATE -1: Reducing time step to    3513.0034868191765      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3155505088696D+14
     ISTATE -1: Reducing time step to    142.24403074156024      years
    [Parallel(n_jobs=4)]: Done  20 tasks      | elapsed:  4.3min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1393615842366D+14
     ISTATE -1: Reducing time step to    5898.2329243970144      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2034541623859D+14
     ISTATE -1: Reducing time step to    5615.7714805335845      years
    [Parallel(n_jobs=4)]: Done  21 out of  27 | elapsed:  4.4min remaining:  1.2min
    [Parallel(n_jobs=4)]: Done  22 out of  27 | elapsed:  4.5min remaining:  1.0min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.9333912166778D+12
     ISTATE -1: Reducing time step to    46.230327657729809      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.6051948305943D+13
     ISTATE -1: Reducing time step to    848.26486725184884      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7716783205046D+13
     ISTATE -1: Reducing time step to    5579.8000671770023      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8230624997078D+13
     ISTATE -1: Reducing time step to    3953.7184225918668      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1517028777372D+14
     ISTATE -1: Reducing time step to    1992.7602394266096      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1061335065119D+14
     ISTATE -1: Reducing time step to    6413.4474019424533      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2170931060591D+14
     ISTATE -1: Reducing time step to    1299.6500006731073      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1084199836179D+14
     ISTATE -1: Reducing time step to    5689.8786867142007      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1150972716172D+14
     ISTATE -1: Reducing time step to    3576.8128326713149      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1993475986715D+14
     ISTATE -1: Reducing time step to    6915.3169791670616      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2723806284882D+14
     ISTATE -1: Reducing time step to    3803.5986363714201      years
    [Parallel(n_jobs=4)]: Done  23 out of  27 | elapsed:  5.7min remaining:   59.5s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7136389867985D+13
     ISTATE -1: Reducing time step to    7416.4878700547606      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2346424424802D+14
     ISTATE -1: Reducing time step to    5746.0625918742153      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2344838213824D+14
     ISTATE -1: Reducing time step to    5796.2591425813716      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1697272218503D+14
     ISTATE -1: Reducing time step to    6288.8539385562972      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2479987642833D+14
     ISTATE -1: Reducing time step to    1519.3784139935481      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2699212374447D+14
     ISTATE -1: Reducing time step to    4581.8869528671949      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.7954978022730D+13
     ISTATE -1: Reducing time step to    4826.0189873261370      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2865365072297D+14
     ISTATE -1: Reducing time step to    9323.8902561291343      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1815105042905D+14
     ISTATE -1: Reducing time step to    2559.9670348253771      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2969222551048D+14
     ISTATE -1: Reducing time step to    6037.2611327558607      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3078344193990D+14
     ISTATE -1: Reducing time step to    2584.0445324899847      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8763498467922D+13
     ISTATE -1: Reducing time step to    2267.4099454278421      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2658713148232D+14
     ISTATE -1: Reducing time step to    5863.5080547234411      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3111354891394D+14
     ISTATE -1: Reducing time step to    1539.4021940305904      years
    [Parallel(n_jobs=4)]: Done  24 out of  27 | elapsed:  7.9min remaining:   59.6s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2788204335693D+14
     ISTATE -1: Reducing time step to    1765.6856056371350      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2011549040199D+14
     ISTATE -1: Reducing time step to    6343.3848983672779      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1028241035539D+14
     ISTATE -1: Reducing time step to    7460.7268346083274      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2975478929586D+14
     ISTATE -1: Reducing time step to    5839.2744672086901      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2125771126242D+14
     ISTATE -1: Reducing time step to    2728.7618684307813      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1110812325198D+14
     ISTATE -1: Reducing time step to    4847.7113001578819      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3107161620256D+14
     ISTATE -1: Reducing time step to    1672.1006497188516      years
    [Parallel(n_jobs=4)]: Done  25 out of  27 | elapsed: 10.5min remaining:   50.4s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1192634870924D+14
     ISTATE -1: Reducing time step to    2258.3901942822527      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2327884343921D+14
     ISTATE -1: Reducing time step to    6332.7740209051190      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2441987332394D+14
     ISTATE -1: Reducing time step to    2721.9199014944356      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1342951101586D+14
     ISTATE -1: Reducing time step to    7501.5475299599721      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1422301184909D+14
     ISTATE -1: Reducing time step to    4990.4689063429823      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2643978064588D+14
     ISTATE -1: Reducing time step to    6329.8081769923274      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1501390534017D+14
     ISTATE -1: Reducing time step to    2487.6413656487298      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2756159871400D+14
     ISTATE -1: Reducing time step to    2779.7509464808149      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1578509511799D+14
     ISTATE -1: Reducing time step to    47.167348837175048      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1656938357712D+14
     ISTATE -1: Reducing time step to    7565.2419572954150      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2956498355742D+14
     ISTATE -1: Reducing time step to    6439.9255471766546      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1732745992907D+14
     ISTATE -1: Reducing time step to    5166.2661242235417      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1808583909760D+14
     ISTATE -1: Reducing time step to    2766.3320108452112      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3067790223781D+14
     ISTATE -1: Reducing time step to    2918.0309364910977      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1882006703323D+14
     ISTATE -1: Reducing time step to    442.82585082042260      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1969411138522D+14
     ISTATE -1: Reducing time step to    7676.8628193994718      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2043350641523D+14
     ISTATE -1: Reducing time step to    5337.0050946099500      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2115387498874D+14
     ISTATE -1: Reducing time step to    3057.3576761275767      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2186646988264D+14
     ISTATE -1: Reducing time step to    802.31050992488679      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2288009125885D+14
     ISTATE -1: Reducing time step to    7594.6480281956865      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2358093674054D+14
     ISTATE -1: Reducing time step to    5376.7825467524590      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2423204983938D+14
     ISTATE -1: Reducing time step to    3316.2980260564627      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2497391749863D+14
     ISTATE -1: Reducing time step to    968.61552509872035      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2595805447761D+14
     ISTATE -1: Reducing time step to    7854.2580992847707      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2672762909352D+14
     ISTATE -1: Reducing time step to    5418.8953544316983      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2744317680279D+14
     ISTATE -1: Reducing time step to    3154.5038356391997      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2823146939337D+14
     ISTATE -1: Reducing time step to    659.90699285151470      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2917054938328D+14
     ISTATE -1: Reducing time step to    7688.1349775940917      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2996640926682D+14
     ISTATE -1: Reducing time step to    5169.5910048165933      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3072871858243D+14
     ISTATE -1: Reducing time step to    2757.2197169288575      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3137412072161D+14
     ISTATE -1: Reducing time step to    714.80785365212216      years
    [Parallel(n_jobs=4)]: Done  27 out of  27 | elapsed: 29.1min finished
    CPU times: user 436 ms, sys: 555 ms, total: 991 ms
    Wall time: 29min 7s


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
    [Parallel(n_jobs=4)]: Done   3 out of   3 | elapsed:   11.2s finished



```python
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5362414430645D+09
     ISTATE -1: Reducing time step to    6.0881510196641321E-002 years
    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:   13.9s
    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:   14.0s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5618390829691D+09
     ISTATE -1: Reducing time step to    9.7066194582032111E-002 years
    [Parallel(n_jobs=4)]: Done   3 out of   9 | elapsed:   24.5s remaining:   48.9s
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5619753269420D+09
     ISTATE -1: Reducing time step to    9.6635042762671888E-002 years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5620966662432D+09
     ISTATE -1: Reducing time step to    9.6251057626563052E-002 years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3525501328564D+12
     ISTATE -1: Reducing time step to    57.034199473393556      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5123718219186D+12   R2 =   0.2170942672484D-05
     ISTATE -5 - shortening step at time   15608.627047713580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5126973546717D+12   R2 =   0.1091745000002D+04
     ISTATE -5 - shortening step at time   15608.627047713580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5526702157524D+12   R2 =   0.1016229548481D-04
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5528936866016D+12   R2 =   0.4936193284548D+03
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5531145369271D+12   R2 =   0.1264848884129D-03
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5533914627349D+12   R2 =   0.5545779295180D+03
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5536610459369D+12   R2 =   0.2095910777219D-04
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5541014599706D+12   R2 =   0.9540502332164D+03
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5543407794104D+12   R2 =   0.2158013470952D+04
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5551927760158D+12   R2 =   0.4253391740826D+04
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5554486105483D+12   R2 =   0.3114971697083D+04
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5564400923080D+12   R2 =   0.5488704843041D+04
     ISTATE -5 - shortening step at time   17169.490124623608      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3222576765862D+11   R2 =   0.2440191958125D-06
     ISTATE -5 - shortening step at time   964.35107535228644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3510458735643D+11   R2 =   0.1301941100526D+04
     ISTATE -5 - shortening step at time   1060.7862058794365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6256791458720D+12   R2 =   0.9786576814996D+04
     ISTATE -5 - shortening step at time   19369.750468522703      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3513164107021D+11   R2 =   0.3654328015242D-05
     ISTATE -5 - shortening step at time   1060.7862058794365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4270536702068D+11   R2 =   0.1151321455847D+03
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4420545777682D+11   R2 =   0.1739850018943D+04
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4553369819187D+11   R2 =   0.9364223110318D+02
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4680675275221D+11   R2 =   0.8215641349138D+03
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4687982759512D+11   R2 =   0.4073217935918D+03
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4710060385294D+11   R2 =   0.1149742517413D+04
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4755229607259D+11   R2 =   0.2029806619667D+04
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9234382439804D+12   R2 =   0.4633105200007D-04
     ISTATE -5 - shortening step at time   28359.254119645069      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5621930059816D+09
     ISTATE -1: Reducing time step to    9.5946185032192002E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9273655448015D+12   R2 =   0.1602696189678D-04
     ISTATE -5 - shortening step at time   28359.254119645069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5299745604204D+11   R2 =   0.2850861021546D-05
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9278288816125D+12   R2 =   0.5940446753337D-03
     ISTATE -5 - shortening step at time   28359.254119645069      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6193045551743D+11   R2 =   0.2071994520697D+04
     ISTATE -5 - shortening step at time   1879.2477160635456      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9884807428710D+12   R2 =   0.2424612222499D-05
     ISTATE -5 - shortening step at time   31195.180207746882      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6688342633694D+11   R2 =   0.2226133638342D+04
     ISTATE -5 - shortening step at time   2067.1725324746571      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6853925371999D+11   R2 =   0.4486735758414D+04
     ISTATE -5 - shortening step at time   2067.1725324746571      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6880986959487D+11   R2 =   0.2073521814436D+04
     ISTATE -5 - shortening step at time   2067.1725324746571      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6931257944379D+11   R2 =   0.2134587624478D+04
     ISTATE -5 - shortening step at time   2067.1725324746571      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1092974260592D+13   R2 =   0.6268180765787D-05
     ISTATE -5 - shortening step at time   34314.698972272621      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1098874558659D+13   R2 =   0.1312134856048D+05
     ISTATE -5 - shortening step at time   34314.698972272621      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1099155762050D+13   R2 =   0.1765046081286D+04
     ISTATE -5 - shortening step at time   34314.698972272621      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1099793993898D+13   R2 =   0.3573356892904D+04
     ISTATE -5 - shortening step at time   34314.698972272621      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7722497510548D+11   R2 =   0.2003590487595D-04
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1197071250507D+13   R2 =   0.1360551829613D-04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7957945186250D+11   R2 =   0.8168155258341D-05
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3666241600901D+12
     ISTATE -1: Reducing time step to    12.496137943790195      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7987681579420D+11   R2 =   0.1891285237149D-03
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1212171826342D+13   R2 =   0.2327788372674D-04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8121102253366D+11   R2 =   0.2573271454480D-04
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1220257951290D+13   R2 =   0.3875391782040D-04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8608429878504D+11   R2 =   0.2735891329949D+04
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1220402965007D+13   R2 =   0.4983917618475D-04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1220698940533D+13   R2 =   0.2252482672007D+04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8683527848893D+11   R2 =   0.3165696933063D-03
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1220891336971D+13   R2 =   0.3731505877099D-04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9142062046347D+11   R2 =   0.1486754721005D+04
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9916768449751D+11   R2 =   0.5394615179523D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1227961149193D+13   R2 =   0.1335555728537D-04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9927095892805D+11   R2 =   0.5430583316293D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9941179178818D+11   R2 =   0.8348017000581D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9960794167314D+11   R2 =   0.3954923341684D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9973269719215D+11   R2 =   0.5860978390234D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1238641400082D+13   R2 =   0.2401975195958D-05
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1238964112567D+13   R2 =   0.1889941969873D+04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1239232343570D+13   R2 =   0.2411283423800D+04
     ISTATE -5 - shortening step at time   37746.169687626061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1012899972070D+12   R2 =   0.1638291051137D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1241894530822D+13   R2 =   0.2568624377615D+03
     ISTATE -5 - shortening step at time   39216.213404115202      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1016973319251D+12   R2 =   0.1754952308061D+04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1242863169473D+13   R2 =   0.1688280165910D+04
     ISTATE -5 - shortening step at time   39216.213404115202      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1022052004288D+12   R2 =   0.1451603501444D+04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1243012085035D+13   R2 =   0.1450899310392D+03
     ISTATE -5 - shortening step at time   39216.213404115202      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1022814198478D+12   R2 =   0.1309673808127D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1023681358887D+12   R2 =   0.4108514609454D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1245185662247D+13   R2 =   0.7561625823692D-04
     ISTATE -5 - shortening step at time   39216.213404115202      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1026852509035D+12   R2 =   0.4199421459027D-05
     ISTATE -5 - shortening step at time   3239.4979711614606      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1816952266836D+13   R2 =   0.5065862271874D-06
     ISTATE -5 - shortening step at time   57416.463022838092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1243342120411D+12   R2 =   0.2356731275139D-06
     ISTATE -5 - shortening step at time   3919.7927150238002      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1817139055333D+13   R2 =   0.1888578566246D+04
     ISTATE -5 - shortening step at time   57416.463022838092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1817219982058D+13   R2 =   0.2052372203353D-04
     ISTATE -5 - shortening step at time   57416.463022838092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1819725447045D+13   R2 =   0.3201406969086D+04
     ISTATE -5 - shortening step at time   57416.463022838092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1817271095598D+12   R2 =   0.9558497927409D-05
     ISTATE -5 - shortening step at time   5738.9690116215324      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5622869213880D+09
     ISTATE -1: Reducing time step to    9.5648984374559681E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2196517939435D+12   R2 =   0.3860400865030D+02
     ISTATE -5 - shortening step at time   6944.1528050829620      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2251138074993D+12   R2 =   0.4643364495740D-03
     ISTATE -5 - shortening step at time   6944.1528050829620      years
    [Parallel(n_jobs=4)]: Done   4 out of   9 | elapsed:  1.0min remaining:  1.3min
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274645318190D+12   R2 =   0.7760597524664D-04
     ISTATE -5 - shortening step at time   6944.1528050829620      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2293575621637D+12   R2 =   0.5710602145156D+03
     ISTATE -5 - shortening step at time   6944.1528050829620      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2415512384970D+12   R2 =   0.8563433688612D-07
     ISTATE -5 - shortening step at time   7638.5682511527630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2516521922206D+12   R2 =   0.6514405399240D+02
     ISTATE -5 - shortening step at time   7638.5682511527630      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2712730618294D+12   R2 =   0.3358557695731D+03
     ISTATE -5 - shortening step at time   8402.4252583856978      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2773614493134D+12   R2 =   0.2654234287279D+04
     ISTATE -5 - shortening step at time   8402.4252583856978      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3888928578356D+12   R2 =   0.5668724426186D-05
     ISTATE -5 - shortening step at time   12301.991887356417      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3945404844466D+12   R2 =   0.3794351287935D+03
     ISTATE -5 - shortening step at time   12301.991887356417      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4704692149376D+12   R2 =   0.1355993971044D-06
     ISTATE -5 - shortening step at time   14885.410828966425      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3870238569956D+12
     ISTATE -1: Reducing time step to    65.210081424873607      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6459039742834D+12   R2 =   0.1264689067105D+04
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6478662040942D+12   R2 =   0.1206122851880D+04
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6573802955250D+12   R2 =   0.4059316499119D+03
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6600070356538D+12   R2 =   0.7484476265614D-05
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6612850246023D+12   R2 =   0.4487479170044D+03
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.6872371391667D+09
     ISTATE -1: Reducing time step to    5.1806522396330823E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6647421053087D+12   R2 =   0.2238231606980D-03
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6736003651424D+12   R2 =   0.4270304479396D+03
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6759575035906D+12   R2 =   0.7261826856726D-05
     ISTATE -5 - shortening step at time   19812.483101626280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7712441057150D+12   R2 =   0.7120640565116D+03
     ISTATE -5 - shortening step at time   23973.105592173903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7747720314790D+12   R2 =   0.2228795496600D+03
     ISTATE -5 - shortening step at time   23973.105592173903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7750575349259D+12   R2 =   0.1050172973297D+03
     ISTATE -5 - shortening step at time   23973.105592173903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7756498901731D+12   R2 =   0.1376134587079D+03
     ISTATE -5 - shortening step at time   23973.105592173903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7854753227033D+12   R2 =   0.1700464720671D+03
     ISTATE -5 - shortening step at time   23973.105592173903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7861800331343D+12   R2 =   0.4563932188894D+03
     ISTATE -5 - shortening step at time   23973.105592173903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8990687452072D+12   R2 =   0.4555373692168D+03
     ISTATE -5 - shortening step at time   26370.416722954669      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9167217609939D+12   R2 =   0.6823189160160D-06
     ISTATE -5 - shortening step at time   29007.459023969866      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3979241036145D+12
     ISTATE -1: Reducing time step to    30.715629584999142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1008351021117D+13   R2 =   0.7033821207731D-07
     ISTATE -5 - shortening step at time   31908.205617958571      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4152476589562D+11   R2 =   0.8080001995822D-07
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4884624061943D+11   R2 =   0.2241819196823D+04
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5142398654404D+11   R2 =   0.8800179420114D+03
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5213682104028D+11   R2 =   0.2710685098832D+04
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5219229110102D+11   R2 =   0.1482952741680D-04
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5226927545712D+11   R2 =   0.2967814103307D-04
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5457772192094D+11   R2 =   0.2930758259505D-05
     ISTATE -5 - shortening step at time   1708.4069775744993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5840437663922D+11   R2 =   0.1912127711045D+04
     ISTATE -5 - shortening step at time   1708.4069775744993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5844805163606D+11   R2 =   0.7431536723640D+02
     ISTATE -5 - shortening step at time   1708.4069775744993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6046451895418D+11   R2 =   0.1920470123621D+03
     ISTATE -5 - shortening step at time   1879.2477160635456      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8097276127978D+11   R2 =   0.9101447663312D-06
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8103694348878D+11   R2 =   0.4140706097993D+03
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8127104261515D+11   R2 =   0.5460345650744D-03
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8225427901197D+11   R2 =   0.9296051845523D+03
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1109167317911D+13   R2 =   0.1050290603640D-05
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8238328560598D+11   R2 =   0.3525126515917D+03
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8607988060509D+11   R2 =   0.1018603457289D+04
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1117928773334D+13   R2 =   0.2284369899276D-05
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8612271300819D+11   R2 =   0.1033545421012D+03
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1130346765804D+13   R2 =   0.9684759309777D+03
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8749058573095D+11   R2 =   0.1123184355361D-04
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1132778026151D+13   R2 =   0.3986383366003D-05
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8886797703682D+11   R2 =   0.7422167293258D-05
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8895840033504D+11   R2 =   0.4494169388370D+03
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8956642932562D+11   R2 =   0.2243527661902D+04
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8964868357657D+11   R2 =   0.2149601565018D+03
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1134550515576D+13   R2 =   0.6068851275164D-05
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8984887861029D+11   R2 =   0.1121690656025D+04
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1000633009633D+12   R2 =   0.3190164486963D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1156889999472D+13   R2 =   0.1072298642086D-04
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1157698170142D+13   R2 =   0.2093976903132D+03
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1002785645741D+12   R2 =   0.6519539275771D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1008364337379D+12   R2 =   0.9466994546413D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1161121752457D+13   R2 =   0.3386930481177D+03
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1008802655415D+12   R2 =   0.1900930327878D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1172557424017D+13   R2 =   0.2277928489961D+02
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1020158661922D+12   R2 =   0.1992644313254D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1034751413857D+12   R2 =   0.1508474771983D+04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1035377960915D+12   R2 =   0.2266729284407D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1040254045223D+12   R2 =   0.1354687237739D+04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1041839744896D+12   R2 =   0.2508826983656D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1051063083761D+12   R2 =   0.8108079097160D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1190424660216D+13   R2 =   0.1723986038025D+03
     ISTATE -5 - shortening step at time   35099.026940505333      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1054369724372D+12   R2 =   0.4896463812998D-05
     ISTATE -5 - shortening step at time   3326.1489992443094      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1190459973218D+13   R2 =   0.2482494701656D-07
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1055537139276D+12   R2 =   0.1271420005470D-04
     ISTATE -5 - shortening step at time   3326.1489992443094      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1201225741927D+13   R2 =   0.3728422109803D+03
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1202381028289D+13   R2 =   0.7316210758714D+03
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1202756718475D+13   R2 =   0.5963798697168D+03
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1401752064343D+12   R2 =   0.7999430208043D-06
     ISTATE -5 - shortening step at time   4427.1046058588872      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1225985645844D+13   R2 =   0.1896747204513D+03
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1226512109787D+13   R2 =   0.1669505572125D-04
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1258141719013D+13   R2 =   0.3477206591714D+03
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1271122196884D+13   R2 =   0.6175155911520D+03
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1865011908601D+12   R2 =   0.8023233436245D-06
     ISTATE -5 - shortening step at time   5892.4766135461350      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1866194710455D+12   R2 =   0.1544818517968D+03
     ISTATE -5 - shortening step at time   5892.4766135461350      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2050204887705D+12   R2 =   0.3076547269686D+02
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2062015293773D+12   R2 =   0.3777561696719D-05
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1298654813991D+13   R2 =   0.4604935448802D-05
     ISTATE -5 - shortening step at time   37671.666462532819      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2073159587196D+12   R2 =   0.4733012111222D+03
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2081606891850D+12   R2 =   0.1522795140519D+03
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2088497112015D+12   R2 =   0.2145536725122D-05
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2103940337432D+12   R2 =   0.4476602477210D+03
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2105520661664D+12   R2 =   0.2565923895576D-04
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1440443280127D+13   R2 =   0.5412456220816D-07
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1441683613717D+13   R2 =   0.4069199590521D+03
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2106786430064D+12   R2 =   0.2335985787067D-03
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2123518017023D+12   R2 =   0.2147814551021D+03
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1454220792547D+13   R2 =   0.1155021960030D-04
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2148714752622D+12   R2 =   0.5868989136059D-04
     ISTATE -5 - shortening step at time   6481.7244153883385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1458898170923D+13   R2 =   0.7765748905597D+02
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2188608160514D+12   R2 =   0.2780677692282D+03
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1460254953766D+13   R2 =   0.3418345902952D-05
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2192955863717D+12   R2 =   0.2355392150183D-04
     ISTATE -5 - shortening step at time   6799.7302298157465      years
    [Parallel(n_jobs=4)]: Done   5 out of   9 | elapsed:  1.7min remaining:  1.3min
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1461803622683D+13   R2 =   0.7959035194046D-05
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4212057574331D+12
     ISTATE -1: Reducing time step to    86.036453643279430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2230089654392D+12   R2 =   0.4199651629731D-05
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2243553379125D+12   R2 =   0.2428829326284D-04
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505834260390D+13   R2 =   0.8825169282692D+02
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2244595678569D+12   R2 =   0.1494859747006D-04
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510981337668D+13   R2 =   0.1688260727935D+03
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315848088563D+12   R2 =   0.1209371878631D-04
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1512090361253D+13   R2 =   0.1222009078171D-05
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2316832761449D+12   R2 =   0.8206412902072D+02
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1514042808888D+13   R2 =   0.3861504622735D-05
     ISTATE -5 - shortening step at time   45582.718395622280      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2320474080064D+12   R2 =   0.2363831442432D-03
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2320916425346D+12   R2 =   0.2984422031036D+03
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2333040292470D+12   R2 =   0.6463116653397D+02
     ISTATE -5 - shortening step at time   6799.7302298157465      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1522333196872D+13   R2 =   0.1967187401088D-05
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2334732745394D+12   R2 =   0.6637372065877D-05
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1535124118429D+13   R2 =   0.1591330598123D+03
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2362595537132D+12   R2 =   0.1797885656584D-04
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2363137492868D+12   R2 =   0.2995023819351D+03
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2364328593981D+12   R2 =   0.3934601786321D+03
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1539147928106D+13   R2 =   0.9576355839954D+02
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1539438504354D+13   R2 =   0.2780507475850D+03
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2366167602027D+12   R2 =   0.2766121285391D-04
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2366619562593D+12   R2 =   0.6405659949805D-04
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2367395061580D+12   R2 =   0.2213744004100D-05
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1552852307725D+13   R2 =   0.1415863279721D-05
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370204605556D+12   R2 =   0.7213583331241D+03
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2372372916226D+12   R2 =   0.1063935704600D+03
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1577295586304D+13   R2 =   0.1075726341346D+03
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2373386142240D+12   R2 =   0.8292470162372D-04
     ISTATE -5 - shortening step at time   7383.0389002224219      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1587179327931D+13   R2 =   0.1913670255201D-05
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1587671830011D+13   R2 =   0.4881716358603D+02
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2873247186536D+12   R2 =   0.1636371642693D-06
     ISTATE -5 - shortening step at time   9087.9663183528992      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1587804330121D+13   R2 =   0.9780924570177D+02
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3160118149738D+12   R2 =   0.1845364924935D+02
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1590632843742D+13   R2 =   0.7457697817172D-05
     ISTATE -5 - shortening step at time   47912.747116721061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3164657643569D+12   R2 =   0.3010483282893D+03
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3178221399696D+12   R2 =   0.8718676687294D+02
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3182734595932D+12   R2 =   0.4429006937271D+03
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3207829122172D+12   R2 =   0.1779667336749D+03
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3212749192957D+12   R2 =   0.5242584993573D+03
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3234386377273D+12   R2 =   0.2972643980853D-05
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3236615095285D+12   R2 =   0.1196871882436D+03
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3428962124381D+12   R2 =   0.2656795842247D-05
     ISTATE -5 - shortening step at time   9996.7631668621907      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3571146229588D+12   R2 =   0.9135143074751D+02
     ISTATE -5 - shortening step at time   10996.439721889818      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4305036883664D+12
     ISTATE -1: Reducing time step to    56.612621137493122      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3588272729332D+12   R2 =   0.8756844869567D-05
     ISTATE -5 - shortening step at time   10996.439721889818      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3608966387756D+12   R2 =   0.7538431229459D+03
     ISTATE -5 - shortening step at time   10996.439721889818      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3823342097305D+12   R2 =   0.2988429723466D-06
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3990119870844D+12   R2 =   0.8839684534952D-05
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3992081362975D+12   R2 =   0.2398825344883D+03
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3998222578675D+12   R2 =   0.8243727828672D-05
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4008723247738D+12   R2 =   0.6650460248886D-05
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4012368778543D+12   R2 =   0.5988100833568D-05
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4115196778546D+12   R2 =   0.6431815357240D+03
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4123301778405D+12   R2 =   0.2658285634185D+03
     ISTATE -5 - shortening step at time   12096.083956254353      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4205230478511D+12   R2 =   0.1593821040192D+02
     ISTATE -5 - shortening step at time   13305.692640272904      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4725670427615D+12   R2 =   0.1433087868167D-05
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4731390575965D+12   R2 =   0.3825515093036D+03
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4759698863571D+12   R2 =   0.1516374195477D-04
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4762491836047D+12   R2 =   0.2900463847327D+03
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4785073318909D+12   R2 =   0.5591065996979D+02
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4923155789797D+12   R2 =   0.3438917572512D+03
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4923603932931D+12   R2 =   0.1076906491208D+03
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4925004433123D+12   R2 =   0.1991740596470D+03
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4935349482528D+12   R2 =   0.5181455442944D+03
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4936605640554D+12   R2 =   0.8386123413377D-06
     ISTATE -5 - shortening step at time   14636.262221532628      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4998674744616D+12   R2 =   0.4004802195502D+02
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5000920577536D+12   R2 =   0.2124842218864D+03
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5001199964157D+12   R2 =   0.1253537069412D-04
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5009975881466D+12   R2 =   0.2702712845387D+02
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5012513515776D+12   R2 =   0.1315004562440D-05
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030455780013D+10
     ISTATE -1: Reducing time step to    2.5209730288845051      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5017658283448D+12   R2 =   0.4441117778896D-05
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5017792820083D+12   R2 =   0.1074713311052D+02
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5022150490906D+12   R2 =   0.2125493615495D+03
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5025147465209D+12   R2 =   0.2034914732259D+03
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5089368853252D+12   R2 =   0.8033422173974D+02
     ISTATE -5 - shortening step at time   15622.169748587228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5201500359277D+12   R2 =   0.4927156934989D+03
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5202252841175D+12   R2 =   0.1121089121886D+02
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5203100643268D+12   R2 =   0.9294751792685D+02
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5205496487734D+12   R2 =   0.1902440434937D+03
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4401954819146D+12
     ISTATE -1: Reducing time step to    25.942387933187106      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5207924824601D+12   R2 =   0.2021054745049D+03
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5210623796785D+12   R2 =   0.6240756526308D-04
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5274332854572D+12   R2 =   0.2015585505818D-05
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5274687550914D+12   R2 =   0.1620551423181D+03
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5275819676106D+12   R2 =   0.1159797862998D+03
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5280275822943D+12   R2 =   0.1725903450787D+03
     ISTATE -5 - shortening step at time   16105.597636873581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5365072457498D+12   R2 =   0.1677009041713D+03
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5427943440318D+12   R2 =   0.6002094792161D-05
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5497734555910D+12   R2 =   0.1984472519049D+03
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5506516528124D+12   R2 =   0.2884062653376D+03
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5507605228314D+12   R2 =   0.2287718931067D+03
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5594195749170D+12   R2 =   0.1487172945249D+03
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5594759091287D+12   R2 =   0.7998010059232D+02
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5595576376004D+12   R2 =   0.1812820644085D+03
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5608822723211D+12   R2 =   0.1813091305220D+03
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5608915428024D+12   R2 =   0.5354895731711D-05
     ISTATE -5 - shortening step at time   16709.733616908943      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030473888037D+10
     ISTATE -1: Reducing time step to    2.5209157250109540      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6285777173543D+12   R2 =   0.5259168622508D+03
     ISTATE -5 - shortening step at time   19524.706027067401      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6787246947469D+12   R2 =   0.1048602553704D-06
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6789717114173D+12   R2 =   0.3453155409209D-06
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6790416327718D+12   R2 =   0.9843855631850D+02
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6790508021400D+12   R2 =   0.6125345983480D-06
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6862345454863D+12   R2 =   0.3316309469657D-05
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6867762815344D+12   R2 =   0.5588364766455D-05
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6873120760421D+12   R2 =   0.2559954849942D+03
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6873524716635D+12   R2 =   0.3523648905856D-05
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6874280219352D+12   R2 =   0.1685584891841D+02
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6877781240119D+12   R2 =   0.3803663325857D-05
     ISTATE -5 - shortening step at time   21477.177095279407      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6878393863826D+12   R2 =   0.8186925355016D-05
     ISTATE -5 - shortening step at time   21765.130506706126      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1766429330530D+13   R2 =   0.2764599755985D-05
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1766600841403D+13   R2 =   0.1206850886304D-03
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1767107935165D+13   R2 =   0.9499899593172D+02
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6943857220771D+12   R2 =   0.3496745173835D+04
     ISTATE -5 - shortening step at time   21765.130506706126      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1767162382321D+13   R2 =   0.4213298131059D+01
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6944027107902D+12   R2 =   0.4480515780233D+02
     ISTATE -5 - shortening step at time   21765.130506706126      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1769895729921D+13   R2 =   0.5312870245009D+02
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030487408500D+10
     ISTATE -1: Reducing time step to    2.5208729387322766      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1772681230613D+13   R2 =   0.1074267948076D-05
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1772798212883D+13   R2 =   0.9826911130312D+02
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6956841838111D+12   R2 =   0.3781899377787D-05
     ISTATE -5 - shortening step at time   21765.130506706126      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6957418951111D+12   R2 =   0.1096484702580D+03
     ISTATE -5 - shortening step at time   21765.130506706126      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1773209878752D+13   R2 =   0.2102817362956D-04
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1774438536748D+13   R2 =   0.2060844279259D+02
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1774564362039D+13   R2 =   0.3242394806575D-06
     ISTATE -5 - shortening step at time   55370.131836716209      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780146062377D+13   R2 =   0.9433290316429D+02
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4669790614689D+12
     ISTATE -1: Reducing time step to    83.080865917927383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1780641746965D+13   R2 =   0.7946229668154D+02
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7639299337874D+12   R2 =   0.6585316091886D+02
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1787592059030D+13   R2 =   0.1043310923494D+03
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1788319238260D+13   R2 =   0.2607597845021D+03
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1789467012841D+13   R2 =   0.3441901872756D+03
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7655614907745D+12   R2 =   0.2150417150579D-05
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7655829588480D+12   R2 =   0.9912497929030D+02
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7657077474092D+12   R2 =   0.4433299330038D+03
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7666622189841D+12   R2 =   0.9578658368290D+02
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1793204688294D+13   R2 =   0.8395487948929D-05
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1796211076196D+13   R2 =   0.1021905161052D+03
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7668374909029D+12   R2 =   0.6345656743153D-05
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1797606882340D+13   R2 =   0.2566058026207D+03
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1802413749737D+13   R2 =   0.3221848542779D+03
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7711204466419D+12   R2 =   0.1291980477918D-05
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7715688617768D+12   R2 =   0.8458631285203D+02
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1813337530796D+13   R2 =   0.4940446841318D+02
     ISTATE -5 - shortening step at time   56157.100064519291      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7715798204577D+12   R2 =   0.5405969844171D-05
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7861558861110D+12   R2 =   0.3200562592250D-04
     ISTATE -5 - shortening step at time   23941.644076297885      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1835142411625D+13   R2 =   0.7842666283240D+02
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8017901358734D+12   R2 =   0.2850673526472D+02
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8020549587644D+12   R2 =   0.2412709492540D-04
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8026306349468D+12   R2 =   0.3449969912808D+03
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8064198908751D+12   R2 =   0.1065182646148D+03
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1886230616798D+13   R2 =   0.2249841835828D+03
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8079923229108D+12   R2 =   0.4645953321181D+03
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8095943778309D+12   R2 =   0.1518964689399D-05
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1904946676209D+13   R2 =   0.1035874985689D+03
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030500603945D+10
     ISTATE -1: Reducing time step to    2.5208311809969817      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8096205671653D+12   R2 =   0.6247672282449D-05
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8098393442219D+12   R2 =   0.1058841107843D+03
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1907329156783D+13   R2 =   0.2109317622663D-05
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8107749295871D+12   R2 =   0.2854703845481D+02
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8114913613201D+12   R2 =   0.5930339044946D+02
     ISTATE -5 - shortening step at time   24878.350826295940      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1922193128132D+13   R2 =   0.2371612607303D-05
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4757956168845D+12
     ISTATE -1: Reducing time step to    55.180373680740658      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8258553368314D+12   R2 =   0.3588413495295D+03
     ISTATE -5 - shortening step at time   25680.106370889320      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1941402965721D+13   R2 =   0.1602428599398D-05
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8926885948261D+12   R2 =   0.7062908964110D-07
     ISTATE -5 - shortening step at time   28248.117620239696      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1945105228525D+13   R2 =   0.2811744257844D-05
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1982394266349D+13   R2 =   0.2178516189533D+03
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1982657887471D+13   R2 =   0.2834059993610D+03
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1991438333679D+13   R2 =   0.4724920907272D-06
     ISTATE -5 - shortening step at time   57384.099075818594      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9819620196268D+12   R2 =   0.2183002040476D-05
     ISTATE -5 - shortening step at time   31072.930055751272      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2208668861359D+13   R2 =   0.2524026084173D+03
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2208868461928D+13   R2 =   0.3109100380044D+03
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2208960366004D+13   R2 =   0.9421123780175D-05
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030512462072D+10
     ISTATE -1: Reducing time step to    2.5207936552756571      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2271523445145D+13   R2 =   0.1681319031003D+03
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277791449233D+13   R2 =   0.2508264183407D+03
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4835894499692D+12
     ISTATE -1: Reducing time step to    30.516344564031918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1188128562022D+13   R2 =   0.1652544939186D-06
     ISTATE -5 - shortening step at time   37598.246997299102      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2326515807026D+13   R2 =   0.3782627308164D-05
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2342802282394D+13   R2 =   0.1488291843073D-04
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2363388198560D+13   R2 =   0.1012593037182D+03
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2364763631012D+13   R2 =   0.2928579880101D+02
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2365093411470D+13   R2 =   0.3002571479815D+03
     ISTATE -5 - shortening step at time   69322.221978670874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2365114336187D+13   R2 =   0.1501855360405D-07
     ISTATE -5 - shortening step at time   74844.728211073700      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030523868516D+10
     ISTATE -1: Reducing time step to    2.5207575589348461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2613597064787D+13   R2 =   0.4017792351336D+03
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4931109842519D+12
     ISTATE -1: Reducing time step to   0.38490651145006693      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2619326835555D+13   R2 =   0.2329078063407D+03
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2658579907636D+13   R2 =   0.3296866463563D+03
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2660830401668D+13   R2 =   0.2919420961769D+03
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1346897416134D+13   R2 =   0.1699687141866D+03
     ISTATE -5 - shortening step at time   41358.072593441073      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2671725159393D+13   R2 =   0.3507996053891D-05
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2679419301033D+13   R2 =   0.4650342184913D+02
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5102225453282D+12
     ISTATE -1: Reducing time step to    102.32070598642208      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2680759481862D+13   R2 =   0.3958463388441D+02
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2699850615223D+13   R2 =   0.3871844783603D+03
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704941860379D+13   R2 =   0.1801864374115D+03
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1446084745655D+13   R2 =   0.3625968896660D-06
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1446201018640D+13   R2 =   0.1119786593255D-05
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2734726834649D+13   R2 =   0.1809983760883D+03
     ISTATE -5 - shortening step at time   82329.202816618446      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030535069325D+10
     ISTATE -1: Reducing time step to    2.5207221133364643      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1447420923347D+13   R2 =   0.6641662367685D-06
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1450340948647D+13   R2 =   0.6049717031505D+02
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5310185763331D+12
     ISTATE -1: Reducing time step to    36.510480306859165      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1453708460633D+13   R2 =   0.2457220914813D-04
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1455234450235D+13   R2 =   0.4196995199281D+02
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1455590622468D+13   R2 =   0.1153316619854D-05
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1456654877959D+13   R2 =   0.2192392266723D-05
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1456662925948D+13   R2 =   0.4058388741776D+01
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1456669512383D+13   R2 =   0.1302191332068D-04
     ISTATE -5 - shortening step at time   45493.880838838471      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3008218205834D+13   R2 =   0.4054303715078D+01
     ISTATE -5 - shortening step at time   95196.189345405553      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3008458735414D+13   R2 =   0.1691468263424D+03
     ISTATE -5 - shortening step at time   95196.189345405553      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615004512967D+13   R2 =   0.9573458224862D+01
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6394862676337D+12   R2 =   0.3934722946514D-09
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615065953001D+13   R2 =   0.1071953431143D-04
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408262192820D+12   R2 =   0.6551871657609D-09
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615071226546D+13   R2 =   0.4917862307766D-06
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408296534547D+12   R2 =   0.9444663054051D+02
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408330877782D+12   R2 =   0.1178608437707D+03
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615084051112D+13   R2 =   0.3246784692182D-05
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408383141578D+12   R2 =   0.1046847902190D-04
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615090395119D+13   R2 =   0.1644319937898D+02
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615460501010D+13   R2 =   0.2884180228810D+02
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408420238724D+12   R2 =   0.1674764579419D-05
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408454580602D+12   R2 =   0.1178561792744D+03
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408488923889D+12   R2 =   0.1178610214218D+03
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6408523268674D+12   R2 =   0.1178661692747D+03
     ISTATE -5 - shortening step at time   18886.439546438512      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615870170983D+13   R2 =   0.3411274137639D-05
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6650163403993D+12   R2 =   0.1091629687838D+04
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1616294574725D+13   R2 =   0.3676190742770D+02
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1616333452199D+13   R2 =   0.5030947544212D+02
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6650224335257D+12   R2 =   0.1167715114476D-04
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1616448255133D+13   R2 =   0.5289324906910D+02
     ISTATE -5 - shortening step at time   50706.851213644120      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030545330425D+10
     ISTATE -1: Reducing time step to    2.5206896415007294      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6650299669765D+12   R2 =   0.1142697860271D-04
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6650540083118D+12   R2 =   0.1542620453981D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
    [Parallel(n_jobs=4)]: Done   6 out of   9 | elapsed:  3.1min remaining:  1.5min
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1616564654314D+13   R2 =   0.8700582143175D-06
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6650782175469D+12   R2 =   0.1559699652659D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6651026333629D+12   R2 =   0.1555413544035D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1616662222187D+13   R2 =   0.2037670610773D+02
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6651106392910D+12   R2 =   0.2114153643748D+02
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1616670486787D+13   R2 =   0.1539029147542D+03
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6651353441654D+12   R2 =   0.1579029551680D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6651602860384D+12   R2 =   0.1779060690260D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617192211201D+13   R2 =   0.3780425667200D+02
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6651854841873D+12   R2 =   0.1819490236187D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617207194955D+13   R2 =   0.2069360345966D+02
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617324278332D+13   R2 =   0.9381293002673D+02
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6725533657615D+12   R2 =   0.9202798741058D+02
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6725603739659D+12   R2 =   0.2056188167147D+03
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6725673608902D+12   R2 =   0.2009875864039D+03
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617440309586D+13   R2 =   0.4827192766524D-06
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617455887216D+13   R2 =   0.3889885881666D+03
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617511243868D+13   R2 =   0.7728368569327D+02
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617532140973D+13   R2 =   0.3354206192176D+03
     ISTATE -5 - shortening step at time   51153.425795346062      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7163772085434D+12   R2 =   0.1163289581005D-09
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617543864422D+13   R2 =   0.3590709317615D-06
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7163836190942D+12   R2 =   0.5456015915858D-06
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617574616081D+13   R2 =   0.3821210103018D+02
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617579270544D+13   R2 =   0.6157531097988D-06
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7173956448567D+12   R2 =   0.1092138344144D-06
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617756324833D+13   R2 =   0.2355497100731D+02
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617760758445D+13   R2 =   0.1343707488088D+02
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617766245914D+13   R2 =   0.4518662747170D-05
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7218752473395D+12   R2 =   0.4002070304038D-08
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1617783055294D+13   R2 =   0.5422237925784D+02
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7218885613369D+12   R2 =   0.2241596333514D+03
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7218979475308D+12   R2 =   0.9911790544242D-06
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1618058075518D+13   R2 =   0.2444399793399D-04
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7219112615728D+12   R2 =   0.2205306621649D+03
     ISTATE -5 - shortening step at time   21050.173550229814      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7296525120247D+12   R2 =   0.6667728972979D+02
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1618186278046D+13   R2 =   0.1942551709350D-05
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7296621752176D+12   R2 =   0.4881404299074D-05
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7306266346786D+12   R2 =   0.1791504135144D+04
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1623098117887D+13   R2 =   0.1246924739124D+03
     ISTATE -5 - shortening step at time   51187.725980161478      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7306405442045D+12   R2 =   0.2682840614715D+02
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7316532148498D+12   R2 =   0.7487940418473D+03
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7316671574854D+12   R2 =   0.1837226553143D+03
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7330395500562D+12   R2 =   0.2620611507670D-05
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7353552214218D+12   R2 =   0.8921058980629D+03
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7361026325521D+12   R2 =   0.2825805753574D-05
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7361067496539D+12   R2 =   0.1413038871727D+03
     ISTATE -5 - shortening step at time   22845.293087745678      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8995997569823D+12   R2 =   0.2975451511689D-06
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8996385869626D+12   R2 =   0.2601382430392D+03
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8996774224691D+12   R2 =   0.2558165240746D+03
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8997162086734D+12   R2 =   0.2791553899434D+03
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9034670710639D+12   R2 =   0.2308665633874D+04
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9117426540370D+12   R2 =   0.7300134198633D+04
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9117815068382D+12   R2 =   0.2624348723493D+03
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9124842341534D+12   R2 =   0.5679381099828D-06
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9129980280108D+12   R2 =   0.6398245012786D+03
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030555961848D+10
     ISTATE -1: Reducing time step to    2.5206559977560969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9135942540555D+12   R2 =   0.4409737016766D-05
     ISTATE -5 - shortening step at time   28186.367268718423      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9196478771267D+12   R2 =   0.7553506280420D+03
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9196715683265D+12   R2 =   0.6029825792787D+02
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9197132725644D+12   R2 =   0.6693020837214D+02
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9202186727155D+12   R2 =   0.1062390187046D+04
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9202259564654D+12   R2 =   0.2500676436195D+03
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9202301221148D+12   R2 =   0.1548483478645D-05
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9202904351839D+12   R2 =   0.2583155552411D+03
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9202942598066D+12   R2 =   0.1010061355149D+02
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9205964997153D+12   R2 =   0.5822736139601D+03
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9206001422276D+12   R2 =   0.1250164486333D+03
     ISTATE -5 - shortening step at time   28911.210571377072      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9218187822594D+12   R2 =   0.3011149599362D+03
     ISTATE -5 - shortening step at time   29132.915893279856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9664365798188D+12   R2 =   0.1023023189121D+04
     ISTATE -5 - shortening step at time   29132.915893279856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9664409942229D+12   R2 =   0.1175816538760D-05
     ISTATE -5 - shortening step at time   29132.915893279856      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1013243138501D+13   R2 =   0.1851312443709D-06
     ISTATE -5 - shortening step at time   32046.208177190681      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1017094122425D+13   R2 =   0.6787922765317D-05
     ISTATE -5 - shortening step at time   32046.208177190681      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1018923914083D+13   R2 =   0.1237912816402D+04
     ISTATE -5 - shortening step at time   32046.208177190681      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1143134835947D+13   R2 =   0.2563069592704D+04
     ISTATE -5 - shortening step at time   35250.829758950895      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1145111754459D+13   R2 =   0.2985745199812D+04
     ISTATE -5 - shortening step at time   35250.829758950895      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1145552324507D+13   R2 =   0.1774132323528D-05
     ISTATE -5 - shortening step at time   35250.829758950895      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1145588412055D+13   R2 =   0.3592595167947D+03
     ISTATE -5 - shortening step at time   35250.829758950895      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1145624492830D+13   R2 =   0.3681295586789D+03
     ISTATE -5 - shortening step at time   35250.829758950895      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1145660566843D+13   R2 =   0.3147917817571D+03
     ISTATE -5 - shortening step at time   35250.829758950895      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1228526067269D+13   R2 =   0.2308792781156D+03
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1228639960079D+13   R2 =   0.3806506386820D+03
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1231952682536D+13   R2 =   0.2365306337269D+04
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1231956238834D+13   R2 =   0.1220567369484D+03
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1231975785374D+13   R2 =   0.3050173299731D+03
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1232011277781D+13   R2 =   0.3317743438931D+03
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1232046694818D+13   R2 =   0.3350399409847D+03
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1232107792810D+13   R2 =   0.9847193848794D+02
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1232224790137D+13   R2 =   0.2259780391556D+02
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1232235583263D+13   R2 =   0.4276861238686D-04
     ISTATE -5 - shortening step at time   38775.913575291255      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234460485179D+13   R2 =   0.1781198723715D+03
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234640780427D+13   R2 =   0.1169852217558D+04
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234700333840D+13   R2 =   0.5108329743124D+02
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234707511049D+13   R2 =   0.6786819452629D-05
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234721809213D+13   R2 =   0.3787854244683D+03
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234732019412D+13   R2 =   0.2774600401334D+03
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234740231555D+13   R2 =   0.2819414757493D+03
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234748380644D+13   R2 =   0.2076112687693D+03
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234763069610D+13   R2 =   0.3598457861532D+03
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1234777932088D+13   R2 =   0.3394442377228D+03
     ISTATE -5 - shortening step at time   38994.796938716441      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1237225156123D+13   R2 =   0.2620729116321D+03
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1237230408161D+13   R2 =   0.1803143815860D+03
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1237306932474D+13   R2 =   0.2627253686716D+03
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1238921964777D+13   R2 =   0.1254927337060D+04
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1241061170247D+13   R2 =   0.1614435080170D+04
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030565826109D+10
     ISTATE -1: Reducing time step to    2.5206247817387726      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1243350190168D+13   R2 =   0.2004766892526D+04
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1243366246977D+13   R2 =   0.3762102486642D+03
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1260688783376D+13   R2 =   0.6844017258587D+04
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1260723641647D+13   R2 =   0.3809328385157D+03
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1261255566526D+13   R2 =   0.1067152617479D+04
     ISTATE -5 - shortening step at time   39075.251015438211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1264006004920D+13   R2 =   0.1628079557893D+03
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1320215469651D+13   R2 =   0.2075152261838D+04
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1322638607800D+13   R2 =   0.4290915992991D+04
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1325768667970D+13   R2 =   0.1053877337899D+04
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1325803437974D+13   R2 =   0.4524165610843D+03
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1325819824140D+13   R2 =   0.3345396151969D+03
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1325854585133D+13   R2 =   0.3846321050433D+03
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1337344226105D+13   R2 =   0.6687356835834D+04
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1339065591424D+13   R2 =   0.1814895841565D+04
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1339069680631D+13   R2 =   0.1282934243070D-05
     ISTATE -5 - shortening step at time   39913.150839444461      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1403140485230D+13   R2 =   0.2690477165865D+04
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1403218905839D+13   R2 =   0.4764996380729D+03
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1407374921021D+13   R2 =   0.2057084203205D+04
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1407409110702D+13   R2 =   0.6209529186130D+03
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1407443293385D+13   R2 =   0.3798994455489D+03
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1407454401507D+13   R2 =   0.2933303759846D+02
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1407550089025D+13   R2 =   0.7247630925017D+03
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1408579192576D+13   R2 =   0.3748838798061D-05
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1408584642631D+13   R2 =   0.1439329157766D+02
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1409520142748D+13   R2 =   0.6457343188352D+03
     ISTATE -5 - shortening step at time   42375.622804766033      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412155750087D+13   R2 =   0.1006805914997D+03
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412259208186D+13   R2 =   0.6295071476292D+03
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412265710705D+13   R2 =   0.1849360467726D+03
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412533644994D+13   R2 =   0.6310482079649D+03
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412622817197D+13   R2 =   0.6636870796297D+03
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1412674280710D+13   R2 =   0.4466792105456D+03
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1463010163602D+13   R2 =   0.1338723210977D+04
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1486525739333D+13   R2 =   0.8954021083190D+04
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503658269494D+13   R2 =   0.6627538675922D+04
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1504056854674D+13   R2 =   0.1376174227085D+04
     ISTATE -5 - shortening step at time   44605.067808495442      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506381423744D+13   R2 =   0.5364024658856D+02
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506480131515D+13   R2 =   0.7024523521389D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506485519606D+13   R2 =   0.1663817819575D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506787486981D+13   R2 =   0.7100743897424D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506802242178D+13   R2 =   0.3399535503025D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506817323923D+13   R2 =   0.4834581061865D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506995765671D+13   R2 =   0.5078308353995D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1507003129330D+13   R2 =   0.1938802073916D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1507022567244D+13   R2 =   0.5666195936122D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1507105356377D+13   R2 =   0.4347895543558D+03
     ISTATE -5 - shortening step at time   47596.735907412760      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1555322134142D+13   R2 =   0.1113631816821D+05
     ISTATE -5 - shortening step at time   47693.207480279161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1555339594300D+13   R2 =   0.2752911578664D+03
     ISTATE -5 - shortening step at time   47693.207480279161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1555437831248D+13   R2 =   0.2521491127451D-05
     ISTATE -5 - shortening step at time   47693.207480279161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1555455291859D+13   R2 =   0.3110336515205D+03
     ISTATE -5 - shortening step at time   47693.207480279161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1555582297780D+13   R2 =   0.7128038445692D+03
     ISTATE -5 - shortening step at time   47693.207480279161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1729243021499D+13   R2 =   0.5816577169279D+04
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1729398755023D+13   R2 =   0.4714373775533D+03
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1729430906777D+13   R2 =   0.5568761832230D+03
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1730525577192D+13   R2 =   0.2895461815802D+04
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030567916391D+10
     ISTATE -1: Reducing time step to    2.5413123283520695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1785424749560D+13   R2 =   0.4485177188854D-07
     ISTATE -5 - shortening step at time   56500.252163716024      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1734532385623D+13   R2 =   0.4158082966109D+03
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1734550650321D+13   R2 =   0.4124770650986D+03
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1734712249950D+13   R2 =   0.4936398163160D+03
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1785514056105D+13   R2 =   0.2151095060327D-05
     ISTATE -5 - shortening step at time   56500.252163716024      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1785521509103D+13   R2 =   0.5971265267628D-05
     ISTATE -5 - shortening step at time   56500.252163716024      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1785805503848D+13   R2 =   0.1105571773083D+03
     ISTATE -5 - shortening step at time   56500.252163716024      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739452060837D+13   R2 =   0.1898268064529D+03
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1785819433324D+13   R2 =   0.5407868463156D+02
     ISTATE -5 - shortening step at time   56500.252163716024      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739602499343D+13   R2 =   0.5041258363115D+03
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739956108307D+13   R2 =   0.2304596475179D+04
     ISTATE -5 - shortening step at time   52462.529365401751      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741809019673D+13   R2 =   0.2231162895065D-08
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741927284054D+13   R2 =   0.1545840905554D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742021566837D+13   R2 =   0.1420536701425D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742024735433D+13   R2 =   0.6361419339118D+02
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742064999677D+13   R2 =   0.3097350551415D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742071605489D+13   R2 =   0.2267925025423D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742077208534D+13   R2 =   0.1300279617146D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742082793591D+13   R2 =   0.1106297570067D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742095666363D+13   R2 =   0.4419392292146D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1742447582997D+13   R2 =   0.7518805999500D+03
     ISTATE -5 - shortening step at time   55061.902161624181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1744312055442D+13   R2 =   0.2213843062183D+03
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1751261588617D+13   R2 =   0.2613284981576D+04
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1752457532188D+13   R2 =   0.1326858443898D+04
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1752488997839D+13   R2 =   0.2794027043668D+03
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1752492245867D+13   R2 =   0.8181818081537D-06
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1753790499556D+13   R2 =   0.1575872334148D+04
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1753796332270D+13   R2 =   0.2002502625452D+03
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1753824255743D+13   R2 =   0.3078800528460D+03
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1753851074689D+13   R2 =   0.3890977802214D+03
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1753856486222D+13   R2 =   0.1429156088374D+02
     ISTATE -5 - shortening step at time   55140.746297380472      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1755497055379D+13   R2 =   0.1942581617824D+03
     ISTATE -5 - shortening step at time   55501.787538666518      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1931814348995D+13   R2 =   0.2108864126599D+03
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2052874063037D+13   R2 =   0.6931740785748D+04
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2052905277348D+13   R2 =   0.3593404643265D+03
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2053668414030D+13   R2 =   0.1387729826909D+04
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2053699639072D+13   R2 =   0.3940381280935D+03
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2053702760266D+13   R2 =   0.7191589994865D+02
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2053731350786D+13   R2 =   0.6474916676588D+03
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2054257533348D+13   R2 =   0.1096481557705D+04
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2054446484652D+13   R2 =   0.6013474020131D+03
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2054449613474D+13   R2 =   0.7365438740602D+02
     ISTATE -5 - shortening step at time   61051.967615798902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056204008647D+13   R2 =   0.1412385427687D+03
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056207277585D+13   R2 =   0.8874752228903D+02
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056251055394D+13   R2 =   0.3341623979846D+03
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056282753321D+13   R2 =   0.3072818917488D+03
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056290629088D+13   R2 =   0.4718584485590D-06
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056379427633D+13   R2 =   0.2924401484264D+03
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056399750357D+13   R2 =   0.2411123749230D+03
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056460999622D+13   R2 =   0.6706815160236D+03
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056463169690D+13   R2 =   0.5731026436021D+01
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2056466950924D+13   R2 =   0.2077784550672D-06
     ISTATE -5 - shortening step at time   65014.228274500252      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2122927815354D+13   R2 =   0.9193473538449D+03
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2134737466726D+13   R2 =   0.2052849892644D+04
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2165768134329D+13   R2 =   0.3122698025502D+04
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2165893973771D+13   R2 =   0.8471095458796D+03
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2166075406715D+13   R2 =   0.9804314057275D+03
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2166274511406D+13   R2 =   0.1415205310353D+04
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030570265692D+10
     ISTATE -1: Reducing time step to    2.5413048938552212      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2166284523485D+13   R2 =   0.2643869774789D+02
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2166290343650D+13   R2 =   0.1537073374560D+02
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2166308251866D+13   R2 =   0.2388866207423D+03
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2166402010123D+13   R2 =   0.2401666677897D+03
     ISTATE -5 - shortening step at time   65078.068067227287      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168080336457D+13   R2 =   0.1450900350967D+03
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168085501024D+13   R2 =   0.1200176015977D-05
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168095593124D+13   R2 =   0.2287157072994D+03
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168102189994D+13   R2 =   0.2264854823837D+03
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168181875006D+13   R2 =   0.2639759228415D+03
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168185454806D+13   R2 =   0.6163428849937D+02
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168187843846D+13   R2 =   0.3180335388829D-05
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168595125317D+13   R2 =   0.7773675356422D+03
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168632775176D+13   R2 =   0.3434048027757D+03
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2168634115506D+13   R2 =   0.3856142945335D+02
     ISTATE -5 - shortening step at time   68557.025636793580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2387012888903D+13   R2 =   0.5162585826086D-08
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2387910807770D+13   R2 =   0.1141340387053D+04
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388025146317D+13   R2 =   0.6354994352199D+03
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388043722215D+13   R2 =   0.6377528863131D+02
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388055765877D+13   R2 =   0.1244059089231D+03
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388157125223D+13   R2 =   0.6423490534514D+03
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388175740329D+13   R2 =   0.1263307547735D+03
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388191640348D+13   R2 =   0.1241446420368D+03
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388229766561D+13   R2 =   0.4935335538583D+03
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388248393407D+13   R2 =   0.2032825260656D+03
     ISTATE -5 - shortening step at time   75490.429707609495      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030572693058D+10
     ISTATE -1: Reducing time step to    2.5412972123171707      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2499952880282D+13   R2 =   0.8717127768123D+03
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2499974583863D+13   R2 =   0.2569523498307D+03
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2500242897354D+13   R2 =   0.2677940037421D+03
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2500247883117D+13   R2 =   0.2287039743704D-05
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2506313617908D+13   R2 =   0.8979588225116D+03
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2506523444877D+13   R2 =   0.3248156361561D+03
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2506530992011D+13   R2 =   0.5730498320219D-06
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2506725546219D+13   R2 =   0.1516778344982D+04
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2506733526345D+13   R2 =   0.1896716492047D+02
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2506739694565D+13   R2 =   0.1628993021506D+02
     ISTATE -5 - shortening step at time   75577.480804028484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2508535086161D+13   R2 =   0.4447370880305D+03
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2508558876068D+13   R2 =   0.2045387089546D+03
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2508583341477D+13   R2 =   0.5392151439220D+03
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2508589239243D+13   R2 =   0.2024836500740D+03
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2508593599636D+13   R2 =   0.1110682366573D-05
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2518507856477D+13   R2 =   0.4658695034663D+03
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2518511693393D+13   R2 =   0.3582695872674D-05
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2518514738776D+13   R2 =   0.1433078837249D-05
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2518773220979D+13   R2 =   0.7391082767333D+03
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2518880275737D+13   R2 =   0.5835944312573D+03
     ISTATE -5 - shortening step at time   79327.205524200210      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030574923875D+10
     ISTATE -1: Reducing time step to    2.5412901527706939      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2802423770271D+13   R2 =   0.4908723565005D+04
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2809502542307D+13   R2 =   0.1477051830939D+04
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2878869605877D+13   R2 =   0.4308416405941D+03
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2878892901230D+13   R2 =   0.2742701877030D+03
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2878999872405D+13   R2 =   0.1387271524550D+04
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2879029352925D+13   R2 =   0.4999068818692D+03
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2879812270690D+13   R2 =   0.1201096036812D+04
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3029561601731D+13   R2 =   0.5578048161238D+04
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3031116482875D+13   R2 =   0.1748268572691D+04
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3032132157063D+13   R2 =   0.1660989482221D+04
     ISTATE -5 - shortening step at time   87682.543144475683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3033155822264D+13   R2 =   0.1564579096212D-07
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3033284174813D+13   R2 =   0.3877975541498D+03
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3033470042600D+13   R2 =   0.1227626257639D-06
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3036202025069D+13   R2 =   0.3625300853727D+04
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3036370668362D+13   R2 =   0.1002657257560D+04
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3036373555368D+13   R2 =   0.9908488593015D+02
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3036432318139D+13   R2 =   0.5977806233219D+03
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3036461163189D+13   R2 =   0.9902835365736D+03
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3036527856822D+13   R2 =   0.1444098352297D+03
     ISTATE -5 - shortening step at time   95953.549274141798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3036530741572D+13   R2 =   0.9204730824388D+02
     ISTATE -5 - shortening step at time   95953.549274141798      years
    [Parallel(n_jobs=4)]: Done   7 out of   9 | elapsed:  4.1min remaining:  1.2min
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030577399843D+10
     ISTATE -1: Reducing time step to    2.5412823174259245      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4911825666678D+11
     ISTATE -1: Reducing time step to    15.529740550745387      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7264661320810D+11   R2 =   0.1280142131170D+03
     ISTATE -5 - shortening step at time   2275.5743974220891      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7326487494500D+11   R2 =   0.1521499317980D-04
     ISTATE -5 - shortening step at time   2275.5743974220891      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7332020487370D+11   R2 =   0.5843336066055D+03
     ISTATE -5 - shortening step at time   2275.5743974220891      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7338108582434D+11   R2 =   0.2571517407805D-04
     ISTATE -5 - shortening step at time   2275.5743974220891      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7342616950753D+11   R2 =   0.4411204437030D+03
     ISTATE -5 - shortening step at time   2275.5743974220891      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7403638742892D+11   R2 =   0.2498312590511D-04
     ISTATE -5 - shortening step at time   2275.5743974220891      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7955783628854D+11   R2 =   0.4147174838679D-06
     ISTATE -5 - shortening step at time   2503.1318914182193      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8759200448996D+11   R2 =   0.2425746681286D+03
     ISTATE -5 - shortening step at time   2753.4451402393565      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8842788182866D+11   R2 =   0.5967989659868D-05
     ISTATE -5 - shortening step at time   2753.4451402393565      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8848093818622D+11   R2 =   0.4985878652954D+02
     ISTATE -5 - shortening step at time   2753.4451402393565      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8897330064524D+11   R2 =   0.1246676543205D+04
     ISTATE -5 - shortening step at time   2753.4451402393565      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8900576810455D+11   R2 =   0.4538649983327D-04
     ISTATE -5 - shortening step at time   2753.4451402393565      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9622048692613D+11   R2 =   0.3861264862983D-06
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9628316216079D+11   R2 =   0.8422479617967D+02
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9635022843725D+11   R2 =   0.1518758669142D-04
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9640553127398D+11   R2 =   0.3518815720454D+02
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9667440736934D+11   R2 =   0.5699545617023D-05
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9672046719296D+11   R2 =   0.1620886358847D-04
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9682219704838D+11   R2 =   0.1220612857108D-04
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9793265198435D+11   R2 =   0.9662127054299D+03
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9800322079733D+11   R2 =   0.3664068695717D+03
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9809914743879D+11   R2 =   0.3117133558833D-04
     ISTATE -5 - shortening step at time   3028.7897199105400      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1083719552833D+12   R2 =   0.6099889020886D-07
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1084803361304D+12   R2 =   0.4248660200025D-04
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1086088898691D+12   R2 =   0.7735783427766D-05
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1087308361318D+12   R2 =   0.4943648530402D-04
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1087995921872D+12   R2 =   0.3616763257848D+03
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1090231857022D+12   R2 =   0.6596509142411D+03
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1091719917094D+12   R2 =   0.1954940238686D+02
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1092809326291D+12   R2 =   0.6511792023143D+03
     ISTATE -5 - shortening step at time   3414.8438139727828      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1190740120259D+12   R2 =   0.4656807803986D-05
     ISTATE -5 - shortening step at time   3756.3282767862820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1191177477008D+12   R2 =   0.1202616440630D-04
     ISTATE -5 - shortening step at time   3756.3282767862820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1316274103603D+12   R2 =   0.2589435806997D-05
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1316605424951D+12   R2 =   0.1479689319208D+03
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319788241261D+12   R2 =   0.4536371159028D-05
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1322141198268D+12   R2 =   0.5062085310776D-05
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1322686891360D+12   R2 =   0.2301432148679D-03
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323222473752D+12   R2 =   0.4069391388435D+03
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1324127288933D+12   R2 =   0.5432666857941D+03
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1332969323265D+12   R2 =   0.5062745179533D+03
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1338843917719D+12   R2 =   0.2604871391964D-04
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1339322181804D+12   R2 =   0.2185058467198D+03
     ISTATE -5 - shortening step at time   4131.9611940227551      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1341919192706D+12   R2 =   0.7412385864847D-05
     ISTATE -5 - shortening step at time   4238.3613348219806      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345430594133D+12   R2 =   0.8009415867894D-04
     ISTATE -5 - shortening step at time   4238.3613348219806      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1354537080817D+12   R2 =   0.7049858281674D+03
     ISTATE -5 - shortening step at time   4238.3613348219806      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1355042671237D+12   R2 =   0.1338798948051D-03
     ISTATE -5 - shortening step at time   4238.3613348219806      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1356204739174D+12   R2 =   0.6096784961887D-05
     ISTATE -5 - shortening step at time   4238.3613348219806      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1473281487902D+12   R2 =   0.1459397400290D-06
     ISTATE -5 - shortening step at time   4662.1975693545874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1557594447148D+12   R2 =   0.1271245694446D-04
     ISTATE -5 - shortening step at time   4662.1975693545874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1611097574385D+12   R2 =   0.1262926316284D-04
     ISTATE -5 - shortening step at time   4662.1975693545874      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1628094574670D+12   R2 =   0.1186255678696D-04
     ISTATE -5 - shortening step at time   5128.4174374454979      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1630950090171D+12   R2 =   0.3097556507446D-05
     ISTATE -5 - shortening step at time   5128.4174374454979      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1631793433254D+12   R2 =   0.4460344583622D-05
     ISTATE -5 - shortening step at time   5128.4174374454979      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1650242789206D+12   R2 =   0.1409858719123D+03
     ISTATE -5 - shortening step at time   5128.4174374454979      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1650921266658D+12   R2 =   0.2079812575552D-04
     ISTATE -5 - shortening step at time   5128.4174374454979      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2036141216257D+12   R2 =   0.1966986884507D-03
     ISTATE -5 - shortening step at time   6205.3853683052548      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2159250181801D+12   R2 =   0.1001115199657D-05
     ISTATE -5 - shortening step at time   6825.9240530836969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2214926180119D+12   R2 =   0.3417571890212D-03
     ISTATE -5 - shortening step at time   6825.9240530836969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2219268590174D+12   R2 =   0.5330975188602D+03
     ISTATE -5 - shortening step at time   6825.9240530836969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277257266388D+12   R2 =   0.1535233545544D+04
     ISTATE -5 - shortening step at time   6825.9240530836969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314397145098D+12   R2 =   0.1095036816687D-04
     ISTATE -5 - shortening step at time   6825.9240530836969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2337397320201D+12   R2 =   0.1967752332404D-04
     ISTATE -5 - shortening step at time   6825.9240530836969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2358832137198D+12   R2 =   0.1086658837540D+04
     ISTATE -5 - shortening step at time   6825.9240530836969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2374600748501D+12   R2 =   0.7705167809165D-07
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2398323073013D+12   R2 =   0.2083413916612D-04
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2408121635089D+12   R2 =   0.7400513839045D+02
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2423782038012D+12   R2 =   0.1810386409231D-04
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2425906338472D+12   R2 =   0.1715185347134D-04
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2481104411996D+12   R2 =   0.3316404323477D+03
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2483537286477D+12   R2 =   0.2537311118784D+03
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2498776993600D+12   R2 =   0.9321908709964D-05
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2499479722997D+12   R2 =   0.1311447438770D+03
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2510217124673D+12   R2 =   0.5167663502522D+03
     ISTATE -5 - shortening step at time   7508.5166211347778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2762940517251D+12   R2 =   0.2784817265790D-06
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2767224254213D+12   R2 =   0.4403912428394D+03
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2767788168940D+12   R2 =   0.4961400121172D+02
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2769384178359D+12   R2 =   0.3246385806686D+03
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793675587660D+12   R2 =   0.2901783084852D-04
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797752957083D+12   R2 =   0.7265929784619D+03
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798588066424D+12   R2 =   0.1323754573787D-04
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2803632668199D+12   R2 =   0.5574070251275D-04
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2808208508698D+12   R2 =   0.1047955962111D-03
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2836037227708D+12   R2 =   0.3389418963274D+03
     ISTATE -5 - shortening step at time   8738.0977752810504      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2837064802956D+12   R2 =   0.1692164887079D-05
     ISTATE -5 - shortening step at time   8974.8013535056216      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2838662976090D+12   R2 =   0.1584381899075D+03
     ISTATE -5 - shortening step at time   8974.8013535056216      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2839301854993D+12   R2 =   0.1448840312972D+03
     ISTATE -5 - shortening step at time   8974.8013535056216      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3205509433844D+12   R2 =   0.1650735793780D+03
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3207049954768D+12   R2 =   0.6644228315200D-05
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3221592009346D+12   R2 =   0.1633458926175D+03
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3229423140293D+12   R2 =   0.3671321660891D+03
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3230879821753D+12   R2 =   0.2956339952113D+03
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3231115952104D+12   R2 =   0.1334439622022D+03
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3231316139780D+12   R2 =   0.3630211179776D-05
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3231958565637D+12   R2 =   0.3782332150728D-04
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3245327843094D+12   R2 =   0.1633754648191D+03
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3246309489228D+12   R2 =   0.4711810426290D+02
     ISTATE -5 - shortening step at time   9872.2817028321224      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3264035159385D+12   R2 =   0.2899715732505D+03
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3265930030928D+12   R2 =   0.1800438875868D+03
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3266554010542D+12   R2 =   0.1618295179090D+03
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3272182760327D+12   R2 =   0.1582607531355D+03
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3276009923510D+12   R2 =   0.3142059369845D+03
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3314137512451D+12   R2 =   0.5502330522614D+03
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1897266784050D+13
     ISTATE -1: Reducing time step to    211.01906557390024      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1897278828007D+13   R2 =   0.3016899356717D-05
     ISTATE -5 - shortening step at time   56500.252163716024      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3316194825170D+12   R2 =   0.9204332823955D-05
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3318363388733D+12   R2 =   0.1452140412022D+03
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3319398011477D+12   R2 =   0.1396393922389D-04
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3323643047128D+12   R2 =   0.9942399108871D-05
     ISTATE -5 - shortening step at time   10273.131295023742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3387421271852D+12   R2 =   0.1097872777725D-04
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1963976141664D+13   R2 =   0.3034244847262D-07
     ISTATE -5 - shortening step at time   62150.278727158613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3388455982138D+12   R2 =   0.1267641863417D-04
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3389598809459D+12   R2 =   0.1386577153250D+03
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3390214346129D+12   R2 =   0.1563722861101D-04
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3390516541724D+12   R2 =   0.3939086998815D+03
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3391154253193D+12   R2 =   0.1539120510232D-03
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3391376808145D+12   R2 =   0.1427426002392D-05
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3392268870395D+12   R2 =   0.6034105711994D-05
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3393404565247D+12   R2 =   0.1467854539898D+03
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3393829496170D+12   R2 =   0.3381436753299D-04
     ISTATE -5 - shortening step at time   10517.857744075454      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3394939059427D+12   R2 =   0.5156404675011D-06
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3414032493990D+12   R2 =   0.2025108333119D+03
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3436266933453D+12   R2 =   0.1428613212778D-04
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3436891327423D+12   R2 =   0.1411196255069D+03
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1984099718601D+13   R2 =   0.1719998497949D+03
     ISTATE -5 - shortening step at time   62150.278727158613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3437923205221D+12   R2 =   0.1298533010037D-04
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3440926489073D+12   R2 =   0.5233074160619D+02
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3445533890013D+12   R2 =   0.2166844028825D+03
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1984109352847D+13   R2 =   0.2399382454897D-05
     ISTATE -5 - shortening step at time   62150.278727158613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3446183021826D+12   R2 =   0.1012078269130D-04
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3457627430583D+12   R2 =   0.4401868812898D-05
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3459425152418D+12   R2 =   0.1437528143303D+03
     ISTATE -5 - shortening step at time   10739.966760030709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1984782401610D+13   R2 =   0.5285393483250D+02
     ISTATE -5 - shortening step at time   62150.278727158613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3461338854980D+12   R2 =   0.3028296822783D+02
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3466885865705D+12   R2 =   0.1560831180522D+03
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3470405775208D+12   R2 =   0.4696767910913D+03
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3478486082629D+12   R2 =   0.1252594521628D+03
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3479636161989D+12   R2 =   0.2235115778627D-05
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3509576462235D+12   R2 =   0.3060773367550D-04
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3509753227662D+12   R2 =   0.5401645967857D+02
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3510049111693D+12   R2 =   0.2296913167742D-04
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3520574219710D+12   R2 =   0.1534752897702D+03
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3526491590515D+12   R2 =   0.1532907634170D+03
     ISTATE -5 - shortening step at time   10947.547950689142      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3620006890607D+12   R2 =   0.8271644999142D-06
     ISTATE -5 - shortening step at time   11159.783514289484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3787718996833D+12   R2 =   0.4859567077724D+03
     ISTATE -5 - shortening step at time   11159.783514289484      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3880311684590D+12   R2 =   0.8977999473626D-06
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3973702920880D+12   R2 =   0.1112538847069D-04
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3975058631020D+12   R2 =   0.1788214585968D+03
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4005404012609D+12   R2 =   0.1850437887378D+02
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4069051737948D+12   R2 =   0.1271845626090D+03
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4073811855624D+12   R2 =   0.4701623116407D+03
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4091140117708D+12   R2 =   0.5362225281573D+03
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4094065781142D+12   R2 =   0.1634135014456D+03
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4109647913413D+12   R2 =   0.4554039457548D+02
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4168019646647D+12   R2 =   0.5349365175860D+03
     ISTATE -5 - shortening step at time   12275.762131788404      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4257347240276D+12   R2 =   0.6652522359377D-04
     ISTATE -5 - shortening step at time   13189.935590656420      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4257903015511D+12   R2 =   0.3220613672628D+03
     ISTATE -5 - shortening step at time   13189.935590656420      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5044967967002D+12   R2 =   0.1540644707963D-06
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5084878857259D+12   R2 =   0.1508455108286D+03
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5093563747089D+12   R2 =   0.3312611477181D-05
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5096320005857D+12   R2 =   0.1730977842855D+02
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5305798690099D+12   R2 =   0.2588520124401D-05
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5306051104712D+12   R2 =   0.1934881477016D+03
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5308559831802D+12   R2 =   0.5067129316045D+02
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5310023699524D+12   R2 =   0.3117385264340D-05
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5385808099569D+12   R2 =   0.4943998787188D+02
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5386575698202D+12   R2 =   0.1797908731959D+03
     ISTATE -5 - shortening step at time   15959.822756533931      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5387305234569D+12   R2 =   0.3966777214040D+01
     ISTATE -5 - shortening step at time   17046.125627222766      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2160346210764D+13   R2 =   0.7633498404510D-07
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5467264685829D+12   R2 =   0.5872640528232D+03
     ISTATE -5 - shortening step at time   17046.125627222766      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2179642562255D+13   R2 =   0.9129866167660D+02
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5925899927515D+12   R2 =   0.8659177867433D+01
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5926645847900D+12   R2 =   0.5676817062426D+02
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5929575460295D+12   R2 =   0.8520748796165D+02
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2179757505971D+13   R2 =   0.3176031666481D-06
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5930322547877D+12   R2 =   0.9581178892893D+02
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2179777026635D+13   R2 =   0.2158559670361D+03
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5932986426288D+12   R2 =   0.7057651650242D+02
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5942073657917D+12   R2 =   0.6916722050733D+02
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2179807111920D+13   R2 =   0.6062995821047D-06
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5953465626672D+12   R2 =   0.2707438586208D+03
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5953803053344D+12   R2 =   0.4476819866850D+03
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2182684681674D+13   R2 =   0.1035661870940D-04
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6120818212015D+12   R2 =   0.1013994158773D-05
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2182784536541D+13   R2 =   0.1271793124054D+03
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6140108681224D+12   R2 =   0.9764402698527D+02
     ISTATE -5 - shortening step at time   18750.738596356347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184272847801D+13   R2 =   0.1200696418306D+03
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2184286208836D+13   R2 =   0.2590184058394D+02
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2185609668318D+13   R2 =   0.1785222847246D+03
     ISTATE -5 - shortening step at time   68365.308081652591      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2228110838710D+13   R2 =   0.1692989309561D+03
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2228125364606D+13   R2 =   0.3324630928989D+03
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2229077543246D+13   R2 =   0.1614542625386D-05
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2229214890517D+13   R2 =   0.4469491057111D+02
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2229220968337D+13   R2 =   0.1615429268200D+02
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2229754572662D+13   R2 =   0.2175905542604D+02
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2229845003773D+13   R2 =   0.5423603214377D+02
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2231444001501D+13   R2 =   0.1988525691414D-05
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2231491845411D+13   R2 =   0.3343535011598D-05
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2238210479612D+13   R2 =   0.1883274489030D-05
     ISTATE -5 - shortening step at time   69164.862921454114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2259902898494D+13   R2 =   0.9148388377407D-05
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2271626706657D+13   R2 =   0.3224670299374D-06
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6754575174448D+12   R2 =   0.2073376327408D-06
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6755313360836D+12   R2 =   0.3775046413667D+02
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2271631903511D+13   R2 =   0.7227111893624D-06
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6791134608920D+12   R2 =   0.6342783217511D-05
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2273800654857D+13   R2 =   0.2629484704337D+02
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274058622275D+13   R2 =   0.2342786965966D+02
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274065139073D+13   R2 =   0.3458487151256D-05
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6803649524784D+12   R2 =   0.4524337730866D-06
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274115792620D+13   R2 =   0.2512361933998D+02
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6810846773305D+12   R2 =   0.8910525648476D+02
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274142249896D+13   R2 =   0.1332013602461D+02
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6812402933221D+12   R2 =   0.7855729117597D+02
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274145118557D+13   R2 =   0.1075516062512D-04
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6814995160469D+12   R2 =   0.5369960166435D-05
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274150004001D+13   R2 =   0.5381131764777D-05
     ISTATE -5 - shortening step at time   70829.445557355502      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274162728522D+13   R2 =   0.1032187414288D+01
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6816274400383D+12   R2 =   0.1435787624871D-05
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6816933001474D+12   R2 =   0.1780608434754D+02
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6854338761477D+12   R2 =   0.1170588787434D+03
     ISTATE -5 - shortening step at time   21373.796505500850      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2279918072692D+13   R2 =   0.5862525598100D+02
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2279922540936D+13   R2 =   0.9761008953524D+01
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2280041282276D+13   R2 =   0.2642381640803D+02
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2280096135404D+13   R2 =   0.5264196244596D+01
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6893629217990D+12   R2 =   0.3452009213230D-05
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6894276126154D+12   R2 =   0.4315638608843D-05
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6894965001472D+12   R2 =   0.8817276544155D+02
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6895816895595D+12   R2 =   0.5827985676344D+02
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6905273603658D+12   R2 =   0.5095428814502D-05
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2285333003111D+13   R2 =   0.1602783021439D-06
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2285340521270D+13   R2 =   0.1222401957286D+02
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6962299039371D+12   R2 =   0.2384738144084D+03
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6962630005729D+12   R2 =   0.7032226360371D+02
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2285349902423D+13   R2 =   0.5339354034168D-06
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6963815402263D+12   R2 =   0.2007913552066D+03
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6969315957381D+12   R2 =   0.1173553475953D-04
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2291090176744D+13   R2 =   0.2438885883343D+02
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6970088760123D+12   R2 =   0.1089839133786D-04
     ISTATE -5 - shortening step at time   21690.945447711732      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2292332725958D+13   R2 =   0.2881181771275D+02
     ISTATE -5 - shortening step at time   71966.772278505901      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7175607167491D+12   R2 =   0.3844798438863D-05
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7176035083516D+12   R2 =   0.3967787996752D+02
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7201260435903D+12   R2 =   0.5370556914339D-05
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7201676266444D+12   R2 =   0.7413725020916D+02
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2312151535630D+13   R2 =   0.9400972947252D+01
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2312276467242D+13   R2 =   0.8071803298817D-06
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7203217343364D+12   R2 =   0.1047416221621D-04
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7204189898743D+12   R2 =   0.7236725881666D+02
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2312369038711D+13   R2 =   0.3086314127162D+02
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2312378220462D+13   R2 =   0.3104997380164D+02
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2312462036321D+13   R2 =   0.2434763392158D+02
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7204869343152D+12   R2 =   0.1353226131369D-04
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2312539378234D+13   R2 =   0.5520084144631D+01
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7211199881827D+12   R2 =   0.8612642206620D+02
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2312937857273D+13   R2 =   0.8323084925295D-06
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7255255587824D+12   R2 =   0.3565449784733D+02
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313027761983D+13   R2 =   0.2342309089508D+02
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7257093544489D+12   R2 =   0.2307821793408D+03
     ISTATE -5 - shortening step at time   22057.242911782494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313040072279D+13   R2 =   0.4240249543090D+02
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7257528760031D+12   R2 =   0.6962341633390D+01
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313410131634D+13   R2 =   0.2297675861500D+02
     ISTATE -5 - shortening step at time   72542.174872081567      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7258719392619D+12   R2 =   0.3549928707220D+00
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7259468810473D+12   R2 =   0.7921437615222D+02
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7262117449027D+12   R2 =   0.3133187121334D+03
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7262359666519D+12   R2 =   0.4952567402699D+02
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313425730747D+13   R2 =   0.3518131763156D-07
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7273216282970D+12   R2 =   0.1921942183423D+03
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313443973549D+13   R2 =   0.3586107950478D-06
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313463098746D+13   R2 =   0.6130611385866D+02
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7273781887097D+12   R2 =   0.7486371578760D-05
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313478340066D+13   R2 =   0.4126806517497D-06
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7306675843584D+12   R2 =   0.1201905583448D+03
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7308105866741D+12   R2 =   0.1215598112665D+03
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313502437756D+13   R2 =   0.4967175754063D-05
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313516781453D+13   R2 =   0.2246744675851D+02
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313522517242D+13   R2 =   0.1990779803260D+02
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313554559560D+13   R2 =   0.1961833660842D+02
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7308714956268D+12   R2 =   0.1963339614456D-05
     ISTATE -5 - shortening step at time   22965.485900282820      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313627752933D+13   R2 =   0.2960848985312D+02
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7415655963596D+12   R2 =   0.4177374341040D+02
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313809266386D+13   R2 =   0.1948568630211D-06
     ISTATE -5 - shortening step at time   73209.181380825525      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314029473275D+13   R2 =   0.8124915544857D+02
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7425319513054D+12   R2 =   0.7806123001038D+02
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7426619298143D+12   R2 =   0.1232857815153D+03
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314167985455D+13   R2 =   0.9196285734954D-06
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7443037822655D+12   R2 =   0.1164731692678D+03
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314265860347D+13   R2 =   0.2038515035295D-05
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7514780597808D+12   R2 =   0.7400372966382D+02
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7516672852906D+12   R2 =   0.1912356233870D+03
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315556074893D+13   R2 =   0.1341351590232D-05
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315573249509D+13   R2 =   0.2813655313067D+02
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7532428916955D+12   R2 =   0.8739765975197D-05
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315577654800D+13   R2 =   0.3286688529032D-05
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7533179380716D+12   R2 =   0.6677025973335D-05
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2315746281470D+13   R2 =   0.7396582557575D-06
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7618659319529D+12   R2 =   0.1673551743045D-04
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2356689078217D+13   R2 =   0.5522117072140D-06
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7619481702885D+12   R2 =   0.2112824369460D-05
     ISTATE -5 - shortening step at time   23128.844798316524      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2356723213896D+13   R2 =   0.2243667710687D-06
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2359760772711D+13   R2 =   0.2424947642471D-06
     ISTATE -5 - shortening step at time   73221.812227417118      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7720168339124D+12   R2 =   0.4482715386222D-05
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2360190095038D+13   R2 =   0.6704494923328D+02
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361276704827D+13   R2 =   0.3165071380089D+02
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7721908952103D+12   R2 =   0.2088300218776D-05
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361336461339D+13   R2 =   0.2227686533774D+02
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361344564581D+13   R2 =   0.3889452053587D+01
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7728177354051D+12   R2 =   0.1035986865641D-04
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361370327900D+13   R2 =   0.1247844611700D+02
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7730225945222D+12   R2 =   0.7646721136450D+02
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7730595926439D+12   R2 =   0.8249952495663D+02
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361492572261D+13   R2 =   0.6034676882822D+01
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361501868937D+13   R2 =   0.2930623803695D+02
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7732851136587D+12   R2 =   0.8999148657421D+02
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361509217671D+13   R2 =   0.3757789832848D+01
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361532910088D+13   R2 =   0.5029470968148D+01
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361541160819D+13   R2 =   0.2207634331315D+02
     ISTATE -5 - shortening step at time   74675.973819978899      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7734164703750D+12   R2 =   0.7988388591350D-05
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7735580499928D+12   R2 =   0.3987797891580D+02
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2361550493204D+13   R2 =   0.4091133372985D-06
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7738311523762D+12   R2 =   0.1697763376953D-05
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2368716071353D+13   R2 =   0.3503235103481D+01
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2368772329667D+13   R2 =   0.2310153125964D+02
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370526240131D+13   R2 =   0.9457534989648D+01
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7749119180674D+12   R2 =   0.9203508047874D-05
     ISTATE -5 - shortening step at time   24112.283869890383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370584036780D+13   R2 =   0.5822399427625D-06
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370645933385D+13   R2 =   0.5335814855541D-06
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7892931858903D+12   R2 =   0.2825265052170D+03
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370654800130D+13   R2 =   0.1084687746989D+03
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370664788119D+13   R2 =   0.3118418402573D+02
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370711068428D+13   R2 =   0.1560063650361D+02
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2370741580020D+13   R2 =   0.1477496369714D+02
     ISTATE -5 - shortening step at time   74732.315215798066      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7910994589628D+12   R2 =   0.4024605409838D-05
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7912892852798D+12   R2 =   0.1287812112189D-04
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7924578995761D+12   R2 =   0.2303371702276D-04
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7947026988610D+12   R2 =   0.6694807161453D-05
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7954389177224D+12   R2 =   0.4019707636962D-05
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7956552780517D+12   R2 =   0.9024993528632D+02
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2619211264897D+13   R2 =   0.3476733949183D-06
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7959220313801D+12   R2 =   0.5879138240106D+02
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2621308871145D+13   R2 =   0.2781130838346D-06
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2621311339825D+13   R2 =   0.1358738921987D+02
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2621313842916D+13   R2 =   0.1601275259790D-06
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2621408849992D+13   R2 =   0.2362885207794D+02
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2621428598192D+13   R2 =   0.2322530939696D+02
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8092527650102D+12   R2 =   0.5315709466114D+02
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2621432982252D+13   R2 =   0.6599412388740D-06
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8092839930677D+12   R2 =   0.6581356685611D-05
     ISTATE -5 - shortening step at time   24522.529052764432      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2621449536627D+13   R2 =   0.7411446550441D+01
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8216367919808D+12   R2 =   0.5085925778963D+03
     ISTATE -5 - shortening step at time   25610.252945178920      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628200992221D+13   R2 =   0.2803500482439D-05
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628248658789D+13   R2 =   0.4354172735654D+02
     ISTATE -5 - shortening step at time   82525.816283060645      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628258924940D+13   R2 =   0.1402172856205D+01
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628335532271D+13   R2 =   0.1543861756482D-06
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628343140112D+13   R2 =   0.3156073698462D-05
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9024153730164D+12   R2 =   0.6385854043611D+03
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628345597501D+13   R2 =   0.1466509615945D-05
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9025203322530D+12   R2 =   0.6185089167844D-05
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628360312817D+13   R2 =   0.3165795043935D-05
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628486755255D+13   R2 =   0.6373954806667D+02
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9025891660173D+12   R2 =   0.7100205117739D-06
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628509553652D+13   R2 =   0.6277499312410D+01
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9040860449234D+12   R2 =   0.5567884789785D+02
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9041556536212D+12   R2 =   0.8346727559878D+02
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9046649523130D+12   R2 =   0.9272150331793D+02
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2628908596356D+13   R2 =   0.5165011257323D-05
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9047495069668D+12   R2 =   0.1481258680739D-05
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2629682684359D+13   R2 =   0.1435453241252D-05
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2629692945456D+13   R2 =   0.2147124245878D+02
     ISTATE -5 - shortening step at time   83172.425911051250      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9064030161036D+12   R2 =   0.1365777278273D-05
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9064450180451D+12   R2 =   0.8349321192525D+02
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2629702703200D+13   R2 =   0.1390092588874D-06
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9064642336070D+12   R2 =   0.8300530892646D+02
     ISTATE -5 - shortening step at time   28171.278850292823      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2629743981116D+13   R2 =   0.4626750346899D+02
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2634456151506D+13   R2 =   0.2800748693165D+02
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2634476524517D+13   R2 =   0.2627127227686D+02
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2634965980351D+13   R2 =   0.4381345710487D+02
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2634968698362D+13   R2 =   0.1727671778167D+02
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2635781583668D+13   R2 =   0.9047492101563D-05
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2635789420517D+13   R2 =   0.2650236364994D+03
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2638390083488D+13   R2 =   0.2379187528004D+02
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2638410264154D+13   R2 =   0.3694837414792D-05
     ISTATE -5 - shortening step at time   83218.131185314924      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2638421785742D+13   R2 =   0.4882278676371D-06
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2639087428334D+13   R2 =   0.9036433579406D-06
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9971634670847D+12   R2 =   0.2831076411066D-07
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9973564598714D+12   R2 =   0.1121134098089D+03
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2640306495243D+13   R2 =   0.5141998537602D-06
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9993615557535D+12   R2 =   0.2313495036168D+03
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2640355515671D+13   R2 =   0.7442985112750D+02
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2640359821845D+13   R2 =   0.3174172715356D-05
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2640370713113D+13   R2 =   0.4455993092600D-05
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1009480950095D+13   R2 =   0.1375751920582D+02
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1017087721833D+13   R2 =   0.2341046622724D+03
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2648166517477D+13   R2 =   0.1697409165779D-05
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1017475397969D+13   R2 =   0.2660839772384D+03
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2648174677961D+13   R2 =   0.1324021934839D+02
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1018064885489D+13   R2 =   0.8006689559753D+02
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1018293047066D+13   R2 =   0.3581789295928D-05
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1018312345809D+13   R2 =   0.4044537454061D+02
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1018362815773D+13   R2 =   0.7631054423462D+02
     ISTATE -5 - shortening step at time   31554.135398085982      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2651418116272D+13   R2 =   0.3851107554562D-05
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2651424091806D+13   R2 =   0.1469502726031D+03
     ISTATE -5 - shortening step at time   83493.995701077045      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1031958791176D+13   R2 =   0.2993134943034D+03
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1033696935565D+13   R2 =   0.2809452845547D+03
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1033714414899D+13   R2 =   0.1520709929985D-05
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1033728756061D+13   R2 =   0.6495279622613D+02
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1033769628147D+13   R2 =   0.8887474191666D+02
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1033819534774D+13   R2 =   0.8962890672197D+02
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1034136412123D+13   R2 =   0.1413230343884D-03
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1034171477101D+13   R2 =   0.6813396988322D+02
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1034238671496D+13   R2 =   0.1211156203524D+03
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1034402053003D+13   R2 =   0.3152215347504D+02
     ISTATE -5 - shortening step at time   32226.671385208534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916608500089D+13   R2 =   0.9364782581581D+01
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916636256085D+13   R2 =   0.8348107171118D+01
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916650260311D+13   R2 =   0.1957263517146D+02
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916669498609D+13   R2 =   0.2337161765528D+02
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916740095308D+13   R2 =   0.4220127793204D+02
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916758301669D+13   R2 =   0.1653796505290D+02
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916760930594D+13   R2 =   0.5766084102396D+01
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916762854923D+13   R2 =   0.5768052659074D-06
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916766688317D+13   R2 =   0.7399521168988D-06
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2916778300653D+13   R2 =   0.2558088908634D+02
     ISTATE -5 - shortening step at time   92296.410259540309      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1251652425237D+13   R2 =   0.9582494599133D-07
     ISTATE -5 - shortening step at time   39608.434759177777      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1388747210054D+13   R2 =   0.1218151046463D-04
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1388809938015D+13   R2 =   0.8156932448137D+01
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1388817841630D+13   R2 =   0.1021847319939D-04
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1388823206606D+13   R2 =   0.3298153494510D+02
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389493088202D+13   R2 =   0.2113852049202D-03
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389517384656D+13   R2 =   0.2416806334915D-05
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389545029869D+13   R2 =   0.1148019701825D+02
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389599895858D+13   R2 =   0.8082183410456D+02
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1394359311577D+13   R2 =   0.1209865370552D-04
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1394432596374D+13   R2 =   0.5042169016720D+02
     ISTATE -5 - shortening step at time   43569.279179434227      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1533897503658D+13   R2 =   0.2766447886342D-05
     ISTATE -5 - shortening step at time   48540.376242329228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1533907050498D+13   R2 =   0.1530360029921D-05
     ISTATE -5 - shortening step at time   48540.376242329228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1534056205474D+13   R2 =   0.8878703381126D+02
     ISTATE -5 - shortening step at time   48540.376242329228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1534069813823D+13   R2 =   0.2542844696803D-05
     ISTATE -5 - shortening step at time   48540.376242329228      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861428636144D+13   R2 =   0.2022952772934D-06
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861485231593D+13   R2 =   0.3501226027014D-05
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861492121276D+13   R2 =   0.4462400889642D-05
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861511823191D+13   R2 =   0.2445119177561D+02
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861536792198D+13   R2 =   0.2437483481637D+03
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1866988244082D+13   R2 =   0.2934078755247D+02
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1866995002763D+13   R2 =   0.3991554080829D-05
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1866998110966D+13   R2 =   0.5603395581275D-05
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1867031617540D+13   R2 =   0.2649329093589D-05
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1867051241042D+13   R2 =   0.4954638252371D+02
     ISTATE -5 - shortening step at time   58733.857799262449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2053781186034D+13   R2 =   0.2246627947758D-06
     ISTATE -5 - shortening step at time   64992.291444958915      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2053820750162D+13   R2 =   0.2998323839014D+02
     ISTATE -5 - shortening step at time   64992.291444958915      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2276597188719D+13   R2 =   0.5406819967569D+02
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2276613121290D+13   R2 =   0.4138096004142D-06
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2276674432756D+13   R2 =   0.3794239069584D+02
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2276684565761D+13   R2 =   0.4868912710351D+02
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2276748640392D+13   R2 =   0.1455384316490D-05
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2276751300754D+13   R2 =   0.9088031780628D+01
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277098692678D+13   R2 =   0.2364866866332D+02
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277101804015D+13   R2 =   0.6627404002289D-06
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277202265281D+13   R2 =   0.2841822491627D+01
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277226149021D+13   R2 =   0.4513274853129D+02
     ISTATE -5 - shortening step at time   71491.522138991786      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277236607846D+13   R2 =   0.1416249747684D-06
     ISTATE -5 - shortening step at time   72064.118639904482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277266134368D+13   R2 =   0.1602967844438D+02
     ISTATE -5 - shortening step at time   72064.118639904482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277415401052D+13   R2 =   0.8334189330590D-06
     ISTATE -5 - shortening step at time   72064.118639904482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277424596766D+13   R2 =   0.3016978349242D-05
     ISTATE -5 - shortening step at time   72064.118639904482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2277435588393D+13   R2 =   0.1564659033247D+03
     ISTATE -5 - shortening step at time   72064.118639904482      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2504975580156D+13   R2 =   0.1087114245726D+02
     ISTATE -5 - shortening step at time   79270.532222037393      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2505023554580D+13   R2 =   0.1255864918273D-05
     ISTATE -5 - shortening step at time   79270.532222037393      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2505046763679D+13   R2 =   0.3309692415108D+02
     ISTATE -5 - shortening step at time   79270.532222037393      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2755444475987D+13   R2 =   0.2878795713342D-06
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776213546676D+13   R2 =   0.2357088609704D+03
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776219371728D+13   R2 =   0.1748641730708D-05
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776246098782D+13   R2 =   0.1050371820571D-05
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776251218141D+13   R2 =   0.3324237852562D-06
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776777875174D+13   R2 =   0.2146390298149D+02
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776811373820D+13   R2 =   0.4464482871167D+02
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776839704504D+13   R2 =   0.2023549954577D+02
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776844989624D+13   R2 =   0.1377486191146D+02
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776870040799D+13   R2 =   0.7035977172331D+01
     ISTATE -5 - shortening step at time   87197.587334197902      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2789995878060D+13   R2 =   0.7219098914531D-06
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2790001287576D+13   R2 =   0.1128495426950D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793761625049D+13   R2 =   0.7636503934689D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793773784827D+13   R2 =   0.2919328920152D-06
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793917263501D+13   R2 =   0.2953444200328D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793921131707D+13   R2 =   0.9776382527172D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793948882638D+13   R2 =   0.1533022427422D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793952189117D+13   R2 =   0.1844350706012D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2793965997327D+13   R2 =   0.1413563793960D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796267082813D+13   R2 =   0.2434311641133D+02
     ISTATE -5 - shortening step at time   87875.634202490430      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796358277746D+13   R2 =   0.2259887802413D+02
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796401450071D+13   R2 =   0.3229758602740D+02
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796430936180D+13   R2 =   0.2434890776981D+02
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796448132957D+13   R2 =   0.2782369292449D+02
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796451860163D+13   R2 =   0.1810651658864D+02
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796457034067D+13   R2 =   0.1187731140155D-05
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796460693005D+13   R2 =   0.8224386854186D+01
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796468616901D+13   R2 =   0.8283009518634D+01
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796470965232D+13   R2 =   0.6731026050077D-06
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2796496668104D+13   R2 =   0.4031100866315D+02
     ISTATE -5 - shortening step at time   88489.464645975837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797389793474D+13   R2 =   0.8684513494341D+02
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797395720334D+13   R2 =   0.2287636518808D+02
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797661799574D+13   R2 =   0.5677970496402D-05
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797684332896D+13   R2 =   0.2253208159795D+02
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797696745686D+13   R2 =   0.4165971732946D+01
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797702244057D+13   R2 =   0.1680247889065D-05
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797717260022D+13   R2 =   0.2206311147420D+02
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797726691777D+13   R2 =   0.3192104840452D-05
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797842397525D+13   R2 =   0.4465639386318D+01
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797908201959D+13   R2 =   0.3334876786010D+02
     ISTATE -5 - shortening step at time   88496.730003283374      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798153477606D+13   R2 =   0.4499971915508D-05
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798603532979D+13   R2 =   0.3296139596599D-06
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798607064216D+13   R2 =   0.1040720151389D+02
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798637343463D+13   R2 =   0.4007407046878D-06
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798650428006D+13   R2 =   0.2602787656287D+02
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798751826041D+13   R2 =   0.2205487325047D+02
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798755791378D+13   R2 =   0.7191900770842D-06
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798770917570D+13   R2 =   0.1945184289738D+02
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798789440296D+13   R2 =   0.1480434385354D-05
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2798798022023D+13   R2 =   0.1002545769867D+03
     ISTATE -5 - shortening step at time   88541.398796159338      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816477452902D+13   R2 =   0.5475012445138D+01
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816817234802D+13   R2 =   0.2944451348879D+02
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816836600495D+13   R2 =   0.1290102372426D+02
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816840190263D+13   R2 =   0.9243770653446D+01
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816847383573D+13   R2 =   0.2575077190367D+02
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816849868637D+13   R2 =   0.1357473040167D-05
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816859493915D+13   R2 =   0.9273433529831D+01
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2829114862244D+13   R2 =   0.3071159178695D+02
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2829408797679D+13   R2 =   0.2577234022726D+02
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2829418047675D+13   R2 =   0.2515418755208D+02
     ISTATE -5 - shortening step at time   88569.557658941980      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2829431574445D+13   R2 =   0.3350440294114D-07
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2830010456806D+13   R2 =   0.5435274662531D-07
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2830435879107D+13   R2 =   0.5673022142198D-04
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2830451664734D+13   R2 =   0.2366467580578D+02
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2831267694976D+13   R2 =   0.2475464605404D+02
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2831923561297D+13   R2 =   0.7794283429791D-06
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2831937169848D+13   R2 =   0.2844500659979D+02
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832033621548D+13   R2 =   0.2281551438648D+02
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832048874883D+13   R2 =   0.3894257041415D+01
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832083144587D+13   R2 =   0.3695932043312D+02
     ISTATE -5 - shortening step at time   89538.545812493365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832098722926D+13   R2 =   0.3448110194885D-05
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832162251960D+13   R2 =   0.1403342190883D-05
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832405915009D+13   R2 =   0.9761462336661D+02
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832422406821D+13   R2 =   0.2232858497781D+02
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832424836211D+13   R2 =   0.3414696602949D-06
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2864650892813D+13
     ISTATE -1: Reducing time step to    793.16657433576006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864683154117D+13   R2 =   0.8276078340365D-06
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864688077973D+13   R2 =   0.1167685800117D-05
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864699376373D+13   R2 =   0.2393522091492D+02
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864717746957D+13   R2 =   0.8813094270635D-06
     ISTATE -5 - shortening step at time   89622.884322376107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864741716862D+13   R2 =   0.4863052305305D-06
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864743876921D+13   R2 =   0.5143170331048D-06
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864765899068D+13   R2 =   0.1790923005073D-05
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864769856489D+13   R2 =   0.1480807220364D-05
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864832870097D+13   R2 =   0.4526089498078D+02
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864904608024D+13   R2 =   0.7354586043715D+02
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864908628243D+13   R2 =   0.1029378798698D+02
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864910794547D+13   R2 =   0.4604440531703D-06
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864926339960D+13   R2 =   0.9496208379481D-06
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864932518987D+13   R2 =   0.9301542501149D+02
     ISTATE -5 - shortening step at time   90655.624903707969      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865180822843D+13   R2 =   0.9440315016772D-06
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865185479992D+13   R2 =   0.7273804465358D-06
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865188165951D+13   R2 =   0.7622662813961D-06
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865200969186D+13   R2 =   0.2674024045048D+02
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865372593765D+13   R2 =   0.2138079428977D-05
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865377824833D+13   R2 =   0.5989514735716D-06
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865394503402D+13   R2 =   0.1821570632967D-06
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865441439524D+13   R2 =   0.2854151237759D+02
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865445818332D+13   R2 =   0.1304692561044D+02
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865494343654D+13   R2 =   0.5906691233566D+01
     ISTATE -5 - shortening step at time   90662.421486946114      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865640634629D+13   R2 =   0.2413528782607D+02
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865651578636D+13   R2 =   0.1232389972037D+02
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865691628803D+13   R2 =   0.3791636821548D-06
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2865721615905D+13   R2 =   0.1271984487372D-05
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2871325396511D+13   R2 =   0.8453837207375D+02
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2871495776887D+13   R2 =   0.1908853463130D-06
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2871705766275D+13   R2 =   0.4526085872959D+01
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2871714926433D+13   R2 =   0.1914580680326D+02
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2871883354797D+13   R2 =   0.3768652935750D+02
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2871888951268D+13   R2 =   0.1200370079425D+02
     ISTATE -5 - shortening step at time   90680.200748531613      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872031737477D+13   R2 =   0.2418550607824D+02
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872039369845D+13   R2 =   0.1155989214199D+02
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872055085701D+13   R2 =   0.1545098655485D+02
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872061531150D+13   R2 =   0.1396925091937D-04
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872067961747D+13   R2 =   0.1548944503666D-05
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872194654861D+13   R2 =   0.2095114249787D+02
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872273790565D+13   R2 =   0.1242754304507D-05
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872316745146D+13   R2 =   0.9211323736982D+01
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872320264288D+13   R2 =   0.2144072660308D+02
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872329557033D+13   R2 =   0.2004917279199D-05
     ISTATE -5 - shortening step at time   90882.561749000160      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872414938648D+13   R2 =   0.4954277137578D-06
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872463922794D+13   R2 =   0.7621346065221D-05
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872488754396D+13   R2 =   0.2551160591740D+02
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872880462511D+13   R2 =   0.1588597984378D+03
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872893739596D+13   R2 =   0.6178249810804D-06
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2872898252738D+13   R2 =   0.6096225094235D+01
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2874354913825D+13   R2 =   0.2254710877327D-05
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2874416310197D+13   R2 =   0.5297582289645D+01
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2874502143070D+13   R2 =   0.2432152480384D+02
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2874514656918D+13   R2 =   0.9555936243554D-05
     ISTATE -5 - shortening step at time   90896.504969393922      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2874757636933D+13   R2 =   0.2767710151343D+03
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2874811761220D+13   R2 =   0.1868437853071D+02
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2874815622782D+13   R2 =   0.6072942490063D-04
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2875683688356D+13   R2 =   0.5110390511168D-05
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876020596031D+13   R2 =   0.2162810138627D+02
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876040595637D+13   R2 =   0.1463840110331D+02
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876048161962D+13   R2 =   0.2332999143989D-06
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2877013421919D+13   R2 =   0.2291713104728D+02
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2877069409649D+13   R2 =   0.4156959868823D-06
     ISTATE -5 - shortening step at time   90965.653699930699      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2877097711192D+13   R2 =   0.4734719332750D+02
     ISTATE -5 - shortening step at time   90965.653699930699      years
    [Parallel(n_jobs=4)]: Done   9 out of   9 | elapsed:  9.9min finished



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
      <td>7.727502e-05</td>
      <td>9.032446e-11</td>
      <td>1.091252e-13</td>
    </tr>
    <tr>
      <th>1</th>
      <td>30.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/30.0_10000.0.csv</td>
      <td>0.0</td>
      <td>1171.898734</td>
      <td>3.857602e-05</td>
      <td>4.406509e-09</td>
      <td>1.877419e-09</td>
    </tr>
    <tr>
      <th>2</th>
      <td>50.0</td>
      <td>10000.0</td>
      <td>../grid_folder/shocks/50.0_10000.0.csv</td>
      <td>0.0</td>
      <td>1171.898734</td>
      <td>1.764834e-05</td>
      <td>8.205887e-06</td>
      <td>2.386001e-09</td>
    </tr>
    <tr>
      <th>3</th>
      <td>10.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/10.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.384496e-07</td>
      <td>2.513242e-11</td>
      <td>6.103074e-12</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/30.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>9.054279e-24</td>
      <td>8.656795e-22</td>
      <td>8.148738e-22</td>
    </tr>
    <tr>
      <th>5</th>
      <td>50.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/50.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.000000e-30</td>
      <td>8.846148e-22</td>
      <td>1.000000e-30</td>
    </tr>
    <tr>
      <th>6</th>
      <td>10.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/10.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>5.601387e-27</td>
      <td>3.957882e-23</td>
      <td>7.863826e-23</td>
    </tr>
    <tr>
      <th>7</th>
      <td>30.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/30.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>1.000000e-30</td>
      <td>1.384045e-22</td>
      <td>1.431666e-22</td>
    </tr>
    <tr>
      <th>8</th>
      <td>50.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/50.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>1.000000e-30</td>
      <td>2.530018e-22</td>
      <td>1.424589e-22</td>
    </tr>
  </tbody>
</table>
</div>



## Summary

There are many ways to run grids of models and users will naturally develop their own methods. This notebook is just a simple example of how to run UCLCHEM for many parameter combinations whilst producing a useful output (the model_table) to keep track of all the combinations that were run. In a real script, we'd save the model file to csv at the end.

For much larger grids, it's recommended that you find a way to make your script robust to failure. Over a huge range of parameters, it is quite likely UCLCHEM will hit integration trouble for at least a few parameter combinations. Very occasionally, UCLCHEM will get caught in a loop where it fails to integrate and cannot adjust its strategy to manage it. This isn't a problem for small grids as the model can be stopped and the tolerances adjusted. However, for very large grids, you may end up locking all threads as they each get stuck on a different model. The best solution we've found for this case is to add a check so that models in your dataframe are skipped if their file already exists, this allows you to stop and restart the grid script as needed.



