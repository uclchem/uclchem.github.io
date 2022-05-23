---
id: install
title: Installation
slug: /
---

## Prerequistes
### Obtaining UCLCHEM

You can visit our [main page](https://github.com/uclchem/UCLCHEM) to get download links for the code, or [our github](https://github.com/uclchem/UCLCHEM). Alternatively, you can use git to clone the repo directly from terminal.

```bash
git clone https://github.com/uclchem/UCLCHEM.git
```

### Software Requirements
You need to have the following software installed on your machine:
- Python 3.x
- GNU Make
- [GNU compilers](https://gcc.gnu.org/)

You will also need various python libraries but they will be installed if you follow the installation instructions below. Please note, UCLCHEM is installed by calling the `python3` command. If you have Python 3.x but your system only recognizes `python` as the command to use it, you should alias `python` to `python3` or update `src/fortran_src/Makefile` to use `python` anywhere it says `python3`.

Mac users are encourage to use Xcode to get the GNU compilers and Windows users are most likely to have success with the Windows Subsystem for Linux. See our [troubleshooting](/troubleshooting) page for more information if you encounter problems. 

## Installation
UCLCHEM is designed to be compiled to a python library. Despite this, we cannot distribute it as a python package via pypi or similar because the user needs to be able to recompile their own version in order to change the network. The chemical network is hard coded for efficiency so it is not possible to change the network without recompiling.

In order to compile UCLCHEM, you will simply need to do the folowing from the main directory of the repository:

```bash
cd UCLCHEM
pip install -r requirements.txt
pip install .
```
This will install the UCLCHEM library into your python environment, you can then import it and use it in your python scripts. If you get an error at this stage, it is very likely you do not have Cmake or gfortran installed. You must do this again every time you use [Makerates](/docs/network).

If it completes without error then, that's it! UCLCHEM is installed. We have tutorials on how to [run your first model](/docs/first_model) as well as more complex use cases. The rest of the 'Getting Started' section focuses on creating a network and the various parameters the user can control. 

## Checking Your Install
We provide several ways to get acquainted with the code including a series of [tutorials](/docs/category/tutorials). Alternatively, there are python scripts in `scripts/` that can be used as templates for running your own models and comprehensive documentation on the [python API](/docs/pythonapi) and [parameters](/docs/parameters).

However, if you simply want to check whether your new network is working, you can use the `scripts/run_uclchem_tests.py` and `scripts/plot_uclchem_tests.py` scripts. You can find outputs in the `examples/` directory along with an explanation of what this does.