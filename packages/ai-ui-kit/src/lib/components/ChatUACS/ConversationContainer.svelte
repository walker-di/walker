<script lang="ts">
  import type { Conversation } from '$lib/schemas/uacs.schema'; // Assuming UACS schema will be here
  import MessageDisplay from './MessageDisplay.svelte';

  export let conversation: Conversation;

  // TODO: Eventually fetch or receive conversation data
  // For now, expect it as a prop
</script>

<div class="conversation-container p-4 border rounded-lg shadow-sm bg-background text-foreground">
  {#if conversation?.conversation_id}
    <div class="conversation-meta mb-4 text-sm text-muted-foreground">
      <p>Conversation ID: {conversation.conversation_id}</p>
      <p>Created: {new Date(conversation.created_at).toLocaleString()}</p>
      <p>Last Updated: {new Date(conversation.updated_at).toLocaleString()}</p>
      {#if conversation.metadata}
        <details class="mt-2">
          <summary>Metadata</summary>
          <pre class="text-xs bg-muted p-2 rounded-md mt-1">{JSON.stringify(conversation.metadata, null, 2)}</pre>
        </details>
      {/if}
    </div>
  {/if}

  <div class="messages-list space-y-4">
    {#if conversation?.messages && conversation.messages.length > 0}
      {#each conversation.messages as message (message.message_id)}
        <MessageDisplay {message} />
      {/each}
    {:else}
      <p class="text-muted-foreground">No messages in this conversation yet.</p>
    {/if}
  </div>
</div>

<style>
  /* Basic styling, can be enhanced with Tailwind classes directly or here */
  .conversation-container {
    max-width: 800px;
    margin: auto;
  }
</style>
