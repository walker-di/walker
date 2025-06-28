<script lang="ts">
  import type { Meta, StoryObj, Template } from '@storybook/svelte';
  import MessageDisplay from '$lib/components/ChatUACS/MessageDisplay.svelte';
  import type { Message } from '$lib/schemas/uacs.schema';

  const meta = {
    title: 'ChatUACS/MessageDisplay',
    component: MessageDisplay,
    tags: ['autodocs'],
    argTypes: {
      message: { control: 'object', description: 'The UACS Message object' },
    },
  } satisfies Meta<MessageDisplay>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  const baseTime = Date.now();

  const humanActor = { id: 'user-abc', role: 'human', name: 'User One' };
  const assistantActor = { id: 'bot-xyz', role: 'assistant', name: 'AI Assistant' };
  const systemActor = { id: 'sys-001', role: 'system', name: 'System' };
  const toolActor = { id: 'tool-weather', role: 'tool', name: 'Weather Lookup' };

  export const TextMessageFromHuman: Story = {
    args: {
      message: {
        message_id: 'msg-human-text-001',
        timestamp: new Date(baseTime - 5000).toISOString(),
        actor: humanActor,
        content: [{ type: 'text', text: 'Hello AI, how are you today?' }],
        metadata: { sentiment: 'positive' }
      },
    },
  };

  export const MarkdownMessageFromAssistant: Story = {
    args: {
      message: {
        message_id: 'msg-assistant-md-002',
        timestamp: new Date(baseTime - 4000).toISOString(),
        actor: assistantActor,
        content: [
          {
            type: 'text',
            text: "I'm doing well, thanks for asking! Here's a list:\n- Item 1\n- Item 2\n\nAnd a `code snippet`.",
            format: 'markdown'
          }
        ],
      },
    },
  };

  export const ImageMessage: Story = {
    args: {
      message: {
        message_id: 'msg-image-003',
        timestamp: new Date(baseTime - 3000).toISOString(),
        actor: humanActor,
        content: [
          { type: 'text', text: "Check out this cool image:"},
          {
            type: 'image',
            source: { url: 'https://via.placeholder.com/300x200/2c7be5/ffffff?Text=Cool+Image' },
            media_type: 'image/png'
          }
        ],
      },
    },
  };

  export const MultiPartMessage: Story = {
    args: {
      message: {
        message_id: 'msg-multipart-004',
        timestamp: new Date(baseTime - 2000).toISOString(),
        actor: assistantActor,
        content: [
          { type: 'text', text: "Here's an image, some audio, a video, and a file." },
          {
            type: 'image',
            // A small 1x1 blue pixel GIF
            source: { base64: 'R0lGODlhAQABAIABAAD/AP///yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' },
            media_type: 'image/gif'
          },
          {
            type: 'audio',
            source: { url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3' },
            media_type: 'audio/mpeg'
          },
          {
            type: 'video',
            source: { url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm' },
            media_type: 'video/webm'
          },
          {
            type: 'file',
            source: { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            media_type: 'application/pdf'
          },
          {
            type: 'file',
            source: { file_id: 'file-datasheet-001' },
            media_type: 'application/vnd.ms-excel'
          }
        ],
      },
    },
  };

  export const SystemMessage: Story = {
    args: {
      message: {
        message_id: 'msg-system-005',
        timestamp: new Date(baseTime - 1000).toISOString(),
        actor: systemActor,
        content: [{ type: 'text', text: 'System initiated. User preferences loaded.' }],
      },
    },
  };

  export const ToolMessagePlaceholder: Story = {
    args: {
      message: {
        message_id: 'msg-tool-006',
        timestamp: new Date(baseTime).toISOString(),
        actor: toolActor,
        // ToolCallPart and ToolResultPart views are not yet implemented, so they will show as "Unknown"
        content: [
            {
                type: 'tool_call',
                id: 'toolcall-123',
                name: 'get_stock_price',
                arguments: { symbol: 'ACME' }
            } as any // Cast to any as ToolCallPart is not fully typed yet in this context for story
        ],
      },
    },
  };

 export const MessageWithUnknownPart: Story = {
    args: {
      message: {
        message_id: 'msg-unknown-007',
        timestamp: new Date(baseTime).toISOString(),
        actor: humanActor,
        content: [
          { type: 'text', text: 'This message has a part type we do not recognize yet.' },
          { type: 'future_gadget', data: { setting: 'on' } } as any // Unknown part
        ],
      },
    },
  };


</script>

<Template let:args>
  <div class="p-4 max-w-2xl">
    <MessageDisplay {...args} />
  </div>
</Template>
