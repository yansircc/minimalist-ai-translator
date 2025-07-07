"use client";

import type React from "react";
import { useAppStore } from "@/stores/app-store";

interface TranslationErrorFallbackProps {
  error: Error;
  reset: () => void;
  retry?: () => void;
}

export function TranslationErrorFallback({
  error,
  reset,
  retry,
}: TranslationErrorFallbackProps) {
  const { errorCount, resetErrorCount } = useAppStore();

  const handleReset = () => {
    resetErrorCount();
    reset();
  };

  const handleRetry = () => {
    if (retry) {
      retry();
    } else {
      reset();
    }
  };

  // Determine error type and message
  const getErrorInfo = () => {
    if (error.message.includes("timeout")) {
      return {
        title: "Request Timeout",
        message: "The translation took too long. Please try again with a shorter text.",
        icon: "⏱️",
      };
    }
    
    if (error.message.includes("rate limit")) {
      return {
        title: "Rate Limit Exceeded",
        message: "Too many requests. Please wait a moment and try again.",
        icon: "🚦",
      };
    }
    
    if (error.message.includes("API key")) {
      return {
        title: "Configuration Error",
        message: "API key is missing or invalid. Please check your configuration.",
        icon: "🔑",
      };
    }
    
    if (error.message.includes("network")) {
      return {
        title: "Network Error",
        message: "Unable to connect. Please check your internet connection.",
        icon: "🌐",
      };
    }
    
    return {
      title: "Translation Error",
      message: error.message || "Something went wrong during translation.",
      icon: "⚠️",
    };
  };

  const { title, message, icon } = getErrorInfo();

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>
        
        {errorCount > 2 && (
          <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-500">
            This error has occurred {errorCount} times. Consider trying a different model.
          </p>
        )}
        
        <div className="flex justify-center gap-3">
          <button
            onClick={handleRetry}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Try Again
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Clear & Reset
          </button>
        </div>
      </div>
    </div>
  );
}