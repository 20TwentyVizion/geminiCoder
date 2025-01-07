"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { App as ChatbotApp } from "../ext/Modular Chatbot MVP/src/App";
import { MessageService } from "../ext/Modular Chatbot MVP/src/services/message/messageService";
import { Message } from "../ext/Modular Chatbot MVP/src/types";
import { ChatbotSettings } from "../ext/Modular Chatbot MVP/src/types/settings";

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
      // Handle normal chat messages
      await MessageService.handleMessage(content, settings, addMessage);
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
