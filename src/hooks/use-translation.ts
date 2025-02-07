import { useChat } from "ai/react";
import { useModelStore } from "@/stores/model-store";
import { useTranslationStore } from "@/stores/translation-store";
import { useClipboardStore } from "@/stores/clipboard-store";
import { type Message } from "ai";
import { useEffect } from "react";

export function useTranslation() {
  const { selectedModel } = useModelStore();
  const { setShouldAnimateLogo, setMessages } = useTranslationStore();
  const { copyToClipboard } = useClipboardStore();

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
      // Handle logo animation
      setShouldAnimateLogo(false);
      setTimeout(() => {
        setShouldAnimateLogo(true);
        setTimeout(() => setShouldAnimateLogo(false), 1000);
      }, 100);

      // Copy result to clipboard
      if (message) {
        void copyToClipboard(message.content);
      }
    },
  });

  // Get the latest translation result
  const getLatestTranslation = (messages: Message[]): string | null => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.role === "assistant"
      ? lastMessage.content.trim()
      : null;
  };

  const translatedText = getLatestTranslation(messages);

  // Update store messages when chat messages change
  useEffect(() => {
    if (messages.length > 0) {
      setMessages(messages);
    }
  }, [messages, setMessages]);

  return {
    messages,
    isLoading,
    translatedText,
    append,
    setChatMessages,
  };
}
