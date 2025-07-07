import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type LanguageModelV1 } from "ai";
import type { APIConfig, ValidationResponse } from "@/types";

// Test model generation
async function testModel(config: APIConfig): Promise<boolean> {
	try {
		let model: LanguageModelV1;

		if (config.provider === "openai") {
			const customOpenAI = createOpenAI({
				apiKey: config.apiKey,
			});
			model = customOpenAI(config.model);
		} else {
			const customOpenAI = createOpenAI({
				baseURL: config.baseURL,
				apiKey: config.apiKey,
			});
			model = customOpenAI(config.model);
		}

		// Simple test prompt
		const result = await generateText({
			model,
			prompt: "Say 'Hello' in one word",
			maxTokens: 10,
		});

		return !!result.text;
	} catch (error) {
		console.error("Model test failed:", error);
		return false;
	}
}

export async function POST(req: Request) {
	try {
		const config = (await req.json()) as APIConfig;

		// Validate required fields
		if (!config.apiKey || !config.model) {
			const response: ValidationResponse = {
				valid: false,
				error: "Missing required fields",
			};
			return Response.json(response);
		}

		// For custom provider, check baseURL
		if (config.provider === "custom" && !config.baseURL) {
			const response: ValidationResponse = {
				valid: false,
				error: "Base URL is required for custom provider",
			};
			return Response.json(response);
		}

		// Test the model
		const isValid = await testModel(config);

		const response: ValidationResponse = {
			valid: isValid,
			error: isValid ? undefined : "Failed to connect to the API",
		};

		return Response.json(response);
	} catch (error) {
		console.error("Validation error:", error);
		const response: ValidationResponse = {
			valid: false,
			error: error instanceof Error ? error.message : "Validation failed",
		};
		return Response.json(response);
	}
}
