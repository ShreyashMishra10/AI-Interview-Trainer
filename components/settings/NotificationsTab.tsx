"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SettingSection, SettingRow, Toggle } from "./SettingsUI";

type NotifPrefs = {
  interviewReminders: boolean;
  weeklyReport:       boolean;
  sessionComplete:    boolean;
  tips:               boolean;
  marketing:          boolean;
  email:              boolean;
  sound:              boolean;
};

const DEFAULTS: NotifPrefs = {
  interviewReminders: true,
  weeklyReport:       true,
  sessionComplete:    true,
  tips:               false,
  marketing:          false,
  email:              true,
  sound:              true,
};

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // AudioContext not supported
  }
}

export function NotificationsTab() {
  const [prefs,   setPrefs]   = useState<NotifPrefs>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.notification_prefs) setPrefs({ ...DEFAULTS, ...d.notification_prefs });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const savePrefs = (next: NotifPrefs) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const res = await fetch("/api/profile", {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ notification_prefs: next }),
        });
        if (!res.ok) throw new Error();
        toast.success("Notification preferences saved.");
      } catch {
        toast.error("Failed to save preferences.");
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  const toggle = (key: keyof NotifPrefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    if (key === "sound" && next.sound) playBeep();
    savePrefs(next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div>
      {saving && (
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-4">
          <Loader2 size={11} className="animate-spin" /> Saving…
        </div>
      )}

      <SettingSection title="Interview Notifications">
        <SettingRow label="Interview Reminders" description="Get notified before scheduled mock interviews">
          <Toggle enabled={prefs.interviewReminders} onChange={() => toggle("interviewReminders")} />
        </SettingRow>
        <SettingRow label="Session Complete Summary" description="Receive a summary after each interview session">
          <Toggle enabled={prefs.sessionComplete} onChange={() => toggle("sessionComplete")} />
        </SettingRow>
        <SettingRow label="Weekly Progress Report" description="Weekly digest of your performance and streaks">
          <Toggle enabled={prefs.weeklyReport} onChange={() => toggle("weeklyReport")} />
        </SettingRow>
        <SettingRow label="Learning Tips" description="Daily tips and study suggestions from AI">
          <Toggle enabled={prefs.tips} onChange={() => toggle("tips")} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Channels">
        <SettingRow label="Email Notifications" description="Notifications sent to your registered email">
          <Toggle enabled={prefs.email} onChange={() => toggle("email")} />
        </SettingRow>
        <SettingRow label="In-App Sound" description="Play a sound for in-app notifications">
          <Toggle enabled={prefs.sound} onChange={() => toggle("sound")} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Marketing">
        <SettingRow label="Product Updates & Offers" description="Occasional emails about new features and promotions">
          <Toggle enabled={prefs.marketing} onChange={() => toggle("marketing")} />
        </SettingRow>
      </SettingSection>
    </div>
  );
}
