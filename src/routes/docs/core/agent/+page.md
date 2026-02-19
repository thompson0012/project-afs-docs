---
title: "Agent"
---

# Namespace: `agent` — Agent Management

## `afs agent create`
- **Purpose:** Create a new agent ID.
- **When to use:** Bootstrapping a new agent.
- **What it does:** Returns a new UUID and type.
- **Usage example:**
  ```bash
  afs agent create --name "security-scanner" --type autonomous
  ```
- **Expected output:** JSON with `agent_id`, `type`, and `name`.

## `afs agent profile`
- **Purpose:** Show agent profile summary.
- **When to use:** Inspect agent stats and memory distributions.
- **What it does:** Returns merged inspect+stats view.
- **Usage example:**
  ```bash
  afs agent profile --agent-id myagent
  ```

## `afs agent merge`
- **Purpose:** Merge memories from source into target.
- **When to use:** Consolidate agents or migrate work.
- **What it does:** Copies memories with content-hash dedup.
- **Usage example:**
  ```bash
  afs agent merge --agent-id source-agent --target-id target-agent
  ```

## `afs agent migrate`
- **Purpose:** Migrate agent data to new path.
- **When to use:** Move AFS storage to new volume.
- **What it does:** Copies agent directory into target path.
- **Usage example:**
  ```bash
  afs agent migrate --agent-id myagent --target-path /new/afs/root
  ```

## `afs agent join`
- **Purpose:** Join an agent to a swarm.
- **When to use:** Multi-agent coordination.
- **What it does:** Registers agent with swarm.
- **Usage example:**
  ```bash
  afs agent join --agent-id myagent --swarm-id team-1
  ```
