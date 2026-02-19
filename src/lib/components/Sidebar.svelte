<script lang="ts">
	import { page } from '$app/stores';
	import { contentMap } from '$lib/content-map';
	import { groupContentBySection } from '$lib/content-sections';

	let currentPath = $derived($page.url.pathname);
	let sections = $derived(groupContentBySection(contentMap));

	function isActive(slug: string, path: string) {
		return path === `/docs/${slug}` || (slug === 'introduction' && path === '/docs');
	}
</script>

<aside class="sidebar">
	<nav aria-label="Documentation sidebar">
		{#each sections as group}
			<div class="section">
				<h2 class="section-title">{group.section}</h2>
				<ul class="nav-list">
					{#each group.items as entry}
						<li>
							<a
								href="/docs/{entry.slug}"
								class:active={isActive(entry.slug, currentPath)}
								aria-current={isActive(entry.slug, currentPath) ? 'page' : undefined}
							>
								{entry.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
</aside>

<style>
	.sidebar {
		width: 16rem; /* w-64 equivalent */
		border-right: 1px solid var(--border);
		height: calc(100vh - 4rem); /* Full height minus top nav */
		overflow-y: auto;
		position: sticky;
		top: 4rem;
		background: var(--bg-soft);
		padding: 1.5rem 1rem;
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section + .section {
		margin-top: 1.5rem;
	}

	.section-title {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0 0 0.5rem;
		padding: 0 0.75rem;
	}

	a {
		display: block;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	a:hover {
		background-color: var(--bg-subtle);
		color: var(--text);
	}

	a.active {
		background-color: rgba(99, 102, 241, 0.12);
		color: var(--accent-strong);
		font-weight: 500;
	}

	a:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.sidebar {
			display: none; /* Hide on mobile for now, can be toggleable later */
		}
	}
</style>
