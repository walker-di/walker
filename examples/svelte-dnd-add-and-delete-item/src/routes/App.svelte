<style>
	button {
		display: block;
	}
	div {
		height: 1.5em;
		width: 10em;
		text-align: center;
		border: 1px solid black;
		margin: 0.2em;
		padding: 0.3em;
	}
	.hi {
		animation: fadeIn 900ms ease;
	}
	.bye {
		animation: fadeOut 900ms ease;
	}
  @keyframes fadeIn {
	  0% {opacity:0;}
	  100% {opacity:1;}
  }
	@keyframes fadeOut {
	0% {opacity:1;}
	100% {opacity:0;}
}
</style>
<script>
	import {dndzone} from 'svelte-dnd-action';
  let items = [
		{id:1, title: 'I'},
		{id:2, title: 'Am'},
		{id:3, title: 'Yoda'}
	];
	$: isTransitioning = !!items.find(i => i.isByeBye || i.isHi);
	function handleSort(e) {
		items = e.detail.items;
	}
	function addItem() {
		const id = Math.round(Math.random() * 10000);
		const newItem = {id , title: 'new item', isHi: true};
		items.push(newItem);
		items = [...items];
		window.setTimeout(() => {
			delete(items.find(i => i.id === id).isHi);
			items = [...items];
		}, 900);
	}
	function deleteItem() {
		if (!items.length) {
			return;
		}
		const notInDeletion = items.filter(i => !i.isByeBye);
		const id = notInDeletion[notInDeletion.length - 1].id;
		items[notInDeletion.length - 1].isByeBye = true;
		window.setTimeout(() => {
			items = items.filter(i => (i.id !== id));
		}, 900);
	}
</script>
<section use:dndzone={{items, dragDisabled: isTransitioning, dropFromOthersDisabled: isTransitioning}} on:consider={handleSort} on:finalize={handleSort}>
	{#each items as item(item.id)}
		<div class={item.isByeBye? 'bye' : item.isHi? 'hi' : ''}>
			{item.title}	
		</div>
	{/each}
</section>
<button on:click={addItem}>
	Add item
</button>
<button on:click={deleteItem}>
	Delete item
</button>