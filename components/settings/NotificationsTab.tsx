"use client";

import React, { useState } from "react";
import { SettingSection, SettingRow, Toggle } from "./SettingsUI";

export function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    interviewReminders: true,
    weeklyReport:       true,
    sessionComplete:    true,
    tips:               false,
    marketing:          false,
    push:               true,
    email:              true,
    sms:                false,
    sound:              true,
  });

  const toggle = (key: keyof typeof notifs) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <SettingSection title="Interview Notifications">
        <SettingRow label="Interview Reminders" description="Get notified before scheduled mock interviews">
          <Toggle enabled={notifs.interviewReminders} onChange={() => toggle("interviewReminders")} />
        </SettingRow>
        <SettingRow label="Session Complete Summary" description="Receive a summary after each interview session">
          <Toggle enabled={notifs.sessionComplete} onChange={() => toggle("sessionComplete")} />
        </SettingRow>
        <SettingRow label="Weekly Progress Report" description="Weekly digest of your performance and streaks">
          <Toggle enabled={notifs.weeklyReport} onChange={() => toggle("weeklyReport")} />
        </SettingRow>
        <SettingRow label="Learning Tips" description="Daily tips and study suggestions from AI">
          <Toggle enabled={notifs.tips} onChange={() => toggle("tips")} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Notification Channels">
        <SettingRow label="Push Notifications" description="Browser and mobile push alerts">
          <Toggle enabled={notifs.push} onChange={() => toggle("push")} />
        </SettingRow>
        <SettingRow label="Email" description="Notifications sent to shreyash@dev.com">
          <Toggle enabled={notifs.email} onChange={() => toggle("email")} />
        </SettingRow>
        <SettingRow label="SMS" description="Text message alerts (requires phone number)">
          <Toggle enabled={notifs.sms} onChange={() => toggle("sms")} />
        </SettingRow>
        <SettingRow label="Sound" description="Play sound for in-app notifications">
          <Toggle enabled={notifs.sound} onChange={() => toggle("sound")} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Marketing">
        <SettingRow label="Product Updates & Offers" description="Occasional emails about new features and promotions">
          <Toggle enabled={notifs.marketing} onChange={() => toggle("marketing")} />
        </SettingRow>
      </SettingSection>
    </div>
  );
}
