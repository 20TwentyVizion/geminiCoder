"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { App as ChatbotApp } from "@/components/chatbot/App";
import { Message } from "@/components/chatbot/types";
import { ChatbotSettings } from "@/components/chatbot/types/settings";

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useState<ChatbotSettings>({
    profile: {
      name: "",
      botName: "VizionCoder Assistant",
    },
    theme: {
      mode: "dark",
      wallpaper: "",
    },
    voice: {
      enabled: false,
      voice: null,
    },
  });

  // Custom message handler that detects "Build me a" commands
  const handleMessage = async (content: string, addMessage: (message: Message) => void) => {
    // Add user message
    addMessage({
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    });

    if (content.toLowerCase().startsWith("build me a")) {
      // Add bot response
      addMessage({
        id: (Date.now() + 1).toString(),
        content: "Taking you to VizionCoder to build your request...",
        sender: "bot",
        timestamp: new Date().toISOString(),
      });

      // Redirect to coder page with the prompt
      const prompt = content.slice("build me a".length).trim();
      setTimeout(() => {
        router.push(`/coder?prompt=${encodeURIComponent(prompt)}`);
      }, 1500);
    } else {
      // Add default response for non-build messages
      addMessage({
        id: (Date.now() + 1).toString(),
        content: "I'm your coding assistant. Start your message with 'Build me a' to create something! For example: 'Build me a todo list app with dark mode'",
        sender: "bot",
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <ChatbotApp 
        initialSettings={settings}
        onMessageSend={handleMessage}
      />
    </main>
  );
}
