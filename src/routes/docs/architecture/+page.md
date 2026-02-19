---
title: "Architecture"
---

# AFS Agentic Workflow Architecture

**Version:** 0.1.0  
**Last Updated:** 2026-02-14  
**Status:** Production Ready

---

## Executive Summary

AFS (Agent File System) is a **CLI-first, filesystem-first agent memory system** that serves as the **memory substrate** for modern AI agent workflows. It uniquely bridges the gap between:

- **Anthropic's Agent Teams** (coordinator-executor pattern)
- **Kimi's Agent Swarms** (commander-cluster parallel pattern)

By providing persistent, shareable, graph-enabled memory infrastructure, AFS enables both deep reasoning workflows and massive parallel agent execution.

### Key Value Proposition

> **AFS doesn't replace agent orchestration frameworks—it enables them to scale by solving the hard problem of agent memory persistence and sharing.**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AFS LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Memory     │  │   Graph      │  │   Swarm      │              │
│  │   Engine     │  │   Store      │  │   Manager    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         ↓                 ↓                 ↓                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Unified CLI (`afs`) - Namespaces                │   │
│  │  memory | query | graph | agent | admin | maintenance         │   │
│  │  session | scheduler | attachment | models                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     AGENT WORKFLOW LAYERS                           │
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐ │
│  │ ANTHROPIC TEAMS │     │   AFS SWARM     │     │ KIMI SWARMS   │ │
│  │  (Coordinator-  │  ←→ │  (Memory Layer) │  ←→ │ (Commander-   │ │
│  │   Executor)     │     │                 │     │   Cluster)    │ │
│  └─────────────────┘     └─────────────────┘     └───────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Core Components

| Component | Purpose | Key File |
|-----------|---------|----------|
| **MemoryEngine** | Central coordinator for all memory operations | `src/afs/engine.py` |
| **SwarmManager** | Multi-agent knowledge sharing | `src/afs/swarm/manager.py` |
| **GraphStore** | Memory relationship tracking | `src/afs/graph.py` |
| **CLI** | 40+ commands across namespaces | `src/afs/cli/` |
| **API** | REST endpoints for integration | `src/afs/api/server.py` |

---

## Industry Pattern Coverage

AFS implements patterns found in leading agent frameworks:

| Framework | Primary Pattern | AFS Equivalent |
|-----------|----------------|----------------|
| **CrewAI** | Hierarchical/Sequential/Parallel | `MemoryEngine` + `consolidate()` |
| **AutoGen** | Swarm with dynamic handoffs | `SwarmManager` + shared memory pool |
| **LangGraph** | StateGraph with Send API | `batch_remember()` + graph edges |
| **Kimi k2.5** | 100-agent parallel execution | `batch_remember()` + filesystem isolation |

---

## Quick Start

### Installation

```bash
# Install from source
pip install -e .

# Or with optional embeddings
pip install -e ".[embeddings]"
```

### Basic Usage

```bash
# Create a memory
afs memory create --agent-id myagent --content "Hello world" --type observation

# Search memories
afs query search --agent-id myagent --query "hello"

# Join a swarm
afs agent join --agent-id myagent --swarm-id team-1

# Share knowledge
afs memory share --agent-id myagent --swarm-id team-1 --memory-id <id>
```

---

## Documentation Structure

This documentation is organized into the following sections:

1. **[Workflow Patterns](/docs/workflow-patterns)** - Detailed patterns for different agent architectures
2. **[CLI Reference](/docs/cli-reference)** - Complete command reference
3. **[Integration Guide](/docs/integration)** - Using AFS with CrewAI, AutoGen, LangGraph
4. **[Daily Operations](/docs/daily-operations)** - Common daily workflows

---

## Key Concepts

### Memory Tiers

AFS implements a three-tier memory system inspired by human cognition:

| Tier | Description | Lifecycle |
|------|-------------|-----------|
| **Working** | Recently created/accessed (&lt; 24h) | Auto-migrates to episodic |
| **Episodic** | Standard memories with full history | Auto-migrates to semantic |
| **Semantic** | Consolidated knowledge units | Persistent |

### Memory Lifecycle

```
encoding → retrieval → consolidation → reconsolidation → extinction
   ↓          ↓            ↓                ↓              ↓
 create    access    group & synthesize   update      delete
```

### Graph Relationships

Memories are connected via typed edges:

- **`similar_to`** - Semantic similarity (cosine similarity >= threshold)
- **`co_occurred`** - Temporal proximity (within time window)
- **`consolidated_from`** - Knowledge synthesis (created from group)
- **`depends_on`** - Task dependency (workflow tracking)

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Concurrent Agents** | 100+ | Thread-safe with file locking |
| **Memory Capacity** | Limited by filesystem | Tested with 100k+ memories |
| **Search Latency** | &lt; 100ms | HNSW vector search + FTS5 |
| **Batch Operations** | Atomic | All-or-nothing semantics |
| **Swarm Sharing** | Near real-time | Filesystem-based propagation |

---

## Audit Logging

All AFS engine operations are automatically audit-logged. Agents don't need to do anything special — the logging happens inside the engine and covers every operation category:

- **Memory**: create, retrieve, search, forget, consolidate, recall, reflect, inspect, stats
- **Graph**: mine, add edge, query edges, shortest path, export
- **Session**: create, get, update, delete, list, activate, deactivate
- **Swarm**: share, cancel, status
- **Scheduler**: start, stop, status
- **Attachment**: upload, get, list, delete

### Fail-Open Guarantee

If audit logging fails, the memory operation still succeeds. Audit infrastructure issues never block agents.

### Querying the Audit Trail

```bash
# CLI
afs admin audit --agent-id my-agent --limit 20

# Filter by status to find errors
afs admin audit --agent-id my-agent --status error
```

```
# API
GET /admin/audit?agent_id=my-agent&limit=20
```

**Common uses in agentic workflows:**

| Use Case | What to Do |
|----------|-----------|
| Post-hoc debugging | Query `--agent-id <id>` around the timestamp of interest |
| Compliance records | Full history of every agent decision, automatically captured |
| Error analysis | Filter `--status error` to surface failed operations |
| Monitoring | Detect unexpected operation patterns across agents |

For the full operation taxonomy and payload field conventions, see [`src/afs/audit_taxonomy.py`](../src/afs/audit_taxonomy.py) or [`docs/cli-reference.md`](/docs/cli-reference).

---

## When to Use AFS

### ✅ Ideal For

- Multi-agent systems requiring shared knowledge
- Workflows with sequential and parallel phases
- Teams needing audit trails and compliance
- Long-running agents with memory lifecycle needs
- Offline-first or air-gapped environments

### ❌ Not Ideal For

- Simple single-agent applications (overkill)
- Real-time collaborative editing (use CRDTs)
- Heavy write-heavy workloads (optimistic locking)
- Need for sub-millisecond latency (filesystem overhead)

---

## Next Steps

1. Read [Workflow Patterns](/docs/workflow-patterns) to understand how AFS fits your architecture
2. Review [CLI Reference](/docs/cli-reference) for command details
3. Follow [Integration Guide](/docs/integration) to connect with your framework
4. See [Daily Operations](/docs/daily-operations) for common tasks

---

## Support & Resources

- **Repository:** `/Users/kinshingwong/Documents/GitHub/labs21/project-afs`
- **CLI Entry:** `afs --help`
- **API Server:** `afs-server` (default port 8080)
- **Configuration:** `.afs/config.yaml` (MEMSYS env vars ignored)

---

*For detailed implementation examples and code patterns, see the individual documentation files linked above.*
