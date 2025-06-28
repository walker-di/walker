<script lang="ts">
  import type { VideoPart } from '$lib/schemas/uacs.schema';

  export let part: VideoPart;

  let videoSrc: string | null = null;
  let error: string | null = null;
  let isLoading = true;

  $: {
    isLoading = true;
    error = null;
    videoSrc = null; // Reset on part change

    if (part?.source) {
      if (part.source.url) {
        videoSrc = part.source.url;
        isLoading = false;
      } else if (part.source.base64) {
        const mediaType = part.media_type || 'video/mp4'; // Default media type
        videoSrc = `data:${mediaType};base64,${part.source.base64}`;
        isLoading = false;
      } else if (part.source.file_id) {
        isLoading = false;
        // error = `Video available via file_id: ${part.source.file_id}. Playback from file_id not implemented.`;
      } else {
        error = 'Video source is missing a valid url, base64 data, or file_id.';
        isLoading = false;
      }
    } else {
      error = 'Video part is missing source information.';
      isLoading = false;
    }
  }

  const getDisplayMediaType = (mimeType: string): string => {
    if (mimeType.startsWith('video/')) {
      return mimeType.substring('video/'.length).toUpperCase();
    }
    return mimeType;
  }
</script>

<div class="video-part-view my-2 p-3 border rounded-md bg-muted/30 w-full max-w-lg">
  {#if isLoading}
    <p class="text-muted-foreground text-sm">Loading video...</p>
  {:else if videoSrc}
    <video controls src={videoSrc} class="w-full rounded" playsinline>
      Your browser does not support the video tag.
    </video>
    <p class="text-xs text-muted-foreground mt-1">Type: {getDisplayMediaType(part.media_type || 'video/unknown')}</p>
  {:else if part?.source?.file_id}
    <div class="file-id-placeholder p-3 border border-dashed rounded-md text-sm">
      <p>
        Video resource (ID: <span class="font-mono bg-muted px-1 rounded">{part.source.file_id}</span>)
      </p>
      <p class="text-xs text-muted-foreground mt-1">
        Type: {getDisplayMediaType(part.media_type || 'video/unknown')}. Direct playback for file IDs is not yet supported.
      </p>
    </div>
  {:else if error}
    <div class="text-red-500 text-sm p-2 bg-destructive/10 rounded-md">
      Error: {error}
    </div>
  {/if}
</div>
