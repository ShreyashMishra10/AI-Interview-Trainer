"use client";

import React, { useState } from "react";
import NewSessionDialog from "@/components/NewSessionDialog";

export default function InterviewsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div>
        <div className="flex items-center justify-between mb-[28px]">
          <div>
            <h1 className="font-[var(--syne)] text-[26px] font-bold tracking-[-0.5px]">Interview sessions</h1>
            <p className="text-[#7A7A9A] text-[14px] mt-[4px]">All your practice sessions — review, retake, or start fresh.</p>
          </div>
          <button 
            className="flex items-center gap-[8px] bg-[#6C63FF] text-white border-none rounded-[10px] px-[18px] py-[10px] text-[14px] font-medium font-[var(--dm)] cursor-pointer transition-all duration-150 hover:bg-[#7C74FF] hover:-translate-y-[1px] shrink-0"
            onClick={() => setIsDialogOpen(true)}
          >
            <svg className="w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New session
          </button>
        </div>

        {/* Filter Row */}
        <div className="flex gap-[8px] mb-[20px]">
          <button className="px-[14px] py-[6px] rounded-[20px] text-[13px] border border-[#6C63FF] text-[#6C63FF] bg-[rgba(108,99,255,0.08)] font-[var(--dm)]">All</button>
          {["Frontend", "Backend", "ML / AI", "DevOps", "DSA"].map((filter) => (
            <button key={filter} className="px-[14px] py-[6px] rounded-[20px] text-[13px] border border-[#272731] bg-transparent text-[#7A7A9A] cursor-pointer font-[var(--dm)] transition-all hover:border-[#6C63FF] hover:text-[#6C63FF]">
              {filter}
            </button>
          ))}
        </div>

        {/* History Grid */}
        <div className="grid gap-[12px]">
          <InterviewCard title="React Developer" emoji="⚛️" bgColor="rgba(108,99,255,0.15)" score={82} scoreColor="text-[#34D399]" time="Yesterday" questions="12" duration="38 min" />
          <InterviewCard title="Python Backend Developer" emoji="🐍" bgColor="rgba(52,211,153,0.1)" score={71} scoreColor="text-[#FBBF24]" time="2 days ago" questions="10" duration="29 min" />
          <InterviewCard title="Machine Learning Engineer" emoji="🤖" bgColor="rgba(251,191,36,0.1)" score={88} scoreColor="text-[#34D399]" time="4 days ago" questions="15" duration="52 min" />
          <InterviewCard title="DevOps Engineer" emoji="☁️" bgColor="rgba(248,113,113,0.1)" score={58} scoreColor="text-[#F87171]" time="1 week ago" questions="9" duration="25 min" status="Incomplete" />
        </div>
      </div>

      <NewSessionDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
      />
      
    </div>
  );
}

function InterviewCard({ title, emoji, bgColor, score, scoreColor, time, questions, duration, status = "Completed" }: any) {
  const isIncomplete = status === "Incomplete";
  return (
    <div className="bg-[#171721] border border-[#272731] rounded-[14px] p-[18px_20px] flex items-center gap-[16px] cursor-pointer transition-all hover:border-[#373741] hover:bg-[#1D1D28] hover:-translate-y-[1px]">
      <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center text-[20px] shrink-0" style={{ background: bgColor }}>{emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium mb-[3px] text-white">{title}</div>
        <div className="text-[12px] text-[#7A7A9A] flex items-center gap-[12px]">
          <span>{time}</span><span className="w-[3px] h-[3px] rounded-full bg-[#4A4A6A]"></span><span>{questions} questions</span><span className="w-[3px] h-[3px] rounded-full bg-[#4A4A6A]"></span><span>{duration}</span>
        </div>
        <span className={`inline-flex items-center text-[11px] px-[8px] py-[3px] rounded-[20px] mt-[4px] ${isIncomplete ? 'bg-[rgba(251,191,36,0.12)] text-[#FBBF24]' : 'bg-[rgba(52,211,153,0.1)] text-[#34D399]'}`}>{status}</span>
      </div>
      <div className="text-right">
        <div className={`font-[var(--syne)] text-[22px] font-bold ${scoreColor}`}>{score}</div>
        <div className="text-[11px] text-[#7A7A9A]">score</div>
      </div>
    </div>
  );
}