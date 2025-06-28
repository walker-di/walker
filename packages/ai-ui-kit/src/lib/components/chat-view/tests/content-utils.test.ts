import { describe, it, expect } from 'vitest';
import {
	isMultiModalMessage,
	getMessageText,
	getContentPartsByType,
	hasContentType,
	createTextPart,
	createCodePart,
	combineContentParts,
	extractMediaUrls,
	estimateMessageSize,
	validateContentPartStructure,
	formatFileSize
} from '../utils/content-utils.js';
import type { ChatMessage, ContentPart } from '../types/chat.js';

describe('Content Utils', () => {
	describe('isMultiModalMessage', () => {
		it('returns false for string content', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: 'Hello world'
			};
			expect(isMultiModalMessage(message)).toBe(false);
		});

		it('returns true for ContentPart array', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: [{ type: 'text', text: 'Hello world' }]
			};
			expect(isMultiModalMessage(message)).toBe(true);
		});
	});

	describe('getMessageText', () => {
		it('returns string content directly', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: 'Hello world'
			};
			expect(getMessageText(message)).toBe('Hello world');
		});

		it('extracts text from ContentPart array', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: [
					{ type: 'text', text: 'Hello' },
					{ type: 'text', text: 'world' }
				]
			};
			expect(getMessageText(message)).toBe('Hello\nworld');
		});

		it('ignores non-text content parts', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: [
					{ type: 'text', text: 'Hello' },
					{ 
						type: 'image', 
						source: { url: 'test.jpg' }, 
						media_type: 'image/jpeg' 
					},
					{ type: 'text', text: 'world' }
				]
			};
			expect(getMessageText(message)).toBe('Hello\nworld');
		});
	});

	describe('getContentPartsByType', () => {
		it('returns empty array for string content', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: 'Hello world'
			};
			expect(getContentPartsByType(message, 'text')).toEqual([]);
		});

		it('filters content parts by type', () => {
			const textPart = { type: 'text' as const, text: 'Hello' };
			const imagePart = { 
				type: 'image' as const, 
				source: { url: 'test.jpg' }, 
				media_type: 'image/jpeg' 
			};
			
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: [textPart, imagePart]
			};
			
			expect(getContentPartsByType(message, 'text')).toEqual([textPart]);
			expect(getContentPartsByType(message, 'image')).toEqual([imagePart]);
		});
	});

	describe('hasContentType', () => {
		it('returns false for string content', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: 'Hello world'
			};
			expect(hasContentType(message, 'image')).toBe(false);
		});

		it('returns true when content type exists', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: [
					{ type: 'text', text: 'Hello' },
					{ 
						type: 'image', 
						source: { url: 'test.jpg' }, 
						media_type: 'image/jpeg' 
					}
				]
			};
			expect(hasContentType(message, 'image')).toBe(true);
			expect(hasContentType(message, 'video')).toBe(false);
		});
	});

	describe('createTextPart', () => {
		it('creates text part with default format', () => {
			const part = createTextPart('Hello world');
			expect(part).toEqual({
				type: 'text',
				text: 'Hello world',
				format: 'markdown'
			});
		});

		it('creates text part with specified format', () => {
			const part = createTextPart('Hello world', 'plain');
			expect(part).toEqual({
				type: 'text',
				text: 'Hello world',
				format: 'plain'
			});
		});
	});

	describe('createCodePart', () => {
		it('creates code part with required fields', () => {
			const part = createCodePart('console.log("hello")', 'javascript');
			expect(part).toEqual({
				type: 'code',
				code: 'console.log("hello")',
				language: 'javascript',
				editable: false
			});
		});

		it('creates code part with all fields', () => {
			const part = createCodePart('console.log("hello")', 'javascript', 'hello.js', true);
			expect(part).toEqual({
				type: 'code',
				code: 'console.log("hello")',
				language: 'javascript',
				filename: 'hello.js',
				editable: true
			});
		});
	});

	describe('combineContentParts', () => {
		it('merges consecutive text parts', () => {
			const parts: ContentPart[] = [
				{ type: 'text', text: 'Hello' },
				{ type: 'text', text: 'world' },
				{ 
					type: 'image', 
					source: { url: 'test.jpg' }, 
					media_type: 'image/jpeg' 
				},
				{ type: 'text', text: 'Goodbye' }
			];

			const combined = combineContentParts(parts);
			expect(combined).toHaveLength(3);
			expect(combined[0]).toEqual({ type: 'text', text: 'Hello\nworld' });
			expect(combined[2]).toEqual({ type: 'text', text: 'Goodbye' });
		});
	});

	describe('extractMediaUrls', () => {
		it('returns empty array for string content', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: 'Hello world'
			};
			expect(extractMediaUrls(message)).toEqual([]);
		});

		it('extracts URLs from media content parts', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: [
					{ type: 'text', text: 'Hello' },
					{ 
						type: 'image', 
						source: { url: 'https://example.com/image.jpg' }, 
						media_type: 'image/jpeg' 
					},
					{ 
						type: 'video', 
						source: { url: 'https://example.com/video.mp4' }, 
						media_type: 'video/mp4' 
					}
				]
			};
			
			const urls = extractMediaUrls(message);
			expect(urls).toEqual([
				'https://example.com/image.jpg',
				'https://example.com/video.mp4'
			]);
		});
	});

	describe('estimateMessageSize', () => {
		it('estimates size for string content', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: 'Hello world'
			};
			const size = estimateMessageSize(message);
			expect(size).toBeGreaterThan(0);
		});

		it('estimates size for multi-modal content', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'user',
				content: [
					{ type: 'text', text: 'Hello world' },
					{ 
						type: 'image', 
						source: { base64: 'dGVzdA==' }, // "test" in base64
						media_type: 'image/jpeg' 
					}
				]
			};
			const size = estimateMessageSize(message);
			expect(size).toBeGreaterThan(10); // Should include both text and image
		});
	});

	describe('validateContentPartStructure', () => {
		it('validates text parts', () => {
			expect(validateContentPartStructure({ type: 'text', text: 'Hello' })).toBe(true);
			expect(validateContentPartStructure({ type: 'text' })).toBe(false);
		});

		it('validates image parts', () => {
			const validImagePart = {
				type: 'image',
				source: { url: 'https://example.com/test.jpg' },
				media_type: 'image/jpeg'
			};
			expect(validateContentPartStructure(validImagePart)).toBe(true);

			expect(validateContentPartStructure({
				type: 'image',
				media_type: 'image/jpeg'
			})).toBe(false);
		});

		it('validates code parts', () => {
			expect(validateContentPartStructure({
				type: 'code',
				code: 'console.log("hello")',
				language: 'javascript'
			})).toBe(true);

			expect(validateContentPartStructure({
				type: 'code',
				code: 'console.log("hello")'
			})).toBe(false);
		});

		it('rejects invalid parts', () => {
			expect(validateContentPartStructure(null)).toBe(false);
			expect(validateContentPartStructure({})).toBe(false);
			expect(validateContentPartStructure({ type: 'invalid' })).toBe(false);
		});
	});

	describe('formatFileSize', () => {
		it('formats bytes correctly', () => {
			expect(formatFileSize(0)).toBe('0 Bytes');
			expect(formatFileSize(1024)).toBe('1 KB');
			expect(formatFileSize(1024 * 1024)).toBe('1 MB');
			expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
			expect(formatFileSize(1536)).toBe('1.5 KB');
		});
	});
});
