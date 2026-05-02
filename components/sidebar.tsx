"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Mic2, Languages, FileText,
  Settings, X, ChevronLeft, ChevronRight, ArrowLeft, Download,
} from "lucide-react";

function UserAvatar({ size = 28 }: { size?: number }) {
  const { user } = useUser();
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [loaded,    setLoaded]    = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { setCustomUrl(d.avatar_url ?? null); })
      .catch(() => {})
      .finally(() => setLoaded(true));

    const handler = (e: Event) => {
      const url = (e as CustomEvent<string>).detail;
      setCustomUrl(url ?? null);
    };
    window.addEventListener("avatar-updated", handler);
    return () => window.removeEventListener("avatar-updated", handler);
  }, []);

  // Wait for API response before choosing which image to show — prevents Gmail
  // photo flashing before the custom avatar loads.
  const src = loaded ? (customUrl || user?.imageUrl) : null;
  const initials = (user?.fullName ?? user?.firstName ?? "U")
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (!loaded) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-zinc-800 animate-pulse"
      />
    );
  }

  return src ? (
    <img
      src={src}
      alt="avatar"
      width={size}
      height={size}
      className="rounded-full object-cover border border-zinc-700"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-400"
    >
      {initials}
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const SidebarLink = ({ href, icon, label, active = false, collapsed = false, onClick }: SidebarLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
      collapsed ? "justify-center" : ""
    } ${
      active
        ? "bg-zinc-900 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/40"
    }`}
  >
    <span className={`shrink-0 ${active ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"} transition-colors`}>
      {icon}
    </span>
    {!collapsed && (
      <span className="text-sm font-medium tracking-tight truncate">{label}</span>
    )}
  </Link>
);

function SidebarContent({
  collapsed = false,
  onToggleCollapse,
  onClose,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const [profileName,    setProfileName]    = useState<string | null>(null);
  const [profileBio,     setProfileBio]     = useState<string | null>(null);
  const [targetRole,     setTargetRole]     = useState<string | null>(null);
  const [expLevel,       setExpLevel]       = useState<string | null>(null);
  const [avatarUrl,      setAvatarUrl]      = useState<string | null>(null);
  const [profileLoaded,  setProfileLoaded]  = useState(false);
  const [showCard,       setShowCard]       = useState(false);
  const [showLightbox,   setShowLightbox]   = useState(false);

  // Only use Clerk name as fallback AFTER the profile API has responded
  const displayName  = profileLoaded
    ? (profileName ?? user?.fullName ?? user?.firstName ?? "User")
    : null;
  const displayEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfileName(d.full_name       ?? null);
        setProfileBio(d.bio              ?? null);
        setTargetRole(d.target_role      ?? null);
        setExpLevel(d.experience_level   ?? null);
        setAvatarUrl(d.avatar_url        ?? null);
      })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));

    const nameHandler = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (name) setProfileName(name);
    };
    const avatarHandler = (e: Event) => {
      const url = (e as CustomEvent<string>).detail;
      if (url) setAvatarUrl(url);
    };
    window.addEventListener("profile-name-updated",  nameHandler);
    window.addEventListener("avatar-updated",        avatarHandler);
    return () => {
      window.removeEventListener("profile-name-updated", nameHandler);
      window.removeEventListener("avatar-updated",       avatarHandler);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">

      {/* Logo row */}
      <div className={`h-16 flex items-center border-b border-zinc-800/50 shrink-0 ${collapsed ? "justify-center px-2" : "justify-between px-6"}`}>
        {!collapsed && (
          <Link href="/dashboard" onClick={onClose}>
            <span className="text-xl font-serif italic tracking-tighter text-white">
              AI-Interview
            </span>
          </Link>
        )}

        {/* Mobile close */}
        {onClose && !collapsed && (
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex text-zinc-600 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        <SidebarLink href="/dashboard"                 icon={<LayoutDashboard size={18} />} label="Dashboard"       active={pathname === "/dashboard"}                  collapsed={collapsed} onClick={onClose} />
        <SidebarLink href="/dashboard/interviews"      icon={<Mic2 size={18} />}            label="Interviews"      active={pathname === "/dashboard/interviews"}       collapsed={collapsed} onClick={onClose} />
        <SidebarLink href="/dashboard/japanese-sensei" icon={<Languages size={18} />}       label="Japanese Sensei" active={pathname === "/dashboard/japanese-sensei"}  collapsed={collapsed} onClick={onClose} />
        <SidebarLink href="/dashboard/cv-builder"      icon={<FileText size={18} />}        label="CV Builder"      active={pathname === "/dashboard/cv-builder"}       collapsed={collapsed} onClick={onClose} />
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-zinc-800/50 space-y-2 shrink-0">
        <SidebarLink href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" collapsed={collapsed} onClick={onClose} />

        {/* Back to marketing site */}
        <Link
          href="/"
          onClick={onClose}
          title="Back to Home"
          className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/40 group ${collapsed ? "justify-center" : ""}`}
        >
          <span className="transition-colors group-hover:text-zinc-400">
            <ArrowLeft size={18} />
          </span>
          {!collapsed && <span className="text-sm font-medium tracking-tight">Back to Home</span>}
        </Link>

        {/* Profile card popup */}
        {showCard && (
          <div
            className="fixed inset-0 z-50"
            onClick={() => setShowCard(false)}
          >
            <div
              className="absolute bottom-20 left-4 w-72 bg-[#13131e] border border-zinc-800 rounded-2xl shadow-2xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                {(profileLoaded ? (avatarUrl || user?.imageUrl) : null) ? (
                  <button
                    onClick={() => setShowLightbox(true)}
                    className="relative group shrink-0 cursor-pointer"
                    title="View photo"
                  >
                    <img
                      src={avatarUrl || user?.imageUrl}
                      alt="avatar"
                      className="w-14 h-14 rounded-full object-cover border border-zinc-700 transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[9px] text-white font-semibold">View</span>
                    </div>
                  </button>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg font-bold text-amber-400 shrink-0">
                    {(displayName ?? "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{displayEmail}</p>
                </div>
              </div>
              <div className="border-t border-zinc-800 pt-4 space-y-3 mb-4">
                {profileBio && (
                  <p className="text-xs text-zinc-400 leading-relaxed">{profileBio}</p>
                )}
                {(targetRole || expLevel) && (
                  <div className="flex flex-wrap gap-2">
                    {targetRole && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold">
                        {targetRole}
                      </span>
                    )}
                    {expLevel && (
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-semibold">
                        {expLevel}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setShowCard(false)}
                className="block w-full text-center py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowCard((v) => !v)}
          className={`flex items-center gap-3 px-2 pt-2 w-full hover:opacity-80 transition-opacity cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <div className="shrink-0">
            <UserAvatar size={30} />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 text-left">
              {displayName ? (
                <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight truncate">{displayName}</span>
              ) : (
                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
              )}
              <span className="text-[9px] text-zinc-500 font-medium truncate mt-0.5">{displayEmail}</span>
            </div>
          )}
        </button>
      </div>

      {/* Lightbox */}
      {showLightbox && (avatarUrl || user?.imageUrl) && (
        <div
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={avatarUrl || user?.imageUrl}
              alt="Profile photo"
              className="w-64 h-64 rounded-2xl object-cover border border-zinc-700 shadow-2xl"
            />
            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  const src = avatarUrl || user?.imageUrl;
                  if (!src) return;
                  try {
                    const blob = await fetch(src).then((r) => r.blob());
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "profile-photo";
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch {
                    window.open(src, "_blank", "noopener,noreferrer");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400 text-xs font-semibold hover:bg-amber-400/25 transition-colors cursor-pointer"
              >
                <Download size={14} /> Download
              </button>
              <button
                onClick={() => setShowLightbox(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700 text-zinc-400 text-xs font-semibold hover:bg-zinc-700/60 transition-colors cursor-pointer"
              >
                <X size={14} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Sidebar = ({ collapsed = false, onToggleCollapse, mobileOpen = false, onMobileClose }: SidebarProps) => {
  return (
    <>
      {/* ── Desktop: collapsible static sidebar ── */}
      <aside
        className={`hidden md:flex flex-col border-r border-zinc-800/50 bg-black h-full shrink-0 transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>

      {/* ── Mobile: overlay drawer ── */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={onMobileClose}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-black border-r border-zinc-800/50 flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent onClose={onMobileClose} />
        </aside>
      </div>
    </>
  );
};
