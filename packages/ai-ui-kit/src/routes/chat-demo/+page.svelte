<script lang="ts">
	import ChatView from '$lib/components/chat-view.svelte';
	import type { ChatMessage } from '$lib/components/chat-view.svelte';

	let messages: ChatMessage[] = [
		{
			id: "1",
			role: "assistant",
			content: "Hello! 😊\n\nHow can I help you today?",
			timestamp: new Date()
		}
	];

	function handleSendMessage(message: string) {
		// Add user message
		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			content: message,
			timestamp: new Date()
		};
		messages = [...messages, userMessage];

		// Simulate AI response
		setTimeout(() => {
			const aiMessage: ChatMessage = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: `You said: "${message}"\n\nThis is a demo response from the AI assistant. In a real implementation, this would be connected to an actual AI service.`,
				timestamp: new Date()
			};
			messages = [...messages, aiMessage];
		}, 1000);
	}

	function handleCopyMessage(messageId: string) {
		const message = messages.find(m => m.id === messageId);
		if (message) {
			navigator.clipboard.writeText(message.content);
			console.log('Message copied to clipboard');
		}
	}

	function handleThumbsUp(messageId: string) {
		console.log('Thumbs up for message:', messageId);
	}

	function handleThumbsDown(messageId: string) {
		console.log('Thumbs down for message:', messageId);
	}

	function handlePlayAudio(messageId: string) {
		console.log('Play audio for message:', messageId);
	}

	function handleRegenerate(messageId: string) {
		console.log('Regenerate message:', messageId);
	}

	function handleDownload(messageId: string) {
		console.log('Download message:', messageId);
	}

	function handleToolsClick() {
		console.log('Tools clicked');
	}
</script>

<svelte:head>
	<title>Chat View Demo</title>
</svelte:head>

<div class="h-screen">
	<ChatView
		{messages}
		placeholder="Ask anything"
		showTools={true}
		onSendMessage={handleSendMessage}
		onCopyMessage={handleCopyMessage}
		onThumbsUp={handleThumbsUp}
		onThumbsDown={handleThumbsDown}
		onPlayAudio={handlePlayAudio}
		onRegenerate={handleRegenerate}
		onDownload={handleDownload}
		onToolsClick={handleToolsClick}
	/>
</div>
