<script lang="ts">
	import { CanvasView } from "$lib/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	let canvasRef: any;
	let canvasData = $state("");
	let showSidebar = $state(true);
	let showHeader = $state(true);

	function handleCanvasChange(json: string) {
		canvasData = json;
		console.log("Canvas changed:", json);
	}

	function exportCanvas() {
		if (canvasRef) {
			canvasRef.exportCanvas("png").then((dataUrl: string) => {
				const link = document.createElement("a");
				link.download = "canvas-export.png";
				link.href = dataUrl;
				link.click();
			});
		}
	}

	function clearCanvas() {
		if (canvasRef) {
			canvasRef.clearCanvas();
		}
	}

	function loadSampleData() {
		const sampleData = {
			version: "6.0.0",
			objects: [
				{
					type: "textbox",
					version: "6.0.0",
					originX: "left",
					originY: "top",
					left: 100,
					top: 100,
					width: 300,
					height: 60,
					fill: "#2c3e50",
					fontSize: 32,
					text: "Welcome to Canvas!",
					name: "Welcome Text",
				},
				{
					type: "rect",
					version: "6.0.0",
					originX: "left",
					originY: "top",
					left: 500,
					top: 200,
					width: 200,
					height: 150,
					fill: "#3498db",
					stroke: "#2980b9",
					strokeWidth: 2,
					name: "Blue Rectangle",
				},
				{
					type: "circle",
					version: "6.0.0",
					originX: "left",
					originY: "top",
					left: 200,
					top: 300,
					radius: 75,
					fill: "#e74c3c",
					stroke: "#c0392b",
					strokeWidth: 2,
					name: "Red Circle",
				},
			],
		};

		if (canvasRef) {
			canvasRef.loadCanvasData(JSON.stringify(sampleData));
		}
	}
</script>

<svelte:head>
	<title>Canvas Demo - AI UI Kit</title>
	<meta name="description" content="Canvas component demo for AI UI Kit" />
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<div class="text-center space-y-2">
		<h1 class="text-3xl font-bold">Canvas Demo</h1>
		<p class="text-muted-foreground">
			Interactive canvas component with drawing tools, shapes, and text editing
			capabilities.
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
		<!-- Canvas -->
		<div class="lg:col-span-3">
			<Card>
				<CardHeader>
					<CardTitle>Canvas Editor</CardTitle>
					<CardDescription>
						Use the toolbar to add shapes, text, and images. Pan and zoom with
						mouse controls.
					</CardDescription>
				</CardHeader>
				<CardContent class="p-0">
					<div class="h-[600px]">
						<CanvasView
							bind:this={canvasRef}
							width={1920}
							height={1080}
							backgroundColor="#f8f9fa"
							{showSidebar}
							{showHeader}
							onCanvasChange={handleCanvasChange}
						/>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Controls -->
		<div class="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Actions</CardTitle>
				</CardHeader>
				<CardContent class="space-y-2">
					<Button onclick={loadSampleData} class="w-full">
						Load Sample Data
					</Button>
					<Button onclick={exportCanvas} variant="outline" class="w-full">
						Export as PNG
					</Button>
					<Button onclick={clearCanvas} variant="destructive" class="w-full">
						Clear Canvas
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Layout Options</CardTitle>
				</CardHeader>
				<CardContent class="space-y-3">
					<div class="flex items-center justify-between">
						<Label for="sidebar-toggle">Show Sidebar</Label>
						<input
							id="sidebar-toggle"
							type="checkbox"
							bind:checked={showSidebar}
							class="h-4 w-4"
						/>
					</div>
					<div class="flex items-center justify-between">
						<Label for="header-toggle">Show Header</Label>
						<input
							id="header-toggle"
							type="checkbox"
							bind:checked={showHeader}
							class="h-4 w-4"
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Instructions</CardTitle>
				</CardHeader>
				<CardContent class="text-sm space-y-2">
					<div>
						<strong>Drawing Tools:</strong>
						<ul class="list-disc list-inside mt-1 space-y-1">
							<li>Text: Add editable text boxes</li>
							<li>Rectangle: Add rectangular shapes</li>
							<li>Circle: Add circular shapes</li>
							<li>Image: Add images from URL</li>
						</ul>
					</div>
					<div>
						<strong>Navigation:</strong>
						<ul class="list-disc list-inside mt-1 space-y-1">
							<li>Pan: Toggle pan mode to move around</li>
							<li>Zoom: Use mouse wheel or zoom buttons</li>
							<li>Select: Click objects to select and edit</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{#if canvasData}
				<Card>
					<CardHeader>
						<CardTitle>Canvas Data</CardTitle>
						<CardDescription>JSON representation of the canvas</CardDescription>
					</CardHeader>
					<CardContent>
						<pre
							class="text-xs bg-muted p-2 rounded overflow-auto max-h-32">{JSON.stringify(
								JSON.parse(canvasData),
								null,
								2,
							)}</pre>
					</CardContent>
				</Card>
			{/if}
		</div>
	</div>
</div>
