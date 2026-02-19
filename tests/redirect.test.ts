import { describe, it, expect } from 'vitest';
import { load } from '../src/routes/+page';

describe('root redirect', () => {
	it('redirects to /docs/introduction', async () => {
		try {
			load();
		} catch (error) {
			expect(error).toMatchObject({ status: 307, location: '/docs/introduction' });
			return;
		}

		throw new Error('Expected redirect to be thrown');
	});
});
