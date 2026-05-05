import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import { AppearanceInit } from "@/components/AppearanceInit";
import "./(marketing)/globals.css";
import "./accent.css";

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
  keywords: ["AI interview trainer", "mock interview", "technical interview prep", "coding interview", "AI CV builder", "Japan tech interview"],
  authors: [{ name: "AI-Trainer Team" }],
  robots: { index: true, follow: true },
  openGraph: {
    type:        "website",
    siteName:    "AI-Trainer",
    locale:      "en_US",
  },
  twitter: { card: "summary_large_image" },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id":   "https://ai-interview-trainer.com/#organization",
      name:    "AI-Trainer",
      url:     "https://ai-interview-trainer.com",
      logo:    "https://ai-interview-trainer.com/favicon.ico",
      sameAs:  [],
    },
    {
      "@type":           "WebSite",
      "@id":             "https://ai-interview-trainer.com/#website",
      url:               "https://ai-interview-trainer.com",
      name:              "AI-Trainer",
      publisher:         { "@id": "https://ai-interview-trainer.com/#organization" },
      potentialAction:   {
        "@type":         "SearchAction",
        target:          "https://ai-interview-trainer.com/?q={search_term_string}",
        "query-input":   "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        {/* Runs synchronously before first paint — prevents accent/font/compact flash */}
        <head>
          <script dangerouslySetInnerHTML={{ __html: `(function(){try{var a=localStorage.getItem('appearance_accent');if(a&&a!=='amber')document.documentElement.setAttribute('data-accent',a);var f=localStorage.getItem('appearance_font');if(f==='small')document.documentElement.classList.add('font-small');else if(f==='large')document.documentElement.classList.add('font-large');if(localStorage.getItem('appearance_animations')==='false')document.documentElement.classList.add('no-animations');if(localStorage.getItem('appearance_compact')==='true')document.documentElement.classList.add('compact');}catch(e){}})();` }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full flex flex-col`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
            <ClerkProvider>
              <AppearanceInit />
              {children}
              <Toaster richColors position="top-right" />
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </html>
  );
}
