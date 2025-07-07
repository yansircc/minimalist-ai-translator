import { deepseek } from "@ai-sdk/deepseek";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { type Message, streamText } from "ai";
import type { AIModelType } from "@/types";
import {
	API_TIMEOUT_MS,
	MODEL_CONFIGS,
	TRANSLATION_SYSTEM_PROMPT,
} from "@/utils/constants";

// 获取对应的模型实例
function getModel(modelType: AIModelType) {
	const modelProviders = {
		google: google,
		groq: groq,
		openai: openai,
		deepseek: deepseek,
	};

	const provider = modelProviders[modelType] || google;
	const config = MODEL_CONFIGS[modelType] || MODEL_CONFIGS.google;
	return provider(config.model);
}

// Export the POST handler function
export async function POST(req: Request) {
	const timeoutPromise = new Promise<never>((_, reject) =>
		setTimeout(() => reject(new Error("Request timeout")), API_TIMEOUT_MS),
	);

	try {
		// Get the text from the request body
		const { messages, model } = (await req.json()) as {
			messages: Message[];
			model: AIModelType;
		};

		// Validate input
		if (!messages?.length || !messages[0]?.content) {
			return new Response("Invalid request: missing content", { status: 400 });
		}

		try {
			// Call the API for translation using streamText with timeout
			const stream = streamText({
				model: getModel(model),
				system: TRANSLATION_SYSTEM_PROMPT,
				messages,
			});

			// Race between the stream and timeout
			const response = stream.toDataStreamResponse();
			return await Promise.race([response, timeoutPromise]);
		} catch (error) {
			if (error instanceof Error && error.message === "Request timeout") {
				return new Response("Request timeout", { status: 408 });
			}
			throw error; // Re-throw other errors
		}
	} catch (error) {
		console.error("Translation API error:", error);
		return new Response(
			error instanceof Error ? error.message : "Internal Server Error",
			{ status: 500 },
		);
	}
}
