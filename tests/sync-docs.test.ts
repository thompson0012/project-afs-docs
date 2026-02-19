import { test, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let sourceDir: string;
let outDir: string;

beforeEach(async () => {
	sourceDir = await mkdtemp(join(tmpdir(), 'docs-src-'));
	outDir = await mkdtemp(join(tmpdir(), 'docs-out-'));
});

afterEach(async () => {
	await rm(sourceDir, { recursive: true, force: true });
	await rm(outDir, { recursive: true, force: true });
});

test('contentMap exports an array of ContentEntry objects with required fields', async () => {
	const { contentMap } = await import('../src/lib/content-map.js');
	expect(Array.isArray(contentMap)).toBe(true);
	expect(contentMap.length).toBeGreaterThanOrEqual(1);
	for (const entry of contentMap) {
		expect(entry).toHaveProperty('slug');
		expect(entry).toHaveProperty('title');
		expect(entry).toHaveProperty('source');
		expect(typeof entry.slug).toBe('string');
		expect(typeof entry.title).toBe('string');
		expect(typeof entry.source).toBe('string');
	}
});

test('contentMap entries have unique slugs', async () => {
	const { contentMap } = await import('../src/lib/content-map.js');
	const slugs = contentMap.map((e: { slug: string }) => e.slug);
	expect(new Set(slugs).size).toBe(slugs.length);
});

test('syncDocs writes +page.md with frontmatter for a single entry', async () => {
	await writeFile(join(sourceDir, 'README.md'), '# Hello World\n\nSome content.');

	const { syncDocs } = await import('../src/lib/sync/docs-sync.js');
	const result = await syncDocs({
		sourceRoot: sourceDir,
		outputRoot: outDir,
		entries: [{ slug: 'intro', title: 'Introduction', source: 'README.md' }]
	});

	const page = await readFile(join(outDir, 'docs/intro/+page.md'), 'utf-8');
	expect(page).toContain('---');
	expect(page).toContain('title: "Introduction"');
	expect(page).toContain('# Hello World');
	expect(page).toContain('Some content.');
	expect(result.written).toBe(1);
});

test('syncDocs writes multiple entries to separate directories', async () => {
	await writeFile(join(sourceDir, 'README.md'), '# Intro');
	await mkdir(join(sourceDir, 'docs'), { recursive: true });
	await writeFile(join(sourceDir, 'docs/guide.md'), '# Guide');

	const { syncDocs } = await import('../src/lib/sync/docs-sync.js');
	const result = await syncDocs({
		sourceRoot: sourceDir,
		outputRoot: outDir,
		entries: [
			{ slug: 'intro', title: 'Introduction', source: 'README.md' },
			{ slug: 'guide', title: 'User Guide', source: 'docs/guide.md' }
		]
	});

	const introPage = await readFile(join(outDir, 'docs/intro/+page.md'), 'utf-8');
	const guidePage = await readFile(join(outDir, 'docs/guide/+page.md'), 'utf-8');

	expect(introPage).toContain('title: "Introduction"');
	expect(guidePage).toContain('title: "User Guide"');
	expect(guidePage).toContain('# Guide');
	expect(result.written).toBe(2);
});

test('syncDocs generates valid YAML frontmatter block', async () => {
	await writeFile(join(sourceDir, 'test.md'), 'Body text');

	const { syncDocs } = await import('../src/lib/sync/docs-sync.js');
	await syncDocs({
		sourceRoot: sourceDir,
		outputRoot: outDir,
		entries: [{ slug: 'test', title: 'Test Page', source: 'test.md' }]
	});

	const page = await readFile(join(outDir, 'docs/test/+page.md'), 'utf-8');

	const lines = page.split('\n');
	expect(lines[0]).toBe('---');
	const closingIdx = lines.indexOf('---', 1);
	expect(closingIdx).toBeGreaterThan(0);

	const bodyStart = lines.slice(closingIdx + 1).join('\n').trim();
	expect(bodyStart).toContain('Body text');
});

test('syncDocs skips entries with missing source files and reports them', async () => {
	const { syncDocs } = await import('../src/lib/sync/docs-sync.js');
	const result = await syncDocs({
		sourceRoot: sourceDir,
		outputRoot: outDir,
		entries: [{ slug: 'missing', title: 'Missing', source: 'nonexistent.md' }]
	});

	expect(result.written).toBe(0);
	expect(result.skipped).toBe(1);
});

test('syncDocs preserves {word} patterns in markdown content', async () => {
	await writeFile(
		join(sourceDir, 'test.md'),
		'Config is at {base_path}/config.yaml and uses {instance_id} for identification.'
	);

	const { syncDocs } = await import('../src/lib/sync/docs-sync.js');
	await syncDocs({
		sourceRoot: sourceDir,
		outputRoot: outDir,
		entries: [{ slug: 'test', title: 'Test', source: 'test.md' }]
	});

	const page = await readFile(join(outDir, 'docs/test/+page.md'), 'utf-8');
	expect(page).toContain('{base_path}');
	expect(page).toContain('{instance_id}');
	expect(page).not.toContain('`{base_path}`');
	expect(page).not.toContain('`{instance_id}`');
});

test('syncDocs escapes bare < characters while preserving HTML tags', async () => {
	await writeFile(
		join(sourceDir, 'test.md'),
		'Value must be < 100. Use <div> tags or <!-- comments -->.'
	);

	const { syncDocs } = await import('../src/lib/sync/docs-sync.js');
	await syncDocs({
		sourceRoot: sourceDir,
		outputRoot: outDir,
		entries: [{ slug: 'test', title: 'Test', source: 'test.md' }]
	});

	const page = await readFile(join(outDir, 'docs/test/+page.md'), 'utf-8');
	expect(page).toContain('&lt; 100');
	expect(page).toContain('<div>');
	expect(page).toContain('<!-- comments -->');
});
