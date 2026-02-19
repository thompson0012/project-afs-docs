# AFS CLI Guide — Overview

This guide is split into one file per namespace/section. All commands emit JSON to stdout (errors to stderr) unless noted.

## Global setup

### `afs init`
- **Purpose:** Initialize a repo-local `.afs/` instance.
- **When to use:** First-time setup in a repo or directory.
- **What it does:** Creates `.afs/` directories and default config.
- **Step-by-step:**
  1. Run `afs init` from repo root.
  2. If `.afs` already exists, use `--force` to normalize config.
- **Usage example:**
  ```bash
  afs init
  afs init --force
  ```
- **Expected output:** A success message like `Initialized .afs at ...` or `Normalized config at ...`.

## Global option

### `--base-path`
- **Purpose:** Override `.afs` instance discovery.
- **When to use:** Your `.afs` lives outside/above current working dir.
- **What it does:** Points CLI to the specified `.afs` directory.
- **Usage example:**
  ```bash
  afs --base-path /path/to/.afs memory list --agent-id myagent
  ```
- **Expected output:** Same as the command invoked.

## Shared filter syntax (used by `memory list` and `query search`)

### `--filter key=op:value`
- **Purpose:** Apply metadata filters from CLI.
- **Operators:** `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`, `contains`
- **Examples:**
  ```bash
  afs memory list --agent-id myagent --filter priority=gte:5
  afs query search --agent-id myagent --query "auth" --filter tags=in:security,auth
  ```

### `--filter-json '{...}'`
- **Purpose:** Provide full MetadataFilters JSON.
- **Example:**
  ```bash
  afs memory list --agent-id myagent --filter-json '{"must": [{"key": "status", "eq": "active"}]}'
  ```

**Note:** `--filter` and `--filter-json` are mutually exclusive.
