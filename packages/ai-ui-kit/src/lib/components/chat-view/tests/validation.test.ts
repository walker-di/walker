import { describe, it, expect } from 'vitest';
import {
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
	getValidationErrorSummary
} from '../utils/validation.js';
import {
	ChatMessageSchema,
	ContentPartSchema,
	ChatParticipantSchema
} from '../schemas/chat.js';

describe('Zod Validation', () => {
	describe('validateChatMessage', () => {
		it('validates valid chat message', () => {
			const validMessage = {
				id: 'msg-1',
				role: 'user',
				content: 'Hello world',
				timestamp: new Date()
			};

			const result = validateChatMessage(validMessage);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.errors).toBeUndefined();
		});

		it('validates multi-modal chat message', () => {
			const validMessage = {
				id: 'msg-1',
				role: 'assistant',
				content: [
					{
						type: 'text',
						text: 'Here is some code:'
					},
					{
						type: 'code',
						code: 'console.log("hello");',
						language: 'javascript'
					}
				],
				timestamp: new Date()
			};

			const result = validateChatMessage(validMessage);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
		});

		it('rejects invalid chat message', () => {
			const invalidMessage = {
				id: '',
				role: 'invalid-role',
				content: '',
				timestamp: 'invalid-date'
			};

			const result = validateChatMessage(invalidMessage);
			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
			expect(result.errors!.length).toBeGreaterThan(0);
		});

		it('rejects message with empty content', () => {
			const invalidMessage = {
				id: 'msg-1',
				role: 'user',
				content: ''
			};

			const result = validateChatMessage(invalidMessage);
			expect(result.success).toBe(false);
			expect(result.errors).toContain('content: Message content cannot be empty');
		});
	});

	describe('validateContentPart', () => {
		it('validates text content part', () => {
			const textPart = {
				type: 'text',
				text: 'Hello world',
				format: 'markdown'
			};

			const result = validateContentPart(textPart);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
		});

		it('validates image content part', () => {
			const imagePart = {
				type: 'image',
				source: {
					url: 'https://example.com/image.jpg'
				},
				media_type: 'image/jpeg',
				alt_text: 'Test image'
			};

			const result = validateContentPart(imagePart);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
		});

		it('validates code content part', () => {
			const codePart = {
				type: 'code',
				code: 'console.log("hello");',
				language: 'javascript',
				filename: 'hello.js',
				editable: true
			};

			const result = validateContentPart(codePart);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
		});

		it('rejects invalid content part', () => {
			const invalidPart = {
				type: 'text'
				// missing required 'text' field
			};

			const result = validateContentPart(invalidPart);
			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});

		it('rejects image part without source', () => {
			const invalidImagePart = {
				type: 'image',
				media_type: 'image/jpeg'
				// missing source
			};

			const result = validateContentPart(invalidImagePart);
			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});

		it('rejects image part with invalid media type', () => {
			const invalidImagePart = {
				type: 'image',
				source: { url: 'https://example.com/image.jpg' },
				media_type: 'video/mp4' // should be image/*
			};

			const result = validateContentPart(invalidImagePart);
			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});
	});

	describe('validateChatParticipant', () => {
		it('validates valid participant', () => {
			const participant = {
				id: 'user-1',
				name: 'John Doe',
				avatar: 'https://example.com/avatar.jpg',
				isOnline: true,
				status: 'online'
			};

			const result = validateChatParticipant(participant);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
		});

		it('applies default values', () => {
			const participant = {
				id: 'user-1',
				name: 'John Doe'
			};

			const result = validateChatParticipant(participant);
			expect(result.success).toBe(true);
			expect(result.data!.isOnline).toBe(false);
			expect(result.data!.status).toBe('offline');
		});

		it('rejects participant with empty name', () => {
			const participant = {
				id: 'user-1',
				name: ''
			};

			const result = validateChatParticipant(participant);
			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});
	});

	describe('validateFile', () => {
		it('validates file within constraints', () => {
			const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
			const result = validateFile(file, 1024 * 1024, ['text/*']);

			expect(result.success).toBe(true);
			expect(result.data).toBe(file);
		});

		it('rejects file exceeding size limit', () => {
			const file = new File(['x'.repeat(1000)], 'large.txt', { type: 'text/plain' });
			const result = validateFile(file, 500, ['text/*']);

			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});

		it('rejects file with disallowed type', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			const result = validateFile(file, 1024, ['image/*']);

			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});
	});

	describe('sanitizeAndValidateUserInput', () => {
		it('sanitizes and validates valid input', () => {
			const result = sanitizeAndValidateUserInput('  Hello world  ');
			expect(result.success).toBe(true);
			expect(result.data).toBe('Hello world');
		});

		it('rejects empty input', () => {
			const result = sanitizeAndValidateUserInput('   ');
			expect(result.success).toBe(false);
			expect(result.errors).toContain('Input cannot be empty');
		});

		it('rejects input that is too long', () => {
			const longInput = 'x'.repeat(10001);
			const result = sanitizeAndValidateUserInput(longInput);
			expect(result.success).toBe(false);
			expect(result.errors).toContain('Input is too long (maximum 10,000 characters)');
		});
	});

	describe('batchValidate', () => {
		it('validates batch of valid items', () => {
			const messages = [
				{ id: '1', role: 'user', content: 'Hello' },
				{ id: '2', role: 'assistant', content: 'Hi there' }
			];

			const result = batchValidate(messages, ChatMessageSchema);
			expect(result.valid).toHaveLength(2);
			expect(result.invalid).toHaveLength(0);
		});

		it('separates valid and invalid items', () => {
			const messages = [
				{ id: '1', role: 'user', content: 'Hello' },
				{ id: '', role: 'invalid', content: '' }, // invalid
				{ id: '3', role: 'assistant', content: 'Hi' }
			];

			const result = batchValidate(messages, ChatMessageSchema);
			expect(result.valid).toHaveLength(2);
			expect(result.invalid).toHaveLength(1);
			expect(result.invalid[0].index).toBe(1);
		});
	});

	describe('parseAndValidateJSON', () => {
		it('parses and validates valid JSON', () => {
			const validMessage = {
				id: 'msg-1',
				role: 'user',
				content: 'Hello'
			};
			const jsonString = JSON.stringify(validMessage);

			const result = parseAndValidateJSON(jsonString, ChatMessageSchema);
			expect(result.success).toBe(true);
			expect(result.data).toEqual(validMessage);
		});

		it('rejects invalid JSON', () => {
			const invalidJson = '{ invalid json }';
			const result = parseAndValidateJSON(invalidJson, ChatMessageSchema);
			expect(result.success).toBe(false);
			expect(result.errors![0]).toContain('Invalid JSON');
		});

		it('rejects valid JSON with invalid data', () => {
			const invalidData = { id: '', role: 'invalid' };
			const jsonString = JSON.stringify(invalidData);

			const result = parseAndValidateJSON(jsonString, ChatMessageSchema);
			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});
	});

	describe('type guards', () => {
		it('isChatMessage works correctly', () => {
			const validMessage = { id: '1', role: 'user', content: 'Hello' };
			const invalidMessage = { id: '', role: 'invalid' };

			expect(isChatMessage(validMessage)).toBe(true);
			expect(isChatMessage(invalidMessage)).toBe(false);
		});

		it('isContentPart works correctly', () => {
			const validPart = { type: 'text', text: 'Hello' };
			const invalidPart = { type: 'text' };

			expect(isContentPart(validPart)).toBe(true);
			expect(isContentPart(invalidPart)).toBe(false);
		});
	});

	describe('error formatting', () => {
		it('formats single error', () => {
			const errors = ['Field is required'];
			const formatted = formatValidationErrors(errors);
			expect(formatted).toBe('Field is required');
		});

		it('formats multiple errors', () => {
			const errors = ['Field is required', 'Invalid format'];
			const formatted = formatValidationErrors(errors);
			expect(formatted).toContain('Multiple validation errors:');
			expect(formatted).toContain('• Field is required');
			expect(formatted).toContain('• Invalid format');
		});

		it('gets error summary', () => {
			expect(getValidationErrorSummary([])).toBe('No errors');
			expect(getValidationErrorSummary(['error'])).toBe('1 validation error');
			expect(getValidationErrorSummary(['error1', 'error2'])).toBe('2 validation errors');
		});
	});
});
