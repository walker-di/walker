<script lang="ts">
	import { onDestroy } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	import BacklogSidebar from "./components/backlog-sidebar.svelte";
	import EpicCard from "./components/epic-card.svelte";
	import StoryCard from "./components/story-card.svelte";
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
							(backlogViewModel.showAddEpicForm =
								!backlogViewModel.showAddEpicForm)}
					>
						+ Add Epic
					</Button>
				{/if}
				{#if props.allowAddRelease !== false}
					<Button
						variant="outline"
						onclick={() =>
							(backlogViewModel.showAddReleaseForm =
								!backlogViewModel.showAddReleaseForm)}
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
									Start by creating your first epic to organize your user
									stories
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
						<!-- Story Map Grid Layout -->
						<div class="flex flex-col h-full">
							<!-- Epic Headers Row -->
							<div
								class="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10"
							>
								<!-- Empty corner cell for release labels -->
								<div
									class="w-48 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-800"
								>
									<h3
										class="text-sm font-semibold text-gray-900 dark:text-gray-100"
									>
										Releases / Epics
									</h3>
								</div>

								<!-- Epic columns -->
								<div class="flex-1 flex">
									{#each backlogViewModel.epics as epic, index (epic.id)}
										<div
											class="flex-1 min-w-48 p-3 border-r border-gray-200 dark:border-gray-800"
										>
											<EpicCard
												{epic}
												{index}
												allowEdit={props.allowAddEpic !== false}
												allowRemove={props.allowRemoveEpic !== false}
												allowDrag={props.allowDragDrop !== false}
												showActions={true}
												onUpdate={(updates) =>
													backlogViewModel.updateEpicData(epic.id, updates)}
												onRemove={() =>
													backlogViewModel.removeEpicData(epic.id)}
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
										</div>
									{/each}

									<!-- Add Epic Column -->
									{#if !backlogViewModel.showAddEpicForm && props.allowAddEpic !== false}
										<div class="w-48 flex-shrink-0 p-3">
											<button
												class="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
												onclick={() =>
													(backlogViewModel.showAddEpicForm = true)}
											>
												<div class="text-center">
													<div class="text-2xl mb-1">+</div>
													<span class="text-xs font-medium">Add Epic</span>
												</div>
											</button>
										</div>
									{/if}
								</div>
							</div>

							<!-- Story Grid Rows -->
							<div class="flex-1 overflow-auto">
								<!-- Scheduled Releases -->
								{#each backlogViewModel.releases.filter((r) => r.isScheduled) as release, releaseIndex (release.id)}
									<div
										class="flex border-b border-gray-200 dark:border-gray-800 min-h-32"
									>
										<!-- Release Label -->
										<div
											class="w-48 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
										>
											<div class="flex items-center gap-2">
												<div
													class="w-3 h-3 rounded-full"
													style="background-color: {release.color ||
														'#6B7280'};"
												></div>
												<h4
													class="font-semibold text-gray-900 dark:text-gray-100"
												>
													{release.name}
												</h4>
											</div>
											{#if release.version}
												<div
													class="text-xs text-gray-500 dark:text-gray-400 mt-1"
												>
													v{release.version}
												</div>
											{/if}
											{#if release.targetDate}
												<div
													class="text-xs text-gray-500 dark:text-gray-400 mt-1"
												>
													📅 {release.targetDate.toLocaleDateString()}
												</div>
											{/if}
										</div>

										<!-- Story cells for each epic -->
										<div class="flex-1 flex">
											{#each backlogViewModel.epics as epic (epic.id)}
												<div
													class="flex-1 min-w-48 p-3 border-r border-gray-200 dark:border-gray-800"
												>
													<div class="space-y-2">
														{#each backlogViewModel
															.getStoriesForRelease(release.id)
															.filter((s) => s.epicId === epic.id) as story, storyIndex (story.id)}
															<StoryCard
																{story}
																epicId={epic.id}
																releaseId={release.id}
																index={storyIndex}
																allowEdit={props.allowAddStory !== false}
																allowRemove={props.allowRemoveStory !== false}
																allowDrag={props.allowDragDrop !== false}
																showStoryPoints={props.showStoryPoints !==
																	false}
																showActions={true}
																onUpdate={(updates) =>
																	backlogViewModel.updateUserStoryData(
																		story.id,
																		updates,
																	)}
																onRemove={() =>
																	backlogViewModel.removeUserStoryData(
																		story.id,
																	)}
																onDragStart={(event) => {
																	// Handle story drag start
																	console.log("Story drag start:", event);
																}}
																onDragEnd={(event) => {
																	// Handle story drag end
																	console.log("Story drag end:", event);
																}}
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

														<!-- Add story button for this epic/release intersection -->
														{#if props.allowAddStory !== false}
															<button
																class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xs"
																onclick={() =>
																	backlogViewModel.addUserStory(
																		epic.id,
																		release.id,
																		{ title: `New story for ${epic.title}` },
																	)}
															>
																+ Add Story
															</button>
														{/if}
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/each}

								<!-- Unscheduled Section -->
								{#if props.showUnscheduled !== false}
									<div
										class="flex border-b border-gray-200 dark:border-gray-800 min-h-32"
									>
										<!-- Unscheduled Label -->
										<div
											class="w-48 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
										>
											<div class="flex items-center gap-2">
												<div class="w-3 h-3 rounded-full bg-gray-400"></div>
												<h4
													class="font-semibold text-gray-900 dark:text-gray-100"
												>
													Unscheduled
												</h4>
											</div>
											<div
												class="text-xs text-gray-500 dark:text-gray-400 mt-1"
											>
												Not assigned to release
											</div>
										</div>

										<!-- Unscheduled story cells for each epic -->
										<div class="flex-1 flex">
											{#each backlogViewModel.epics as epic (epic.id)}
												<div
													class="flex-1 min-w-48 p-3 border-r border-gray-200 dark:border-gray-800"
												>
													<div class="space-y-2">
														{#each backlogViewModel
															.getUnscheduledStories()
															.filter((s) => s.epicId === epic.id) as story, storyIndex (story.id)}
															<StoryCard
																{story}
																epicId={epic.id}
																index={storyIndex}
																allowEdit={props.allowAddStory !== false}
																allowRemove={props.allowRemoveStory !== false}
																allowDrag={props.allowDragDrop !== false}
																showStoryPoints={props.showStoryPoints !==
																	false}
																showActions={true}
																onUpdate={(updates) =>
																	backlogViewModel.updateUserStoryData(
																		story.id,
																		updates,
																	)}
																onRemove={() =>
																	backlogViewModel.removeUserStoryData(
																		story.id,
																	)}
																onDragStart={(event) => {
																	// Handle story drag start
																	console.log("Story drag start:", event);
																}}
																onDragEnd={(event) => {
																	// Handle story drag end
																	console.log("Story drag end:", event);
																}}
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

														<!-- Add unscheduled story button for this epic -->
														{#if props.allowAddStory !== false}
															<button
																class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xs"
																onclick={() =>
																	backlogViewModel.addUserStory(
																		epic.id,
																		undefined,
																		{ title: `New story for ${epic.title}` },
																	)}
															>
																+ Add Story
															</button>
														{/if}
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Add Release Row -->
								{#if backlogViewModel.showAddReleaseForm}
									<div
										class="flex border-b border-gray-200 dark:border-gray-800"
									>
										<div
											class="w-48 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
										>
											<Input
												placeholder="Release name..."
												class="text-sm"
												onkeydown={(event) => {
													if (event.key === "Enter") {
														event.preventDefault();
														const input = event.target as HTMLInputElement;
														if (input.value.trim()) {
															backlogViewModel.addRelease({
																name: input.value.trim(),
															});
															input.value = "";
															backlogViewModel.showAddReleaseForm = false;
														}
													} else if (event.key === "Escape") {
														backlogViewModel.showAddReleaseForm = false;
													}
												}}
												autofocus
											/>
											<div class="flex gap-1 mt-2">
												<Button
													size="sm"
													onclick={(event) => {
														const input = event.target
															?.closest(".w-48")
															?.querySelector("input") as HTMLInputElement;
														if (input?.value.trim()) {
															backlogViewModel.addRelease({
																name: input.value.trim(),
															});
															input.value = "";
															backlogViewModel.showAddReleaseForm = false;
														}
													}}
												>
													Add
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onclick={() => {
														backlogViewModel.showAddReleaseForm = false;
													}}
												>
													×
												</Button>
											</div>
										</div>
										<div class="flex-1"></div>
									</div>
								{:else if props.allowAddRelease !== false}
									<div class="flex">
										<div
											class="w-48 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-800"
										>
											<button
												class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
												onclick={() =>
													(backlogViewModel.showAddReleaseForm = true)}
											>
												+ Add Release
											</button>
										</div>
										<div class="flex-1"></div>
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
