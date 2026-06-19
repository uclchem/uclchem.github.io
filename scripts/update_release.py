#!/usr/bin/env python3
"""Update versions.yaml when a new UCLCHEM release is cut.

Usage: python scripts/update_release.py <version-tag>
Exit 0 with "changed=true" printed if versions.yaml was modified,
exit 0 with "changed=false" if the tag was already current.
"""
import sys
from pathlib import Path

import yaml

VERSIONS_YAML = Path(__file__).parent / "versions.yaml"

HEADER = """\
# Multi-version documentation configuration
# This file defines which versions to build and their properties
#
# "main" is a stable alias that always mirrors the latest point release.
# External links to /main/ remain valid across releases — only git_ref needs
# updating here when a new stable version is cut.

"""


def load():
    with open(VERSIONS_YAML) as f:
        return yaml.safe_load(f)


def save(config):
    body = yaml.dump(config, default_flow_style=False, sort_keys=False, allow_unicode=True)
    with open(VERSIONS_YAML, "w") as f:
        f.write(HEADER)
        f.write(body)


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <version-tag>", file=sys.stderr)
        sys.exit(1)

    new_tag = sys.argv[1]
    config = load()
    versions = config["versions"]

    main_entry = next((v for v in versions if v["version_name"] == "main"), None)
    if not main_entry:
        print("No 'main' entry found in versions.yaml", file=sys.stderr)
        sys.exit(1)

    current_tag = main_entry["git_ref"]
    if current_tag == new_tag:
        print(f"Already at {new_tag}, no update needed")
        print("changed=false")
        return

    print(f"Updating main: {current_tag} -> {new_tag}")

    main_entry["git_ref"] = new_tag
    main_entry["description"] = f"Latest stable release (currently {new_tag}) — stable URL alias"

    # Insert pinned entry for the new tag if not already present
    existing = {v["version_name"] for v in versions}
    if new_tag not in existing:
        main_idx = versions.index(main_entry)
        versions.insert(main_idx + 1, {
            "git_ref": new_tag,
            "version_name": new_tag,
            "display_name": new_tag,
            "url_path": f"/{new_tag}/",
            "preferred": False,
            "execute": False,
            "description": f"Stable release {new_tag}",
        })
        print(f"Added pinned entry for {new_tag}")

    save(config)
    print("changed=true")


if __name__ == "__main__":
    main()
