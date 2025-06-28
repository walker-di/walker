<script>
	/*
		This is a basic, quick and dirty implementation of multi-drag to illustrate how it can be done.
		It is not perfect and you will need to adopt it to your usecase.
		You will need to override all of the aria alerts using the "autoAriaDisabled" option and manual wiring (see in the lib's README)
		You will need to decide what to do with touch...
	*/
	import List from './List.svelte';
	let items1 = [
		{id:"1", title: 'I'},
		{id:"2", title: 'Am'},
		{id:"3", title: 'Yoda'}
	];
	let items2 = [
		{id:"4", title: 'Luke'},
		{id:"5", title: 'Skywalker'}
	];
	
</script>
<h4>
	svelte-dnd-action multi drag POC (incomplete - see comments in the code)
</h4>
<ul>
	<li>To multi drag with the mouse use <code>ctrl + click</code> or <code>cmd + click</code> to add items before dragging.</li>
	<li>To multi drag with keyboard, tab to items and use <code>ctrl + shift</code> or <code>cmd + shift</code> to add items before entering "drag mode" by hitting <code>space</code></li>
</ul>
<hr>
<List items={items1}/>
<hr>
<List items={items2}/>

