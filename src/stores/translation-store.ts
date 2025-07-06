import type { Message } from "ai";
import { create } from "zustand";

interface TranslationStore {
	shouldAnimateLogo: boolean;
	messages: Message[];
	setShouldAnimateLogo: (value: boolean) => void;
	setMessages: (messages: Message[]) => void;
	resetTranslation: () => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
	shouldAnimateLogo: false,
	messages: [],
	setShouldAnimateLogo: (value) => set({ shouldAnimateLogo: value }),
	setMessages: (messages) => set({ messages }),
	resetTranslation: () => set({ shouldAnimateLogo: false, messages: [] }),
}));
