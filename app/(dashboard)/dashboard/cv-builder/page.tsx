"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, Download, ArrowRight, CheckCircle2,
  Code2, Rocket, Briefcase, UserCircle, Target,
  Clock, ChevronRight, Loader2, X,
} from "lucide-react";

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
        className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white p-4 outline-none focus:border-amber-500/60 transition-all placeholder:text-[#4A4A6A]"
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
        className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white p-4 h-64 outline-none focus:border-amber-500/60 transition-all resize-none placeholder:text-[#4A4A6A]"
      />
    </div>
  );
}

/* ── CV Preview (used for both display + print) ─────────────── */
function CVPreview({ cv }: { cv: CVData }) {
  return (
    <div id="cv-print" className="bg-white text-zinc-900 rounded-2xl p-10 max-w-3xl mx-auto shadow-xl text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-amber-500 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-zinc-900">{cv.name}</h1>
        <p className="text-zinc-500 mt-0.5">{cv.email}</p>
        {cv.target_role && (
          <span className="inline-block mt-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
            {cv.target_role}
          </span>
        )}
      </div>

      {/* Summary */}
      {cv.summary && (
        <section className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-2">Professional Summary</h2>
          <p className="text-zinc-700">{cv.summary}</p>
        </section>
      )}

      {/* Experience */}
      {cv.experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">Experience</h2>
          <div className="space-y-4">
            {cv.experience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-zinc-900">{e.title}</p>
                    <p className="text-zinc-500 text-xs">{e.company}</p>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0 ml-4">{e.duration}</span>
                </div>
                {e.bullets?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {e.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-zinc-700">
                        <span className="text-amber-500 shrink-0">•</span>{b}
                      </li>
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
        <section className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">Projects</h2>
          <div className="space-y-3">
            {cv.projects.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <p className="font-bold text-zinc-900">{p.name}</p>
                  <span className="text-xs text-zinc-400 ml-4 shrink-0">{p.tech_stack}</span>
                </div>
                <p className="text-zinc-700 text-xs mt-0.5">{p.description}</p>
                {p.impact && <p className="text-amber-700 text-xs mt-0.5 font-medium">Impact: {p.impact}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {cv.skills && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">Skills</h2>
          <div className="grid grid-cols-3 gap-4">
            {cv.skills.technical?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-zinc-500 mb-1">Technical</p>
                <p className="text-zinc-700 text-xs">{cv.skills.technical.join(", ")}</p>
              </div>
            )}
            {cv.skills.soft?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-zinc-500 mb-1">Soft Skills</p>
                <p className="text-zinc-700 text-xs">{cv.skills.soft.join(", ")}</p>
              </div>
            )}
            {cv.skills.languages?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-zinc-500 mb-1">Languages</p>
                <p className="text-zinc-700 text-xs">{cv.skills.languages.join(", ")}</p>
              </div>
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
      // Refresh history
      fetch("/api/generate-cv").then((r) => r.json()).then((d) => setHistory(Array.isArray(d) ? d : []));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("cv-print")?.innerHTML;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>CV — ${aiResult?.name ?? ""}</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #18181b; font-size: 13px; }
        h1 { font-size: 26px; margin: 0; }
        h2 { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #d97706; border-bottom: 1px solid #fde68a; padding-bottom: 4px; margin-top: 20px; }
        ul { padding-left: 16px; }
        li { margin-bottom: 3px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
      </style></head>
      <body>${printContent}</body></html>
    `);
    win.document.close();
    win.print();
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
    <div className="text-white max-w-5xl mx-auto space-y-10">

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
            <div className={`flex items-center gap-2 text-xs font-semibold transition-colors ${isStepDone(i) ? "text-amber-500" : step === i + 1 ? "text-white" : "text-zinc-600"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${isStepDone(i) ? "bg-amber-500 border-amber-500 text-black" : step === i + 1 ? "border-amber-500 text-amber-500" : "border-zinc-700 text-zinc-600"}`}>
                {isStepDone(i) ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className="hidden sm:block">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-zinc-700 ml-auto" />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-[#12121a] border border-[#272731] rounded-3xl p-8 shadow-2xl">

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= i ? "bg-amber-500" : "bg-[#272731]"}`} />
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
        <div className="flex justify-between mt-8 pt-6 border-t border-[#272731]">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`px-6 py-2.5 rounded-xl border border-[#2d2d3d] text-[#7A7A9A] font-medium transition-all hover:text-white ${step === 1 ? "invisible" : ""}`}
          >
            Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canGoNext()}
              className="px-7 py-2.5 rounded-xl bg-[#1c1c26] border border-[#2d2d3d] text-white font-semibold flex items-center gap-2 hover:bg-[#252533] disabled:opacity-40 transition-all"
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
                  className="p-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <CVPreview cv={aiResult} />
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => { setShowPreview(false); setStep(1); setAiResult(null); setFormData({ name: "", email: "", bio: "", target_role: "", experience: "", projects: "", skills: "" }); }}
                className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-all"
              >
                Generate Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Past CV History */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                className="bg-[#12121a] border border-[#272731] rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Target size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{cv.target_role || "General CV"}</p>
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
