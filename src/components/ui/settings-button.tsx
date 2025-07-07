"use client";

import { Settings2 } from "lucide-react";

interface SettingsButtonProps {
	onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="fixed top-4 left-16 z-50 p-2 text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
			aria-label="Settings"
			data-test="settings-button"
		>
			<Settings2 className="h-5 w-5" />
		</button>
	);
}
