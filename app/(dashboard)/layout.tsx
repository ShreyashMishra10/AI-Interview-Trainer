"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search, Bell, Menu, X, Mic2, FileText, Clock, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./global.css";

/* ── Types ─────────────────────────────────────────────────── */
interface Session {
  id:         string;
  job_role:   string;
  status:     string;
  score:      number | null;
  created_at: string;
}
interface CV {
  id:          string;
  target_role: string;
  created_at:  string;
}

function timeAgo(dateStr: string) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/* ── Search Modal ──────────────────────────────────────────── */
function SearchModal({
  onClose,
  sessions,
}: {
  onClose:  () => void;
  sessions: Session[];
}) {
  const [query, setQuery] = useState("");
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = sessions.filter((s) =>
    s.job_role.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = (path: string) => { onClose(); router.push(path); };

  const QUICK = [
    { label: "Start new interview", icon: <Mic2 size={14} />,     path: "/dashboard/interviews" },
    { label: "Generate a CV",       icon: <FileText size={14} />, path: "/dashboard/cv-builder" },
    { label: "View all sessions",   icon: <Clock size={14} />,    path: "/dashboard/interviews" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interview sessions..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
          />
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {!query && (
            <div className="p-2">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-3 py-2">Quick Actions</p>
              {QUICK.map((q) => (
                <button key={q.label} onClick={() => navigate(q.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-left group">
                  <span className="text-zinc-500 group-hover:text-amber-400 transition-colors">{q.icon}</span>
                  <span className="text-sm text-zinc-300">{q.label}</span>
                  <ChevronRight size={13} className="text-zinc-700 ml-auto" />
                </button>
              ))}
            </div>
          )}

          {query && (
            <div className="p-2">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-3 py-2">
                Sessions {filtered.length > 0 ? `(${filtered.length})` : ""}
              </p>
              {filtered.length === 0 ? (
                <p className="text-zinc-600 text-sm text-center py-8">No sessions found for &ldquo;{query}&rdquo;</p>
              ) : (
                filtered.map((s) => (
                  <button key={s.id} onClick={() => navigate(`/dashboard/interviews/${s.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-left group">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Mic2 size={12} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate">{s.job_role}</p>
                      <p className="text-[11px] text-zinc-600">{timeAgo(s.created_at)} · {s.status}</p>
                    </div>
                    {s.score !== null && (
                      <span className={`text-sm font-bold shrink-0 ${s.score >= 75 ? "text-emerald-400" : s.score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                        {s.score}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-zinc-800 flex items-center gap-4">
          <span className="text-[10px] text-zinc-700">Press <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">Esc</kbd> to close</span>
          <span className="text-[10px] text-zinc-700"><kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">↵</kbd> to open</span>
        </div>
      </div>
    </div>
  );
}

/* ── Notifications Dropdown ────────────────────────────────── */
function NotificationsDropdown({
  onClose,
  sessions,
  cvs,
}: {
  onClose:  () => void;
  sessions: Session[];
  cvs:      CV[];
}) {
  const router = useRouter();
  const ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    ...sessions.slice(0, 4).map((s) => ({
      icon:  <Mic2 size={13} className="text-amber-500" />,
      bg:    "bg-amber-500/10 border-amber-500/20",
      title: s.job_role,
      sub:   s.status === "completed" ? `Completed · Score: ${s.score ?? "—"}` : "In Progress",
      time:  timeAgo(s.created_at),
      path:  s.status === "completed" ? `/dashboard/interviews/${s.id}` : "/dashboard/interviews",
    })),
    ...cvs.slice(0, 2).map((c) => ({
      icon:  <FileText size={13} className="text-emerald-500" />,
      bg:    "bg-emerald-500/10 border-emerald-500/20",
      title: `CV — ${c.target_role || "General"}`,
      sub:   "CV generated",
      time:  timeAgo(c.created_at),
      path:  "/dashboard/cv-builder",
    })),
  ];

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Recent Activity</span>
        <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors"><X size={14} /></button>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <Bell size={24} className="text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-600 text-xs">No activity yet.</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {items.map((item, i) => (
              <button key={i} onClick={() => { onClose(); router.push(item.path); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-left group">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${item.bg}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-200 truncate">{item.title}</p>
                  <p className="text-[11px] text-zinc-600">{item.sub}</p>
                </div>
                <span className="text-[10px] text-zinc-700 shrink-0">{item.time}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between">
        <button onClick={() => { onClose(); router.push("/dashboard/interviews"); }}
          className="text-[11px] text-amber-500 hover:text-amber-400 transition-colors font-medium">
          View all interviews →
        </button>
        <button onClick={() => { onClose(); router.push("/dashboard/cv-builder"); }}
          className="text-[11px] text-emerald-500 hover:text-emerald-400 transition-colors font-medium">
          View all CVs →
        </button>
      </div>
    </div>
  );
}

/* ── Layout ────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen,       setSearchOpen]       = useState(false);
  const [notifOpen,        setNotifOpen]        = useState(false);

  // Fetched once on mount — shared by SearchModal and NotificationsDropdown
  const [sessions, setSessions] = useState<Session[]>([]);
  const [cvs,      setCVs]      = useState<CV[]>([]);

  const isSessionPage = pathname.includes("/session");

  useEffect(() => {
    Promise.all([
      fetch("/api/interviews").then((r) => r.json()),
      fetch("/api/generate-cv").then((r) => r.json()),
    ])
      .then(([s, c]) => {
        setSessions(Array.isArray(s) ? s : []);
        setCVs(Array.isArray(c) ? c : []);
      })
      .catch(console.error);
  }, []);

  // Ctrl/Cmd+K shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ThemeProvider forcedTheme="dark" attribute="class" disableTransitionOnChange>
    <div className="flex h-screen bg-background overflow-hidden selection:bg-gold-accent/30">
      {!isSessionPage && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isSessionPage && (
          <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 lg:px-8 bg-black/20 backdrop-blur-xl sticky top-0 z-40">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                className="md:hidden text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/50 rounded-full">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </div>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                  AI Engine: Online
                </span>
              </div>

              <div className="flex items-center gap-3 border-l border-zinc-800 pl-6">
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
                  title="Search (Ctrl+K)"
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setNotifOpen((v) => !v)}
                    aria-label="Notifications"
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800 relative"
                  >
                    <Bell size={18} strokeWidth={1.5} />
                    {(sessions.length > 0 || cvs.length > 0) && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full border border-black" />
                    )}
                  </button>
                  {notifOpen && (
                    <NotificationsDropdown
                      onClose={() => setNotifOpen(false)}
                      sessions={sessions}
                      cvs={cvs}
                    />
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-y-auto scroll-smooth bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-background to-background ${isSessionPage ? "p-0" : "p-6 lg:p-10"}`}>
          <div className={isSessionPage ? "w-full h-full" : "max-w-7xl mx-auto"}>
            {children}
          </div>
        </main>
      </div>

      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          sessions={sessions}
        />
      )}
    </div>
    </ThemeProvider>
  );
}
