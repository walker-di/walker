/**
 * Knowledge Graph Types
 * 
 * This file contains TypeScript interfaces for the knowledge graph component.
 * These types define the structure for nodes, edges, layouts, and component props.
 */

// Core graph element types
export interface GraphNode {
	id: string;
	label: string;
	type?: string;
	category?: string;
	size?: number;
	color?: string;
	position?: {
		x: number;
		y: number;
	};
	data?: Record<string, any>;
	classes?: string[];
	selected?: boolean;
	highlighted?: boolean;
}

export interface GraphEdge {
	id: string;
	source: string;
	target: string;
	label?: string;
	type?: string;
	weight?: number;
	color?: string;
	width?: number;
	data?: Record<string, any>;
	classes?: string[];
	selected?: boolean;
	highlighted?: boolean;
}

// Graph data structure
export interface GraphData {
	nodes: GraphNode[];
	edges: GraphEdge[];
	metadata?: {
		title?: string;
		description?: string;
		version?: string;
		created?: Date;
		modified?: Date;
		author?: string;
		tags?: string[];
	};
}

// Layout configuration
export interface LayoutConfig {
	name: 'cose' | 'cose-bilkent' | 'dagre' | 'cola' | 'fcose' | 'grid' | 'circle' | 'concentric' | 'breadthfirst' | 'random';
	animate?: boolean;
	animationDuration?: number;
	fit?: boolean;
	padding?: number;
	spacingFactor?: number;
	nodeRepulsion?: number;
	nodeOverlap?: number;
	idealEdgeLength?: number;
	edgeElasticity?: number;
	nestingFactor?: number;
	gravity?: number;
	numIter?: number;
	initialTemp?: number;
	coolingFactor?: number;
	minTemp?: number;
	randomize?: boolean;
	componentSpacing?: number;
	nodeSpacing?: number;
	directed?: boolean;
	roots?: string[];
	maxSimulationTime?: number;
}

// Category and clustering
export interface GraphCategory {
	id: string;
	name: string;
	color: string;
	visible: boolean;
	nodeCount?: number;
	description?: string;
}

export interface ClusterConfig {
	enabled: boolean;
	algorithm?: 'markov' | 'hierarchical' | 'k-means';
	resolution?: number;
	minClusterSize?: number;
	maxClusters?: number;
}

// Interaction and selection
export interface SelectionState {
	nodes: Set<string>;
	edges: Set<string>;
	lastSelected?: string;
	selectionMode: 'single' | 'multiple' | 'additive';
}

export interface ViewportState {
	zoom: number;
	pan: {
		x: number;
		y: number;
	};
	fit: boolean;
}

// Search and filtering
export interface SearchConfig {
	query: string;
	searchFields: ('label' | 'type' | 'category' | 'data')[];
	caseSensitive: boolean;
	useRegex: boolean;
	highlightResults: boolean;
}

export interface FilterConfig {
	nodeTypes: string[];
	edgeTypes: string[];
	categories: string[];
	minConnections?: number;
	maxConnections?: number;
	showIsolated: boolean;
}

// Export options
export interface ExportOptions {
	format: 'json' | 'png' | 'jpg' | 'svg';
	filename?: string;
	quality?: number;
	width?: number;
	height?: number;
	background?: string;
	includeMetadata?: boolean;
}

// Event types
export interface GraphEvent {
	type: 'node' | 'edge' | 'background';
	target?: GraphNode | GraphEdge;
	originalEvent?: Event;
	position?: {
		x: number;
		y: number;
	};
	renderedPosition?: {
		x: number;
		y: number;
	};
}

export interface NodeEvent extends GraphEvent {
	type: 'node';
	target: GraphNode;
}

export interface EdgeEvent extends GraphEvent {
	type: 'edge';
	target: GraphEdge;
}

// Component props interface
export interface KnowledgeGraphViewProps {
	// Data
	data?: GraphData;
	
	// Layout and appearance
	layout?: LayoutConfig;
	width?: string | number;
	height?: string | number;
	backgroundColor?: string;
	
	// Categories and clustering
	categories?: GraphCategory[];
	enableClustering?: boolean;
	clusterConfig?: ClusterConfig;
	
	// Interaction
	enablePan?: boolean;
	enableZoom?: boolean;
	enableSelection?: boolean;
	selectionMode?: 'single' | 'multiple' | 'additive';
	enableDrag?: boolean;
	
	// Features
	enableSearch?: boolean;
	enableFiltering?: boolean;
	enableExport?: boolean;
	enableMinimap?: boolean;
	enableContextMenu?: boolean;
	
	// UI elements
	showControls?: boolean;
	showLegend?: boolean;
	showStats?: boolean;
	showToolbar?: boolean;
	
	// Accessibility
	ariaLabel?: string;
	ariaDescription?: string;
	
	// Event handlers
	onNodeClick?: (event: NodeEvent) => void;
	onNodeDoubleClick?: (event: NodeEvent) => void;
	onNodeHover?: (event: NodeEvent) => void;
	onNodeSelect?: (nodes: GraphNode[]) => void;
	onEdgeClick?: (event: EdgeEvent) => void;
	onEdgeSelect?: (edges: GraphEdge[]) => void;
	onLayoutComplete?: () => void;
	onViewportChange?: (viewport: ViewportState) => void;
	onSearch?: (query: string, results: GraphNode[]) => void;
	onFilter?: (filter: FilterConfig) => void;
	onExport?: (options: ExportOptions) => void;
	onDataChange?: (data: GraphData) => void;
}
