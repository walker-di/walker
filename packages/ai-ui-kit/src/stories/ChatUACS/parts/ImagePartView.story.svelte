<script lang="ts">
  import type { Meta, StoryObj, Template } from '@storybook/svelte';
  import ImagePartView from '$lib/components/ChatUACS/parts/ImagePartView.svelte';
  import type { ImagePart } from '$lib/schemas/uacs.schema';

  const meta = {
    title: 'ChatUACS/Parts/ImagePartView',
    component: ImagePartView,
    tags: ['autodocs'],
    argTypes: {
      part: { control: 'object', description: 'The UACS ImagePart object' },
    },
  } satisfies Meta<ImagePartView>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  // A small 1x1 red pixel GIF for base64 example
  const base64RedPixelGif = 'R0lGODlhAQABAIABAP8AAP///yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  // A small 1x1 blue pixel PNG for base64 example
  const base64BluePixelPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';


  export const FromUrlPng: Story = {
    args: {
      part: {
        type: 'image',
        source: { url: 'https://via.placeholder.com/300x150/764ABC/FFFFFF?Text=Image+From+URL+(PNG)' },
        media_type: 'image/png',
      },
    },
  };

  export const FromUrlJpg: Story = {
    args: {
      part: {
        type: 'image',
        source: { url: 'https://via.placeholder.com/200x200/2c7be5/FFFFFF?Text=Image+From+URL+(JPG)' },
        media_type: 'image/jpeg',
      },
    },
  };

  export const FromBase64Gif: Story = {
    args: {
      part: {
        type: 'image',
        source: { base64: base64RedPixelGif },
        media_type: 'image/gif',
      },
    },
  };

  export const FromBase64Png: Story = {
    args: {
      part: {
        type: 'image',
        source: { base64: base64BluePixelPng },
        media_type: 'image/png',
      },
    },
  };

  export const FromFileId: Story = {
    args: {
      part: {
        type: 'image',
        source: { file_id: 'file-id-placeholder-12345' },
        media_type: 'image/jpeg',
      },
    },
  };

  export const InvalidUrl: Story = {
    args: {
      part: {
        type: 'image',
        source: { url: 'https://example.com/nonexistent-image.jpg' },
        media_type: 'image/jpeg',
      },
    },
  };

  export const MissingSource: Story = {
    args: {
      part: {
        type: 'image',
        source: {}, // Invalid: missing one of url, base64, file_id
        media_type: 'image/gif',
      } as any, // Cast to any to allow invalid source for testing
    },
  };

  export const NoSourceProvided: Story = {
     args: {
      part: {
        type: 'image',
        // source is completely missing
        media_type: 'image/webp',
      } as any,
    },
  };
</script>

<Template let:args>
  <div class="p-4 border rounded-md max-w-md">
    <ImagePartView {...args} />
  </div>
</Template>
