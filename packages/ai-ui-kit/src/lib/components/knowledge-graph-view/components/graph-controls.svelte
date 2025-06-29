<script lang="ts">
	/**
	 * Graph Controls Component
	 *
	 * Provides layout controls, zoom controls, and other graph manipulation tools.
	 */

	import { Button } from "../../ui/button/index.js";
	import { Input } from "../../ui/input/index.js";
	import { Label } from "../../ui/label/index.js";
	import { Checkbox } from "../../ui/checkbox/index.js";
	import { Badge } from "../../ui/badge/index.js";
	// Lucide icons
	import ZoomIn from "lucide-svelte/icons/zoom-in";
	import ZoomOut from "lucide-svelte/icons/zoom-out";
	import Maximize from "lucide-svelte/icons/maximize";
	import RotateCcw from "lucide-svelte/icons/rotate-ccw";
	import Play from "lucide-svelte/icons/play";
	import Search from "lucide-svelte/icons/search";
	import Filter from "lucide-svelte/icons/filter";
	import Download from "lucide-svelte/icons/download";
	import Settings from "lucide-svelte/icons/settings";

	import type { KnowledgeGraphViewModel } from "../knowledge-graph-view-model.svelte.js";

	let { viewModel }: { viewModel: KnowledgeGraphViewModel } = $props();

	// Local state
	let searchQuery = $state("");
	let selectedLayout = $state(viewModel.layout.name);
	let animateLayout = $state(viewModel.layout.animate ?? true);
	let showAdvancedControls = $state(false);

	// Layout options
	const layoutOptions = [
		{ value: "cose", label: "Force-directed (COSE)" },
		{ value: "cose-bilkent", label: "COSE Bilkent" },
		{ value: "fcose", label: "fCOSE" },
		{ value: "cola", label: "Cola.js" },
		{ value: "dagre", label: "Dagre (Hierarchical)" },
		{ value: "grid", label: "Grid" },
		{ value: "circle", label: "Circle" },
		{ value: "concentric", label: "Concentric" },
		{ value: "breadthfirst", label: "Breadth-first" },
		{ value: "random", label: "Random" },
	];

	// Reactive updates
	$effect(() => {
		selectedLayout = viewModel.layout.name;
		animateLayout = viewModel.layout.animate ?? true;
	});

	// Event handlers
	function handleLayoutChange(value: string) {
		selectedLayout = value;
		viewModel.setLayout({
			...viewModel.layout,
			name: value as any,
			animate: animateLayout,
		});
	}

	function handleAnimateToggle(checked: boolean) {
		animateLayout = checked;
		viewModel.setLayout({
			...viewModel.layout,
			animate: checked,
		});
	}

	function handleSearch() {
		viewModel.search(searchQuery);
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;

		// Debounced search
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			viewModel.search(searchQuery);
		}, 300);
	}

	let searchTimeout: number;

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

	function handleSelectAll() {
		viewModel.selectAll();
	}

	function handleClearSelection() {
		viewModel.clearSelection();
	}

	function toggleAdvancedControls() {
		showAdvancedControls = !showAdvancedControls;
	}
</script>

<div class="graph-controls space-y-4">
	<!-- Search Section -->
	<div class="space-y-2">
		<Label class="text-sm font-medium flex items-center gap-2">
			<Search class="h-4 w-4" />
			Search Nodes
		</Label>
		<div class="relative">
			<Input
				type="text"
				placeholder="Search by label, type, or category..."
				bind:value={searchQuery}
				oninput={handleSearchInput}
				class="pr-8"
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
			<div class="text-xs text-gray-500">
				Search active: "{viewModel.searchConfig.query}"
			</div>
		{/if}
	</div>

	<div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

	<!-- Layout Controls -->
	<div class="space-y-3">
		<Label class="text-sm font-medium">Layout</Label>

		<div class="space-y-2">
			<select
				bind:value={selectedLayout}
				onchange={(e) =>
					handleLayoutChange((e.target as HTMLSelectElement).value)}
				class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
			>
				{#each layoutOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>

			<div class="flex items-center space-x-2">
				<Checkbox
					id="animate-layout"
					checked={animateLayout}
					onCheckedChange={handleAnimateToggle}
				/>
				<Label for="animate-layout" class="text-sm">Animate layout</Label>
			</div>

			<Button
				variant="outline"
				size="sm"
				onclick={handleRunLayout}
				disabled={viewModel.isLayoutRunning}
				class="w-full"
			>
				<Play class="h-4 w-4 mr-2" />
				{viewModel.isLayoutRunning ? "Running..." : "Run Layout"}
			</Button>
		</div>
	</div>

	<div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

	<!-- Zoom Controls -->
	<div class="space-y-3">
		<Label class="text-sm font-medium">View Controls</Label>

		<div class="grid grid-cols-2 gap-2">
			<Button variant="outline" size="sm" onclick={handleZoomIn}>
				<ZoomIn class="h-4 w-4 mr-1" />
				Zoom In
			</Button>
			<Button variant="outline" size="sm" onclick={handleZoomOut}>
				<ZoomOut class="h-4 w-4 mr-1" />
				Zoom Out
			</Button>
			<Button variant="outline" size="sm" onclick={handleFitToView}>
				<Maximize class="h-4 w-4 mr-1" />
				Fit View
			</Button>
			<Button variant="outline" size="sm" onclick={handleResetZoom}>
				<RotateCcw class="h-4 w-4 mr-1" />
				Reset
			</Button>
		</div>

		<div class="text-xs text-gray-500 text-center">
			Zoom: {Math.round(viewModel.viewport.zoom * 100)}%
		</div>
	</div>

	<div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

	<!-- Selection Controls -->
	<div class="space-y-3">
		<Label class="text-sm font-medium">Selection</Label>

		<div class="space-y-2">
			<div class="flex justify-between text-xs text-gray-500">
				<span>Nodes: {viewModel.selectedNodeCount}</span>
				<span>Edges: {viewModel.selectedEdgeCount}</span>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<Button variant="outline" size="sm" onclick={handleSelectAll}>
					Select All
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={handleClearSelection}
					disabled={viewModel.selectedNodeCount === 0 &&
						viewModel.selectedEdgeCount === 0}
				>
					Clear
				</Button>
			</div>

			<div class="text-xs text-gray-500">
				Mode: {viewModel.selection.selectionMode}
			</div>
		</div>
	</div>

	<div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

	<!-- Advanced Controls Toggle -->
	<Button
		variant="ghost"
		size="sm"
		onclick={toggleAdvancedControls}
		class="w-full justify-between"
	>
		<span class="flex items-center gap-2">
			<Settings class="h-4 w-4" />
			Advanced Controls
		</span>
		<span class="text-xs">
			{showAdvancedControls ? "−" : "+"}
		</span>
	</Button>

	{#if showAdvancedControls}
		<div class="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
			<!-- Filter Controls -->
			<div class="space-y-2">
				<Label class="text-sm font-medium flex items-center gap-2">
					<Filter class="h-4 w-4" />
					Filters
				</Label>

				<div class="space-y-2">
					<div class="flex items-center space-x-2">
						<Checkbox
							id="show-isolated"
							checked={viewModel.filterConfig.showIsolated}
							onCheckedChange={(checked) => {
								viewModel.applyFilter({
									...viewModel.filterConfig,
									showIsolated: checked,
								});
							}}
						/>
						<Label for="show-isolated" class="text-sm"
							>Show isolated nodes</Label
						>
					</div>
				</div>
			</div>

			<!-- Export Controls -->
			<div class="space-y-2">
				<Label class="text-sm font-medium flex items-center gap-2">
					<Download class="h-4 w-4" />
					Export
				</Label>

				<div class="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						size="sm"
						onclick={() => viewModel.exportGraph({ format: "json" })}
					>
						JSON
					</Button>
					<Button
						variant="outline"
						size="sm"
						onclick={() => viewModel.exportGraph({ format: "png" })}
					>
						PNG
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.graph-controls {
		font-size: 14px;
	}

	.graph-controls :global(.select-trigger) {
		font-size: 13px;
	}

	.graph-controls :global(.button) {
		font-size: 12px;
	}
</style>
