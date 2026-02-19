import { describe, it, expect } from 'vitest';
import { contentMap } from '../src/lib/content-map';

describe('Content Map', () => {
	it('should have at least 6 entries', () => {
		expect(contentMap.length).toBeGreaterThanOrEqual(6);
	});

	it('should have valid structure for all entries', () => {
		contentMap.forEach(entry => {
			expect(entry).toHaveProperty('slug');
			expect(entry).toHaveProperty('title');
			expect(entry).toHaveProperty('source');
		});
	});
});
