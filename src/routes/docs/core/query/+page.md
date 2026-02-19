---
title: "Query"
---

# Namespace: `query` — Search & Retrieval

## `afs query search`
- **Purpose:** Search memories.
- **When to use:** Retrieve relevant information by query.
- **What it does:** Full-text/semantic search with optional filters.
- **Step-by-step:**
  1. Provide `--agent-id`.
  2. Provide `--query` (optional for list-like behavior).
  3. Apply filters if needed.
- **Usage example:**
  ```bash
  afs query search --agent-id myagent --query "auth bug" --limit 10
  ```
- **Expected output:** JSON array of matching memories.

## `afs query recall`
- **Purpose:** Graph-walking reflective recall.
- **When to use:** Context reconstruction via relationships.
- **What it does:** Walks memory graph and ranks results.
- **Usage example:**
  ```bash
  afs query recall --agent-id myagent --query "payment issue" --max-depth 2 --limit 10
  ```
- **Expected output:** JSON with `memory_id`, relevance, and path.

## `afs query context`
- **Purpose:** Build LLM-ready context block.
- **When to use:** Prompt injection or summarization.
- **What it does:** Packs memory snippets into a character budget.
- **Usage example:**
  ```bash
  afs query context --agent-id myagent --query "security summary" --max-chars 2000
  ```
- **Expected output:** JSON context object.

## `afs query recent`
- **Purpose:** List recent memories.
- **When to use:** Quick review of latest items.
- **Usage example:**
  ```bash
  afs query recent --agent-id myagent --limit 10
  ```

## `afs query priority`
- **Purpose:** List high-importance memories.
- **When to use:** Focus on critical memories.
- **Usage example:**
  ```bash
  afs query priority --agent-id myagent --min-importance 0.8 --limit 10
  ```

## `afs query inspect`
- **Purpose:** Detailed memory report for an agent.
- **When to use:** Diagnostics and audits.
- **Usage example:**
  ```bash
  afs query inspect --agent-id myagent
  ```

## `afs query stats`
- **Purpose:** Memory statistics summary.
- **When to use:** Monitoring.
- **Usage example:**
  ```bash
  afs query stats --agent-id myagent
  ```
