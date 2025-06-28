<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	
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

	export interface ChatMessage {
		id: string;
		role: "user" | "assistant";
		content: string;
		timestamp?: Date;
	}

	export interface ChatViewProps {
		messages?: ChatMessage[];
		placeholder?: string;
		disabled?: boolean;
		showTools?: boolean;
		onSendMessage?: (message: string) => void;
		onCopyMessage?: (messageId: string) => void;
		onThumbsUp?: (messageId: string) => void;
		onThumbsDown?: (messageId: string) => void;
		onPlayAudio?: (messageId: string) => void;
		onRegenerate?: (messageId: string) => void;
		onDownload?: (messageId: string) => void;
		onToolsClick?: () => void;
	}

	let {
		messages = [],
		placeholder = "Ask anything",
		disabled = false,
		showTools = true,
		onSendMessage,
		onCopyMessage,
		onThumbsUp,
		onThumbsDown,
		onPlayAudio,
		onRegenerate,
		onDownload,
		onToolsClick
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
			timestamp: new Date()
		}
	];

	const displayMessages = messages.length > 0 ? messages : sampleMessages;
</script>

<div class="flex h-screen flex-col bg-background text-foreground">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-border p-4">
		<div class="flex items-center gap-2">
			<h1 class="text-lg font-semibold">Chat</h1>
		</div>
		<div class="flex items-center gap-2">
			<Badge variant="secondary">hello</Badge>
		</div>
	</div>

	<!-- Messages Area -->
	<div class="flex-1 overflow-hidden">
		<ScrollArea class="h-full">
			<div class="space-y-6 p-6">
				{#each displayMessages as message (message.id)}
					<div class="flex gap-4">
						{#if message.role === "assistant"}
							<Avatar class="h-8 w-8 shrink-0">
								<AvatarFallback class="bg-blue-600 text-white text-sm">AI</AvatarFallback>
							</Avatar>
						{/if}
						
						<div class="flex-1 space-y-2">
							<div class="prose prose-invert max-w-none">
								{@html message.content.replace(/\n/g, '<br>')}
							</div>
							
							{#if message.role === "assistant"}
								<div class="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => onCopyMessage?.(message.id)}
									>
										<Copy class="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => onThumbsUp?.(message.id)}
									>
										<ThumbsUp class="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => onThumbsDown?.(message.id)}
									>
										<ThumbsDown class="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => onPlayAudio?.(message.id)}
									>
										<Volume2 class="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => onRegenerate?.(message.id)}
									>
										<RotateCcw class="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => onDownload?.(message.id)}
									>
										<Download class="h-4 w-4" />
									</Button>
								</div>
							{/if}
						</div>
						
						{#if message.role === "user"}
							<Avatar class="h-8 w-8 shrink-0">
								<AvatarFallback class="text-sm">U</AvatarFallback>
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
