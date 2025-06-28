<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar/index.js";

	// New components
	import FileUpload from "./components/file-upload.svelte";
	import ImagePreview from "./components/image-preview.svelte";
	import DocumentPreview from "./components/document-preview.svelte";
	import CodeCanvas from "./components/code-canvas.svelte";
	import TypingIndicator from "./components/typing-indicator.svelte";
	import MessageThread from "./components/message-thread.svelte";
	import ConversationManager from "./components/conversation-manager.svelte";

	// Types
	import type {
		ChatMessage,
		ChatParticipant,
		ChatViewProps,
		ContentPart,
		FileUpload as FileUploadType,
	} from "$lib/components/chat-view/schemas/chat.js";

	// Validation
	import {
		validateChatMessage,
		sanitizeAndValidateUserInput,
		createValidatedMessage,
		type ValidationResult
	} from "$lib/components/chat-view/utils/validation.js";

	// Utils
	import {
		isMultiModalMessage,
		getMessageText,
		getContentPartsByType,
		hasContentType,
		fileToContentPart,
		combineContentParts,
		createTextPart
	} from "./utils/content-utils.js";

	// Lucide icons
	import Copy from "lucide-svelte/icons/copy";
	import ThumbsUp from "lucide-svelte/icons/thumbs-up";
	import ThumbsDown from "lucide-svelte/icons/thumbs-down";
	import Volume2 from "lucide-svelte/icons/volume-2";
	import RotateCcw from "lucide-svelte/icons/rotate-ccw";
	import Download from "lucide-svelte/icons/download";
	import Plus from "lucide-svelte/icons/plus";
	import Settings from "lucide-svelte/icons/settings";
	import Mic from "lucide-svelte/icons/mic";
	import MicOff from "lucide-svelte/icons/mic-off";
	import Send from "lucide-svelte/icons/send";
	import Phone from "lucide-svelte/icons/phone";
	import Search from "lucide-svelte/icons/search";
	import MoreVertical from "lucide-svelte/icons/more-vertical";
	import Paperclip from "lucide-svelte/icons/paperclip";

	let {
		messages = [],
		placeholder = "Ask anything",
		disabled = false,
		showTools = true,
		chatTitle = "Waalkers",
		participants = [
			{ id: "1", name: "Fernando", isOnline: true },
			{ id: "2", name: "~Benko", isOnline: true },
			{ id: "3", name: "Você", isOnline: true },
		],
		threads = [],
		activeThreadId,
		typingIndicators = [],
		fileUploads = [],
		maxFileSize = 10 * 1024 * 1024, // 10MB
		acceptedFileTypes = ["image/*", "video/*", "audio/*", "text/*", ".pdf", ".doc", ".docx"],
		enableThreading = false,
		enableFileUpload = true,
		enableCodeCanvas = true,
		enableExport = true,

		// Message handlers
		onSendMessage,
		onSendFiles,
		onCopyMessage,
		onThumbsUp,
		onThumbsDown,
		onPlayAudio,
		onRegenerate,
		onDownload,

		// Threading handlers
		onCreateThread,
		onSwitchThread,
		onDeleteThread,

		// File handlers
		onFileUpload,
		onFileRemove,
		onFilePreview,

		// Export/Import handlers
		onExportConversation,
		onImportConversation,

		// Real-time handlers
		onTypingStart,
		onTypingStop,

		// UI handlers
		onToolsClick,
		onCallClick,
		onSearchClick,
		onMoreClick,
	}: ChatViewProps = $props();

	let inputValue = $state("");
	let isRecording = $state(false);
	let showFileUpload = $state(false);
	let pendingFiles = $state<FileUploadType[]>([]);
	let isTyping = $state(false);
	let typingTimeout: number | null = null;

	function handleSend() {
		if (!inputValue.trim() && pendingFiles.length === 0) return;
		if (disabled) return;

		// Validate and sanitize user input
		if (inputValue.trim()) {
			const inputValidation = sanitizeAndValidateUserInput(inputValue);
			if (!inputValidation.success) {
				console.error('Input validation failed:', inputValidation.errors);
				// In a real app, show user-friendly error message
				return;
			}
		}

		const contentParts: ContentPart[] = [];

		// Add text content if present
		if (inputValue.trim()) {
			contentParts.push(createTextPart(inputValue.trim()));
		}

		// Add file content parts
		if (pendingFiles.length > 0) {
			// In a real implementation, you'd convert files to content parts
			// For now, we'll handle this through the onSendFiles callback
			if (onSendFiles) {
				onSendFiles(pendingFiles.map(f => f.file));
			}
		}

		// Validate message before sending
		if (contentParts.length > 0) {
			const messageData = {
				id: crypto.randomUUID(),
				role: 'user' as const,
				content: contentParts,
				timestamp: new Date()
			};

			const messageValidation = validateChatMessage(messageData);
			if (messageValidation.success) {
				onSendMessage?.(contentParts);
			} else {
				console.error('Message validation failed:', messageValidation.errors);
				// In a real app, show user-friendly error message
				return;
			}
		} else if (inputValue.trim()) {
			onSendMessage?.(inputValue.trim());
		}

		// Clear input and files
		inputValue = "";
		pendingFiles = [];
		showFileUpload = false;
		stopTyping();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}

	function handleInput() {
		if (!isTyping) {
			isTyping = true;
			onTypingStart?.();
		}

		// Reset typing timeout
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}

		typingTimeout = setTimeout(() => {
			stopTyping();
		}, 2000);
	}

	function stopTyping() {
		if (isTyping) {
			isTyping = false;
			onTypingStop?.();
		}
		if (typingTimeout) {
			clearTimeout(typingTimeout);
			typingTimeout = null;
		}
	}

	function toggleRecording() {
		isRecording = !isRecording;
	}

	function handleFileSelect(files: File[]) {
		const newUploads: FileUploadType[] = files.map(file => ({
			id: crypto.randomUUID(),
			file,
			status: 'uploading',
			progress: 0
		}));

		pendingFiles = [...pendingFiles, ...newUploads];

		// Simulate upload progress
		newUploads.forEach(upload => {
			simulateUpload(upload);
		});
	}

	function simulateUpload(upload: FileUploadType) {
		const interval = setInterval(() => {
			const uploadIndex = pendingFiles.findIndex(f => f.id === upload.id);
			if (uploadIndex === -1) {
				clearInterval(interval);
				return;
			}

			pendingFiles[uploadIndex].progress += 10;

			if (pendingFiles[uploadIndex].progress >= 100) {
				pendingFiles[uploadIndex].status = 'uploaded';
				pendingFiles[uploadIndex].progress = 100;
				clearInterval(interval);

				// Call upload handler if provided
				if (onFileUpload) {
					onFileUpload(upload.file).then(result => {
						const index = pendingFiles.findIndex(f => f.id === upload.id);
						if (index !== -1) {
							pendingFiles[index] = result;
						}
					}).catch(() => {
						const index = pendingFiles.findIndex(f => f.id === upload.id);
						if (index !== -1) {
							pendingFiles[index].status = 'error';
							pendingFiles[index].error = 'Upload failed';
						}
					});
				}
			}
		}, 200);
	}

	function handleFileRemove(fileId: string) {
		pendingFiles = pendingFiles.filter(f => f.id !== fileId);
		onFileRemove?.(fileId);
	}

	// Sample messages for demo
	const sampleMessages: ChatMessage[] = [
		{
			id: "1",
			role: "assistant",
			content: "Hello! 😊\n\nHow can I help you today?",
			timestamp: new Date(),
		},
	];

	const displayMessages = messages.length > 0 ? messages : sampleMessages;
</script>

<div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-foreground">
	<!-- Threading Sidebar -->
	{#if enableThreading && threads.length > 0}
		<MessageThread
			{threads}
			{activeThreadId}
			{messages}
			{onCreateThread}
			{onSwitchThread}
			{onDeleteThread}
		/>
	{/if}

	<!-- Main Chat Area -->
	<div class="flex flex-col flex-1 min-w-0">
	<!-- Header -->
	<div
		class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-900 text-white p-4 shadow-sm"
	>
		<div class="flex items-center gap-3">
			<!-- Chat Icon/Logo -->
			<div
				class="flex items-center justify-center w-8 h-8 bg-white rounded-full"
			>
				<div
					class="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center"
				>
					<div class="w-2 h-2 bg-white rounded-full"></div>
				</div>
			</div>

			<div class="flex flex-col">
				<h1 class="text-lg font-semibold text-white">{chatTitle}</h1>
				<div class="flex items-center gap-1 text-sm text-gray-300">
					{#each participants as participant, index}
						<span class="flex items-center gap-1">
							{participant.name}
							{#if participant.isOnline}
								<div class="w-2 h-2 bg-green-400 rounded-full"></div>
							{/if}
						</span>
						{#if index < participants.length - 1}
							<span class="text-gray-400">,</span>
						{/if}
					{/each}
				</div>
			</div>
		</div>

		<div class="flex items-center gap-2">
			{#if enableExport}
				<ConversationManager
					{messages}
					{participants}
					{threads}
					conversationTitle={chatTitle}
					{onExportConversation}
					{onImportConversation}
				/>
			{/if}

			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
				onclick={onCallClick}
			>
				<Phone class="h-4 w-4" />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
				onclick={onSearchClick}
			>
				<Search class="h-4 w-4" />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
				onclick={onMoreClick}
			>
				<MoreVertical class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<!-- Messages Area -->
	<div class="flex-1 overflow-hidden">
		<ScrollArea class="h-full">
			<div class="space-y-4 p-6">
				{#each displayMessages as message (message.id)}
					<div
						class="flex gap-3 {message.role === 'user'
							? 'justify-end'
							: 'justify-start'}"
					>
						{#if message.role === "assistant"}
							<Avatar class="h-8 w-8 shrink-0 mt-1">
								<AvatarFallback class="bg-blue-600 text-white text-sm"
									>AI</AvatarFallback
								>
							</Avatar>
						{/if}

						<div class="flex flex-col space-y-2 max-w-[70%]">
							<!-- Multi-modal Content -->
							{#if isMultiModalMessage(message)}
								{#each message.content as part, index}
									{#if part.type === 'text'}
										<!-- Text Content -->
										<div class="relative group">
											<div
												class="
												{message.role === 'user'
													? 'bg-green-500 text-white rounded-2xl rounded-br-md'
													: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-700'}
												px-4 py-3 shadow-sm
											"
											>
												<div class="text-sm leading-relaxed whitespace-pre-wrap">
													{@html part.text.replace(/\n/g, "<br>")}
												</div>
											</div>
										</div>
									{:else if part.type === 'image'}
										<!-- Image Content -->
										<ImagePreview
											image={part}
											showControls={true}
											showMetadata={false}
											onDownload={() => onDownload?.(message.id)}
										/>
									{:else if part.type === 'file'}
										<!-- Document Content -->
										<DocumentPreview
											document={part}
											showControls={true}
											showMetadata={true}
											onDownload={() => onDownload?.(message.id)}
											onPreview={() => onFilePreview?.(part.source.file_id || '')}
										/>
									{:else if part.type === 'code' && enableCodeCanvas}
										<!-- Code Content -->
										<CodeCanvas
											code={part}
											editable={part.editable}
											showLineNumbers={true}
										/>
									{/if}
								{/each}
							{:else}
								<!-- Legacy Text Content -->
								<div class="relative group">
									<div
										class="
										{message.role === 'user'
											? 'bg-green-500 text-white rounded-2xl rounded-br-md'
											: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-700'}
										px-4 py-3 shadow-sm
									"
									>
										<div class="text-sm leading-relaxed whitespace-pre-wrap">
											{@html message.content.replace(/\n/g, "<br>")}
										</div>
									</div>
								</div>
							{/if}

							<!-- Timestamp -->
							{#if message.timestamp}
								<div class="text-xs opacity-70 text-right px-2">
									{message.timestamp.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							{/if}
						</div>

						{#if message.role === "assistant"}
							<div
								class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2"
							>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => onCopyMessage?.(message.id)}
									>
										<Copy class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => onThumbsUp?.(message.id)}
									>
										<ThumbsUp class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => onThumbsDown?.(message.id)}
									>
										<ThumbsDown class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => onPlayAudio?.(message.id)}
									>
										<Volume2 class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => onRegenerate?.(message.id)}
									>
										<RotateCcw class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => onDownload?.(message.id)}
									>
										<Download class="h-3.5 w-3.5" />
									</Button>
								</div>
							{/if}

						{#if message.role === "user"}
							<Avatar class="h-8 w-8 shrink-0 mt-1">
								<AvatarFallback class="bg-green-600 text-white text-sm"
									>U</AvatarFallback
								>
							</Avatar>
						{/if}
					</div>
				{/each}

				<!-- Typing Indicators -->
				{#if typingIndicators.length > 0}
					<TypingIndicator indicators={typingIndicators} showAvatars={true} />
				{/if}
			</div>
		</ScrollArea>
	</div>

	<!-- Input Area -->
	<div class="border-t border-border">
		<!-- File Upload Area -->
		{#if enableFileUpload && (showFileUpload || pendingFiles.length > 0)}
			<div class="p-4 border-b border-gray-200 dark:border-gray-700">
				<FileUpload
					files={pendingFiles}
					{maxFileSize}
					{acceptedFileTypes}
					{disabled}
					onFileSelect={handleFileSelect}
					onFileRemove={handleFileRemove}
					onFilePreview={onFilePreview}
				/>
			</div>
		{/if}

		<div class="p-4">
			<div class="mx-auto max-w-4xl">
				<div class="relative flex items-end gap-2">
					{#if showTools}
						<Button
							variant="ghost"
							size="icon"
							class="mb-2 h-10 w-10 shrink-0"
							onclick={onToolsClick}
						>
							<Plus class="h-5 w-5" />
						</Button>
					{/if}

					<div class="relative flex-1">
						<Textarea
							bind:value={inputValue}
							{placeholder}
							{disabled}
							onkeydown={handleKeydown}
							oninput={handleInput}
							class="min-h-[52px] resize-none pr-32"
							rows={1}
						/>

						<div class="absolute bottom-2 right-2 flex items-center gap-1">
							{#if enableFileUpload}
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8"
									onclick={() => showFileUpload = !showFileUpload}
									title="Attach files"
								>
									<Paperclip class="h-4 w-4" />
								</Button>
							{/if}

							{#if showTools}
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8"
									onclick={onToolsClick}
								>
									<Settings class="h-4 w-4" />
								</Button>
							{/if}

							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={toggleRecording}
							>
								{#if isRecording}
									<MicOff class="h-4 w-4 text-red-400" />
								{:else}
									<Mic class="h-4 w-4" />
								{/if}
							</Button>

							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={handleSend}
								disabled={(!inputValue.trim() && pendingFiles.length === 0) || disabled}
							>
								<Send class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

			<div class="mt-2 text-center text-xs text-gray-500">
				ChatGPT can make mistakes. Check important info.
			</div>
		</div>
	</div>
</div>
