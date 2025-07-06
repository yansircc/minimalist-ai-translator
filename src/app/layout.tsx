import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
	title: "AI极简翻译",
	description: "一个极简的AI翻译工具，比deepl和google翻译更好用",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="zh-CN" suppressHydrationWarning>
			<head />
			<body
				className={`${GeistSans.variable} min-h-screen bg-white text-zinc-800 antialiased transition-colors dark:bg-zinc-900 dark:text-zinc-100`}
			>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
