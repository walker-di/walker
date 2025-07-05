<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import UserStoryMap from "../lib/components/user-story-map/user-story-map.svelte";
	import { fn } from "storybook/test";
	import {
		createBoard,
		createPersona,
		createActivity,
		createTask,
		createUserStory,
		createRelease,
	} from "../lib/components/user-story-map/utils/user-story-map-utils.js";

	// Mock functions with console logging for better debugging
	const createMockHandler = (name: string) =>
		fn().mockImplementation((...args: any[]) => {
			console.log(`${name} called with:`, args);
		});

	// Sample data creation
	const sampleBoard = createBoard({
		title: "E-commerce Platform User Story Map",
		description: "Mapping user journeys for our online shopping platform",
	});

	// Create sample personas
	const customerPersona = createPersona({
		name: "Sarah - Online Shopper",
		description: "Busy professional who shops online for convenience",
		role: "Customer",
		goals: ["Find products quickly", "Secure checkout", "Track orders"],
		painPoints: ["Slow loading", "Complex navigation", "Hidden costs"],
		color: "#3B82F6",
	});

	const adminPersona = createPersona({
		name: "Mike - Store Manager",
		description: "Manages product catalog and customer orders",
		role: "Administrator",
		goals: ["Manage inventory", "Process orders", "View analytics"],
		painPoints: ["Manual processes", "Poor reporting", "System downtime"],
		color: "#10B981",
	});

	// Create sample activities for customer
	const browsingActivity = createActivity(customerPersona.id, {
		title: "Browse Products",
		description: "Discovering and exploring available products",
		priority: "high",
		status: "active",
		estimatedDuration: "15-30 minutes",
	});

	const purchaseActivity = createActivity(customerPersona.id, {
		title: "Make Purchase",
		description: "Complete the buying process",
		priority: "high",
		status: "active",
		estimatedDuration: "5-10 minutes",
	});

	const accountActivity = createActivity(customerPersona.id, {
		title: "Manage Account",
		description: "Handle account settings and order history",
		priority: "medium",
		status: "active",
		estimatedDuration: "10-15 minutes",
	});

	// Create sample activities for admin
	const inventoryActivity = createActivity(adminPersona.id, {
		title: "Manage Inventory",
		description: "Add, update, and track product inventory",
		priority: "high",
		status: "active",
		estimatedDuration: "30-60 minutes",
	});

	// Create sample tasks
	const searchTask = createTask(browsingActivity.id, {
		title: "Search Products",
		description: "Find specific products using search functionality",
		priority: "high",
		status: "ready",
		estimatedEffort: "2 weeks",
	});

	const filterTask = createTask(browsingActivity.id, {
		title: "Filter Results",
		description: "Narrow down product results using filters",
		priority: "medium",
		status: "in-progress",
		estimatedEffort: "1 week",
	});

	const cartTask = createTask(purchaseActivity.id, {
		title: "Add to Cart",
		description: "Add selected products to shopping cart",
		priority: "high",
		status: "done",
		estimatedEffort: "1 week",
	});

	const checkoutTask = createTask(purchaseActivity.id, {
		title: "Checkout Process",
		description: "Complete payment and shipping information",
		priority: "high",
		status: "ready",
		estimatedEffort: "3 weeks",
	});

	const addProductTask = createTask(inventoryActivity.id, {
		title: "Add Products",
		description: "Add new products to the catalog",
		priority: "high",
		status: "ready",
		estimatedEffort: "2 weeks",
	});

	// Create sample user stories
	const searchStory1 = createUserStory(searchTask.id, {
		title: "Basic Product Search",
		asA: "customer",
		iWant: "to search for products by name",
		soThat: "I can quickly find what I'm looking for",
		storyPoints: 3,
		priority: "high",
		status: "ready",
		labels: ["search", "core-feature"],
	});

	const searchStory2 = createUserStory(searchTask.id, {
		title: "Advanced Search",
		asA: "customer",
		iWant: "to search with multiple criteria",
		soThat: "I can find exactly what I need",
		storyPoints: 5,
		priority: "medium",
		status: "draft",
		labels: ["search", "advanced"],
	});

	const filterStory1 = createUserStory(filterTask.id, {
		title: "Price Filter",
		asA: "customer",
		iWant: "to filter products by price range",
		soThat: "I can find products within my budget",
		storyPoints: 2,
		priority: "high",
		status: "in-progress",
		assignee: "Alice",
		labels: ["filter", "price"],
	});

	const cartStory1 = createUserStory(cartTask.id, {
		title: "Add Single Item",
		asA: "customer",
		iWant: "to add one item to my cart",
		soThat: "I can purchase it later",
		storyPoints: 1,
		priority: "high",
		status: "done",
		assignee: "Bob",
		labels: ["cart", "basic"],
	});

	const checkoutStory1 = createUserStory(checkoutTask.id, {
		title: "Guest Checkout",
		asA: "customer",
		iWant: "to checkout without creating an account",
		soThat: "I can make a quick purchase",
		storyPoints: 8,
		priority: "high",
		status: "ready",
		labels: ["checkout", "guest"],
	});

	const adminStory1 = createUserStory(addProductTask.id, {
		title: "Add Product with Images",
		asA: "store manager",
		iWant: "to add products with multiple images",
		soThat: "customers can see detailed product views",
		storyPoints: 5,
		priority: "high",
		status: "ready",
		labels: ["admin", "products", "images"],
	});

	// Create sample releases
	const mvpRelease = createRelease({
		name: "MVP Release",
		description: "Minimum viable product with core shopping features",
		version: "1.0.0",
		status: "development",
		targetDate: new Date("2024-03-15"),
		userStoryIds: [searchStory1.id, filterStory1.id, cartStory1.id],
		goals: ["Enable basic shopping", "Process payments", "Manage orders"],
		features: ["Product search", "Shopping cart", "Basic checkout"],
		color: "#059669",
	});

	const enhancedRelease = createRelease({
		name: "Enhanced Features",
		description: "Advanced features and admin capabilities",
		version: "1.1.0",
		status: "planning",
		targetDate: new Date("2024-06-01"),
		userStoryIds: [searchStory2.id, checkoutStory1.id, adminStory1.id],
		goals: ["Improve user experience", "Add admin tools", "Advanced search"],
		features: ["Advanced search", "Guest checkout", "Product management"],
		color: "#3B82F6",
	});

	// Assemble the complete sample data
	const samplePersonas = [customerPersona, adminPersona];
	const sampleActivities = [
		browsingActivity,
		purchaseActivity,
		accountActivity,
		inventoryActivity,
	];
	const sampleTasks = [
		searchTask,
		filterTask,
		cartTask,
		checkoutTask,
		addProductTask,
	];
	const sampleUserStories = [
		searchStory1,
		searchStory2,
		filterStory1,
		cartStory1,
		checkoutStory1,
		adminStory1,
	];
	const sampleReleases = [mvpRelease, enhancedRelease];

	// Update board with sample data
	sampleBoard.personas = samplePersonas;
	sampleBoard.activities = sampleActivities;
	sampleBoard.tasks = sampleTasks;
	sampleBoard.userStories = sampleUserStories;
	sampleBoard.releases = sampleReleases;

	const { Story } = defineMeta({
		title: "AI UI Kit/UserStoryMap",
		component: UserStoryMap,
		tags: ["autodocs"],
		parameters: {
			layout: "fullscreen",
			docs: {
				description: {
					component:
						"A comprehensive User Story Mapping component for agile product development. Visualize user journeys, organize features, and plan releases with an intuitive hierarchical interface.",
				},
			},
		},

		argTypes: {
			// Board Props
			board: {
				control: "object",
				description:
					"Complete user story map board data with personas, activities, tasks, stories, and releases",
			},
			personas: {
				control: "object",
				description: "Array of user personas (alternative to board prop)",
			},
			activities: {
				control: "object",
				description:
					"Array of user activities/epics (alternative to board prop)",
			},
			tasks: {
				control: "object",
				description: "Array of tasks/features (alternative to board prop)",
			},
			userStories: {
				control: "object",
				description: "Array of user stories (alternative to board prop)",
			},
			releases: {
				control: "object",
				description: "Array of releases (alternative to board prop)",
			},

			// Feature Toggles
			allowAddPersona: {
				control: "boolean",
				description: "Allow users to add new personas",
			},
			allowRemovePersona: {
				control: "boolean",
				description: "Allow users to remove personas",
			},
			allowAddActivity: {
				control: "boolean",
				description: "Allow users to add new activities",
			},
			allowRemoveActivity: {
				control: "boolean",
				description: "Allow users to remove activities",
			},
			allowAddTask: {
				control: "boolean",
				description: "Allow users to add new tasks",
			},
			allowRemoveTask: {
				control: "boolean",
				description: "Allow users to remove tasks",
			},
			allowAddStory: {
				control: "boolean",
				description: "Allow users to add new user stories",
			},
			allowRemoveStory: {
				control: "boolean",
				description: "Allow users to remove user stories",
			},
			allowAddRelease: {
				control: "boolean",
				description: "Allow users to add new releases",
			},
			allowRemoveRelease: {
				control: "boolean",
				description: "Allow users to remove releases",
			},
			allowDragDrop: {
				control: "boolean",
				description: "Allow users to drag and drop items",
			},

			// Display Options
			showStoryPoints: {
				control: "boolean",
				description: "Show story points in user stories",
			},
			showReleases: {
				control: "boolean",
				description: "Show releases section",
			},
			theme: {
				control: "select",
				options: ["light", "dark"],
				description: "Visual theme for the user story map",
			},
			locale: {
				control: "text",
				description: "Locale for internationalization",
			},
		},

		args: {
			// Event handlers
			onPersonaAdd: createMockHandler("onPersonaAdd"),
			onPersonaRemove: createMockHandler("onPersonaRemove"),
			onPersonaUpdate: createMockHandler("onPersonaUpdate"),
			onActivityAdd: createMockHandler("onActivityAdd"),
			onActivityRemove: createMockHandler("onActivityRemove"),
			onActivityUpdate: createMockHandler("onActivityUpdate"),
			onTaskAdd: createMockHandler("onTaskAdd"),
			onTaskRemove: createMockHandler("onTaskRemove"),
			onTaskUpdate: createMockHandler("onTaskUpdate"),
			onStoryAdd: createMockHandler("onStoryAdd"),
			onStoryRemove: createMockHandler("onStoryRemove"),
			onStoryUpdate: createMockHandler("onStoryUpdate"),
			onReleaseAdd: createMockHandler("onReleaseAdd"),
			onReleaseRemove: createMockHandler("onReleaseRemove"),
			onReleaseUpdate: createMockHandler("onReleaseUpdate"),
			onItemMove: createMockHandler("onItemMove"),
			onBoardUpdate: createMockHandler("onBoardUpdate"),
		},
	});
</script>

<!-- Default story with complete sample data -->
<Story
	name="Default"
	args={{
		board: sampleBoard,
		allowAddPersona: true,
		allowRemovePersona: true,
		allowAddActivity: true,
		allowRemoveActivity: true,
		allowAddTask: true,
		allowRemoveTask: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showReleases: true,
		theme: "light",
	}}
/>

<!-- Empty board -->
<Story
	name="Empty Board"
	args={{
		allowAddPersona: true,
		allowRemovePersona: true,
		allowAddActivity: true,
		allowRemoveActivity: true,
		allowAddTask: true,
		allowRemoveTask: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showReleases: true,
		theme: "light",
	}}
/>

<!-- Read-only mode -->
<Story
	name="Read-only Mode"
	args={{
		board: sampleBoard,
		allowAddPersona: false,
		allowRemovePersona: false,
		allowAddActivity: false,
		allowRemoveActivity: false,
		allowAddTask: false,
		allowRemoveTask: false,
		allowAddStory: false,
		allowRemoveStory: false,
		allowAddRelease: false,
		allowRemoveRelease: false,
		allowDragDrop: false,
		showStoryPoints: true,
		showReleases: true,
		theme: "light",
	}}
/>

<!-- Dark theme -->
<Story
	name="Dark Theme"
	args={{
		board: sampleBoard,
		allowAddPersona: true,
		allowRemovePersona: true,
		allowAddActivity: true,
		allowRemoveActivity: true,
		allowAddTask: true,
		allowRemoveTask: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showReleases: true,
		theme: "dark",
	}}
/>

<!-- Without story points -->
<Story
	name="Without Story Points"
	args={{
		board: sampleBoard,
		allowAddPersona: true,
		allowRemovePersona: true,
		allowAddActivity: true,
		allowRemoveActivity: true,
		allowAddTask: true,
		allowRemoveTask: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: false,
		showReleases: true,
		theme: "light",
	}}
/>

<!-- Without releases -->
<Story
	name="Without Releases"
	args={{
		board: sampleBoard,
		allowAddPersona: true,
		allowRemovePersona: true,
		allowAddActivity: true,
		allowRemoveActivity: true,
		allowAddTask: true,
		allowRemoveTask: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showReleases: false,
		theme: "light",
	}}
/>

<!-- Minimal interface -->
<Story
	name="Minimal Interface"
	args={{
		board: sampleBoard,
		allowAddPersona: false,
		allowRemovePersona: false,
		allowAddActivity: false,
		allowRemoveActivity: false,
		allowAddTask: false,
		allowRemoveTask: false,
		allowAddStory: true,
		allowRemoveStory: false,
		allowAddRelease: false,
		allowRemoveRelease: false,
		allowDragDrop: true,
		showStoryPoints: false,
		showReleases: false,
		theme: "light",
	}}
/>

<!-- Single persona focus -->
<Story
	name="Single Persona Focus"
	args={{
		personas: [customerPersona],
		activities: [browsingActivity, purchaseActivity],
		tasks: [searchTask, filterTask, cartTask, checkoutTask],
		userStories: [
			searchStory1,
			searchStory2,
			filterStory1,
			cartStory1,
			checkoutStory1,
		],
		releases: [mvpRelease],
		allowAddPersona: true,
		allowRemovePersona: true,
		allowAddActivity: true,
		allowRemoveActivity: true,
		allowAddTask: true,
		allowRemoveTask: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showReleases: true,
		theme: "light",
	}}
/>
