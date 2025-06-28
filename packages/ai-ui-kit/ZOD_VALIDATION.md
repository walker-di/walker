# Zod Validation Implementation

This document describes the comprehensive Zod validation system implemented in the AI Chat Interface.

## Overview

The chat system now uses [Zod](https://zod.dev/) for runtime type validation, providing:

- **Type Safety**: Runtime validation that matches TypeScript types
- **Better Error Messages**: Detailed validation errors with field-specific messages
- **API Validation**: Robust validation for external data sources
- **User Input Sanitization**: Safe handling of user-provided content
- **File Upload Validation**: Comprehensive file constraint checking

## Architecture

### Schema Definitions (`schemas/chat.ts`)

All data structures are defined using Zod schemas that provide both TypeScript types and runtime validation:

```typescript
import { z } from 'zod';

// Content part schemas using discriminated union
const ContentPartSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    text: z.string().min(1, 'Text content cannot be empty'),
    format: z.enum(['markdown', 'plain']).default('markdown')
  }),
  z.object({
    type: z.literal('image'),
    source: MediaSourceSchema,
    media_type: z.string().regex(/^image\//, 'Must be an image media type'),
    alt_text: z.string().optional()
  }),
  // ... more content types
]);

// Export inferred types
export type ContentPart = z.infer<typeof ContentPartSchema>;
```

### Validation Utilities (`utils/validation.ts`)

Centralized validation functions with consistent error handling:

```typescript
export function validateChatMessage(data: unknown): ValidationResult<ChatMessage> {
  const result = ChatMessageSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errors: result.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      )
    };
  }
}
```

### File Validation (`utils/file-utils.ts`)

Enhanced file handling with validation:

```typescript
export async function fileToContentPartSafe(file: File): Promise<ValidationResult<ContentPart>> {
  // Validate file constraints
  const fileValidation = validateFileConstraints(file);
  if (!fileValidation.success) {
    return fileValidation;
  }

  // Convert and validate content part
  const contentPart = await convertFileToContentPart(file);
  return validateContentPart(contentPart);
}
```

## Key Features

### 1. **Multi-Modal Content Validation**

```typescript
// Validates complex multi-modal messages
const message = {
  id: 'msg-1',
  role: 'assistant',
  content: [
    { type: 'text', text: 'Here is some code:' },
    { type: 'code', code: 'console.log("hello");', language: 'javascript' },
    { type: 'image', source: { url: 'https://example.com/image.jpg' }, media_type: 'image/jpeg' }
  ]
};

const result = validateChatMessage(message);
if (result.success) {
  // Message is valid and typed
  console.log(result.data.content);
} else {
  // Handle validation errors
  console.error(result.errors);
}
```

### 2. **File Upload Validation**

```typescript
// Comprehensive file validation
const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
const validation = validateFileConstraints(
  file,
  10 * 1024 * 1024, // 10MB max size
  ['application/pdf', 'image/*', 'text/*'] // Allowed types
);

if (validation.success) {
  // Process file
  const contentPart = await fileToContentPartSafe(file);
}
```

### 3. **API Response Validation**

```typescript
// Validate external API responses
export class ChatApiService {
  async sendMessage(content: string): Promise<ValidationResult<ChatMessage>> {
    const response = await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    
    const data = await response.json();
    return validateChatMessage(data); // Validates API response
  }
}
```

### 4. **User Input Sanitization**

```typescript
// Safe user input handling
function handleUserInput(input: string) {
  const validation = sanitizeAndValidateUserInput(input);
  if (!validation.success) {
    showError(formatValidationErrors(validation.errors));
    return;
  }
  
  // Use sanitized input
  processMessage(validation.data);
}
```

### 5. **Batch Validation**

```typescript
// Validate multiple items efficiently
const messages = [/* array of message objects */];
const result = batchValidate(messages, ChatMessageSchema);

console.log(`Valid: ${result.valid.length}, Invalid: ${result.invalid.length}`);
result.invalid.forEach(({ index, errors }) => {
  console.error(`Message ${index} failed:`, errors);
});
```

## Error Handling

### Validation Result Type

```typescript
interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}
```

### Error Formatting

```typescript
// Format errors for user display
const errors = ['Field is required', 'Invalid format'];
const formatted = formatValidationErrors(errors);
// Output: "Multiple validation errors:\n• Field is required\n• Invalid format"

const summary = getValidationErrorSummary(errors);
// Output: "2 validation errors"
```

## Type Guards

```typescript
// Runtime type checking
if (isChatMessage(data)) {
  // TypeScript knows data is ChatMessage
  console.log(data.content);
}

if (isContentPart(data)) {
  // TypeScript knows data is ContentPart
  console.log(data.type);
}
```

## Integration Examples

### Component Usage

```svelte
<script lang="ts">
  import { validateChatMessage, formatValidationErrors } from './utils/validation.js';
  
  function handleSendMessage(content: string) {
    const messageData = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: new Date()
    };
    
    const validation = validateChatMessage(messageData);
    if (!validation.success) {
      console.error('Validation failed:', formatValidationErrors(validation.errors || []));
      return;
    }
    
    // Use validated message
    sendMessage(validation.data);
  }
</script>
```

### File Upload Component

```svelte
<script lang="ts">
  import { validateFileConstraints, processFilesBatch } from './utils/file-utils.js';
  
  async function handleFileUpload(files: File[]) {
    const result = await processFilesBatch(files, maxFileSize, allowedTypes);
    
    // Handle successful uploads
    result.successful.forEach(({ file, contentPart }) => {
      addToMessage(contentPart);
    });
    
    // Handle failed uploads
    result.failed.forEach(({ file, errors }) => {
      showError(`${file.name}: ${errors.join(', ')}`);
    });
  }
</script>
```

## Testing

Comprehensive test suite covering all validation scenarios:

```typescript
describe('Zod Validation', () => {
  it('validates valid chat message', () => {
    const validMessage = {
      id: 'msg-1',
      role: 'user',
      content: 'Hello world',
      timestamp: new Date()
    };

    const result = validateChatMessage(validMessage);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('rejects invalid chat message', () => {
    const invalidMessage = {
      id: '',
      role: 'invalid-role',
      content: ''
    };

    const result = validateChatMessage(invalidMessage);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
```

## Benefits

1. **Runtime Safety**: Catch invalid data at runtime, not just compile time
2. **Better UX**: Detailed error messages help users understand what went wrong
3. **API Robustness**: Validate external data sources to prevent crashes
4. **Developer Experience**: Single source of truth for types and validation
5. **Maintainability**: Centralized validation logic that's easy to update

## Migration Guide

### From Legacy Types

```typescript
// Before (legacy types)
import type { ChatMessage } from './types/chat.js';

// After (Zod types)
import type { ChatMessage } from './schemas/chat.js';
import { validateChatMessage } from './utils/validation.js';
```

### Adding Validation

```typescript
// Before
function processMessage(data: any) {
  // Hope data is valid
  messages.push(data);
}

// After
function processMessage(data: unknown) {
  const validation = validateChatMessage(data);
  if (validation.success) {
    messages.push(validation.data);
  } else {
    handleValidationError(validation.errors);
  }
}
```

This Zod implementation provides a robust foundation for type-safe, validated chat interfaces that can handle complex multi-modal content while providing excellent error handling and developer experience.
