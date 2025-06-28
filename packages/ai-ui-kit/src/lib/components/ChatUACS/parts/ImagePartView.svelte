<script lang="ts">
  import type { ImagePart } from '$lib/schemas/uacs.schema';
  import { onMount, onDestroy } from 'svelte';

  export let part: ImagePart;

  let imageUrl: string | null = null;
  let error: string | null = null;
  let isLoading = true;

  const getDisplayMediaType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) {
      return mimeType.substring('image/'.length).toUpperCase();
    }
    return mimeType;
  }

  $: {
    isLoading = true;
    error = null;
    imageUrl = null; // Reset on part change

    if (part?.source) {
      if (part.source.url) {
        imageUrl = part.source.url;
        isLoading = false; // Assuming URL is directly usable
      } else if (part.source.base64) {
        // Construct data URL for base64 encoded image
        const mediaType = part.media_type || 'image/png'; // Default to PNG if not specified
        imageUrl = `data:${mediaType};base64,${part.source.base64}`;
        isLoading = false;
      } else if (part.source.file_id) {
        // file_id handling: For now, just indicate it's a file_id.
        // Actual fetching from file_id would require an external service/API call.
        // This is out of scope for the initial component.
        isLoading = false;
        // imageUrl = null; // Ensure no old image is shown
        // error = `Image available via file_id: ${part.source.file_id}. Preview not implemented for file_id yet.`;
      } else {
        error = 'Image source is missing a valid url, base64 data, or file_id.';
        isLoading = false;
      }
    } else {
      error = 'Image part is missing source information.';
      isLoading = false;
    }
  }

  const handleImageError = () => {
    error = `Failed to load image from ${part.source.url || 'base64 data'}.`;
    imageUrl = null; // Clear broken image link/icon
    isLoading = false;
  }

  const handleImageLoad = () => {
    isLoading = false;
    error = null;
  }

</script>

<div class="image-part-view my-2 p-2 border rounded-md bg-muted/30 max-w-md">
  {#if isLoading}
    <div class="flex items-center justify-center h-32 text-muted-foreground">
      Loading image...
    </div>
  {:else if imageUrl}
    <img
      src={imageUrl}
      alt="UACS Image Part: {part.media_type || 'image'}"
      class="max-w-full h-auto rounded-sm"
      on:error={handleImageError}
      on:load={handleImageLoad}
    />
    <p class="text-xs text-muted-foreground mt-1">Type: {getDisplayMediaType(part.media_type || 'image/unknown')}</p>
  {:else if part?.source?.file_id}
    <div class="file-id-placeholder p-3 border border-dashed rounded-md text-sm">
      <p>
        Image resource (ID: <span class="font-mono bg-muted px-1 rounded">{part.source.file_id}</span>)
      </p>
      <p class="text-xs text-muted-foreground mt-1">
        Type: {getDisplayMediaType(part.media_type || 'image/unknown')}. Direct preview for file IDs is not yet supported.
      </p>
    </div>
  {:else if error}
    <div class="text-red-500 text-sm p-2 bg-destructive/10 rounded-md">
      Error: {error}
    </div>
  {/if}
</div>
