# Table of Contents

* [uclchem](#uclchem)
  * [run\_model](#uclchem.run_model)
  * [run\_model\_for\_abundances](#uclchem.run_model_for_abundances)
  * [get\_species\_rates](#uclchem.get_species_rates)
  * [read\_output\_file](#uclchem.read_output_file)
  * [create\_abundance\_plot](#uclchem.create_abundance_plot)
  * [plot\_species](#uclchem.plot_species)
  * [param\_dict\_from\_output](#uclchem.param_dict_from_output)
  * [get\_rates\_of\_change](#uclchem.get_rates_of_change)
  * [count\_element](#uclchem.count_element)
  * [total\_element\_abundance](#uclchem.total_element_abundance)
  * [check\_element\_conservation](#uclchem.check_element_conservation)

<a id="uclchem"></a>

# uclchem

<a id="uclchem.run_model"></a>

#### run\_model

```python
def run_model(param_dict)
```

Run UCLCHEM using variables taking from a dictionary of parameter values. Any parameter
not included in the dictionary will be taken from defaultparameters.f90.

**Arguments**:

- `param_dict`: A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.

<a id="uclchem.run_model_for_abundances"></a>

#### run\_model\_for\_abundances

```python
def run_model_for_abundances(param_dict)
```

Run UCLCHEM, returning the abundances of up to 50 species at the end of the run. The species that will be returned are those from the `outSpecies` parameter.

**Arguments**:


- `param_dict`: A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.

**Returns**:

(ndarray) Array of abundances of all species in `outSpecies`

<a id="uclchem.get_species_rates"></a>

#### get\_species\_rates

```python
def get_species_rates(param_dict, input_abundances, reac_indxs)
```

Get the rate of up to 500 reactions from UCLCHEM for a given set of parameters and abundances.
Intended for use within the analysis script.

**Arguments**:


- `param_dict`: A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
- `input_abundances`: Abundance of every species in network
- `reac_indxs`: Index of reactions of interest in the network's reaction list.

**Returns**:

(ndarray) Array containing the rate of every reaction specified by reac_indxs

<a id="uclchem.read_output_file"></a>

#### read\_output\_file

```python
def read_output_file(output_file)
```

Read the output of a UCLCHEM run created with the outputFile parameter into a pandas DataFrame

**Arguments**:


- `output_file`: - (str) path to file containing a full UCLCHEM output

**Returns**:

(dataframe) A dataframe containing the abundances and physical parameters of the model at every time step.

<a id="uclchem.create_abundance_plot"></a>

#### create\_abundance\_plot

```python
def create_abundance_plot(df, species, plot_file=None)
```

Produce a plot of the abundances of chosen species through time, returning the pyplot
figure and axis objects

**Arguments**:


- `df`: A dataframe created by `read_output_file`
- `species`: A list of species names to be plotted
- `plot_file`: optional argument with path to file where the plot should be saved

**Returns**:

fig (matplotlib figure) A figure object and ax (matplotlib axis) An axis object which contains the plot

<a id="uclchem.plot_species"></a>

#### plot\_species

```python
def plot_species(ax, df, species)
```

Plot the abundance of several species through time onto an existing pyplot axis

**Arguments**:


- `ax`: pyplot axis on which to plot
- `df`: A dataframe created by `read_output_file`
- `species`: A list of species names to be plotted

**Returns**:

ax (matplotlib ax) The input axis is returned

<a id="uclchem.param_dict_from_output"></a>

#### param\_dict\_from\_output

```python
def param_dict_from_output(output_line)
```

Generate a parameter dictionary with enough variables to correctly estimate the rates of
reactions.

**Arguments**:

- `output_line`: (pandas series) any row from the relevant UCLCHEM output

<a id="uclchem.get_rates_of_change"></a>

#### get\_rates\_of\_change

```python
def get_rates_of_change(rates, reactions, speciesList, species, row)
```

Calculate the terms in the rate of equation of a particular species using rates calculated using
get_species_rates() and a row from the full output of UCLCHEM. See `analysis.py` for intended use.

**Arguments**:

- `rates`: (ndarray) Array of all reaction rates for a species, as obtained from `get_species_rates`
- `reactions`: (ndarray) Array containing reactions as lists of reactants and products
- `speciesList`: (ndarray) Array of all species names in network
- `species`: (str) Name of species for which rates of change are calculated
- `row`: (panda series) The UCLCHEM output row from the time step at which you want the rate of change

<a id="uclchem.count_element"></a>

#### count\_element

```python
def count_element(species_list, element)
```

Count the number of atoms of an element that appear in each of a list of species,
return the array of counts

**Arguments**:


- `species_list`: (iterable, str), list of species names
- `element`: (str), element

**Returns**:

sums (ndarray) array where each element represents the number of atoms of the chemical element in the corresponding element of species_list

<a id="uclchem.total_element_abundance"></a>

#### total\_element\_abundance

```python
def total_element_abundance(element, df)
```

Calculates that the total elemental abundance of a species as a function of time. Allows you to check conservation.

**Arguments**:


- `element`: (str) Element symbol. eg "C"
- `df`: (pandas dataframe) UCLCHEM output in format from `read_output_file`

**Returns**:

Series containing the total abundance of an element at every time step of your output

<a id="uclchem.check_element_conservation"></a>

#### check\_element\_conservation

```python
def check_element_conservation(df)
```

Check the conservation of major element by comparing total abundance at start and end of model

**Arguments**:


- `df`: (pandas dataframe): UCLCHEM output in format from `read_output_file`

**Returns**:

(dict) Dictionary containing the change in the total abundance of each element as a fraction of initial value

