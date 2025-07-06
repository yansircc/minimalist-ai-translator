import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModelType } from "@/components/translation/model-select";

interface ModelStore {
	selectedModel: ModelType;
	setSelectedModel: (model: ModelType) => void;
}

export const useModelStore = create<ModelStore>()(
	persist(
		(set) => ({
			selectedModel: "google",
			setSelectedModel: (model) => set({ selectedModel: model }),
		}),
		{
			name: "preferred-translation-model", // localStorage 的 key
		},
	),
);
