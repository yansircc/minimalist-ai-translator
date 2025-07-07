"use client";

interface ToastProps {
	message: string;
	type?: "success" | "error" | "info";
}

// Toast 组件
export function Toast({ message, type = "success" }: ToastProps) {
	const typeStyles = {
		success: "bg-green-600 dark:bg-green-700",
		error: "bg-red-600 dark:bg-red-700",
		info: "bg-zinc-800 dark:bg-zinc-700",
	};

	return (
		<div
			className={`-translate-x-1/2 fixed bottom-4 left-1/2 z-50 transform rounded-md px-4 py-2 text-sm text-white opacity-90 ${typeStyles[type]}`}
		>
			{message}
		</div>
	);
}
