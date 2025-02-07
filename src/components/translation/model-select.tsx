"use client";

import { useEffect } from "react";

export type ModelType = "groq" | "google" | "openai" | "deepseek";

const LOCAL_STORAGE_KEY = "preferred-translation-model";

export function ModelSelect({
  value,
  onChange,
}: {
  value: ModelType;
  onChange: (model: ModelType) => void;
}) {
  // 组件加载时从 localStorage 读取存储的值
  useEffect(() => {
    const storedModel = localStorage.getItem(LOCAL_STORAGE_KEY) as ModelType;
    if (storedModel && storedModel !== value) {
      onChange(storedModel);
    }
  }, [onChange, value]);

  // 当选择改变时保存到 localStorage
  const handleChange = (newModel: ModelType) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, newModel);
    onChange(newModel);
  };

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value as ModelType)}
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
      <option value="deepseek" data-test="model-option-deepseek">
        DeepSeek
      </option>
    </select>
  );
}
