"use client";

import { CheckCircle, Eye, EyeOff, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import type { APIConfig } from "@/types";

interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
	const { apiConfig, setAPIConfig, showToastMessage } = useAppStore();
	const [localConfig, setLocalConfig] = useState<APIConfig>(apiConfig);
	const [showApiKey, setShowApiKey] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const [validationStatus, setValidationStatus] = useState<
		"idle" | "valid" | "invalid"
	>("idle");
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLocalConfig(apiConfig);
	}, [apiConfig]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		const handleClickOutside = (e: MouseEvent) => {
			if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	const handleSave = () => {
		if (!localConfig.apiKey) {
			showToastMessage("Please enter an API key", "error");
			return;
		}

		setAPIConfig(localConfig);
		showToastMessage("Settings saved", "success");
		onClose();
	};

	const validateAPIKey = async () => {
		if (!localConfig.apiKey) {
			showToastMessage("Please enter an API key", "error");
			return;
		}

		setIsValidating(true);
		setValidationStatus("idle");

		try {
			const response = await fetch("/api/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(localConfig),
			});

			const result = await response.json();

			if (result.valid) {
				setValidationStatus("valid");
				showToastMessage("API key is valid", "success");
			} else {
				setValidationStatus("invalid");
				showToastMessage(result.error || "Invalid API key", "error");
			}
		} catch {
			setValidationStatus("invalid");
			showToastMessage("Failed to validate API key", "error");
		} finally {
			setIsValidating(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div
				ref={dialogRef}
				className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900"
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
				>
					<X className="h-5 w-5" />
				</button>

				<h2 className="mb-6 font-semibold text-xl text-zinc-900 dark:text-zinc-100">
					API Settings
				</h2>

				<div className="space-y-4">
					{/* Provider Selection */}
					<div>
						<label
							htmlFor="provider-select"
							className="mb-2 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
						>
							Provider
						</label>
						<select
							id="provider-select"
							value={localConfig.provider}
							onChange={(e) =>
								setLocalConfig({
									...localConfig,
									provider: e.target.value as "openai" | "custom",
								})
							}
							className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
						>
							<option value="openai">OpenAI</option>
							<option value="custom">Custom Provider</option>
						</select>
					</div>

					{/* API Key Input */}
					<div>
						<label
							htmlFor="api-key-input"
							className="mb-2 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
						>
							API Key
						</label>
						<div className="relative">
							<input
								id="api-key-input"
								type={showApiKey ? "text" : "password"}
								value={localConfig.apiKey}
								onChange={(e) =>
									setLocalConfig({ ...localConfig, apiKey: e.target.value })
								}
								placeholder="sk-..."
								className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 pr-10 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
							/>
							<button
								type="button"
								onClick={() => setShowApiKey(!showApiKey)}
								className="-translate-y-1/2 absolute top-1/2 right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
							>
								{showApiKey ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>

					{/* Base URL (for custom provider) */}
					{localConfig.provider === "custom" && (
						<div>
							<label
								htmlFor="base-url-input"
								className="mb-2 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
							>
								Base URL
							</label>
							<input
								id="base-url-input"
								type="url"
								value={localConfig.baseURL || ""}
								onChange={(e) =>
									setLocalConfig({ ...localConfig, baseURL: e.target.value })
								}
								placeholder="https://api.example.com/v1"
								className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
							/>
						</div>
					)}

					{/* Model Name */}
					<div>
						<label
							htmlFor="model-name-input"
							className="mb-2 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
						>
							Model Name
						</label>
						<input
							id="model-name-input"
							type="text"
							value={localConfig.model}
							onChange={(e) =>
								setLocalConfig({ ...localConfig, model: e.target.value })
							}
							placeholder={
								localConfig.provider === "openai" ? "gpt-4o-mini" : "model-name"
							}
							className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
						/>
					</div>

					{/* Privacy Notice */}
					<div className="rounded-md bg-zinc-100 p-3 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
						<p className="flex items-start">
							<span className="mr-1">🔒</span>
							Your API key is stored locally in your browser and never sent to
							our servers.
						</p>
					</div>

					{/* Validation Status */}
					{validationStatus !== "idle" && (
						<div
							className={`flex items-center gap-2 text-sm ${
								validationStatus === "valid"
									? "text-green-600 dark:text-green-400"
									: "text-red-600 dark:text-red-400"
							}`}
						>
							{validationStatus === "valid" ? (
								<>
									<CheckCircle className="h-4 w-4" />
									<span>API key validated successfully</span>
								</>
							) : (
								<>
									<XCircle className="h-4 w-4" />
									<span>API key validation failed</span>
								</>
							)}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={validateAPIKey}
							disabled={isValidating || !localConfig.apiKey}
							className="flex-1 rounded-md bg-zinc-200 px-4 py-2 font-medium text-sm text-zinc-700 transition-colors hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
						>
							{isValidating ? "Validating..." : "Validate"}
						</button>
						<button
							type="button"
							onClick={handleSave}
							className="flex-1 rounded-md bg-zinc-900 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
