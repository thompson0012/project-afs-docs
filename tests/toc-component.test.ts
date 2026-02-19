import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

test('toc re-collects headings on navigation', () => {
	const toc = fs.readFileSync(
		path.join(process.cwd(), 'src/lib/components/Toc.svelte'),
		'utf-8'
	);
	expect(toc).toContain('$page');
	expect(toc).toContain('$effect');
});
