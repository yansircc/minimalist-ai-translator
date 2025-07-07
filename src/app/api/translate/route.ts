import { createOpenAI } from "@ai-sdk/openai";
import { type Message, streamText } from "ai";
import type { APIConfig } from "@/types";
import { API_TIMEOUT_MS, TRANSLATION_SYSTEM_PROMPT } from "@/utils/constants";

// 获取对应的模型实例
function getModel(config: APIConfig) {
	if (config.provider === "openai") {
		const customOpenAI = createOpenAI({
			apiKey: config.apiKey,
		});
		return customOpenAI(config.model);
	} else {
		// Custom provider
		const customOpenAI = createOpenAI({
			baseURL: config.baseURL,
			apiKey: config.apiKey,
		});
		return customOpenAI(config.model);
	}
}

// Export the POST handler function
export async function POST(req: Request) {
	const timeoutPromise = new Promise<never>((_, reject) =>
		setTimeout(() => reject(new Error("Request timeout")), API_TIMEOUT_MS),
	);

	try {
		// Get the request data
		const { messages, apiConfig } = (await req.json()) as {
			messages: Message[];
			apiConfig: APIConfig;
		};

		// Validate input
		if (!messages?.length || !messages[0]?.content) {
			return new Response("Invalid request: missing content", { status: 400 });
		}

		if (!apiConfig?.apiKey || !apiConfig?.model) {
			return new Response("Invalid request: missing API configuration", {
				status: 400,
			});
		}

		try {
			// Call the API for translation using streamText with timeout
			const stream = streamText({
				model: getModel(apiConfig),
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
