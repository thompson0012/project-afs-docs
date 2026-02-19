---
title: "Workflow Patterns"
---

# AFS Workflow Patterns

This document details the three core agentic workflow patterns implemented in AFS, with concrete examples and CLI commands.

---

## Pattern 1: Coordinator-Executor (Anthropic-Style)

**Best For:** Structured tasks requiring deep reasoning, synthesis, and quality control

### Concept

A coordinator agent plans and delegates tasks to specialized executor agents. The coordinator synthesizes results and maintains quality through review cycles.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  COORDINATOR AGENT                                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Analyze request                                         │  │
│  │ 2. Query context from AFS                                  │  │
│  │ 3. Plan subtasks for executors                            │  │
│  │ 4. Aggregate and synthesize results                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│        ┌──────────────────┼──────────────────┐                  │
│        ↓                  ↓                  ↓                  │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐          │
│  │EXECUTOR A│      │EXECUTOR B│      │EXECUTOR C│          │
│  │Research  │      │Code      │      │Test      │          │
│  │          │      │          │      │          │          │
│  │• Query   │      │• Recall  │      │• Recall  │          │
│  │  context │      │  context │      │  context │          │
│  │• Create  │      │• Create  │      │• Create  │          │
│  │  findings│      │  code    │      │  test    │          │
│  │          │      │  memories│      │  results │          │
│  └──────────┘      └──────────┘      └──────────┘          │
│        ↓                  ↓                  ↓                  │
│        └──────────────────┼──────────────────┘                  │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ AFS: Graph edges track dependencies                       │  │
│  │ Graph: executor_a_output ──depends_on──> executor_b_input  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```python
from afs.engine import MemoryEngine
from afs.models import MemoryCreateRequest, MemorySearchQuery

class CoordinatorExecutorWorkflow:
    """AFS-backed coordinator-executor pattern"""
    
    def __init__(self, engine: MemoryEngine, coordinator_id: str):
        self.engine = engine
        self.coordinator_id = coordinator_id
    
    def plan_and_dispatch(self, task: str, subtasks: List[str]) -> dict:
        # 1. Get relevant context
        context = self.engine.get_context(
            self.coordinator_id,
            task,
            max_chars=4000,
        )
        
        # 2. Dispatch to executors
        results = []
        for i, subtask in enumerate(subtasks):
            executor_id = f"executor-{i}"
            
            # Store subtask
            self.engine.remember(MemoryCreateRequest(
                agent_id=executor_id,
                content=subtask,
                memory_type="observation",
                metadata={"parent": self.coordinator_id, "kind": "task"}
            ))
            
            # (External: executor processes subtask)
            
            # Collect result
            results.append({
                "executor": executor_id,
                "subtask": subtask
            })
        
        return {"context": context, "results": results}
    
    def aggregate(self, executor_results: List[str]) -> str:
        """Synthesize executor results into knowledge"""
        
        # Create aggregation memory
        summary = self.engine.remember(MemoryCreateRequest(
            agent_id=self.coordinator_id,
            content=f"Aggregated from {len(executor_results)} executors",
            memory_type="reflection",
        ))
        
        # Graph edges for tracking
        for result_id in executor_results:
            self.engine.add_edge(
                agent_id=self.coordinator_id,
                src=result_id,
                dst=summary.memory_id,
                data={"relation": "consolidated_from"}
            )
        
        # Consolidate into knowledge
        consolidated = self.engine.consolidate(self.coordinator_id)
        
        return consolidated
```

### CLI Commands

```bash
# Coordinator: Get relevant context before planning
afs query context --agent-id coordinator \
    --query "security review patterns" \
    --max-chars 2000

# Executors: Create observation memories
afs memory create --agent-id executor-1 \
    --content "Found SQL injection in auth.py:45" \
    --type observation

afs memory create --agent-id executor-2 \
    --content "Missing CSRF token validation" \
    --type observation

# Coordinator: Synthesize findings
afs memory consolidate --agent-id coordinator

# Track dependencies
afs graph connect --agent-id coordinator \
    --src mem_executor_1 \
    --dst mem_summary \
    --relation consolidated_from
```

---

## Pattern 2: Commander-Cluster (Kimi-Style)

**Best For:** High-throughput parallel tasks, massive information gathering, broad exploration

### Concept

A commander agent spawns 10-100 parallel agents that work simultaneously on different aspects of a task. Results are aggregated after parallel execution completes.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  COMMANDER AGENT (Kimi-style)                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Task: "Analyze 100 websites for security vulnerabilities"  │  │
│  │ Spawns 100 parallel agents (1 per website)                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PARALLEL AGENT CLUSTER (100 agents)                      │  │
│  │                                                           │  │
│  │  Agent-001  Agent-002  Agent-003  ...  Agent-100         │  │
│  │     ↓          ↓          ↓              ↓                │  │
│  │  [Analyze]  [Analyze]  [Analyze]      [Analyze]         │  │
│  │     ↓          ↓          ↓              ↓                │  │
│  │  [Store]    [Store]    [Store]        [Store]          │  │
│  │     ↓          ↓          ↓              ↓                │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ AFS BATCH OPERATIONS (atomic)                       │  │  │
│  │  │ Engine.batch_remember() - 100 memories in parallel  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  AGGREGATION PHASE                                        │  │
│  │  afs memory mine --agent-id commander                     │  │
│  │  afs memory consolidate --agent-id commander              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```python
from afs.engine import MemoryEngine
from afs.models import MemoryCreateRequest

class CommanderClusterWorkflow:
    """AFS-backed parallel agent cluster (Kimi-style)"""
    
    def __init__(self, engine: MemoryEngine, commander_id: str):
        self.engine = engine
        self.commander_id = commander_id
    
    async def dispatch_parallel(
        self, 
        task: str, 
        items: List[str],
        worker_template: str
    ) -> List[MemoryUnit]:
        """Dispatch task to N parallel workers"""
        
        # Prepare batch requests
        requests = []
        for i, item in enumerate(items):
            worker_id = f"worker-{i:03d}"
            content = worker_template.format(item=item)
            
            requests.append(MemoryCreateRequest(
                agent_id=worker_id,
                content=content,
                memory_type="observation",
                metadata={
                    "commander": self.commander_id,
                    "task": task,
                    "item_index": i
                }
            ))
        
        # Atomic batch creation
        memories = self.engine.batch_remember(requests)
        
        return memories
    
    def aggregate(self, worker_ids: List[str]) -> dict:
        """Aggregate results from all workers"""
        
        # Mine associations between findings
        stats = self.engine.mine_associations(self.commander_id)
        
        # Consolidate into knowledge base
        consolidated = self.engine.consolidate(self.commander_id)
        
        # Get final context
        context = self.engine.get_context(
            self.commander_id,
            "synthesis",
            max_chars=4000,
        )
        
        return {
            "associations_found": stats,
            "consolidated_memories": consolidated,
            "context": context
        }
```

### CLI Commands

```bash
# Commander: Spawn parallel workers (simulated)
for i in $(seq -f "%03g" 1 100); do
    afs memory create \
        --agent-id worker-$i \
        --content "Analysis of website $i" \
    --type observation &
done
wait

# Batch create alternative
cat items.jsonl | afs memory import --agent-id scanner

# Aggregation: Discover relationships
afs memory mine --agent-id commander

# Synthesis: Create knowledge units
afs memory consolidate --agent-id commander

# Get final report
afs query context --agent-id commander \
    --query "security findings summary"
```

---

## Pattern 3: Hybrid Sequential/Parallel

**Best For:** Real-world workflows with mixed phases (research → parallel analysis → synthesis)

### Concept

Combines sequential phases (dependency-ordered) with parallel sub-phases (independent tasks). This is the most common pattern in production systems.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  HYBRID WORKFLOW                                                 │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ PHASE 1: Research (Sequential)                           │  │
│  │   Task A → Task B → Task C                               │  │
│  │   (Each depends on previous output)                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ PHASE 2: Parallel Analysis (Independent)                 │  │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │  │
│  │   │Worker 1 │ │Worker 2 │ │Worker 3 │ │Worker 4 │        │  │
│  │   │         │ │         │ │         │ │         │        │  │
│  │   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │  │
│  └────────┼───────────┼───────────┼───────────┼──────────────┘  │
│           ↓           ↓           ↓           ↓                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ PHASE 3: Synthesis (Sequential)                          │  │
│  │   Aggregate → Review → Final Report                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```python
class HybridWorkflow:
    """AFS-backed hybrid sequential/parallel workflow"""
    
    def __init__(self, engine: MemoryEngine, agent_id: str):
        self.engine = engine
        self.agent_id = agent_id
    
    def execute_phase_sequential(self, tasks: List[Task]) -> List[MemoryUnit]:
        """Execute tasks in sequence, each depending on previous"""
        
        results = []
        previous_id = None
        
        for task in tasks:
            # Get context from previous task
            context = ""
            if previous_id:
                prev = self.engine.retrieve(self.agent_id, previous_id)
                context = prev.content if prev else ""
            
            # Create task memory
            task_memory = self.engine.remember(MemoryCreateRequest(
                agent_id=self.agent_id,
                content=f"{task.description}\n\nPrevious context: {context}",
                memory_type="observation",
                metadata={"phase": "sequential", "depends_on": previous_id, "kind": "task"}
            ))
            
            # (External: execute task)
            output = execute_task(task)
            
            # Store output
            output_memory = self.engine.remember(MemoryCreateRequest(
                agent_id=self.agent_id,
                content=output,
                memory_type="observation",
                metadata={"phase": "sequential", "task_id": task_memory.memory_id, "kind": "task_output"}
            ))
            
            # Graph edge for dependency
            if previous_id:
                self.engine.add_edge(
                    agent_id=self.agent_id,
                    src=previous_id,
                    dst=output_memory.memory_id,
                    data={"relation": "depends_on"}
                )
            
            previous_id = output_memory.memory_id
            results.append(output_memory)
        
        return results
    
    def execute_phase_parallel(self, tasks: List[Task]) -> List[MemoryUnit]:
        """Execute tasks in parallel (no dependencies)"""
        
        requests = [
            MemoryCreateRequest(
                agent_id=self.agent_id,
                content=task.description,
                memory_type="observation",
                metadata={"phase": "parallel", "parallel_group": "analysis", "kind": "task"}
            )
            for task in tasks
        ]
        
        return self.engine.batch_remember(requests)
    
    def execute_phase_synthesis(self, inputs: List[str]) -> MemoryUnit:
        """Aggregate and synthesize"""
        
        consolidated = self.engine.consolidate(self.agent_id)
        
        # Create final report
        final = self.engine.remember(MemoryCreateRequest(
            agent_id=self.agent_id,
            content="Final synthesized report",
            memory_type="reflection",
            metadata={"phase": "synthesis"}
        ))
        
        return final
```

### CLI Commands

```bash
# PHASE 1: Sequential research
afs memory create --agent-id researcher \
    --content "Research topic: authentication patterns" \
    --type observation

afs memory create --agent-id researcher \
    --content "Research topic: authorization patterns" \
    --type observation

# Connect dependencies
afs graph connect --agent-id researcher \
    --src mem_auth \
    --dst mem_authz \
    --relation depends_on

# PHASE 2: Parallel analysis (4 workers)
for i in 1 2 3 4; do
    afs memory create --agent-id analyst-$i \
        --content "Analysis of module $i" \
        --type observation &
done
wait

# PHASE 3: Synthesis
afs memory consolidate --agent-id lead-analyst
afs query recall --agent-id lead-analyst \
    --query "final report" \
    --max-depth 2
```

---

## Pattern Comparison

| Aspect | Coordinator-Executor | Commander-Cluster | Hybrid |
|--------|--------------------|--------------------| --------|
| **Agent Count** | 3-10 | 10-100 | 5-50 |
| **Parallelism** | Low-Medium | Very High | Medium-High |
| **Coordination** | High | Low | Medium |
| **Use Case** | Complex reasoning | Mass exploration | Real-world workflows |
| **AFS Features** | `consolidate()`, graph | `batch_remember()` | Both |
| **Latency** | Higher (sequential) | Lower (parallel) | Balanced |

---

## Choosing a Pattern

| Scenario | Recommended Pattern |
|----------|-------------------|
| Code review with specialists | **Coordinator-Executor** |
| Security scan of 100 targets | **Commander-Cluster** |
| Research report with analysis | **Hybrid** |
| Multi-team knowledge sharing | **Swarm (all patterns)** |
| Single-agent memory management | **Single-agent (not shown)** |

---

## Audit Logging Patterns

The audit trail records every operation your agents perform. These patterns show how to use it for debugging, monitoring, and compliance.

### Pattern A: Debugging Memory Retrieval

**When to use:** An agent behaved unexpectedly and you want to trace the exact sequence of operations it performed — what it searched for, what it retrieved, and in what order.

```bash
# See all operations an agent performed on a specific memory
afs admin audit --agent-id my-agent --resource mem_abc123

# See all search operations with their queries
afs admin audit --agent-id my-agent --operation search_memory --limit 50
```

The query output shows `timestamp`, `operation`, and `payload.query` for each record, letting you reconstruct exactly why an agent did (or didn't) surface a memory.

---

### Pattern B: Error Monitoring

**When to use:** Debugging agent failures, or setting up alerting on error patterns across a time window.

```bash
# Find all failed operations in a time window
afs admin audit --status error --since 2026-02-17 --until 2026-02-18

# Find all errors for a specific agent
afs admin audit --agent-id my-agent --status error --limit 20
```

For programmatic monitoring, query directly from Python:

```python
records = engine.audit_log.query_records(status="error", limit=100)
for r in records:
    print(f"{r['timestamp']} {r['operation']} {r['operator']} → {r['error_type']}: {r['error_message']}")
```

This is useful for building dashboards or alerting pipelines on top of AFS.

---

### Pattern C: Verifying Swarm Shares

**When to use:** Confirming that a `swarm_share_memory` operation actually completed — useful in multi-agent pipelines where a downstream agent depends on knowledge being available in the swarm.

```bash
# Confirm a memory was successfully shared to a swarm
afs admin audit --agent-id my-agent --operation swarm_share_memory --resource mem_abc123
```

If the record exists with `status="success"`, the share completed. If it's missing or shows `status="error"`, the downstream agent won't see the memory. Swarm share operations are fully audited — check the audit log before assuming a share succeeded.

---

### Pattern D: Session Audit Trails

**When to use:** Building compliance-sensitive workflows where session lifecycle events (create, update, delete) must appear in the audit log alongside memory operations.

By default, `SessionManager` does not audit session operations. Pass the `engine=` parameter to opt in:

```python
from afs.session import SessionManager

# Without engine= : session operations are NOT audited
session_mgr = SessionManager(base_path, settings)

# With engine= : session create/update/delete all appear in the audit log
session_mgr = SessionManager(base_path, settings, engine=engine)
```

This matters for regulated environments where you need a complete trace of what was created, modified, and deleted — not just memory reads and writes.

---

## Next Steps

- See [CLI Reference](/docs/cli-reference) for all available commands
- See [Integration Guide](/docs/integration) for framework-specific setup
- See [Daily Operations](/docs/daily-operations) for practical examples
