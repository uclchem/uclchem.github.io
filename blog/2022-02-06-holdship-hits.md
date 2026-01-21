---
blogpost: true
date: 2022-02-06
author: jonholdship
---

# HITs - History Independent Tracers

Interpreting molecular observations through chemical and radiative transfer models is a common but complex practice. Whilst many uncertainties affect chemical models, one in particular is addressed in this work: the issue of time dependence. When modelling a molecular cloud or protostellar disk, how do we initialize the abundances? When is an appropriate time to compare our model to the observed object? Our paper on [History Independent Tracers (HITs)](https://ui.adsabs.harvard.edu/abs/2022A%26A...658A.103H/abstract) side steps this issue by producing a list of molecules which are insensitive to the chemical history of the gas, essentially reaching steady state very quickly across a very wide range of gas conditions.

However, having a list of molecules that are easy to model is only first step towards making useful inferences. We then use our HITs to determine which observables are the most informative about various physical parameters. We do this by producing a large dataset of synthetic observations using UCLCHEM and RADEX to produce line intensities for every transition of every HIT under a wide range of physical conditions. We then calculate the [mutual information](https://en.wikipedia.org/wiki/Mutual_information) between each molecular transition and each physical parameter and use these to rank the transitions. The information scores are all available on the [HITs website](https://hits.strw.leidenuniv.nl) which can be used to plan observations.

By choosing transitions of a HIT that have a high mutual information with your physical parameter of interest, you can obtain the best possible constraint on that parameter. Moreover, as a HIT, the chemical modelling of this species will not be subject to much uncertainty from the gas history.
