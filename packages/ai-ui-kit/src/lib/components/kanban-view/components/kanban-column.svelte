<script lang="ts">
	import { flip } from "svelte/animate";
	import { dndzone } from "svelte-dnd-action";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	// Icons replaced with text symbols for compatibility
	import KanbanCard from "./kanban-card.svelte";
	import type {
		KanbanColumn,
		KanbanCategory,
		KanbanColumnProps,
		KanbanCard as KanbanCardType,
	} from "../types/kanban.js";
	import type { DndEvent } from "svelte-dnd-action";

	let {
		column,
		index,
		categories = [],
		allowAddCard = true,
		allowRemoveColumn = true,
		allowEditColumn = true,
		allowDragCard = true,
		showCardCount = true,
		showActions = true,
		onCardAdd,
		onCardUpdate,
		onCardRemove,
		onCardMove,
		onColumnUpdate,
		onColumnRemove,
		onColumnMove,
		onCardDragConsider,
		onCardDragFinalize,
	}: KanbanColumnProps & {
		onCardDragConsider?: (event: CustomEvent<DndEvent<KanbanCardType>>) => void;
		onCardDragFinalize?: (event: CustomEvent<DndEvent<KanbanCardType>>) => void;
	} = $props();

	// Drag and drop configuration
	const flipDurationMs = 200;

	// Local state
	let isEditing = $state(false);
	let showColumnActions = $state(false);
	let showAddCardForm = $state(false);
	let isDragOver = $state(false);

	// Edit form state
	let editTitle = $state(column.title);
	let newCardTitle = $state("");

	// Handle column title edit
	function toggleColumnEdit() {
		if (!allowEditColumn) return;

		if (isEditing) {
			// Save changes
			if (editTitle.trim() && editTitle !== column.title) {
				onColumnUpdate?.({ title: editTitle.trim() });
			}
		} else {
			// Enter edit mode
			editTitle = column.title;
		}

		isEditing = !isEditing;
		showColumnActions = false;
	}

	// Handle add card
	function handleAddCard() {
		if (!newCardTitle.trim()) return;

		onCardAdd?.({
			title: newCardTitle.trim(),
			category: categories[0] || {
				id: "1",
				label: "Default",
				color: "black",
				bgColor: "#gray",
			},
		});

		newCardTitle = "";
		showAddCardForm = false;
	}

	// Handle card update
	function handleCardUpdate(cardId: string, updates: Partial<KanbanCardType>) {
		onCardUpdate?.(cardId, updates);
	}

	// Handle card remove
	function handleCardRemove(cardId: string) {
		onCardRemove?.(cardId);
	}

	// Handle drag events
	function handleCardDragConsiderEvent(event: CustomEvent<DndEvent<any>>) {
		onCardDragConsider?.(event);
	}

	function handleCardDragFinalizeEvent(event: CustomEvent<DndEvent<any>>) {
		onCardDragFinalize?.(event);
	}

	// Handle column remove
	function handleColumnRemove() {
		if (!allowRemoveColumn) return;
		onColumnRemove?.();
	}

	// Handle column move
	function handleColumnMove(direction: "left" | "right") {
		onColumnMove?.(direction);
	}

	// Handle key press
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			if (isEditing) {
				toggleColumnEdit();
			} else if (showAddCardForm) {
				handleAddCard();
			}
		} else if (event.key === "Escape") {
			isEditing = false;
			showAddCardForm = false;
			showColumnActions = false;
		}
	}

	// Handle drag over
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	// Handle drag leave
	function handleDragLeave() {
		isDragOver = false;
	}

	// Handle drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
		// Drop handling would be implemented in the parent component
	}

	// Move card up/down within column
	function moveCard(cardId: string, direction: "up" | "down") {
		const cardIndex = column.cards.findIndex((card) => card.id === cardId);
		if (cardIndex === -1) return;

		const newIndex = direction === "up" ? cardIndex - 1 : cardIndex + 1;
		if (newIndex < 0 || newIndex >= column.cards.length) return;

		onCardMove?.({
			cardId,
			sourcePosition: { columnId: column.id, cardIndex },
			targetPosition: { columnId: column.id, cardIndex: newIndex },
		});
	}
</script>

<div
	class="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 w-80 h-full"
	class:ring-2={isDragOver}
	class:ring-blue-500={isDragOver}
	class:bg-blue-50={isDragOver}
	data-column-id={column.id}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="region"
	aria-label="Kanban column: {column.title}"
>
	<!-- Column Header -->
	<div
		class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
		onmouseenter={() => (showColumnActions = true)}
		onmouseleave={() => {
			if (!isEditing) {
				showColumnActions = false;
			}
		}}
		role="banner"
		aria-label="Column header for {column.title}"
	>
		<div class="flex items-center gap-2 flex-1">
			{#if isEditing}
				<Input
					bind:value={editTitle}
					class="font-semibold text-gray-900 dark:text-gray-100"
					placeholder="Column title"
					onkeydown={handleKeyPress}
					autofocus
				/>
			{:else}
				<h2 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
					{column.title}
				</h2>
			{/if}

			{#if showCardCount}
				<span
					class="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
				>
					{column.cards.length}
				</span>
			{/if}
		</div>

		<!-- Column Actions -->
		{#if showActions}
			<div class="flex items-center gap-1">
				{#if isEditing}
					<Button
						variant="ghost"
						size="icon"
						class="h-8 w-8 text-green-600 hover:text-green-700"
						onclick={toggleColumnEdit}
					>
						✓
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="h-8 w-8 text-gray-600 hover:text-gray-700"
						onclick={() => (isEditing = false)}
					>
						×
					</Button>
				{:else if showColumnActions}
					{#if allowEditColumn}
						<Button
							variant="ghost"
							size="icon"
							class="h-8 w-8"
							onclick={toggleColumnEdit}
						>
							✏️
						</Button>
					{/if}

					{#if allowAddCard}
						<Button
							variant="ghost"
							size="icon"
							class="h-8 w-8"
							onclick={() => (showAddCardForm = !showAddCardForm)}
						>
							+
						</Button>
					{/if}

					{#if allowRemoveColumn}
						<Button
							variant="ghost"
							size="icon"
							class="h-8 w-8 text-red-600 hover:text-red-700"
							onclick={handleColumnRemove}
						>
							🗑️
						</Button>
					{/if}

					<!-- Column Move Actions -->
					{#if onColumnMove}
						<div
							class="flex items-center border-l border-gray-300 dark:border-gray-600 ml-1 pl-1"
						>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={() => handleColumnMove("left")}
								disabled={index === 0}
							>
								←
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={() => handleColumnMove("right")}
							>
								→
							</Button>
						</div>
					{/if}
				{:else}
					<Button variant="ghost" size="icon" class="h-8 w-8">⋯</Button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Add Card Form -->
	{#if showAddCardForm}
		<div
			class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
		>
			<div class="flex gap-2">
				<Input
					bind:value={newCardTitle}
					placeholder="Enter card title..."
					class="flex-1"
					onkeydown={handleKeyPress}
					autofocus
				/>
				<Button
					size="sm"
					onclick={handleAddCard}
					disabled={!newCardTitle.trim()}
				>
					Add
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onclick={() => {
						showAddCardForm = false;
						newCardTitle = "";
					}}
				>
					×
				</Button>
			</div>
		</div>
	{/if}

	<!-- Cards Area -->
	<div class="flex-1 overflow-hidden">
		<ScrollArea class="h-full">
			<div
				class="p-4 space-y-3 min-h-full"
				use:dndzone={{
					items: column.cards,
					flipDurationMs,
					dragDisabled: !allowDragCard,
					dropTargetStyle: { outline: "rgba(59, 130, 246, 0.5) solid 2px" },
				}}
				onconsider={handleCardDragConsiderEvent}
				onfinalize={handleCardDragFinalizeEvent}
				role="list"
				aria-label="Cards in {column.title}"
			>
				{#if column.cards.length === 0}
					<div class="text-center py-8 text-gray-500 dark:text-gray-400">
						<div class="text-4xl mb-2">📋</div>
						<p class="text-sm">No cards yet</p>
						{#if allowAddCard}
							<Button
								variant="ghost"
								size="sm"
								class="mt-2"
								onclick={() => (showAddCardForm = true)}
							>
								+ Add first card
							</Button>
						{/if}
					</div>
				{:else}
					{#each column.cards as card, cardIndex (card.id)}
						<div animate:flip={{ duration: flipDurationMs }}>
							<KanbanCard
								{card}
								columnId={column.id}
								index={cardIndex}
								{categories}
								allowEdit={allowEditColumn}
								allowRemove={allowRemoveColumn}
								allowDrag={allowDragCard}
								onUpdate={(updates) => handleCardUpdate(card.id, updates)}
								onRemove={() => handleCardRemove(card.id)}
								onMoveUp={cardIndex > 0
									? () => moveCard(card.id, "up")
									: undefined}
								onMoveDown={cardIndex < column.cards.length - 1
									? () => moveCard(card.id, "down")
									: undefined}
							/>
						</div>
					{/each}
				{/if}
			</div>
		</ScrollArea>
	</div>

	<!-- Drop Zone Indicator -->
	{#if isDragOver}
		<div
			class="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center pointer-events-none"
		>
			<div
				class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium"
			>
				Drop card here
			</div>
		</div>
	{/if}
</div>
