---
title: "Memory"
---

# Namespace: `memory` — Memory Lifecycle

## `afs memory create`
- **Purpose:** Create a new memory.
- **When to use:** Storing observations/reflections/knowledge.
- **What it does:** Writes a new memory record for an agent.
- **Step-by-step:**
  1. Choose `--agent-id`.
  2. Provide `--content`.
  3. (Optional) Set `--type`.
- **Usage example:**
  ```bash
  afs memory create --agent-id researcher --content "Found SQL injection" --type observation
  ```
- **Expected output:** JSON memory object (`memory_id`, `content`, `memory_type`, timestamps).

## `afs memory import`
- **Purpose:** Bulk import memories from JSONL.
- **When to use:** Migrations or batch ingestion.
- **What it does:** Validates each line and batch-creates memories.
- **Step-by-step:**
  1. Prepare JSONL lines.
  2. Use `--file` or pipe with `--stdin`.
- **Usage example:**
  ```bash
  afs memory import --agent-id myagent --file memories.jsonl
  cat memories.jsonl | afs memory import --agent-id myagent --stdin
  ```
- **Expected output:** JSON with `created` count and `memory_ids`.

## `afs memory get`
- **Purpose:** Fetch a memory by ID.
- **When to use:** Inspect a specific memory.
- **What it does:** Returns memory content and metadata.
- **Usage example:**
  ```bash
  afs memory get --agent-id myagent --memory-id mem_abc123
  ```
- **Expected output:** JSON memory object or error if not found.

## `afs memory list`
- **Purpose:** List memories with filters.
- **When to use:** Browse or filter memory store.
- **What it does:** Searches with query=None and applies filters.
- **Usage example:**
  ```bash
  afs memory list --agent-id myagent --limit 20 --type observation --include-archived
  ```
- **Expected output:** JSON array of memory objects.

## `afs memory update`
- **Purpose:** Update importance, confidence, or metadata.
- **When to use:** Re-score or annotate a memory.
- **What it does:** Patches memory fields.
- **Usage example:**
  ```bash
  afs memory update --agent-id myagent --memory-id mem_abc123 \
    --importance 0.9 --metadata '{"severity":"high"}'
  ```
- **Expected output:** JSON updated memory object.

## `afs memory delete`
- **Purpose:** Delete a memory.
- **When to use:** Remove invalid or obsolete memory.
- **What it does:** Deletes the record.
- **Usage example:**
  ```bash
  afs memory delete --agent-id myagent --memory-id mem_abc123
  ```
- **Expected output:** JSON `{ "memory_id": ..., "deleted": true|false }`.

## `afs memory export`
- **Purpose:** Export memories as JSON.
- **When to use:** Backups or offline analysis.
- **What it does:** Outputs memory records (JSON) to stdout.
- **Usage example:**
  ```bash
  afs memory export --agent-id myagent --limit 100 > export.json
  ```
- **Expected output:** JSON array of memories.

## `afs memory share`
- **Purpose:** Share memory to a swarm.
- **When to use:** Multi-agent knowledge sharing.
- **What it does:** Copies memory into swarm pool.
- **Usage example:**
  ```bash
  afs memory share --agent-id myagent --memory-id mem_abc123 --swarm-id team-1
  ```
- **Expected output:** JSON confirmation with `shared: true`.

## `afs memory consolidate`
- **Purpose:** Consolidate memories into knowledge units.
- **When to use:** After accumulating many observations.
- **What it does:** Runs consolidation pipeline.
- **Usage example:**
  ```bash
  afs memory consolidate --agent-id myagent
  ```
- **Expected output:** JSON summary of consolidation.

## `afs memory mine`
- **Purpose:** Mine semantic/temporal associations.
- **When to use:** Discover relationships between memories.
- **What it does:** Creates graph edges like `similar_to`, `co_occurred`.
- **Usage example:**
  ```bash
  afs memory mine --agent-id myagent
  ```
- **Expected output:** JSON counts of associations.

## `afs memory archive`
- **Purpose:** Archive a memory.
- **When to use:** Hide from default views but keep data.
- **What it does:** Sets status to `archived`.
- **Usage example:**
  ```bash
  afs memory archive --agent-id myagent --memory-id mem_abc123
  ```
- **Expected output:** JSON with status.

## `afs memory unarchive`
- **Purpose:** Restore archived memory.
- **When to use:** Reactivate an archived item.
- **What it does:** Sets status to `active`.
- **Usage example:**
  ```bash
  afs memory unarchive --agent-id myagent --memory-id mem_abc123
  ```
- **Expected output:** JSON with status.
