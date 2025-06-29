<script lang="ts">
	import { KnowledgeGraphView } from '$lib/index.js';
	import { sampleGraphData, sampleCategories, smallSampleData } from '$lib/components/knowledge-graph-view/utils/sample-data.js';
	import type { GraphData, LayoutConfig } from '$lib/components/knowledge-graph-view/types/knowledge-graph.js';
	
	// Demo state
	let selectedDemo = $state('full');
	let currentData = $state<GraphData>(sampleGraphData);
	let currentCategories = $state(sampleCategories);
	let currentLayout = $state<LayoutConfig>({ name: 'cose', animate: true, fit: true });
	
	// Demo options
	const demos = [
		{ id: 'full', name: 'Full Demo', data: sampleGraphData, categories: sampleCategories },
		{ id: 'simple', name: 'Simple Graph', data: smallSampleData, categories: [sampleCategories[0]] }
	];
	
	const layouts = [
		{ id: 'cose', name: 'Force-directed (COSE)' },
		{ id: 'cose-bilkent', name: 'COSE Bilkent' },
		{ id: 'fcose', name: 'fCOSE' },
		{ id: 'cola', name: 'Cola.js' },
		{ id: 'dagre', name: 'Dagre (Hierarchical)' },
		{ id: 'grid', name: 'Grid' },
		{ id: 'circle', name: 'Circle' },
		{ id: 'concentric', name: 'Concentric' }
	];
	
	// Event handlers
	function handleDemoChange(demoId: string) {
		selectedDemo = demoId;
		const demo = demos.find(d => d.id === demoId);
		if (demo) {
			currentData = demo.data;
			currentCategories = demo.categories;
		}
	}
	
	function handleLayoutChange(layoutName: string) {
		currentLayout = { ...currentLayout, name: layoutName as any };
	}
	
	function handleNodeClick(event: any) {
		console.log('Node clicked:', event.target);
	}
	
	function handleNodeSelect(nodes: any[]) {
		console.log('Nodes selected:', nodes);
	}
	
	function handleSearch(query: string, results: any[]) {
		console.log('Search results:', { query, results });
	}
	
	function handleFilter(filter: any) {
		console.log('Filter applied:', filter);
	}
	
	function handleExport(options: any) {
		console.log('Export requested:', options);
	}
</script>

<svelte:head>
	<title>Knowledge Graph Demo - AI UI Kit</title>
	<meta name="description" content="Interactive knowledge graph visualization demo using Cytoscape.js" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Header -->
	<header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Graph Demo</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-300">
						Interactive graph visualization with Cytoscape.js
					</p>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href="/"
						class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
					>
						← Back to Home
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Controls -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Demo Controls</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Demo Selection -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Demo Dataset
					</label>
					<select
						bind:value={selectedDemo}
						onchange={(e) => handleDemoChange((e.target as HTMLSelectElement).value)}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						{#each demos as demo}
							<option value={demo.id}>{demo.name}</option>
						{/each}
					</select>
				</div>
				
				<!-- Layout Selection -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Layout Algorithm
					</label>
					<select
						bind:value={currentLayout.name}
						onchange={(e) => handleLayoutChange((e.target as HTMLSelectElement).value)}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						{#each layouts as layout}
							<option value={layout.id}>{layout.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Graph Container -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
			<KnowledgeGraphView
				data={currentData}
				categories={currentCategories}
				layout={currentLayout}
				width="100%"
				height="700px"
				backgroundColor="#ffffff"
				enablePan={true}
				enableZoom={true}
				enableSelection={true}
				selectionMode="single"
				enableDrag={true}
				enableSearch={true}
				enableFiltering={true}
				enableExport={true}
				showControls={true}
				showLegend={true}
				showStats={true}
				showToolbar={true}
				ariaLabel="Knowledge Graph Visualization"
				ariaDescription="Interactive graph showing relationships between entities"
				onNodeClick={handleNodeClick}
				onNodeSelect={handleNodeSelect}
				onSearch={handleSearch}
				onFilter={handleFilter}
				onExport={handleExport}
			/>
		</div>

		<!-- Information -->
		<div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div>
					<h3 class="font-medium text-gray-900 dark:text-white mb-2">Interactive Navigation</h3>
					<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
						<li>• Pan and zoom the graph</li>
						<li>• Drag nodes to reposition</li>
						<li>• Click to select nodes/edges</li>
						<li>• Hover for additional info</li>
					</ul>
				</div>
				
				<div>
					<h3 class="font-medium text-gray-900 dark:text-white mb-2">Search & Filter</h3>
					<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
						<li>• Search nodes by label</li>
						<li>• Filter by categories</li>
						<li>• Hide/show node types</li>
						<li>• Toggle isolated nodes</li>
					</ul>
				</div>
				
				<div>
					<h3 class="font-medium text-gray-900 dark:text-white mb-2">Layout Algorithms</h3>
					<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
						<li>• Force-directed layouts</li>
						<li>• Hierarchical arrangements</li>
						<li>• Grid and circular layouts</li>
						<li>• Animated transitions</li>
					</ul>
				</div>
				
				<div>
					<h3 class="font-medium text-gray-900 dark:text-white mb-2">Data Visualization</h3>
					<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
						<li>• Color-coded categories</li>
						<li>• Node size by importance</li>
						<li>• Edge weights and types</li>
						<li>• Interactive legend</li>
					</ul>
				</div>
				
				<div>
					<h3 class="font-medium text-gray-900 dark:text-white mb-2">Export Options</h3>
					<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
						<li>• Export as JSON data</li>
						<li>• Save as PNG image</li>
						<li>• SVG vector format</li>
						<li>• Include metadata</li>
					</ul>
				</div>
				
				<div>
					<h3 class="font-medium text-gray-900 dark:text-white mb-2">Statistics</h3>
					<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
						<li>• Graph density metrics</li>
						<li>• Node connectivity stats</li>
						<li>• Component analysis</li>
						<li>• Selection summaries</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Usage Example -->
		<div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Usage Example</h2>
			
			<pre class="bg-gray-100 dark:bg-gray-900 rounded-md p-4 text-sm overflow-x-auto"><code>{`import { KnowledgeGraphView } from 'ai-ui-kit';

const graphData = {
  nodes: [
    { id: 'node1', label: 'Node 1', category: 'person', color: '#3b82f6' },
    { id: 'node2', label: 'Node 2', category: 'organization', color: '#10b981' }
  ],
  edges: [
    { id: 'edge1', source: 'node1', target: 'node2', label: 'works at' }
  ]
};

const categories = [
  { id: 'person', name: 'Person', color: '#3b82f6', visible: true },
  { id: 'organization', name: 'Organization', color: '#10b981', visible: true }
];

<KnowledgeGraphView
  data={graphData}
  categories={categories}
  layout={{ name: 'cose', animate: true }}
  onNodeClick={(event) => console.log('Node clicked:', event.target)}
/>`}</code></pre>
		</div>
	</div>
</div>

<style>
	pre code {
		color: inherit;
	}
</style>
