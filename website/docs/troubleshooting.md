---
id: trouble
title: Troubleshooting
---

Given that UCLCHEM is supplied as source code, used across many machine types, and is a fairly complex model, things will occasionally go wrong. We've collected here some of the most common problems and hope they resolve most issues.

## Compiler Issues
If you can't get UCLCHEM to compile, we'd ask that you ensure you can compile and run simple fortran programs on your machine. If you're using the Python wrap, you should also check that you can compile and run the [F2PY tutorial modules](https://numpy.org/doc/stable/f2py/f2py.getting-started.html). If either of these fails, you can follow general help guides online for fixing problems with your fortran compiler or f2py.

Mac users often run into compiler/python problems. We'll add issues as we come across them but please do get in touch if you struggle. Whilst it isn't a UCLCHEM issue, we do have many Mac users and will be happy to help troubleshoot.
 - A recent Mac update resulted in the standard gfortran libraries not being in the expected location [this Stackoverflow](https://stackoverflow.com/questions/57207357/dyld-library-not-loaded-usr-local-gfortran-lib-libgfortran-3-dylib-reason-im) might help. 


## Crashing/Stalling Model Runs
Chemical ODEs are infamously stiff and, as such, difficult to solve. There's also no single solver configuration we can use that will guarantee an efficient and accurate solution to every single problem. In particular, if you have a very large network or one with very fast reactions, you may find the integrator stuggles. 

You'll know the integrator is struggling if you find you get a lot of printed messages stating "ISTATE = -n" (where n is some integer). If the model run completes and there is nothing obviously wrong (eg oscillations) then its likely the solution is fine and your network/parameter combination is at the edge of what the solver can handle. If it takes a very long time or never completes, there is an issue.

To fix this, your first port of call should be the `abstol` and `reltol` parameters in the `integrate` subroutine of `chemistry.f90`. The comments in `dvode.f90` give a fantastic overview of the integrator but in essence, `reltol` should set the decimal place accuracy of your abundances and `abstol` the overall error you'll accept. Changing these values is a dark art and it isn't necessarily the case that smaller values = more accuracy and larger values = faster integration. Trying a few values (particular of `abstol`) is always a good first step when you hit integrator problems.

If that doesn't work, you should investigate whether your network is reasonable. Duplicated reactions and bad rate coefficients can result in reactions going too quickly and breaking the integrator.