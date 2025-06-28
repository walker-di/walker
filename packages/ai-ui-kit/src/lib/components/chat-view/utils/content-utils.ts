import type { ContentPart, ChatMessage, FileUpload } from '../schemas/chat.js';
import { ContentPartSchema, ChatMessageSchema } from '../schemas/chat.js';
import { validateContentPart, validateChatMessage } from './validation.js';

/**
 * Utility functions for handling multi-modal content
 */

/**
 * Check if a message contains multi-modal content
 */
export function isMultiModalMessage(message: ChatMessage): boolean {
	return Array.isArray(message.content);
}

/**
 * Get text content from a message (handles both string and ContentPart[] formats)
 */
export function getMessageText(message: ChatMessage): string {
	if (typeof message.content === 'string') {
		return message.content;
	}
	
	return message.content
		.filter((part): part is Extract<ContentPart, { type: 'text' }> => part.type === 'text')
		.map(part => part.text)
		.join('\n');
}

/**
 * Get all content parts of a specific type from a message
 */
export function getContentPartsByType<T extends ContentPart['type']>(
	message: ChatMessage,
	type: T
): Extract<ContentPart, { type: T }>[] {
	if (typeof message.content === 'string') {
		return [];
	}
	
	return message.content.filter(
		(part): part is Extract<ContentPart, { type: T }> => part.type === type
	);
}

/**
 * Check if a message has content of a specific type
 */
export function hasContentType(message: ChatMessage, type: ContentPart['type']): boolean {
	return getContentPartsByType(message, type).length > 0;
}

/**
 * Convert a file to a ContentPart
 */
export async function fileToContentPart(file: File): Promise<ContentPart> {
	const base64 = await fileToBase64(file);
	
	if (file.type.startsWith('image/')) {
		return {
			type: 'image',
			source: { base64 },
			media_type: file.type,
			alt_text: file.name
		};
	} else if (file.type.startsWith('video/')) {
		return {
			type: 'video',
			source: { base64 },
			media_type: file.type
		};
	} else if (file.type.startsWith('audio/')) {
		return {
			type: 'audio',
			source: { base64 },
			media_type: file.type
		};
	} else {
		return {
			type: 'file',
			source: { base64 },
			media_type: file.type,
			filename: file.name,
			size: file.size
		};
	}
}

/**
 * Convert a file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			// Remove the data URL prefix (e.g., "data:image/png;base64,")
			const base64 = result.split(',')[1];
			resolve(base64);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Create a text content part
 */
export function createTextPart(text: string, format: 'markdown' | 'plain' = 'markdown'): ContentPart {
	return {
		type: 'text',
		text,
		format
	};
}

/**
 * Create a code content part
 */
export function createCodePart(
	code: string,
	language: string,
	filename?: string,
	editable = false
): ContentPart {
	return {
		type: 'code',
		code,
		language,
		filename,
		editable
	};
}

/**
 * Combine multiple content parts into a single message content
 */
export function combineContentParts(parts: ContentPart[]): ContentPart[] {
	// Merge consecutive text parts
	const combined: ContentPart[] = [];
	let currentTextPart: ContentPart | null = null;
	
	for (const part of parts) {
		if (part.type === 'text') {
			if (currentTextPart && currentTextPart.type === 'text') {
				// Merge with previous text part
				currentTextPart.text += '\n' + part.text;
			} else {
				currentTextPart = { ...part };
				combined.push(currentTextPart);
			}
		} else {
			currentTextPart = null;
			combined.push(part);
		}
	}
	
	return combined;
}

/**
 * Extract all media URLs from a message for preloading
 */
export function extractMediaUrls(message: ChatMessage): string[] {
	if (typeof message.content === 'string') {
		return [];
	}
	
	const urls: string[] = [];
	
	for (const part of message.content) {
		if ('source' in part && part.source.url) {
			urls.push(part.source.url);
		}
	}
	
	return urls;
}

/**
 * Calculate estimated message size in bytes
 */
export function estimateMessageSize(message: ChatMessage): number {
	let size = 0;
	
	if (typeof message.content === 'string') {
		size += new Blob([message.content]).size;
	} else {
		for (const part of message.content) {
			if (part.type === 'text') {
				size += new Blob([part.text]).size;
			} else if (part.type === 'code') {
				size += new Blob([part.code]).size;
			} else if ('source' in part && part.source.base64) {
				// Estimate base64 size (base64 is ~33% larger than original)
				size += (part.source.base64.length * 3) / 4;
			}
		}
	}
	
	return size;
}

/**
 * Validate content part structure using Zod
 */
export function validateContentPartStructure(part: unknown): part is ContentPart {
	const result = validateContentPart(part);
	return result.success;
}

/**
 * Validate and parse content part with detailed error information
 */
export function parseContentPart(part: unknown): { success: true; data: ContentPart } | { success: false; errors: string[] } {
	const result = validateContentPart(part);
	if (result.success && result.data) {
		return { success: true, data: result.data };
	}
	return { success: false, errors: result.errors || ['Unknown validation error'] };
}

/**
 * Validate chat message structure using Zod
 */
export function validateChatMessageStructure(message: unknown): message is ChatMessage {
	const result = validateChatMessage(message);
	return result.success;
}

/**
 * Convert FileUpload to ContentPart
 */
export function fileUploadToContentPart(upload: FileUpload): Promise<ContentPart> {
	return fileToContentPart(upload.file);
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
