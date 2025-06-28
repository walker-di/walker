<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar/index.js";
	import FileUpload from "./components/file-upload.svelte";
	import ImagePreview from "./components/image-preview.svelte";
	import DocumentPreview from "./components/document-preview.svelte";
	import CodeCanvas from "./components/code-canvas.svelte";
	import TypingIndicator from "./components/typing-indicator.svelte";
	import MessageThread from "./components/message-thread.svelte";
	import ConversationManager from "./components/conversation-manager.svelte";

	// Types
	import type { ChatViewProps } from "$lib/components/chat-view/types/chat.js";

	// View Model
	import { ChatViewModel } from "./chat-view-model.svelte.js";

	// Helper function to check if message has multi-modal content
	function isMultiModal(message: any): boolean {
		return Array.isArray(message.content);
	}

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
	import { onDestroy } from "svelte";

	let props: ChatViewProps = $props();

	// Create view model instance
	const chatViewModel = new ChatViewModel(props);

	// Update view model when props change
	$effect(() => {
		chatViewModel.updateProps(props);
	});

	// Cleanup on destroy
	onDestroy(() => {
		chatViewModel.destroy();
	});
</script>

<div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-foreground">
	<!-- Threading Sidebar -->
	{#if props.enableThreading && props.threads && props.threads.length > 0}
		<MessageThread
			threads={props.threads}
			activeThreadId={props.activeThreadId}
			messages={props.messages || []}
			onCreateThread={props.onCreateThread}
			onSwitchThread={props.onSwitchThread}
			onDeleteThread={props.onDeleteThread}
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
					<h1 class="text-lg font-semibold text-white">
						{props.chatTitle || "Chat"}
					</h1>
					<div class="flex items-center gap-1 text-sm text-gray-300">
						{#each props.participants || [] as participant, index}
							<span class="flex items-center gap-1">
								{participant.name}
								{#if participant.isOnline}
									<div class="w-2 h-2 bg-green-400 rounded-full"></div>
								{/if}
							</span>
							{#if index < (props.participants || []).length - 1}
								<span class="text-gray-400">,</span>
							{/if}
						{/each}
					</div>
				</div>
			</div>

			<div class="flex items-center gap-2">
				{#if props.enableExport}
					<ConversationManager
						messages={props.messages || []}
						participants={props.participants || []}
						threads={props.threads || []}
						conversationTitle={props.chatTitle || "Chat"}
						onExportConversation={props.onExportConversation}
						onImportConversation={props.onImportConversation}
					/>
				{/if}

				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
					onclick={props.onCallClick}
				>
					<Phone class="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
					onclick={props.onSearchClick}
				>
					<Search class="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
					onclick={props.onMoreClick}
				>
					<MoreVertical class="h-4 w-4" />
				</Button>
			</div>
		</div>

		<!-- Messages Area -->
		<div class="flex-1 overflow-hidden">
			<ScrollArea class="h-full">
				<div class="space-y-4 p-6">
					{#each chatViewModel.displayMessages as message (message.id)}
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
								{#if isMultiModal(message)}
									{#each message.content as part}
										{#if typeof part === "object" && part.type === "text"}
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
													<div
														class="text-sm leading-relaxed whitespace-pre-wrap"
													>
														{@html part.text.replace(/\n/g, "<br>")}
													</div>
												</div>
											</div>
										{:else if typeof part === "object" && part.type === "image"}
											<!-- Image Content -->
											<ImagePreview
												image={part}
												showControls={true}
												showMetadata={false}
												onDownload={() => props.onDownload?.(message.id)}
											/>
										{:else if typeof part === "object" && part.type === "file"}
											<!-- Document Content -->
											<DocumentPreview
												document={part}
												showControls={true}
												showMetadata={true}
												onDownload={() => props.onDownload?.(message.id)}
												onPreview={() =>
													props.onFilePreview?.(part.source?.file_id || "")}
											/>
										{:else if typeof part === "object" && part.type === "code" && props.enableCodeCanvas}
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
												{@html String(message.content).replace(/\n/g, "<br>")}
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
										onclick={() => props.onCopyMessage?.(message.id)}
									>
										<Copy class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => props.onThumbsUp?.(message.id)}
									>
										<ThumbsUp class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => props.onThumbsDown?.(message.id)}
									>
										<ThumbsDown class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => props.onPlayAudio?.(message.id)}
									>
										<Volume2 class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => props.onRegenerate?.(message.id)}
									>
										<RotateCcw class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
										onclick={() => props.onDownload?.(message.id)}
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
					{#if props.typingIndicators && props.typingIndicators.length > 0}
						<TypingIndicator
							indicators={props.typingIndicators}
							showAvatars={true}
						/>
					{/if}
				</div>
			</ScrollArea>
		</div>

		<!-- Input Area -->
		<div class="border-t border-border">
			<!-- File Upload Area -->
			{#if props.enableFileUpload && (chatViewModel.showFileUpload || chatViewModel.pendingFiles.length > 0)}
				<div class="p-4 border-b border-gray-200 dark:border-gray-700">
					<FileUpload
						files={chatViewModel.pendingFiles}
						maxFileSize={props.maxFileSize || 10 * 1024 * 1024}
						acceptedFileTypes={props.acceptedFileTypes || [
							"image/*",
							"video/*",
							"audio/*",
							"text/*",
							".pdf",
						]}
						disabled={props.disabled || false}
						onFileSelect={chatViewModel.handleFileSelect.bind(chatViewModel)}
						onFileRemove={chatViewModel.handleFileRemove.bind(chatViewModel)}
						onFilePreview={props.onFilePreview}
					/>
				</div>
			{/if}

			<div class="p-4">
				<div class="mx-auto max-w-4xl">
					<div class="relative flex items-end gap-2">
						{#if props.showTools}
							<Button
								variant="ghost"
								size="icon"
								class="mb-2 h-10 w-10 shrink-0"
								onclick={props.onToolsClick}
							>
								<Plus class="h-5 w-5" />
							</Button>
						{/if}

						<div class="relative flex-1">
							<Textarea
								bind:value={chatViewModel.inputValue}
								placeholder={props.placeholder || "Ask anything"}
								disabled={props.disabled || false}
								onkeydown={chatViewModel.handleKeydown.bind(chatViewModel)}
								oninput={chatViewModel.handleInput.bind(chatViewModel)}
								class="min-h-[52px] resize-none pr-32"
								rows={1}
							/>

							<div class="absolute bottom-2 right-2 flex items-center gap-1">
								{#if props.enableFileUpload}
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={chatViewModel.toggleFileUpload.bind(chatViewModel)}
										title="Attach files"
									>
										<Paperclip class="h-4 w-4" />
									</Button>
								{/if}

								{#if props.showTools}
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={props.onToolsClick}
									>
										<Settings class="h-4 w-4" />
									</Button>
								{/if}

								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8"
									onclick={chatViewModel.toggleRecording.bind(chatViewModel)}
								>
									{#if chatViewModel.isRecording}
										<MicOff class="h-4 w-4 text-red-400" />
									{:else}
										<Mic class="h-4 w-4" />
									{/if}
								</Button>

								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8"
									onclick={chatViewModel.handleSend.bind(chatViewModel)}
									disabled={!chatViewModel.canSend}
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
