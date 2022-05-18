---
id: trouble-compile
title: Compilation Issues
---

Given that UCLCHEM is supplied as source code, used across many machine types, and is a fairly complex model, things will occasionally go wrong. We've collected here some of the most common problems and hope they resolve most issues.

## Pip fails
Installing via pip may fail if your environment is not set up. Whilst pip will check that you have the necessary python libraries installed, it will not check that you have the necessary compilers.

In order to compile you need gfortran which is packaged with the [gnu compiler](https://gcc.gnu.org/) suite. You also need [cmake](https://cmake.org/). You can likely install these things through your operating system's package manager rather than from their websites.

Advanced users who do not wish to change compiler may want to check the Makefile. It can be found in `src/fortran_src/Makefile`. There are variables to control the choice of compiler, compilation flags and the F2PY flags which tell numpy.f2py which fortran compiler was used. These can all be altered if you do not wish to use gfortran.

## Running fails with library errors
A problem Mac users commonly come across is that fortran codes compile but do not run because the gfortran libraries are not in the expected location. If you get an error like:
```
Exception has occurred: ImportErrordlopen(/usr/local/lib/python3.9/site-packages/uclchemwrap.cpython-39-darwin.so, 2): Library not loaded: /usr/local/opt/gcc/lib/gcc/10/libgfortran.5.dylib   Referenced from: /usr/local/lib/python3.9/site-packages/uclchemwrap.cpython-39-darwin.so   Reason: image not found
```
then this is likely what has happened to you. You can fix it by following the instructions in this[this Stackoverflow post](https://stackoverflow.com/questions/57207357/dyld-library-not-loaded-usr-local-gfortran-lib-libgfortran-3-dylib-reason-im). 

## Architectures
F2PY defaults to x86_64 architecture. This is fine for most users, but if you are using a different architecture, you may need to specify this in the Makefile. To do so, edit `src/fortran_src/Makfile` so that the line that reads

```
python3 -m numpy.f2py -c --fcompiler=${f2pyFC}
```
is replaced with

```
python3 -m numpy.f2py -c --fcompiler=${f2pyFC} --arch=my_arch
```

where my_arch is the architecture you are using.