<script>
	import TopNav from '$lib/components/TopNav.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Search from '$lib/components/Search.svelte';
	import Toc from '$lib/components/Toc.svelte';

	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<div class="layout-root">
	<TopNav>
		<Search />
	</TopNav>
	<div class="content-wrapper">
		<Sidebar />
		<main class="main-content">
			{@render children()}
		</main>
		<Toc />
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
	}

	.layout-root {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--bg);
		color: var(--text);
	}

	.content-wrapper {
		display: grid;
		grid-template-columns: 16rem minmax(0, 1fr) 14rem;
		flex: 1;
		width: 100%;
		max-width: 90rem; /* wider content area */
		margin: 0 auto;
		gap: 1.5rem;
	}

	.main-content {
		flex: 1;
		padding: 2rem 3rem;
		min-width: 0; /* prevent overflow issues */
	}

	.main-content :global(h2),
	.main-content :global(h3) {
		scroll-margin-top: 6rem;
	}

	@media (max-width: 768px) {
		.content-wrapper {
			grid-template-columns: 1fr;
		}

		.main-content {
			padding: 1.5rem;
		}
	}
</style>
