<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import type { Canvas } from "fabric";
	import type { CanvasService } from "../services/canvas-service.svelte.js";
	import type { CanvasZoomPan } from "../services/canvas-zoom-pan.svelte.js";
	import {
		addText,
		addRectangle,
		addCircle,
		deleteSelected,
		clearCanvas,
	} from "../utils/canvas-tools.js";

	// Lucide icons
	import Type from "lucide-svelte/icons/type";
	import Square from "lucide-svelte/icons/square";
	import Circle from "lucide-svelte/icons/circle";
	import Image from "lucide-svelte/icons/image";
	import Trash2 from "lucide-svelte/icons/trash-2";
	import Download from "lucide-svelte/icons/download";
	import ZoomIn from "lucide-svelte/icons/zoom-in";
	import ZoomOut from "lucide-svelte/icons/zoom-out";
	import Move from "lucide-svelte/icons/move";
	import MousePointer from "lucide-svelte/icons/mouse-pointer";
	import RotateCcw from "lucide-svelte/icons/rotate-ccw";

	let {
		canvas,
		canvasService,
		canvasZoomPan,
		hasSelectedObject = false,
		onAddImage,
	}: {
		canvas?: Canvas;
		canvasService?: CanvasService;
		canvasZoomPan?: CanvasZoomPan;
		hasSelectedObject?: boolean;
		onAddImage?: () => void;
	} = $props();

	function handleAddText() {
		if (!canvas) return;
		addText(canvas);
	}

	function handleAddRectangle() {
		if (!canvas) return;
		addRectangle(canvas);
	}

	function handleAddCircle() {
		if (!canvas) return;
		addCircle(canvas);
	}

	function handleAddImage() {
		onAddImage?.();
	}

	function handleDeleteSelected() {
		if (!canvas) return;
		deleteSelected(canvas);
	}

	function handleClearCanvas() {
		if (!canvas) return;
		if (confirm("Are you sure you want to clear the canvas?")) {
			clearCanvas(canvas);
		}
	}

	function handleDownload() {
		if (!canvasService) return;
		canvasService.download();
	}

	function handleZoomIn() {
		if (!canvas) return;
		const currentZoom = canvas.getZoom();
		const newZoom = Math.min(currentZoom * 1.2, 10);
		const center = canvas.getCenterPoint();
		canvas.zoomToPoint(center, newZoom);
	}

	function handleZoomOut() {
		if (!canvas) return;
		const currentZoom = canvas.getZoom();
		const newZoom = Math.max(currentZoom * 0.8, 0.1);
		const center = canvas.getCenterPoint();
		canvas.zoomToPoint(center, newZoom);
	}

	function handleTogglePanMode() {
		if (!canvasZoomPan) return;
		canvasZoomPan.togglePanMode();
	}

	function handleResetZoom() {
		if (!canvasZoomPan) return;
		canvasZoomPan.zoomToFit();
	}

	let isPanMode = $derived(canvasZoomPan?.isPanModeActive() || false);
</script>

<div class="flex items-center gap-2 p-2 bg-background border-b">
	<!-- Drawing Tools -->
	<div class="flex items-center gap-1 border-r pr-2">
		<Button
			variant="outline"
			size="sm"
			onclick={handleAddText}
			title="Add Text"
		>
			<Type class="h-4 w-4" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={handleAddRectangle}
			title="Add Rectangle"
		>
			<Square class="h-4 w-4" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={handleAddCircle}
			title="Add Circle"
		>
			<Circle class="h-4 w-4" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={handleAddImage}
			title="Add Image"
		>
			<Image class="h-4 w-4" />
		</Button>
	</div>

	<!-- Edit Tools -->
	<div class="flex items-center gap-1 border-r pr-2">
		<Button
			variant="outline"
			size="sm"
			onclick={handleDeleteSelected}
			disabled={!hasSelectedObject}
			title="Delete Selected"
		>
			<Trash2 class="h-4 w-4" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={handleClearCanvas}
			title="Clear Canvas"
		>
			<RotateCcw class="h-4 w-4" />
		</Button>
	</div>

	<!-- View Tools -->
	<div class="flex items-center gap-1 border-r pr-2">
		<Button
			variant={isPanMode ? "default" : "outline"}
			size="sm"
			onclick={handleTogglePanMode}
			title="Toggle Pan Mode"
		>
			{#if isPanMode}
				<Move class="h-4 w-4" />
			{:else}
				<MousePointer class="h-4 w-4" />
			{/if}
		</Button>
		<Button variant="outline" size="sm" onclick={handleZoomIn} title="Zoom In">
			<ZoomIn class="h-4 w-4" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={handleZoomOut}
			title="Zoom Out"
		>
			<ZoomOut class="h-4 w-4" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={handleResetZoom}
			title="Fit to View"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
				/>
			</svg>
		</Button>
	</div>

	<!-- Export Tools -->
	<div class="flex items-center gap-1">
		<Button
			variant="outline"
			size="sm"
			onclick={handleDownload}
			title="Download"
		>
			<Download class="h-4 w-4" />
		</Button>
	</div>
</div>
