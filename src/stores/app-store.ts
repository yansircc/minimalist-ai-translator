import type { Message } from "ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type APIConfig, DEFAULT_API_CONFIG, type ToastType } from "@/types";

interface TranslationSlice {
	shouldAnimateLogo: boolean;
	messages: Message[];
	setShouldAnimateLogo: (value: boolean) => void;
	setMessages: (messages: Message[]) => void;
	resetTranslation: () => void;
}

interface APIConfigSlice {
	apiConfig: APIConfig;
	setAPIConfig: (config: Partial<APIConfig>) => void;
	resetAPIConfig: () => void;
	isConfigured: () => boolean;
}

interface ClipboardSlice {
	showToast: boolean;
	toastMessage: string;
	toastType: ToastType;
	copyToClipboard: (text: string) => Promise<void>;
	showToastMessage: (message: string, type?: ToastType) => void;
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

export interface AppStore
	extends TranslationSlice,
		APIConfigSlice,
		ClipboardSlice,
		ErrorSlice {
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

			// API Config Slice
			apiConfig: DEFAULT_API_CONFIG,
			setAPIConfig: (config) =>
				set((state) => ({
					apiConfig: { ...state.apiConfig, ...config },
				})),
			resetAPIConfig: () => set({ apiConfig: DEFAULT_API_CONFIG }),
			isConfigured: () => {
				const { apiConfig } = get();
				return !!apiConfig.apiKey && !!apiConfig.model;
			},

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
			setError: (error) =>
				set((state) => ({
					lastError: error,
					errorCount: error ? state.errorCount + 1 : state.errorCount,
				})),
			clearError: () => set({ lastError: null }),
			incrementErrorCount: () =>
				set((state) => ({ errorCount: state.errorCount + 1 })),
			resetErrorCount: () => set({ errorCount: 0 }),

			// Global actions
			resetAll: () =>
				set({
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
				// Only persist user preferences and API config
				apiConfig: state.apiConfig,
			}),
		},
	),
);
