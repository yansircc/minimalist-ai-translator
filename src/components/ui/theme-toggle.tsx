"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Ensure component is mounted before rendering
	useEffect(() => {
		setMounted(true);
	}, []);

	// Avoid hydration mismatch
	if (!mounted) {
		return (
			<div className="fixed top-4 left-4 z-50 p-2">
				<div className="h-5 w-5" />
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="fixed top-4 left-4 z-50 p-2 text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
			aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
			data-test="theme-toggle"
		>
			{theme === "dark" ? (
				<Moon className="h-5 w-5" data-test="theme-icon-dark" />
			) : (
				<Sun className="h-5 w-5" data-test="theme-icon-light" />
			)}
		</button>
	);
}
