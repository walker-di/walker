<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu/index.js";
	import StoryCard from "./story-card.svelte";
	import type { ReleaseSwimLaneProps } from "../types/backlog.js";
	import { calculateReleaseStoryPoints } from "../utils/backlog-utils.js";

	let {
		release,
		epics,
		userStories,
		index,
		allowAddStory = true,
		allowRemoveRelease = true,
		allowEditRelease = true,
		allowDragStory = true,
		showStoryPoints = true,
		showActions = true,
		onStoryAdd,
		onStoryUpdate,
		onStoryRemove,
		onStoryMove,
		onReleaseUpdate,
		onReleaseRemove,
		onReleaseMove,
	}: ReleaseSwimLaneProps = $props();

	let isEditingRelease = $state(false);
	let editReleaseName = $state(release.name);
	let showAddStoryForm = $state<string | null>(null); // epicId
	let newStoryTitle = $state("");

	// Calculate total story points for this release
	const totalStoryPoints = $derived(
		showStoryPoints ? calculateReleaseStoryPoints(userStories, release.id) : 0,
	);

	// Group stories by epic
	const storiesByEpic = $derived(
		epics.reduce(
			(acc, epic) => {
				acc[epic.id] = userStories.filter((story) => story.epicId === epic.id);
				return acc;
			},
			{} as Record<string, typeof userStories>,
		),
	);

	// Stories not assigned to any epic
	const unassignedStories = $derived(
		userStories.filter((story) => !story.epicId),
	);

	// Handle release name edit
	function handleSaveRelease() {
		if (!editReleaseName.trim()) return;
		onReleaseUpdate?.({ name: editReleaseName.trim() });
		isEditingRelease = false;
	}

	function handleCancelReleaseEdit() {
		editReleaseName = release.name;
		isEditingRelease = false;
	}

	// Handle add story
	function handleAddStory(epicId?: string) {
		if (!newStoryTitle.trim()) return;

		onStoryAdd?.(epicId, { title: newStoryTitle.trim() });
		newStoryTitle = "";
		showAddStoryForm = null;
	}

	// Handle key press for story form
	function handleStoryKeyPress(event: KeyboardEvent, epicId?: string) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddStory(epicId);
		} else if (event.key === "Escape") {
			showAddStoryForm = null;
			newStoryTitle = "";
		}
	}

	// Get release status color
	function getReleaseStatusColor() {
		const colors: Record<string, string> = {
			planning: "#6B7280",
			development: "#F59E0B",
			testing: "#8B5CF6",
			released: "#10B981",
			cancelled: "#EF4444",
		};
		return colors[release.status] || "#6B7280";
	}
</script>

<div
	class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden"
>
	<!-- Release Header -->
	<div
		class="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
		style="background-color: {getReleaseStatusColor()}10; border-bottom-color: {getReleaseStatusColor()}20;"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3 flex-1 min-w-0">
				{#if isEditingRelease}
					<Input
						bind:value={editReleaseName}
						class="font-semibold"
						onkeydown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleSaveRelease();
							} else if (event.key === "Escape") {
								handleCancelReleaseEdit();
							}
						}}
						autofocus
					/>
					<div class="flex gap-1">
						<Button
							size="sm"
							onclick={handleSaveRelease}
							disabled={!editReleaseName.trim()}
						>
							Save
						</Button>
						<Button size="sm" variant="ghost" onclick={handleCancelReleaseEdit}>
							Cancel
						</Button>
					</div>
				{:else}
					<div class="flex items-center gap-3 flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<div
								class="w-3 h-3 rounded-full"
								style="background-color: {getReleaseStatusColor()};"
							></div>
							<h3
								class="font-semibold text-gray-900 dark:text-gray-100 truncate"
							>
								{release.name}
							</h3>
						</div>

						{#if release.version}
							<Badge variant="outline" class="text-xs">
								v{release.version}
							</Badge>
						{/if}

						<Badge
							variant="secondary"
							class="text-xs"
							style="background-color: {getReleaseStatusColor()}20; color: {getReleaseStatusColor()};"
						>
							{release.status}
						</Badge>

						{#if showStoryPoints && totalStoryPoints > 0}
							<Badge variant="outline" class="text-xs">
								{totalStoryPoints} pts
							</Badge>
						{/if}

						{#if release.targetDate}
							<Badge variant="outline" class="text-xs">
								📅 {release.targetDate.toLocaleDateString()}
							</Badge>
						{/if}
					</div>

					{#if showActions}
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button variant="ghost" size="sm" class="h-6 w-6 p-0">⋮</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{#if allowEditRelease}
									<DropdownMenuItem onclick={() => (isEditingRelease = true)}>
										✏️ Edit Release
									</DropdownMenuItem>
								{/if}
								{#if onReleaseMove}
									<DropdownMenuItem onclick={() => onReleaseMove?.("up")}>
										↑ Move Up
									</DropdownMenuItem>
									<DropdownMenuItem onclick={() => onReleaseMove?.("down")}>
										↓ Move Down
									</DropdownMenuItem>
								{/if}
								{#if allowRemoveRelease && onReleaseRemove}
									<DropdownMenuItem
										onclick={onReleaseRemove}
										class="text-red-600 dark:text-red-400"
									>
										🗑️ Remove Release
									</DropdownMenuItem>
								{/if}
							</DropdownMenuContent>
						</DropdownMenu>
					{/if}
				{/if}
			</div>
		</div>

		{#if release.description}
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
				{release.description}
			</p>
		{/if}
	</div>

	<!-- Stories Grid -->
	<div class="p-4">
		<div
			class="grid gap-4"
			style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));"
		>
			{#each epics as epic (epic.id)}
				<div class="space-y-2">
					<!-- Epic Column Header -->
					<div
						class="text-xs font-medium text-gray-500 dark:text-gray-400 px-2"
					>
						{epic.title}
					</div>

					<!-- Stories for this Epic -->
					<div class="space-y-2 min-h-24">
						{#each storiesByEpic[epic.id] || [] as story, storyIndex (story.id)}
							<StoryCard
								{story}
								epicId={epic.id}
								releaseId={release.id}
								index={storyIndex}
								allowEdit={allowAddStory}
								allowRemove={allowAddStory}
								allowDrag={allowDragStory}
								{showStoryPoints}
								{showActions}
								onUpdate={(updates) => onStoryUpdate?.(story.id, updates)}
								onRemove={() => onStoryRemove?.(story.id)}
								onDragStart={(event) => onStoryMove?.(event)}
								onDragEnd={(event) => onStoryMove?.(event)}
								onMoveUp={() => {
									// Handle story move up
									console.log("Story move up");
								}}
								onMoveDown={() => {
									// Handle story move down
									console.log("Story move down");
								}}
							/>
						{/each}

						<!-- Add Story Form for this Epic -->
						{#if showAddStoryForm === epic.id}
							<div
								class="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800"
							>
								<div class="flex gap-1">
									<Input
										bind:value={newStoryTitle}
										placeholder="Story title..."
										class="text-sm"
										onkeydown={(event) => handleStoryKeyPress(event, epic.id)}
										autofocus
									/>
									<Button
										size="sm"
										onclick={() => handleAddStory(epic.id)}
										disabled={!newStoryTitle.trim()}
									>
										Add
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onclick={() => {
											showAddStoryForm = null;
											newStoryTitle = "";
										}}
									>
										×
									</Button>
								</div>
							</div>
						{:else if allowAddStory}
							<!-- Add Story Button for this Epic -->
							<button
								class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
								onclick={() => (showAddStoryForm = epic.id)}
							>
								+ Add Story
							</button>
						{/if}
					</div>
				</div>
			{/each}

			<!-- Unassigned Stories Column -->
			{#if unassignedStories.length > 0 || allowAddStory}
				<div class="space-y-2">
					<!-- Unassigned Column Header -->
					<div
						class="text-xs font-medium text-gray-500 dark:text-gray-400 px-2"
					>
						Unassigned
					</div>

					<!-- Unassigned Stories -->
					<div class="space-y-2 min-h-24">
						{#each unassignedStories as story, storyIndex (story.id)}
							<StoryCard
								{story}
								releaseId={release.id}
								index={storyIndex}
								allowEdit={allowAddStory}
								allowRemove={allowAddStory}
								allowDrag={allowDragStory}
								{showStoryPoints}
								{showActions}
								onUpdate={(updates) => onStoryUpdate?.(story.id, updates)}
								onRemove={() => onStoryRemove?.(story.id)}
								onDragStart={(event) => onStoryMove?.(event)}
								onDragEnd={(event) => onStoryMove?.(event)}
								onMoveUp={() => {
									// Handle story move up
									console.log("Story move up");
								}}
								onMoveDown={() => {
									// Handle story move down
									console.log("Story move down");
								}}
							/>
						{/each}

						<!-- Add Unassigned Story Form -->
						{#if showAddStoryForm === "unassigned"}
							<div
								class="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800"
							>
								<div class="flex gap-1">
									<Input
										bind:value={newStoryTitle}
										placeholder="Story title..."
										class="text-sm"
										onkeydown={(event) => handleStoryKeyPress(event)}
										autofocus
									/>
									<Button
										size="sm"
										onclick={() => handleAddStory()}
										disabled={!newStoryTitle.trim()}
									>
										Add
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onclick={() => {
											showAddStoryForm = null;
											newStoryTitle = "";
										}}
									>
										×
									</Button>
								</div>
							</div>
						{:else if allowAddStory}
							<!-- Add Unassigned Story Button -->
							<button
								class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
								onclick={() => (showAddStoryForm = "unassigned")}
							>
								+ Add Story
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
