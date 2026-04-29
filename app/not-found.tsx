import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08080e] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-amber-500 text-[11px] font-bold uppercase tracking-[0.3em] mb-4">
        404 — Page not found
      </p>
      <h1 className="text-[120px] leading-none font-serif text-white tracking-tighter select-none">
        404
      </h1>
      <p className="text-zinc-500 mt-6 max-w-xs text-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center gap-4 mt-10">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all shadow-lg shadow-amber-500/20"
        >
          Go home
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-semibold transition-all"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
