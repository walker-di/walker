import type { Meta, StoryObj } from '@storybook/svelte';
import KnowledgeGraphView from '../lib/components/knowledge-graph-view/knowledge-graph-view.svelte';
import { sampleGraphData, sampleCategories, smallSampleData } from '../lib/components/knowledge-graph-view/utils/sample-data.js';

const meta = {
	title: 'Components/KnowledgeGraphView',
	component: KnowledgeGraphView,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'A comprehensive knowledge graph visualization component using Cytoscape.js. Features interactive node-link diagrams, clustering, search, and filtering capabilities.'
			}
		}
	},
	tags: ['autodocs'],
	argTypes: {
		data: {
			description: 'Graph data containing nodes and edges',
			control: { type: 'object' }
		},
		layout: {
			description: 'Layout configuration for the graph',
			control: { type: 'object' }
		},
		width: {
			description: 'Width of the graph container',
			control: { type: 'text' }
		},
		height: {
			description: 'Height of the graph container',
			control: { type: 'text' }
		},
		backgroundColor: {
			description: 'Background color of the graph',
			control: { type: 'color' }
		},
		categories: {
			description: 'Category definitions for nodes',
			control: { type: 'object' }
		},
		enableClustering: {
			description: 'Enable automatic clustering of nodes',
			control: { type: 'boolean' }
		},
		enablePan: {
			description: 'Enable panning interaction',
			control: { type: 'boolean' }
		},
		enableZoom: {
			description: 'Enable zoom interaction',
			control: { type: 'boolean' }
		},
		enableSelection: {
			description: 'Enable node/edge selection',
			control: { type: 'boolean' }
		},
		selectionMode: {
			description: 'Selection mode for nodes and edges',
			control: { type: 'select' },
			options: ['single', 'multiple', 'additive']
		},
		enableDrag: {
			description: 'Enable dragging of nodes',
			control: { type: 'boolean' }
		},
		enableSearch: {
			description: 'Enable search functionality',
			control: { type: 'boolean' }
		},
		enableFiltering: {
			description: 'Enable filtering functionality',
			control: { type: 'boolean' }
		},
		enableExport: {
			description: 'Enable export functionality',
			control: { type: 'boolean' }
		},
		showControls: {
			description: 'Show the controls sidebar',
			control: { type: 'boolean' }
		},
		showLegend: {
			description: 'Show the category legend',
			control: { type: 'boolean' }
		},
		showStats: {
			description: 'Show graph statistics',
			control: { type: 'boolean' }
		},
		showToolbar: {
			description: 'Show the toolbar',
			control: { type: 'boolean' }
		}
	}
} satisfies Meta<KnowledgeGraphView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with sample data
export const Default: Story = {
	args: {
		data: sampleGraphData,
		categories: sampleCategories,
		layout: {
			name: 'cose',
			animate: true,
			fit: true,
			padding: 30
		},
		width: '100%',
		height: '600px',
		backgroundColor: '#ffffff',
		enablePan: true,
		enableZoom: true,
		enableSelection: true,
		selectionMode: 'single',
		enableDrag: true,
		enableSearch: true,
		enableFiltering: true,
		enableExport: true,
		showControls: true,
		showLegend: true,
		showStats: false,
		showToolbar: true
	}
};

// Simple graph for basic demonstration
export const SimpleGraph: Story = {
	args: {
		data: smallSampleData,
		categories: [
			{
				id: 'concept',
				name: 'Concept',
				color: '#3b82f6',
				visible: true,
				description: 'Basic concepts'
			}
		],
		layout: {
			name: 'circle',
			animate: true,
			fit: true
		},
		width: '100%',
		height: '400px',
		showControls: false,
		showLegend: false,
		showStats: false,
		showToolbar: false
	}
};

// Force-directed layout
export const ForceDirected: Story = {
	args: {
		...Default.args,
		layout: {
			name: 'cose-bilkent',
			animate: true,
			fit: true,
			nodeRepulsion: 4500,
			idealEdgeLength: 50,
			edgeElasticity: 0.45,
			nestingFactor: 0.1,
			gravity: 0.25,
			numIter: 2500,
			randomize: false
		}
	}
};

// Hierarchical layout
export const Hierarchical: Story = {
	args: {
		...Default.args,
		layout: {
			name: 'dagre',
			animate: true,
			fit: true,
			directed: true,
			padding: 30,
			spacingFactor: 1.25,
			nodeSpacing: 50,
			rankSeparation: 75
		}
	}
};

// Grid layout
export const GridLayout: Story = {
	args: {
		...Default.args,
		layout: {
			name: 'grid',
			animate: true,
			fit: true,
			padding: 30,
			spacingFactor: 1.5
		}
	}
};

// Dark theme
export const DarkTheme: Story = {
	args: {
		...Default.args,
		backgroundColor: '#1f2937'
	},
	parameters: {
		backgrounds: {
			default: 'dark'
		}
	}
};

// With statistics panel
export const WithStats: Story = {
	args: {
		...Default.args,
		showStats: true
	}
};

// Minimal interface
export const Minimal: Story = {
	args: {
		...Default.args,
		showControls: false,
		showLegend: false,
		showStats: false,
		showToolbar: false
	}
};

// Large graph simulation
export const LargeGraph: Story = {
	args: {
		...Default.args,
		data: {
			nodes: Array.from({ length: 50 }, (_, i) => ({
				id: `node-${i}`,
				label: `Node ${i + 1}`,
				type: 'example',
				category: ['person', 'organization', 'technology', 'concept'][i % 4],
				size: Math.random() * 20 + 15,
				color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 4]
			})),
			edges: Array.from({ length: 75 }, (_, i) => {
				const source = Math.floor(Math.random() * 50);
				let target = Math.floor(Math.random() * 50);
				while (target === source) {
					target = Math.floor(Math.random() * 50);
				}
				return {
					id: `edge-${i}`,
					source: `node-${source}`,
					target: `node-${target}`,
					label: 'connects',
					type: 'connection',
					color: '#6b7280',
					width: Math.random() * 2 + 1
				};
			}),
			metadata: {
				title: 'Large Test Graph',
				description: 'A larger graph for performance testing'
			}
		},
		layout: {
			name: 'fcose',
			animate: true,
			fit: true,
			randomize: false,
			nodeRepulsion: 4500,
			idealEdgeLength: 50,
			edgeElasticity: 0.45
		}
	}
};

// Interactive demo with event handlers
export const Interactive: Story = {
	args: {
		...Default.args,
		onNodeClick: (event) => {
			console.log('Node clicked:', event.target);
		},
		onNodeSelect: (nodes) => {
			console.log('Nodes selected:', nodes);
		},
		onEdgeClick: (event) => {
			console.log('Edge clicked:', event.target);
		},
		onLayoutComplete: () => {
			console.log('Layout completed');
		},
		onSearch: (query, results) => {
			console.log('Search:', query, 'Results:', results);
		},
		onFilter: (filter) => {
			console.log('Filter applied:', filter);
		},
		onExport: (options) => {
			console.log('Export requested:', options);
		}
	}
};
