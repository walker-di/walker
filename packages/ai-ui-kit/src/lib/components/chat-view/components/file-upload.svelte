<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { X, Upload, File, Image, Video, Music, FileText } from "lucide-svelte";
	import type { FileUpload } from "../schemas/chat.js";
	import { validateFileConstraints, formatFileSize, isFileTypeSupported } from "../utils/file-utils.js";

	interface Props {
		files?: FileUpload[];
		maxFileSize?: number;
		acceptedFileTypes?: string[];
		disabled?: boolean;
		onFileSelect?: (files: File[]) => void;
		onFileRemove?: (fileId: string) => void;
		onFilePreview?: (fileId: string) => void;
	}

	let {
		files = [],
		maxFileSize = 10 * 1024 * 1024, // 10MB default
		acceptedFileTypes = ["image/*", "video/*", "audio/*", "text/*", ".pdf", ".doc", ".docx"],
		disabled = false,
		onFileSelect,
		onFileRemove,
		onFilePreview
	}: Props = $props();

	let fileInput: HTMLInputElement;
	let dragOver = $state(false);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			processFiles(Array.from(target.files));
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		if (disabled || !event.dataTransfer?.files) return;
		
		processFiles(Array.from(event.dataTransfer.files));
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!disabled) {
			dragOver = true;
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
	}

	function processFiles(selectedFiles: File[]) {
		const validFiles: File[] = [];
		const invalidFiles: { file: File; errors: string[] }[] = [];

		selectedFiles.forEach(file => {
			const validation = validateFileConstraints(file, maxFileSize, acceptedFileTypes);

			if (validation.success) {
				validFiles.push(file);
			} else {
				invalidFiles.push({
					file,
					errors: validation.errors || ['Unknown validation error']
				});

				// Log validation errors for debugging
				console.warn(`File ${file.name} validation failed:`, validation.errors);
			}
		});

		// Show user-friendly error messages for invalid files
		if (invalidFiles.length > 0) {
			invalidFiles.forEach(({ file, errors }) => {
				console.error(`File "${file.name}" rejected: ${errors.join(', ')}`);
				// In a real app, you might want to show toast notifications here
			});
		}

		if (validFiles.length > 0) {
			onFileSelect?.(validFiles);
		}
	}

	function getFileIcon(file: FileUpload) {
		const type = file.file.type;
		if (type.startsWith('image/')) return Image;
		if (type.startsWith('video/')) return Video;
		if (type.startsWith('audio/')) return Music;
		if (type.includes('text') || type.includes('pdf') || type.includes('document')) return FileText;
		return File;
	}

	// formatFileSize is now imported from file-utils.js

	function getStatusColor(status: FileUpload['status']) {
		switch (status) {
			case 'uploaded': return 'default';
			case 'uploading': return 'secondary';
			case 'error': return 'destructive';
			default: return 'secondary';
		}
	}
</script>

<div class="space-y-4">
	<!-- File Upload Area -->
	<div
		class="border-2 border-dashed rounded-lg p-6 text-center transition-colors {dragOver
			? 'border-primary bg-primary/5'
			: 'border-gray-300 dark:border-gray-600'} {disabled
			? 'opacity-50 cursor-not-allowed'
			: 'cursor-pointer hover:border-primary hover:bg-primary/5'}"
		role="button"
		tabindex="0"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		onclick={() => !disabled && fileInput?.click()}
		onkeydown={(e) => {
			if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
				e.preventDefault();
				fileInput?.click();
			}
		}}
	>
		<Upload class="mx-auto h-8 w-8 text-gray-400 mb-2" />
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
			{dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
		</p>
		<p class="text-xs text-gray-500">
			Max size: {formatFileSize(maxFileSize)}
		</p>
		
		<input
			bind:this={fileInput}
			type="file"
			multiple
			accept={acceptedFileTypes.join(',')}
			class="hidden"
			onchange={handleFileSelect}
			{disabled}
		/>
	</div>

	<!-- File List -->
	{#if files.length > 0}
		<div class="space-y-2">
			<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Uploaded Files ({files.length})
			</h4>
			
			<div class="space-y-2 max-h-40 overflow-y-auto">
				{#each files as file (file.id)}
					{@const IconComponent = getFileIcon(file)}
					<div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<div class="flex-shrink-0">
							<IconComponent class="h-5 w-5 text-gray-500" />
						</div>
						
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
									{file.file.name}
								</p>
								<Badge variant={getStatusColor(file.status)} class="text-xs">
									{file.status}
								</Badge>
							</div>
							
							<p class="text-xs text-gray-500">
								{formatFileSize(file.file.size)}
							</p>
							
							{#if file.status === 'uploading'}
								<Progress value={file.progress} class="mt-2 h-1" />
							{/if}
							
							{#if file.error}
								<p class="text-xs text-red-500 mt-1">{file.error}</p>
							{/if}
						</div>
						
						<div class="flex items-center gap-1">
							{#if file.status === 'uploaded' && onFilePreview}
								<Button
									variant="ghost"
									size="icon"
									class="h-7 w-7"
									onclick={() => onFilePreview?.(file.id)}
								>
									<File class="h-3.5 w-3.5" />
								</Button>
							{/if}
							
							<Button
								variant="ghost"
								size="icon"
								class="h-7 w-7 text-gray-500 hover:text-red-500"
								onclick={() => onFileRemove?.(file.id)}
							>
								<X class="h-3.5 w-3.5" />
							</Button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
