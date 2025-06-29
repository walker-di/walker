<script lang="ts">
	/**
	 * Graph Toolbar Component
	 *
	 * Provides quick access to common graph operations and tools.
	 */

	import { Button } from "../../ui/button/index.js";
	import { Input } from "../../ui/input/index.js";

	// Lucide icons
	import Search from "lucide-svelte/icons/search";
	import ZoomIn from "lucide-svelte/icons/zoom-in";
	import ZoomOut from "lucide-svelte/icons/zoom-out";
	import Maximize from "lucide-svelte/icons/maximize";
	import RotateCcw from "lucide-svelte/icons/rotate-ccw";
	import Play from "lucide-svelte/icons/play";
	import Download from "lucide-svelte/icons/download";
	import Upload from "lucide-svelte/icons/upload";
	import Settings from "lucide-svelte/icons/settings";
	import Info from "lucide-svelte/icons/info";
	import Fullscreen from "lucide-svelte/icons/fullscreen";
	import Minimize from "lucide-svelte/icons/minimize";

	import type { KnowledgeGraphViewModel } from "../knowledge-graph-view-model.svelte.js";

	let { viewModel }: { viewModel: KnowledgeGraphViewModel } = $props();

	// Local state
	let searchQuery = $state("");
	let isFullscreen = $state(false);
	let searchTimeout: number;

	// Event handlers
	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;

		// Debounced search
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			viewModel.search(searchQuery);
		}, 300);
	}

	function clearSearch() {
		searchQuery = "";
		viewModel.search("");
	}

	function handleZoomIn() {
		viewModel.zoomIn();
	}

	function handleZoomOut() {
		viewModel.zoomOut();
	}

	function handleFitToView() {
		viewModel.fitToView();
	}

	function handleResetZoom() {
		viewModel.resetZoom();
	}

	function handleRunLayout() {
		viewModel.runLayout();
	}

	function handleExportJSON() {
		viewModel.exportGraph({ format: "json" });
	}

	function handleExportPNG() {
		viewModel.exportGraph({ format: "png" });
	}

	function handleImport() {
		// Create file input
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const data = JSON.parse(e.target?.result as string);
						viewModel.setGraphData(data);
					} catch (error) {
						console.error("Failed to import graph data:", error);
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			isFullscreen = true;
		} else {
			document.exitFullscreen();
			isFullscreen = false;
		}
	}

	// Listen for fullscreen changes
	if (typeof document !== "undefined") {
		document.addEventListener("fullscreenchange", () => {
			isFullscreen = !!document.fullscreenElement;
		});
	}
</script>

<div
	class="graph-toolbar flex items-center justify-between p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
>
	<!-- Left section - Search -->
	<div class="flex items-center gap-3">
		<div class="relative">
			<Search
				class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
			/>
			<Input
				type="text"
				placeholder="Search nodes..."
				bind:value={searchQuery}
				oninput={handleSearchInput}
				class="pl-9 pr-8 w-64"
			/>
			{#if searchQuery}
				<Button
					variant="ghost"
					size="sm"
					class="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
					onclick={clearSearch}
				>
					×
				</Button>
			{/if}
		</div>

		{#if viewModel.searchConfig.query}
			<div class="text-sm text-gray-500">
				Search: "{viewModel.searchConfig.query}"
			</div>
		{/if}
	</div>

	<!-- Center section - View controls -->
	<div class="flex items-center gap-1">
		<Button variant="ghost" size="sm" onclick={handleZoomIn} title="Zoom In">
			<ZoomIn class="h-4 w-4" />
		</Button>

		<Button variant="ghost" size="sm" onclick={handleZoomOut} title="Zoom Out">
			<ZoomOut class="h-4 w-4" />
		</Button>

		<Button
			variant="ghost"
			size="sm"
			onclick={handleFitToView}
			title="Fit to View"
		>
			<Maximize class="h-4 w-4" />
		</Button>

		<Button
			variant="ghost"
			size="sm"
			onclick={handleResetZoom}
			title="Reset Zoom"
		>
			<RotateCcw class="h-4 w-4" />
		</Button>

		<div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<Button
			variant="ghost"
			size="sm"
			onclick={handleRunLayout}
			disabled={viewModel.isLayoutRunning}
			title="Run Layout"
		>
			<Play class="h-4 w-4" />
		</Button>

		<div class="text-xs text-gray-500 px-2">
			Zoom: {Math.round(viewModel.viewport.zoom * 100)}%
		</div>
	</div>

	<!-- Right section - Actions -->
	<div class="flex items-center gap-1">
		<Button
			variant="ghost"
			size="sm"
			onclick={handleImport}
			title="Import Graph Data"
		>
			<Upload class="h-4 w-4" />
		</Button>

		<Button
			variant="ghost"
			size="sm"
			onclick={handleExportJSON}
			title="Export as JSON"
		>
			<Download class="h-4 w-4" />
		</Button>

		<div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<Button
			variant="ghost"
			size="sm"
			onclick={toggleFullscreen}
			title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
		>
			{#if isFullscreen}
				<Minimize class="h-4 w-4" />
			{:else}
				<Fullscreen class="h-4 w-4" />
			{/if}
		</Button>

		<!-- Graph info -->
		<div class="flex items-center gap-2 text-xs text-gray-500 ml-3">
			<Info class="h-3 w-3" />
			<span>{viewModel.nodeCount} nodes</span>
			<span>•</span>
			<span>{viewModel.edgeCount} edges</span>
			{#if viewModel.selectedNodeCount > 0 || viewModel.selectedEdgeCount > 0}
				<span>•</span>
				<span class="text-blue-600 font-medium">
					{viewModel.selectedNodeCount + viewModel.selectedEdgeCount} selected
				</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.graph-toolbar {
		font-size: 14px;
		min-height: 60px;
	}

	.graph-toolbar :global(.button) {
		height: 32px;
		width: 32px;
		padding: 0;
	}

	.graph-toolbar :global(.input) {
		height: 32px;
		font-size: 13px;
	}

	.graph-toolbar :global(.separator) {
		background-color: #e5e7eb;
	}

	:global(.dark) .graph-toolbar :global(.separator) {
		background-color: #374151;
	}
</style>
