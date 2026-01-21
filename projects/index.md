# Other Projects

Tools and projects in the UCLCHEM ecosystem, including active developments, legacy codes, and complementary software.

---

## Active Projects

### UCLCHEMCMC

**A MCMC inference tool for physical parameters of molecular clouds**  
[GitHub](https://github.com/Marcus-Keil/UCLCHEMCMC) • [Paper](https://arxiv.org/abs/2202.02343)

UCLCHEMCMC performs full forward modelling using chemistry and radiative transfer codes to calculate observable values that can be directly compared to observations. It runs Monte Carlo Markov Chain inference with a Bayesian likelihood function, storing models in a local database to improve performance for subsequent runs.

**Lead researcher:** Marcus Keil  
**Contributors:** S. Viti, J. Holdship  
**Funding:** European Union Horizon 2020 under Marie Skłodowska-Curie grant 811312 (ACO) and ERC grant MOPPEX 833460

---

### 3D-PDR

**Three-dimensional photodissociation region code**  
[GitHub](https://github.com/itamos-ism/3D-PDR) • [Documentation](https://itamos.readthedocs.io/en/latest/) • [Release Paper](http://adsabs.harvard.edu/abs/2012MNRAS.427.2100B)

3D-PDR uses the HEALpix ray-tracing scheme to solve a three-dimensional escape probability routine, evaluating FUV radiation attenuation and FIR/submm line propagation in photodissociation regions. The code is parallelized with OpenMP and includes three chemical networks (33, 58, and 128 species) along with molecular data and the Sundials solver.

3D-PDR is now maintained by **Zhejiang Lab** as part of the [ITAMOS project](https://itamos.readthedocs.io).

**Lead researcher:** Thomas G. Bisbas (@tbisbas)  
**Contributors:** Serena Viti, Michael J. Barlow, Jeremy Yates, Tom Bell, Brandt Gaches

```{note}
A cosmic-ray variant developed by Brandt Gaches is available in the repository. See [Gaches et al. (2019)](https://ui.adsabs.harvard.edu/abs/2019ApJ...878..105G).
```

---

### SpectralRadex

**Python-wrapped RADEX for line radiative transfer**  
[GitHub](https://github.com/uclchem/SpectralRadex) • [Documentation](https://spectralradex.readthedocs.io)

SpectralRadex uses numpy's F2PY to create a Python module that runs RADEX without subprocesses or input files. We updated the base code to modern Fortran, removing COMMON blocks for multiprocessing safety. Parameters are set via Python dictionaries, and results are returned as pandas DataFrames.

SpectralRadex extends RADEX by generating model spectra from excitation temperatures and optical depths, assuming Gaussian line profiles. This enables direct fitting of observational data without LTE assumptions.

---

### Neural PDR Emulators

**Machine learning emulators for fast astrochemistry**  
[NeuralPDR](https://github.com/uclchem/neuralpdr) • [AutoChemulator](https://github.com/uclchem/autochemulator)

Current emulator development focuses on **NeuralPDR**, a neural network emulator for photodissociation region chemistry. AutoChemulator, its predecessor, provides automated emulator generation for chemical networks.

These tools enable users to obtain chemical abundances and temperatures under varying physical conditions orders of magnitude faster than solving full chemical networks, making them suitable for embedding in hydrodynamical models.

---

## Legacy Software

The following codes are no longer actively maintained but remain available for reference and legacy use.

### UCLPDR

**One-dimensional PDR code** (Sunset)  
[GitHub](https://github.com/uclchem/uclpdr)

UCL_PDR treats UV and X-ray radiation with one- or two-sided radiation fields, arbitrary user-defined chemical networks, and line emission from any included species. It uses the Sundials package for ODE solving and is parallelized with OpenMP.

This code has been **sunset and is no longer supported**. We provide it for legacy purposes only. Users are encouraged to use 3D-PDR or other actively maintained codes.

**Original author:** Tom Bell  
**Contributors:** Felix Priestley, Serena Viti, Michael J. Barlow, Jeremy Yates

---

### Chemulator & Emulchem

**Legacy chemistry emulators** (Archived)  
[Chemulator](https://github.com/uclchem/Chemulator) • [Paper](https://arxiv.org/abs/2106.14789)  
[Emulchem](https://github.com/drd13/emulchem) • [Paper](https://arxiv.org/abs/1907.07472)

**Chemulator** (Holdship et al.) is a neural network emulator that calculates time-dependent temperatures and chemical abundances significantly faster than full chemical solvers, enabling embedding in hydrodynamical models.

**Emulchem** (de Mijolla et al.) provides statistical emulators for UCLCHEM and RADEX using neural networks to estimate abundances and line strengths under varying physical conditions.

Both projects are now **archived**. Current emulator development has moved to [NeuralPDR](https://github.com/uclchem/neuralpdr) and [AutoChemulator](https://github.com/uclchem/autochemulator).

---

## Related Tools

### NEATH

**Non-equilibrium chemistry for hydrodynamics**  
[GitHub](https://github.com/fpriestley/neath)

NEATH (Priestley et al.) couples time-dependent chemistry to hydrodynamical simulations. The core functionality of this work has been integrated into **UCLCHEM's Postprocessing module**, which allows users to apply UCLCHEM chemistry to hydrodynamical simulation outputs.

---

## Chemical Network Databases

Reference databases for building custom chemical networks with MakeRates:

- **[UMIST Database for Astrochemistry (UDfA)](https://udfa.ajmarkwick.net/)** — Gas-phase reaction rates  
  [Millar et al. (2024)](https://doi.org/10.1051/0004-6361/202346908) — *A&A* 682, A109
  
- **[KIDA Database](https://kida.astrochem-tools.org/)** — Kinetic database for astrochemistry  
  [Wakelam et al. (2024)](https://doi.org/10.1051/0004-6361/202450606) — *A&A* 689, A63

---

## Contributing Your Project

We welcome additions to the UCLCHEM ecosystem. If you have developed a tool that uses or extends UCLCHEM:

1. [Open an issue](https://github.com/uclchem/UCLCHEM/issues) describing your project
2. Include: project name, repository link, brief description, and relevant publications
3. We'll review and add it to this page

```{seealso}
- [Papers](../papers/index.md) for publications using UCLCHEM
- [Contributing](../contributing/index.md) to contribute code to UCLCHEM itself
```
