<script lang="ts">
	// Lucide icons
	import Type from "lucide-svelte/icons/type";
	import Shapes from "lucide-svelte/icons/shapes";
	import Image from "lucide-svelte/icons/image";
	import Layers from "lucide-svelte/icons/layers";
	import Palette from "lucide-svelte/icons/palette";
	import Upload from "lucide-svelte/icons/upload";
	import Settings from "lucide-svelte/icons/settings";
	import FileText from "lucide-svelte/icons/file-text";

	let { activeTab = $bindable("shapes") }: { activeTab: string } = $props();

	const tabs = [
		{ id: "text", label: "Text", icon: Type },
		{ id: "shapes", label: "Shapes", icon: Shapes },
		{ id: "images", label: "Images", icon: Image },
		{ id: "layers", label: "Layers", icon: Layers },
		{ id: "background", label: "Background", icon: Palette },
		{ id: "upload", label: "Upload", icon: Upload },
		{ id: "templates", label: "Templates", icon: FileText },
		{ id: "settings", label: "Settings", icon: Settings },
	];

	function tabChange(tabId: string) {
		activeTab = tabId;
	}
</script>

<div class="sidebar-nav">
	<div class="sidebar-tabs">
		{#each tabs as tab}
			<button
				type="button"
				class="sidebar-tab"
				class:active={activeTab === tab.id}
				onclick={() => tabChange(tab.id)}
				aria-label={`Select ${tab.label} tab`}
				title={tab.label}
			>
				<div class="tab-icon">
					<svelte:component this={tab.icon} class="w-5 h-5" />
				</div>
				<div class="tab-label">{tab.label}</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.sidebar-nav {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: hsl(var(--background));
		border-right: 1px solid hsl(var(--border));
		width: 80px;
		overflow: hidden;
	}

	.sidebar-tabs {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px 4px;
	}

	.sidebar-tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8px 4px;
		cursor: pointer;
		color: hsl(var(--muted-foreground));
		transition: all 0.2s ease;
		border-radius: 6px;
		border: none;
		background: none;
		min-height: 60px;
	}

	.sidebar-tab:hover {
		background-color: hsl(var(--accent));
		color: hsl(var(--accent-foreground));
	}

	.sidebar-tab.active {
		background-color: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	.tab-icon {
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-label {
		font-size: 0.7rem;
		text-align: center;
		line-height: 1;
		font-weight: 500;
	}
</style>
