"use client";

import { useModelStore } from "@/stores/model-store";

export type ModelType = "groq" | "google" | "openai" | "deepseek";

export function ModelSelect() {
	const { selectedModel, setSelectedModel } = useModelStore();

	return (
		<select
			value={selectedModel}
			onChange={(e) => setSelectedModel(e.target.value as ModelType)}
			className="fixed top-4 left-16 z-50 rounded-md bg-transparent px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
			aria-label="Select translation model"
			data-test="model-select"
		>
			<option value="google" data-test="model-option-google">
				Gemini
			</option>
			<option value="groq" data-test="model-option-groq">
				Groq
			</option>
			<option value="openai" data-test="model-option-openai">
				OpenAI
			</option>
			<option value="deepseek" data-test="model-option-deepseek">
				DeepSeek
			</option>
		</select>
	);
}
