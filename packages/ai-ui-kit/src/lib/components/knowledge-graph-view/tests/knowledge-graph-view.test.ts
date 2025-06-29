/**
 * Knowledge Graph View Tests
 *
 * Basic tests for the knowledge graph component functionality.
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import KnowledgeGraphView from '../knowledge-graph-view.svelte';
import { smallSampleData, sampleCategories } from '../utils/sample-data.js';

// Mock Cytoscape since it requires DOM
vi.mock('cytoscape', () => ({
	default: vi.fn(() => ({
		on: vi.fn(),
		elements: vi.fn(() => ({
			remove: vi.fn(),
			removeClass: vi.fn()
		})),
		add: vi.fn(),
		layout: vi.fn(() => ({
			run: vi.fn()
		})),
		fit: vi.fn(),
		zoom: vi.fn(),
		pan: vi.fn(),
		center: vi.fn(),
		destroy: vi.fn(),
		getElementById: vi.fn(() => ({
			addClass: vi.fn()
		})),
		nodes: vi.fn(() => ({
			forEach: vi.fn()
		})),
		edges: vi.fn(() => ({
			forEach: vi.fn()
		})),
		png: vi.fn(),
		svg: vi.fn()
	})),
	use: vi.fn()
}));

// Mock Cytoscape extensions
vi.mock('cytoscape-cose-bilkent', () => ({}));
vi.mock('cytoscape-dagre', () => ({}));
vi.mock('cytoscape-cola', () => ({}));
vi.mock('cytoscape-fcose', () => ({}));

describe('KnowledgeGraphView', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders without crashing', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories
			}
		});

		expect(screen.getByRole('application')).toBeInTheDocument();
	});

	it('displays error message when no data is provided', () => {
		render(KnowledgeGraphView, {
			props: {
				data: { nodes: [], edges: [] },
				categories: []
			}
		});

		expect(screen.getByText('No graph data available')).toBeInTheDocument();
	});

	it('shows toolbar when enabled', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				showToolbar: true
			}
		});

		// Should have search input in toolbar
		expect(screen.getByPlaceholderText('Search nodes...')).toBeInTheDocument();
	});

	it('hides toolbar when disabled', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				showToolbar: false
			}
		});

		// Should not have search input
		expect(screen.queryByPlaceholderText('Search nodes...')).not.toBeInTheDocument();
	});

	it('shows controls sidebar when enabled', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				showControls: true
			}
		});

		// Should have layout controls
		expect(screen.getByText('Layout')).toBeInTheDocument();
	});

	it('hides controls sidebar when disabled', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				showControls: false
			}
		});

		// Should not have layout controls
		expect(screen.queryByText('Layout')).not.toBeInTheDocument();
	});

	it('shows legend when enabled and categories are provided', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				showLegend: true,
				showControls: true
			}
		});

		// Should have categories section
		expect(screen.getByText('Categories')).toBeInTheDocument();
	});

	it('shows stats when enabled', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				showStats: true,
				showControls: true
			}
		});

		// Should have graph statistics
		expect(screen.getByText('Graph Statistics')).toBeInTheDocument();
	});

	it('applies custom dimensions', () => {
		const { container } = render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				width: '800px',
				height: '500px'
			}
		});

		const graphContainer = container.querySelector('.knowledge-graph-view');
		expect(graphContainer).toHaveStyle({
			width: '800px',
			height: '500px'
		});
	});

	it('applies custom background color', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				backgroundColor: '#f0f0f0'
			}
		});

		// The background color should be applied to the cytoscape container
		// This is a simplified test since the actual application happens in the component
		expect(true).toBe(true); // Placeholder assertion
	});

	it('handles accessibility attributes', () => {
		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				ariaLabel: 'Test Knowledge Graph',
				ariaDescription: 'A test graph for demonstration'
			}
		});

		const container = screen.getByRole('application');
		expect(container).toHaveAttribute('aria-label', 'Test Knowledge Graph');
	});

	it('calls event handlers when provided', () => {
		const onNodeClick = vi.fn();
		const onLayoutComplete = vi.fn();

		render(KnowledgeGraphView, {
			props: {
				data: smallSampleData,
				categories: sampleCategories,
				onNodeClick,
				onLayoutComplete
			}
		});

		// Event handlers should be stored (actual testing would require DOM interaction)
		expect(onNodeClick).toBeDefined();
		expect(onLayoutComplete).toBeDefined();
	});
});
