#!/usr/bin/env python3
"""Collect recent UCLCHEM tags and print a JSON matrix for Actions.

Usage: python scripts/collect_uclchem_versions.py [--count N]
Outputs JSON array suitable for `matrix` input, e.g.: [{"ref":"develop","name":"latest"},{"ref":"v4.1.3","name":"4.1.3"},...]
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--count", type=int, default=5, help="How many recent tags to include")
parser.add_argument("--latest-branch", type=str, default="main", help="Branch to use for the 'latest' snapshot (default: main)")
args = parser.parse_args()

TMP_DIR = "/tmp/uclchem_repo_temp"
if os.path.exists(TMP_DIR):
    shutil.rmtree(TMP_DIR)

# Clone shallow and list tags
try:
    subprocess.check_call(["git", "clone", "--depth", "1", "https://github.com/uclchem/UCLCHEM.git", TMP_DIR], stdout=subprocess.DEVNULL)
    tags_out = subprocess.check_output(["git", "-C", TMP_DIR, "tag", "--list", "v*", "--sort=-v:refname"]).decode().splitlines()
    tags = tags_out
except subprocess.CalledProcessError:
    tags = []

# Build matrix entries: latest always first (use provided latest branch)
matrix = [{"ref": args.latest_branch, "name": "latest"}]
for t in tags[: args.count]:
    name = t.lstrip("v")
    matrix.append({"ref": t, "name": name})

# Print compact JSON to stdout (one-line)
print(json.dumps(matrix, separators=(',', ':')))
