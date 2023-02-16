"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[53],{1109:e=>{e.exports=JSON.parse('{"pluginId":"default","version":"current","label":"Develop \ud83d\udea7","banner":"unreleased","badge":true,"className":"docs-version-current","isLast":false,"docsSidebars":{"docs":[{"type":"category","label":"Getting Started","items":[{"type":"link","label":"Installation","href":"/docs/next/","docId":"install"},{"type":"link","label":"Creating a Network","href":"/docs/next/network","docId":"network"},{"type":"link","label":"Model Parameters","href":"/docs/next/parameters","docId":"parameters"},{"type":"link","label":"Python Reference","href":"/docs/next/pythonapi","docId":"pythonapi"}],"collapsed":true,"collapsible":true,"href":"/docs/next/category/getting-started"},{"type":"category","label":"Tutorials","items":[{"type":"link","label":"Running Your First Models","href":"/docs/next/first_model","docId":"first_model"},{"type":"link","label":"Advanced Physical Modelling","href":"/docs/next/modelling_objects","docId":"modelling_objects"},{"type":"link","label":"Running a Grid","href":"/docs/next/running_a_grid","docId":"running_a_grid"},{"type":"link","label":"Chemical Analysis","href":"/docs/next/chemical_analysis","docId":"chemical_analysis"}],"collapsed":true,"collapsible":true,"href":"/docs/next/category/tutorials"},{"type":"category","label":"Troubleshooting","items":[{"type":"link","label":"Compilation Issues","href":"/docs/next/trouble-compile","docId":"trouble-compile"},{"type":"link","label":"Integration","href":"/docs/next/trouble-integration","docId":"trouble-integration"}],"collapsed":true,"collapsible":true},{"type":"category","label":"Physics","items":[{"type":"link","label":"Core Physics","href":"/docs/next/physics-core","docId":"physics-core"},{"type":"link","label":"Cloud Model","href":"/docs/next/physics-cloud","docId":"physics-cloud"},{"type":"link","label":"Hot Core","href":"/docs/next/physics-hotcore","docId":"physics-hotcore"},{"type":"link","label":"Shock Models","href":"/docs/next/physics-shocks","docId":"physics-shocks"},{"type":"link","label":"Collapse Models","href":"/docs/next/physics-collapse","docId":"physics-collapse"}],"collapsed":true,"collapsible":true,"href":"/docs/next/physics-core"},{"type":"category","label":"Chemistry","items":[{"type":"link","label":"Gas Phase Reactions","href":"/docs/next/gas","docId":"gas"},{"type":"link","label":"Grain Surface Reactions","href":"/docs/next/grain","docId":"grain"},{"type":"link","label":"Adsorption & Desorption Reactions","href":"/docs/next/desorb","docId":"desorb"},{"type":"link","label":"Bulk Ice Processes","href":"/docs/next/bulk","docId":"bulk"}],"collapsed":true,"collapsible":true,"href":"/docs/next/category/chemistry"},{"type":"category","label":"Developer","items":[{"type":"link","label":"Overview of the Code","href":"/docs/next/dev-overview","docId":"dev-overview"},{"type":"link","label":"Writing The Python Interface","href":"/docs/next/dev-python-wrap","docId":"dev-python-wrap"},{"type":"link","label":"Debugging","href":"/docs/next/dev-debugging","docId":"dev-debugging"},{"type":"link","label":"Maintaining the Website","href":"/docs/next/dev-web","docId":"dev-web"}],"collapsed":true,"collapsible":true,"href":"/docs/next/category/developer"}]},"docs":{"bulk":{"id":"bulk","title":"Bulk Ice Processes","description":"For a three phase network, we must include reactions in the bulk and the process by which it is formed. To do this, MakeRates automatically duplicates all LH reactions so that a reaction on the surface and one in the bulk ice exists in the network. We then include two methods by which material can move between the bulk and the surface. First is the accumulation of the bulk as new surface layers are formed and second is the individual swapping of a particle from the bulk with one on the surface. Both of these processes are taken from Garrod & Pauly 2011","sidebar":"docs"},"chemical_analysis":{"id":"chemical_analysis","title":"Chemical Analysis","description":"Chemical networks are complex systems where the interplay between many elements often means that small changes in one aspect of the network can greatly effect the outcome in unexpected ways. Nevertheless, there are cases where a simple chemical explanation can be found for some observed behaviour in the model outputs. This tutorial demonstrates how to use some of the functionality of the UCLCHEM library to analyse model outputs and discover these explanations.","sidebar":"docs"},"desorb":{"id":"desorb","title":"Adsorption & Desorption Reactions","description":"Coupling between the gas and the grain chemistry primarily comes from the freeze out of material from the gas phase onto the dust grains (adsorption) and the sublimation of material from the grains into the gas phase (desorption). The major processes considered by UCLCHEM are listed below. Note that we assume desorption and freeze out occur between the gas and the surface only, bulk material in three phase models does not directly desorb into the gas phase.","sidebar":"docs"},"dev-debugging":{"id":"dev-debugging","title":"Debugging","description":"UCLCHEM is a complex code and many things can go wrong. Here, we\'ll list some of the things that often go wrong when you modify the code as well as a few helpful steps to trace down bugs.","sidebar":"docs"},"dev-overview":{"id":"dev-overview","title":"Overview of the Code","description":"The page is designed to give a brief overview of the code\'s structure. It\'s less about the scientific justification for the various treatments in the code and more about how the code is segmented and where to look for things.","sidebar":"docs"},"dev-python-wrap":{"id":"dev-python-wrap","title":"Writing The Python Interface","description":"The python interface is a relatively complex bit of code, a lot of work is put on the development side to make the user side a smooth experience. Writing the core of UCLCHEM in Fortran gives great performance benefits but compiling it to python with F2PY has its peculiarities. Here, we discuss the steps needed to adjust the code.","sidebar":"docs"},"dev-web":{"id":"dev-web","title":"Maintaining the Website","description":"We use Docusaurus to maintain our website. The upside is that documentation and blog posts can all be created as simple markdown files. The downside is a slightly convoluted workflow which we explain here.","sidebar":"docs"},"first_model":{"id":"first_model","title":"Running Your First Models","description":"In this notebook, we demonstrate the basic use of UCLCHEM\'s python module by running a simple model and then using the analysis functions to examine the output.","sidebar":"docs"},"gas":{"id":"gas","title":"Gas Phase Reactions","description":"Gas phase ODEs","sidebar":"docs"},"grain":{"id":"grain","title":"Grain Surface Reactions","description":"Whilst the basic treatment of gas phase chemistry is well established, grain surface chemistry is more complex. There are three possible ways to treat grain surface chemistry in UCLCHEM. In general we assume that:","sidebar":"docs"},"hydro":{"id":"hydro","title":"Hydro Post Processing","description":"Main Contributors: Jon Holdship"},"install":{"id":"install","title":"Installation","description":"Prerequisites","sidebar":"docs"},"modelling_objects":{"id":"modelling_objects","title":"Advanced Physical Modelling","description":"In the previous tutorial, we simply modelled the chemistry of a static cloud for 1 Myr. This is unlikely to meet everybody\'s modelling needs and UCLCHEM is capable of modelling much more complex environments such as hot cores and shocks. In this tutorial, we model both a hot core and a shock to explore how these models work and to demonstrate the workflow that the UCLCHEM team normally follow.","sidebar":"docs"},"network":{"id":"network","title":"Creating a Network","description":"MakeRates","sidebar":"docs"},"parameters":{"id":"parameters","title":"Model Parameters","description":"UCLCHEM will default to these values unless they are overridden by user. Users can override these by adding the variable name as written here in the paramdict argument of any UCLCHEM model function. paramdict is not case sensitive.","sidebar":"docs"},"physics-cloud":{"id":"physics-cloud","title":"Cloud Model","description":"Main Contributors: Serena Viti, Jon Holdship","sidebar":"docs"},"physics-collapse":{"id":"physics-collapse","title":"Collapse Models","description":"Main Contributors: Felix Priestley","sidebar":"docs"},"physics-core":{"id":"physics-core","title":"Core Physics","description":"Each of the other physics doc pages details the specifics of a particular physics model. This one gives a general overview of the physics in UCLCHEM, including the core physics routines that are called for all models.","sidebar":"docs"},"physics-hotcore":{"id":"physics-hotcore","title":"Hot Core","description":"Main Contributors: Serena Viti, Jon Holdship","sidebar":"docs"},"physics-shocks":{"id":"physics-shocks","title":"Shock Models","description":"Main Contributors: Izaskun Jimenez-Serra, Tom James, Jon Holdship","sidebar":"docs"},"pythonapi":{"id":"pythonapi","title":"Python Reference","description":"* uclchem","sidebar":"docs"},"running_a_grid":{"id":"running_a_grid","title":"Running a Grid","description":"A common task is to run UCLCHEM over a grid of parameter combinations. This notebook sets up a simple approach to doing so for regular grids.","sidebar":"docs"},"trouble-compile":{"id":"trouble-compile","title":"Compilation Issues","description":"Given that UCLCHEM is supplied as source code, used across many machine types, and is a fairly complex model, things will occasionally go wrong. We\'ve collected here some of the most common problems and hope they resolve most issues.","sidebar":"docs"},"trouble-integration":{"id":"trouble-integration","title":"Integration","description":"My code just keeps running","sidebar":"docs"}}}')}}]);