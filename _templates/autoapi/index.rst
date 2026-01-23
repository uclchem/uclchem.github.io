Python API
==========

Complete API documentation for UCLCHEM's Python interface.

Essential Python API
--------------------

Core modules for running models and analyzing results:

.. toctree::
   :maxdepth: 1
   
   uclchem/model/index
   uclchem/analysis/index
   uclchem/utils/index
   uclchem/makerates/index

Advanced Python API
-------------------

For advanced usage and customization:

.. toctree::
   :maxdepth: 1
   
   uclchem/functional/index
   uclchem/advanced/index
   uclchem/plot/index

Supporting Modules
------------------

Internal modules and utilities:

.. toctree::
   :maxdepth: 1
   
   uclchem/constants/index
   uclchem/version/index
   uclchem/debug/index
   uclchem/tests/index

Fortran Modules
---------------

Direct access to compiled Fortran modules and parameters:

.. toctree::
   :maxdepth: 2
   
   fortran/index

Quick Start
-----------

**Model Classes (Recommended for Most Users)**

.. code-block:: python

   import uclchem
   
   # Create and run a cloud model
   cloud = uclchem.model.Cloud(
       param_dict={'initialDens': 1e4, 'finalTime': 1e6},
       out_species=['CO', 'H2O']
   )
   
   # Access results as DataFrame
   df = cloud.get_dataframe()
   
   # Analyze chemistry
   uclchem.analysis.plot_abundance(df, 'CO')

**Analysis & Post-Processing**

.. code-block:: python

   import uclchem
   
   # Read and analyze existing output
   df = uclchem.analysis.read_uclchem(['CO', 'H2O'], 'output.dat')
   
   # Chemical network analysis
   rates = uclchem.analysis.get_reaction_rates(['H2', 'H', 'O2'])
   uclchem.analysis.plot_heating_cooling(df)

**Network Customization**

.. code-block:: python

   from uclchem.makerates import MakeRates
   
   # Generate custom chemical network
   network = MakeRates(
       species_list=['H', 'H2', 'O', 'CO'],
       elements=['H', 'C', 'O']
   )
   network.write_network()

**Advanced: Direct Fortran Access**

.. code-block:: python

   import uclchem
   
   # Access Fortran parameters at runtime
   settings = uclchem.advanced.GeneralSettings()
   print(settings.defaultparameters.initialdens.get())
   
   # Modify parameters
   settings.defaultparameters.initialdens.set(1e5)

Module Guide
------------

**Essential Modules** (start here):

* :doc:`uclchem.model <uclchem/model/index>` - Object-oriented model classes (Cloud, Collapse, HotCore, Shock)
* :doc:`uclchem.analysis <uclchem/analysis/index>` - Chemical analysis and plotting tools
* :doc:`uclchem.utils <uclchem/utils/index>` - Utility functions for I/O and data processing
* :doc:`uclchem.makerates <uclchem/makerates/index>` - Chemical network generation

**Advanced Modules** (for customization):

* :doc:`uclchem.functional <uclchem/functional/index>` - Legacy functional API (disk/memory modes)
* :doc:`uclchem.advanced <uclchem/advanced/index>` - Direct Fortran module access via GeneralSettings
* :doc:`uclchem.plot <uclchem/plot/index>` - Additional plotting utilities

**Internal Modules** (reference only):

* :doc:`uclchem.constants <uclchem/constants/index>` - Physical constants
* :doc:`uclchem.version <uclchem/version/index>` - Version information
* :doc:`uclchem.debug <uclchem/debug/index>` - Debugging utilities
* :doc:`uclchem.tests <uclchem/tests/index>` - Test suite

Notes
-----

- **Most users only need** the Essential Modules (model, analysis, utils)
- Python API is auto-generated from source code docstrings
- Fortran API is auto-generated from compiled modules at build time  
- See :doc:`/tutorials/index` for practical examples
- See :doc:`/user-guide/parameters` for parameter configuration guide
