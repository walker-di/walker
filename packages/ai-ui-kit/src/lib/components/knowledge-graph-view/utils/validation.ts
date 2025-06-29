/**
 * Knowledge Graph Validation Utilities
 * 
 * This file contains validation functions for knowledge graph data structures.
 * These utilities ensure data integrity and provide helpful error messages.
 */

import { z } from 'zod';
import {
	GraphNodeSchema,
	GraphEdgeSchema,
	GraphDataSchema,
	LayoutConfigSchema,
	GraphCategorySchema,
	ClusterConfigSchema,
	SearchConfigSchema,
	FilterConfigSchema,
	ExportOptionsSchema,
	KnowledgeGraphViewPropsSchema,
	type GraphNode,
	type GraphEdge,
	type GraphData,
	type LayoutConfig,
	type GraphCategory,
	type ClusterConfig,
	type SearchConfig,
	type FilterConfig,
	type ExportOptions,
	type KnowledgeGraphViewProps
} from '../schemas/knowledge-graph.js';

// Validation result type
export interface GraphValidationResult<T = any> {
	success: boolean;
	data?: T;
	error?: z.ZodError;
	message?: string;
}

// Individual validation functions
export function validateGraphNode(node: unknown): GraphValidationResult<GraphNode> {
	try {
		const validatedNode = GraphNodeSchema.parse(node);
		return { success: true, data: validatedNode };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid graph node: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for graph node'
		};
	}
}

export function validateGraphEdge(edge: unknown): GraphValidationResult<GraphEdge> {
	try {
		const validatedEdge = GraphEdgeSchema.parse(edge);
		return { success: true, data: validatedEdge };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid graph edge: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for graph edge'
		};
	}
}

export function validateGraphData(data: unknown): GraphValidationResult<GraphData> {
	try {
		const validatedData = GraphDataSchema.parse(data);
		
		// Additional validation: check edge references
		const nodeIds = new Set(validatedData.nodes.map(n => n.id));
		const invalidEdges = validatedData.edges.filter(
			e => !nodeIds.has(e.source) || !nodeIds.has(e.target)
		);
		
		if (invalidEdges.length > 0) {
			return {
				success: false,
				message: `Invalid edge references: ${invalidEdges.map(e => `${e.id} (${e.source} -> ${e.target})`).join(', ')}`
			};
		}
		
		return { success: true, data: validatedData };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid graph data: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for graph data'
		};
	}
}

export function validateLayoutConfig(config: unknown): GraphValidationResult<LayoutConfig> {
	try {
		const validatedConfig = LayoutConfigSchema.parse(config);
		return { success: true, data: validatedConfig };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid layout config: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for layout config'
		};
	}
}

export function validateGraphCategory(category: unknown): GraphValidationResult<GraphCategory> {
	try {
		const validatedCategory = GraphCategorySchema.parse(category);
		return { success: true, data: validatedCategory };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid graph category: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for graph category'
		};
	}
}

export function validateClusterConfig(config: unknown): GraphValidationResult<ClusterConfig> {
	try {
		const validatedConfig = ClusterConfigSchema.parse(config);
		return { success: true, data: validatedConfig };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid cluster config: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for cluster config'
		};
	}
}

export function validateSearchConfig(config: unknown): GraphValidationResult<SearchConfig> {
	try {
		const validatedConfig = SearchConfigSchema.parse(config);
		return { success: true, data: validatedConfig };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid search config: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for search config'
		};
	}
}

export function validateFilterConfig(config: unknown): GraphValidationResult<FilterConfig> {
	try {
		const validatedConfig = FilterConfigSchema.parse(config);
		return { success: true, data: validatedConfig };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid filter config: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for filter config'
		};
	}
}

export function validateExportOptions(options: unknown): GraphValidationResult<ExportOptions> {
	try {
		const validatedOptions = ExportOptionsSchema.parse(options);
		return { success: true, data: validatedOptions };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error,
				message: `Invalid export options: ${formatValidationErrors(error)}`
			};
		}
		return {
			success: false,
			message: 'Unknown validation error for export options'
		};
	}
}

// Factory functions for creating validated objects
export function createValidatedNode(nodeData: Partial<GraphNode>): GraphValidationResult<GraphNode> {
	const defaultNode: Partial<GraphNode> = {
		selected: false,
		highlighted: false,
		...nodeData
	};
	
	return validateGraphNode(defaultNode);
}

export function createValidatedEdge(edgeData: Partial<GraphEdge>): GraphValidationResult<GraphEdge> {
	const defaultEdge: Partial<GraphEdge> = {
		selected: false,
		highlighted: false,
		...edgeData
	};
	
	return validateGraphEdge(defaultEdge);
}

export function createValidatedGraphData(
	nodes: GraphNode[],
	edges: GraphEdge[] = [],
	metadata?: GraphData['metadata']
): GraphValidationResult<GraphData> {
	const graphData = {
		nodes,
		edges,
		metadata
	};
	
	return validateGraphData(graphData);
}

// Input sanitization
export function sanitizeAndValidateGraphInput(input: string): GraphValidationResult<GraphData> {
	try {
		const parsed = JSON.parse(input);
		return validateGraphData(parsed);
	} catch (error) {
		return {
			success: false,
			message: 'Invalid JSON input'
		};
	}
}

// Type guards
export function isGraphNode(obj: unknown): obj is GraphNode {
	return validateGraphNode(obj).success;
}

export function isGraphEdge(obj: unknown): obj is GraphEdge {
	return validateGraphEdge(obj).success;
}

export function isGraphData(obj: unknown): obj is GraphData {
	return validateGraphData(obj).success;
}

// Error formatting utilities
export function formatValidationErrors(error: z.ZodError): string {
	return error.errors
		.map(err => `${err.path.join('.')}: ${err.message}`)
		.join('; ');
}

export function getValidationErrorSummary(error: z.ZodError): string {
	const errorCount = error.errors.length;
	const firstError = error.errors[0];
	
	if (errorCount === 1) {
		return `${firstError.path.join('.')}: ${firstError.message}`;
	}
	
	return `${errorCount} validation errors (first: ${firstError.path.join('.')}: ${firstError.message})`;
}

// Batch validation
export function batchValidate<T>(
	items: unknown[],
	validator: (item: unknown) => GraphValidationResult<T>
): { valid: T[]; invalid: { item: unknown; error: string }[] } {
	const valid: T[] = [];
	const invalid: { item: unknown; error: string }[] = [];
	
	for (const item of items) {
		const result = validator(item);
		if (result.success && result.data) {
			valid.push(result.data);
		} else {
			invalid.push({
				item,
				error: result.message || 'Unknown validation error'
			});
		}
	}
	
	return { valid, invalid };
}
