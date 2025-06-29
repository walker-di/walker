<script lang="ts">
	import type { Canvas } from "fabric";
	import type { CanvasService } from "../services/canvas-service.svelte.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		duplicateSelected,
		bringToFront,
		sendToBack,
	} from "../utils/canvas-tools.js";

	// Lucide icons
	import Undo from "lucide-svelte/icons/undo";
	import Redo from "lucide-svelte/icons/redo";
	import Copy from "lucide-svelte/icons/copy";
	import Trash2 from "lucide-svelte/icons/trash-2";
	import Lock from "lucide-svelte/icons/lock";
	import Unlock from "lucide-svelte/icons/unlock";
	import MoveUp from "lucide-svelte/icons/move-up";
	import MoveDown from "lucide-svelte/icons/move-down";
	import Layers from "lucide-svelte/icons/layers";
	import Palette from "lucide-svelte/icons/palette";

	let {
		canvas,
		canvasService,
		hasSelectedObject = false,
	}: {
		canvas?: Canvas;
		canvasService?: CanvasService;
		hasSelectedObject?: boolean;
	} = $props();

	let selectedObject = $state<any>(null);
	let isObjectLocked = $state(false);

	// Update selected object state
	$effect(() => {
		if (canvas) {
			const updateSelection = () => {
				selectedObject = canvas.getActiveObject();
				isObjectLocked = selectedObject ? !selectedObject.selectable : false;
			};

			canvas.on("selection:created", updateSelection);
			canvas.on("selection:updated", updateSelection);
			canvas.on("selection:cleared", () => {
				selectedObject = null;
				isObjectLocked = false;
			});

			return () => {
				canvas.off("selection:created", updateSelection);
				canvas.off("selection:updated", updateSelection);
				canvas.off("selection:cleared");
			};
		}
	});

	function handleUndo() {
		// TODO: Implement undo functionality
		console.log("Undo clicked");
	}

	function handleRedo() {
		// TODO: Implement redo functionality
		console.log("Redo clicked");
	}

	function handleDuplicate() {
		if (!canvas || !selectedObject) return;
		duplicateSelected(canvas);
	}

	function handleDelete() {
		if (!canvas || !selectedObject) return;
		canvas.remove(selectedObject);
		canvas.renderAll();
	}

	function handleLock() {
		if (!canvas || !selectedObject) return;

		const newLockState = !selectedObject.selectable;
		selectedObject.set("selectable", newLockState);
		selectedObject.set("evented", newLockState);

		if (!newLockState) {
			canvas.discardActiveObject();
		}

		canvas.renderAll();
		isObjectLocked = !newLockState;
	}

	function handleBringToFront() {
		if (!canvas || !selectedObject) return;
		bringToFront(canvas);
	}

	function handleSendToBack() {
		if (!canvas || !selectedObject) return;
		sendToBack(canvas);
	}

	function handleChangeColor() {
		if (!canvas || !selectedObject) return;

		const color = prompt(
			"Enter color (e.g., #ff0000, red, rgb(255,0,0)):",
			selectedObject.fill || "#000000",
		);
		if (color) {
			selectedObject.set("fill", color);
			canvas.renderAll();
		}
	}

	function handleChangeStroke() {
		if (!canvas || !selectedObject) return;

		const color = prompt(
			"Enter stroke color (e.g., #ff0000, red, rgb(255,0,0)):",
			selectedObject.stroke || "#000000",
		);
		if (color) {
			selectedObject.set("stroke", color);
			canvas.renderAll();
		}
	}
</script>

<div class="canvas-header">
	<div class="header-section">
		<div class="button-group">
			<Button
				variant="outline"
				size="sm"
				onclick={handleUndo}
				title="Undo (Ctrl+Z)"
				disabled={true}
			>
				<Undo class="w-4 h-4" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={handleRedo}
				title="Redo (Ctrl+Y)"
				disabled={true}
			>
				<Redo class="w-4 h-4" />
			</Button>
		</div>

		<div class="h-6 w-px bg-border"></div>

		<div class="button-group">
			<Button
				variant="outline"
				size="sm"
				onclick={handleDuplicate}
				title="Duplicate"
				disabled={!hasSelectedObject}
			>
				<Copy class="w-4 h-4" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={handleDelete}
				title="Delete"
				disabled={!hasSelectedObject}
			>
				<Trash2 class="w-4 h-4" />
			</Button>
		</div>

		<div class="h-6 w-px bg-border"></div>

		<div class="button-group">
			<Button
				variant="outline"
				size="sm"
				onclick={handleLock}
				title={isObjectLocked ? "Unlock" : "Lock"}
				disabled={!hasSelectedObject}
			>
				{#if isObjectLocked}
					<Unlock class="w-4 h-4" />
				{:else}
					<Lock class="w-4 h-4" />
				{/if}
			</Button>
		</div>

		<div class="h-6 w-px bg-border"></div>

		<div class="button-group">
			<Button
				variant="outline"
				size="sm"
				onclick={handleBringToFront}
				title="Bring to Front"
				disabled={!hasSelectedObject}
			>
				<MoveUp class="w-4 h-4" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={handleSendToBack}
				title="Send to Back"
				disabled={!hasSelectedObject}
			>
				<MoveDown class="w-4 h-4" />
			</Button>
		</div>

		{#if hasSelectedObject}
			<div class="h-6 w-px bg-border"></div>

			<div class="button-group">
				<Button
					variant="outline"
					size="sm"
					onclick={handleChangeColor}
					title="Change Fill Color"
				>
					<Palette class="w-4 h-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={handleChangeStroke}
					title="Change Stroke Color"
				>
					<Layers class="w-4 h-4" />
				</Button>
			</div>
		{/if}
	</div>

	{#if selectedObject}
		<div class="object-info">
			<span class="text-sm text-muted-foreground">
				Selected: {selectedObject.name || selectedObject.type || "Object"}
			</span>
		</div>
	{/if}
</div>

<style>
	.canvas-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background-color: hsl(var(--background));
		border-bottom: 1px solid hsl(var(--border));
		min-height: 48px;
	}

	.header-section {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.button-group {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.object-info {
		display: flex;
		align-items: center;
		padding: 4px 8px;
		background-color: hsl(var(--muted));
		border-radius: 4px;
	}
</style>
