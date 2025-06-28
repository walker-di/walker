<script lang="ts">
  import type { Meta, StoryObj, Template } from '@storybook/svelte';
  import AudioPartView from '$lib/components/ChatUACS/parts/AudioPartView.svelte';
  import type { AudioPart } from '$lib/schemas/uacs.schema';

  const meta = {
    title: 'ChatUACS/Parts/AudioPartView',
    component: AudioPartView,
    tags: ['autodocs'],
    argTypes: {
      part: { control: 'object', description: 'The UACS AudioPart object' },
    },
  } satisfies Meta<AudioPartView>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  // Example audio from MDN docs (Creative Commons)
  const exampleAudioUrlMp3 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
  const exampleAudioUrlOgg = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.ogg';

  // Tiny base64 WAV file (silent, 100ms) - for testing base64 functionality
  // RIFF....WAVEfmt DAAAAAEAAQAAeAAgAAAAAgAEAAABAAgAZGF0YQQAAAAA
  const base64TinyWav = 'UklGRgwAAABXQVZFZm10IBAAAAABAAEAACAAAAAgAAAAAgAEAAABAAgAZGF0YQQAAAAA';
  // Tiny base64 MP3 file (very short tone) - for testing base64 functionality (actual content may vary)
  // This is a placeholder and might not be a valid MP3. For real testing, a known small MP3 base64 is needed.
  // For storybook, a valid URL is more reliable for base64 audio if a true tiny base64 audio is hard to embed.
  // Let's use a data URI with a known valid, short base64 if possible, or stick to URL for robust base64 demo.
  // For now, we'll use the WAV as it's simple and small.

  export const FromUrlMp3: Story = {
    args: {
      part: {
        type: 'audio',
        source: { url: exampleAudioUrlMp3 },
        media_type: 'audio/mpeg',
      },
    },
  };

  export const FromUrlOgg: Story = {
    args: {
      part: {
        type: 'audio',
        source: { url: exampleAudioUrlOgg },
        media_type: 'audio/ogg',
      },
    },
  };

  export const FromBase64Wav: Story = {
    args: {
      part: {
        type: 'audio',
        source: { base64: base64TinyWav },
        media_type: 'audio/wav',
      },
    },
  };

  export const FromFileId: Story = {
    args: {
      part: {
        type: 'audio',
        source: { file_id: 'audio-file-id-67890' },
        media_type: 'audio/aac',
      },
    },
  };

  export const InvalidUrl: Story = {
    args: {
      part: {
        type: 'audio',
        source: { url: 'https://example.com/nonexistent-audio.mp3' },
        media_type: 'audio/mpeg',
      },
    },
  };

  export const MissingSourceDetails: Story = {
    args: {
      part: {
        type: 'audio',
        source: {}, // Invalid source
        media_type: 'audio/flac',
      } as any,
    },
  };
</script>

<Template let:args>
  <div class="p-4 border rounded-md max-w-md">
    <AudioPartView {...args} />
  </div>
</Template>
