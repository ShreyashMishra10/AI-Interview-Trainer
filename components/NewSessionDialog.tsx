"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ROLES = [
  { group: "Frontend",       options: [{ value: "Frontend Developer (React)", label: "Frontend Developer (React)" }, { value: "Frontend Developer (Vue / Angular)", label: "Frontend Developer (Vue / Angular)" }, { value: "UI/UX Engineer", label: "UI/UX Engineer" }] },
  { group: "Backend",        options: [{ value: "Backend Developer (Node.js)", label: "Backend Developer (Node.js)" }, { value: "Backend Developer (Python / Django)", label: "Backend Developer (Python / Django)" }, { value: "Backend Developer (Java / Spring)", label: "Backend Developer (Java / Spring)" }, { value: "Backend Developer (Go)", label: "Backend Developer (Go)" }] },
  { group: "Full Stack",     options: [{ value: "Full Stack Developer", label: "Full Stack Developer" }, { value: "MERN Stack Developer", label: "MERN Stack Developer" }] },
  { group: "Data & ML",      options: [{ value: "Machine Learning Engineer", label: "Machine Learning Engineer" }, { value: "Data Scientist", label: "Data Scientist" }, { value: "Data Engineer", label: "Data Engineer" }, { value: "AI / NLP Engineer", label: "AI / NLP Engineer" }] },
  { group: "Infrastructure", options: [{ value: "DevOps Engineer", label: "DevOps Engineer" }, { value: "Cloud Engineer (AWS / GCP / Azure)", label: "Cloud Engineer (AWS / GCP / Azure)" }, { value: "Site Reliability Engineer", label: "Site Reliability Engineer" }] },
  { group: "Core CS",        options: [{ value: "Software Engineer (DSA focus)", label: "Software Engineer (DSA focus)" }, { value: "Systems Programmer (C / C++)", label: "Systems Programmer (C / C++)" }, { value: "Database Engineer", label: "Database Engineer" }, { value: "Cybersecurity Engineer", label: "Cybersecurity Engineer" }] },
  { group: "Mobile",         options: [{ value: "Android Developer (Kotlin)", label: "Android Developer (Kotlin)" }, { value: "iOS Developer (Swift)", label: "iOS Developer (Swift)" }, { value: "React Native Developer", label: "React Native Developer" }] },
];

interface NewSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewSessionDialog({ isOpen, onClose }: NewSessionDialogProps) {
  const [name, setName]             = useState("");
  const [role, setRole]             = useState("");
  const [experience, setExperience] = useState("mid");
  const [cvFile, setCvFile]         = useState<File | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isFormValid = name.trim() !== "" && role !== "";

  const handleStart = async () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    setError("");

    try {
      // 1. Parse CV if uploaded
      let cvContext = "";
      if (cvFile) {
        const formData = new FormData();
        formData.append("file", cvFile);
        const parseRes = await fetch("/api/parse-cv", { method: "POST", body: formData });
        if (parseRes.ok) {
          const parsed = await parseRes.json();
          cvContext = parsed.text || "";
        }
      }

      // 2. Create session in DB
      const res  = await fetch("/api/interviews/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_role: role, experience_level: experience, mode: "chat" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create session.");
        setLoading(false);
        return;
      }

      // 3. Store CV text in sessionStorage (too large for URL)
      if (cvContext) sessionStorage.setItem(`cv_${data.id}`, cvContext);

      const params = new URLSearchParams({ name, role, experience, sessionId: data.id });
      onClose();
      router.push(`/dashboard/interviews/session?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-[#12121a] border border-[#272731] rounded-[24px] w-full max-w-[520px] shadow-2xl shadow-black/50 overflow-hidden outline outline-1 outline-white/5" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="p-8 pb-0 flex items-start justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-white tracking-tight">New interview session</h2>
            <p className="text-[14px] text-[#7A7A9A] mt-1">Tell us about yourself and pick your role</p>
          </div>
          <button className="w-8 h-8 rounded-lg bg-[#1c1c26] border border-[#2d2d3d] text-[#7A7A9A] flex items-center justify-center text-lg hover:text-white hover:bg-[#252533]" onClick={onClose}>×</button>
        </div>

        <div className="p-8 pt-6 space-y-5">
          {/* Progress bar */}
          <div className="flex gap-2">
            <div className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${name ? "bg-amber-500" : "bg-[#272731]"}`} />
            <div className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${role ? "bg-amber-500 opacity-70" : "bg-[#272731]"}`} />
            <div className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${experience !== "mid" ? "bg-amber-500 opacity-40" : "bg-[#272731]"}`} />
          </div>

          {/* Name */}
          <div>
            <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.2px] block mb-3">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white text-[14px] p-4 outline-none focus:border-amber-500/60 placeholder:text-[#4A4A6A] transition"
              placeholder="e.g. Rahul Kumar"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.2px] block mb-3">Job role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white text-[14px] p-4 outline-none cursor-pointer appearance-none focus:border-amber-500/60 transition"
              >
                <option value="" className="bg-[#12121a]">Select a role...</option>
                {ROLES.map((g) => (
                  <optgroup key={g.group} label={g.group} className="bg-[#12121a] text-[#7A7A9A]">
                    {g.options.map((o) => (
                      <option key={o.value} value={o.value} className="text-white">{o.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A7A9A]">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.2px] block mb-3">Experience level</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: "fresher", label: "Fresher" }, { value: "mid", label: "Mid-Level" }, { value: "senior", label: "Senior" }].map((e) => (
                <button
                  key={e.value}
                  onClick={() => setExperience(e.value)}
                  className={`py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                    experience === e.value
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-[#2d2d3d] text-[#7A7A9A] hover:border-[#3d3d4d] hover:text-white"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* CV Upload — optional */}
          <div>
            <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.2px] block mb-3">
              Upload CV <span className="text-amber-500/60 lowercase font-normal ml-1">— optional, improves question quality</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all bg-[#1c1c26]/50 ${
                cvFile ? "border-amber-500/50 bg-amber-500/5" : "border-[#2d2d3d] hover:border-amber-500/30"
              }`}
            >
              <div className="text-xl mb-1">{cvFile ? "✅" : "📄"}</div>
              <div className="text-[13px] text-[#7A7A9A]">
                {cvFile
                  ? <span className="text-amber-400 font-medium">{cvFile.name}</span>
                  : <><span className="text-amber-500 font-medium">Click to upload</span> or drag & drop</>}
              </div>
              <div className="text-[11px] text-[#4A4A6A] mt-1">PDF or DOCX · Max 5 MB</div>
            </div>
            {cvFile && (
              <button
                onClick={() => setCvFile(null)}
                className="text-[11px] text-[#7A7A9A] hover:text-red-400 mt-1.5 transition-colors"
              >
                Remove file
              </button>
            )}
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        <div className="p-8 pt-0 flex gap-3 justify-end">
          <button className="px-6 py-3 rounded-xl border border-[#2d2d3d] text-[#7A7A9A] text-[14px] hover:text-white hover:bg-[#1c1c26] transition" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!isFormValid || loading}
            className={`px-7 py-3 rounded-xl text-[14px] font-semibold transition-all flex items-center gap-2 ${
              isFormValid && !loading
                ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                : "bg-[#272731] text-[#4A4A6A] cursor-not-allowed"
            }`}
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : "Start interview →"}
          </button>
        </div>
      </div>
    </div>
  );
}
