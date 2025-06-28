<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import ChatView from "../lib/components/chat-view/chat-view.svelte";
	import { fn } from "storybook/test";

	// Mock functions with console logging for better debugging
	const createMockHandler = (name: string) =>
		fn().mockImplementation((...args: any[]) => {
			console.log(`${name} called with:`, args);
		});

	// Sample conversation data
	const sampleConversation = {
		version: "1.0",
		conversation_id: "sample-123",
		title: "Sample Conversation",
		created_at: new Date(),
		exported_at: new Date(),
		participants: [
			{ id: "user", name: "User", isOnline: true },
			{ id: "assistant", name: "AI Assistant", isOnline: true },
		],
		messages: [
			{
				id: "1",
				role: "assistant",
				content: "Hello! I'm your AI assistant. How can I help you today?",
				timestamp: new Date(),
			},
			{
				id: "2",
				role: "user",
				content: "Can you help me understand React hooks?",
				timestamp: new Date(),
			},
		],
	};

	const { Story } = defineMeta({
		title: "AI UI Kit/ChatView",
		component: ChatView,
		tags: ["autodocs"],
		parameters: {
			layout: "fullscreen",
			docs: {
				description: {
					component:
						"A comprehensive chat interface component with support for multi-modal content, file uploads, conversation management, and more.",
				},
			},
		},

		argTypes: {
			// Basic Props
			messages: {
				control: "object",
				description: "Array of chat messages to display",
			},
			placeholder: {
				control: "text",
				description: "Placeholder text for the message input field",
			},
			disabled: {
				control: "boolean",
				description: "Whether the chat input is disabled",
			},
			showTools: {
				control: "boolean",
				description: "Whether to show the tools/settings buttons",
			},
			chatTitle: {
				control: "text",
				description: "Title displayed in the chat header",
			},
			participants: {
				control: "object",
				description: "Array of chat participants with online status",
			},

			// Feature Toggles
			enableThreading: {
				control: "boolean",
				description: "Enable conversation threading functionality",
			},
			enableFileUpload: {
				control: "boolean",
				description: "Enable file upload functionality",
			},
			enableCodeCanvas: {
				control: "boolean",
				description: "Enable interactive code editing in messages",
			},
			enableExport: {
				control: "boolean",
				description: "Enable conversation export/import functionality",
			},

			// File Upload Settings
			maxFileSize: {
				control: "number",
				description: "Maximum file size in bytes (default: 10MB)",
			},
			acceptedFileTypes: {
				control: "object",
				description: "Array of accepted file types/MIME types",
			},

			// Threading
			threads: {
				control: "object",
				description: "Array of conversation threads",
			},
			activeThreadId: {
				control: "text",
				description: "ID of the currently active thread",
			},

			// Real-time Features
			typingIndicators: {
				control: "object",
				description: "Array of typing indicators for participants",
			},
		},

		args: {
			// Message handlers
			onSendMessage: createMockHandler("onSendMessage"),
			onSendFiles: createMockHandler("onSendFiles"),
			onCopyMessage: createMockHandler("onCopyMessage"),
			onThumbsUp: createMockHandler("onThumbsUp"),
			onThumbsDown: createMockHandler("onThumbsDown"),
			onPlayAudio: createMockHandler("onPlayAudio"),
			onRegenerate: createMockHandler("onRegenerate"),
			onDownload: createMockHandler("onDownload"),

			// UI handlers
			onToolsClick: createMockHandler("onToolsClick"),
			onCallClick: createMockHandler("onCallClick"),
			onSearchClick: createMockHandler("onSearchClick"),
			onMoreClick: createMockHandler("onMoreClick"),

			// Real-time handlers
			onTypingStart: createMockHandler("onTypingStart"),
			onTypingStop: createMockHandler("onTypingStop"),

			// Export/Import handlers with sample data
			onExportConversation: createMockHandler(
				"onExportConversation",
			).mockImplementation(() => {
				const dataStr = JSON.stringify(sampleConversation, null, 2);
				const dataBlob = new Blob([dataStr], { type: "application/json" });
				const url = URL.createObjectURL(dataBlob);
				const link = document.createElement("a");
				link.href = url;
				link.download = "conversation-export.json";
				link.click();
				URL.revokeObjectURL(url);
				console.log("Conversation exported!");
			}),
			onImportConversation: createMockHandler(
				"onImportConversation",
			).mockImplementation((data) => {
				console.log("Importing conversation:", data);
				alert("Conversation imported successfully!");
			}),

			// Threading handlers
			onCreateThread: createMockHandler("onCreateThread"),
			onSwitchThread: createMockHandler("onSwitchThread"),
			onDeleteThread: createMockHandler("onDeleteThread"),

			// File handlers
			onFileUpload: createMockHandler("onFileUpload").mockImplementation(
				async (file) => {
					console.log("Uploading file:", file.name);
					// Simulate upload delay
					await new Promise((resolve) => setTimeout(resolve, 1000));
					return {
						id: crypto.randomUUID(),
						file,
						status: "uploaded",
						progress: 100,
						url: URL.createObjectURL(file),
					};
				},
			),
			onFileRemove: createMockHandler("onFileRemove"),
			onFilePreview: createMockHandler("onFilePreview"),
		},
	});
</script>

<!-- Default story with sample conversation -->
<Story
	name="Default"
	args={{
		placeholder: "Ask anything",
		showTools: true,
		enableExport: true,
		enableFileUpload: true,
		enableCodeCanvas: true,
		chatTitle: "AI Assistant",
		participants: [
			{ id: "user", name: "You", isOnline: true },
			{ id: "assistant", name: "AI Assistant", isOnline: true },
		],
		messages: [
			{
				id: "1",
				role: "assistant",
				content: "Hello! 😊\n\nHow can I help you today?",
				timestamp: new Date(),
			},
			{
				id: "2",
				role: "user",
				content: "Can you explain what a chat interface is?",
				timestamp: new Date(),
			},
			{
				id: "3",
				role: "assistant",
				content:
					"A chat interface is a user interface design pattern that allows users to interact with a system through conversational exchanges. It typically includes:\n\n• **Message display area** - Shows the conversation history\n• **Input field** - Where users type their messages\n• **Send button** - To submit messages\n• **Action buttons** - For additional features like copy, like/dislike, etc.\n\nChat interfaces are commonly used in messaging apps, customer support systems, and AI assistants like this one!",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Export/Import Showcase -->
<Story
	name="Export & Import Features"
	args={{
		placeholder: "Try the export/import buttons in the header!",
		showTools: true,
		enableExport: true,
		enableFileUpload: true,
		chatTitle: "Export Demo",
		participants: [
			{ id: "user", name: "Demo User", isOnline: true },
			{ id: "assistant", name: "Export Assistant", isOnline: true },
		],
		messages: [
			{
				id: "1",
				role: "assistant",
				content:
					"👋 Welcome to the Export/Import demo!\n\nYou can:\n• **Export** this conversation using the download button in the header\n• **Import** a conversation file\n• **Copy** individual messages\n• **Download** message content\n\nTry clicking the buttons to see them in action!",
				timestamp: new Date(),
			},
			{
				id: "2",
				role: "user",
				content: "This is great! I can export our entire conversation.",
				timestamp: new Date(),
			},
			{
				id: "3",
				role: "assistant",
				content:
					'Exactly! The export feature creates a JSON file with:\n\n```json\n{\n  "version": "1.0",\n  "conversation_id": "unique-id",\n  "title": "Conversation Title",\n  "participants": [...],\n  "messages": [...],\n  "created_at": "timestamp",\n  "exported_at": "timestamp"\n}\n```\n\nThis makes it easy to backup, share, or migrate conversations!',
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Empty state -->
<Story
	name="Empty State"
	args={{
		placeholder: "Start a conversation...",
		showTools: true,
		enableExport: true,
		enableFileUpload: true,
		chatTitle: "New Conversation",
		participants: [{ id: "user", name: "You", isOnline: true }],
		messages: [],
	}}
/>

<!-- File Upload Demo -->
<Story
	name="File Upload Features"
	args={{
		placeholder: "Try uploading files using the paperclip button!",
		showTools: true,
		enableFileUpload: true,
		enableExport: true,
		chatTitle: "File Upload Demo",
		maxFileSize: 5 * 1024 * 1024, // 5MB
		acceptedFileTypes: [
			"image/*",
			"video/*",
			"audio/*",
			"text/*",
			".pdf",
			".doc",
			".docx",
		],
		participants: [
			{ id: "user", name: "You", isOnline: true },
			{ id: "assistant", name: "File Assistant", isOnline: true },
		],
		messages: [
			{
				id: "1",
				role: "assistant",
				content:
					"📎 **File Upload Demo**\n\nYou can upload various types of files:\n• **Images** - jpg, png, gif, webp\n• **Videos** - mp4, webm, mov\n• **Audio** - mp3, wav, ogg\n• **Documents** - pdf, doc, docx\n• **Text files** - txt, md, json\n\nClick the paperclip button in the input area to try it out!",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Typing Indicators -->
<Story
	name="Typing Indicators"
	args={{
		placeholder: "Others are typing...",
		showTools: true,
		enableExport: true,
		chatTitle: "Team Chat",
		participants: [
			{ id: "user", name: "You", isOnline: true },
			{ id: "alice", name: "Alice", isOnline: true, isTyping: true },
			{ id: "bob", name: "Bob", isOnline: true },
		],
		typingIndicators: [
			{
				participant_id: "alice",
				participant_name: "Alice",
				timestamp: new Date(),
			},
		],
		messages: [
			{
				id: "1",
				role: "user",
				content: "Hey team, how's everyone doing?",
				timestamp: new Date(),
			},
			{
				id: "2",
				role: "assistant",
				content:
					"Great! Working on the new features. Alice is typing a response...",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Disabled state -->
<Story
	name="Disabled State"
	args={{
		placeholder: "Chat is currently disabled",
		disabled: true,
		showTools: false,
		enableExport: false,
		enableFileUpload: false,
		chatTitle: "Maintenance Mode",
		participants: [{ id: "system", name: "System", isOnline: false }],
		messages: [
			{
				id: "1",
				role: "assistant",
				content:
					"🚧 **System Maintenance**\n\nI'm currently unavailable due to scheduled maintenance. Please try again later.\n\nExpected downtime: 30 minutes",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Minimal Interface -->
<Story
	name="Minimal Interface"
	args={{
		placeholder: "Type your message...",
		showTools: false,
		enableExport: false,
		enableFileUpload: false,
		enableCodeCanvas: false,
		chatTitle: "Simple Chat",
		participants: [
			{ id: "user", name: "User", isOnline: true },
			{ id: "bot", name: "Bot", isOnline: true },
		],
		messages: [
			{
				id: "1",
				role: "assistant",
				content:
					"This is a simplified chat interface with minimal features enabled.",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Custom Header -->
<Story
	name="Custom Header"
	args={{
		chatTitle: "Team Discussion",
		participants: [
			{ id: "1", name: "Alice", isOnline: true },
			{ id: "2", name: "Bob", isOnline: false },
			{ id: "3", name: "Charlie", isOnline: true },
			{ id: "4", name: "You", isOnline: true },
		],
		placeholder: "Type your message...",
		showTools: true,
		messages: [
			{
				id: "1",
				role: "user",
				content: "Hey everyone! How's the project going?",
				timestamp: new Date(),
			},
			{
				id: "2",
				role: "assistant",
				content:
					"Great! We've made significant progress on the UI components. The new chat header looks much better now.",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Waalkers Example -->
<Story
	name="Waalkers Chat"
	args={{
		chatTitle: "Waalkers",
		participants: [
			{ id: "1", name: "Fernando", isOnline: true },
			{ id: "2", name: "~Benko", isOnline: true },
			{ id: "3", name: "Você", isOnline: true },
		],
		placeholder: "Digite sua mensagem...",
		showTools: true,
		messages: [
			{
				id: "1",
				role: "assistant",
				content: "Olá! Como posso ajudar vocês hoje?",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Long conversation -->
<Story
	name="Long Conversation"
	args={{
		placeholder: "Continue the conversation...",
		showTools: true,
		messages: [
			{
				id: "1",
				role: "user",
				content: "What's the weather like today?",
				timestamp: new Date(),
			},
			{
				id: "2",
				role: "assistant",
				content:
					"I don't have access to real-time weather data, but I can help you understand how to check the weather! You can:\n\n1. Check your phone's built-in weather app\n2. Visit weather.com or weather.gov\n3. Ask a voice assistant like Siri or Google Assistant\n4. Look outside your window\n\nIs there anything specific about weather you'd like to know?",
				timestamp: new Date(),
			},
			{
				id: "3",
				role: "user",
				content: "How do weather forecasts work?",
				timestamp: new Date(),
			},
			{
				id: "4",
				role: "assistant",
				content:
					"Weather forecasting is a fascinating blend of science and technology! Here's how it works:\n\n## Data Collection\n• **Weather stations** around the world collect temperature, humidity, pressure, and wind data\n• **Satellites** monitor cloud patterns and atmospheric conditions from space\n• **Weather balloons** measure conditions in the upper atmosphere\n• **Radar systems** track precipitation and storm movements\n\n## Computer Models\nMeteorologists use powerful computer models that:\n• Process millions of data points\n• Apply physics equations to predict atmospheric behavior\n• Run multiple scenarios to account for uncertainty\n\n## Human Analysis\nExperienced meteorologists interpret the model data and add local knowledge to create the final forecast.\n\nThe accuracy decreases over time - forecasts are quite reliable for 3-5 days, but become less accurate beyond a week!",
				timestamp: new Date(),
			},
			{
				id: "5",
				role: "user",
				content:
					"That's really interesting! Can you tell me more about weather satellites?",
				timestamp: new Date(),
			},
			{
				id: "6",
				role: "assistant",
				content:
					"Weather satellites are incredible pieces of technology! There are two main types:\n\n## Geostationary Satellites\n• Orbit at 22,236 miles above Earth\n• Stay fixed over one location\n• Provide continuous monitoring of weather patterns\n• Examples: GOES satellites used by NOAA\n\n## Polar-Orbiting Satellites\n• Orbit much closer to Earth (500-800 miles)\n• Circle the planet every 90-120 minutes\n• Provide detailed global coverage\n• Better for long-term climate monitoring\n\n## What They Measure\n• **Visible light** - Cloud formations and surface features\n• **Infrared radiation** - Temperature of clouds and surface\n• **Water vapor** - Humidity levels in the atmosphere\n• **Lightning** - Storm intensity and location\n\nThese satellites have revolutionized weather prediction and help save countless lives by providing early warning for severe weather events!",
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Multi-modal Content -->
<Story
	name="Multi-modal Content"
	args={{
		placeholder: "Try sending multi-modal content...",
		showTools: true,
		enableCodeCanvas: true,
		enableFileUpload: true,
		messages: [
			{
				id: "1",
				role: "assistant",
				content: [
					{
						type: "text",
						text: "Here's a complete example of a React component with TypeScript:",
					},
					{
						type: "code",
						code: `import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  step = 1
}) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <div className="buttons">
        <button onClick={decrement}>-{step}</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+{step}</button>
      </div>
    </div>
  );
};

export default Counter;`,
						language: "typescript",
						filename: "Counter.tsx",
						editable: true,
					},
					{
						type: "text",
						text: "This component demonstrates:\n• TypeScript interfaces for props\n• React hooks (useState)\n• Event handlers\n• Conditional rendering\n• Default parameters",
					},
				],
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Threading Demo -->
<Story
	name="Threading Features"
	args={{
		placeholder: "Try creating threads from messages...",
		showTools: true,
		enableThreading: true,
		enableExport: true,
		chatTitle: "Project Discussion",
		participants: [
			{ id: "user", name: "You", isOnline: true },
			{ id: "alice", name: "Alice", isOnline: true },
			{ id: "bob", name: "Bob", isOnline: true },
		],
		threads: [
			{
				id: "thread-1",
				title: "UI Components",
				created_at: new Date(),
				updated_at: new Date(),
				message_count: 5,
				participants: ["user", "alice"],
			},
			{
				id: "thread-2",
				title: "Backend API",
				created_at: new Date(),
				updated_at: new Date(),
				message_count: 3,
				participants: ["user", "bob"],
			},
		],
		activeThreadId: "thread-1",
		messages: [
			{
				id: "1",
				role: "user",
				content: "Let's discuss the new UI components for the chat interface.",
				timestamp: new Date(),
				thread_id: "thread-1",
			},
			{
				id: "2",
				role: "assistant",
				content:
					"Great idea! I think we should focus on:\n\n1. **Message threading** - For organizing conversations\n2. **File attachments** - For sharing documents and media\n3. **Export/Import** - For conversation backup\n4. **Real-time indicators** - For typing status\n\nWhat do you think about the priority order?",
				timestamp: new Date(),
				thread_id: "thread-1",
			},
		],
	}}
/>

<!-- Advanced Multi-modal -->
<Story
	name="Advanced Multi-modal"
	args={{
		placeholder: "Experience rich multi-modal content...",
		showTools: true,
		enableCodeCanvas: true,
		enableFileUpload: true,
		enableExport: true,
		chatTitle: "Multi-modal Demo",
		participants: [
			{ id: "user", name: "Developer", isOnline: true },
			{ id: "assistant", name: "Code Assistant", isOnline: true },
		],
		messages: [
			{
				id: "1",
				role: "assistant",
				content: [
					{
						type: "text",
						text: "🎨 **Multi-modal Content Demo**\n\nThis chat supports various content types:",
					},
					{
						type: "text",
						text: "**1. Rich Text with Markdown**\n• *Italic text*\n• **Bold text**\n• `Inline code`\n• [Links](https://example.com)\n• Lists and formatting",
					},
					{
						type: "code",
						code: `// 2. Interactive Code Blocks
function createChatMessage(content, role = 'user') {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
    metadata: {
      source: 'chat-interface',
      version: '1.0'
    }
  };
}

// Try editing this code!
const message = createChatMessage('Hello, world!');
console.log(message);`,
						language: "javascript",
						filename: "chat-utils.js",
						editable: true,
					},
					{
						type: "text",
						text: "**3. File Attachments**\nYou can upload and share:\n• Images and media files\n• Documents (PDF, Word, etc.)\n• Code files\n• Any other file type\n\n**4. Export/Import**\nSave and restore entire conversations as JSON files.",
					},
				],
				timestamp: new Date(),
			},
			{
				id: "2",
				role: "user",
				content: "This is amazing! The code editor is fully functional.",
				timestamp: new Date(),
			},
			{
				id: "3",
				role: "assistant",
				content: [
					{
						type: "text",
						text: "Exactly! Here's a more complex example with TypeScript:",
					},
					{
						type: "code",
						code: `interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | ContentPart[];
  timestamp: Date;
  thread_id?: string;
  metadata?: Record<string, any>;
}

interface ContentPart {
  type: 'text' | 'image' | 'code' | 'file';
  [key: string]: any;
}

class ChatViewModel {
  private messages: ChatMessage[] = [];

  addMessage(content: string | ContentPart[], role: 'user' | 'assistant' = 'user') {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date()
    };

    this.messages.push(message);
    return message;
  }

  exportConversation() {
    return {
      version: '1.0',
      messages: this.messages,
      exported_at: new Date()
    };
  }
}`,
						language: "typescript",
						filename: "chat-types.ts",
						editable: true,
					},
				],
				timestamp: new Date(),
			},
		],
	}}
/>

<!-- Performance Test -->
<Story
	name="Performance Test"
	args={{
		placeholder: "Testing with many messages...",
		showTools: true,
		enableExport: true,
		chatTitle: "Performance Test",
		participants: [
			{ id: "user", name: "Tester", isOnline: true },
			{ id: "assistant", name: "Load Test Bot", isOnline: true },
		],
		messages: Array.from({ length: 50 }, (_, i) => ({
			id: `msg-${i + 1}`,
			role: i % 2 === 0 ? "user" : "assistant",
			content:
				i % 2 === 0
					? `User message ${i + 1}: This is a test message to check performance with many messages in the chat.`
					: `Assistant response ${i + 1}: I understand your message. Here's a detailed response that includes multiple lines of text to simulate realistic conversation content. This helps test scrolling performance and rendering efficiency.\n\nAdditional details:\n• Point 1: Performance testing\n• Point 2: Message rendering\n• Point 3: Scroll behavior\n• Point 4: Memory usage`,
			timestamp: new Date(Date.now() - (50 - i) * 60000), // Messages spread over time
		})),
	}}
/>
