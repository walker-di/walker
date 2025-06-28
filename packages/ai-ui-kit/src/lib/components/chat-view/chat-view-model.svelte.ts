import type {
	ChatMessage,
	ChatParticipant,
	ChatViewProps,
	ContentPart,
	FileUpload as FileUploadType,
} from "$lib/components/chat-view/types/chat.js";

import {
	validateChatMessage,
	sanitizeAndValidateUserInput,
	createValidatedMessage,
	type ValidationResult,
} from "$lib/components/chat-view/utils/validation.js";

import {
	isMultiModalMessage,
	getMessageText,
	getContentPartsByType,
	hasContentType,
	fileToContentPart,
	combineContentParts,
	createTextPart,
} from "./utils/content-utils.js";

export class ChatViewModel {
	// State
	inputValue = $state("");
	isRecording = $state(false);
	showFileUpload = $state(false);
	pendingFiles = $state<FileUploadType[]>([]);
	isTyping = $state(false);
	private typingTimeout: number | null = null;

	// Props
	private props: ChatViewProps;

	constructor(props: ChatViewProps) {
		this.props = props;
	}

	updateProps(props: ChatViewProps) {
		this.props = props;
	}

	handleSend() {
		if (!this.inputValue.trim() && this.pendingFiles.length === 0) return;
		if (this.props.disabled) return;

		// Validate and sanitize user input
		if (this.inputValue.trim()) {
			const inputValidation = sanitizeAndValidateUserInput(this.inputValue);
			if (!inputValidation.success) {
				console.error("Input validation failed:", inputValidation.errors);
				// In a real app, show user-friendly error message
				return;
			}
		}

		const contentParts: ContentPart[] = [];

		// Add text content if present
		if (this.inputValue.trim()) {
			contentParts.push(createTextPart(this.inputValue.trim()));
		}

		// Add file content parts
		if (this.pendingFiles.length > 0) {
			// In a real implementation, you'd convert files to content parts
			// For now, we'll handle this through the onSendFiles callback
			if (this.props.onSendFiles) {
				this.props.onSendFiles(this.pendingFiles.map((f) => f.file));
			}
		}

		// Validate message before sending
		if (contentParts.length > 0) {
			const messageData = {
				id: crypto.randomUUID(),
				role: "user" as const,
				content: contentParts,
				timestamp: new Date(),
			};

			const messageValidation = validateChatMessage(messageData);
			if (messageValidation.success) {
				this.props.onSendMessage?.(contentParts);
			} else {
				console.error("Message validation failed:", messageValidation.errors);
				// In a real app, show user-friendly error message
				return;
			}
		} else if (this.inputValue.trim()) {
			this.props.onSendMessage?.(this.inputValue.trim());
		}

		// Clear input and files
		this.inputValue = "";
		this.pendingFiles = [];
		this.showFileUpload = false;
		this.stopTyping();
	}

	handleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			this.handleSend();
		}
	}

	handleInput() {
		if (!this.isTyping) {
			this.isTyping = true;
			this.props.onTypingStart?.();
		}

		// Reset typing timeout
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}

		this.typingTimeout = setTimeout(() => {
			this.stopTyping();
		}, 2000);
	}

	stopTyping() {
		if (this.isTyping) {
			this.isTyping = false;
			this.props.onTypingStop?.();
		}
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
			this.typingTimeout = null;
		}
	}

	toggleRecording() {
		this.isRecording = !this.isRecording;
	}

	handleFileSelect(files: File[]) {
		const newUploads: FileUploadType[] = files.map((file) => ({
			id: crypto.randomUUID(),
			file,
			status: "uploading",
			progress: 0,
		}));

		this.pendingFiles = [...this.pendingFiles, ...newUploads];

		// Simulate upload progress
		newUploads.forEach((upload) => {
			this.simulateUpload(upload);
		});
	}

	private simulateUpload(upload: FileUploadType) {
		const interval = setInterval(() => {
			const uploadIndex = this.pendingFiles.findIndex((f) => f.id === upload.id);
			if (uploadIndex === -1) {
				clearInterval(interval);
				return;
			}

			this.pendingFiles[uploadIndex].progress += 10;

			if (this.pendingFiles[uploadIndex].progress >= 100) {
				this.pendingFiles[uploadIndex].status = "uploaded";
				this.pendingFiles[uploadIndex].progress = 100;
				clearInterval(interval);

				// Call upload handler if provided
				if (this.props.onFileUpload) {
					this.props.onFileUpload(upload.file)
						.then((result) => {
							const index = this.pendingFiles.findIndex((f) => f.id === upload.id);
							if (index !== -1) {
								this.pendingFiles[index] = result;
							}
						})
						.catch(() => {
							const index = this.pendingFiles.findIndex((f) => f.id === upload.id);
							if (index !== -1) {
								this.pendingFiles[index].status = "error";
								this.pendingFiles[index].error = "Upload failed";
							}
						});
				}
			}
		}, 200);
	}

	handleFileRemove(fileId: string) {
		this.pendingFiles = this.pendingFiles.filter((f) => f.id !== fileId);
		this.props.onFileRemove?.(fileId);
	}

	toggleFileUpload() {
		this.showFileUpload = !this.showFileUpload;
	}

	// Computed properties
	get canSend() {
		return (this.inputValue.trim() || this.pendingFiles.length > 0) && !this.props.disabled;
	}

	get displayMessages() {
		const sampleMessages: ChatMessage[] = [
			{
				id: "1",
				role: "assistant",
				content: "Hello! 😊\n\nHow can I help you today?",
				timestamp: new Date(),
			},
		];

		return this.props.messages && this.props.messages.length > 0 ? this.props.messages : sampleMessages;
	}

	// Cleanup method
	destroy() {
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
			this.typingTimeout = null;
		}
	}
}
