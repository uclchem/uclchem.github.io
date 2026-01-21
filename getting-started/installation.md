# Installation

## Obtaining UCLCHEM

You can visit our [main page](https://github.com/uclchem/UCLCHEM) to get download links for the code, or [our github](https://github.com/uclchem/UCLCHEM). Alternatively, you can use git to clone the repo directly from terminal (preferred).

```bash
git clone https://github.com/uclchem/UCLCHEM.git
```

Or if you have your ssh keys set up correctly:

```bash
git clone git@github.com:uclchem/uclchem
```

## General Software Requirements

You need to have the following software installed on your machine:

- Python 3.10 or later
- A fortran compiler (the current default is gfortran)

You will also need various python libraries but they will be installed automatically by pip.

## Prior to Installation on Apple and Windows

Mac users are encouraged to use Xcode to get the GNU compilers and Windows users are most likely to have success with the Windows Subsystem for Linux. See our [troubleshooting](../user_docs/trouble-compile.md) page for more information if you encounter problems. For Mac users with Apple silicon, special installation instructions are listed below.

## Prior to Installation on Apple and Windows

Mac users are encouraged to use Xcode to get the GNU compilers and Windows users are most likely to have success with the Windows Subsystem for Linux. See our [troubleshooting](../user_docs/trouble-compile.md) page for more information if you encounter problems. For Mac users with Apple silicon, special installation instructions are listed below.

### Apple General

First, ensure that you install Xcode before anything else. This contains the libraries etc we need to run UCLCHEM. A tutorial is not provided, but can be found here: https://developer.apple.com/documentation/safari-developer-tools/installing-xcode-and-simulators

You might additionally be required to install the Xcode Command Line Tools.

### Apple Silicon / M1 / M2

For this use case we recommend the usage of the package manager conda (the installer for the minimal version can be found [here](https://docs.conda.io/en/latest/miniconda.html)).

```{important}
Ensure you obtain the most recent fortran version by using conda-forge: `-c conda-forge`. These fortran builds are more recent and up to date with new macOS versions. Learn more about conda forge here: https://conda-forge.org/docs/
```

```bash
conda create -n uclchem_osx
conda activate uclchem_osx
conda config --env --set subdir osx-arm64
conda install python=3.12
conda install -c conda-forge gfortran
```

After this, one can continue with the installation instructions below. In order to use UCLCHEM in a new terminal session one has to use the command `conda activate uclchem_osx`.

### Apple Intel

Similar instructions as for M1, but now with the x86_64 instruction set. Again this requires Xcode.

```bash
conda create -n uclchem_osx
conda activate uclchem_osx
conda config --env --set subdir osx-64
conda install python=3.12
conda install clang gfortran
```

After this, one can continue with the installation instructions below. In order to use UCLCHEM in a new terminal session one has to use the command `conda activate uclchem_osx`.

If you encounter further issues please check [troubleshooting](../user_docs/trouble-compile.md).

### Windows Subsystem for Linux

Open a PowerShell as an administrator and type `wsl --install` to install the Windows Subsystem for Linux. It will then ask you to reboot. Once you've done this, you'll find Ubuntu in your Windows App Store. Installing this Ubuntu app will give you access to a terminal that is indistinguishable from one running on a Linux system but it will have access to all your Windows files. You can set up your linux environment with all necessary tools:

```bash
sudo apt update
sudo apt install make python3-pip gfortran
```

and then you'll find your files in /mnt. For example, your C: drive can be accessed via `cd /mnt/c`. With the above tools installed, you'll be able to follow our basic install instructions and run UCLCHEM via your Ubuntu installation.

## Installation

UCLCHEM is designed to be compiled to a python library. Despite this, we cannot distribute it as a python package via pypi or similar because the user needs to be able to recompile their own version in order to change the network. The chemical network is hard coded for efficiency so it is not possible to change the network without recompiling.

In order to compile UCLCHEM, you will simply need to do the following from the main directory of the repository:

```bash
cd UCLCHEM
pip install .
```

This will install the UCLCHEM library into your python environment, you can then import it and use it in your python scripts. If you get an error at this stage, it is very likely you do not have some dependency installed. You must do this again every time you use [Makerates](../user-guide/makerates.md).

If it completes without error then, **that's it! UCLCHEM is installed.** We have tutorials on how to [run your first model](../tutorials/first-model.md) as well as more complex use cases. The rest of the 'Getting Started' section focuses on creating a network and the various parameters the user can control.

## Checking Your Install

We provide several ways to get acquainted with the code including a series of [tutorials](../tutorials/index.md). Alternatively, there are python scripts in `scripts/` that can be used as templates for running your own models and comprehensive documentation on the [Python API](../api/index.md) and [parameters](../user-guide/parameters.md).

However, if you simply want to check whether your new network is working, you can use the `scripts/run_uclchem_tests.py` and `scripts/plot_uclchem_tests.py` scripts. You can find outputs in the `examples/` directory along with an explanation of what this does.

## Development Installation

If you plan to modify UCLCHEM or contribute to development:

```bash
cd UCLCHEM
pip install -e .
```

Editable mode (`-e`) means changes to Python files take effect immediately without reinstalling.

```{warning}
After modifying the chemical network or Fortran code, you must reinstall:
\`\`\`bash
pip install .
\`\`\`
```

## Updating UCLCHEM

To update to the latest version:

```bash
cd UCLCHEM
git pull
pip install --force-reinstall .
```

## Next Steps

Now that UCLCHEM is installed:

1. Try the [Quickstart Guide](quickstart.md)
2. Explore [Tutorials](../tutorials/index.md)
3. Read about [Model Parameters](../user-guide/parameters.md)

