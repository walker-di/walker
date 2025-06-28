<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	// Icons replaced with text symbols for compatibility
	import type {
		KanbanCard,
		KanbanCategory,
		KanbanCardProps,
	} from "../types/kanban.js";

	let {
		card,
		columnId,
		index,
		allowEdit = true,
		allowRemove = true,
		allowDrag = true,
		categories = [],
		onUpdate,
		onRemove,
		onDragStart,
		onDragEnd,
		onMoveUp,
		onMoveDown,
	}: KanbanCardProps = $props();

	// Local state
	let isEditing = $state(false);
	let showCategoryMenu = $state(false);
	let showActions = $state(false);

	// Edit form state
	let editTitle = $state(card.title);
	let editDescription = $state(card.description || "");
	let editAssignee = $state(card.assignee || "");

	// Handle drag start
	function handleMouseDown(event: MouseEvent) {
		if (!allowDrag || isEditing) return;
		if (
			event.target instanceof HTMLButtonElement ||
			event.target instanceof HTMLInputElement
		)
			return;

		onDragStart?.({
			cardId: card.id,
			sourcePosition: { columnId, cardIndex: index },
			targetPosition: { columnId, cardIndex: index },
		});
	}

	// Handle edit mode toggle
	function toggleEdit() {
		if (!allowEdit) return;

		if (isEditing) {
			// Save changes
			onUpdate?.({
				title: editTitle,
				description: editDescription,
				assignee: editAssignee,
			});
		} else {
			// Enter edit mode
			editTitle = card.title;
			editDescription = card.description || "";
			editAssignee = card.assignee || "";
		}

		isEditing = !isEditing;
		showActions = false;
	}

	// Handle category change
	function handleCategoryChange(category: KanbanCategory) {
		onUpdate?.({ category });
		showCategoryMenu = false;
	}

	// Handle priority change
	function handlePriorityChange(priority: "low" | "medium" | "high") {
		onUpdate?.({ priority });
	}

	// Handle remove
	function handleRemove() {
		if (!allowRemove) return;
		onRemove?.();
	}

	// Handle key press in edit mode
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			toggleEdit();
		} else if (event.key === "Escape") {
			isEditing = false;
			showActions = false;
		}
	}

	// Get priority color
	function getPriorityColor(priority?: string) {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800 border-red-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "low":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	}

	// Format date
	function formatDate(dateString?: string) {
		if (!dateString) return "";
		try {
			return new Date(dateString).toLocaleDateString();
		} catch {
			return dateString;
		}
	}
</script>

<div
	class="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
	class:cursor-default={isEditing}
	class:ring-2={isEditing}
	class:ring-blue-500={isEditing}
	data-card-id={card.id}
	role="button"
	tabindex="0"
	aria-label="Kanban card: {card.title}"
	onmousedown={handleMouseDown}
	onkeydown={handleKeyPress}
	onmouseenter={() => (showActions = true)}
	onmouseleave={() => {
		if (!isEditing && !showCategoryMenu) {
			showActions = false;
		}
	}}
>
	<!-- Card Header -->
	<div class="flex items-start justify-between p-3 pb-2">
		<!-- Category Badge -->
		<div class="relative">
			<button
				class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors"
				style="background-color: {card.category.bgColor}; color: {card.category
					.color}"
				onclick={() => (showCategoryMenu = !showCategoryMenu)}
				disabled={!allowEdit}
			>
				{card.category.label}
			</button>

			<!-- Category Menu -->
			{#if showCategoryMenu && categories.length > 0}
				<div
					class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 min-w-32"
				>
					{#each categories as category}
						<button
							class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
							onclick={() => handleCategoryChange(category)}
						>
							<div
								class="w-3 h-3 rounded-full"
								style="background-color: {category.bgColor}"
							></div>
							{category.label}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Actions Menu -->
		{#if showActions && !isEditing}
			<div
				class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
			>
				{#if allowEdit}
					<Button
						variant="ghost"
						size="icon"
						class="h-6 w-6"
						onclick={toggleEdit}
					>
						✏️
					</Button>
				{/if}

				{#if allowRemove}
					<Button
						variant="ghost"
						size="icon"
						class="h-6 w-6 text-red-600 hover:text-red-700"
						onclick={handleRemove}
					>
						🗑️
					</Button>
				{/if}

				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6"
					onclick={() => (showActions = false)}
				>
					⋯
				</Button>
			</div>
		{/if}

		<!-- Edit Actions -->
		{#if isEditing}
			<div class="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6 text-green-600 hover:text-green-700"
					onclick={toggleEdit}
				>
					✓
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6 text-gray-600 hover:text-gray-700"
					onclick={() => (isEditing = false)}
				>
					×
				</Button>
			</div>
		{/if}
	</div>

	<!-- Card Content -->
	<div class="px-3 pb-3">
		<!-- Title -->
		{#if isEditing}
			<Input
				bind:value={editTitle}
				class="mb-2 font-medium"
				placeholder="Card title"
				onkeydown={handleKeyPress}
			/>
		{:else}
			<h3
				class="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2"
			>
				{card.title}
			</h3>
		{/if}

		<!-- Description -->
		{#if isEditing}
			<Textarea
				bind:value={editDescription}
				class="mb-2 text-sm resize-none"
				placeholder="Description (optional)"
				rows={2}
				onkeydown={handleKeyPress}
			/>
		{:else if card.description}
			<p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
				{card.description}
			</p>
		{/if}

		<!-- Assignee -->
		{#if isEditing}
			<Input
				bind:value={editAssignee}
				class="mb-2 text-sm"
				placeholder="Assignee (optional)"
				onkeydown={handleKeyPress}
			/>
		{:else if card.assignee}
			<div class="flex items-center gap-1 mb-2">
				👤
				<span class="text-xs text-gray-600 dark:text-gray-400"
					>{card.assignee}</span
				>
			</div>
		{/if}

		<!-- Tags -->
		{#if card.tags && card.tags.length > 0}
			<div class="flex flex-wrap gap-1 mb-2">
				{#each card.tags as tag}
					<Badge variant="secondary" class="text-xs px-1 py-0">
						{tag}
					</Badge>
				{/each}
			</div>
		{/if}

		<!-- Footer -->
		<div
			class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
		>
			<!-- Date -->
			{#if card.date}
				<div class="flex items-center gap-1">
					📅
					<span>{formatDate(card.date)}</span>
				</div>
			{:else}
				<div></div>
			{/if}

			<!-- Priority -->
			{#if card.priority}
				<Badge class={getPriorityColor(card.priority)} variant="outline">
					{card.priority}
				</Badge>
			{/if}
		</div>
	</div>

	<!-- Move Actions (shown on hover) -->
	{#if showActions && !isEditing && (onMoveUp || onMoveDown)}
		<div
			class="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
		>
			{#if onMoveUp}
				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
					onclick={onMoveUp}
				>
					↑
				</Button>
			{/if}
			{#if onMoveDown}
				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
					onclick={onMoveDown}
				>
					↓
				</Button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
