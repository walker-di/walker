// Reexport your entry components here
export { default as ChatView } from './components/chat-view/chat-view.svelte';

// Re-export specific UI components to avoid conflicts
export { Button, buttonVariants } from './components/ui/button/index.js';
export { Textarea } from './components/ui/textarea/index.js';
export { ScrollArea } from './components/ui/scroll-area/index.js';
export { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar/index.js';
export { Badge, badgeVariants } from './components/ui/badge/index.js';
