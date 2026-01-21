# Parameters Reference

UCLCHEM models are controlled through a dictionary of parameters passed to model classes or functions. This page explains how to use parameters and provides quick reference.

## Quick Start

Parameters are passed as a dictionary to any UCLCHEM model:

```python
import uclchem

# Create a cloud model with custom parameters
cloud = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e4,      # Initial density (cm⁻³)
        "initialTemp": 10.0,     # Initial temperature (K)
        "finalTime": 1e6,        # End time (years)
        "freefall": True,        # Enable freefall collapse
        "finalDens": 1e7,        # Final density for freefall
    },
    out_species=["CO", "H2O", "CH3OH"]
)
```

Any parameter not specified will use its default value.

## Complete Parameter Reference

**All Fortran parameters are automatically documented at build time:**

- **{doc}`/api/fortran/index`** - Complete reference for all Fortran modules and parameters

This documentation is generated directly from the compiled code, ensuring it matches your installed version exactly.

## Runtime Introspection

You can also inspect parameters at runtime using the **{doc}`advanced API </api/uclchem/advanced/index>`**:

```python
import uclchem

# Get all parameter values
settings = uclchem.advanced.GeneralSettings()

# Print all parameters from defaultparameters module
settings.defaultparameters.print_settings()

# Access individual parameters
print(settings.defaultparameters.initialdens.get())  # 100.0
print(settings.defaultparameters.finaltime.get())    # 5000000.0

# List all available Fortran modules
settings.list_modules()
```

```{eval-rst}
.. currentmodule:: uclchem.parameters

- :class:`PhysicalParameters` - Density, temperature, radiation fields
- :class:`TimeParameters` - Simulation duration and freefall 
- :class:`ChemistryParameters` - Desorption and freeze-out controls
- :class:`AbundanceParameters` - Initial elemental abundances
- :class:`SolverParameters` - ODE integration tolerances (advanced)
- :class:`IOParameters` - File paths for input/output
- :class:`AdvancedParameters` - Desorption physics (experts only)

See :func:`get_all_parameters` to get all current values programmatically.
```

**Or browse the full API:** {doc}`/api/uclchem/parameters/index`

## Common Examples

### Basic Cloud Model

```python
# Static cloud at constant density
cloud = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e4,
        "initialTemp": 10.0,
        "finalTime": 1e6,
    }
)
```

### Collapsing Cloud

```python
# Cloud undergoing freefall collapse
cloud = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e2,
        "finalDens": 1e7,
        "freefall": True,
        "freefallFactor": 1.0,
        "endAtFinalDensity": True,
    }
)
```

### Custom Abundances

```python
# Cloud with custom carbon and oxygen abundances
cloud = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e4,
        "fc": 2.0e-4,  # Double carbon abundance
        "fo": 5.0e-4,  # Custom oxygen abundance
        "metallicity": 0.5,  # Scale all metals to 50% solar
    }
)
```

### Controlling Desorption

```python
# Turn off non-thermal desorption
cloud = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e4,
        "desorb": False,  # Master switch
        # Or control individually:
        # "h2desorb": False,
        # "crdesorb": False,  
        # "uvdesorb": False,
    }
)
```

## Tips and Best Practices

```{tip}
**Parameter names are case-insensitive**: You can write `initialDens`, `InitialDens`, or `INITIALDDENS` - they all work!
```

```{warning}
**Solver tolerances affect accuracy and speed**: 
- Decrease `reltol` for higher accuracy (but slower)
- If you get integration errors, see our {doc}`troubleshooting guide </user_docs/trouble-integration>`
```

```{note}
**Default values work for most cases**: You only need to specify parameters you want to change. All others use sensible defaults from the source code.
```

## Advanced Usage

### Saving and Loading Abundances

```python
# Save final abundances for later use
cloud1 = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e4,
        "finalTime": 1e6,
        "abundSaveFile": "my_abundances.dat"
    }
)

# Load those abundances as initial conditions for next stage
cloud2 = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e6,
        "abundLoadFile": "my_abundances.dat"
    }
)
```

### Multiple Output Files

```python
# Generate multiple output files
cloud = uclchem.model.Cloud(
    param_dict={
        "initialDens": 1e4,
        "outputFile": "full_output.dat",      # All species, all timesteps
        "columnFile": "selected_species.dat",  # Just out_species
        "ratesFile": "reaction_rates.dat",     # Reaction rates
    },
    out_species=["CO", "H2O", "CH3OH"]
)
```

## See Also

- **{doc}`/api/index`**: Complete API documentation with all parameters
- **{doc}`/tutorials/basics/index`**: Tutorial on running your first model
- **{doc}`/user_docs/trouble-integration`**: Integration troubleshooting
- **{doc}`/getting-started/installation`**: Installation instructions
