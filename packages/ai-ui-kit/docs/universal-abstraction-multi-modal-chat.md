# A Universal Abstraction for Multimodal, Multi-Agent AI Conversations

## I. The Evolving Architecture of Digital Conversation

The landscape of digital communication is undergoing its most significant transformation since the advent of the internet. For decades, the paradigm was relatively stable: human-to-human text exchange, facilitated by protocols that prioritized session management and message delivery. Today, this model is being fundamentally disrupted by the rise of artificial intelligence. Conversations are no longer limited to text; they are rich, multimodal dialogues involving images, audio, video, and structured data. They are no longer confined to two participants; they are complex orchestrations between humans and a dynamic ensemble of specialized AI agents.

This rapid evolution has exposed a critical architectural gap: the absence of a standardized abstraction layer for AI-driven conversations. Developers building on this new frontier are confronted with a fragmented ecosystem of proprietary APIs and message formats. This lack of a common language creates significant friction, hindering interoperability, stifling innovation, and complicating the development of sophisticated, next-generation AI applications. This report presents a comprehensive analysis of this problem space and proposes a universal schema designed to serve as a durable, extensible foundation for the future of conversational AI.

### From Text Streams to Intelligent Agents

The history of digital chat provides essential context for understanding the present challenges. Early protocols like Internet Relay Chat (IRC) established the foundational concept of the "channel" as a persistent, multi-user conversational space. Later, the Internet Engineering Task Force (IETF) formalized session-based messaging with the Message Session Relay Protocol (MSRP), which treated a conversation as a discrete media stream, akin to audio or video, within a negotiated session. These protocols, while primitive by modern standards, successfully solved the core problems of their era: managing text-based interactions between humans at internet scale.

The current paradigm shift, however, introduces challenges of a different order of magnitude. The conversation itself has become the application interface, and the participants are increasingly non-human. This necessitates a new abstraction that can holistically address the three core challenges of the modern conversational AI ecosystem.

### The Three Core Challenges

The imperative for a new standard is driven by three interconnected and pressing challenges that currently impede progress in the field.

1. **Interoperability:** The current landscape is a collection of walled gardens. Major AI providers, including OpenAI, Google, and Anthropic, have each developed powerful but proprietary API schemas. Similarly, established communication platforms like Slack, Discord, and Microsoft Teams have their own rich, but incompatible, message formats. This fragmentation means that an application built for one ecosystem cannot be easily migrated to or integrated with another. The logic for handling conversational history, multimodal content, and agent interactions must be rewritten for each new platform. This creates vendor lock-in, increases development costs, and slows the pace of innovation. The long-standing user demand for a universal chat client, as evidenced by open-source projects like Beeper and Pidgin, now extends to the developer world: a universal abstraction is needed to bridge these disparate systems.
2. **Multimodality:** The transition from unimodal (text-only) to multimodal communication is a fundamental change in the nature of AI interaction. Modern models can now perceive, process, and generate content that fluidly combines text, images, audio, video, and other file types. A user might upload a chart and ask for an analysis, or an AI might generate a diagram to illustrate a complex point. A standard schema must treat these varied data types as first-class citizens, preserving the crucial contextual relationship between them. Simply appending a URL to a text string is insufficient; the schema must support the ordered interleaving of different content parts within a single conversational turn.
3. **Multi-Agent Orchestration:** The monolithic AI assistant is giving way to sophisticated multi-agent systems. In this architecture, a "supervisor" agent coordinates a team of specialized sub-agents—such as a planner, a researcher, a data analyst, or a code executor—to solve complex tasks. Frameworks like LangGraph and AutoGen provide patterns for orchestrating these agentic workflows. This introduces a new layer of complexity that existing chat schemas are ill-equipped to handle. The schema must be ableto represent the distinct identities, roles, and interactions of these various agents, including the tool calls and results that form their internal communication protocol. Without a standard way to represent these interactions, building and debugging complex agentic systems remains an ad-hoc and brittle process.

## II. Foundational Paradigms: Lessons from Internet-Scale Chat Protocols

Before designing a new abstraction, it is crucial to analyze the architectural principles of the IETF standards that have successfully underpinned internet-scale communication for decades. While these protocols—MSRP, IRC, and MLS—are not directly applicable to the AI chat paradigm in their entirety, they contain time-tested concepts that provide a robust foundation for a modern schema. The goal is not to adopt their implementations, but to distill their core, enduring architectural wisdom.

### The Session-Oriented Model (MSRP)

The Message Session Relay Protocol (MSRP), defined in RFC 4975, introduced a pivotal concept: treating an instant messaging conversation as a formal media stream. Managed within a session, typically established by the Session Initiation Protocol (SIP), an MSRP chat is handled with the same rigor as an audio or video call. This session-based context is a direct architectural ancestor to the modern concept of a persistent

`conversation_id`, providing a container for a sequence of related messages.

The extension of MSRP for multi-party chat in RFC 7701 further enriches this model. It specifies mechanisms for managing participants in a "chat room," including the use of nicknames for identity and the ability to send private messages within the group context. Most significantly, it mandates the use of a Message/CPIM wrapper (Common Profile for Instant Messaging) to carry essential sender and recipient metadata within the message itself. This establishes the vital principle of an explicit message envelope that separates payload from addressing information.

Furthermore, MSRP's use of MIME types via the `accept-types` and `accept-wrapped-types` attributes provides a powerful and extensible mechanism for participants to declare their content capabilities. This allows a client to signal that it can receive

`text/plain` and `image/jpeg`, but not `video/mp4`. This is a direct parallel to how a modern schema must handle a diverse and ever-expanding set of content types, demonstrating a robust, forward-looking approach to content negotiation that remains highly relevant.

### The Channel-Oriented Model (IRC)

Internet Relay Chat (IRC), though one of the earliest chat protocols, offers an enduring architectural pattern in its concept of the persistent, named "channel". The channel serves as the primary locus for multi-user conversation, a stable and addressable entity to which users can join and leave. The server-centric architecture, where a network of servers collaborates to synchronize the state of channels and users, represents a foundational solution to the problem of distributed conversation management.

While IRC's message format—a simple text-based structure of `<prefix> <command> <params>`—is primitive by today's JSON-based standards, it embodies a crucial design principle: the separation of message content from protocol-level metadata. The optional prefix in an IRC message unambiguously identifies the origin of the message (a specific user or server), distinguishing it from the command being executed and its parameters (the content). This clean separation between the "what" (content) and the "who/where" (metadata) is a cornerstone of any robust messaging schema.

### The Secure Group Model (MLS)

Messaging Layer Security (MLS), defined in RFC 9420, represents the current state-of-the-art in secure group communication and offers profound lessons for identity and message structure in a high-stakes environment. While its primary focus is on providing efficient, continuous end-to-end authenticated key exchange for dynamic groups, its underlying data structures are exceptionally well-conceived.

Participant identity in MLS is handled with cryptographic rigor. A sender is identified not by a mutable nickname, but by their `leaf_index` in the group's shared ratchet tree. This

`leaf_index` points to a `LeafNode` containing the member's unique cryptographic keys and credentials. While this level of cryptographic identity is too rigid for a general-purpose AI chat API, it underscores the importance of having a stable, unique, and verifiable identifier for each participant. This concept directly informs the need for an `Actor` object with a stable `id` in the proposed schema, moving beyond the ambiguity of simple role strings like "user" or "assistant."

The MLS message framing provides a robust template for a modern message envelope. The top-level `MLSMessage` wraps either a `PublicMessage` (authenticated) or a `PrivateMessage` (authenticated and encrypted). Inside, the `FramedContent` object contains the core payload along with essential context, including the `group_id`, the `epoch` (a version number for the group's state), and a structured `Sender` object. This layered structure provides a clear, secure, and context-rich container for every message, a model of best practice for any new schema.

### Distilling Timeless Architectural Principles

Modern AI APIs are often described as "stateless," in that the client is typically required to resend the entire conversation history with each API call. This appears to contradict the session-oriented nature of protocols like MSRP. However, this statelessness is a feature of the HTTP transport layer, not a property of the conversation itself. Logically, the sequence of messages still constitutes a single, stateful conversation. Therefore, a universal schema must be built around a top-level `Conversation` object, identified by a unique `conversation_id`, which serves as the logical equivalent of an IRC channel or an MSRP session.

These foundational protocols, taken together, contribute three indispensable architectural principles that must be carried forward into any modern AI chat abstraction:

1. **The Conversation Context:** Every message belongs to a persistent, identifiable container that represents the conversation itself. This corresponds to IRC's Channel, MSRP's Session, and MLS's Group.
2. **The Message Envelope:** There must be a clear and explicit separation between the message payload (the `content`) and its surrounding metadata (the `envelope`), which must include sender identity, recipient information, and context identifiers.
3. **Explicit Participant Identity:** Every participant in a conversation, whether human or AI, must have a unique and stable identifier. This moves beyond simple, role-based strings to a more robust model of identity management, as inspired by the rigor of MLS.

## III. The Modern AI Chat Paradigm: A Comparative Analysis of De Facto Standards

While IETF protocols provide a strong theoretical foundation, the practical, de facto standards for AI chat are being forged in the APIs of major technology providers and the rich messaging platforms that dominate enterprise and consumer communication. A detailed comparative analysis of these systems reveals a remarkable convergence on core concepts, forming a solid, market-validated basis for a universal abstraction. It also highlights areas of divergence where a new standard can provide unification and clarity.

### The Convergent `Message` Object

The most striking pattern to emerge from the leading AI APIs is the near-universal adoption of a specific structure for representing conversational history. This structure consists of an ordered list of `Message` objects, where each object contains two key fields: `role` and `content`.

- **Anthropic's Claude API** defines its conversational input as a `messages` parameter, which is a list of objects, each with a `role` (`user` or `assistant`) and `content`.
- **OpenAI's Chat Completions API**, which the company itself describes as an "industry standard," is built around a `messages` array where each object has a `role` (`system`, `user`, or `assistant`) and a `content` field. Their newer, more advanced
    
    `Responses` API maintains this fundamental structure, using an `input` array of the same `role`/`content` objects.
    
- **Google's Gemini API**, while using slightly different nomenclature, adheres to the same concept. A request contains a `contents` array, which holds a sequence of conversational turns. Within the chat history, roles are designated as `user` and `model`.

This widespread adoption of the `role`/`content` list is not a coincidence; it is the simplest and most effective way to provide a model with the turn-by-turn context it needs to generate a coherent response. This structure is the undeniable de facto standard for representing a conversation's history, and any proposed universal schema must adopt this as its central and non-negotiable organizing principle.

### Participant Roles and Identity

While the core structure is convergent, the specific roles and their implementation show subtle but important variations.

- **Core Roles:** The roles of `user` (representing the human end-user) and `assistant` or `model` (representing the primary AI) are universal across all major LLM providers.
- **The `system` Role:** A mechanism for providing high-level instructions, persona definitions, or behavioral constraints to the AI is also a common feature. OpenAI and Google implement this as a special message with `role: "system"` or `instructions`, typically placed at the beginning of the message history. Anthropic achieves the same outcome with a top-level
    
    `system` parameter that exists outside the `messages` list but serves the identical function.
    
- **The Emerging `tool` Role:** The integration of external tools and functions has necessitated an expansion of the role set. The now-standard pattern for tool use is a multi-step conversational exchange. First, the `assistant` responds not with text, but with a special `tool_calls` object requesting the execution of one or more functions. The client-side code then executes these functions and submits the results back to the model in a new message with `role: "tool"`, which includes the `tool_call_id` to link the result to the original request. This formalizes the agent's interaction with its environment as an explicit part of the conversation history.

### Enforcing Structure: The Rise of Reliable JSON Output

A critical evolution in AI APIs has been the move from merely prompting a model to produce structured data to programmatically enforcing it. This capability is essential for building reliable applications that consume the model's output.

- **OpenAI** led this shift, first with a simple `response_format: {type: "json_object"}` to guarantee valid JSON, and more recently with the powerful `response_format: {type: "json_schema",...}` in its latest models. This latter feature forces the model's output to conform to a specific, developer-provided JSON Schema, ensuring type safety and structural correctness.
- **Google's Gemini API** offers a parallel capability. A developer can set `response_mime_type: "application/json"` and provide a `responseSchema` object that defines the desired output structure. This schema is based on a subset of the OpenAPI 3.0 specification, a widely understood standard for API definitions.
- **Anthropic's API** integrates this concept directly into its tool-use framework. When defining a tool, the developer provides an `input_schema` in JSON Schema format. The model is then constrained to generate a JSON object that conforms to this schema when it decides to call the tool.

The ability to request a response that strictly adheres to a client-provided JSON Schema is a non-negotiable requirement for a modern AI chat standard. It represents the primary mechanism for transforming the probabilistic output of an LLM into the deterministic, structured data required for robust software integration.

### Platform-Specific Richness: Lessons from Interactive UI

While LLM APIs focus on the raw conversational data, mature communication platforms like Slack, Discord, and Microsoft Teams have developed sophisticated frameworks for embedding rich, interactive user interfaces directly within messages.

- **Slack** uses a proprietary but powerful system called `blocks`. A message payload can contain a JSON array of layout blocks, such as `section`, `image`, `actions` (for buttons and menus), and `input`. Slack also provides a
    
    `metadata` field, which is invisible to the user but allows apps to attach structured data to a message for app-to-app communication.
    
- **Discord** employs a similar model using `components` (which include `Action Row`, `Button`, and various `Select Menu` types) and `embeds` (for richly formatted content blocks) to construct interactive messages.
- **Microsoft Teams** leverages `Adaptive Cards`, an open, cross-platform standard for UI card exchange. An Adaptive Card is defined by a JSON schema and can contain a wide array of inputs, text, and media, making it a versatile tool for in-chat applications.

A universal *data* abstraction should not attempt to reinvent these rich UI frameworks. Doing so would be redundant and unlikely to gain adoption. Instead, the schema must be capable of *encapsulating* these platform-specific formats. Drawing a lesson from MSRP's use of MIME types, a universal message schema can include a content part with a specific type, such as `application/vnd.slack.blocks+json` or `application/vnd.microsoft.card.adaptive+json`. This allows an application to construct a message using a standard envelope while providing a payload that can be rendered natively and with full fidelity by the target platform.

| Feature | OpenAI (Chat/Responses) | Google (Gemini API) | Anthropic (Claude API) | Slack (Web API) | Discord (API) |
| --- | --- | --- | --- | --- | --- |
| **Message Structure** | Ordered list of `role`/`content` objects     | Ordered list of `role`/`parts` objects     | Ordered list of `role`/`content` objects     | Single object with `text`, `blocks`, `attachments`     | Single object with `content`, `embeds`, `components`     |
| **Participant Roles** | `system`, `user`, `assistant`, `tool`     | `user`, `model` (system via `system_instruction`)     | `user`, `assistant` (system via `system` param)     | N/A (Implicit via user/bot tokens) | N/A (Implicit via user/bot tokens) |
| **System Prompt** | `system` role message     | `system_instruction` config     | Top-level `system` parameter     | N/A | N/A |
| **Multimodal Content** | Array of typed content parts (text, image_url)     | Array of `parts` (text, inlineData with MIME type)     | Array of typed content blocks (text, image)     | `blocks` of type `image`; file uploads     | `embeds` with image/video URLs; file attachments     |
| **Structured JSON** | `response_format` with `json_schema`     | `response_mime_type` with `responseSchema`     | `tool_use` with `input_schema`     | N/A (Requires app-level parsing) | N/A (Requires app-level parsing) |
| **Interactive Elements** | N/A (Handled via `tool_calls`) | N/A (Handled via `tool_calls`) | N/A (Handled via `tool_calls`) | `blocks` with `actions`, `input` elements     | `components` with `button`, `select_menu`     |

## IV. Architecting for Multimodality: A Unified Content Model

Addressing multimodality is one of the primary drivers for a new conversational standard. The schema must not only accommodate different media types but also preserve the intricate, ordered relationship between them. This requires a flexible and robust content model that can handle various data delivery methods and the interleaving of content within a single message.

### Content Representation Methods

When incorporating binary or non-textual data into a JSON-based API payload, three primary methods have emerged, each with distinct trade-offs. A truly universal schema must be flexible enough to support all of them, as each is suited to different use cases.

1. **Inline Base64 Encoding:** In this method, the binary data of the file is encoded into a Base64 string and placed directly within the JSON payload. This approach is used by Anthropic and is an option in Google's Gemini API. Its main advantage is simplicity; the entire request is self-contained in a single API call. However, it is highly inefficient. Base64 encoding increases the data size by approximately 33%, significantly bloating the JSON payload and making it unsuitable for large files like high-resolution images or videos.
2. **URL Reference:** Here, the content is hosted on a publicly accessible server, and only its URL is included in the API request. This is a supported method for both Anthropic and Google Gemini. This approach keeps the JSON payload small and efficient but shifts the burden of data transfer to the AI provider's server. It introduces an additional point of failure (the URL could be invalid, or the server could be down) and adds latency as the model's backend must first fetch the content before processing can begin.
3. **Pre-uploaded File ID:** This is the most robust and efficient method for handling large or frequently reused assets. The client first performs a separate upload of the file to the AI provider's service, which returns a unique and stable file identifier (`file_id`). This ID is then referenced in subsequent chat API calls. This pattern is used by OpenAI and Google's File API. It decouples the file transfer from the chat logic, allows for efficient reuse of assets across multiple prompts, and is the only practical way to handle files that exceed the request size limits of a single API call.

Given these distinct use cases, the proposed schema for any media-based content part should include a `source` object that can be a discriminated union, allowing the client to provide the data via a `base64` string, a `url`, or a `file_id`.

### Interleaving and Context: The Power of the Content Array

The most advanced multimodal models, such as OpenAI's GPT-4o and Anthropic's Claude 3, do not just process a "bag of media" associated with a prompt. They process a sequence. The order in which text and images are presented is critical to the model's understanding. For example, a user might ask a question, present an image, and then ask a follow-up question that refers specifically to that image.

To support this, the APIs for these models have converged on a powerful pattern: the `content` field of a single message is not a simple string, but an **ordered array of typed content blocks**. A single

`user` message can contain a text part, followed by an image part, followed by another text part. This structure is the only way to faithfully represent the contextual flow of a truly multimodal conversation. This format is also being adopted by the wider ecosystem, with MLOps tools like PyTorch `torchtune` expecting training data to follow this interleaved structure. Therefore, it is an absolute requirement that a universal schema's

`Message` object contains a `content` field that is an ordered array of `ContentPart` objects.

### Proposed Schema for Media Parts

Synthesizing the analysis of representation methods and interleaving, the schema for various media parts can be defined. These definitions serve as a preview of the complete schema presented in Section VI. Each part is a JSON object with a `type` field that acts as a discriminator.

- **`ImagePart`**:JSON
    
    `{
      "type": "image",
      "source": {
        "media_type": "image/jpeg",
        "data": "...",
        "url": "https://...",
        "file_id": "file-..."
      }
    }`
    
    This structure is directly inspired by the combination of Anthropic's `source` object and the multiple data provision methods seen across OpenAI and Google. The
    
    `media_type` field, using standard MIME types, is essential for correct interpretation.
    
- **`VideoPart`, `AudioPart`, `FilePart`**: These parts would follow an identical structure to the `ImagePart`, differing only in their `type` discriminator and the value of the `media_type` field (e.g., `video/mp4`, `audio/mp3`, `application/pdf`). This consistent structure simplifies client-side implementation and is informed by Google's explicit use of MIME types for various uploaded files.

## V. Orchestrating Intelligence: A Schema for Multi-Agent Interaction

The second major frontier for conversational AI is the development of multi-agent systems. As tasks become too complex for a single monolithic model, they are decomposed and assigned to a team of specialized agents. A universal chat schema must evolve to represent the more complex identities, roles, and actions inherent in these systems.

### Beyond `user`/`assistant`: A Granular `Actor` Model

The simple `user`/`assistant` role dichotomy, while sufficient for basic chatbots, breaks down completely in a multi-agent context. It is no longer enough to know that a message came from "the AI." We need to know *which* AI. A conversation might involve a primary "supervisor" agent that interacts with the human user, a "researcher" agent that can browse the web, and a "coder" agent that can write and execute code. Logging, debugging, and routing in such a system depend on being able to distinguish between the outputs of these different agents.

To solve this, the simple `role` string in the message object must be replaced with a more structured `Actor` object. This object provides a richer, more granular model of participant identity, drawing inspiration from the principle of unique identifiers found in robust protocols like MLS. The proposed

`Actor` object would contain:

- **`id`**: A stable and unique identifier for the participant within the scope of the conversation. This could be a UUID for an AI agent or a user ID for a human. This is the primary key for identifying the sender.
- **`role`**: A high-level, enumerated category that classifies the actor. The core roles would be `human`, `assistant`, `system`, and `tool`. This maintains compatibility with the concepts in existing APIs while providing a clearer taxonomy.
- **`name`** (optional): A human-readable string for display and logging purposes, such as "CodeInterpreterAgent" or "WebAppResearcher". This is critical for the intelligibility of agent-to-agent communication, a key aspect of frameworks like LangGraph.

### Representing Agentic Actions as First-Class Content

The primary mode of interaction between agents is tool use. This is a well-defined conversational pattern that has been standardized across the major AI providers. The process involves an

`assistant` emitting a request to call a tool, and the environment (or a dedicated `tool` actor) responding with the result. To make this flow explicit and machine-readable, these actions must be formalized as distinct, first-class content types within the message schema.

Instead of being opaque properties, `ToolCall` and `ToolResult` should be defined as specific types within the ordered `ContentPart` array of a message.

- **`ToolCallPart`**: This content part represents a request by an agent to execute a tool. It would be produced by an `Actor` with the `assistant` role.JSON
    
    `{
      "type": "tool_call",
      "id": "call_abc123",
      "name": "get_weather_forecast",
      "arguments": {
        "location": "Boston, MA",
        "days": 5
      }
    }`
    
- **`ToolResultPart`**: This content part represents the output of a tool execution. It would be produced by a special `Actor` with the `tool` role and must reference the ID of the original call.JSON
    
    `{
      "type": "tool_result",
      "tool_call_id": "call_abc123",
      "content": "{ \"forecast\": [... ] }",
      "is_error": false
    }`
    

By formalizing these interactions as part of the message content, the entire operational trace of the multi-agent system is captured within the conversation history itself. This makes the system's behavior transparent, replayable, and easier to debug.

### State Management and Scoping

Advanced multi-agent frameworks like LangGraph highlight the need for both shared, public state and private, agent-specific state. The main conversation history is the shared state, visible to all participants. However, a specific sub-agent might have its own internal memory, its own "view" of the conversation, or require specific routing instructions that are not part of the core message content.

A universal schema must provide a standardized extension point for this metadata without polluting the primary content fields. The ideal mechanism for this is a `metadata` field, an object that can hold arbitrary key-value pairs, available on both the top-level `Conversation` object and on each individual `Message` object. This pattern is borrowed from mature platforms like Slack, which use a `metadata` property on messages for app-to-app communication that is invisible to the end-user. This provides a clean, sandboxed area for frameworks and platforms to store implementation-specific details, such as routing graphs, private memory state, or performance metrics, ensuring the core schema remains clean and universally applicable.

## VI. Synthesis: A Proposed Universal AI Conversation Schema

This section presents the culmination of the preceding analysis: a formal proposal for a Universal AI Conversation Schema (UACS). This schema synthesizes the foundational principles of internet protocols, the convergent patterns of modern AI APIs, and the requirements of multimodal and multi-agent systems into a single, cohesive, and extensible abstraction. It is designed to be a durable foundation for building the next generation of conversational applications. The schema is presented here conceptually, followed by a formal JSON Schema definition.

### Core Data Objects

The schema is built around a small set of core, nested data objects that represent the hierarchy of a conversation.

- **`Conversation`**: This is the top-level object, the container for an entire conversational exchange. It serves as the logical equivalent of an IRC channel or an MSRP session.
    - `conversation_id` (string, required): A globally unique identifier for the conversation (e.g., a UUID).
    - `created_at` (string, required): An ISO 8601 timestamp of when the conversation was initiated.
    - `updated_at` (string, required): An ISO 8601 timestamp of the last message added.
    - `messages` (array of `Message`, required): An ordered list of all messages exchanged in the conversation.
    - `metadata` (object, optional): An arbitrary key-value store for application-specific data related to the entire conversation (e.g., session parameters, user profile information).
- **`Message`**: This is the fundamental unit of exchange within a conversation.
    - `message_id` (string, required): A unique identifier for the message within the conversation.
    - `timestamp` (string, required): An ISO 8601 timestamp of when the message was created.
    - `actor` (`Actor`, required): The object representing the sender of the message.
    - `content` (array of `ContentPart`, required): An ordered array of one or more content parts that make up the message body.
    - `metadata` (object, optional): An arbitrary key-value store for application-specific data related to this specific message (e.g., moderation results, latency metrics, agent-specific state).
- **`Actor`**: This object provides a rich representation of a conversation participant, moving beyond simple role strings.
    - `id` (string, required): A stable, unique identifier for the actor (e.g., a user ID, or a UUID for an agent).
    - `role` (string, required, enum): The high-level classification of the actor. Must be one of: `human`, `assistant`, `system`, `tool`.
    - `name` (string, optional): A human-readable display name for the actor (e.g., "Alice", "ResearchAgent").
- **`ContentPart`**: This is a discriminated union representing a single piece of content within a message's `content` array. The `type` field determines the structure of the rest of the object.

### The `ContentPart` Schemas

The power and flexibility of the UACS lie in its extensible set of `ContentPart` types. The following are the foundational types required for modern AI chat.

- **`TextPart`**: For plain or formatted text.
    - `type`: `"text"`
    - `text` (string, required): The textual content.
    - `format` (string, optional, enum, default: `"markdown"`): The format of the text. Can be `"markdown"` or `"plain"`.
- **`ImagePart`, `VideoPart`, `AudioPart`, `FilePart`**: For all binary media types.
    - `type`: `"image"`, `"video"`, `"audio"`, or `"file"`
    - `source` (object, required): A discriminated union specifying how the data is provided. Must contain exactly one of the following properties:
        - `base64` (string): The Base64-encoded file data.
        - `url` (string): A publicly accessible URL to the file.
        - `file_id` (string): An identifier for a pre-uploaded file.
    - `media_type` (string, required): The IANA MIME type of the content (e.g., `image/jpeg`, `video/mp4`, `application/pdf`).
- **`ToolCallPart`**: To represent an agent's request to execute a tool.
    - `type`: `"tool_call"`
    - `id` (string, required): A unique ID for this specific tool call, used for correlation with the result.
    - `name` (string, required): The name of the tool to be called.
    - `arguments` (object, required): A JSON object containing the arguments for the tool.
- **`ToolResultPart`**: To represent the output of a tool execution.
    - `type`: `"tool_result"`
    - `tool_call_id` (string, required): The ID of the `ToolCallPart` this result corresponds to.
    - `content` (string | object, required): The result of the tool execution, as a string or a JSON object.
    - `is_error` (boolean, optional, default: `false`): Set to `true` if the tool execution resulted in an error.
- **`StructuredDataPart`**: A generic container for platform-specific rich UI or other structured data.
    - `type`: `"structured_data"`
    - `schema_id` (string, required): A unique identifier for the schema of the data (e.g., `application/vnd.microsoft.card.adaptive+json`, `application/vnd.slack.blocks+json`).
    - `data` (object | array, required): The JSON payload conforming to the specified schema.
- **`RequestedResponseFormatPart`**: A special, non-rendered content part used to instruct the model on the desired format for its *next* response.
    - `type`: `"requested_response_format"`
    - `schema` (object, required): A valid JSON Schema object defining the structure of the expected response. This formalizes the "JSON mode" feature of modern APIs.

### Formal JSON Schema Definition

The following table provides a complete and formal JSON Schema definition for the Universal AI Conversation Schema. This schema is designed to be directly usable for validation and implementation.

JSON

`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Universal AI Conversation Schema (UACS)",
  "description": "A standard abstraction for representing multimodal, multi-agent AI conversations.",
  "type": "object",
  "properties": {
    "Conversation": {
      "$ref": "#/definitions/Conversation"
    }
  },
  "definitions": {
    "Conversation": {
      "type": "object",
      "properties": {
        "conversation_id": { "type": "string", "format": "uuid" },
        "created_at": { "type": "string", "format": "date-time" },
        "updated_at": { "type": "string", "format": "date-time" },
        "messages": {
          "type": "array",
          "items": { "$ref": "#/definitions/Message" }
        },
        "metadata": { "type": "object" }
      },
      "required": ["conversation_id", "created_at", "updated_at", "messages"]
    },
    "Message": {
      "type": "object",
      "properties": {
        "message_id": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" },
        "actor": { "$ref": "#/definitions/Actor" },
        "content": {
          "type": "array",
          "items": { "$ref": "#/definitions/ContentPart" },
          "minItems": 1
        },
        "metadata": { "type": "object" }
      },
      "required": ["message_id", "timestamp", "actor", "content"]
    },
    "Actor": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "role": { "type": "string", "enum": ["human", "assistant", "system", "tool"] },
        "name": { "type": "string" }
      },
      "required": ["id", "role"]
    },
    "ContentPart": {
      "oneOf":
    },
    "TextPart": {
      "type": "object",
      "properties": {
        "type": { "const": "text" },
        "text": { "type": "string" },
        "format": { "type": "string", "enum": ["markdown", "plain"], "default": "markdown" }
      },
      "required": ["type", "text"]
    },
    "MediaSource": {
      "type": "object",
      "properties": {
        "base64": { "type": "string", "contentEncoding": "base64" },
        "url": { "type": "string", "format": "uri" },
        "file_id": { "type": "string" }
      },
      "oneOf": [
        { "required": ["base64"] },
        { "required": ["url"] },
        { "required": ["file_id"] }
      ]
    },
    "ImagePart": {
      "type": "object",
      "properties": {
        "type": { "const": "image" },
        "source": { "$ref": "#/definitions/MediaSource" },
        "media_type": { "type": "string", "pattern": "^image/" }
      },
      "required": ["type", "source", "media_type"]
    },
    "VideoPart": {
      "type": "object",
      "properties": {
        "type": { "const": "video" },
        "source": { "$ref": "#/definitions/MediaSource" },
        "media_type": { "type": "string", "pattern": "^video/" }
      },
      "required": ["type", "source", "media_type"]
    },
    "AudioPart": {
      "type": "object",
      "properties": {
        "type": { "const": "audio" },
        "source": { "$ref": "#/definitions/MediaSource" },
        "media_type": { "type": "string", "pattern": "^audio/" }
      },
      "required": ["type", "source", "media_type"]
    },
    "FilePart": {
      "type": "object",
      "properties": {
        "type": { "const": "file" },
        "source": { "$ref": "#/definitions/MediaSource" },
        "media_type": { "type": "string" }
      },
      "required": ["type", "source", "media_type"]
    },
    "ToolCallPart": {
      "type": "object",
      "properties": {
        "type": { "const": "tool_call" },
        "id": { "type": "string" },
        "name": { "type": "string" },
        "arguments": { "type": "object" }
      },
      "required": ["type", "id", "name", "arguments"]
    },
    "ToolResultPart": {
      "type": "object",
      "properties": {
        "type": { "const": "tool_result" },
        "tool_call_id": { "type": "string" },
        "content": {},
        "is_error": { "type": "boolean", "default": false }
      },
      "required": ["type", "tool_call_id", "content"]
    },
    "StructuredDataPart": {
      "type": "object",
      "properties": {
        "type": { "const": "structured_data" },
        "schema_id": { "type": "string" },
        "data": {
          "oneOf": [{ "type": "object" }, { "type": "array" }]
        }
      },
      "required": ["type", "schema_id", "data"]
    },
    "RequestedResponseFormatPart": {
      "type": "object",
      "properties": {
        "type": { "const": "requested_response_format" },
        "schema": { "type": "object" }
      },
      "required": ["type", "schema"]
    }
  }
}`

## VII. Implementation Strategy and Future Directions

The proposal of a universal schema is the first step. Its value is realized through practical implementation and its ability to adapt to the future evolution of AI. This final section provides guidance on integrating the UACS into existing systems and considers the path forward for broader adoption and standardization.

### Mapping and Translation Layer

The primary utility of the UACS in the current ecosystem is as a central, canonical data model. Applications should be built to produce and consume UACS objects natively. To interact with external, proprietary APIs, a dedicated translation or adapter layer is required. This layer is responsible for mapping between the UACS format and the target API's specific schema.

For example, a function designed to send a conversation to OpenAI's API would perform the following steps:

1. Receive a `Conversation` object in the UACS format.
2. Iterate through the `messages` array.
3. For each `Message` object, transform its `Actor` into the corresponding OpenAI `role` string (e.g., `Actor {role: "human"}` becomes `"user"`).
4. Transform the `content` array of `ContentPart` objects into OpenAI's required format. A `TextPart` becomes `{type: "text", text: "..."}`. An `ImagePart` with a `url` source becomes `{type: "image_url", image_url: {url: "..."}}`.
5. Construct the final JSON payload and send it to the OpenAI Chat Completions endpoint.

By isolating this platform-specific logic in a dedicated adapter, the core application logic remains clean, portable, and independent of any single provider. This architectural pattern is key to mitigating vendor lock-in and building resilient, long-lasting conversational systems.

### Handling Streaming and Asynchronicity

The UACS, as a JSON schema, represents a static snapshot of a conversation's state. However, real-time user experiences depend on streaming, where the model's response is delivered token by token as it is generated. The schema is fully compatible with this paradigm.

In a streaming context, a server would use server-sent events (SSEs) to send a sequence of partial updates. Instead of sending a complete

`Message` object at the end, the server would stream a series of events representing deltas to the `ContentPart` array. For a text response, this would typically be a stream of events, each containing a small chunk of text to be appended to a `TextPart`. For tool use, the server might first stream the `ToolCallPart` object once it has been fully generated. This event-driven approach, used by all major providers, can be built directly on top of the UACS structure, with the schema defining the final, complete state of the message once the stream has concluded.

### Extensibility and Standardization

The UACS is designed for extensibility. New modalities and interaction patterns can be added by defining new `ContentPart` types without breaking backward compatibility. As AI capabilities evolve—for instance, with the direct generation of 3D models or interactive simulations—the schema can adapt by incorporating `3DModelPart` or `InteractiveCanvasPart` definitions.

Looking further ahead, the ultimate goal is to move from a de facto standard to a formally recognized one. Bodies like the World Wide Web Consortium (W3C) are already actively investigating the impact of AI on the web and the potential need for new standards and guidelines to ensure transparency, interoperability, and ethical use. The W3C's history of standardizing core web technologies like HTML and CSS provides a model for how the community could coalesce around a common standard for AI conversations. The Universal AI Conversation Schema proposed in this report is offered as a robust starting point for that critical industry-wide discussion. By providing a common language, we can accelerate the development of more powerful, interoperable, and trustworthy AI systems for everyone.

レポートに使用されているソース

[oxfordsemantic.techWhat is w3c? What are the w3c standards? Why do they matter? - Oxford Semantic Technologies新しいウィンドウで開く](https://www.oxfordsemantic.tech/faqs/what-is-w3c-what-are-the-w3c-standards-why-do-they-matter)[langchain-ai.github.ioLangGraph Multi-Agent Systems - Overview新しいウィンドウで開く](https://langchain-ai.github.io/langgraph/concepts/multi_agent/)[w3.orgAI & the Web: Understanding and managing the impact of Machine Learning models on the Web - W3C新しいウィンドウで開く](https://www.w3.org/reports/ai-web-impact/)[platform.openai.comAPI Reference - OpenAI Platform新しいウィンドウで開く](https://platform.openai.com/docs/api-reference)[w3.orgPreliminary Insights from a Chatbot Accessibility Playbook and Wizard-of-Oz Study - W3C新しいウィンドウで開く](https://www.w3.org/WAI/pages/about/projects/wai-coop/paper107.html)[microsoft.github.ioMulti-agent Conversation Framework | AutoGen 0.2新しいウィンドウで開く](https://microsoft.github.io/autogen/0.2/docs/Use-Cases/agent_chat/)[techifysolutions.comBuilding a Multi-Agent Chatbot with LangGraph: A Collaborative AI Approach新しいウィンドウで開く](https://techifysolutions.com/blog/building-a-multi-agent-chatbot-with-langgraph/)[datatracker.ietf.orgRFC 1459 - Internet Relay Chat Protocol - IETF Datatracker新しいウィンドウで開く](https://datatracker.ietf.org/doc/html/rfc1459)[reddit.comMulti Agent Chat Based System Framework Help! : r/LangChain - Reddit新しいウィンドウで開く](https://www.reddit.com/r/LangChain/comments/1i92z2f/multi_agent_chat_based_system_framework_help/)[stackoverflow.comHow do I format an OpenAI API request in Swift? - Stack Overflow新しいウィンドウで開く](https://stackoverflow.com/questions/79196245/how-do-i-format-an-openai-api-request-in-swift)[medium.comGuide to Multimodal RAG for Images and Text (in 2025) | by Ryan Siegler | KX Systems新しいウィンドウで開く](https://medium.com/kx-systems/guide-to-multimodal-rag-for-images-and-text-10dab36e3117)[docs.pytorch.orgMultimodal Datasets — torchtune 0.4 documentation新しいウィンドウで開く](https://docs.pytorch.org/torchtune/0.4/basics/multimodal_datasets.html)[platform.openai.comResponses vs. Chat Completions - OpenAI API新しいウィンドウで開く](https://platform.openai.com/docs/guides/responses-vs-chat-completions)[docs.anthropic.comCreate a Message Batch - Anthropic API新しいウィンドウで開く](https://docs.anthropic.com/en/api/creating-message-batches)[docs.anthropic.comMessages examples - Anthropic API新しいウィンドウで開く](https://docs.anthropic.com/en/api/messages-examples)[github.comcourses/anthropic_api_fundamentals/02_messages_format.ipynb at master - GitHub新しいウィンドウで開く](https://github.com/anthropics/courses/blob/master/anthropic_api_fundamentals/02_messages_format.ipynb)[ai.google.devStructured output | Gemini API | Google AI for Developers新しいウィンドウで開く](https://ai.google.dev/gemini-api/docs/structured-output)[docs.anthropic.comMessages - Anthropic新しいウィンドウで開く](https://docs.anthropic.com/en/api/messages)[ai.google.devText generation | Gemini API | Google AI for Developers新しいウィンドウで開く](https://ai.google.dev/gemini-api/docs/text-generation)[datatracker.ietf.orgRFC 4975 - The Message Session Relay Protocol (MSRP)新しいウィンドウで開く](https://datatracker.ietf.org/doc/html/rfc4975)[datatracker.ietf.orgRFC 9420 - The Messaging Layer Security (MLS) Protocol新しいウィンドウで開く](https://datatracker.ietf.org/doc/html/rfc9420)[datatracker.ietf.orgRFC 2813 - Internet Relay Chat: Server Protocol - IETF Datatracker新しいウィンドウで開く](https://datatracker.ietf.org/doc/html/rfc2813)[rfc-editor.orgRFC 7701: Multi-party Chat Using the Message Session Relay ...新しいウィンドウで開く](https://www.rfc-editor.org/rfc/rfc7701.html)[beeper.comBeeper — All your chats in one app. Yes, really.新しいウィンドウで開く](https://www.beeper.com/)[gemini-api.apidog.ioStructured output - Google Gemini API新しいウィンドウで開く](https://gemini-api.apidog.io/doc-965858)[pidgin.imPidgin :: Pidgin, the universal chat client新しいウィンドウで開く](https://pidgin.im/)[firebase.google.comGenerate structured output (like JSON and enums) using the Gemini API | Firebase AI Logic新しいウィンドウで開く](https://firebase.google.com/docs/ai-logic/generate-structured-output)[platform.openai.comStructured Outputs - OpenAI API新しいウィンドウで開く](https://platform.openai.com/docs/guides/structured-outputs)[cloud.google.comDesign multimodal prompts | Generative AI on Vertex AI - Google Cloud新しいウィンドウで開く](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/design-multimodal-prompts)[reddit.comStructured Output as JSON with Gemini Models : r/Bard - Reddit新しいウィンドウで開く](https://www.reddit.com/r/Bard/comments/1lc1icd/structured_output_as_json_with_gemini_models/)[firebase.google.comGenerate text using the Gemini API | Firebase AI Logic - Google新しいウィンドウで開く](https://firebase.google.com/docs/ai-logic/generate-text)[platform.openai.comText generation and prompting - OpenAI API新しいウィンドウで開く](https://platform.openai.com/docs/guides/text)[ai.google.devImage understanding | Gemini API | Google AI for Developers新しいウィンドウで開く](https://ai.google.dev/gemini-api/docs/image-understanding)[medium.comBuild Multimodal Chat Assistant with Gemini 2.0 | by Alvin Prayuda Juniarta Dwiyantoro | Google Cloud - Medium新しいウィンドウで開く](https://medium.com/google-cloud/build-multimodal-chat-assistant-with-gemini-2-0-aa04f9007575)[mangeshpise.medium.comOpenAI's Structured Outputs for API Responses | by Mangesh Pise - Medium新しいウィンドウで開く](https://mangeshpise.medium.com/openais-structured-outputs-for-api-responses-6e07d18ac839)[community.openai.comHow exactly does the new messages object work on createChatCompletion - API新しいウィンドウで開く](https://community.openai.com/t/how-exactly-does-the-new-messages-object-work-on-createchatcompletion/343734)[learn.microsoft.comBuild API-based Message Extension - Teams - Learn Microsoft新しいウィンドウで開く](https://learn.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/create-api-message-extension)[learn.microsoft.comCustomize Bot Messages - Teams | Microsoft Learn新しいウィンドウで開く](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/format-your-bot-messages)[discord.comComponent Reference | Documentation | Discord Developer Portal新しいウィンドウで開く](https://discord.com/developers/docs/components/reference)[github.comdiscord-api-docs/docs/interactions/Message_Components.md at main - GitHub新しいウィンドウで開く](https://github.com/discord/discord-api-docs/blob/main/docs/interactions/Message_Components.md)[birdie0.github.ioDiscord Webhooks Guide新しいウィンドウで開く](https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html)[api.slack.comchat.postMessage method - Slack API新しいウィンドウで開く](https://api.slack.com/methods/chat.postMessage)[api.slack.comMessages - Slack API新しいウィンドウで開く](https://api.slack.com/surfaces/messages)[api.slack.comUsing message metadata - Slack API新しいウィンドウで開く](https://api.slack.com/metadata/using)[learn.microsoft.comTypes of Cards & their Usage - Teams | Microsoft Learn新しいウィンドウで開く](https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/what-are-cards)

[](https://t3.gstatic.com/faviconV2?url=https://www.oxfordsemantic.tech/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://langchain-ai.github.io/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://www.w3.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://platform.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://www.w3.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://microsoft.github.io/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://techifysolutions.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://datatracker.ietf.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://www.reddit.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://stackoverflow.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://medium.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://docs.pytorch.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://platform.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://docs.anthropic.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://docs.anthropic.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://github.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://ai.google.dev/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://docs.anthropic.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://ai.google.dev/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://datatracker.ietf.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://datatracker.ietf.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://datatracker.ietf.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://www.rfc-editor.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://www.beeper.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://gemini-api.apidog.io/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://pidgin.im/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://firebase.google.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://platform.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://cloud.google.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://www.reddit.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://firebase.google.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://platform.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://ai.google.dev/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://medium.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://mangeshpise.medium.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://community.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://learn.microsoft.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://learn.microsoft.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://discord.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://github.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://birdie0.github.io/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://api.slack.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://api.slack.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://api.slack.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://learn.microsoft.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

参照されたもののレポートには使用されていないソース

[convai.comConvai - Conversational AI for Virtual Worlds新しいウィンドウで開く](https://www.convai.com/)[community.openai.comFormatting API responses... (theory) - OpenAI Developer Community新しいウィンドウで開く](https://community.openai.com/t/formatting-api-responses-theory/114412)[github.comPolyAI-LDN/conversational-datasets - GitHub新しいウィンドウで開く](https://github.com/PolyAI-LDN/conversational-datasets)[cloud.google.comConversation data format | Conversational Insights Documentation - Google Cloud新しいウィンドウで開く](https://cloud.google.com/contact-center/insights/docs/conversation-data-format)[haystack.deepset.aiIntroduction to Multimodal Text Generation - Haystack - Deepset新しいウィンドウで開く](https://haystack.deepset.ai/cookbook/multimodal_intro)[getzowie.comConversational Data - Zowie新しいウィンドウで開く](https://getzowie.com/glossary/what-is-conversational-data)[docs.vllm.aiMultimodal Inputs - vLLM新しいウィンドウで開く](https://docs.vllm.ai/en/latest/features/multimodal_inputs.html)[learn.microsoft.comConversational language understanding data formats - Azure AI services - Learn Microsoft新しいウィンドウで開く](https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/data-formats)[resources.data.govConcepts & Definitions - Data standards | resources.data.gov新しいウィンドウで開く](https://resources.data.gov/standards/concepts/)[servicenow.comStandard chat - ServiceNow新しいウィンドウで開く](https://www.servicenow.com/docs/bundle/yokohama-conversational-interfaces/page/administer/now-assist-in-va/concept/nava-standard-chat.html)[relevanceai.comData Format Standardization AI Agents - Relevance AI新しいウィンドウで開く](https://relevanceai.com/agent-templates-tasks/data-format-standardization)[docs.anthropic.comOverview - Anthropic API新しいウィンドウで開く](https://docs.anthropic.com/en/api/overview)[developers.google.comFormat messages | Google Chat新しいウィンドウで開く](https://developers.google.com/workspace/chat/format-messages)[cloud.google.comQuickstart: Generate text using the Vertex AI Gemini API - Google Cloud新しいウィンドウで開く](https://cloud.google.com/vertex-ai/generative-ai/docs/start/quickstarts/quickstart-multimodal)[jan.aiJan: Open source ChatGPT-alternative that runs 100% offline - Jan新しいウィンドウで開く](https://jan.ai/)[github.comhuggingface/chat-ui: Open source codebase powering the HuggingChat app - GitHub新しいウィンドウで開く](https://github.com/huggingface/chat-ui)[dev.toHow To Generate Structured Output (JSON, YAML) in Gemini AI - DEV Community新しいウィンドウで開く](https://dev.to/shrsv/how-to-generate-structured-output-json-yaml-in-gemini-ai-2ok0)[platform.openai.comAPI Reference - OpenAI Platform新しいウィンドウで開く](https://platform.openai.com/docs/api-reference/introduction)[medium.comStructured Output with Gemini Models: Begging, Threatening, and JSON-ing | by Saverio Terracciano | Google Cloud - Medium新しいウィンドウで開く](https://medium.com/google-cloud/structured-output-with-gemini-models-begging-borrowing-and-json-ing-f70ffd60eae6)[codelabs.developers.google.comBuild and Deploy Multimodal Assistant on Cloud with Gemini (Python) | Google Codelabs新しいウィンドウで開く](https://codelabs.developers.google.com/devsite/codelabs/gemini-multimodal-chat-assistant-python)[support.microsoft.comFormat a message in Microsoft Teams新しいウィンドウで開く](https://support.microsoft.com/en-us/office/format-a-message-in-microsoft-teams-9f7c64e4-0316-472f-b1e8-430cebcfc1e5)[researchgate.netA Schema-Based Approach to Specifying Conversation Policies - ResearchGate新しいウィンドウで開く](https://www.researchgate.net/publication/221038675_A_Schema-Based_Approach_to_Specifying_Conversation_Policies)[support.microsoft.comUse Markdown formatting in Microsoft Teams新しいウィンドウで開く](https://support.microsoft.com/en-us/office/use-markdown-formatting-in-microsoft-teams-4d10bd65-55e2-4b2d-a1f3-2bebdcd2c772)[obssr.od.nih.govConversation Analysis | OBSSR新しいウィンドウで開く](https://obssr.od.nih.gov/sites/obssr/files/Conversation-Analysis.pdf)[ibm.comTeams Chat Data Types - IBM新しいウィンドウで開く](https://www.ibm.com/docs/en/spfc?topic=types-teams-chat-data)[tandfonline.comFull article: Inter-annotator Agreement Using the Conversation Analysis Modelling Schema, for Dialogue新しいウィンドウで開く](https://www.tandfonline.com/doi/full/10.1080/19312458.2021.2020229)[tandfonline.comInter-annotator Agreement Using the Conversation Analysis Modelling Schema, for Dialogue - Taylor & Francis Online: Peer-reviewed Journals新しいウィンドウで開く](https://www.tandfonline.com/doi/abs/10.1080/19312458.2021.2020229)[discord.comAPI Reference | Documentation | Discord Developer Portal新しいウィンドウで開く](https://discord.com/developers/docs/reference)[arxiv.orgTowards Scalable Multi-Domain Conversational Agents: The Schema-Guided Dialogue Dataset - arXiv新しいウィンドウで開く](https://arxiv.org/pdf/1909.05855)[support.discord.comMarkdown Text 101 (Chat Formatting: Bold, Italic, Underline) - Discord Support新しいウィンドウで開く](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline)[api.slack.comSend or schedule a message - Slack API新しいウィンドウで開く](https://api.slack.com/messaging/sending)[api.slack.comsend_message Function - Slack API新しいウィンドウで開く](https://api.slack.com/reference/functions/send_message)[platform.openai.comOpenAI Chat Completion API - OpenAI Platform新しいウィンドウで開く](https://platform.openai.com/docs/api-reference/chat/create)[discord.comDiscord for Developers - Discord Developer Portal新しいウィンドウで開く](https://discord.com/developers/docs/resources/channel#message-object)[arxiv.orgTowards Scalable Multi-Domain Conversational Agents: The ... - arXiv新しいウィンドウで開く](https://arxiv.org/abs/1909.05855)[api.slack.comFormatting text for app surfaces | Slack新しいウィンドウで開く](https://api.slack.com/messaging/composing/layouts)[github.comtinode/chat: Instant messaging platform. Backend in Go ... - GitHub新しいウィンドウで開く](https://github.com/tinode/chat)

[](https://t3.gstatic.com/faviconV2?url=https://www.convai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://community.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://github.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://cloud.google.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://haystack.deepset.ai/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://getzowie.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://docs.vllm.ai/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://learn.microsoft.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://resources.data.gov/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://www.servicenow.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://relevanceai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://docs.anthropic.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://developers.google.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://cloud.google.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://jan.ai/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://github.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://dev.to/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://platform.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://medium.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://codelabs.developers.google.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://support.microsoft.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://www.researchgate.net/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://support.microsoft.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://obssr.od.nih.gov/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://www.ibm.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://www.tandfonline.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t3.gstatic.com/faviconV2?url=https://www.tandfonline.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://discord.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://arxiv.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://support.discord.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://api.slack.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://api.slack.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://platform.openai.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t0.gstatic.com/faviconV2?url=https://discord.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://arxiv.org/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t2.gstatic.com/faviconV2?url=https://api.slack.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

[](https://t1.gstatic.com/faviconV2?url=https://github.com/&client=BARD&type=FAVICON&size=256&fallback_opts=TYPE,SIZE,URL)

思考プロセス