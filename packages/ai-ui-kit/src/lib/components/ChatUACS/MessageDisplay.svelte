<script lang="ts">
  import type { Message, ContentPart } from '$lib/schemas/uacs.schema';
  import ActorDisplay from './ActorDisplay.svelte';
  import { SvelteComponent } from 'svelte';

  // Dynamic imports for part components
  import TextPartView from './parts/TextPartView.svelte';
  import ImagePartView from './parts/ImagePartView.svelte';
  import AudioPartView from './parts/AudioPartView.svelte';
  import VideoPartView from './parts/VideoPartView.svelte';
  import FilePartView from './parts/FilePartView.svelte';
  // import ToolCallPartView from './parts/ToolCallPartView.svelte'; // Future step
  // import ToolResultPartView from './parts/ToolResultPartView.svelte'; // Future step
  // import StructuredDataPartView from './parts/StructuredDataPartView.svelte'; // Future step

  export let message: Message;

  // Map content part types to their corresponding Svelte components
  const partComponentMap: Record<string, typeof SvelteComponent<any>> = {
    text: TextPartView,
    image: ImagePartView,
    audio: AudioPartView,
    video: VideoPartView,
    file: FilePartView,
    // tool_call: ToolCallPartView,
    // tool_result: ToolResultPartView,
    // structured_data: StructuredDataPartView,
    // Add other part types here as they are implemented
  };

  const getComponentForPart = (part: ContentPart) => {
    return partComponentMap[part.type] || null;
  };
</script>

<div class="message-display-item mb-4 p-3 border rounded-md shadow-sm" id="message-{message.message_id}">
  <div class="message-header flex justify-between items-center mb-2">
    <ActorDisplay actor={message.actor} />
    <span class="timestamp text-xs text-muted-foreground">
      {new Date(message.timestamp).toLocaleTimeString()}
    </span>
  </div>

  <div class="message-content space-y-1"> {/* Reduced space-y for tighter packing of parts */}
    {#each message.content as part (part.type + '-' + (part.id || part.tool_call_id || Math.random().toString(36).slice(2)))}
      {@const PartComponent = getComponentForPart(part)}
      {#if PartComponent}
        <div class="content-part-wrapper"> {/* No extra padding/border here, let the part component define its own visuals */}
          <svelte:component this={PartComponent} {part} />
        </div>
      {:else}
        <div class="unknown-content-part p-2 border-l-2 border-destructive/50 bg-destructive/10 rounded-sm">
          <p class="font-semibold text-sm text-destructive-foreground">Unknown Part Type: {part.type}</p>
          <pre class="text-xs text-destructive-foreground/80 mt-1">{JSON.stringify(part, null, 2)}</pre>
        </div>
      {/if}
    {/each}
  </div>

  {#if message.metadata}
    <details class="mt-2 text-xs">
      <summary class="cursor-pointer text-muted-foreground">Message Metadata</summary>
      <pre class="bg-muted p-2 rounded-md mt-1">{JSON.stringify(message.metadata, null, 2)}</pre>
    </details>
  {/if}
</div>

<style>
  /* Basic styling, can be enhanced with Tailwind classes directly or here */
  .message-display-item {
    /* Example: Different background for user vs assistant for visual distinction if needed */
    /* background-color: var(--card-background); */
  }
</style>
