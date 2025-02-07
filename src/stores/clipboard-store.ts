import { create } from "zustand";

interface ClipboardStore {
  showToast: boolean;
  setShowToast: (show: boolean) => void;
  copyToClipboard: (text: string) => Promise<void>;
}

export const useClipboardStore = create<ClipboardStore>((set) => ({
  showToast: false,
  setShowToast: (show) => set({ showToast: show }),
  copyToClipboard: async (text: string) => {
    try {
      await navigator.clipboard.writeText(text.trim());
      set({ showToast: true });
      setTimeout(() => set({ showToast: false }), 2000);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  },
}));
