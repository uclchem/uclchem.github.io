---
id: pythonapi
title: Python Reference
---
# Python API

* [uclchem](#uclchem)
* [uclchem.model](#uclchem.model)
  * [cloud](#uclchem.model.cloud)
  * [collapse](#uclchem.model.collapse)
  * [hot\_core](#uclchem.model.hot_core)
  * [cshock](#uclchem.model.cshock)
  * [jshock](#uclchem.model.jshock)
* [uclchem.\_\_version\_\_](#uclchem.__version__)
* [uclchem.utils](#uclchem.utils)
  * [cshock\_dissipation\_time](#uclchem.utils.cshock_dissipation_time)
  * [check\_error](#uclchem.utils.check_error)
  * [get\_species\_table](#uclchem.utils.get_species_table)
  * [get\_reaction\_table](#uclchem.utils.get_reaction_table)
* [uclchem.analysis](#uclchem.analysis)
  * [read\_output\_file](#uclchem.analysis.read_output_file)
  * [create\_abundance\_plot](#uclchem.analysis.create_abundance_plot)
  * [plot\_species](#uclchem.analysis.plot_species)
  * [analysis](#uclchem.analysis.analysis)
  * [total\_element\_abundance](#uclchem.analysis.total_element_abundance)
  * [check\_element\_conservation](#uclchem.analysis.check_element_conservation)
* [uclchem.tests](#uclchem.tests)
  * [test\_ode\_conservation](#uclchem.tests.test_ode_conservation)

<a id="uclchem"></a>

# uclchem

The UCLCHEM python module is divided into three parts.
`model` contains the functions for running chemical models under different physics.
`analysis` contains functions for reading and plotting output files as well as investigating the chemistry.
`tests` contains functions for testing the code.

<a id="uclchem.model"></a>

# uclchem.model

<a id="uclchem.model.cloud"></a>

#### cloud

```python
def cloud(param_dict=None, out_species=None)
```

Run cloud model from UCLCHEM

**Arguments**:

- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
  

**Returns**:

  A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the `out_species` parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species.

<a id="uclchem.model.collapse"></a>

#### collapse

```python
def collapse(collapse, physics_output, param_dict=None, out_species=None)
```

Run collapse model from UCLCHEM based on Priestley et al 2018 AJ 156 51 (https://ui.adsabs.harvard.edu/abs/2018AJ....156...51P/abstract)

**Arguments**:

- `collapse` _str_ - A string containing the collapse type, options are 'BE1.1', 'BE4', 'filament', or 'ambipolar'
- `physics_output(str)` - Filename to store physics output, only relevant for 'filament' and 'ambipolar' collapses. If None, no physics output will be saved.
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
  

**Returns**:

  A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the `out_species` parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species.

<a id="uclchem.model.hot_core"></a>

#### hot\_core

```python
def hot_core(temp_indx, max_temperature, param_dict=None, out_species=None)
```

Run hot core model from UCLCHEM, based on Viti et al. 2004 and Collings et al. 2004

**Arguments**:

- `temp_indx` _int_ - Used to select the mass of hot core. 1=1Msun,2=5, 3=10, 4=15, 5=25,6=60]
- `max_temperature` _float_ - Value at which gas temperature will stop increasing.
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
  

**Returns**:

  A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the `out_species` parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species.

<a id="uclchem.model.cshock"></a>

#### cshock

```python
def cshock(shock_vel, timestep_factor=0.01, minimum_temperature=0.0, param_dict=None, out_species=None)
```

Run C-type shock model from UCLCHEM

**Arguments**:

- `shock_vel` _float_ - Velocity of the shock in km/s
- `timestep_factor` _float, optional_ - Whilst the time is less than 2 times the dissipation time of shock, timestep is timestep_factor*dissipation time. Essentially controls
  how well resolved the shock is in your model. Defaults to 0.01.
- `minimum_temperature` _float, optional_ - Minimum post-shock temperature. Defaults to 0.0 (no minimum). The shocked gas typically cools to `initialTemp` if this is not set.
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.

**Returns**:

  A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the model succeeded, the second element is the dissipation time and further elements are the abundances of all species in `out_species`.

<a id="uclchem.model.jshock"></a>

#### jshock

```python
def jshock(shock_vel, param_dict=None, out_species=None)
```

Run J-type shock model from UCLCHEM

**Arguments**:

- `shock_vel` _float_ - Velocity of the shock
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.

**Returns**:

  A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the model succeeded, the second element is the dissipation time and further elements are the abundances of all species in `out_species`.

<a id="uclchem.__version__"></a>

# uclchem.\_\_version\_\_

<a id="uclchem.utils"></a>

# uclchem.utils

<a id="uclchem.utils.cshock_dissipation_time"></a>

#### cshock\_dissipation\_time

```python
def cshock_dissipation_time(shock_vel, initial_dens)
```

A simple function used to calculate the dissipation time of a C-type shock.
Use to obtain a useful timescale for your C-shock model runs. Velocity of
ions and neutrals equalizes at dissipation time and full cooling takes a few dissipation times.

**Arguments**:

- `shock_vel` _float_ - Velocity of the shock in km/s
- `initial_dens` _float_ - Preshock density of the gas in cm$^{-3}$
  

**Returns**:

- `float` - The dissipation time of the shock in years

<a id="uclchem.utils.check_error"></a>

#### check\_error

```python
def check_error(error_code)
```

Converts the UCLCHEM integer result flag to a simple messaging explaining what went wrong"

**Arguments**:

- `error_code` _int_ - Error code returned by UCLCHEM models, the first element of the results list.
  

**Returns**:

- `str` - Error message

<a id="uclchem.utils.get_species_table"></a>

#### get\_species\_table

```python
def get_species_table()
```

A simple function to load the list of species in the UCLCHEM network into a pandas dataframe.

**Returns**:

- `pandas.DataFrame` - A dataframe containing the species names and their details

<a id="uclchem.utils.get_reaction_table"></a>

#### get\_reaction\_table

```python
def get_reaction_table()
```

A function to load the reaction table from the UCLCHEM network into a pandas dataframe.

**Returns**:

- `pandas.DataFrame` - A dataframe containing the reactions and their rates

<a id="uclchem.analysis"></a>

# uclchem.analysis

<a id="uclchem.analysis.read_output_file"></a>

#### read\_output\_file

```python
def read_output_file(output_file)
```

Read the output of a UCLCHEM run created with the outputFile parameter into a pandas DataFrame

**Arguments**:

- `output_file` _str_ - path to file containing a full UCLCHEM output
  

**Returns**:

- `pandas.DataFrame` - A dataframe containing the abundances and physical parameters of the model at every time step.

<a id="uclchem.analysis.create_abundance_plot"></a>

#### create\_abundance\_plot

```python
def create_abundance_plot(df, species, figsize=(16, 9), plot_file=None)
```

Create a plot of the abundance of a species through time.

**Arguments**:

- `df` _pd.DataFrame_ - Pandas dataframe containing the UCLCHEM output, see `read_output_file`
- `species` _list_ - list of strings containing species names
- `figsize` _tuple, optional_ - Size of figure, width by height in inches. Defaults to (16, 9).
- `plot_file` _str, optional_ - Path to file where figure will be saved. If None, figure is not saved. Defaults to None.
  

**Returns**:

- `fig,ax` - matplotlib figure and axis objects

<a id="uclchem.analysis.plot_species"></a>

#### plot\_species

```python
def plot_species(ax, df, species)
```

Plot the abundance of species through time directly onto an axis

**Arguments**:

- `ax` _pyplot.axis_ - An axis object to plot on
- `df` _pd.DataFrame_ - A dataframe created by `read_output_file`
- `species` _str_ - A list of species names to be plotted. If species name starts with "$", plots the sum of surface and bulk abundances
  

**Returns**:

- `pyplot.axis` - Modified input axis is returned

<a id="uclchem.analysis.analysis"></a>

#### analysis

```python
def analysis(species_name, result_file, output_file, rate_threshold=0.99)
```

A function which loops over every time step in an output file and finds the rate of change of a species at that time due to each of the reactions it is involved in.
From this, the most important reactions are identified and printed to file. This can be used to understand the chemical reason behind a species' behaviour.

**Arguments**:

- `species_name` _str_ - Name of species to be analysed
- `result_file` _str_ - The path to the file containing the UCLCHEM output
- `output_file` _str_ - The path to the file where the analysis output will be written
- `rate_threshold` _float,optional_ - Analysis output will contain the only the most efficient reactions that are responsible for rate_threshold of the total production and destruction rate. Defaults to 0.99.

<a id="uclchem.analysis.total_element_abundance"></a>

#### total\_element\_abundance

```python
def total_element_abundance(element, df)
```

Calculates that the total elemental abundance of a species as a function of time. Allows you to check conservation.

**Arguments**:

- `element` _str_ - Name of element
- `df` _pandas.DataFrame_ - DataFrame from `read_output_file()`
  

**Returns**:

- `pandas.Series` - Total abundance of element for all time steps in df.

<a id="uclchem.analysis.check_element_conservation"></a>

#### check\_element\_conservation

```python
def check_element_conservation(df, element_list=["H", "N", "C", "O"])
```

Check the conservation of major element by comparing total abundance at start and end of model

**Arguments**:

- `df` _pandas.DataFrame_ - UCLCHEM output in format from `read_output_file`
- `element_list` _list, optional_ - List of elements to check. Defaults to ["H", "N", "C", "O"].
  

**Returns**:

- `dict` - Dictionary containing the change in the total abundance of each element as a fraction of initial value

<a id="uclchem.tests"></a>

# uclchem.tests

<a id="uclchem.tests.test_ode_conservation"></a>

#### test\_ode\_conservation

```python
def test_ode_conservation(element_list=["H", "N", "C", "O"])
```

Test whether the ODEs conserve elements. Useful to run each time you change network.
Integrator errors may still cause elements not to be conserved but they cannot be conserved
if the ODEs are not correct.

**Arguments**:

- `element_list` _list, optional_ - A list of elements for which to check the conservation. Defaults to ["H", "N", "C", "O"].
  

**Returns**:

- `dict` - A dictionary of the elements in element list with values representing the total rate of change of each element.

