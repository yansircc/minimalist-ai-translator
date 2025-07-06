import type { KeyboardEvent } from "react";

export function handleTranslationKeyDown(
	event: KeyboardEvent<HTMLTextAreaElement>,
	isComposing: boolean,
	onTranslate: () => void,
) {
	if (isComposing) return;

	if (event.key === "Enter" && !event.shiftKey) {
		event.preventDefault();
		onTranslate();
	}
}
