---
title: "Daily Operations"
---

# AFS Daily Operations Guide

This guide provides practical examples of common daily workflows using AFS. Each section includes step-by-step CLI commands.

---

## Morning: System Initialization

### Check System Health

```bash
# Verify all AFS components are operational
afs admin health

# Expected output:
# ✓ Storage backend healthy
# ✓ Vector index operational  
# ✓ Graph store accessible
# ✓ 3 agents registered
```

### Check Agent Status

```bash
# View specific agent profile
afs agent profile --agent-id myagent

# Get memory statistics
afs query stats --agent-id myagent
```

### Join Daily Swarm

```bash
# Join team's daily swarm for knowledge sync
afs agent join --agent-id myagent --swarm-id daily-standup-$(date +%Y%m%d)

# Ingest shared knowledge from team (Python/API only)
# Use SwarmManager.ingest_shared() or the REST API /v1/swarms/{swarm_id}/share
```

---

## Mid-Day: Task Execution

### Research Phase: Get Context

```bash
# Get relevant background before starting task
afs query context --agent-id researcher \
    --query "authentication security patterns" \
    --max-chars 2000

# Search for specific memories
afs query search --agent-id researcher \
    --query "SQL injection" \
    --type observation \
    --limit 20
```

### Store Findings

```bash
# Create observation memory
afs memory create \
    --agent-id researcher \
    --content "Found unvalidated redirect in /auth/login" \
    --type observation

# Create reflection memory
afs memory create \
    --agent-id researcher \
    --content "Pattern: Input validation is missing across auth modules" \
    --type reflection
```

### Parallel Agent Execution

```bash
# Simulate parallel workers (for task distribution)
for i in 1 2 3 4 5; do
    afs memory create \
        --agent-id analyst-$i \
        --content "Analysis of module $i: Found 3 issues" \
        --type observation &
done
wait

# Wait for completion
echo "All parallel workers completed"
```

### Swarm Knowledge Sharing

```bash
# Share important finding to team swarm
afs memory share \
    --agent-id analyst-1 \
    --memory-id mem_abc123 \
    --swarm-id security-team

# Other team members ingest (Python/API only)
# Use SwarmManager.ingest_shared() or the REST API
```

### Discovery & Association Mining

```bash
# Discover relationships between memories
afs memory mine --agent-id researcher

# Output:
# Found associations:
#   - 12 similar_to relationships
#   - 5 co_occurred relationships

# View memory neighborhood
afs graph neighborhood \
    --agent-id researcher \
    --memory-id mem_abc123 \
    --depth 2

# Find shortest path between memories
afs graph path \
    --agent-id researcher \
    --from mem_finding_1 \
    --to mem_summary
```

### Synthesis

```bash
# Consolidate related memories into knowledge
afs memory consolidate --agent-id researcher

# Get synthesized context
afs query context \
    --agent-id researcher \
    --query "security findings summary" \
    --max-chars 4000
```

---

## Afternoon: Maintenance

### Lifecycle Management

```bash
# Trigger lifecycle tick (migrate memories between tiers)
afs maintenance tick --agent-id researcher

# Output:
# Lifecycle tick complete:
#   - Migrated: 8 (working → episodic)
#   - Updated: 23 (freshness scores)
#   - Skipped: 1,216

# Purge old memories
afs maintenance purge --agent-id researcher
```

### Graph Maintenance

```bash
# Prune weak graph edges
afs graph prune --agent-id researcher --min-weight 0.3

# View edge statistics
afs graph edges --agent-id researcher --min-weight 0.5 | wc -l
```

---

## End of Day: Audit & Backup

### Review Operations

```bash
# Query audit log for today's operations
afs admin audit \
    --agent-id myagent \
    --since $(date -v0H -v0M -v0S +%Y-%m-%dT%H:%M:%SZ) \
    --until $(date +%Y-%m-%dT%H:%M:%SZ) \
    --status success \
    --limit 100

# Filter options:
#   --agent-id    Filter by agent/operator
#   --operation   Filter by operation name (e.g. search_memory, create_memory)
#   --resource    Filter by resource ID (memory ID, session ID, etc.)
#   --status      Filter by status: success, error, or partial
#   --since       ISO date/datetime lower bound
#   --until       ISO date/datetime upper bound
#   --limit       Max number of records to return

# Example: review all errors from a specific agent today
afs admin audit --agent-id myagent --status error --since 2026-02-18

# Full filter example:
afs admin audit \
    --agent-id agent-123 \
    --operation search_memory \
    --since 2026-02-17 \
    --until 2026-02-18 \
    --status success \
    --limit 50

# Sample audit record:
# {
#   "id": "audit_1771382740787_686fa5ec",
#   "timestamp": "2026-02-18T09:32:11Z",
#   "operation": "create_memory",
#   "operator": "myagent",
#   "resource": "mem_abc123",
#   "status": "success",
#   "payload": { "type": "observation", "importance": 0.8 }
# }
#
# Error record includes optional fields:
#   "error_type": "not_found"
#   "error_message": "Memory mem_xyz not found"
#
# ~45 operation types cover: memory CRUD, search/recall, graph,
# sessions (7 ops), swarm sharing (3 ops), scheduler (3 ops),
# attachments, graph export, and more.
#
# Fail-open: audit failures never block the primary operation.
```

### System Statistics

```bash
# Get system-wide metrics
afs admin stats

# Output:
# System Metrics:
#   Total agents: 15
#   Total memories: 18,432
#   Storage: 14.7 GB

# Get per-agent stats
afs query stats --agent-id myagent

# Output:
# Agent: myagent
#   Memories: 1,289 (↑42 today)
#   Tiers: Working: 8 | Episodic: 567 | Semantic: 714
#   Graph edges: 2,341
#   Associations: similar_to: 156, co_occurred: 89
```

### Backup

```bash
# Create backup
afs admin backup --output /backups/afs-$(date +%Y%m%d).tar.gz

# Verify backup
ls -lh /backups/afs-*.tar.gz
```

---

## Common Workflows

### Workflow 1: Code Review Sprint

```bash
#!/bin/bash
# code-review-sprint.sh

TEAM_SWARM="pr-$(gh pr view --json number -q .number)"
REVIEWERS="reviewer-{1..5}"

# 1. Initialize swarm
echo "Initializing review swarm: $TEAM_SWARM"
for reviewer in $REVIEWERS; do
    afs agent join --agent-id $reviewer --swarm-id $TEAM_SWARM
done

# 2. Get relevant context
echo "Fetching relevant context..."
for reviewer in $REVIEWERS; do
    afs query context --agent-id $reviewer \
        --query "security patterns $FILE" \
        --max-chars 1000 &
done
wait

# 3. Parallel review
echo "Starting parallel review..."
FILES=($(gh pr diff --name-only | head -5))
for i in "${!FILES[@]}"; do
    reviewer_id="reviewer-$((i % 5 + 1))"
    afs memory create \
        --agent-id $reviewer_id \
        --content "Review of ${FILES[$i]}: Issues found..." \
        --type observation &
done
wait

# 4. Share findings
echo "Sharing critical findings..."
CRITICAL_FINDINGS=$(afs query search --agent-id reviewer-1 \
    --query "severity:high" --type observation --limit 5)

for finding in $CRITICAL_FINDINGS; do
    afs memory share --agent-id reviewer-1 \
        --memory-id $finding \
        --swarm-id $TEAM_SWARM
done

# 5. Synthesize
echo "Synthesizing review..."
afs memory consolidate --agent-id lead-reviewer

echo "Review complete!"
```

### Workflow 2: Research Sprint

```bash
#!/bin/bash
# research-sprint.sh

QUERY="$1"
MAX_PARALLEL=10

# 1. Initial research (sequential)
echo "Initial research on: $QUERY"
afs query context --agent-id lead-researcher \
    --query "$QUERY" --max-chars 4000

# 2. Sub-topics for parallel exploration
TOPICS=(
    "history of $QUERY"
    "current state of $QUERY"
    "future trends $QUERY"
    "competitors in $QUERY"
    "regulations around $QUERY"
)

# 3. Parallel exploration
echo "Exploring ${#TOPICS[@]} topics in parallel..."
for i in "${!TOPICS[@]}"; do
    topic_idx=$((i % MAX_PARALLEL))
    afs memory create \
        --agent-id explorer-$topic_idx \
        --content "Research on: ${TOPICS[$i]}" \
        --type observation &
done
wait

# 4. Mine associations
echo "Discovering connections..."
afs memory mine --agent-id lead-researcher

# 5. Synthesize findings
echo "Synthesizing..."
afs memory consolidate --agent-id lead-researcher

# 6. Generate report
echo "Generating final report..."
afs query recall --agent-id lead-researcher \
    --query "$QUERY findings" \
    --max-depth 3 \
    --limit 10

echo "Research complete!"
```

### Workflow 3: Swarm Knowledge Sync

```bash
#!/bin/bash
# swarm-sync.sh

SWARM_ID="${1:-team-default}"
SYNC_INTERVAL="${2:-3600}"  # Default: 1 hour

echo "Starting swarm sync: $SWARM_ID (interval: ${SYNC_INTERVAL}s)"
echo "Press Ctrl+C to stop"

while true; do
# Get current swarm members
# (No CLI for swarm membership; track externally or via your app)
MEMBERS="reviewer-1 reviewer-2 reviewer-3"
    
    echo "[$(date)] Syncing ${MEMBERS} agents..."
    
    # Ingest new shared memories
    # Ingest shared memories (Python/API only)
    
    # Share agent's key learnings
    for agent in $MEMBERS; do
        LATEST=$(afs memory list --agent-id $agent \
            --type reflection --limit 1)
        
        if [ -n "$LATEST" ]; then
            afs memory share \
                --agent-id $agent \
                --memory-id $LATEST \
                --swarm-id $SWARM_ID
        fi
    done
    
    sleep $SYNC_INTERVAL
done
```

---

## Troubleshooting

### Memory Issues

```bash
# Inspect agent memory state
afs query inspect --agent-id myagent

# Check for corrupted memories
afs query search --agent-id myagent --query "ERROR" --limit 100

# Rebuild indices
afs admin rebuild
```

### Graph Issues

```bash
# Check graph integrity
afs graph edges --agent-id myagent --from mem_a --to mem_b

# Find orphaned memories (no edges)
# Manual: compare memory list with graph nodes
```

### Performance Issues

```bash
# Optimize storage (vacuum tombstones)
afs admin vacuum

# Check index sizes
ls -la .afs/system/indices/
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Check health | `afs admin health` |
| Create memory | `afs memory create --agent-id X --content "Y"` |
| Search | `afs query search --agent-id X --query "Y"` |
| Get context | `afs query context --agent-id X --query "Y"` |
| Join swarm | `afs agent join --agent-id X --swarm-id Y` |
| Share memory | `afs memory share --agent-id X --memory-id M --swarm-id Y` |
| Consolidate | `afs memory consolidate --agent-id X` |
| Lifecycle tick | `afs maintenance tick --agent-id X` |
| Audit log | `afs admin audit --agent-id X --since YYYY-MM-DD --until YYYY-MM-DD` |
| Backup | `afs admin backup --output FILE` |

---

## See Also

- [CLI Reference](/docs/cli-reference) - Complete command list
- [Workflow Patterns](/docs/workflow-patterns) - Pattern selection guide
- [Integration Guide](/docs/integration) - Framework integration
