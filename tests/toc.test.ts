import { describe, it, expect } from 'vitest';
import { collectHeadings } from '../src/lib/toc';

class TestContainer implements Pick<ParentNode, 'querySelectorAll'> {
	private content = '';

	get innerHTML(): string {
		return this.content;
	}

	set innerHTML(value: string) {
		this.content = value;
	}

	querySelectorAll(selectors: string): NodeListOf<Element> {
		if (selectors !== 'h2, h3') {
			return [] as unknown as NodeListOf<Element>;
		}

		const matcher = /<h([23]) id="([^"]+)">([^<]*)<\/h[23]>/g;
		const matches = Array.from(this.content.matchAll(matcher));
		const elements = matches.map((match) => {
			const level = Number(match[1]);
			const id = match[2] ?? '';
			const text = match[3] ?? '';
			return {
				id,
				tagName: level === 3 ? 'H3' : 'H2',
				textContent: text
			} as Element;
		});

		return elements as unknown as NodeListOf<Element>;
	}
}

describe('collectHeadings', () => {
	it('collects h2/h3 headings from a container', () => {
		const root = new TestContainer();
		root.innerHTML = '<h2 id="a">A</h2><h3 id="b">B</h3><h4 id="c">C</h4>';
		const headings = collectHeadings(root);
		expect(headings.map((heading: { id: string }) => heading.id)).toEqual(['a', 'b']);
	});
});
