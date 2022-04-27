---
id: install
title: Installation
slug: /
---

## Obtaining UCLCHEM

You can visit our [main page](https://github.com/uclchem/UCLCHEM) to get download links for the code, or [our github](https://github.com/uclchem/UCLCHEM). Alternatively, you can use git to clone the repo directly from terminal.

```bash
git clone https://github.com/uclchem/UCLCHEM.git
```

## Compiling
UCLCHEM is designed to be compiled to a python library. Despite this, we cannot distribute it as a python package via pypi or similar because the user needs to be able to recompile their own version in order to change the network. The chemical network is hard coded for efficiency so it is not possible to change the network without recompiling.

In order to compile UCLCHEM, you will simply need to do the folowing from the main directory of the repository:

```bash
pip install .
```
This will install the UCLCHEM library into your python environment, you can then import it and use it in your python scripts. If you get an error at this stage, it is very likely you do not have Cmake or gfortran installed.

If it completes without error then, that's it! UCLCHEM is installed. We have tutorials on how to [run your first model](/docs/first_model) as well as more complex use cases. The rest of the 'Getting Started' section focuses on creating a network and the various parameters the user can control. We also have comprehensive documentation on the [python API](/docs/pythonapi).