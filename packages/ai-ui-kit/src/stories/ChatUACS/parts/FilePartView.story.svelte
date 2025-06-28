<script lang="ts">
  import type { Meta, StoryObj, Template } from '@storybook/svelte';
  import FilePartView from '$lib/components/ChatUACS/parts/FilePartView.svelte';
  import type { FilePart } from '$lib/schemas/uacs.schema';

  const meta = {
    title: 'ChatUACS/Parts/FilePartView',
    component: FilePartView,
    tags: ['autodocs'],
    argTypes: {
      part: { control: 'object', description: 'The UACS FilePart object' },
    },
  } satisfies Meta<FilePartView>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  // Base64 for a simple text file "Hello Storybook!"
  const textFileBase64 = 'SGVsbG8gU3Rvcnlib29rIQ==';
  // Base64 for a simple JSON file {"type": "file", "content": "example"}
  const jsonFileBase64 = 'eyJ0eXBlIjogImZpbGUiLCAiY29udGVudCI6ICJleGFtcGxlIn0=';

  export const FromUrlPdf: Story = {
    args: {
      part: {
        type: 'file',
        // Using a known public PDF for testing
        source: { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        media_type: 'application/pdf',
      },
    },
  };

  export const FromUrlTextFileWithQuery: Story = {
    args: {
      part: {
        type: 'file',
        source: { url: 'https://example.com/path/to/my_document.txt?version=2&auth=temp' },
        media_type: 'text/plain',
      },
    },
  };

  export const FromBase64Text: Story = {
    args: {
      part: {
        type: 'file',
        source: { base64: textFileBase64 },
        media_type: 'text/plain',
      },
    },
  };

  export const FromBase64Json: Story = {
    args: {
      part: {
        type: 'file',
        source: { base64: jsonFileBase64 },
        media_type: 'application/json',
      },
    },
  };

  export const FromFileIdDocx: Story = {
    args: {
      part: {
        type: 'file',
        source: { file_id: 'file-doc-id-001' },
        media_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    },
  };

   export const FromFileIdZip: Story = {
    args: {
      part: {
        type: 'file',
        source: { file_id: 'archive-id-007' },
        media_type: 'application/zip',
      },
    },
  };

  export const UnknownMediaType: Story = {
    args: {
      part: {
        type: 'file',
        source: { url: 'https://example.com/somefile.customext' },
        media_type: 'application/x-custom-format',
      },
    },
  };

  export const MissingSourceDetails: Story = {
    args: {
      part: {
        type: 'file',
        source: {}, // Invalid source
        media_type: 'text/csv',
      } as any,
    },
  };
</script>

<Template let:args>
  <div class="p-4 border rounded-md max-w-md">
    <FilePartView {...args} />
  </div>
</Template>
