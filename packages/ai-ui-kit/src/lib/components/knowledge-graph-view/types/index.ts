// Export all knowledge graph types
export type {
	GraphNode,
	GraphEdge,
	GraphData,
	LayoutConfig,
	GraphCategory,
	ClusterConfig,
	SelectionState,
	ViewportState,
	SearchConfig,
	FilterConfig,
	ExportOptions,
	GraphEvent,
	NodeEvent,
	EdgeEvent,
	KnowledgeGraphViewProps
} from './knowledge-graph.js';

// Export schemas for runtime validation
export {
	GraphNodeSchema,
	GraphEdgeSchema,
	GraphDataSchema,
	LayoutConfigSchema,
	GraphCategorySchema,
	ClusterConfigSchema,
	SearchConfigSchema,
	FilterConfigSchema,
	ExportOptionsSchema,
	KnowledgeGraphViewPropsSchema
} from '../schemas/knowledge-graph.js';

// Export validation utilities
export {
	validateGraphNode,
	validateGraphEdge,
	validateGraphData,
	validateLayoutConfig,
	validateGraphCategory,
	validateClusterConfig,
	validateSearchConfig,
	validateFilterConfig,
	validateExportOptions,
	createValidatedNode,
	createValidatedEdge,
	createValidatedGraphData,
	sanitizeAndValidateGraphInput,
	isGraphNode,
	isGraphEdge,
	isGraphData,
	formatValidationErrors,
	getValidationErrorSummary,
	batchValidate,
	type GraphValidationResult
} from '../utils/validation.js';
