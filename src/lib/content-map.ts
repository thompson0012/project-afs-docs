export interface ContentEntry {
	slug: string;
	title: string;
	source: string;
	local?: boolean;
}

export const contentMap: ContentEntry[] = [
	{ slug: 'introduction', title: 'Introduction', source: 'README.md' },
	{ slug: 'architecture', title: 'Architecture', source: 'docs/agentic-workflow-overview.md' },
	{ slug: 'cli-reference', title: 'CLI Reference', source: 'docs/cli-reference.md' },
	{ slug: 'tutorial', title: 'Step-by-step Tutorial', source: 'docs/tutorial.md', local: true },
	{ slug: 'daily-operations', title: 'Daily Operations', source: 'docs/daily-operations.md' },
	{ slug: 'integration', title: 'Integration Guide', source: 'docs/integration-guide.md' },
	{ slug: 'workflow-patterns', title: 'Workflow Patterns', source: 'docs/workflow-patterns.md' },
	{ slug: 'cli-addendum', title: 'CLI Addendum', source: 'skills/afs-skills/SKILL.md', local: true }
];
