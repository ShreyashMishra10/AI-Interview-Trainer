import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
  // Prevent clickjacking — no iframes allowed
  { key: "X-Frame-Options",          value: "DENY" },
  // Stop browsers MIME-sniffing responses away from the declared content-type
  { key: "X-Content-Type-Options",   value: "nosniff" },
  // Only send origin (no path/query) in Referer header to third parties
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  // Allow mic + camera only for the page itself (not third-party iframes)
  { key: "Permissions-Policy",       value: "camera=(self), microphone=(self), geolocation=(), payment=()" },
  // Force HTTPS for 2 years once the first HTTPS response is seen
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // CSP: locks down origins for scripts, styles, connections, frames
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js + Clerk require unsafe-inline/eval for hydration and auth widgets
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev",
      // Google Fonts for marketing pages
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // data: and blob: needed for speech synthesis audio; Google for Web Speech API
      "media-src 'self' data: blob:",
      "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://*.ingest.sentry.io https://www.google.com https://speech.googleapis.com",
      "worker-src blob:",
      // Block all frames — same as X-Frame-Options but honoured by modern browsers
      "frame-ancestors 'none'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withSentryConfig(nextConfig, {
  org:     process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent:            true,
  widenClientFileUpload: true,
  sourcemaps:        { disable: false },
});
