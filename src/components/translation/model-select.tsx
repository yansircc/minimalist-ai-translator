"use client";

export type ModelType = "groq" | "google" | "openai";

export function ModelSelect({
  value,
  onChange,
}: {
  value: ModelType;
  onChange: (model: ModelType) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ModelType)}
      className="fixed left-16 top-4 z-50 rounded-md bg-transparent px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
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
    </select>
  );
}
