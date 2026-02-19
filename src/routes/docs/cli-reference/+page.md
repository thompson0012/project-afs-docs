---
title: "CLI Reference"
---

# AFS CLI Reference

Complete command reference for the AFS CLI. Commands are organized by namespace.

---

## General Usage

```bash
# Main help
afs --help

# Namespace help
afs memory --help
afs query --help
afs graph --help
afs agent --help
afs admin --help
afs maintenance --help
afs attachment --help
afs session --help
afs scheduler --help

# Command help
afs memory create --help
afs session create --help
```

---

## Namespace: `memory` - Memory Lifecycle

### `afs memory create`

Create a new memory.

```bash
afs memory create [OPTIONS]

--agent-id TEXT          Agent identifier (required)
--content TEXT           Memory content (required)
--type TEXT              Memory type (default: observation)
```

**Example:**
```bash
afs memory create \
    --agent-id myagent \
    --content "Found security issue in auth.py" \
    --type observation
```

---

### `afs memory import`

Import memories from JSONL file.

```bash
afs memory import [OPTIONS]

--agent-id TEXT          Agent identifier (required)
--file FILENAME          Input JSONL file (mutually exclusive with --stdin)
--stdin                  Read from stdin (mutually exclusive with --file)
```

**Example:**
```bash
# From file
afs memory import --agent-id myagent --file memories.jsonl

# From pipe
cat memories.jsonl | afs memory import --agent-id myagent --stdin
```

**JSONL Format:**
```json
{"content": "Memory 1", "memory_type": "observation", "metadata": {"key": "value"}}
{"content": "Memory 2", "memory_type": "reflection"}
```

---

### `afs memory get`

Get a single memory by ID.

```bash
afs memory get [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--memory-id TEXT     Memory ID (required)
```

---

### `afs memory list`

List memories with filters.

```bash
afs memory list [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--type TEXT          Filter by memory type
--limit INTEGER      Maximum results (default: 20)
--include-archived   Include archived memories
--filter TEXT        Metadata filter (repeatable, key=op:value)
--filter-json TEXT   Metadata filters as JSON
```

---

### `afs memory update`

Update memory fields.

```bash
afs memory update [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--memory-id TEXT     Memory ID (required)
--importance FLOAT   New importance score (0.0-1.0)
--confidence FLOAT   New confidence score (0.0-1.0)
--metadata JSON      JSON string of metadata to merge
```

---

### `afs memory delete`

Delete a memory.

```bash
afs memory delete [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--memory-id TEXT     Memory ID (required)
```

---

### `afs memory export`

Export memories.

```bash
afs memory export [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--since DATETIME     Export memories created after this time
--type TEXT          Filter by memory type
--limit INTEGER      Maximum results (default: 100)
```

---

### `afs memory share`

Share memory to a swarm.

```bash
afs memory share [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--memory-id TEXT     Memory ID (required)
--swarm-id TEXT      Swarm ID (required)
```

---

### `afs memory consolidate`

Consolidate related memories into knowledge units.

```bash
afs memory consolidate [OPTIONS]

--agent-id TEXT      Agent identifier (required)
```

---

### `afs memory mine`

Mine associations between memories.

```bash
afs memory mine [OPTIONS]

--agent-id TEXT      Agent identifier (required)
```

**Output:**
```
Found associations:
  - 12 similar_to relationships
  - 5 co_occurred relationships
```

---

## Namespace: `query` - Search & Retrieval

### `afs query search`

Search memories with filters.

```bash
afs query search [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--query TEXT         Search query
--type TEXT          Filter by memory type
--limit INTEGER      Maximum results (default: 10)
--after DATETIME     Start date (ISO format, use with --before)
--before DATETIME    End date (ISO format, use with --after)
--filter TEXT        Metadata filter (repeatable, key=op:value)
--filter-json TEXT   Metadata filters as JSON
--include-archived   Include archived memories
```

**Note**: Search strategy is controlled via `.afs/config.yaml` using the `search_strategy` field. Supported values: `fts` (full-text search with BM25 ranking, default) or `rrf` (reciprocal rank fusion of FTS + vector results). See Configuration section for details.

---

### `afs query recall`

Reflective recall with graph walking.

```bash
afs query recall [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--query TEXT         Query string (required)
--max-depth INTEGER  Maximum graph traversal depth (default: 2)
--limit INTEGER      Maximum results (default: 10)
```

---

### `afs query context`

Assemble context block for LLM.

```bash
afs query context [OPTIONS]

--agent-id TEXT          Agent identifier (required)
--query TEXT             Query string (required)
--limit INTEGER          Maximum memories to search (default: 10)
--max-chars INTEGER      Maximum total characters (default: 4000)
```

---

### `afs query recent`

Get recent memories.

```bash
afs query recent [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--limit INTEGER      Maximum results (default: 10)
```

---

### `afs query priority`

Get high-priority memories.

```bash
afs query priority [OPTIONS]

--agent-id TEXT          Agent identifier (required)
--limit INTEGER          Maximum results (default: 10)
--min-importance FLOAT  Minimum importance score (default: 0.7)
```

---

### `afs query inspect`

Inspect agent memory state.

```bash
afs query inspect [OPTIONS]

--agent-id TEXT      Agent identifier (required)
```

---

### `afs query stats`

Get memory statistics.

```bash
afs query stats [OPTIONS]

--agent-id TEXT      Agent identifier (required)
```

---

## Namespace: `graph` - Graph Operations

### `afs graph neighborhood`

Get memory neighborhood.

```bash
afs graph neighborhood [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--memory-id TEXT     Starting memory ID (required)
--depth INTEGER      Traversal depth (default: 1)
```

---

### `afs graph path`

Find path between memories.

```bash
afs graph path [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--from TEXT          Start memory ID (required)
--to TEXT            End memory ID (required)
--weighted          Use weighted path (default: unweighted)
--max-cost FLOAT     Maximum path cost (for weighted)
```

---

### `afs graph connect`

Connect two memories.

```bash
afs graph connect [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--src TEXT           Source memory ID (required)
--dst TEXT           Destination memory ID (required)
--relation TEXT      Relation type (default: related_to)
--weight FLOAT       Edge weight (default: 1.0)
--edge-id TEXT       Custom edge ID
```

---

### `afs graph edges`

Query edges.

```bash
afs graph edges [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--from TEXT          Filter by source
--to TEXT            Filter by destination
--relation TEXT      Filter by relation type
--min-weight FLOAT   Minimum weight
--property-filter TEXT  JSON MetadataFilters for properties
```

---

### `afs graph discover`

Discover relationships.

```bash
afs graph discover [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--memory-id TEXT     Memory identifier (required)
--max-depth INTEGER  Maximum discovery depth (default: 2)
--min-similarity FLOAT  Minimum similarity threshold (default: 0.7)
```

---

### `afs graph prune`

Prune weak edges.

```bash
afs graph prune [OPTIONS]

--agent-id TEXT          Agent identifier (required)
--min-weight FLOAT      Prune edges below weight
--older-than-days INTEGER  Prune edges older than N days
--dry-run               Show what would be pruned without removing
```

---

### `afs graph export`

Export all graph edges for an agent as CSV. Each row contains the edge ID, source memory ID, target memory ID, and edge data.

```bash
afs graph export [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--format TEXT        Output format: csv (default: csv)
```

**Example:**
```bash
afs graph export --agent-id researcher-1 --format csv
```

This operation is audit-logged.

---

## Namespace: `agent` - Agent Management

### `afs agent create`

Create a new agent.

```bash
afs agent create [OPTIONS]

--name TEXT         Agent name
--type TEXT         Agent type
```

---

### `afs agent profile`

Show agent profile.

```bash
afs agent profile [OPTIONS]

--agent-id TEXT     Agent identifier (required)
```

---

### `afs agent merge`

Merge two agents.

```bash
afs agent merge [OPTIONS]

--agent-id TEXT     Source agent ID (required)
--target-id TEXT    Target agent ID (required)
```

---

### `afs agent migrate`

Migrate agent data.

```bash
afs agent migrate [OPTIONS]

--agent-id TEXT     Agent identifier (required)
--target-path TEXT  Target directory (required)
```

---

### `afs agent join`

Join agent to swarm.

```bash
afs agent join [OPTIONS]

--agent-id TEXT     Agent identifier (required)
--swarm-id TEXT     Swarm ID (required)
```

---

## Swarm Operations

Swarm operations let agents share knowledge across a named pool. There is no standalone `afs swarm` namespace. Swarm operations are available through the `memory` and `agent` namespaces:

| Operation | Command |
|-----------|---------|
| Join a swarm | `afs agent join --agent-id X --swarm-id S` |
| Share a memory to a swarm | `afs memory share --agent-id X --memory-id M --swarm-id S` |

See [`afs memory share`](#afs-memory-share) and [`afs agent join`](#afs-agent-join) for full option details. Both operations are audit-logged.

---

## Namespace: `attachment` - Attachment Management

### `afs attachment upload`

Upload a file and attach it to an agent or an existing memory.

```bash
afs attachment upload [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--file TEXT          Path to file, or '-' to read from stdin (required)
--type TEXT          Attachment type: image, audio, structured, code (required)
--memory-id TEXT     Memory ID to attach to (optional, standalone if omitted)
```

**Example:**
```bash
afs attachment upload \
    --agent-id researcher-1 \
    --file exploit-proof.png \
    --type image \
    --memory-id mem_abc123
```

This operation is audit-logged.

---

### `afs attachment list`

List attachments for an agent, optionally filtered by memory or type.

```bash
afs attachment list [OPTIONS]

--agent-id TEXT      Agent identifier (required)
--memory-id TEXT     Filter by memory ID (optional)
--type TEXT          Filter by attachment type: image, audio, structured, code (optional)
```

**Example:**
```bash
# All attachments for an agent
afs attachment list --agent-id researcher-1

# Attachments linked to a specific memory
afs attachment list --agent-id researcher-1 --memory-id mem_abc123

# Only image attachments
afs attachment list --agent-id researcher-1 --type image
```

This operation is audit-logged.

---

### `afs attachment get`

Download an attachment to a file or stdout.

```bash
afs attachment get [OPTIONS]

--attachment-id TEXT  Attachment ID (required)
--output TEXT         Output file path, or '-' for stdout (required)
--agent-id TEXT       Agent identifier (required)
```

**Example:**
```bash
afs attachment get \
    --agent-id researcher-1 \
    --attachment-id att_xyz789 \
    --output /tmp/downloaded.png
```

This operation is audit-logged.

---

### `afs attachment delete`

Delete an attachment permanently.

```bash
afs attachment delete [OPTIONS]

--attachment-id TEXT  Attachment ID (required)
--agent-id TEXT       Agent identifier (required)
```

This operation is audit-logged.

---

## Namespace: `session` - Session Management

Sessions track conversation turns under a configurable token budget. When a session approaches its budget, older turns are compressed automatically so the most recent context always fits.

### `afs session create`

Create a new session for an agent.

```bash
afs session create [OPTIONS]

--agent-id TEXT          Agent identifier (required)
--token-budget INTEGER   Maximum tokens allowed in session (default: 4000)
```

**Example:**
```bash
afs session create --agent-id assistant --token-budget 8000
```

This operation is audit-logged.

---

### `afs session list`

List all sessions for an agent.

```bash
afs session list [OPTIONS]

--agent-id TEXT      Agent identifier (required)
```

**Example:**
```bash
afs session list --agent-id assistant
```

This operation is audit-logged.

---

### `afs session get`

Get session details by ID.

```bash
afs session get [OPTIONS]

--session-id TEXT    Session identifier (required)
```

This operation is audit-logged.

---

### `afs session add-turn`

Add a conversation turn to an existing session.

```bash
afs session add-turn [OPTIONS]

--session-id TEXT    Session identifier (required)
--role TEXT          Role of the turn: user, assistant, system (required)
--content TEXT       Content of the turn (required)
```

**Example:**
```bash
afs session add-turn \
    --session-id ses_abc123 \
    --role user \
    --content "Analyze the auth module"
```

This operation is audit-logged.

---

### `afs session context`

Get the formatted conversation context for a session. Outputs turns as `Role: content` lines, with older turns compressed when the token budget requires it.

```bash
afs session context [OPTIONS]

--session-id TEXT    Session identifier (required)
```

**Example:**
```bash
afs session context --session-id ses_abc123
```

This operation is audit-logged.

---

### `afs session archive`

Archive a session to prevent further modifications.

```bash
afs session archive [OPTIONS]

--session-id TEXT    Session identifier (required)
```

This operation is audit-logged.

---

### `afs session delete`

Delete a session permanently.

```bash
afs session delete [OPTIONS]

--session-id TEXT    Session identifier (required)
```

This operation is audit-logged.

---

## Namespace: `admin` - System Administration

### `afs admin health`

System health check.

```bash
afs admin health [OPTIONS]
```

---

### `afs admin stats`

System-wide metrics.

```bash
afs admin stats [OPTIONS]
```

---

### `afs admin backup`

Create backup.

```bash
afs admin backup [OPTIONS]

--output FILENAME   Output file (required)
```

---

### `afs admin restore`

Restore from backup.

```bash
afs admin restore [OPTIONS]

--input FILENAME    Backup file (required)
```

---

### `afs admin config show`

Show configuration.

```bash
afs admin config show [OPTIONS]

--json  Print raw JSON
```

---

### `afs admin config set`

Set a configuration key.

```bash
afs admin config set [OPTIONS] key=value
```

---

### `afs admin config export`

Export config to a file.

```bash
afs admin config export [OPTIONS]

--output FILENAME  Output file (required)
```

---

### `afs admin config import`

Import config from a file.

```bash
afs admin config import [OPTIONS]

--input FILENAME   Input file (required)
```

---

### `afs admin config validate`

Validate the discovered config.

```bash
afs admin config validate [OPTIONS]
```

---

### `afs admin audit`

Query audit logs.

```bash
afs admin audit [OPTIONS]

--after DATETIME     Start time (ISO format)
--before DATETIME    End time (ISO format)
--operator TEXT      Filter by agent
--operation TEXT     Filter by operation type
--verify             Verify audit chain integrity
```

---

### `afs admin rebuild`

Rebuild indices.

```bash
afs admin rebuild [OPTIONS]
```

---

### `afs admin vacuum`

Remove tombstones and rebuild.

```bash
afs admin vacuum [OPTIONS]
```

---

## Namespace: `maintenance` - Lifecycle Maintenance

### `afs maintenance tick`

Lifecycle tick.

```bash
afs maintenance tick [OPTIONS]

--agent-id TEXT     Agent identifier (required)
```

---

### `afs maintenance purge`

Purge old memories.

```bash
afs maintenance purge [OPTIONS]

--agent-id TEXT     Agent identifier (required)
```

---

### `afs maintenance optimize`

Optimize storage.

```bash
afs maintenance optimize [OPTIONS]
```

---

### `afs maintenance associations`

Manage associations.

```bash
afs maintenance associations [OPTIONS]

--agent-id TEXT     Agent identifier (required)
```

---

## Namespace: `scheduler` - Background Scheduler

The background scheduler runs periodic maintenance tasks (lifecycle ticks, consolidation) on a configurable interval. Enable it in `.afs/config.yaml` by setting `scheduler_enabled: true`.

### `afs scheduler start`

Start the background scheduler.

```bash
afs scheduler start
```

**Example:**
```bash
afs scheduler start
```

This operation is audit-logged.

---

### `afs scheduler stop`

Stop the background scheduler.

```bash
afs scheduler stop
```

This operation is audit-logged.

---

### `afs scheduler status`

Get the current scheduler status, including whether it is running and the configured intervals.

```bash
afs scheduler status
```

This operation is audit-logged.

---

## Quick Reference Table

| Category | Task | Command |
|----------|------|---------|
| **Memory** | Create | `afs memory create --agent-id X --content "Y"` |
| | Import | `afs memory import --agent-id X --file F` |
| | List | `afs memory list --agent-id X` |
| | Delete | `afs memory delete --agent-id X --memory-id M` |
| | Consolidate | `afs memory consolidate --agent-id X` |
| | Mine | `afs memory mine --agent-id X` |
| | Share | `afs memory share --agent-id X --memory-id M --swarm-id S` |
| **Query** | Search | `afs query search --agent-id X --query "Q"` |
| | Context | `afs query context --agent-id X --query "Q"` |
| | Recall | `afs query recall --agent-id X --query "Q"` |
| | Recent | `afs query recent --agent-id X` |
| **Graph** | Connect | `afs graph connect --agent-id X --src A --dst B` |
| | Path | `afs graph path --agent-id X --from A --to B` |
| | Neighborhood | `afs graph neighborhood --agent-id X --memory-id M` |
| | Export | `afs graph export --agent-id X` |
| **Attachment** | Upload | `afs attachment upload --agent-id X --file F --type image` |
| | List | `afs attachment list --agent-id X` |
| | Get | `afs attachment get --agent-id X --attachment-id A --output F` |
| | Delete | `afs attachment delete --agent-id X --attachment-id A` |
| **Session** | Create | `afs session create --agent-id X` |
| | List | `afs session list --agent-id X` |
| | Add turn | `afs session add-turn --session-id S --role user --content "C"` |
| | Context | `afs session context --session-id S` |
| | Archive | `afs session archive --session-id S` |
| | Delete | `afs session delete --session-id S` |
| **Agent** | Join swarm | `afs agent join --agent-id X --swarm-id S` |
| | Profile | `afs agent profile --agent-id X` |
| **Admin** | Health | `afs admin health` |
| | Stats | `afs admin stats` |
| | Backup | `afs admin backup --output F` |
| | Audit | `afs admin audit --after DATE --before DATE` |
| **Maintenance** | Tick | `afs maintenance tick --agent-id X` |
| | Purge | `afs maintenance purge --agent-id X` |
| **Scheduler** | Start | `afs scheduler start` |
| | Stop | `afs scheduler stop` |
| | Status | `afs scheduler status` |

---

## Environment Variables

AFS configuration is loaded from the discovered `.afs/config.yaml`. Environment
variables are not used for configuration or discovery.

---

## See Also

- [Overview](/docs/architecture) - Architecture introduction
- [Workflow Patterns](/docs/workflow-patterns) - Pattern selection
- [Daily Operations](/docs/daily-operations) - Practical examples
- [Integration Guide](/docs/integration) - Framework integration
