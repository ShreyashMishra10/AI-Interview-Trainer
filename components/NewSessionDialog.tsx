"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface NewSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewSessionDialog({ isOpen, onClose }: NewSessionDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isFormValid = name.trim() !== "" && role !== "" && selectedFile !== null;

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-[#12121a] border border-[#272731] rounded-[24px] w-full max-w-[540px] shadow-2xl shadow-black/50 overflow-hidden outline outline-1 outline-white/5" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-8 pb-0 flex items-start justify-between">
          <div>
            <h2 className="font-[var(--syne)] text-[24px] font-bold text-white tracking-tight">New interview session</h2>
            <p className="text-[14px] text-[#7A7A9A] mt-1 font-medium">Tell us about yourself and pick your role</p>
          </div>
          <button className="w-8 h-8 rounded-lg bg-[#1c1c26] border border-[#2d2d3d] text-[#7A7A9A] cursor-pointer flex items-center justify-center text-lg hover:text-white hover:bg-[#252533]" onClick={onClose}>×</button>
        </div>

        <div className="p-8 pt-6">
          {/* Progress Steps */}
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${name ? 'bg-[#6C63FF]' : 'bg-[#272731]'}`}></div>
            <div className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${role ? 'bg-[#6C63FF] opacity-60' : 'bg-[#272731]'}`}></div>
            <div className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${selectedFile ? 'bg-[#6C63FF] opacity-30' : 'bg-[#272731]'}`}></div>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.2px] block mb-3">Your name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white text-[14px] p-4 outline-none focus:border-[#6C63FF] placeholder:text-[#4A4A6A]" 
                placeholder="e.g. Rahul Kumar" 
              />
            </div>

            {/* Role Dropdown with all options */}
            <div>
              <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.2px] block mb-3">Job role</label>
              <div className="relative">
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="w-full bg-[#1c1c26] border border-[#2d2d3d] rounded-xl text-white text-[14px] p-4 outline-none cursor-pointer appearance-none focus:border-[#6C63FF]"
                >
                  <option value="" className="bg-[#12121a]">Select a role...</option>
                  
                  <optgroup label="Frontend" className="bg-[#12121a] text-[#7A7A9A]">
                    <option value="fe-react" className="text-white">Frontend Developer (React)</option>
                    <option value="fe-vue" className="text-white">Frontend Developer (Vue / Angular)</option>
                    <option value="uiux" className="text-white">UI/UX Engineer</option>
                  </optgroup>

                  <optgroup label="Backend" className="bg-[#12121a] text-[#7A7A9A]">
                    <option value="be-node" className="text-white">Backend Developer (Node.js)</option>
                    <option value="be-python" className="text-white">Backend Developer (Python / Django)</option>
                    <option value="be-java" className="text-white">Backend Developer (Java / Spring)</option>
                    <option value="be-go" className="text-white">Backend Developer (Go)</option>
                  </optgroup>

                  <optgroup label="Full Stack" className="bg-[#12121a] text-[#7A7A9A]">
                    <option value="fs-dev" className="text-white">Full Stack Developer</option>
                    <option value="mern" className="text-white">MERN Stack Developer</option>
                  </optgroup>

                  <optgroup label="Data & ML" className="bg-[#12121a] text-[#7A7A9A]">
                    <option value="ml-eng" className="text-white">Machine Learning Engineer</option>
                    <option value="data-sci" className="text-white">Data Scientist</option>
                    <option value="data-eng" className="text-white">Data Engineer</option>
                    <option value="ai-nlp" className="text-white">AI / NLP Engineer</option>
                  </optgroup>

                  <optgroup label="Infrastructure" className="bg-[#12121a] text-[#7A7A9A]">
                    <option value="devops" className="text-white">DevOps Engineer</option>
                    <option value="cloud" className="text-white">Cloud Engineer (AWS / GCP / Azure)</option>
                    <option value="sre" className="text-white">Site Reliability Engineer</option>
                  </optgroup>

                  <optgroup label="Core CS" className="bg-[#12121a] text-[#7A7A9A]">
                    <option value="swe-dsa" className="text-white">Software Engineer (DSA focus)</option>
                    <option value="sys-prog" className="text-white">Systems Programmer (C / C++)</option>
                    <option value="db-eng" className="text-white">Database Engineer</option>
                    <option value="cyber" className="text-white">Cybersecurity Engineer</option>
                  </optgroup>

                  <optgroup label="Mobile" className="bg-[#12121a] text-[#7A7A9A]">
                    <option value="mobile-kotlin" className="text-white">Android Developer (Kotlin)</option>
                    <option value="mobile-swift" className="text-white">iOS Developer (Swift)</option>
                    <option value="mobile-rn" className="text-white">React Native Developer</option>
                  </optgroup>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A7A9A]">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label className="text-[11px] text-[#7A7A9A] font-bold uppercase tracking-[1.2px] block mb-3">
                Upload your CV <span className="text-[#6C63FF] lowercase font-bold ml-1">(Required)</span>
              </label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
              <div 
                className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all bg-[#1c1c26]/50 ${selectedFile ? 'border-[#6C63FF] bg-[#6C63FF]/5' : 'border-[#2d2d3d] hover:border-[#6C63FF]/50'}`} 
                onClick={handleUploadClick}
              >
                <div className="text-2xl mb-2">{selectedFile ? "✅" : "📄"}</div>
                <div className="text-[14px] text-[#7A7A9A]">
                  <span className="text-[#6C63FF] font-semibold">{selectedFile ? selectedFile.name : "Click to upload"}</span> {!selectedFile && " or drag & drop"}
                </div>
                <div className="text-[11px] text-[#4A4A6A] mt-1 italic">PDF or DOCX · Max 5 MB</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0 flex gap-3 justify-end">
          <button className="px-6 py-3 rounded-xl border border-[#2d2d3d] text-[#7A7A9A] text-[14px] hover:text-white hover:bg-[#1c1c26]" onClick={onClose}>Cancel</button>
          <button 
          onClick={() => {
    if (!isFormValid) return;
    const params = new URLSearchParams({ name, role, experience: "Mid" });
    onClose();
    router.push(`/dashboard/interviews/session?${params.toString()}`);
  }}
            disabled={!isFormValid} 
            className={`px-7 py-3 rounded-xl text-[14px] font-semibold transition-all ${isFormValid ? 'bg-[#6C63FF] text-white hover:bg-[#7C74FF] hover:shadow-[0_0_20px_rgba(108,99,255,0.4)]' : 'bg-[#272731] text-[#4A4A6A] cursor-not-allowed'}`}
          >
            Start interview →
          </button>
        </div>
      </div>
    </div>
  );
}