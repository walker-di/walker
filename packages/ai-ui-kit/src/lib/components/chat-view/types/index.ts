// Legacy chat types (for backward compatibility)
export type {
	ChatMessage as LegacyChatMessage,
	ChatParticipant as LegacyChatParticipant,
	ChatViewProps as LegacyChatViewProps,
	ContentPart as LegacyContentPart,
	TextPart as LegacyTextPart,
	ImagePart as LegacyImagePart,
	VideoPart as LegacyVideoPart,
	AudioPart as LegacyAudioPart,
	FilePart as LegacyFilePart,
	CodePart as LegacyCodePart,
	ConversationThread as LegacyConversationThread,
	FileUpload as LegacyFileUpload,
	TypingIndicator as LegacyTypingIndicator,
	ConversationExport as LegacyConversationExport
} from './chat.js';

// New Zod-validated types (recommended for new code)
export type {
	ChatMessage,
	ChatParticipant,
	ChatViewProps,
	ContentPart,
	TextPart,
	ImagePart,
	VideoPart,
	AudioPart,
	FilePart,
	CodePart,
	ConversationThread,
	FileUpload,
	TypingIndicator,
	ConversationExport
} from '../schemas/chat.js';

// Export schemas for runtime validation
export {
	ChatMessageSchema,
	ChatParticipantSchema,
	ContentPartSchema,
	ConversationExportSchema,
	FileUploadSchema,
	TypingIndicatorSchema,
	ConversationThreadSchema,
	ChatViewPropsSchema
} from '../schemas/chat.js';

// Export validation utilities
export {
	validateChatMessage,
	validateContentPart,
	validateChatParticipant,
	validateConversationExport,
	validateFileUpload,
	validateTypingIndicator,
	validateConversationThread,
	validateFile,
	validateMessages,
	validateParticipants,
	parseAndValidateJSON,
	validateConversationExportFromJSON,
	createValidatedMessage,
	createValidatedContentPart,
	sanitizeAndValidateUserInput,
	validateFileConstraints,
	batchValidate,
	isChatMessage,
	isContentPart,
	isChatParticipant,
	isConversationExport,
	formatValidationErrors,
	getValidationErrorSummary,
	type ValidationResult
} from '../utils/validation.js';
