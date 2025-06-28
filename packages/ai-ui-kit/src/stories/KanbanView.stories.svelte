<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import KanbanView from "../lib/components/kanban-view/kanban-view.svelte";
	import { fn } from "storybook/test";
	import { createBoard, createDefaultCategories } from "../lib/components/kanban-view/utils/kanban-utils.js";

	// Mock functions with console logging for better debugging
	const createMockHandler = (name: string) =>
		fn().mockImplementation((...args: any[]) => {
			console.log(`${name} called with:`, args);
		});

	// Sample data
	const defaultCategories = Object.values(createDefaultCategories());
	const sampleBoard = createBoard("Sample Project Board", "A demonstration of the Kanban component");

	// Add some sample cards to the board
	sampleBoard.columns[0].cards = [
		{
			id: "card-1",
			title: "Design new UI components",
			description: "Create modern, accessible UI components for the design system",
			category: defaultCategories[0],
			date: "2024-01-15",
			assignee: "Alice",
			priority: "high",
			tags: ["design", "ui"],
			empty: false,
			animate: false,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: "card-2", 
			title: "Setup project structure",
			description: "Initialize the project with proper folder structure and dependencies",
			category: defaultCategories[2],
			date: "2024-01-10",
			assignee: "Bob",
			priority: "medium",
			tags: ["setup", "infrastructure"],
			empty: false,
			animate: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	];

	sampleBoard.columns[1].cards = [
		{
			id: "card-3",
			title: "Implement drag and drop",
			description: "Add drag and drop functionality for moving cards between columns",
			category: defaultCategories[1],
			date: "2024-01-20",
			assignee: "Charlie",
			priority: "high",
			tags: ["feature", "interaction"],
			empty: false,
			animate: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	];

	sampleBoard.columns[2].cards = [
		{
			id: "card-4",
			title: "Write documentation",
			description: "Create comprehensive documentation for the Kanban component",
			category: defaultCategories[3],
			date: "2024-01-05",
			assignee: "Diana",
			priority: "low",
			tags: ["docs", "writing"],
			empty: false,
			animate: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	];

	const { Story } = defineMeta({
		title: "AI UI Kit/KanbanView",
		component: KanbanView,
		tags: ["autodocs"],
		parameters: {
			layout: "fullscreen",
			docs: {
				description: {
					component:
						"A comprehensive Kanban board component with drag-and-drop functionality, card management, and customizable columns. Perfect for project management and task tracking.",
				},
			},
		},

		argTypes: {
			// Board Props
			board: {
				control: "object",
				description: "Complete kanban board data with columns and cards",
			},
			columns: {
				control: "object", 
				description: "Array of kanban columns (alternative to board prop)",
			},
			categories: {
				control: "object",
				description: "Array of card categories with colors",
			},
			maxColumns: {
				control: "number",
				description: "Maximum number of columns allowed",
			},

			// Feature Toggles
			allowAddColumn: {
				control: "boolean",
				description: "Allow users to add new columns",
			},
			allowRemoveColumn: {
				control: "boolean", 
				description: "Allow users to remove columns",
			},
			allowAddCard: {
				control: "boolean",
				description: "Allow users to add new cards",
			},
			allowRemoveCard: {
				control: "boolean",
				description: "Allow users to remove cards",
			},
			allowEditCard: {
				control: "boolean",
				description: "Allow users to edit card content",
			},
			allowDragCard: {
				control: "boolean",
				description: "Allow users to drag cards between columns",
			},
			allowDragColumn: {
				control: "boolean",
				description: "Allow users to reorder columns",
			},

			// Display Options
			showCardCount: {
				control: "boolean",
				description: "Show card count in column headers",
			},
			showColumnActions: {
				control: "boolean",
				description: "Show action buttons in column headers",
			},
			theme: {
				control: "select",
				options: ["light", "dark"],
				description: "Visual theme for the kanban board",
			},
			locale: {
				control: "text",
				description: "Locale for internationalization",
			},
		},

		args: {
			// Event handlers
			onCardAdd: createMockHandler("onCardAdd"),
			onCardRemove: createMockHandler("onCardRemove"),
			onCardUpdate: createMockHandler("onCardUpdate"),
			onCardMove: createMockHandler("onCardMove"),
			onColumnAdd: createMockHandler("onColumnAdd"),
			onColumnRemove: createMockHandler("onColumnRemove"),
			onColumnUpdate: createMockHandler("onColumnUpdate"),
			onColumnMove: createMockHandler("onColumnMove"),
			onBoardUpdate: createMockHandler("onBoardUpdate"),
		},
	});
</script>

<!-- Default story with sample board -->
<Story
	name="Default"
	args={{
		board: sampleBoard,
		categories: defaultCategories,
		allowAddColumn: true,
		allowRemoveColumn: true,
		allowAddCard: true,
		allowRemoveCard: true,
		allowEditCard: true,
		allowDragCard: true,
		showCardCount: true,
		showColumnActions: true,
		theme: "light",
		maxColumns: 10,
	}}
/>

<!-- Empty board -->
<Story
	name="Empty Board"
	args={{
		categories: defaultCategories,
		allowAddColumn: true,
		allowRemoveColumn: true,
		allowAddCard: true,
		allowRemoveCard: true,
		allowEditCard: true,
		allowDragCard: true,
		showCardCount: true,
		showColumnActions: true,
		theme: "light",
		maxColumns: 10,
	}}
/>

<!-- Read-only mode -->
<Story
	name="Read-only Mode"
	args={{
		board: sampleBoard,
		categories: defaultCategories,
		allowAddColumn: false,
		allowRemoveColumn: false,
		allowAddCard: false,
		allowRemoveCard: false,
		allowEditCard: false,
		allowDragCard: false,
		showCardCount: true,
		showColumnActions: false,
		theme: "light",
	}}
/>

<!-- Dark theme -->
<Story
	name="Dark Theme"
	args={{
		board: sampleBoard,
		categories: defaultCategories,
		allowAddColumn: true,
		allowRemoveColumn: true,
		allowAddCard: true,
		allowRemoveCard: true,
		allowEditCard: true,
		allowDragCard: true,
		showCardCount: true,
		showColumnActions: true,
		theme: "dark",
		maxColumns: 10,
	}}
/>

<!-- Minimal interface -->
<Story
	name="Minimal Interface"
	args={{
		board: sampleBoard,
		categories: defaultCategories,
		allowAddColumn: false,
		allowRemoveColumn: false,
		allowAddCard: true,
		allowRemoveCard: false,
		allowEditCard: true,
		allowDragCard: true,
		showCardCount: false,
		showColumnActions: false,
		theme: "light",
	}}
/>

<!-- Limited columns -->
<Story
	name="Limited Columns"
	args={{
		board: sampleBoard,
		categories: defaultCategories,
		allowAddColumn: true,
		allowRemoveColumn: true,
		allowAddCard: true,
		allowRemoveCard: true,
		allowEditCard: true,
		allowDragCard: true,
		showCardCount: true,
		showColumnActions: true,
		theme: "light",
		maxColumns: 3,
	}}
/>

<!-- Custom categories -->
<Story
	name="Custom Categories"
	args={{
		board: sampleBoard,
		categories: [
			{ id: "1", label: "Bug", color: "white", bgColor: "#dc2626" },
			{ id: "2", label: "Feature", color: "white", bgColor: "#059669" },
			{ id: "3", label: "Enhancement", color: "white", bgColor: "#2563eb" },
			{ id: "4", label: "Documentation", color: "black", bgColor: "#f59e0b" },
			{ id: "5", label: "Research", color: "white", bgColor: "#7c3aed" },
		],
		allowAddColumn: true,
		allowRemoveColumn: true,
		allowAddCard: true,
		allowRemoveCard: true,
		allowEditCard: true,
		allowDragCard: true,
		showCardCount: true,
		showColumnActions: true,
		theme: "light",
		maxColumns: 10,
	}}
/>
