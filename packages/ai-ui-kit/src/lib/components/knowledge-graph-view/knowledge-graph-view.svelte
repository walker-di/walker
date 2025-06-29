<script lang="ts">
	/**
	 * Knowledge Graph View Component
	 *
	 * A comprehensive knowledge graph visualization component using Cytoscape.js.
	 * Features interactive node-link diagrams, clustering, search, and filtering.
	 */

	import { onMount, onDestroy } from "svelte";
	import cytoscape from "cytoscape";
	import coseBilkent from "cytoscape-cose-bilkent";
	import dagre from "cytoscape-dagre";
	import cola from "cytoscape-cola";
	import fcose from "cytoscape-fcose";

	import { KnowledgeGraphViewModel } from "./knowledge-graph-view-model.svelte.js";
	import GraphControls from "./components/graph-controls.svelte";
	import GraphLegend from "./components/graph-legend.svelte";
	import GraphStats from "./components/graph-stats.svelte";
	import GraphToolbar from "./components/graph-toolbar.svelte";
	import { Button } from "../ui/button/index.js";
	import { ScrollArea } from "../ui/scroll-area/index.js";

	import type { KnowledgeGraphViewProps } from "./types/knowledge-graph.js";

	// Register Cytoscape extensions
	cytoscape.use(coseBilkent);
	cytoscape.use(dagre);
	cytoscape.use(cola);
	cytoscape.use(fcose);

	// Props
	let {
		data,
		layout = { name: "cose", animate: true, fit: true },
		width = "100%",
		height = "600px",
		backgroundColor = "#ffffff",
		categories = [],
		enableClustering = false,
		clusterConfig = { enabled: false },
		enablePan = true,
		enableZoom = true,
		enableSelection = true,
		selectionMode = "single",
		enableDrag = true,
		enableSearch = true,
		enableFiltering = true,
		enableExport = true,
		enableMinimap = false,
		enableContextMenu = true,
		showControls = true,
		showLegend = true,
		showStats = false,
		showToolbar = true,
		ariaLabel = "Knowledge Graph",
		ariaDescription,
		onNodeClick,
		onNodeDoubleClick,
		onNodeHover,
		onNodeSelect,
		onEdgeClick,
		onEdgeSelect,
		onLayoutComplete,
		onViewportChange,
		onSearch,
		onFilter,
		onExport,
		onDataChange,
		...restProps
	}: KnowledgeGraphViewProps = $props();

	// Create view model
	const viewModel = new KnowledgeGraphViewModel({
		data,
		layout,
		categories,
		enableClustering,
		clusterConfig,
		enablePan,
		enableZoom,
		enableSelection,
		selectionMode,
		enableDrag,
		enableSearch,
		enableFiltering,
		enableExport,
		enableMinimap,
		enableContextMenu,
		showControls,
		showLegend,
		showStats,
		showToolbar,
		ariaLabel,
		ariaDescription,
		onNodeClick,
		onNodeDoubleClick,
		onNodeHover,
		onNodeSelect,
		onEdgeClick,
		onEdgeSelect,
		onLayoutComplete,
		onViewportChange,
		onSearch,
		onFilter,
		onExport,
		onDataChange,
	});

	// Reactive updates
	$effect(() => {
		viewModel.updateProps({
			data,
			layout,
			categories,
			enableClustering,
			clusterConfig,
			enablePan,
			enableZoom,
			enableSelection,
			selectionMode,
			enableDrag,
			enableSearch,
			enableFiltering,
			enableExport,
			enableMinimap,
			enableContextMenu,
			showControls,
			showLegend,
			showStats,
			showToolbar,
			ariaLabel,
			ariaDescription,
			onNodeClick,
			onNodeDoubleClick,
			onNodeHover,
			onNodeSelect,
			onEdgeClick,
			onEdgeSelect,
			onLayoutComplete,
			onViewportChange,
			onSearch,
			onFilter,
			onExport,
			onDataChange,
		});
	});

	// DOM references
	let containerElement: HTMLDivElement;
	let cytoscapeElement: HTMLDivElement;
	let cy: any = null;

	// Component state
	let mounted = false;

	onMount(() => {
		mounted = true;
		initializeCytoscape();
	});

	onDestroy(() => {
		viewModel.destroy();
		if (cy) {
			cy.destroy();
		}
	});

	function initializeCytoscape() {
		if (!cytoscapeElement || !viewModel.hasData) return;

		// Prepare cytoscape data
		const elements = [
			...viewModel.graphData.nodes.map((node) => ({
				data: { ...node },
				classes: node.classes?.join(" ") || "",
			})),
			...viewModel.graphData.edges.map((edge) => ({
				data: { ...edge },
				classes: edge.classes?.join(" ") || "",
			})),
		];

		// Initialize Cytoscape
		cy = cytoscape({
			container: cytoscapeElement,
			elements,
			style: getCytoscapeStyle(),
			layout: viewModel.layout,
			userPanningEnabled: enablePan,
			userZoomingEnabled: enableZoom,
			boxSelectionEnabled: enableSelection && selectionMode === "multiple",
			selectionType: selectionMode === "additive" ? "additive" : "single",
			autoungrabify: !enableDrag,
			minZoom: 0.1,
			maxZoom: 10,
			wheelSensitivity: 0.2,
		});

		// Set cytoscape instance in view model
		viewModel.setCytoscapeInstance(cy);

		// Apply initial viewport
		if (viewModel.viewport.fit) {
			cy.fit();
		} else {
			cy.zoom(viewModel.viewport.zoom);
			cy.pan(viewModel.viewport.pan);
		}
	}

	function getCytoscapeStyle() {
		return [
			// Node styles
			{
				selector: "node",
				style: {
					"background-color": "data(color)",
					label: "data(label)",
					width: "data(size)",
					height: "data(size)",
					"text-valign": "center",
					"text-halign": "center",
					"font-size": "12px",
					"font-family": "Inter, system-ui, sans-serif",
					color: "#374151",
					"text-outline-width": 2,
					"text-outline-color": "#ffffff",
					"border-width": 2,
					"border-color": "#e5e7eb",
					"overlay-padding": "6px",
				},
			},
			// Edge styles
			{
				selector: "edge",
				style: {
					width: "data(width)",
					"line-color": "data(color)",
					"target-arrow-color": "data(color)",
					"target-arrow-shape": "triangle",
					"curve-style": "bezier",
					label: "data(label)",
					"font-size": "10px",
					"font-family": "Inter, system-ui, sans-serif",
					color: "#6b7280",
					"text-rotation": "autorotate",
					"text-margin-y": -10,
				},
			},
			// Selected styles
			{
				selector: ":selected",
				style: {
					"border-width": 4,
					"border-color": "#3b82f6",
					"line-color": "#3b82f6",
					"target-arrow-color": "#3b82f6",
				},
			},
			// Highlighted styles
			{
				selector: ".highlighted",
				style: {
					"border-width": 3,
					"border-color": "#f59e0b",
					"line-color": "#f59e0b",
					"target-arrow-color": "#f59e0b",
				},
			},
			// Search highlight styles
			{
				selector: ".search-highlight",
				style: {
					"border-width": 4,
					"border-color": "#ef4444",
					"background-color": "#fef2f2",
				},
			},
			// Category-specific styles (will be generated dynamically)
			...generateCategoryStyles(),
		];
	}

	function generateCategoryStyles() {
		return categories.map((category) => ({
			selector: `[category = "${category.id}"]`,
			style: {
				"background-color": category.color,
				"border-color": darkenColor(category.color, 0.2),
			},
		}));
	}

	function darkenColor(color: string, amount: number): string {
		// Simple color darkening function
		if (color.startsWith("#")) {
			const num = parseInt(color.slice(1), 16);
			const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
			const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - amount)));
			const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - amount)));
			return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
		}
		return color;
	}

	// Reactive updates for cytoscape
	$effect(() => {
		if (cy && viewModel.hasData) {
			// Update elements when data changes
			const elements = [
				...viewModel.graphData.nodes.map((node) => ({
					data: { ...node },
					classes: node.classes?.join(" ") || "",
				})),
				...viewModel.graphData.edges.map((edge) => ({
					data: { ...edge },
					classes: edge.classes?.join(" ") || "",
				})),
			];

			cy.elements().remove();
			cy.add(elements);

			if (viewModel.layout.name) {
				viewModel.runLayout();
			}
		}
	});

	$effect(() => {
		if (cy) {
			// Update style when categories change
			cy.style(getCytoscapeStyle());
		}
	});

	// Helper functions
	function handleRetry() {
		viewModel.error = null;
		if (mounted) {
			initializeCytoscape();
		}
	}
</script>

<div
	bind:this={containerElement}
	class="knowledge-graph-view relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
	style="width: {typeof width === 'number'
		? width + 'px'
		: width}; height: {typeof height === 'number' ? height + 'px' : height};"
	role="application"
	aria-label={ariaLabel}
	aria-description={ariaDescription}
	{...restProps}
>
	<!-- Toolbar -->
	{#if showToolbar}
		<div class="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
			<GraphToolbar {viewModel} />
		</div>
	{/if}

	<!-- Main content area -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Controls sidebar -->
		{#if showControls}
			<div
				class="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
			>
				<ScrollArea class="h-full">
					<div class="p-4 space-y-4">
						<GraphControls {viewModel} />

						{#if showLegend && categories.length > 0}
							<GraphLegend {viewModel} {categories} />
						{/if}

						{#if showStats}
							<GraphStats {viewModel} />
						{/if}
					</div>
				</ScrollArea>
			</div>
		{/if}

		<!-- Graph container -->
		<div class="flex-1 relative">
			{#if viewModel.error}
				<div class="absolute inset-0 flex items-center justify-center p-4">
					<div
						class="max-w-md p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
					>
						<div class="space-y-2">
							<p class="font-medium text-red-800 dark:text-red-200">
								Error loading graph
							</p>
							<p class="text-sm text-red-600 dark:text-red-300">
								{viewModel.error}
							</p>
							<Button variant="outline" size="sm" onclick={handleRetry}>
								Try Again
							</Button>
						</div>
					</div>
				</div>
			{:else if !viewModel.hasData}
				<div class="absolute inset-0 flex items-center justify-center p-4">
					<div class="text-center space-y-2">
						<p class="text-gray-500 dark:text-gray-400">
							No graph data available
						</p>
						<p class="text-sm text-gray-400 dark:text-gray-500">
							Provide data to visualize the knowledge graph
						</p>
					</div>
				</div>
			{:else if viewModel.isLoading}
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="text-center space-y-2">
						<div
							class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
						></div>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Loading graph...
						</p>
					</div>
				</div>
			{:else}
				<div
					bind:this={cytoscapeElement}
					class="w-full h-full"
					style="background-color: {backgroundColor};"
				></div>

				{#if viewModel.isLayoutRunning}
					<div
						class="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
					>
						Running layout...
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.knowledge-graph-view {
		font-family:
			"Inter",
			system-ui,
			-apple-system,
			sans-serif;
	}

	/* Custom scrollbar for better integration */
	:global(.knowledge-graph-view .scroll-area) {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 transparent;
	}

	:global(.knowledge-graph-view .scroll-area::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.knowledge-graph-view .scroll-area::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.knowledge-graph-view .scroll-area::-webkit-scrollbar-thumb) {
		background-color: #cbd5e1;
		border-radius: 3px;
	}

	:global(.knowledge-graph-view .scroll-area::-webkit-scrollbar-thumb:hover) {
		background-color: #94a3b8;
	}
</style>
