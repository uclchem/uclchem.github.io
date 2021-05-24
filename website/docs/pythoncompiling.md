---
id: pythoncompiling
title: Compiling for Python
---

## Compiling

UCLCHEM can be compiled as a Python library, you'll need F2PY for this which is part of the numpy package. 

In ```src/Makefile``` there are two variables that must be set ```FC``` and ```f2pyFC```. The former is simply your fortran compiler and the latter is a flag for F2PY to specify which fortran compiler will be used. Therefore, ```f2pyFC``` must match ```FC```. For example, if using the GNU fortran compilers:

```
FC=gfortran
f2pyFC=gnu95
```

Once this is set up, a Python version of UCLCHEM can be built:

```
make python
```

This will create uclchem.so and copy it to ```Python/uclchem/uclchem.so```. If one adds the full path to ```Python/``` to their ```PYTHONPATH``` environmental variable, they should be able to use UCLCHEM in any Python script via

```import uclchem```

Otherwise, one can move the ```Python/uclchem/``` directory to wherever they need to use uclchem in Python.