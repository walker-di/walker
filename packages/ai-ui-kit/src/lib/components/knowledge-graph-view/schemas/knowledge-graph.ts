/**
 * Knowledge Graph Schemas
 * 
 * This file contains Zod schemas for runtime validation of knowledge graph data.
 * These schemas ensure type safety and data integrity at runtime.
 */

import { z } from 'zod';

// Core graph element schemas
export const GraphNodeSchema = z.object({
	id: z.string().min(1, 'Node ID cannot be empty'),
	label: z.string().min(1, 'Node label cannot be empty'),
	type: z.string().optional(),
	category: z.string().optional(),
	size: z.number().positive().optional(),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^[a-zA-Z]+$/).optional(),
	position: z.object({
		x: z.number(),
		y: z.number()
	}).optional(),
	data: z.record(z.any()).optional(),
	classes: z.array(z.string()).optional(),
	selected: z.boolean().default(false),
	highlighted: z.boolean().default(false)
});

export const GraphEdgeSchema = z.object({
	id: z.string().min(1, 'Edge ID cannot be empty'),
	source: z.string().min(1, 'Edge source cannot be empty'),
	target: z.string().min(1, 'Edge target cannot be empty'),
	label: z.string().optional(),
	type: z.string().optional(),
	weight: z.number().positive().optional(),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^[a-zA-Z]+$/).optional(),
	width: z.number().positive().optional(),
	data: z.record(z.any()).optional(),
	classes: z.array(z.string()).optional(),
	selected: z.boolean().default(false),
	highlighted: z.boolean().default(false)
});

// Graph data schema
export const GraphDataSchema = z.object({
	nodes: z.array(GraphNodeSchema).min(1, 'Graph must have at least one node'),
	edges: z.array(GraphEdgeSchema).default([]),
	metadata: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		version: z.string().optional(),
		created: z.date().optional(),
		modified: z.date().optional(),
		author: z.string().optional(),
		tags: z.array(z.string()).optional()
	}).optional()
});

// Layout configuration schema
export const LayoutConfigSchema = z.object({
	name: z.enum(['cose', 'cose-bilkent', 'dagre', 'cola', 'fcose', 'grid', 'circle', 'concentric', 'breadthfirst', 'random']).default('cose'),
	animate: z.boolean().default(true),
	animationDuration: z.number().positive().default(1000),
	fit: z.boolean().default(true),
	padding: z.number().nonnegative().default(30),
	spacingFactor: z.number().positive().default(1),
	nodeRepulsion: z.number().positive().optional(),
	nodeOverlap: z.number().nonnegative().optional(),
	idealEdgeLength: z.number().positive().optional(),
	edgeElasticity: z.number().positive().optional(),
	nestingFactor: z.number().positive().optional(),
	gravity: z.number().optional(),
	numIter: z.number().positive().optional(),
	initialTemp: z.number().positive().optional(),
	coolingFactor: z.number().positive().optional(),
	minTemp: z.number().positive().optional(),
	randomize: z.boolean().default(false),
	componentSpacing: z.number().nonnegative().optional(),
	nodeSpacing: z.number().nonnegative().optional(),
	directed: z.boolean().default(false),
	roots: z.array(z.string()).optional(),
	maxSimulationTime: z.number().positive().optional()
});

// Category and clustering schemas
export const GraphCategorySchema = z.object({
	id: z.string().min(1, 'Category ID cannot be empty'),
	name: z.string().min(1, 'Category name cannot be empty'),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^[a-zA-Z]+$/),
	visible: z.boolean().default(true),
	nodeCount: z.number().nonnegative().optional(),
	description: z.string().optional()
});

export const ClusterConfigSchema = z.object({
	enabled: z.boolean().default(false),
	algorithm: z.enum(['markov', 'hierarchical', 'k-means']).default('markov'),
	resolution: z.number().positive().default(1),
	minClusterSize: z.number().positive().default(2),
	maxClusters: z.number().positive().optional()
});

// Search and filtering schemas
export const SearchConfigSchema = z.object({
	query: z.string().default(''),
	searchFields: z.array(z.enum(['label', 'type', 'category', 'data'])).default(['label']),
	caseSensitive: z.boolean().default(false),
	useRegex: z.boolean().default(false),
	highlightResults: z.boolean().default(true)
});

export const FilterConfigSchema = z.object({
	nodeTypes: z.array(z.string()).default([]),
	edgeTypes: z.array(z.string()).default([]),
	categories: z.array(z.string()).default([]),
	minConnections: z.number().nonnegative().optional(),
	maxConnections: z.number().nonnegative().optional(),
	showIsolated: z.boolean().default(true)
});

// Export options schema
export const ExportOptionsSchema = z.object({
	format: z.enum(['json', 'png', 'jpg', 'svg']).default('json'),
	filename: z.string().optional(),
	quality: z.number().min(0).max(1).default(1),
	width: z.number().positive().optional(),
	height: z.number().positive().optional(),
	background: z.string().default('#ffffff'),
	includeMetadata: z.boolean().default(true)
});

// Component props schema
export const KnowledgeGraphViewPropsSchema = z.object({
	// Data
	data: GraphDataSchema.optional(),
	
	// Layout and appearance
	layout: LayoutConfigSchema.default({}),
	width: z.union([z.string(), z.number()]).default('100%'),
	height: z.union([z.string(), z.number()]).default('600px'),
	backgroundColor: z.string().default('#ffffff'),
	
	// Categories and clustering
	categories: z.array(GraphCategorySchema).default([]),
	enableClustering: z.boolean().default(false),
	clusterConfig: ClusterConfigSchema.default({}),
	
	// Interaction
	enablePan: z.boolean().default(true),
	enableZoom: z.boolean().default(true),
	enableSelection: z.boolean().default(true),
	selectionMode: z.enum(['single', 'multiple', 'additive']).default('single'),
	enableDrag: z.boolean().default(true),
	
	// Features
	enableSearch: z.boolean().default(true),
	enableFiltering: z.boolean().default(true),
	enableExport: z.boolean().default(true),
	enableMinimap: z.boolean().default(false),
	enableContextMenu: z.boolean().default(true),
	
	// UI elements
	showControls: z.boolean().default(true),
	showLegend: z.boolean().default(true),
	showStats: z.boolean().default(false),
	showToolbar: z.boolean().default(true),
	
	// Accessibility
	ariaLabel: z.string().default('Knowledge Graph'),
	ariaDescription: z.string().optional()
});

// Infer types from schemas
export type GraphNode = z.infer<typeof GraphNodeSchema>;
export type GraphEdge = z.infer<typeof GraphEdgeSchema>;
export type GraphData = z.infer<typeof GraphDataSchema>;
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;
export type GraphCategory = z.infer<typeof GraphCategorySchema>;
export type ClusterConfig = z.infer<typeof ClusterConfigSchema>;
export type SearchConfig = z.infer<typeof SearchConfigSchema>;
export type FilterConfig = z.infer<typeof FilterConfigSchema>;
export type ExportOptions = z.infer<typeof ExportOptionsSchema>;
export type KnowledgeGraphViewProps = z.infer<typeof KnowledgeGraphViewPropsSchema>;
