// Reexport your entry components here
export { default as ChatView } from './components/chat-view/chat-view.svelte';

// Chat view sub-components
export { default as FileUpload } from './components/chat-view/components/file-upload.svelte';
export { default as ImagePreview } from './components/chat-view/components/image-preview.svelte';
export { default as DocumentPreview } from './components/chat-view/components/document-preview.svelte';
export { default as CodeCanvas } from './components/chat-view/components/code-canvas.svelte';
export { default as TypingIndicator } from './components/chat-view/components/typing-indicator.svelte';
export { default as MessageThread } from './components/chat-view/components/message-thread.svelte';
export { default as ConversationManager } from './components/chat-view/components/conversation-manager.svelte';

// Re-export specific UI components to avoid conflicts
export { Button, buttonVariants } from './components/ui/button/index.js';
export { Textarea } from './components/ui/textarea/index.js';
export { ScrollArea } from './components/ui/scroll-area/index.js';
export { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar/index.js';
export { Badge, badgeVariants } from './components/ui/badge/index.js';
export { Progress } from './components/ui/progress/index.js';
