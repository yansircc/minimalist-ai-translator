import type { Message } from "ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ModelType = "groq" | "google" | "openai" | "deepseek";

interface TranslationSlice {
  shouldAnimateLogo: boolean;
  messages: Message[];
  setShouldAnimateLogo: (value: boolean) => void;
  setMessages: (messages: Message[]) => void;
  resetTranslation: () => void;
}

interface ModelSlice {
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
}

interface ClipboardSlice {
  showToast: boolean;
  toastMessage: string;
  toastType: "success" | "error" | "info";
  copyToClipboard: (text: string) => Promise<void>;
  showToastMessage: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
}

interface ErrorSlice {
  lastError: Error | null;
  errorCount: number;
  setError: (error: Error | null) => void;
  clearError: () => void;
  incrementErrorCount: () => void;
  resetErrorCount: () => void;
}

export interface AppStore extends TranslationSlice, ModelSlice, ClipboardSlice, ErrorSlice {
  // Global actions
  resetAll: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Translation Slice
      shouldAnimateLogo: false,
      messages: [],
      setShouldAnimateLogo: (value) => set({ shouldAnimateLogo: value }),
      setMessages: (messages) => set({ messages }),
      resetTranslation: () => set({ shouldAnimateLogo: false, messages: [] }),

      // Model Slice
      selectedModel: "google",
      setSelectedModel: (model) => set({ selectedModel: model }),

      // Clipboard Slice
      showToast: false,
      toastMessage: "Copied",
      toastType: "success",
      copyToClipboard: async (text) => {
        try {
          await navigator.clipboard.writeText(text);
          get().showToastMessage("Copied to clipboard", "success");
        } catch (error) {
          console.error("Failed to copy:", error);
          get().showToastMessage("Failed to copy", "error");
        }
      },
      showToastMessage: (message, type = "success") => {
        set({ showToast: true, toastMessage: message, toastType: type });
        // Auto-hide after 2 seconds
        setTimeout(() => {
          get().hideToast();
        }, 2000);
      },
      hideToast: () => set({ showToast: false }),

      // Error Slice
      lastError: null,
      errorCount: 0,
      setError: (error) => set((state) => ({ 
        lastError: error, 
        errorCount: error ? state.errorCount + 1 : state.errorCount 
      })),
      clearError: () => set({ lastError: null }),
      incrementErrorCount: () => set((state) => ({ errorCount: state.errorCount + 1 })),
      resetErrorCount: () => set({ errorCount: 0 }),

      // Global actions
      resetAll: () => set({
        // Reset translation
        shouldAnimateLogo: false,
        messages: [],
        // Reset clipboard
        showToast: false,
        toastMessage: "Copied",
        toastType: "success",
        // Reset errors
        lastError: null,
        errorCount: 0,
        // Keep model selection as it's a user preference
      }),
    }),
    {
      name: "ai-translate-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user preferences
        selectedModel: state.selectedModel,
      }),
    }
  )
);