<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar/index.js";

	// Types
	import type {
		ChatMessage,
		ChatParticipant,
		ChatViewProps,
	} from "$lib/components/chat-view/types/index.js";

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
		onSendMessage,
		onCopyMessage,
		onThumbsUp,
		onThumbsDown,
		onPlayAudio,
		onRegenerate,
		onDownload,
		onToolsClick,
		onCallClick,
		onSearchClick,
		onMoreClick,
	}: ChatViewProps = $props();

	let inputValue = $state("");
	let isRecording = $state(false);

	function handleSend() {
		if (inputValue.trim() && !disabled) {
			onSendMessage?.(inputValue.trim());
			inputValue = "";
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}

	function toggleRecording() {
		isRecording = !isRecording;
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

<div class="flex h-screen flex-col bg-gray-50 dark:bg-gray-900 text-foreground">
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
							<!-- Message Bubble -->
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

									{#if message.timestamp}
										<div class="text-xs opacity-70 mt-1 text-right">
											{message.timestamp.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									{/if}
								</div>

								<!-- Message tail/pointer -->
								{#if message.role === "user"}
									<div
										class="absolute -bottom-0 -right-0 w-0 h-0 border-l-[8px] border-l-green-500 border-t-[8px] border-t-transparent"
									></div>
								{:else}
									<div
										class="absolute -bottom-0 -left-0 w-0 h-0 border-r-[8px] border-r-white dark:border-r-gray-800 border-t-[8px] border-t-transparent"
									></div>
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
						</div>

						{#if message.role === "user"}
							<Avatar class="h-8 w-8 shrink-0 mt-1">
								<AvatarFallback class="bg-green-600 text-white text-sm"
									>U</AvatarFallback
								>
							</Avatar>
						{/if}
					</div>
				{/each}
			</div>
		</ScrollArea>
	</div>

	<!-- Input Area -->
	<div class="border-t border-border p-4">
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
						class="min-h-[52px] resize-none pr-20"
						rows={1}
					/>

					<div class="absolute bottom-2 right-2 flex items-center gap-1">
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
							disabled={!inputValue.trim() || disabled}
						>
							<Send class="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<div class="mt-2 text-center text-xs text-gray-500">
				ChatGPT can make mistakes. Check important info.
			</div>
		</div>
	</div>
</div>
