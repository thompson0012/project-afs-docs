# AFS Docs SveltePress-like Theme & IA Redesign

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize AFS docs into a structured, sectioned information architecture, integrate the new `afs-guide/` content into the existing `/docs` routing model, and restyle the site to a SveltePress-like layout with a right-side TOC rail.

**Architecture:** Keep SvelteKit + MDsveX static docs, introduce a light CSS token layer for consistent theming, and extend the content map to support sectioned navigation. All `afs-guide` pages become local docs routes under `/docs/...` and are grouped logically.

**Tech Stack:** Svelte 5 + SvelteKit + MDsveX, Pagefind search

---

## Information Architecture (IA)

**New sidebar sections and order:**

1) **Getting Started**
- Introduction (local, landing at `/docs`)
- Architecture
- Daily Operations
- Step-by-step Tutorial

2) **Core Concepts (AFS Guide)**
- CLI Guide Overview
- Memory
- Query
- Graph
- Agent
- Session
- Attachment

3) **Operations**
- Admin
- Maintenance
- Scheduler
- Models

4) **Integrations**
- Integration Guide
- Workflow Patterns
- Non‑CLI APIs

5) **Reference**
- CLI Reference
- CLI Addendum
- Caveats & Testing

**Landing behavior:** `/` redirects to `/docs` which resolves to the Introduction page. The Introduction page is local (not synced).

---

## Content Mapping: `afs-guide/` Integration

**Convert** `src/routes/afs-guide/*.md` into the current `/docs/*/+page.md` routing and mark them **local** in `content-map.ts`:

| Source | New Route | Section | Title |
|---|---|---|---|
| `afs-guide/00-overview.md` | `src/routes/docs/core/cli-overview/+page.md` | Core Concepts | CLI Guide Overview |
| `afs-guide/01-memory.md` | `src/routes/docs/core/memory/+page.md` | Core Concepts | Memory |
| `afs-guide/02-query.md` | `src/routes/docs/core/query/+page.md` | Core Concepts | Query |
| `afs-guide/03-graph.md` | `src/routes/docs/core/graph/+page.md` | Core Concepts | Graph |
| `afs-guide/04-agent.md` | `src/routes/docs/core/agent/+page.md` | Core Concepts | Agent |
| `afs-guide/05-session.md` | `src/routes/docs/core/session/+page.md` | Core Concepts | Session |
| `afs-guide/06-attachment.md` | `src/routes/docs/core/attachment/+page.md` | Core Concepts | Attachment |
| `afs-guide/07-admin.md` | `src/routes/docs/operations/admin/+page.md` | Operations | Admin |
| `afs-guide/08-maintenance.md` | `src/routes/docs/operations/maintenance/+page.md` | Operations | Maintenance |
| `afs-guide/09-scheduler.md` | `src/routes/docs/operations/scheduler/+page.md` | Operations | Scheduler |
| `afs-guide/10-models.md` | `src/routes/docs/operations/models/+page.md` | Operations | Models |
| `afs-guide/11-non-cli.md` | `src/routes/docs/integrations/non-cli/+page.md` | Integrations | Non‑CLI APIs |
| `afs-guide/12-caveats-testing.md` | `src/routes/docs/reference/caveats-testing/+page.md` | Reference | Caveats & Testing |

All new pages require frontmatter `title` and are **local** (`local: true`) to prevent overwrite by `sync:docs`.

---

## Layout & TOC Behavior

**Docs shell:** three-column layout inside a centered container:
- Left: Sidebar (sectioned nav)
- Middle: Main content
- Right: “On this page” TOC rail

**TOC rail:**
- Collect h2/h3 headings within `<main>`
- Highlight active heading via `IntersectionObserver`
- Sticky position, hidden on mobile
- Heading anchors include `scroll-margin-top` to avoid top nav overlap

---

## Theme Tokens & Typography

Introduce `src/app.css` and import in root layout.

**Token palette (light):**
- Background: `--bg: #ffffff`, `--bg-soft: #f8fafc`, `--bg-subtle: #f1f5f9`
- Text: `--text: #0f172a`, `--text-muted: #475569`
- Border: `--border: #e2e8f0`
- Accent: `--accent: #6366f1`
- Focus: `--focus: rgba(99, 102, 241, 0.35)`

**Typography:**
- Base font: "DM Sans", system-ui, -apple-system, sans-serif
- Code font: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace
- Body: `1rem`, `line-height: 1.7`
- h1/h2/h3 scale (2.25rem / 1.5rem / 1.25rem)

**Prose styles (within `.main-content`):**
- Headings, links, lists, blockquotes, inline code, code blocks, tables
- SveltePress-like spacing, subtle borders, and table striping

---

## Navigation Updates

**TopNav:** update GitHub link to `https://github.com/thompson0012/project-afs/`.

**Content Map:** extend `ContentEntry` with optional `section` field for grouped navigation. Sidebar renders section headers and items underneath in order.

---

## Introduction Page (Local)

`/docs/introduction` becomes local with a public-facing AFS intro:
- Hero + tagline
- Problem (agent amnesia)
- Why filesystem-first
- How it works (three-tier memory + graph + swarms)
- Proof points (performance table)
- Use cases
- Quick start

---

## Testing & Verification

- Update/extend tests if content map or routing assumptions change
- Run `npm run check` and `npm run test` after changes
- Confirm `npm run build` succeeds and Pagefind indexing works
