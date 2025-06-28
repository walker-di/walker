<script lang="ts">
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(0),
		max = 100,
		class: className,
		...restProps
	}: ProgressPrimitive.RootProps = $props();

	let percentage = $derived(Math.min(Math.max((value / max) * 100, 0), 100));
</script>

<ProgressPrimitive.Root
	bind:ref
	{value}
	{max}
	data-slot="progress"
	class={cn(
		"relative h-2 w-full overflow-hidden rounded-full bg-secondary",
		className
	)}
	{...restProps}
>
	<div
		class="h-full w-full flex-1 bg-primary transition-all"
		style="transform: translateX(-{100 - percentage}%)"
	></div>
</ProgressPrimitive.Root>
