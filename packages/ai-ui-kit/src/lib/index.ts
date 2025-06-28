// Reexport your entry components here
export { default as ChatView } from './components/chat-view/chat-view.svelte';
export { default as KanbanView } from './components/kanban-view/kanban-view.svelte';

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
