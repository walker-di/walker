import { z } from 'zod';
import {
	ChatMessageSchema,
	ContentPartSchema,
	ChatParticipantSchema,
	ConversationExportSchema,
	FileUploadSchema,
	FileValidationSchema,
	TypingIndicatorSchema,
	ConversationThreadSchema
} from '../schemas/chat.js';
import type {
	ChatMessage,
	ContentPart,
	ChatParticipant,
	ConversationExport,
	FileUpload,
	TypingIndicator,
	ConversationThread
} from '../schemas/chat.js';

/**
 * Validation utilities using Zod schemas
 */

// Validation result type
export interface ValidationResult<T> {
	success: boolean;
	data?: T;
	errors?: string[];
}

// Generic validation function
function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
	try {
		const result = schema.safeParse(data);
		if (result.success) {
			return {
				success: true,
				data: result.data
			};
		} else {
			return {
				success: false,
				errors: result.error.issues.map(issue => 
					`${issue.path.join('.')}: ${issue.message}`
				)
			};
		}
	} catch (error) {
		return {
			success: false,
			errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`]
		};
	}
}

/**
 * Validate a chat message
 */
export function validateChatMessage(data: unknown): ValidationResult<ChatMessage> {
	return validateWithSchema(ChatMessageSchema, data);
}

/**
 * Validate content part
 */
export function validateContentPart(data: unknown): ValidationResult<ContentPart> {
	return validateWithSchema(ContentPartSchema, data);
}

/**
 * Validate chat participant
 */
export function validateChatParticipant(data: unknown): ValidationResult<ChatParticipant> {
	return validateWithSchema(ChatParticipantSchema, data);
}

/**
 * Validate conversation export data
 */
export function validateConversationExport(data: unknown): ValidationResult<ConversationExport> {
	return validateWithSchema(ConversationExportSchema, data);
}

/**
 * Validate file upload
 */
export function validateFileUpload(data: unknown): ValidationResult<FileUpload> {
	return validateWithSchema(FileUploadSchema, data);
}

/**
 * Validate typing indicator
 */
export function validateTypingIndicator(data: unknown): ValidationResult<TypingIndicator> {
	return validateWithSchema(TypingIndicatorSchema, data);
}

/**
 * Validate conversation thread
 */
export function validateConversationThread(data: unknown): ValidationResult<ConversationThread> {
	return validateWithSchema(ConversationThreadSchema, data);
}

/**
 * Validate file against constraints
 */
export function validateFile(file: File, maxSize: number, allowedTypes: string[]): ValidationResult<File> {
	const result = validateWithSchema(FileValidationSchema, {
		file,
		maxSize,
		allowedTypes
	});
	
	if (result.success) {
		return {
			success: true,
			data: file
		};
	}
	
	return result;
}

/**
 * Validate array of messages
 */
export function validateMessages(data: unknown): ValidationResult<ChatMessage[]> {
	return validateWithSchema(z.array(ChatMessageSchema), data);
}

/**
 * Validate array of participants
 */
export function validateParticipants(data: unknown): ValidationResult<ChatParticipant[]> {
	return validateWithSchema(z.array(ChatParticipantSchema), data);
}

/**
 * Parse and validate JSON string
 */
export function parseAndValidateJSON<T>(
	jsonString: string,
	schema: z.ZodSchema<T>
): ValidationResult<T> {
	try {
		const parsed = JSON.parse(jsonString);
		return validateWithSchema(schema, parsed);
	} catch (error) {
		return {
			success: false,
			errors: [`Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`]
		};
	}
}

/**
 * Validate conversation export from JSON string
 */
export function validateConversationExportFromJSON(jsonString: string): ValidationResult<ConversationExport> {
	return parseAndValidateJSON(jsonString, ConversationExportSchema);
}

/**
 * Safe message creation with validation
 */
export function createValidatedMessage(data: {
	id: string;
	role: 'user' | 'assistant';
	content: string | ContentPart[];
	timestamp?: Date;
	thread_id?: string;
	parent_id?: string;
}): ValidationResult<ChatMessage> {
	return validateChatMessage(data);
}

/**
 * Safe content part creation with validation
 */
export function createValidatedContentPart(data: unknown): ValidationResult<ContentPart> {
	return validateContentPart(data);
}

/**
 * Validate and sanitize user input
 */
export function sanitizeAndValidateUserInput(input: string): ValidationResult<string> {
	// Basic sanitization
	const sanitized = input.trim();
	
	if (sanitized.length === 0) {
		return {
			success: false,
			errors: ['Input cannot be empty']
		};
	}
	
	if (sanitized.length > 10000) {
		return {
			success: false,
			errors: ['Input is too long (maximum 10,000 characters)']
		};
	}
	
	return {
		success: true,
		data: sanitized
	};
}

/**
 * Validate file upload constraints
 */
export function validateFileConstraints(
	file: File,
	maxSize: number = 10 * 1024 * 1024, // 10MB default
	allowedTypes: string[] = ['image/*', 'video/*', 'audio/*', 'text/*', '.pdf']
): ValidationResult<File> {
	return validateFile(file, maxSize, allowedTypes);
}

/**
 * Batch validate multiple items
 */
export function batchValidate<T>(
	items: unknown[],
	schema: z.ZodSchema<T>
): { valid: T[]; invalid: { index: number; errors: string[] }[] } {
	const valid: T[] = [];
	const invalid: { index: number; errors: string[] }[] = [];
	
	items.forEach((item, index) => {
		const result = validateWithSchema(schema, item);
		if (result.success && result.data) {
			valid.push(result.data);
		} else {
			invalid.push({
				index,
				errors: result.errors || ['Unknown validation error']
			});
		}
	});
	
	return { valid, invalid };
}

/**
 * Type guards using Zod validation
 */
export function isChatMessage(data: unknown): data is ChatMessage {
	return validateChatMessage(data).success;
}

export function isContentPart(data: unknown): data is ContentPart {
	return validateContentPart(data).success;
}

export function isChatParticipant(data: unknown): data is ChatParticipant {
	return validateChatParticipant(data).success;
}

export function isConversationExport(data: unknown): data is ConversationExport {
	return validateConversationExport(data).success;
}

/**
 * Error formatting utilities
 */
export function formatValidationErrors(errors: string[]): string {
	if (errors.length === 1) {
		return errors[0];
	}
	
	return `Multiple validation errors:\n${errors.map(error => `• ${error}`).join('\n')}`;
}

export function getValidationErrorSummary(errors: string[]): string {
	const errorCount = errors.length;
	if (errorCount === 0) return 'No errors';
	if (errorCount === 1) return '1 validation error';
	return `${errorCount} validation errors`;
}
