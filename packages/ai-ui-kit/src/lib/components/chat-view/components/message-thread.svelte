<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu/index.js";
	import { MessageSquare, Plus, MoreVertical, Trash2, Edit3, Users } from "lucide-svelte";
	import type { ConversationThread, ChatMessage } from "../types/chat.js";

	interface Props {
		threads: ConversationThread[];
		activeThreadId?: string;
		messages: ChatMessage[];
		onCreateThread?: (messageId: string, title: string) => void;
		onSwitchThread?: (threadId: string) => void;
		onDeleteThread?: (threadId: string) => void;
		onRenameThread?: (threadId: string, newTitle: string) => void;
	}

	let {
		threads = [],
		activeThreadId,
		messages = [],
		onCreateThread,
		onSwitchThread,
		onDeleteThread,
		onRenameThread
	}: Props = $props();

	let showCreateForm = $state(false);
	let newThreadTitle = $state('');
	let editingThreadId = $state<string | null>(null);
	let editingTitle = $state('');

	function handleCreateThread() {
		if (newThreadTitle.trim() && messages.length > 0) {
			// Create thread from the last message
			const lastMessage = messages[messages.length - 1];
			onCreateThread?.(lastMessage.id, newThreadTitle.trim());
			newThreadTitle = '';
			showCreateForm = false;
		}
	}

	function startEditing(thread: ConversationThread) {
		editingThreadId = thread.id;
		editingTitle = thread.title;
	}

	function saveEdit() {
		if (editingThreadId && editingTitle.trim()) {
			onRenameThread?.(editingThreadId, editingTitle.trim());
		}
		editingThreadId = null;
		editingTitle = '';
	}

	function cancelEdit() {
		editingThreadId = null;
		editingTitle = '';
	}

	function getThreadMessageCount(threadId: string): number {
		return messages.filter(m => m.thread_id === threadId).length;
	}

	function getThreadLastActivity(thread: ConversationThread): string {
		const now = new Date();
		const diff = now.getTime() - thread.updated_at.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return thread.updated_at.toLocaleDateString();
	}

	function formatParticipantCount(count: number): string {
		return count === 1 ? '1 participant' : `${count} participants`;
	}
</script>

<div class="border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 w-80 flex flex-col">
	<!-- Header -->
	<div class="p-4 border-b border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
				<MessageSquare class="h-5 w-5" />
				Threads
			</h3>
			
			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8"
				onclick={() => showCreateForm = !showCreateForm}
			>
				<Plus class="h-4 w-4" />
			</Button>
		</div>

		{#if showCreateForm}
			<div class="space-y-2">
				<Input
					bind:value={newThreadTitle}
					placeholder="Thread title..."
					class="text-sm"
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							handleCreateThread();
						} else if (e.key === 'Escape') {
							showCreateForm = false;
							newThreadTitle = '';
						}
					}}
				/>
				<div class="flex gap-2">
					<Button
						size="sm"
						onclick={handleCreateThread}
						disabled={!newThreadTitle.trim()}
					>
						Create
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onclick={() => {
							showCreateForm = false;
							newThreadTitle = '';
						}}
					>
						Cancel
					</Button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Thread List -->
	<div class="flex-1 overflow-y-auto">
		{#if threads.length === 0}
			<div class="p-4 text-center text-gray-500 dark:text-gray-400">
				<MessageSquare class="h-8 w-8 mx-auto mb-2 opacity-50" />
				<p class="text-sm">No threads yet</p>
				<p class="text-xs mt-1">Create a thread to organize your conversation</p>
			</div>
		{:else}
			<div class="space-y-1 p-2">
				{#each threads as thread (thread.id)}
					<div
						class="group relative p-3 rounded-lg cursor-pointer transition-colors {thread.id === activeThreadId
							? 'bg-primary/10 border border-primary/20'
							: 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
						role="button"
						tabindex="0"
						onclick={() => onSwitchThread?.(thread.id)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onSwitchThread?.(thread.id);
							}
						}}
					>
						<div class="flex items-start justify-between">
							<div class="flex-1 min-w-0">
								{#if editingThreadId === thread.id}
									<Input
										bind:value={editingTitle}
										class="text-sm font-medium mb-1"
										onkeydown={(e) => {
											if (e.key === 'Enter') {
												saveEdit();
											} else if (e.key === 'Escape') {
												cancelEdit();
											}
										}}
										onclick={(e) => e.stopPropagation()}
									/>
									<div class="flex gap-1 mt-1">
										<Button size="sm" variant="ghost" onclick={saveEdit}>Save</Button>
										<Button size="sm" variant="ghost" onclick={cancelEdit}>Cancel</Button>
									</div>
								{:else}
									<h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
										{thread.title}
									</h4>
									
									<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
										<span>{getThreadMessageCount(thread.id)} messages</span>
										<span>•</span>
										<span>{getThreadLastActivity(thread)}</span>
									</div>
									
									<div class="flex items-center gap-1 mt-1">
										<Users class="h-3 w-3" />
										<span class="text-xs text-gray-500 dark:text-gray-400">
											{formatParticipantCount(thread.participants.length)}
										</span>
									</div>
								{/if}
							</div>

							{#if editingThreadId !== thread.id}
								<DropdownMenu>
									<DropdownMenuTrigger asChild let:builder>
										<Button
											builders={[builder]}
											variant="ghost"
											size="icon"
											class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
											onclick={(e) => e.stopPropagation()}
										>
											<MoreVertical class="h-3 w-3" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onclick={() => startEditing(thread)}>
											<Edit3 class="h-3 w-3 mr-2" />
											Rename
										</DropdownMenuItem>
										<DropdownMenuItem
											class="text-red-600 dark:text-red-400"
											onclick={() => onDeleteThread?.(thread.id)}
										>
											<Trash2 class="h-3 w-3 mr-2" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							{/if}
						</div>

						{#if thread.id === activeThreadId}
							<Badge variant="secondary" class="mt-2 text-xs">
								Active
							</Badge>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
