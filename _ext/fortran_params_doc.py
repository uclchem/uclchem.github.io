"""Sphinx extension to generate Fortran parameter documentation.

This extension introspects uclchemwrap at build time to generate
comprehensive parameter documentation from the compiled Fortran modules.
"""

import os
from typing import Any, Dict

from sphinx.application import Sphinx
from sphinx.util import logging

logger = logging.getLogger(__name__)


def generate_parameter_docs(app: Sphinx) -> None:
    """Generate parameter documentation from uclchemwrap at build time."""
    
    logger.info(f"Source directory: {app.srcdir}")
    logger.info(f"Build directory: {app.outdir if hasattr(app, 'outdir') else 'N/A'}")
    
    try:
        import uclchem.advanced
    except ImportError as e:
        logger.warning(f"Could not import uclchem.advanced - skipping parameter docs generation: {e}")
        return
    
    logger.info("Generating Fortran parameter documentation...")
    
    # Create settings object to introspect all modules
    settings = uclchem.advanced.GeneralSettings()
    
    # Output directory for generated docs
    output_dir = os.path.join(app.srcdir, 'api', 'fortran')
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate overview page
    overview_path = os.path.join(output_dir, 'index.md')
    module_names = sorted(settings._modules.keys())
    
    with open(overview_path, 'w') as f:
        f.write("# Fortran API\n\n")
        f.write("*Auto-generated from compiled uclchemwrap modules*\n\n")
        f.write("This section documents all Fortran modules and their parameters ")
        f.write("as they exist in the compiled code.\n\n")
        
        # Runtime Access - top-level example
        f.write("## Accessing Fortran Parameters at Runtime\n\n")
        f.write("The Fortran parameters and functions are accessed through the `uclchem.advanced.GeneralSettings()` interface:\n\n")
        f.write("```python\n")
        f.write("import uclchem\n\n")
        f.write("settings = uclchem.advanced.GeneralSettings()\n\n")
        f.write("# Read parameter value\n")
        f.write("value = settings.defaultparameters.abstol_factor.get()\n\n")
        f.write("# Modify parameter (non-PARAMETER only)\n")
        f.write("settings.defaultparameters.abstol_factor.set(new_value)\n")
        f.write("```\n\n")
        f.write("For more detailed examples of interacting with Fortran parameters, see:\n")
        f.write("- [Advanced Settings](../../tutorials/6_advanced_settings.html): Parameter modification examples\n")
        f.write("- [Heating & Cooling Settings](../../tutorials/7_heating_cooling_settings.html): Physical parameter tuning\n\n")
        
        # List all modules
        f.write("## Available Modules\n\n")
        for module_name in module_names:
            module = settings._modules[module_name]
            n_settings = len(module._settings)
            f.write(f"- **[{module_name}]({module_name}.md)**: {n_settings} parameters/variables\n")
        
        f.write("\n## Fortran Functions\n\n")
        f.write("Key Fortran functions available through the wrapper:\n\n")
        
        # Extract available functions from uclchem module
        try:
            import inspect

            import uclchem
            
            # Get function signatures
            funcs = []
            for name, obj in inspect.getmembers(uclchem):
                if inspect.isbuiltin(obj) or (hasattr(obj, '__module__') and 'uclchem' in str(obj.__module__)):
                    try:
                        sig = inspect.signature(obj)
                        funcs.append((name, sig))
                    except (ValueError, TypeError):
                        pass
            
            if funcs:
                f.write("| Function | Signature |\n")
                f.write("|----------|----------|\n")
                for fname, sig in sorted(funcs)[:15]:  # Limit to first 15
                    f.write(f"| `{fname}` | `{sig}` |\n")
            else:
                f.write("*Function signatures available in module documentation*\n")
        except Exception as e:
            logger.warning(f"Could not extract function signatures: {e}")
        
        f.write("\n")
        
        # Add toctree for navigation
        f.write("```{toctree}\n")
        f.write(":maxdepth: 2\n")
        f.write(":hidden:\n\n")
        for module_name in module_names:
            f.write(f"{module_name}\n")
        f.write("```\n")
    
    # Generate page for each module
    for module_name in sorted(settings._modules.keys()):
        module = settings._modules[module_name]
        module_path = os.path.join(output_dir, f'{module_name}.md')
        
        with open(module_path, 'w') as f:
            f.write(f"# {module_name}\n\n")
            f.write(f"Fortran module: `{module_name}`\n\n")
            
            # Get all settings
            all_settings = module.list_settings(
                include_internal=True, 
                include_parameters=True
            )
            
            if not all_settings:
                f.write("*No parameters/variables found in this module*\n\n")
                continue
            
            # Categorize settings
            parameters = {}  # Read-only PARAMETERs
            user_params = {}  # User-configurable parameters
            internal = {}  # Internal variables
            
            for name, setting in all_settings.items():
                if setting.is_parameter:
                    parameters[name] = setting
                elif setting.is_internal:
                    internal[name] = setting
                else:
                    user_params[name] = setting
            
            # Write user-configurable parameters first
            if user_params:
                f.write("## Parameters\n\n")
                f.write("User-configurable parameters (can be set via `param_dict`):\n\n")
                f.write("| Parameter | Type | Default | Description |\n")
                f.write("|-----------|------|---------|-------------|\n")
                
                for name in sorted(user_params.keys()):
                    setting = user_params[name]
                    value = _format_value(setting.current_value)
                    dtype = _format_type(setting.dtype, setting.shape)
                    # Try to get description from docstring if available
                    desc = getattr(setting, 'description', '')
                    f.write(f"| `{name}` | {dtype} | {value} | {desc} |\n")
                
                f.write("\n")
            
            # Write read-only parameters
            if parameters:
                f.write("## Constants (Read-Only)\n\n")
                f.write("Fortran PARAMETER constants (compile-time values):\n\n")
                f.write("| Constant | Type | Value |\n")
                f.write("|----------|------|-------|\n")
                
                for name in sorted(parameters.keys()):
                    setting = parameters[name]
                    value = _format_value(setting.current_value)
                    dtype = _format_type(setting.dtype, setting.shape)
                    f.write(f"| `{name}` | {dtype} | {value} |\n")
                
                f.write("\n")
            
            # Write internal variables (collapsed by default)
            if internal:
                f.write("## Internal Variables\n\n")
                f.write("```{dropdown} Internal solver variables (advanced)\n")
                f.write("| Variable | Type | Current Value |\n")
                f.write("|----------|------|---------------|\n")
                
                for name in sorted(internal.keys()):
                    setting = internal[name]
                    value = _format_value(setting.current_value)
                    dtype = _format_type(setting.dtype, setting.shape)
                    f.write(f"| `{name}` | {dtype} | {value} |\n")
                
                f.write("```\n\n")
            
            # Add runtime access note (pointing to overview page)
            f.write("## Runtime Access\n\n")
            f.write(f"Access `{module_name}` parameters at runtime using `uclchem.advanced.GeneralSettings()`.\n")
            f.write("See [Accessing Fortran Parameters](index.html#accessing-fortran-parameters-at-runtime) ")
            f.write("on the main Fortran API page for examples.\n\n")
    
    logger.info(f"Generated Fortran parameter docs in {output_dir}")


def _format_value(value: Any) -> str:
    """Format a value for display in markdown table."""
    if isinstance(value, bytes):
        decoded = value.decode('utf-8').strip()
        return f'`""`' if not decoded else f'`"{decoded}"`'
    elif isinstance(value, bool):
        return '`True`' if value else '`False`'
    elif isinstance(value, (int, float)):
        if isinstance(value, float) and (abs(value) < 0.001 or abs(value) > 10000):
            return f'`{value:.2e}`'
        return f'`{value}`'
    elif hasattr(value, 'shape'):  # numpy array
        if value.size <= 3:
            return f'`{value}`'
        return f'`array{value.shape}`'
    else:
        return f'`{value}`'


def _format_type(dtype: Any, shape: Any) -> str:
    """Format type information for display."""
    try:
        import numpy as np
    except ImportError:
        np = None
    
    if shape is not None:
        # Array type
        if hasattr(dtype, 'name'):
            return f'`{dtype.name}[{shape}]`'
        return f'`array[{shape}]`'
    
    # Scalar type
    if dtype == bool or (hasattr(dtype, '__name__') and dtype.__name__ == 'bool'):
        return '`bool`'
    elif dtype == int or (hasattr(dtype, '__name__') and 'int' in dtype.__name__):
        return '`int`'
    elif dtype == float or (hasattr(dtype, '__name__') and 'float' in dtype.__name__):
        return '`float`'
    elif dtype == str or dtype == bytes:
        return '`str`'
    elif hasattr(dtype, 'name'):
        return f'`{dtype.name}`'
    else:
        return f'`{dtype}`'


def setup(app: Sphinx) -> Dict[str, Any]:
    """Setup the Sphinx extension."""
    
    # Generate docs at config-inited (before builder-inited)
    app.connect('config-inited', lambda app, config: generate_parameter_docs(app))
    
    return {
        'version': '1.0',
        'parallel_read_safe': True,
        'parallel_write_safe': True,
    }
