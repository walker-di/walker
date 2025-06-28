<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar/index.js";
	import type { TypingIndicator } from "../types/chat.js";

	interface Props {
		indicators: TypingIndicator[];
		showAvatars?: boolean;
		maxVisible?: number;
	}

	let {
		indicators = [],
		showAvatars = true,
		maxVisible = 3
	}: Props = $props();

	function getDisplayText(indicators: TypingIndicator[]): string {
		if (indicators.length === 0) return '';
		
		const visibleIndicators = indicators.slice(0, maxVisible);
		const names = visibleIndicators.map(i => i.participant_name);
		
		if (indicators.length === 1) {
			return `${names[0]} is typing...`;
		} else if (indicators.length === 2) {
			return `${names[0]} and ${names[1]} are typing...`;
		} else if (indicators.length <= maxVisible) {
			const lastIndex = names.length - 1;
			const firstNames = names.slice(0, lastIndex).join(', ');
			return `${firstNames}, and ${names[lastIndex]} are typing...`;
		} else {
			const extraCount = indicators.length - maxVisible;
			const firstNames = names.join(', ');
			return `${firstNames}, and ${extraCount} other${extraCount > 1 ? 's' : ''} are typing...`;
		}
	}

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

{#if indicators.length > 0}
	<div class="flex items-center gap-3 px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
		{#if showAvatars}
			<div class="flex -space-x-2">
				{#each indicators.slice(0, maxVisible) as indicator (indicator.participant_id)}
					<Avatar class="h-6 w-6 border-2 border-white dark:border-gray-900">
						<AvatarFallback class="text-xs bg-gray-200 dark:bg-gray-700">
							{getInitials(indicator.participant_name)}
						</AvatarFallback>
					</Avatar>
				{/each}
			</div>
		{/if}

		<div class="flex items-center gap-2">
			<span>{getDisplayText(indicators)}</span>
			
			<!-- Animated typing dots -->
			<div class="flex space-x-1">
				<div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
				<div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
				<div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes bounce {
		0%, 80%, 100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}
	
	.animate-bounce {
		animation: bounce 1.4s infinite ease-in-out both;
	}
</style>
