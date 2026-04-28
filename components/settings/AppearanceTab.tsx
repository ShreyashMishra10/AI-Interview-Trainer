"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Globe, Check } from "lucide-react";
import { SettingSection, SettingRow, Toggle } from "./SettingsUI";

const ACCENTS = [
  { id: "amber",   color: "bg-amber-400",   label: "Amber"   },
  { id: "violet",  color: "bg-violet-400",  label: "Violet"  },
  { id: "emerald", color: "bg-emerald-400", label: "Emerald" },
  { id: "blue",    color: "bg-blue-400",    label: "Blue"    },
  { id: "rose",    color: "bg-rose-400",    label: "Rose"    },
];

export function AppearanceTab() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted,    setMounted]    = useState(false);
  const [accent,     setAccent]     = useState("amber");
  const [font,       setFont]       = useState("default");
  const [compact,    setCompact]    = useState(false);
  const [animations, setAnimations] = useState(true);
  const [language,   setLanguage]   = useState("English");
  const [timezone,   setTimezone]   = useState("IST (UTC+5:30)");

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("accent-color") ?? "amber";
    setAccent(saved);
    if (saved !== "amber") document.documentElement.setAttribute("data-accent", saved);
  }, []);

  const handleAccent = (id: string) => {
    setAccent(id);
    localStorage.setItem("accent-color", id);
    if (id === "amber") {
      document.documentElement.removeAttribute("data-accent");
    } else {
      document.documentElement.setAttribute("data-accent", id);
    }
  };

  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "dark";

  return (
    <div>
      {/* Theme */}
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
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  (t.id === "system" ? theme === "system" : currentTheme === t.id && theme !== "system")
                    || theme === t.id
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

      {/* Accent color */}
      <SettingSection title="Accent Color" description="Changes the highlight color across the dashboard">
        <div className="p-5 flex items-center gap-4 flex-wrap">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => handleAccent(a.id)}
              title={a.label}
              className={`relative w-9 h-9 rounded-full ${a.color} transition-all duration-200 ${
                accent === a.id
                  ? "ring-2 ring-offset-2 ring-offset-[#08080e] ring-white/40 scale-110"
                  : "opacity-50 hover:opacity-100 hover:scale-105"
              }`}
            >
              {accent === a.id && (
                <Check size={14} className="absolute inset-0 m-auto text-black font-bold" />
              )}
            </button>
          ))}
          <span className="text-xs text-zinc-600 ml-1 capitalize">{accent}</span>
        </div>
      </SettingSection>

      {/* Display */}
      <SettingSection title="Display">
        <SettingRow label="Font Size" description="Adjust the base font size across the app">
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none"
          >
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

      {/* Language & Region */}
      <SettingSection title="Language & Region">
        <SettingRow label="Display Language" description="Language used across the interface">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-zinc-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none"
            >
              <option>English</option>
              <option>日本語</option>
              <option>Hindi</option>
            </select>
          </div>
        </SettingRow>
        <SettingRow label="Timezone" description="Used for session scheduling and activity tracking">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none"
          >
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
