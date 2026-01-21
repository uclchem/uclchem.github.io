---
id: dev-debugging
title: Debugging
---

# Debugging

UCLCHEM is a complex code and many things can go wrong. Here, we'll list some of the things that often go wrong when you modify the code as well as a few helpful steps to trace down bugs.

## Finding the error
An unfortunate side effect of the python installation process and running the code in python is that underlying errors can go missing. If you get an error it is often best to go as close to the source as you can. That means compiling the code with the makefile and running it through a python script or, failing that, the binary.

### Makefile
You'll find the source code and makefile in `src/fortran_src`, if you run

```bash
cd src/fortran_src
make clean
make python
```

you'll build the python wrap from scratch and you'll get any compilation errors printed to screen directly. These compilation errors should print when `pip install .` fails but they can be lost in the python errors and often won't be as helpfully coloured as the direct output from `make`. You can also go into the Makefile and change the compiler flags. Switching the optimization flags out for debugging flags will make the error easier to find. You'll find them in the Makefile:

```makefile
#Unforgiving debugging flags
#FFLAGS =-g -fbacktrace -Wall -fcheck=all
#Fast optimizing flags
FFLAGS = -O3 -fPIC -ffree-line-length-0
```
where you simply switch over which `FFLAGS` is commented out.

You can also test for errors that come from the python interface by using `make` instead of `make python`. This will build a uclchem binary which you can simply run with the default parameters,

```bash
cd src/fortran_src
make
cd ../../
./uclchem CLOUD examples/phase1.inp
```
Where phase1.inp is a parameter file written in a json like format and CLOUD is the type of model we'd like to run. Better yet, if you use the debugging flags to build this, you can run it in gdb.

```bash
gdb uclchem
run CLOUD examples/phase1.inp
```
We can't go into detail on gdb is here but it's a terminal based debugger that can be used to trace down the error. It will often let you look at values of variables at the point where the code broke and give more information than the standard fortran outputs.

### Python
It's mentioned at several points in the docs but if you habitually run your UCLCHEM codes in jupyter notebooks, you'll find that error messages are often hidden from you. Any debugging should really be done via python script.

## Non-fatal errors
Many errors will not stop the code compiling but are catastrophic. For example, you could introduce a new procedure that is valid Fortran but does not do what you want it to do. In these cases, you'll have to hunt the problem down yourself. We recommend running the test cases in `scripts/run_uclchem_tests.py` and comparing the output to the ones in the example using the plot created by `scripts/plot_uclchem_tests.py`. Sometimes, they'll be different because you introduced a change that you know will effect the chemistry. For example, you might have changed a desorption process and find the ice abundances change which is totally fine. However, if you see a change that is unexpected, you can investigate.

There's no better way to debug these errors than to simply print a lot of things to screen. It can seem silly but adding a bunch of write statements to your code is often the fastest way to track down what is going wrong.

```fortran
IF (myParam .gt. criticalValue) THEN
    write(*,*) "here!"
    !do stuff
ELSE
    write(*,*) "if not trigged because myParam is", myParam
    !do other stuff
END IF

!do some processing
CALL myNewSubroutine
write(*,*) "myParam", myParam, "at code point x"

```
Additions to the code like above will check the logic of your code is going the way you expect and that parameters aren't taking surprise values. If you have absolutely no suspicions about which part of your code is going wrong, you can use the subroutine `simpleDebug` which is in the IO module (`io.f90`). That prints a statement of your choice as well as many of the parameters.

```fortran
!do some processing
CALL myNewSubroutine
CALL simpleDebug("Param values after myNewSubroutine")
```

## Common Error Sources

### Variable Reset
If you notice errors that only occur when you run the code more than once in a python script, then a common source is the initial value that variables take in the code. Variable initialization done at the declaration stage of a module only happens once. That is why the vast majority of variables that are not fortran parameters (constants) are set to an initial value by defaultparameters.f90 or in the initialization subroutines of the physics-core, chemistry, and physics modules.

It's very common when editing the code or adding new variables to forget to do this and then to see unusual behaviour when you run multiple models in a row in python.
