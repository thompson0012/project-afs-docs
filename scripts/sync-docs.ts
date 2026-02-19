import { accessSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentMap } from '../src/lib/content-map.js';
import { syncDocs } from '../src/lib/sync/docs-sync.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

function findSourceRoot(): string {
	const envRoot = process.env['AFS_SOURCE_ROOT'];
	if (envRoot) return resolve(envRoot);

	let dir = projectRoot;
	for (let i = 0; i < 5; i++) {
		const parent = resolve(dir, '..');
		const candidate = resolve(parent, 'project-afs');
		try {
			accessSync(resolve(candidate, 'README.md'));
			return candidate;
		} catch {
			dir = parent;
		}
	}
	return resolve(projectRoot, '..', 'project-afs');
}

const sourceRoot = findSourceRoot();
console.log(`Source root: ${sourceRoot}`);

const nonLocalEntries = contentMap.filter((e) => !e.local);
console.log(`Syncing ${nonLocalEntries.length} entries (${contentMap.length - nonLocalEntries.length} local entries skipped)`);

const result = await syncDocs({
	sourceRoot,
	outputRoot: resolve(projectRoot, 'src/routes'),
	entries: nonLocalEntries,
	allEntries: contentMap
});

console.log(`Synced ${result.written} docs, skipped ${result.skipped}`);
