/**
 * Represents a single chat message
 */
export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp?: Date;
}

/**
 * Represents a chat participant/user
 */
export interface ChatParticipant {
	id: string;
	name: string;
	avatar?: string;
	isOnline?: boolean;
	isTyping?: boolean;
}

/**
 * Props interface for the ChatView component
 */
export interface ChatViewProps {
	messages?: ChatMessage[];
	placeholder?: string;
	disabled?: boolean;
	showTools?: boolean;
	chatTitle?: string;
	participants?: ChatParticipant[];
	onSendMessage?: (message: string) => void;
	onCopyMessage?: (messageId: string) => void;
	onThumbsUp?: (messageId: string) => void;
	onThumbsDown?: (messageId: string) => void;
	onPlayAudio?: (messageId: string) => void;
	onRegenerate?: (messageId: string) => void;
	onDownload?: (messageId: string) => void;
	onToolsClick?: () => void;
	onCallClick?: () => void;
	onSearchClick?: () => void;
	onMoreClick?: () => void;
}
