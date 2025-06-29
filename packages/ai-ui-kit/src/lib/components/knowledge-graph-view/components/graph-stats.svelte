<script lang="ts">
	/**
	 * Graph Stats Component
	 *
	 * Displays statistical information about the graph structure.
	 */

	import { Label } from "../../ui/label/index.js";
	import { Badge } from "../../ui/badge/index.js";
	import { Progress } from "../../ui/progress/index.js";

	// Lucide icons
	import BarChart3 from "lucide-svelte/icons/bar-chart-3";
	import Network from "lucide-svelte/icons/network";
	import Target from "lucide-svelte/icons/target";
	import Zap from "lucide-svelte/icons/zap";

	import type { KnowledgeGraphViewModel } from "../knowledge-graph-view-model.svelte.js";

	let { viewModel }: { viewModel: KnowledgeGraphViewModel } = $props();

	// Computed statistics
	const stats = $derived.by(() => {
		const nodes = viewModel.graphData.nodes;
		const edges = viewModel.graphData.edges;

		if (nodes.length === 0) {
			return {
				nodeCount: 0,
				edgeCount: 0,
				density: 0,
				avgDegree: 0,
				maxDegree: 0,
				isolatedNodes: 0,
				connectedComponents: 0,
				nodeTypes: [],
				edgeTypes: [],
				categories: [],
			};
		}

		// Calculate degree for each node
		const degrees = new Map<string, number>();
		nodes.forEach((node) => degrees.set(node.id, 0));

		edges.forEach((edge) => {
			degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1);
			degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1);
		});

		const degreeValues = Array.from(degrees.values());
		const maxDegree = Math.max(...degreeValues, 0);
		const avgDegree =
			degreeValues.length > 0
				? degreeValues.reduce((a, b) => a + b, 0) / degreeValues.length
				: 0;
		const isolatedNodes = degreeValues.filter((d) => d === 0).length;

		// Calculate graph density
		const maxPossibleEdges = (nodes.length * (nodes.length - 1)) / 2;
		const density = maxPossibleEdges > 0 ? edges.length / maxPossibleEdges : 0;

		// Get unique types and categories
		const nodeTypes = [...new Set(nodes.map((n) => n.type).filter(Boolean))];
		const edgeTypes = [...new Set(edges.map((e) => e.type).filter(Boolean))];
		const categories = [
			...new Set(nodes.map((n) => n.category).filter(Boolean)),
		];

		// Estimate connected components (simplified)
		const connectedComponents = estimateConnectedComponents(nodes, edges);

		return {
			nodeCount: nodes.length,
			edgeCount: edges.length,
			density: Math.round(density * 10000) / 100, // Percentage with 2 decimals
			avgDegree: Math.round(avgDegree * 100) / 100,
			maxDegree,
			isolatedNodes,
			connectedComponents,
			nodeTypes,
			edgeTypes,
			categories,
		};
	});

	function estimateConnectedComponents(nodes: any[], edges: any[]): number {
		if (nodes.length === 0) return 0;
		if (edges.length === 0) return nodes.length;

		// Simple estimation based on isolated nodes and edge connectivity
		// This is a simplified version - a full implementation would use DFS/BFS
		const connectedNodes = new Set<string>();
		edges.forEach((edge) => {
			connectedNodes.add(edge.source);
			connectedNodes.add(edge.target);
		});

		const isolatedCount = nodes.length - connectedNodes.size;
		const estimatedConnectedComponents = Math.max(
			1,
			Math.ceil(connectedNodes.size / 10),
		); // Rough estimate

		return isolatedCount + estimatedConnectedComponents;
	}

	function getDensityColor(density: number): string {
		if (density < 1) return "text-red-600";
		if (density < 5) return "text-yellow-600";
		if (density < 20) return "text-green-600";
		return "text-blue-600";
	}

	function getDensityLabel(density: number): string {
		if (density < 1) return "Sparse";
		if (density < 5) return "Low";
		if (density < 20) return "Medium";
		return "Dense";
	}
</script>

<div class="graph-stats space-y-4">
	<Label class="text-sm font-medium flex items-center gap-2">
		<BarChart3 class="h-4 w-4" />
		Graph Statistics
	</Label>

	{#if !viewModel.hasData}
		<div class="text-xs text-gray-500 text-center py-4">No data to analyze</div>
	{:else}
		<div class="space-y-3">
			<!-- Basic Stats -->
			<div class="grid grid-cols-2 gap-3">
				<div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
					<div class="flex items-center gap-2 mb-1">
						<Network class="h-4 w-4 text-blue-600" />
						<span class="text-xs font-medium text-blue-800 dark:text-blue-200"
							>Nodes</span
						>
					</div>
					<div class="text-lg font-bold text-blue-900 dark:text-blue-100">
						{stats.nodeCount}
					</div>
				</div>

				<div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
					<div class="flex items-center gap-2 mb-1">
						<Zap class="h-4 w-4 text-green-600" />
						<span class="text-xs font-medium text-green-800 dark:text-green-200"
							>Edges</span
						>
					</div>
					<div class="text-lg font-bold text-green-900 dark:text-green-100">
						{stats.edgeCount}
					</div>
				</div>
			</div>

			<!-- Connectivity Stats -->
			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<span class="text-xs text-gray-600 dark:text-gray-400"
						>Graph Density</span
					>
					<Badge variant="outline" class={getDensityColor(stats.density)}>
						{getDensityLabel(stats.density)}
					</Badge>
				</div>
				<div class="flex items-center gap-2">
					<Progress value={Math.min(stats.density, 100)} class="flex-1" />
					<span class="text-xs font-medium">{stats.density}%</span>
				</div>
			</div>

			<!-- Degree Stats -->
			<div class="space-y-2">
				<div class="text-xs font-medium text-gray-700 dark:text-gray-300">
					Node Connectivity
				</div>
				<div class="grid grid-cols-2 gap-2 text-xs">
					<div class="flex justify-between">
						<span class="text-gray-600 dark:text-gray-400">Avg Degree:</span>
						<span class="font-medium">{stats.avgDegree}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600 dark:text-gray-400">Max Degree:</span>
						<span class="font-medium">{stats.maxDegree}</span>
					</div>
				</div>
			</div>

			<!-- Structure Stats -->
			<div class="space-y-2">
				<div class="text-xs font-medium text-gray-700 dark:text-gray-300">
					Graph Structure
				</div>
				<div class="space-y-1 text-xs">
					<div class="flex justify-between">
						<span class="text-gray-600 dark:text-gray-400">Isolated Nodes:</span
						>
						<Badge
							variant={stats.isolatedNodes > 0 ? "destructive" : "secondary"}
							class="text-xs"
						>
							{stats.isolatedNodes}
						</Badge>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600 dark:text-gray-400">Components:</span>
						<span class="font-medium">{stats.connectedComponents}</span>
					</div>
				</div>
			</div>

			<!-- Type Distribution -->
			{#if stats.nodeTypes.length > 0}
				<div class="space-y-2">
					<div class="text-xs font-medium text-gray-700 dark:text-gray-300">
						Node Types
					</div>
					<div class="flex flex-wrap gap-1">
						{#each stats.nodeTypes as type}
							<Badge variant="outline" class="text-xs">
								{type}
							</Badge>
						{/each}
					</div>
				</div>
			{/if}

			{#if stats.edgeTypes.length > 0}
				<div class="space-y-2">
					<div class="text-xs font-medium text-gray-700 dark:text-gray-300">
						Edge Types
					</div>
					<div class="flex flex-wrap gap-1">
						{#each stats.edgeTypes as type}
							<Badge variant="outline" class="text-xs">
								{type}
							</Badge>
						{/each}
					</div>
				</div>
			{/if}

			{#if stats.categories.length > 0}
				<div class="space-y-2">
					<div class="text-xs font-medium text-gray-700 dark:text-gray-300">
						Categories
					</div>
					<div class="text-xs text-gray-600 dark:text-gray-400">
						{stats.categories.length} categories defined
					</div>
				</div>
			{/if}

			<!-- Selection Stats -->
			{#if viewModel.selectedNodeCount > 0 || viewModel.selectedEdgeCount > 0}
				<div class="pt-2 border-t border-gray-200 dark:border-gray-700">
					<div
						class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Selection
					</div>
					<div class="grid grid-cols-2 gap-2 text-xs">
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Nodes:</span>
							<span class="font-medium">{viewModel.selectedNodeCount}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Edges:</span>
							<span class="font-medium">{viewModel.selectedEdgeCount}</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.graph-stats {
		font-size: 14px;
	}

	.graph-stats :global(.progress) {
		height: 4px;
	}

	.graph-stats :global(.badge) {
		font-size: 10px;
		padding: 2px 6px;
		height: auto;
		min-height: 16px;
	}
</style>
