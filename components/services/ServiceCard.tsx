"use client";

import { useState } from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { SERVICES } from "./ServicesData";

type Service = (typeof SERVICES)[0];

export function ServiceCard({ service }: { service: Service }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className={`bg-white shadow-sm border-zinc-200 dark:bg-card dark:border-border dark:shadow-none rounded-2xl p-6 transition-all duration-300 cursor-pointer border ${service.color} ${service.glow}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${service.iconBg}`}>
            {service.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground">{service.title}</h3>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${service.tagColor}`}>
                {service.tag}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
              <span>Free: {service.free}</span>
              <span>·</span>
              <span className="text-amber-500/80">Pro: {service.pro}</span>
            </div>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className={`text-muted-foreground shrink-0 transition-transform duration-300 ${expanded ? "rotate-90 text-foreground" : ""}`}
        />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>

      {expanded && (
        <div className="border-t border-border pt-4 mt-2 space-y-2 animate-in fade-in duration-200">
          {service.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Check size={12} className="text-amber-500 shrink-0" />
              {h}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}