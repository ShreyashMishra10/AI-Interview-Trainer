"use client";

import React, { useState } from "react";
import { User, Lock, Palette, Bell, Shield, CreditCard, ChevronRight } from "lucide-react";
import { ProfileTab }       from "@/components/settings/ProfileTab";
import { AccountTab }       from "@/components/settings/AccountTab";
import { AppearanceTab }    from "@/components/settings/AppearanceTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { PrivacyTab }       from "@/components/settings/PrivacyTab";
import { SubscriptionTab }  from "@/components/settings/SubscriptionTab";

type Tab = "profile" | "account" | "appearance" | "notifications" | "privacy" | "subscription";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile",       label: "Profile",       icon: <User size={15} />       },
  { id: "account",       label: "Account",       icon: <Lock size={15} />       },
  { id: "appearance",    label: "Appearance",    icon: <Palette size={15} />    },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} />       },
  { id: "privacy",       label: "Privacy",       icon: <Shield size={15} />     },
  { id: "subscription",  label: "Subscription",  icon: <CreditCard size={15} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":       return <ProfileTab />;
      case "account":       return <AccountTab />;
      case "appearance":    return <AppearanceTab />;
      case "notifications": return <NotificationsTab />;
      case "privacy":       return <PrivacyTab />;
      case "subscription":  return <SubscriptionTab />;
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto animate-in fade-in duration-700">
      <div className="py-4 mb-8">
        <h1 className="text-4xl font-serif text-white tracking-tight">Settings</h1>
        <p className="text-zinc-600 mt-1 text-sm">Manage your account, preferences and subscription.</p>
      </div>

      <div className="flex gap-8">
        <div className="w-48 shrink-0">
          <nav className="space-y-1 sticky top-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-amber-400/10 text-amber-400 border border-amber-400/15"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                }`}
              >
                <span className={activeTab === tab.id ? "text-amber-400" : "text-zinc-600"}>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && <ChevronRight size={13} className="ml-auto text-amber-400/60" />}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 min-w-0">{renderTab()}</div>
      </div>
    </div>
  );
}
