"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import LoadingDots from "../../components/loading-dots";
import Link from "next/link";

function removeCodeFormatting(code: string): string {
  return code.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, '$1').trim();
}

export default function CoderPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated" | "error"
  >("initial");
  let [prompt, setPrompt] = useState(initialPrompt);
  let [errorMessage, setErrorMessage] = useState("");
  let models = [
    {
      label: "gemini-2.0-flash-exp",
      value: "gemini-2.0-flash-exp",
    },
    {
      label: "gemini-1.5-pro",
      value: "gemini-1.5-pro",
    },
    {
      label: "gemini-1.5-flash",
      value: "gemini-1.5-flash",
    }
  ];
  let [model, setModel] = useState(models[0].value);
  let [shadcn, setShadcn] = useState(false);
  let [generatedCode, setGeneratedCode] = useState("");
  let [initialAppConfig, setInitialAppConfig] = useState({
    model: "",
    shadcn: true,
  });
  let [ref, scrollTo] = useScrollTo();
  let [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  let loading = status === "creating" || status === "updating";

  // Auto-submit if we have an initial prompt
  useEffect(() => {
    if (searchParams.get("prompt")) {
      createApp(new Event("submit") as any);
    }
  }, []);

  async function createApp(e: any) {
    e.preventDefault();

    if (status !== "initial") {
      scrollTo({ delay: 0.5 });
    }

    setStatus("creating");
    setGeneratedCode("");
    setErrorMessage("");

    try {
      let res = await fetch("/api/generateCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          shadcn,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText || "Failed to generate code");
      }

      if (!res.body) {
        throw new Error("No response body received");
      }

      const reader = res.body.getReader();
      let receivedData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        receivedData += new TextDecoder().decode(value);
        const cleanedData = removeCodeFormatting(receivedData);
        setGeneratedCode(cleanedData);
      }

      setMessages([{ role: "user", content: prompt }]);
      setInitialAppConfig({ model, shadcn });
      setStatus("created");
    } catch (error) {
      console.error("Error generating code:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setStatus("error");
    }
  }

  useEffect(() => {
    let el = document.querySelector(".cm-scroller");
    if (el && loading) {
      let end = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: end });
    }
  }, [loading, generatedCode]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLongLeftIcon className="h-5 w-5" />
          Back to Chat
        </Link>

        {/* Prompt Section */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={createApp}>
            <fieldset disabled={loading} className="space-y-4">
              <div>
                <div className="flex rounded-md">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to build..."
                    className="block w-full rounded-l-md border-0 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-white dark:bg-gray-800 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="submit"
                    disabled={loading || !prompt}
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-6 py-3 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <LoadingDots />
                    ) : (
                      <>
                        Build
                        <ArrowLongRightIcon className="-mr-0.5 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select.Root value={model} onValueChange={setModel}>
                    <Select.Trigger className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDownIcon className="h-5 w-5" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700">
                        <Select.Viewport>
                          {models.map((model) => (
                            <Select.Item
                              key={model.value}
                              value={model.value}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                            >
                              <Select.ItemText>{model.label}</Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon className="h-4 w-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="flex items-center gap-2">
                  <Switch.Root
                    checked={shadcn}
                    onCheckedChange={setShadcn}
                    className="bg-gray-200 dark:bg-gray-700 relative inline-flex h-6 w-11 items-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed data-[state=checked]:bg-blue-500"
                  >
                    <Switch.Thumb className="block h-4 w-4 rounded-full bg-white transition-transform duration-100 translate-x-1 will-change-transform data-[state=checked]:translate-x-6" />
                  </Switch.Root>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Use shadcn/ui
                  </span>
                </div>
              </div>
            </fieldset>
          </form>

          {errorMessage && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error generating code
                  </h3>
                  <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Code and Preview Section */}
        {status !== "initial" && (
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: "auto",
              overflow: "hidden",
              transitionEnd: { overflow: "visible" },
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="w-full"
            onAnimationComplete={() => scrollTo()}
            ref={ref}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="relative w-full">
                <div className="isolate">
                  <CodeViewer code={generatedCode} showEditor />
                </div>

                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={status === "updating" ? { x: "100%" } : undefined}
                      animate={status === "updating" ? { x: "0%" } : undefined}
                      exit={{ x: "100%" }}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.85,
                        delay: 0.5,
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-lg"
                    >
                      <p className="animate-pulse text-3xl font-bold text-gray-900 dark:text-white">
                        {status === "creating"
                          ? "Building your app..."
                          : "Updating your app..."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
