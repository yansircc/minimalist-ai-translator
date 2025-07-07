"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { SettingsDialog } from "@/components/settings-dialog";
import { CopyButton } from "@/components/translation/copy-button";
import { TranslationErrorFallback } from "@/components/translation/translation-error-fallback";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Logo } from "@/components/ui/logo";
import { SettingsButton } from "@/components/ui/settings-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toast } from "@/components/ui/toast";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/stores/app-store";
import { handleTranslationKeyDown } from "@/utils/keyboard";

export default function TranslationWidget() {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [inputText, setInputText] = useState("");
	const [isComposing, setIsComposing] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	// Global state from unified store
	const {
		shouldAnimateLogo,
		resetTranslation,
		showToast,
		toastMessage,
		toastType,
		setError,
		clearError,
		isConfigured,
		showToastMessage,
	} = useAppStore();

	// Custom hooks
	const { isLoading, translatedText, append, setChatMessages } =
		useTranslation();

	// Auto-focus the textarea when component mounts
	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	// Event handlers
	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputText(e.target.value);
	};

	const handleTranslate = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!inputText.trim()) return;

		// Check if API is configured
		if (!isConfigured()) {
			showToastMessage("Please configure your API key in settings", "error");
			setShowSettings(true);
			return;
		}

		try {
			clearError();
			await append({
				content: inputText,
				role: "user",
			});
		} catch (error) {
			const err =
				error instanceof Error ? error : new Error("Translation failed");
			setError(err);
			console.error("Translation failed:", error);
		}
	};

	const handleReset = () => {
		setInputText("");
		resetTranslation();
		setChatMessages([]);
		clearError();
		textareaRef.current?.focus();
	};

	return (
		<div
			className="fixed inset-0 flex flex-col overflow-hidden"
			data-test="translation-widget"
		>
			{/* Controls */}
			<div
				className="flex h-16 shrink-0 items-center border-zinc-100 border-b bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80"
				data-test="nav-controls"
			>
				<ThemeToggle />
				<SettingsButton onClick={() => setShowSettings(true)} />
				<Logo
					onReset={handleReset}
					shouldAnimate={shouldAnimateLogo || isLoading}
				/>
				{translatedText && <CopyButton text={translatedText} />}
			</div>

			{/* Main content */}
			<div className="relative flex flex-1 flex-col md:flex-row">
				{/* Left panel - Source text */}
				<div
					className="flex h-[calc(50vh-32px)] w-full flex-col border-zinc-100 border-b md:h-[calc(100vh-64px)] md:w-1/2 md:border-b-0 dark:border-zinc-800"
					data-test="source-panel"
				>
					<form onSubmit={handleTranslate} className="h-full">
						<textarea
							ref={textareaRef}
							data-test="source-input"
							className="scrollbar-thin h-full w-full resize-none overflow-y-auto bg-transparent px-4 py-4 text-lg focus:outline-none md:px-8 dark:placeholder:text-zinc-600"
							value={inputText}
							placeholder="Input here..."
							onChange={handleInputChange}
							onKeyDown={(e) =>
								handleTranslationKeyDown(
									e,
									isComposing,
									() => void handleTranslate(),
								)
							}
							onCompositionStart={() => setIsComposing(true)}
							onCompositionEnd={() => setIsComposing(false)}
						/>
					</form>
				</div>

				{/* Center divider - Only show on desktop */}
				<div
					className="-translate-x-1/2 absolute top-0 left-1/2 hidden h-full w-[1px] bg-zinc-100 md:block dark:bg-zinc-800"
					data-test="center-divider"
				/>

				{/* Right panel - Translation result */}
				<div
					className="scrollbar-thin h-[calc(50vh-32px)] w-full overflow-auto md:h-[calc(100vh-64px)] md:w-1/2"
					data-test="translation-panel"
				>
					<ErrorBoundary
						fallback={(error, reset) => (
							<TranslationErrorFallback
								error={error}
								reset={reset}
								retry={() => handleTranslate()}
							/>
						)}
					>
						<div
							className="min-h-full whitespace-pre-wrap px-4 py-4 text-lg text-zinc-500 md:px-8 dark:text-zinc-400"
							data-test="translation-output"
						>
							{translatedText ?? ""}
						</div>
					</ErrorBoundary>
				</div>
			</div>

			{/* Toast notification */}
			{showToast && (
				<Toast message={toastMessage} type={toastType} data-test="copy-toast" />
			)}
			<SettingsDialog
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
			/>
		</div>
	);
}
