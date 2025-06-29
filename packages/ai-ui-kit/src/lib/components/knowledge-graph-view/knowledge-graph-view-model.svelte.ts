/**
 * Knowledge Graph View Model
 * 
 * This file contains the Svelte 5 state management for the knowledge graph component.
 * It handles graph interactions, layout controls, filtering, and data management.
 */

import { validateGraphData, validateLayoutConfig, createValidatedGraphData } from './utils/validation.js';
import type {
	GraphData,
	GraphNode,
	GraphEdge,
	LayoutConfig,
	GraphCategory,
	SelectionState,
	ViewportState,
	SearchConfig,
	FilterConfig,
	ExportOptions,
	KnowledgeGraphViewProps,
	NodeEvent,
	EdgeEvent
} from './types/knowledge-graph.js';

export class KnowledgeGraphViewModel {
	// Core state
	graphData = $state<GraphData>({ nodes: [], edges: [] });
	layout = $state<LayoutConfig>({ name: 'cose', animate: true, fit: true });
	categories = $state<GraphCategory[]>([]);
	
	// Interaction state
	selection = $state<SelectionState>({
		nodes: new Set(),
		edges: new Set(),
		selectionMode: 'single'
	});
	
	viewport = $state<ViewportState>({
		zoom: 1,
		pan: { x: 0, y: 0 },
		fit: true
	});
	
	// Feature state
	searchConfig = $state<SearchConfig>({
		query: '',
		searchFields: ['label'],
		caseSensitive: false,
		useRegex: false,
		highlightResults: true
	});
	
	filterConfig = $state<FilterConfig>({
		nodeTypes: [],
		edgeTypes: [],
		categories: [],
		showIsolated: true
	});
	
	// UI state
	isLoading = $state(false);
	isLayoutRunning = $state(false);
	showControls = $state(true);
	showLegend = $state(true);
	showStats = $state(false);
	showToolbar = $state(true);
	
	// Error state
	error = $state<string | null>(null);
	
	// Props reference
	private props: KnowledgeGraphViewProps;
	
	// Cytoscape instance reference
	private cy: any = null;
	
	constructor(props: KnowledgeGraphViewProps) {
		this.props = props;
		this.initializeFromProps();
	}
	
	updateProps(props: KnowledgeGraphViewProps) {
		this.props = props;
		this.initializeFromProps();
	}
	
	private initializeFromProps() {
		// Update graph data
		if (this.props.data) {
			const validation = validateGraphData(this.props.data);
			if (validation.success && validation.data) {
				this.graphData = validation.data;
			} else {
				this.error = validation.message || 'Invalid graph data';
			}
		}
		
		// Update layout
		if (this.props.layout) {
			const validation = validateLayoutConfig(this.props.layout);
			if (validation.success && validation.data) {
				this.layout = validation.data;
			}
		}
		
		// Update categories
		if (this.props.categories) {
			this.categories = this.props.categories;
		}
		
		// Update UI state
		this.showControls = this.props.showControls ?? true;
		this.showLegend = this.props.showLegend ?? true;
		this.showStats = this.props.showStats ?? false;
		this.showToolbar = this.props.showToolbar ?? true;
		
		// Update selection mode
		this.selection.selectionMode = this.props.selectionMode ?? 'single';
	}
	
	// Cytoscape instance management
	setCytoscapeInstance(cy: any) {
		this.cy = cy;
		this.setupEventListeners();
	}
	
	private setupEventListeners() {
		if (!this.cy) return;
		
		// Node events
		this.cy.on('tap', 'node', (event: any) => {
			const node = event.target.data();
			this.handleNodeClick(node, event);
		});
		
		this.cy.on('mouseover', 'node', (event: any) => {
			const node = event.target.data();
			this.handleNodeHover(node, event);
		});
		
		// Edge events
		this.cy.on('tap', 'edge', (event: any) => {
			const edge = event.target.data();
			this.handleEdgeClick(edge, event);
		});
		
		// Layout events
		this.cy.on('layoutstart', () => {
			this.isLayoutRunning = true;
		});
		
		this.cy.on('layoutstop', () => {
			this.isLayoutRunning = false;
			this.props.onLayoutComplete?.();
		});
		
		// Viewport events
		this.cy.on('zoom pan', () => {
			this.updateViewportState();
		});
	}
	
	// Event handlers
	private handleNodeClick(nodeData: any, event: any) {
		const node: GraphNode = nodeData;
		
		// Update selection
		if (this.selection.selectionMode === 'single') {
			this.selection.nodes.clear();
			this.selection.edges.clear();
		}
		
		if (this.selection.nodes.has(node.id)) {
			this.selection.nodes.delete(node.id);
		} else {
			this.selection.nodes.add(node.id);
		}
		
		this.selection.lastSelected = node.id;
		
		// Trigger callback
		const nodeEvent: NodeEvent = {
			type: 'node',
			target: node,
			originalEvent: event.originalEvent,
			position: event.position,
			renderedPosition: event.renderedPosition
		};
		
		this.props.onNodeClick?.(nodeEvent);
		this.props.onNodeSelect?.(this.getSelectedNodes());
	}
	
	private handleNodeHover(nodeData: any, event: any) {
		const node: GraphNode = nodeData;
		
		const nodeEvent: NodeEvent = {
			type: 'node',
			target: node,
			originalEvent: event.originalEvent,
			position: event.position,
			renderedPosition: event.renderedPosition
		};
		
		this.props.onNodeHover?.(nodeEvent);
	}
	
	private handleEdgeClick(edgeData: any, event: any) {
		const edge: GraphEdge = edgeData;
		
		// Update selection
		if (this.selection.selectionMode === 'single') {
			this.selection.nodes.clear();
			this.selection.edges.clear();
		}
		
		if (this.selection.edges.has(edge.id)) {
			this.selection.edges.delete(edge.id);
		} else {
			this.selection.edges.add(edge.id);
		}
		
		// Trigger callback
		const edgeEvent: EdgeEvent = {
			type: 'edge',
			target: edge,
			originalEvent: event.originalEvent,
			position: event.position,
			renderedPosition: event.renderedPosition
		};
		
		this.props.onEdgeClick?.(edgeEvent);
		this.props.onEdgeSelect?.(this.getSelectedEdges());
	}
	
	private updateViewportState() {
		if (!this.cy) return;
		
		this.viewport = {
			zoom: this.cy.zoom(),
			pan: this.cy.pan(),
			fit: false
		};
		
		this.props.onViewportChange?.(this.viewport);
	}
	
	// Public methods
	setGraphData(data: GraphData) {
		const validation = validateGraphData(data);
		if (validation.success && validation.data) {
			this.graphData = validation.data;
			this.error = null;
			this.props.onDataChange?.(validation.data);
		} else {
			this.error = validation.message || 'Invalid graph data';
		}
	}
	
	setLayout(layout: LayoutConfig) {
		const validation = validateLayoutConfig(layout);
		if (validation.success && validation.data) {
			this.layout = validation.data;
			this.runLayout();
		}
	}
	
	runLayout() {
		if (!this.cy) return;
		
		this.isLayoutRunning = true;
		const layoutOptions = {
			...this.layout,
			stop: () => {
				this.isLayoutRunning = false;
				this.props.onLayoutComplete?.();
			}
		};
		
		this.cy.layout(layoutOptions).run();
	}
	
	fitToView() {
		if (!this.cy) return;
		this.cy.fit();
		this.viewport.fit = true;
	}
	
	zoomIn() {
		if (!this.cy) return;
		this.cy.zoom(this.cy.zoom() * 1.2);
	}
	
	zoomOut() {
		if (!this.cy) return;
		this.cy.zoom(this.cy.zoom() * 0.8);
	}
	
	resetZoom() {
		if (!this.cy) return;
		this.cy.zoom(1);
		this.cy.center();
	}
	
	// Selection methods
	selectAll() {
		this.selection.nodes = new Set(this.graphData.nodes.map(n => n.id));
		this.selection.edges = new Set(this.graphData.edges.map(e => e.id));
		this.props.onNodeSelect?.(this.getSelectedNodes());
		this.props.onEdgeSelect?.(this.getSelectedEdges());
	}
	
	clearSelection() {
		this.selection.nodes.clear();
		this.selection.edges.clear();
		this.props.onNodeSelect?.([]);
		this.props.onEdgeSelect?.([]);
	}
	
	getSelectedNodes(): GraphNode[] {
		return this.graphData.nodes.filter(n => this.selection.nodes.has(n.id));
	}
	
	getSelectedEdges(): GraphEdge[] {
		return this.graphData.edges.filter(e => this.selection.edges.has(e.id));
	}
	
	// Search methods
	search(query: string) {
		this.searchConfig.query = query;
		
		if (!query.trim()) {
			this.clearHighlights();
			this.props.onSearch?.(query, []);
			return;
		}
		
		const results = this.performSearch(query);
		this.highlightSearchResults(results);
		this.props.onSearch?.(query, results);
	}
	
	private performSearch(query: string): GraphNode[] {
		const { searchFields, caseSensitive, useRegex } = this.searchConfig;
		const searchTerm = caseSensitive ? query : query.toLowerCase();
		
		return this.graphData.nodes.filter(node => {
			return searchFields.some(field => {
				let value = '';
				
				switch (field) {
					case 'label':
						value = node.label;
						break;
					case 'type':
						value = node.type || '';
						break;
					case 'category':
						value = node.category || '';
						break;
					case 'data':
						value = JSON.stringify(node.data || {});
						break;
				}
				
				if (!caseSensitive) {
					value = value.toLowerCase();
				}
				
				if (useRegex) {
					try {
						const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
						return regex.test(value);
					} catch {
						return false;
					}
				}
				
				return value.includes(searchTerm);
			});
		});
	}
	
	private highlightSearchResults(results: GraphNode[]) {
		if (!this.cy) return;
		
		// Clear previous highlights
		this.cy.elements().removeClass('search-highlight');
		
		if (this.searchConfig.highlightResults && results.length > 0) {
			const nodeIds = results.map(n => n.id);
			nodeIds.forEach(id => {
				this.cy.getElementById(id).addClass('search-highlight');
			});
		}
	}
	
	private clearHighlights() {
		if (!this.cy) return;
		this.cy.elements().removeClass('search-highlight');
	}
	
	// Filter methods
	applyFilter(filter: FilterConfig) {
		this.filterConfig = filter;
		this.updateVisibility();
		this.props.onFilter?.(filter);
	}
	
	private updateVisibility() {
		if (!this.cy) return;
		
		// Show all elements first
		this.cy.elements().show();
		
		const { nodeTypes, edgeTypes, categories, minConnections, maxConnections, showIsolated } = this.filterConfig;
		
		// Filter nodes
		this.cy.nodes().forEach((node: any) => {
			const data = node.data();
			let visible = true;
			
			// Filter by type
			if (nodeTypes.length > 0 && !nodeTypes.includes(data.type)) {
				visible = false;
			}
			
			// Filter by category
			if (categories.length > 0 && !categories.includes(data.category)) {
				visible = false;
			}
			
			// Filter by connections
			const degree = node.degree();
			if (minConnections !== undefined && degree < minConnections) {
				visible = false;
			}
			if (maxConnections !== undefined && degree > maxConnections) {
				visible = false;
			}
			
			// Filter isolated nodes
			if (!showIsolated && degree === 0) {
				visible = false;
			}
			
			if (!visible) {
				node.hide();
			}
		});
		
		// Filter edges
		this.cy.edges().forEach((edge: any) => {
			const data = edge.data();
			let visible = true;
			
			// Filter by type
			if (edgeTypes.length > 0 && !edgeTypes.includes(data.type)) {
				visible = false;
			}
			
			// Hide edges connected to hidden nodes
			if (edge.source().hidden() || edge.target().hidden()) {
				visible = false;
			}
			
			if (!visible) {
				edge.hide();
			}
		});
	}
	
	// Export methods
	exportGraph(options: ExportOptions) {
		if (!this.cy) return;
		
		this.props.onExport?.(options);
		
		switch (options.format) {
			case 'json':
				this.exportAsJSON(options);
				break;
			case 'png':
			case 'jpg':
				this.exportAsImage(options);
				break;
			case 'svg':
				this.exportAsSVG(options);
				break;
		}
	}
	
	private exportAsJSON(options: ExportOptions) {
		const data = options.includeMetadata ? this.graphData : {
			nodes: this.graphData.nodes,
			edges: this.graphData.edges
		};
		
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		this.downloadBlob(blob, options.filename || 'graph.json');
	}
	
	private exportAsImage(options: ExportOptions) {
		if (!this.cy) return;
		
		const imageOptions = {
			output: 'blob',
			format: options.format,
			quality: options.quality,
			maxWidth: options.width,
			maxHeight: options.height,
			bg: options.background
		};
		
		const blob = this.cy.png(imageOptions);
		this.downloadBlob(blob, options.filename || `graph.${options.format}`);
	}
	
	private exportAsSVG(options: ExportOptions) {
		if (!this.cy) return;
		
		const svgContent = this.cy.svg({
			scale: 1,
			full: true,
			bg: options.background
		});
		
		const blob = new Blob([svgContent], { type: 'image/svg+xml' });
		this.downloadBlob(blob, options.filename || 'graph.svg');
	}
	
	private downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	
	// Computed properties
	get nodeCount() {
		return this.graphData.nodes.length;
	}
	
	get edgeCount() {
		return this.graphData.edges.length;
	}
	
	get selectedNodeCount() {
		return this.selection.nodes.size;
	}
	
	get selectedEdgeCount() {
		return this.selection.edges.size;
	}
	
	get hasData() {
		return this.graphData.nodes.length > 0;
	}
	
	get isReady() {
		return this.hasData && !this.isLoading && !this.error;
	}
	
	// Cleanup
	destroy() {
		if (this.cy) {
			this.cy.destroy();
			this.cy = null;
		}
	}
}
