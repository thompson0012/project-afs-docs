# Namespace: `session` — Session Management

## `afs session create`
- **Purpose:** Create a token-budgeted session.
- **When to use:** Track ongoing conversation context.
- **What it does:** Creates a new session with token budget.
- **Usage example:**
  ```bash
  afs session create --agent-id myagent --token-budget 4000
  ```

## `afs session list`
- **Purpose:** List sessions for an agent.
- **Usage example:**
  ```bash
  afs session list --agent-id myagent
  ```

## `afs session get`
- **Purpose:** Get session details by ID.
- **Usage example:**
  ```bash
  afs session get --session-id ses_abc123
  ```

## `afs session add-turn`
- **Purpose:** Append a turn to a session.
- **Usage example:**
  ```bash
  afs session add-turn --session-id ses_abc123 --role user --content "Analyze this"
  ```

## `afs session context`
- **Purpose:** Get formatted context for LLM injection.
- **Usage example:**
  ```bash
  afs session context --session-id ses_abc123
  ```

## `afs session archive`
- **Purpose:** Archive a session (read-only).
- **Usage example:**
  ```bash
  afs session archive --session-id ses_abc123
  ```

## `afs session delete`
- **Purpose:** Delete a session permanently.
- **Usage example:**
  ```bash
  afs session delete --session-id ses_abc123
  ```
