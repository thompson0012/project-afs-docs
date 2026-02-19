<script lang="ts">
	import { onMount } from 'svelte';

	interface PagefindResult {
		id: string;
		data: () => Promise<PagefindData>;
		url: string;
		excerpt: string;
		meta: {
			title: string;
		};
	}

	interface PagefindData {
		url: string;
		content: string;
		word_count: number;
		filters: Record<string, string[]>;
		meta: {
			title: string;
		};
		anchors: {
			element: string;
			id: string;
			text: string;
			location: number;
		}[];
	}

	interface Pagefind {
		search: (query: string) => Promise<{ results: PagefindResult[] }>;
		init: () => void;
	}

	let query = '';
	let results: PagefindResult[] = [];
	let pagefind: Pagefind | null = null;
	let isSearching = false;

	onMount(async () => {
		if (import.meta.env.DEV) {
			console.warn('Pagefind search only works in production build');
			return;
		}

		try {
			const base = import.meta.env.BASE_URL ?? '/';
			const importPath = `${base}pagefind/pagefind.js`;
			const module = await import(importPath /* @vite-ignore */);
			pagefind = module as Pagefind;
			pagefind.init();
		} catch (e) {
			console.warn('Failed to load pagefind:', e);
		}
	});

	async function handleSearch() {
		if (!pagefind || !query) {
			results = [];
			return;
		}
		
		isSearching = true;
		try {
			const search = await pagefind.search(query);
			results = search.results.slice(0, 5);
		} catch (e) {
			console.error(e);
		} finally {
			isSearching = false;
		}
	}
</script>

<div class="search-wrapper">
	<label for="search-docs" class="sr-only">Search documentation</label>
	<input
		id="search-docs"
		type="search"
		bind:value={query}
		oninput={handleSearch}
		placeholder="Search docs..."
		class="search-input"
		aria-label="Search documentation"
	/>
	
	{#if results.length > 0}
		<div class="results" role="listbox">
			{#each results as result}
				<a href={result.url.replace('.html', '')} class="result-item" role="option" aria-selected="false">
					<div class="result-title">{result.meta.title}</div>
					<p>{@html result.excerpt}</p>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search-wrapper {
		position: relative;
		margin-left: 1rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.search-input {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		width: 200px;
		transition: width 0.2s, border-color 0.2s;
		background: var(--bg);
		color: var(--text);
	}

	.search-input:focus {
		width: 300px;
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 2px var(--focus);
	}

	.results {
		position: absolute;
		top: 100%;
		right: 0;
		width: 300px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		margin-top: 0.5rem;
		max-height: 400px;
		overflow-y: auto;
		z-index: 50;
	}

	.result-item {
		display: block;
		padding: 0.75rem;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: inherit;
	}

	.result-item:last-child {
		border-bottom: none;
	}

	.result-item:hover {
		background-color: var(--bg-subtle);
	}

	.result-title {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text);
	}

	.result-item p {
		margin: 0.25rem 0 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
