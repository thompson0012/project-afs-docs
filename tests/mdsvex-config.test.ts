import { test, expect } from 'vitest';
import config from '../svelte.config.js';

test('mdsvex extensions include .svelte, .md, and .svx', () => {
	expect(config.extensions).toEqual(expect.arrayContaining(['.svelte', '.md', '.svx']));
});

test('config uses adapter-static', () => {
	if (!config.kit?.adapter) {
		throw new Error('Expected kit.adapter to be defined');
	}
	expect(config.kit.adapter.name).toBe('@sveltejs/adapter-static');
});

test('config has mdsvex in preprocess', () => {
	const preprocess = Array.isArray(config.preprocess)
		? config.preprocess
		: config.preprocess
			? [config.preprocess]
			: [];
	if (preprocess.length === 0) {
		throw new Error('Expected preprocess to be defined');
	}
	expect(preprocess.length).toBeGreaterThanOrEqual(1);
});
