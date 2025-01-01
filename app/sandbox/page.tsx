"use client";

import { useState } from "react";
import CodeViewer from "@/components/code-viewer";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import LoadingDots from "@/components/loading-dots";

export default function SandboxPage() {
  const [code, setCode] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/iterative-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          currentCode: code,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update code");
      }

      const data = await res.json();
      setCode(data.updatedCode);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Code updated successfully!" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Failed to update code. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 bg-black text-white">
      <div className="flex w-full gap-4">
        {/* Left: Chat Interface */}
        <div className="w-1/3 flex flex-col h-[calc(100vh-3rem)] border border-[var(--primary-gold)] rounded-lg p-4">
          <div className="flex-grow overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-[var(--primary-gold)]/10 border border-[var(--primary-gold)]/30"
                    : "bg-[var(--secondary-gold)]/10 border border-[var(--secondary-gold)]/30"
                }`}
              >
                <div className="font-medium mb-1">
                  {message.role === "user" ? "You" : "Assistant"}:
                </div>
                <div className="text-sm">{message.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your code changes..."
              className="w-full p-3 rounded-lg bg-black border border-[var(--primary-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-gold)] resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                loading || !prompt.trim()
                  ? "bg-[var(--primary-gold)]/30 cursor-not-allowed"
                  : "bg-[var(--primary-gold)] hover:bg-[var(--primary-gold)]/90"
              }`}
            >
              {loading ? (
                <LoadingDots />
              ) : (
                <>
                  Update Code
                  <ArrowLongRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Code Editor */}
        <div className="w-2/3">
          <CodeViewer
            code={code}
            showEditor={true}
            onCodeChange={(newCode) => setCode(newCode)}
          />
        </div>
      </div>
    </div>
  );
}
