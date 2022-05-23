---
id: trouble-compile
title: Compilation Issues
---

Given that UCLCHEM is supplied as source code, used across many machine types, and is a fairly complex model, things will occasionally go wrong. We've collected here some of the most common problems and hope they resolve most issues.

## Pip fails
Pip is a package manager for Python. It is used to install and manage Python packages but we're hijacking its set up process to ask it to compile UCLCHEM. If the compilation goes wrong, the error message is often a bit useless. Please go to `src/fortran_src` in your terminal and type `make python`. You will get a more useful error which you can then try to debug or send to the team.

Installing via pip may fail if your environment is not set up. Whilst pip will check that you have the necessary python libraries installed, it will not check that you have the necessary compilers. In order to compile you need gfortran which is packaged with the [gnu compiler](https://gcc.gnu.org/) suite. You also need make which is part of the GNU toolset. You can likely install these things through your operating system's package manager rather than from their websites.

Advanced users who do not wish to change compiler may want to check the Makefile. It can be found in `src/fortran_src/Makefile`. There are variables to control the choice of compiler, compilation flags and the F2PY flags which tell numpy.f2py which fortran compiler was used. These can all be altered if you do not wish to use gfortran.

## Windows Trouble
UCLCHEM was written on a GNU/Linux machine and therefore makes a lot of assumptions about how your environment is set up. Whilst these assumptions hold for basically all Linux (and most Mac) distributions, Windows users often run into trouble. You can attempt to install a GNU toolset through packages like MinGW but the most straightforward way we've found for Windows users is to use the Windows Subsystem for linux.

Open a powershell as an administrator and type `wsl --install` to install the Windows Subsystem for Linux. It will then ask you to reboot. Once you've done this, you'll find Ubuntu in your Windows App Store. Installing this Ubuntu app will give you access to a terminal that is indistinguishable from one running on a Linux system but it will have access to all your Windows files. You can set up your linux environment with all necessary tools:

```bash
sudo apt update
sudo apt install make
sudo apt install python3-pip
sudo apt install gfortran
```

and then you'll find your files in `/mnt`. For example, your C: drive can be accessed via `cd /mnt/c`. With the above tools installed, you'll be able to follow our basic install instructions and run UCLCHEM via your Ubuntu installation.

## Mac Trouble
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