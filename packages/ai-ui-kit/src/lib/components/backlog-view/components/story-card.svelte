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
	import type { StoryCardProps } from "../types/backlog.js";
	import {
		getStoryTypeColor,
		getPriorityColor,
		getStatusColor,
	} from "../utils/backlog-utils.js";

	let {
		story,
		epicId,
		releaseId,
		index,
		allowEdit = true,
		allowRemove = true,
		allowDrag = true,
		showStoryPoints = true,
		showActions = true,
		onUpdate,
		onRemove,
		onDragStart,
		onDragEnd,
		onMoveUp,
		onMoveDown,
	}: StoryCardProps = $props();

	let isEditing = $state(false);
	let editTitle = $state(story.title);
	let editDescription = $state(story.description || "");
	let editStoryPoints = $state(story.storyPoints || 0);

	// Handle edit save
	function handleSave() {
		if (!editTitle.trim()) return;

		onUpdate?.({
			title: editTitle.trim(),
			description: editDescription.trim() || undefined,
			storyPoints: editStoryPoints || undefined,
		});
		isEditing = false;
	}

	// Handle edit cancel
	function handleCancel() {
		editTitle = story.title;
		editDescription = story.description || "";
		editStoryPoints = story.storyPoints || 0;
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

	// Get story background color based on type
	function getStoryColor() {
		return story.color || getStoryTypeColor(story.type);
	}

	// Get story type icon
	function getStoryTypeIcon() {
		const icons = {
			epic: "📋",
			feature: "⭐",
			story: "📝",
			task: "✅",
			bug: "🐛",
			spike: "🔬",
		};
		return icons[story.type] || "📝";
	}
</script>

<div
	class="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:shadow-md transition-all duration-200 {allowDrag
		? 'cursor-move'
		: ''}"
	style="background-color: {getStoryColor()}15; border-color: {getStoryColor()}30;"
	draggable={allowDrag}
	ondragstart={(event) => {
		if (allowDrag && onDragStart) {
			onDragStart({
				itemId: story.id,
				itemType: "story",
				sourcePosition: {
					containerId: releaseId || epicId || "unscheduled",
					itemIndex: index,
					containerType: releaseId ? "release" : "unscheduled",
				},
				targetPosition: {
					containerId: releaseId || epicId || "unscheduled",
					itemIndex: index,
					containerType: releaseId ? "release" : "unscheduled",
				},
			});
		}
	}}
	ondragend={(event) => {
		if (allowDrag && onDragEnd) {
			onDragEnd({
				itemId: story.id,
				itemType: "story",
				sourcePosition: {
					containerId: releaseId || epicId || "unscheduled",
					itemIndex: index,
					containerType: releaseId ? "release" : "unscheduled",
				},
				targetPosition: {
					containerId: releaseId || epicId || "unscheduled",
					itemIndex: index,
					containerType: releaseId ? "release" : "unscheduled",
				},
			});
		}
	}}
>
	<!-- Story Content -->
	<div class="p-3">
		{#if isEditing}
			<!-- Edit Mode -->
			<div class="space-y-2">
				<Input
					bind:value={editTitle}
					placeholder="Story title..."
					class="text-sm font-medium"
					onkeydown={handleKeyPress}
					autofocus
				/>
				<Textarea
					bind:value={editDescription}
					placeholder="Story description..."
					class="text-xs resize-none"
					rows="2"
					onkeydown={handleKeyPress}
				/>
				{#if showStoryPoints}
					<Input
						type="number"
						bind:value={editStoryPoints}
						placeholder="Story points..."
						class="text-xs"
						min="0"
						max="100"
					/>
				{/if}
				<div class="flex gap-1">
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
					<div class="flex items-start gap-2 flex-1 min-w-0">
						<span class="text-sm flex-shrink-0">{getStoryTypeIcon()}</span>
						<h4
							class="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 flex-1"
							style="color: {getStoryColor()};"
						>
							{story.title}
						</h4>
					</div>
					{#if showActions}
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button
									variant="ghost"
									size="sm"
									class="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 flex-shrink-0"
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
								{#if onMoveUp}
									<DropdownMenuItem onclick={onMoveUp}
										>↑ Move Up</DropdownMenuItem
									>
								{/if}
								{#if onMoveDown}
									<DropdownMenuItem onclick={onMoveDown}
										>↓ Move Down</DropdownMenuItem
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

				{#if story.description}
					<p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
						{story.description}
					</p>
				{/if}

				<!-- Story Points -->
				{#if showStoryPoints && story.storyPoints}
					<div class="flex items-center gap-1">
						<Badge variant="outline" class="text-xs">
							{story.storyPoints} pts
						</Badge>
					</div>
				{/if}

				<!-- Story Metadata -->
				<div class="flex flex-wrap gap-1">
					<Badge
						variant="secondary"
						class="text-xs"
						style="background-color: {getPriorityColor(
							story.priority,
						)}20; color: {getPriorityColor(story.priority)};"
					>
						{story.priority}
					</Badge>
					<Badge
						variant="secondary"
						class="text-xs"
						style="background-color: {getStatusColor(
							story.status,
						)}20; color: {getStatusColor(story.status)};"
					>
						{story.status}
					</Badge>
					<Badge
						variant="secondary"
						class="text-xs"
						style="background-color: {getStoryColor()}20; color: {getStoryColor()};"
					>
						{story.type}
					</Badge>
				</div>

				<!-- Labels -->
				{#if story.labels && story.labels.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each story.labels.slice(0, 3) as label}
							<Badge variant="outline" class="text-xs">
								{label}
							</Badge>
						{/each}
						{#if story.labels.length > 3}
							<Badge variant="outline" class="text-xs">
								+{story.labels.length - 3}
							</Badge>
						{/if}
					</div>
				{/if}

				<!-- Assignee -->
				{#if story.assignee}
					<div
						class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
					>
						<span>👤</span>
						<span class="truncate">{story.assignee}</span>
					</div>
				{/if}

				<!-- User Story Format -->
				{#if story.asA || story.iWant || story.soThat}
					<div
						class="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"
					>
						{#if story.asA}
							<div><strong>As a</strong> {story.asA}</div>
						{/if}
						{#if story.iWant}
							<div><strong>I want</strong> {story.iWant}</div>
						{/if}
						{#if story.soThat}
							<div><strong>So that</strong> {story.soThat}</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Drag Handle -->
	{#if allowDrag}
		<div
			class="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 dark:text-gray-500"
		>
			<svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
				<circle cx="2" cy="2" r="0.5" />
				<circle cx="6" cy="2" r="0.5" />
				<circle cx="2" cy="6" r="0.5" />
				<circle cx="6" cy="6" r="0.5" />
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
