"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Save, Camera, Loader2 } from "lucide-react";
import { SettingSection } from "./SettingsUI";
import { toast } from "sonner";

export function ProfileTab() {
  const [name,       setName]       = useState("");
  const [bio,        setBio]        = useState("");
  const [targetRole, setTargetRole] = useState("Full-Stack Developer");
  const [experience, setExperience] = useState("Mid (3–5 yrs)");
  const [email,      setEmail]      = useState("");
  const [avatarUrl,  setAvatarUrl]  = useState<string | null>(null);
  const [saved,      setSaved]      = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setName(d.full_name  ?? "");
        setEmail(d.email     ?? "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save profile.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        toast.success("Profile saved.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const initials = name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div>
      <SettingSection title="Profile Picture">
        <div className="px-5 py-6 flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-amber-400/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-400/20 flex items-center justify-center text-2xl font-bold text-amber-400">
                {initials}
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
          <div>
            <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-400/40 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">Email</label>
            <input
              value={email}
              disabled
              className="w-full bg-[#0d0d16] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-500 outline-none cursor-not-allowed"
            />
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

      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
            : "bg-amber-400/15 border border-amber-400/25 text-amber-400 hover:bg-amber-400/20"
        }`}
      >
        {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
         : saved ? <><Check size={15} /> Saved!</>
         : <><Save size={15} /> Save Changes</>}
      </button>
    </div>
  );
}
