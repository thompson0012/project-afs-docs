---
title: "Introduction"
---

# AFS — Memory Lake for Agentic AI

> **The memory layer AI agents actually want to use.**

AFS (Agent File System) is a **CLI-first, filesystem-first memory system** for agentic AI. It gives your agents a persistent, shareable, graph‑enabled memory substrate so discoveries survive across sessions, teams, and workflows.

---

## The Problem: Agent Amnesia

Modern agents forget. Sessions end, token budgets truncate context, and parallel agents can’t share what they learn. The result is wasted time and repeated work.

```
WITHOUT AFS
Day 1: Agent learns "API has rate limit 1000/hr"
Day 2: Same agent asks "What's the rate limit?" → "I don't know"
Agent-1 finds bug → Session ends → Agent-2 starts fresh
```

---

## Why Filesystem‑First?

- **Local‑first**: keep memory with your codebase, no cloud dependency.
- **Auditable**: memory lives as files you can review and back up.
- **Portable**: move or version memory alongside your repo.
- **Composable**: works with any orchestration framework.

---

## How AFS Works

### Three‑Tier Memory (Automatic)
AFS manages memory like human cognition—no manual promotion needed.

```
WORKING → EPISODIC → SEMANTIC
recent observations → full history → consolidated knowledge
```

### Knowledge Graph (Auto‑Discovered)
AFS automatically links related memories using edges like `similar_to`, `co_occurred`, and `depends_on` so agents can recall context by relationship, not just keyword.

### Swarm Sharing
Share discoveries with a swarm so parallel agents build on each other instead of duplicating work.

---

## Proof Points

| Metric | Value |
| --- | --- |
| Search latency | &lt; 100ms (HNSW + FTS5) |
| Concurrent agents | 100+ (file-locking) |
| Memory capacity | Tested 100k+ memories/agent |
| Batch operations | Atomic, all‑or‑nothing |

---

## Common Use Cases

- **Codebase analysis**: retain architecture insights across sessions
- **Security research**: share vulnerabilities across agents
- **Long‑running research**: accumulate findings over days/weeks
- **Compliance**: audit trail of agent decisions
- **Offline environments**: air‑gapped or regulated teams

---

## Quick Start

```bash
afs init
afs memory create --agent-id researcher --content "Found SQL injection" --type observation
afs query search --agent-id researcher --query "security"
afs memory share --agent-id researcher --memory-id <id> --swarm-id security-team
```

---

## Next Steps

- Read **Architecture** to understand internals
- Explore the **Core Concepts** guide for memory, query, graph, and session flows
- Use the **CLI Reference** for complete command coverage
