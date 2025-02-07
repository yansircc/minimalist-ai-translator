import { streamText, type Message } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { deepseek } from "@ai-sdk/deepseek";

// Define the translation prompt
const SYSTEM_PROMPT = `You are a professional translation assistant.
- If the input is in Chinese, translate it into English;
- If the input is in English, translate it into Chinese;
- For any other language, first detect the language, then translate it to Chinese.
Ensure the translation is accurate, natural, and idiomatic while retaining the tone and style of the original text.
Only return the translation result without any extra explanation.`;

type ModelType = "groq" | "google" | "openai" | "deepseek";

// 获取对应的模型实例
function getModel(modelType: ModelType) {
  switch (modelType) {
    case "google":
      return google("gemini-1.5-flash");
    case "groq":
      return groq("llama3-8b-8192");
    case "openai":
      return openai("gpt-4o-mini");
    case "deepseek":
      return deepseek("deepseek-coder");
    default:
      return google("gemini-1.5-flash");
  }
}

// Export the POST handler function
export async function POST(req: Request) {
  const timeoutMs = 30000; // 30 seconds
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), timeoutMs),
  );

  try {
    // Get the text from the request body
    const { messages, model } = (await req.json()) as {
      messages: Message[];
      model: ModelType;
    };

    // Validate input
    if (!messages?.length || !messages[0]?.content) {
      return new Response("Invalid request: missing content", { status: 400 });
    }

    try {
      // Call the API for translation using streamText with timeout
      const stream = streamText({
        model: getModel(model),
        system: SYSTEM_PROMPT,
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
