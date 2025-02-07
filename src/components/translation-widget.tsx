"use client";

import React, { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CopyButton } from "@/components/translation/copy-button";
import { ModelSelect } from "@/components/translation/model-select";
import { Logo } from "@/components/ui/logo";
import { useTranslationStore } from "@/stores/translation-store";
import { useClipboardStore } from "@/stores/clipboard-store";
import { useTranslation } from "@/hooks/use-translation";
import { handleTranslationKeyDown } from "@/utils/keyboard";

export default function TranslationWidget() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // Global state
  const { shouldAnimateLogo, resetTranslation } = useTranslationStore();
  const { showToast } = useClipboardStore();

  // Custom hooks
  const { isLoading, translatedText, append, setChatMessages } =
    useTranslation();

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleTranslate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    try {
      await append({
        content: inputText,
        role: "user",
      });
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const handleReset = () => {
    setInputText("");
    resetTranslation();
    setChatMessages([]);
    textareaRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      data-test="translation-widget"
    >
      {/* Controls */}
      <div
        className="flex h-16 shrink-0 items-center border-b border-zinc-100 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80"
        data-test="nav-controls"
      >
        <ThemeToggle />
        <ModelSelect />
        <Logo
          onReset={handleReset}
          shouldAnimate={shouldAnimateLogo || isLoading}
        />
        {translatedText && <CopyButton text={translatedText} />}
      </div>

      {/* Main content */}
      <div className="relative flex flex-1 flex-col md:flex-row">
        {/* Left panel - Source text */}
        <div
          className="flex h-[calc(50vh-32px)] w-full flex-col border-b border-zinc-100 dark:border-zinc-800 md:h-[calc(100vh-64px)] md:w-1/2 md:border-b-0"
          data-test="source-panel"
        >
          <form onSubmit={handleTranslate} className="h-full">
            <textarea
              ref={textareaRef}
              data-test="source-input"
              className="scrollbar-thin h-full w-full resize-none overflow-y-auto bg-transparent px-4 py-4 text-lg focus:outline-none dark:placeholder:text-zinc-600 md:px-8"
              value={inputText}
              placeholder="Input here..."
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleTranslationKeyDown(
                  e,
                  isComposing,
                  () => void handleTranslate(),
                )
              }
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              autoFocus
            />
          </form>
        </div>

        {/* Center divider - Only show on desktop */}
        <div
          className="absolute left-1/2 top-0 hidden h-full w-[1px] -translate-x-1/2 bg-zinc-100 dark:bg-zinc-800 md:block"
          data-test="center-divider"
        />

        {/* Right panel - Translation result */}
        <div
          className="scrollbar-thin flex h-[calc(50vh-32px)] w-full flex-col overflow-auto md:h-[calc(100vh-64px)] md:w-1/2"
          data-test="translation-panel"
        >
          <div className="h-full w-full">
            <div
              className="h-full whitespace-pre-wrap px-4 py-4 text-lg text-zinc-500 dark:text-zinc-400 md:px-8"
              data-test="translation-output"
            >
              {translatedText ?? ""}
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && <Toast message="Copied" data-test="copy-toast" />}
    </div>
  );
}
