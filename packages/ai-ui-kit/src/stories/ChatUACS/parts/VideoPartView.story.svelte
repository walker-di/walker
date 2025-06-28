<script lang="ts">
  import type { Meta, StoryObj, Template } from '@storybook/svelte';
  import VideoPartView from '$lib/components/ChatUACS/parts/VideoPartView.svelte';
  import type { VideoPart } from '$lib/schemas/uacs.schema';

  const meta = {
    title: 'ChatUACS/Parts/VideoPartView',
    component: VideoPartView,
    tags: ['autodocs'],
    argTypes: {
      part: { control: 'object', description: 'The UACS VideoPart object' },
    },
  } satisfies Meta<VideoPartView>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  // Example video from MDN docs (Creative Commons)
  const exampleVideoUrlWebm = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';
  const exampleVideoUrlMp4 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  // Tiny base64 MP4 video (e.g., 1-second black screen) - very hard to generate a truly minimal valid one.
  // For storybook, using URLs is more reliable for demonstrating video.
  // A placeholder for base64 concept, but actual rendering might depend on browser support for tiny base64 videos.
  // This base64 string is NOT a valid video and is for placeholder purposes only.
  // A real tiny video base64 would be much longer.
  const placeholderBase64Video = 'AAAAHGZ0eXBtcDQyAAAAAGlzb21tcDQyAARtZGF0';

  export const FromUrlWebm: Story = {
    args: {
      part: {
        type: 'video',
        source: { url: exampleVideoUrlWebm },
        media_type: 'video/webm',
      },
    },
  };

  export const FromUrlMp4: Story = {
    args: {
      part: {
        type: 'video',
        source: { url: exampleVideoUrlMp4 },
        media_type: 'video/mp4',
      },
    },
  };

  export const FromBase64Placeholder: Story = {
    args: {
      part: {
        type: 'video',
        source: { base64: placeholderBase64Video }, // This will likely fail to play
        media_type: 'video/mp4',
      },
    },
    parameters: {
      docs: {
        description: {
          story: 'This story uses a placeholder base64 string that is NOT a valid video. It demonstrates the base64 source handling path, but the video player will likely show an error. A real base64 encoded video would be very long.'
        }
      }
    }
  };

  export const FromFileId: Story = {
    args: {
      part: {
        type: 'video',
        source: { file_id: 'video-file-id-101112' },
        media_type: 'video/quicktime',
      },
    },
  };

  export const InvalidUrl: Story = {
    args: {
      part: {
        type: 'video',
        source: { url: 'https://example.com/nonexistent-video.mp4' },
        media_type: 'video/mp4',
      },
    },
  };

  export const MissingSourceDetails: Story = {
    args: {
      part: {
        type: 'video',
        source: {}, // Invalid source
        media_type: 'video/x-msvideo',
      } as any,
    },
  };
</script>

<Template let:args>
  <div class="p-4 border rounded-md max-w-lg">
    <VideoPartView {...args} />
  </div>
</Template>
