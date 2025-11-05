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

    CPU times: user 37.1 s, sys: 247 ms, total: 37.3 s
    Wall time: 37.4 s


#### The Fast Way
Alternatively, we can use multiprocessing to run the models in parallel. That will allow us to run many models simulataneously and make use of all the cores available on our machine.


```python
%%time
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.


    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:    3.3s


    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:    4.4s


    [Parallel(n_jobs=4)]: Done   3 tasks      | elapsed:    4.9s


    [Parallel(n_jobs=4)]: Done   4 tasks      | elapsed:    6.3s


    [Parallel(n_jobs=4)]: Done   5 tasks      | elapsed:   10.4s
    [Parallel(n_jobs=4)]: Done   6 tasks      | elapsed:   10.5s


    [Parallel(n_jobs=4)]: Done   7 tasks      | elapsed:   11.3s


    [Parallel(n_jobs=4)]: Done   8 tasks      | elapsed:   21.5s


    [Parallel(n_jobs=4)]: Done   9 tasks      | elapsed:   27.9s


    [Parallel(n_jobs=4)]: Done  10 tasks      | elapsed:   31.5s


    [Parallel(n_jobs=4)]: Done  11 tasks      | elapsed:   34.8s


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2198109471612D+14
     ISTATE -1: Reducing time step to    439.57368972945028      years


    [Parallel(n_jobs=4)]: Done  12 tasks      | elapsed:   37.9s


    [Parallel(n_jobs=4)]: Done  13 tasks      | elapsed:   42.7s


    [Parallel(n_jobs=4)]: Done  14 tasks      | elapsed:   44.1s


    [Parallel(n_jobs=4)]: Done  15 tasks      | elapsed:   47.1s


    [Parallel(n_jobs=4)]: Done  16 tasks      | elapsed:   48.3s


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


    [Parallel(n_jobs=4)]: Done  20 tasks      | elapsed:  4.4min


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


    [Parallel(n_jobs=4)]: Done  21 out of  27 | elapsed:  4.4min remaining:  1.3min


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


    [Parallel(n_jobs=4)]: Done  23 out of  27 | elapsed:  5.8min remaining:  1.0min


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


    [Parallel(n_jobs=4)]: Done  24 out of  27 | elapsed:  8.0min remaining:  1.0min


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


    [Parallel(n_jobs=4)]: Done  25 out of  27 | elapsed: 10.6min remaining:   51.1s


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
    In the above message, R1 =   0.1578509511799D+14
     ISTATE -1: Reducing time step to    47.167348837175048      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2756159871400D+14
     ISTATE -1: Reducing time step to    2779.7509464808149      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1656938357712D+14
     ISTATE -1: Reducing time step to    7565.2419572954150      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1732745992907D+14
     ISTATE -1: Reducing time step to    5166.2661242235417      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2956498355742D+14
     ISTATE -1: Reducing time step to    6439.9255471766546      years


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


    [Parallel(n_jobs=4)]: Done  27 out of  27 | elapsed: 29.3min finished
    CPU times: user 645 ms, sys: 638 ms, total: 1.28 s
    Wall time: 29min 15s


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


    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:    6.5s


    [Parallel(n_jobs=4)]: Done   3 out of   3 | elapsed:   11.4s finished



```python
results = Parallel(n_jobs=4, verbose=100)(
    delayed(run_model)(row) for idx, row in model_table.iterrows()
)
```

    [Parallel(n_jobs=4)]: Using backend LokyBackend with 4 concurrent workers.


    [Parallel(n_jobs=4)]: Done   1 tasks      | elapsed:   13.4s
    [Parallel(n_jobs=4)]: Done   2 tasks      | elapsed:   13.6s


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5618288647057D+09
     ISTATE -1: Reducing time step to    9.7098530859087429E-002 years


    [Parallel(n_jobs=4)]: Done   3 out of   9 | elapsed:   23.7s remaining:   47.5s


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5619762097690D+09
     ISTATE -1: Reducing time step to    9.6632249006505549E-002 years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5620922903062D+09
     ISTATE -1: Reducing time step to    9.6264905528759548E-002 years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3063046680601D+12
     ISTATE -1: Reducing time step to    96.771568540453785      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3392444125326D+12
     ISTATE -1: Reducing time step to    99.140909986238739      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5621952183580D+09
     ISTATE -1: Reducing time step to    9.5939183840980893E-002 years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7357437203007D+12   R2 =   0.2329581329923D+04
     ISTATE -5 - shortening step at time   22852.592841823789      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8011456874139D+12   R2 =   0.4486786363735D-06
     ISTATE -5 - shortening step at time   25137.852670854438      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8016332706161D+12   R2 =   0.7603056640530D+03
     ISTATE -5 - shortening step at time   25137.852670854438      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8788017645741D+12   R2 =   0.4994891373504D+03
     ISTATE -5 - shortening step at time   27651.638537272993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8789551756562D+12   R2 =   0.1009151994052D+04
     ISTATE -5 - shortening step at time   27651.638537272993      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8824519276948D+12   R2 =   0.4627510542740D-04
     ISTATE -5 - shortening step at time   27651.638537272993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8841390923740D+12   R2 =   0.9510584882755D+04
     ISTATE -5 - shortening step at time   27651.638537272993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8843702106774D+12   R2 =   0.1230591914867D+04
     ISTATE -5 - shortening step at time   27651.638537272993      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8852334151110D+12   R2 =   0.6048979218500D+04
     ISTATE -5 - shortening step at time   27651.638537272993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8855454194207D+12   R2 =   0.2072041341350D+04
     ISTATE -5 - shortening step at time   27651.638537272993      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3177436687426D+11   R2 =   0.1633932207053D-07
     ISTATE -5 - shortening step at time   964.35107535228644      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3262362343150D+11   R2 =   0.3375932459874D+03
     ISTATE -5 - shortening step at time   964.35107535228644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9729699497550D+12   R2 =   0.1087962859247D+04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9743764631683D+12   R2 =   0.4470444643795D+04
     ISTATE -5 - shortening step at time   30416.803050266728      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3273963221804D+11   R2 =   0.3354152154291D-04
     ISTATE -5 - shortening step at time   964.35107535228644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3297753222398D+11   R2 =   0.1058342054768D+04
     ISTATE -5 - shortening step at time   964.35107535228644      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1026061432049D+13   R2 =   0.1092713846201D-04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1031714195316D+13   R2 =   0.1566769278990D+05
     ISTATE -5 - shortening step at time   30416.803050266728      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3311380774864D+11   R2 =   0.3110267414027D-04
     ISTATE -5 - shortening step at time   964.35107535228644      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1037665480287D+13   R2 =   0.8186395980143D-04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1038729967986D+13   R2 =   0.2929063348390D+04
     ISTATE -5 - shortening step at time   30416.803050266728      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3466678594391D+11   R2 =   0.6699568266290D-06
     ISTATE -5 - shortening step at time   1060.7862058794365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1040313988261D+13   R2 =   0.7938928730842D+04
     ISTATE -5 - shortening step at time   30416.803050266728      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3537715100401D+11   R2 =   0.7683445448896D+03
     ISTATE -5 - shortening step at time   1060.7862058794365      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1040617858311D+13   R2 =   0.2033177357519D+04
     ISTATE -5 - shortening step at time   30416.803050266728      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1041447243023D+13   R2 =   0.4731047571218D-04
     ISTATE -5 - shortening step at time   30416.803050266728      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3963916435305D+11   R2 =   0.8739113960787D-06
     ISTATE -5 - shortening step at time   1166.8648517584941      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4016424371292D+11   R2 =   0.2119149883533D+04
     ISTATE -5 - shortening step at time   1166.8648517584941      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1041708411104D+13   R2 =   0.1119391334934D-03
     ISTATE -5 - shortening step at time   30416.803050266728      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1045384867403D+13   R2 =   0.3862057144476D+03
     ISTATE -5 - shortening step at time   32965.456047588930      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4237307183569D+11   R2 =   0.5413759013753D-06
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4276957960024D+11   R2 =   0.8009102825250D+03
     ISTATE -5 - shortening step at time   1283.5513647545695      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4405083085106D+11   R2 =   0.2143305074525D+03
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4441000701426D+11   R2 =   0.2346695021240D+04
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1271220816796D+13   R2 =   0.4585216289744D+04
     ISTATE -5 - shortening step at time   39888.203546689605      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4449431946257D+11   R2 =   0.2519617815400D+03
     ISTATE -5 - shortening step at time   1283.5513647545695      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1274122143653D+13   R2 =   0.3813501943835D-04
     ISTATE -5 - shortening step at time   39888.203546689605      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4551059064349D+11   R2 =   0.5258496482272D-05
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1274324385003D+13   R2 =   0.1265300376604D+03
     ISTATE -5 - shortening step at time   39888.203546689605      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1274517028337D+13   R2 =   0.9092241003961D+03
     ISTATE -5 - shortening step at time   39888.203546689605      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1274792406975D+13   R2 =   0.7360599895666D+03
     ISTATE -5 - shortening step at time   39888.203546689605      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1274947978022D+13   R2 =   0.8272145277779D+03
     ISTATE -5 - shortening step at time   39888.203546689605      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4650651550508D+11   R2 =   0.1317984080379D-04
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1275227350201D+13   R2 =   0.2479202356175D+04
     ISTATE -5 - shortening step at time   39888.203546689605      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1275335475649D+13   R2 =   0.1741986673326D-03
     ISTATE -5 - shortening step at time   39888.203546689605      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4772791758444D+11   R2 =   0.5021488981650D-05
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1275484846302D+13   R2 =   0.7759397647124D+03
     ISTATE -5 - shortening step at time   39888.203546689605      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4797068622020D+11   R2 =   0.1218602259836D+04
     ISTATE -5 - shortening step at time   1411.9065318322757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1275674763870D+13   R2 =   0.8458229690322D+02
     ISTATE -5 - shortening step at time   39888.203546689605      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5622772516664D+09
     ISTATE -1: Reducing time step to    9.5679584760014605E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4858101189255D+11   R2 =   0.1871306481810D-04
     ISTATE -5 - shortening step at time   1411.9065318322757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4991132598045D+11   R2 =   0.2687782781977D+02
     ISTATE -5 - shortening step at time   1553.0972186779782      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5374249966756D+11   R2 =   0.2327314096295D+04
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5386188162171D+11   R2 =   0.7813020214488D+03
     ISTATE -5 - shortening step at time   1553.0972186779782      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1418498910017D+13   R2 =   0.1417985259818D-04
     ISTATE -5 - shortening step at time   44406.400970630406      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3666814687462D+12
     ISTATE -1: Reducing time step to    12.314781434183846      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5393174776099D+11   R2 =   0.3270908982963D-05
     ISTATE -5 - shortening step at time   1553.0972186779782      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5729716129656D+11   R2 =   0.2466270569744D+04
     ISTATE -5 - shortening step at time   1708.4069775744993      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1551311261525D+13   R2 =   0.5718217968465D-05
     ISTATE -5 - shortening step at time   48847.042126424552      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1552546673666D+13   R2 =   0.3717368822694D+04
     ISTATE -5 - shortening step at time   48847.042126424552      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1557969530761D+13   R2 =   0.1118437501731D-04
     ISTATE -5 - shortening step at time   48847.042126424552      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1560644741211D+13   R2 =   0.8880246559539D+04
     ISTATE -5 - shortening step at time   48847.042126424552      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1560858391033D+13   R2 =   0.3580689918039D+03
     ISTATE -5 - shortening step at time   48847.042126424552      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7243215084320D+11   R2 =   0.2100190983846D-05
     ISTATE -5 - shortening step at time   2273.8898350073569      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1566500613915D+13   R2 =   0.2193975967695D+04
     ISTATE -5 - shortening step at time   48847.042126424552      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1567268383547D+13   R2 =   0.1074590577250D-04
     ISTATE -5 - shortening step at time   48847.042126424552      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7958862698762D+11   R2 =   0.3166238381789D-05
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1570469473716D+13   R2 =   0.5289064393435D+04
     ISTATE -5 - shortening step at time   48847.042126424552      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1571371968075D+13   R2 =   0.4159775706531D+04
     ISTATE -5 - shortening step at time   48847.042126424552      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1585786684007D+13   R2 =   0.1241843320469D+05
     ISTATE -5 - shortening step at time   48847.042126424552      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8161732765695D+11   R2 =   0.2344508903156D-04
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1594428872129D+13   R2 =   0.2573738080048D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1594595945724D+13   R2 =   0.1510725953029D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1595647571904D+13   R2 =   0.3909549315213D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8278654802341D+11   R2 =   0.1423120230249D-04
     ISTATE -5 - shortening step at time   2501.2788727218508      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1595835082676D+13   R2 =   0.1081261682933D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8290832356786D+11   R2 =   0.1004950541733D+04
     ISTATE -5 - shortening step at time   2501.2788727218508      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1599225519356D+13   R2 =   0.3340447945313D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1599639109147D+13   R2 =   0.3386533693253D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1599872167745D+13   R2 =   0.2119444042015D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1600194023402D+13   R2 =   0.9318524637453D+03
     ISTATE -5 - shortening step at time   50183.122911618586      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1600603681592D+13   R2 =   0.1822602547872D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1600942519546D+13   R2 =   0.3709603466320D+04
     ISTATE -5 - shortening step at time   50183.122911618586      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8892335866744D+11   R2 =   0.1977156463402D-05
     ISTATE -5 - shortening step at time   2751.4068196291714      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1603209060215D+13   R2 =   0.3067459561935D-05
     ISTATE -5 - shortening step at time   50662.737960330254      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8936695638364D+11   R2 =   0.4579559763356D-04
     ISTATE -5 - shortening step at time   2751.4068196291714      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1603399912778D+13   R2 =   0.3072462149465D+03
     ISTATE -5 - shortening step at time   50662.737960330254      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1006083039975D+12   R2 =   0.2472499458948D+04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1603947360895D+13   R2 =   0.1011702706937D-02
     ISTATE -5 - shortening step at time   50662.737960330254      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1007031478276D+12   R2 =   0.1232572241965D+04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1604276650551D+13   R2 =   0.1438582961548D+04
     ISTATE -5 - shortening step at time   50662.737960330254      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1041412252791D+12   R2 =   0.1771650775250D+04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1045624997290D+12   R2 =   0.3575362226438D+03
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1604354085902D+13   R2 =   0.6668885835908D-05
     ISTATE -5 - shortening step at time   50662.737960330254      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1604558869640D+13   R2 =   0.2538085558665D+04
     ISTATE -5 - shortening step at time   50662.737960330254      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1612611720696D+13   R2 =   0.4956860589053D+04
     ISTATE -5 - shortening step at time   50662.737960330254      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1050975066915D+12   R2 =   0.4538857505148D-04
     ISTATE -5 - shortening step at time   3026.5475671907388      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1612919048945D+13   R2 =   0.3009333502722D+04
     ISTATE -5 - shortening step at time   50662.737960330254      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613151891193D+13   R2 =   0.1271315308891D+04
     ISTATE -5 - shortening step at time   50662.737960330254      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613567728150D+13   R2 =   0.9184135676399D+03
     ISTATE -5 - shortening step at time   50662.737960330254      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1055765991983D+12   R2 =   0.7206596793864D-06
     ISTATE -5 - shortening step at time   3329.2023960683296      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1068328906907D+12   R2 =   0.1408373185337D+04
     ISTATE -5 - shortening step at time   3329.2023960683296      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1070723258893D+12   R2 =   0.1274853311681D+04
     ISTATE -5 - shortening step at time   3329.2023960683296      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1160113902901D+12   R2 =   0.3155411520068D+02
     ISTATE -5 - shortening step at time   3662.1227150495324      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1956671642727D+13   R2 =   0.8047466305147D-05
     ISTATE -5 - shortening step at time   61785.349230895830      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1959707528939D+13   R2 =   0.3388473973852D+04
     ISTATE -5 - shortening step at time   61785.349230895830      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1276308273791D+12   R2 =   0.8149997503887D-06
     ISTATE -5 - shortening step at time   4028.3350738662953      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1982468985331D+13   R2 =   0.4014491506516D-05
     ISTATE -5 - shortening step at time   61785.349230895830      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1543940752875D+12   R2 =   0.9366460372485D+02
     ISTATE -5 - shortening step at time   4874.2856506728031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1982845643148D+13   R2 =   0.3305827930970D-04
     ISTATE -5 - shortening step at time   61785.349230895830      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1983163320402D+13   R2 =   0.1316283246610D+04
     ISTATE -5 - shortening step at time   61785.349230895830      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1983239462058D+13   R2 =   0.4628238852765D+03
     ISTATE -5 - shortening step at time   61785.349230895830      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1559566920937D+12   R2 =   0.5652076151650D-05
     ISTATE -5 - shortening step at time   4874.2856506728031      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5623549295166D+09
     ISTATE -1: Reducing time step to    9.5433768774565567E-002 years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1634869122019D+12   R2 =   0.1696546636634D+04
     ISTATE -5 - shortening step at time   4874.2856506728031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1673648779829D+12   R2 =   0.6978065591991D+03
     ISTATE -5 - shortening step at time   4874.2856506728031      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1676222317219D+12   R2 =   0.1070356802972D-04
     ISTATE -5 - shortening step at time   4874.2856506728031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1689473012245D+12   R2 =   0.1356498063832D+04
     ISTATE -5 - shortening step at time   4874.2856506728031      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1697497512957D+12   R2 =   0.9279119876529D+02
     ISTATE -5 - shortening step at time   5361.7143319521092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1699508927579D+12   R2 =   0.6539860538739D+03
     ISTATE -5 - shortening step at time   5361.7143319521092      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1724402404508D+12   R2 =   0.8860116418320D+03
     ISTATE -5 - shortening step at time   5361.7143319521092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1738230152627D+12   R2 =   0.1701750612055D+03
     ISTATE -5 - shortening step at time   5361.7143319521092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2149314594209D+13   R2 =   0.2621900502094D-05
     ISTATE -5 - shortening step at time   67963.885627062933      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2150990884430D+13   R2 =   0.9342400380380D+03
     ISTATE -5 - shortening step at time   67963.885627062933      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2151059433068D+13   R2 =   0.2808022589889D+03
     ISTATE -5 - shortening step at time   67963.885627062933      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1773152134807D+12   R2 =   0.1817731818236D-04
     ISTATE -5 - shortening step at time   5361.7143319521092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1784444037900D+12   R2 =   0.5523499736022D+03
     ISTATE -5 - shortening step at time   5361.7143319521092      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2151150739624D+13   R2 =   0.9654121504007D-05
     ISTATE -5 - shortening step at time   67963.885627062933      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2151316988570D+13   R2 =   0.7601222842372D+03
     ISTATE -5 - shortening step at time   67963.885627062933      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2151431014069D+13   R2 =   0.6090807158355D+03
     ISTATE -5 - shortening step at time   67963.885627062933      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1788798781044D+12   R2 =   0.2449687558121D-04
     ISTATE -5 - shortening step at time   5361.7143319521092      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2152594441920D+13   R2 =   0.1806723435616D+04
     ISTATE -5 - shortening step at time   67963.885627062933      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2152725843263D+13   R2 =   0.7555921702599D+03
     ISTATE -5 - shortening step at time   67963.885627062933      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2152930665546D+13   R2 =   0.3772814924102D+03
     ISTATE -5 - shortening step at time   67963.885627062933      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2153072641839D+13   R2 =   0.9807313337550D+03
     ISTATE -5 - shortening step at time   67963.885627062933      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1866273810880D+12   R2 =   0.3816767208599D-04
     ISTATE -5 - shortening step at time   5897.8858929805510      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2154302107956D+13   R2 =   0.7271317988936D-05
     ISTATE -5 - shortening step at time   68135.210184772106      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2154489358967D+13   R2 =   0.5913674941124D+03
     ISTATE -5 - shortening step at time   68135.210184772106      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1867114288916D+12   R2 =   0.2135043563723D-05
     ISTATE -5 - shortening step at time   5897.8858929805510      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1890606303689D+12   R2 =   0.8859046786418D+03
     ISTATE -5 - shortening step at time   5897.8858929805510      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1898180254067D+12   R2 =   0.6359399627582D+03
     ISTATE -5 - shortening step at time   5897.8858929805510      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2154627384132D+13   R2 =   0.3885333488727D-04
     ISTATE -5 - shortening step at time   68135.210184772106      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1902797804133D+12   R2 =   0.6474191812754D+02
     ISTATE -5 - shortening step at time   5897.8858929805510      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1908064608423D+12   R2 =   0.9378334351035D+03
     ISTATE -5 - shortening step at time   5897.8858929805510      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1911784888304D+12   R2 =   0.8013301704751D+03
     ISTATE -5 - shortening step at time   5897.8858929805510      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2155533541508D+13   R2 =   0.8252910975756D-05
     ISTATE -5 - shortening step at time   68135.210184772106      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1924669882945D+12   R2 =   0.2685386512958D+03
     ISTATE -5 - shortening step at time   5897.8858929805510      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2155749826973D+13   R2 =   0.1938774086890D+04
     ISTATE -5 - shortening step at time   68135.210184772106      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1928418888571D+12   R2 =   0.7278962919815D+03
     ISTATE -5 - shortening step at time   5897.8858929805510      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2163902625294D+13   R2 =   0.1867189463382D+04
     ISTATE -5 - shortening step at time   68135.210184772106      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1970536175585D+12   R2 =   0.1038135011864D+04
     ISTATE -5 - shortening step at time   5897.8858929805510      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2166845745080D+13   R2 =   0.2989198276779D-04
     ISTATE -5 - shortening step at time   68135.210184772106      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2167066482908D+13   R2 =   0.1378328190396D+04
     ISTATE -5 - shortening step at time   68135.210184772106      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1977515801184D+12   R2 =   0.1651614772419D-05
     ISTATE -5 - shortening step at time   6235.8739733701632      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2169709463317D+13   R2 =   0.5572272199618D-04
     ISTATE -5 - shortening step at time   68135.210184772106      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1978708301671D+12   R2 =   0.4386133963762D-04
     ISTATE -5 - shortening step at time   6235.8739733701632      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2170861992442D+13   R2 =   0.3041274482752D+04
     ISTATE -5 - shortening step at time   68135.210184772106      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2171978302680D+13   R2 =   0.3370146521895D+02
     ISTATE -5 - shortening step at time   68698.164317799383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1980418521718D+12   R2 =   0.1129416087394D-04
     ISTATE -5 - shortening step at time   6235.8739733701632      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1981902463990D+12   R2 =   0.4487641659099D+03
     ISTATE -5 - shortening step at time   6235.8739733701632      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2172119041225D+13   R2 =   0.1147245576273D-03
     ISTATE -5 - shortening step at time   68698.164317799383      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2172362123875D+13   R2 =   0.6530010110387D+03
     ISTATE -5 - shortening step at time   68698.164317799383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1983622360562D+12   R2 =   0.4103155002541D-04
     ISTATE -5 - shortening step at time   6235.8739733701632      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2172507693768D+13   R2 =   0.6761913087068D+03
     ISTATE -5 - shortening step at time   68698.164317799383      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2174075464965D+13   R2 =   0.1638630083434D+04
     ISTATE -5 - shortening step at time   68698.164317799383      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3873156582097D+12
     ISTATE -1: Reducing time step to    64.286659847451375      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2169291027381D+12   R2 =   0.5365473266735D-06
     ISTATE -5 - shortening step at time   6859.4615193820009      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2175425236678D+13   R2 =   0.2798923464187D-04
     ISTATE -5 - shortening step at time   68698.164317799383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2175690787318D+13   R2 =   0.1545897327792D+04
     ISTATE -5 - shortening step at time   68698.164317799383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2175870755396D+13   R2 =   0.1075513934507D+04
     ISTATE -5 - shortening step at time   68698.164317799383      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2176051905841D+13   R2 =   0.1670772161188D+04
     ISTATE -5 - shortening step at time   68698.164317799383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2386122103571D+12   R2 =   0.1363458090284D-05
     ISTATE -5 - shortening step at time   7545.4078348625080      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2389367286839D+12   R2 =   0.6604835304922D+03
     ISTATE -5 - shortening step at time   7545.4078348625080      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2176218245021D+13   R2 =   0.5105568090226D-04
     ISTATE -5 - shortening step at time   68698.164317799383      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2422909105821D+12   R2 =   0.1018973411271D+04
     ISTATE -5 - shortening step at time   7545.4078348625080      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2423512857475D+12   R2 =   0.9559086012548D-05
     ISTATE -5 - shortening step at time   7545.4078348625080      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2424211093524D+12   R2 =   0.8098922398953D+03
     ISTATE -5 - shortening step at time   7545.4078348625080      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2179478043583D+13   R2 =   0.7104676350741D-06
     ISTATE -5 - shortening step at time   68867.665981666360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2426102301217D+12   R2 =   0.9600717520505D+03
     ISTATE -5 - shortening step at time   7545.4078348625080      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2179704528682D+13   R2 =   0.2088997747131D-04
     ISTATE -5 - shortening step at time   68867.665981666360      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5624293746191D+09
     ISTATE -1: Reducing time step to    9.5198183003675774E-002 years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2426650251307D+12   R2 =   0.5637719081770D-04
     ISTATE -5 - shortening step at time   7545.4078348625080      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2183037000162D+13   R2 =   0.1255600544190D-04
     ISTATE -5 - shortening step at time   68867.665981666360      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2466734050798D+12   R2 =   0.2321741240297D-04
     ISTATE -5 - shortening step at time   7545.4078348625080      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2191017536452D+13   R2 =   0.8163221176138D+04
     ISTATE -5 - shortening step at time   68867.665981666360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2470436685570D+12   R2 =   0.3480941412579D-04
     ISTATE -5 - shortening step at time   7545.4078348625080      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2191855137643D+13   R2 =   0.2731554399400D-04
     ISTATE -5 - shortening step at time   68867.665981666360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2202181058226D+13   R2 =   0.1904366202058D+04
     ISTATE -5 - shortening step at time   68867.665981666360      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2202284859247D+13   R2 =   0.3196762178788D+03
     ISTATE -5 - shortening step at time   68867.665981666360      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2481866690350D+12   R2 =   0.2512725589163D-04
     ISTATE -5 - shortening step at time   7545.4078348625080      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2209186653205D+13   R2 =   0.2240490827659D+04
     ISTATE -5 - shortening step at time   68867.665981666360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2482958051129D+12   R2 =   0.1101959010519D-04
     ISTATE -5 - shortening step at time   7854.0085137660944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2210604655298D+13   R2 =   0.2453560213375D-04
     ISTATE -5 - shortening step at time   68867.665981666360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2492846924718D+12   R2 =   0.3522516490322D-04
     ISTATE -5 - shortening step at time   7854.0085137660944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2212835481802D+13   R2 =   0.1928515337786D-05
     ISTATE -5 - shortening step at time   68867.665981666360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2493261518670D+12   R2 =   0.2789918086655D-04
     ISTATE -5 - shortening step at time   7854.0085137660944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2493583249368D+12   R2 =   0.2324114237308D+03
     ISTATE -5 - shortening step at time   7854.0085137660944      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2494194185835D+12   R2 =   0.1193992639569D-03
     ISTATE -5 - shortening step at time   7854.0085137660944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2435483440505D+13   R2 =   0.2035026098739D+02
     ISTATE -5 - shortening step at time   77029.084896850938      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2501132480908D+12   R2 =   0.4431954091987D+03
     ISTATE -5 - shortening step at time   7854.0085137660944      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2435751230421D+13   R2 =   0.2002603703023D+03
     ISTATE -5 - shortening step at time   77029.084896850938      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2501555813337D+12   R2 =   0.3168431869497D+03
     ISTATE -5 - shortening step at time   7854.0085137660944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2508842181866D+12   R2 =   0.8060772534767D+03
     ISTATE -5 - shortening step at time   7854.0085137660944      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2509721581838D+12   R2 =   0.5411949701950D+03
     ISTATE -5 - shortening step at time   7854.0085137660944      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2435894429113D+13   R2 =   0.1116068504945D-04
     ISTATE -5 - shortening step at time   77029.084896850938      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2547489022315D+12   R2 =   0.2689532265797D+03
     ISTATE -5 - shortening step at time   7854.0085137660944      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2436418192217D+13   R2 =   0.6236288495742D-04
     ISTATE -5 - shortening step at time   77029.084896850938      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2584460428258D+12   R2 =   0.6736509751567D+03
     ISTATE -5 - shortening step at time   8061.6741212487623      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2436687322381D+13   R2 =   0.1667028286447D-04
     ISTATE -5 - shortening step at time   77029.084896850938      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2585475547142D+12   R2 =   0.7808708256938D-04
     ISTATE -5 - shortening step at time   8061.6741212487623      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2441383737255D+13   R2 =   0.3392733727510D+04
     ISTATE -5 - shortening step at time   77029.084896850938      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2586369092904D+12   R2 =   0.9072859226507D-05
     ISTATE -5 - shortening step at time   8061.6741212487623      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2587172326253D+12   R2 =   0.1392001560072D+04
     ISTATE -5 - shortening step at time   8061.6741212487623      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2587722341178D+12   R2 =   0.5250802310820D+03
     ISTATE -5 - shortening step at time   8061.6741212487623      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2588134565277D+12   R2 =   0.2515397896017D+03
     ISTATE -5 - shortening step at time   8061.6741212487623      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2590126111473D+12   R2 =   0.9116786583862D+03
     ISTATE -5 - shortening step at time   8061.6741212487623      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2606629529198D+12   R2 =   0.4848659357717D-04
     ISTATE -5 - shortening step at time   8061.6741212487623      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2684200520957D+13   R2 =   0.6305946085134D-05
     ISTATE -5 - shortening step at time   84731.995223052523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2608345866170D+12   R2 =   0.4243817799067D+03
     ISTATE -5 - shortening step at time   8061.6741212487623      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2686298151213D+13   R2 =   0.4947520727638D-04
     ISTATE -5 - shortening step at time   84731.995223052523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2686398729497D+13   R2 =   0.9769400886737D+03
     ISTATE -5 - shortening step at time   84731.995223052523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2612943622300D+12   R2 =   0.4706143375367D-04
     ISTATE -5 - shortening step at time   8061.6741212487623      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2686685470787D+13   R2 =   0.1537572765418D+04
     ISTATE -5 - shortening step at time   84731.995223052523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2732226673769D+12   R2 =   0.3275197766377D+04
     ISTATE -5 - shortening step at time   8268.8089313279143      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2689723204961D+13   R2 =   0.3987926953866D-04
     ISTATE -5 - shortening step at time   84731.995223052523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2996138520490D+12   R2 =   0.2413738579087D+04
     ISTATE -5 - shortening step at time   9095.6900216044742      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2690055051016D+13   R2 =   0.1174531228483D+04
     ISTATE -5 - shortening step at time   84731.995223052523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2690680340930D+13   R2 =   0.3215047094406D+04
     ISTATE -5 - shortening step at time   84731.995223052523      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2693539922903D+13   R2 =   0.2087392839390D-04
     ISTATE -5 - shortening step at time   84731.995223052523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3162981568685D+12   R2 =   0.8051801570235D-06
     ISTATE -5 - shortening step at time   10005.259240623071      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2693673872957D+13   R2 =   0.1381242904914D+04
     ISTATE -5 - shortening step at time   84731.995223052523      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2696894721130D+13   R2 =   0.1420704674428D+04
     ISTATE -5 - shortening step at time   84731.995223052523      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2698000745063D+13   R2 =   0.6543915354330D-05
     ISTATE -5 - shortening step at time   85344.769656000193      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5625010174912D+09
     ISTATE -1: Reducing time step to    9.4971465050653875E-002 years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2700530985992D+13   R2 =   0.3406444401143D+04
     ISTATE -5 - shortening step at time   85344.769656000193      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2700728404282D+13   R2 =   0.1065572863242D+04
     ISTATE -5 - shortening step at time   85344.769656000193      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2700932399653D+13   R2 =   0.2826650264015D+04
     ISTATE -5 - shortening step at time   85344.769656000193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2701114987205D+13   R2 =   0.5056244885874D+03
     ISTATE -5 - shortening step at time   85344.769656000193      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2703880930640D+13   R2 =   0.3904854095159D+04
     ISTATE -5 - shortening step at time   85344.769656000193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704002665550D+13   R2 =   0.2724181272582D-04
     ISTATE -5 - shortening step at time   85344.769656000193      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2709598963683D+13   R2 =   0.1822990220106D+04
     ISTATE -5 - shortening step at time   85344.769656000193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2711767263828D+13   R2 =   0.5696810230380D+04
     ISTATE -5 - shortening step at time   85344.769656000193      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.3985089946606D+12
     ISTATE -1: Reducing time step to    28.864708525597514      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2711902034552D+13   R2 =   0.7038749998920D-04
     ISTATE -5 - shortening step at time   85344.769656000193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717196417284D+13   R2 =   0.1612080950974D+04
     ISTATE -5 - shortening step at time   85819.684637714585      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717370271709D+13   R2 =   0.1925811236514D+04
     ISTATE -5 - shortening step at time   85819.684637714585      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6831322855614D+12   R2 =   0.9513573828226D+03
     ISTATE -5 - shortening step at time   21447.165468186689      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720452058954D+13   R2 =   0.7591065940542D-04
     ISTATE -5 - shortening step at time   85819.684637714585      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720542902645D+13   R2 =   0.6777635188244D+03
     ISTATE -5 - shortening step at time   85819.684637714585      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720654330194D+13   R2 =   0.9191580654110D-05
     ISTATE -5 - shortening step at time   85819.684637714585      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720777394483D+13   R2 =   0.9076820639335D+03
     ISTATE -5 - shortening step at time   85819.684637714585      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2725334214684D+13   R2 =   0.1876881337666D+04
     ISTATE -5 - shortening step at time   85819.684637714585      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2725879068662D+13   R2 =   0.3200421944333D+04
     ISTATE -5 - shortening step at time   85819.684637714585      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2727434691310D+13   R2 =   0.2816426149513D-04
     ISTATE -5 - shortening step at time   85819.684637714585      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2733293925059D+13   R2 =   0.2604630035426D-03
     ISTATE -5 - shortening step at time   85819.684637714585      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2733712637335D+13   R2 =   0.1667043535858D+03
     ISTATE -5 - shortening step at time   86496.643198063801      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2734261049946D+13   R2 =   0.4096735574692D+03
     ISTATE -5 - shortening step at time   86496.643198063801      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7979868883660D+12   R2 =   0.2522041405881D+03
     ISTATE -5 - shortening step at time   23591.882526345631      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2734523192359D+13   R2 =   0.4281306489558D-04
     ISTATE -5 - shortening step at time   86496.643198063801      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2737306706554D+13   R2 =   0.1794653110218D+04
     ISTATE -5 - shortening step at time   86496.643198063801      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2737931117157D+13   R2 =   0.1075522988059D+04
     ISTATE -5 - shortening step at time   86496.643198063801      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746278804922D+13   R2 =   0.3426382727586D-04
     ISTATE -5 - shortening step at time   86496.643198063801      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746530293131D+13   R2 =   0.3138160060255D-04
     ISTATE -5 - shortening step at time   86496.643198063801      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746709940546D+13   R2 =   0.9536717296442D+03
     ISTATE -5 - shortening step at time   86496.643198063801      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2749531076454D+13   R2 =   0.1250082982957D-04
     ISTATE -5 - shortening step at time   86496.643198063801      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2750773865659D+13   R2 =   0.2759363858204D+04
     ISTATE -5 - shortening step at time   86496.643198063801      years


    [Parallel(n_jobs=4)]: Done   4 out of   9 | elapsed:  1.4min remaining:  1.7min
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9023324869168D+12   R2 =   0.4342180732029D+02
     ISTATE -5 - shortening step at time   28546.179094321713      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1091529249047D+13   R2 =   0.1129791620925D-06
     ISTATE -5 - shortening step at time   34540.878201435975      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.6869142028020D+09
     ISTATE -1: Reducing time step to    5.2828472932774678E-002 years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1166202207293D+13   R2 =   0.6227113320826D+03
     ISTATE -5 - shortening step at time   34540.878201435975      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1197495549389D+13   R2 =   0.6176592107244D+03
     ISTATE -5 - shortening step at time   34540.878201435975      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1197768382835D+13   R2 =   0.3388914643729D-05
     ISTATE -5 - shortening step at time   34540.878201435975      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348942166388D+13   R2 =   0.2061030378307D+03
     ISTATE -5 - shortening step at time   41794.464435478709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1353493137308D+13   R2 =   0.3696641443903D+03
     ISTATE -5 - shortening step at time   41794.464435478709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1427690285560D+13   R2 =   0.6610076286649D-05
     ISTATE -5 - shortening step at time   41794.464435478709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1439657003678D+13   R2 =   0.1583771582003D+03
     ISTATE -5 - shortening step at time   41794.464435478709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1449088739869D+13   R2 =   0.2483562245847D+03
     ISTATE -5 - shortening step at time   41794.464435478709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1598083838392D+13   R2 =   0.1039710340647D-05
     ISTATE -5 - shortening step at time   50571.304159136162      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4201905849958D+12
     ISTATE -1: Reducing time step to    89.249024695359580      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1754307430876D+13
     ISTATE -1: Reducing time step to    11.237784333134034      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1765394563113D+13   R2 =   0.2759647612635D+03
     ISTATE -5 - shortening step at time   55628.435780763626      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1765453267376D+13   R2 =   0.7456552536491D+02
     ISTATE -5 - shortening step at time   55628.435780763626      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1765800228550D+13   R2 =   0.2268078838145D+03
     ISTATE -5 - shortening step at time   55628.435780763626      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1770713981777D+13   R2 =   0.9587146143763D+02
     ISTATE -5 - shortening step at time   55628.435780763626      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1777749979257D+13   R2 =   0.2726118501580D+03
     ISTATE -5 - shortening step at time   55628.435780763626      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1778870255635D+13   R2 =   0.3623938319951D+03
     ISTATE -5 - shortening step at time   55628.435780763626      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779293925381D+13   R2 =   0.1702381196975D+03
     ISTATE -5 - shortening step at time   55628.435780763626      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779482420466D+13   R2 =   0.3188258347299D+03
     ISTATE -5 - shortening step at time   55628.435780763626      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779665697561D+13   R2 =   0.2371535514586D+03
     ISTATE -5 - shortening step at time   55628.435780763626      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1779795195064D+13   R2 =   0.7414502322998D-03
     ISTATE -5 - shortening step at time   55628.435780763626      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1783632344829D+13   R2 =   0.1723168087237D+03
     ISTATE -5 - shortening step at time   56322.632755182836      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1783799532214D+13   R2 =   0.1320005746413D-04
     ISTATE -5 - shortening step at time   56322.632755182836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1784038214294D+13   R2 =   0.2831268937805D+03
     ISTATE -5 - shortening step at time   56322.632755182836      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4164030817732D+11   R2 =   0.3785428386647D-06
     ISTATE -5 - shortening step at time   1283.5513647545695      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1791078961217D+13   R2 =   0.5004776482406D+02
     ISTATE -5 - shortening step at time   56322.632755182836      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1797404632259D+13   R2 =   0.9748310970136D+02
     ISTATE -5 - shortening step at time   56322.632755182836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4589114095797D+11   R2 =   0.2109110182740D-04
     ISTATE -5 - shortening step at time   1411.9065318322757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1798224596592D+13   R2 =   0.1018789978241D+03
     ISTATE -5 - shortening step at time   56322.632755182836      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4599438405307D+11   R2 =   0.1236469567127D-04
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4601657662227D+11   R2 =   0.6384342116572D+02
     ISTATE -5 - shortening step at time   1411.9065318322757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1805666765220D+13   R2 =   0.2057360290801D-05
     ISTATE -5 - shortening step at time   56322.632755182836      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4603331100724D+11   R2 =   0.4827887700827D-06
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1806096254167D+13   R2 =   0.6749430668413D+02
     ISTATE -5 - shortening step at time   56322.632755182836      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4605115747585D+11   R2 =   0.5939945658414D-06
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1806448527807D+13   R2 =   0.6313048244909D-05
     ISTATE -5 - shortening step at time   56322.632755182836      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4606899004511D+11   R2 =   0.1792960568118D-04
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4609029560044D+11   R2 =   0.2538686609691D+02
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1812875280631D+13   R2 =   0.3051702631091D+03
     ISTATE -5 - shortening step at time   56322.632755182836      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4611967973969D+11   R2 =   0.5603309629113D-06
     ISTATE -5 - shortening step at time   1411.9065318322757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1812893994370D+13   R2 =   0.1892857107038D-06
     ISTATE -5 - shortening step at time   57369.470906047063      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1813680224116D+13   R2 =   0.3130356735436D+03
     ISTATE -5 - shortening step at time   57369.470906047063      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4614289518364D+11   R2 =   0.4035535832164D-05
     ISTATE -5 - shortening step at time   1411.9065318322757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4616687712327D+11   R2 =   0.1209361944754D+03
     ISTATE -5 - shortening step at time   1411.9065318322757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1817106762523D+13   R2 =   0.3405709789057D-05
     ISTATE -5 - shortening step at time   57369.470906047063      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1820457949879D+13   R2 =   0.1582042208077D+04
     ISTATE -5 - shortening step at time   57369.470906047063      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5232542496613D+11   R2 =   0.2607918887995D-07
     ISTATE -5 - shortening step at time   1607.0748714020046      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4302548750539D+12
     ISTATE -1: Reducing time step to    57.400005049619189      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5265860801261D+11   R2 =   0.1017754239999D+04
     ISTATE -5 - shortening step at time   1607.0748714020046      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1825506407378D+13   R2 =   0.1901725897431D-04
     ISTATE -5 - shortening step at time   57369.470906047063      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1825575729417D+13   R2 =   0.5902733411334D+03
     ISTATE -5 - shortening step at time   57369.470906047063      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6291186976484D+11   R2 =   0.8891685117606D+03
     ISTATE -5 - shortening step at time   1944.5606786908581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6661045091682D+11   R2 =   0.3449774166442D+03
     ISTATE -5 - shortening step at time   1944.5606786908581      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1829340532078D+13   R2 =   0.2522755432800D+03
     ISTATE -5 - shortening step at time   57369.470906047063      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6686563986043D+11   R2 =   0.1055898050836D+04
     ISTATE -5 - shortening step at time   1944.5606786908581      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6754394931262D+11   R2 =   0.3641625174396D-04
     ISTATE -5 - shortening step at time   1944.5606786908581      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6828654491908D+11   R2 =   0.1608575870937D+03
     ISTATE -5 - shortening step at time   2139.0167929218833      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1841639423515D+13   R2 =   0.1065368223914D-04
     ISTATE -5 - shortening step at time   57369.470906047063      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6854745822867D+11   R2 =   0.1478840045399D+03
     ISTATE -5 - shortening step at time   2139.0167929218833      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6861058742678D+11   R2 =   0.2531113869701D+03
     ISTATE -5 - shortening step at time   2139.0167929218833      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6866451718179D+11   R2 =   0.2501421872798D+01
     ISTATE -5 - shortening step at time   2139.0167929218833      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1843812813800D+13   R2 =   0.5086546723875D-04
     ISTATE -5 - shortening step at time   57369.470906047063      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7016761018987D+11   R2 =   0.7946184501172D-05
     ISTATE -5 - shortening step at time   2139.0167929218833      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1844835138374D+13   R2 =   0.6646706482983D+02
     ISTATE -5 - shortening step at time   57369.470906047063      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1845033480979D+13   R2 =   0.1151004552652D+03
     ISTATE -5 - shortening step at time   58380.858809289071      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7075420238151D+11   R2 =   0.4195161468392D-05
     ISTATE -5 - shortening step at time   2139.0167929218833      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1845812249641D+13   R2 =   0.2707141252127D+03
     ISTATE -5 - shortening step at time   58380.858809289071      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7083082819807D+11   R2 =   0.5091303332452D+03
     ISTATE -5 - shortening step at time   2139.0167929218833      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7089415545169D+11   R2 =   0.3117334861927D+03
     ISTATE -5 - shortening step at time   2139.0167929218833      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7094689979824D+11   R2 =   0.2958344012551D+03
     ISTATE -5 - shortening step at time   2139.0167929218833      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7101604477020D+11   R2 =   0.3305966983510D+03
     ISTATE -5 - shortening step at time   2139.0167929218833      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1849008825386D+13   R2 =   0.2120146207746D-05
     ISTATE -5 - shortening step at time   58380.858809289071      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7159897749817D+11   R2 =   0.1334255190099D-04
     ISTATE -5 - shortening step at time   2247.3431889302296      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7163894351657D+11   R2 =   0.1846997535800D+03
     ISTATE -5 - shortening step at time   2247.3431889302296      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1849226421288D+13   R2 =   0.3941421780074D-05
     ISTATE -5 - shortening step at time   58380.858809289071      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7170836143867D+11   R2 =   0.2513979802380D-04
     ISTATE -5 - shortening step at time   2247.3431889302296      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1849563937495D+13   R2 =   0.4781175875384D+02
     ISTATE -5 - shortening step at time   58380.858809289071      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7346144045463D+11   R2 =   0.5855052625851D-05
     ISTATE -5 - shortening step at time   2247.3431889302296      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7352622917864D+11   R2 =   0.4046698323737D+03
     ISTATE -5 - shortening step at time   2247.3431889302296      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1849744790629D+13   R2 =   0.6800243487907D-06
     ISTATE -5 - shortening step at time   58380.858809289071      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7361879394158D+11   R2 =   0.3578781785265D+03
     ISTATE -5 - shortening step at time   2247.3431889302296      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1849866677144D+13   R2 =   0.1415277361883D+03
     ISTATE -5 - shortening step at time   58380.858809289071      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7408589473353D+11   R2 =   0.3346128128162D-05
     ISTATE -5 - shortening step at time   2247.3431889302296      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1849970847785D+13   R2 =   0.2313139244553D-05
     ISTATE -5 - shortening step at time   58380.858809289071      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7416035702767D+11   R2 =   0.1507061559862D+03
     ISTATE -5 - shortening step at time   2247.3431889302296      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1850078536706D+13   R2 =   0.3345262924762D+02
     ISTATE -5 - shortening step at time   58380.858809289071      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7428194973042D+11   R2 =   0.6160100851730D+03
     ISTATE -5 - shortening step at time   2247.3431889302296      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7433673343989D+11   R2 =   0.4145188006217D+03
     ISTATE -5 - shortening step at time   2247.3431889302296      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1850182767166D+13   R2 =   0.2656928534392D-05
     ISTATE -5 - shortening step at time   58380.858809289071      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1850397720989D+13   R2 =   0.7392922733841D+01
     ISTATE -5 - shortening step at time   58550.087568539799      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9084915706709D+11   R2 =   0.1027396687190D-05
     ISTATE -5 - shortening step at time   2846.4383342208380      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9211013067581D+11   R2 =   0.1197888134351D+04
     ISTATE -5 - shortening step at time   2846.4383342208380      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9235100163478D+11   R2 =   0.5355574260003D+03
     ISTATE -5 - shortening step at time   2846.4383342208380      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9348786367466D+11   R2 =   0.2782825436358D+04
     ISTATE -5 - shortening step at time   2846.4383342208380      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9357082947339D+11   R2 =   0.2625825440547D+03
     ISTATE -5 - shortening step at time   2846.4383342208380      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9360807528571D+11   R2 =   0.4003658473298D-04
     ISTATE -5 - shortening step at time   2846.4383342208380      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9363900062606D+11   R2 =   0.9756669364392D-05
     ISTATE -5 - shortening step at time   2846.4383342208380      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9374685722630D+11   R2 =   0.6442889962111D-05
     ISTATE -5 - shortening step at time   2846.4383342208380      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1974030764924D+13
     ISTATE -1: Reducing time step to    193.57697462493374      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9383289752716D+11   R2 =   0.8047737453222D-04
     ISTATE -5 - shortening step at time   2846.4383342208380      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9418892274547D+11   R2 =   0.9211143045951D-05
     ISTATE -5 - shortening step at time   2846.4383342208380      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9494132508145D+11   R2 =   0.5291643428745D-06
     ISTATE -5 - shortening step at time   2980.6621121985463      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9592149996670D+11   R2 =   0.5508724080189D+03
     ISTATE -5 - shortening step at time   2980.6621121985463      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9610709926640D+11   R2 =   0.6913675531176D+03
     ISTATE -5 - shortening step at time   2980.6621121985463      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9775184835566D+11   R2 =   0.1812536566632D-05
     ISTATE -5 - shortening step at time   2980.6621121985463      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9779102720460D+11   R2 =   0.1256158202053D+03
     ISTATE -5 - shortening step at time   2980.6621121985463      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9981159172742D+11   R2 =   0.2018717703808D-04
     ISTATE -5 - shortening step at time   2980.6621121985463      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4401450644899D+12
     ISTATE -1: Reducing time step to    26.101936747745871      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9991438910023D+11   R2 =   0.3438115570912D-04
     ISTATE -5 - shortening step at time   2980.6621121985463      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1028031041521D+12   R2 =   0.7432938789826D-06
     ISTATE -5 - shortening step at time   2980.6621121985463      years
    [Parallel(n_jobs=4)]: Done   5 out of   9 | elapsed:  2.0min remaining:  1.6min


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1028565571444D+12   R2 =   0.2539188191230D-04
     ISTATE -5 - shortening step at time   2980.6621121985463      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1030762970745D+12   R2 =   0.2639362644206D-04
     ISTATE -5 - shortening step at time   2980.6621121985463      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1989288942741D+13   R2 =   0.1382657275043D+04
     ISTATE -5 - shortening step at time   58550.087568539799      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1034055910090D+12   R2 =   0.4087613001256D-05
     ISTATE -5 - shortening step at time   3261.9081352688995      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1034382895406D+12   R2 =   0.1404031766183D-04
     ISTATE -5 - shortening step at time   3261.9081352688995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1037692585129D+12   R2 =   0.2500978820065D+03
     ISTATE -5 - shortening step at time   3261.9081352688995      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1044462364150D+12   R2 =   0.2734015300505D-03
     ISTATE -5 - shortening step at time   3261.9081352688995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1050304112802D+12   R2 =   0.7326078837292D+03
     ISTATE -5 - shortening step at time   3261.9081352688995      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1056123919927D+12   R2 =   0.1635922066925D+04
     ISTATE -5 - shortening step at time   3261.9081352688995      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1057693798445D+12   R2 =   0.8704704402731D-05
     ISTATE -5 - shortening step at time   3261.9081352688995      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1062168493075D+12   R2 =   0.6007645396774D-05
     ISTATE -5 - shortening step at time   3261.9081352688995      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1063724727982D+12   R2 =   0.4625457787074D+03
     ISTATE -5 - shortening step at time   3261.9081352688995      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1064817290246D+12   R2 =   0.2320722173398D-05
     ISTATE -5 - shortening step at time   3261.9081352688995      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1070809074873D+12   R2 =   0.8752454578133D-06
     ISTATE -5 - shortening step at time   3369.6749691343539      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1075057835649D+12   R2 =   0.3706042700193D-04
     ISTATE -5 - shortening step at time   3369.6749691343539      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1076031376031D+12   R2 =   0.1714493730564D+03
     ISTATE -5 - shortening step at time   3369.6749691343539      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1174465260394D+12   R2 =   0.3902736363000D+02
     ISTATE -5 - shortening step at time   3706.6425463871010      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1176443998246D+12   R2 =   0.1206115883701D-03
     ISTATE -5 - shortening step at time   3706.6425463871010      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1185274699095D+12   R2 =   0.1696521539991D-04
     ISTATE -5 - shortening step at time   3706.6425463871010      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1186041856246D+12   R2 =   0.2287673425065D+03
     ISTATE -5 - shortening step at time   3706.6425463871010      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1186856232690D+12   R2 =   0.2354661687347D+03
     ISTATE -5 - shortening step at time   3706.6425463871010      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1187468601891D+12   R2 =   0.5286960007184D-05
     ISTATE -5 - shortening step at time   3706.6425463871010      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1187927684899D+12   R2 =   0.1908825646515D-04
     ISTATE -5 - shortening step at time   3706.6425463871010      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1189449757490D+12   R2 =   0.4928472432123D+03
     ISTATE -5 - shortening step at time   3706.6425463871010      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1190167417491D+12   R2 =   0.1322389479102D+03
     ISTATE -5 - shortening step at time   3706.6425463871010      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1191044845900D+12   R2 =   0.1578410333882D-04
     ISTATE -5 - shortening step at time   3706.6425463871010      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1193589524753D+12   R2 =   0.1017819076093D-04
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1196555903598D+12   R2 =   0.2225384661426D-04
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1196956142647D+12   R2 =   0.2515740127529D-05
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1197185723918D+12   R2 =   0.1689593341541D-04
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1197998151441D+12   R2 =   0.3175087807902D-04
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1198606946488D+12   R2 =   0.3652175602809D-04
     ISTATE -5 - shortening step at time   3769.1292591769816      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1199133013427D+12   R2 =   0.4742004240445D+03
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1205386351867D+12   R2 =   0.7874308902699D+03
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1205627262547D+12   R2 =   0.1386042849401D-05
     ISTATE -5 - shortening step at time   3769.1292591769816      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1206435850676D+12   R2 =   0.3537313464744D-04
     ISTATE -5 - shortening step at time   3769.1292591769816      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2035481450614D+13   R2 =   0.1881222952847D-05
     ISTATE -5 - shortening step at time   64405.097721336650      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2035538018843D+13   R2 =   0.4893613817360D-04
     ISTATE -5 - shortening step at time   64405.097721336650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1209559361951D+12   R2 =   0.3914545482788D-05
     ISTATE -5 - shortening step at time   3817.8349704923421      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2035942872957D+13   R2 =   0.8728897054204D+02
     ISTATE -5 - shortening step at time   64405.097721336650      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1210045619798D+12   R2 =   0.1547241388973D-04
     ISTATE -5 - shortening step at time   3817.8349704923421      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2036086379169D+13   R2 =   0.5426741426781D-05
     ISTATE -5 - shortening step at time   64405.097721336650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1214228923748D+12   R2 =   0.4187069283271D+03
     ISTATE -5 - shortening step at time   3817.8349704923421      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2040579929014D+13   R2 =   0.1565088146485D+03
     ISTATE -5 - shortening step at time   64405.097721336650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2040664854615D+13   R2 =   0.1264081953375D+03
     ISTATE -5 - shortening step at time   64405.097721336650      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2043072233968D+13   R2 =   0.1094052209220D-04
     ISTATE -5 - shortening step at time   64405.097721336650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2043270780882D+13   R2 =   0.1147815545748D+03
     ISTATE -5 - shortening step at time   64405.097721336650      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1330323836138D+12   R2 =   0.1834041831818D-05
     ISTATE -5 - shortening step at time   4199.6185585658550      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1332848168427D+12   R2 =   0.1446603644175D+03
     ISTATE -5 - shortening step at time   4199.6185585658550      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2050158288488D+13   R2 =   0.2354750174226D-05
     ISTATE -5 - shortening step at time   64405.097721336650      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1462123024624D+12   R2 =   0.9816301114780D-06
     ISTATE -5 - shortening step at time   4619.5805145491495      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2051864640019D+13   R2 =   0.1803062196706D+03
     ISTATE -5 - shortening step at time   64405.097721336650      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1467258923638D+12   R2 =   0.1901948174015D-04
     ISTATE -5 - shortening step at time   4619.5805145491495      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1476948400816D+12   R2 =   0.1007097225844D-03
     ISTATE -5 - shortening step at time   4619.5805145491495      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1490992806080D+12   R2 =   0.8555764921903D-05
     ISTATE -5 - shortening step at time   4619.5805145491495      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492522930774D+12   R2 =   0.2402069339256D-04
     ISTATE -5 - shortening step at time   4619.5805145491495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1493506805011D+12   R2 =   0.1760861041582D+03
     ISTATE -5 - shortening step at time   4619.5805145491495      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1494203513099D+12   R2 =   0.1488680407525D-04
     ISTATE -5 - shortening step at time   4619.5805145491495      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1519495008623D+12   R2 =   0.5355891791584D-04
     ISTATE -5 - shortening step at time   4619.5805145491495      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4619048502626D+12
     ISTATE -1: Reducing time step to    99.138496556813294      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1519902042296D+12   R2 =   0.1100527732411D-04
     ISTATE -5 - shortening step at time   4619.5805145491495      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1543791302375D+12   R2 =   0.1393660026022D+04
     ISTATE -5 - shortening step at time   4619.5805145491495      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1591761327202D+12   R2 =   0.8530010849438D+03
     ISTATE -5 - shortening step at time   4885.4155138450360      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030441018873D+10
     ISTATE -1: Reducing time step to    2.5210197413531339      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1594152203063D+12   R2 =   0.6416346398154D-05
     ISTATE -5 - shortening step at time   4885.4155138450360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613081276750D+12   R2 =   0.1195243328140D-04
     ISTATE -5 - shortening step at time   4885.4155138450360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1632556010292D+12   R2 =   0.3445607537501D-05
     ISTATE -5 - shortening step at time   4885.4155138450360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1684712802238D+12   R2 =   0.1099211752075D-04
     ISTATE -5 - shortening step at time   4885.4155138450360      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1728459026738D+12   R2 =   0.7646762155646D-05
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1730779463428D+12   R2 =   0.1382250093575D-04
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1773841661703D+12   R2 =   0.1431338246500D+04
     ISTATE -5 - shortening step at time   5373.9571817069218      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1777499427078D+12   R2 =   0.1345877410261D+03
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1781308201184D+12   R2 =   0.3951901722564D+03
     ISTATE -5 - shortening step at time   5373.9571817069218      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1787032165471D+12   R2 =   0.5490199364198D+03
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1794538816683D+12   R2 =   0.1380198397635D-04
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1796954065335D+12   R2 =   0.1318304400875D-04
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1802359216623D+12   R2 =   0.1819708278135D-05
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1803943790421D+12   R2 =   0.1293883796835D-03
     ISTATE -5 - shortening step at time   5373.9571817069218      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1853856384704D+12   R2 =   0.9668714370228D+02
     ISTATE -5 - shortening step at time   5708.6828810803718      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1882360795222D+12   R2 =   0.5597812076400D+03
     ISTATE -5 - shortening step at time   5708.6828810803718      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1950860438324D+12   R2 =   0.9316961959733D-05
     ISTATE -5 - shortening step at time   5708.6828810803718      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1952034297030D+12   R2 =   0.8039285636740D+02
     ISTATE -5 - shortening step at time   5708.6828810803718      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1960238589734D+12   R2 =   0.1003933327567D-05
     ISTATE -5 - shortening step at time   5708.6828810803718      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1975877780923D+12   R2 =   0.5632805210999D-04
     ISTATE -5 - shortening step at time   5708.6828810803718      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2017245716146D+12   R2 =   0.1256566955768D+03
     ISTATE -5 - shortening step at time   6279.5513052940150      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2052397639137D+12   R2 =   0.1233421323425D+03
     ISTATE -5 - shortening step at time   6279.5513052940150      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2053033558404D+12   R2 =   0.2569126213076D-04
     ISTATE -5 - shortening step at time   6279.5513052940150      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2257076657522D+13   R2 =   0.7526161135852D-07
     ISTATE -5 - shortening step at time   71425.669396866215      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2070471517718D+12   R2 =   0.1278030103660D+03
     ISTATE -5 - shortening step at time   6279.5513052940150      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4709084577807D+12
     ISTATE -1: Reducing time step to    70.646067277430788      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2070765516721D+12   R2 =   0.2199655013037D-04
     ISTATE -5 - shortening step at time   6279.5513052940150      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030457315769D+10
     ISTATE -1: Reducing time step to    2.5209681688975385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2072796931255D+12   R2 =   0.4185591827330D-05
     ISTATE -5 - shortening step at time   6279.5513052940150      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2074931208047D+12   R2 =   0.1717982859808D-04
     ISTATE -5 - shortening step at time   6279.5513052940150      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2093656249168D+12   R2 =   0.1276920333134D+03
     ISTATE -5 - shortening step at time   6279.5513052940150      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2095133657833D+12   R2 =   0.9408319044915D-05
     ISTATE -5 - shortening step at time   6279.5513052940150      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2483028761093D+13   R2 =   0.4039722777613D-06
     ISTATE -5 - shortening step at time   78568.238039473494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2483163174368D+13   R2 =   0.4116872269133D+03
     ISTATE -5 - shortening step at time   78568.238039473494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2204256503181D+12   R2 =   0.2359289213425D-04
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2221614525058D+12   R2 =   0.1425983074232D-04
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2227758711650D+12   R2 =   0.4062506455124D-05
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2228110131844D+12   R2 =   0.6940311561624D-04
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2248919419754D+12   R2 =   0.4844559528266D+03
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2249122929520D+12   R2 =   0.1188427102674D-04
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2249345769322D+12   R2 =   0.1820356212746D-04
     ISTATE -5 - shortening step at time   6907.5065855395869      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2250085434664D+12   R2 =   0.3223804731709D+03
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2335342449877D+12   R2 =   0.2135469462570D-04
     ISTATE -5 - shortening step at time   6907.5065855395869      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2345361317944D+12   R2 =   0.3112242089133D+03
     ISTATE -5 - shortening step at time   6907.5065855395869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2384453717372D+12   R2 =   0.9685272876674D+02
     ISTATE -5 - shortening step at time   7422.0294871658743      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2387107587919D+12   R2 =   0.3808750421453D+03
     ISTATE -5 - shortening step at time   7422.0294871658743      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388851921252D+12   R2 =   0.3325222758844D+02
     ISTATE -5 - shortening step at time   7422.0294871658743      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2388970338769D+12   R2 =   0.5182325246100D-05
     ISTATE -5 - shortening step at time   7422.0294871658743      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2389303243501D+12   R2 =   0.3939522399656D+03
     ISTATE -5 - shortening step at time   7422.0294871658743      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2442491774955D+12   R2 =   0.1003433968244D-04
     ISTATE -5 - shortening step at time   7422.0294871658743      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2460090885383D+12   R2 =   0.2115144798867D-04
     ISTATE -5 - shortening step at time   7422.0294871658743      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2463276617086D+12   R2 =   0.1709101379242D+03
     ISTATE -5 - shortening step at time   7422.0294871658743      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2488942916672D+12   R2 =   0.6947763042197D+03
     ISTATE -5 - shortening step at time   7422.0294871658743      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2489239663395D+12   R2 =   0.1475303283238D-04
     ISTATE -5 - shortening step at time   7422.0294871658743      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2490557699440D+12   R2 =   0.5978848940351D+01
     ISTATE -5 - shortening step at time   7877.3407069465347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2493262576977D+12   R2 =   0.3574267430295D+03
     ISTATE -5 - shortening step at time   7877.3407069465347      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2494035098885D+12   R2 =   0.4625280901551D+02
     ISTATE -5 - shortening step at time   7877.3407069465347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2509909780818D+12   R2 =   0.1263217536628D+03
     ISTATE -5 - shortening step at time   7877.3407069465347      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030472963483D+10
     ISTATE -1: Reducing time step to    2.5209186508136718      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2545692542123D+12   R2 =   0.5433564579683D-05
     ISTATE -5 - shortening step at time   7877.3407069465347      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2569211148219D+12   R2 =   0.1265318728212D+03
     ISTATE -5 - shortening step at time   7877.3407069465347      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2571351903000D+12   R2 =   0.8648995353567D-04
     ISTATE -5 - shortening step at time   7877.3407069465347      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2594691913027D+12   R2 =   0.1274519578170D+03
     ISTATE -5 - shortening step at time   7877.3407069465347      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4805506277726D+12
     ISTATE -1: Reducing time step to    40.132870645894926      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2595297018064D+12   R2 =   0.2369625744988D+03
     ISTATE -5 - shortening step at time   7877.3407069465347      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2637733963675D+12   R2 =   0.1266390865067D+03
     ISTATE -5 - shortening step at time   7877.3407069465347      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2638852431046D+12   R2 =   0.1530847546045D-05
     ISTATE -5 - shortening step at time   8347.2593787181740      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2739209432051D+12   R2 =   0.1229277482353D+04
     ISTATE -5 - shortening step at time   8347.2593787181740      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3294556451152D+12   R2 =   0.6369620845264D-05
     ISTATE -5 - shortening step at time   10100.184286080173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3295152174912D+12   R2 =   0.9262380523129D+02
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3300459479829D+12   R2 =   0.1635311877540D+03
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3301798260061D+12   R2 =   0.7343653890616D-05
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3317668683701D+12   R2 =   0.5600560447112D+03
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3353718595794D+12   R2 =   0.1690880086040D-04
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3366584629668D+12   R2 =   0.1087074549608D-04
     ISTATE -5 - shortening step at time   10100.184286080173      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3371563476872D+12   R2 =   0.2321208784338D+03
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3374249987220D+12   R2 =   0.3248924919998D-05
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3392680149908D+12   R2 =   0.9257750897908D-05
     ISTATE -5 - shortening step at time   10100.184286080173      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3511715079844D+12   R2 =   0.1138623239254D-04
     ISTATE -5 - shortening step at time   10736.329588315763      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3514331933755D+12   R2 =   0.2549095934186D+03
     ISTATE -5 - shortening step at time   10736.329588315763      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3514519955919D+12   R2 =   0.6364486376104D+02
     ISTATE -5 - shortening step at time   10736.329588315763      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3575102108068D+12   R2 =   0.3617086238784D+03
     ISTATE -5 - shortening step at time   10736.329588315763      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3618488110834D+12   R2 =   0.2103722028772D+03
     ISTATE -5 - shortening step at time   10736.329588315763      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030485419493D+10
     ISTATE -1: Reducing time step to    2.5208792330594303      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3636734571700D+12   R2 =   0.1908828815244D+03
     ISTATE -5 - shortening step at time   10736.329588315763      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3650013788169D+12   R2 =   0.2721377894343D+03
     ISTATE -5 - shortening step at time   10736.329588315763      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3823170365266D+12   R2 =   0.5542456838523D+03
     ISTATE -5 - shortening step at time   11809.962803121385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3850767510503D+12   R2 =   0.3118326668627D+03
     ISTATE -5 - shortening step at time   11809.962803121385      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.4894026248289D+12
     ISTATE -1: Reducing time step to    12.120221316227417      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3850982477756D+12   R2 =   0.6314025026064D+02
     ISTATE -5 - shortening step at time   11809.962803121385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3949707274348D+12   R2 =   0.1195004439513D-04
     ISTATE -5 - shortening step at time   11809.962803121385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3986452526869D+12   R2 =   0.1873092572144D-04
     ISTATE -5 - shortening step at time   11809.962803121385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3987170150761D+12   R2 =   0.1746197910999D-04
     ISTATE -5 - shortening step at time   11809.962803121385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3991736601231D+12   R2 =   0.5609038390997D+03
     ISTATE -5 - shortening step at time   11809.962803121385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3992577364774D+12   R2 =   0.1837668519826D+03
     ISTATE -5 - shortening step at time   11809.962803121385      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4005045188582D+12   R2 =   0.2355540060943D+03
     ISTATE -5 - shortening step at time   11809.962803121385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4006457056245D+12   R2 =   0.4961759488495D+02
     ISTATE -5 - shortening step at time   11809.962803121385      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4007260175041D+12   R2 =   0.4688109582491D-06
     ISTATE -5 - shortening step at time   12678.661570396451      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4015031302122D+12   R2 =   0.1128961683733D+03
     ISTATE -5 - shortening step at time   12678.661570396451      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4023839198712D+12   R2 =   0.1638411540078D+02
     ISTATE -5 - shortening step at time   12678.661570396451      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4026251754210D+12   R2 =   0.1884399752648D+03
     ISTATE -5 - shortening step at time   12678.661570396451      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4030769125762D+12   R2 =   0.3196388925092D+03
     ISTATE -5 - shortening step at time   12678.661570396451      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4031059575119D+12   R2 =   0.8505240541722D+02
     ISTATE -5 - shortening step at time   12678.661570396451      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4031845341141D+12   R2 =   0.1001820298466D-04
     ISTATE -5 - shortening step at time   12678.661570396451      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4032331725028D+12   R2 =   0.1363714179366D-05
     ISTATE -5 - shortening step at time   12678.661570396451      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4036672603882D+12   R2 =   0.1974867908348D+03
     ISTATE -5 - shortening step at time   12678.661570396451      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4060629044550D+12   R2 =   0.1219037620220D-04
     ISTATE -5 - shortening step at time   12678.661570396451      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4640413456912D+12   R2 =   0.2091138614307D-06
     ISTATE -5 - shortening step at time   14135.101410815027      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4914128877055D+12   R2 =   0.9109075804398D-07
     ISTATE -5 - shortening step at time   15548.611888903608      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4967342385733D+12   R2 =   0.1180535699854D+02
     ISTATE -5 - shortening step at time   15548.611888903608      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030498212329D+10
     ISTATE -1: Reducing time step to    2.5208387494010838      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5214248534870D+12
     ISTATE -1: Reducing time step to    66.870363183398851      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5405459562565D+12   R2 =   0.5754707853624D-07
     ISTATE -5 - shortening step at time   17103.473448501765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5796453178121D+12   R2 =   0.3779410166851D-05
     ISTATE -5 - shortening step at time   17103.473448501765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5801026955506D+12   R2 =   0.1746789340410D+03
     ISTATE -5 - shortening step at time   17103.473448501765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5801277064629D+12   R2 =   0.7886633125493D+02
     ISTATE -5 - shortening step at time   17103.473448501765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6010262453451D+12   R2 =   0.8307633679169D+03
     ISTATE -5 - shortening step at time   18813.821201130526      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.5364030921470D+12
     ISTATE -1: Reducing time step to    19.470873046884929      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6591244144042D+12   R2 =   0.2854712111461D+03
     ISTATE -5 - shortening step at time   20695.203769800031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6593168357298D+12   R2 =   0.3990943727205D+02
     ISTATE -5 - shortening step at time   20695.203769800031      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6640043172748D+12   R2 =   0.1311170244142D+03
     ISTATE -5 - shortening step at time   20695.203769800031      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6640805909604D+12   R2 =   0.1032301978626D+03
     ISTATE -5 - shortening step at time   20695.203769800031      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6641984295960D+12   R2 =   0.3687804204027D+02
     ISTATE -5 - shortening step at time   20695.203769800031      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6741883134463D+12   R2 =   0.6448154523538D-06
     ISTATE -5 - shortening step at time   20695.203769800031      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6803680641964D+12   R2 =   0.8208756205577D+01
     ISTATE -5 - shortening step at time   20695.203769800031      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6484653990817D+12   R2 =   0.1043929246350D-09
     ISTATE -5 - shortening step at time   18886.439546438512      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6652889927869D+12   R2 =   0.1320159622557D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6653065135328D+12   R2 =   0.1806468932724D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6664502314874D+12   R2 =   0.2159629395448D-07
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6664616267422D+12   R2 =   0.9573151874578D+02
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6664730561513D+12   R2 =   0.9727363107383D+02
     ISTATE -5 - shortening step at time   20775.083951370172      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6664811346985D+12   R2 =   0.5461635117755D-05
     ISTATE -5 - shortening step at time   20775.083951370172      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6664925560883D+12   R2 =   0.1368214786622D-04
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6665040754981D+12   R2 =   0.9979221763837D+02
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6665156271228D+12   R2 =   0.1020390378828D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6665272104393D+12   R2 =   0.1005740251388D+03
     ISTATE -5 - shortening step at time   20775.083951370172      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030509676821D+10
     ISTATE -1: Reducing time step to    2.5208024693617337      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6751775397692D+12   R2 =   0.1405329241947D+03
     ISTATE -5 - shortening step at time   21092.633241750336      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6751821915712D+12   R2 =   0.1183736553137D-05
     ISTATE -5 - shortening step at time   21092.633241750336      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6752601910867D+12   R2 =   0.5114980551179D+03
     ISTATE -5 - shortening step at time   21092.633241750336      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6752993584490D+12   R2 =   0.2172075790054D+03
     ISTATE -5 - shortening step at time   21092.633241750336      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6753032955875D+12   R2 =   0.1351260379914D+03
     ISTATE -5 - shortening step at time   21092.633241750336      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6753678141970D+12   R2 =   0.1205777302443D-04
     ISTATE -5 - shortening step at time   21092.633241750336      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6753717731894D+12   R2 =   0.1358759592086D+03
     ISTATE -5 - shortening step at time   21092.633241750336      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6753800970162D+12   R2 =   0.4828413414789D-05
     ISTATE -5 - shortening step at time   21092.633241750336      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6753843523084D+12   R2 =   0.1888278996604D-05
     ISTATE -5 - shortening step at time   21092.633241750336      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6753894948814D+12   R2 =   0.7733224529459D-05
     ISTATE -5 - shortening step at time   21092.633241750336      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6818781877245D+12   R2 =   0.4338430620441D+03
     ISTATE -5 - shortening step at time   21373.085281058167      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7084442675513D+12   R2 =   0.1402894430335D-08
     ISTATE -5 - shortening step at time   21373.085281058167      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7113432503398D+12   R2 =   0.2081629454246D+04
     ISTATE -5 - shortening step at time   21373.085281058167      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7113985421071D+12   R2 =   0.7066800994251D+03
     ISTATE -5 - shortening step at time   21373.085281058167      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7123233121605D+12   R2 =   0.2052130595339D+04
     ISTATE -5 - shortening step at time   21373.085281058167      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7251454999872D+12   R2 =   0.7472923378875D-08
     ISTATE -5 - shortening step at time   21373.085281058167      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7251869492658D+12   R2 =   0.2725084975651D+03
     ISTATE -5 - shortening step at time   21373.085281058167      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7252283887986D+12   R2 =   0.2193716859522D+03
     ISTATE -5 - shortening step at time   21373.085281058167      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7463139379370D+12   R2 =   0.4532452565499D+03
     ISTATE -5 - shortening step at time   23510.394318738046      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7754931961854D+12   R2 =   0.9280130000354D+04
     ISTATE -5 - shortening step at time   23510.394318738046      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7754986011219D+12   R2 =   0.3131801439366D-05
     ISTATE -5 - shortening step at time   23510.394318738046      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7913949063314D+12   R2 =   0.1621568001946D+02
     ISTATE -5 - shortening step at time   25041.197646964687      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7918482291230D+12   R2 =   0.4252505375005D-04
     ISTATE -5 - shortening step at time   25041.197646964687      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2743093501359D+13   R2 =   0.3028023460866D+03
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2745315065411D+13   R2 =   0.1795436579319D+03
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2745409293963D+13   R2 =   0.3006020662964D-04
     ISTATE -5 - shortening step at time   86425.063716633609      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746176602943D+13   R2 =   0.1976221624260D+03
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746563345462D+13   R2 =   0.2942097747386D-05
     ISTATE -5 - shortening step at time   86425.063716633609      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746621785947D+13   R2 =   0.1009091055869D+03
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2746743157986D+13   R2 =   0.1045677156191D+03
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030521028761D+10
     ISTATE -1: Reducing time step to    2.5207665454997312      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2751283549067D+13   R2 =   0.1789735129189D+03
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2751588377467D+13   R2 =   0.2443863363679D-05
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2757107407195D+13   R2 =   0.1689664627354D+03
     ISTATE -5 - shortening step at time   86425.063716633609      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2757167638968D+13   R2 =   0.2990343233866D-06
     ISTATE -5 - shortening step at time   87250.234404920528      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030531580196D+10
     ISTATE -1: Reducing time step to    2.5207331548820622      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8182972553889D+12   R2 =   0.1352912279211D+03
     ISTATE -5 - shortening step at time   25861.434311143334      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8213884160488D+12   R2 =   0.8692811815854D+03
     ISTATE -5 - shortening step at time   25861.434311143334      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1166488197232D+13   R2 =   0.7944736008827D+04
     ISTATE -5 - shortening step at time   34421.571306334081      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1190732946353D+13   R2 =   0.1448898461616D+04
     ISTATE -5 - shortening step at time   34421.571306334081      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1192247506920D+13   R2 =   0.3455555240900D+03
     ISTATE -5 - shortening step at time   34421.571306334081      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1316442613153D+13   R2 =   0.8637175902221D-07
     ISTATE -5 - shortening step at time   41650.103086147523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319106177042D+13   R2 =   0.7925731889955D+03
     ISTATE -5 - shortening step at time   41650.103086147523      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319293643126D+13   R2 =   0.1557894276608D+04
     ISTATE -5 - shortening step at time   41650.103086147523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319386047379D+13   R2 =   0.3015160743528D+03
     ISTATE -5 - shortening step at time   41650.103086147523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319400306670D+13   R2 =   0.4040180738558D+03
     ISTATE -5 - shortening step at time   41650.103086147523      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319408270402D+13   R2 =   0.2100145912147D+03
     ISTATE -5 - shortening step at time   41650.103086147523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319773074679D+13   R2 =   0.4894832441527D+03
     ISTATE -5 - shortening step at time   41650.103086147523      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319775731637D+13   R2 =   0.7016872383479D+01
     ISTATE -5 - shortening step at time   41650.103086147523      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030541395217D+10
     ISTATE -1: Reducing time step to    2.5207020946899616      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319866498126D+13   R2 =   0.6409158775342D-05
     ISTATE -5 - shortening step at time   41650.103086147523      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1319890902747D+13   R2 =   0.3818994178531D+03
     ISTATE -5 - shortening step at time   41650.103086147523      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1321812246654D+13   R2 =   0.3602396268400D-07
     ISTATE -5 - shortening step at time   41768.699454016030      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1322144820495D+13   R2 =   0.8894718851120D+03
     ISTATE -5 - shortening step at time   41768.699454016030      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323073671128D+13   R2 =   0.8369325254222D+03
     ISTATE -5 - shortening step at time   41768.699454016030      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323084265862D+13   R2 =   0.2797733847151D+02
     ISTATE -5 - shortening step at time   41768.699454016030      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323682527418D+13   R2 =   0.7611933249511D+03
     ISTATE -5 - shortening step at time   41768.699454016030      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323716220161D+13   R2 =   0.4465393910492D+03
     ISTATE -5 - shortening step at time   41768.699454016030      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323748861873D+13   R2 =   0.3449210975116D+03
     ISTATE -5 - shortening step at time   41768.699454016030      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323752250051D+13   R2 =   0.1162863850059D+03
     ISTATE -5 - shortening step at time   41768.699454016030      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323760079982D+13   R2 =   0.2688192740168D+03
     ISTATE -5 - shortening step at time   41768.699454016030      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1323764690533D+13   R2 =   0.1614633996503D-05
     ISTATE -5 - shortening step at time   41768.699454016030      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1326132766602D+13   R2 =   0.9427734427967D+02
     ISTATE -5 - shortening step at time   41891.287675108892      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1326189995590D+13   R2 =   0.4534693866104D+03
     ISTATE -5 - shortening step at time   41891.287675108892      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1326231611289D+13   R2 =   0.3309869166513D+03
     ISTATE -5 - shortening step at time   41891.287675108892      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1327147375875D+13   R2 =   0.5177151303263D+03
     ISTATE -5 - shortening step at time   41891.287675108892      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1327155206452D+13   R2 =   0.2675851907135D+03
     ISTATE -5 - shortening step at time   41891.287675108892      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1327233512815D+13   R2 =   0.4365830319258D+03
     ISTATE -5 - shortening step at time   41891.287675108892      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1327238571399D+13   R2 =   0.1038445268730D-04
     ISTATE -5 - shortening step at time   41891.287675108892      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1327272568809D+13   R2 =   0.3413863554806D+03
     ISTATE -5 - shortening step at time   41891.287675108892      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1330393044415D+13   R2 =   0.3538642697184D+04
     ISTATE -5 - shortening step at time   41891.287675108892      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342733877765D+13   R2 =   0.2605928092398D+04
     ISTATE -5 - shortening step at time   41891.287675108892      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1344748261321D+13   R2 =   0.7324589748256D+03
     ISTATE -5 - shortening step at time   42491.578410292954      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345061833293D+13   R2 =   0.8500160350780D+03
     ISTATE -5 - shortening step at time   42491.578410292954      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345135791641D+13   R2 =   0.4440560452339D+03
     ISTATE -5 - shortening step at time   42491.578410292954      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345225977375D+13   R2 =   0.4870801594704D+03
     ISTATE -5 - shortening step at time   42491.578410292954      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345240148410D+13   R2 =   0.4157369276147D+03
     ISTATE -5 - shortening step at time   42491.578410292954      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345280110506D+13   R2 =   0.9757726302878D+02
     ISTATE -5 - shortening step at time   42491.578410292954      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345295153304D+13   R2 =   0.3513758883839D+03
     ISTATE -5 - shortening step at time   42491.578410292954      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345349327756D+13   R2 =   0.1595374083335D-05
     ISTATE -5 - shortening step at time   42491.578410292954      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345499843319D+13   R2 =   0.1023409317965D+03
     ISTATE -5 - shortening step at time   42491.578410292954      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345506634681D+13   R2 =   0.2313355616721D-05
     ISTATE -5 - shortening step at time   42491.578410292954      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345995525161D+13   R2 =   0.2189306514649D+03
     ISTATE -5 - shortening step at time   42579.323882295765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348638557500D+13   R2 =   0.1148489984972D+03
     ISTATE -5 - shortening step at time   42579.323882295765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348641232059D+13   R2 =   0.7063354372924D+01
     ISTATE -5 - shortening step at time   42579.323882295765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348663255486D+13   R2 =   0.3054044516186D+03
     ISTATE -5 - shortening step at time   42579.323882295765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348880174681D+13   R2 =   0.1143800414489D+04
     ISTATE -5 - shortening step at time   42579.323882295765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348882276817D+13   R2 =   0.5586757482919D-05
     ISTATE -5 - shortening step at time   42579.323882295765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348886052832D+13   R2 =   0.3200129047635D-05
     ISTATE -5 - shortening step at time   42579.323882295765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348912959855D+13   R2 =   0.2962212060851D+03
     ISTATE -5 - shortening step at time   42579.323882295765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348940424901D+13   R2 =   0.3264419022805D+03
     ISTATE -5 - shortening step at time   42579.323882295765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1348968385222D+13   R2 =   0.3565864176018D+03
     ISTATE -5 - shortening step at time   42579.323882295765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1485146352737D+13   R2 =   0.9547285544849D+02
     ISTATE -5 - shortening step at time   46957.761262835054      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1486490856357D+13   R2 =   0.1940094968507D+03
     ISTATE -5 - shortening step at time   46957.761262835054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1486501656635D+13   R2 =   0.4837451341512D-05
     ISTATE -5 - shortening step at time   46957.761262835054      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1486693991951D+13   R2 =   0.6062737463855D+03
     ISTATE -5 - shortening step at time   46957.761262835054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1487402369687D+13   R2 =   0.7350617694904D+03
     ISTATE -5 - shortening step at time   46957.761262835054      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1487431735716D+13   R2 =   0.2976548230127D+03
     ISTATE -5 - shortening step at time   46957.761262835054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1487434174584D+13   R2 =   0.4493645095088D-06
     ISTATE -5 - shortening step at time   46957.761262835054      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1487438971751D+13   R2 =   0.1266904875039D+02
     ISTATE -5 - shortening step at time   46957.761262835054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1487468820103D+13   R2 =   0.3458452388612D+03
     ISTATE -5 - shortening step at time   46957.761262835054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1487471842870D+13   R2 =   0.2804174551652D-06
     ISTATE -5 - shortening step at time   46957.761262835054      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.8030551256576D+10
     ISTATE -1: Reducing time step to    2.5206708878582376      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1489217477207D+13   R2 =   0.1243524624113D+03
     ISTATE -5 - shortening step at time   47071.893761711741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1489522109842D+13   R2 =   0.7213442431035D+03
     ISTATE -5 - shortening step at time   47071.893761711741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1489827531902D+13   R2 =   0.6714101095039D+03
     ISTATE -5 - shortening step at time   47071.893761711741      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492271291292D+13   R2 =   0.1105245918779D+04
     ISTATE -5 - shortening step at time   47071.893761711741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492334297135D+13   R2 =   0.4897187827205D+03
     ISTATE -5 - shortening step at time   47071.893761711741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492409797173D+13   R2 =   0.5565135987294D+03
     ISTATE -5 - shortening step at time   47071.893761711741      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492420719103D+13   R2 =   0.8196340203989D-06
     ISTATE -5 - shortening step at time   47071.893761711741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1492428673342D+13   R2 =   0.2730870363491D+03
     ISTATE -5 - shortening step at time   47071.893761711741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1493053986596D+13   R2 =   0.1176778139923D+04
     ISTATE -5 - shortening step at time   47071.893761711741      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1499171103271D+13   R2 =   0.4429213997098D+03
     ISTATE -5 - shortening step at time   47071.893761711741      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501375802688D+13   R2 =   0.1650107708810D+03
     ISTATE -5 - shortening step at time   47442.123521240006      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501521392286D+13   R2 =   0.6714369409313D+03
     ISTATE -5 - shortening step at time   47442.123521240006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1501523732653D+13   R2 =   0.6180775405097D+01
     ISTATE -5 - shortening step at time   47442.123521240006      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1502954720125D+13   R2 =   0.6879916040809D+03
     ISTATE -5 - shortening step at time   47442.123521240006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503046338358D+13   R2 =   0.7369551645137D+03
     ISTATE -5 - shortening step at time   47442.123521240006      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503051925307D+13   R2 =   0.6382594180920D-05
     ISTATE -5 - shortening step at time   47442.123521240006      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503056284531D+13   R2 =   0.2437037294405D-06
     ISTATE -5 - shortening step at time   47442.123521240006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503364231753D+13   R2 =   0.3211844381741D+04
     ISTATE -5 - shortening step at time   47442.123521240006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8852950110500D+12   R2 =   0.1360057664191D-04
     ISTATE -5 - shortening step at time   27545.318008689832      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503443845257D+13   R2 =   0.7138024804755D+03
     ISTATE -5 - shortening step at time   47442.123521240006      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1503451806582D+13   R2 =   0.2343656785719D+03
     ISTATE -5 - shortening step at time   47442.123521240006      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505083290345D+13   R2 =   0.1509806753945D+03
     ISTATE -5 - shortening step at time   47577.588815870389      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505104877384D+13   R2 =   0.5451435242210D+03
     ISTATE -5 - shortening step at time   47577.588815870389      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505118038041D+13   R2 =   0.4518337126575D+03
     ISTATE -5 - shortening step at time   47577.588815870389      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505859995927D+13   R2 =   0.1088247713095D+04
     ISTATE -5 - shortening step at time   47577.588815870389      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8895173619358D+12   R2 =   0.7856024777620D-05
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505865381148D+13   R2 =   0.2263884778410D-05
     ISTATE -5 - shortening step at time   47577.588815870389      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505889351960D+13   R2 =   0.2920855754636D+03
     ISTATE -5 - shortening step at time   47577.588815870389      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505893154952D+13   R2 =   0.2313931203285D-06
     ISTATE -5 - shortening step at time   47577.588815870389      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8895314365169D+12   R2 =   0.1783278815349D-05
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505922857209D+13   R2 =   0.5129132380247D+03
     ISTATE -5 - shortening step at time   47577.588815870389      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1505952891861D+13   R2 =   0.5752869544570D+03
     ISTATE -5 - shortening step at time   47577.588815870389      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1506147285248D+13   R2 =   0.6258952212977D+03
     ISTATE -5 - shortening step at time   47577.588815870389      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1507736597354D+13   R2 =   0.2677598666932D+03
     ISTATE -5 - shortening step at time   47662.888773677420      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1507744520559D+13   R2 =   0.1936359884133D+03
     ISTATE -5 - shortening step at time   47662.888773677420      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1507758919701D+13   R2 =   0.4943552700766D+03
     ISTATE -5 - shortening step at time   47662.888773677420      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1508403321329D+13   R2 =   0.7171340552593D+03
     ISTATE -5 - shortening step at time   47662.888773677420      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1508423018170D+13   R2 =   0.2073692362668D+03
     ISTATE -5 - shortening step at time   47662.888773677420      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1508430315431D+13   R2 =   0.1926981054752D+02
     ISTATE -5 - shortening step at time   47662.888773677420      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9055282269589D+12   R2 =   0.2660439708696D-05
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9058222214794D+12   R2 =   0.2154099011058D+03
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1508434147747D+13   R2 =   0.2761394303950D-05
     ISTATE -5 - shortening step at time   47662.888773677420      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1508560109577D+13   R2 =   0.6482056094761D+03
     ISTATE -5 - shortening step at time   47662.888773677420      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9058720994557D+12   R2 =   0.7539189609481D-05
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1508561732084D+13   R2 =   0.1307519191638D-04
     ISTATE -5 - shortening step at time   47662.888773677420      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1508587227336D+13   R2 =   0.4097757419337D+03
     ISTATE -5 - shortening step at time   47662.888773677420      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510259693657D+13   R2 =   0.1840215527701D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510271604484D+13   R2 =   0.3530140760951D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510283175249D+13   R2 =   0.3972506247426D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9073567051050D+12   R2 =   0.4018790288564D-05
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510347650878D+13   R2 =   0.7256945078893D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510447084845D+13   R2 =   0.7318174797144D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510519646679D+13   R2 =   0.6673108976451D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510528519574D+13   R2 =   0.1826807142039D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510543431148D+13   R2 =   0.3501122521100D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9108222797530D+12   R2 =   0.1125421599652D+03
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510551126693D+13   R2 =   0.2339863122124D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1510594358535D+13   R2 =   0.5104370767067D+03
     ISTATE -5 - shortening step at time   47740.102130885942      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9110260535026D+12   R2 =   0.2768942300761D+03
     ISTATE -5 - shortening step at time   27545.318008689832      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1514478526381D+13   R2 =   0.2418856845806D+04
     ISTATE -5 - shortening step at time   47803.618940969827      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1514483117406D+13   R2 =   0.3981379879496D-05
     ISTATE -5 - shortening step at time   47803.618940969827      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1514515759215D+13   R2 =   0.4266797752595D+03
     ISTATE -5 - shortening step at time   47803.618940969827      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9169109213660D+12   R2 =   0.1653537953164D-05
     ISTATE -5 - shortening step at time   27545.318008689832      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1514519743913D+13   R2 =   0.6220143308660D-06
     ISTATE -5 - shortening step at time   47803.618940969827      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1516863584969D+13   R2 =   0.5582869387754D+04
     ISTATE -5 - shortening step at time   47803.618940969827      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1520816194327D+13   R2 =   0.5709814834539D+04
     ISTATE -5 - shortening step at time   47803.618940969827      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1520826941536D+13   R2 =   0.2435812403813D-05
     ISTATE -5 - shortening step at time   47803.618940969827      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9325586251099D+12   R2 =   0.2786143296394D+03
     ISTATE -5 - shortening step at time   29016.168397658985      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1524823177739D+13   R2 =   0.1095375608210D+05
     ISTATE -5 - shortening step at time   47803.618940969827      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1524832324685D+13   R2 =   0.1521024692952D-05
     ISTATE -5 - shortening step at time   47803.618940969827      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1524865013219D+13   R2 =   0.4641531124088D+03
     ISTATE -5 - shortening step at time   47803.618940969827      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1526850872244D+13   R2 =   0.1557307214240D+03
     ISTATE -5 - shortening step at time   48255.221937301678      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1681244939530D+13   R2 =   0.8914568588001D+03
     ISTATE -5 - shortening step at time   53080.745281525989      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1681353837311D+13   R2 =   0.5389386891314D+03
     ISTATE -5 - shortening step at time   53080.745281525989      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1682240888544D+13   R2 =   0.9081006388901D+03
     ISTATE -5 - shortening step at time   53080.745281525989      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1682939623713D+13   R2 =   0.1085685577702D+04
     ISTATE -5 - shortening step at time   53080.745281525989      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1682957687324D+13   R2 =   0.2755256846562D+03
     ISTATE -5 - shortening step at time   53080.745281525989      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1685101226978D+13   R2 =   0.1927900082982D+03
     ISTATE -5 - shortening step at time   53080.745281525989      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1685123305418D+13   R2 =   0.3485820950726D+03
     ISTATE -5 - shortening step at time   53080.745281525989      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1685129124344D+13   R2 =   0.2419299442523D-05
     ISTATE -5 - shortening step at time   53080.745281525989      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1687703344867D+13   R2 =   0.3307446634936D+04
     ISTATE -5 - shortening step at time   53080.745281525989      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1687721427839D+13   R2 =   0.2216039320805D+03
     ISTATE -5 - shortening step at time   53080.745281525989      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690008234092D+13   R2 =   0.1246529345849D+03
     ISTATE -5 - shortening step at time   53408.905944274637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690017332443D+13   R2 =   0.1242527213548D-05
     ISTATE -5 - shortening step at time   53408.905944274637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690026662935D+13   R2 =   0.2463886811798D+02
     ISTATE -5 - shortening step at time   53408.905944274637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690055489774D+13   R2 =   0.3026517258641D+03
     ISTATE -5 - shortening step at time   53408.905944274637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690064965506D+13   R2 =   0.2502238902965D+02
     ISTATE -5 - shortening step at time   53408.905944274637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690069664377D+13   R2 =   0.5716371716533D-06
     ISTATE -5 - shortening step at time   53408.905944274637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1008638542045D+13   R2 =   0.1127162195061D-06
     ISTATE -5 - shortening step at time   31917.785929224247      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690099017628D+13   R2 =   0.6159159371896D+03
     ISTATE -5 - shortening step at time   53408.905944274637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690101795229D+13   R2 =   0.8748748360816D+00
     ISTATE -5 - shortening step at time   53408.905944274637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690913146508D+13   R2 =   0.1295910937011D+04
     ISTATE -5 - shortening step at time   53408.905944274637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1690917398779D+13   R2 =   0.3771908534928D-06
     ISTATE -5 - shortening step at time   53408.905944274637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1692433682657D+13   R2 =   0.1764378338127D+03
     ISTATE -5 - shortening step at time   53510.044265157761      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1733423040764D+13   R2 =   0.1307543702800D+05
     ISTATE -5 - shortening step at time   53510.044265157761      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1733431276517D+13   R2 =   0.1554122357706D-04
     ISTATE -5 - shortening step at time   53510.044265157761      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1734568773463D+13   R2 =   0.2063797185691D+04
     ISTATE -5 - shortening step at time   53510.044265157761      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1734571959212D+13   R2 =   0.1093385198533D+03
     ISTATE -5 - shortening step at time   53510.044265157761      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1736066536976D+13   R2 =   0.3812562709952D+04
     ISTATE -5 - shortening step at time   53510.044265157761      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1736071516826D+13   R2 =   0.6837363800270D+01
     ISTATE -5 - shortening step at time   53510.044265157761      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1736103390053D+13   R2 =   0.5345417271310D+03
     ISTATE -5 - shortening step at time   53510.044265157761      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1736135258692D+13   R2 =   0.5241916451805D+03
     ISTATE -5 - shortening step at time   53510.044265157761      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1736864454447D+13   R2 =   0.1632695740074D+04
     ISTATE -5 - shortening step at time   53510.044265157761      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739154105800D+13   R2 =   0.3447229123523D+03
     ISTATE -5 - shortening step at time   54964.065014141459      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739422392274D+13   R2 =   0.6185294937260D+03
     ISTATE -5 - shortening step at time   54964.065014141459      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739423715342D+13   R2 =   0.3608088575883D+02
     ISTATE -5 - shortening step at time   54964.065014141459      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739450758108D+13   R2 =   0.2718115542855D+03
     ISTATE -5 - shortening step at time   54964.065014141459      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739456621838D+13   R2 =   0.2013151226957D+03
     ISTATE -5 - shortening step at time   54964.065014141459      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739710146556D+13   R2 =   0.1344744746233D+04
     ISTATE -5 - shortening step at time   54964.065014141459      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739768564946D+13   R2 =   0.6751417898374D+03
     ISTATE -5 - shortening step at time   54964.065014141459      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739773745553D+13   R2 =   0.1368169910532D+02
     ISTATE -5 - shortening step at time   54964.065014141459      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739776788554D+13   R2 =   0.1000434163322D+03
     ISTATE -5 - shortening step at time   54964.065014141459      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1739942586910D+13   R2 =   0.2758754905869D+03
     ISTATE -5 - shortening step at time   54964.065014141459      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741364728910D+13   R2 =   0.1250791688205D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741572803060D+13   R2 =   0.1239046470711D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741681967227D+13   R2 =   0.1799310656297D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741684326717D+13   R2 =   0.6231278791226D+01
     ISTATE -5 - shortening step at time   55061.474269314946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741702951210D+13   R2 =   0.3167629651845D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741708967611D+13   R2 =   0.1695608303710D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741728358869D+13   R2 =   0.2726616388403D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741734350832D+13   R2 =   0.1144592783893D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741826603621D+13   R2 =   0.4271166688253D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1741885902422D+13   R2 =   0.3488717760633D+03
     ISTATE -5 - shortening step at time   55061.474269314946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1846800535107D+13   R2 =   0.1117508363767D+04
     ISTATE -5 - shortening step at time   55122.971595647279      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1916532764091D+13   R2 =   0.4282108857471D-05
     ISTATE -5 - shortening step at time   60635.270069446065      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2189355962889D+13   R2 =   0.3763252781350D+04
     ISTATE -5 - shortening step at time   66698.798522048164      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2189388125262D+13   R2 =   0.1000992636009D-05
     ISTATE -5 - shortening step at time   66698.798522048164      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2189588833091D+13   R2 =   0.4464624130418D+03
     ISTATE -5 - shortening step at time   66698.798522048164      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2191559344655D+13   R2 =   0.1667354045094D+04
     ISTATE -5 - shortening step at time   66698.798522048164      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2234854818649D+13   R2 =   0.7961215740890D+04
     ISTATE -5 - shortening step at time   66698.798522048164      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2256830528022D+13   R2 =   0.1610229289436D+04
     ISTATE -5 - shortening step at time   66698.798522048164      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2274035896527D+13   R2 =   0.2243052659674D+04
     ISTATE -5 - shortening step at time   66698.798522048164      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2596279441370D+13   R2 =   0.2011034333436D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2706847885408D+13   R2 =   0.1426085365860D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2710196323828D+13   R2 =   0.2184454941603D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2710226255144D+13   R2 =   0.4750055680277D+03
     ISTATE -5 - shortening step at time   80705.549710169522      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2712290039603D+13   R2 =   0.1352874126429D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2713470878343D+13   R2 =   0.1822734264900D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2713551306533D+13   R2 =   0.4087704963300D+03
     ISTATE -5 - shortening step at time   80705.549710169522      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715419206591D+13   R2 =   0.1825787145690D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716763954613D+13   R2 =   0.1607246450654D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2718755234974D+13   R2 =   0.2090174562851D+04
     ISTATE -5 - shortening step at time   80705.549710169522      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720843556698D+13   R2 =   0.1597538564396D-05
     ISTATE -5 - shortening step at time   86036.558068810948      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720845509530D+13   R2 =   0.2463619666818D+02
     ISTATE -5 - shortening step at time   86036.558068810948      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720848951076D+13   R2 =   0.2838932271255D+02
     ISTATE -5 - shortening step at time   86036.558068810948      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720851469875D+13   R2 =   0.5817482177684D-06
     ISTATE -5 - shortening step at time   86036.558068810948      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720929628696D+13   R2 =   0.9985520370690D+03
     ISTATE -5 - shortening step at time   86036.558068810948      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6494613099814D+11   R2 =   0.2115343082317D-06
     ISTATE -5 - shortening step at time   1880.6365043763683      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720933142933D+13   R2 =   0.8820149996659D-06
     ISTATE -5 - shortening step at time   86036.558068810948      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720962096413D+13   R2 =   0.7742740828881D+03
     ISTATE -5 - shortening step at time   86036.558068810948      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2720967976022D+13   R2 =   0.1325497465540D+03
     ISTATE -5 - shortening step at time   86036.558068810948      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2721113359220D+13   R2 =   0.4441247548276D+03
     ISTATE -5 - shortening step at time   86036.558068810948      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2721116265346D+13   R2 =   0.6592460093063D+02
     ISTATE -5 - shortening step at time   86036.558068810948      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6632951015708D+11   R2 =   0.3758711213426D-06
     ISTATE -5 - shortening step at time   2068.7001996518734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6636542899301D+11   R2 =   0.1586929438052D+03
     ISTATE -5 - shortening step at time   2068.7001996518734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2721911485964D+13   R2 =   0.1419510971606D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2721916494143D+13   R2 =   0.1719421331775D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6638320218212D+11   R2 =   0.4959964580815D+02
     ISTATE -5 - shortening step at time   2068.7001996518734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722004390484D+13   R2 =   0.1446389727534D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6639711011980D+11   R2 =   0.4821607392616D+02
     ISTATE -5 - shortening step at time   2068.7001996518734      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722010732989D+13   R2 =   0.2112390341393D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722020556375D+13   R2 =   0.1759400821535D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722030690989D+13   R2 =   0.3169427112132D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6640922033110D+11   R2 =   0.3705770606614D-05
     ISTATE -5 - shortening step at time   2068.7001996518734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722036934496D+13   R2 =   0.1179370228980D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6642074740204D+11   R2 =   0.5542084255524D+02
     ISTATE -5 - shortening step at time   2068.7001996518734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722134450224D+13   R2 =   0.6015436889940D+03
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6643475267531D+11   R2 =   0.1978519607908D+02
     ISTATE -5 - shortening step at time   2068.7001996518734      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6644725083952D+11   R2 =   0.3843568181841D-05
     ISTATE -5 - shortening step at time   2068.7001996518734      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2722135431769D+13   R2 =   0.1228194902166D-06
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6646324375013D+11   R2 =   0.7267575125699D+02
     ISTATE -5 - shortening step at time   2068.7001996518734      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6647587033409D+11   R2 =   0.4856821049020D+02
     ISTATE -5 - shortening step at time   2068.7001996518734      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2769864324443D+13   R2 =   0.5228565016496D+04
     ISTATE -5 - shortening step at time   86111.274219821775      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6700724423561D+11   R2 =   0.1270316944663D-04
     ISTATE -5 - shortening step at time   2103.6667827242181      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2771017645869D+13   R2 =   0.1720703309053D+03
     ISTATE -5 - shortening step at time   87653.934317822597      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2771042312169D+13   R2 =   0.3165830624092D+03
     ISTATE -5 - shortening step at time   87653.934317822597      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780494576277D+13   R2 =   0.3488990844834D+04
     ISTATE -5 - shortening step at time   87653.934317822597      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780707737800D+13   R2 =   0.1418728172934D+04
     ISTATE -5 - shortening step at time   87653.934317822597      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780735608571D+13   R2 =   0.4043024689360D+03
     ISTATE -5 - shortening step at time   87653.934317822597      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780764669595D+13   R2 =   0.5002013843947D+03
     ISTATE -5 - shortening step at time   87653.934317822597      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780793726768D+13   R2 =   0.6290669412670D+03
     ISTATE -5 - shortening step at time   87653.934317822597      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780952522458D+13   R2 =   0.8092103734163D+03
     ISTATE -5 - shortening step at time   87653.934317822597      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7397111665710D+11   R2 =   0.3798740836141D-06
     ISTATE -5 - shortening step at time   2314.0335111519644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780955427646D+13   R2 =   0.6862931261593D+02
     ISTATE -5 - shortening step at time   87653.934317822597      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2780984470919D+13   R2 =   0.2553152717041D+03
     ISTATE -5 - shortening step at time   87653.934317822597      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781884244041D+13   R2 =   0.9146060656388D+02
     ISTATE -5 - shortening step at time   88005.837687302555      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7400136518656D+11   R2 =   0.6227508883280D-05
     ISTATE -5 - shortening step at time   2314.0335111519644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781891174601D+13   R2 =   0.1354349563266D+03
     ISTATE -5 - shortening step at time   88005.837687302555      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7408697588896D+11   R2 =   0.3895217991860D+03
     ISTATE -5 - shortening step at time   2314.0335111519644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781897788038D+13   R2 =   0.1012933498826D+03
     ISTATE -5 - shortening step at time   88005.837687302555      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781953486649D+13   R2 =   0.7181015635743D+02
     ISTATE -5 - shortening step at time   88005.837687302555      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7424012418595D+11   R2 =   0.4971324068186D-05
     ISTATE -5 - shortening step at time   2314.0335111519644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781959861019D+13   R2 =   0.2537427363248D-05
     ISTATE -5 - shortening step at time   88005.837687302555      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7478654501714D+11   R2 =   0.1230087511454D+04
     ISTATE -5 - shortening step at time   2314.0335111519644      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781967576815D+13   R2 =   0.1684342041926D+03
     ISTATE -5 - shortening step at time   88005.837687302555      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781975469956D+13   R2 =   0.1841715376312D+03
     ISTATE -5 - shortening step at time   88005.837687302555      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781983551927D+13   R2 =   0.2004530475580D+03
     ISTATE -5 - shortening step at time   88005.837687302555      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2781990115739D+13   R2 =   0.1700046934654D+03
     ISTATE -5 - shortening step at time   88005.837687302555      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7484942451776D+11   R2 =   0.8747826354758D-05
     ISTATE -5 - shortening step at time   2314.0335111519644      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7488321431909D+11   R2 =   0.8875540863768D-05
     ISTATE -5 - shortening step at time   2314.0335111519644      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8100325242799D+11   R2 =   0.7575103407675D-06
     ISTATE -5 - shortening step at time   2545.4369174380190      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8106626864387D+11   R2 =   0.7447985954244D-05
     ISTATE -5 - shortening step at time   2545.4369174380190      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8135655028272D+11   R2 =   0.6627728738528D-06
     ISTATE -5 - shortening step at time   2545.4369174380190      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8901886894856D+11   R2 =   0.3192874411056D-05
     ISTATE -5 - shortening step at time   2799.9806698697662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8907103468941D+11   R2 =   0.2432905672745D-01
     ISTATE -5 - shortening step at time   2799.9806698697662      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2813425836790D+13   R2 =   0.2851034389995D+04
     ISTATE -5 - shortening step at time   88005.837687302555      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9117040683257D+11   R2 =   0.1090000904570D+04
     ISTATE -5 - shortening step at time   2799.9806698697662      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857071026723D+13   R2 =   0.2023123803989D+04
     ISTATE -5 - shortening step at time   89032.463189570757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857099740378D+13   R2 =   0.2671466521055D+03
     ISTATE -5 - shortening step at time   89032.463189570757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857107192775D+13   R2 =   0.1388999313115D-05
     ISTATE -5 - shortening step at time   89032.463189570757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857110109009D+13   R2 =   0.1000879920946D+03
     ISTATE -5 - shortening step at time   89032.463189570757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1100970590472D+12   R2 =   0.1402404638021D+04
     ISTATE -5 - shortening step at time   3387.9767574072494      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1167997770825D+12   R2 =   0.6622154929418D+03
     ISTATE -5 - shortening step at time   3387.9767574072494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1170925519339D+12   R2 =   0.4574808242158D+03
     ISTATE -5 - shortening step at time   3387.9767574072494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857116058967D+13   R2 =   0.2222399908897D-05
     ISTATE -5 - shortening step at time   89032.463189570757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857118975072D+13   R2 =   0.9216013450366D+02
     ISTATE -5 - shortening step at time   89032.463189570757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857148127481D+13   R2 =   0.3934173339407D+03
     ISTATE -5 - shortening step at time   89032.463189570757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857152682749D+13   R2 =   0.6254391174002D+01
     ISTATE -5 - shortening step at time   89032.463189570757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857181829994D+13   R2 =   0.1000658264327D+04
     ISTATE -5 - shortening step at time   89032.463189570757      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1171368688199D+12   R2 =   0.1369439832539D-04
     ISTATE -5 - shortening step at time   3387.9767574072494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2857210972074D+13   R2 =   0.3293484340095D+03
     ISTATE -5 - shortening step at time   89032.463189570757      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1172413835738D+12   R2 =   0.2473594658380D+03
     ISTATE -5 - shortening step at time   3387.9767574072494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1173083719991D+12   R2 =   0.1769649897827D+03
     ISTATE -5 - shortening step at time   3387.9767574072494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858571352841D+13   R2 =   0.7203128397382D+03
     ISTATE -5 - shortening step at time   90418.068736505651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1173524807797D+12   R2 =   0.2046847635410D-04
     ISTATE -5 - shortening step at time   3387.9767574072494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1174174697077D+12   R2 =   0.3124168810992D+03
     ISTATE -5 - shortening step at time   3387.9767574072494      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3167480551815D+13   R2 =   0.3627459625138D+04
     ISTATE -5 - shortening step at time   99459.877765890968      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1174778724028D+12   R2 =   0.1091027758395D+04
     ISTATE -5 - shortening step at time   3387.9767574072494      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3167556225067D+13   R2 =   0.1782746040558D+03
     ISTATE -5 - shortening step at time   99459.877765890968      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3167585153225D+13   R2 =   0.2292050478123D+03
     ISTATE -5 - shortening step at time   99459.877765890968      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3167614077556D+13   R2 =   0.5126598490487D+03
     ISTATE -5 - shortening step at time   99459.877765890968      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3214227946139D+13   R2 =   0.6730976808326D+04
     ISTATE -5 - shortening step at time   99459.877765890968      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3214257086157D+13   R2 =   0.8058139380455D+03
     ISTATE -5 - shortening step at time   99459.877765890968      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3214685173593D+13   R2 =   0.1423618132909D+04
     ISTATE -5 - shortening step at time   99459.877765890968      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1190948596565D+12   R2 =   0.6869050001152D-05
     ISTATE -5 - shortening step at time   3726.7745139236349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3218941024424D+13   R2 =   0.4536092474227D+04
     ISTATE -5 - shortening step at time   99459.877765890968      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3219179498921D+13   R2 =   0.1631492161357D+04
     ISTATE -5 - shortening step at time   99459.877765890968      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3221208587171D+13   R2 =   0.7901859930993D+03
     ISTATE -5 - shortening step at time   99459.877765890968      years
    [Parallel(n_jobs=4)]: Done   6 out of   9 | elapsed:  4.3min remaining:  2.1min


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1205627863383D+12   R2 =   0.1018635114212D-04
     ISTATE -5 - shortening step at time   3726.7745139236349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1206314687831D+12   R2 =   0.2514410864170D+03
     ISTATE -5 - shortening step at time   3726.7745139236349      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1207042780879D+12   R2 =   0.4314182069261D-04
     ISTATE -5 - shortening step at time   3726.7745139236349      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1207352709966D+12   R2 =   0.3088051893128D-04
     ISTATE -5 - shortening step at time   3726.7745139236349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1217786066409D+12   R2 =   0.5964877206208D+03
     ISTATE -5 - shortening step at time   3726.7745139236349      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1219033142542D+12   R2 =   0.6440501979027D-05
     ISTATE -5 - shortening step at time   3726.7745139236349      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1222605221491D+12   R2 =   0.4652955552080D-05
     ISTATE -5 - shortening step at time   3726.7745139236349      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1231497806277D+12   R2 =   0.1279737945305D-05
     ISTATE -5 - shortening step at time   3726.7745139236349      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1239720800503D+12   R2 =   0.5320464028931D+03
     ISTATE -5 - shortening step at time   3726.7745139236349      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1244388297363D+12   R2 =   0.3569882614053D-06
     ISTATE -5 - shortening step at time   3923.1670901990110      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1247330423674D+12   R2 =   0.3652505883216D+03
     ISTATE -5 - shortening step at time   3923.1670901990110      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1367729137780D+12   R2 =   0.4188744668245D-05
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1384353900534D+12   R2 =   0.2885797969014D+03
     ISTATE -5 - shortening step at time   4315.4838927545043      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1385609286957D+12   R2 =   0.6290570976539D+03
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1386171698267D+12   R2 =   0.3762297921841D-04
     ISTATE -5 - shortening step at time   4315.4838927545043      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389378022768D+12   R2 =   0.9620955273878D+02
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1389911309845D+12   R2 =   0.2987211803239D+03
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1405000383820D+12   R2 =   0.1842464443558D-04
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1410429985335D+12   R2 =   0.1280581190044D-04
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1411016901909D+12   R2 =   0.1183546019268D-04
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1413475130837D+12   R2 =   0.2756517345418D-04
     ISTATE -5 - shortening step at time   4315.4838927545043      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1416411315794D+12   R2 =   0.1967030097323D-04
     ISTATE -5 - shortening step at time   4473.0225659409662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1417067575980D+12   R2 =   0.6462046140939D-05
     ISTATE -5 - shortening step at time   4473.0225659409662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1419030597509D+12   R2 =   0.9616837412042D-04
     ISTATE -5 - shortening step at time   4473.0225659409662      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1430403312985D+12   R2 =   0.3576922250289D+03
     ISTATE -5 - shortening step at time   4473.0225659409662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1453423292476D+12   R2 =   0.8900604906602D+03
     ISTATE -5 - shortening step at time   4473.0225659409662      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1455933260319D+12   R2 =   0.3143325880114D+03
     ISTATE -5 - shortening step at time   4473.0225659409662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1456420945539D+12   R2 =   0.4363637174640D-04
     ISTATE -5 - shortening step at time   4473.0225659409662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1456912927881D+12   R2 =   0.7558148896032D-04
     ISTATE -5 - shortening step at time   4473.0225659409662      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1457862542008D+12   R2 =   0.3340232765822D+03
     ISTATE -5 - shortening step at time   4473.0225659409662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1458919190361D+12   R2 =   0.4888876865701D-05
     ISTATE -5 - shortening step at time   4473.0225659409662      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1462737987163D+12   R2 =   0.5947503013493D-05
     ISTATE -5 - shortening step at time   4616.8328808900069      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1610081898073D+12   R2 =   0.3465596253593D-05
     ISTATE -5 - shortening step at time   5078.5162790528811      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1613964624473D+12   R2 =   0.1433828269384D-04
     ISTATE -5 - shortening step at time   5078.5162790528811      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1614234988015D+12   R2 =   0.3311413979559D-04
     ISTATE -5 - shortening step at time   5078.5162790528811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615243494194D+12   R2 =   0.1645608326993D+02
     ISTATE -5 - shortening step at time   5078.5162790528811      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1615540138275D+12   R2 =   0.1878744777986D+03
     ISTATE -5 - shortening step at time   5078.5162790528811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1635028684809D+12   R2 =   0.7614522598531D+03
     ISTATE -5 - shortening step at time   5078.5162790528811      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1635871025728D+12   R2 =   0.9780360675007D-05
     ISTATE -5 - shortening step at time   5078.5162790528811      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1643749494976D+12   R2 =   0.1826998768727D-04
     ISTATE -5 - shortening step at time   5078.5162790528811      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1649914724504D+12   R2 =   0.1022319723527D-04
     ISTATE -5 - shortening step at time   5078.5162790528811      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1651432621285D+12   R2 =   0.3055230347858D+03
     ISTATE -5 - shortening step at time   5078.5162790528811      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342472691037D+13   R2 =   0.2796782344569D-06
     ISTATE -5 - shortening step at time   42482.575834152449      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1653680021430D+12   R2 =   0.4223469431131D-06
     ISTATE -5 - shortening step at time   5226.0525990023152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342657236812D+13   R2 =   0.4194420965998D-06
     ISTATE -5 - shortening step at time   42482.575834152449      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1657397862032D+12   R2 =   0.1709864930332D+03
     ISTATE -5 - shortening step at time   5226.0525990023152      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1658302947531D+12   R2 =   0.1156415972779D-03
     ISTATE -5 - shortening step at time   5226.0525990023152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345514811061D+13   R2 =   0.2412221452891D-06
     ISTATE -5 - shortening step at time   42482.575834152449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1662736084551D+12   R2 =   0.3549881995992D+03
     ISTATE -5 - shortening step at time   5226.0525990023152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345531132468D+13   R2 =   0.9358051402265D+01
     ISTATE -5 - shortening step at time   42482.575834152449      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1663908666980D+12   R2 =   0.1262824413367D+03
     ISTATE -5 - shortening step at time   5226.0525990023152      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1678101613189D+12   R2 =   0.6605604531327D-04
     ISTATE -5 - shortening step at time   5226.0525990023152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345947746937D+13   R2 =   0.1477531924288D-05
     ISTATE -5 - shortening step at time   42482.575834152449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1679232453221D+12   R2 =   0.3696737589031D+03
     ISTATE -5 - shortening step at time   5226.0525990023152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1345966684804D+13   R2 =   0.8234507905606D+01
     ISTATE -5 - shortening step at time   42482.575834152449      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1698155134103D+12   R2 =   0.2493808172702D+03
     ISTATE -5 - shortening step at time   5226.0525990023152      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1346029487586D+13   R2 =   0.7905742809759D-06
     ISTATE -5 - shortening step at time   42482.575834152449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1698562834041D+12   R2 =   0.2034836555343D-04
     ISTATE -5 - shortening step at time   5226.0525990023152      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1704657853468D+12   R2 =   0.3362247668475D+03
     ISTATE -5 - shortening step at time   5226.0525990023152      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2089523632634D+12   R2 =   0.8760538553180D+03
     ISTATE -5 - shortening step at time   6527.3294054097869      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2089943292512D+12   R2 =   0.5497454832840D+02
     ISTATE -5 - shortening step at time   6527.3294054097869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2112099759685D+12   R2 =   0.2646275016874D-05
     ISTATE -5 - shortening step at time   6527.3294054097869      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1411806609085D+13
     ISTATE -1: Reducing time step to    205.34101229048679      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2112861635908D+12   R2 =   0.9090975934029D-05
     ISTATE -5 - shortening step at time   6527.3294054097869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2121759216419D+12   R2 =   0.8039506737369D-05
     ISTATE -5 - shortening step at time   6527.3294054097869      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1421571177617D+13   R2 =   0.7562220830158D-06
     ISTATE -5 - shortening step at time   42482.575834152449      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2123540049911D+12   R2 =   0.2507275889197D+03
     ISTATE -5 - shortening step at time   6527.3294054097869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2124374744750D+12   R2 =   0.8834320142500D+02
     ISTATE -5 - shortening step at time   6527.3294054097869      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2125308282445D+12   R2 =   0.6769715112858D+03
     ISTATE -5 - shortening step at time   6527.3294054097869      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1421791528996D+13   R2 =   0.1584095218111D-05
     ISTATE -5 - shortening step at time   42482.575834152449      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2136947616265D+12   R2 =   0.1657936208621D-04
     ISTATE -5 - shortening step at time   6527.3294054097869      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1421839768566D+13   R2 =   0.4560270762839D-07
     ISTATE -5 - shortening step at time   44993.402816319918      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2161142452753D+12   R2 =   0.7420740177081D+02
     ISTATE -5 - shortening step at time   6527.3294054097869      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1421852787084D+13   R2 =   0.6467073587813D+00
     ISTATE -5 - shortening step at time   44993.402816319918      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2163030791149D+12   R2 =   0.1399892906322D-05
     ISTATE -5 - shortening step at time   6839.0583947885161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1422221645931D+13   R2 =   0.2789510551237D-05
     ISTATE -5 - shortening step at time   44993.402816319918      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1422270770704D+13   R2 =   0.4772390863467D+02
     ISTATE -5 - shortening step at time   44993.402816319918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2163650288210D+12   R2 =   0.3005072221507D-04
     ISTATE -5 - shortening step at time   6839.0583947885161      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1422770933923D+13   R2 =   0.5264859930047D+02
     ISTATE -5 - shortening step at time   44993.402816319918      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1429002276253D+13   R2 =   0.1100923288455D+03
     ISTATE -5 - shortening step at time   44993.402816319918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2176393820989D+12   R2 =   0.5146734837226D-05
     ISTATE -5 - shortening step at time   6839.0583947885161      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1431136634395D+13   R2 =   0.9592348970249D-05
     ISTATE -5 - shortening step at time   44993.402816319918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2200666175891D+12   R2 =   0.2673065243281D-04
     ISTATE -5 - shortening step at time   6839.0583947885161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1431157023145D+13   R2 =   0.2869455520072D+02
     ISTATE -5 - shortening step at time   44993.402816319918      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1431233253304D+13   R2 =   0.5261976640144D+02
     ISTATE -5 - shortening step at time   44993.402816319918      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2201182207799D+12   R2 =   0.9756304106102D-05
     ISTATE -5 - shortening step at time   6839.0583947885161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1431260621500D+13   R2 =   0.1619596141067D+02
     ISTATE -5 - shortening step at time   44993.402816319918      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2203746807387D+12   R2 =   0.1277511734468D+03
     ISTATE -5 - shortening step at time   6839.0583947885161      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2204305139525D+12   R2 =   0.6921107104468D-05
     ISTATE -5 - shortening step at time   6839.0583947885161      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2204754938498D+12   R2 =   0.4608086649916D+02
     ISTATE -5 - shortening step at time   6839.0583947885161      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2205515917925D+12   R2 =   0.2992956592221D+03
     ISTATE -5 - shortening step at time   6839.0583947885161      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2206266016052D+12   R2 =   0.1683014320055D-04
     ISTATE -5 - shortening step at time   6839.0583947885161      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2230662516183D+12   R2 =   0.2781453243809D-06
     ISTATE -5 - shortening step at time   6981.8544811780193      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2235416514398D+12   R2 =   0.3600534694598D+03
     ISTATE -5 - shortening step at time   6981.8544811780193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2237166215777D+12   R2 =   0.3217010851877D+03
     ISTATE -5 - shortening step at time   6981.8544811780193      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1574405583601D+13   R2 =   0.2953337834945D+00
     ISTATE -5 - shortening step at time   49822.364486512903      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1574463863846D+13   R2 =   0.4464632209746D+02
     ISTATE -5 - shortening step at time   49822.364486512903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2237999309238D+12   R2 =   0.4732771550566D-04
     ISTATE -5 - shortening step at time   6981.8544811780193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1574571063516D+13   R2 =   0.8920284045479D-06
     ISTATE -5 - shortening step at time   49822.364486512903      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2238859272466D+12   R2 =   0.1371441294061D-04
     ISTATE -5 - shortening step at time   6981.8544811780193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2239780520492D+12   R2 =   0.3348359554899D+03
     ISTATE -5 - shortening step at time   6981.8544811780193      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1574753778781D+13   R2 =   0.3629911092055D-05
     ISTATE -5 - shortening step at time   49822.364486512903      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2433938594424D+12   R2 =   0.4917635142218D-05
     ISTATE -5 - shortening step at time   7680.0400957562042      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2712212805478D+12   R2 =   0.1169190832666D+04
     ISTATE -5 - shortening step at time   8448.0442884382501      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2713916044613D+12   R2 =   0.1995747986753D+03
     ISTATE -5 - shortening step at time   8448.0442884382501      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715242776334D+12   R2 =   0.6831577609296D+02
     ISTATE -5 - shortening step at time   8448.0442884382501      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2730380330620D+12   R2 =   0.1145157256655D+04
     ISTATE -5 - shortening step at time   8448.0442884382501      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2733393982361D+12   R2 =   0.1051671122763D-04
     ISTATE -5 - shortening step at time   8448.0442884382501      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2761633322385D+12   R2 =   0.8999821570648D-05
     ISTATE -5 - shortening step at time   8448.0442884382501      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2763151759479D+12   R2 =   0.4775572338678D-03
     ISTATE -5 - shortening step at time   8448.0442884382501      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2776527360653D+12   R2 =   0.1939170518013D-04
     ISTATE -5 - shortening step at time   8448.0442884382501      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2778181581559D+12   R2 =   0.9045323857069D+03
     ISTATE -5 - shortening step at time   8448.0442884382501      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2816090799781D+12   R2 =   0.2501517554985D+03
     ISTATE -5 - shortening step at time   8448.0442884382501      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2817978680831D+12   R2 =   0.3441568370330D-06
     ISTATE -5 - shortening step at time   8911.6797461410424      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2819038846366D+12   R2 =   0.1427861904541D+03
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2819769160567D+12   R2 =   0.8495706003523D+02
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2823438697399D+12   R2 =   0.4723993784740D-04
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2823889861073D+12   R2 =   0.4329927753545D-05
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2824356250720D+12   R2 =   0.1646848445117D-04
     ISTATE -5 - shortening step at time   8911.6797461410424      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2828107262932D+12   R2 =   0.3611149354211D+03
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832191422091D+12   R2 =   0.1345758358012D-04
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2946938969263D+12   R2 =   0.1416264629365D+03
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2947485100117D+12   R2 =   0.2757216072085D-04
     ISTATE -5 - shortening step at time   8911.6797461410424      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2985608966350D+12   R2 =   0.4170092162852D-05
     ISTATE -5 - shortening step at time   9327.4844940396906      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3000970958548D+12   R2 =   0.6184560988747D+03
     ISTATE -5 - shortening step at time   9327.4844940396906      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3002285906235D+12   R2 =   0.2129680198238D-04
     ISTATE -5 - shortening step at time   9327.4844940396906      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3002745646697D+12   R2 =   0.7865982134670D+02
     ISTATE -5 - shortening step at time   9327.4844940396906      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3003601542748D+12   R2 =   0.4069826279102D-04
     ISTATE -5 - shortening step at time   9327.4844940396906      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3004097598648D+12   R2 =   0.4851397323058D-05
     ISTATE -5 - shortening step at time   9327.4844940396906      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3004694366742D+12   R2 =   0.1438142507234D+03
     ISTATE -5 - shortening step at time   9327.4844940396906      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3008072312535D+12   R2 =   0.1367652636137D+03
     ISTATE -5 - shortening step at time   9327.4844940396906      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3027661507526D+12   R2 =   0.5844352802442D+03
     ISTATE -5 - shortening step at time   9327.4844940396906      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3053929131144D+13   R2 =   0.3401985275818D+03
     ISTATE -5 - shortening step at time   95975.259925620267      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3028142504397D+12   R2 =   0.1423188621469D-04
     ISTATE -5 - shortening step at time   9327.4844940396906      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3387471531725D+12   R2 =   0.5352482883541D-04
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3399968090198D+12   R2 =   0.1653832408495D+03
     ISTATE -5 - shortening step at time   10541.002617194696      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3407367129966D+12   R2 =   0.6078307329787D+03
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3407529923652D+12   R2 =   0.1205258292309D+03
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3440753401122D+12   R2 =   0.2070524832959D-04
     ISTATE -5 - shortening step at time   10541.002617194696      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3458621167763D+12   R2 =   0.2024870757614D+03
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3459609119613D+12   R2 =   0.6039224776729D+02
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3459913706870D+12   R2 =   0.3010094716549D-04
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3481331348321D+12   R2 =   0.7409681617086D+02
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3514237363344D+12   R2 =   0.1546538173059D-04
     ISTATE -5 - shortening step at time   10541.002617194696      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3558856273054D+12   R2 =   0.7935355403632D-06
     ISTATE -5 - shortening step at time   11121.004314378637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3559469554935D+12   R2 =   0.3299192742099D+02
     ISTATE -5 - shortening step at time   11121.004314378637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3559709226982D+12   R2 =   0.6619746503163D-05
     ISTATE -5 - shortening step at time   11121.004314378637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3560280954856D+12   R2 =   0.1232294950776D+03
     ISTATE -5 - shortening step at time   11121.004314378637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3560716590961D+12   R2 =   0.8459402054232D+02
     ISTATE -5 - shortening step at time   11121.004314378637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3561243456508D+12   R2 =   0.1631755832847D+03
     ISTATE -5 - shortening step at time   11121.004314378637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3565205859905D+12   R2 =   0.2492325768852D+03
     ISTATE -5 - shortening step at time   11121.004314378637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3589457911512D+12   R2 =   0.4971593910879D+02
     ISTATE -5 - shortening step at time   11121.004314378637      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3590327574109D+12   R2 =   0.7442649940830D+02
     ISTATE -5 - shortening step at time   11121.004314378637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3590445903032D+12   R2 =   0.1003625590547D-04
     ISTATE -5 - shortening step at time   11121.004314378637      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3635749696654D+12   R2 =   0.3731304585732D-05
     ISTATE -5 - shortening step at time   11362.170579214560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3637307721741D+12   R2 =   0.2815189782851D+03
     ISTATE -5 - shortening step at time   11362.170579214560      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3637879738169D+12   R2 =   0.1094449490428D-04
     ISTATE -5 - shortening step at time   11362.170579214560      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3638220911176D+12   R2 =   0.4517234425898D-05
     ISTATE -5 - shortening step at time   11362.170579214560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3638912531059D+12   R2 =   0.4886901830542D+02
     ISTATE -5 - shortening step at time   11362.170579214560      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3654649729778D+12   R2 =   0.1088468814327D+03
     ISTATE -5 - shortening step at time   11362.170579214560      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3654828105778D+12   R2 =   0.3517379200587D-05
     ISTATE -5 - shortening step at time   11362.170579214560      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3655065586386D+12   R2 =   0.1028592718061D-04
     ISTATE -5 - shortening step at time   11362.170579214560      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3655958137886D+12   R2 =   0.1364358376341D+03
     ISTATE -5 - shortening step at time   11362.170579214560      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3656167169085D+12   R2 =   0.3818059046550D+03
     ISTATE -5 - shortening step at time   11362.170579214560      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3759910295009D+12   R2 =   0.2248428185216D-05
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3778188346866D+12   R2 =   0.7597533436114D+02
     ISTATE -5 - shortening step at time   11570.149269255759      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3796421463631D+12   R2 =   0.3970433459691D+03
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3796602326653D+12   R2 =   0.1087726785474D-04
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3882954018795D+12   R2 =   0.1330627534261D+03
     ISTATE -5 - shortening step at time   11570.149269255759      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3886436588264D+12   R2 =   0.1576627167945D+03
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3886555751195D+12   R2 =   0.6772210250141D-06
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3917026003900D+12   R2 =   0.1581333273279D-05
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3943614940358D+12   R2 =   0.1367661864466D+03
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.3967358484307D+12   R2 =   0.2132648893375D+02
     ISTATE -5 - shortening step at time   11570.149269255759      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4023692393685D+12   R2 =   0.3859986752439D+03
     ISTATE -5 - shortening step at time   12554.931912363169      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4023868199505D+12   R2 =   0.6126338091167D-05
     ISTATE -5 - shortening step at time   12554.931912363169      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4024184081637D+12   R2 =   0.1623525794299D+03
     ISTATE -5 - shortening step at time   12554.931912363169      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4024921226473D+12   R2 =   0.8381553743516D+02
     ISTATE -5 - shortening step at time   12554.931912363169      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4365775576833D+12   R2 =   0.3871760942662D-05
     ISTATE -5 - shortening step at time   13810.425402932387      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4800973047301D+12   R2 =   0.5898122910423D+01
     ISTATE -5 - shortening step at time   15191.468272491826      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.4801544570658D+12   R2 =   0.6620984840363D-05
     ISTATE -5 - shortening step at time   15191.468272491826      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5402018591294D+12   R2 =   0.4577348346445D+03
     ISTATE -5 - shortening step at time   16710.615461933838      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5403937211751D+12   R2 =   0.2821837132444D-05
     ISTATE -5 - shortening step at time   16710.615461933838      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5404373470064D+12   R2 =   0.4024559509257D-04
     ISTATE -5 - shortening step at time   16710.615461933838      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5404588857069D+12   R2 =   0.2588531395029D+02
     ISTATE -5 - shortening step at time   16710.615461933838      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5405395149932D+12   R2 =   0.1445750996870D+03
     ISTATE -5 - shortening step at time   16710.615461933838      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5406371582073D+12   R2 =   0.1934030118689D+03
     ISTATE -5 - shortening step at time   16710.615461933838      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5406819795963D+12   R2 =   0.1641252589210D+03
     ISTATE -5 - shortening step at time   16710.615461933838      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5406965466297D+12   R2 =   0.2880896016010D+03
     ISTATE -5 - shortening step at time   16710.615461933838      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5407743403604D+12   R2 =   0.1347776011509D-04
     ISTATE -5 - shortening step at time   16710.615461933838      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5408095534807D+12   R2 =   0.2091787419478D-04
     ISTATE -5 - shortening step at time   16710.615461933838      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5522588611086D+12   R2 =   0.4928217075547D-05
     ISTATE -5 - shortening step at time   17114.226375972867      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5949573491571D+12   R2 =   0.9171466636858D+01
     ISTATE -5 - shortening step at time   18825.649421605107      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5949970199282D+12   R2 =   0.2300708278621D-05
     ISTATE -5 - shortening step at time   18825.649421605107      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5950765090245D+12   R2 =   0.5062121270886D-05
     ISTATE -5 - shortening step at time   18825.649421605107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5951231719194D+12   R2 =   0.8141164804428D+02
     ISTATE -5 - shortening step at time   18825.649421605107      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5956949163378D+12   R2 =   0.2580907436715D-05
     ISTATE -5 - shortening step at time   18825.649421605107      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5960319111938D+12   R2 =   0.1304146121120D-04
     ISTATE -5 - shortening step at time   18825.649421605107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.5961292617219D+12   R2 =   0.1498007707647D+02
     ISTATE -5 - shortening step at time   18825.649421605107      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6025030560555D+12   R2 =   0.4622204720220D-04
     ISTATE -5 - shortening step at time   18825.649421605107      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6070818696456D+12   R2 =   0.5707166943453D-05
     ISTATE -5 - shortening step at time   18825.649421605107      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6073416501335D+12   R2 =   0.1299089214595D+03
     ISTATE -5 - shortening step at time   18825.649421605107      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6188285822124D+12   R2 =   0.3199292951373D+03
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6202255245336D+12   R2 =   0.8054411035218D-05
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6263331219050D+12   R2 =   0.6598634905726D-05
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6310126815893D+12   R2 =   0.1789983511372D+03
     ISTATE -5 - shortening step at time   19219.672472580205      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6313563219680D+12   R2 =   0.1218551381530D+03
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6330534672013D+12   R2 =   0.2517657346596D-05
     ISTATE -5 - shortening step at time   19219.672472580205      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6339728800548D+12   R2 =   0.8576897152624D+02
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6352563453798D+12   R2 =   0.8593923240331D-05
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6364578370194D+12   R2 =   0.3724500281264D+03
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6367144008330D+12   R2 =   0.7756792539316D-05
     ISTATE -5 - shortening step at time   19219.672472580205      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6367673724761D+12   R2 =   0.2712893490447D-06
     ISTATE -5 - shortening step at time   20149.189899777211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.6368920408925D+12   R2 =   0.3932085384907D+02
     ISTATE -5 - shortening step at time   20149.189899777211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7011832138411D+12   R2 =   0.5833042746299D-05
     ISTATE -5 - shortening step at time   22164.109370149054      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7013397005102D+12   R2 =   0.9894208875024D+03
     ISTATE -5 - shortening step at time   22164.109370149054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7756162595017D+12   R2 =   0.1540501685010D+03
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7775992537853D+12   R2 =   0.8484194231771D+02
     ISTATE -5 - shortening step at time   24380.520835597505      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7776690938926D+12   R2 =   0.4944733246402D+03
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7846468934869D+12   R2 =   0.1350718582419D-04
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7888107280176D+12   R2 =   0.4573959762781D+02
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7937471812765D+12   R2 =   0.9479876051600D+02
     ISTATE -5 - shortening step at time   24380.520835597505      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7938352007775D+12   R2 =   0.8849812051388D+02
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7939047974920D+12   R2 =   0.1139460136191D+03
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7939166336498D+12   R2 =   0.8825416397651D-05
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7967498978173D+12   R2 =   0.1855435971669D+02
     ISTATE -5 - shortening step at time   24380.520835597505      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.7967976352014D+12   R2 =   0.4355847215826D+01
     ISTATE -5 - shortening step at time   25213.604361307829      years


    [Parallel(n_jobs=4)]: Done   7 out of   9 | elapsed:  5.9min remaining:  1.7min


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8853821068379D+12   R2 =   0.1245728180473D+03
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8888753209851D+12   R2 =   0.9386110546173D+02
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8892474813847D+12   R2 =   0.2014912764307D-05
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8914090558944D+12   R2 =   0.4636058165530D-05
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8921259147829D+12   R2 =   0.7456446825367D+02
     ISTATE -5 - shortening step at time   27734.965398577784      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8922596164016D+12   R2 =   0.9519323944312D+02
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8922932166500D+12   R2 =   0.8922061457737D+02
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8923103197806D+12   R2 =   0.4094399324488D-05
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8923464355812D+12   R2 =   0.1388358076195D-04
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8947791424157D+12   R2 =   0.7888115107603D-05
     ISTATE -5 - shortening step at time   27734.965398577784      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8948513750340D+12   R2 =   0.3875983804232D-06
     ISTATE -5 - shortening step at time   28315.795646065297      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8955675556880D+12   R2 =   0.8896763041751D+02
     ISTATE -5 - shortening step at time   28315.795646065297      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8956545628300D+12   R2 =   0.5095223266047D-04
     ISTATE -5 - shortening step at time   28315.795646065297      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8957668001580D+12   R2 =   0.5023995394747D+02
     ISTATE -5 - shortening step at time   28315.795646065297      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8959322571254D+12   R2 =   0.4625129813499D-05
     ISTATE -5 - shortening step at time   28315.795646065297      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8959549819017D+12   R2 =   0.3062117117440D-05
     ISTATE -5 - shortening step at time   28315.795646065297      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8965319115160D+12   R2 =   0.1525294221248D+03
     ISTATE -5 - shortening step at time   28315.795646065297      years
     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1731015732119D+13
     ISTATE -1: Reducing time step to    2.5623258883179170      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8965593419522D+12   R2 =   0.4785857597197D+03
     ISTATE -5 - shortening step at time   28315.795646065297      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8965878396935D+12   R2 =   0.2295431751056D-04
     ISTATE -5 - shortening step at time   28315.795646065297      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8966255233043D+12   R2 =   0.3943484816575D+02
     ISTATE -5 - shortening step at time   28315.795646065297      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8966495061671D+12   R2 =   0.1505935249781D-06
     ISTATE -5 - shortening step at time   28374.225421022875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8968027940052D+12   R2 =   0.1202498698502D+03
     ISTATE -5 - shortening step at time   28374.225421022875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8968341760694D+12   R2 =   0.2539877386234D-04
     ISTATE -5 - shortening step at time   28374.225421022875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8968590458027D+12   R2 =   0.1103504873216D-04
     ISTATE -5 - shortening step at time   28374.225421022875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8970238402204D+12   R2 =   0.5669867292528D+02
     ISTATE -5 - shortening step at time   28374.225421022875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8971537978624D+12   R2 =   0.5499426675039D-05
     ISTATE -5 - shortening step at time   28374.225421022875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8971762403085D+12   R2 =   0.3939887980567D-04
     ISTATE -5 - shortening step at time   28374.225421022875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8971813555695D+12   R2 =   0.3695567424002D+02
     ISTATE -5 - shortening step at time   28374.225421022875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8971932779901D+12   R2 =   0.1085616517963D-05
     ISTATE -5 - shortening step at time   28374.225421022875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1755659623158D+13   R2 =   0.1748737660762D+03
     ISTATE -5 - shortening step at time   54804.602123021927      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8972131630542D+12   R2 =   0.1014597378888D+02
     ISTATE -5 - shortening step at time   28374.225421022875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1755662769717D+13   R2 =   0.1054819722024D+02
     ISTATE -5 - shortening step at time   54804.602123021927      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.8972671612654D+12   R2 =   0.3580948413926D+02
     ISTATE -5 - shortening step at time   28392.821615640765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9045781176472D+12   R2 =   0.4951600585262D+02
     ISTATE -5 - shortening step at time   28392.821615640765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9045911059766D+12   R2 =   0.3860707786475D+02
     ISTATE -5 - shortening step at time   28392.821615640765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9046846963934D+12   R2 =   0.1014513508965D+03
     ISTATE -5 - shortening step at time   28392.821615640765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9047298624543D+12   R2 =   0.1721026935894D+03
     ISTATE -5 - shortening step at time   28392.821615640765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9070147761680D+12   R2 =   0.7576944039547D+02
     ISTATE -5 - shortening step at time   28392.821615640765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9070639075700D+12   R2 =   0.6569758056116D+02
     ISTATE -5 - shortening step at time   28392.821615640765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9070997710267D+12   R2 =   0.1342251295566D-04
     ISTATE -5 - shortening step at time   28392.821615640765      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9071675633888D+12   R2 =   0.8881553385070D+02
     ISTATE -5 - shortening step at time   28392.821615640765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.9076145944010D+12   R2 =   0.8925896357604D-06
     ISTATE -5 - shortening step at time   28392.821615640765      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1006255888360D+13   R2 =   0.3040739964802D+03
     ISTATE -5 - shortening step at time   31594.179603806217      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1926902395417D+13   R2 =   0.1444903816118D-05
     ISTATE -5 - shortening step at time   60285.063641967659      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1098925818236D+13   R2 =   0.9275419317660D-06
     ISTATE -5 - shortening step at time   34753.598317450778      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1104058323851D+13   R2 =   0.8519204878815D-05
     ISTATE -5 - shortening step at time   34753.598317450778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1928533142239D+13   R2 =   0.1079325242326D-05
     ISTATE -5 - shortening step at time   60285.063641967659      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1104076366961D+13   R2 =   0.1420443063541D-04
     ISTATE -5 - shortening step at time   34753.598317450778      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1929532630323D+13   R2 =   0.1775325307435D+03
     ISTATE -5 - shortening step at time   60285.063641967659      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1104143169670D+13   R2 =   0.5570619239340D-04
     ISTATE -5 - shortening step at time   34753.598317450778      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1929654843762D+13   R2 =   0.4636666459040D+01
     ISTATE -5 - shortening step at time   60285.063641967659      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1104156939513D+13   R2 =   0.1848622124569D+01
     ISTATE -5 - shortening step at time   34753.598317450778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1929656919586D+13   R2 =   0.1462025174126D+02
     ISTATE -5 - shortening step at time   60285.063641967659      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1931031166004D+13   R2 =   0.4563897133816D+02
     ISTATE -5 - shortening step at time   60285.063641967659      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1105578140877D+13   R2 =   0.6963181566808D+01
     ISTATE -5 - shortening step at time   34753.598317450778      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1931055395189D+13   R2 =   0.2381246768588D+03
     ISTATE -5 - shortening step at time   60285.063641967659      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1931118370634D+13   R2 =   0.5010068796056D+02
     ISTATE -5 - shortening step at time   60285.063641967659      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1931314998880D+13   R2 =   0.1161417432359D-05
     ISTATE -5 - shortening step at time   60285.063641967659      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1932749056221D+13   R2 =   0.4414907666534D+02
     ISTATE -5 - shortening step at time   60285.063641967659      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1932758136288D+13   R2 =   0.5573957139133D-07
     ISTATE -5 - shortening step at time   61162.944817132651      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1932767448658D+13   R2 =   0.1256726443813D+02
     ISTATE -5 - shortening step at time   61162.944817132651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1946998025652D+13   R2 =   0.1253407289331D+03
     ISTATE -5 - shortening step at time   61162.944817132651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1208061050409D+13   R2 =   0.1919508812630D-05
     ISTATE -5 - shortening step at time   38228.958977786206      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1949749084858D+13   R2 =   0.4051104899235D-04
     ISTATE -5 - shortening step at time   61162.944817132651      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1949846141919D+13   R2 =   0.3566524759751D+02
     ISTATE -5 - shortening step at time   61162.944817132651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1950172215543D+13   R2 =   0.4414963503426D+02
     ISTATE -5 - shortening step at time   61162.944817132651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1951293693901D+13   R2 =   0.1662831030438D-05
     ISTATE -5 - shortening step at time   61162.944817132651      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1951364041663D+13   R2 =   0.1777919414318D+02
     ISTATE -5 - shortening step at time   61162.944817132651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1952163439647D+13   R2 =   0.8003341731568D-05
     ISTATE -5 - shortening step at time   61162.944817132651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1952322129111D+13   R2 =   0.1190031847452D+02
     ISTATE -5 - shortening step at time   61162.944817132651      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1954434931533D+13   R2 =   0.6787353948001D+01
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1954460650993D+13   R2 =   0.3036151314729D-05
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.1989444975144D+13
     ISTATE -1: Reducing time step to    500.34625247194140      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1989447068792D+13   R2 =   0.2019380171808D+02
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1989458972668D+13   R2 =   0.3790023843446D+01
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1990240466200D+13   R2 =   0.1356822135216D-05
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1990362890447D+13   R2 =   0.5948963297963D-06
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1990883481525D+13   R2 =   0.7008735181090D+01
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1990894367855D+13   R2 =   0.7839845391981D-06
     ISTATE -5 - shortening step at time   61782.345857930100      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2020859442058D+13
     ISTATE -1: Reducing time step to    400.93338100916907      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2020873343767D+13   R2 =   0.1008036550326D-06
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2035263700473D+13   R2 =   0.1412499916405D-05
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2035926734036D+13   R2 =   0.3091709041446D-05
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2063861464084D+13
     ISTATE -1: Reducing time step to    503.43029345167253      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064661451891D+13   R2 =   0.1594527061886D-05
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064668306434D+13   R2 =   0.1522116974657D-05
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064707450950D+13   R2 =   0.8115060306118D-06
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064717305208D+13   R2 =   0.5448351033030D-06
     ISTATE -5 - shortening step at time   63951.248166381054      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064720638051D+13   R2 =   0.8767400000780D+00
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2064735993314D+13   R2 =   0.7155430055943D-05
     ISTATE -5 - shortening step at time   63951.248166381054      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2273047132860D+13   R2 =   0.1124427613142D-06
     ISTATE -5 - shortening step at time   71873.722844080534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2273086696912D+13   R2 =   0.2675003497619D+02
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2282568042589D+13   R2 =   0.1501189836972D-05
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2284113809805D+13   R2 =   0.2354563967720D+02
     ISTATE -5 - shortening step at time   71873.722844080534      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2284119555220D+13   R2 =   0.6087909086380D+01
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2286345216561D+13   R2 =   0.1454713145580D-05
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2286439386932D+13   R2 =   0.2643183349559D-06
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2286444953652D+13   R2 =   0.6063964401482D-06
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2293466983739D+13   R2 =   0.3403900870470D+01
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2294580226530D+13   R2 =   0.2092786298306D-05
     ISTATE -5 - shortening step at time   71873.722844080534      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2294596901949D+13   R2 =   0.1164989813860D-06
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2294935844939D+13   R2 =   0.3088564559430D+02
     ISTATE -5 - shortening step at time   72613.298307896519      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295029123842D+13   R2 =   0.5762675508907D+02
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295040869657D+13   R2 =   0.1254218685014D+02
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295070340836D+13   R2 =   0.5258676170882D+01
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295699955098D+13   R2 =   0.7999570624879D+02
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295704897908D+13   R2 =   0.1775723008864D-05
     ISTATE -5 - shortening step at time   72613.298307896519      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295753731813D+13   R2 =   0.1268893872453D+02
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295788913099D+13   R2 =   0.2406767303143D+02
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2295809516130D+13   R2 =   0.8635225614281D-05
     ISTATE -5 - shortening step at time   72613.298307896519      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298901855199D+13   R2 =   0.2154050432793D+02
     ISTATE -5 - shortening step at time   72652.199877520456      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298906274274D+13   R2 =   0.1993418630835D-05
     ISTATE -5 - shortening step at time   72652.199877520456      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298914172816D+13   R2 =   0.2731660858795D+02
     ISTATE -5 - shortening step at time   72652.199877520456      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298917636689D+13   R2 =   0.4909495984863D-06
     ISTATE -5 - shortening step at time   72652.199877520456      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298929129092D+13   R2 =   0.3180851743350D+01
     ISTATE -5 - shortening step at time   72652.199877520456      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298966777954D+13   R2 =   0.1746145704639D-05
     ISTATE -5 - shortening step at time   72652.199877520456      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298977346961D+13   R2 =   0.1070733064749D-05
     ISTATE -5 - shortening step at time   72652.199877520456      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2298985325641D+13   R2 =   0.2452046582284D-06
     ISTATE -5 - shortening step at time   72652.199877520456      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299014870669D+13   R2 =   0.1007114795174D-05
     ISTATE -5 - shortening step at time   72652.199877520456      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299018604511D+13   R2 =   0.9176907835133D-06
     ISTATE -5 - shortening step at time   72652.199877520456      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299088228335D+13   R2 =   0.5040682490650D+02
     ISTATE -5 - shortening step at time   72753.753307302672      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299091945916D+13   R2 =   0.1951424508650D+02
     ISTATE -5 - shortening step at time   72753.753307302672      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299104189882D+13   R2 =   0.3425961503582D-05
     ISTATE -5 - shortening step at time   72753.753307302672      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1337482705409D+13   R2 =   0.4059841470657D-05
     ISTATE -5 - shortening step at time   42051.855787014232      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1337745384542D+13   R2 =   0.1034816560538D+03
     ISTATE -5 - shortening step at time   42051.855787014232      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299108692904D+13   R2 =   0.1057459792378D-05
     ISTATE -5 - shortening step at time   72753.753307302672      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299207838394D+13   R2 =   0.1418922898453D+03
     ISTATE -5 - shortening step at time   72753.753307302672      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299211480933D+13   R2 =   0.2042043052270D+02
     ISTATE -5 - shortening step at time   72753.753307302672      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299301715650D+13   R2 =   0.1097624741239D+02
     ISTATE -5 - shortening step at time   72753.753307302672      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342754722547D+13   R2 =   0.2170610618535D+03
     ISTATE -5 - shortening step at time   42051.855787014232      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342760516336D+13   R2 =   0.1035501423847D+03
     ISTATE -5 - shortening step at time   42051.855787014232      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299322553514D+13   R2 =   0.5443518425362D-05
     ISTATE -5 - shortening step at time   72753.753307302672      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342828671712D+13   R2 =   0.5098090709592D+02
     ISTATE -5 - shortening step at time   42051.855787014232      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299424485134D+13   R2 =   0.2222257015757D+02
     ISTATE -5 - shortening step at time   72753.753307302672      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299489204783D+13   R2 =   0.1256781925476D+02
     ISTATE -5 - shortening step at time   72753.753307302672      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342841374639D+13   R2 =   0.9253384450196D-06
     ISTATE -5 - shortening step at time   42051.855787014232      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2299495628942D+13   R2 =   0.3004135945797D+01
     ISTATE -5 - shortening step at time   72768.645720986635      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2300968471637D+13   R2 =   0.2947901422777D+02
     ISTATE -5 - shortening step at time   72768.645720986635      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342879917351D+13   R2 =   0.1032652380260D-05
     ISTATE -5 - shortening step at time   42051.855787014232      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2300998674643D+13   R2 =   0.2146799270984D+01
     ISTATE -5 - shortening step at time   72768.645720986635      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2301033843739D+13   R2 =   0.6338216544776D+02
     ISTATE -5 - shortening step at time   72768.645720986635      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2301044716006D+13   R2 =   0.2292766686154D+03
     ISTATE -5 - shortening step at time   72768.645720986635      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1342974132147D+13   R2 =   0.1320274369798D-05
     ISTATE -5 - shortening step at time   42051.855787014232      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307244055482D+13   R2 =   0.6047770896485D+01
     ISTATE -5 - shortening step at time   72768.645720986635      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307258995475D+13   R2 =   0.2432288622229D+02
     ISTATE -5 - shortening step at time   72768.645720986635      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1343078387198D+13   R2 =   0.1338477578217D-05
     ISTATE -5 - shortening step at time   42051.855787014232      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307262129816D+13   R2 =   0.1449363142544D+02
     ISTATE -5 - shortening step at time   72768.645720986635      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1343114292742D+13   R2 =   0.3895569041720D+02
     ISTATE -5 - shortening step at time   42051.855787014232      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307524429261D+13   R2 =   0.2635913712241D+02
     ISTATE -5 - shortening step at time   72768.645720986635      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307527234629D+13   R2 =   0.7501316684186D+01
     ISTATE -5 - shortening step at time   72768.645720986635      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1343230281013D+13   R2 =   0.1569964071381D-05
     ISTATE -5 - shortening step at time   42503.616858935318      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307537988347D+13   R2 =   0.2095309785409D+01
     ISTATE -5 - shortening step at time   73023.013754087238      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1343249677538D+13   R2 =   0.9415976777183D+01
     ISTATE -5 - shortening step at time   42503.616858935318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307588045166D+13   R2 =   0.5711426472179D+02
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1343326836249D+13   R2 =   0.2286386225782D+02
     ISTATE -5 - shortening step at time   42503.616858935318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1343341063350D+13   R2 =   0.1849342014581D+02
     ISTATE -5 - shortening step at time   42503.616858935318      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307734007983D+13   R2 =   0.7769497078648D-06
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307758835100D+13   R2 =   0.1537191484767D+02
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307770013995D+13   R2 =   0.1859257029076D-06
     ISTATE -5 - shortening step at time   73023.013754087238      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307784778052D+13   R2 =   0.2478381036943D+03
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307786839395D+13   R2 =   0.9692978700074D-06
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307794106020D+13   R2 =   0.1280047879581D-05
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307814408047D+13   R2 =   0.1122062074237D-05
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2307830638757D+13   R2 =   0.4143905798817D-06
     ISTATE -5 - shortening step at time   73023.013754087238      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308231699575D+13   R2 =   0.1123500864135D-05
     ISTATE -5 - shortening step at time   73032.615150531579      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308237948126D+13   R2 =   0.6310220933402D-05
     ISTATE -5 - shortening step at time   73032.615150531579      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308257540114D+13   R2 =   0.1910673788938D-05
     ISTATE -5 - shortening step at time   73032.615150531579      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308274450925D+13   R2 =   0.2771218880559D+02
     ISTATE -5 - shortening step at time   73032.615150531579      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308285969178D+13   R2 =   0.3602461178673D-05
     ISTATE -5 - shortening step at time   73032.615150531579      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308291210745D+13   R2 =   0.3398639530933D-05
     ISTATE -5 - shortening step at time   73032.615150531579      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308295810642D+13   R2 =   0.3064988498499D-06
     ISTATE -5 - shortening step at time   73032.615150531579      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308304009948D+13   R2 =   0.2939277837824D+02
     ISTATE -5 - shortening step at time   73032.615150531579      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308333634721D+13   R2 =   0.2408162486872D+02
     ISTATE -5 - shortening step at time   73032.615150531579      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308339880647D+13   R2 =   0.2520669207936D+02
     ISTATE -5 - shortening step at time   73032.615150531579      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308475496843D+13   R2 =   0.4297830918737D+02
     ISTATE -5 - shortening step at time   73048.730400232875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2308490473598D+13   R2 =   0.2575764982843D+02
     ISTATE -5 - shortening step at time   73048.730400232875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310102461392D+13   R2 =   0.3160853418743D-05
     ISTATE -5 - shortening step at time   73048.730400232875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310278692179D+13   R2 =   0.1030147529782D-05
     ISTATE -5 - shortening step at time   73048.730400232875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310282819886D+13   R2 =   0.7964131891232D+01
     ISTATE -5 - shortening step at time   73048.730400232875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310318248863D+13   R2 =   0.2649567449028D+02
     ISTATE -5 - shortening step at time   73048.730400232875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310335323436D+13   R2 =   0.2399282320272D+02
     ISTATE -5 - shortening step at time   73048.730400232875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310339262158D+13   R2 =   0.6925551523884D+01
     ISTATE -5 - shortening step at time   73048.730400232875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310360693067D+13   R2 =   0.2909917675654D-05
     ISTATE -5 - shortening step at time   73048.730400232875      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310364293485D+13   R2 =   0.2181166656200D+02
     ISTATE -5 - shortening step at time   73048.730400232875      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310378197020D+13   R2 =   0.2581209986218D-06
     ISTATE -5 - shortening step at time   73112.794097621590      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310439617194D+13   R2 =   0.7297064981900D+02
     ISTATE -5 - shortening step at time   73112.794097621590      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310864847982D+13   R2 =   0.7667589612034D+02
     ISTATE -5 - shortening step at time   73112.794097621590      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310870476585D+13   R2 =   0.3349609852145D-06
     ISTATE -5 - shortening step at time   73112.794097621590      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2310923101560D+13   R2 =   0.1081481545583D+02
     ISTATE -5 - shortening step at time   73112.794097621590      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311106595784D+13   R2 =   0.2351226614688D+02
     ISTATE -5 - shortening step at time   73112.794097621590      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311193788843D+13   R2 =   0.2480355957673D+02
     ISTATE -5 - shortening step at time   73112.794097621590      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311202368797D+13   R2 =   0.2831767440280D+02
     ISTATE -5 - shortening step at time   73112.794097621590      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311213248660D+13   R2 =   0.2320858847100D+01
     ISTATE -5 - shortening step at time   73112.794097621590      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311227164169D+13   R2 =   0.1335120191151D+02
     ISTATE -5 - shortening step at time   73112.794097621590      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311241461544D+13   R2 =   0.1166395494641D-05
     ISTATE -5 - shortening step at time   73140.100131924468      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311243758777D+13   R2 =   0.7278910797032D+01
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311255043623D+13   R2 =   0.2079144522048D+02
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2311258367687D+13   R2 =   0.7697451315826D-06
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313492984729D+13   R2 =   0.1887639530646D-04
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313679413931D+13   R2 =   0.4165674525467D+02
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2313850914946D+13   R2 =   0.1676891697431D-05
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2318350424992D+13   R2 =   0.3292768418625D-06
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2318558275564D+13   R2 =   0.2410810373755D+02
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2319109208133D+13   R2 =   0.2854919386137D+02
     ISTATE -5 - shortening step at time   73140.100131924468      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325340231193D+13   R2 =   0.2508988530179D+02
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325438115385D+13   R2 =   0.1120204715951D-05
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325623641474D+13   R2 =   0.3570179879447D-06
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325653427304D+13   R2 =   0.1021805014373D-05
     ISTATE -5 - shortening step at time   73389.531902941351      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325668117815D+13   R2 =   0.4157304960395D+02
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325674365904D+13   R2 =   0.9271364756497D+02
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325719201596D+13   R2 =   0.4028685663436D-06
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2325724026410D+13   R2 =   0.3458506885193D-06
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2327297282988D+13   R2 =   0.9276052599577D-06
     ISTATE -5 - shortening step at time   73389.531902941351      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2327302846605D+13   R2 =   0.3977689758276D+01
     ISTATE -5 - shortening step at time   73389.531902941351      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2338447320171D+13   R2 =   0.6209599874587D+01
     ISTATE -5 - shortening step at time   73648.824259645233      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2338619113288D+13   R2 =   0.1889612156350D-06
     ISTATE -5 - shortening step at time   73648.824259645233      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2338679342169D+13   R2 =   0.8291194612668D-04
     ISTATE -5 - shortening step at time   73648.824259645233      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2338685320196D+13   R2 =   0.2868984529450D-05
     ISTATE -5 - shortening step at time   73648.824259645233      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2338692973705D+13   R2 =   0.2957208686175D+02
     ISTATE -5 - shortening step at time   73648.824259645233      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2338695575005D+13   R2 =   0.1366013031978D+02
     ISTATE -5 - shortening step at time   73648.824259645233      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2338799046632D+13   R2 =   0.5284331035993D-06
     ISTATE -5 - shortening step at time   73648.824259645233      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339085254858D+13   R2 =   0.7560162724334D-06
     ISTATE -5 - shortening step at time   73648.824259645233      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339119817648D+13   R2 =   0.4568695847078D+02
     ISTATE -5 - shortening step at time   73648.824259645233      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339264982431D+13   R2 =   0.2910236205421D+02
     ISTATE -5 - shortening step at time   73648.824259645233      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339273188913D+13   R2 =   0.4067986941725D-07
     ISTATE -5 - shortening step at time   74027.372861740863      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339291079886D+13   R2 =   0.1089300478982D-05
     ISTATE -5 - shortening step at time   74027.372861740863      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339418786184D+13   R2 =   0.1310942619487D+03
     ISTATE -5 - shortening step at time   74027.372861740863      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339423892651D+13   R2 =   0.1657089941773D-05
     ISTATE -5 - shortening step at time   74027.372861740863      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2339439679346D+13   R2 =   0.5182790100032D-05
     ISTATE -5 - shortening step at time   74027.372861740863      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2367396763685D+13
     ISTATE -1: Reducing time step to    651.24929059541580      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2367412214946D+13   R2 =   0.1376534572623D+02
     ISTATE -5 - shortening step at time   74027.372861740863      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2573202943761D+13   R2 =   0.1140616632663D-06
     ISTATE -5 - shortening step at time   81430.111912865061      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2574130475542D+13   R2 =   0.8008456389769D-06
     ISTATE -5 - shortening step at time   81430.111912865061      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2574143460101D+13   R2 =   0.1713558007479D-05
     ISTATE -5 - shortening step at time   81430.111912865061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2574148356249D+13   R2 =   0.2098623079185D+02
     ISTATE -5 - shortening step at time   81430.111912865061      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2576781695349D+13   R2 =   0.2816964169315D-06
     ISTATE -5 - shortening step at time   81430.111912865061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2576785862757D+13   R2 =   0.2300952745799D+02
     ISTATE -5 - shortening step at time   81430.111912865061      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2576825980640D+13   R2 =   0.8675415363416D-06
     ISTATE -5 - shortening step at time   81430.111912865061      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2577149813717D+13   R2 =   0.2599315551539D+02
     ISTATE -5 - shortening step at time   81430.111912865061      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2577393987074D+13   R2 =   0.9197997217237D+02
     ISTATE -5 - shortening step at time   81430.111912865061      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2577396429624D+13   R2 =   0.1868852302124D+02
     ISTATE -5 - shortening step at time   81430.111912865061      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581855041631D+13   R2 =   0.4885340236396D-06
     ISTATE -5 - shortening step at time   81563.178152643959      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581919223806D+13   R2 =   0.3241573996846D+02
     ISTATE -5 - shortening step at time   81563.178152643959      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581921704500D+13   R2 =   0.1340135161910D+02
     ISTATE -5 - shortening step at time   81563.178152643959      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581924185584D+13   R2 =   0.7915778214615D+02
     ISTATE -5 - shortening step at time   81563.178152643959      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581949794917D+13   R2 =   0.2915708927218D-06
     ISTATE -5 - shortening step at time   81563.178152643959      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581962644632D+13   R2 =   0.2675981910137D+02
     ISTATE -5 - shortening step at time   81563.178152643959      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581978482298D+13   R2 =   0.1203323931565D+02
     ISTATE -5 - shortening step at time   81563.178152643959      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2581980446041D+13   R2 =   0.4901593217503D-06
     ISTATE -5 - shortening step at time   81563.178152643959      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2582002111157D+13   R2 =   0.4474523645953D-05
     ISTATE -5 - shortening step at time   81563.178152643959      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2601060171638D+13   R2 =   0.5238402669071D-05
     ISTATE -5 - shortening step at time   81563.178152643959      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2601067013381D+13   R2 =   0.4417276016537D+00
     ISTATE -5 - shortening step at time   82312.030748050311      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610406560243D+13   R2 =   0.4145471460867D-06
     ISTATE -5 - shortening step at time   82312.030748050311      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610416458728D+13   R2 =   0.1113606134961D+02
     ISTATE -5 - shortening step at time   82312.030748050311      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610702884046D+13   R2 =   0.2569950642382D+02
     ISTATE -5 - shortening step at time   82312.030748050311      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610707373164D+13   R2 =   0.6487368315446D-06
     ISTATE -5 - shortening step at time   82312.030748050311      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610712508326D+13   R2 =   0.3129332460912D-05
     ISTATE -5 - shortening step at time   82312.030748050311      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610718135922D+13   R2 =   0.1194218578469D+02
     ISTATE -5 - shortening step at time   82312.030748050311      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610733455184D+13   R2 =   0.1027118970060D-05
     ISTATE -5 - shortening step at time   82312.030748050311      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610735181922D+13   R2 =   0.9314251248150D-07
     ISTATE -5 - shortening step at time   82312.030748050311      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610766560919D+13   R2 =   0.2580911189260D+02
     ISTATE -5 - shortening step at time   82312.030748050311      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610782298136D+13   R2 =   0.5450250459370D-06
     ISTATE -5 - shortening step at time   82619.194965791437      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610786333415D+13   R2 =   0.2219309937596D-05
     ISTATE -5 - shortening step at time   82619.194965791437      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610801609774D+13   R2 =   0.1929279091003D+02
     ISTATE -5 - shortening step at time   82619.194965791437      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610847720148D+13   R2 =   0.7008239021193D+02
     ISTATE -5 - shortening step at time   82619.194965791437      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610852770614D+13   R2 =   0.4510643765702D-05
     ISTATE -5 - shortening step at time   82619.194965791437      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610861551054D+13   R2 =   0.1467853591357D-05
     ISTATE -5 - shortening step at time   82619.194965791437      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610864537731D+13   R2 =   0.3347118202611D-06
     ISTATE -5 - shortening step at time   82619.194965791437      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610916360919D+13   R2 =   0.3454580356993D+02
     ISTATE -5 - shortening step at time   82619.194965791437      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610917971231D+13   R2 =   0.4583861938040D+02
     ISTATE -5 - shortening step at time   82619.194965791437      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2610923246994D+13   R2 =   0.1089454620272D+02
     ISTATE -5 - shortening step at time   82619.194965791437      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2625818045869D+13   R2 =   0.9151877910164D-05
     ISTATE -5 - shortening step at time   82624.153385882688      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626204055865D+13   R2 =   0.9431006818656D-06
     ISTATE -5 - shortening step at time   82624.153385882688      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626218333895D+13   R2 =   0.2409498396865D+02
     ISTATE -5 - shortening step at time   82624.153385882688      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626220997603D+13   R2 =   0.7230922083093D+01
     ISTATE -5 - shortening step at time   82624.153385882688      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626229395179D+13   R2 =   0.3465027881613D+01
     ISTATE -5 - shortening step at time   82624.153385882688      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626318186756D+13   R2 =   0.1649801536800D-06
     ISTATE -5 - shortening step at time   82624.153385882688      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626331979541D+13   R2 =   0.8629788522888D+01
     ISTATE -5 - shortening step at time   82624.153385882688      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626985292804D+13   R2 =   0.2609018756607D+02
     ISTATE -5 - shortening step at time   82624.153385882688      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2626986793355D+13   R2 =   0.4749393855576D-06
     ISTATE -5 - shortening step at time   82624.153385882688      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2627346808365D+13   R2 =   0.1963495091336D+02
     ISTATE -5 - shortening step at time   82624.153385882688      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646250634334D+13   R2 =   0.2170845061453D-06
     ISTATE -5 - shortening step at time   83143.886340661003      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646287353925D+13   R2 =   0.2385340195499D+02
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646411933991D+13   R2 =   0.9283712402494D-06
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646837368204D+13   R2 =   0.1773974839828D-05
     ISTATE -5 - shortening step at time   83143.886340661003      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646854637293D+13   R2 =   0.1511134302941D+02
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646859809454D+13   R2 =   0.6970932599969D+01
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646934696483D+13   R2 =   0.1293508919552D-06
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2646936341283D+13   R2 =   0.1192592036191D-05
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2647608304371D+13   R2 =   0.2413377369105D+02
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2647620856862D+13   R2 =   0.1852268242213D-05
     ISTATE -5 - shortening step at time   83143.886340661003      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2652822427132D+13   R2 =   0.8983966724552D-06
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2658707124498D+13   R2 =   0.2914641522096D-05
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2658826344441D+13   R2 =   0.2137233097559D+02
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2658829571035D+13   R2 =   0.3758101412023D-05
     ISTATE -5 - shortening step at time   83785.470153874194      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2658850312678D+13   R2 =   0.2505839534404D+03
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2658959947537D+13   R2 =   0.7106492456246D+02
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2658963421117D+13   R2 =   0.8610183105816D-06
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2659792312148D+13   R2 =   0.5384587090732D-06
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2660658171110D+13   R2 =   0.1264282013724D+03
     ISTATE -5 - shortening step at time   83785.470153874194      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2660660670236D+13   R2 =   0.9760442405988D+01
     ISTATE -5 - shortening step at time   83785.470153874194      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2660757478436D+13   R2 =   0.7738412903669D+02
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2660760089196D+13   R2 =   0.3353256116439D-06
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2664448628049D+13   R2 =   0.1237057448113D-05
     ISTATE -5 - shortening step at time   84198.122475825920      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2664464415146D+13   R2 =   0.2467291193861D+02
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2664466000219D+13   R2 =   0.6754407881779D-06
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2668282702278D+13   R2 =   0.4272357902751D-06
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670210923091D+13   R2 =   0.3806542671971D+02
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670455499992D+13   R2 =   0.5419635168346D-06
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670462266777D+13   R2 =   0.9385216419326D-06
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670471839397D+13   R2 =   0.5918132118943D-06
     ISTATE -5 - shortening step at time   84198.122475825920      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670485752382D+13   R2 =   0.1371278725070D-05
     ISTATE -5 - shortening step at time   84508.602512574900      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670488107036D+13   R2 =   0.2784344596087D-05
     ISTATE -5 - shortening step at time   84508.602512574900      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670532916495D+13   R2 =   0.5870930617774D+02
     ISTATE -5 - shortening step at time   84508.602512574900      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670545451084D+13   R2 =   0.1914294762877D-05
     ISTATE -5 - shortening step at time   84508.602512574900      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2670590366662D+13   R2 =   0.5643293806776D+02
     ISTATE -5 - shortening step at time   84508.602512574900      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2671561337731D+13   R2 =   0.5463654573088D-06
     ISTATE -5 - shortening step at time   84508.602512574900      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2673898087453D+13   R2 =   0.1099349342209D+03
     ISTATE -5 - shortening step at time   84508.602512574900      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2673910532990D+13   R2 =   0.8828706672402D-05
     ISTATE -5 - shortening step at time   84508.602512574900      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2676703067700D+13   R2 =   0.2514021742828D-06
     ISTATE -5 - shortening step at time   84508.602512574900      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2676705468986D+13   R2 =   0.1849667004080D+02
     ISTATE -5 - shortening step at time   84508.602512574900      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2676728181137D+13   R2 =   0.7026429256694D-07
     ISTATE -5 - shortening step at time   84705.869271713163      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2682187058109D+13   R2 =   0.1226371164291D-05
     ISTATE -5 - shortening step at time   84705.869271713163      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625200317861D+13   R2 =   0.1488770033524D-07
     ISTATE -5 - shortening step at time   51429.378628715182      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2682249884841D+13   R2 =   0.2695512674408D+02
     ISTATE -5 - shortening step at time   84705.869271713163      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625230493766D+13   R2 =   0.2742055442827D+02
     ISTATE -5 - shortening step at time   51429.378628715182      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625305269015D+13   R2 =   0.5116106825988D+02
     ISTATE -5 - shortening step at time   51429.378628715182      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2682264372661D+13   R2 =   0.1108321411208D+02
     ISTATE -5 - shortening step at time   84705.869271713163      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2682279203484D+13   R2 =   0.2077751182094D+02
     ISTATE -5 - shortening step at time   84705.869271713163      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625374284524D+13   R2 =   0.3216429216362D-05
     ISTATE -5 - shortening step at time   51429.378628715182      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2682289824390D+13   R2 =   0.6454131789592D-06
     ISTATE -5 - shortening step at time   84705.869271713163      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625415989642D+13   R2 =   0.6728327838899D+02
     ISTATE -5 - shortening step at time   51429.378628715182      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625442187246D+13   R2 =   0.8858232342464D-04
     ISTATE -5 - shortening step at time   51429.378628715182      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2682314441985D+13   R2 =   0.7603156337248D-06
     ISTATE -5 - shortening step at time   84705.869271713163      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2682357638076D+13   R2 =   0.2276105014683D+02
     ISTATE -5 - shortening step at time   84705.869271713163      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625863572047D+13   R2 =   0.2082553548323D-04
     ISTATE -5 - shortening step at time   51429.378628715182      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2684791528692D+13   R2 =   0.9934757746666D+02
     ISTATE -5 - shortening step at time   84705.869271713163      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1625889983318D+13   R2 =   0.3051925645977D+02
     ISTATE -5 - shortening step at time   51429.378628715182      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1626075248050D+13   R2 =   0.5488305077259D+01
     ISTATE -5 - shortening step at time   51429.378628715182      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2686260450849D+13   R2 =   0.4581444786111D+02
     ISTATE -5 - shortening step at time   84705.869271713163      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1626231689236D+13   R2 =   0.1168597595075D+03
     ISTATE -5 - shortening step at time   51429.378628715182      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1627277251420D+13   R2 =   0.4520681073261D+02
     ISTATE -5 - shortening step at time   51463.028140388415      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1628344199946D+13   R2 =   0.3170690768471D-04
     ISTATE -5 - shortening step at time   51463.028140388415      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2687757216978D+13   R2 =   0.1429896220821D-05
     ISTATE -5 - shortening step at time   85008.242115487301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1628512310444D+13   R2 =   0.4526767686748D+02
     ISTATE -5 - shortening step at time   51463.028140388415      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2687775970157D+13   R2 =   0.6116332595709D-06
     ISTATE -5 - shortening step at time   85008.242115487301      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1631057116228D+13   R2 =   0.7902854178785D+02
     ISTATE -5 - shortening step at time   51463.028140388415      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2687779132968D+13   R2 =   0.1122485372595D-05
     ISTATE -5 - shortening step at time   85008.242115487301      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2688629256170D+13   R2 =   0.4400617326642D+01
     ISTATE -5 - shortening step at time   85008.242115487301      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1633548306570D+13   R2 =   0.1424470178812D-05
     ISTATE -5 - shortening step at time   51463.028140388415      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2689113222087D+13   R2 =   0.1401298250376D-06
     ISTATE -5 - shortening step at time   85008.242115487301      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2689124116352D+13   R2 =   0.2859945882124D-06
     ISTATE -5 - shortening step at time   85008.242115487301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1633778838115D+13   R2 =   0.1245793238515D-05
     ISTATE -5 - shortening step at time   51463.028140388415      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2689126603972D+13   R2 =   0.3434527825564D-05
     ISTATE -5 - shortening step at time   85008.242115487301      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1634869255517D+13   R2 =   0.1131657194178D-05
     ISTATE -5 - shortening step at time   51463.028140388415      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2689192793754D+13   R2 =   0.6477194148386D-06
     ISTATE -5 - shortening step at time   85008.242115487301      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1634886383148D+13   R2 =   0.4385672730549D+02
     ISTATE -5 - shortening step at time   51463.028140388415      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1634906693541D+13   R2 =   0.3928305715616D+02
     ISTATE -5 - shortening step at time   51463.028140388415      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1654423731019D+13   R2 =   0.1094412548361D+03
     ISTATE -5 - shortening step at time   51463.028140388415      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2689960338307D+13   R2 =   0.4320018219003D-06
     ISTATE -5 - shortening step at time   85008.242115487301      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2690664920529D+13   R2 =   0.3598563923364D+02
     ISTATE -5 - shortening step at time   85008.242115487301      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1666113637768D+13   R2 =   0.2032391194778D+03
     ISTATE -5 - shortening step at time   52355.181361370414      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2690936275556D+13   R2 =   0.3146141176903D-06
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1666134448162D+13   R2 =   0.3833200953321D-04
     ISTATE -5 - shortening step at time   52355.181361370414      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2691225914073D+13   R2 =   0.8578700606492D-06
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1666150265389D+13   R2 =   0.1350695344783D-04
     ISTATE -5 - shortening step at time   52355.181361370414      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2691229905000D+13   R2 =   0.1004695056943D-05
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1666157339690D+13   R2 =   0.1984495221214D-05
     ISTATE -5 - shortening step at time   52355.181361370414      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2691233946314D+13   R2 =   0.7273312535831D-06
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2691958466431D+13   R2 =   0.1326644065975D+03
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2691960298728D+13   R2 =   0.6492588432545D-06
     ISTATE -5 - shortening step at time   85147.624067369165      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2691970630748D+13   R2 =   0.9065112439757D+01
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2691974704998D+13   R2 =   0.7970071267110D+01
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692291062915D+13   R2 =   0.1145558851538D+02
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692292575217D+13   R2 =   0.5883459519275D-06
     ISTATE -5 - shortening step at time   85147.624067369165      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692467762061D+13   R2 =   0.1600084835876D+03
     ISTATE -5 - shortening step at time   85199.132127134028      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692478925956D+13   R2 =   0.2164302901672D+02
     ISTATE -5 - shortening step at time   85199.132127134028      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692492133564D+13   R2 =   0.2411407064672D+02
     ISTATE -5 - shortening step at time   85199.132127134028      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692494730204D+13   R2 =   0.2368963539402D-06
     ISTATE -5 - shortening step at time   85199.132127134028      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692724145287D+13   R2 =   0.1586965183564D-05
     ISTATE -5 - shortening step at time   85199.132127134028      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692729704504D+13   R2 =   0.1618605646785D-05
     ISTATE -5 - shortening step at time   85199.132127134028      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2692824287114D+13   R2 =   0.5849326135230D+02
     ISTATE -5 - shortening step at time   85199.132127134028      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2694541009009D+13   R2 =   0.8773048160213D+01
     ISTATE -5 - shortening step at time   85199.132127134028      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2694624283201D+13   R2 =   0.1029358116805D-05
     ISTATE -5 - shortening step at time   85199.132127134028      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2694627815966D+13   R2 =   0.2936769422119D-06
     ISTATE -5 - shortening step at time   85199.132127134028      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2694638150678D+13   R2 =   0.7326068468127D-06
     ISTATE -5 - shortening step at time   85273.032150830521      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2695446513423D+13   R2 =   0.5227851318893D+02
     ISTATE -5 - shortening step at time   85273.032150830521      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2695543706008D+13   R2 =   0.4891085988982D+02
     ISTATE -5 - shortening step at time   85273.032150830521      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704359941091D+13   R2 =   0.6664306562676D+02
     ISTATE -5 - shortening step at time   85273.032150830521      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704366190262D+13   R2 =   0.3855947205866D+02
     ISTATE -5 - shortening step at time   85273.032150830521      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704373627717D+13   R2 =   0.2920074178801D+02
     ISTATE -5 - shortening step at time   85273.032150830521      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704386658120D+13   R2 =   0.3024454771738D+02
     ISTATE -5 - shortening step at time   85273.032150830521      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704388206157D+13   R2 =   0.7094476226081D+01
     ISTATE -5 - shortening step at time   85273.032150830521      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704395136694D+13   R2 =   0.1232745334521D+02
     ISTATE -5 - shortening step at time   85273.032150830521      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704416593649D+13   R2 =   0.3906755025617D-06
     ISTATE -5 - shortening step at time   85273.032150830521      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704431367708D+13   R2 =   0.4074218295112D-06
     ISTATE -5 - shortening step at time   85582.803596497935      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704432177051D+13   R2 =   0.7367545368768D-07
     ISTATE -5 - shortening step at time   85582.803596497935      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704432860071D+13   R2 =   0.3513613854089D-06
     ISTATE -5 - shortening step at time   85582.803596497935      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704476794811D+13   R2 =   0.6110184898624D+02
     ISTATE -5 - shortening step at time   85582.803596497935      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704530212162D+13   R2 =   0.5565692340718D+02
     ISTATE -5 - shortening step at time   85582.803596497935      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704533505257D+13   R2 =   0.7298033537089D+02
     ISTATE -5 - shortening step at time   85582.803596497935      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704536677529D+13   R2 =   0.9316785238109D+01
     ISTATE -5 - shortening step at time   85582.803596497935      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704547865153D+13   R2 =   0.2136742351121D+02
     ISTATE -5 - shortening step at time   85582.803596497935      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704549873122D+13   R2 =   0.3995243422938D-06
     ISTATE -5 - shortening step at time   85582.803596497935      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2704552657697D+13   R2 =   0.1328889235909D-05
     ISTATE -5 - shortening step at time   85582.803596497935      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1820464436699D+13   R2 =   0.1661430713469D+02
     ISTATE -5 - shortening step at time   57590.700745752249      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2712783971971D+13   R2 =   0.2436020809296D+02
     ISTATE -5 - shortening step at time   85587.109420777910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1820967094837D+13   R2 =   0.3112985194189D+02
     ISTATE -5 - shortening step at time   57590.700745752249      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1821094264255D+13   R2 =   0.5634280132526D+02
     ISTATE -5 - shortening step at time   57590.700745752249      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2712804395599D+13   R2 =   0.2719091446149D-05
     ISTATE -5 - shortening step at time   85587.109420777910      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2714282421114D+13   R2 =   0.2252842702130D+01
     ISTATE -5 - shortening step at time   85587.109420777910      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715761293836D+13   R2 =   0.7285311921611D+01
     ISTATE -5 - shortening step at time   85587.109420777910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1828597268423D+13   R2 =   0.2427743507887D-05
     ISTATE -5 - shortening step at time   57590.700745752249      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715766900980D+13   R2 =   0.1066237734337D+03
     ISTATE -5 - shortening step at time   85587.109420777910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1828657152522D+13   R2 =   0.1907745720818D+02
     ISTATE -5 - shortening step at time   57590.700745752249      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715846409447D+13   R2 =   0.3182468003902D+02
     ISTATE -5 - shortening step at time   85587.109420777910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715848277479D+13   R2 =   0.9632818563569D+01
     ISTATE -5 - shortening step at time   85587.109420777910      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1828675310669D+13   R2 =   0.2766935372697D-04
     ISTATE -5 - shortening step at time   57590.700745752249      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1828727509334D+13   R2 =   0.4335287892025D+02
     ISTATE -5 - shortening step at time   57590.700745752249      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715850580548D+13   R2 =   0.8141055103161D-06
     ISTATE -5 - shortening step at time   85587.109420777910      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1828909346441D+13   R2 =   0.2241228345946D+03
     ISTATE -5 - shortening step at time   57590.700745752249      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715966497332D+13   R2 =   0.2387359078991D+02
     ISTATE -5 - shortening step at time   85587.109420777910      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1830163796028D+13   R2 =   0.4401412454244D+02
     ISTATE -5 - shortening step at time   57590.700745752249      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1830262341159D+13   R2 =   0.1212619626086D+03
     ISTATE -5 - shortening step at time   57590.700745752249      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2715985988634D+13   R2 =   0.2694887696038D-05
     ISTATE -5 - shortening step at time   85587.109420777910      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2716015240735D+13   R2 =   0.2128503742371D+02
     ISTATE -5 - shortening step at time   85948.923690935946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1830275093958D+13   R2 =   0.4946744486131D-06
     ISTATE -5 - shortening step at time   57919.694340476002      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717834855891D+13   R2 =   0.4154136171573D+02
     ISTATE -5 - shortening step at time   85948.923690935946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717854765516D+13   R2 =   0.2505815807538D+02
     ISTATE -5 - shortening step at time   85948.923690935946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1830305831313D+13   R2 =   0.7715957345098D-07
     ISTATE -5 - shortening step at time   57919.694340476002      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717864563234D+13   R2 =   0.2965836318014D+03
     ISTATE -5 - shortening step at time   85948.923690935946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1830592094541D+13   R2 =   0.5888869853778D+02
     ISTATE -5 - shortening step at time   57919.694340476002      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717908798450D+13   R2 =   0.3500895309533D+02
     ISTATE -5 - shortening step at time   85948.923690935946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717915155900D+13   R2 =   0.3605080932871D+01
     ISTATE -5 - shortening step at time   85948.923690935946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2717990340431D+13   R2 =   0.3008869439540D-06
     ISTATE -5 - shortening step at time   85948.923690935946      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1835680407861D+13   R2 =   0.5103675283890D+02
     ISTATE -5 - shortening step at time   57919.694340476002      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1835705923695D+13   R2 =   0.4239508876117D-05
     ISTATE -5 - shortening step at time   57919.694340476002      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2719491003641D+13   R2 =   0.9642208275002D-06
     ISTATE -5 - shortening step at time   85948.923690935946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1835739146791D+13   R2 =   0.3424783454664D-05
     ISTATE -5 - shortening step at time   57919.694340476002      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1837326374556D+13   R2 =   0.7980526529555D+01
     ISTATE -5 - shortening step at time   57919.694340476002      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1837888031806D+13   R2 =   0.1184282973162D+02
     ISTATE -5 - shortening step at time   57919.694340476002      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2726184037768D+13   R2 =   0.1894918845768D+03
     ISTATE -5 - shortening step at time   85948.923690935946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1837895444235D+13   R2 =   0.2621637015236D-05
     ISTATE -5 - shortening step at time   57919.694340476002      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2726270449084D+13   R2 =   0.2865123459842D+02
     ISTATE -5 - shortening step at time   85948.923690935946      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838133991784D+13   R2 =   0.7820809367259D-06
     ISTATE -5 - shortening step at time   57919.694340476002      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2728684510765D+13   R2 =   0.2400648744073D-06
     ISTATE -5 - shortening step at time   86274.381300132125      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838224597877D+13   R2 =   0.2251822392585D-05
     ISTATE -5 - shortening step at time   58168.797208367549      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838227840088D+13   R2 =   0.2055511891667D+02
     ISTATE -5 - shortening step at time   58168.797208367549      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838271412773D+13   R2 =   0.6991758401819D-06
     ISTATE -5 - shortening step at time   58168.797208367549      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838314874869D+13   R2 =   0.3520988608135D+02
     ISTATE -5 - shortening step at time   58168.797208367549      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2731751390101D+13   R2 =   0.6954587598977D-06
     ISTATE -5 - shortening step at time   86274.381300132125      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838438793496D+13   R2 =   0.2757905541612D-05
     ISTATE -5 - shortening step at time   58168.797208367549      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2732143000495D+13   R2 =   0.4709778100641D+01
     ISTATE -5 - shortening step at time   86274.381300132125      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838467159185D+13   R2 =   0.2525573894237D-05
     ISTATE -5 - shortening step at time   58168.797208367549      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1838661222214D+13   R2 =   0.3860615598753D+02
     ISTATE -5 - shortening step at time   58168.797208367549      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2732228727888D+13   R2 =   0.5478764111798D-06
     ISTATE -5 - shortening step at time   86274.381300132125      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2732234518759D+13   R2 =   0.1287621344688D+02
     ISTATE -5 - shortening step at time   86274.381300132125      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1839004294739D+13   R2 =   0.9243972350256D+01
     ISTATE -5 - shortening step at time   58168.797208367549      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2732255142568D+13   R2 =   0.1743769772537D+02
     ISTATE -5 - shortening step at time   86274.381300132125      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1839019252179D+13   R2 =   0.3607883875043D-05
     ISTATE -5 - shortening step at time   58168.797208367549      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2732275402306D+13   R2 =   0.3691832641257D-05
     ISTATE -5 - shortening step at time   86274.381300132125      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1839036979289D+13   R2 =   0.1432698404339D+02
     ISTATE -5 - shortening step at time   58168.797208367549      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2732672665632D+13   R2 =   0.5967530128528D+01
     ISTATE -5 - shortening step at time   86274.381300132125      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1839079171545D+13   R2 =   0.8083603482205D-04
     ISTATE -5 - shortening step at time   58197.372762304665      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1839313683652D+13   R2 =   0.1545201719801D+03
     ISTATE -5 - shortening step at time   58197.372762304665      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2737137790527D+13   R2 =   0.8006802611854D+02
     ISTATE -5 - shortening step at time   86274.381300132125      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1846990601165D+13   R2 =   0.4462242376476D+02
     ISTATE -5 - shortening step at time   58197.372762304665      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1846997508765D+13   R2 =   0.3948189213050D+02
     ISTATE -5 - shortening step at time   58197.372762304665      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1847046606387D+13   R2 =   0.2359765478763D+02
     ISTATE -5 - shortening step at time   58197.372762304665      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1847284105545D+13   R2 =   0.4699930070595D+02
     ISTATE -5 - shortening step at time   58197.372762304665      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1847303115226D+13   R2 =   0.3842501529048D+02
     ISTATE -5 - shortening step at time   58197.372762304665      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2739032857546D+13   R2 =   0.4443471941124D-06
     ISTATE -5 - shortening step at time   86274.381300132125      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854629413868D+13   R2 =   0.3350820834619D-05
     ISTATE -5 - shortening step at time   58197.372762304665      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2756010705914D+13   R2 =   0.3087879444671D+02
     ISTATE -5 - shortening step at time   86678.254985622974      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854653381371D+13   R2 =   0.7900051681444D-06
     ISTATE -5 - shortening step at time   58197.372762304665      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2756012735664D+13   R2 =   0.2197665420122D-05
     ISTATE -5 - shortening step at time   86678.254985622974      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854657962296D+13   R2 =   0.3770316662584D-06
     ISTATE -5 - shortening step at time   58197.372762304665      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2756015937649D+13   R2 =   0.1041924116997D-04
     ISTATE -5 - shortening step at time   86678.254985622974      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2756017473482D+13   R2 =   0.1083174570259D+02
     ISTATE -5 - shortening step at time   86678.254985622974      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854666987529D+13   R2 =   0.1961955581807D-06
     ISTATE -5 - shortening step at time   58691.707667595663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854674633614D+13   R2 =   0.5737814741246D+01
     ISTATE -5 - shortening step at time   58691.707667595663      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2756235079932D+13   R2 =   0.3425775267980D-06
     ISTATE -5 - shortening step at time   86678.254985622974      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854752514303D+13   R2 =   0.1817558597376D-05
     ISTATE -5 - shortening step at time   58691.707667595663      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2756477569052D+13   R2 =   0.2665957408008D+02
     ISTATE -5 - shortening step at time   86678.254985622974      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854806451463D+13   R2 =   0.2486804100392D+02
     ISTATE -5 - shortening step at time   58691.707667595663      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2757537330755D+13   R2 =   0.2274642909077D+02
     ISTATE -5 - shortening step at time   86678.254985622974      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2757715892642D+13   R2 =   0.2747860929770D+02
     ISTATE -5 - shortening step at time   86678.254985622974      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1854983991046D+13   R2 =   0.2503860873903D-05
     ISTATE -5 - shortening step at time   58691.707667595663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1855083774018D+13   R2 =   0.3623807213577D+02
     ISTATE -5 - shortening step at time   58691.707667595663      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2757741157204D+13   R2 =   0.8030491201238D-05
     ISTATE -5 - shortening step at time   86678.254985622974      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1855338581639D+13   R2 =   0.4706414948884D+02
     ISTATE -5 - shortening step at time   58691.707667595663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2757757432628D+13   R2 =   0.2484287591498D+02
     ISTATE -5 - shortening step at time   86678.254985622974      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1855343695958D+13   R2 =   0.1391110186064D+03
     ISTATE -5 - shortening step at time   58691.707667595663      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1855368152946D+13   R2 =   0.9314162134073D+02
     ISTATE -5 - shortening step at time   58691.707667595663      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1855386535015D+13   R2 =   0.2308913511147D+02
     ISTATE -5 - shortening step at time   58691.707667595663      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2758459673293D+13   R2 =   0.3527698935846D-06
     ISTATE -5 - shortening step at time   87270.804829984671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1855398796847D+13   R2 =   0.2561274669045D-06
     ISTATE -5 - shortening step at time   58714.763766308235      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1857661433475D+13   R2 =   0.5127085601093D+02
     ISTATE -5 - shortening step at time   58714.763766308235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2758887225045D+13   R2 =   0.6772931197053D-06
     ISTATE -5 - shortening step at time   87270.804829984671      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1858750531566D+13   R2 =   0.2022878410105D+03
     ISTATE -5 - shortening step at time   58714.763766308235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1858765991262D+13   R2 =   0.4452197395298D+02
     ISTATE -5 - shortening step at time   58714.763766308235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2758891511305D+13   R2 =   0.1682772906735D-05
     ISTATE -5 - shortening step at time   87270.804829984671      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2758895556935D+13   R2 =   0.6990709196150D+01
     ISTATE -5 - shortening step at time   87270.804829984671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1858832953101D+13   R2 =   0.3750123878276D+02
     ISTATE -5 - shortening step at time   58714.763766308235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2758909653078D+13   R2 =   0.2520182777856D+02
     ISTATE -5 - shortening step at time   87270.804829984671      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2758961582019D+13   R2 =   0.3329612241738D+02
     ISTATE -5 - shortening step at time   87270.804829984671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2759096610772D+13   R2 =   0.3999067338143D+02
     ISTATE -5 - shortening step at time   87270.804829984671      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1860860687132D+13   R2 =   0.3043715283435D+02
     ISTATE -5 - shortening step at time   58714.763766308235      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1860890513308D+13   R2 =   0.2618624096376D-05
     ISTATE -5 - shortening step at time   58714.763766308235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2765107038596D+13   R2 =   0.1328811960271D+03
     ISTATE -5 - shortening step at time   87270.804829984671      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2765139200041D+13   R2 =   0.4135501663351D+02
     ISTATE -5 - shortening step at time   87270.804829984671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2765141036433D+13   R2 =   0.1194514602845D+02
     ISTATE -5 - shortening step at time   87270.804829984671      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861078243106D+13   R2 =   0.3112374294701D-05
     ISTATE -5 - shortening step at time   58714.763766308235      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861491556399D+13   R2 =   0.1934398524617D+02
     ISTATE -5 - shortening step at time   58714.763766308235      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861498422991D+13   R2 =   0.1967566385781D+02
     ISTATE -5 - shortening step at time   58714.763766308235      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861521512742D+13   R2 =   0.5794929352612D-05
     ISTATE -5 - shortening step at time   58908.177942768052      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861664923892D+13   R2 =   0.3320339361581D-06
     ISTATE -5 - shortening step at time   58908.177942768052      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861871892928D+13   R2 =   0.4354277001451D-06
     ISTATE -5 - shortening step at time   58908.177942768052      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2777435823902D+13   R2 =   0.4935702832047D-06
     ISTATE -5 - shortening step at time   87504.463178265709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861876093823D+13   R2 =   0.1325554944572D-05
     ISTATE -5 - shortening step at time   58908.177942768052      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861916012010D+13   R2 =   0.4323754111331D+02
     ISTATE -5 - shortening step at time   58908.177942768052      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1861926874992D+13   R2 =   0.4480739701896D+02
     ISTATE -5 - shortening step at time   58908.177942768052      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779092018746D+13   R2 =   0.3837209978854D-06
     ISTATE -5 - shortening step at time   87504.463178265709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779094456932D+13   R2 =   0.7806000651585D+02
     ISTATE -5 - shortening step at time   87504.463178265709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1862388541290D+13   R2 =   0.8886414873311D-06
     ISTATE -5 - shortening step at time   58908.177942768052      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779118760832D+13   R2 =   0.1610608044561D-05
     ISTATE -5 - shortening step at time   87504.463178265709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779121701248D+13   R2 =   0.7486549336297D+01
     ISTATE -5 - shortening step at time   87504.463178265709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779123346838D+13   R2 =   0.9128785823892D+01
     ISTATE -5 - shortening step at time   87504.463178265709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779131958123D+13   R2 =   0.1343275483548D+02
     ISTATE -5 - shortening step at time   87504.463178265709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1863466328442D+13   R2 =   0.6431627368252D+02
     ISTATE -5 - shortening step at time   58908.177942768052      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779146505466D+13   R2 =   0.2244208452933D+02
     ISTATE -5 - shortening step at time   87504.463178265709      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779148243877D+13   R2 =   0.1617773635773D+02
     ISTATE -5 - shortening step at time   87504.463178265709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1865982700361D+13   R2 =   0.6210205344379D+02
     ISTATE -5 - shortening step at time   58908.177942768052      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779150268855D+13   R2 =   0.6073457178051D-06
     ISTATE -5 - shortening step at time   87504.463178265709      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1866068410679D+13   R2 =   0.5952309899574D-05
     ISTATE -5 - shortening step at time   58908.177942768052      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2779156593208D+13   R2 =   0.1910783983517D-06
     ISTATE -5 - shortening step at time   87947.793318188211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2794503001059D+13   R2 =   0.1529973222173D+03
     ISTATE -5 - shortening step at time   87947.793318188211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797081363113D+13   R2 =   0.1404127674531D+02
     ISTATE -5 - shortening step at time   87947.793318188211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797706747877D+13   R2 =   0.1039113554751D-05
     ISTATE -5 - shortening step at time   87947.793318188211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797714021039D+13   R2 =   0.1313837986384D+02
     ISTATE -5 - shortening step at time   87947.793318188211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797762488374D+13   R2 =   0.2088541499922D+02
     ISTATE -5 - shortening step at time   87947.793318188211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797764704335D+13   R2 =   0.2476360155735D-06
     ISTATE -5 - shortening step at time   87947.793318188211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797769150523D+13   R2 =   0.1881452768745D+02
     ISTATE -5 - shortening step at time   87947.793318188211      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797780004512D+13   R2 =   0.3841590859889D+02
     ISTATE -5 - shortening step at time   87947.793318188211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2797820251458D+13   R2 =   0.2696393073781D+02
     ISTATE -5 - shortening step at time   87947.793318188211      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2817181122462D+13   R2 =   0.1985323989710D-06
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2817541673369D+13   R2 =   0.1270176346833D-06
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2818684989815D+13   R2 =   0.2251864703424D+02
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2818719111771D+13   R2 =   0.1053003333783D-05
     ISTATE -5 - shortening step at time   88538.615552458126      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2818797217727D+13   R2 =   0.7002006510205D+02
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.1898961085802D+13   R2 =   0.1518473624201D+03
     ISTATE -5 - shortening step at time   59052.797806301744      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2819135542384D+13   R2 =   0.3469411111073D+02
     ISTATE -5 - shortening step at time   88538.615552458126      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2819144607509D+13   R2 =   0.1057478925593D+02
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2819158551813D+13   R2 =   0.1262586416839D+02
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2819772298004D+13   R2 =   0.1338073587242D-05
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2819805571109D+13   R2 =   0.2635823323334D-06
     ISTATE -5 - shortening step at time   88538.615552458126      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2830234621339D+13   R2 =   0.3584309025189D-05
     ISTATE -5 - shortening step at time   89234.353516105315      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2830416519070D+13   R2 =   0.4880538785161D+02
     ISTATE -5 - shortening step at time   89234.353516105315      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832349710762D+13   R2 =   0.3312073736071D-06
     ISTATE -5 - shortening step at time   89234.353516105315      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832361561867D+13   R2 =   0.2541444379967D+02
     ISTATE -5 - shortening step at time   89234.353516105315      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832366894927D+13   R2 =   0.1517443656026D+02
     ISTATE -5 - shortening step at time   89234.353516105315      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832374449478D+13   R2 =   0.2997890198127D+02
     ISTATE -5 - shortening step at time   89234.353516105315      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832377472761D+13   R2 =   0.7499433985505D-06
     ISTATE -5 - shortening step at time   89234.353516105315      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832382020773D+13   R2 =   0.8644507885164D-06
     ISTATE -5 - shortening step at time   89234.353516105315      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832402338728D+13   R2 =   0.2274423845627D-05
     ISTATE -5 - shortening step at time   89234.353516105315      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2832409927400D+13   R2 =   0.1958346148533D+03
     ISTATE -5 - shortening step at time   89234.353516105315      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2838933935478D+13   R2 =   0.3504855378168D-06
     ISTATE -5 - shortening step at time   89633.225550636067      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2838949137104D+13   R2 =   0.1173599461678D+03
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2838993178132D+13   R2 =   0.2577683259838D+02
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2838995377417D+13   R2 =   0.6569229014199D-06
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2844161073357D+13   R2 =   0.1742158874779D+01
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2844162992088D+13   R2 =   0.8019653816573D-06
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2844258933444D+13   R2 =   0.9405300349118D-06
     ISTATE -5 - shortening step at time   89633.225550636067      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2844270233117D+13   R2 =   0.3868502982883D+01
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2844282614699D+13   R2 =   0.1061739176411D+03
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2844284746923D+13   R2 =   0.1142457775372D-06
     ISTATE -5 - shortening step at time   89633.225550636067      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2853696772498D+13   R2 =   0.7812256209201D+02
     ISTATE -5 - shortening step at time   90009.010978570281      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2855440842158D+13   R2 =   0.1984349497951D-06
     ISTATE -5 - shortening step at time   90009.010978570281      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858192740233D+13   R2 =   0.3233159736968D+02
     ISTATE -5 - shortening step at time   90009.010978570281      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858196007548D+13   R2 =   0.7695532538166D+01
     ISTATE -5 - shortening step at time   90009.010978570281      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858220765234D+13   R2 =   0.2470866233874D-05
     ISTATE -5 - shortening step at time   90009.010978570281      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858276734862D+13   R2 =   0.7941372628989D-06
     ISTATE -5 - shortening step at time   90009.010978570281      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858278380975D+13   R2 =   0.9168941382828D+01
     ISTATE -5 - shortening step at time   90009.010978570281      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858283353092D+13   R2 =   0.1405366332919D+02
     ISTATE -5 - shortening step at time   90009.010978570281      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858286638241D+13   R2 =   0.1644747467098D+02
     ISTATE -5 - shortening step at time   90009.010978570281      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2858320732698D+13   R2 =   0.4586368966936D-05
     ISTATE -5 - shortening step at time   90009.010978570281      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2257959183083D+13   R2 =   0.5288380869844D-06
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2273132492137D+13   R2 =   0.4953795674916D-06
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2279874957877D+13   R2 =   0.1478652523978D-05
     ISTATE -5 - shortening step at time   71453.888443067655      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2280522724171D+13   R2 =   0.4219089008155D+02
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2280683662717D+13   R2 =   0.1522637107809D-05
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2282599719114D+13   R2 =   0.1793026564197D+02
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2283419718121D+13   R2 =   0.1187338761138D+03
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2285786611426D+13   R2 =   0.2630906479637D-06
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2288179018689D+13   R2 =   0.4750980787705D+02
     ISTATE -5 - shortening step at time   71453.888443067655      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2288197033776D+13   R2 =   0.1924233392161D+02
     ISTATE -5 - shortening step at time   71453.888443067655      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2288205703515D+13   R2 =   0.8684068543758D-07
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2304212875840D+13   R2 =   0.3015431629710D-05
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2306496281540D+13   R2 =   0.5517928658101D+01
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2306506203672D+13   R2 =   0.2810537858697D-05
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314697172590D+13   R2 =   0.5712565757778D-06
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314708735413D+13   R2 =   0.2885350566168D-05
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314774531104D+13   R2 =   0.1570748539059D-04
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2314782013349D+13   R2 =   0.3889322383427D-05
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At current T(=R1), MXSTEP(=I1) steps                                            
     taken on this call before reaching TOUT.                                        
    In the above message, I1 =      10000
    In the above message, R1 =   0.2341125046844D+13
     ISTATE -1: Reducing time step to    556.61945406994801      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2341138983269D+13   R2 =   0.6335862462649D+02
     ISTATE -5 - shortening step at time   72411.298537224866      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2575268253442D+13   R2 =   0.1255405637137D-06
     ISTATE -5 - shortening step at time   81495.346120661881      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2582934241612D+13   R2 =   0.1609543783798D+03
     ISTATE -5 - shortening step at time   81495.346120661881      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2582969361209D+13   R2 =   0.2002152166819D+02
     ISTATE -5 - shortening step at time   81495.346120661881      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2582982923665D+13   R2 =   0.4816444807653D-05
     ISTATE -5 - shortening step at time   81495.346120661881      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2588339832609D+13   R2 =   0.4143844000895D-05
     ISTATE -5 - shortening step at time   81495.346120661881      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589248766469D+13   R2 =   0.4788895918325D+01
     ISTATE -5 - shortening step at time   81495.346120661881      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589269039917D+13   R2 =   0.3667725843699D+02
     ISTATE -5 - shortening step at time   81495.346120661881      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589287679347D+13   R2 =   0.1397331179517D-04
     ISTATE -5 - shortening step at time   81495.346120661881      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589453985106D+13   R2 =   0.4625885600303D+02
     ISTATE -5 - shortening step at time   81495.346120661881      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589552703954D+13   R2 =   0.1702658156343D-05
     ISTATE -5 - shortening step at time   81495.346120661881      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589562386416D+13   R2 =   0.1946936047544D-06
     ISTATE -5 - shortening step at time   81947.870378305772      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589564273502D+13   R2 =   0.1229291671029D-05
     ISTATE -5 - shortening step at time   81947.870378305772      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2589597194620D+13   R2 =   0.8836573195110D+02
     ISTATE -5 - shortening step at time   81947.870378305772      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2848523763834D+13   R2 =   0.7554821997920D+00
     ISTATE -5 - shortening step at time   90142.659369925837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2849073583864D+13   R2 =   0.5520501065477D+01
     ISTATE -5 - shortening step at time   90142.659369925837      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2849096523011D+13   R2 =   0.3133808673383D+02
     ISTATE -5 - shortening step at time   90142.659369925837      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2853649426661D+13   R2 =   0.2016817326929D+02
     ISTATE -5 - shortening step at time   90142.659369925837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2853658437472D+13   R2 =   0.2141132977970D+01
     ISTATE -5 - shortening step at time   90142.659369925837      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2856031343971D+13   R2 =   0.1142726430889D+02
     ISTATE -5 - shortening step at time   90142.659369925837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2856036040549D+13   R2 =   0.2591638136737D+02
     ISTATE -5 - shortening step at time   90142.659369925837      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2856098685415D+13   R2 =   0.2405747329011D-05
     ISTATE -5 - shortening step at time   90142.659369925837      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2856108443249D+13   R2 =   0.5391699704427D-05
     ISTATE -5 - shortening step at time   90142.659369925837      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2856115719727D+13   R2 =   0.1314064089413D+02
     ISTATE -5 - shortening step at time   90142.659369925837      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2863094658183D+13   R2 =   0.4137460471354D-06
     ISTATE -5 - shortening step at time   90383.408852107808      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2863097406684D+13   R2 =   0.4221221242026D-06
     ISTATE -5 - shortening step at time   90383.408852107808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2863112247523D+13   R2 =   0.2165781145097D+02
     ISTATE -5 - shortening step at time   90383.408852107808      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2863225648716D+13   R2 =   0.5066196206674D-06
     ISTATE -5 - shortening step at time   90383.408852107808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2863241309812D+13   R2 =   0.1997328865034D+02
     ISTATE -5 - shortening step at time   90383.408852107808      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864239476008D+13   R2 =   0.9156818703992D-06
     ISTATE -5 - shortening step at time   90383.408852107808      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864247514440D+13   R2 =   0.6302899704066D-05
     ISTATE -5 - shortening step at time   90383.408852107808      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864253898953D+13   R2 =   0.1426446425888D+02
     ISTATE -5 - shortening step at time   90383.408852107808      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864257246924D+13   R2 =   0.3924352452275D-05
     ISTATE -5 - shortening step at time   90383.408852107808      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864336171318D+13   R2 =   0.1916516007468D-05
     ISTATE -5 - shortening step at time   90383.408852107808      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2864543586129D+13   R2 =   0.2977340376135D-06
     ISTATE -5 - shortening step at time   90643.549725248798      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876284948953D+13   R2 =   0.1853037298655D+02
     ISTATE -5 - shortening step at time   90643.549725248798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876295164310D+13   R2 =   0.1943408603213D+02
     ISTATE -5 - shortening step at time   90643.549725248798      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876337729382D+13   R2 =   0.4880851253129D-06
     ISTATE -5 - shortening step at time   90643.549725248798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876368490914D+13   R2 =   0.1356521233090D+02
     ISTATE -5 - shortening step at time   90643.549725248798      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876372075139D+13   R2 =   0.1111262330329D-05
     ISTATE -5 - shortening step at time   90643.549725248798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876376219733D+13   R2 =   0.9805151850030D+01
     ISTATE -5 - shortening step at time   90643.549725248798      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876388583227D+13   R2 =   0.1779019129437D-05
     ISTATE -5 - shortening step at time   90643.549725248798      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876416302522D+13   R2 =   0.3403093123803D+02
     ISTATE -5 - shortening step at time   90643.549725248798      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876430997813D+13   R2 =   0.2407675495950D+02
     ISTATE -5 - shortening step at time   90643.549725248798      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876450555042D+13   R2 =   0.6564799924337D-06
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876932438636D+13   R2 =   0.2939077773781D-05
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876935296178D+13   R2 =   0.7691477393725D-06
     ISTATE -5 - shortening step at time   91026.297399161049      years
     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2876939425926D+13   R2 =   0.1085457190349D+02
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2877062394247D+13   R2 =   0.2314793229513D-06
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2877399127740D+13   R2 =   0.1809376482322D-05
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2878154377683D+13   R2 =   0.8842016757373D-06
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2878684424888D+13   R2 =   0.1647068887641D-06
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2878689690995D+13   R2 =   0.8929703964512D-06
     ISTATE -5 - shortening step at time   91026.297399161049      years


     At T(=R1) and step size H(=R2), the                                             
     corrector convergence failed repeatedly                                         
     or with ABS(H) = HMIN.                                                          
    In the above message, R1 =   0.2878692803178D+13   R2 =   0.2969126554774D-06
     ISTATE -5 - shortening step at time   91026.297399161049      years


    [Parallel(n_jobs=4)]: Done   9 out of   9 | elapsed: 11.2min finished



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
      <td>9.032445e-11</td>
      <td>1.091258e-13</td>
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
      <td>1.384773e-07</td>
      <td>2.509764e-11</td>
      <td>6.096345e-12</td>
    </tr>
    <tr>
      <th>4</th>
      <td>30.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/30.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>3.111801e-24</td>
      <td>3.403524e-22</td>
      <td>3.227464e-22</td>
    </tr>
    <tr>
      <th>5</th>
      <td>50.0</td>
      <td>100000.0</td>
      <td>../grid_folder/shocks/50.0_100000.0.csv</td>
      <td>0.0</td>
      <td>117.189873</td>
      <td>1.000000e-30</td>
      <td>2.551212e-20</td>
      <td>1.000000e-30</td>
    </tr>
    <tr>
      <th>6</th>
      <td>10.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/10.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>3.586509e-27</td>
      <td>2.642741e-23</td>
      <td>5.058576e-23</td>
    </tr>
    <tr>
      <th>7</th>
      <td>30.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/30.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>1.987197e-28</td>
      <td>1.012091e-22</td>
      <td>1.022088e-22</td>
    </tr>
    <tr>
      <th>8</th>
      <td>50.0</td>
      <td>1000000.0</td>
      <td>../grid_folder/shocks/50.0_1000000.0.csv</td>
      <td>0.0</td>
      <td>11.718987</td>
      <td>1.000000e-30</td>
      <td>1.268891e-22</td>
      <td>7.052166e-23</td>
    </tr>
  </tbody>
</table>
</div>



## Summary

There are many ways to run grids of models and users will naturally develop their own methods. This notebook is just a simple example of how to run UCLCHEM for many parameter combinations whilst producing a useful output (the model_table) to keep track of all the combinations that were run. In a real script, we'd save the model file to csv at the end.

For much larger grids, it's recommended that you find a way to make your script robust to failure. Over a huge range of parameters, it is quite likely UCLCHEM will hit integration trouble for at least a few parameter combinations. Very occasionally, UCLCHEM will get caught in a loop where it fails to integrate and cannot adjust its strategy to manage it. This isn't a problem for small grids as the model can be stopped and the tolerances adjusted. However, for very large grids, you may end up locking all threads as they each get stuck on a different model. The best solution we've found for this case is to add a check so that models in your dataframe are skipped if their file already exists, this allows you to stop and restart the grid script as needed.



