import type { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";

export function useTranslation() {
	const { apiConfig, setShouldAnimateLogo, setMessages, copyToClipboard } =
		useAppStore();

	const {
		messages,
		isLoading,
		append,
		setMessages: setChatMessages,
	} = useChat({
		api: "/api/translate",
		body: {
			apiConfig,
		},
		onFinish: (message) => {
			// Handle logo animation
			setShouldAnimateLogo(false);
			setTimeout(() => {
				setShouldAnimateLogo(true);
				setTimeout(() => setShouldAnimateLogo(false), 1000);
			}, 100);

			// Copy result to clipboard
			if (message && message.content) {
				void copyToClipboard(message.content);
			}
		},
		onError: (error) => {
			console.error("Translation error:", error);
			// Error is already handled in TranslationWidget
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
