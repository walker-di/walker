import { z } from 'zod';
import {
	ChatMessageSchema,
	ConversationExportSchema,
	ChatParticipantSchema,
	ConversationThreadSchema,
	type ChatMessage,
	type ConversationExport,
	type ChatParticipant,
	type ConversationThread
} from '../schemas/chat.js';
import {
	validateChatMessage,
	validateConversationExport,
	validateMessages,
	validateParticipants,
	parseAndValidateJSON,
	type ValidationResult
} from '../utils/validation.js';

/**
 * API service with Zod validation for chat operations
 */

// API response schemas
const ApiResponseSchema = z.object({
	success: z.boolean(),
	data: z.any().optional(),
	error: z.string().optional(),
	errors: z.array(z.string()).optional()
});

const PaginatedResponseSchema = z.object({
	data: z.array(z.any()),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	hasMore: z.boolean()
});

// API request schemas
const SendMessageRequestSchema = z.object({
	content: z.union([z.string(), z.array(z.any())]),
	thread_id: z.string().optional(),
	parent_id: z.string().optional(),
	metadata: z.record(z.any()).optional()
});

const CreateThreadRequestSchema = z.object({
	title: z.string().min(1),
	message_id: z.string().optional(),
	participants: z.array(z.string()).min(1)
});

export class ChatApiService {
	private baseUrl: string;
	private headers: Record<string, string>;

	constructor(baseUrl: string = '/api', apiKey?: string) {
		this.baseUrl = baseUrl;
		this.headers = {
			'Content-Type': 'application/json',
			...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
		};
	}

	/**
	 * Send a message with validation
	 */
	async sendMessage(
		content: string | any[],
		options?: {
			thread_id?: string;
			parent_id?: string;
			metadata?: Record<string, any>;
		}
	): Promise<ValidationResult<ChatMessage>> {
		try {
			// Validate request data
			const requestData = {
				content,
				...options
			};

			const requestValidation = SendMessageRequestSchema.safeParse(requestData);
			if (!requestValidation.success) {
				return {
					success: false,
					errors: requestValidation.error.issues.map(issue => 
						`${issue.path.join('.')}: ${issue.message}`
					)
				};
			}

			// Make API call
			const response = await fetch(`${this.baseUrl}/messages`, {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify(requestValidation.data)
			});

			if (!response.ok) {
				return {
					success: false,
					errors: [`API error: ${response.status} ${response.statusText}`]
				};
			}

			const responseData = await response.json();
			
			// Validate API response structure
			const apiResponseValidation = ApiResponseSchema.safeParse(responseData);
			if (!apiResponseValidation.success) {
				return {
					success: false,
					errors: ['Invalid API response format']
				};
			}

			// Validate message data
			return validateChatMessage(responseData.data);

		} catch (error) {
			return {
				success: false,
				errors: [`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`]
			};
		}
	}

	/**
	 * Get messages with validation
	 */
	async getMessages(
		threadId?: string,
		page: number = 1,
		limit: number = 50
	): Promise<ValidationResult<{ messages: ChatMessage[]; pagination: any }>> {
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				...(threadId && { thread_id: threadId })
			});

			const response = await fetch(`${this.baseUrl}/messages?${params}`, {
				headers: this.headers
			});

			if (!response.ok) {
				return {
					success: false,
					errors: [`API error: ${response.status} ${response.statusText}`]
				};
			}

			const responseData = await response.json();
			
			// Validate paginated response
			const paginationValidation = PaginatedResponseSchema.safeParse(responseData);
			if (!paginationValidation.success) {
				return {
					success: false,
					errors: ['Invalid pagination response format']
				};
			}

			// Validate messages
			const messagesValidation = validateMessages(responseData.data);
			if (!messagesValidation.success) {
				return messagesValidation;
			}

			return {
				success: true,
				data: {
					messages: messagesValidation.data!,
					pagination: {
						total: responseData.total,
						page: responseData.page,
						limit: responseData.limit,
						hasMore: responseData.hasMore
					}
				}
			};

		} catch (error) {
			return {
				success: false,
				errors: [`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`]
			};
		}
	}

	/**
	 * Export conversation with validation
	 */
	async exportConversation(conversationId: string): Promise<ValidationResult<ConversationExport>> {
		try {
			const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/export`, {
				headers: this.headers
			});

			if (!response.ok) {
				return {
					success: false,
					errors: [`API error: ${response.status} ${response.statusText}`]
				};
			}

			const responseData = await response.json();
			return validateConversationExport(responseData);

		} catch (error) {
			return {
				success: false,
				errors: [`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`]
			};
		}
	}

	/**
	 * Import conversation with validation
	 */
	async importConversation(exportData: ConversationExport): Promise<ValidationResult<{ conversation_id: string }>> {
		try {
			// Validate export data first
			const validation = validateConversationExport(exportData);
			if (!validation.success) {
				return validation;
			}

			const response = await fetch(`${this.baseUrl}/conversations/import`, {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify(validation.data)
			});

			if (!response.ok) {
				return {
					success: false,
					errors: [`API error: ${response.status} ${response.statusText}`]
				};
			}

			const responseData = await response.json();
			
			// Validate response
			const responseSchema = z.object({
				conversation_id: z.string()
			});

			const responseValidation = responseSchema.safeParse(responseData);
			if (!responseValidation.success) {
				return {
					success: false,
					errors: ['Invalid import response format']
				};
			}

			return {
				success: true,
				data: responseValidation.data
			};

		} catch (error) {
			return {
				success: false,
				errors: [`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`]
			};
		}
	}

	/**
	 * Create thread with validation
	 */
	async createThread(
		title: string,
		participants: string[],
		messageId?: string
	): Promise<ValidationResult<ConversationThread>> {
		try {
			const requestData = {
				title,
				participants,
				message_id: messageId
			};

			const requestValidation = CreateThreadRequestSchema.safeParse(requestData);
			if (!requestValidation.success) {
				return {
					success: false,
					errors: requestValidation.error.issues.map(issue => 
						`${issue.path.join('.')}: ${issue.message}`
					)
				};
			}

			const response = await fetch(`${this.baseUrl}/threads`, {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify(requestValidation.data)
			});

			if (!response.ok) {
				return {
					success: false,
					errors: [`API error: ${response.status} ${response.statusText}`]
				};
			}

			const responseData = await response.json();
			
			// Validate thread data
			const threadValidation = ConversationThreadSchema.safeParse(responseData);
			if (!threadValidation.success) {
				return {
					success: false,
					errors: threadValidation.error.issues.map(issue => 
						`${issue.path.join('.')}: ${issue.message}`
					)
				};
			}

			return {
				success: true,
				data: threadValidation.data
			};

		} catch (error) {
			return {
				success: false,
				errors: [`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`]
			};
		}
	}

	/**
	 * Upload file with validation
	 */
	async uploadFile(file: File): Promise<ValidationResult<{ file_id: string; url: string }>> {
		try {
			// Validate file
			const fileValidation = z.instanceof(File).safeParse(file);
			if (!fileValidation.success) {
				return {
					success: false,
					errors: ['Invalid file object']
				};
			}

			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch(`${this.baseUrl}/files/upload`, {
				method: 'POST',
				headers: {
					// Don't set Content-Type for FormData, let browser set it
					...Object.fromEntries(
						Object.entries(this.headers).filter(([key]) => key !== 'Content-Type')
					)
				},
				body: formData
			});

			if (!response.ok) {
				return {
					success: false,
					errors: [`Upload failed: ${response.status} ${response.statusText}`]
				};
			}

			const responseData = await response.json();
			
			// Validate upload response
			const uploadResponseSchema = z.object({
				file_id: z.string(),
				url: z.string().url()
			});

			const responseValidation = uploadResponseSchema.safeParse(responseData);
			if (!responseValidation.success) {
				return {
					success: false,
					errors: ['Invalid upload response format']
				};
			}

			return {
				success: true,
				data: responseValidation.data
			};

		} catch (error) {
			return {
				success: false,
				errors: [`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`]
			};
		}
	}
}
