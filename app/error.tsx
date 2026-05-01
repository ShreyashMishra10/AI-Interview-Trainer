"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080e] text-white px-4">
      <p className="text-amber-400 text-sm font-mono mb-4">500 — Something went wrong</p>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Unexpected error</h1>
      <p className="text-zinc-400 mb-8 text-center max-w-sm">
        An error occurred on this page. Try again or return to the dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
