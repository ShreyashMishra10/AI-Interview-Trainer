"use client";

import React, { useState } from "react";
import { Moon, Sun, Monitor, Globe } from "lucide-react";
import { SettingSection, SettingRow, Toggle } from "./SettingsUI";

export function AppearanceTab() {
  const [theme, setTheme]           = useState<"dark" | "light" | "system">("dark");
  const [accent, setAccent]         = useState("amber");
  const [font, setFont]             = useState("default");
  const [compact, setCompact]       = useState(false);
  const [animations, setAnimations] = useState(true);
  const [language, setLanguage]     = useState("English");
  const [timezone, setTimezone]     = useState("IST (UTC+5:30)");

  const accents = [
    { id: "amber",   color: "bg-amber-400"   },
    { id: "violet",  color: "bg-violet-400"  },
    { id: "emerald", color: "bg-emerald-400" },
    { id: "blue",    color: "bg-blue-400"    },
    { id: "rose",    color: "bg-rose-400"    },
  ];

  return (
    <div>
      <SettingSection title="Theme" description="Choose your preferred color scheme">
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark",   label: "Dark",   icon: <Moon size={18} />    },
              { id: "light",  label: "Light",  icon: <Sun size={18} />     },
              { id: "system", label: "System", icon: <Monitor size={18} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as "dark" | "light" | "system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  theme === t.id
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                }`}
              >
                {t.icon}
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Accent Color">
        <div className="p-5 flex gap-3 flex-wrap">
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={`w-8 h-8 rounded-full ${a.color} transition-all ${
                accent === a.id ? "ring-2 ring-offset-2 ring-offset-[#08080e] ring-white/30 scale-110" : "opacity-60 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Display">
        <SettingRow label="Font Size" description="Adjust the base font size across the app">
          <select value={font} onChange={(e) => setFont(e.target.value)} className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none">
            <option value="small">Small</option>
            <option value="default">Default</option>
            <option value="large">Large</option>
          </select>
        </SettingRow>
        <SettingRow label="Compact Mode" description="Reduce spacing for a denser layout">
          <Toggle enabled={compact} onChange={setCompact} />
        </SettingRow>
        <SettingRow label="Animations" description="Enable interface animations and transitions">
          <Toggle enabled={animations} onChange={setAnimations} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Language & Region">
        <SettingRow label="Display Language" description="Language used across the interface">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-zinc-600" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none">
              <option>English</option>
              <option>日本語</option>
              <option>Hindi</option>
            </select>
          </div>
        </SettingRow>
        <SettingRow label="Timezone" description="Used for session scheduling and activity tracking">
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none">
            <option>IST (UTC+5:30)</option>
            <option>JST (UTC+9:00)</option>
            <option>UTC</option>
            <option>PST (UTC-8:00)</option>
          </select>
        </SettingRow>
      </SettingSection>
    </div>
  );
}
