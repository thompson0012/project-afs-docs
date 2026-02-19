<script>
	import TopNav from '$lib/components/TopNav.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Search from '$lib/components/Search.svelte';

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
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.layout-root {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		color: #1f2937;
	}

	.content-wrapper {
		display: flex;
		flex: 1;
		width: 100%;
		max-width: 90rem; /* wider content area */
		margin: 0 auto;
	}

	.main-content {
		flex: 1;
		padding: 2rem 3rem;
		min-width: 0; /* prevent overflow issues */
	}

	@media (max-width: 768px) {
		.content-wrapper {
			flex-direction: column;
		}

		.main-content {
			padding: 1.5rem;
		}
	}
</style>
