---
title: "Graph"
---

# Namespace: `graph` — Graph Operations

## `afs graph neighborhood`
- **Purpose:** Get subgraph around a memory.
- **When to use:** Explore local relationships.
- **What it does:** Returns neighborhood up to depth.
- **Usage example:**
  ```bash
  afs graph neighborhood --agent-id myagent --memory-id mem_abc123 --depth 2
  ```
- **Expected output:** JSON graph structure.

## `afs graph path`
- **Purpose:** Find shortest or weighted path.
- **When to use:** Trace relationship chain.
- **What it does:** Returns path (and cost if weighted).
- **Usage example:**
  ```bash
  afs graph path --agent-id myagent --from mem_a --to mem_b
  afs graph path --agent-id myagent --from mem_a --to mem_b --weighted --max-cost 10
  ```
- **Expected output:** JSON with `path` and optional `cost`.

## `afs graph connect`
- **Purpose:** Create manual edge.
- **When to use:** Explicitly link memories.
- **What it does:** Adds an edge with relation and weight.
- **Usage example:**
  ```bash
  afs graph connect --agent-id myagent --src mem_a --dst mem_b --relation depends_on --weight 0.8
  ```
- **Expected output:** JSON with `edge_id` and endpoints.

## `afs graph edges`
- **Purpose:** Query edges by filters.
- **When to use:** Audit relationship graph.
- **What it does:** Returns edges matching filters.
- **Usage example:**
  ```bash
  afs graph edges --agent-id myagent --from mem_a --relation depends_on
  ```
- **Expected output:** JSON array of edges.

## `afs graph discover`
- **Purpose:** Discover relationships for a memory.
- **When to use:** Auto-infer related memories.
- **What it does:** Mines associations and returns neighborhood.
- **Usage example:**
  ```bash
  afs graph discover --agent-id myagent --memory-id mem_abc123 --max-depth 2
  ```
- **Expected output:** JSON with associations and neighborhood.

## `afs graph prune`
- **Purpose:** Prune weak/old edges (reporting stub).
- **When to use:** Graph cleanup diagnostics.
- **What it does:** Reports prune candidates (no deletion).
- **Usage example:**
  ```bash
  afs graph prune --agent-id myagent --min-weight 0.3 --dry-run
  ```
- **Expected output:** JSON report with note about pending implementation.
