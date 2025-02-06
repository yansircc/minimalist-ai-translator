// 'use client' 指令，声明这是一个客户端组件
"use client";

import React, { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CopyButton } from "@/components/translation/copy-button";
import {
  ModelSelect,
  type ModelType,
} from "@/components/translation/model-select";
import { Logo } from "@/components/ui/logo";
import { useTranslationStore } from "@/stores/translation-store";

// 翻译组件：包含输入区域和翻译结果展示区域
export default function TranslationWidget() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>("google");
  const [showToast, setShowToast] = useState(false);
  const {
    shouldAnimateLogo,
    setShouldAnimateLogo,
    setMessages,
    resetTranslation,
  } = useTranslationStore();

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // 使用 useChat hook 处理与 API 的通信
  const {
    messages,
    isLoading,
    append,
    setMessages: setChatMessages,
  } = useChat({
    api: "/api/translate",
    body: {
      model: selectedModel,
    },
    onFinish: (message) => {
      console.log("Translation completed");
      // First stop the loading animation
      setShouldAnimateLogo(false);

      // Then trigger the success animation after a short delay
      setTimeout(() => {
        setShouldAnimateLogo(true);
        setTimeout(() => setShouldAnimateLogo(false), 1000);
      }, 100);

      // Handle clipboard copy
      if (message) {
        navigator.clipboard.writeText(message.content.trim()).then(
          () => {
            console.log("翻译结果已自动复制到剪贴板");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          },
          (err) => {
            console.error("自动复制失败:", err);
          },
        );
      }
    },
  });

  // 获取最新的翻译结果
  const lastMessage = messages[messages.length - 1];
  const translatedText =
    lastMessage?.role === "assistant" ? lastMessage.content.trim() : null;

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(e.target.value);
  }

  // 处理键盘事件：
  // - Enter 键（未按住 Shift）触发翻译
  // - Shift+Enter 插入换行
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // 如果正在使用输入法，不处理 Enter 键
    if (isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleTranslate();
    }
  }

  async function handleTranslate(e?: React.FormEvent) {
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
  }

  // Handle reset when logo is clicked
  const handleReset = () => {
    setInputText("");
    resetTranslation();
    // Directly reset chat messages instead of using reload
    setChatMessages([]);
    textareaRef.current?.focus();
  };

  // Update store messages when chat messages change
  useEffect(() => {
    if (messages.length > 0) {
      setMessages(messages);
    }
  }, [messages, setMessages]);

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
        <ModelSelect value={selectedModel} onChange={setSelectedModel} />
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
              placeholder="输入或粘贴要翻译的文本..."
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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
      {showToast && <Toast message="已复制到剪贴板" data-test="copy-toast" />}
    </div>
  );
}
