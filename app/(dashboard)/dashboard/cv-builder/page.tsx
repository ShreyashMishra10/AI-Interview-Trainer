"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Rocket, 
  Briefcase, 
  UserCircle,
  Layout
} from "lucide-react";

interface InputGroupProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

// 2. Define InputGroup outside to prevent focus loss during re-renders
function InputGroup({ label, placeholder, value, onChange }: InputGroupProps) {
  return (
    <div className="flex flex-col gap-3 text-left">
      <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.5px]">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white p-4 outline-none focus:border-[#6C63FF] transition-all placeholder:text-[#4A4A6A]" 
      />
    </div>
  );
}

export default function AICVBuilder() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    experience: "",
    projects: "",
    skills: ""
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
      const errorText = await response.text();
      console.error("Server Error Response:", errorText);
      throw new Error(`Server returned ${response.status}`);
    }

      const data = await response.json();

      if (data.result) {
        try {
          const jsonString = data.result.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(jsonString);
          setAiResult(parsed);
        } catch {
          // Fallback if the AI returns plain text instead of JSON
          setAiResult({ raw: data.result });
        }
        setIsComplete(true);
      }
    } catch (error: any) {
      console.error("Generation failed:", error);
      // Change the alert to show the actual error message
      alert(`Error: ${error.message}`); 
    } finally {
      setIsGenerating(false);
    }
  };

  const canGoNext = () => {
    if (step === 1) return formData.name && formData.email;
    if (step === 2) return formData.experience;
    if (step === 3) return formData.projects;
    if (step === 4) return formData.skills;
    return false;
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-[var(--syne)] text-[32px] font-bold tracking-tight flex items-center gap-3">
              AI CV Generator <Sparkles className="text-[#6C63FF]" size={28} />
            </h1>
            <p className="text-[#7A7A9A] text-lg mt-1 font-medium">Let the AI architect your career story.</p>
          </div>
        </div>

        {!isComplete ? (
          <div className="bg-[#12121a] border border-[#272731] rounded-[24px] p-8 shadow-2xl outline outline-1 outline-white/5 relative">
            
            <div className="flex gap-3 mb-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-[#6C63FF]' : 'bg-[#272731]'}`} />
              ))}
            </div>

            <div className="min-h-[420px]">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-6 duration-500 space-y-6">
                  <div className="flex items-center gap-3 mb-2 text-left">
                    <UserCircle className="text-[#6C63FF]" size={24} />
                    <h3 className="text-xl font-semibold">Step 1: Identity</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <InputGroup label="Full Name" placeholder="e.g. Shreyash Mishra" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                    <InputGroup label="Email Address" placeholder="e.g. shreyash@dev.com" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                  </div>
                  <div className="flex flex-col gap-3 text-left">
                    <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.5px]">Professional Summary</label>
                    <textarea 
                      className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white p-4 h-32 outline-none focus:border-[#6C63FF] transition-all resize-none placeholder:text-[#4A4A6A]"
                      placeholder="What is your career goal?"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-6 duration-500 space-y-6 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="text-[#6C63FF]" size={24} />
                    <h3 className="text-xl font-semibold">Step 2: Experience</h3>
                  </div>
                  <textarea 
                    className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white p-4 h-72 outline-none focus:border-[#6C63FF] transition-all resize-none placeholder:text-[#4A4A6A]"
                    placeholder="List your work history and education..."
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-6 duration-500 space-y-6 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="text-[#6C63FF]" size={24} />
                    <h3 className="text-xl font-semibold">Step 3: Projects</h3>
                  </div>
                  <textarea 
                    className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white p-4 h-72 outline-none focus:border-[#6C63FF] transition-all resize-none placeholder:text-[#4A4A6A]"
                    placeholder="Describe your best technical projects..."
                    value={formData.projects}
                    onChange={(e) => setFormData({...formData, projects: e.target.value})}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-6 duration-500 space-y-6 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Code2 className="text-[#6C63FF]" size={24} />
                    <h3 className="text-xl font-semibold">Step 4: Tech Stack</h3>
                  </div>
                  <textarea 
                    className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white p-4 h-72 outline-none focus:border-[#6C63FF] transition-all resize-none placeholder:text-[#4A4A6A]"
                    placeholder="Languages, Frameworks, and Tools..."
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between mt-10 pt-6 border-t border-[#272731]">
              <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`px-7 py-3 rounded-xl border border-[#2d2d3d] text-[#7A7A9A] font-medium transition-all hover:text-white ${step === 1 ? 'invisible' : ''}`}
              >
                Back
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  disabled={!canGoNext()}
                  className="px-8 py-3 rounded-xl bg-[#1c1c26] border border-[#2d2d3d] text-white font-semibold flex items-center gap-2 hover:bg-[#252533] disabled:opacity-40 transition-all"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !canGoNext()}
                  className="px-10 py-3 rounded-xl bg-[#6C63FF] text-white font-bold flex items-center gap-2 hover:bg-[#7C74FF] disabled:opacity-40 transition-all shadow-lg shadow-[#6C63FF]/20"
                >
                  {isGenerating ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Architecting...</>
                  ) : (
                    <>Generate CV <Sparkles className="ml-2" size={18} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in duration-500 text-center py-20 bg-[#12121a] border border-[#272731] rounded-[32px] outline outline-1 outline-white/5">
            <div className="w-20 h-20 bg-[#6C63FF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-[#6C63FF]" size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-[var(--syne)]">Architect-Grade CV Ready</h2>
            <p className="text-[#7A7A9A] max-w-md mx-auto mb-10 text-lg">AI has polished your experience for maximum impact.</p>
            
            <div className="flex flex-wrap justify-center gap-4 px-6">
              <button 
                onClick={() => console.log(aiResult)} 
                className="px-8 py-4 rounded-2xl bg-[#1c1c26] border border-[#2d2d3d] text-white font-bold flex items-center gap-2 hover:bg-[#252533] transition-all hover:scale-105 group"
              >
                <Layout className="text-[#7A7A9A] group-hover:text-[#6C63FF]" size={20} /> View CV
              </button>
              
              <button className="px-8 py-4 rounded-2xl bg-[#6C63FF] text-white font-bold flex items-center gap-2 hover:bg-[#7C74FF] transition-all hover:scale-105 shadow-lg shadow-[#6C63FF]/20">
                <Download size={20} /> Download PDF
              </button>
              
              <button onClick={() => {setIsComplete(false); setStep(1);}} className="px-8 py-4 rounded-2xl border border-[#272731] text-[#7A7A9A] font-bold hover:text-white transition-all">
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}