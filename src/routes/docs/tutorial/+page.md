---
title: "Step-by-step Tutorial"
---

# Step-by-step Tutorial

This tutorial walks through a complete AFS workflow using only the CLI. By the end you will have initialized an instance, created and searched memories, shared findings through a swarm, tracked a session, and run maintenance.

## Prerequisites

```bash
pip install afscli
```

Verify the installation:

```bash
afs --help
```

---

## 1. Initialize an AFS Instance

Create a new `.afs/` directory in your project:

```bash
afs init
```

This creates `.afs/config.yaml` and the directory structure AFS needs. If you already have an instance and want to normalize the config:

```bash
afs init --force
```

---

## 2. Create Your First Memory

Store an observation as an agent named `tutorial-agent`:

```bash
afs memory create --agent-id tutorial-agent \
  --content "Auth module uses JWT tokens with 24h expiry" \
  --type observation
```

AFS returns the new memory ID (e.g. `mem_abc123`). Store a second memory:

```bash
afs memory create --agent-id tutorial-agent \
  --content "Rate limit is 1000 requests per hour on all endpoints" \
  --type observation \
```

---

## 3. List and Retrieve Memories

List all memories for your agent:

```bash
afs memory list --agent-id tutorial-agent --limit 10
```

Filter by type:

```bash
afs memory list --agent-id tutorial-agent --type observation
```

Get a single memory by ID:

```bash
afs memory get --agent-id tutorial-agent --memory-id mem_abc123
```

---

## 4. Search Memories

Run a full-text search:

```bash
afs query search --agent-id tutorial-agent --query "JWT tokens"
```

Get a context block sized for an LLM prompt:

```bash
afs query context --agent-id tutorial-agent \
  --query "authentication summary" \
  --max-chars 2000
```

Use reflective recall to walk the knowledge graph:

```bash
afs query recall --agent-id tutorial-agent \
  --query "auth issues" \
  --max-depth 2 --limit 5
```

---

## 5. Update a Memory

Increase the importance of a critical finding:

```bash
afs memory update --agent-id tutorial-agent \
  --memory-id mem_abc123 \
  --importance 0.95 \
  --metadata '{"verified": true}'
```

---

## 6. Share Findings via a Swarm

Join a swarm and share a memory so other agents can find it:

```bash
afs agent join --agent-id tutorial-agent --swarm-id demo-team

afs memory share --agent-id tutorial-agent \
  --memory-id mem_abc123 \
  --swarm-id demo-team
```

Another agent can now search the swarm:

```bash
afs query search --agent-id other-agent \
  --query "JWT tokens" \
  --limit 5
```

---

## 7. Track a Conversation Session

Create a token-budgeted session:

```bash
afs session create --agent-id tutorial-agent --token-budget 4000
```

Add conversation turns:

```bash
afs session add-turn --session-id ses_abc123 \
  --role user --content "Summarize the auth module"

afs session add-turn --session-id ses_abc123 \
  --role assistant --content "Auth uses JWT with 24h expiry and a refresh endpoint at /auth/refresh"
```

Retrieve the compressed context:

```bash
afs session context --session-id ses_abc123
```

List and manage sessions:

```bash
afs session list --agent-id tutorial-agent
afs session archive --session-id ses_abc123
```

---

## 8. Consolidate Knowledge

After accumulating observations, consolidate them into higher-level knowledge:

```bash
afs memory consolidate --agent-id tutorial-agent
```

Mine associations between memories:

```bash
afs memory mine --agent-id tutorial-agent
```

---

## 9. Explore the Knowledge Graph

See what a memory is connected to:

```bash
afs graph neighborhood --agent-id tutorial-agent \
  --memory-id mem_abc123 --depth 2
```

Find the shortest path between two memories:

```bash
afs graph path --agent-id tutorial-agent \
  --from mem_abc123 --to mem_def456
```

Manually connect two related memories:

```bash
afs graph connect --agent-id tutorial-agent \
  --src mem_abc123 --dst mem_def456 \
  --relation depends_on --weight 0.9
```

---

## 10. Attach Evidence

Upload a file as evidence for a memory:

```bash
afs attachment upload --agent-id tutorial-agent \
  --file screenshot.png --type image \
  --memory-id mem_abc123
```

List and download attachments:

```bash
afs attachment list --agent-id tutorial-agent --memory-id mem_abc123

afs attachment get --agent-id tutorial-agent \
  --attachment-id att_xyz789 --output /tmp/screenshot.png
```

---

## 11. Administration and Maintenance

Check system health and stats:

```bash
afs admin health
afs admin stats
```

Create a backup:

```bash
afs admin backup --output /backups/afs-backup.tar.gz
```

Query the audit log:

```bash
afs admin audit --operator tutorial-agent \
  --after 2026-02-01 --before 2026-02-28
```

Run a lifecycle tick:

```bash
afs maintenance tick --agent-id tutorial-agent
```

---

## 12. Start the Background Scheduler

Enable the scheduler in `.afs/config.yaml`:

```yaml
scheduler_enabled: true
scheduler_lifecycle_tick_interval: 3600
scheduler_consolidation_interval: 86400
```

Then start it:

```bash
afs scheduler start
afs scheduler status
```

---

## Next Steps

- **[CLI Reference](/docs/cli-reference)** for the full command listing.
- **[CLI Addendum](/docs/cli-addendum)** for additional commands (archive/unarchive, reindex, models) documented in the SKILL reference.
- **[Daily Operations](/docs/daily-operations)** for practical day-to-day patterns.
- **[Workflow Patterns](/docs/workflow-patterns)** for multi-agent scenarios.
