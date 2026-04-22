"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Mic2, Languages, FileText, Settings } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}
export const Sidebar = () => {
    const pathname = usePathname();
  return (
    <aside className="w-64 border-r border-zinc-800/50 bg-black flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
        <span className="text-xl font-serif italic tracking-tighter text-white">
          AI-Interview
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18}/>} label="Dashboard" active={pathname === "/dashboard"} />
        <SidebarLink href="/dashboard/interviews" icon={<Mic2 size={18}/>} label="Interviews" active={pathname === "/dashboard/interviews"}/>
        <SidebarLink href="/dashboard/japanese-sensei" icon={<Languages size={18}/>} label="Japanese Sensei" active={pathname === "/dashboard/japanese-sensei"} />
        <SidebarLink href="/dashboard/cv-builder" icon={<FileText size={18}/>} label="CV Builder" active={pathname === "/dashboard/cv-builder"} />
      </nav>
      
      <div className="p-4 border-t border-zinc-800/50 space-y-4">
        <SidebarLink href="/dashboard/settings" icon={<Settings size={18}/>} label="Settings" />
        
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="scale-90">
            <UserButton />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight">Shreyash</span>
            <span className="text-[9px] text-zinc-500 font-medium">Full-Stack Architect</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ href, icon, label, active = false }: SidebarLinkProps) => (
  <Link 
    href={href} 
    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-zinc-900 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/40'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors`}>
      {icon}
    </span>
    <span className="text-sm font-medium tracking-tight">{label}</span>
  </Link>
);