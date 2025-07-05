<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Card, CardContent, CardHeader } from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	
	import ActivityRow from "./activity-row.svelte";
	import type { PersonaColumnProps } from "../types/user-story-map.js";

	// Props
	let props: PersonaColumnProps = $props();

	// Local state
	let isEditing = $state(false);
	let editName = $state(props.persona.name);
	let editDescription = $state(props.persona.description || "");
	let editRole = $state(props.persona.role || "");
	let showAddActivityForm = $state(false);
	let newActivityTitle = $state("");

	// Handle edit persona
	function handleEditPersona() {
		if (!editName.trim()) return;
		
		props.onPersonaUpdate?.({
			name: editName.trim(),
			description: editDescription.trim() || undefined,
			role: editRole.trim() || undefined
		});
		isEditing = false;
	}

	// Handle add activity
	function handleAddActivity() {
		if (!newActivityTitle.trim()) return;

		props.onActivityAdd?.({ title: newActivityTitle.trim() });
		newActivityTitle = "";
		showAddActivityForm = false;
	}

	// Handle key press for activity
	function handleActivityKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddActivity();
		} else if (event.key === "Escape") {
			showAddActivityForm = false;
			newActivityTitle = "";
		}
	}

	// Handle key press for persona edit
	function handlePersonaKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleEditPersona();
		} else if (event.key === "Escape") {
			isEditing = false;
			editName = props.persona.name;
			editDescription = props.persona.description || "";
			editRole = props.persona.role || "";
		}
	}
</script>

<div class="flex flex-col space-y-4">
	<!-- Persona Header -->
	<Card class="border-2" style="border-color: {props.persona.color || '#3B82F6'};">
		<CardHeader class="pb-3">
			{#if isEditing}
				<!-- Edit Mode -->
				<div class="space-y-2">
					<Input
						bind:value={editName}
						placeholder="Persona name..."
						class="font-semibold"
						onkeydown={handlePersonaKeyPress}
						autofocus
					/>
					<Input
						bind:value={editRole}
						placeholder="Role (optional)..."
						class="text-sm"
						onkeydown={handlePersonaKeyPress}
					/>
					<Input
						bind:value={editDescription}
						placeholder="Description (optional)..."
						class="text-sm"
						onkeydown={handlePersonaKeyPress}
					/>
					<div class="flex gap-2">
						<Button size="sm" onclick={handleEditPersona} disabled={!editName.trim()}>
							Save
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onclick={() => {
								isEditing = false;
								editName = props.persona.name;
								editDescription = props.persona.description || "";
								editRole = props.persona.role || "";
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
						<div class="flex items-center gap-2 mb-1">
							{#if props.persona.avatar}
								<img
									src={props.persona.avatar}
									alt={props.persona.name}
									class="w-8 h-8 rounded-full"
								/>
							{:else}
								<div
									class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
									style="background-color: {props.persona.color || '#3B82F6'};"
								>
									{props.persona.name.charAt(0).toUpperCase()}
								</div>
							{/if}
							<h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">
								{props.persona.name}
							</h3>
						</div>
						{#if props.persona.role}
							<Badge variant="secondary" class="mb-2">
								{props.persona.role}
							</Badge>
						{/if}
						{#if props.persona.description}
							<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
								{props.persona.description}
							</p>
						{/if}
						{#if props.persona.goals.length > 0}
							<div class="mb-2">
								<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Goals:</p>
								<div class="flex flex-wrap gap-1">
									{#each props.persona.goals as goal}
										<Badge variant="outline" class="text-xs">
											{goal}
										</Badge>
									{/each}
								</div>
							</div>
						{/if}
						{#if props.persona.painPoints.length > 0}
							<div>
								<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Pain Points:</p>
								<div class="flex flex-wrap gap-1">
									{#each props.persona.painPoints as painPoint}
										<Badge variant="destructive" class="text-xs">
											{painPoint}
										</Badge>
									{/each}
								</div>
							</div>
						{/if}
					</div>
					
					{#if props.showActions}
						<div class="flex gap-1">
							{#if props.allowEditPersona}
								<Button
									size="sm"
									variant="ghost"
									onclick={() => {
										isEditing = true;
										editName = props.persona.name;
										editDescription = props.persona.description || "";
										editRole = props.persona.role || "";
									}}
								>
									✏️
								</Button>
							{/if}
							{#if props.allowRemovePersona}
								<Button
									size="sm"
									variant="ghost"
									onclick={() => props.onPersonaRemove?.()}
								>
									🗑️
								</Button>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</CardHeader>
	</Card>

	<!-- Activities -->
	<div class="space-y-3">
		{#each props.activities as activity, index (activity.id)}
			<ActivityRow
				{activity}
				persona={props.persona}
				tasks={props.tasks.filter(t => t.activityId === activity.id)}
				userStories={props.userStories}
				{index}
				allowAddTask={props.allowAddActivity !== false}
				allowRemoveActivity={props.allowRemovePersona !== false}
				allowEditActivity={props.allowEditPersona !== false}
				allowDragTask={props.allowDragActivity !== false}
				showStoryPoints={props.showStoryPoints !== false}
				showActions={props.showActions !== false}
				onTaskAdd={(task) => props.onTaskAdd?.(activity.id, task)}
				onTaskUpdate={props.onTaskUpdate}
				onTaskRemove={props.onTaskRemove}
				onTaskMove={props.onTaskMove}
				onActivityUpdate={(updates) => props.onActivityUpdate?.(activity.id, updates)}
				onActivityRemove={() => props.onActivityRemove?.(activity.id)}
				onActivityMove={props.onActivityMove}
				onStoryAdd={props.onStoryAdd}
				onStoryUpdate={props.onStoryUpdate}
				onStoryRemove={props.onStoryRemove}
				onStoryMove={props.onStoryMove}
			/>
		{/each}

		<!-- Add Activity Form -->
		{#if showAddActivityForm}
			<Card class="border-dashed">
				<CardContent class="p-4">
					<div class="flex gap-2">
						<Input
							bind:value={newActivityTitle}
							placeholder="Activity title..."
							class="flex-1"
							onkeydown={handleActivityKeyPress}
							autofocus
						/>
						<Button onclick={handleAddActivity} disabled={!newActivityTitle.trim()}>
							Add
						</Button>
						<Button
							variant="ghost"
							onclick={() => {
								showAddActivityForm = false;
								newActivityTitle = "";
							}}
						>
							×
						</Button>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Add Activity Button -->
		{#if !showAddActivityForm && props.allowAddActivity}
			<button
				class="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
				onclick={() => (showAddActivityForm = true)}
			>
				<div class="text-center">
					<div class="text-2xl mb-1">+</div>
					<span class="text-sm font-medium">Add Activity</span>
				</div>
			</button>
		{/if}
	</div>
</div>
