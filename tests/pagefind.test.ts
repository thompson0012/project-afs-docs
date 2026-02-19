import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

describe('Pagefind Search Integration', () => {
	it('should have pagefind as a devDependency in package.json', () => {
		const pkgPath = path.join(projectRoot, 'package.json');
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		expect(pkg.devDependencies).toHaveProperty('pagefind');
	});

	it('should run pagefind after build in package.json', () => {
		const pkgPath = path.join(projectRoot, 'package.json');
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		expect(pkg.scripts.build).toContain('pagefind --site build');
	});

	it('should implement the Search component with accessibility attributes', () => {
		const searchPath = path.join(projectRoot, 'src/lib/components/Search.svelte');
		expect(fs.existsSync(searchPath)).toBe(true);
		
		const content = fs.readFileSync(searchPath, 'utf-8');
		expect(content).toContain('aria-label');
		expect(content).toContain('<style>');
	});

	it('should integrate Search component into Docs layout', () => {
		const layoutPath = path.join(projectRoot, 'src/routes/docs/+layout.svelte');
		const content = fs.readFileSync(layoutPath, 'utf-8');
		expect(content).toContain("import Search from '$lib/components/Search.svelte'");
		expect(content).toContain('<Search />');
	});
});
