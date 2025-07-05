<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Card, CardContent, CardHeader } from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	
	import TaskColumn from "./task-column.svelte";
	import type { ActivityRowProps } from "../types/user-story-map.js";

	// Props
	let props: ActivityRowProps = $props();

	// Local state
	let isEditing = $state(false);
	let editTitle = $state(props.activity.title);
	let editDescription = $state(props.activity.description || "");
	let showAddTaskForm = $state(false);
	let newTaskTitle = $state("");

	// Handle edit activity
	function handleEditActivity() {
		if (!editTitle.trim()) return;
		
		props.onActivityUpdate?.({
			title: editTitle.trim(),
			description: editDescription.trim() || undefined
		});
		isEditing = false;
	}

	// Handle add task
	function handleAddTask() {
		if (!newTaskTitle.trim()) return;

		props.onTaskAdd?.({ title: newTaskTitle.trim() });
		newTaskTitle = "";
		showAddTaskForm = false;
	}

	// Handle key press for task
	function handleTaskKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddTask();
		} else if (event.key === "Escape") {
			showAddTaskForm = false;
			newTaskTitle = "";
		}
	}

	// Handle key press for activity edit
	function handleActivityKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleEditActivity();
		} else if (event.key === "Escape") {
			isEditing = false;
			editTitle = props.activity.title;
			editDescription = props.activity.description || "";
		}
	}

	// Get priority color
	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
			case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
		}
	}

	// Get status color
	function getStatusColor(status: string): string {
		switch (status) {
			case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
			default: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
		}
	}
</script>

<Card class="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
	<CardHeader class="pb-3">
		{#if isEditing}
			<!-- Edit Mode -->
			<div class="space-y-2">
				<Input
					bind:value={editTitle}
					placeholder="Activity title..."
					class="font-medium"
					onkeydown={handleActivityKeyPress}
					autofocus
				/>
				<Input
					bind:value={editDescription}
					placeholder="Description (optional)..."
					class="text-sm"
					onkeydown={handleActivityKeyPress}
				/>
				<div class="flex gap-2">
					<Button size="sm" onclick={handleEditActivity} disabled={!editTitle.trim()}>
						Save
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => {
							isEditing = false;
							editTitle = props.activity.title;
							editDescription = props.activity.description || "";
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
						<h4 class="font-medium text-blue-900 dark:text-blue-100">
							{props.activity.title}
						</h4>
						<Badge class={getPriorityColor(props.activity.priority)}>
							{props.activity.priority}
						</Badge>
						<Badge class={getStatusColor(props.activity.status)}>
							{props.activity.status}
						</Badge>
					</div>
					{#if props.activity.description}
						<p class="text-sm text-blue-700 dark:text-blue-300 mb-2">
							{props.activity.description}
						</p>
					{/if}
					{#if props.activity.estimatedDuration}
						<p class="text-xs text-blue-600 dark:text-blue-400">
							Est. Duration: {props.activity.estimatedDuration}
						</p>
					{/if}
				</div>
				
				{#if props.showActions}
					<div class="flex gap-1">
						{#if props.allowEditActivity}
							<Button
								size="sm"
								variant="ghost"
								onclick={() => {
									isEditing = true;
									editTitle = props.activity.title;
									editDescription = props.activity.description || "";
								}}
							>
								✏️
							</Button>
						{/if}
						{#if props.allowRemoveActivity}
							<Button
								size="sm"
								variant="ghost"
								onclick={() => props.onActivityRemove?.()}
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
		<!-- Tasks Grid -->
		<div class="grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
			{#each props.tasks as task, index (task.id)}
				<TaskColumn
					{task}
					activity={props.activity}
					userStories={props.userStories.filter(s => s.taskId === task.id)}
					{index}
					allowAddStory={props.allowAddTask !== false}
					allowRemoveTask={props.allowRemoveActivity !== false}
					allowEditTask={props.allowEditActivity !== false}
					allowDragStory={props.allowDragTask !== false}
					showStoryPoints={props.showStoryPoints !== false}
					showActions={props.showActions !== false}
					onStoryAdd={(story) => props.onStoryAdd?.(task.id, story)}
					onStoryUpdate={props.onStoryUpdate}
					onStoryRemove={props.onStoryRemove}
					onStoryMove={props.onStoryMove}
					onTaskUpdate={(updates) => props.onTaskUpdate?.(task.id, updates)}
					onTaskRemove={() => props.onTaskRemove?.(task.id)}
					onTaskMove={props.onTaskMove}
				/>
			{/each}

			<!-- Add Task Form -->
			{#if showAddTaskForm}
				<Card class="border-dashed border-blue-300 dark:border-blue-700">
					<CardContent class="p-3">
						<div class="flex gap-2">
							<Input
								bind:value={newTaskTitle}
								placeholder="Task title..."
								class="flex-1 text-sm"
								onkeydown={handleTaskKeyPress}
								autofocus
							/>
							<Button size="sm" onclick={handleAddTask} disabled={!newTaskTitle.trim()}>
								Add
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onclick={() => {
									showAddTaskForm = false;
									newTaskTitle = "";
								}}
							>
								×
							</Button>
						</div>
					</CardContent>
				</Card>
			{/if}

			<!-- Add Task Button -->
			{#if !showAddTaskForm && props.allowAddTask}
				<button
					class="p-3 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg text-blue-500 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-300 transition-colors min-h-24"
					onclick={() => (showAddTaskForm = true)}
				>
					<div class="text-center">
						<div class="text-xl mb-1">+</div>
						<span class="text-xs font-medium">Add Task</span>
					</div>
				</button>
			{/if}
		</div>
	</CardContent>
</Card>
