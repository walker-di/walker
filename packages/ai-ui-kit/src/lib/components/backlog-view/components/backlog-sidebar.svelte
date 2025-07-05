<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import type { BacklogSidebarProps } from "../types/backlog.js";

	let { viewMode, onViewModeChange }: BacklogSidebarProps = $props();

	const viewModes = [
		{
			id: "story-map" as const,
			label: "Story Map",
			icon: "📋",
			description: "Visual story mapping view"
		},
		{
			id: "backlog" as const,
			label: "Backlog",
			icon: "📝",
			description: "Traditional backlog view"
		},
		{
			id: "sprint" as const,
			label: "Sprint",
			icon: "🏃",
			description: "Sprint planning view"
		}
	];
</script>

<div class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
	<!-- Sidebar Header -->
	<div class="p-6 border-b border-gray-200 dark:border-gray-800">
		<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Views</h2>
		<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
			Choose your preferred view mode
		</p>
	</div>

	<!-- View Mode Options -->
	<div class="flex-1 p-4 space-y-2">
		{#each viewModes as mode}
			<button
				class="w-full text-left p-3 rounded-lg transition-colors {viewMode === mode.id
					? 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
					: 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}"
				onclick={() => onViewModeChange(mode.id)}
			>
				<div class="flex items-center gap-3">
					<span class="text-xl">{mode.icon}</span>
					<div class="flex-1">
						<div class="font-medium">{mode.label}</div>
						<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{mode.description}
						</div>
					</div>
					{#if viewMode === mode.id}
						<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	<!-- Sidebar Footer -->
	<div class="p-4 border-t border-gray-200 dark:border-gray-800">
		<div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-orange-400 rounded"></span>
				<span>Epic</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-blue-400 rounded"></span>
				<span>Feature</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-green-400 rounded"></span>
				<span>Story</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-yellow-400 rounded"></span>
				<span>Task</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-red-400 rounded"></span>
				<span>Bug</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-purple-400 rounded"></span>
				<span>Spike</span>
			</div>
		</div>
	</div>
</div>
