<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		Card,
		CardContent,
		CardHeader,
	} from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";

	import type { ReleaseRowProps } from "../types/user-story-map.js";

	// Props
	let props: ReleaseRowProps = $props();

	// Local state
	let isEditing = $state(false);
	let editName = $state(props.release.name);
	let editDescription = $state(props.release.description || "");
	let editVersion = $state(props.release.version || "");

	// Handle edit release
	function handleEditRelease() {
		if (!editName.trim()) return;

		props.onUpdate?.({
			name: editName.trim(),
			description: editDescription.trim() || undefined,
			version: editVersion.trim() || undefined,
		});
		isEditing = false;
	}

	// Handle key press for release edit
	function handleReleaseKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleEditRelease();
		} else if (event.key === "Escape") {
			isEditing = false;
			editName = props.release.name;
			editDescription = props.release.description || "";
			editVersion = props.release.version || "";
		}
	}

	// Get status color
	function getStatusColor(status: string): string {
		switch (status) {
			case "planning":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
			case "development":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "testing":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
			case "released":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	}

	// Calculate total story points
	let totalStoryPoints = $derived(
		props.userStories.reduce((sum, story) => sum + (story.storyPoints || 0), 0),
	);

	// Get unassigned stories
	let unassignedStories = $derived(
		props.allStories.filter(
			(story) => !props.release.userStoryIds.includes(story.id),
		),
	);
</script>

<Card
	class="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
>
	<CardHeader class="pb-3">
		{#if isEditing}
			<!-- Edit Mode -->
			<div class="space-y-2">
				<Input
					bind:value={editName}
					placeholder="Release name..."
					class="font-semibold"
					onkeydown={handleReleaseKeyPress}
					autofocus
				/>
				<Input
					bind:value={editVersion}
					placeholder="Version (optional)..."
					class="text-sm"
					onkeydown={handleReleaseKeyPress}
				/>
				<Input
					bind:value={editDescription}
					placeholder="Description (optional)..."
					class="text-sm"
					onkeydown={handleReleaseKeyPress}
				/>
				<div class="flex gap-2">
					<Button
						size="sm"
						onclick={handleEditRelease}
						disabled={!editName.trim()}
					>
						Save
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => {
							isEditing = false;
							editName = props.release.name;
							editDescription = props.release.description || "";
							editVersion = props.release.version || "";
						}}
					>
						Cancel
					</Button>
				</div>
			</div>
		{:else}
			<!-- View Mode -->
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-2">
						<h3
							class="font-semibold text-lg text-purple-900 dark:text-purple-100"
						>
							{props.release.name}
						</h3>
						{#if props.release.version}
							<Badge variant="secondary">
								v{props.release.version}
							</Badge>
						{/if}
						<Badge class={getStatusColor(props.release.status)}>
							{props.release.status}
						</Badge>
					</div>
					{#if props.release.description}
						<p class="text-sm text-purple-700 dark:text-purple-300 mb-2">
							{props.release.description}
						</p>
					{/if}
					<div
						class="flex items-center gap-4 text-sm text-purple-600 dark:text-purple-400"
					>
						<span>{props.userStories.length} stories</span>
						{#if totalStoryPoints > 0}
							<span>{totalStoryPoints} story points</span>
						{/if}
						{#if props.release.targetDate}
							<span
								>Target: {props.release.targetDate.toLocaleDateString()}</span
							>
						{/if}
					</div>
				</div>

				{#if props.showActions}
					<div class="flex gap-1">
						{#if props.allowEdit}
							<Button
								size="sm"
								variant="ghost"
								onclick={() => {
									isEditing = true;
									editName = props.release.name;
									editDescription = props.release.description || "";
									editVersion = props.release.version || "";
								}}
							>
								✏️
							</Button>
						{/if}
						{#if props.allowRemove}
							<Button
								size="sm"
								variant="ghost"
								onclick={() => props.onRemove?.()}
							>
								🗑️
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</CardHeader>

	<CardContent class="pt-0">
		<!-- Release Goals -->
		{#if props.release.goals.length > 0}
			<div class="mb-4">
				<h4
					class="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2"
				>
					Goals:
				</h4>
				<div class="flex flex-wrap gap-1">
					{#each props.release.goals as goal}
						<Badge variant="outline" class="text-xs">
							{goal}
						</Badge>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Release Features -->
		{#if props.release.features.length > 0}
			<div class="mb-4">
				<h4
					class="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2"
				>
					Features:
				</h4>
				<div class="flex flex-wrap gap-1">
					{#each props.release.features as feature}
						<Badge variant="outline" class="text-xs">
							{feature}
						</Badge>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Assigned Stories -->
		{#if props.userStories.length > 0}
			<div class="mb-4">
				<h4
					class="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2"
				>
					Assigned Stories ({props.userStories.length}):
				</h4>
				<div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{#each props.userStories as story}
						<div
							class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
						>
							<div class="flex-1 min-w-0">
								<p
									class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate"
								>
									{story.title}
								</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									As a {story.asA}
								</p>
								{#if story.storyPoints}
									<Badge variant="outline" class="text-xs mt-1">
										{story.storyPoints} pts
									</Badge>
								{/if}
							</div>
							<Button
								size="sm"
								variant="ghost"
								class="h-6 w-6 p-0 ml-2"
								onclick={() => props.onStoryUnassign?.(story.id)}
								title="Remove from release"
							>
								×
							</Button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Available Stories to Assign -->
		{#if unassignedStories.length > 0}
			<div>
				<h4
					class="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2"
				>
					Available Stories ({unassignedStories.length}):
				</h4>
				<div
					class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-h-40 overflow-y-auto"
				>
					{#each unassignedStories.slice(0, 6) as story}
						<div
							class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded border border-dashed"
						>
							<div class="flex-1 min-w-0">
								<p
									class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate"
								>
									{story.title}
								</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									As a {story.asA}
								</p>
								{#if story.storyPoints}
									<Badge variant="outline" class="text-xs mt-1">
										{story.storyPoints} pts
									</Badge>
								{/if}
							</div>
							<Button
								size="sm"
								variant="ghost"
								class="h-6 w-6 p-0 ml-2"
								onclick={() => props.onStoryAssign?.(story.id)}
								title="Add to release"
							>
								+
							</Button>
						</div>
					{/each}
				</div>
				{#if unassignedStories.length > 6}
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
						... and {unassignedStories.length - 6} more stories
					</p>
				{/if}
			</div>
		{/if}
	</CardContent>
</Card>
