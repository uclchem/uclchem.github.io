---
id: dev-python-wrap
title: Writing The Python Interface
---

# Writing The Python Interface

The python interface is a relatively complex bit of code, a lot of work is put on the development side to make the user side a smooth experience. Writing the core of UCLCHEM in Fortran gives great performance benefits but compiling it to python with F2PY has its peculiarities. Here, we discuss the steps needed to adjust the code.

## The Fortran Side
The fortran side is the more difficult. We define a module in `src/fortran_src/wrap.f90` which is a Fortran module that F2PY will turn into a python module. Any subroutine declared in `wrap.f90` will become a function in the Python module.

The most likely change you'll want to make is to add a physics module so we'll look at cloud as an example. In `wrap.f90` cloud is declared:

```fortran
    SUBROUTINE cloud(dictionary, outSpeciesIn,abundance_out,successFlag)
        USE cloud_mod

        CHARACTER(LEN=*) :: dictionary, outSpeciesIn
        DOUBLE PRECISION :: abundance_out(500)
        INTEGER :: successFlag
        !f2py intent(in) dictionary,outSpeciesIn
        !f2py intent(out) abundance_out,successFlag
        ...
    END SUBROUTINE
```

where we've dropped the bulk of the code since we only care about the declaration. Once compiled, you will be able to call this function using `uclchem.wrap.cloud(dictionary,outSpeciesIn)`.

This works because we've done two things. First, we've declared both the two inputs and the two outputs as arguments in Fortran in the normal way. Both inputs and outputs of a subroutine are declared as arguments in Fortran, usually with an `INTENT(IN)` or `INTENT(OUT)` statement, although that is unnecessary. We then declare the intent of those argument for F2PY using the comments that start `!f2py` to tell F2PY which arguments should be arguments of the corresponding python function and which should be outputs.

## The Python Side

We could leave it at that. However, for ease of use, we write pure python functions in the uclchem module which call the underlying wrap functions rather than having users directly access the f2py functions. For example, in `uclchem.model`, we define a cloud function which calls `wrap.cloud`:

```python

def cloud(param_dict=None, out_species=None):
    """Run cloud model from UCLCHEM

    Args:
        param_dict (dict,optional): A dictionary of parameters where keys are any of the variables in defaultparameters.f90 and values are value for current run.
        out_species (list, optional): A list of species for which final abundance will be returned. If None, no abundances will be returned.. Defaults to None.

    Returns:
        int,list: A integer which is negative if the model failed to run, or a list of abundances of all species in `outSpecies`
    """
    n_out,param_dict,out_species=_reform_inputs(param_dict,out_species)
    abunds, success_flag = wrap.cloud(dictionary=param_dict, outspeciesin=out_species)
    if success_flag < 0 or n_out == 0:
        return success_flag
    else:
        return abunds[: n_out]
```

This allows us to make some arguments optional using python's keyword arguments. It also lets us write docstrings from which we can generate documentation for the functions. Finally, it lets us tidy up the output! For example, arrays passed too and from the Fortran subroutines must be of fixed length so in this function, we cut the output abundance array down to just the elements the user actually wanted.

## Tips and Tricks

- Once imported, all values are initialized in UCLCHEM. Calling a subroutine multiple times does not reset variables. That is to say that if your Fortran modules declare variables with an initial value, those variables will not return to those initial values. Instead, you'll notice all our modules reset their variables manually in the initialize functions such as initializePhysics.

- Debugging your fortran code can be greatly complicated by the F2PY interface. Consider compiling the fortran source to test any code changes before trying to compile the python version.

- Python handles errors much more gracefully than Fortran. We have tried to use `successFlag` as a return from most subroutines as a way to tell Python that the Fortran run failed. It can be a pain to set up the chain of successFlag returns from modules in Fortran but if you use something like Fortran's `STOP`, you'll likely kill your python in a way that won't let you use `try:, except:` statements to handle it.
