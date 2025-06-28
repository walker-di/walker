/**
 * Content part types for multi-modal messages
 */
export interface TextPart {
	type: "text";
	text: string;
	format?: "markdown" | "plain";
}

export interface ImagePart {
	type: "image";
	source: {
		base64?: string;
		url?: string;
		file_id?: string;
	};
	media_type: string;
	alt_text?: string;
}

export interface VideoPart {
	type: "video";
	source: {
		base64?: string;
		url?: string;
		file_id?: string;
	};
	media_type: string;
	duration?: number;
}

export interface AudioPart {
	type: "audio";
	source: {
		base64?: string;
		url?: string;
		file_id?: string;
	};
	media_type: string;
	duration?: number;
}

export interface FilePart {
	type: "file";
	source: {
		base64?: string;
		url?: string;
		file_id?: string;
	};
	media_type: string;
	filename: string;
	size?: number;
}

export interface CodePart {
	type: "code";
	code: string;
	language: string;
	filename?: string;
	editable?: boolean;
}

export type ContentPart = TextPart | ImagePart | VideoPart | AudioPart | FilePart | CodePart;

/**
 * Represents a single chat message with multi-modal content support
 */
export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string | ContentPart[];
	timestamp?: Date;
	thread_id?: string;
	parent_id?: string;
	metadata?: {
		model?: string;
		tokens?: number;
		processing_time?: number;
		[key: string]: any;
	};
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
	lastSeen?: Date;
	status?: "online" | "away" | "busy" | "offline";
}

/**
 * Conversation thread for organizing related messages
 */
export interface ConversationThread {
	id: string;
	title: string;
	created_at: Date;
	updated_at: Date;
	message_count: number;
	participants: string[];
}

/**
 * File upload state and metadata
 */
export interface FileUpload {
	id: string;
	file: File;
	status: "uploading" | "uploaded" | "error";
	progress: number;
	url?: string;
	file_id?: string;
	error?: string;
}

/**
 * Typing indicator state
 */
export interface TypingIndicator {
	participant_id: string;
	participant_name: string;
	timestamp: Date;
}

/**
 * Conversation export/import format
 */
export interface ConversationExport {
	version: string;
	conversation_id: string;
	title: string;
	created_at: Date;
	exported_at: Date;
	participants: ChatParticipant[];
	messages: ChatMessage[];
	threads?: ConversationThread[];
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
	threads?: ConversationThread[];
	activeThreadId?: string;
	typingIndicators?: TypingIndicator[];
	fileUploads?: FileUpload[];
	maxFileSize?: number;
	acceptedFileTypes?: string[];
	enableThreading?: boolean;
	enableFileUpload?: boolean;
	enableCodeCanvas?: boolean;
	enableExport?: boolean;

	// Avatar display options
	showUserAvatar?: boolean;
	showMemberAvatar?: boolean;

	// Message handlers
	onSendMessage?: (message: string | ContentPart[]) => void;
	onSendFiles?: (files: File[]) => void;
	onCopyMessage?: (messageId: string) => void;
	onThumbsUp?: (messageId: string) => void;
	onThumbsDown?: (messageId: string) => void;
	onPlayAudio?: (messageId: string) => void;
	onRegenerate?: (messageId: string) => void;
	onDownload?: (messageId: string) => void;

	// Threading handlers
	onCreateThread?: (messageId: string, title: string) => void;
	onSwitchThread?: (threadId: string) => void;
	onDeleteThread?: (threadId: string) => void;

	// File handlers
	onFileUpload?: (file: File) => Promise<FileUpload>;
	onFileRemove?: (fileId: string) => void;
	onFilePreview?: (fileId: string) => void;

	// Export/Import handlers
	onExportConversation?: () => void;
	onImportConversation?: (data: ConversationExport) => void;

	// Real-time handlers
	onTypingStart?: () => void;
	onTypingStop?: () => void;

	// UI handlers
	onToolsClick?: () => void;
	onCallClick?: () => void;
	onSearchClick?: () => void;
	onMoreClick?: () => void;
}
