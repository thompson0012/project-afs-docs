# Project AFS Docs

Static documentation site for AFS, built with **Svelte 5 + SvelteKit + MDsveX**.

## Requirements

- Node.js 20+
- npm 9+

## Quick Start

Install dependencies:

```bash
npm install
```

Sync documentation from the source repo (read-only):

```bash
npm run sync:docs
```

Start dev server:

```bash
npm run dev
```

## Build (Static)

```bash
npm run build
```

This runs the SvelteKit static build and indexes search with Pagefind.

## Content Sources

Docs are sourced from `../project-afs` and copied into `src/routes/docs/*/+page.md`.
Local authored pages:

- `src/routes/docs/tutorial/+page.md`
- `src/routes/docs/cli-addendum/+page.md`

## Notes

- `AFS_SOURCE_ROOT=/path/to/project-afs` can override the default source location.
- The site is Markdown-first; no edits are made in `../project-afs`.
