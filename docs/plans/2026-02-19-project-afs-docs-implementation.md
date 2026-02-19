# Project AFS Docs Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static, Markdown-first documentation site for AFS using Svelte 5 + SvelteKit, with content synced read-only from `../project-afs` and a step-by-step tutorial page.

**Architecture:** SvelteKit + MDsveX renders `.md` routes into a static site via `adapter-static`. A local sync script copies Markdown from `../project-afs` into `src/routes/docs/.../+page.md` with frontmatter and stable navigation metadata. Search is static (Pagefind) and the UI uses a clean docs layout.

**Tech Stack:** Svelte 5, SvelteKit, MDsveX, adapter-static, Pagefind (search), Vitest (unit tests), TypeScript.

---

### Task 1: Scaffold SvelteKit (Svelte 5) project in this repo

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `src/app.html`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`

**Step 1: Initialize SvelteKit scaffold**

Run (choose: TypeScript + ESLint + Prettier + Vitest):
```bash
npm create svelte@latest .
```

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify clean baseline**

Run:
```bash
npm run check
```
Expected: PASS with 0 errors.

**Step 4: Commit**
```bash
git add package.json svelte.config.js vite.config.ts src/app.html src/routes/+layout.svelte src/routes/+page.svelte
git commit -m "chore: scaffold sveltekit docs site"
```

---

### Task 2: Add MDsveX + adapter-static

**Files:**
- Modify: `svelte.config.js`
- Create: `src/routes/docs/+layout.svelte`

**Step 1: Write failing test (configuration check)**
Create `tests/mdsvex-config.test.ts` to assert `svelte.config.js` exports expected extensions.
```ts
import config from '../svelte.config.js';

test('mdsvex extensions include md and svx', () => {
  expect(config.extensions).toEqual(expect.arrayContaining(['.md', '.svx']));
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/mdsvex-config.test.ts
```
Expected: FAIL (extensions not set yet).

**Step 3: Write minimal implementation**

Update `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [mdsvex({ extensions: ['.md', '.svx'] })],
  kit: { adapter: adapter() }
};

export default config;
```

**Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/mdsvex-config.test.ts
```
Expected: PASS.

**Step 5: Commit**
```bash
git add svelte.config.js tests/mdsvex-config.test.ts
git commit -m "chore: add mdsvex and static adapter"
```

---

### Task 3: Create content map + sync pipeline (read-only source)

**Files:**
- Create: `src/lib/content-map.ts`
- Create: `src/lib/sync/docs-sync.ts`
- Create: `scripts/sync-docs.ts`
- Test: `tests/sync-docs.test.ts`

**Step 1: Write failing test**

```ts
import { syncDocs } from '../src/lib/sync/docs-sync';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('syncDocs writes +page.md with frontmatter', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'docs-out-'));
  const result = await syncDocs({
    sourceRoot: '../project-afs',
    outputRoot: outDir,
    entries: [{ slug: 'intro', title: 'Intro', source: 'README.md' }]
  });
  const page = await readFile(join(outDir, 'docs/intro/+page.md'), 'utf-8');
  expect(page).toContain('title: "Intro"');
  expect(result.written).toBe(1);
  await rm(outDir, { recursive: true, force: true });
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/sync-docs.test.ts
```
Expected: FAIL (syncDocs not implemented).

**Step 3: Write minimal implementation**

`src/lib/content-map.ts`:
```ts
export const contentMap = [
  { slug: 'introduction', title: 'Introduction', source: 'README.md' },
  { slug: 'architecture', title: 'Architecture', source: 'docs/agentic-workflow-overview.md' },
  { slug: 'cli-reference', title: 'CLI Reference', source: 'docs/cli-reference.md' },
  { slug: 'tutorial', title: 'Step-by-step Tutorial', source: 'docs/tutorial.md', local: true },
  { slug: 'daily-operations', title: 'Daily Operations', source: 'docs/daily-operations.md' },
  { slug: 'integration', title: 'Integration Guide', source: 'docs/integration-guide.md' },
  { slug: 'workflow-patterns', title: 'Workflow Patterns', source: 'docs/workflow-patterns.md' },
  { slug: 'cli-addendum', title: 'CLI Addendum (SKILL)', source: 'skills/afs-skills/SKILL.md' }
];
```

`src/lib/sync/docs-sync.ts`:
```ts
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export async function syncDocs({ sourceRoot, outputRoot, entries }) {
  let written = 0;
  for (const entry of entries) {
    const sourcePath = join(sourceRoot, entry.source);
    const content = await readFile(sourcePath, 'utf-8');
    const frontmatter = `---\ntitle: "${entry.title}"\n---\n\n`;
    const outPath = join(outputRoot, 'docs', entry.slug, '+page.md');
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, frontmatter + content);
    written++;
  }
  return { written };
}
```

`scripts/sync-docs.ts`:
```ts
import { contentMap } from '../src/lib/content-map';
import { syncDocs } from '../src/lib/sync/docs-sync';

await syncDocs({
  sourceRoot: '../project-afs',
  outputRoot: 'src/routes',
  entries: contentMap.filter((e) => !e.local)
});
```

**Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/sync-docs.test.ts
```
Expected: PASS.

**Step 5: Commit**
```bash
git add src/lib/content-map.ts src/lib/sync/docs-sync.ts scripts/sync-docs.ts tests/sync-docs.test.ts
git commit -m "feat: add docs sync pipeline"
```

---

### Task 4: Add docs layout + navigation

**Files:**
- Create: `src/lib/components/Sidebar.svelte`
- Create: `src/lib/components/TopNav.svelte`
- Modify: `src/routes/+layout.svelte`

**Step 1: Write failing test**

```ts
import { contentMap } from '../src/lib/content-map';

test('contentMap has at least 6 sections', () => {
  expect(contentMap.length).toBeGreaterThanOrEqual(6);
});
```

**Step 2: Run test to verify it fails (if map is empty)**

Run:
```bash
npm test -- tests/content-map.test.ts
```
Expected: FAIL if not created.

**Step 3: Write minimal implementation**
- Sidebar renders `contentMap` links.
- Layout wraps content with sidebar + topnav.

**Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/content-map.test.ts
```
Expected: PASS.

**Step 5: Commit**
```bash
git add src/lib/components/Sidebar.svelte src/lib/components/TopNav.svelte src/routes/+layout.svelte tests/content-map.test.ts
git commit -m "feat: add docs layout and navigation"
```

---

### Task 5: Generate docs routes + author tutorial content

**Files:**
- Create: `src/routes/docs/tutorial/+page.md`
- Create: `src/routes/docs/cli-addendum/+page.md`
- Create: `src/routes/docs/introduction/+page.md` (from README via sync)

**Step 1: Run sync script**

Run:
```bash
npm run sync:docs
```
Expected: `src/routes/docs/*/+page.md` generated.

**Step 2: Write tutorial page**

Create `src/routes/docs/tutorial/+page.md` with steps:
1. Install AFS
2. Initialize `.afs`
3. Create/query memory
4. Share to swarm
5. Consolidate knowledge
6. Inspect audit log

**Step 3: Write CLI addendum page**

Summarize commands missing from `cli-reference.md` and point to `SKILL.md`.

**Step 4: Commit**
```bash
git add src/routes/docs
git commit -m "docs: add tutorial and cli addendum"
```

---

### Task 6: Add search (Pagefind)

**Files:**
- Modify: `package.json`
- Create: `src/lib/components/Search.svelte`
- Modify: `src/routes/+layout.svelte`

**Step 1: Write failing test**

```ts
import pkg from '../package.json';

test('build script runs pagefind', () => {
  expect(pkg.scripts.build).toMatch(/pagefind/);
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/pagefind.test.ts
```
Expected: FAIL.

**Step 3: Write minimal implementation**
- Add `pagefind` dev dependency
- Update build script to run `svelte-kit build && pagefind --site build`.
- Add search UI component.

**Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/pagefind.test.ts
```
Expected: PASS.

**Step 5: Commit**
```bash
git add package.json src/lib/components/Search.svelte src/routes/+layout.svelte tests/pagefind.test.ts
git commit -m "feat: add pagefind search"
```

---

### Task 7: Verification

**Step 1: Run unit tests**

```bash
npm test
```
Expected: PASS.

**Step 2: Run typecheck**

```bash
npm run check
```
Expected: PASS.

**Step 3: Build static site**

```bash
npm run build
```
Expected: PASS and `build/` output generated.

**Step 4: Commit**
```bash
git add .
git commit -m "chore: verify docs build"
```
