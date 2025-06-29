/**
 * Sample Knowledge Graph Data
 * 
 * This file contains sample data for testing and demonstrating the knowledge graph component.
 */

import type { GraphData, GraphCategory } from '../types/knowledge-graph.js';

// Sample categories
export const sampleCategories: GraphCategory[] = [
	{
		id: 'person',
		name: 'Person',
		color: '#3b82f6',
		visible: true,
		description: 'People and individuals'
	},
	{
		id: 'organization',
		name: 'Organization',
		color: '#10b981',
		visible: true,
		description: 'Companies and organizations'
	},
	{
		id: 'technology',
		name: 'Technology',
		color: '#f59e0b',
		visible: true,
		description: 'Technologies and tools'
	},
	{
		id: 'concept',
		name: 'Concept',
		color: '#8b5cf6',
		visible: true,
		description: 'Abstract concepts and ideas'
	},
	{
		id: 'location',
		name: 'Location',
		color: '#ef4444',
		visible: true,
		description: 'Places and locations'
	}
];

// Sample graph data
export const sampleGraphData: GraphData = {
	nodes: [
		// People
		{
			id: 'alice',
			label: 'Alice Johnson',
			type: 'person',
			category: 'person',
			size: 30,
			color: '#3b82f6',
			data: {
				role: 'AI Researcher',
				experience: '5 years',
				specialization: 'Machine Learning'
			}
		},
		{
			id: 'bob',
			label: 'Bob Smith',
			type: 'person',
			category: 'person',
			size: 25,
			color: '#3b82f6',
			data: {
				role: 'Software Engineer',
				experience: '3 years',
				specialization: 'Frontend Development'
			}
		},
		{
			id: 'carol',
			label: 'Carol Davis',
			type: 'person',
			category: 'person',
			size: 35,
			color: '#3b82f6',
			data: {
				role: 'Data Scientist',
				experience: '7 years',
				specialization: 'Deep Learning'
			}
		},
		
		// Organizations
		{
			id: 'techcorp',
			label: 'TechCorp Inc.',
			type: 'company',
			category: 'organization',
			size: 40,
			color: '#10b981',
			data: {
				industry: 'Technology',
				founded: '2010',
				employees: '500+'
			}
		},
		{
			id: 'ailab',
			label: 'AI Research Lab',
			type: 'research',
			category: 'organization',
			size: 35,
			color: '#10b981',
			data: {
				type: 'Research Institution',
				focus: 'Artificial Intelligence',
				established: '2015'
			}
		},
		
		// Technologies
		{
			id: 'svelte',
			label: 'Svelte',
			type: 'framework',
			category: 'technology',
			size: 30,
			color: '#f59e0b',
			data: {
				type: 'Frontend Framework',
				language: 'JavaScript',
				paradigm: 'Component-based'
			}
		},
		{
			id: 'cytoscape',
			label: 'Cytoscape.js',
			type: 'library',
			category: 'technology',
			size: 25,
			color: '#f59e0b',
			data: {
				type: 'Graph Visualization Library',
				language: 'JavaScript',
				purpose: 'Network Analysis'
			}
		},
		{
			id: 'python',
			label: 'Python',
			type: 'language',
			category: 'technology',
			size: 35,
			color: '#f59e0b',
			data: {
				type: 'Programming Language',
				paradigm: 'Multi-paradigm',
				use_case: 'Data Science, AI'
			}
		},
		
		// Concepts
		{
			id: 'ml',
			label: 'Machine Learning',
			type: 'field',
			category: 'concept',
			size: 40,
			color: '#8b5cf6',
			data: {
				domain: 'Artificial Intelligence',
				description: 'Algorithms that learn from data'
			}
		},
		{
			id: 'visualization',
			label: 'Data Visualization',
			type: 'discipline',
			category: 'concept',
			size: 30,
			color: '#8b5cf6',
			data: {
				domain: 'Data Science',
				description: 'Visual representation of data'
			}
		},
		
		// Locations
		{
			id: 'silicon_valley',
			label: 'Silicon Valley',
			type: 'region',
			category: 'location',
			size: 35,
			color: '#ef4444',
			data: {
				country: 'USA',
				state: 'California',
				known_for: 'Technology Hub'
			}
		}
	],
	
	edges: [
		// Employment relationships
		{
			id: 'alice-techcorp',
			source: 'alice',
			target: 'techcorp',
			label: 'works at',
			type: 'employment',
			color: '#6b7280',
			width: 2
		},
		{
			id: 'bob-techcorp',
			source: 'bob',
			target: 'techcorp',
			label: 'works at',
			type: 'employment',
			color: '#6b7280',
			width: 2
		},
		{
			id: 'carol-ailab',
			source: 'carol',
			target: 'ailab',
			label: 'researcher at',
			type: 'employment',
			color: '#6b7280',
			width: 2
		},
		
		// Technology usage
		{
			id: 'bob-svelte',
			source: 'bob',
			target: 'svelte',
			label: 'uses',
			type: 'technology_use',
			color: '#9ca3af',
			width: 1
		},
		{
			id: 'bob-cytoscape',
			source: 'bob',
			target: 'cytoscape',
			label: 'uses',
			type: 'technology_use',
			color: '#9ca3af',
			width: 1
		},
		{
			id: 'alice-python',
			source: 'alice',
			target: 'python',
			label: 'programs in',
			type: 'technology_use',
			color: '#9ca3af',
			width: 1
		},
		{
			id: 'carol-python',
			source: 'carol',
			target: 'python',
			label: 'programs in',
			type: 'technology_use',
			color: '#9ca3af',
			width: 1
		},
		
		// Knowledge relationships
		{
			id: 'alice-ml',
			source: 'alice',
			target: 'ml',
			label: 'specializes in',
			type: 'expertise',
			color: '#a78bfa',
			width: 2
		},
		{
			id: 'carol-ml',
			source: 'carol',
			target: 'ml',
			label: 'expert in',
			type: 'expertise',
			color: '#a78bfa',
			width: 3
		},
		{
			id: 'bob-visualization',
			source: 'bob',
			target: 'visualization',
			label: 'interested in',
			type: 'interest',
			color: '#a78bfa',
			width: 1
		},
		
		// Location relationships
		{
			id: 'techcorp-sv',
			source: 'techcorp',
			target: 'silicon_valley',
			label: 'located in',
			type: 'location',
			color: '#f87171',
			width: 2
		},
		{
			id: 'ailab-sv',
			source: 'ailab',
			target: 'silicon_valley',
			label: 'based in',
			type: 'location',
			color: '#f87171',
			width: 2
		},
		
		// Collaboration
		{
			id: 'alice-carol',
			source: 'alice',
			target: 'carol',
			label: 'collaborates with',
			type: 'collaboration',
			color: '#34d399',
			width: 2
		},
		
		// Technology relationships
		{
			id: 'cytoscape-visualization',
			source: 'cytoscape',
			target: 'visualization',
			label: 'enables',
			type: 'capability',
			color: '#fbbf24',
			width: 2
		},
		{
			id: 'python-ml',
			source: 'python',
			target: 'ml',
			label: 'used for',
			type: 'application',
			color: '#fbbf24',
			width: 2
		}
	],
	
	metadata: {
		title: 'Sample Knowledge Graph',
		description: 'A demonstration graph showing relationships between people, organizations, technologies, and concepts',
		version: '1.0',
		created: new Date('2024-01-01'),
		modified: new Date(),
		author: 'AI UI Kit',
		tags: ['demo', 'sample', 'knowledge-graph']
	}
};

// Smaller sample for testing
export const smallSampleData: GraphData = {
	nodes: [
		{
			id: 'node1',
			label: 'Node 1',
			type: 'example',
			category: 'concept',
			size: 30,
			color: '#3b82f6'
		},
		{
			id: 'node2',
			label: 'Node 2',
			type: 'example',
			category: 'concept',
			size: 25,
			color: '#10b981'
		},
		{
			id: 'node3',
			label: 'Node 3',
			type: 'example',
			category: 'concept',
			size: 35,
			color: '#f59e0b'
		}
	],
	edges: [
		{
			id: 'edge1',
			source: 'node1',
			target: 'node2',
			label: 'connects to',
			type: 'connection',
			color: '#6b7280',
			width: 2
		},
		{
			id: 'edge2',
			source: 'node2',
			target: 'node3',
			label: 'links to',
			type: 'connection',
			color: '#6b7280',
			width: 2
		}
	],
	metadata: {
		title: 'Simple Test Graph',
		description: 'A minimal graph for testing',
		version: '1.0'
	}
};
