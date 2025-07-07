"use client";

import type React from "react";
import { Component, type ReactNode } from "react";
import { useAppStore } from "@/stores/app-store";

interface Props {
	children: ReactNode;
	fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundaryInner extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
		// Report to error tracking service here if needed
	}

	reset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) {
				return this.props.fallback(this.state.error, this.reset);
			}

			return (
				<div className="flex min-h-[400px] flex-col items-center justify-center p-8">
					<div className="max-w-md text-center">
						<h2 className="mb-4 font-bold text-2xl text-zinc-900 dark:text-zinc-100">
							Something went wrong
						</h2>
						<p className="mb-6 text-zinc-600 dark:text-zinc-400">
							{this.state.error.message || "An unexpected error occurred"}
						</p>
						<button
							type="button"
							onClick={this.reset}
							className="rounded-lg bg-zinc-900 px-4 py-2 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
						>
							Try again
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export function ErrorBoundary({ children, fallback }: Props) {
	return (
		<ErrorBoundaryInner fallback={fallback}>{children}</ErrorBoundaryInner>
	);
}

// Hook to use with the error boundary
export function useErrorHandler() {
	const { setError, lastError, clearError } = useAppStore();

	const throwError = (error: Error) => {
		setError(error);
		throw error;
	};

	const reportError = (error: Error) => {
		setError(error);
		console.error("Error reported:", error);
	};

	return {
		throwError,
		reportError,
		lastError,
		clearError,
	};
}
