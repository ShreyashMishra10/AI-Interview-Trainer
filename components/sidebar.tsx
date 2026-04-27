"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, Mic2, Languages, FileText,
  Settings, X, ChevronLeft, ChevronRight, ArrowLeft,
} from "lucide-react";

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

        <div className={`flex items-center gap-3 px-2 pt-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="scale-90 shrink-0">
            <UserButton />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight truncate">Shreyash</span>
              <span className="text-[9px] text-zinc-500 font-medium">Full-Stack Architect</span>
            </div>
          )}
        </div>
      </div>
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
