// AI Model Types
export type AIModelType = "groq" | "google" | "openai" | "deepseek";

export const AI_MODEL_NAMES: Record<AIModelType, string> = {
	google: "Gemini",
	groq: "Groq",
	openai: "OpenAI",
	deepseek: "DeepSeek",
} as const;

// Toast Types
export type ToastType = "success" | "error" | "info";

// Translation Types
export interface TranslationRequest {
	content: string;
	model: AIModelType;
}

export interface TranslationError extends Error {
	type: "timeout" | "rate_limit" | "api_key" | "network" | "unknown";
}
