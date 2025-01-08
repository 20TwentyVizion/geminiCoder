import { UserIcon } from "@heroicons/react/24/outline";
import { ChatCompletionMessage } from "ai";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export function ChatMessage({
  message,
  isLoading,
}: {
  message: ChatCompletionMessage;
  isLoading?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md ${
          isUser ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        {isUser ? (
          <UserIcon className="h-5 w-5 text-white" />
        ) : (
          <div className="font-semibold text-gray-500">AI</div>
        )}
      </div>
      <div
        className={`relative flex-1 space-y-2 overflow-hidden rounded-lg border px-4 py-3 ${
          isUser
            ? "border-blue-100 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800"
        }`}
      >
        <ReactMarkdown
          components={{
            pre: ({ node, ...props }) => (
              <div className="overflow-auto rounded-lg bg-black/10 p-2">
                <pre {...props} />
              </div>
            ),
            code: ({ node, ...props }) => (
              <code className="rounded bg-black/10 px-1 py-0.5" {...props} />
            ),
          }}
          className="prose prose-sm max-w-none dark:prose-invert"
        >
          {message.content}
        </ReactMarkdown>
        {isLoading && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
