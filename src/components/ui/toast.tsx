"use client";

// Toast 组件
export function Toast({ message }: { message: string }) {
	return (
		<div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 transform rounded-md bg-zinc-800 px-4 py-2 text-sm text-white opacity-90 dark:bg-zinc-700">
			{message}
		</div>
	);
}
