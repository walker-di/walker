<script lang="ts">
  import type { FilePart } from '$lib/schemas/uacs.schema';
  // Consider importing an icon library for file types later
  // import { Paperclip } from 'lucide-svelte';

  export let part: FilePart;

  let downloadUrl: string | null = null;
  let fileName: string = 'download'; // Default filename
  let error: string | null = null;

  $: {
    error = null;
    downloadUrl = null;
    fileName = part.media_type?.replace('/', '.') || 'file.dat'; // Basic filename from media_type

    if (part?.source) {
      if (part.source.url) {
        downloadUrl = part.source.url;
        // Try to extract filename from URL
        try {
          const urlPath = new URL(part.source.url).pathname;
          const segments = urlPath.split('/');
          if (segments.length > 0 && segments[segments.length - 1]) {
            fileName = segments[segments.length - 1];
          }
        } catch (e) {
          // Invalid URL, keep default filename
        }
      } else if (part.source.base64) {
        // Create a blob URL for base64 data to make it downloadable
        try {
          const byteCharacters = atob(part.source.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: part.media_type || 'application/octet-stream' });
          downloadUrl = URL.createObjectURL(blob);
          // Note: Blob URLs should be revoked when no longer needed to free resources,
          // but for a download link, it's generally fine until page unload or component destruction.
          // Consider adding `onDestroy(() => { if (downloadUrl && downloadUrl.startsWith('blob:')) URL.revokeObjectURL(downloadUrl); });`
          // if this component instance is long-lived and creates many blob URLs.
        } catch (e) {
          console.error("Error creating blob URL from base64:", e);
          error = "Could not process base64 data for download."
        }
      } else if (part.source.file_id) {
        // No direct download for file_id yet.
      } else {
        error = 'File source is missing a valid url, base64 data, or file_id.';
      }
    } else {
      error = 'File part is missing source information.';
    }
  }

  // Helper to get a user-friendly display for media type
  const getDisplayMediaType = (mimeType: string): string => {
    // Simple common types, can be expanded
    const commonTypes: Record<string, string> = {
      'application/pdf': 'PDF Document',
      'application/zip': 'ZIP Archive',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (DOCX)',
      'application/vnd.ms-excel': 'Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet (XLSX)',
      'text/plain': 'Text File',
      'text/csv': 'CSV File',
    };
    return commonTypes[mimeType] || mimeType;
  }

</script>

<div class="file-part-view my-2 p-3 border rounded-md bg-muted/30 w-full max-w-md">
  <div class="flex items-center space-x-3">
    <!-- Basic File Icon Placeholder (e.g., Paperclip) -->
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text h-8 w-8 text-muted-foreground">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M10 9H8"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
    </svg>

    <div class="flex-grow">
      <p class="font-medium text-sm truncate" title={fileName}>{fileName}</p>
      <p class="text-xs text-muted-foreground">
        {getDisplayMediaType(part.media_type || 'application/octet-stream')}
      </p>
    </div>

    {#if downloadUrl}
      <a
        href={downloadUrl}
        download={fileName}
        class="ml-auto px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Download {fileName}"
      >
        Download
      </a>
    {:else if part?.source?.file_id}
      <span class="ml-auto text-xs text-muted-foreground italic">
        (ID: {part.source.file_id})
      </span>
    {/if}
  </div>

  {#if error}
    <div class="mt-2 text-red-500 text-xs p-1.5 bg-destructive/10 rounded-sm">
      Error: {error}
    </div>
  {/if}
  {#if part?.source?.file_id && !downloadUrl}
    <p class="text-xs text-muted-foreground mt-1.5">
      Direct download for file IDs is not yet supported.
    </p>
  {/if}
</div>
