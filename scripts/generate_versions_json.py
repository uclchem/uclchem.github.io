#!/usr/bin/env python3
"""Generate versions.json for the deployed site from built version directories.
Usage: python scripts/generate_versions_json.py <built_root> > versions.json
"""
import json
import os
import sys

root = sys.argv[1] if len(sys.argv) > 1 else "_build/html/versions"
versions = []
if os.path.isdir(root):
    for name in sorted(os.listdir(root)):
        path = os.path.join(root, name)
        if os.path.isdir(path):
            versions.append({"name": name, "url": f"/{name}/"})
print(json.dumps({"versions": versions}, indent=2))
