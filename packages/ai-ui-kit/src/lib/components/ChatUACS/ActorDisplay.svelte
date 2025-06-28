<script lang="ts">
  import type { Actor } from '$lib/schemas/uacs.schema'; // Assuming UACS schema will be here

  export let actor: Actor;

  const getRoleColor = (role: Actor['role']) => {
    switch (role) {
      case 'human':
        return 'text-blue-600 dark:text-blue-400';
      case 'assistant':
        return 'text-green-600 dark:text-green-400';
      case 'system':
        return 'text-gray-500 dark:text-gray-400';
      case 'tool':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-foreground';
    }
  };
</script>

<div class="actor-display inline-flex items-center space-x-2">
  {#if actor}
    <span class="actor-name font-semibold {getRoleColor(actor.role)}">
      {actor.name || actor.role.charAt(0).toUpperCase() + actor.role.slice(1)}
    </span>
    <span class="actor-id text-xs text-muted-foreground">(ID: {actor.id})</span>
  {:else}
    <span class="text-red-500">Unknown Actor</span>
  {/if}
</div>
