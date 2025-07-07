// API Configuration Types
export interface APIConfig {
	provider: "openai" | "custom";
	apiKey: string;
	baseURL?: string;
	model: string;
}

export const DEFAULT_API_CONFIG: APIConfig = {
	provider: "openai",
	apiKey: "",
	model: "gpt-4o-mini",
};

// Toast Types
export type ToastType = "success" | "error" | "info";

// Translation Types
export interface TranslationRequest {
	content: string;
}

export interface TranslationError extends Error {
	type: "timeout" | "rate_limit" | "api_key" | "network" | "unknown";
}

// Validation Response
export interface ValidationResponse {
	valid: boolean;
	error?: string;
}
