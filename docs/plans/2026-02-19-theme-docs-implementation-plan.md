# Docs Theme & Navigation Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `/docs/introduction` the default landing page, ensure “On this page” anchors are reliable, keep search production-only but base-path safe, and highlight the left sidebar TOC in orange for active pages/sections.

**Architecture:** Keep the existing SvelteKit + MDsveX docs layout. Add explicit heading slugging to MDsveX, update the TOC to refresh after client navigation, adjust redirect logic, and update sidebar + theme tokens for orange highlights. Search remains Pagefind-based, but import paths become base-aware.

**Tech Stack:** Svelte 5, SvelteKit 2, MDsveX, Pagefind, Vitest, TypeScript.

---

### Task 1: Ensure MDsveX generates stable heading IDs (rehype-slug)

**Files:**
- Modify: `tests/mdsvex-config.test.ts`
- Modify: `svelte.config.js`
- Modify: `package.json`

**Step 1: Write the failing test**

Update `tests/mdsvex-config.test.ts` to assert:
- Adapter name matches the current config (`@sveltejs/adapter-cloudflare`).
- `rehypeSlug` is present in the MDsveX config.

Example (append to file):

```ts
import fs from 'fs';
import path from 'path';

test('mdsvex config enables rehype-slug', () => {
  const configPath = path.join(process.cwd(), 'svelte.config.js');
  const content = fs.readFileSync(configPath, 'utf-8');
  expect(content).toContain('rehype-slug');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/mdsvex-config.test.ts`
Expected: FAIL (missing `rehype-slug` string).

**Step 3: Write minimal implementation**

1) Add dev dependency:
```bash
npm install --save-dev rehype-slug
```

2) Update `svelte.config.js` to import and wire `rehypeSlug`:

```js
import rehypeSlug from 'rehype-slug';

preprocess: [mdsvex({
  extensions: ['.md', '.svx'],
  rehypePlugins: [rehypeSlug]
})],
```

3) Update the adapter expectation in `tests/mdsvex-config.test.ts`:
```ts
expect(config.kit.adapter.name).toBe('@sveltejs/adapter-cloudflare');
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/mdsvex-config.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add svelte.config.js package.json package-lock.json tests/mdsvex-config.test.ts
git commit -m "test: align mdsvex config expectations"
```

---

### Task 2: Redirect `/` to `/docs/introduction`

**Files:**
- Modify: `src/routes/+page.ts`
- Modify: `tests/redirect.test.ts`

**Step 1: Write the failing test**

Update `tests/redirect.test.ts` to expect `/docs/introduction` as the redirect target.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/redirect.test.ts`
Expected: FAIL (still redirects to `/docs`).

**Step 3: Write minimal implementation**

Update `src/routes/+page.ts`:

```ts
throw redirect(307, '/docs/introduction');
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/redirect.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.ts tests/redirect.test.ts
git commit -m "fix: default docs landing to introduction"
```

---

### Task 3: Add orange accent tokens and highlight active sidebar links/sections

**Files:**
- Modify: `src/app.css`
- Modify: `src/lib/components/Sidebar.svelte`
- Create: `tests/sidebar-theme.test.ts`

**Step 1: Write the failing test**

Create `tests/sidebar-theme.test.ts`:

```ts
import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

test('sidebar uses orange accent tokens for active state', () => {
  const appCss = fs.readFileSync(path.join(process.cwd(), 'src/app.css'), 'utf-8');
  expect(appCss).toContain('--accent-orange');

  const sidebar = fs.readFileSync(path.join(process.cwd(), 'src/lib/components/Sidebar.svelte'), 'utf-8');
  expect(sidebar).toContain('section-active');
  expect(sidebar).toContain('accent-orange');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/sidebar-theme.test.ts`
Expected: FAIL (tokens and styles not present).

**Step 3: Write minimal implementation**

1) Add tokens to `src/app.css`:
```css
--accent-orange: #f97316;
--accent-orange-opaque: rgba(249, 115, 22, 0.12);
```

2) Update `Sidebar.svelte`:
- Add `isSectionActive(group)` to set a `section-active` class on section headings.
- Update `.active` link styles to use `--accent-orange` and `--accent-orange-opaque`.
- Add `.section-title.section-active` styling to turn section title orange when active.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/sidebar-theme.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app.css src/lib/components/Sidebar.svelte tests/sidebar-theme.test.ts
git commit -m "style: add orange sidebar active state"
```

---

### Task 4: Refresh TOC after client-side navigation

**Files:**
- Modify: `src/lib/components/Toc.svelte`
- Create: `tests/toc-component.test.ts`

**Step 1: Write the failing test**

Create `tests/toc-component.test.ts`:

```ts
import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

test('toc re-collects headings on navigation', () => {
  const toc = fs.readFileSync(path.join(process.cwd(), 'src/lib/components/Toc.svelte'), 'utf-8');
  expect(toc).toContain('$page');
  expect(toc).toContain('$effect');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/toc-component.test.ts`
Expected: FAIL (no `$page` or `$effect`).

**Step 3: Write minimal implementation**

In `Toc.svelte`:
- Import `$page` from `$app/stores`.
- Add a `$effect` that re-runs the heading collection + observer setup when `$page.url.pathname` changes.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/toc-component.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/components/Toc.svelte tests/toc-component.test.ts
git commit -m "fix: refresh toc on navigation"
```

---

### Task 5: Make Pagefind import base-path safe (prod-only search)

**Files:**
- Modify: `src/lib/components/Search.svelte`
- Modify: `tests/pagefind.test.ts`

**Step 1: Write the failing test**

Update `tests/pagefind.test.ts` to assert the search component references `import.meta.env.BASE_URL`.

```ts
expect(content).toContain('BASE_URL');
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/pagefind.test.ts`
Expected: FAIL (base URL not referenced).

**Step 3: Write minimal implementation**

Update `Search.svelte` to compute the import path with base URL:

```ts
const base = import.meta.env.BASE_URL ?? '/';
const importPath = `${base}pagefind/pagefind.js`;
```

Keep the DEV-only warning; optionally add a small inline note under the input in dev.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/pagefind.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/components/Search.svelte tests/pagefind.test.ts
git commit -m "fix: base-aware pagefind import"
```

---

## Final Verification

1) Run full unit tests:
```bash
npm test
```

2) Run type check:
```bash
npm run check
```

3) Run build to confirm Pagefind indexing:
```bash
npm run build
```

4) Manual smoke:
- `/` redirects to `/docs/introduction`
- Sidebar active link is orange and section header turns orange when active
- “On this page” anchors jump and update after navigation
- Search shows dev warning and works in preview/build
