<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import type { EpicCardProps } from "../types/backlog.js";
	import { getPriorityColor, getStatusColor } from "../utils/backlog-utils.js";

	let {
		epic,
		index,
		allowEdit = true,
		allowRemove = true,
		allowDrag = true,
		showActions = true,
		onUpdate,
		onRemove,
		onDragStart,
		onDragEnd,
		onMoveLeft,
		onMoveRight,
	}: EpicCardProps = $props();

	let isEditing = $state(false);
	let editTitle = $state(epic.title);
	let editDescription = $state(epic.description || "");

	// Handle edit save
	function handleSave() {
		if (!editTitle.trim()) return;

		onUpdate?.({
			title: editTitle.trim(),
			description: editDescription.trim() || undefined,
		});
		isEditing = false;
	}

	// Handle edit cancel
	function handleCancel() {
		editTitle = epic.title;
		editDescription = epic.description || "";
		isEditing = false;
	}

	// Handle key press in edit mode
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSave();
		} else if (event.key === "Escape") {
			handleCancel();
		}
	}

	// Get epic background color
	function getEpicColor() {
		return epic.color || "#FF9500"; // Default orange like in the image
	}
</script>

<div
	class="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 {allowDrag
		? 'cursor-move'
		: ''}"
	style="background-color: {getEpicColor()}20; border-color: {getEpicColor()}40;"
	draggable={allowDrag}
	ondragstart={(event) => {
		if (allowDrag && onDragStart) {
			onDragStart({
				itemId: epic.id,
				itemType: "epic",
				sourcePosition: {
					containerId: "epics",
					itemIndex: index,
					containerType: "epic",
				},
				targetPosition: {
					containerId: "epics",
					itemIndex: index,
					containerType: "epic",
				},
			});
		}
	}}
	ondragend={(event) => {
		if (allowDrag && onDragEnd) {
			onDragEnd({
				itemId: epic.id,
				itemType: "epic",
				sourcePosition: {
					containerId: "epics",
					itemIndex: index,
					containerType: "epic",
				},
				targetPosition: {
					containerId: "epics",
					itemIndex: index,
					containerType: "epic",
				},
			});
		}
	}}
>
	<!-- Epic Header -->
	<div class="p-4">
		{#if isEditing}
			<!-- Edit Mode -->
			<div class="space-y-3">
				<Input
					bind:value={editTitle}
					placeholder="Epic title..."
					class="font-medium"
					onkeydown={handleKeyPress}
					autofocus
				/>
				<Textarea
					bind:value={editDescription}
					placeholder="Epic description..."
					class="text-sm resize-none"
					rows="2"
					onkeydown={handleKeyPress}
				/>
				<div class="flex gap-2">
					<Button size="sm" onclick={handleSave} disabled={!editTitle.trim()}>
						Save
					</Button>
					<Button size="sm" variant="ghost" onclick={handleCancel}
						>Cancel</Button
					>
				</div>
			</div>
		{:else}
			<!-- View Mode -->
			<div class="space-y-2">
				<div class="flex items-start justify-between">
					<h3
						class="font-medium text-gray-900 dark:text-gray-100 leading-tight"
						style="color: {getEpicColor()};"
					>
						{epic.title}
					</h3>
					{#if showActions}
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button
									variant="ghost"
									size="sm"
									class="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
								>
									⋮
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{#if allowEdit}
									<DropdownMenuItem onclick={() => (isEditing = true)}>
										✏️ Edit
									</DropdownMenuItem>
								{/if}
								{#if onMoveLeft}
									<DropdownMenuItem onclick={onMoveLeft}
										>← Move Left</DropdownMenuItem
									>
								{/if}
								{#if onMoveRight}
									<DropdownMenuItem onclick={onMoveRight}
										>→ Move Right</DropdownMenuItem
									>
								{/if}
								{#if allowRemove && onRemove}
									<DropdownMenuItem
										onclick={onRemove}
										class="text-red-600 dark:text-red-400"
									>
										🗑️ Remove
									</DropdownMenuItem>
								{/if}
							</DropdownMenuContent>
						</DropdownMenu>
					{/if}
				</div>

				{#if epic.description}
					<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
						{epic.description}
					</p>
				{/if}

				<!-- Epic Metadata -->
				<div class="flex flex-wrap gap-1 mt-3">
					<Badge
						variant="secondary"
						class="text-xs"
						style="background-color: {getPriorityColor(
							epic.priority,
						)}20; color: {getPriorityColor(epic.priority)};"
					>
						{epic.priority}
					</Badge>
					<Badge
						variant="secondary"
						class="text-xs"
						style="background-color: {getStatusColor(
							epic.status,
						)}20; color: {getStatusColor(epic.status)};"
					>
						{epic.status}
					</Badge>
					{#if epic.estimatedEffort}
						<Badge variant="outline" class="text-xs">
							{epic.estimatedEffort}
						</Badge>
					{/if}
					{#if epic.businessValue}
						<Badge variant="outline" class="text-xs">
							Value: {epic.businessValue}
						</Badge>
					{/if}
				</div>

				<!-- Tags -->
				{#if epic.tags && epic.tags.length > 0}
					<div class="flex flex-wrap gap-1 mt-2">
						{#each epic.tags as tag}
							<Badge variant="outline" class="text-xs">
								{tag}
							</Badge>
						{/each}
					</div>
				{/if}

				<!-- Assignee -->
				{#if epic.assignee}
					<div
						class="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400"
					>
						<span>👤</span>
						<span>{epic.assignee}</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Drag Handle -->
	{#if allowDrag}
		<div
			class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 dark:text-gray-500"
		>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
				<circle cx="3" cy="3" r="1" />
				<circle cx="9" cy="3" r="1" />
				<circle cx="3" cy="9" r="1" />
				<circle cx="9" cy="9" r="1" />
			</svg>
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
</style>
