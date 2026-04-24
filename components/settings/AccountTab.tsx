"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Trash2, LogOut, Smartphone } from "lucide-react";
import { SettingSection, SettingRow } from "./SettingsUI";

export function AccountTab() {
  const [showOld, setShowOld]         = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [showDelete, setShowDelete]   = useState(false);

  return (
    <div>
      <SettingSection title="Change Password">
        <div className="p-5 space-y-4">
          {[
            { label: "Current Password", show: showOld,     setShow: setShowOld     },
            { label: "New Password",     show: showNew,     setShow: setShowNew     },
            { label: "Confirm Password", show: showConfirm, setShow: setShowConfirm },
          ].map(({ label, show, setShow }) => (
            <div key={label}>
              <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">{label}</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder="••••••••" className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors pr-11 placeholder:text-zinc-700" />
                <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
          <button className="px-5 py-2.5 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400 text-sm font-semibold hover:bg-amber-400/20 transition-all">
            Update Password
          </button>
        </div>
      </SettingSection>

      <SettingSection title="Connected Accounts" description="Manage your OAuth connections">
        {[
          { name: "Google",   icon: "🔵", connected: true  },
          { name: "GitHub",   icon: "⚫", connected: false },
          { name: "LinkedIn", icon: "🔷", connected: false },
        ].map((acc) => (
          <SettingRow key={acc.name} label={`${acc.icon} ${acc.name}`} description={acc.connected ? "Connected" : "Not connected"}>
            <button className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all border ${acc.connected ? "border-red-500/20 text-red-400 hover:bg-red-500/10" : "border-amber-400/20 text-amber-400 hover:bg-amber-400/10"}`}>
              {acc.connected ? "Disconnect" : "Connect"}
            </button>
          </SettingRow>
        ))}
      </SettingSection>

      <SettingSection title="Active Sessions" description="Devices currently signed in to your account">
        {[
          { device: "Chrome on Windows", location: "Mumbai, IN", current: true,  time: "Now"         },
          { device: "Safari on iPhone",  location: "Mumbai, IN", current: false, time: "2 hours ago" },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-zinc-600 shrink-0" />
              <div>
                <p className="text-sm text-zinc-300 font-medium flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Current</span>}
                </p>
                <p className="text-xs text-zinc-600">{s.location} · {s.time}</p>
              </div>
            </div>
            {!s.current && <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>}
          </div>
        ))}
      </SettingSection>

      <SettingSection title="Danger Zone">
        <div className="p-5 space-y-4">
          <div className="border border-red-500/15 rounded-xl p-4 bg-red-500/5">
            <p className="text-sm font-semibold text-red-400 mb-1">Delete Account</p>
            <p className="text-xs text-zinc-600 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
            {!showDelete ? (
              <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/25 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all">
                <Trash2 size={13} /> Delete my account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500">Type <span className="text-red-400 font-mono">DELETE</span> to confirm:</p>
                <input value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder="Type DELETE" className="w-full bg-[#0d0d16] border border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none font-mono" />
                <div className="flex gap-2">
                  <button disabled={deleteInput !== "DELETE"} className="px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold disabled:opacity-30 hover:bg-red-500/20 transition-all">
                    Confirm Delete
                  </button>
                  <button onClick={() => { setShowDelete(false); setDeleteInput(""); }} className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-500 text-xs hover:text-zinc-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mt-2">
            <LogOut size={15} /> Sign out of all devices
          </button>
        </div>
      </SettingSection>
    </div>
  );
}
