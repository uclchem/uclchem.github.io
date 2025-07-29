# Advanced Physical Modelling in Memory

In the previous tutorial, we simply modelled the chemistry of a static cloud for 1 Myr. This is unlikely to meet everybody's modelling needs and UCLCHEM is capable of modelling much more complex environments such as hot cores and shocks. In this tutorial, we model both a hot core and a shock to explore how these models work and to demonstrate the workflow that the UCLCHEM team normally follow.


```python
import uclchem
import matplotlib.pyplot as plt
import pandas as pd
```

## The Hot Core

### Initial Conditions (Stage 1)
UCLCHEM typically starts with the gas in atomic/ionic form with no molecules. However, this clearly is not appropriate when modelling an object such as a hot core. In these objects, the gas is already evolved and there should be molecules in the gas phase as well as ice mantles on the dust. To allow for this, one must provide some initial abundances to the model. There are many ways to do this but we typically chose to run a preliminary model to produce our abundances. In many UCLCHEM papers, we refer to the preliminary model as *stage 1* and the science model as *stage 2*. Stage 1 simply models a collapsing cloud and stage 2 models the object in question.

To do this, we will use `uclchem.model.cloud()` to run a model where a cloud of gas collapses from a density of $10^2 cm^\{-3\}$ to our hot core density of $10^6 cm^\{-3\}$, keeping all other parameters constant. During this collapse, chemistry will occur and we can assume the final abundances of this model will be reasonable starting abundances for the hot core.


```python
# set a parameter dictionary for cloud collapse model
param_dict = \{
    "endAtFinalDensity": False,  # stop at finalTime
    "freefall": True,  # increase density in freefall
    "initialDens": 1e2,  # starting density
    "finalDens": 1e6,  # final density
    "initialTemp": 10.0,  # temperature of gas
    "finalTime": 6.0e6,  # final time
    "rout": 0.1,  # radius of cloud in pc
    "baseAv": 1.0,  # visual extinction at cloud edge.
\}
df_stage1_physics, df_stage1_chemistry, df_stage1_rates, final_abundances, result = (
    uclchem.model.cloud(
        param_dict=param_dict,
        return_dataframe=True,
    )
)
```


```python
df_stage1_chemistry
```




<div>
<table border="1" class="dataframe">
  <thead>
<tr>
      <th></th>
      <th>H</th>
      <th>H+</th>
      <th>H2</th>
      <th>H2+</th>
      <th>H3+</th>
      <th>HE</th>
      <th>HE+</th>
      <th>HEH+</th>
      <th>C</th>
      <th>C+</th>
      <th>...</th>
      <th>@OCS</th>
      <th>@C4N</th>
      <th>@SIC3</th>
      <th>@SO2</th>
      <th>@S2</th>
      <th>@HS2</th>
      <th>@H2S2</th>
      <th>E-</th>
      <th>BULK</th>
      <th>SURFACE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>5.000000e-01</td>
      <td>1.000000e-30</td>
      <td>0.250000</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>0.1</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-10</td>
      <td>1.770000e-04</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.823239e-04</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
    </tr>
    <tr>
      <th>1</th>
      <td>5.000000e-01</td>
      <td>9.674341e-18</td>
      <td>0.250000</td>
      <td>9.479999e-18</td>
      <td>7.833581e-25</td>
      <td>0.1</td>
      <td>2.054000e-18</td>
      <td>1.958493e-26</td>
      <td>1.000016e-10</td>
      <td>1.770000e-04</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.823239e-04</td>
      <td>8.300000e-29</td>
      <td>8.300000e-29</td>
    </tr>
    <tr>
      <th>2</th>
      <td>5.000000e-01</td>
      <td>9.674345e-17</td>
      <td>0.250000</td>
      <td>9.479987e-17</td>
      <td>7.825021e-23</td>
      <td>0.1</td>
      <td>2.054000e-17</td>
      <td>1.956255e-24</td>
      <td>1.000155e-10</td>
      <td>1.770000e-04</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.823239e-04</td>
      <td>8.300000e-29</td>
      <td>8.300000e-29</td>
    </tr>
    <tr>
      <th>3</th>
      <td>5.000000e-01</td>
      <td>9.674388e-16</td>
      <td>0.250000</td>
      <td>9.479870e-16</td>
      <td>7.797077e-21</td>
      <td>0.1</td>
      <td>2.054000e-16</td>
      <td>1.949251e-22</td>
      <td>1.001555e-10</td>
      <td>1.770000e-04</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.823239e-04</td>
      <td>8.300000e-29</td>
      <td>8.300000e-29</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.000000e-01</td>
      <td>9.674822e-15</td>
      <td>0.250000</td>
      <td>9.478701e-15</td>
      <td>7.795796e-19</td>
      <td>0.1</td>
      <td>2.054000e-15</td>
      <td>1.948787e-20</td>
      <td>1.015549e-10</td>
      <td>1.770000e-04</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.823239e-04</td>
      <td>8.300000e-29</td>
      <td>8.300000e-29</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>92</th>
      <td>2.552262e-07</td>
      <td>1.506881e-12</td>
      <td>0.499996</td>
      <td>5.700599e-15</td>
      <td>6.005388e-12</td>
      <td>0.1</td>
      <td>1.534813e-12</td>
      <td>9.881172e-17</td>
      <td>3.542648e-09</td>
      <td>1.121326e-11</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.591269e-09</td>
      <td>2.606870e-28</td>
      <td>2.607803e-28</td>
    </tr>
    <tr>
      <th>93</th>
      <td>2.491771e-07</td>
      <td>1.434491e-12</td>
      <td>0.499997</td>
      <td>5.701051e-15</td>
      <td>6.397545e-12</td>
      <td>0.1</td>
      <td>1.609005e-12</td>
      <td>9.881938e-17</td>
      <td>1.174639e-09</td>
      <td>1.133862e-11</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.594333e-09</td>
      <td>2.615662e-28</td>
      <td>2.616603e-28</td>
    </tr>
    <tr>
      <th>94</th>
      <td>2.461575e-07</td>
      <td>1.353429e-12</td>
      <td>0.499998</td>
      <td>5.701259e-15</td>
      <td>6.622630e-12</td>
      <td>0.1</td>
      <td>1.640496e-12</td>
      <td>9.882288e-17</td>
      <td>6.080600e-10</td>
      <td>1.064829e-11</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.598987e-09</td>
      <td>2.624457e-28</td>
      <td>2.625406e-28</td>
    </tr>
    <tr>
      <th>95</th>
      <td>2.446959e-07</td>
      <td>1.277244e-12</td>
      <td>0.499998</td>
      <td>5.701335e-15</td>
      <td>6.750621e-12</td>
      <td>0.1</td>
      <td>1.648455e-12</td>
      <td>9.882412e-17</td>
      <td>3.919558e-10</td>
      <td>9.772644e-12</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.603440e-09</td>
      <td>2.633255e-28</td>
      <td>2.634211e-28</td>
    </tr>
    <tr>
      <th>96</th>
      <td>2.439868e-07</td>
      <td>1.209482e-12</td>
      <td>0.499998</td>
      <td>5.701348e-15</td>
      <td>6.829870e-12</td>
      <td>0.1</td>
      <td>1.645456e-12</td>
      <td>9.882430e-17</td>
      <td>2.858430e-10</td>
      <td>8.949264e-12</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.607173e-09</td>
      <td>2.642056e-28</td>
      <td>2.643020e-28</td>
    </tr>
  </tbody>
</table>
<p>97 rows × 335 columns</p>
</div>



With that done, we now have a file containing the final abundances of a cloud of gas after this collapse: `param_dict["abundSaveFile"]` we can pass this to our hot core model to use those abundances as our initial abundances.

### Running the Science Model (Stage 2)

We need to change just a few things in `param_dict` to set up the hot core model. The key one is that UCLCHEM saves final abundances to `abundSaveFile` but loads them from `abundLoadFile` so we need to swap that key over to make the abundances we just produced our initial abundances.

We also want to turn off freefall and change how long the model runs for.



```python
# change other bits of input to set up stage 2
param_dict["initialDens"] = 1e6
param_dict["finalTime"] = 1e6
param_dict["freefall"] = False

# freeze out is completely overwhelmed by thermal desorption
# so turning it off has no effect on abundances but speeds up integrator.
param_dict["freezeFactor"] = 0.0

# param_dict["abstol_factor"]=1e-18
# param_dict["reltol"]=1e-12

df_stage2_physics, df_stage2_chemistry, df_stage2_rates, final_abundances, result = (
    uclchem.model.hot_core(
        temp_indx=3,
        max_temperature=300.0,
        param_dict=param_dict,
        return_dataframe=True,
        starting_chemistry=final_abundances,
    )
)
```


```python
df_stage2 = pd.concat((df_stage2_physics, df_stage2_chemistry), axis=1)
```


```python
df_stage2
```




<div>
<table border="1" class="dataframe">
  <thead>
<tr>
      <th></th>
      <th>Time</th>
      <th>Density</th>
      <th>gasTemp</th>
      <th>dustTemp</th>
      <th>Av</th>
      <th>radfield</th>
      <th>zeta</th>
      <th>dstep</th>
      <th>H</th>
      <th>H+</th>
      <th>...</th>
      <th>@OCS</th>
      <th>@C4N</th>
      <th>@SIC3</th>
      <th>@SO2</th>
      <th>@S2</th>
      <th>@HS2</th>
      <th>@H2S2</th>
      <th>E-</th>
      <th>BULK</th>
      <th>SURFACE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.000000e+00</td>
      <td>1000000.0</td>
      <td>10.000000</td>
      <td>10.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.439868e-07</td>
      <td>1.209482e-12</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.607173e-09</td>
      <td>2.642056e-28</td>
      <td>2.643020e-28</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1.000000e-07</td>
      <td>1000000.0</td>
      <td>10.000000</td>
      <td>10.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.439868e-07</td>
      <td>1.209482e-12</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.607173e-09</td>
      <td>2.646507e-28</td>
      <td>2.647474e-28</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1.000000e-06</td>
      <td>1000000.0</td>
      <td>10.000000</td>
      <td>10.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.439868e-07</td>
      <td>1.209482e-12</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.607173e-09</td>
      <td>2.646507e-28</td>
      <td>2.647474e-28</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.000000e-05</td>
      <td>1000000.0</td>
      <td>10.000000</td>
      <td>10.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.439868e-07</td>
      <td>1.209482e-12</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.607173e-09</td>
      <td>2.646507e-28</td>
      <td>2.647474e-28</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.000000e-04</td>
      <td>1000000.0</td>
      <td>10.000003</td>
      <td>10.000003</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.439868e-07</td>
      <td>1.209482e-12</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.607173e-09</td>
      <td>2.646507e-28</td>
      <td>2.647474e-28</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>278</th>
      <td>9.600100e+05</td>
      <td>1000000.0</td>
      <td>300.000000</td>
      <td>300.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.427394e-06</td>
      <td>1.822359e-13</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>4.567469e-09</td>
      <td>2.733846e-28</td>
      <td>2.734887e-28</td>
    </tr>
    <tr>
      <th>279</th>
      <td>9.700100e+05</td>
      <td>1000000.0</td>
      <td>300.000000</td>
      <td>300.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.416495e-06</td>
      <td>1.819440e-13</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>4.576095e-09</td>
      <td>2.734762e-28</td>
      <td>2.735803e-28</td>
    </tr>
    <tr>
      <th>280</th>
      <td>9.800100e+05</td>
      <td>1000000.0</td>
      <td>300.000000</td>
      <td>300.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.408369e-06</td>
      <td>1.815865e-13</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>4.593993e-09</td>
      <td>2.735677e-28</td>
      <td>2.736720e-28</td>
    </tr>
    <tr>
      <th>281</th>
      <td>9.900100e+05</td>
      <td>1000000.0</td>
      <td>300.000000</td>
      <td>300.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.408703e-06</td>
      <td>1.812794e-13</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>4.607825e-09</td>
      <td>2.736593e-28</td>
      <td>2.737636e-28</td>
    </tr>
    <tr>
      <th>282</th>
      <td>1.000010e+06</td>
      <td>1000000.0</td>
      <td>300.000000</td>
      <td>300.000000</td>
      <td>193.875</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.414278e-06</td>
      <td>1.810399e-13</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>4.615350e-09</td>
      <td>2.737509e-28</td>
      <td>2.738553e-28</td>
    </tr>
  </tbody>
</table>
<p>283 rows × 343 columns</p>
</div>



Note that we've changed made two changes to the parameters here which aren't strictly necessary but can be helpful in certain situations.

Since the gas temperature increases throughout a hot core model, freeze out is much slower than thermal desorption for all but the first few time steps. Turning it off doesn't affect the abundances but will speed up the solution.

We also change abstol and reltol here, largely to demonstrate their use. They control the integrator accuracy and whilst making them smaller does slow down successful runs, it can make runs complete that stall completely otherwise or give correct solutions where lower tolerances allow issues like element conservation failure to sneak in. If your code does not complete or element conservation fails, you can change them.

### Checking the Result
With a successful run, we can check the output. We first load the file and check the abundance conservation, then we can plot it up.


```python
uclchem.analysis.check_element_conservation(df_stage2)
```




    \{'H': '0.000%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%'\}




```python
df_stage2.iloc[0]
```




    Time        0.000000e+00
    Density     1.000000e+06
    gasTemp     1.000000e+01
    dustTemp    1.000000e+01
    Av          1.938750e+02
                    ...     
    @HS2        1.000000e-30
    @H2S2       1.000000e-30
    E-          1.607173e-09
    BULK        2.642056e-28
    SURFACE     2.643020e-28
    Name: 0, Length: 343, dtype: float64




```python
species = ["CO", "H2O", "CH3OH", "#CO", "#H2O", "#CH3OH", "@H2O", "@CO", "@CH3OH"]
fig, [ax, ax2] = plt.subplots(1, 2, figsize=(16, 9))
ax = uclchem.analysis.plot_species(ax, df_stage2, species)
settings = ax.set(
    yscale="log",
    xlim=(1e2, 1e6),
    ylim=(1e-10, 1e-2),
    xlabel="Time / years",
    ylabel="Fractional Abundance",
    xscale="log",
)

ax2.plot(df_stage2["Time"], df_stage2["Density"], color="black")
ax2.set(xscale="log")
ax3 = ax2.twinx()
ax3.plot(df_stage2["Time"], df_stage2["gasTemp"], color="red")
ax2.set(xlabel="Time / year", ylabel="Density")
ax3.set(ylabel="Temperature", facecolor="red", xlim=(1e2, 1e6))
ax3.tick_params(axis="y", colors="red")
```


    
![png](./assets/2b_modelling_objects_in_memory_12_0.png)
    


Here, we see the value of running a collapse stage before the science run. Having run a collapse, we start this model with well developed ices and having material in the surface and bulk allows us to properly model the effect of warm up in a hot core. For example, the @CO abundance is $\sim10^\{-4\}$ and #CO is $\sim10^\{-6\}$. As the gas warms to around 30K, the #CO abundance drops drastically as CO's binding energy is such that it is efficiently desorbed from the surface at this temperature. However, the rest of the CO is trapped in the bulk, surrounded by more strongly bound H2O molecules. Thus, the @CO abundance stays high until the gas reaches around 130K, when the H2O molecules are released along with the entire bulk.

## Shocks

Essentially the same process should be followed for shocks. Let's run a C-type and J-type shock through a gas of density $10^4 cm^\{-3\}$. Again, we first run a simple cloud model to obtain some reasonable starting abundances, then we can run the shocks.


```python
# set a parameter dictionary for stage 1 collapse model

param_dict = \{
    "endAtFinalDensity": False,  # stop at finalTime
    "freefall": True,  # increase density in freefall
    "initialDens": 1e2,  # starting density
    "finalDens": 1e4,  # final density
    "initialTemp": 10.0,  # temperature of gas
    "finalTime": 6.0e6,  # final time
    "rout": 0.1,  # radius of cloud in pc
    "baseAv": 1.0,  # visual extinction at cloud edge.
    # "abundSaveFile": "../examples/test-output/shockstart.dat",
\}
df_stage1_physics, df_stage1_chemistry, df_stage1_rates, final_abundances, result = (
    uclchem.model.cloud(
        param_dict=param_dict,
        return_dataframe=True,
    )
)
```

### C-shock

We'll first run a c-shock. We'll run a 40 km s $^\{-1\}$ shock through a gas of density $10^4$ cm $^\{-3\}$, using the abundances we just produced. Note that c-shock is the only model which returns an additional output in its result list. Not only is the first element the success flag indicating whether UCLCHEM completed, the second element is the dissipation time of the shock. We'll use that time to make our plots look nicer, cutting to a reasonable time. You can also obtain it from `uclchem.utils.cshock_dissipation_time()`.


```python
# change other bits of input to set up phase 2
param_dict["initialDens"] = 1e4
param_dict["finalTime"] = 1e6
if "abundSaveFile" in param_dict:
    param_dict.pop("abundSaveFile")
# param_dict["abundLoadFile"]="../examples/test-output/shockstart.dat"
# param_dict["outputFile"]="../examples/test-output/cshock.dat"


(
    df_stage2_physics,
    df_stage2_chemistry,
    df_stage2_rates,
    dissipation_time,
    _,
    result,
) = uclchem.model.cshock(
    shock_vel=40,
    param_dict=param_dict,
    return_dataframe=True,
    starting_chemistry=final_abundances,
)
# result,dissipation_time=result
```

     Cannot have freefall on during cshock
     setting freefall=0 and continuing


The code completes fine. We do get a couple of warnings though. First, we're informed that `freefall` must be set to False for the C-shock model. Then we get a few integrator warnings. These are not important and can be ignored as long as the element conservation looks ok. However, it is an indication that the integrator did struggle with these ODEs under these conditions.


```python
df_stage2 = pd.concat((df_stage2_physics, df_stage2_chemistry), axis=1)
uclchem.analysis.check_element_conservation(df_stage2)
```




    \{'H': '0.000%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%'\}




```python
# df_stage2.rename(columns=\{"age":"Time", "density":"Density"\}, inplace=True)
```


```python
species = ["CO", "H2O", "CH3OH", "NH3", "$CO", "$H2O", "$CH3OH", "$NH3"]

fig, [ax, ax2] = plt.subplots(1, 2, figsize=(16, 9))
ax = uclchem.analysis.plot_species(ax, df_stage2, species)
settings = ax.set(
    yscale="log",
    xlim=(1, 20 * dissipation_time),
    ylim=(1e-10, 1e-2),
    xlabel="Time / years",
    ylabel="Fractional Abundance",
    xscale="log",
)

ax2.plot(df_stage2["Time"], df_stage2["Density"], color="black")
ax2.set(xscale="log")
ax3 = ax2.twinx()
ax3.plot(df_stage2["Time"], df_stage2["gasTemp"], color="red")
ax2.set(xlabel="Time / year", ylabel="Density")
ax3.set(ylabel="Temperature", facecolor="red", xlim=(1, 20 * dissipation_time))
ax3.tick_params(axis="y", colors="red")
```


    
![png](./assets/2b_modelling_objects_in_memory_21_0.png)
    


### J-shock
Running a j-shock is a simple case of changing function. We'll run a 10 km s $^\{-1\}$ shock through a gas of density $10^3$ cm $^\{-3\}$ gas this time. Note that nothing stops us using the intial abundances we produced for the c-shock. UCLCHEM will not check that the initial density matches the density of the `abundLoadFile`. It may not always be a good idea to do this but we should remember the intial abundances really are just a rough approximation.

By default UCLCHEM uses 500 timepoints for a model, but this turns out not be enough, which is why we increase the number of timepoints to 1500.


```python
# TODO: maybe add a function/method to adjust the number of timepoints in UCLCHEM WITHOUT restarting the kernel

param_dict["initialDens"] = 1e3
param_dict["freefall"] = False  # lets remember to turn it off this time
param_dict["reltol"] = 1e-12

shock_vel = 10.0
df_jshock_physics, df_jshock_chemistry, df_jshock_rates, final_abundances, result = (
    uclchem.model.jshock(
        shock_vel=shock_vel,
        param_dict=param_dict,
        return_dataframe=True,
        starting_chemistry=final_abundances,
        timepoints=1500,
    )
)
```

This time, we've turned off the freefall option and made reltol a little more stringent. The j-shock ends up running a bit slower but we get no warnings on this run.


```python
df_jshock = pd.concat((df_jshock_physics, df_jshock_chemistry), axis=1)
# df_jshock.rename(columns=\{"age":"Time", "density":"Density"\}, inplace=True)
uclchem.analysis.check_element_conservation(df_jshock)
```




    \{'H': '0.000%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%'\}




```python
df_jshock.shape
```




    (1317, 343)




```python
species = ["CO", "H2O", "CH3OH", "NH3", "$CO", "$H2O", "$CH3OH", "$NH3"]

fig, [ax, ax2] = plt.subplots(1, 2, figsize=(16, 9))
ax = uclchem.analysis.plot_species(ax, df_jshock, species)
settings = ax.set(
    yscale="log",
    xlim=(1e-7, 1e6),
    ylim=(1e-10, 1e-2),
    xlabel="Time / years",
    ylabel="Fractional Abundance",
    xscale="log",
)

ax2.plot(df_jshock["Time"], df_jshock["Density"], color="black")
ax2.set(xscale="log", yscale="log")
ax3 = ax2.twinx()
ax3.plot(df_jshock["Time"], df_jshock["gasTemp"], color="red")
ax2.set(xlabel="Time / year", ylabel="Density")
ax3.set(ylabel="Temperature", facecolor="red", xlim=(1e-7, 1e6))
ax3.tick_params(axis="y", colors="red")
```


    
![png](./assets/2b_modelling_objects_in_memory_27_0.png)
    


That's everything! We've run various science models using reasonable starting abundances that we produced by running a simple UCLCHEM model beforehand. One benefit of this method is that the abundances are consistent with the network. If we start with arbitrary, perhaps observationally motivated, abundances, it would be possible to initiate the model in a state our network could never produce.

However, one should be aware of the limitations of this method. A freefall collapse from low density to high is not really how a molecular cloud forms and so the abundances are only approximately similar to values they'd truly have in a real cloud. Testing whether your results are sensitive to things like the time you run the preliminary for or the exact density is a good way to make sure these approximations are not problematic.

Bear in mind that you can use `abundSaveFile` and `abundLoadFile` in the same model run. This lets you chain model runs together. For example, you could run a c-shock from a cloud model as we did here and then a j-shock with the c-shock's abundances as the initial abundances.
