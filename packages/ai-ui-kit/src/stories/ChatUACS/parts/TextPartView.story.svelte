<script lang="ts">
  import type { Meta, StoryObj, Template } from '@storybook/svelte';
  import TextPartView from '$lib/components/ChatUACS/parts/TextPartView.svelte';
  import type { TextPart } from '$lib/schemas/uacs.schema';

  const meta = {
    title: 'ChatUACS/Parts/TextPartView',
    component: TextPartView,
    tags: ['autodocs'],
    argTypes: {
      part: { control: 'object', description: 'The UACS TextPart object' },
    },
  } satisfies Meta<TextPartView>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  export const PlainText: Story = {
    args: {
      part: {
        type: 'text',
        text: 'This is a plain text string.\nIt can have multiple lines.\n\nAnd paragraphs.',
        format: 'plain',
      },
    },
  };

  export const MarkdownText: Story = {
    args: {
      part: {
        type: 'text',
        text: "# Markdown Header\n\nThis is **bold text**, _italic text_, and `inline code`.\n\n- List item 1\n- List item 2\n\n[A link to example.com](https://example.com)\n\n```javascript\nconsole.log('Hello, Markdown!');\n```\n> A blockquote example.",
        format: 'markdown',
      },
    },
  };

  export const DefaultFormatIsMarkdown: Story = {
     args: {
      part: {
        type: 'text',
        text: "This text has no `format` specified, so it should default to **markdown**.",
      },
    },
  };

  export const EmptyText: Story = {
    args: {
      part: {
        type: 'text',
        text: '',
      },
    },
  };

  export const NullText: Story = {
    args: {
      part: {
        type: 'text',
        text: null as any, // To test null handling
      },
    },
  };
</script>

<Template let:args>
  <div class="p-4 border rounded-md max-w-xl">
    <TextPartView {...args} />
  </div>
</Template>
