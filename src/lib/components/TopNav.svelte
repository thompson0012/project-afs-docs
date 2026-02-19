<script lang="ts">
	let { children } = $props();
</script>

<nav class="top-nav" aria-label="Top navigation">
	<div class="container">
		<a href="/" class="brand">Project AFS Docs</a>
		<div class="right-section">
			<div class="search-container">
				{@render children?.()}
			</div>
			<div class="links">
				<a href="https://github.com/labs21/project-afs" target="_blank" rel="noopener noreferrer">GitHub</a>
			</div>
		</div>
	</div>
</nav>

<style>
	.top-nav {
		background: #ffffff;
		border-bottom: 1px solid #e5e7eb;
		height: 4rem;
		display: flex;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.container {
		width: 100%;
		max-width: 80rem; /* max-w-7xl equivalent */
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.brand {
		font-weight: 700;
		font-size: 1.25rem;
		color: #111827;
		text-decoration: none;
	}

	.right-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.search-container {
		display: flex;
		align-items: center;
	}

	.links a {
		color: #4b5563;
		text-decoration: none;
		font-size: 0.875rem;
		padding: 0.5rem;
		border-radius: 0.375rem;
		transition: background-color 0.2s;
	}

	.links a:hover {
		color: #111827;
		background-color: #f3f4f6;
	}

	a:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}
</style>
