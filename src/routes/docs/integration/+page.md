---
title: "Integration Guide"
---

# AFS Integration Guide

This guide shows how to integrate AFS with popular agent frameworks: CrewAI, AutoGen, and LangGraph.

---

## CrewAI Integration

CrewAI uses hierarchical agent structures with sequential and parallel task execution. AFS provides the memory layer.

### Installation

```bash
pip install crewai
pip install -e .
```

### Basic Integration

```python
from crewai import Agent, Task, Crew, Process
from pathlib import Path

from afs.config import MemorySystemSettings
from afs.engine import MemoryEngine
from afs.models import MemoryCreateRequest, MemorySearchQuery

# Initialize AFS
base_path = Path("./.afs")
settings = MemorySystemSettings(base_path=base_path)
engine = MemoryEngine(base_path, settings)

class AFSMemoryTool:
    """Tool for CrewAI agents to store memories in AFS"""
    
    def remember(self, content: str, memory_type: str = "observation") -> str:
        """Store a memory"""
        result = engine.remember(MemoryCreateRequest(
            agent_id=self.agent_id,
            content=content,
            memory_type=memory_type
        ))
        return result.memory_id
    
    def recall(self, query: str, limit: int = 5) -> list:
        """Recall relevant memories"""
        results = engine.search(
            self.agent_id,
            MemorySearchQuery(query=query, limit=limit),
        )
        return [r.content for r in results]
    
    def consolidate(self) -> str:
        """Consolidate memories into knowledge"""
        consolidated = engine.consolidate(self.agent_id)
        return f"Created {len(consolidated)} knowledge units"

# Create AFS-backed tools
memory_tool = AFSMemoryTool(agent_id="researcher")

# Define agents with AFS memory
researcher = Agent(
    role="Researcher",
    goal="Research and document findings",
    backstory="Expert researcher with access to AFS memory",
    tools=[memory_tool.remember, memory_tool.recall]
)

writer = Agent(
    role="Writer",
    goal="Synthesize research into report",
    backstory="Technical writer with access to AFS knowledge base",
    tools=[memory_tool.recall, memory_tool.consolidate]
)

# Define tasks
research_task = Task(
    description="Research AI agent architectures",
    agent=researcher,
    expected_output="Detailed findings"
)

write_task = Task(
    description="Write report on findings",
    agent=writer,
    expected_output="Final report"
)

# Create crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential
)

result = crew.kickoff()
```

### Advanced: CrewAI with Swarm

```python
from crewai import Crew, Process

# Multiple researchers in parallel
researchers = [
    Agent(
        role=f"Researcher-{i}",
        goal=f"Research aspect {i} of the topic",
        backstory=f"Specialist in aspect {i}",
        tools=[memory_tool.remember]
    )
    for i in range(5)
]

# Parallel research tasks
research_tasks = [
    Task(
        description=f"Research aspect {i}",
        agent=researchers[i]
    )
    for i in range(5)
]

# Create parallel crew
crew = Crew(
    agents=researchers,
    tasks=research_tasks,
    process=Process.parallel
)

# After execution, consolidate findings
findings = engine.search(
    "Researcher-0",
    MemorySearchQuery(query="research findings", limit=100)
)

# Consolidate across all researchers
engine.consolidate("lead-researcher")
```

---

## AutoGen Integration

AutoGen uses dynamic agent collaboration with handoffs. AFS provides shared swarm memory.

### Installation

```bash
pip install pyautogen
pip install -e .
```

### Basic Integration

```python
import autogen
from pathlib import Path

from afs.config import MemorySystemSettings
from afs.engine import MemoryEngine
from afs.swarm.manager import SwarmManager
from afs.models import MemoryCreateRequest

# Initialize AFS
base_path = Path("./.afs")
settings = MemorySystemSettings(base_path=base_path)
engine = MemoryEngine(base_path, settings)
swarm_manager = SwarmManager(base_dir=base_path)

class AFSSharedMemory:
    """Shared memory for AutoGen agents"""
    
    def share(self, content: str, agent_id: str, swarm_id: str) -> str:
        """Share memory to swarm"""
        memory = engine.remember(MemoryCreateRequest(
            agent_id=agent_id,
            content=content,
            memory_type="observation"
        ))
        
        swarm_manager.share_memory(
            swarm_id=swarm_id,
            agent_id=agent_id,
            memory_id=memory.memory_id,
            engine=engine
        )
        return memory.memory_id
    
    def ingest(self, agent_id: str, swarm_id: str) -> int:
        """Ingest shared memories"""
        ingested = swarm_manager.ingest_shared(
            swarm_id=swarm_id,
            recipient_agent_id=agent_id,
            engine=engine
        )
        return len(ingested)

shared_memory = AFSSharedMemory()

# Define agents with AFS tools
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={"model": "gpt-4"}
)

researcher = autogen.AssistantAgent(
    name="researcher",
    llm_config={"model": "gpt-4"},
    function_map={
        "share_to_team": shared_memory.share,
        "ingest_team_knowledge": shared_memory.ingest
    }
)

# Register handoff functions
researcher.register_handoffs(
    target=assistant,
    message_template="Here's the research: {research_result}"
)

# Initialize swarm
swarm_id = "project-alpha"
swarm_manager.register_agent(swarm_id, "researcher")
swarm_manager.register_agent(swarm_id, "assistant")
```

### AutoGen with Dynamic Handoffs

```python
class HandoffManager:
    """Manage agent handoffs with AFS"""
    
    def __init__(self, engine, swarm_manager):
        self.engine = engine
        self.swarm_manager = swarm_manager
    
    def handoff_with_context(
        self, 
        from_agent: str, 
        to_agent: str, 
        task: str,
        swarm_id: str
    ):
        """Handoff with full context retrieval"""
        
        # Get relevant context
        context = self.engine.get_context(
            from_agent,
            task,
            max_chars=2000,
        )
        
        # Store handoff record
        handoff = self.engine.remember(MemoryCreateRequest(
            agent_id=from_agent,
            content=f"Handoff to {to_agent}: {task}\n\nContext: {context}",
            memory_type="observation",
            metadata={
                "target": to_agent,
                "swarm": swarm_id,
                "kind": "handoff",
            },
        ))
        
        # Share to swarm
        self.swarm_manager.share_memory(
            swarm_id=swarm_id,
            agent_id=from_agent,
            memory_id=handoff.memory_id,
            engine=self.engine
        )
        
        return handoff.memory_id

handoff_manager = HandoffManager(engine, swarm_manager)

# Use in agent conversation
assistant.register_function(
    "handoff_with_context",
    handoff_manager.handoff_with_context
)
```

---

## LangGraph Integration

LangGraph uses StateGraph workflows with parallel dispatch. AFS provides state persistence.

### Installation

```bash
pip install langgraph
pip install -e .
```

### Basic Integration

```python
from langgraph.graph import StateGraph, END
from pathlib import Path

from afs.config import MemorySystemSettings
from afs.engine import MemoryEngine
from afs.models import MemoryCreateRequest
from typing import TypedDict, List

# Initialize AFS
base_path = Path("./.afs")
settings = MemorySystemSettings(base_path=base_path)
engine = MemoryEngine(base_path, settings)

class AgentState(TypedDict):
    """State shared across LangGraph nodes"""
    agent_id: str
    task: str
    results: List[str]
    memory_ids: List[str]

def start_node(state: AgentState) -> AgentState:
    """Initialize task"""
    # Get relevant context from AFS
    context = engine.get_context(
        state["agent_id"],
        state["task"],
        max_chars=2000,
    )
    
    # Store task in AFS
    memory = engine.remember(MemoryCreateRequest(
        agent_id=state["agent_id"],
        content=state["task"],
        memory_type="observation",
    ))
    
    state["memory_ids"] = [memory.memory_id]
    return state

def execute_node(state: AgentState) -> AgentState:
    """Execute task (placeholder for actual execution)"""
    result = f"Result for: {state['task']}"
    
    # Store result in AFS
    memory = engine.remember(MemoryCreateRequest(
        agent_id=state["agent_id"],
        content=result,
        memory_type="observation"
    ))
    
    state["results"].append(result)
    state["memory_ids"].append(memory.memory_id)
    return state

def aggregate_node(state: AgentState) -> AgentState:
    """Aggregate results"""
    consolidated = engine.consolidate(state["agent_id"])
    
    # Store summary
    summary = engine.remember(MemoryCreateRequest(
        agent_id=state["agent_id"],
        content=f"Aggregated {len(state['results'])} results",
        memory_type="reflection"
    ))
    
    state["memory_ids"].append(summary.memory_id)
    return state

# Build graph
workflow = StateGraph(AgentState)

workflow.add_node("start", start_node)
workflow.add_node("execute", execute_node)
workflow.add_node("aggregate", aggregate_node)

workflow.set_entry_point("start")
workflow.add_edge("start", "execute")
workflow.add_edge("execute", "aggregate")
workflow.add_edge("aggregate", END)

graph = workflow.compile()

# Run
result = graph.invoke({
    "agent_id": "my-agent",
    "task": "Research AI agents",
    "results": [],
    "memory_ids": []
})
```

### LangGraph with Parallel Dispatch

```python
from langgraph.constants import Send
from collections import defaultdict

class ParallelState(TypedDict):
    agent_id: str
    items: List[str]
    results: dict

def parallel_dispatch(state: ParallelState) -> List[Send]:
    """Send each item to parallel workers"""
    return [
        Send("worker", {"item": item, "agent_id": state["agent_id"]})
        for item in state["items"]
    ]

def worker_node(state: dict) -> dict:
    """Process single item"""
    item = state["item"]
    agent_id = state["agent_id"]
    
    # Process (placeholder)
    result = f"Processed: {item}"
    
    # Store in AFS
    memory = engine.remember(MemoryCreateRequest(
        agent_id=agent_id,
        content=result,
        memory_type="observation"
    ))
    
    return {"result": result, "memory_id": memory.memory_id}

def aggregator_node(state: ParallelState) -> ParallelState:
    """Aggregate all results"""
    # Consolidate memories
    consolidated = engine.consolidate(state["agent_id"])
    
    return state

# Build parallel graph
parallel_graph = StateGraph(ParallelState)

parallel_graph.add_node("dispatcher", lambda state: state)
parallel_graph.add_node("worker", worker_node)
parallel_graph.add_node("aggregator", aggregator_node)

parallel_graph.set_entry_point("dispatcher")
parallel_graph.add_conditional_edges(
    "dispatcher",
    parallel_dispatch,
    ["worker"]
)
parallel_graph.add_edge("worker", "aggregator")
parallel_graph.add_edge("aggregator", END)

parallel_compiled = parallel_graph.compile()

# Run with 10 parallel items
result = parallel_compiled.invoke({
    "agent_id": "scanner",
    "items": [f"item-{i}" for i in range(10)],
    "results": {}
})
```

---

## Kimi k2.5-Style Integration

For high-throughput parallel agent systems like Kimi k2.5:

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from afs.config import MemorySystemSettings
from afs.engine import MemoryEngine
from afs.models import MemoryCreateRequest

base_path = Path("./.afs")
settings = MemorySystemSettings(base_path=base_path)
engine = MemoryEngine(base_path, settings)

class KimiStyleSwarm:
    """100-agent parallel swarm using AFS"""
    
    def __init__(self, engine: MemoryEngine, commander_id: str):
        self.engine = engine
        self.commander_id = commander_id
        self.workers = []
    
    async def dispatch_100_agents(self, task: str, items: List[str]):
        """Dispatch to 100 parallel agents"""
        
        # Prepare batch requests
        requests = []
        for i, item in enumerate(items[:100]):  # Limit to 100
            worker_id = f"worker-{i:03d}"
            
            requests.append(MemoryCreateRequest(
                agent_id=worker_id,
                content=f"Task: {task}\nItem: {item}",
                memory_type="observation",
                metadata={
                    "commander": self.commander_id,
                    "task_index": i,
                    "total_items": len(items)
                }
            ))
        
        # Atomic batch creation
        memories = self.engine.batch_remember(requests)
        
        # Parallel execution (simulated)
        with ThreadPoolExecutor(max_workers=100) as executor:
            futures = [
                executor.submit(self.execute_worker, worker_id, item)
                for worker_id, item in zip(
                    [f"worker-{i:03d}" for i in range(len(items))],
                    items
                )
            ]
            results = [f.result() for f in futures]
        
        # Aggregate
        return self.aggregate(results)
    
    def execute_worker(self, worker_id: str, item: str) -> dict:
        """Execute single worker task"""
        # Process item (placeholder)
        result = f"Processed {item}"
        
        # Store result
        memory = self.engine.remember(MemoryCreateRequest(
            agent_id=worker_id,
            content=result,
            memory_type="observation"
        ))
        
        return {"worker": worker_id, "result": result, "memory_id": memory.memory_id}
    
    def aggregate(self, results: List[dict]) -> dict:
        """Aggregate all worker results"""
        
        # Mine associations
        stats = self.engine.mine_associations(self.commander_id)
        
        # Consolidate
        consolidated = self.engine.consolidate(self.commander_id)
        
        return {
            "total_results": len(results),
            "associations": stats,
            "consolidated": len(consolidated)
        }

# Usage
swarm = KimiStyleSwarm(engine, "commander-001")
items = [f"website-{i}.com" for i in range(100)]

result = asyncio.run(swarm.dispatch_100_agents(
    "security scan",
    items
))
```

---

## Framework Comparison

| Feature | CrewAI | AutoGen | LangGraph | AFS Native |
|---------|--------|---------|-----------|------------|
| **Pattern** | Hierarchical | Dynamic handoffs | StateGraph | All |
| **Memory Layer** | Via tools | Via swarm | Via nodes | Native |
| **Parallelism** | Limited | Yes | Yes | Yes |
| **Swarm Support** | Manual | Native | Manual | Native |
| **Integration** | Tool-based | Function-based | Node-based | N/A |

---

## Best Practices

### 1. Agent ID Strategy

```python
# Good: Hierarchical IDs
agent_id = "project/team/role/index"
# Example: "security/review/analyst/1"

# Good: Session-based IDs
agent_id = f"session-{session_id}/worker-{worker_id}"
```

### 2. Memory Types

| Type | Use Case | Retention |
|------|----------|-----------|
| `observation` | Raw findings | Short-term |
| `reflection` | Insights | Medium-term |
| `task` | Work items | Short-term (custom type) |
| `knowledge` | Consolidated | Long-term |

### 3. Swarm Naming

```python
# Good: Descriptive + timestamped
swarm_id = f"pr-{pr_number}-{date}"

# Good: Team + purpose
swarm_id = "security-team-daily-scan"
```

---

## Audit Logging Integration

AFS automatically audit-logs all engine operations: memory CRUD, search, recall, graph mutations, sessions, swarm sharing, attachments, and export. You don't call `_audit()` directly — it's internal to the engine. Every integration picks up the audit trail for free.

### Fail-Open Policy

Audit failures never block primary operations. If the audit write fails, the engine operation succeeds and the failure is recorded to standard logging. Safe to use in production without extra error handling.

### Querying Audit Logs — CLI

```bash
# Filter by agent and operation
afs admin audit --agent-id agent-123 --operation search_memory --limit 20

# Filter by status and date range
afs admin audit --status error --since 2026-02-17 --until 2026-02-18
```

Available filters: `--agent-id`, `--operation`, `--resource`, `--status`, `--since`, `--until`, `--limit`

### Querying Audit Logs — REST API

```
GET /admin/audit?agent_id=agent-123&operation=search_memory&limit=20
GET /admin/audit?status=error&since=2026-02-17&until=2026-02-18
```

The `/admin/audit` endpoint itself is not audited, to avoid recursion.

### Querying Audit Logs — Python

```python
from pathlib import Path
from afs.config import MemorySystemSettings
from afs.engine import MemoryEngine

base_path = Path("./.afs")
settings = MemorySystemSettings(base_path=base_path)
engine = MemoryEngine(base_path, settings)

records = engine.audit_log.query_records(
    operator="agent-123",
    operation="search_memory",
    limit=20,
)
for r in records:
    print(r["id"], r["operation"], r["status"])
```

Direct calls to `engine.audit_log.query_records()` are also not audited.

### Audit Record Schema

Success record:

```json
{
  "id": "audit_1771382740787_686fa5ec",
  "timestamp": "2026-02-17T14:00:00Z",
  "operation": "search_memory",
  "operator": "agent-123",
  "resource": null,
  "status": "success",
  "payload": { "query": "security vulnerabilities", "count": 15 }
}
```

Error record adds two fields:

```json
{
  "id": "audit_1771382740999_a1b2c3d4",
  "timestamp": "2026-02-17T14:00:01Z",
  "operation": "retrieve_memory",
  "operator": "agent-456",
  "resource": "mem_nonexistent",
  "status": "error",
  "error_type": "not_found",
  "error_message": "Memory mem_nonexistent not found",
  "payload": {}
}
```

The `id` format is `audit_{unix_ms}_{random_hex}`.

### SessionManager with Audit Trail

`SessionManager` only records audit events when an engine is passed explicitly:

```python
from afs.session import SessionManager

# With engine: session operations are audited
session_mgr = SessionManager(base_path, settings, engine=engine)

# Without engine= : session operations are NOT audited
session_mgr = SessionManager(base_path, settings)
```

Pass `engine=engine` whenever you need a complete audit trail across both memory and session operations.

### Async Contexts

`engine._audit()` is synchronous. In async server integrations, wrap it with `asyncio.to_thread`:

```python
import asyncio
from afs.audit_taxonomy import OPERATION_CREATE_MEMORY

await asyncio.to_thread(engine._audit, OPERATION_CREATE_MEMORY, agent_id, memory_id)
```

This pattern applies only when you're building custom server integrations that call `_audit` directly. Standard engine methods handle this internally.

### Operation Taxonomy

About 45 standardized operation names are defined in `src/afs/audit_taxonomy.py`, covering all system areas: memory, search, graph, sessions, swarm, attachments, and export. Import from there rather than using string literals, so your code stays in sync if names change.

---

## See Also

- [Overview](/docs/architecture) - Architecture introduction
- [Workflow Patterns](/docs/workflow-patterns) - Pattern selection
- [CLI Reference](/docs/cli-reference) - Command reference
- [Daily Operations](/docs/daily-operations) - Practical examples
