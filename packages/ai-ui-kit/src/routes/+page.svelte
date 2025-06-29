<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import ChatView from "$lib/components/chat-view/chat-view.svelte";
  import type { ChatMessage } from "$lib/components/chat-view/types/chat.js";

  // Icons
  import MessageCircle from "lucide-svelte/icons/message-circle";
  import Zap from "lucide-svelte/icons/zap";
  import Palette from "lucide-svelte/icons/palette";
  import Code from "lucide-svelte/icons/code";
  import Github from "lucide-svelte/icons/github";
  import ExternalLink from "lucide-svelte/icons/external-link";
  import Network from "lucide-svelte/icons/network";
  import Volume2 from "lucide-svelte/icons/volume-2";
  import Settings from "lucide-svelte/icons/settings";

  // Demo chat messages
  let demoMessages: ChatMessage[] = [
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! 👋 Welcome to the AI UI Kit ChatView component. I'm here to demonstrate the interactive features.",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "user",
      content: "This looks amazing! What features does it include?",
      timestamp: new Date(),
    },
    {
      id: "3",
      role: "assistant",
      content:
        "Great question! The ChatView component includes:\n\n• **Real-time messaging** with user and assistant roles\n• **Interactive buttons** for copy, thumbs up/down, audio playback\n• **Customizable header** with participant status\n• **Voice recording** support\n• **Tool integration** capabilities\n• **Responsive design** that works on all devices\n\nTry hovering over my messages to see the action buttons!",
      timestamp: new Date(),
    },
  ];

  function handleSendMessage(message: string) {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    demoMessages = [...demoMessages, userMessage];

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! The ChatView component is designed to be highly customizable and easy to integrate.",
        "I love your enthusiasm! Feel free to explore all the interactive features.",
        "Thanks for trying out the demo! The component supports many advanced features out of the box.",
        "Excellent! You can customize the appearance, add your own handlers, and integrate with any AI service.",
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      demoMessages = [...demoMessages, aiMessage];
    }, 1000);
  }

  function handleCopyMessage(messageId: string) {
    console.log("Copy message:", messageId);
  }

  function handleThumbsUp(messageId: string) {
    console.log("Thumbs up:", messageId);
  }

  function handleThumbsDown(messageId: string) {
    console.log("Thumbs down:", messageId);
  }

  function handlePlayAudio(messageId: string) {
    console.log("Play audio:", messageId);
  }

  function handleRegenerate(messageId: string) {
    console.log("Regenerate:", messageId);
  }

  function handleDownload(messageId: string) {
    console.log("Download:", messageId);
  }

  function handleToolsClick() {
    console.log("Tools clicked");
  }

  function handleCallClick() {
    console.log("Call clicked");
  }

  function handleSearchClick() {
    console.log("Search clicked");
  }

  function handleMoreClick() {
    console.log("More clicked");
  }
</script>

<!-- Hero Section -->
<div
  class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
>
  <!-- Navigation -->
  <nav class="container mx-auto px-6 py-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg"
        >
          <MessageCircle class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white"
          >AI UI Kit</span
        >
      </div>
      <div class="flex items-center gap-4">
        <Button variant="ghost" href="/chat-demo">
          <ExternalLink class="w-4 h-4" />
          Chat Demo
        </Button>
        <Button variant="ghost" href="/knowledge-graph-demo">
          <Network class="w-4 h-4" />
          Graph Demo
        </Button>
        <Button variant="outline" href="https://github.com/walker-di/walker">
          <Github class="w-4 h-4" />
          GitHub
        </Button>
      </div>
    </div>
  </nav>

  <!-- Hero Content -->
  <div class="container mx-auto px-6 py-16">
    <div class="text-center max-w-4xl mx-auto">
      <Badge variant="secondary" class="mb-6">
        <Zap class="w-3 h-3" />
        New ChatView Component
      </Badge>

      <h1
        class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
      >
        Beautiful Chat Interfaces
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
        >
          Made Simple
        </span>
      </h1>

      <p
        class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
      >
        Build stunning AI chat interfaces with our comprehensive UI kit. Fully
        customizable, accessible, and ready for production.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" href="#demo">
          <MessageCircle class="w-5 h-5" />
          Try Interactive Demo
        </Button>
        <Button variant="outline" size="lg" href="#features">
          <Code class="w-5 h-5" />
          View Features
        </Button>
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<section id="features" class="py-20 bg-white dark:bg-gray-800">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Everything You Need
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Our ChatView component comes packed with features to build professional
        chat interfaces
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div
            class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4"
          >
            <MessageCircle class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Real-time Messaging</CardTitle>
          <CardDescription>
            Support for user and assistant messages with timestamps and status
            indicators
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div
            class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4"
          >
            <Settings class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle>Interactive Actions</CardTitle>
          <CardDescription>
            Copy, like/dislike, audio playback, regenerate, and download
            functionality built-in
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div
            class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4"
          >
            <Palette class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>Fully Customizable</CardTitle>
          <CardDescription>
            Customize colors, layout, participants, and behavior to match your
            brand
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div
            class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4"
          >
            <Volume2 class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle>Voice Support</CardTitle>
          <CardDescription>
            Built-in voice recording capabilities with visual feedback and
            controls
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div
            class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4"
          >
            <Zap class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle>Performance Optimized</CardTitle>
          <CardDescription>
            Efficient rendering and smooth scrolling even with thousands of
            messages
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div
            class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4"
          >
            <Code class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <CardTitle>Developer Friendly</CardTitle>
          <CardDescription>
            TypeScript support, comprehensive documentation, and easy
            integration
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</section>

<!-- Interactive Demo Section -->
<section id="demo" class="py-20 bg-gray-50 dark:bg-gray-900">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Try It Yourself
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Experience the ChatView component in action. Send messages, try the
        interactive features, and see how smooth it feels.
      </p>
    </div>

    <div class="max-w-4xl mx-auto">
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div class="h-[600px]">
          <ChatView
            messages={demoMessages}
            chatTitle="AI UI Kit Demo"
            participants={[
              { id: "1", name: "Demo Assistant", isOnline: true },
              { id: "2", name: "You", isOnline: true },
            ]}
            placeholder="Try typing a message..."
            showTools={true}
            onSendMessage={handleSendMessage}
            onCopyMessage={handleCopyMessage}
            onThumbsUp={handleThumbsUp}
            onThumbsDown={handleThumbsDown}
            onPlayAudio={handlePlayAudio}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
            onToolsClick={handleToolsClick}
            onCallClick={handleCallClick}
            onSearchClick={handleSearchClick}
            onMoreClick={handleMoreClick}
          />
        </div>
      </div>

      <div class="text-center mt-8">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          💡 Hover over assistant messages to see interactive buttons
        </p>
        <Button href="/chat-demo" variant="outline">
          <ExternalLink class="w-4 h-4" />
          Open Full Demo
        </Button>
      </div>
    </div>
  </div>
</section>

<!-- Getting Started Section -->
<section class="py-20 bg-white dark:bg-gray-800">
  <div class="container mx-auto px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Get Started in Minutes
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Install the package and start building beautiful chat interfaces right
          away
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <Card class="border-0 shadow-lg">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span
                class="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold"
                >1</span
              >
              Install the Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm"
            >
              <code>npm install @your-org/ai-ui-kit</code>
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 shadow-lg">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span
                class="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold"
                >2</span
              >
              Import and Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm"
            >
              <code class="text-gray-800 dark:text-gray-200">
                import &#123; ChatView &#125; from '@your-org/ai-ui-kit';<br />
                &lt;ChatView messages=&#123;messages&#125; /&gt;
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="text-center mt-12">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" href="https://github.com/walker-di/walker">
            <Github class="w-5 h-5" />
            View on GitHub
          </Button>
          <Button variant="outline" size="lg" href="/chat-demo">
            <ExternalLink class="w-5 h-5" />
            Explore Documentation
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="py-12 bg-gray-900 text-white">
  <div class="container mx-auto px-6">
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="flex items-center gap-2 mb-4 md:mb-0">
        <div
          class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg"
        >
          <MessageCircle class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-bold">AI UI Kit</span>
      </div>

      <div class="flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          href="https://github.com/walker-di/walker"
        >
          <Github class="w-4 h-4" />
          GitHub
        </Button>
        <Button variant="ghost" size="sm" href="/chat-demo">
          <ExternalLink class="w-4 h-4" />
          Demo
        </Button>
      </div>
    </div>

    <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
      <p>&copy; 2024 AI UI Kit. Built with SvelteKit and Tailwind CSS.</p>
    </div>
  </div>
</footer>
