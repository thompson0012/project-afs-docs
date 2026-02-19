export interface ContentEntry {
	slug: string;
	title: string;
	source: string;
	local?: boolean;
	section?: string;
}

export const contentMap: ContentEntry[] = [
	{
		slug: 'introduction',
		title: 'Introduction',
		source: 'README.md',
		local: true,
		section: 'Getting Started'
	},
	{
		slug: 'architecture',
		title: 'Architecture',
		source: 'docs/agentic-workflow-overview.md',
		section: 'Getting Started'
	},
	{
		slug: 'daily-operations',
		title: 'Daily Operations',
		source: 'docs/daily-operations.md',
		section: 'Getting Started'
	},
	{
		slug: 'tutorial',
		title: 'Step-by-step Tutorial',
		source: 'docs/tutorial.md',
		local: true,
		section: 'Getting Started'
	},
	{
		slug: 'core/cli-overview',
		title: 'CLI Guide Overview',
		source: 'afs-guide/00-overview.md',
		local: true,
		section: 'Core Concepts'
	},
	{
		slug: 'core/memory',
		title: 'Memory',
		source: 'afs-guide/01-memory.md',
		local: true,
		section: 'Core Concepts'
	},
	{
		slug: 'core/query',
		title: 'Query',
		source: 'afs-guide/02-query.md',
		local: true,
		section: 'Core Concepts'
	},
	{
		slug: 'core/graph',
		title: 'Graph',
		source: 'afs-guide/03-graph.md',
		local: true,
		section: 'Core Concepts'
	},
	{
		slug: 'core/agent',
		title: 'Agent',
		source: 'afs-guide/04-agent.md',
		local: true,
		section: 'Core Concepts'
	},
	{
		slug: 'core/session',
		title: 'Session',
		source: 'afs-guide/05-session.md',
		local: true,
		section: 'Core Concepts'
	},
	{
		slug: 'core/attachment',
		title: 'Attachment',
		source: 'afs-guide/06-attachment.md',
		local: true,
		section: 'Core Concepts'
	},
	{
		slug: 'operations/admin',
		title: 'Admin',
		source: 'afs-guide/07-admin.md',
		local: true,
		section: 'Operations'
	},
	{
		slug: 'operations/maintenance',
		title: 'Maintenance',
		source: 'afs-guide/08-maintenance.md',
		local: true,
		section: 'Operations'
	},
	{
		slug: 'operations/scheduler',
		title: 'Scheduler',
		source: 'afs-guide/09-scheduler.md',
		local: true,
		section: 'Operations'
	},
	{
		slug: 'operations/models',
		title: 'Models',
		source: 'afs-guide/10-models.md',
		local: true,
		section: 'Operations'
	},
	{
		slug: 'integration',
		title: 'Integration Guide',
		source: 'docs/integration-guide.md',
		section: 'Integrations'
	},
	{
		slug: 'workflow-patterns',
		title: 'Workflow Patterns',
		source: 'docs/workflow-patterns.md',
		section: 'Integrations'
	},
	{
		slug: 'integrations/non-cli',
		title: 'Non-CLI APIs',
		source: 'afs-guide/11-non-cli.md',
		local: true,
		section: 'Integrations'
	},
	{
		slug: 'cli-reference',
		title: 'CLI Reference',
		source: 'docs/cli-reference.md',
		section: 'Reference'
	},
	{
		slug: 'cli-addendum',
		title: 'CLI Addendum',
		source: 'skills/afs-skills/SKILL.md',
		local: true,
		section: 'Reference'
	},
	{
		slug: 'reference/caveats-testing',
		title: 'Caveats & Testing',
		source: 'afs-guide/12-caveats-testing.md',
		local: true,
		section: 'Reference'
	}
];
