import { z } from 'zod';

/**
 * Zod schemas for chat system with runtime validation
 */

// Base schemas for common types
const DateSchema = z.union([z.date(), z.string().datetime(), z.string().transform(str => new Date(str))]);
const UrlSchema = z.string().url();
const Base64Schema = z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/, 'Invalid base64 string');
const FileIdSchema = z.string().min(1);

// Source schema for media content
const MediaSourceSchema = z.object({
	base64: Base64Schema.optional(),
	url: UrlSchema.optional(),
	file_id: FileIdSchema.optional()
}).refine(
	(data) => data.base64 || data.url || data.file_id,
	{ message: 'At least one source (base64, url, or file_id) must be provided' }
);

// Content part schemas using discriminated union
const TextPartSchema = z.object({
	type: z.literal('text'),
	text: z.string().min(1, 'Text content cannot be empty'),
	format: z.enum(['markdown', 'plain']).default('markdown')
});

const ImagePartSchema = z.object({
	type: z.literal('image'),
	source: MediaSourceSchema,
	media_type: z.string().regex(/^image\//, 'Must be an image media type'),
	alt_text: z.string().optional()
});

const VideoPartSchema = z.object({
	type: z.literal('video'),
	source: MediaSourceSchema,
	media_type: z.string().regex(/^video\//, 'Must be a video media type'),
	duration: z.number().positive().optional()
});

const AudioPartSchema = z.object({
	type: z.literal('audio'),
	source: MediaSourceSchema,
	media_type: z.string().regex(/^audio\//, 'Must be an audio media type'),
	duration: z.number().positive().optional()
});

const FilePartSchema = z.object({
	type: z.literal('file'),
	source: MediaSourceSchema,
	media_type: z.string().min(1, 'Media type is required'),
	filename: z.string().min(1, 'Filename is required'),
	size: z.number().int().nonnegative().optional()
});

const CodePartSchema = z.object({
	type: z.literal('code'),
	code: z.string().min(1, 'Code content cannot be empty'),
	language: z.string().min(1, 'Programming language is required'),
	filename: z.string().optional(),
	editable: z.boolean().default(false)
});

// Discriminated union for all content parts
export const ContentPartSchema = z.discriminatedUnion('type', [
	TextPartSchema,
	ImagePartSchema,
	VideoPartSchema,
	AudioPartSchema,
	FilePartSchema,
	CodePartSchema
]);

// Chat participant schema
export const ChatParticipantSchema = z.object({
	id: z.string().min(1, 'Participant ID is required'),
	name: z.string().min(1, 'Participant name is required'),
	avatar: UrlSchema.optional(),
	isOnline: z.boolean().default(false),
	isTyping: z.boolean().default(false),
	lastSeen: DateSchema.optional(),
	status: z.enum(['online', 'away', 'busy', 'offline']).default('offline')
});

// Chat message schema
export const ChatMessageSchema = z.object({
	id: z.string().min(1, 'Message ID is required'),
	role: z.enum(['user', 'assistant'], { 
		errorMap: () => ({ message: 'Role must be either "user" or "assistant"' })
	}),
	content: z.union([
		z.string().min(1, 'Message content cannot be empty'),
		z.array(ContentPartSchema).min(1, 'Multi-modal content must have at least one part')
	]),
	timestamp: DateSchema.optional(),
	thread_id: z.string().optional(),
	parent_id: z.string().optional(),
	metadata: z.record(z.any()).optional()
});

// Conversation thread schema
export const ConversationThreadSchema = z.object({
	id: z.string().min(1, 'Thread ID is required'),
	title: z.string().min(1, 'Thread title is required'),
	created_at: DateSchema,
	updated_at: DateSchema,
	message_count: z.number().int().nonnegative(),
	participants: z.array(z.string()).min(1, 'Thread must have at least one participant')
});

// File upload schema
export const FileUploadSchema = z.object({
	id: z.string().min(1, 'Upload ID is required'),
	file: z.instanceof(File, { message: 'Must be a File object' }),
	status: z.enum(['uploading', 'uploaded', 'error']),
	progress: z.number().min(0).max(100),
	url: UrlSchema.optional(),
	file_id: FileIdSchema.optional(),
	error: z.string().optional()
});

// Typing indicator schema
export const TypingIndicatorSchema = z.object({
	participant_id: z.string().min(1, 'Participant ID is required'),
	participant_name: z.string().min(1, 'Participant name is required'),
	timestamp: DateSchema
});

// Conversation export schema
export const ConversationExportSchema = z.object({
	version: z.string().regex(/^\d+\.\d+$/, 'Version must be in format "x.y"'),
	conversation_id: z.string().min(1, 'Conversation ID is required'),
	title: z.string().min(1, 'Conversation title is required'),
	created_at: DateSchema,
	exported_at: DateSchema,
	participants: z.array(ChatParticipantSchema),
	messages: z.array(ChatMessageSchema),
	threads: z.array(ConversationThreadSchema).optional()
});

// Chat view props schema (for validation of component props)
export const ChatViewPropsSchema = z.object({
	messages: z.array(ChatMessageSchema).default([]),
	placeholder: z.string().default('Ask anything'),
	disabled: z.boolean().default(false),
	showTools: z.boolean().default(true),
	chatTitle: z.string().default('Chat'),
	participants: z.array(ChatParticipantSchema).default([]),
	threads: z.array(ConversationThreadSchema).default([]),
	activeThreadId: z.string().optional(),
	typingIndicators: z.array(TypingIndicatorSchema).default([]),
	fileUploads: z.array(FileUploadSchema).default([]),
	maxFileSize: z.number().int().positive().default(10 * 1024 * 1024), // 10MB
	acceptedFileTypes: z.array(z.string()).default(['image/*', 'video/*', 'audio/*', 'text/*', '.pdf']),
	enableThreading: z.boolean().default(false),
	enableFileUpload: z.boolean().default(true),
	enableCodeCanvas: z.boolean().default(true),
	enableExport: z.boolean().default(true)
});

// File validation schema
export const FileValidationSchema = z.object({
	file: z.instanceof(File),
	maxSize: z.number().int().positive(),
	allowedTypes: z.array(z.string())
}).refine(
	(data) => data.file.size <= data.maxSize,
	{ message: 'File size exceeds maximum allowed size' }
).refine(
	(data) => {
		if (data.allowedTypes.length === 0) return true;
		
		return data.allowedTypes.some(type => {
			if (type.startsWith('.')) {
				return data.file.name.toLowerCase().endsWith(type.toLowerCase());
			}
			if (type.includes('*')) {
				const baseType = type.split('/')[0];
				return data.file.type.startsWith(baseType);
			}
			return data.file.type === type;
		});
	},
	{ message: 'File type is not allowed' }
);

// Export type inference from schemas
export type ContentPart = z.infer<typeof ContentPartSchema>;
export type TextPart = z.infer<typeof TextPartSchema>;
export type ImagePart = z.infer<typeof ImagePartSchema>;
export type VideoPart = z.infer<typeof VideoPartSchema>;
export type AudioPart = z.infer<typeof AudioPartSchema>;
export type FilePart = z.infer<typeof FilePartSchema>;
export type CodePart = z.infer<typeof CodePartSchema>;
export type ChatParticipant = z.infer<typeof ChatParticipantSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ConversationThread = z.infer<typeof ConversationThreadSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type TypingIndicator = z.infer<typeof TypingIndicatorSchema>;
export type ConversationExport = z.infer<typeof ConversationExportSchema>;
export type ChatViewProps = z.infer<typeof ChatViewPropsSchema>;
