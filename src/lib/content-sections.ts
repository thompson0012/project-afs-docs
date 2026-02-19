import type { ContentEntry } from './content-map';

export interface SectionGroup {
	section: string;
	items: ContentEntry[];
}

export function groupContentBySection(entries: ContentEntry[]): SectionGroup[] {
	const order: string[] = [];
	const buckets = new Map<string, ContentEntry[]>();

	for (const entry of entries) {
		const section = entry.section ?? 'Other';
		if (!buckets.has(section)) {
			buckets.set(section, []);
			order.push(section);
		}
		buckets.get(section)?.push(entry);
	}

	return order.map((section) => ({ section, items: buckets.get(section) ?? [] }));
}
