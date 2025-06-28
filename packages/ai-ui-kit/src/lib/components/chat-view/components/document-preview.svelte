<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { FileText, Download, ExternalLink, Eye, X, File } from "lucide-svelte";
	import type { FilePart } from "../types/chat.js";

	interface Props {
		document: FilePart;
		maxWidth?: number;
		maxHeight?: number;
		showControls?: boolean;
		showMetadata?: boolean;
		onDownload?: (document: FilePart) => void;
		onPreview?: (document: FilePart) => void;
		onRemove?: (document: FilePart) => void;
	}

	let {
		document,
		maxWidth = 400,
		maxHeight = 300,
		showControls = true,
		showMetadata = true,
		onDownload,
		onPreview,
		onRemove
	}: Props = $props();

	let isLoading = $state(false);
	let previewContent = $state<string | null>(null);
	let isHovered = $state(false);

	function getDocumentSrc(): string {
		if (document.source.url) {
			return document.source.url;
		}
		if (document.source.file_id) {
			return `/api/files/${document.source.file_id}`;
		}
		if (document.source.base64) {
			return `data:${document.media_type};base64,${document.source.base64}`;
		}
		return '';
	}

	function getDocumentIcon() {
		const type = document.media_type.toLowerCase();
		if (type.includes('pdf')) return FileText;
		if (type.includes('word') || type.includes('doc')) return FileText;
		if (type.includes('text')) return FileText;
		if (type.includes('spreadsheet') || type.includes('excel')) return File;
		if (type.includes('presentation') || type.includes('powerpoint')) return File;
		return File;
	}

	function formatFileSize(bytes?: number): string {
		if (!bytes) return 'Unknown size';
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function getFileExtension(): string {
		const filename = document.filename;
		const lastDot = filename.lastIndexOf('.');
		return lastDot !== -1 ? filename.substring(lastDot + 1).toUpperCase() : 'FILE';
	}

	function handleDownload() {
		if (onDownload) {
			onDownload(document);
		} else {
			// Default download behavior
			const src = getDocumentSrc();
			if (src) {
				const link = document.createElement('a');
				link.href = src;
				link.download = document.filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	function handlePreview() {
		if (onPreview) {
			onPreview(document);
		} else {
			// Default preview behavior - open in new tab
			const src = getDocumentSrc();
			if (src) {
				window.open(src, '_blank');
			}
		}
	}

	function canPreviewInline(): boolean {
		const type = document.media_type.toLowerCase();
		return type.includes('pdf') || type.includes('text');
	}

	function getDocumentTypeColor(): string {
		const type = document.media_type.toLowerCase();
		if (type.includes('pdf')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
		if (type.includes('word') || type.includes('doc')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
		if (type.includes('excel') || type.includes('spreadsheet')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
		if (type.includes('powerpoint') || type.includes('presentation')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
		if (type.includes('text')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
		return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
	}

	let IconComponent = $derived(getDocumentIcon());
</script>

<div
	class="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
	style="max-width: {maxWidth}px;"
	role="button"
	tabindex="0"
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
>
	<!-- Document Preview Area -->
	<div class="p-6 text-center" style="min-height: 120px;">
		<div class="flex flex-col items-center justify-center h-full">
			<div class="relative mb-3">
				<IconComponent class="h-12 w-12 text-gray-400" />
				<Badge class={`absolute -bottom-1 -right-1 text-xs ${getDocumentTypeColor()}`}>
					{getFileExtension()}
				</Badge>
			</div>
			
			<h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 truncate max-w-full">
				{document.filename}
			</h4>
			
			{#if showMetadata}
				<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
					<Badge variant="outline" class="text-xs">
						{document.media_type}
					</Badge>
					
					{#if document.size}
						<span>{formatFileSize(document.size)}</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Controls Overlay -->
	{#if showControls && (isHovered || showMetadata)}
		<div class="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
			<div class="flex items-center gap-2">
				{#if canPreviewInline()}
					<Button
						variant="secondary"
						size="icon"
						class="h-8 w-8 bg-white/90 hover:bg-white text-gray-900"
						onclick={handlePreview}
						title="Preview document"
					>
						<Eye class="h-4 w-4" />
					</Button>
				{/if}

				<Button
					variant="secondary"
					size="icon"
					class="h-8 w-8 bg-white/90 hover:bg-white text-gray-900"
					onclick={handleDownload}
					title="Download document"
				>
					<Download class="h-4 w-4" />
				</Button>

				{#if document.source.url}
					<Button
						variant="secondary"
						size="icon"
						class="h-8 w-8 bg-white/90 hover:bg-white text-gray-900"
						onclick={() => window.open(document.source.url, '_blank')}
						title="Open in new tab"
					>
						<ExternalLink class="h-4 w-4" />
					</Button>
				{/if}

				{#if onRemove}
					<Button
						variant="secondary"
						size="icon"
						class="h-8 w-8 bg-white/90 hover:bg-white text-red-600"
						onclick={() => onRemove?.(document)}
						title="Remove document"
					>
						<X class="h-4 w-4" />
					</Button>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
			<div class="text-center">
				<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
				<p class="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
			</div>
		</div>
	{/if}
</div>
