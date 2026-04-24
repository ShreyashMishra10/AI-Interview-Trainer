"use client";

import React, { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { SettingSection, SettingRow, Toggle } from "./SettingsUI";

export function PrivacyTab() {
  const [privacy, setPrivacy] = useState({
    profilePublic:  false,
    showStreak:     true,
    shareProgress:  false,
    analytics:      true,
    crashReports:   true,
  });

  const toggle = (key: keyof typeof privacy) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <SettingSection title="Profile Visibility">
        <SettingRow label="Public Profile" description="Allow others to view your profile and scores">
          <Toggle enabled={privacy.profilePublic} onChange={() => toggle("profilePublic")} />
        </SettingRow>
        <SettingRow label="Show Activity Streak" description="Display your interview streak on your profile">
          <Toggle enabled={privacy.showStreak} onChange={() => toggle("showStreak")} />
        </SettingRow>
        <SettingRow label="Share Progress" description="Allow progress sharing on leaderboards">
          <Toggle enabled={privacy.shareProgress} onChange={() => toggle("shareProgress")} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Data & Analytics">
        <SettingRow label="Usage Analytics" description="Help improve the product by sharing anonymous usage data">
          <Toggle enabled={privacy.analytics} onChange={() => toggle("analytics")} />
        </SettingRow>
        <SettingRow label="Crash Reports" description="Automatically send crash reports to help fix bugs">
          <Toggle enabled={privacy.crashReports} onChange={() => toggle("crashReports")} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Your Data" description="Download or delete your personal data">
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#0d0d16] rounded-xl border border-zinc-800">
            <div>
              <p className="text-sm font-medium text-zinc-300">Export My Data</p>
              <p className="text-xs text-zinc-600 mt-0.5">Download all your interviews, scores and activity as JSON</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-xs font-semibold hover:border-amber-400/30 hover:text-amber-400 transition-all">
              <Download size={13} /> Export
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0d0d16] rounded-xl border border-zinc-800">
            <div>
              <p className="text-sm font-medium text-zinc-300">Clear Interview History</p>
              <p className="text-xs text-zinc-600 mt-0.5">Remove all past session records permanently</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all">
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
