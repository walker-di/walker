<script lang="ts">
  import type { Meta, StoryObj, Template } from '@storybook/svelte';
  import ConversationContainer from '$lib/components/ChatUACS/ConversationContainer.svelte';
  import type { Conversation } from '$lib/schemas/uacs.schema';

  const meta = {
    title: 'ChatUACS/ConversationContainer',
    component: ConversationContainer,
    tags: ['autodocs'],
    argTypes: {
      conversation: { control: 'object', description: 'The UACS Conversation object' },
    },
  } satisfies Meta<ConversationContainer>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  const sampleTextPart = { type: 'text', text: 'Hello there! This is a simple text message.' };
  const sampleMarkdownPart = { type: 'text', text: 'This is **markdown** with an _italic_ and a [link](https://example.com).' , format: 'markdown'};
  const sampleImagePart = {
    type: 'image',
    source: { url: 'https://via.placeholder.com/150/771796/FFFFFF?Text=ImagePartURL' },
    media_type: 'image/png'
  };
   const sampleImageBase64Part = {
    type: 'image',
    // A small 1x1 red pixel GIF
    source: { base64: 'R0lGODlhAQABAIABAP8AAP///yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' },
    media_type: 'image/gif'
  };
  const sampleAudioPart = {
    type: 'audio',
    // Example audio from MDN docs
    source: { url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3' },
    media_type: 'audio/mpeg'
  };
  const sampleVideoPart = {
    type: 'video',
    // Example video from MDN docs
    source: { url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm' },
    media_type: 'video/webm'
  };
  const sampleFilePart = {
    type: 'file',
    source: { url: 'https://example.com/document.pdf' },
    media_type: 'application/pdf'
  };
   const sampleFileBase64Part = {
    type: 'file',
    // "Hello World" text file
    source: { base64: 'SGVsbG8gV29ybGQh' },
    media_type: 'text/plain'
  };


  const defaultConversation: Conversation = {
    conversation_id: 'conv-storybook-123',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    updated_at: new Date().toISOString(),
    messages: [
      {
        message_id: 'msg-001',
        timestamp: new Date(Date.now() - 3500 * 1000).toISOString(),
        actor: { id: 'user-1', role: 'human', name: 'Alice' },
        content: [sampleTextPart, sampleImagePart],
        metadata: { client: 'storybook-web' }
      },
      {
        message_id: 'msg-002',
        timestamp: new Date(Date.now() - 3400 * 1000).toISOString(),
        actor: { id: 'assistant-alpha', role: 'assistant', name: 'EchoBot' },
        content: [
          { type: 'text', text: 'Hi Alice! I see your image. I can also show markdown:'},
          sampleMarkdownPart
        ],
      },
      {
        message_id: 'msg-003',
        timestamp: new Date(Date.now() - 3300 * 1000).toISOString(),
        actor: { id: 'user-1', role: 'human', name: 'Alice' },
        content: [
          { type: 'text', text: 'Great! How about other media types?'},
        ],
      },
      {
        message_id: 'msg-004',
        timestamp: new Date().toISOString(),
        actor: { id: 'assistant-alpha', role: 'assistant', name: 'EchoBot' },
        content: [
          { type: 'text', text: 'Sure, here are some examples:'},
          sampleAudioPart,
          sampleVideoPart,
          sampleFilePart,
          sampleImageBase64Part,
          sampleFileBase64Part,
          {
            type: 'image',
            source: { file_id: 'file-xyz-789' },
            media_type: 'image/jpeg'
          },
           {
            type: 'file',
            source: { file_id: 'doc-abc-123' },
            media_type: 'application/msword'
          }
        ],
        metadata: { confidence: 0.98 }
      }
    ],
    metadata: { environment: 'storybook', version: '1.0' }
  };

  export const Default: Story = {
    args: {
      conversation: defaultConversation,
    },
  };

  export const EmptyConversation: Story = {
    args: {
      conversation: {
        conversation_id: 'conv-empty-456',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
        metadata: { note: 'This conversation has no messages.'}
      }
    }
  };

  export const ConversationWithSystemMessage: Story = {
    args: {
       conversation: {
        ...defaultConversation,
        conversation_id: 'conv-system-789',
        messages: [
          {
            message_id: 'msg-sys-000',
            timestamp: new Date(Date.now() - 4000 * 1000).toISOString(),
            actor: { id: 'system-default', role: 'system', name: 'System Instructions' },
            content: [{ type: 'text', text: 'You are a helpful assistant. Please be polite.' }],
          },
          ...defaultConversation.messages.slice(0,2) // Add first two messages
        ],
      }
    }
  };

</script>

<Template let:args>
  <ConversationContainer {...args} />
</Template>
