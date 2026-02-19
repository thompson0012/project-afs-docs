
import adapter from '@sveltejs/adapter-cloudflare'
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';

const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			rehypePlugins: [rehypeSlug]
		})
	],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn'
		}
	}
};

export default config;
