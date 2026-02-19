# Project AFS Docs Site — Design

> **Status:** Approved to proceed (assumed per continuation directive)

## Summary
Build a static documentation site using **Svelte 5 + SvelteKit + MDsveX** in the `project-afs-docs` repo. The site is **Markdown-first** and **maintainable**, with content sourced **read-only** from `../project-afs` (no edits to that repo). Deliver a **step-by-step tutorial** plus full project documentation.

## Goals
- Static documentation site with Svelte 5 stack.
- Markdown-based content as the primary source.
- Clear, maintainable content pipeline (sync from `../project-afs`).
- Include a step-by-step tutorial guide for AFS users.
- Cover all existing docs: overview, architecture, CLI reference, daily ops, integrations, workflow patterns, and plans.

## Non‑Goals
- No edits to code or docs inside `../project-afs`.
- No server-side features (static only).
- No bespoke design system beyond a minimal, readable docs UI.

## Constraints & Assumptions
- `../project-afs` is read-only.
- Current repo is greenfield (no existing site).
- Svelte 5 compatibility required.
- Markdown-first and maintainability are top priority.

## Content Sources (Read‑Only)
Primary docs to include:
- `../project-afs/README.md`
- `../project-afs/docs/agentic-workflow-overview.md`
- `../project-afs/docs/cli-reference.md`
- `../project-afs/docs/daily-operations.md`
- `../project-afs/docs/integration-guide.md`
- `../project-afs/docs/workflow-patterns.md`
- `../project-afs/docs/plans/*` (optional “Plans” section)
- `../project-afs/skills/afs-skills/SKILL.md` (authoritative CLI details missing from older docs)

## Information Architecture
Proposed nav:
1. **Introduction** (README summary + quick start)
2. **Architecture** (agentic workflow overview)
3. **CLI Reference** (cli-reference + SKILL.md addendum)
4. **Tutorial** (step‑by‑step guide)
5. **How‑To** (daily operations)
6. **Integration** (integration guide)
7. **Patterns** (workflow patterns)
8. **Plans** (design/plans docs, optional)

## UX & Visual System
- **Style:** minimal Swiss/technical documentation aesthetic (high contrast, clean layout).
- **Typography:** JetBrains Mono (headings), IBM Plex Sans (body).
- **Colors:** slate text on light background; link/CTA blue. Focus states visible.
- **Layout:** top bar + left sidebar navigation + content column + optional right ToC.
- **A11y:** keyboard navigation, focus rings, readable line length.

## Technical Architecture
- **Framework:** SvelteKit (Svelte 5)
- **Markdown:** MDsveX (`.md` / `.svx`)
- **Static build:** `adapter-static`
- **Routing:** Markdown pages in `src/routes` (e.g., `src/routes/docs/<slug>/+page.md`)
- **Navigation:** single `content-map.ts` defines route order, titles, grouping
- **ToC:** generated from headings via remark/rehype plugin
- **Search:** Pagefind (static index) or FlexSearch (fallback)

## Content Pipeline (Maintainability)
- Add a **sync script** in `project-afs-docs` to copy Markdown sources from `../project-afs` into a local `content/` directory.
- Apply light frontmatter injection (title, nav group) **without modifying originals**.
- Sync script fails if required source files are missing (prevents stale docs).

## Step‑by‑Step Tutorial
A dedicated tutorial page that walks a new user through:
1. Install AFS
2. Initialize `.afs`
3. Create and query memories
4. Share to swarm
5. Consolidate knowledge
6. Inspect audit log

## Risks / Mitigations
- **MDsveX Svelte 5 warnings**: non‑blocking; keep config minimal, note in build output.
- **CLI reference drift**: treat `SKILL.md` as authoritative; annotate differences.

## Open Items
- Decide whether “Plans” should be visible in public docs.
