"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import LoadingDots from "../../components/loading-dots";

function removeCodeFormatting(code: string): string {
  return code.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, '$1').trim();
}

export default function CoderPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated"
  >("initial");
  let [prompt, setPrompt] = useState(initialPrompt);
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
    if (initialPrompt && status === "initial") {
      createApp(new Event("submit") as any);
    }
  }, [initialPrompt]);

  async function createApp(e: any) {
    e.preventDefault();

    if (status !== "initial") {
      scrollTo({ delay: 0.5 });
    }

    setStatus("creating");
    setGeneratedCode("");

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
      throw new Error(res.statusText);
    }

    if (!res.body) {
      throw new Error("No response body");
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
  }

  useEffect(() => {
    let el = document.querySelector(".cm-scroller");
    if (el && loading) {
      let end = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: end });
    }
  }, [loading, generatedCode]);

  return (
    <main className="mt-12 flex w-full flex-1 flex-col items-center px-4 text-center sm:mt-1">
      <h1 className="mb-4 text-xl text-[var(--secondary-gold)]">
        An AI Coding Assistant - Powered by Google Gemini
      </h1>
      
      <p className="mb-8 max-w-2xl text-sm text-[var(--secondary-gold)]/80">
        Currently in alpha, this tool generates code based on a single prompt. Interactive code editing and modifications are planned for future updates. 
        Best suited for basic projects like calculators, todo lists, simple web layouts, and basic UI components.
      </p>

      <form className="w-full max-w-xl" onSubmit={createApp}>
        <fieldset disabled={loading} className="disabled:opacity-75">
          <div className="relative mt-5">
            <div className="absolute -inset-2 rounded-[32px] bg-[var(--primary-gold)]/10" />
            <div className="relative flex rounded-3xl bg-[var(--dark-surface)] border border-[var(--primary-gold)] shadow-sm">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  name="prompt"
                  className="w-full resize-none rounded-l-3xl bg-transparent px-6 py-5 text-lg text-[var(--primary-gold)] placeholder-[var(--secondary-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary-gold)]"
                  placeholder="What would you like me to build?"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-3xl px-3 py-2 text-sm font-semibold text-[var(--primary-gold)] hover:text-[var(--secondary-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary-gold)] disabled:text-gray-500"
              >
                {status === "creating" ? (
                  <LoadingDots color="#FFD700" style="small" />
                ) : (
                  <ArrowLongRightIcon className="-ml-0.5 size-6" />
                )}
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center justify-between gap-3 sm:justify-center">
              <p className="text-gray-500 sm:text-xs">Model:</p>
              <Select.Root
                name="model"
                disabled={loading}
                value={model}
                onValueChange={(value) => setModel(value)}
              >
                <Select.Trigger className="group flex w-60 max-w-xs items-center rounded-2xl border-[6px] border-gray-300 bg-white px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                  <Select.Value />
                  <Select.Icon className="ml-auto">
                    <ChevronDownIcon className="size-6 text-gray-300 group-focus-visible:text-gray-500 group-enabled:group-hover:text-gray-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg">
                    <Select.Viewport className="p-2">
                      {models.map((model) => (
                        <Select.Item
                          key={model.value}
                          value={model.value}
                          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none"
                        >
                          <Select.ItemText asChild>
                            <span className="inline-flex items-center gap-2 text-gray-500">
                              <div className="size-2 rounded-full bg-green-500" />
                              {model.label}
                            </span>
                          </Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <CheckIcon className="size-5 text-blue-600" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                    <Select.Arrow />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="flex h-full items-center justify-between gap-3 sm:justify-center">
              <p className="text-gray-500 sm:text-xs">Use shadcn/ui:</p>
              <Switch.Root
                name="shadcn"
                checked={shadcn}
                onCheckedChange={setShadcn}
                disabled={loading}
                className="relative h-9 w-16 rounded-lg border-[6px] border-gray-300 bg-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              >
                <Switch.Thumb className="size-7 rounded-lg bg-gray-200 shadow-[0_1px_2px] shadow-gray-400 transition data-[state=checked]:translate-x-7 data-[state=checked]:bg-white data-[state=checked]:shadow-gray-600" />
              </Switch.Root>
            </div>
          </div>
        </fieldset>
      </form>

      <hr className="border-1 mb-20 h-px bg-gray-700 dark:bg-gray-700" />

      {status !== "initial" && (
        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: "auto",
            overflow: "hidden",
            transitionEnd: { overflow: "visible" },
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="w-full pb-[25vh] pt-1"
          onAnimationComplete={() => scrollTo()}
          ref={ref}
        >
          <div className="relative mt-8 w-full overflow-hidden">
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
                  className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center rounded-r border border-gray-400 bg-gradient-to-br from-gray-100 to-gray-300 md:inset-y-0 md:left-1/2 md:right-0"
                >
                  <p className="animate-pulse text-3xl font-bold">
                    {status === "creating"
                      ? "Building your app..."
                      : "Updating your app..."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </main>
  );
}