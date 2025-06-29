import type { Meta, StoryObj } from '@storybook/svelte';
import CanvasView from './canvas-view.svelte';

const meta = {
	title: 'Components/CanvasView',
	component: CanvasView,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		width: {
			control: { type: 'number', min: 100, max: 4000, step: 10 },
			description: 'Canvas width in pixels'
		},
		height: {
			control: { type: 'number', min: 100, max: 4000, step: 10 },
			description: 'Canvas height in pixels'
		},
		backgroundColor: {
			control: { type: 'color' },
			description: 'Canvas background color'
		},
		hideControls: {
			control: { type: 'boolean' },
			description: 'Hide all canvas controls'
		},
		showSidebar: {
			control: { type: 'boolean' },
			description: 'Show sidebar with tools and options'
		},
		showHeader: {
			control: { type: 'boolean' },
			description: 'Show header with advanced controls'
		},
		canvasDataJson: {
			control: { type: 'text' },
			description: 'Initial canvas data as JSON string'
		}
	},
} satisfies Meta<CanvasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		width: 1920,
		height: 1080,
		backgroundColor: '#f0f0f0',
		hideControls: false,
		showSidebar: true,
		showHeader: true,
		onCanvasChange: (json: string) => {
			console.log('Canvas changed:', json);
		}
	},
};

export const WithoutControls: Story = {
	args: {
		width: 1920,
		height: 1080,
		backgroundColor: '#f0f0f0',
		hideControls: true,
		onCanvasChange: (json: string) => {
			console.log('Canvas changed:', json);
		}
	},
};

export const SidebarOnly: Story = {
	args: {
		width: 1920,
		height: 1080,
		backgroundColor: '#f0f0f0',
		hideControls: false,
		showSidebar: true,
		showHeader: false,
		onCanvasChange: (json: string) => {
			console.log('Canvas changed:', json);
		}
	},
};

export const HeaderOnly: Story = {
	args: {
		width: 1920,
		height: 1080,
		backgroundColor: '#f0f0f0',
		hideControls: false,
		showSidebar: false,
		showHeader: true,
		onCanvasChange: (json: string) => {
			console.log('Canvas changed:', json);
		}
	},
};

export const SmallCanvas: Story = {
	args: {
		width: 800,
		height: 600,
		backgroundColor: '#ffffff',
		hideControls: false,
		showSidebar: true,
		showHeader: true,
		onCanvasChange: (json: string) => {
			console.log('Canvas changed:', json);
		}
	},
};

export const WithInitialContent: Story = {
	args: {
		width: 1920,
		height: 1080,
		backgroundColor: '#f0f0f0',
		hideControls: false,
		showSidebar: true,
		showHeader: true,
		canvasDataJson: JSON.stringify({
			version: "6.0.0",
			objects: [
				{
					type: "textbox",
					version: "6.0.0",
					originX: "left",
					originY: "top",
					left: 100,
					top: 100,
					width: 200,
					height: 50,
					fill: "#2c3e50",
					fontSize: 24,
					text: "Welcome to Canvas!",
					name: "Welcome Text"
				},
				{
					type: "rect",
					version: "6.0.0",
					originX: "left",
					originY: "top",
					left: 400,
					top: 200,
					width: 200,
					height: 150,
					fill: "#3498db",
					stroke: "#2980b9",
					strokeWidth: 2,
					name: "Blue Rectangle"
				}
			]
		}),
		onCanvasChange: (json: string) => {
			console.log('Canvas changed:', json);
		}
	},
};
