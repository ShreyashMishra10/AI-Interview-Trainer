import { Sidebar } from "@/components/sidebar";
import { Search, Bell, Activity } from "lucide-react";
import "./global.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-gold-accent/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
          
          <div className="flex items-center gap-3" />

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/50 rounded-full">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">AI Engine: Online</span>
            </div>
            <div className="flex items-center gap-3 border-l border-zinc-800 pl-6">
              <button className="text-zinc-500 hover:text-white transition-colors p-1.5">
                <Search size={18} strokeWidth={1.5} />
              </button>
              <button className="text-zinc-500 hover:text-white transition-colors p-1.5 relative">
                <Bell size={18} strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-accent rounded-full border border-black"></span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-background to-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}