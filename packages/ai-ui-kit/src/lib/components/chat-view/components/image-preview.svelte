<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
	import { ZoomIn, Download, ExternalLink, X } from "lucide-svelte";
	import type { ImagePart } from "../types/chat.js";

	interface Props {
		image: ImagePart;
		maxWidth?: number;
		maxHeight?: number;
		showControls?: boolean;
		showMetadata?: boolean;
		onDownload?: (image: ImagePart) => void;
		onFullscreen?: (image: ImagePart) => void;
		onRemove?: (image: ImagePart) => void;
	}

	let {
		image,
		maxWidth = 400,
		maxHeight = 300,
		showControls = true,
		showMetadata = false,
		onDownload,
		onFullscreen,
		onRemove
	}: Props = $props();

	let imageElement = $state<HTMLImageElement>();
	let isLoading = $state(true);
	let hasError = $state(false);
	let isHovered = $state(false);

	function getImageSrc(): string {
		if (image.source.url) {
			return image.source.url;
		}
		if (image.source.base64) {
			return `data:${image.media_type};base64,${image.source.base64}`;
		}
		if (image.source.file_id) {
			// This would typically be handled by your file service
			return `/api/files/${image.source.file_id}`;
		}
		return '';
	}

	function handleImageLoad() {
		isLoading = false;
		hasError = false;
	}

	function handleImageError() {
		isLoading = false;
		hasError = true;
	}

	function handleDownload() {
		if (onDownload) {
			onDownload(image);
		} else {
			// Default download behavior
			const src = getImageSrc();
			if (src) {
				const link = document.createElement('a');
				link.href = src;
				link.download = image.alt_text || 'image';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	function getFileSize(): string | null {
		if (image.source.base64) {
			// Estimate size from base64 string
			const sizeInBytes = (image.source.base64.length * 3) / 4;
			return formatFileSize(sizeInBytes);
		}
		return null;
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function getImageDimensions(): { width: number; height: number } | null {
		if (imageElement) {
			return {
				width: imageElement.naturalWidth,
				height: imageElement.naturalHeight
			};
		}
		return null;
	}
</script>

<div
	class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
	style="max-width: {maxWidth}px;"
	role="img"
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
>
	{#if isLoading}
		<div class="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800">
			<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
		</div>
	{:else if hasError}
		<div class="flex flex-col items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 text-gray-500">
			<X class="h-8 w-8 mb-2" />
			<p class="text-sm">Failed to load image</p>
		</div>
	{:else}
		<AspectRatio ratio={16 / 9}>
			<img
				bind:this={imageElement}
				src={getImageSrc()}
				alt={image.alt_text || 'Uploaded image'}
				class="w-full h-full object-cover"
				onload={handleImageLoad}
				onerror={handleImageError}
				style="max-height: {maxHeight}px;"
			/>
		</AspectRatio>
	{/if}

	<!-- Controls Overlay -->
	{#if showControls && !isLoading && !hasError && (isHovered || showMetadata)}
		<div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
			<div class="flex items-center gap-2">
				{#if onFullscreen}
					<Button
						variant="secondary"
						size="icon"
						class="h-8 w-8 bg-white/90 hover:bg-white text-gray-900"
						onclick={() => onFullscreen?.(image)}
					>
						<ZoomIn class="h-4 w-4" />
					</Button>
				{/if}

				<Button
					variant="secondary"
					size="icon"
					class="h-8 w-8 bg-white/90 hover:bg-white text-gray-900"
					onclick={handleDownload}
				>
					<Download class="h-4 w-4" />
				</Button>

				{#if image.source.url}
					<Button
						variant="secondary"
						size="icon"
						class="h-8 w-8 bg-white/90 hover:bg-white text-gray-900"
						onclick={() => window.open(image.source.url, '_blank')}
					>
						<ExternalLink class="h-4 w-4" />
					</Button>
				{/if}

				{#if onRemove}
					<Button
						variant="secondary"
						size="icon"
						class="h-8 w-8 bg-white/90 hover:bg-white text-red-600"
						onclick={() => onRemove?.(image)}
					>
						<X class="h-4 w-4" />
					</Button>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Metadata -->
	{#if showMetadata && !isLoading && !hasError}
		{@const dimensions = getImageDimensions()}
		{@const fileSize = getFileSize()}
		<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
			<div class="flex items-center justify-between text-white text-xs">
				<div class="flex items-center gap-2">
					<Badge variant="secondary" class="text-xs">
						{image.media_type}
					</Badge>

					{#if dimensions}
						<Badge variant="secondary" class="text-xs">
							{dimensions.width} × {dimensions.height}
						</Badge>
					{/if}

					{#if fileSize}
						<Badge variant="secondary" class="text-xs">
							{fileSize}
						</Badge>
					{/if}
				</div>
			</div>
			
			{#if image.alt_text}
				<p class="text-white text-xs mt-1 truncate">
					{image.alt_text}
				</p>
			{/if}
		</div>
	{/if}
</div>
