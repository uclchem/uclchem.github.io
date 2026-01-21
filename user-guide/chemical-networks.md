# Chemical Networks

UCLCHEM models gas-grain chemistry using reaction networks from either the UMIST Database for Astrochemistry or the KIDA kinetic database. The three-phase model tracks species in gas, surface, and bulk ice phases.

## Overview

UCLCHEM chemistry includes:

- **~10,000 reactions** from UMIST or KIDA databases
- **Gas-phase processes**: two-body reactions, photoprocesses, cosmic ray ionization
- **Grain surface chemistry**: Langmuir-Hinshelwood and Eley-Rideal mechanisms
- **Three-phase model**: species move between gas, surface, and bulk ice phases
- **Desorption mechanisms**: thermal, cosmic ray, and photodesorption

The network structure balances comprehensive coverage with computational efficiency. Most users work with the default network, but we support custom networks through the [MakeRates tool](makerates.md).

## Reaction Types

### Gas-Phase Chemistry

Gas-phase reactions dominate the early stages of cloud chemistry. UCLCHEM includes:

- **Two-body collisions**: e.g., `O + H2 → OH + H` with temperature-dependent rates
- **Photoprocesses**: UV photons dissociate and ionize species (e.g., `CO + γ → C + O`)
- **Cosmic ray ionization**: high-energy particles create ions (e.g., `H2 + CR → H2+ + e-`)
- **Associative detachment**: ion-electron recombination reactions

Rate coefficients follow modified Arrhenius forms: $k = \alpha \left(\frac{T}{300}\right)^\beta \exp\left(-\frac{\gamma}{T}\right)$ where $\alpha$, $\beta$, $\gamma$ come from laboratory measurements or quantum calculations.

See [Gas-Phase Chemistry](../user_docs/chem-gas.md) for detailed rate equations and reaction types.

### Grain Surface Chemistry

Once species freeze onto dust grains, surface chemistry becomes critical. Two mechanisms drive reactions:

**Langmuir-Hinshelwood (thermal diffusion)**  
Surface species hop between binding sites until they meet: `#H + #H → #H2`. The rate depends on diffusion barriers and surface temperature.

**Eley-Rideal (direct impact)**  
Gas-phase atoms hit surface species directly: `H(gas) + #H → #H2`. No diffusion needed.

The competition between diffusion, reaction, and desorption determines surface abundances. Light species (H, H2) diffuse quickly while heavy organics stay put.

See [Grain Surface Chemistry](../user_docs/chem-grain.md) for diffusion physics and rate calculations.

### Three-Phase Model

UCLCHEM tracks species in three distinct phases:

- **Gas**: normal molecular form (e.g., `CO`)
- **Surface**: bound to grain surface (e.g., `#CO` with prefix `#`)
- **Bulk**: buried in ice mantle (e.g., `@CO` with prefix `@`)

**Freeze-out** moves gas species to surfaces. **Swapping** moves surface species into the bulk as ice accumulates and vice versa. **Desorption** returns species to the gas phase through:

- **Thermal desorption**: temperature-dependent evaporation
- **Cosmic ray desorption**: particle impacts eject surface species
- **Photodesorption**: UV photons release surface molecules

This framework captures the chemistry of cold clouds (freeze-out dominates), warm cores (thermal desorption), and UV-irradiated regions (photodesorption).

See [Three-Phase Model](../user_docs/chem-bulk.md) and [Desorption Mechanisms](../user_docs/chem-desorb.md) for full details.

## Species Notation

UCLCHEM uses prefixes to denote phase:

- No prefix: gas-phase species (e.g., `H2O`)
- `#` prefix: surface species (e.g., `#H2O`)
- `@` prefix: bulk ice species (e.g., `@H2O`)
- `+` suffix: positive ions (e.g., `HCO+`)
- `-` suffix: negative ions (e.g., `C6H-`)

Neutral radicals have no special notation. Electronic state multiplicity (e.g., `C` vs `C*`) is not tracked — reactions use ground state rates.

See [Species Notation](../user_docs/chem-notation.md) for complete conventions.

## Network Databases

**UMIST Database for Astrochemistry**  
Gas-phase and grain surface reactions with rate coefficients from laboratory experiments. The current release is UMIST22 (2022).

**KIDA Database**  
The Kinetic Database for Astrochemistry. An alternative to UMIST with different reaction coverage and rate coefficients.

UCLCHEM uses either UMIST or KIDA as the base database, not both simultaneously. Choose based on your research requirements.

**Custom Networks**  
The [MakeRates tool](makerates.md) creates tailored networks: add reactions, update rate coefficients, or focus on specific chemical families (e.g., deuterium, sulfur).

## Practical Workflow

Most users follow this path:

1. **Start with the default network** — sufficient for most applications
2. **Analyze results** with the [Chemical Analysis tutorial](../notebooks/4_chemical_analysis.ipynb)
3. **If needed**, customize through [MakeRates](makerates.md)

The default network covers standard ISM chemistry: H/C/O/N/S elements, simple organics, and common ions. Specialized chemistry (e.g., PAHs, high-temperature reactions) requires custom networks.

## Getting Started

**Tutorials:**
- [First Model](../notebooks/1_first_model.ipynb) — Run chemistry with default network
- [Chemical Analysis](../notebooks/4_chemical_analysis.ipynb) — Interpret abundance outputs
- [Advanced Settings](../notebooks/6_advanced_settings.ipynb) — Customize chemistry parameters

**Customization:**
- [MakeRates Guide](makerates.md) — Create custom networks

**Detailed Documentation:**
Links above point to comprehensive descriptions of reaction physics, rate equations, and numerical methods.

```{seealso}
- [MakeRates Guide](makerates.md) for custom network creation  
- [Chemical Analysis Tutorial](../notebooks/4_chemical_analysis.ipynb) for interpreting results  
- [API Reference](../api/uclchem/index.rst) for programmatic access
```
