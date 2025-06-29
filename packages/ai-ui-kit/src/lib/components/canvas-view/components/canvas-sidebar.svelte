<script lang="ts">
	import type { Canvas } from "fabric";
	import type { CanvasService } from "../services/canvas-service.svelte.js";
	import CanvasSidebarNav from "./canvas-sidebar-nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import {
		addText,
		addRectangle,
		addCircle,
		addTriangle,
		addStar,
		addLine,
		addArrow,
		addImageFromUrl,
		setBackgroundColor,
		setBackgroundImage,
		removeBackgroundImage,
	} from "../utils/canvas-tools.js";

	// Lucide icons
	import Square from "lucide-svelte/icons/square";
	import Circle from "lucide-svelte/icons/circle";
	import Triangle from "lucide-svelte/icons/triangle";
	import Star from "lucide-svelte/icons/star";
	import Minus from "lucide-svelte/icons/minus";
	import ArrowRight from "lucide-svelte/icons/arrow-right";
	import Type from "lucide-svelte/icons/type";
	import Heading1 from "lucide-svelte/icons/heading-1";
	import Heading2 from "lucide-svelte/icons/heading-2";
	import Upload from "lucide-svelte/icons/upload";
	import Palette from "lucide-svelte/icons/palette";
	import ImageIcon from "lucide-svelte/icons/image";

	let {
		canvas,
		canvasService,
		onImageUpload,
	}: {
		canvas: Canvas;
		canvasService: CanvasService;
		onImageUpload?: () => void;
	} = $props();

	let activeTab = $state("shapes");
	let backgroundColorInput = $state("#f0f0f0");
	let backgroundImageUrl = $state("");

	// Define the shapes for the shapes tab
	const shapes = [
		{
			id: "rectangle",
			label: "Rectangle",
			icon: Square,
			action: () => addRectangle(canvas),
		},
		{
			id: "circle",
			label: "Circle",
			icon: Circle,
			action: () => addCircle(canvas),
		},
		{
			id: "triangle",
			label: "Triangle",
			icon: Triangle,
			action: () => addTriangle(canvas),
		},
		{ id: "star", label: "Star", icon: Star, action: () => addStar(canvas) },
		{ id: "line", label: "Line", icon: Minus, action: () => addLine(canvas) },
		{
			id: "arrow",
			label: "Arrow",
			icon: ArrowRight,
			action: () => addArrow(canvas),
		},
	];

	// Define the text options
	const textOptions = [
		{
			id: "text",
			label: "Add Text",
			icon: Type,
			action: () => addText(canvas, "Text"),
		},
		{
			id: "heading",
			label: "Heading",
			icon: Heading1,
			action: () => addText(canvas, "Heading"),
		},
		{
			id: "subheading",
			label: "Subheading",
			icon: Heading2,
			action: () => addText(canvas, "Subheading"),
		},
	];

	function handleItemClick(action: () => void) {
		action();
	}

	function handleBackgroundColor() {
		setBackgroundColor(canvas, backgroundColorInput);
	}

	function handleBackgroundImage() {
		if (backgroundImageUrl.trim()) {
			setBackgroundImage(canvas, backgroundImageUrl.trim()).catch((error) => {
				console.error("Error setting background image:", error);
				alert(
					"Failed to set background image. Please check the URL and try again.",
				);
			});
		}
	}

	function handleRemoveBackgroundImage() {
		removeBackgroundImage(canvas);
		backgroundImageUrl = "";
	}

	async function handleImageFromUrl() {
		const url = prompt("Enter image URL:");
		if (url) {
			try {
				await addImageFromUrl(canvas, url);
			} catch (error) {
				console.error("Error adding image:", error);
				alert("Failed to add image. Please check the URL and try again.");
			}
		}
	}
</script>

<div class="canvas-sidebar">
	<CanvasSidebarNav bind:activeTab />
	<div class="sidebar-content">
		{#if activeTab === "shapes"}
			<div class="content-section">
				<h3 class="section-title">Shapes</h3>
				<div class="items-grid">
					{#each shapes as shape}
						<Button
							variant="outline"
							size="sm"
							class="item-button"
							onclick={() => handleItemClick(shape.action)}
							title={shape.label}
						>
							<svelte:component this={shape.icon} class="w-4 h-4" />
						</Button>
					{/each}
				</div>
			</div>
		{:else if activeTab === "text"}
			<div class="content-section">
				<h3 class="section-title">Text</h3>
				<div class="items-list">
					{#each textOptions as option}
						<Button
							variant="outline"
							size="sm"
							class="text-item-button"
							onclick={() => handleItemClick(option.action)}
						>
							<svelte:component this={option.icon} class="w-4 h-4 mr-2" />
							{option.label}
						</Button>
					{/each}
				</div>
			</div>
		{:else if activeTab === "images"}
			<div class="content-section">
				<h3 class="section-title">Images</h3>
				<div class="space-y-2">
					<Button
						variant="outline"
						size="sm"
						class="w-full"
						onclick={onImageUpload}
					>
						<Upload class="w-4 h-4 mr-2" />
						Upload Image
					</Button>
					<Button
						variant="outline"
						size="sm"
						class="w-full"
						onclick={handleImageFromUrl}
					>
						<ImageIcon class="w-4 h-4 mr-2" />
						Add from URL
					</Button>
				</div>
			</div>
		{:else if activeTab === "background"}
			<div class="content-section">
				<h3 class="section-title">Background</h3>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="bg-color">Background Color</Label>
						<div class="flex gap-2">
							<Input
								id="bg-color"
								type="color"
								bind:value={backgroundColorInput}
								class="w-12 h-8 p-1"
							/>
							<Button
								variant="outline"
								size="sm"
								onclick={handleBackgroundColor}
							>
								<Palette class="w-4 h-4 mr-2" />
								Apply
							</Button>
						</div>
					</div>

					<div class="h-px w-full bg-border"></div>

					<div class="space-y-2">
						<Label for="bg-image">Background Image URL</Label>
						<Input
							id="bg-image"
							type="url"
							bind:value={backgroundImageUrl}
							placeholder="https://example.com/image.jpg"
						/>
						<div class="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onclick={handleBackgroundImage}
								disabled={!backgroundImageUrl.trim()}
							>
								Set Image
							</Button>
							<Button
								variant="outline"
								size="sm"
								onclick={handleRemoveBackgroundImage}
							>
								Remove
							</Button>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === "layers"}
			<div class="content-section">
				<h3 class="section-title">Layers</h3>
				<p class="text-sm text-muted-foreground">
					Layer management coming soon...
				</p>
			</div>
		{:else if activeTab === "upload"}
			<div class="content-section">
				<h3 class="section-title">Upload</h3>
				<Button
					variant="outline"
					size="sm"
					class="w-full"
					onclick={onImageUpload}
				>
					<Upload class="w-4 h-4 mr-2" />
					Upload Files
				</Button>
			</div>
		{:else if activeTab === "templates"}
			<div class="content-section">
				<h3 class="section-title">Templates</h3>
				<p class="text-sm text-muted-foreground">Templates coming soon...</p>
			</div>
		{:else if activeTab === "settings"}
			<div class="content-section">
				<h3 class="section-title">Settings</h3>
				<p class="text-sm text-muted-foreground">
					Canvas settings coming soon...
				</p>
			</div>
		{:else}
			<div class="content-section">
				<h3 class="section-title">
					{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
				</h3>
				<p class="text-sm text-muted-foreground">Content for {activeTab} tab</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.canvas-sidebar {
		display: flex;
		height: 100%;
		background-color: hsl(var(--background));
		border-right: 1px solid hsl(var(--border));
	}

	.sidebar-content {
		width: 280px;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.content-section {
		padding: 16px;
	}

	.section-title {
		font-size: 0.9rem;
		font-weight: 600;
		margin-bottom: 12px;
		color: hsl(var(--foreground));
	}

	.items-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	:global(.item-button) {
		aspect-ratio: 1;
		padding: 8px;
	}

	:global(.text-item-button) {
		justify-content: flex-start;
		padding: 8px 12px;
	}
</style>
