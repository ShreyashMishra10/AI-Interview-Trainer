"use client";

import React, { useState, useRef } from "react";
import { Check, Save, Camera } from "lucide-react";
import { SettingSection } from "./SettingsUI";

export function ProfileTab() {
  const [name, setName]             = useState("Shreyash Mishra");
  const [username, setUsername]     = useState("shreyash.dev");
  const [bio, setBio]               = useState("Full-Stack Architect · Japanese learner · Building Kratya.AI");
  const [saved, setSaved]           = useState(false);
  const [targetRole, setTargetRole] = useState("Full-Stack Developer");
  const [experience, setExperience] = useState("Mid (3–5 yrs)");
  const [avatarUrl, setAvatarUrl]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  return (
    <div>
      <SettingSection title="Profile Picture">
        <div className="px-5 py-6 flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-amber-400/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-400/20 flex items-center justify-center text-2xl font-bold text-amber-400">
                S
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-300">Upload new photo</p>
            <p className="text-xs text-zinc-600 mt-1">JPG, PNG or GIF · Max 2MB</p>
            <button onClick={() => fileRef.current?.click()} className="mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors">
              Choose file
            </button>
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={handleFileChange} />
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Personal Information">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors" />
            </div>
            <div>
              <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors resize-none" />
          </div>
          <div>
            <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Email</label>
            <input defaultValue="shreyash@dev.com" disabled className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-500 outline-none cursor-not-allowed" />
            <p className="text-[10px] text-zinc-700 mt-1">Email is managed by Clerk authentication.</p>
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Interview Preferences" description="Used to personalize your mock interview experience">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Target Role</label>
              <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors appearance-none">
                <option>Full-Stack Developer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>ML / AI Engineer</option>
                <option>DevOps Engineer</option>
                <option>Data Scientist</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Experience Level</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors appearance-none">
                <option>Fresher (0–1 yr)</option>
                <option>Junior (1–3 yrs)</option>
                <option>Mid (3–5 yrs)</option>
                <option>Senior (5+ yrs)</option>
              </select>
            </div>
          </div>
        </div>
      </SettingSection>

      <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" : "bg-amber-400/15 border border-amber-400/25 text-amber-400 hover:bg-amber-400/20"}`}>
        {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
      </button>
    </div>
  );
}
