<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
	} from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import CanvasToolbar from "./components/canvas-toolbar.svelte";
	import CanvasHeader from "./components/canvas-header.svelte";
	import CanvasSidebar from "./components/canvas-sidebar.svelte";
	import { CanvasViewModel } from "./canvas-view-model.svelte.js";
	import { addImageFromUrl } from "./utils/canvas-tools.js";
	import type { CanvasViewProps } from "./types/canvas.js";

	// Lucide icons
	import ImageUp from "lucide-svelte/icons/image-up";

	let {
		canvasDataJson = $bindable(),
		onCanvasChange,
		hideControls = false,
		showSidebar = true,
		showHeader = true,
		width = 1920,
		height = 1080,
		backgroundColor = "#f0f0f0",
		class: className = "",
	}: CanvasViewProps & {
		showSidebar?: boolean;
		showHeader?: boolean;
	} = $props();

	// View model
	let viewModel = new CanvasViewModel({
		canvasDataJson,
		onCanvasChange,
		hideControls,
		width,
		height,
		backgroundColor,
	});

	// Canvas element reference
	let canvasElement: HTMLCanvasElement | null = $state(null);
	let resizeObserver: ResizeObserver | null = $state(null);

	// Image upload dialog state
	let showImageDialog = $state(false);
	let imageUrl = $state("");

	onMount(async () => {
		if (canvasElement) {
			await viewModel.initialize(canvasElement);
			setupResizeObserver();
		}
	});

	onDestroy(() => {
		viewModel.dispose();
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
	});

	function setupResizeObserver() {
		if (typeof ResizeObserver !== "undefined" && canvasElement?.parentElement) {
			resizeObserver = new ResizeObserver(() => {
				setTimeout(() => {
					if (viewModel.canvasZoomPan) {
						viewModel.canvasZoomPan.zoomToFit();
					}
				}, 100);
			});

			resizeObserver.observe(canvasElement.parentElement);
		}
	}

	function handleAddImageFromUrl() {
		if (!viewModel.canvas || !imageUrl.trim()) return;

		addImageFromUrl(viewModel.canvas, imageUrl.trim())
			.then(() => {
				showImageDialog = false;
				imageUrl = "";
			})
			.catch((error) => {
				console.error("Error adding image:", error);
				alert("Failed to add image. Please check the URL and try again.");
			});
	}

	function handleImageUrlKeydown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			handleAddImageFromUrl();
		}
	}

	// Export public methods
	export function hasSelectedObject(): boolean {
		return viewModel.hasSelectedObject();
	}

	export function deleteSelected() {
		viewModel.deleteSelected();
	}

	export function clearCanvas() {
		viewModel.clearCanvas();
	}

	export function resizeCanvas(newWidth: number, newHeight: number) {
		viewModel.resizeCanvas(newWidth, newHeight);
	}

	export async function exportCanvas(format: "png" | "jpeg" | "svg" = "png") {
		return await viewModel.exportCanvas(format);
	}

	export async function downloadCanvas(format: "png" | "jpeg" | "svg" = "png") {
		await viewModel.downloadCanvas(format);
	}

	export function getCurrentCanvasJson(): string {
		return viewModel.getCurrentCanvasJson();
	}

	export async function loadCanvasData(json: string) {
		await viewModel.loadCanvasData(json);
	}

	export function getCanvasInstance() {
		return viewModel.canvas;
	}
</script>

<div class="canvas-view flex flex-col h-full {className}">
	{#if showHeader && !hideControls}
		<CanvasHeader
			canvas={viewModel.canvas}
			canvasService={viewModel.canvasService}
			hasSelectedObject={viewModel.hasSelectedObject()}
		/>
	{:else if !hideControls}
		<CanvasToolbar
			canvas={viewModel.canvas}
			canvasService={viewModel.canvasService}
			canvasZoomPan={viewModel.canvasZoomPan}
			hasSelectedObject={viewModel.hasSelectedObject()}
			onAddImage={() => (showImageDialog = true)}
		/>
	{/if}

	<div class="canvas-main flex flex-1 overflow-hidden">
		{#if showSidebar && !hideControls}
			<CanvasSidebar
				canvas={viewModel.canvas}
				canvasService={viewModel.canvasService}
				onImageUpload={() => (showImageDialog = true)}
			/>
		{/if}

		<div class="canvas-container flex-1 relative overflow-hidden bg-muted/20">
			<canvas bind:this={canvasElement} class="absolute inset-0"></canvas>

			{#if viewModel.isLoading}
				<div
					class="absolute inset-0 flex items-center justify-center bg-background/50"
				>
					<div class="flex items-center gap-2">
						<div
							class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
						></div>
						<span class="text-sm text-muted-foreground">Loading canvas...</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Image URL Dialog -->
<Dialog bind:open={showImageDialog}>
	<DialogContent class="sm:max-w-md">
		<DialogHeader>
			<DialogTitle>Add Image from URL</DialogTitle>
		</DialogHeader>
		<div class="space-y-4">
			<div class="space-y-2">
				<label for="image-url" class="text-sm font-medium">Image URL</label>
				<Input
					id="image-url"
					bind:value={imageUrl}
					placeholder="https://example.com/image.jpg"
					onkeydown={handleImageUrlKeydown}
				/>
			</div>
			<div class="flex justify-end gap-2">
				<Button variant="outline" onclick={() => (showImageDialog = false)}>
					Cancel
				</Button>
				<Button onclick={handleAddImageFromUrl} disabled={!imageUrl.trim()}>
					<ImageUp class="h-4 w-4 mr-2" />
					Add Image
				</Button>
			</div>
		</div>
	</DialogContent>
</Dialog>

<style>
	.canvas-view {
		min-height: 400px;
	}

	.canvas-container {
		position: relative;
	}

	:global(.canvas-container canvas) {
		max-width: 100%;
		max-height: 100%;
	}
</style>
