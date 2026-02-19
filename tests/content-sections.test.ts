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

	it('all entries have a section', () => {
		contentMap.forEach((entry) => {
			expect(entry.section).toBeTruthy();
		});
	});

	it('includes AFS guide slugs', () => {
		const slugs = new Set(contentMap.map((entry) => entry.slug));
		[
			'core/cli-overview',
			'core/memory',
			'core/query',
			'core/graph',
			'core/agent',
			'core/session',
			'core/attachment'
		].forEach((slug) => {
			expect(slugs.has(slug)).toBe(true);
		});
	});

	it('introduction is local', () => {
		const intro = contentMap.find((entry) => entry.slug === 'introduction');
		expect(intro?.local).toBe(true);
	});

});
