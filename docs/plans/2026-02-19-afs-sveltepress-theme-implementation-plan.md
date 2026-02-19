# AFS Docs SveltePress-like Theme & IA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize docs into sectioned navigation, integrate `afs-guide/` content into `/docs` routes, update landing behavior, and restyle the docs to a SveltePress-like shell with a right-side TOC.

**Architecture:** Keep SvelteKit + MDsveX. Add a lightweight CSS token layer in `src/app.css`, introduce a section-aware content map + sidebar grouping helper, convert `afs-guide` markdown into local `/docs` routes, add a TOC component built from h2/h3 headings, and redirect `/` → `/docs`.

**Tech Stack:** Svelte 5 + SvelteKit + MDsveX, Vitest

---

### Task 1: Add section-aware content map + grouping helper

**Files:**
- Modify: `src/lib/content-map.ts`
- Create: `src/lib/content-sections.ts`
- Test: `tests/content-sections.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { groupContentBySection } from '../src/lib/content-sections';
import { contentMap } from '../src/lib/content-map';

describe('Content sections', () => {
	 it('groups entries by section in order', () => {
		 const grouped = groupContentBySection(contentMap);
		 expect(grouped.length).toBeGreaterThan(3);
		 expect(grouped[0].section).toBe('Getting Started');
		 expect(grouped[0].items[0].slug).toBe('introduction');
	 });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: FAIL with missing module or function.

**Step 3: Write minimal implementation**

```ts
// src/lib/content-sections.ts
import type { ContentEntry } from './content-map';

export interface SectionGroup {
  section: string;
  items: ContentEntry[];
}

export function groupContentBySection(entries: ContentEntry[]): SectionGroup[] {
  const order: string[] = [];
  const buckets = new Map<string, ContentEntry[]>();

  for (const entry of entries) {
    const section = entry.section ?? 'Other';
    if (!buckets.has(section)) {
      buckets.set(section, []);
      order.push(section);
    }
    buckets.get(section)?.push(entry);
  }

  return order.map((section) => ({ section, items: buckets.get(section) ?? [] }));
}
```

Update `ContentEntry` to include `section?: string;` and update `contentMap` entries to the new IA ordering (Getting Started / Core Concepts / Operations / Integrations / Reference). Mark `introduction` as `local: true`.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/content-map.ts src/lib/content-sections.ts tests/content-sections.test.ts
git commit -m "docs: add sectioned content map"
```

---

### Task 2: Update Sidebar to render sectioned navigation

**Files:**
- Modify: `src/lib/components/Sidebar.svelte`
- Test: `tests/content-sections.test.ts` (add a small assertion if needed)

**Step 1: Write the failing test**

Add a test that asserts all entries have a section:

```ts
it('all entries have a section', () => {
  contentMap.forEach((entry) => {
    expect(entry.section).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: FAIL if any entry missing section.

**Step 3: Write minimal implementation**

Update `Sidebar.svelte` to import `groupContentBySection(contentMap)` and render section headers plus their links in order.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/components/Sidebar.svelte tests/content-sections.test.ts
git commit -m "docs: render sectioned sidebar"
```

---

### Task 3: Integrate `afs-guide/` into `/docs` routes

**Files:**
- Create: `src/routes/docs/core/*/+page.md`
- Create: `src/routes/docs/operations/*/+page.md`
- Create: `src/routes/docs/integrations/non-cli/+page.md`
- Create: `src/routes/docs/reference/caveats-testing/+page.md`
- Remove or archive: `src/routes/afs-guide/*.md`
- Modify: `src/lib/content-map.ts`

**Step 1: Write the failing test**

Add an assertion that required slugs exist:

```ts
it('includes AFS guide slugs', () => {
  const slugs = new Set(contentMap.map((e) => e.slug));
  ['core/cli-overview','core/memory','core/query','core/graph','core/agent','core/session','core/attachment'].forEach((slug) => {
    expect(slugs.has(slug)).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: FAIL (missing slugs).

**Step 3: Write minimal implementation**

Move content into the new `/docs` folders and add frontmatter titles. Update content map with the new slugs and `local: true` for each guide page.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/docs src/routes/afs-guide src/lib/content-map.ts tests/content-sections.test.ts
git commit -m "docs: integrate afs guide into /docs"
```

---

### Task 4: Make Introduction local + rewrite public-facing intro

**Files:**
- Modify: `src/routes/docs/introduction/+page.md`
- Modify: `src/lib/content-map.ts`

**Step 1: Write the failing test**

Add assertion that introduction is local:

```ts
it('introduction is local', () => {
  const intro = contentMap.find((e) => e.slug === 'introduction');
  expect(intro?.local).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: FAIL if local flag missing.

**Step 3: Write minimal implementation**

Mark introduction `local: true` and rewrite the content with the public intro outline from the design doc.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/docs/introduction/+page.md src/lib/content-map.ts tests/content-sections.test.ts
git commit -m "docs: rewrite local introduction"
```

---

### Task 5: Add right-side TOC component

**Files:**
- Create: `src/lib/toc.ts`
- Create: `src/lib/components/Toc.svelte`
- Test: `tests/toc.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { collectHeadings } from '../src/lib/toc';

describe('collectHeadings', () => {
  it('collects h2/h3 headings from a container', () => {
    const root = document.createElement('div');
    root.innerHTML = '<h2 id="a">A</h2><h3 id="b">B</h3><h4 id="c">C</h4>';
    const headings = collectHeadings(root);
    expect(headings.map((h) => h.id)).toEqual(['a','b']);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/toc.test.ts`
Expected: FAIL (missing function).

**Step 3: Write minimal implementation**

```ts
// src/lib/toc.ts
export interface TocHeading { id: string; text: string; level: number; }

export function collectHeadings(root: ParentNode): TocHeading[] {
  const nodes = Array.from(root.querySelectorAll('h2, h3'));
  return nodes
    .map((node) => ({
      id: node.id,
      text: node.textContent?.trim() ?? '',
      level: Number(node.tagName === 'H3' ? 3 : 2)
    }))
    .filter((heading) => heading.id && heading.text);
}
```

Create `Toc.svelte` that:
- Calls `collectHeadings(document.querySelector('main'))` on mount
- Uses `IntersectionObserver` to set active id
- Renders a list of anchors

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/toc.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/toc.ts src/lib/components/Toc.svelte tests/toc.test.ts
git commit -m "feat: add docs toc component"
```

---

### Task 6: Update docs layout to include TOC rail

**Files:**
- Modify: `src/routes/docs/+layout.svelte`

**Step 1: Write the failing test**

Add assertion in `tests/content-sections.test.ts` that the TOC component exists by checking string presence in the layout file (simple snapshot-style test).

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Update layout to a three-column grid and render `<Toc />` on the right. Add `scroll-margin-top` to headings within `.main-content`.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/docs/+layout.svelte tests/content-sections.test.ts
git commit -m "feat: add docs toc rail"
```

---

### Task 7: Add global tokens + refactor component styles

**Files:**
- Create: `src/app.css`
- Modify: `src/routes/+layout.svelte`
- Modify: `src/lib/components/TopNav.svelte`
- Modify: `src/lib/components/Sidebar.svelte`
- Modify: `src/lib/components/Search.svelte`
- Modify: `src/routes/docs/+layout.svelte`

**Step 1: Write the failing test**

Add a test that ensures `src/app.css` exists and contains `--accent` token.

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Create `app.css` with tokens and prose styles, import it in root `+layout.svelte`, and replace hardcoded colors with `var(--token)`.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/content-sections.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app.css src/routes/+layout.svelte src/lib/components/TopNav.svelte src/lib/components/Sidebar.svelte src/lib/components/Search.svelte src/routes/docs/+layout.svelte tests/content-sections.test.ts
git commit -m "style: add global tokens and prose styles"
```

---

### Task 8: Update landing behavior + GitHub link

**Files:**
- Create: `src/routes/+page.ts`
- Modify: `src/lib/components/TopNav.svelte`
- Test: `tests/redirect.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { load } from '../src/routes/+page';

describe('root redirect', () => {
  it('redirects to /docs', async () => {
    await expect(load()).rejects.toMatchObject({ status: 307, location: '/docs' });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/redirect.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Create `+page.ts` with `throw redirect(307, '/docs')`. Update TopNav GitHub link to `https://github.com/thompson0012/project-afs/`.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/redirect.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/+page.ts src/lib/components/TopNav.svelte tests/redirect.test.ts
git commit -m "feat: redirect root to docs"
```

---

### Task 9: Full verification

**Files:**
- None (verification only)

**Step 1: Run full checks**

Run: `npm run check`
Expected: 0 errors

Run: `npm run test`
Expected: all tests pass

Run: `npm run build`
Expected: build succeeds with Pagefind indexing

**Step 2: Commit (if any minor fixes)**

If fixes needed, commit with descriptive message.

---

## Notes

- Ensure `content-map.ts` includes the new `section` field and that all entries are ordered per IA.
- `afs-guide` files should be removed or archived to avoid duplicate content routes.
- The Introduction page must remain local and should not be overwritten by `sync:docs`.
