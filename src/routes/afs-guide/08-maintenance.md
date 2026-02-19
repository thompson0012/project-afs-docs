# Namespace: `maintenance` — Maintenance Operations

## `afs maintenance tick`
- **Purpose:** Trigger lifecycle progression.
- **Usage example:**
  ```bash
  afs maintenance tick --agent-id myagent
  ```

## `afs maintenance purge`
- **Purpose:** Run forget cycle to remove expired memories.
- **Usage example:**
  ```bash
  afs maintenance purge --agent-id myagent
  ```

## `afs maintenance optimize`
- **Purpose:** Remove tombstones and rebuild indices.
- **Usage example:**
  ```bash
  afs maintenance optimize
  ```

## `afs maintenance associations`
- **Purpose:** Mine semantic/temporal associations.
- **Usage example:**
  ```bash
  afs maintenance associations --agent-id myagent
  ```

## `afs maintenance reindex`
- **Purpose:** Offline rebuild of indices.
- **Usage example:**
  ```bash
  afs maintenance reindex --yes
  afs maintenance reindex --agent-id myagent --yes --text-only
  ```

## `afs maintenance scrub-embedding-vectors`
- **Purpose:** Remove stored embedding vectors.
- **Usage example:**
  ```bash
  afs maintenance scrub-embedding-vectors --agent-id myagent --yes
  afs maintenance scrub-embedding-vectors --all --yes
  ```
