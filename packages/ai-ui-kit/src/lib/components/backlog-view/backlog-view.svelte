<script lang="ts">
	import { onDestroy } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	import BacklogSidebar from "./components/backlog-sidebar.svelte";
	import EpicCard from "./components/epic-card.svelte";
	import ReleaseSwimLane from "./components/release-swim-lane.svelte";
	import UnscheduledSwimLane from "./components/unscheduled-swim-lane.svelte";
	import { BacklogViewModel } from "./backlog-view-model.svelte.js";
	import type { BacklogViewProps } from "./types/backlog.js";

	// Props with defaults
	let props: BacklogViewProps = $props();

	// Create view model instance
	const backlogViewModel = new BacklogViewModel(props);

	// Update view model when props change
	$effect(() => {
		backlogViewModel.updateProps(props);
	});

	// Local state for new epic form
	let newEpicTitle = $state("");

	// Handle add epic
	function handleAddEpic() {
		if (!newEpicTitle.trim()) return;

		backlogViewModel.addEpic({ title: newEpicTitle.trim() });
		newEpicTitle = "";
		backlogViewModel.showAddEpicForm = false;
	}

	// Handle key press for new epic
	function handleNewEpicKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddEpic();
		} else if (event.key === "Escape") {
			backlogViewModel.showAddEpicForm = false;
			newEpicTitle = "";
		}
	}

	// Cleanup on destroy
	onDestroy(() => {
		backlogViewModel.destroy();
	});
</script>

<div class="flex h-full bg-gray-50 dark:bg-gray-950 text-foreground">
	<!-- Sidebar -->
	<BacklogSidebar
		viewMode={backlogViewModel.viewMode}
		onViewModeChange={(mode) => backlogViewModel.setViewMode(mode)}
	/>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col overflow-hidden">
		<!-- Header -->
		<div
			class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
		>
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					{backlogViewModel.board?.title || "Product Backlog"}
				</h1>
				{#if backlogViewModel.board?.description}
					<p class="text-gray-600 dark:text-gray-400 mt-1">
						{backlogViewModel.board.description}
					</p>
				{/if}
			</div>

			<!-- Header Actions -->
			<div class="flex items-center gap-2">
				{#if props.allowAddEpic !== false}
					<Button
						variant="outline"
						onclick={() =>
							(backlogViewModel.showAddEpicForm = !backlogViewModel.showAddEpicForm)}
					>
						+ Add Epic
					</Button>
				{/if}
				{#if props.allowAddRelease !== false}
					<Button
						variant="outline"
						onclick={() =>
							(backlogViewModel.showAddReleaseForm = !backlogViewModel.showAddReleaseForm)}
					>
						+ Add Release
					</Button>
				{/if}
			</div>
		</div>

		<!-- Add Epic Form -->
		{#if backlogViewModel.showAddEpicForm}
			<div
				class="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
			>
				<div class="flex gap-2 max-w-md">
					<Input
						bind:value={newEpicTitle}
						placeholder="Enter epic title..."
						class="flex-1"
						onkeydown={handleNewEpicKeyPress}
						autofocus
					/>
					<Button onclick={handleAddEpic} disabled={!newEpicTitle.trim()}>
						Add
					</Button>
					<Button
						variant="ghost"
						onclick={() => {
							backlogViewModel.showAddEpicForm = false;
							newEpicTitle = "";
						}}
					>
						×
					</Button>
				</div>
			</div>
		{/if}

		<!-- Main Content Area -->
		<div class="flex-1 overflow-hidden">
			<ScrollArea class="h-full">
				<div class="p-6">
					{#if backlogViewModel.epics.length === 0}
						<!-- Empty State -->
						<div class="flex items-center justify-center min-h-96">
							<div class="text-center">
								<div class="text-6xl mb-4">📋</div>
								<h3
									class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
								>
									No epics yet
								</h3>
								<p class="text-gray-600 dark:text-gray-400 mb-4">
									Start by creating your first epic to organize your user stories
								</p>
								{#if props.allowAddEpic !== false}
									<Button
										onclick={() => (backlogViewModel.showAddEpicForm = true)}
									>
										+ Create First Epic
									</Button>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Backlog Content -->
						<div class="space-y-6">
							<!-- Epics Row -->
							<div class="space-y-4">
								<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
									Epics
								</h2>
								<div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
									{#each backlogViewModel.epics as epic, index (epic.id)}
										<EpicCard
											{epic}
											{index}
											allowEdit={props.allowAddEpic !== false}
											allowRemove={props.allowRemoveEpic !== false}
											allowDrag={props.allowDragDrop !== false}
											showActions={true}
											onUpdate={(updates) =>
												backlogViewModel.updateEpicData(epic.id, updates)}
											onRemove={() => backlogViewModel.removeEpicData(epic.id)}
											onDragStart={(event) => {
												// Handle epic drag start
												console.log("Epic drag start:", event);
											}}
											onDragEnd={(event) => {
												// Handle epic drag end
												console.log("Epic drag end:", event);
											}}
											onMoveLeft={() => {
												// Handle epic move left
												console.log("Epic move left");
											}}
											onMoveRight={() => {
												// Handle epic move right
												console.log("Epic move right");
											}}
										/>
									{/each}

									<!-- Add Epic Button (when not in form mode) -->
									{#if !backlogViewModel.showAddEpicForm && props.allowAddEpic !== false}
										<button
											class="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
											onclick={() => (backlogViewModel.showAddEpicForm = true)}
										>
											<div class="text-center">
												<div class="text-4xl mb-2">+</div>
												<span class="text-sm font-medium">Add Epic</span>
											</div>
										</button>
									{/if}
								</div>
							</div>

							<!-- Releases Section -->
							<div class="space-y-4">
								{#each backlogViewModel.releases.filter(r => r.isScheduled) as release, index (release.id)}
									<ReleaseSwimLane
										{release}
										epics={backlogViewModel.epics}
										userStories={backlogViewModel.getStoriesForRelease(release.id)}
										{index}
										allowAddStory={props.allowAddStory !== false}
										allowRemoveRelease={props.allowRemoveRelease !== false}
										allowEditRelease={props.allowAddRelease !== false}
										allowDragStory={props.allowDragDrop !== false}
										showStoryPoints={props.showStoryPoints !== false}
										showActions={true}
										onStoryAdd={(epicId, story) =>
											backlogViewModel.addUserStory(epicId, release.id, story)}
										onStoryUpdate={(storyId, updates) =>
											backlogViewModel.updateUserStoryData(storyId, updates)}
										onStoryRemove={(storyId) =>
											backlogViewModel.removeUserStoryData(storyId)}
										onStoryMove={(event) => {
											// Handle story drag and drop
											console.log("Story moved:", event);
										}}
										onReleaseUpdate={(updates) =>
											backlogViewModel.updateReleaseData(release.id, updates)}
										onReleaseRemove={() =>
											backlogViewModel.removeReleaseData(release.id)}
										onReleaseMove={(direction) => {
											// Handle release reordering
											console.log("Release move:", direction);
										}}
									/>
								{/each}

								<!-- Unscheduled Section -->
								{#if props.showUnscheduled !== false}
									<UnscheduledSwimLane
										epics={backlogViewModel.epics}
										userStories={backlogViewModel.getUnscheduledStories()}
										allowAddStory={props.allowAddStory !== false}
										allowDragStory={props.allowDragDrop !== false}
										showStoryPoints={props.showStoryPoints !== false}
										showActions={true}
										onStoryAdd={(epicId, story) =>
											backlogViewModel.addUserStory(epicId, undefined, story)}
										onStoryUpdate={(storyId, updates) =>
											backlogViewModel.updateUserStoryData(storyId, updates)}
										onStoryRemove={(storyId) =>
											backlogViewModel.removeUserStoryData(storyId)}
										onStoryMove={(event) => {
											// Handle story drag and drop
											console.log("Story moved:", event);
										}}
									/>
								{/if}

								<!-- Add Release Form -->
								{#if backlogViewModel.showAddReleaseForm}
									<div class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
										<div class="flex gap-2">
											<Input
												placeholder="Release name..."
												class="flex-1"
												onkeydown={(event) => {
													if (event.key === "Enter") {
														event.preventDefault();
														const input = event.target as HTMLInputElement;
														if (input.value.trim()) {
															backlogViewModel.addRelease({ name: input.value.trim() });
															input.value = "";
															backlogViewModel.showAddReleaseForm = false;
														}
													} else if (event.key === "Escape") {
														backlogViewModel.showAddReleaseForm = false;
													}
												}}
												autofocus
											/>
											<Button
												onclick={(event) => {
													const input = event.target?.closest('.flex')?.querySelector('input') as HTMLInputElement;
													if (input?.value.trim()) {
														backlogViewModel.addRelease({ name: input.value.trim() });
														input.value = "";
														backlogViewModel.showAddReleaseForm = false;
													}
												}}
											>
												Add
											</Button>
											<Button
												variant="ghost"
												onclick={() => {
													backlogViewModel.showAddReleaseForm = false;
												}}
											>
												×
											</Button>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</ScrollArea>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for better UX */
	:global(.backlog-scroll) {
		scrollbar-width: thin;
		scrollbar-color: rgb(156 163 175) transparent;
	}

	:global(.backlog-scroll::-webkit-scrollbar) {
		height: 8px;
		width: 8px;
	}

	:global(.backlog-scroll::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.backlog-scroll::-webkit-scrollbar-thumb) {
		background-color: rgb(156 163 175);
		border-radius: 4px;
	}

	:global(.backlog-scroll::-webkit-scrollbar-thumb:hover) {
		background-color: rgb(107 114 128);
	}
</style>
