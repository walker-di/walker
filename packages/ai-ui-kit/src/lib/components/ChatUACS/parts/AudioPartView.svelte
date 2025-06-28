<script lang="ts">
  import type { AudioPart } from '$lib/schemas/uacs.schema';

  export let part: AudioPart;

  let audioSrc: string | null = null;
  let error: string | null = null;
  let isLoading = true; // Can be used if preloading/checking is needed

 $: {
    isLoading = true;
    error = null;
    audioSrc = null; // Reset on part change

    if (part?.source) {
      if (part.source.url) {
        audioSrc = part.source.url;
        isLoading = false;
      } else if (part.source.base64) {
        const mediaType = part.media_type || 'audio/mpeg'; // Default media type
        audioSrc = `data:${mediaType};base64,${part.source.base64}`;
        isLoading = false;
      } else if (part.source.file_id) {
        isLoading = false;
        // error = `Audio available via file_id: ${part.source.file_id}. Playback from file_id not implemented.`;
      } else {
        error = 'Audio source is missing a valid url, base64 data, or file_id.';
        isLoading = false;
      }
    } else {
      error = 'Audio part is missing source information.';
      isLoading = false;
    }
  }

  const getDisplayMediaType = (mimeType: string): string => {
    if (mimeType.startsWith('audio/')) {
      return mimeType.substring('audio/'.length).toUpperCase();
    }
    return mimeType;
  }

</script>

<div class="audio-part-view my-2 p-3 border rounded-md bg-muted/30 w-full max-w-md">
  {#if isLoading}
    <p class="text-muted-foreground text-sm">Loading audio...</p>
  {:else if audioSrc}
    <audio controls src={audioSrc} class="w-full">
      Your browser does not support the audio element.
    </audio>
    <p class="text-xs text-muted-foreground mt-1">Type: {getDisplayMediaType(part.media_type || 'audio/unknown')}</p>
  {:else if part?.source?.file_id}
    <div class="file-id-placeholder p-3 border border-dashed rounded-md text-sm">
      <p>
        Audio resource (ID: <span class="font-mono bg-muted px-1 rounded">{part.source.file_id}</span>)
      </p>
      <p class="text-xs text-muted-foreground mt-1">
        Type: {getDisplayMediaType(part.media_type || 'audio/unknown')}. Direct playback for file IDs is not yet supported.
      </p>
    </div>
  {:else if error}
    <div class="text-red-500 text-sm p-2 bg-destructive/10 rounded-md">
      Error: {error}
    </div>
  {/if}
</div>
