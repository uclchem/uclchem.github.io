#!/usr/bin/env python3
"""Strip outputs and execution counts from generated notebooks.
This is run during CI to ensure notebooks are stored/processed without outputs.
"""
import glob
import sys

import nbformat

count = 0
for f in glob.glob('notebooks/[0-9]*.ipynb'):
    try:
        nb = nbformat.read(f, as_version=nbformat.NO_CONVERT)
    except Exception as exc:
        print(f"Skipping {f}: read error: {exc}", file=sys.stderr)
        continue
    changed = False
    for cell in nb.cells:
        if cell.get('cell_type') == 'code':
            if cell.get('outputs'):
                cell['outputs'] = []
                changed = True
            if cell.get('execution_count') is not None:
                cell['execution_count'] = None
                changed = True
    if changed:
        nbformat.write(nb, f)
        count += 1

print(f'Cleared outputs in {count} notebooks')
