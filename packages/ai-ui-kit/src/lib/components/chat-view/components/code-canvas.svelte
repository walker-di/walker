<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Copy, Download, Edit3, Save, X, Play, FileCode } from "lucide-svelte";
	import type { CodePart } from "../types/chat.js";

	interface Props {
		code: CodePart;
		editable?: boolean;
		showLineNumbers?: boolean;
		maxHeight?: number;
		onCodeChange?: (code: string) => void;
		onSave?: (code: CodePart) => void;
		onRun?: (code: CodePart) => void;
		onDownload?: (code: CodePart) => void;
		onCopy?: (code: string) => void;
		onRemove?: (code: CodePart) => void;
	}

	let {
		code,
		editable = false,
		showLineNumbers = true,
		maxHeight = 400,
		onCodeChange,
		onSave,
		onRun,
		onDownload,
		onCopy,
		onRemove
	}: Props = $props();

	let isEditing = $state(false);
	let editedCode = $state(code.code);
	let codeElement = $state<HTMLElement>();

	function toggleEdit() {
		if (isEditing) {
			// Save changes
			if (editedCode !== code.code) {
				onCodeChange?.(editedCode);
				if (onSave) {
					onSave({ ...code, code: editedCode });
				}
			}
		} else {
			editedCode = code.code;
		}
		isEditing = !isEditing;
	}

	function handleCopy() {
		const textToCopy = isEditing ? editedCode : code.code;
		navigator.clipboard.writeText(textToCopy).then(() => {
			onCopy?.(textToCopy);
		});
	}

	function handleDownload() {
		if (onDownload) {
			onDownload(code);
		} else {
			// Default download behavior
			const blob = new Blob([isEditing ? editedCode : code.code], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = code.filename || `code.${getFileExtension(code.language)}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}
	}

	function getFileExtension(language: string): string {
		const extensions: Record<string, string> = {
			javascript: 'js',
			typescript: 'ts',
			python: 'py',
			java: 'java',
			cpp: 'cpp',
			c: 'c',
			csharp: 'cs',
			php: 'php',
			ruby: 'rb',
			go: 'go',
			rust: 'rs',
			swift: 'swift',
			kotlin: 'kt',
			scala: 'scala',
			html: 'html',
			css: 'css',
			scss: 'scss',
			sass: 'sass',
			json: 'json',
			xml: 'xml',
			yaml: 'yml',
			markdown: 'md',
			sql: 'sql',
			shell: 'sh',
			bash: 'sh',
			powershell: 'ps1'
		};
		return extensions[language.toLowerCase()] || 'txt';
	}

	function getLanguageColor(language: string): string {
		const colors: Record<string, string> = {
			javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
			python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			java: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
			cpp: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
			html: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
			css: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
			json: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
		};
		return colors[language.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
	}

	function getLineNumbers(codeText: string): string[] {
		return codeText.split('\n').map((_, index) => (index + 1).toString());
	}

	function isExecutableLanguage(language: string): boolean {
		const executable = ['javascript', 'python', 'typescript', 'html', 'css'];
		return executable.includes(language.toLowerCase());
	}
</script>

<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
	<!-- Header -->
	<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
		<div class="flex items-center gap-2">
			<FileCode class="h-4 w-4 text-gray-500" />
			
			{#if code.filename}
				<span class="text-sm font-medium text-gray-900 dark:text-gray-100">
					{code.filename}
				</span>
			{/if}
			
			<Badge class={getLanguageColor(code.language)}>
				{code.language}
			</Badge>
			
			{#if isEditing}
				<Badge variant="outline" class="text-xs">
					Editing
				</Badge>
			{/if}
		</div>

		<div class="flex items-center gap-1">
			{#if isExecutableLanguage(code.language) && onRun}
				<Button
					variant="ghost"
					size="icon"
					class="h-7 w-7"
					onclick={() => onRun?.(code)}
					title="Run code"
				>
					<Play class="h-3.5 w-3.5" />
				</Button>
			{/if}

			<Button
				variant="ghost"
				size="icon"
				class="h-7 w-7"
				onclick={handleCopy}
				title="Copy code"
			>
				<Copy class="h-3.5 w-3.5" />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				class="h-7 w-7"
				onclick={handleDownload}
				title="Download code"
			>
				<Download class="h-3.5 w-3.5" />
			</Button>

			{#if editable || code.editable}
				<Button
					variant="ghost"
					size="icon"
					class="h-7 w-7"
					onclick={toggleEdit}
					title={isEditing ? "Save changes" : "Edit code"}
				>
					{#if isEditing}
						<Save class="h-3.5 w-3.5" />
					{:else}
						<Edit3 class="h-3.5 w-3.5" />
					{/if}
				</Button>
			{/if}

			{#if onRemove}
				<Button
					variant="ghost"
					size="icon"
					class="h-7 w-7 text-red-500 hover:text-red-600"
					onclick={() => onRemove?.(code)}
					title="Remove code block"
				>
					<X class="h-3.5 w-3.5" />
				</Button>
			{/if}
		</div>
	</div>

	<!-- Code Content -->
	<div class="relative" style="max-height: {maxHeight}px; overflow-y: auto;">
		{#if isEditing}
			<Textarea
				bind:value={editedCode}
				class="w-full border-0 rounded-none resize-none font-mono text-sm focus:ring-0 focus:border-0"
				style="min-height: 200px;"
				placeholder="Enter your code here..."
			/>
		{:else}
			<div class="flex">
				{#if showLineNumbers}
					<div class="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-right">
						<div class="font-mono text-xs text-gray-500 leading-6">
							{#each getLineNumbers(code.code) as lineNumber}
								<div>{lineNumber}</div>
							{/each}
						</div>
					</div>
				{/if}
				
				<div class="flex-1 p-4 overflow-x-auto">
					<pre bind:this={codeElement} class="font-mono text-sm text-gray-900 dark:text-gray-100 leading-6 whitespace-pre-wrap"><code>{code.code}</code></pre>
				</div>
			</div>
		{/if}
	</div>
</div>
