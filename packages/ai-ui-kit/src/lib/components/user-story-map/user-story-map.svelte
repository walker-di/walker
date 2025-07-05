<script lang="ts">
	import { onDestroy } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	import PersonaColumn from "./components/persona-column.svelte";
	import ReleaseRow from "./components/release-row.svelte";
	import { UserStoryMapViewModel } from "./user-story-map-view-model.svelte.js";
	import type { UserStoryMapViewProps } from "./types/user-story-map.js";

	// Props with defaults
	let props: UserStoryMapViewProps = $props();

	// Create view model instance
	const userStoryMapViewModel = new UserStoryMapViewModel(props);

	// Update view model when props change
	$effect(() => {
		userStoryMapViewModel.updateProps(props);
	});

	// Local state for new persona form
	let newPersonaName = $state("");

	// Handle add persona
	function handleAddPersona() {
		if (!newPersonaName.trim()) return;

		userStoryMapViewModel.addPersona({ name: newPersonaName.trim() });
		newPersonaName = "";
		userStoryMapViewModel.showAddPersonaForm = false;
	}

	// Handle key press for new persona
	function handleNewPersonaKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddPersona();
		} else if (event.key === "Escape") {
			userStoryMapViewModel.showAddPersonaForm = false;
			newPersonaName = "";
		}
	}

	// Cleanup on destroy
	onDestroy(() => {
		userStoryMapViewModel.destroy();
	});
</script>

<div class="flex flex-col h-full bg-gray-50 dark:bg-gray-950 text-foreground">
	<!-- Header -->
	<div
		class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
	>
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
				{userStoryMapViewModel.board?.title || "User Story Map"}
			</h1>
			{#if userStoryMapViewModel.board?.description}
				<p class="text-gray-600 dark:text-gray-400 mt-1">
					{userStoryMapViewModel.board.description}
				</p>
			{/if}
		</div>

		<!-- Header Actions -->
		<div class="flex items-center gap-2">
			{#if props.allowAddPersona !== false}
				<Button
					variant="outline"
					onclick={() =>
						(userStoryMapViewModel.showAddPersonaForm =
							!userStoryMapViewModel.showAddPersonaForm)}
				>
					+ Add Persona
				</Button>
			{/if}
			{#if props.allowAddRelease !== false}
				<Button
					variant="outline"
					onclick={() =>
						(userStoryMapViewModel.showAddReleaseForm =
							!userStoryMapViewModel.showAddReleaseForm)}
				>
					+ Add Release
				</Button>
			{/if}
		</div>
	</div>

	<!-- Add Persona Form -->
	{#if userStoryMapViewModel.showAddPersonaForm}
		<div
			class="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
		>
			<div class="flex gap-2 max-w-md">
				<Input
					bind:value={newPersonaName}
					placeholder="Enter persona name..."
					class="flex-1"
					onkeydown={handleNewPersonaKeyPress}
					autofocus
				/>
				<Button onclick={handleAddPersona} disabled={!newPersonaName.trim()}>
					Add
				</Button>
				<Button
					variant="ghost"
					onclick={() => {
						userStoryMapViewModel.showAddPersonaForm = false;
						newPersonaName = "";
					}}
				>
					×
				</Button>
			</div>
		</div>
	{/if}

	<!-- Main Content -->
	<div class="flex-1 overflow-hidden">
		<ScrollArea class="h-full">
			<div class="p-6">
				{#if userStoryMapViewModel.personas.length === 0}
					<!-- Empty State -->
					<div class="flex items-center justify-center min-h-96">
						<div class="text-center">
							<div class="text-6xl mb-4">👥</div>
							<h3
								class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
							>
								No personas yet
							</h3>
							<p class="text-gray-600 dark:text-gray-400 mb-4">
								Start by creating your first user persona to begin mapping their journey
							</p>
							{#if props.allowAddPersona !== false}
								<Button
									onclick={() => (userStoryMapViewModel.showAddPersonaForm = true)}
								>
									+ Create First Persona
								</Button>
							{/if}
						</div>
					</div>
				{:else}
					<!-- User Story Map Grid -->
					<div class="space-y-8">
						<!-- Personas and Activities Grid -->
						<div class="grid gap-6" style="grid-template-columns: repeat({userStoryMapViewModel.personas.length}, minmax(320px, 1fr));">
							{#each userStoryMapViewModel.personas as persona, index (persona.id)}
								<PersonaColumn
									{persona}
									activities={userStoryMapViewModel.getActivitiesForPersona(persona.id)}
									tasks={userStoryMapViewModel.tasks}
									userStories={userStoryMapViewModel.userStories}
									{index}
									allowAddActivity={props.allowAddActivity !== false}
									allowRemovePersona={props.allowRemovePersona !== false}
									allowEditPersona={props.allowAddPersona !== false}
									allowDragActivity={props.allowDragDrop !== false}
									showStoryPoints={props.showStoryPoints !== false}
									showActions={true}
									onActivityAdd={(activity) =>
										userStoryMapViewModel.addActivity(persona.id, activity)}
									onActivityUpdate={(activityId, updates) =>
										userStoryMapViewModel.updateActivityData(activityId, updates)}
									onActivityRemove={(activityId) =>
										userStoryMapViewModel.removeActivityData(activityId)}
									onActivityMove={(event) => {
										// Handle activity drag and drop
										console.log("Activity moved:", event);
									}}
									onPersonaUpdate={(updates) =>
										userStoryMapViewModel.updatePersonaData(persona.id, updates)}
									onPersonaRemove={() =>
										userStoryMapViewModel.removePersonaData(persona.id)}
									onPersonaMove={(direction) => {
										// Handle persona reordering
										console.log("Persona move:", direction);
									}}
									onTaskAdd={(activityId, task) =>
										userStoryMapViewModel.addTask(activityId, task)}
									onTaskUpdate={(taskId, updates) =>
										userStoryMapViewModel.updateTaskData(taskId, updates)}
									onTaskRemove={(taskId) =>
										userStoryMapViewModel.removeTaskData(taskId)}
									onTaskMove={(event) => {
										// Handle task drag and drop
										console.log("Task moved:", event);
									}}
									onStoryAdd={(taskId, story) =>
										userStoryMapViewModel.addUserStory(taskId, story)}
									onStoryUpdate={(storyId, updates) =>
										userStoryMapViewModel.updateUserStoryData(storyId, updates)}
									onStoryRemove={(storyId) =>
										userStoryMapViewModel.removeUserStoryData(storyId)}
									onStoryMove={(event) => {
										// Handle story drag and drop
										console.log("Story moved:", event);
									}}
								/>
							{/each}

							<!-- Add Persona Button (when not in form mode) -->
							{#if !userStoryMapViewModel.showAddPersonaForm && props.allowAddPersona !== false}
								<div class="flex-shrink-0">
									<button
										class="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
										onclick={() => (userStoryMapViewModel.showAddPersonaForm = true)}
									>
										<div class="text-center">
											<div class="text-4xl mb-2">+</div>
											<span class="text-sm font-medium">Add Persona</span>
										</div>
									</button>
								</div>
							{/if}
						</div>

						<!-- Releases Section -->
						{#if props.showReleases !== false && (userStoryMapViewModel.releases.length > 0 || userStoryMapViewModel.showAddReleaseForm)}
							<div class="border-t border-gray-200 dark:border-gray-800 pt-8">
								<div class="flex items-center justify-between mb-6">
									<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
										Releases
									</h2>
									{#if props.allowAddRelease !== false && !userStoryMapViewModel.showAddReleaseForm}
										<Button
											variant="outline"
											size="sm"
											onclick={() => (userStoryMapViewModel.showAddReleaseForm = true)}
										>
											+ Add Release
										</Button>
									{/if}
								</div>

								<div class="space-y-4">
									{#each userStoryMapViewModel.releases as release, index (release.id)}
										<ReleaseRow
											{release}
											userStories={userStoryMapViewModel.getUserStoriesForRelease(release)}
											allStories={userStoryMapViewModel.userStories}
											{index}
											allowEdit={props.allowAddRelease !== false}
											allowRemove={props.allowRemoveRelease !== false}
											allowDrag={props.allowDragDrop !== false}
											showActions={true}
											onUpdate={(updates) =>
												userStoryMapViewModel.updateReleaseData(release.id, updates)}
											onRemove={() =>
												userStoryMapViewModel.removeReleaseData(release.id)}
											onStoryAssign={(storyId) => {
												// Add story to release
												const updatedStoryIds = [...release.userStoryIds, storyId];
												userStoryMapViewModel.updateReleaseData(release.id, {
													userStoryIds: updatedStoryIds
												});
											}}
											onStoryUnassign={(storyId) => {
												// Remove story from release
												const updatedStoryIds = release.userStoryIds.filter(id => id !== storyId);
												userStoryMapViewModel.updateReleaseData(release.id, {
													userStoryIds: updatedStoryIds
												});
											}}
											onMove={(direction) => {
												// Handle release reordering
												console.log("Release move:", direction);
											}}
										/>
									{/each}

									<!-- Add Release Form -->
									{#if userStoryMapViewModel.showAddReleaseForm}
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
																userStoryMapViewModel.addRelease({ name: input.value.trim() });
																input.value = "";
																userStoryMapViewModel.showAddReleaseForm = false;
															}
														} else if (event.key === "Escape") {
															userStoryMapViewModel.showAddReleaseForm = false;
														}
													}}
													autofocus
												/>
												<Button
													onclick={(event) => {
														const input = event.target?.closest('.flex')?.querySelector('input') as HTMLInputElement;
														if (input?.value.trim()) {
															userStoryMapViewModel.addRelease({ name: input.value.trim() });
															input.value = "";
															userStoryMapViewModel.showAddReleaseForm = false;
														}
													}}
												>
													Add
												</Button>
												<Button
													variant="ghost"
													onclick={() => {
														userStoryMapViewModel.showAddReleaseForm = false;
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
				{/if}
			</div>
		</ScrollArea>
	</div>
</div>

<style>
	/* Custom scrollbar for better UX */
	:global(.user-story-map-scroll) {
		scrollbar-width: thin;
		scrollbar-color: rgb(156 163 175) transparent;
	}

	:global(.user-story-map-scroll::-webkit-scrollbar) {
		height: 8px;
		width: 8px;
	}

	:global(.user-story-map-scroll::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.user-story-map-scroll::-webkit-scrollbar-thumb) {
		background-color: rgb(156 163 175);
		border-radius: 4px;
	}

	:global(.user-story-map-scroll::-webkit-scrollbar-thumb:hover) {
		background-color: rgb(107 114 128);
	}
</style>
