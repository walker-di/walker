<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Card, CardContent } from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";

	import type { UserStoryCardProps } from "../types/user-story-map.js";

	// Props
	let props: UserStoryCardProps = $props();

	// Local state
	let isEditing = $state(false);
	let editTitle = $state(props.story.title);
	let editAsA = $state(props.story.asA);
	let editIWant = $state(props.story.iWant);
	let editSoThat = $state(props.story.soThat);
	let editStoryPoints = $state(props.story.storyPoints?.toString() || "");

	// Handle edit story
	function handleEditStory() {
		if (
			!editTitle.trim() ||
			!editAsA.trim() ||
			!editIWant.trim() ||
			!editSoThat.trim()
		)
			return;

		const storyPoints = editStoryPoints ? parseInt(editStoryPoints) : undefined;

		props.onUpdate?.({
			title: editTitle.trim(),
			asA: editAsA.trim(),
			iWant: editIWant.trim(),
			soThat: editSoThat.trim(),
			storyPoints: storyPoints && !isNaN(storyPoints) ? storyPoints : undefined,
		});
		isEditing = false;
	}

	// Handle key press for story edit
	function handleStoryKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleEditStory();
		} else if (event.key === "Escape") {
			isEditing = false;
			editTitle = props.story.title;
			editAsA = props.story.asA;
			editIWant = props.story.iWant;
			editSoThat = props.story.soThat;
			editStoryPoints = props.story.storyPoints?.toString() || "";
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
			case "testing":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
			case "done":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	}
</script>

<Card
	class="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
>
	<CardContent class="p-3">
		{#if isEditing}
			<!-- Edit Mode -->
			<div class="space-y-2">
				<Input
					bind:value={editTitle}
					placeholder="Story title..."
					class="text-sm font-medium"
					onkeydown={handleStoryKeyPress}
					autofocus
				/>
				<div class="grid grid-cols-1 gap-2">
					<Input
						bind:value={editAsA}
						placeholder="As a..."
						class="text-xs"
						onkeydown={handleStoryKeyPress}
					/>
					<Input
						bind:value={editIWant}
						placeholder="I want..."
						class="text-xs"
						onkeydown={handleStoryKeyPress}
					/>
					<Input
						bind:value={editSoThat}
						placeholder="So that..."
						class="text-xs"
						onkeydown={handleStoryKeyPress}
					/>
				</div>
				{#if props.showStoryPoints}
					<Input
						bind:value={editStoryPoints}
						placeholder="Story points..."
						type="number"
						class="text-xs"
						onkeydown={handleStoryKeyPress}
					/>
				{/if}
				<div class="flex gap-1">
					<Button
						size="sm"
						class="h-7 px-2 text-xs"
						onclick={handleEditStory}
						disabled={!editTitle.trim() ||
							!editAsA.trim() ||
							!editIWant.trim() ||
							!editSoThat.trim()}
					>
						Save
					</Button>
					<Button
						size="sm"
						variant="ghost"
						class="h-7 px-2 text-xs"
						onclick={() => {
							isEditing = false;
							editTitle = props.story.title;
							editAsA = props.story.asA;
							editIWant = props.story.iWant;
							editSoThat = props.story.soThat;
							editStoryPoints = props.story.storyPoints?.toString() || "";
						}}
					>
						Cancel
					</Button>
				</div>
			</div>
		{:else}
			<!-- View Mode -->
			<div class="space-y-2">
				<!-- Header with title and actions -->
				<div class="flex items-start justify-between">
					<h6
						class="font-medium text-sm text-gray-900 dark:text-gray-100 flex-1 min-w-0"
					>
						{props.story.title}
					</h6>
					<div class="flex gap-1 ml-2">
						{#if props.allowEdit}
							<Button
								size="sm"
								variant="ghost"
								class="h-5 w-5 p-0 text-xs"
								onclick={() => {
									isEditing = true;
									editTitle = props.story.title;
									editAsA = props.story.asA;
									editIWant = props.story.iWant;
									editSoThat = props.story.soThat;
									editStoryPoints = props.story.storyPoints?.toString() || "";
								}}
							>
								✏️
							</Button>
						{/if}
						{#if props.allowRemove}
							<Button
								size="sm"
								variant="ghost"
								class="h-5 w-5 p-0 text-xs"
								onclick={() => props.onRemove?.()}
							>
								🗑️
							</Button>
						{/if}
					</div>
				</div>

				<!-- Story format -->
				<div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
					<p><span class="font-medium">As a</span> {props.story.asA}</p>
					<p><span class="font-medium">I want</span> {props.story.iWant}</p>
					<p><span class="font-medium">So that</span> {props.story.soThat}</p>
				</div>

				<!-- Badges -->
				<div class="flex items-center gap-1 flex-wrap">
					<Badge class="{getPriorityColor(props.story.priority)} text-xs">
						{props.story.priority}
					</Badge>
					<Badge class="{getStatusColor(props.story.status)} text-xs">
						{props.story.status}
					</Badge>
					{#if props.showStoryPoints && props.story.storyPoints}
						<Badge variant="outline" class="text-xs">
							{props.story.storyPoints} pts
						</Badge>
					{/if}
					{#if props.story.assignee}
						<Badge variant="secondary" class="text-xs">
							{props.story.assignee}
						</Badge>
					{/if}
				</div>

				<!-- Labels -->
				{#if props.story.labels.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each props.story.labels as label}
							<Badge variant="outline" class="text-xs">
								{label}
							</Badge>
						{/each}
					</div>
				{/if}

				<!-- Description -->
				{#if props.story.description}
					<p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
						{props.story.description}
					</p>
				{/if}

				<!-- Acceptance Criteria Count -->
				{#if props.story.acceptanceCriteria.length > 0}
					<p class="text-xs text-gray-500 dark:text-gray-500">
						{props.story.acceptanceCriteria.length} acceptance criteria
					</p>
				{/if}
			</div>
		{/if}
	</CardContent>
</Card>
