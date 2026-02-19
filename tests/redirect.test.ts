import { describe, it, expect } from 'vitest';
import { load } from '../src/routes/+page';

describe('root redirect', () => {
	it('redirects to /docs', async () => {
		try {
			load();
		} catch (error) {
			expect(error).toMatchObject({ status: 307, location: '/docs' });
			return;
		}

		throw new Error('Expected redirect to be thrown');
	});
});
