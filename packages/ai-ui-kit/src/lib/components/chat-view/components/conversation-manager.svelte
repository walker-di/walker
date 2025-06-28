<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Download, Upload, FileText, Calendar, Users, MessageSquare } from "lucide-svelte";
	import type { ConversationExport, ChatMessage, ChatParticipant, ConversationThread } from "../types/chat.js";

	interface Props {
		messages: ChatMessage[];
		participants: ChatParticipant[];
		threads?: ConversationThread[];
		conversationTitle?: string;
		onExport?: (data: ConversationExport) => void;
		onImport?: (data: ConversationExport) => void;
	}

	let {
		messages = [],
		participants = [],
		threads = [],
		conversationTitle = "Untitled Conversation",
		onExport,
		onImport
	}: Props = $props();

	let exportDialogOpen = $state(false);
	let importDialogOpen = $state(false);
	let importText = $state('');
	let exportTitle = $state(conversationTitle);
	let fileInput: HTMLInputElement;

	function generateExportData(): ConversationExport {
		return {
			version: "1.0",
			conversation_id: crypto.randomUUID(),
			title: exportTitle || conversationTitle,
			created_at: new Date(Math.min(...messages.map(m => m.timestamp?.getTime() || Date.now()))),
			exported_at: new Date(),
			participants,
			messages,
			threads
		};
	}

	function handleExport() {
		const exportData = generateExportData();
		
		if (onExport) {
			onExport(exportData);
		} else {
			// Default export behavior - download as JSON
			const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${exportData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}
		
		exportDialogOpen = false;
	}

	function handleFileImport(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result as string;
				importText = content;
			};
			reader.readAsText(file);
		}
	}

	function handleImport() {
		try {
			const importData: ConversationExport = JSON.parse(importText);
			
			// Basic validation
			if (!importData.version || !importData.messages || !Array.isArray(importData.messages)) {
				throw new Error('Invalid conversation format');
			}
			
			if (onImport) {
				onImport(importData);
			}
			
			importDialogOpen = false;
			importText = '';
		} catch (error) {
			console.error('Failed to import conversation:', error);
			// You might want to show a toast or error message here
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function getExportStats() {
		const exportData = generateExportData();
		const jsonString = JSON.stringify(exportData);
		const sizeInBytes = new Blob([jsonString]).size;
		
		return {
			messageCount: messages.length,
			participantCount: participants.length,
			threadCount: threads.length,
			fileSize: formatFileSize(sizeInBytes),
			dateRange: {
				start: new Date(Math.min(...messages.map(m => m.timestamp?.getTime() || Date.now()))),
				end: new Date(Math.max(...messages.map(m => m.timestamp?.getTime() || Date.now())))
			}
		};
	}
</script>

<div class="flex items-center gap-2">
	<!-- Export Dialog -->
	<Dialog bind:open={exportDialogOpen}>
		<DialogTrigger asChild let:builder>
			<Button builders={[builder]} variant="outline" size="sm" class="flex items-center gap-2">
				<Download class="h-4 w-4" />
				Export
			</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-md">
			<DialogHeader>
				<DialogTitle>Export Conversation</DialogTitle>
			</DialogHeader>
			
			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="export-title">Conversation Title</Label>
					<Input
						id="export-title"
						bind:value={exportTitle}
						placeholder="Enter conversation title..."
					/>
				</div>

				{#if true}
					{@const stats = getExportStats()}
					<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
					<h4 class="text-sm font-medium text-gray-900 dark:text-gray-100">Export Summary</h4>
					
					<div class="grid grid-cols-2 gap-3 text-sm">
						<div class="flex items-center gap-2">
							<MessageSquare class="h-4 w-4 text-gray-500" />
							<span>{stats.messageCount} messages</span>
						</div>
						
						<div class="flex items-center gap-2">
							<Users class="h-4 w-4 text-gray-500" />
							<span>{stats.participantCount} participants</span>
						</div>
						
						<div class="flex items-center gap-2">
							<FileText class="h-4 w-4 text-gray-500" />
							<span>{stats.threadCount} threads</span>
						</div>
						
						<div class="flex items-center gap-2">
							<Calendar class="h-4 w-4 text-gray-500" />
							<span>{stats.fileSize}</span>
						</div>
					</div>
					
					<div class="text-xs text-gray-500">
						<div>From: {stats.dateRange.start.toLocaleDateString()}</div>
						<div>To: {stats.dateRange.end.toLocaleDateString()}</div>
					</div>
				</div>
			{/if}

				<div class="flex justify-end gap-2">
					<Button variant="outline" onclick={() => exportDialogOpen = false}>
						Cancel
					</Button>
					<Button onclick={handleExport}>
						<Download class="h-4 w-4 mr-2" />
						Export
					</Button>
				</div>
			</div>
		</DialogContent>
	</Dialog>

	<!-- Import Dialog -->
	<Dialog bind:open={importDialogOpen}>
		<DialogTrigger asChild let:builder>
			<Button builders={[builder]} variant="outline" size="sm" class="flex items-center gap-2">
				<Upload class="h-4 w-4" />
				Import
			</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-lg">
			<DialogHeader>
				<DialogTitle>Import Conversation</DialogTitle>
			</DialogHeader>
			
			<div class="space-y-4">
				<div class="space-y-2">
					<Label>Import Method</Label>
					<div class="flex gap-2">
						<Button
							variant="outline"
							onclick={() => fileInput?.click()}
							class="flex-1"
						>
							<Upload class="h-4 w-4 mr-2" />
							Choose File
						</Button>
						<Badge variant="secondary" class="px-3 py-1">
							JSON
						</Badge>
					</div>
					
					<input
						bind:this={fileInput}
						type="file"
						accept=".json"
						class="hidden"
						onchange={handleFileImport}
					/>
				</div>

				<div class="space-y-2">
					<Label for="import-text">Or paste JSON content</Label>
					<Textarea
						id="import-text"
						bind:value={importText}
						placeholder="Paste your exported conversation JSON here..."
						class="min-h-[200px] font-mono text-sm"
					/>
				</div>

				<div class="flex justify-end gap-2">
					<Button variant="outline" onclick={() => {
						importDialogOpen = false;
						importText = '';
					}}>
						Cancel
					</Button>
					<Button onclick={handleImport} disabled={!importText.trim()}>
						<Upload class="h-4 w-4 mr-2" />
						Import
					</Button>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</div>
