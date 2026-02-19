<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { collectHeadings, type TocHeading } from '$lib/toc';

	let headings = $state<TocHeading[]>([]);
	let activeId = $state('');
	let observer: IntersectionObserver | null = null;

	function setupObserver() {
		observer?.disconnect();
		const root = document.querySelector('main');
		if (!root) return;

		headings = collectHeadings(root);
		if (!headings.length) return;

		const handleIntersect: IntersectionObserverCallback = (entries) => {
			const visible = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));

			if (visible[0]?.target instanceof HTMLElement) {
				activeId = visible[0].target.id;
			}
		};

		observer = new IntersectionObserver(handleIntersect, {
			rootMargin: '-96px 0px -65% 0px',
			threshold: 0.1
		});

		headings.forEach((heading) => {
			const element = document.getElementById(heading.id);
			if (element) observer?.observe(element);
		});
	}

	onMount(() => {
		setupObserver();
		return () => observer?.disconnect();
	});

	$effect(() => {
		$page.url.pathname;
		setupObserver();
	});
</script>

<aside class="toc" aria-label="On this page">
	<h2 class="toc-title">On this page</h2>
	<ul>
		{#each headings as heading}
			<li class:active={heading.id === activeId} class:sub={heading.level === 3}>
				<a href={`#${heading.id}`}>{heading.text}</a>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.toc {
		position: sticky;
		top: 5rem;
		align-self: start;
		padding: 1.5rem 1rem;
		max-height: calc(100vh - 6rem);
		overflow: auto;
	}

	.toc-title {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #6b7280;
		margin: 0 0 0.75rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}

	a {
		text-decoration: none;
		color: #4b5563;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	li.sub a {
		padding-left: 0.75rem;
		font-size: 0.8125rem;
	}

	li.active a {
		color: #1d4ed8;
		font-weight: 600;
	}

	@media (max-width: 1024px) {
		.toc {
			display: none;
		}
	}
</style>
