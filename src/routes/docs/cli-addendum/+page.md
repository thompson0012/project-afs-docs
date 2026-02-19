---
title: "CLI Addendum"
---

# CLI Addendum

This page documents CLI commands that are available in AFS but not covered in the main [CLI Reference](/docs/cli-reference). These commands come from the [SKILL.md](https://github.com/labs21/afs/blob/main/skills/afs-skills/SKILL.md) reference, which is the authoritative source for agent-oriented CLI usage.

---

## Memory Archive / Unarchive

Archive a memory to exclude it from default queries. Unarchive to restore it.

```bash
afs memory archive --agent-id myagent --memory-id mem_abc123
afs memory unarchive --agent-id myagent --memory-id mem_abc123
```

Archived memories can still be included in search and list results by passing `--include-archived`.

---

## Maintenance: Reindex

Rebuild search indices offline. Requires the `--yes` flag for confirmation.

```bash
afs maintenance reindex --agent-id myagent --yes
```

Rebuild only the text (FTS5) index:

```bash
afs maintenance reindex --yes --text-only
```

Force reindex even if the scheduler is running:

```bash
afs maintenance reindex --yes --force
```

---

## Maintenance: Scrub Embedding Vectors

Remove stale or orphaned embedding vectors from the HNSW index.

For a single agent:

```bash
afs maintenance scrub-embedding-vectors --agent-id myagent --yes
```

For all agents:

```bash
afs maintenance scrub-embedding-vectors --all --yes
```

---

## Models Namespace

The `models` namespace manages a local inference pipeline for embeddings, reranking, and query expansion. This is useful in offline or air-gapped environments where cloud APIs are unavailable.

### Install models

```bash
afs models install
```

### Serve models

Start the local model server. The `--role` flag selects which model roles to serve.

```bash
afs models serve --role all
afs models serve --role embeddings
afs models serve --role rerank
afs models serve --role expand
```

Run as a background daemon:

```bash
afs models serve --role embeddings --daemon
```

### Check status

```bash
afs models status
afs models status --json
```

### Stop models

```bash
afs models stop --role embeddings
afs models stop --all
```

---

## Quick Reference

| Category | Command | Description |
|----------|---------|-------------|
| **Memory** | `afs memory archive --agent-id X --memory-id M` | Archive a memory |
| | `afs memory unarchive --agent-id X --memory-id M` | Unarchive a memory |
| **Maintenance** | `afs maintenance reindex --agent-id X --yes` | Rebuild search indices |
| | `afs maintenance reindex --yes --text-only` | Rebuild FTS index only |
| | `afs maintenance scrub-embedding-vectors --agent-id X --yes` | Remove stale vectors |
| | `afs maintenance scrub-embedding-vectors --all --yes` | Scrub all agents |
| **Models** | `afs models install` | Install local models |
| | `afs models serve --role all` | Start model server |
| | `afs models status` | Check model server status |
| | `afs models stop --all` | Stop model server |

---

## See Also

- **[CLI Reference](/docs/cli-reference)** for the main command documentation.
- **[SKILL.md](https://github.com/labs21/afs/blob/main/skills/afs-skills/SKILL.md)** for the full agent-oriented CLI reference including common mistakes and workflow examples.
