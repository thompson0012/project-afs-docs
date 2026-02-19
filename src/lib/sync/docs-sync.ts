import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import type { ContentEntry } from '../content-map.js';

interface SyncOptions {
	sourceRoot: string;
	outputRoot: string;
	entries: Pick<ContentEntry, 'slug' | 'title' | 'source'>[];
	allEntries?: Pick<ContentEntry, 'slug' | 'source'>[];
}

interface SyncResult {
	written: number;
	skipped: number;
}

function escapeSvelteConflicts(markdown: string): string {
	const lines = markdown.split('\n');
	let inCodeBlock = false;

	return lines
		.map((line) => {
			if (line.trimStart().startsWith('```')) {
				inCodeBlock = !inCodeBlock;
			}
			if (inCodeBlock) return line;

			// Only escape bare < characters that could be mistaken for HTML tags
			return line.replace(/<(?![/a-zA-Z!])/g, '&lt;');
		})
		.join('\n');
}

function rewriteDocLinks(
	markdown: string,
	allEntries: Pick<ContentEntry, 'slug' | 'source'>[]
): string {
	const sourceFileToSlug = new Map<string, string>();
	for (const entry of allEntries) {
		sourceFileToSlug.set(basename(entry.source), entry.slug);
	}

	return markdown.replace(
		/\]\(\.\/([\w-]+\.md)\)/g,
		(_match, filename: string) => {
			const slug = sourceFileToSlug.get(filename);
			if (slug) return `](/docs/${slug})`;
			return `](${filename})`;
		}
	);
}

export async function syncDocs(options: SyncOptions): Promise<SyncResult> {
	let written = 0;
	let skipped = 0;
	const allEntries = options.allEntries ?? options.entries;

	for (const entry of options.entries) {
		const sourcePath = join(options.sourceRoot, entry.source);

		try {
			await access(sourcePath);
		} catch {
			skipped++;
			continue;
		}

		const rawContent = await readFile(sourcePath, 'utf-8');
		let content = escapeSvelteConflicts(rawContent);
		content = rewriteDocLinks(content, allEntries);
		const frontmatter = `---\ntitle: "${entry.title}"\n---\n\n`;
		const outPath = join(options.outputRoot, 'docs', entry.slug, '+page.md');

		await mkdir(dirname(outPath), { recursive: true });
		await writeFile(outPath, frontmatter + content);
		written++;
	}

	return { written, skipped };
}
