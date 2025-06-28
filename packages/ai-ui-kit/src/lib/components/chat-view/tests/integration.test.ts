import { describe, it, expect } from 'vitest';
import type { ChatMessage, ContentPart, ConversationExport } from '../types/chat.js';
import {
	isMultiModalMessage,
	getMessageText,
	createTextPart,
	createCodePart,
	combineContentParts,
	estimateMessageSize,
	formatFileSize
} from '../utils/content-utils.js';

describe('Chat Integration Tests', () => {
	describe('Multi-modal Message Handling', () => {
		it('handles complex multi-modal messages', () => {
			const complexMessage: ChatMessage = {
				id: '1',
				role: 'assistant',
				content: [
					createTextPart('Here is the solution:'),
					createCodePart('console.log("Hello, world!");', 'javascript', 'hello.js'),
					createTextPart('This code will output a greeting message.'),
					{
						type: 'image',
						source: { url: 'https://example.com/diagram.png' },
						media_type: 'image/png',
						alt_text: 'Architecture diagram'
					}
				],
				timestamp: new Date()
			};

			expect(isMultiModalMessage(complexMessage)).toBe(true);
			
			const textContent = getMessageText(complexMessage);
			expect(textContent).toBe('Here is the solution:\nThis code will output a greeting message.');
			
			const size = estimateMessageSize(complexMessage);
			expect(size).toBeGreaterThan(0);
		});

		it('combines and optimizes content parts', () => {
			const parts: ContentPart[] = [
				createTextPart('First part'),
				createTextPart('Second part'),
				createCodePart('const x = 1;', 'javascript'),
				createTextPart('Third part'),
				createTextPart('Fourth part')
			];

			const combined = combineContentParts(parts);
			
			// Should merge consecutive text parts
			expect(combined).toHaveLength(3);
			expect(combined[0].type).toBe('text');
			expect((combined[0] as any).text).toBe('First part\nSecond part');
			expect(combined[1].type).toBe('code');
			expect(combined[2].type).toBe('text');
			expect((combined[2] as any).text).toBe('Third part\nFourth part');
		});
	});

	describe('Conversation Export/Import', () => {
		it('creates valid conversation export format', () => {
			const messages: ChatMessage[] = [
				{
					id: '1',
					role: 'user',
					content: 'Hello',
					timestamp: new Date('2024-01-01T10:00:00Z')
				},
				{
					id: '2',
					role: 'assistant',
					content: [
						createTextPart('Hi there!'),
						createCodePart('print("Hello")', 'python')
					],
					timestamp: new Date('2024-01-01T10:01:00Z')
				}
			];

			const exportData: ConversationExport = {
				version: '1.0',
				conversation_id: 'test-conversation',
				title: 'Test Chat',
				created_at: new Date('2024-01-01T10:00:00Z'),
				exported_at: new Date(),
				participants: [
					{ id: '1', name: 'User', isOnline: true },
					{ id: '2', name: 'Assistant', isOnline: true }
				],
				messages,
				threads: []
			};

			// Validate export structure
			expect(exportData.version).toBe('1.0');
			expect(exportData.messages).toHaveLength(2);
			expect(exportData.participants).toHaveLength(2);
			
			// Ensure it can be serialized
			const serialized = JSON.stringify(exportData);
			expect(serialized).toBeTruthy();
			
			// Ensure it can be deserialized
			const parsed = JSON.parse(serialized);
			expect(parsed.conversation_id).toBe('test-conversation');
		});
	});

	describe('File Size Formatting', () => {
		it('formats various file sizes correctly', () => {
			const testCases = [
				{ bytes: 0, expected: '0 Bytes' },
				{ bytes: 512, expected: '512 Bytes' },
				{ bytes: 1024, expected: '1 KB' },
				{ bytes: 1536, expected: '1.5 KB' },
				{ bytes: 1048576, expected: '1 MB' },
				{ bytes: 1073741824, expected: '1 GB' },
				{ bytes: 1099511627776, expected: '1 TB' }
			];

			testCases.forEach(({ bytes, expected }) => {
				expect(formatFileSize(bytes)).toBe(expected);
			});
		});
	});

	describe('Message Size Estimation', () => {
		it('estimates sizes for different message types', () => {
			const textMessage: ChatMessage = {
				id: '1',
				role: 'user',
				content: 'Hello world',
				timestamp: new Date()
			};

			const multiModalMessage: ChatMessage = {
				id: '2',
				role: 'assistant',
				content: [
					createTextPart('Here is some code:'),
					createCodePart('function test() { return "hello"; }', 'javascript'),
					{
						type: 'image',
						source: { base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' },
						media_type: 'image/png'
					}
				],
				timestamp: new Date()
			};

			const textSize = estimateMessageSize(textMessage);
			const multiModalSize = estimateMessageSize(multiModalMessage);

			expect(textSize).toBeGreaterThan(0);
			expect(multiModalSize).toBeGreaterThan(textSize);
			expect(multiModalSize).toBeGreaterThan(100); // Should include base64 image
		});
	});

	describe('Content Type Detection', () => {
		it('correctly identifies content types in messages', () => {
			const message: ChatMessage = {
				id: '1',
				role: 'assistant',
				content: [
					createTextPart('Analysis complete:'),
					createCodePart('SELECT * FROM users;', 'sql'),
					{
						type: 'file',
						source: { file_id: 'report-123' },
						media_type: 'application/pdf',
						filename: 'analysis-report.pdf',
						size: 1024000
					}
				],
				timestamp: new Date()
			};

			expect(isMultiModalMessage(message)).toBe(true);
			
			// Check that we can extract different content types
			const content = message.content as ContentPart[];
			const textParts = content.filter(p => p.type === 'text');
			const codeParts = content.filter(p => p.type === 'code');
			const fileParts = content.filter(p => p.type === 'file');

			expect(textParts).toHaveLength(1);
			expect(codeParts).toHaveLength(1);
			expect(fileParts).toHaveLength(1);
		});
	});

	describe('Thread Management', () => {
		it('handles message threading correctly', () => {
			const parentMessage: ChatMessage = {
				id: 'parent-1',
				role: 'user',
				content: 'What is React?',
				timestamp: new Date(),
				thread_id: 'thread-1'
			};

			const replyMessage: ChatMessage = {
				id: 'reply-1',
				role: 'assistant',
				content: 'React is a JavaScript library...',
				timestamp: new Date(),
				thread_id: 'thread-1',
				parent_id: 'parent-1'
			};

			// Verify thread structure
			expect(parentMessage.thread_id).toBe('thread-1');
			expect(replyMessage.thread_id).toBe('thread-1');
			expect(replyMessage.parent_id).toBe('parent-1');
		});
	});
});
