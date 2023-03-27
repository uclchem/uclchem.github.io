---
id: trouble-integration
title: Integration
---

## My code just keeps running
If you're working in jupyter notebooks, fortran output will often not be printed to the cell outputs until the cell finishes running. This can be a real problem if the integration is failing because UCLCHEM may be printing warnings to the screen but you won't see them. If your code is running for a few minutes in a notebook, you may want to export the code to a python script and run it. The uclchem output will print to the console and you will see the integration errors piling up.

## Crashing/Stalling Model Runs
Chemical ODEs are infamously stiff and, as such, difficult to solve. There's also no single solver configuration we can use that will guarantee an efficient and accurate solution to every single problem. In particular, if you have a very large network or one with very fast reactions, you may find the integrator stuggles. 

You'll know the integrator is struggling if you find you get a lot of printed messages stating "ISTATE = -n" (where n is some integer). If the model run completes and there is nothing obviously wrong (eg oscillations) then its likely the solution is fine and your network/parameter combination is at the edge of what the solver can handle. If it takes a very long time or never completes, there is an issue.

One good method to check the validity of your solution is to use the element conservation functions in the [python module](/docs/pythonapi#uclchem.analysis.check_element_conservation). The integrator typically fails to conserve elemental abundances when the integration has accumulated too large an error. Thus, checking for conservation can reassure you that the integration was successful even if the integrator struggled.

To fix this, your first port of call should be the `abstol_factor`, `abstol_min` and `reltol` parameters. The comments in `src/fortran_src/dvode.f90` give a fantastic overview of the integrator but in essence, DVODE takes two parameters: `reltol` should set the decimal place accuracy of your abundances and `abstol` the overall error you'll accept. In UCLCHEM, reltol is just a number but we use DVODE's option of making `abstol` a vector with one value per species instead of a single value. This allows us to change the error tolerance depending on the species abundances. `abstol` will take the value of `abstol_factor` times the species abundance or `abstol_min`, whichever is larger.

Changing the tolerances is a dark art and it isn't necessarily the case that smaller values = more accuracy and larger values = faster integration. Trying a few values (particularly of `abstol_factor`) is always a good first step when you hit integrator problems.

If that doesn't work, you should investigate whether your network is reasonable. Duplicated reactions and bad rate coefficients can result in reactions going too quickly and breaking the integrator.