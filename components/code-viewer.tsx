"use client";

import * as shadcnComponents from "@/utils/shadcn";
import { Sandpack, SandpackFiles } from "@codesandbox/sandpack-react";
import {
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react/unstyled";
import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";
import dedent from "dedent";
import "./code-viewer.css";

interface CodeViewerProps {
  code: string;
  showEditor?: boolean;
  onCodeChange?: (newCode: string) => void;
}

const sharedOptions = {
  theme: draculaTheme,
  resizablePanels: true,
  editorWidthPercentage: 60,
};

const sharedProps = {
  template: "react-ts",
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

export default function CodeViewer({
  code,
  showEditor = false,
  onCodeChange,
}: CodeViewerProps) {
  const handleFileChange = (files: SandpackFiles) => {
    if (onCodeChange && files["/App.tsx"]) {
      onCodeChange(files["/App.tsx"].code);
    }
  };

  return showEditor ? (
    <Sandpack
      options={{
        showNavigator: true,
        editorHeight: "80vh",
        showTabs: false,
        ...sharedOptions,
      }}
      files={{
        "/App.tsx": code,
        ...sharedFiles,
      }}
      {...sharedProps}
      filesSyncData={{
        subscribeOnFileChange: true,
      }}
      onFileChange={handleFileChange}
    />
  ) : (
    <SandpackProvider
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
