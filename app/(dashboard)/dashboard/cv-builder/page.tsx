"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, Download, ArrowRight, CheckCircle2,
  Code2, Rocket, Briefcase, UserCircle, Target,
  Clock, ChevronRight, Loader2, X,
} from "lucide-react";
import { toast } from "sonner";

/* ── Types ─────────────────────────────────────────────────── */
interface CVData {
  name:        string;
  email:       string;
  summary:     string;
  target_role: string;
  experience:  { title: string; company: string; duration: string; bullets: string[] }[];
  projects:    { name: string; description: string; tech_stack: string; impact: string }[];
  skills:      { technical: string[]; soft: string[]; languages: string[] };
}

interface PastCV {
  id:          string;
  target_role: string;
  created_at:  string;
  cv_data:     CVData;
}

/* ── Input helpers ─────────────────────────────────────────── */
function InputGroup({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.5px]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-100 dark:bg-[#1c1c26] border border-zinc-200 dark:border-[#2d2d3d] rounded-xl text-zinc-900 dark:text-white p-4 outline-none focus:border-amber-500/60 transition-all placeholder:text-zinc-400 dark:placeholder:text-[#4A4A6A]"
      />
    </div>
  );
}

function TextAreaGroup({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.5px]">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-100 dark:bg-[#1c1c26] border border-zinc-200 dark:border-[#2d2d3d] rounded-xl text-zinc-900 dark:text-white p-4 h-64 outline-none focus:border-amber-500/60 transition-all resize-none placeholder:text-zinc-400 dark:placeholder:text-[#4A4A6A]"
      />
    </div>
  );
}

/* ── CV Preview (Google XYZ format — ATS friendly) ─────────── */
function CVPreview({ cv }: { cv: CVData }) {
  return (
    <div id="cv-print" className="bg-white text-zinc-900 rounded-2xl p-10 max-w-3xl mx-auto shadow-xl font-sans">

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-[26px] font-bold tracking-tight text-zinc-900">{cv.name}</h1>
        <p className="text-sm text-zinc-600 mt-1">{cv.email}</p>
      </div>

      <hr className="border-zinc-900 mb-4" />

      {/* Summary */}
      {cv.summary && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">Summary</h2>
          <p className="text-[13px] text-zinc-700 leading-relaxed">{cv.summary}</p>
        </section>
      )}

      {/* Experience */}
      {cv.experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-3">Experience</h2>
          <div className="space-y-3">
            {cv.experience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="text-[13px] font-bold text-zinc-900">{e.company}</p>
                  <span className="text-[12px] text-zinc-500 shrink-0 ml-4">{e.duration}</span>
                </div>
                <p className="text-[12px] italic text-zinc-600 mb-1">{e.title}</p>
                {e.bullets?.length > 0 && (
                  <ul className="space-y-0.5 pl-4">
                    {e.bullets.map((b, j) => (
                      <li key={j} className="text-[12px] text-zinc-700 list-disc">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {cv.projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-3">Projects</h2>
          <div className="space-y-3">
            {cv.projects.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="text-[13px] font-bold text-zinc-900">{p.name}</p>
                  <span className="text-[11px] text-zinc-500 ml-4 shrink-0">{p.tech_stack}</span>
                </div>
                <ul className="pl-4 space-y-0.5">
                  <li className="text-[12px] text-zinc-700 list-disc">{p.description}</li>
                  {p.impact && <li className="text-[12px] text-zinc-700 list-disc">{p.impact}</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {cv.skills && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">Skills</h2>
          <div className="space-y-1">
            {cv.skills.technical?.length > 0 && (
              <p className="text-[12px] text-zinc-700">
                <span className="font-bold">Technical: </span>{cv.skills.technical.join(", ")}
              </p>
            )}
            {cv.skills.soft?.length > 0 && (
              <p className="text-[12px] text-zinc-700">
                <span className="font-bold">Soft Skills: </span>{cv.skills.soft.join(", ")}
              </p>
            )}
            {cv.skills.languages?.length > 0 && (
              <p className="text-[12px] text-zinc-700">
                <span className="font-bold">Languages: </span>{cv.skills.languages.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function AICVBuilder() {
  const [step, setStep]               = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult]       = useState<CVData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory]         = useState<PastCV[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError]             = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", bio: "", target_role: "",
    experience: "", projects: "", skills: "",
  });

  const update = (key: string, val: string) => setFormData((p) => ({ ...p, [key]: val }));

  // Fetch past CVs
  useEffect(() => {
    fetch("/api/generate-cv")
      .then((r) => r.json())
      .then((d) => setHistory(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setHistoryLoading(false));
  }, []);

  const canGoNext = () => {
    if (step === 1) return formData.name && formData.email && formData.target_role;
    if (step === 2) return !!formData.experience;
    if (step === 3) return !!formData.projects;
    if (step === 4) return !!formData.skills;
    return false;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res  = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

      const jsonString = data.result?.replace(/```json|```/g, "").trim();
      const parsed     = JSON.parse(jsonString);
      setAiResult(parsed);
      setShowPreview(true);
      toast.success("CV generated successfully!");
      fetch("/api/generate-cv").then((r) => r.json()).then((d) => setHistory(Array.isArray(d) ? d : []));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Generation failed. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printEl = document.getElementById("cv-print");
    if (!printEl) return;

    // Strip script tags and all inline event handlers before writing to popup
    const clone = printEl.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("script").forEach((el) => el.remove());
    clone.querySelectorAll("*").forEach((el) => {
      Array.from(el.attributes)
        .filter((a) => a.name.startsWith("on"))
        .forEach((a) => el.removeAttribute(a.name));
    });

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV — ${aiResult?.name ?? ""}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 48px 56px; color: #18181b; font-size: 12px; line-height: 1.5; }
        #cv-print { max-width: 100%; box-shadow: none; border-radius: 0; padding: 0; }
        h1 { font-size: 22px; font-weight: 700; text-align: center; }
        .text-center { text-align: center; }
        .text-sm { font-size: 12px; }
        .text-zinc-600 { color: #52525b; }
        hr { border: none; border-top: 1.5px solid #18181b; margin: 12px 0; }
        h2 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #d4d4d8; padding-bottom: 2px; margin-bottom: 8px; margin-top: 14px; }
        .flex { display: flex; justify-content: space-between; align-items: baseline; }
        .font-bold { font-weight: 700; }
        .italic { font-style: italic; }
        ul { padding-left: 16px; margin-top: 2px; }
        li { margin-bottom: 2px; font-size: 12px; color: #3f3f46; }
        .space-y-3 > * + * { margin-top: 10px; }
        .space-y-1 > * + * { margin-top: 3px; }
        .mb-4 { margin-bottom: 14px; }
        .mb-2 { margin-bottom: 6px; }
        .mb-1 { margin-bottom: 3px; }
      </style></head>
      <body onload="window.print()">${clone.innerHTML}</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  const STEPS = [
    { icon: <UserCircle size={20} />, label: "Identity"   },
    { icon: <Briefcase  size={20} />, label: "Experience" },
    { icon: <Rocket     size={20} />, label: "Projects"   },
    { icon: <Code2      size={20} />, label: "Tech Stack" },
  ];

  const isStepDone = (i: number) => {
    if (i === 0) return !!(formData.name && formData.email && formData.target_role);
    if (i === 1) return !!formData.experience;
    if (i === 2) return !!formData.projects;
    if (i === 3) return !!formData.skills;
    return false;
  };

  return (
    <div className="text-foreground max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold tracking-tight flex items-center gap-3">
          AI CV Generator <Sparkles className="text-amber-500" size={26} />
        </h1>
        <p className="text-[#7A7A9A] mt-1">Let the AI architect your career story.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 text-xs font-semibold transition-colors ${isStepDone(i) ? "text-amber-500" : step === i + 1 ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-600"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${isStepDone(i) ? "bg-amber-500 border-amber-500 text-black" : step === i + 1 ? "border-amber-500 text-amber-500" : "border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-600"}`}>
                {isStepDone(i) ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className="hidden sm:block">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-zinc-400 dark:text-zinc-700 ml-auto" />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-[#12121a] border border-zinc-200 dark:border-[#272731] rounded-3xl p-8 shadow-2xl">

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= i ? "bg-amber-500" : "bg-zinc-200 dark:bg-[#272731]"}`} />
          ))}
        </div>

        <div className="min-h-[360px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <UserCircle className="text-amber-500" size={22} />
                <h3 className="text-lg font-semibold">Step 1: Identity</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputGroup label="Full Name"     placeholder="e.g. Shreyash Mishra"   value={formData.name}        onChange={(v) => update("name", v)} />
                <InputGroup label="Email Address" placeholder="e.g. you@dev.com"        value={formData.email}       onChange={(v) => update("email", v)} />
              </div>
              <InputGroup label="Target Job Role" placeholder="e.g. Senior Full-Stack Developer" value={formData.target_role} onChange={(v) => update("target_role", v)} />
              <TextAreaGroup label="Professional Summary" placeholder="Your career goal and what you bring to the table..." value={formData.bio} onChange={(v) => update("bio", v)} />
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <Briefcase className="text-amber-500" size={22} />
                <h3 className="text-lg font-semibold">Step 2: Experience</h3>
              </div>
              <p className="text-xs text-[#7A7A9A]">List each role on a new line. Include company, duration, and key responsibilities.</p>
              <TextAreaGroup label="Work Experience & Education" placeholder={"Frontend Developer @ Google (2022–2024)\n- Built scalable React dashboards\n- Led team of 4 engineers\n\nB.Tech Computer Science, IIT Delhi (2018–2022)"} value={formData.experience} onChange={(v) => update("experience", v)} />
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <Rocket className="text-amber-500" size={22} />
                <h3 className="text-lg font-semibold">Step 3: Projects</h3>
              </div>
              <p className="text-xs text-[#7A7A9A]">Describe your best projects — what it does, the tech used, and the impact it had.</p>
              <TextAreaGroup label="Projects" placeholder={"AI Interview Trainer (Next.js, Supabase, Gemini)\n- Built an AI-powered platform used by 10K+ developers\n- Reduced interview prep time by 60%\n\nE-Commerce Dashboard (React, Node.js)\n- Handled 50K+ daily transactions"} value={formData.projects} onChange={(v) => update("projects", v)} />
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <Code2 className="text-amber-500" size={22} />
                <h3 className="text-lg font-semibold">Step 4: Tech Stack</h3>
              </div>
              <p className="text-xs text-[#7A7A9A]">List the technologies, frameworks, languages, and tools you&apos;re proficient with.</p>
              <TextAreaGroup label="Skills & Technologies" placeholder={"Languages: TypeScript, Python, Java\nFrameworks: React, Next.js, Node.js, FastAPI\nDatabases: PostgreSQL, MongoDB, Redis\nTools: Docker, Git, AWS, Figma"} value={formData.skills} onChange={(v) => update("skills", v)} />
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-[#272731]">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-[#2d2d3d] text-[#7A7A9A] font-medium transition-all hover:text-zinc-900 dark:hover:text-white ${step === 1 ? "invisible" : ""}`}
          >
            Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canGoNext()}
              className="px-7 py-2.5 rounded-xl bg-zinc-100 dark:bg-[#1c1c26] border border-zinc-200 dark:border-[#2d2d3d] text-zinc-900 dark:text-white font-semibold flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-[#252533] disabled:opacity-40 transition-all"
            >
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !canGoNext()}
              className="px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-2 disabled:opacity-40 transition-all shadow-lg shadow-amber-500/20"
            >
              {isGenerating
                ? <><Loader2 size={16} className="animate-spin" /> Generating...</>
                : <><Sparkles size={16} /> Generate CV</>}
            </button>
          )}
        </div>
      </div>

      {/* CV Preview Modal */}
      {showPreview && aiResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto py-10 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Modal actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-amber-500" />
                <span className="text-white font-semibold">CV Generated Successfully</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
                >
                  <Download size={15} /> Download PDF
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-xl border border-zinc-600 text-zinc-300 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <CVPreview cv={aiResult} />
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => { setShowPreview(false); setStep(1); setAiResult(null); setFormData({ name: "", email: "", bio: "", target_role: "", experience: "", projects: "", skills: "" }); }}
                className="px-6 py-2.5 rounded-xl border border-zinc-600 text-zinc-300 hover:text-white text-sm transition-all"
              >
                Generate Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Past CV History */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock size={16} className="text-amber-500" /> Past Generations
        </h2>

        {historyLoading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-amber-500" /></div>
        ) : history.length === 0 ? (
          <p className="text-[#7A7A9A] text-sm py-6 text-center">No CVs generated yet. Fill the form above to create your first one.</p>
        ) : (
          <div className="grid gap-3">
            {history.map((cv) => (
              <div
                key={cv.id}
                onClick={() => { setAiResult(cv.cv_data); setShowPreview(true); }}
                className="bg-white dark:bg-[#12121a] border border-zinc-200 dark:border-[#272731] rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Target size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-zinc-900 dark:text-white font-medium text-sm">{cv.target_role || "General CV"}</p>
                    <p className="text-[#7A7A9A] text-xs mt-0.5">
                      {new Date(cv.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#7A7A9A] group-hover:text-amber-400 transition-colors font-medium">View →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
