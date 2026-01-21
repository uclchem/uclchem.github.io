# MakeRates Guide

MakeRates is UCLCHEM's preprocessing tool for generating custom chemical networks. It combines reaction databases with user-defined species and reactions, producing the Fortran and human readable files required to compile a network into UCLCHEM. This guide explains how to create and modify networks for your research.

## Why MakeRates?

Chemical networks define the reactions that occur in astrochemical models. Different research questions require different networks; You might want extensive ice chemistry, isotopologues or just simple gas phase chemistry. MakeRates allows users to:

- Start from established gas phase databases (UMIST, KIDA)
- Add custom grain surface reactions
- Include specific species that you want to simulate
- Generate multi-phase networks (gas, surface, bulk ice)
- Produce both machine-readable (Fortran) and human-readable (CSV) outputs

We do not endorse any particular network. Users must evaluate whether a network suits their scientific goals. The default network serves as an example, not a recommendation.

## Basic Workflow

Ensure you have uclchem installed. Whenever you modify your network, run MakeRates and reinstall UCLCHEM. By default it will use the `user_settings.yaml`.

```bash
cd Makerates
python MakeRates.py
cd ..
pip install .
```

The final `pip install .` is essential — it recompiles UCLCHEM with your new network. Each UCLCHEM installation can only contain one network at a time, which is why we recommend using conda environments or virtual environments to manage multiple networks.

## Configuration: user_settings.yaml

MakeRates reads its configuration from `Makerates/user_settings.yaml`. The default settings are:

```yaml
# Your list of all species
species_file: data/default/default_species.csv

# Core reactions from gas phase database
database_reaction_file: data/databases/umist22.csv
database_reaction_type: UMIST

# Additional reactions (e.g., grain network)
custom_reaction_file: data/default/default_grain_network.csv
custom_reaction_type: UCL

# Extrapolate rates beyond measured temperature range
extrapolate: True
```

### Key Parameters

**species_file**: CSV list of species with mass, binding energy, and enthalpy of formation. MakeRates validates masses and alerts you to discrepancies.

**database_reaction_file**: Your primary reaction database. Most users choose UMIST or KIDA. Set `database_reaction_type` to `UMIST`, `KIDA`, or `UCL` depending on the file format.

**custom_reaction_file**: Additional reactions, typically grain surface chemistry. Uses the same format as UCL-style reaction lists.

**extrapolate**: Extends rates beyond measured temperature ranges. We recommend enabling this, since many modern rate measurements cover narrow ranges (~100 K). Without extrapolation, rates become zero outside the measured range, which can cause unphysical results. 

**output_directory** (optional): If specified, MakeRates writes files to this directory instead of copying them directly to `src/`. Useful for testing networks without modifying your working installation.

## Creating Custom Networks

### Species List Format

Each row defines one species with its properties:

```csv
C,12,0,0,0,0,0
#CH4,16,960,0,0.7,0.667,-15.9
```

**Gas phase species** (no prefix): Set mass; leave other values as zero.  
**Surface species** (`#` prefix): Add binding energy (K) and enthalpy of formation (kcal/mol).  
**Bulk species** (`@` prefix): Derived from the Surface species for your convinience.

### Reaction List Format

Each row specifies one reaction:

```csv
reactant1,reactant2,reactant3,product1,product2,product3,product4,alpha,beta,gamma,Tmin,Tmax
```

**Reactants**: Up to 3 species. The third can be a keyword (`ER`, `LH`, `FREEZE`, `DESORB`) to specify reaction type.  
**Products**: Up to 4 species.  
**Rate coefficients**: `alpha`, `beta`, `gamma` for temperature-dependent rates.  
**Temperature range**: Optional `Tmin` and `Tmax` (K). Useful when multiple versions of the same reaction apply at different temperatures.

### Common reaction keywords for the UCLCHEM format:

**ER** (Eley-Rideal): Gas-phase species reacts with surface species.  
**LH** (Langmuir-Hinshelwood): Two surface species react.  
**FREEZE**: Overrides default freeze-out products (e.g., `H3O+` → `#H2O` + `H`).  
**DESORB**: Overrides default desorption products.

You can additionally specify UMIST/KIDA style reactions with different reaction mechanisms. For examples, see the default `default_reactions.csv` file.


## Three-Phase Chemistry

By default, UCLCHEM only supports three-phase chemistry anymore, with limited support for 2-phase chemistry. This means your configuration will model gas, surface, and bulk ice separately. MakeRates will:

- Duplicate surface species and reactions for the bulk (with `@` prefix)
- Set bulk binding energies to match H₂O (unless overridden in species file)
- Add transfer terms between surface and bulk, to account for the geometric effect of the ice growing as well as (thermal) swapping of species.

**Example**: `H2O` (gas), `#H2O` (surface), `@H2O` (bulk).

## What MakeRates Does

1. Combines database and custom reaction lists
2. Filters reactions containing species not in your species list
3. Adds freeze-out and desorption for all species
4. Creates branching reactions for chemical desorption (ER/LH keywords)
5. Generates three-phase species and reactions if enabled
6. Validates network consistency and reports issues
7. Writes Fortran source files to `src/fortran_src/`
8. Produces human-readable CSV outputs

## Output Files

MakeRates generates files in `src/` (or your specified `output_directory`):

**network.f90**: Fortran arrays with species properties and reaction coefficients.  
**odes.f90**: Rate-of-change equations for the ODE solver.  
**species.csv**: Human-readable species list with all properties used by uclchem
**reactions.csv**: Human-readable reaction list with reactants, products, and rates used by uclchem.

After running MakeRates, `pip install .` compiles these files into your UCLCHEM installation.

## Advanced Features

Beyond the basic workflow, MakeRates supports several advanced chemistry options through `user_settings.yaml`:

### Command-Line Options

MakeRates accepts command-line arguments for flexibility:

```bash
# Use a custom config file
python MakeRates.py my_custom_settings.yaml

# Enable debug output
python MakeRates.py --debug

# Generate a template config file
python MakeRates.py --generate-template

# Show detailed help for all parameters
python MakeRates.py --help-config
```

### Exothermicity and Heating/Cooling

Calculate reaction heating from exothermic reactions to model temperature changes:

**derive_reaction_exothermicity**: Automatically computes reaction heat release from species binding energies and formation enthalpies. Set to `true` (all reactions), or specify reaction types:

```yaml
# Calculate exothermicity for gas-phase reactions only
derive_reaction_exothermicity: "GAS"

# Or for multiple types
derive_reaction_exothermicity:
  - "GAS"
  - "TWOBODY"
```

**database_reaction_exothermicity**: Use pre-calculated exothermicity values from external files:

```yaml
database_reaction_exothermicity: "data/custom_enthalpies.csv"
```

Both features automatically enable `enable_rates_storage: true` to track individual reaction rates during integration.

### Grain Surface Chemistry Extensions

**add_crp_photo_to_grain**: Adds cosmic ray and UV photon-induced reactions to grain surface species:

```yaml
add_crp_photo_to_grain: true
```

This enables cosmic ray desorption, photodesorption, and grain-surface photochemistry — critical for UV-irradiated regions.

**gas_phase_extrapolation**: Enables the extrapolation of the rates beyond their measured range

```yaml
gas_phase_extrapolation: true
```

For gas-phase reactions modern databases sometimes have tight bounds on their measured range. With
this setting on, which we recommend with UMIST22, you extrapolate beyond the measured boundaries. 
Otherwise the reaction is assumed to have rate 0 outside the measured ranges.

**grain_assisted_recombination_file**: Provides parameters for grain-assisted recombination (GAR) reactions where ions recombine on dust grains:

```yaml
grain_assisted_recombination_file: "data/gar_parameters.csv"
```

Required if your network includes GAR reactions. The file specifies ion-specific recombination rates.

### Performance and Analysis

**enable_rates_storage**: Stores individual reaction rates during integration:

```yaml
enable_rates_storage: true
```

This increases memory usage and compilation time but enables detailed post-processing: identifying dominant formation/destruction pathways, plotting reaction rates over time, and analyzing chemical bottlenecks. Automatically enabled when using exothermicity features. These rates can be recontrusted
using uclchem analyiss modules after runtime with the rates loaded interactively as shown in 
[Tutorial 6](../notebooks/4_chemical_analysis.ipynb)

**output_directory**: Write generated files to a custom directory instead of `src/fortran_src/`:

```yaml
output_directory: "test_networks/my_network/"
```

Useful for testing networks without overwriting your working installation.

### Multiple Reaction Files

Combine multiple databases or add incremental reactions:

```yaml
database_reaction_file:
  - "data/databases/umist12.csv"
  - "data/databases/kida_supplement.csv"
database_reaction_type:
  - "UMIST"
  - "KIDA"

custom_reaction_file:
  - "data/my_grain_network.csv"
  - "data/additional_photochem.csv"
custom_reaction_type:
  - "UCL"
  - "UCL"
```

Each file is read sequentially and merged. Later files can override earlier reactions.

### Example Advanced Configuration

```yaml
species_file: "data/deuterium_species.csv"

database_reaction_file: "data/databases/umist12.csv"
database_reaction_type: "UMIST"

custom_reaction_file: 
  - "data/default/default_grain_network.csv"
  - "data/deuterium_fractionation.csv"
custom_reaction_type: 
  - "UCL"
  - "UCL"

# Enable advanced chemistry
add_crp_photo_to_grain: true
gas_phase_extrapolation: false
derive_reaction_exothermicity: "GAS"

# Performance
enable_rates_storage: true
output_directory: "networks/deuterium_test/"
```

This configuration builds a deuterium fractionation network with cosmic ray grain chemistry and gas-phase heating calculations.

## Best Practices

- **Version control your YAML file**: Track which network configuration produced which results.
- **Test incrementally**: Add or remove species and reactions in small batches. Rebuild and test each time. Ensure your network runs efficiently and remains computable, not introducing sink species (species with only pathways of formation and no efficient pathway of destruction).
- **Validate against known results**: Compare your custom network's output to published models before using it in research. We include `scripts/{plot,run}_uclchem_tests` for this purpose.
- **Use python/conda environments**: Maintain separate environments for different network installs to avoid reinstalling repeatedly.
- **Check warnings**: MakeRates alerts you to missing species, duplicate reactions, and mass inconsistencies. Address these before proceeding.
- **Supersets are better than subsets**: If you want to investigate reaction networks themselves, UCLCHEM provides an interface to edit any reaction parameter at runtime, including removing reactions by setting their rates to zero. The other way around is harder — adding a reaction always means recompiling. See the advanced interface in [Advanced Settings Tutorial](../notebooks/6_advanced_settings.ipynb).
- **Start simple for exothermicity**: Calculate exothermicity for gas-phase reactions first (`derive_reaction_exothermicity: "GAS"`), then expand to grain chemistry once validated.

## Further Reading

For detailed chemistry descriptions, see:
- [Chemical Networks Overview](chemical-networks.md)
- [Grain Surface Chemistry](../user_docs/chem-grain.md)
- [Bulk Ice Chemistry](../user_docs/chem-bulk.md)
- [Freeze-out and Desorption](../user_docs/chem-desorb.md)
- [MakeRates README](https://github.com/uclchem/UCLCHEM/tree/main/Makerates) in the repository
- [Advanced Settings Tutorial](../notebooks/6_advanced_settings.ipynb) for runtime network manipulation
- [Customization Tutorials](../tutorials/customization/index.md) for examples
```
