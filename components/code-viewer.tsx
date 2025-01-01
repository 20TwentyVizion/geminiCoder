"use client";

import React from "react";
import * as shadcnComponents from "@/utils/shadcn";
import { 
  Sandpack, 
  SandpackFiles, 
  SandpackProvider, 
  SandpackPreview,
  SandpackCodeEditor,
  SandpackLayout,
  useActiveCode,
  useSandpack,
  SandpackPredefinedTemplate
} from "@codesandbox/sandpack-react";
import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";
import dedent from "dedent";
import "./code-viewer.css";

interface CodeViewerProps {
  code: string;
  showEditor?: boolean;
  onCodeChange?: (newCode: string) => void;
}

const TEMPLATE: SandpackPredefinedTemplate = "react-ts";

const sharedOptions = {
  theme: draculaTheme,
  resizablePanels: true,
  editorWidthPercentage: 60,
};

const sharedProps = {
  template: TEMPLATE,
  customSetup: {
    dependencies: {
      "@radix-ui/react-icons": "^1.3.0",
      "@radix-ui/themes": "^2.0.0",
      "@radix-ui/react-slot": "^1.0.2",
      "class-variance-authority": "^0.7.0",
      "tailwind-merge": "^2.0.0",
      "clsx": "^2.0.0",
    },
  },
};

const sharedFiles = {
  "/styles.css": dedent`
    @import '@radix-ui/themes/styles.css';
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `,
  "/index.tsx": dedent`
    import { StrictMode } from "react";
    import { createRoot } from "react-dom/client";
    import App from "./App";
    import "./styles.css";
    import { Theme } from "@radix-ui/themes";
    
    const root = createRoot(document.getElementById("root")!);
    root.render(
      <StrictMode>
        <Theme>
          <App />
        </Theme>
      </StrictMode>
    );
  `,
};

function CodeEditorWithChangeHandler({ onCodeChange }: { onCodeChange?: (code: string) => void }) {
  const { code } = useActiveCode();

  React.useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  return <SandpackCodeEditor />;
}

export default function CodeViewer({
  code,
  showEditor = false,
  onCodeChange,
}: CodeViewerProps) {
  return showEditor ? (
    <SandpackProvider
      template={TEMPLATE}
      theme={draculaTheme}
      files={{
        "/App.tsx": code,
        ...sharedFiles,
      }}
      options={{
        ...sharedOptions,
        showNavigator: true,
        showTabs: false,
      }}
      {...sharedProps}
    >
      <SandpackLayout>
        <CodeEditorWithChangeHandler onCodeChange={onCodeChange} />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  ) : (
    <SandpackProvider
      template={TEMPLATE}
      files={{
        "/App.tsx": code,
        ...sharedFiles,
      }}
      className="flex h-full w-full grow flex-col justify-center"
      options={{ ...sharedOptions }}
      {...sharedProps}
    >
      <SandpackPreview
        className="flex h-full w-full grow flex-col justify-center p-4 md:pt-16"
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
      />
    </SandpackProvider>
  );
}
