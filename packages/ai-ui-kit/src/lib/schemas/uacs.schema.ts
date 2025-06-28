// Based on the Universal AI Conversation Schema (UACS)
// from packages/ai-ui-kit/docs/universal-abstraction-multi-modal-chat.md

export interface Conversation {
  conversation_id: string; // uuid format
  created_at: string; // date-time format
  updated_at: string; // date-time format
  messages: Message[];
  metadata?: Record<string, any>;
}

export interface Message {
  message_id: string;
  timestamp: string; // date-time format
  actor: Actor;
  content: ContentPart[];
  metadata?: Record<string, any>;
}

export interface Actor {
  id: string;
  role: 'human' | 'assistant' | 'system' | 'tool';
  name?: string;
}

// Discriminated Union for ContentPart
export type ContentPart =
  | TextPart
  | ImagePart
  | VideoPart
  | AudioPart
  | FilePart
  | ToolCallPart
  | ToolResultPart
  | StructuredDataPart
  | RequestedResponseFormatPart;

export interface BaseContentPart {
  type: string;
  // Common fields can be added here if any in future
}

export interface TextPart extends BaseContentPart {
  type: 'text';
  text: string;
  format?: 'markdown' | 'plain'; // default: 'markdown'
}

export interface MediaSource {
  base64?: string; // contentEncoding: 'base64'
  url?: string; // format: 'uri'
  file_id?: string;
  // Must contain exactly one of the above
}

export interface ImagePart extends BaseContentPart {
  type: 'image';
  source: MediaSource;
  media_type: string; // e.g., 'image/jpeg', 'image/png' (pattern: "^image/")
}

export interface VideoPart extends BaseContentPart {
  type: 'video';
  source: MediaSource;
  media_type: string; // e.g., 'video/mp4' (pattern: "^video/")
}

export interface AudioPart extends BaseContentPart {
  type: 'audio';
  source: MediaSource;
  media_type: string; // e.g., 'audio/mpeg' (pattern: "^audio/")
}

export interface FilePart extends BaseContentPart {
  type: 'file';
  source: MediaSource;
  media_type: string; // Any IANA MIME type
}

export interface ToolCallPart extends BaseContentPart {
  type: 'tool_call';
  id: string; // Unique ID for this tool call
  name: string; // Name of the tool to be called
  arguments: Record<string, any>; // JSON object with arguments
}

export interface ToolResultPart extends BaseContentPart {
  type: 'tool_result';
  tool_call_id: string; // ID of the ToolCallPart this result corresponds to
  content: string | Record<string, any>; // Result of the tool execution
  is_error?: boolean; // default: false
}

export interface StructuredDataPart extends BaseContentPart {
  type: 'structured_data';
  schema_id: string; // Unique identifier for the schema of the data (e.g., application/vnd.microsoft.card.adaptive+json)
  data: Record<string, any> | Array<any>; // JSON payload conforming to schema_id
}

export interface RequestedResponseFormatPart extends BaseContentPart {
  type: 'requested_response_format';
  schema: Record<string, any>; // A valid JSON Schema object
}

// Example Usage (for testing type safety)
/*
const exampleConversation: Conversation = {
  conversation_id: 'conv-123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  messages: [
    {
      message_id: 'msg-001',
      timestamp: new Date().toISOString(),
      actor: { id: 'user-1', role: 'human', name: 'Alice' },
      content: [
        { type: 'text', text: 'Hello, world!' },
        {
          type: 'image',
          source: { url: 'http://example.com/image.png' },
          media_type: 'image/png',
        },
      ],
    },
    {
      message_id: 'msg-002',
      timestamp: new Date().toISOString(),
      actor: { id: 'assistant-alpha', role: 'assistant', name: 'EchoBot' },
      content: [
        { type: 'text', text: 'Hi Alice! Nice image.' },
        {
          type: 'tool_call',
          id: 'toolcall-567',
          name: 'get_weather',
          arguments: { location: 'London' }
        }
      ]
    },
    {
      message_id: 'msg-003',
      timestamp: new Date().toISOString(),
      actor: { id: 'tool-weather', role: 'tool', name: 'WeatherTool' },
      content: [
        {
          type: 'tool_result',
          tool_call_id: 'toolcall-567',
          content: { temperature: '15C', condition: 'Cloudy' }
        }
      ]
    }
  ],
  metadata: { user_agent: 'TestClient/1.0' }
};
*/
