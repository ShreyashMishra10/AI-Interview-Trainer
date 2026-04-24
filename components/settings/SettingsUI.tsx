"use client";

import React from "react";

export interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

export interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{ height: "22px", width: "40px" }}
      className={`relative rounded-full transition-all duration-300 flex items-center ${
        enabled ? "bg-amber-400" : "bg-zinc-700"
      }`}
    >
      <div
        className={`absolute w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
          enabled ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function SettingSection({ title, description, children }: SettingSectionProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
        {description && <p className="text-xs text-zinc-600 mt-0.5">{description}</p>}
      </div>
      <div className="bg-[#08080e] border border-zinc-800/60 rounded-2xl divide-y divide-zinc-800/50">
        {children}
      </div>
    </div>
  );
}

export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div className="min-w-0">
        <p className="text-sm text-zinc-300 font-medium">{label}</p>
        {description && (
          <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
