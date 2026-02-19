import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

test('sidebar uses orange accent tokens for active state', () => {
	const appCss = fs.readFileSync(path.join(process.cwd(), 'src/app.css'), 'utf-8');
	expect(appCss).toContain('--accent-orange');

	const sidebar = fs.readFileSync(
		path.join(process.cwd(), 'src/lib/components/Sidebar.svelte'),
		'utf-8'
	);
	expect(sidebar).toContain('section-active');
	expect(sidebar).toContain('accent-orange');
});
