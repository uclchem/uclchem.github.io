# Legacy Tutorials

These tutorials demonstrate older patterns that remain supported for backward compatibility.

```{toctree}
:maxdepth: 1
:caption: Legacy Tutorials

../../notebooks/2a_modelling_objects_on_disk.ipynb
```

## About Legacy Tutorials

The tutorials in this section show approaches that are still functional but have been superseded by more modern workflows:

- **Modelling on Disk** - Shows file-based I/O patterns. Modern code typically uses in-memory workflows with `return_array` or `return_dataframe` for better performance and flexibility.

## When to Use

These patterns remain useful when:

- You need to match existing workflows from older code
- You're working with very large datasets that don't fit in memory
- You need persistent output files for archival purposes

## Modern Alternatives

For new projects, we recommend:

- [In-Memory Modelling](../../notebooks/2b_modelling_objects_in_memory.ipynb) - More flexible and performant
- [Model Objects](../basics/index.md) - Object-oriented API with cleaner interfaces
