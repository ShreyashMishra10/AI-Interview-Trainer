"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Globe, Check } from "lucide-react";
import { SettingSection, SettingRow, Toggle } from "./SettingsUI";

const ACCENTS = [
  { id: "amber",   hex: "#fbbf24", label: "Amber"   },
  { id: "violet",  hex: "#a78bfa", label: "Violet"  },
  { id: "emerald", hex: "#34d399", label: "Emerald" },
  { id: "blue",    hex: "#60a5fa", label: "Blue"    },
  { id: "rose",    hex: "#fb7185", label: "Rose"    },
];

const LANGUAGES = [
  { label: "English",            code: "en" },
  { label: "日本語 (Japanese)",  code: "ja" },
  { label: "हिन्दी (Hindi)",     code: "hi" },
  { label: "Español (Spanish)",  code: "es" },
  { label: "Français (French)",  code: "fr" },
  { label: "Deutsch (German)",   code: "de" },
  { label: "Português",          code: "pt" },
  { label: "中文 (Chinese)",     code: "zh" },
  { label: "한국어 (Korean)",    code: "ko" },
  { label: "Italiano",           code: "it" },
  { label: "Русский (Russian)",  code: "ru" },
  { label: "العربية (Arabic)",   code: "ar" },
];

const FONT_CLASSES = ["font-small", "font-large"] as const;
function applyFont(value: string) {
  FONT_CLASSES.forEach((c) => document.documentElement.classList.remove(c));
  if (value === "small") document.documentElement.classList.add("font-small");
  if (value === "large") document.documentElement.classList.add("font-large");
}

function applyAnimations(enabled: boolean) {
  document.documentElement.classList.toggle("no-animations", !enabled);
}

function applyCompact(enabled: boolean) {
  document.documentElement.classList.toggle("compact", enabled);
}

function applyAccent(id: string) {
  if (id === "amber") {
    document.documentElement.removeAttribute("data-accent");
  } else {
    document.documentElement.setAttribute("data-accent", id);
  }
}

export function AppearanceTab() {
  const [mounted,    setMounted]    = useState(false);
  const [accent,     setAccent]     = useState("amber");
  const [font,       setFont]       = useState("default");
  const [compact,    setCompact]    = useState(false);
  const [animations, setAnimations] = useState(true);
  const [language,   setLanguage]   = useState("English");
  const [timezone,   setTimezone]   = useState("IST (UTC+5:30)");

  // Load all preferences from localStorage on mount and apply them
  useEffect(() => {
    const savedAccent     = localStorage.getItem("appearance_accent")     ?? "amber";
    const savedFont       = localStorage.getItem("appearance_font")       ?? "default";
    const savedCompact    = localStorage.getItem("appearance_compact")    === "true";
    const savedAnimations = localStorage.getItem("appearance_animations") !== "false";
    const savedLanguage   = localStorage.getItem("appearance_language")   ?? "English";
    const savedTimezone   = localStorage.getItem("appearance_timezone")   ?? "IST (UTC+5:30)";

    setAccent(savedAccent);
    setFont(savedFont);
    setCompact(savedCompact);
    setAnimations(savedAnimations);
    setLanguage(savedLanguage);
    setTimezone(savedTimezone);

    applyAccent(savedAccent);
    applyFont(savedFont);
    applyAnimations(savedAnimations);
    applyCompact(savedCompact);

    const lang = LANGUAGES.find((l) => l.label === savedLanguage)?.code ?? "en";
    document.documentElement.lang = lang;

    setMounted(true);
  }, []);

  const handleAccent = (id: string) => {
    setAccent(id);
    localStorage.setItem("appearance_accent", id);
    applyAccent(id);
  };

  const handleFont = (value: string) => {
    setFont(value);
    localStorage.setItem("appearance_font", value);
    applyFont(value);
  };

  const handleAnimations = (value: boolean) => {
    setAnimations(value);
    localStorage.setItem("appearance_animations", String(value));
    applyAnimations(value);
  };

  const handleCompact = (value: boolean) => {
    setCompact(value);
    localStorage.setItem("appearance_compact", String(value));
    applyCompact(value);
  };

  const handleLanguage = (value: string) => {
    setLanguage(value);
    localStorage.setItem("appearance_language", value);
    const lang = LANGUAGES.find((l) => l.label === value)?.code ?? "en";
    document.documentElement.lang = lang;
  };

  const handleTimezone = (value: string) => {
    setTimezone(value);
    localStorage.setItem("appearance_timezone", value);
  };

  if (!mounted) return null;

  return (
    <div>
      {/* Theme */}
      <SettingSection title="Theme" description="Dashboard is dark-only — light mode coming soon">
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark",   label: "Dark",   icon: <Moon size={18} />,    active: true  },
              { id: "light",  label: "Light",  icon: <Sun size={18} />,     active: false },
              { id: "system", label: "System", icon: <Monitor size={18} />, active: false },
            ].map((t) => (
              <button
                key={t.id}
                disabled={!t.active}
                title={!t.active ? "Coming soon" : undefined}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                  t.id === "dark"
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : "border-zinc-800 text-zinc-700 opacity-40 cursor-not-allowed"
                }`}
              >
                {t.icon}
                <span className="text-xs font-semibold">{t.label}</span>
                {!t.active && (
                  <span className="absolute top-1.5 right-1.5 text-[8px] bg-zinc-800 text-zinc-500 px-1 rounded font-bold">SOON</span>
                )}
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
              style={{ backgroundColor: a.hex }}
              className={`relative w-9 h-9 rounded-full transition-all duration-200 cursor-pointer ${
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
            onChange={(e) => handleFont(e.target.value)}
            className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer"
          >
            <option value="small">Small</option>
            <option value="default">Default</option>
            <option value="large">Large</option>
          </select>
        </SettingRow>
        <SettingRow label="Compact Mode" description="Reduce spacing for a denser layout">
          <Toggle enabled={compact} onChange={handleCompact} />
        </SettingRow>
        <SettingRow label="Animations" description="Enable interface animations and transitions">
          <Toggle enabled={animations} onChange={handleAnimations} />
        </SettingRow>
      </SettingSection>

      {/* Language & Region */}
      <SettingSection title="Language & Region">
        <SettingRow label="Display Language" description="Language preference (interface translation coming soon)">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-zinc-600" />
            <select
              value={language}
              onChange={(e) => handleLanguage(e.target.value)}
              className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.label}>{l.label}</option>
              ))}
            </select>
          </div>
        </SettingRow>
        <SettingRow label="Timezone" description="Used for session scheduling and activity timestamps">
          <select
            value={timezone}
            onChange={(e) => handleTimezone(e.target.value)}
            className="bg-[#0d0d16] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer"
          >
            <option>IST (UTC+5:30)</option>
            <option>JST (UTC+9:00)</option>
            <option>UTC</option>
            <option>PST (UTC-8:00)</option>
            <option>EST (UTC-5:00)</option>
            <option>CET (UTC+1:00)</option>
          </select>
        </SettingRow>
      </SettingSection>
    </div>
  );
}
