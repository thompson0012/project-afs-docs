
import adapter from '@sveltejs/adapter-cloudflare'
import { mdsvex } from 'mdsvex';

const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [mdsvex({ extensions: ['.md', '.svx'] })],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn'
		}
	}
};

export default config;
