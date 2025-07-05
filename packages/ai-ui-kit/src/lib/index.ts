// Reexport your entry components here
export { default as ChatView } from './components/chat-view/chat-view.svelte';
export { default as KanbanView } from './components/kanban-view/kanban-view.svelte';
export { default as KnowledgeGraphView } from './components/knowledge-graph-view/knowledge-graph-view.svelte';
export { default as CanvasView } from './components/canvas-view/canvas-view.svelte';
export { default as BacklogView } from './components/backlog-view/backlog-view.svelte';

// Chat view sub-components
export { default as FileUpload } from './components/chat-view/components/file-upload.svelte';
export { default as ImagePreview } from './components/chat-view/components/image-preview.svelte';
export { default as DocumentPreview } from './components/chat-view/components/document-preview.svelte';
export { default as CodeCanvas } from './components/chat-view/components/code-canvas.svelte';
export { default as TypingIndicator } from './components/chat-view/components/typing-indicator.svelte';
export { default as MessageThread } from './components/chat-view/components/message-thread.svelte';
export { default as ConversationManager } from './components/chat-view/components/conversation-manager.svelte';

// Kanban view sub-components
export { default as KanbanCard } from './components/kanban-view/components/kanban-card.svelte';
export { default as KanbanColumn } from './components/kanban-view/components/kanban-column.svelte';

// Knowledge graph view sub-components
export { default as GraphControls } from './components/knowledge-graph-view/components/graph-controls.svelte';
export { default as GraphLegend } from './components/knowledge-graph-view/components/graph-legend.svelte';
export { default as GraphStats } from './components/knowledge-graph-view/components/graph-stats.svelte';
export { default as GraphToolbar } from './components/knowledge-graph-view/components/graph-toolbar.svelte';

// Canvas view sub-components
export { default as CanvasToolbar } from './components/canvas-view/components/canvas-toolbar.svelte';
export { default as CanvasHeader } from './components/canvas-view/components/canvas-header.svelte';
export { default as CanvasSidebar } from './components/canvas-view/components/canvas-sidebar.svelte';
export { default as CanvasSidebarNav } from './components/canvas-view/components/canvas-sidebar-nav.svelte';

// Backlog view sub-components
export { default as BacklogSidebar } from './components/backlog-view/components/backlog-sidebar.svelte';
export { default as EpicCard } from './components/backlog-view/components/epic-card.svelte';
export { default as StoryCard } from './components/backlog-view/components/story-card.svelte';
export { default as ReleaseSwimLane } from './components/backlog-view/components/release-swim-lane.svelte';
export { default as UnscheduledSwimLane } from './components/backlog-view/components/unscheduled-swim-lane.svelte';

// Re-export specific UI components to avoid conflicts
export { Button, buttonVariants } from './components/ui/button/index.js';
export { Textarea } from './components/ui/textarea/index.js';
export { ScrollArea } from './components/ui/scroll-area/index.js';
export { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar/index.js';
export { Badge, badgeVariants } from './components/ui/badge/index.js';
export { Progress } from './components/ui/progress/index.js';
export { Input } from './components/ui/input/index.js';

// Export types and schemas
export type {
  KanbanBoard,
  KanbanColumn,
  KanbanCard,
  KanbanCategory,
  KanbanViewProps,
  KanbanCardProps,
  KanbanColumnProps,
  DragEvent,
  DragPosition
} from './components/kanban-view/types/index.js';

export {
  KanbanBoardSchema,
  KanbanColumnSchema,
  KanbanCardSchema,
  KanbanCategorySchema,
  KanbanViewPropsSchema
} from './components/kanban-view/types/index.js';

// Knowledge graph types and schemas
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
} from './components/knowledge-graph-view/types/index.js';

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
} from './components/knowledge-graph-view/types/index.js';

// Canvas view types
export type {
  CanvasViewProps,
  CanvasToolProps,
  CanvasObject,
  CanvasLayer
} from './components/canvas-view/types/canvas.js';

// Backlog view types and schemas
export type {
  Epic,
  UserStory,
  Release,
  Sprint,
  BacklogBoard,
  BacklogViewProps,
  EpicCardProps,
  StoryCardProps,
  ReleaseSwimLaneProps,
  UnscheduledSwimLaneProps,
  Priority,
  Status,
  WorkItemType,
  DragEvent as BacklogDragEvent,
  DragPosition as BacklogDragPosition
} from './components/backlog-view/types/index.js';

export {
  EpicSchema,
  UserStorySchema,
  ReleaseSchema,
  SprintSchema,
  BacklogBoardSchema,
  BacklogViewPropsSchema,
  EpicFormSchema,
  StoryFormSchema,
  ReleaseFormSchema,
  SprintFormSchema
} from './components/backlog-view/schemas/backlog.js';
