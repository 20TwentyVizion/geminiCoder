import { useChat } from "ai/react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";

export function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model: "gemini-pro",
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <ChatMessage
            key={m.id}
            message={m}
            isLoading={i === messages.length - 1 && isLoading}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <ChatInput
          onSubmit={(message) => {
            handleSubmit(new Event("submit") as any);
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
