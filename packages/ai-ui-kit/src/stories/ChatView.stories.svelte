<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChatView from '../lib/components/chat-view/chat-view.svelte';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'AI UI Kit/ChatView',
		component: ChatView,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},

		argTypes: {
			messages: {
				control: 'object',
				description: 'Array of chat messages'
			},
			placeholder: {
				control: 'text',
				description: 'Placeholder text for the input'
			},
			disabled: {
				control: 'boolean',
				description: 'Whether the input is disabled'
			},
			showTools: {
				control: 'boolean',
				description: 'Whether to show the tools button'
			}
		},
		args: {
			onSendMessage: fn(),
			onSendFiles: fn(),
			onCopyMessage: fn(),
			onThumbsUp: fn(),
			onThumbsDown: fn(),
			onPlayAudio: fn(),
			onRegenerate: fn(),
			onDownload: fn(),
			onToolsClick: fn(),
			onCallClick: fn(),
			onSearchClick: fn(),
			onMoreClick: fn(),
			onTypingStart: fn(),
			onTypingStop: fn(),
			onExportConversation: fn(),
			onImportConversation: fn(),
			onCreateThread: fn(),
			onSwitchThread: fn(),
			onDeleteThread: fn(),
			onFileUpload: fn(),
			onFileRemove: fn(),
			onFilePreview: fn()
		}
	});
</script>

<!-- Default story with sample conversation -->
<Story
	name="Default"
	args={{
		placeholder: "Ask anything",
		showTools: true,
		messages: [
			{
				id: "1",
				role: "assistant",
				content: "Hello! 😊\n\nHow can I help you today?",
				timestamp: new Date()
			},
			{
				id: "2",
				role: "user",
				content: "Can you explain what a chat interface is?",
				timestamp: new Date()
			},
			{
				id: "3",
				role: "assistant",
				content: "A chat interface is a user interface design pattern that allows users to interact with a system through conversational exchanges. It typically includes:\n\n• **Message display area** - Shows the conversation history\n• **Input field** - Where users type their messages\n• **Send button** - To submit messages\n• **Action buttons** - For additional features like copy, like/dislike, etc.\n\nChat interfaces are commonly used in messaging apps, customer support systems, and AI assistants like this one!",
				timestamp: new Date()
			}
		]
	}}
/>

<!-- Empty state -->
<Story
	name="Empty"
	args={{
		placeholder: "Start a conversation...",
		showTools: true,
		messages: []
	}}
/>

<!-- Disabled state -->
<Story
	name="Disabled"
	args={{
		placeholder: "Chat is currently disabled",
		disabled: true,
		showTools: false,
		messages: [
			{
				id: "1",
				role: "assistant",
				content: "I'm currently unavailable. Please try again later.",
				timestamp: new Date()
			}
		]
	}}
/>

<!-- Without tools -->
<Story
	name="No Tools"
	args={{
		placeholder: "Type your message...",
		showTools: false,
		messages: [
			{
				id: "1",
				role: "assistant",
				content: "This is a simplified chat interface without tool buttons.",
				timestamp: new Date()
			}
		]
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
			{ id: "4", name: "You", isOnline: true }
		],
		placeholder: "Type your message...",
		showTools: true,
		messages: [
			{
				id: "1",
				role: "user",
				content: "Hey everyone! How's the project going?",
				timestamp: new Date()
			},
			{
				id: "2",
				role: "assistant",
				content: "Great! We've made significant progress on the UI components. The new chat header looks much better now.",
				timestamp: new Date()
			}
		]
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
			{ id: "3", name: "Você", isOnline: true }
		],
		placeholder: "Digite sua mensagem...",
		showTools: true,
		messages: [
			{
				id: "1",
				role: "assistant",
				content: "Olá! Como posso ajudar vocês hoje?",
				timestamp: new Date()
			}
		]
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
				timestamp: new Date()
			},
			{
				id: "2",
				role: "assistant",
				content: "I don't have access to real-time weather data, but I can help you understand how to check the weather! You can:\n\n1. Check your phone's built-in weather app\n2. Visit weather.com or weather.gov\n3. Ask a voice assistant like Siri or Google Assistant\n4. Look outside your window\n\nIs there anything specific about weather you'd like to know?",
				timestamp: new Date()
			},
			{
				id: "3",
				role: "user",
				content: "How do weather forecasts work?",
				timestamp: new Date()
			},
			{
				id: "4",
				role: "assistant",
				content: "Weather forecasting is a fascinating blend of science and technology! Here's how it works:\n\n## Data Collection\n• **Weather stations** around the world collect temperature, humidity, pressure, and wind data\n• **Satellites** monitor cloud patterns and atmospheric conditions from space\n• **Weather balloons** measure conditions in the upper atmosphere\n• **Radar systems** track precipitation and storm movements\n\n## Computer Models\nMeteorologists use powerful computer models that:\n• Process millions of data points\n• Apply physics equations to predict atmospheric behavior\n• Run multiple scenarios to account for uncertainty\n\n## Human Analysis\nExperienced meteorologists interpret the model data and add local knowledge to create the final forecast.\n\nThe accuracy decreases over time - forecasts are quite reliable for 3-5 days, but become less accurate beyond a week!",
				timestamp: new Date()
			},
			{
				id: "5",
				role: "user",
				content: "That's really interesting! Can you tell me more about weather satellites?",
				timestamp: new Date()
			},
			{
				id: "6",
				role: "assistant",
				content: "Weather satellites are incredible pieces of technology! There are two main types:\n\n## Geostationary Satellites\n• Orbit at 22,236 miles above Earth\n• Stay fixed over one location\n• Provide continuous monitoring of weather patterns\n• Examples: GOES satellites used by NOAA\n\n## Polar-Orbiting Satellites\n• Orbit much closer to Earth (500-800 miles)\n• Circle the planet every 90-120 minutes\n• Provide detailed global coverage\n• Better for long-term climate monitoring\n\n## What They Measure\n• **Visible light** - Cloud formations and surface features\n• **Infrared radiation** - Temperature of clouds and surface\n• **Water vapor** - Humidity levels in the atmosphere\n• **Lightning** - Storm intensity and location\n\nThese satellites have revolutionized weather prediction and help save countless lives by providing early warning for severe weather events!",
				timestamp: new Date()
			}
		]
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
						text: "Here's a complete example of a React component with TypeScript:"
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
						editable: true
					},
					{
						type: "text",
						text: "This component demonstrates:\n• TypeScript interfaces for props\n• React hooks (useState)\n• Event handlers\n• Conditional rendering\n• Default parameters"
					}
				],
				timestamp: new Date()
			}
		]
	}}
/>
