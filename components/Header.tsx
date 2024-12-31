import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.svg";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-[var(--primary-gold)]">Vizion</span>
        <span className="text-xl font-bold text-white">Coder</span>
        <span className="text-xs text-[var(--secondary-gold)]">Alpha</span>
      </div>
      <a
        className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-gold)] px-4 py-1 text-sm text-[var(--primary-gold)] transition-colors hover:bg-[var(--primary-gold)]/10"
        href="https://ai.google.dev/gemini-api/docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        Powered by Gemini API
      </a>
    </header>
  );
}
