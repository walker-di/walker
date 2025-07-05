<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		Card,
		CardContent,
		CardHeader,
	} from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";

	import UserStoryCard from "./user-story-card.svelte";
	import type {
		TaskColumnProps,
		UserStory,
		DragEvent,
	} from "../types/user-story-map.js";

	// Props
	let props: TaskColumnProps = $props();

	// Local state
	let isEditing = $state(false);
	let editTitle = $state(props.task.title);
	let editDescription = $state(props.task.description || "");
	let showAddStoryForm = $state(false);
	let newStoryTitle = $state("");

	// Handle edit task
	function handleEditTask() {
		if (!editTitle.trim()) return;

		props.onTaskUpdate?.({
			title: editTitle.trim(),
			description: editDescription.trim() || undefined,
		});
		isEditing = false;
	}

	// Handle add story
	function handleAddStory() {
		if (!newStoryTitle.trim()) return;

		props.onStoryAdd?.({ title: newStoryTitle.trim() });
		newStoryTitle = "";
		showAddStoryForm = false;
	}

	// Handle key press for story
	function handleStoryKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddStory();
		} else if (event.key === "Escape") {
			showAddStoryForm = false;
			newStoryTitle = "";
		}
	}

	// Handle key press for task edit
	function handleTaskKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleEditTask();
		} else if (event.key === "Escape") {
			isEditing = false;
			editTitle = props.task.title;
			editDescription = props.task.description || "";
		}
	}

	// Get priority color
	function getPriorityColor(priority: string): string {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "low":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	}

	// Get status color
	function getStatusColor(status: string): string {
		switch (status) {
			case "ready":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "in-progress":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
			case "done":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	}

	// Calculate total story points
	let totalStoryPoints = $derived(
		props.userStories.reduce((sum, story) => sum + (story.storyPoints || 0), 0),
	);
</script>

<Card
	class="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
>
	<CardHeader class="pb-2">
		{#if isEditing}
			<!-- Edit Mode -->
			<div class="space-y-2">
				<Input
					bind:value={editTitle}
					placeholder="Task title..."
					class="font-medium text-sm"
					onkeydown={handleTaskKeyPress}
					autofocus
				/>
				<Input
					bind:value={editDescription}
					placeholder="Description (optional)..."
					class="text-xs"
					onkeydown={handleTaskKeyPress}
				/>
				<div class="flex gap-1">
					<Button
						size="sm"
						onclick={handleEditTask}
						disabled={!editTitle.trim()}
					>
						Save
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => {
							isEditing = false;
							editTitle = props.task.title;
							editDescription = props.task.description || "";
						}}
					>
						Cancel
					</Button>
				</div>
			</div>
		{:else}
			<!-- View Mode -->
			<div class="flex items-start justify-between">
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-1 mb-1 flex-wrap">
						<h5
							class="font-medium text-green-900 dark:text-green-100 text-sm truncate"
						>
							{props.task.title}
						</h5>
						<Badge class="{getPriorityColor(props.task.priority)} text-xs">
							{props.task.priority}
						</Badge>
					</div>
					<div class="flex items-center gap-1 mb-1 flex-wrap">
						<Badge class="{getStatusColor(props.task.status)} text-xs">
							{props.task.status}
						</Badge>
						{#if props.showStoryPoints && totalStoryPoints > 0}
							<Badge variant="outline" class="text-xs">
								{totalStoryPoints} pts
							</Badge>
						{/if}
					</div>
					{#if props.task.description}
						<p
							class="text-xs text-green-700 dark:text-green-300 mb-1 line-clamp-2"
						>
							{props.task.description}
						</p>
					{/if}
					{#if props.task.estimatedEffort}
						<p class="text-xs text-green-600 dark:text-green-400">
							Est: {props.task.estimatedEffort}
						</p>
					{/if}
				</div>

				{#if props.showActions}
					<div class="flex gap-1 ml-1">
						{#if props.allowEditTask}
							<Button
								size="sm"
								variant="ghost"
								class="h-6 w-6 p-0"
								onclick={() => {
									isEditing = true;
									editTitle = props.task.title;
									editDescription = props.task.description || "";
								}}
							>
								✏️
							</Button>
						{/if}
						{#if props.allowRemoveTask}
							<Button
								size="sm"
								variant="ghost"
								class="h-6 w-6 p-0"
								onclick={() => props.onTaskRemove?.()}
							>
								🗑️
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</CardHeader>

	<CardContent class="pt-0 space-y-2">
		<!-- User Stories -->
		{#each props.userStories as story, index (story.id)}
			<UserStoryCard
				{story}
				taskId={props.task.id}
				{index}
				allowEdit={props.allowEditTask !== false}
				allowRemove={props.allowRemoveTask !== false}
				allowDrag={props.allowDragStory !== false}
				showStoryPoints={props.showStoryPoints !== false}
				onUpdate={(updates: Partial<UserStory>) =>
					props.onStoryUpdate?.(story.id, updates)}
				onRemove={() => props.onStoryRemove?.(story.id)}
				onDragStart={(event: DragEvent) => {
					// Handle drag start
					console.log("Story drag start:", event);
				}}
				onDragEnd={(event: DragEvent) => {
					// Handle drag end
					console.log("Story drag end:", event);
				}}
				onMoveUp={() => {
					// Handle move up
					console.log("Story move up");
				}}
				onMoveDown={() => {
					// Handle move down
					console.log("Story move down");
				}}
			/>
		{/each}

		<!-- Add Story Form -->
		{#if showAddStoryForm}
			<Card class="border-dashed border-green-300 dark:border-green-700">
				<CardContent class="p-2">
					<div class="flex gap-1">
						<Input
							bind:value={newStoryTitle}
							placeholder="Story title..."
							class="flex-1 text-xs h-8"
							onkeydown={handleStoryKeyPress}
							autofocus
						/>
						<Button
							size="sm"
							class="h-8 px-2"
							onclick={handleAddStory}
							disabled={!newStoryTitle.trim()}
						>
							Add
						</Button>
						<Button
							size="sm"
							variant="ghost"
							class="h-8 px-2"
							onclick={() => {
								showAddStoryForm = false;
								newStoryTitle = "";
							}}
						>
							×
						</Button>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Add Story Button -->
		{#if !showAddStoryForm && props.allowAddStory}
			<button
				class="w-full p-2 border-2 border-dashed border-green-300 dark:border-green-700 rounded text-green-500 dark:text-green-400 hover:border-green-400 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-300 transition-colors"
				onclick={() => (showAddStoryForm = true)}
			>
				<div class="text-center">
					<div class="text-sm mb-0.5">+</div>
					<span class="text-xs font-medium">Add Story</span>
				</div>
			</button>
		{/if}
	</CardContent>
</Card>
