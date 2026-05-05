"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search, Bell, Menu, X, Mic2, FileText, Clock, ChevronRight, CreditCard, Info, CheckCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";

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
interface Notification {
  id:         string;
  type:       "system" | "payment" | "interview" | "cv";
  title:      string;
  message:    string | null;
  read:       boolean;
  created_at: string;
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

        <div className="max-h-105 overflow-y-auto">
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
  notifications,
  onMarkAllRead,
}: {
  onClose:        () => void;
  sessions:       Session[];
  cvs:            CV[];
  notifications:  Notification[];
  onMarkAllRead:  () => void;
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

  const notifIcon = (type: Notification["type"]) => {
    if (type === "payment")  return <CreditCard size={13} className="text-violet-400" />;
    if (type === "interview") return <Mic2 size={13} className="text-amber-500" />;
    if (type === "cv")        return <FileText size={13} className="text-emerald-500" />;
    return <Info size={13} className="text-sky-400" />;
  };
  const notifBg = (type: Notification["type"]) => {
    if (type === "payment")  return "bg-violet-500/10 border-violet-500/20";
    if (type === "interview") return "bg-amber-500/10 border-amber-500/20";
    if (type === "cv")        return "bg-emerald-500/10 border-emerald-500/20";
    return "bg-sky-500/10 border-sky-500/20";
  };

  // Merge all sources into one timeline sorted newest-first
  const allItems = [
    ...notifications.map((n) => ({
      id:         n.id,
      icon:       notifIcon(n.type),
      bg:         notifBg(n.type),
      title:      n.title,
      sub:        n.message ?? "",
      time:       timeAgo(n.created_at),
      created_at: n.created_at,
      read:       n.read,
      path:       n.type === "payment" ? "/dashboard/settings?tab=subscription"
                : n.type === "cv"      ? "/dashboard/cv-builder"
                : n.type === "interview" ? "/dashboard/interviews"
                : null,
    })),
    ...sessions.map((s) => ({
      id:         s.id,
      icon:       <Mic2 size={13} className="text-amber-500" />,
      bg:         "bg-amber-500/10 border-amber-500/20",
      title:      s.job_role,
      sub:        s.status === "completed" ? `Completed · Score: ${s.score ?? "—"}` : "In Progress",
      time:       timeAgo(s.created_at),
      created_at: s.created_at,
      read:       true,
      path:       s.status === "completed" ? `/dashboard/interviews/${s.id}` : "/dashboard/interviews",
    })),
    ...cvs.map((c) => ({
      id:         c.id,
      icon:       <FileText size={13} className="text-emerald-500" />,
      bg:         "bg-emerald-500/10 border-emerald-500/20",
      title:      `CV — ${c.target_role || "General"}`,
      sub:        "CV generated",
      time:       timeAgo(c.created_at),
      created_at: c.created_at,
      read:       true,
      path:       "/dashboard/cv-builder",
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Notifications</span>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              title="Mark all as read"
              className="text-zinc-600 hover:text-amber-400 transition-colors"
            >
              <CheckCheck size={14} />
            </button>
          )}
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-100 overflow-y-auto">
        {allItems.length === 0 ? (
          <div className="text-center py-10">
            <Bell size={24} className="text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-600 text-xs">No activity yet.</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {allItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { if (item.path) { onClose(); router.push(item.path); } }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left group ${
                  item.path ? "hover:bg-zinc-800 cursor-pointer" : "cursor-default"
                } ${!item.read ? "bg-zinc-800/40" : ""}`}
              >
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${item.bg}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${!item.read ? "text-white" : "text-zinc-200"}`}>
                    {item.title}
                  </p>
                  {item.sub && (
                    <p className="text-[11px] text-zinc-600 truncate">{item.sub}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  <span className="text-[10px] text-zinc-700">{item.time}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between">
        <button onClick={() => { onClose(); router.push("/dashboard/interviews"); }}
          className="text-[11px] text-amber-500 hover:text-amber-400 transition-colors font-medium cursor-pointer">
          View all interviews →
        </button>
        <button onClick={() => { onClose(); router.push("/dashboard/cv-builder"); }}
          className="text-[11px] text-emerald-500 hover:text-emerald-400 transition-colors font-medium cursor-pointer">
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

  const [sessions,       setSessions]       = useState<Session[]>([]);
  const [cvs,            setCVs]            = useState<CV[]>([]);
  const [notifications,  setNotifications]  = useState<Notification[]>([]);

  const isSessionPage = pathname.includes("/session");

  useEffect(() => {
    Promise.all([
      fetch("/api/interviews").then((r) => r.json()),
      fetch("/api/generate-cv").then((r) => r.json()),
      fetch("/api/notifications").then((r) => r.json()),
    ])
      .then(([s, c, n]) => {
        setSessions(Array.isArray(s) ? s : []);
        setCVs(Array.isArray(c) ? c : []);
        setNotifications(Array.isArray(n) ? n : []);
      })
      .catch(console.error);
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", { method: "PATCH" }).catch(console.error);
  };

  const prevUnreadRef = useRef(0);
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    if (unread > prevUnreadRef.current && localStorage.getItem("notif_sound") !== "false") {
      try {
        const ctx  = new AudioContext();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } catch { /* AudioContext not supported */ }
    }
    prevUnreadRef.current = unread;
  }, [notifications]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
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
          <header className="h-16 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between px-6 lg:px-8 bg-zinc-200 dark:bg-black/20 backdrop-blur-xl shadow-sm dark:shadow-none sticky top-0 z-40">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                className="md:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-full">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                  AI Engine: Online
                </span>
              </div>

              <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-6">
                <ModeToggle />
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
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-amber-500 rounded-full border border-black flex items-center justify-center text-[9px] font-bold text-black">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <NotificationsDropdown
                      onClose={() => setNotifOpen(false)}
                      sessions={sessions}
                      cvs={cvs}
                      notifications={notifications}
                      onMarkAllRead={handleMarkAllRead}
                    />
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-y-auto scroll-smooth bg-background ${isSessionPage ? "p-0" : "p-6 lg:p-10"}`}>
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
  );
}
