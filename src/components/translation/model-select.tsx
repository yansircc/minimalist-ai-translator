"use client";

import { useAppStore } from "@/stores/app-store";
import { AI_MODEL_NAMES, type AIModelType } from "@/types";

export function ModelSelect() {
	const { selectedModel, setSelectedModel } = useAppStore();

	return (
		<select
			value={selectedModel}
			onChange={(e) => setSelectedModel(e.target.value as AIModelType)}
			className="fixed top-4 left-16 z-50 rounded-md bg-transparent px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
			aria-label="Select translation model"
			data-test="model-select"
		>
			{(Object.entries(AI_MODEL_NAMES) as [AIModelType, string][]).map(
				([value, name]) => (
					<option key={value} value={value} data-test={`model-option-${value}`}>
						{name}
					</option>
				),
			)}
		</select>
	);
}
