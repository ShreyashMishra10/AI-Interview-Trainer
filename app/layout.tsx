import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI-Trainer — Ace Your Technical Interview With an AI Mentor",
    template: "%s | AI-Trainer",
  },
  description:
    "Practice real-time coding, DSA, and behavioral interviews with an AI that adapts to your skill level. Mock interviews, CV builder, voice mode, and analytics.",
  metadataBase: new URL("https://ai-interview-trainer.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            <ClerkProvider>
              {children}
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </html>
  );
}
