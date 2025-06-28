<script lang="ts">
  import type { TextPart } from '$lib/schemas/uacs.schema';
  import { onMount } from 'svelte';

  export let part: TextPart;

  import { marked } from 'marked';
  import DOMPurify from 'dompurify'; // For sanitizing HTML output

  export let part: TextPart;

  let renderedHtml = '';

  $: {
    if (part?.text) {
      if (part.format === 'markdown' || part.format === undefined) { // Default to markdown
        // Ensure DOMPurify is used to sanitize HTML from marked
        // Configure marked for GFM breaks and other options if desired
        marked.use({
          gfm: true, // Enable GitHub Flavored Markdown
          breaks: true, // Treat newlines as <br> tags
        });
        const rawHtml = marked.parse(part.text) as string;
        renderedHtml = DOMPurify.sanitize(rawHtml);
      } else { // plain text
        // Basic escaping for plain text to prevent accidental HTML injection
        const escapeHtml = (unsafe: string) =>
          unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        // Wrap plain text in <p> and convert newlines to <br>
        renderedHtml = `<p>${escapeHtml(part.text).replace(/\n/g, '<br>')}</p>`;
      }
    } else {
      renderedHtml = '';
    }
  }
</script>

<div class="text-part-view prose prose-sm max-w-none dark:prose-invert">
  {@html renderedHtml}
</div>

<style>
  /* Tailwind's @tailwindcss/typography plugin provides the 'prose' classes for styling HTML */
  /* Ensure your tailwind.config.js has the typography plugin enabled. */
  /* Add any additional specific styling for TextPartView if needed */
  .text-part-view :global(a) {
    @apply text-primary hover:underline;
  }
  .text-part-view :global(code) {
    @apply bg-muted text-muted-foreground px-1 py-0.5 rounded-sm text-sm;
  }
  .text-part-view :global(strong) {
    @apply font-semibold;
  }
  .text-part-view :global(em) {
    @apply italic;
  }
  .text-part-view :global(ul) {
    @apply list-disc pl-5;
  }
  .text-part-view :global(p) {
    @apply mb-2; /* Ensure paragraphs have some spacing */
  }
   .text-part-view :global(p:last-child) {
    @apply mb-0; /* No margin for the last paragraph within this part */
  }
</style>
