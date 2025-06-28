<script lang="ts">
	import ChatView from "$lib/components/chat-view/chat-view.svelte";
	import type { ChatMessage, ContentPart } from "$lib/components/chat-view/schemas/chat.js";
	import {
		validateChatMessage,
		createValidatedMessage,
		formatValidationErrors
	} from "$lib/components/chat-view/utils/validation.js";

	let messages = $state<ChatMessage[]>([
		{
			id: "1",
			role: "assistant",
			content: [
				{
					type: "text",
					text: "Hello! 😊\n\nWelcome to the enhanced AI Chat Interface! I now support:"
				},
				{
					type: "text",
					text: "• **Multi-modal content** (text, images, documents, code)\n• **File uploads** with drag & drop\n• **Real-time typing indicators**\n• **Message threading**\n• **Conversation export/import**\n• **Interactive code canvas**"
				}
			],
			timestamp: new Date(),
		},
		{
			id: "2",
			role: "assistant",
			content: [
				{
					type: "text",
					text: "Here's an example of code I can display:"
				},
				{
					type: "code",
					code: `function greetUser(name: string): string {
  return \`Hello, \${name}! Welcome to the AI UI Kit.\`;
}

// Usage example
const greeting = greetUser("Developer");
console.log(greeting);`,
					language: "typescript",
					filename: "greeting.ts",
					editable: true
				}
			],
			timestamp: new Date(),
		}
	]);

	let typingIndicators = $state([]);
	let fileUploads = $state([]);
	let threads = $state([
		{
			id: "thread-1",
			title: "Getting Started",
			created_at: new Date(Date.now() - 86400000), // 1 day ago
			updated_at: new Date(),
			message_count: 3,
			participants: ["1", "2"]
		},
		{
			id: "thread-2",
			title: "Feature Discussion",
			created_at: new Date(Date.now() - 3600000), // 1 hour ago
			updated_at: new Date(Date.now() - 1800000), // 30 min ago
			message_count: 8,
			participants: ["1", "2", "3"]
		}
	]);

	function handleSendMessage(message: string | ContentPart[]) {
		// Create and validate user message using Zod
		const messageData = {
			id: Date.now().toString(),
			role: "user" as const,
			content: message,
			timestamp: new Date(),
		};

		const validation = validateChatMessage(messageData);
		if (!validation.success) {
			console.error('Message validation failed:', formatValidationErrors(validation.errors || []));
			// In a real app, show user-friendly error message
			return;
		}

		const userMessage = validation.data!;
		messages = [...messages, userMessage];

		// Simulate AI response
		setTimeout(() => {
			const aiMessage: ChatMessage = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: `You said: "${message}"\n\nThis is a demo response from the AI assistant. In a real implementation, this would be connected to an actual AI service.`,
				timestamp: new Date(),
			};
			messages = [...messages, aiMessage];
		}, 1000);
	}

	function handleCopyMessage(messageId: string) {
		const message = messages.find((m) => m.id === messageId);
		if (message) {
			navigator.clipboard.writeText(message.content);
			console.log("Message copied to clipboard");
		}
	}

	function handleThumbsUp(messageId: string) {
		console.log("Thumbs up for message:", messageId);
	}

	function handleThumbsDown(messageId: string) {
		console.log("Thumbs down for message:", messageId);
	}

	function handlePlayAudio(messageId: string) {
		console.log("Play audio for message:", messageId);
	}

	function handleRegenerate(messageId: string) {
		console.log("Regenerate message:", messageId);
	}

	function handleDownload(messageId: string) {
		console.log("Download message:", messageId);
	}

	function handleToolsClick() {
		console.log("Tools clicked");
	}

	function handleCallClick() {
		console.log("Call clicked");
	}

	function handleSearchClick() {
		console.log("Search clicked");
	}

	function handleMoreClick() {
		console.log("More clicked");
	}

	function handleSendFiles(files: File[]) {
		// Simulate file processing
		files.forEach(file => {
			const fileMessage: ChatMessage = {
				id: Date.now().toString() + Math.random(),
				role: "user",
				content: [
					{
						type: "text",
						text: `Uploaded file: ${file.name}`
					},
					{
						type: "file",
						source: { file_id: `file_${Date.now()}` },
						media_type: file.type,
						filename: file.name,
						size: file.size
					}
				],
				timestamp: new Date()
			};
			messages = [...messages, fileMessage];
		});
	}

	function handleTypingStart() {
		console.log("User started typing");
	}

	function handleTypingStop() {
		console.log("User stopped typing");
	}

	function handleExportConversation() {
		console.log("Exporting conversation...");
		// In a real app, this would trigger the export
	}

	function handleImportConversation(data: any) {
		console.log("Importing conversation:", data);
		// In a real app, this would process the imported data
	}
</script>

<svelte:head>
	<title>Chat View Demo</title>
</svelte:head>

<div class="h-screen">
	<ChatView
		{messages}
		{threads}
		{typingIndicators}
		{fileUploads}
		chatTitle="Enhanced AI Chat Demo"
		participants={[
			{ id: "1", name: "Fernando", isOnline: true },
			{ id: "2", name: "~Benko", isOnline: true },
			{ id: "3", name: "Você", isOnline: true },
		]}
		placeholder="Try the new features: upload files, see typing indicators, export conversations..."
		showTools={true}
		enableThreading={true}
		enableFileUpload={true}
		enableCodeCanvas={true}
		enableExport={true}
		maxFileSize={10 * 1024 * 1024}
		acceptedFileTypes={["image/*", "video/*", "audio/*", "text/*", ".pdf", ".doc", ".docx"]}
		onSendMessage={handleSendMessage}
		onSendFiles={handleSendFiles}
		onCopyMessage={handleCopyMessage}
		onThumbsUp={handleThumbsUp}
		onThumbsDown={handleThumbsDown}
		onPlayAudio={handlePlayAudio}
		onRegenerate={handleRegenerate}
		onDownload={handleDownload}
		onToolsClick={handleToolsClick}
		onCallClick={handleCallClick}
		onSearchClick={handleSearchClick}
		onMoreClick={handleMoreClick}
		onTypingStart={handleTypingStart}
		onTypingStop={handleTypingStop}
		onExportConversation={handleExportConversation}
		onImportConversation={handleImportConversation}
	/>
</div>
