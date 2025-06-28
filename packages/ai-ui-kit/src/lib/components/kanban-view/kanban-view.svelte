<script lang="ts">
	import { onDestroy } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	import KanbanColumn from "./components/kanban-column.svelte";
	import { KanbanViewModel } from "./kanban-view-model.svelte.js";
	import type { KanbanViewProps } from "./types/kanban.js";

	// Props with defaults
	let props: KanbanViewProps = $props();

	// Create view model instance
	const kanbanViewModel = new KanbanViewModel(props);

	// Update view model when props change
	$effect(() => {
		kanbanViewModel.updateProps(props);
	});

	// Local state for new column form
	let newColumnTitle = $state("");

	// Handle add column
	function handleAddColumn() {
		if (!newColumnTitle.trim()) return;

		kanbanViewModel.addColumn({ title: newColumnTitle.trim() });
		newColumnTitle = "";
		kanbanViewModel.showAddColumnForm = false;
	}

	// Handle key press for new column
	function handleNewColumnKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddColumn();
		} else if (event.key === "Escape") {
			kanbanViewModel.showAddColumnForm = false;
			newColumnTitle = "";
		}
	}

	// Cleanup on destroy
	onDestroy(() => {
		kanbanViewModel.destroy();
	});
</script>

<div class="flex h-full bg-gray-100 dark:bg-gray-950 text-foreground">
	<!-- Main Kanban Board -->
	<div class="flex-1 overflow-hidden">
		<!-- Board Header -->
		<div
			class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
		>
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					{kanbanViewModel.board?.title || "Kanban Board"}
				</h1>
				{#if kanbanViewModel.board?.description}
					<p class="text-gray-600 dark:text-gray-400 mt-1">
						{kanbanViewModel.board.description}
					</p>
				{/if}
			</div>

			<!-- Board Actions -->
			<div class="flex items-center gap-2">
				{#if props.allowAddColumn !== false}
					<Button
						variant="outline"
						onclick={() =>
							(kanbanViewModel.showAddColumnForm =
								!kanbanViewModel.showAddColumnForm)}
						disabled={kanbanViewModel.columns.length >=
							(props.maxColumns || 10)}
					>
						+ Add Column
					</Button>
				{/if}
			</div>
		</div>

		<!-- Add Column Form -->
		{#if kanbanViewModel.showAddColumnForm}
			<div
				class="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
			>
				<div class="flex gap-2 max-w-md">
					<Input
						bind:value={newColumnTitle}
						placeholder="Enter column title..."
						class="flex-1"
						onkeydown={handleNewColumnKeyPress}
						autofocus
					/>
					<Button onclick={handleAddColumn} disabled={!newColumnTitle.trim()}>
						Add
					</Button>
					<Button
						variant="ghost"
						onclick={() => {
							kanbanViewModel.showAddColumnForm = false;
							newColumnTitle = "";
						}}
					>
						×
					</Button>
				</div>
			</div>
		{/if}

		<!-- Columns Container -->
		<div class="flex-1 overflow-hidden">
			<ScrollArea class="h-full">
				<div class="flex gap-6 p-6 min-h-full">
					{#if kanbanViewModel.columns.length === 0}
						<!-- Empty State -->
						<div class="flex-1 flex items-center justify-center">
							<div class="text-center">
								<div class="text-6xl mb-4">📋</div>
								<h3
									class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
								>
									No columns yet
								</h3>
								<p class="text-gray-600 dark:text-gray-400 mb-4">
									Get started by creating your first column
								</p>
								{#if props.allowAddColumn !== false}
									<Button
										onclick={() => (kanbanViewModel.showAddColumnForm = true)}
									>
										+ Create First Column
									</Button>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Kanban Columns -->
						{#each kanbanViewModel.columns as column, index (column.id)}
							<KanbanColumn
								{column}
								{index}
								categories={kanbanViewModel.categories}
								allowAddCard={props.allowAddCard !== false}
								allowRemoveColumn={props.allowRemoveColumn !== false}
								allowEditColumn={props.allowEditCard !== false}
								allowDragCard={props.allowDragCard !== false}
								showCardCount={props.showCardCount !== false}
								showActions={props.showColumnActions !== false}
								onCardAdd={(cardData) =>
									kanbanViewModel.addCard(column.id, cardData)}
								onCardUpdate={(cardId, updates) =>
									kanbanViewModel.updateCardData(column.id, cardId, updates)}
								onCardRemove={(cardId) =>
									kanbanViewModel.removeCardData(column.id, cardId)}
								onCardMove={(dragEvent) => {
									// This is handled by svelte-dnd-action automatically
									console.log("Card moved:", dragEvent);
								}}
								onCardDragConsider={(event) =>
									kanbanViewModel.handleCardDragConsider(column.id, event)}
								onCardDragFinalize={(event) =>
									kanbanViewModel.handleCardDragFinalize(column.id, event)}
								onColumnUpdate={(updates) =>
									kanbanViewModel.updateColumnData(column.id, updates)}
								onColumnRemove={() =>
									kanbanViewModel.removeColumnData(column.id)}
								onColumnMove={(direction) =>
									kanbanViewModel.moveColumn(column.id, direction)}
							/>
						{/each}

						<!-- Add Column Button (when not in form mode) -->
						{#if !kanbanViewModel.showAddColumnForm && props.allowAddColumn !== false && kanbanViewModel.columns.length < (props.maxColumns || 10)}
							<div class="flex-shrink-0">
								<button
									class="flex items-center justify-center w-80 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
									onclick={() => (kanbanViewModel.showAddColumnForm = true)}
								>
									<div class="text-center">
										<div class="text-4xl mb-2">+</div>
										<span class="text-sm font-medium">Add Column</span>
									</div>
								</button>
							</div>
						{/if}
					{/if}
				</div>
			</ScrollArea>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for better UX */
	:global(.kanban-scroll) {
		scrollbar-width: thin;
		scrollbar-color: rgb(156 163 175) transparent;
	}

	:global(.kanban-scroll::-webkit-scrollbar) {
		height: 8px;
		width: 8px;
	}

	:global(.kanban-scroll::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.kanban-scroll::-webkit-scrollbar-thumb) {
		background-color: rgb(156 163 175);
		border-radius: 4px;
	}

	:global(.kanban-scroll::-webkit-scrollbar-thumb:hover) {
		background-color: rgb(107 114 128);
	}
</style>
