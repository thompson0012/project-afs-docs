<script lang="ts">
	import { page } from '$app/stores';
	import { contentMap } from '$lib/content-map';

	let currentPath = $derived($page.url.pathname);

	function isActive(slug: string, path: string) {
		return path === `/docs/${slug}` || (slug === 'introduction' && path === '/docs');
	}
</script>

<aside class="sidebar">
	<nav aria-label="Documentation sidebar">
		<ul class="nav-list">
			{#each contentMap as entry}
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
	</nav>
</aside>

<style>
	.sidebar {
		width: 16rem; /* w-64 equivalent */
		border-right: 1px solid #e5e7eb;
		height: calc(100vh - 4rem); /* Full height minus top nav */
		overflow-y: auto;
		position: sticky;
		top: 4rem;
		background: #f9fafb;
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

	a {
		display: block;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		color: #4b5563;
		text-decoration: none;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	a:hover {
		background-color: #f3f4f6;
		color: #111827;
	}

	a.active {
		background-color: #eff6ff;
		color: #1d4ed8;
		font-weight: 500;
	}

	a:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.sidebar {
			display: none; /* Hide on mobile for now, can be toggleable later */
		}
	}
</style>
