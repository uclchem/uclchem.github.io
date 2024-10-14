---
id: pythonapi
title: Python Reference
---
# Python API

* [uclchem](#uclchem)
* [uclchem.analysis](#uclchem.analysis)
  * [read\_output\_file](#uclchem.analysis.read_output_file)
  * [create\_abundance\_plot](#uclchem.analysis.create_abundance_plot)
  * [plot\_species](#uclchem.analysis.plot_species)
  * [analysis](#uclchem.analysis.analysis)
  * [total\_element\_abundance](#uclchem.analysis.total_element_abundance)
  * [check\_element\_conservation](#uclchem.analysis.check_element_conservation)
* [uclchem.constants](#uclchem.constants)

* [uclchem.model](#uclchem.model)
  * [outputArrays\_to\_DataFrame](#uclchem.model.outputArrays_to_DataFrame)
  * [cloud](#uclchem.model.cloud)
  * [collapse](#uclchem.model.collapse)
  * [hot\_core](#uclchem.model.hot_core)
  * [cshock](#uclchem.model.cshock)
  * [jshock](#uclchem.model.jshock)
  * [postprocess](#uclchem.model.postprocess)
* [uclchem.utils](#uclchem.utils)
  * [cshock\_dissipation\_time](#uclchem.utils.cshock_dissipation_time)
  * [check\_error](#uclchem.utils.check_error)
  * [get\_species\_table](#uclchem.utils.get_species_table)
  * [get\_species](#uclchem.utils.get_species)
  * [get\_reaction\_table](#uclchem.utils.get_reaction_table)
* [uclchem.debug](#uclchem.debug)
  * [get\_f2py\_signature](#uclchem.debug.get_f2py_signature)
* [uclchem.tests](#uclchem.tests)
  * [test\_ode\_conservation](#uclchem.tests.test_ode_conservation)
* [uclchem.makerates.species](#uclchem.makerates.species)
  * [is\_number](#uclchem.makerates.species.is_number)
  * [Species](#uclchem.makerates.species.Species)
    * [\_\_init\_\_](#uclchem.makerates.species.Species.__init__)
    * [get\_name](#uclchem.makerates.species.Species.get_name)
    * [get\_mass](#uclchem.makerates.species.Species.get_mass)
    * [set\_desorb\_products](#uclchem.makerates.species.Species.set_desorb_products)
    * [get\_desorb\_products](#uclchem.makerates.species.Species.get_desorb_products)
    * [set\_freeze\_products](#uclchem.makerates.species.Species.set_freeze_products)
    * [get\_freeze\_products](#uclchem.makerates.species.Species.get_freeze_products)
    * [get\_freeze\_products\_list](#uclchem.makerates.species.Species.get_freeze_products_list)
    * [get\_freeze\_alpha](#uclchem.makerates.species.Species.get_freeze_alpha)
    * [is\_grain\_species](#uclchem.makerates.species.Species.is_grain_species)
    * [is\_surface\_species](#uclchem.makerates.species.Species.is_surface_species)
    * [is\_bulk\_species](#uclchem.makerates.species.Species.is_bulk_species)
    * [is\_ion](#uclchem.makerates.species.Species.is_ion)
    * [add\_default\_freeze](#uclchem.makerates.species.Species.add_default_freeze)
    * [find\_constituents](#uclchem.makerates.species.Species.find_constituents)
    * [get\_n\_atoms](#uclchem.makerates.species.Species.get_n_atoms)
    * [set\_n\_atoms](#uclchem.makerates.species.Species.set_n_atoms)
    * [\_\_eq\_\_](#uclchem.makerates.species.Species.__eq__)
    * [\_\_lt\_\_](#uclchem.makerates.species.Species.__lt__)
    * [\_\_gt\_\_](#uclchem.makerates.species.Species.__gt__)
* [uclchem.makerates](#uclchem.makerates)
* [uclchem.makerates.makerates](#uclchem.makerates.makerates)
  * [run\_makerates](#uclchem.makerates.makerates.run_makerates)
  * [get\_network](#uclchem.makerates.makerates.get_network)
* [uclchem.makerates.network](#uclchem.makerates.network)
  * [Network](#uclchem.makerates.network.Network)
    * [\_\_init\_\_](#uclchem.makerates.network.Network.__init__)
    * [add\_reactions](#uclchem.makerates.network.Network.add_reactions)
    * [find\_similar\_reactions](#uclchem.makerates.network.Network.find_similar_reactions)
    * [remove\_reaction\_by\_index](#uclchem.makerates.network.Network.remove_reaction_by_index)
    * [remove\_reaction](#uclchem.makerates.network.Network.remove_reaction)
    * [get\_reaction](#uclchem.makerates.network.Network.get_reaction)
    * [set\_reaction](#uclchem.makerates.network.Network.set_reaction)
    * [get\_reaction\_dict](#uclchem.makerates.network.Network.get_reaction_dict)
    * [set\_reaction\_dict](#uclchem.makerates.network.Network.set_reaction_dict)
    * [get\_reaction\_list](#uclchem.makerates.network.Network.get_reaction_list)
    * [sort\_reactions](#uclchem.makerates.network.Network.sort_reactions)
    * [add\_species](#uclchem.makerates.network.Network.add_species)
    * [remove\_species](#uclchem.makerates.network.Network.remove_species)
    * [get\_species\_list](#uclchem.makerates.network.Network.get_species_list)
    * [get\_species\_dict](#uclchem.makerates.network.Network.get_species_dict)
    * [get\_specie](#uclchem.makerates.network.Network.get_specie)
    * [set\_specie](#uclchem.makerates.network.Network.set_specie)
    * [set\_species\_dict](#uclchem.makerates.network.Network.set_species_dict)
    * [sort\_species](#uclchem.makerates.network.Network.sort_species)
    * [check\_network](#uclchem.makerates.network.Network.check_network)
    * [check\_and\_filter\_species](#uclchem.makerates.network.Network.check_and_filter_species)
    * [add\_bulk\_species](#uclchem.makerates.network.Network.add_bulk_species)
    * [check\_freeze\_and\_desorbs](#uclchem.makerates.network.Network.check_freeze_and_desorbs)
    * [add\_freeze\_reactions](#uclchem.makerates.network.Network.add_freeze_reactions)
    * [add\_desorb\_reactions](#uclchem.makerates.network.Network.add_desorb_reactions)
    * [add\_chemdes\_reactions](#uclchem.makerates.network.Network.add_chemdes_reactions)
    * [check\_for\_excited\_species](#uclchem.makerates.network.Network.check_for_excited_species)
    * [add\_excited\_surface\_reactions](#uclchem.makerates.network.Network.add_excited_surface_reactions)
    * [add\_bulk\_reactions](#uclchem.makerates.network.Network.add_bulk_reactions)
    * [freeze\_checks](#uclchem.makerates.network.Network.freeze_checks)
    * [duplicate\_checks](#uclchem.makerates.network.Network.duplicate_checks)
    * [index\_important\_reactions](#uclchem.makerates.network.Network.index_important_reactions)
    * [index\_important\_species](#uclchem.makerates.network.Network.index_important_species)
    * [branching\_ratios\_checks](#uclchem.makerates.network.Network.branching_ratios_checks)
  * [LoadedNetwork](#uclchem.makerates.network.LoadedNetwork)
    * [\_\_init\_\_](#uclchem.makerates.network.LoadedNetwork.__init__)
* [uclchem.makerates.io\_functions](#uclchem.makerates.io_functions)
  * [read\_species\_file](#uclchem.makerates.io_functions.read_species_file)
  * [read\_reaction\_file](#uclchem.makerates.io_functions.read_reaction_file)
  * [check\_reaction](#uclchem.makerates.io_functions.check_reaction)
  * [kida\_parser](#uclchem.makerates.io_functions.kida_parser)
  * [output\_drops](#uclchem.makerates.io_functions.output_drops)
  * [write\_outputs](#uclchem.makerates.io_functions.write_outputs)
  * [write\_f90\_constants](#uclchem.makerates.io_functions.write_f90_constants)
  * [write\_python\_constants](#uclchem.makerates.io_functions.write_python_constants)
  * [write\_species](#uclchem.makerates.io_functions.write_species)
  * [write\_reactions](#uclchem.makerates.io_functions.write_reactions)
  * [write\_odes\_f90](#uclchem.makerates.io_functions.write_odes_f90)
  * [write\_jacobian](#uclchem.makerates.io_functions.write_jacobian)
  * [build\_ode\_string](#uclchem.makerates.io_functions.build_ode_string)
  * [species\_ode\_string](#uclchem.makerates.io_functions.species_ode_string)
  * [write\_evap\_lists](#uclchem.makerates.io_functions.write_evap_lists)
  * [truncate\_line](#uclchem.makerates.io_functions.truncate_line)
  * [write\_network\_file](#uclchem.makerates.io_functions.write_network_file)
  * [find\_reactant](#uclchem.makerates.io_functions.find_reactant)
  * [get\_desorption\_freeze\_partners](#uclchem.makerates.io_functions.get_desorption_freeze_partners)
  * [array\_to\_string](#uclchem.makerates.io_functions.array_to_string)
* [uclchem.makerates.reaction](#uclchem.makerates.reaction)
  * [Reaction](#uclchem.makerates.reaction.Reaction)
    * [get\_reactants](#uclchem.makerates.reaction.Reaction.get_reactants)
    * [get\_sorted\_reactants](#uclchem.makerates.reaction.Reaction.get_sorted_reactants)
    * [set\_reactants](#uclchem.makerates.reaction.Reaction.set_reactants)
    * [get\_products](#uclchem.makerates.reaction.Reaction.get_products)
    * [get\_sorted\_products](#uclchem.makerates.reaction.Reaction.get_sorted_products)
    * [set\_products](#uclchem.makerates.reaction.Reaction.set_products)
    * [get\_alpha](#uclchem.makerates.reaction.Reaction.get_alpha)
    * [set\_alpha](#uclchem.makerates.reaction.Reaction.set_alpha)
    * [get\_beta](#uclchem.makerates.reaction.Reaction.get_beta)
    * [set\_beta](#uclchem.makerates.reaction.Reaction.set_beta)
    * [set\_gamma](#uclchem.makerates.reaction.Reaction.set_gamma)
    * [get\_gamma](#uclchem.makerates.reaction.Reaction.get_gamma)
    * [set\_templow](#uclchem.makerates.reaction.Reaction.set_templow)
    * [get\_templow](#uclchem.makerates.reaction.Reaction.get_templow)
    * [set\_temphigh](#uclchem.makerates.reaction.Reaction.set_temphigh)
    * [get\_temphigh](#uclchem.makerates.reaction.Reaction.get_temphigh)
    * [NANCheck](#uclchem.makerates.reaction.Reaction.NANCheck)
    * [get\_reaction\_type](#uclchem.makerates.reaction.Reaction.get_reaction_type)
    * [get\_source](#uclchem.makerates.reaction.Reaction.get_source)
    * [set\_source](#uclchem.makerates.reaction.Reaction.set_source)
    * [convert\_to\_bulk](#uclchem.makerates.reaction.Reaction.convert_to_bulk)
    * [\_\_eq\_\_](#uclchem.makerates.reaction.Reaction.__eq__)
    * [check\_temperature\_collision](#uclchem.makerates.reaction.Reaction.check_temperature_collision)
    * [changes\_surface\_count](#uclchem.makerates.reaction.Reaction.changes_surface_count)
    * [changes\_total\_mantle](#uclchem.makerates.reaction.Reaction.changes_total_mantle)
    * [generate\_ode\_bit](#uclchem.makerates.reaction.Reaction.generate_ode_bit)

<a id="uclchem"></a>

# uclchem

The UCLCHEM python module is divided into three parts.
`model` contains the functions for running chemical models under different physics.
`analysis` contains functions for reading and plotting output files as well as investigating the chemistry.
`tests` contains functions for testing the code.

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

Create a plot of the abundance of a list of species through time.

**Arguments**:

- `df` _pd.DataFrame_ - Pandas dataframe containing the UCLCHEM output, see `read_output_file`
- `species` _list_ - list of strings containing species names. Using a $ instead of # or @ will plot the sum of surface and bulk abundances.
- `figsize` _tuple, optional_ - Size of figure, width by height in inches. Defaults to (16, 9).
- `plot_file` _str, optional_ - Path to file where figure will be saved. If None, figure is not saved. Defaults to None.
  

**Returns**:

- `fig,ax` - matplotlib figure and axis objects

<a id="uclchem.analysis.plot_species"></a>

#### plot\_species

```python
def plot_species(ax, df, species, legend=True, **plot_kwargs)
```

Plot the abundance of a list of species through time directly onto an axis.

**Arguments**:

- `ax` _pyplot.axis_ - An axis object to plot on
- `df` _pd.DataFrame_ - A dataframe created by `read_output_file`
- `species` _str_ - A list of species names to be plotted. If species name starts with "$" instead of # or @, plots the sum of surface and bulk abundances
  

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
def check_element_conservation(df,
                               element_list=["H", "N", "C", "O"],
                               percent=True)
```

Check the conservation of major element by comparing total abundance at start and end of model

**Arguments**:

- `df` _pandas.DataFrame_ - UCLCHEM output in format from `read_output_file`
- `element_list` _list, optional_ - List of elements to check. Defaults to ["H", "N", "C", "O"].
  

**Returns**:

- `dict` - Dictionary containing the change in the total abundance of each element as a fraction of initial value

<a id="uclchem.constants"></a>

# uclchem.constants





<a id="uclchem.model"></a>

# uclchem.model

<a id="uclchem.model.outputArrays_to_DataFrame"></a>

#### outputArrays\_to\_DataFrame

```python
def outputArrays_to_DataFrame(physicalParameterArray, chemicalAbundanceArray,
                              specname, physParameter)
```

Convert the output arrays to a pandas dataframe

**Arguments**:

- `physicalParameterArray` _np.array_ - Array with the output physical parameters
- `chemicalAbundanceArray` _np.array_ - Array with the output chemical abundances
- `specname` _list_ - List with the names of all the species
- `physParameter` _list_ - Array with all the physical parameter names
  

**Returns**:

- `_type_` - _description_

<a id="uclchem.model.cloud"></a>

#### cloud

```python
def cloud(param_dict=None,
          out_species=None,
          return_array=False,
          return_dataframe=False,
          starting_chemistry=None,
          timepoints=TIMEPOINTS)
```

Run cloud model from UCLCHEM

**Arguments**:

- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
- `return_array` _bool, optional_ - A boolean on whether a np.array should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `return_dataframe` _bool, optional_ - A boolean on whether a pandas.DataFrame should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `starting_chemistry` _array, optional_ - np.array containing the starting chemical abundances needed by uclchem

**Returns**:

  if return_array and return_dataframe are False:
  - A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the `out_species` parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species.
  if return_array is True:
  - physicsArray (array): array containing the physical outputs for each written timestep
  - chemicalAbunArray (array): array containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.
  if return_dataframe is True:
  - physicsDF (pandas.DataFrame): DataFrame containing the physical outputs for each written timestep
  - chemicalDF (pandas.DataFrame): DataFrame containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.

<a id="uclchem.model.collapse"></a>

#### collapse

```python
def collapse(collapse,
             physics_output,
             param_dict=None,
             out_species=None,
             return_array=False,
             return_dataframe=False,
             starting_chemistry=None,
             timepoints=TIMEPOINTS)
```

Run collapse model from UCLCHEM based on Priestley et al 2018 AJ 156 51 (https://ui.adsabs.harvard.edu/abs/2018AJ....156...51P/abstract)

**Arguments**:

- `collapse` _str_ - A string containing the collapse type, options are 'BE1.1', 'BE4', 'filament', or 'ambipolar'
- `physics_output(str)` - Filename to store physics output, only relevant for 'filament' and 'ambipolar' collapses. If None, no physics output will be saved.
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
- `return_array` _bool, optional_ - A boolean on whether a np.array should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `return_dataframe` _bool, optional_ - A boolean on whether a pandas.DataFrame should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `starting_chemistry` _array, optional_ - np.array containing the starting chemical abundances needed by uclchem
  

**Returns**:

  if return_array and return_dataframe are False:
  - A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the `out_species` parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species.
  if return_array is True:
  - physicsArray (array): array containing the physical outputs for each written timestep
  - chemicalAbunArray (array): array containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.
  if return_dataframe is True:
  - physicsDF (pandas.DataFrame): DataFrame containing the physical outputs for each written timestep
  - chemicalDF (pandas.DataFrame): DataFrame containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.

<a id="uclchem.model.hot_core"></a>

#### hot\_core

```python
def hot_core(temp_indx,
             max_temperature,
             param_dict=None,
             out_species=None,
             return_array=False,
             return_dataframe=False,
             starting_chemistry=None,
             timepoints=TIMEPOINTS)
```

Run hot core model from UCLCHEM, based on Viti et al. 2004 and Collings et al. 2004

**Arguments**:

- `temp_indx` _int_ - Used to select the mass of hot core. 1=1Msun,2=5, 3=10, 4=15, 5=25,6=60]
- `max_temperature` _float_ - Value at which gas temperature will stop increasing.
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
- `return_array` _bool, optional_ - A boolean on whether a np.array should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `return_dataframe` _bool, optional_ - A boolean on whether a pandas.DataFrame should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `starting_chemistry` _array, optional_ - np.array containing the starting chemical abundances needed by uclchem
  

**Returns**:

  if return_array and return_dataframe are False:
  - A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the `out_species` parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species.
  if return_array is True:
  - physicsArray (array): array containing the physical outputs for each written timestep
  - chemicalAbunArray (array): array containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.
  if return_dataframe is True:
  - physicsDF (pandas.DataFrame): DataFrame containing the physical outputs for each written timestep
  - chemicalDF (pandas.DataFrame): DataFrame containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.

<a id="uclchem.model.cshock"></a>

#### cshock

```python
def cshock(shock_vel,
           timestep_factor=0.01,
           minimum_temperature=0.0,
           param_dict=None,
           out_species=None,
           return_array=False,
           return_dataframe=False,
           starting_chemistry=None,
           timepoints=TIMEPOINTS)
```

Run C-type shock model from UCLCHEM

**Arguments**:

- `shock_vel` _float_ - Velocity of the shock in km/s
- `timestep_factor` _float, optional_ - Whilst the time is less than 2 times the dissipation time of shock, timestep is timestep_factor*dissipation time. Essentially controls
  how well resolved the shock is in your model. Defaults to 0.01.
- `minimum_temperature` _float, optional_ - Minimum post-shock temperature. Defaults to 0.0 (no minimum). The shocked gas typically cools to `initialTemp` if this is not set.
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
- `return_array` _bool, optional_ - A boolean on whether a np.array should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `return_dataframe` _bool, optional_ - A boolean on whether a pandas.DataFrame should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `starting_chemistry` _array, optional_ - np.array containing the starting chemical abundances needed by uclchem
  

**Returns**:

  if return_array and return_dataframe are False:
  - A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the model succeeded, the second element is the dissipation time and further elements are the abundances of all species in `out_species`.
  if return_array is True:
  - physicsArray (array): array containing the physical outputs for each written timestep
  - chemicalAbunArray (array): array containing the chemical abundances for each written timestep
  - disspation_time (float): dissipation time in years
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.
  if return_dataframe is True:
  - physicsDF (pandas.DataFrame): DataFrame containing the physical outputs for each written timestep
  - chemicalDF (pandas.DataFrame): DataFrame containing the chemical abundances for each written timestep
  - disspation_time (float): dissipation time in years
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.

<a id="uclchem.model.jshock"></a>

#### jshock

```python
def jshock(shock_vel,
           param_dict=None,
           out_species=None,
           return_array=False,
           return_dataframe=False,
           starting_chemistry=None,
           timepoints=TIMEPOINTS)
```

Run J-type shock model from UCLCHEM

**Arguments**:

- `shock_vel` _float_ - Velocity of the shock
- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
- `return_array` _bool, optional_ - A boolean on whether a np.array should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `return_dataframe` _bool, optional_ - A boolean on whether a pandas.DataFrame should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `starting_chemistry` _array, optional_ - np.array containing the starting chemical abundances needed by uclchem
  
  Returns:if return_array and return_dataframe are False:
  - A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the model succeeded, the second element is the dissipation time and further elements are the abundances of all species in `out_species`.
  if return_array is True:
  - physicsArray (array): array containing the physical outputs for each written timestep
  - chemicalAbunArray (array): array containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.
  if return_dataframe is True:
  - physicsDF (pandas.DataFrame): DataFrame containing the physical outputs for each written timestep
  - chemicalDF (pandas.DataFrame): DataFrame containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.

<a id="uclchem.model.postprocess"></a>

#### postprocess

```python
def postprocess(param_dict=None,
                out_species=None,
                return_array=False,
                return_dataframe=False,
                starting_chemistry=None,
                time_array=None,
                density_array=None,
                gas_temperature_array=None,
                dust_temperature_array=None,
                zeta_array=None,
                radfield_array=None,
                coldens_H_array=None,
                coldens_H2_array=None,
                coldens_CO_array=None,
                coldens_C_array=None)
```

Run cloud model from UCLCHEM

**Arguments**:

- `param_dict` _dict,optional_ - A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `out_species` _list, optional_ - A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.
- `return_array` _bool, optional_ - A boolean on whether a np.array should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `return_dataframe` _bool, optional_ - A boolean on whether a pandas.DataFrame should be returned to a user, if both return_array and return_dataframe are false, this function will default to writing outputs to a file
- `starting_chemistry` _array, optional_ - np.array containing the starting chemical abundances needed by uclchem

**Returns**:

  if return_array and return_dataframe are False:
  - A list where the first element is always an integer which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details. If the `out_species` parametere is provided, the remaining elements of this list will be the final abundances of the species in out_species.
  if return_array is True:
  - physicsArray (array): array containing the physical outputs for each written timestep
  - chemicalAbunArray (array): array containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.
  if return_dataframe is True:
  - physicsDF (pandas.DataFrame): DataFrame containing the physical outputs for each written timestep
  - chemicalDF (pandas.DataFrame): DataFrame containing the chemical abundances for each written timestep
  - abundanceStart (array): array containing the chemical abundances of the last timestep in the format uclchem needs in order to perform an additional run after the initial model
  - success_flag (integer): which is negative if the model failed to run and can be sent to `uclchem.utils.check_error()` to see more details.

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

<a id="uclchem.utils.get_species"></a>

#### get\_species

```python
def get_species() -> list[str]
```

A simple function to load the list of species present in the UCLCHEM network

**Returns**:

  list[str] : A list of species names

<a id="uclchem.utils.get_reaction_table"></a>

#### get\_reaction\_table

```python
def get_reaction_table()
```

A function to load the reaction table from the UCLCHEM network into a pandas dataframe.

**Returns**:

- `pandas.DataFrame` - A dataframe containing the reactions and their rates

<a id="uclchem.debug"></a>

# uclchem.debug

Functions to help debugging UCLCHEM

<a id="uclchem.debug.get_f2py_signature"></a>

#### get\_f2py\_signature

```python
def get_f2py_signature(write=False) -> str
```

Get the signature of the UCLCHEM fortran code

**Arguments**:

- `write` _bool, optional_ - Write to disk. Defaults to False.
  

**Returns**:

- `str` - Signature of the UCLCHEM fortran code from the f2py wrapper

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

<a id="uclchem.makerates.species"></a>

# uclchem.makerates.species

<a id="uclchem.makerates.species.is_number"></a>

#### is\_number

```python
def is_number(s) -> bool
```

Try to convert input to a float, if it succeeds, return True.

**Arguments**:

- `s` - Input element to check for
  

**Returns**:

- `bool` - True if a number, False if not.

<a id="uclchem.makerates.species.Species"></a>

## Species Objects

```python
class Species()
```

Species is a class that holds all the information about an individual species in the
network. It also has convenience functions to check whether the species is a gas or grain
species and to help compare between species.

<a id="uclchem.makerates.species.Species.__init__"></a>

#### \_\_init\_\_

```python
def __init__(inputRow)
```

A class representing chemical species, it reads in rows which are formatted as follows:
NAME,MASS,BINDING ENERGY,SOLID FRACTION,MONO FRACTION,VOLCANO FRACTION,ENTHALPY

**Arguments**:

  inputRow (list):

<a id="uclchem.makerates.species.Species.get_name"></a>

#### get\_name

```python
def get_name() -> str
```

Get the name of the chemical species.

**Returns**:

- `str` - The name

<a id="uclchem.makerates.species.Species.get_mass"></a>

#### get\_mass

```python
def get_mass() -> int
```

Get the molecular mass of the chemical species

**Returns**:

- `int` - The molecular mass

<a id="uclchem.makerates.species.Species.set_desorb_products"></a>

#### set\_desorb\_products

```python
def set_desorb_products(new_desorbs: list[str]) -> None
```

Set the desorption products for species on the surface or in the bulk.
It is assumed that there is only one desorption pathway.

**Arguments**:

- `new_desorbs` _list[str]_ - The new desorption products

<a id="uclchem.makerates.species.Species.get_desorb_products"></a>

#### get\_desorb\_products

```python
def get_desorb_products() -> list[str]
```

Obtain the desorbtion products of ice species

**Returns**:

- `list[str]` - The desorption products

<a id="uclchem.makerates.species.Species.set_freeze_products"></a>

#### set\_freeze\_products

```python
def set_freeze_products(product_list: list[str], freeze_alpha: float) -> None
```

Add the freeze products of the species, one species can have several freeze products.

**Arguments**:

- `product_list` _list[str]_ - The list of freeze out products
- `freeze_alpha` _float_ - The freeze out ratio.
  
  It is called alpha, since it is derived from the alpha column in the UCLCHEM reaction format:
  https://github.com/uclchem/UCLCHEM/blob/08d37f8c3063f8ff8a9a7aa16d9eff0ed4f99538/Makerates/src/network.py#L160

<a id="uclchem.makerates.species.Species.get_freeze_products"></a>

#### get\_freeze\_products

```python
def get_freeze_products() -> dict[list[str], float]
```

Obtain the product to which the species freeze out

**Returns**:

  dict[str, float]: Reactions and their respective freeze out ratios.
  

**Yields**:

  Iterator[dict[str, float]]: Iterator that returns all of the freeze out reactions with ratios

<a id="uclchem.makerates.species.Species.get_freeze_products_list"></a>

#### get\_freeze\_products\_list

```python
def get_freeze_products_list() -> list[list[str]]
```

Returns all the freeze products without their ratios

**Returns**:

- `list[list[str]]` - List of freeze products

<a id="uclchem.makerates.species.Species.get_freeze_alpha"></a>

#### get\_freeze\_alpha

```python
def get_freeze_alpha(product_list: list[str]) -> float
```

Obtain the freeze out ratio of a species for a certain reaction

**Arguments**:

- `product_list` _list[str]_ - For a specific reaction, get the freezeout ratio
  

**Returns**:

- `float` - The freezeout ratio

<a id="uclchem.makerates.species.Species.is_grain_species"></a>

#### is\_grain\_species

```python
def is_grain_species() -> bool
```

Return whether the species is a species on the grain

**Returns**:

- `bool` - True if it is a grain species.

<a id="uclchem.makerates.species.Species.is_surface_species"></a>

#### is\_surface\_species

```python
def is_surface_species() -> bool
```

Checks if the species is on the surface

**Returns**:

- `bool` - True if a surface species

<a id="uclchem.makerates.species.Species.is_bulk_species"></a>

#### is\_bulk\_species

```python
def is_bulk_species() -> bool
```

Checks if the species is in the bulk

**Returns**:

- `bool` - True if a bulk species

<a id="uclchem.makerates.species.Species.is_ion"></a>

#### is\_ion

```python
def is_ion() -> bool
```

Checks if the species is ionized, either postively or negatively.

**Returns**:

- `bool` - True if it is an ionized

<a id="uclchem.makerates.species.Species.add_default_freeze"></a>

#### add\_default\_freeze

```python
def add_default_freeze() -> None
```

Adds a defalt freezeout, which is freezing out to the species itself, but with no ionization.

<a id="uclchem.makerates.species.Species.find_constituents"></a>

#### find\_constituents

```python
def find_constituents()
```

Loop through the species' name and work out what its consituent
atoms are. Then calculate mass and alert user if it doesn't match
input mass.

<a id="uclchem.makerates.species.Species.get_n_atoms"></a>

#### get\_n\_atoms

```python
def get_n_atoms() -> int
```

Obtain the number of atoms in the molecule

**Returns**:

- `int` - The number of atoms

<a id="uclchem.makerates.species.Species.set_n_atoms"></a>

#### set\_n\_atoms

```python
def set_n_atoms(new_n_atoms: int) -> None
```

Set the number of atoms

**Arguments**:

- `new_n_atoms` _int_ - The new number of atoms

<a id="uclchem.makerates.species.Species.__eq__"></a>

#### \_\_eq\_\_

```python
def __eq__(other)
```

Check for equality based on either a string or another Species instance.

**Arguments**:

- `other` _str, Species_ - Another species
  

**Raises**:

- `NotImplementedError` - We can only compare between species or strings of species.
  

**Returns**:

- `bool` - True if two species are identical.

<a id="uclchem.makerates.species.Species.__lt__"></a>

#### \_\_lt\_\_

```python
def __lt__(other) -> bool
```

Compare the mass of the species

**Arguments**:

- `other` _Species_ - Another species instance
  

**Returns**:

- `bool` - True if less than the other species

<a id="uclchem.makerates.species.Species.__gt__"></a>

#### \_\_gt\_\_

```python
def __gt__(other) -> bool
```

Compare the mass of the species

**Arguments**:

- `other` _Species_ - Another species instance
  

**Returns**:

- `bool` - True if larger than than the other species

<a id="uclchem.makerates"></a>

# uclchem.makerates

<a id="uclchem.makerates.makerates"></a>

# uclchem.makerates.makerates

<a id="uclchem.makerates.makerates.run_makerates"></a>

#### run\_makerates

```python
def run_makerates(configuration_file: str = "user_settings.yaml",
                  write_files: bool = True) -> Network
```

The main run wrapper for makerates, it loads a configuration, parses it in Network
and then returns the Network. It by default writes to the uclchem fortran directory, but
this can be skipped.

**Arguments**:

- `configuration_file` _str, optional_ - A UCLCHEM Makerates configuration file. Defaults to "user_settings.yaml".
- `write_files` _bool, optional_ - Whether to write the fortran files to the src/fortran_src. Defaults to True.
  

**Raises**:

- `KeyError` - The configuration cannot be found
  

**Returns**:

- `Network` - A chemical network instance.

<a id="uclchem.makerates.makerates.get_network"></a>

#### get\_network

```python
def get_network(path_to_input_file: Union[str, bytes, os.PathLike] = None,
                path_to_species_file: Union[str, bytes, os.PathLike] = None,
                path_to_reaction_file: Union[str, bytes, os.PathLike] = None,
                verbosity=None)
```

In memory equivalent of Makerates, can either be used on the original input files
for makerates, or on the output files that makerates generates. So either specify:

`path_to_input_file ` exclusive OR (`path_to_species_file` and `path_to_reaction_file`)

The latter scenario allows you to reload a reaction network from a network already written by Makerates.


**Arguments**:

- `path_to_input_file` _Union[str, bytes, os.PathLike], optional_ - Path to input file. Defaults to None.
- `path_to_species_file` _Union[str, bytes, os.PathLike], optional_ - Path to a species.csv in/from the src directory. Defaults to None.
- `path_to_reaction_file` _Union[str, bytes, os.PathLike], optional_ - Path to a reactions.csv in/from the src directory. Defaults to None.
- `verbosity` _LEVEL, optional_ - The verbosity level as specified in logging. Defaults to None.
  

**Raises**:

- `ValueError` - You cannot specify both an input configuration and species+reaction.
  

**Returns**:

- `Network` - A chemical reaction network.

<a id="uclchem.makerates.network"></a>

# uclchem.makerates.network

This python file contains all functions for de-duplicating species and reaction lists,
checking for common errors, and automatic addition of reactions such as freeze out,
desorption and bulk reactions for three phase models.

<a id="uclchem.makerates.network.Network"></a>

## Network Objects

```python
class Network()
```

The network class stores all the information about reaction network.

<a id="uclchem.makerates.network.Network.__init__"></a>

#### \_\_init\_\_

```python
def __init__(species: list[Species],
             reactions: list[Reaction],
             three_phase: bool = False,
             user_defined_bulk: list = [])
```

A class to store network information such as indices of important reactions.

The class fully utilizes getters and setters, which can be used to add/remove
reactions and the species involved. Important is that you do not directly edit
the internal dictionaries that store the species and reactions, unless you
know what you are doing. The network by default checks for duplicates in species
and identical reactions that overlap in temperature ranges, potentially causing
problems.

**Arguments**:

- `species` _list[Species]_ - A list of chemical species that are added to the network
- `reactions` _list[Reaction]_ - A list of chemical reactions that are added to the network
- `three_phase` _bool, optional_ - Whether to use a three phase model (gas, surface, bulk). Defaults to False.
- `user_defined_bulk` _list, optional_ - List of user defined bulk. Defaults to [].

<a id="uclchem.makerates.network.Network.add_reactions"></a>

#### add\_reactions

```python
def add_reactions(reactions: Union[Union[Reaction, str], list[Union[Reaction,
                                                                    str]]])
```

Add a reaction, list of inputs to the Reaction class or list of reactions to the network.

**Arguments**:

- `reactions` _Union[Union[Reaction, str], list[Union[Reaction, str]]]_ - Reaction or list or reactions

<a id="uclchem.makerates.network.Network.find_similar_reactions"></a>

#### find\_similar\_reactions

```python
def find_similar_reactions(reaction: Reaction) -> dict[int, Reaction]
```

Reactions are similar if the reaction has the same reactants and products,
find all reactions that are similar, returning their index and the reaction itself.

**Arguments**:

- `reaction` _Reaction_ - Reaction with possible identical (but for temperature range) reactions in the network
  

**Returns**:

  dict[int, Reaction]: A dict with the identical reactions.

<a id="uclchem.makerates.network.Network.remove_reaction_by_index"></a>

#### remove\_reaction\_by\_index

```python
def remove_reaction_by_index(reaction_idx: int) -> None
```

Remove a reaction by its index in the internal _reactions_dict, this is the only way
to remove reactions that are defined piecewise across temperature ranges.

**Arguments**:

- `reaction_idx` _int_ - Index of the reaction to remove

<a id="uclchem.makerates.network.Network.remove_reaction"></a>

#### remove\_reaction

```python
def remove_reaction(reaction: Reaction) -> None
```

Remove the reaction by giving the object itself, this only works if the reaction is
not piecewise defined across the temperature ranges.

**Arguments**:

- `reaction` _Reaction_ - The reaction you wish to delete.

<a id="uclchem.makerates.network.Network.get_reaction"></a>

#### get\_reaction

```python
def get_reaction(reaction_idx: int) -> Reaction
```

Obtain a reaction from the reaction set given an index of the internal _reactions_dict.

**Arguments**:

- `reaction_idx` _int_ - The reaction index
  

**Returns**:

- `Reaction` - the desired reaction

<a id="uclchem.makerates.network.Network.set_reaction"></a>

#### set\_reaction

```python
def set_reaction(reaction_idx: int, reaction: Reaction) -> None
```

This setter explicitely sets the reaction for a certain index.

**Arguments**:

- `reaction_idx` _int_ - The index to be written to
- `reaction` _Reaction_ - The reaction to be added to the index.

<a id="uclchem.makerates.network.Network.get_reaction_dict"></a>

#### get\_reaction\_dict

```python
def get_reaction_dict() -> dict[int, Reaction]
```

Returns the whole internal reaction dictionary.

**Returns**:

  dict[int, Reaction]: A copy of the internal reactions dictionary.

<a id="uclchem.makerates.network.Network.set_reaction_dict"></a>

#### set\_reaction\_dict

```python
def set_reaction_dict(new_dict: dict[int, Reaction]) -> None
```

Override the reactions dictionary with a new dictionar.

**Arguments**:

- `new_dict` _dict[int, Reaction]_ - The new reactions_dictionary.

<a id="uclchem.makerates.network.Network.get_reaction_list"></a>

#### get\_reaction\_list

```python
def get_reaction_list() -> list[Reaction]
```

Obtain all the reactions in the Network.

**Returns**:

- `list[Reaction]` - A list with all the reaction objects

<a id="uclchem.makerates.network.Network.sort_reactions"></a>

#### sort\_reactions

```python
def sort_reactions() -> None
```

Sort the reaction dictionary by reaction type first and by the first reactant second.

<a id="uclchem.makerates.network.Network.add_species"></a>

#### add\_species

```python
def add_species(species: Union[Union[Species, str], list[Union[Species,
                                                               str]]])
```

Add species to the network, given a (list of) species. If it is a list of strings,
it tries to instantiate a species class with it. It also checks for duplicate entries  and
filters out attempts to add reaction types to the species.

**Arguments**:

- `species` _Union[Union[Species, str], list[Union[Species, str]]]_ - A (list of) species or strings.
  

**Raises**:

- `ValueError` - If we cannot parse the (list of) reactions
- `ValueError` - If an ice specie with binding energy of zero is added.

<a id="uclchem.makerates.network.Network.remove_species"></a>

#### remove\_species

```python
def remove_species(specie_name: str) -> None
```

Remove a specie from the network

**Arguments**:

- `specie_name` _str_ - Species to remove

<a id="uclchem.makerates.network.Network.get_species_list"></a>

#### get\_species\_list

```python
def get_species_list() -> list[Species]
```

Obtain a list with all the species in the network

**Returns**:

- `list[Species]` - A list of all the species in the reaction network

<a id="uclchem.makerates.network.Network.get_species_dict"></a>

#### get\_species\_dict

```python
def get_species_dict() -> dict[str, Species]
```

Get the internal dictionary that stores all the species, it consists
of all species' names as key, with the species object as value.

**Returns**:

  dict[str, Species]: A dictionary with the species

<a id="uclchem.makerates.network.Network.get_specie"></a>

#### get\_specie

```python
def get_specie(specie_name: str) -> Species
```

Get the species of the reaction network (from the internal dictionary)

**Arguments**:

- `specie_name` _str_ - the name of the species as a string
  

**Returns**:

- `Species` - The species object

<a id="uclchem.makerates.network.Network.set_specie"></a>

#### set\_specie

```python
def set_specie(species_name: str, species: Species) -> None
```

Set the species of the reaction network in the internal dictionary

**Arguments**:

- `species_name` _str_ - The name of the species as string
- `species` _Species_ - The Species object to set

<a id="uclchem.makerates.network.Network.set_species_dict"></a>

#### set\_species\_dict

```python
def set_species_dict(new_species_dict: dict[str, Species]) -> None
```

Set the internal species dict

**Arguments**:

- `new_species_dict` _dict[str, Species]_ - The new dictionary to set

<a id="uclchem.makerates.network.Network.sort_species"></a>

#### sort\_species

```python
def sort_species() -> None
```

Sort the species based on their mass in ascending order. We always make sure the Electron is last.

<a id="uclchem.makerates.network.Network.check_network"></a>

#### check\_network

```python
def check_network() -> None
```

Run through the list of reactions and check for obvious errors such
as duplicate reactions, multiple freeze out routes (to warn, not necessarily
an error), etc.

<a id="uclchem.makerates.network.Network.check_and_filter_species"></a>

#### check\_and\_filter\_species

```python
def check_and_filter_species() -> None
```

Check every speces in network appears in at least one reaction.
Remove any that do not and alert user.

<a id="uclchem.makerates.network.Network.add_bulk_species"></a>

#### add\_bulk\_species

```python
def add_bulk_species() -> None
```

For three phase models, MakeRates will produce the version of the species in the bulk
so that the user doesn't have to endlessly relist the same species

<a id="uclchem.makerates.network.Network.check_freeze_and_desorbs"></a>

#### check\_freeze\_and\_desorbs

```python
def check_freeze_and_desorbs() -> None
```

`add_freeze_reactions()` and `add_desorb_reactions()` automatically generate
all desorption and freeze out reactions. However, user may want to change a species on freeze out
eg C+ becomes `C` rather than `C`+. This function checks for that and updates species so they'll
freeze or desorb correctly when reactions are generated.

<a id="uclchem.makerates.network.Network.add_freeze_reactions"></a>

#### add\_freeze\_reactions

```python
def add_freeze_reactions() -> None
```

Save the user effort by automatically generating freeze out reactions

<a id="uclchem.makerates.network.Network.add_desorb_reactions"></a>

#### add\_desorb\_reactions

```python
def add_desorb_reactions() -> None
```

Save the user effort by automatically generating desorption reactions

<a id="uclchem.makerates.network.Network.add_chemdes_reactions"></a>

#### add\_chemdes\_reactions

```python
def add_chemdes_reactions() -> None
```

We have the user list all Langmuir-Hinshelwood and Eley-Rideal
reactions once. Then we duplicate so that the reaction branches
with products on grain and products desorbing.

<a id="uclchem.makerates.network.Network.check_for_excited_species"></a>

#### check\_for\_excited\_species

```python
def check_for_excited_species() -> bool
```

Check if there are any exicted species in the network, true if there are any.

<a id="uclchem.makerates.network.Network.add_excited_surface_reactions"></a>

#### add\_excited\_surface\_reactions

```python
def add_excited_surface_reactions() -> None
```

All excited species will relax to the ground state if they do not react
the vibrational frequency of the species is used as a pseudo approximation of the rate coefficient
We assume all grain reactions have an excited variant. For example:
`A`, `B` LH `C` will have the variants:
`A`*, `B` EXSOLID `C`  and  `A`, `B`* EXSOLID `C`
If only one of the reactants in the base reaction has an excited counterpart then
only one excited version of that reaction is created.

<a id="uclchem.makerates.network.Network.add_bulk_reactions"></a>

#### add\_bulk\_reactions

```python
def add_bulk_reactions() -> None
```

We assume any reaction that happens on the surface of grains can also happen
in the bulk (just more slowly due to binding energy). The user therefore only
lists surface reactions in their input reaction file and we duplicate here.

<a id="uclchem.makerates.network.Network.freeze_checks"></a>

#### freeze\_checks

```python
def freeze_checks() -> None
```

Check that every species freezes out and alert the user if a
species freezes out via mutiple routes. This isn't necessarily an
error so best just print.

<a id="uclchem.makerates.network.Network.duplicate_checks"></a>

#### duplicate\_checks

```python
def duplicate_checks() -> None
```

Check reaction network to make sure no reaction appears twice unless
they have different temperature ranges.

<a id="uclchem.makerates.network.Network.index_important_reactions"></a>

#### index\_important\_reactions

```python
def index_important_reactions() -> None
```

We have a whole bunch of important reactions and we want to store
their indices. We find them all here.

<a id="uclchem.makerates.network.Network.index_important_species"></a>

#### index\_important\_species

```python
def index_important_species() -> None
```

Obtain the indices for all the important reactions.

<a id="uclchem.makerates.network.Network.branching_ratios_checks"></a>

#### branching\_ratios\_checks

```python
def branching_ratios_checks() -> None
```

Check that the branching ratios for the ice reactions sum to 1.0. If they do not, correct them.
This needs to be done for LH and LHDES separately since we already added the desorption to the network.

<a id="uclchem.makerates.network.LoadedNetwork"></a>

## LoadedNetwork Objects

```python
class LoadedNetwork(Network)
```

Network version that skips all steps and just loads two lists. This is another
here be dragons version, use this with exceeding caution as no checks are performed for you.

**Arguments**:

- `Network` __type__ - _description_

<a id="uclchem.makerates.network.LoadedNetwork.__init__"></a>

#### \_\_init\_\_

```python
def __init__(species: list[Species], reactions: list[Reaction]) -> None
```

A loader of networks without any checks.

Here be dragons.

**Arguments**:

- `species` _list[Species]_ - A list of species objects
- `reactions` _list[Reaction]_ - A list of reaction objects.

<a id="uclchem.makerates.io_functions"></a>

# uclchem.makerates.io\_functions

Functions to read in the species and reaction files and write output files

<a id="uclchem.makerates.io_functions.read_species_file"></a>

#### read\_species\_file

```python
def read_species_file(file_name: Path) -> list[Species]
```

Reads in a Makerates species file

**Arguments**:

- `fileName` _str_ - path to file containing the species list
  

**Returns**:

- `list` - List of Species objects

<a id="uclchem.makerates.io_functions.read_reaction_file"></a>

#### read\_reaction\_file

```python
def read_reaction_file(file_name: Path, species_list: list[Species],
                       ftype: str) -> tuple[list[Reaction], list[Reaction]]
```

Reads in a reaction file of any kind (user, UMIST, KIDA)
produces a list of reactions for the network, filtered by species_list

**Arguments**:

- `file_name` _str_ - A file name for the reaction file to read.
- `species_list` _list[Species]_ - A list of chemical species to be used in the reading.
- `ftype` _str_ - 'UMIST','UCL', or 'KIDA' to describe format of file_name
  

**Returns**:

- `list,list` - Lists of kept and dropped reactions.

<a id="uclchem.makerates.io_functions.check_reaction"></a>

#### check\_reaction

```python
def check_reaction(reaction_row, keep_list) -> bool
```

Checks a row parsed from a reaction file and checks it only contains acceptable things.
It checks if all species in the reaction are present, and adds the temperature range is none is specified.

**Arguments**:

- `reaction_row` _list_ - List parsed from a reaction file and formatted to be able to called Reaction(reaction_row)
- `keep_list` _list_ - list of elements that are acceptable in the reactant or product bits of row
  

**Returns**:

- `bool` - Whether the row contains acceptable entries.

<a id="uclchem.makerates.io_functions.kida_parser"></a>

#### kida\_parser

```python
def kida_parser(kida_file)
```

KIDA used a fixed format file so we read each line in the chunks they specify
and use python built in classes to convert to the necessary types.
NOTE KIDA defines some of the same reaction types to UMIST but with different names
and coefficients. We fix that by converting them here.

<a id="uclchem.makerates.io_functions.output_drops"></a>

#### output\_drops

```python
def output_drops(dropped_reactions: list[Reaction],
                 output_dir: str = None,
                 write_files: bool = True)
```

Writes the reactions that are dropped to disk/logs

**Arguments**:

- `dropped_reactions` _list[Reaction]_ - The reactions that were dropped
- `output_dir` _str_ - The directory that dropped_reactions.csv will be written to.
- `write_files` _bool, optional_ - Whether or not to write the file. Defaults to True.

<a id="uclchem.makerates.io_functions.write_outputs"></a>

#### write\_outputs

```python
def write_outputs(network: Network, output_dir: str = None) -> None
```

Write the ODE and Network fortran source files to the fortran source.

**Arguments**:

- `network` _network_ - The makerates Network class
- `output_dir` _bool_ - The directory to write to.

<a id="uclchem.makerates.io_functions.write_f90_constants"></a>

#### write\_f90\_constants

```python
def write_f90_constants(
        replace_dict: Dict[str, int],
        output_file_name: Path,
        template_file_path: Path = "fortran_templates") -> None
```

Write the physical reactions to the f2py_constants.f90 file after every run of
makerates, this ensures the Fortran and Python bits are compatible with one another.

**Arguments**:

- `replace_dict` _Dict[str, int]_ - The dictionary with keys to replace and their values
- `output_file_name` _Path_ - The path to the target f2py_constants.f90 file
- `template_file_path` _Path, optional_ - The file to use as the template. Defaults to "fortran_templates".

<a id="uclchem.makerates.io_functions.write_python_constants"></a>

#### write\_python\_constants

```python
def write_python_constants(replace_dict: Dict[str, int],
                           python_constants_file: Path) -> None
```

Function to write the python constants to the constants.py file after every run,
this ensure the Python and Fortran bits are compatible with one another.

**Arguments**:

- `replace_dict` _Dict[str, int]]_ - Dict with keys to replace and their values
- `python_constants_file` _Path_ - Path to the target constant files.

<a id="uclchem.makerates.io_functions.write_species"></a>

#### write\_species

```python
def write_species(file_name: Path, species_list: list[Species]) -> None
```

Write the human readable species file. Note UCLCHEM doesn't use this file.

**Arguments**:

- `fileName` _str_ - path to output file
- `species_list` _list_ - List of species objects for network

<a id="uclchem.makerates.io_functions.write_reactions"></a>

#### write\_reactions

```python
def write_reactions(fileName, reaction_list) -> None
```

Write the human readable reaction file. Note UCLCHEM doesn't use this file.

**Arguments**:

- `fileName` _str_ - path to output file
- `reaction_list` _list_ - List of reaction objects for network

<a id="uclchem.makerates.io_functions.write_odes_f90"></a>

#### write\_odes\_f90

```python
def write_odes_f90(file_name: Path, species_list: list[Species],
                   reaction_list: list[Reaction], three_phase: bool) -> None
```

Write the ODEs in Modern Fortran. This is an actual code file.

**Arguments**:

- `file_name` _str_ - Path to file where code will be written
- `species_list` _list_ - List of species describing network
- `reaction_list` _list_ - List of reactions describing network
- `three_phase` _bool_ - Flag for whether this is a 3 phase network

<a id="uclchem.makerates.io_functions.write_jacobian"></a>

#### write\_jacobian

```python
def write_jacobian(file_name: Path, species_list: list[Species]) -> None
```

Write jacobian in Modern Fortran. This has never improved UCLCHEM's speed
and so is not used in the code as it stands.
Current only works for three phase model.

**Arguments**:

- `file_name` _str_ - Path to jacobian file
- `species_list` _species_list_ - List of species AFTER being processed by build_ode_string

<a id="uclchem.makerates.io_functions.build_ode_string"></a>

#### build\_ode\_string

```python
def build_ode_string(species_list: list[Species],
                     reaction_list: list[Reaction], three_phase: bool) -> str
```

A long, complex function that does the messy work of creating the actual ODE
code to calculate the rate of change of each species. Test any change to this code
thoroughly because ODE mistakes are very hard to spot.

**Arguments**:

- `species_list` _list_ - List of species in network
- `reaction_list` _list_ - List of reactions in network
- `three_phase` _bool_ - Bool denoting if this is a three phase network
  

**Returns**:

- `str` - One long string containing the entire ODE fortran code.

<a id="uclchem.makerates.io_functions.species_ode_string"></a>

#### species\_ode\_string

```python
def species_ode_string(n: int, species: Species) -> str
```

Build the string of Fortran code for a species once it's loss and gains
strings have been produced.

**Arguments**:

- `n` _int_ - Index of species in python format
- `species` _Species_ - species object
  

**Returns**:

- `str` - the fortran code for the rate of change of the species

<a id="uclchem.makerates.io_functions.write_evap_lists"></a>

#### write\_evap\_lists

```python
def write_evap_lists(network_file, species_list: list[Species]) -> None
```

Two phase networks mimic episodic thermal desorption seen in lab (see Viti et al. 2004)
by desorbing fixed fractions of material at specific temperatures. Three phase networks just
use binding energy and that fact we set binding energies in bulk to water by default.
This function writes all necessary arrays to the network file so these processes work.

**Arguments**:

- `network_file` _file_ - Open file object to which the network code is being written
- `species_list` _list[Species]_ - List of species in network

<a id="uclchem.makerates.io_functions.truncate_line"></a>

#### truncate\_line

```python
def truncate_line(input_string: str, lineLength: int = 72) -> str
```

Take a string and adds line endings at regular intervals
keeps us from overshooting fortran's line limits and, frankly,
makes for nicer ode.f90 even if human readability isn't very important

**Arguments**:

- `input_string` _str_ - Line of code to be truncated
- `lineLength` _int, optional_ - rough line length. Defaults to 72.
  

**Returns**:

- `str` - Code string with line endings at regular intervals

<a id="uclchem.makerates.io_functions.write_network_file"></a>

#### write\_network\_file

```python
def write_network_file(file_name: Path, network: Network)
```

Write the Fortran code file that contains all network information for UCLCHEM.
This includes lists of reactants, products, binding energies, formationEnthalpies
and so on.

**Arguments**:

- `file_name` _str_ - The file name where the code will be written.
- `network` _Network_ - A Network object built from lists of species and reactions.

<a id="uclchem.makerates.io_functions.find_reactant"></a>

#### find\_reactant

```python
def find_reactant(species_list: list[str], reactant: str) -> int
```

Try to find a reactant in the species list

**Arguments**:

- `species_list` _list[str]_ - A list of species in the network
- `reactant` _str_ - The reactant to be indexed
  

**Returns**:

- `int` - The index of the reactant, if it is not found, 9999

<a id="uclchem.makerates.io_functions.get_desorption_freeze_partners"></a>

#### get\_desorption\_freeze\_partners

```python
def get_desorption_freeze_partners(
        reaction_list: list[Reaction]) -> list[Reaction]
```

Every desorption has a corresponding freeze out eg desorption of `CO` and freeze of CO.
This find the corresponding freeze out for every desorb so that when desorb>>freeze
we can turn off freeze out in UCLCHEM.

**Arguments**:

- `reaction_list` _list_ - Reactions in network
  

**Returns**:

- `list` - list of indices of freeze out reactions matching order of desorptions.

<a id="uclchem.makerates.io_functions.array_to_string"></a>

#### array\_to\_string

```python
def array_to_string(name: str,
                    array: np.array,
                    type: str = "int",
                    parameter: bool = True) -> str
```

Write an array to fortran source code

**Arguments**:

- `name` _str_ - Variable name of array in Fortran
- `array` _iterable_ - List of values of array
- `type` _str, optional_ - The array's type. Must be one of "int","float", or "string".Defaults to "int".
- `parameter` _bool, optional_ - Whether the array is a Fortran PARAMETER (constant). Defaults to True.
  

**Raises**:

- `ValueError` - Raises an error if type isn't "int","float", or "string"
  

**Returns**:

- `str` - String containing the Fortran code to declare this array.

<a id="uclchem.makerates.reaction"></a>

# uclchem.makerates.reaction

<a id="uclchem.makerates.reaction.Reaction"></a>

## Reaction Objects

```python
class Reaction()
```

<a id="uclchem.makerates.reaction.Reaction.get_reactants"></a>

#### get\_reactants

```python
def get_reactants() -> list[str]
```

Get the four reactants present in the reaction, padded with NAN for nonexistent

**Returns**:

- `list[str]` - The four reactants names

<a id="uclchem.makerates.reaction.Reaction.get_sorted_reactants"></a>

#### get\_sorted\_reactants

```python
def get_sorted_reactants() -> list[str]
```

Get the four reactants present in the reaction, sorted for fast comparisons

**Arguments**:

- `reactants` _list[str]_ - The four sorted reactant names

<a id="uclchem.makerates.reaction.Reaction.set_reactants"></a>

#### set\_reactants

```python
def set_reactants(reactants: list[str]) -> None
```

Set the four reactants present in the reaction, padded with NAN for nonexistent

**Arguments**:

- `reactants` _list[str]_ - The four reactants names

<a id="uclchem.makerates.reaction.Reaction.get_products"></a>

#### get\_products

```python
def get_products() -> list[str]
```

Get the four products present in the reaction, padded with NAN for nonexistent

**Arguments**:

- `reactants` _list[str]_ - The four products names

<a id="uclchem.makerates.reaction.Reaction.get_sorted_products"></a>

#### get\_sorted\_products

```python
def get_sorted_products() -> list[str]
```

Get the four products present in the reaction, sorted for fast comparisons

**Arguments**:

- `products` _list[str]_ - The four sorted products names

<a id="uclchem.makerates.reaction.Reaction.set_products"></a>

#### set\_products

```python
def set_products(products: list[str]) -> None
```

Set the four products present in the reaction, padded with NAN for nonexistent

**Arguments**:

- `products` _list[str]_ - The four products names

<a id="uclchem.makerates.reaction.Reaction.get_alpha"></a>

#### get\_alpha

```python
def get_alpha() -> float
```

Get the alpha parameter from the Kooij-Arrhenius equation

**Returns**:

- `float` - the alpha parameter of the reaction

<a id="uclchem.makerates.reaction.Reaction.set_alpha"></a>

#### set\_alpha

```python
def set_alpha(alpha: float) -> None
```

Set the alpha parameter from the Kooij-Arrhenius equation

**Arguments**:

- `alpha` _float_ - the alpha parameter of the reaction

<a id="uclchem.makerates.reaction.Reaction.get_beta"></a>

#### get\_beta

```python
def get_beta() -> float
```

Get the beta parameter from the Kooij-Arrhenius equation

**Returns**:

- `float` - the beta parameter of the reaction

<a id="uclchem.makerates.reaction.Reaction.set_beta"></a>

#### set\_beta

```python
def set_beta(beta: float) -> None
```

Set the beta parameter from the Kooij-Arrhenius equation

**Arguments**:

- `beta` _float_ - the beta parameter of the reaction

<a id="uclchem.makerates.reaction.Reaction.set_gamma"></a>

#### set\_gamma

```python
def set_gamma(gamma: float) -> None
```

Set the gamma parameter from the Kooij-Arrhenius equation

**Arguments**:

- `gamma` _float_ - the gamma parameter of the reaction

<a id="uclchem.makerates.reaction.Reaction.get_gamma"></a>

#### get\_gamma

```python
def get_gamma() -> float
```

Get the gamma  parameter from the Kooij-Arrhenius equation

**Returns**:

- `float` - the gamma parameter of the reaction

<a id="uclchem.makerates.reaction.Reaction.set_templow"></a>

#### set\_templow

```python
def set_templow(templow: float) -> None
```

Set the lower temperature boundary of the reaction in Kelvin

**Arguments**:

- `templow` _float_ - the lower temperature boundary

<a id="uclchem.makerates.reaction.Reaction.get_templow"></a>

#### get\_templow

```python
def get_templow() -> float
```

Get the lower temperature boundary of the reaction in Kelvin

**Returns**:

- `float` - the lower temperature boundary

<a id="uclchem.makerates.reaction.Reaction.set_temphigh"></a>

#### set\_temphigh

```python
def set_temphigh(temphigh: float) -> None
```

Set the higher temperature boundary of the reaction in Kelvin

**Arguments**:

- `templow` _float_ - the higher temperature boundary

<a id="uclchem.makerates.reaction.Reaction.get_temphigh"></a>

#### get\_temphigh

```python
def get_temphigh() -> float
```

Get the higher temperature boundary of the reaction in Kelvin

**Returns**:

- `float` - the higher temperature boundary

<a id="uclchem.makerates.reaction.Reaction.NANCheck"></a>

#### NANCheck

```python
def NANCheck(a)
```

Convert any Falsy statement to a NAN string

**Arguments**:

- `a` - thing to check for falsiness
  

**Returns**:

- `bool` - input a if truthy, otherwise NAN

<a id="uclchem.makerates.reaction.Reaction.get_reaction_type"></a>

#### get\_reaction\_type

```python
def get_reaction_type() -> str
```

Get the type of a reaction from the reactants
First check the third reactant for a reaction type, then the second. If there are none
in there, it will be regarded as a two body reaction.

**Returns**:

  str:

<a id="uclchem.makerates.reaction.Reaction.get_source"></a>

#### get\_source

```python
def get_source() -> str
```

Get the source of the reaction

**Returns**:

- `str` - The source of the reaction

<a id="uclchem.makerates.reaction.Reaction.set_source"></a>

#### set\_source

```python
def set_source(source: str) -> None
```

Set the source of the reaction

**Arguments**:

- `source` _str_ - The source of the reaction

<a id="uclchem.makerates.reaction.Reaction.convert_to_bulk"></a>

#### convert\_to\_bulk

```python
def convert_to_bulk() -> None
```

Convert the surface species to bulk species in place for this reaction.

<a id="uclchem.makerates.reaction.Reaction.__eq__"></a>

#### \_\_eq\_\_

```python
def __eq__(other) -> bool
```

Check for equality against another reaction based on the products and reactants.
Note that it does not check for the temperature ranges that the reactions might have!
The Reaction.check_temperature_collision can be used for this purpose.

**Arguments**:

- `other` - Another reaction set.
  

**Returns**:

- `bool` - equality

<a id="uclchem.makerates.reaction.Reaction.check_temperature_collision"></a>

#### check\_temperature\_collision

```python
def check_temperature_collision(other) -> bool
```

Check if two reactions have overlapping temperature ranges, returning True means there is a collision.

**Arguments**:

- `other` - Another reaction
  

**Raises**:

- `NotImplementedError` - Currently we can only compare against instantiated Reaction objects.
  

**Returns**:

- `bool` - Whether there is a collision (True), or not (False)

<a id="uclchem.makerates.reaction.Reaction.changes_surface_count"></a>

#### changes\_surface\_count

```python
def changes_surface_count()
```

This checks whether a grain reaction changes number of particles on the surface
2 reactants to 2 products won't but two reactants combining to one will.

<a id="uclchem.makerates.reaction.Reaction.changes_total_mantle"></a>

#### changes\_total\_mantle

```python
def changes_total_mantle()
```

Check if the total grains on the mantle are changed by the reaction.

<a id="uclchem.makerates.reaction.Reaction.generate_ode_bit"></a>

#### generate\_ode\_bit

```python
def generate_ode_bit(i: int, species_names: list, three_phase: bool)
```

Every reaction contributes a fixed rate of change to whatever species it
affects. We create the string of fortran code describing that change here.

**Arguments**:

- `i` _int_ - index of reaction in network in python format (counting from 0)
- `species_names` _list_ - List of species names so we can find index of reactants in species list
- `three_phase` _bool_ - Bool indicating whether this is three phase network

