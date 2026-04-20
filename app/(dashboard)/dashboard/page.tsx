import { PerformanceGauge } from "@/components/PerformanceGauge";
import { ActivityHeatmap } from "@/components/ActivityHeatmap"; // Import it here
import { Mic2, Languages, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">

      <section className="py-4">
        <h1 className="text-5xl font-serif text-white tracking-tight">
          Welcome back, Shreyash.
        </h1>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          
          <section className="dashboard-card min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="absolute top-8 left-8 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              Performance Pulse
            </h3>
            <h3>
              Interview Readiness Score
            </h3>
            <PerformanceGauge percentage={85} />
            <div className="ready-badge mt-6">Ready for Kratya.AI</div>
          </section>

          <section className="dashboard-card p-6">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">
        Annual Commitment
      </h3>
      <p className="text-zinc-600 text-[10px] mt-1">Daily interview and practice history</p>
    </div>
  </div>
  
  <ActivityHeatmap />
</section>

            
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <ActionCard
              title="Stimulate Mock Interview"
              icon={<Mic2 size={16} />}
              subtitle="Target role: Full-Stack WebDeveloper" />
            <ActionCard title="JP-Sensei Japanese Practice" icon={<Languages size={16} />}
            subtitle="Current Level: Practice Mastery" />
          </div>

          <section className="dashboard-card h-[450px] flex flex-col">
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
              AI Feedback Feed
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
              <FeedbackItem
                type="CRITICAL"
                text="Inconsistent use of honorifics during the Japanese introduction module."
              />
              <FeedbackItem
                type="STRENGTH"
                text="High technical accuracy on System Architecture questions."
              />
              <FeedbackItem
                type="STRENGTH"
                text="Natural flow in the English Literature breakdown section."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, icon, subtitle }: { title: string; icon: React.ReactNode, subtitle?: string }) {
  return (
    <div className="dashboard-card p-5 group cursor-pointer hover:border-gold-accent/40 transition-all border-zinc-900">
      <div className="flex justify-between items-start mb-4">
        <span className="text-zinc-600 group-hover:text-gold-accent transition-colors">
          {icon}
        </span>
        <ArrowUpRight
          size={14}
          className="text-zinc-800 group-hover:text-zinc-400"
        />
      </div>
      <p className="text-xs font-bold text-zinc-200 tracking-tight">{title}</p>
          <p className="text-[10px] text-gold-muted/80 font-medium mt-1.5 uppercase tracking-wider">
            {subtitle}
          </p>
    </div>
  );
}

function FeedbackItem({
  type,
  text,
}: {
  type: "CRITICAL" | "STRENGTH";
  text: string;
}) {
  const isCritical = type === "CRITICAL";
  return (
    <div
      className={`p-4 rounded-lg border ${isCritical ? "bg-red-500/5 border-red-500/10" : "bg-gold-accent/5 border-gold-accent/10"}`}
    >
      <p
        className={`text-[9px] font-bold uppercase mb-1 tracking-widest ${isCritical ? "text-red-400" : "text-gold-muted"}`}
      >
        {type} Analysis
      </p>
      <p className="text-xs text-zinc-400 leading-relaxed font-medium">
        {text}
      </p>
    </div>
  );
}
