<script>
  /**
	 * Svelte DND Action draggable handle example
	 */
	import {dragHandleZone, dragHandle} from "svelte-dnd-action";
	import { flip } from 'svelte/animate';

	let items = [
		{
			id: 1,
			text: 'Item 1',
		},
		{
			id: 2,
			text: 'Item 2',
		},
		{
			id: 3,
			text: 'Item 3',
		},
	];
	const flipDurationMs = 100;
	
	function handleSort(e) {
		items = e.detail.items;
	}
</script>

<style>
	div {
		position: relative;
		height: 1.5em;
		width: 10em;
		text-align: center;
		border: 1px solid black;
		margin: 0.2em;
		padding: 0.3em;
	}
	.handle {
		position: absolute;
		right: 0;
		width: 1em;
		height: 0.5em;
		background-color: grey;
	}
</style>

<h3>
	 Drag Handles
</h3>
<p>
	Items can be dragged using the grey handles via mouse, touch or keyboard. The text on the items can be selected without starting a drag
</p>
<hr>
<section
	use:dragHandleZone="{{ items, flipDurationMs }}"
	on:consider="{handleSort}"
	on:finalize="{handleSort}"
>
	{#each items as item (item.id)}
		<div animate:flip="{{ duration: flipDurationMs }}">
			<div use:dragHandle aria-label="drag-handle for {item.text}" class="handle" 
			/>
			<span>{item.text}</span>
  	</div>
	{/each}
</section>