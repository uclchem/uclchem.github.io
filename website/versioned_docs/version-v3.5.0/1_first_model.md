# Running Your First Models

In this notebook, we demonstrate the basic use of UCLCHEM's python module by running a simple model and then using the analysis functions to examine the output. Otherwise, it is identical to notebook 3.


```python
import uclchem
import os
```

## A Simple Cloud

UCLCHEM's `cloud()` model is a spherical cloud of isothermal gas. We can keep a constant density or have it increase over time following a freefall equation. This model is generally useful whenever you want to model a homogeneous cloud of gas under constant conditions. For example, in the inner parts of a molecular cloud where Av $\gtrsim$ 10 there are very few depth dependent processes. You may wish to model the whole of this UV shielded portion of the cloud with a single `cloud()` model.

Due to the large number of parameters in a chemical model and the way fortran and python interaction, we find it is easiest to do parameter input through python dictionaries. In this block, we define param_dict which contains the parameters we wish to modify for this run. Every `uclchem.model` function accepts a dictionary as an optional argument. Every parameter has a default value which is overriden if that parameter is specified in this dictionary. You can find a complete list of modifiable parameters and their default values in [our parameter docs](/docs/parameters).



```python
# set a parameter dictionary for phase 1 collapse model

out_species = ["SO", "CO"]
param_dict = \{
    "endAtFinalDensity": False,  # stop at finalTime
    "freefall": False,  # don't increase density in freefall
    "initialDens": 1e4,  # starting density
    "initialTemp": 10.0,  # temperature of gas
    "finalTime": 1.0e6,  # final time
    "rout": 0.1,  # radius of cloud in pc
    "baseAv": 1.0,  # visual extinction at cloud edge.
    "outputFile": "../examples/test-output/static-full.dat",  # full UCLCHEM output
    "abundSaveFile": "../examples/test-output/startstatic.dat",  # save final abundances to file
\}
# Ensure the output directory is present:
if not os.path.exists("../examples/test-output/"):
    os.makedirs("../examples/test-output/")

result = uclchem.model.cloud(param_dict=param_dict, out_species=out_species)
print(result)
```

    [0, np.float64(2.7465832683420677e-08), np.float64(2.4149582241649898e-05)]


## Checking the output

At the end of the previous cell, we printed `result` which is a list returned by every UCLCHEM model function. The first element is always an integer which will be positive if the code completed and negative otherwise. You can send negative values to `uclchem.utils.check_error()` to get a more detailed error message.

The subsequent elements are the final abundances of any species listed in `out_species`, in this case we have the abundance of SO and CO. This is useful when we want to use UCLCHEM as part of something like an MCMC procedure, obtaining abundances for given parameters. However, we also write the final abundances of all species to `abundSaveFile` and the abundances of all species at every time step in `outputFile` so it is not necessary to acquire abundances in this way.

The output file is just a simple csv with some header rows, UCLCHEM has a utility function to read that file into a pandas dataframe. Let's load it up and look at it.




```python
result_df = uclchem.analysis.read_output_file("../examples/test-output/static-full.dat")
result_df.head()
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
      <th>point</th>
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
      <td>10000.0</td>
      <td>10.0</td>
      <td>10.0</td>
      <td>2.9287</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1</td>
      <td>0.5</td>
      <td>1.000000e-30</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>0.000182</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1.000000e-07</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>10.0</td>
      <td>2.9287</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1</td>
      <td>0.5</td>
      <td>9.674390e-18</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>0.000182</td>
      <td>5.613430e-20</td>
      <td>7.478490e-13</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1.000000e-06</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>10.0</td>
      <td>2.9287</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1</td>
      <td>0.5</td>
      <td>9.674820e-17</td>
      <td>...</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>1.000000e-30</td>
      <td>0.000182</td>
      <td>5.546840e-18</td>
      <td>7.434010e-12</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.000000e-05</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>10.0</td>
      <td>2.9287</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1</td>
      <td>0.5</td>
      <td>9.679150e-16</td>
      <td>...</td>
      <td>1.000010e-30</td>
      <td>1.000010e-30</td>
      <td>1.000010e-30</td>
      <td>1.000010e-30</td>
      <td>1.000010e-30</td>
      <td>1.000010e-30</td>
      <td>1.000010e-30</td>
      <td>0.000182</td>
      <td>5.538880e-16</td>
      <td>7.428630e-11</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.000000e-04</td>
      <td>10000.0</td>
      <td>10.0</td>
      <td>10.0</td>
      <td>2.9287</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1</td>
      <td>0.5</td>
      <td>9.722060e-15</td>
      <td>...</td>
      <td>1.000150e-30</td>
      <td>1.000150e-30</td>
      <td>1.000150e-30</td>
      <td>1.000150e-30</td>
      <td>1.000150e-30</td>
      <td>1.000150e-30</td>
      <td>1.000150e-30</td>
      <td>0.000182</td>
      <td>5.418340e-14</td>
      <td>7.347030e-10</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 343 columns</p>
</div>



We can also test whether the model run went well by checking for element conservation. We do this because integrator errors often show up as a failure to conserve elemental abundances.

We can use `check_element_conservation()` to test whether we conserve elements in this run. This function returns a dictionary where each entry gives the change in the total abundance of an element as a percentage of the original abundance. In an ideal case, these values are 0\% indicating the total abundance at the end of the model is exactly the same as the total at the start.

Changes of less than 1\% are fine for many cases but if they are too high, you could consider changing the `reltol` and `abstol` parameters that control the integrator accuracy. They are error tolerance so smaller values lead to smaller errors and (usually) longer integration times. The default values were chosen by running a large grid of models and choosing the tolerances with the lowest average run time from those that conserved elements well and rarely failed. Despite this, there are no one-size-fits-all perfect tolerances and you may run into issues with different networks or models.


```python
conservation = uclchem.analysis.check_element_conservation(
    result_df, element_list=["H", "N", "C", "O", "S"]
)
print("Percentage change in total abundances:")
print(conservation)
```

    Percentage change in total abundances:
    \{'H': '0.000%', 'N': '0.000%', 'C': '0.000%', 'O': '0.000%', 'S': '0.000%'\}


## Plotting Results
Finally, you will want to plot your results. This can be done with any plotting library but UCLCHEM does provide a few functions to make quick plots. Note the use of $ symbols in the species list below, this gets the total ice abundance of a species. For two phase models, this is just the surface abudance but for three phase it is the sum of surface and bulk.


```python
species = ["H", "H2", "$H", "$H2", "H2O", "$H2O", "CO", "$CO", "$CH3OH", "CH3OH"]
fig, ax = uclchem.analysis.create_abundance_plot(result_df, species, figsize=(10, 7))
ax = ax.set(xscale="log", ylim=(1e-15, 1), xlim=(1e3, 1e6))
```


    
![png](./assets/1_first_model_9_0.png)
    


and that's it! You've run your first UCLCHEM model, checked that the element conservation is correct, and plotted the abundances.
