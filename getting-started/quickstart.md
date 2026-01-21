# Quickstart Guide

This guide will walk you through running your first UCLCHEM model in less than 5 minutes.

## Your First Model

Let's model a simple molecular cloud using UCLCHEM's object-oriented interface:

```python
import uclchem

# Define model parameters
params = {
    "initialDens": 1e4,      # Initial density (cm^-3)
    "initialTemp": 10.0,     # Initial temperature (K)
    "finalTime": 1e6,        # Simulation duration (years)
    "freefall": False        # Static cloud (no collapse)
}

# Create and run a Cloud model
cloud = uclchem.model.Cloud(
    param_dict=params,
    out_species=["CO", "H2O", "CH3OH"]
)

# Check if the model ran successfully
cloud.check_error()

# Access final abundances for requested species
print(f"Final CO abundance: {cloud.final_abundances['CO']:.2e}")
print(f"Final H2O abundance: {cloud.final_abundances['H2O']:.2e}")
print(f"Final CH3OH abundance: {cloud.final_abundances['CH3OH']:.2e}")
```

```{note}
The first run may take a minute as Python imports the compiled Fortran modules. Subsequent runs are faster.
```

## Understanding the Model Object

When you create a `Cloud` object, UCLCHEM automatically:
1. Validates your parameters
2. Runs the chemical model
3. Stores all results in the object

Key attributes you can access:
- `cloud.success_flag` - 0 if successful, negative if error
- `cloud.final_abundances` - Dict of abundances for `out_species`
- `cloud.physics_array` - All physical parameters vs time
- `cloud.chemical_abun_array` - All species abundances vs time

## Getting Time-Resolved Data

The Cloud object provides methods to access and analyze your results:

```python
import matplotlib.pyplot as plt

# Get results as a pandas DataFrame
df = cloud.get_dataframes()

# Plot CO abundance over time
fig, ax = plt.subplots(figsize=(8, 5))
ax.loglog(df['Time'], df['CO'])
ax.set_xlabel('Time (years)')
ax.set_ylabel('CO Abundance')
ax.set_title('CO Evolution in Static Cloud')
ax.grid(True, alpha=0.3)
plt.show()
```

Or use the built-in plotting method:

```python
# Quick abundance plot
fig, ax = cloud.create_abundance_plot(
    species=["CO", "H2O", "$H2O", "CH3OH", "$CH3OH"],
    figsize=(10, 6)
)
```

```{tip}
The `$` symbol gets total ice abundances. For example, `$H2O` gives the total H2O frozen on grains.
```

## Checking Model Quality

Always verify that your model conserved elements correctly:

```python
# Check elemental conservation
cloud.check_conservation(element_list=["H", "C", "N", "O", "S"])
```

This prints the conservation error as a percentage. Values < 1% are generally acceptable. If conservation is poor, try adjusting the solver tolerances:

```python
params = {
    "initialDens": 1e4,
    "initialTemp": 10.0,
    "finalTime": 1e6,
    "reltol": 1e-6,    # Tighter relative tolerance
    "abstol": 1e-12    # Tighter absolute tolerance
}
```

## Different Physics Models

UCLCHEM includes several physics model classes:

::::{grid} 1 1 2 2
:gutter: 3

:::{grid-item-card} Cloud
```python
cloud = uclchem.model.Cloud(...)
```
Static or collapsing spherical cloud
:::

:::{grid-item-card} Collapse
```python
collapse = uclchem.model.Collapse(...)
```
Specific collapse profiles (Bonnor-Ebert, filament, etc.)
:::

:::{grid-item-card} CShock
```python
shock = uclchem.model.CShock(...)
```
C-type magnetohydrodynamic shock
:::

:::{grid-item-card} JShock
```python
shock = uclchem.model.JShock(...)
```
J-type shock discontinuity
:::

::::

## Key Parameters

Here are the most commonly used parameters:

| Parameter | Description | Typical Values |
|-----------|-------------|----------------|
| `initialDens` | Initial gas density (cm⁻³) | 10² - 10⁶ |
| `initialTemp` | Initial temperature (K) | 10 - 300 |
| `finalTime` | Simulation end time (years) | 10⁴ - 10⁷ |
cloud = uclchem.model.Cloud(
    param_dict=params,
    out_species=["H2O", "CO", "CH3OH"]
)
```

### 2. Collapsing Cloud

Model chemistry during gravitational collapse:

```python
params = {
    "initialDens": 1e2,
    "finalDens": 1e5,
    "initialTemp": 10.0,
    "finalTime": 1e6,
    "freefall": True  # Enable collapse
}

cloud = uclchem.model.Cloud(param_dict=params, out_species=["CO"])
```

### 3. Multi-Phase Chemistry

Chain models together using previous results:

```python
# Phase 1: Cold cloud chemistry
cold_cloud = uclchem.model.Cloud(
    param_dict={"initialTemp": 10.0, "finalTime": 1e6},
    out_species=["H2O", "$H2O"]
)

# Phase 2: Use previous model's final abundances as starting point
# The next_starting_chemistry provides the final abundances
warm_cloud = uclchem.model.Cloud(
    param_dict={"initialTemp": 50.0, "finalTime": 1e5},
    starting_chemistry=cold_cloud.next_starting_chemistry,
    out_species=["H2O", "$H2O"]
)
The model object provides built-in error checking:

```python
cloud = uclchem.model.Cloud(param_dict=params, out_species=["CO"])

# Check for errors
cloud.check_error()  # Prints detailed error message if success_flag < 0

# Or manually check the flag
if cloud.success_flag == 0:
    print("✓ Model ran successfully")
else:
    print(f"✗ Error code: {cloud.success_flag}")
    cloud.check_error()
```

Common error codes:
- `0`: Success
- `-1`: DVODE integrator failed
- `-2`: Negative abundances encountered
- `-4`/`-5`: Integration tolerance issues

## Saving and Loading Results

Save model results to disk:

```python
# Save abundances to a file during the run
params = {
    "initialDens": 1e4,
    "initialTemp": 10.0,
    "finalTime": 1e6,
    "outputFile": "cloud_output.dat",        # All timesteps
    "abundSaveFile": "final_abundances.dat"  # Final abundances only
}

cloud = uclchem.model.Cloud(param_dict=params)
```

Load a previous model from file:

```python
# Load a previously saved model
cloud = uclchem.model.Cloud(read_file="cloud_output.dat")

# Access the data
df = cloud.get_dataframes(
shock = uclchem.model.CShock(
    param_dict=params,
    out_species=["H2", "CO", "SiO"]


# First phase: cold chemistry
result1 = uclchem.model.cloud(param_dict=params, out_species=["H2O"])

# Second phase: warm-up (requires different model)
# See tutorials for complete example
```

### 3. Shock Chemistry

Model chemistry in a C-type shock:

```python
params = {
    "initialDens": 1e3,
    "initialTemp": 10.0,
    "shockVelocity": 20.0,  # km/s
    "finalTime": 1e5
}

result = uclchem.model.cshock(param_dict=params, out_species=["H2", "CO"])
```

## Error Handling

Check the success flag to handle errors:

```python
result = uclchem.model.cloud(param_dict=params, out_species=["CO"])

if result[0] == 0:Always run `cloud.check_error()` and `cloud.check_conservation()` after each model.
```

```{tip}
**Use objects**: The object-oriented interface makes it easy to chain models and analyze results.
```

```{tip}
**Access everything**: Model objects store all parameters, arrays, and results for easy inspection
    print("✗ Negative abundances encountered")
else:
    error_msg = uclchem.utils.check_error(result[0])
    print(f"✗ Error: {error_msg}")
```

## Next Steps

Now that you've run your first model, explore:

::::{grid} 1 1 2 2
:gutter: 2

:::{grid-item-card} 📓 Tutorials
:link: ../tutorials/index
:link-type: doc

Detailed notebook tutorials with visualizations
:::

:::{grid-item-card} 🔧 Parameters
:link: ../user-guide/parameters
:link-type: doc

Complete parameter reference
:::

:::{grid-item-card} 🔬 Analysis
:link: ../notebooks/4_chemical_analysis
:link-type: doc

Analyze reaction pathways
:::

:::{grid-item-card} 📖 API Docs
:link: ../api/index
:link-type: doc

Full Python API reference
:::

::::

## Tips for Success

```{tip}
**Start simple**: Begin with default parameters and add complexity gradually.
```

```{tip}
**Check convergence**: If the integrator fails, try decreasing `reltol` and `abstol`.
```

```{tip}
**Save your work**: Use `outputFile` parameter to save results to disk.
```

```{warning}
**Network changes**: After running MakeRates to change your chemical network, you must reinstall UCLCHEM with `pip install .`
```
