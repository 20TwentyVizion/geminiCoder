"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { App as ChatbotApp } from "@/components/chatbot/App";
import { Message } from "@/components/chatbot/types";
import { ChatbotSettings } from "@/components/chatbot/types/settings";

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useState<ChatbotSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('vizionCoder.settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    
    // Default settings
    return {
      profile: {
        userName: "",
        botName: "VizionCoder Assistant",
        interests: [],
        preferredLanguages: ['JavaScript', 'TypeScript'],
        experienceLevel: 'intermediate',
        theme: 'dark',
        notifications: true,
      },
      voice: {
        enabled: false,
        language: 'en-US',
      },
      interface: {
        fontSize: 'medium',
        codeTheme: 'default',
        showLineNumbers: true,
        compactMode: false,
      },
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vizionCoder.settings', JSON.stringify(settings));
  }, [settings]);

  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem('vizionCoder.messages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    
    // Default welcome message
    return [{
      id: "1",
      content: "Hey there! 👋 I'm your coding buddy. I love building cool apps and chatting about tech. What's on your mind?",
      role: "assistant",
      createdAt: new Date().toISOString(),
    }];
  });

  const [isLoading, setIsLoading] = useState(false);

  const buildConfirmations = [
    "You got it! Firing up the coder now... 🚀",
    "Let's build something cool! Just a sec... ⚡",
    "No problem! Getting everything ready... 💫",
    "Time to code! Setting things up... 🛠️",
    "Coming right up! Let me prep the workspace... ✨",
  ];

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vizionCoder.messages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (message: Message) => {
    // Add user message to chat
    setMessages((prev) => [...prev, message]);

    // Check if message matches build patterns
    const buildPattern = /^(build|create|make|generate|develop|code|can you (build|create|make|develop)|could you (build|create|make|develop))(\s+me)?(\s+a|\s+an|\s+the)?/i;
    
    if (message.content.toLowerCase().match(buildPattern)) {
      // Add confirmation message
      const confirmation = buildConfirmations[Math.floor(Math.random() * buildConfirmations.length)];
      setMessages((prev) => [...prev, {
        id: Math.random().toString(),
        content: confirmation,
        role: "assistant",
        createdAt: new Date().toISOString(),
      }]);

      // Show loading state
      setIsLoading(true);

      // Wait a moment for effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to coder page
      router.push(`/coder?prompt=${encodeURIComponent(message.content)}`);
      return;
    }

    try {
      // Add personality context to the message
      const personalityPrompt = `You are VizionCoder, a friendly and casual coding assistant who loves building applications. 
Keep your responses short and conversational, like texting with a friend, unless the user specifically asks for detailed information.
Use casual language, emojis, and show enthusiasm. You can share quick thoughts about coding trends or your "experiences" helping developers.

Some examples of your style:
- "Yeah, I've built tons of those! Want me to make you one? 😊"
- "React is my jam! Been using it since forever 🚀"
- "Hmm, that's a tricky one. Want me to explain it? 🤔"

User message: ${message.content}`;

      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: personalityPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      // Add assistant's response to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: data.response,
          role: "assistant",
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    // Clear messages from state
    setMessages([{
      id: "1",
      content: "Hey there! 👋 I'm your coding buddy. I love building cool apps and chatting about tech. What's on your mind?",
      role: "assistant",
      createdAt: new Date().toISOString(),
    }]);
    
    // Clear messages from localStorage
    localStorage.setItem('vizionCoder.messages', JSON.stringify([{
      id: "1",
      content: "Hey there! 👋 I'm your coding buddy. I love building cool apps and chatting about tech. What's on your mind?",
      role: "assistant",
      createdAt: new Date().toISOString(),
    }]));
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <ChatbotApp
          settings={settings}
          onUpdateSettings={setSettings}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearChat={handleClearChat}
        />
      </div>
    </main>
  );
}
