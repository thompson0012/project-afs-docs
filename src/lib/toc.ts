export interface TocHeading {
	id: string;
	text: string;
	level: number;
}

export function collectHeadings(root: Pick<ParentNode, 'querySelectorAll'>): TocHeading[] {
	const nodes = Array.from(root.querySelectorAll('h2, h3'));

	return nodes
		.map((node) => ({
			id: node.id,
			text: node.textContent?.trim() ?? '',
			level: node.tagName === 'H3' ? 3 : 2
		}))
		.filter((heading) => heading.id && heading.text);
}
