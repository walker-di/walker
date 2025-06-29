<script lang="ts">
	/**
	 * Graph Legend Component
	 *
	 * Displays category legend with color coding and visibility toggles.
	 */

	import { Button } from "../../ui/button/index.js";
	import { Label } from "../../ui/label/index.js";
	import { Checkbox } from "../../ui/checkbox/index.js";
	import { Badge } from "../../ui/badge/index.js";

	// Lucide icons
	import Eye from "lucide-svelte/icons/eye";
	import EyeOff from "lucide-svelte/icons/eye-off";
	import Palette from "lucide-svelte/icons/palette";

	import type { KnowledgeGraphViewModel } from "../knowledge-graph-view-model.svelte.js";
	import type { GraphCategory } from "../types/knowledge-graph.js";

	let {
		viewModel,
		categories,
	}: {
		viewModel: KnowledgeGraphViewModel;
		categories: GraphCategory[];
	} = $props();

	// Local state
	let showAllCategories = $state(true);

	// Computed
	const visibleCategories = $derived(
		categories.filter((cat) => showAllCategories || cat.visible),
	);

	const totalNodes = $derived(
		categories.reduce((sum, cat) => sum + (cat.nodeCount || 0), 0),
	);

	// Event handlers
	function toggleCategoryVisibility(categoryId: string) {
		const category = categories.find((cat) => cat.id === categoryId);
		if (!category) return;

		category.visible = !category.visible;

		// Update filter to hide/show nodes of this category
		const currentFilter = viewModel.filterConfig;
		const updatedCategories = category.visible
			? currentFilter.categories.filter((id) => id !== categoryId)
			: [...currentFilter.categories, categoryId];

		viewModel.applyFilter({
			...currentFilter,
			categories: updatedCategories,
		});
	}

	function toggleAllCategories() {
		const newVisibility = !showAllCategories;
		showAllCategories = newVisibility;

		// Update all categories
		categories.forEach((category) => {
			category.visible = newVisibility;
		});

		// Update filter
		const currentFilter = viewModel.filterConfig;
		viewModel.applyFilter({
			...currentFilter,
			categories: newVisibility ? [] : categories.map((cat) => cat.id),
		});
	}

	function getCategoryNodeCount(categoryId: string): number {
		return viewModel.graphData.nodes.filter(
			(node) => node.category === categoryId,
		).length;
	}

	function getCategoryPercentage(categoryId: string): number {
		const count = getCategoryNodeCount(categoryId);
		return totalNodes > 0 ? Math.round((count / totalNodes) * 100) : 0;
	}
</script>

<div class="graph-legend space-y-3">
	<div class="flex items-center justify-between">
		<Label class="text-sm font-medium flex items-center gap-2">
			<Palette class="h-4 w-4" />
			Categories
		</Label>
		<Button
			variant="ghost"
			size="sm"
			onclick={toggleAllCategories}
			class="h-6 px-2 text-xs"
		>
			{showAllCategories ? "Hide All" : "Show All"}
		</Button>
	</div>

	{#if categories.length === 0}
		<div class="text-xs text-gray-500 text-center py-4">
			No categories defined
		</div>
	{:else}
		<div class="space-y-2">
			{#each visibleCategories as category (category.id)}
				{@const nodeCount = getCategoryNodeCount(category.id)}
				{@const percentage = getCategoryPercentage(category.id)}

				<div
					class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
				>
					<Checkbox
						id="category-{category.id}"
						checked={category.visible}
						onCheckedChange={() => toggleCategoryVisibility(category.id)}
						class="flex-shrink-0"
					/>

					<div
						class="w-3 h-3 rounded-full flex-shrink-0 border border-gray-300 dark:border-gray-600"
						style="background-color: {category.color};"
					></div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center justify-between">
							<Label
								for="category-{category.id}"
								class="text-sm font-medium truncate cursor-pointer"
								title={category.name}
							>
								{category.name}
							</Label>
							<Badge variant="secondary" class="text-xs ml-2">
								{nodeCount}
							</Badge>
						</div>

						{#if category.description}
							<div
								class="text-xs text-gray-500 truncate"
								title={category.description}
							>
								{category.description}
							</div>
						{/if}

						{#if nodeCount > 0}
							<div class="flex items-center gap-2 mt-1">
								<div
									class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1"
								>
									<div
										class="h-1 rounded-full transition-all duration-300"
										style="width: {percentage}%; background-color: {category.color};"
									></div>
								</div>
								<span class="text-xs text-gray-500 flex-shrink-0">
									{percentage}%
								</span>
							</div>
						{/if}
					</div>

					<Button
						variant="ghost"
						size="sm"
						onclick={() => toggleCategoryVisibility(category.id)}
						class="h-6 w-6 p-0 flex-shrink-0"
						title={category.visible ? "Hide category" : "Show category"}
					>
						{#if category.visible}
							<Eye class="h-3 w-3" />
						{:else}
							<EyeOff class="h-3 w-3" />
						{/if}
					</Button>
				</div>
			{/each}
		</div>

		<!-- Summary -->
		<div class="pt-2 border-t border-gray-200 dark:border-gray-700">
			<div class="text-xs text-gray-500 space-y-1">
				<div class="flex justify-between">
					<span>Total categories:</span>
					<span>{categories.length}</span>
				</div>
				<div class="flex justify-between">
					<span>Visible categories:</span>
					<span>{categories.filter((cat) => cat.visible).length}</span>
				</div>
				<div class="flex justify-between">
					<span>Total nodes:</span>
					<span>{viewModel.nodeCount}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.graph-legend {
		font-size: 14px;
	}

	.graph-legend :global(.checkbox) {
		width: 14px;
		height: 14px;
	}

	.graph-legend :global(.badge) {
		font-size: 10px;
		padding: 2px 6px;
		height: auto;
		min-height: 16px;
	}
</style>
