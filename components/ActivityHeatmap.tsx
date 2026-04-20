"use client";

import { useMemo, useEffect, useState } from "react";

export const ActivityHeatmap = () => {
  const [mounted, setMounted] = useState(false);
  const year = 2026;
  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => { setMounted(true); }, []);

  const { calendarGrid, monthLabels } = useMemo(() => {
    const days = [];
    const labels = [];
    const startOffset = 3; 
    const totalGridSlots = 371;

    let currentMonth = -1;

    for (let i = 0; i < totalGridSlots; i++) {
      const date = new Date(year, 0, 1 - startOffset + i);
      const isCurrentYear = date.getFullYear() === year;
      
      const dateString = date.toDateString();
      const hash = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const level = isCurrentYear ? (hash % 5) : -1;

      if (isCurrentYear && date.getMonth() !== currentMonth) {
        currentMonth = date.getMonth();
        labels.push({ name: MONTH_NAMES[currentMonth], col: Math.floor(i / 7) });
      }
      days.push({ level, date, isCurrentYear });
    }
    return { calendarGrid: days, monthLabels: labels };
  }, []);

  if (!mounted) return <div className="h-[160px] w-full bg-zinc-900/5 rounded-xl border border-zinc-900/50" />;

  return (
    <div className="flex flex-col gap-1 w-full select-none animate-in fade-in duration-700">
      <div className="flex">
        {/* Y-AXIS: 7 Days - High precision spacing */}
        <div className="flex flex-col gap-1 mt-8 mr-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => (
            <span key={i} className="text-[9px] font-bold w-8 h-[11px] flex items-center text-zinc-500 italic">
              {label}
            </span>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
          <div className="relative h-6 w-full mb-1">
            {monthLabels.map((m, i) => (
              <span 
                key={i} 
                className="absolute text-[10px] text-zinc-500 font-bold uppercase tracking-tighter"
                style={{ left: `${(m.col * 15) + 2}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {calendarGrid.map((day, i) => (
              <div
                key={i}
                className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-300 ${
                  day.level === -1 ? "bg-transparent border-none" : "border"
                }`}
                style={{
                  backgroundColor: day.level <= 0 ? (day.level === -1 ? 'transparent' : '#18181b') : `rgba(184, 145, 46, ${day.level * 0.25})`,
                  borderColor: day.level <= 0 ? (day.level === -1 ? 'transparent' : '#27272a') : `rgba(184, 145, 46, 0.4)`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};