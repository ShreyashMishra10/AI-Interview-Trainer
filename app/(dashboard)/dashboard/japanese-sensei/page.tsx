"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen, Zap, Target, Clock, Star, ArrowUpRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Topic {
  id: string;
  title: string;
  japanese?: string;
  done: boolean;
  priority: "critical" | "high" | "medium";
  timeEstimate: string;
  tip?: string;
}

interface Phase {
  id: string;
  phase: string;
  title: string;
  subtitle: string;
  duration: string;
  kanji: string;
  color: string;
  glow: string;
  topics: Topic[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROADMAP: Phase[] = [
  {
    id: "foundation",
    phase: "Phase 1",
    title: "Foundation",
    subtitle: "The non-negotiable base",
    duration: "4–6 weeks",
    kanji: "基",
    color: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.15)]",
    topics: [
      { id: "hiragana", title: "Hiragana", japanese: "ひらがな", done: false, priority: "critical", timeEstimate: "3–5 days", tip: "Use mnemonics. Learn in groups of 5. Write every character 20×." },
      { id: "katakana", title: "Katakana", japanese: "カタカナ", done: false, priority: "critical", timeEstimate: "3–5 days", tip: "Katakana is for foreign words. Master it alongside Hiragana." },
      { id: "pronunciation", title: "Pronunciation & Pitch Accent", japanese: "発音", done: false, priority: "high", timeEstimate: "Ongoing", tip: "Japanese has 5 pure vowels — a, i, u, e, o. Nail these first." },
      { id: "basic-grammar", title: "Basic Sentence Structure (SOV)", japanese: "文法", done: false, priority: "critical", timeEstimate: "1 week", tip: "Subject → Object → Verb. The opposite of English. Internalize this." },
      { id: "particles", title: "Core Particles (は・が・を・に・で)", japanese: "助詞", done: false, priority: "critical", timeEstimate: "2 weeks", tip: "は (topic) vs が (subject) is the hardest concept. Don't skip it." },
    ],
  },
  {
    id: "survival",
    phase: "Phase 2",
    title: "Survival Japanese",
    subtitle: "Functional communication",
    duration: "6–10 weeks",
    kanji: "話",
    color: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    topics: [
      { id: "n5-vocab", title: "JLPT N5 Vocabulary (~800 words)", japanese: "語彙", done: false, priority: "critical", timeEstimate: "4 weeks", tip: "Use Anki with a pre-made N5 deck. 20 new cards/day is sustainable." },
      { id: "verb-forms", title: "Verb Conjugation (て・た・ます forms)", japanese: "動詞活用", done: false, priority: "critical", timeEstimate: "2 weeks", tip: "Group 1 (u-verbs) and Group 2 (ru-verbs) have different rules." },
      { id: "adjectives", title: "い-adjectives & な-adjectives", japanese: "形容詞", done: false, priority: "high", timeEstimate: "1 week", tip: "い-adj conjugate like verbs. な-adj behave like nouns." },
      { id: "numbers", title: "Numbers, Time, Dates", japanese: "数字・時間", done: false, priority: "high", timeEstimate: "3 days", tip: "Counter words (つ、本、枚) are tricky — learn the most common 10." },
      { id: "keigo-intro", title: "Polite Form Introduction (です・ます)", japanese: "丁寧語", done: false, priority: "critical", timeEstimate: "1 week", tip: "Always use polite form with strangers. Casual only with close friends." },
      { id: "n5-kanji", title: "JLPT N5 Kanji (80 characters)", japanese: "漢字", done: false, priority: "high", timeEstimate: "3 weeks", tip: "Learn kanji with vocabulary, not in isolation. Context is everything." },
    ],
  },
  {
    id: "intermediate",
    phase: "Phase 3",
    title: "Intermediate Fluency",
    subtitle: "Where real Japanese begins",
    duration: "3–6 months",
    kanji: "流",
    color: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    topics: [
      { id: "n4-n3-vocab", title: "N4 + N3 Vocabulary (~3,000 words)", japanese: "語彙強化", done: false, priority: "critical", timeEstimate: "3 months", tip: "At 3,000 words you can understand ~85% of everyday conversation." },
      { id: "keigo", title: "Keigo — Honorific Language", japanese: "敬語", done: false, priority: "high", timeEstimate: "3 weeks", tip: "尊敬語 (respectful), 謙譲語 (humble), 丁寧語 (polite). Business Japanese requires all three." },
      { id: "te-forms", title: "Advanced Grammar Patterns (~て forms, ~ので, ~ながら)", japanese: "文法パターン", done: false, priority: "high", timeEstimate: "1 month", tip: "Grammar patterns unlock complex expressions. Aim for 100+ patterns." },
      { id: "kanji-300", title: "300+ Kanji (N4 + N3 level)", japanese: "漢字300", done: false, priority: "critical", timeEstimate: "2 months", tip: "Use RTK (Remembering the Kanji) method — radicals first, then meanings." },
      { id: "listening", title: "Immersion Listening (Anime, Podcasts, Drama)", japanese: "リスニング", done: false, priority: "critical", timeEstimate: "Ongoing — 1hr/day", tip: "Comprehensible input +1: content slightly above your level. shadowing technique is powerful." },
      { id: "shadowing", title: "Shadowing Practice", japanese: "シャドーイング", done: false, priority: "high", timeEstimate: "30 min/day", tip: "Mimic native speakers exactly — rhythm, speed, intonation. Shadowing Japanese by Saito is the gold standard." },
    ],
  },
  {
    id: "advanced",
    phase: "Phase 4",
    title: "Advanced Mastery",
    subtitle: "Native-like comprehension",
    duration: "6–12 months",
    kanji: "達",
    color: "text-violet-400",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.15)]",
    topics: [
      { id: "n2-n1", title: "JLPT N2 / N1 Preparation", japanese: "N1・N2試験", done: false, priority: "critical", timeEstimate: "6 months", tip: "N1 is required for most Japanese universities and professional jobs." },
      { id: "kanji-2000", title: "Joyo Kanji (2,136 characters)", japanese: "常用漢字", done: false, priority: "high", timeEstimate: "6 months", tip: "A Japanese high-schooler knows all 2,136. This is your north star." },
      { id: "reading", title: "Native Reading (novels, news, manga)", japanese: "読書", done: false, priority: "critical", timeEstimate: "Ongoing", tip: "Start with graded readers → manga → light novels → newspapers." },
      { id: "business-japanese", title: "Business Japanese & Formal Writing", japanese: "ビジネス日本語", done: false, priority: "high", timeEstimate: "2 months", tip: "Email etiquette in Japanese is complex. Learn set phrases for お世話になっております etc." },
      { id: "dialect", title: "Dialect Awareness (Kansai-ben etc.)", japanese: "方言", done: false, priority: "medium", timeEstimate: "Ongoing", tip: "Kansai dialect is the most common you'll encounter outside Tokyo." },
    ],
  },
];

const DAILY_ROUTINE = [
  { time: "15 min", activity: "Anki Reviews", icon: "🃏", color: "text-amber-400", desc: "Clear your daily review deck — never skip." },
  { time: "20 min", activity: "New Vocabulary", icon: "📖", color: "text-emerald-400", desc: "Add 10–20 new cards. Consistency beats intensity." },
  { time: "30 min", activity: "Grammar Study", icon: "⚙️", color: "text-blue-400", desc: "One grammar point per session, with example sentences." },
  { time: "30 min", activity: "Listening Immersion", icon: "🎧", color: "text-violet-400", desc: "Anime, podcasts or drama at your level." },
  { time: "15 min", activity: "Speaking / Shadowing", icon: "🎤", color: "text-red-400", desc: "Shadow a native speaker or use iTalki." },
  { time: "10 min", activity: "Writing Practice", icon: "✍️", color: "text-amber-400", desc: "Write 5 sentences using today's grammar." },
];

const RESOURCES = [
  { name: "Anki", type: "Flashcards", desc: "SRS flashcard app — the single most important tool.", url: "#", tag: "Essential" },
  { name: "Genki I & II", type: "Textbook", desc: "The gold standard beginner textbook series.", url: "#", tag: "Essential" },
  { name: "Jisho.org", type: "Dictionary", desc: "Best online Japanese dictionary with stroke order.", url: "#", tag: "Essential" },
  { name: "WaniKani", type: "Kanji", desc: "Structured kanji learning with mnemonics. Levels 1–60.", url: "#", tag: "Recommended" },
  { name: "Shadowing Japanese", type: "Speaking", desc: "By Hitomi Saito — best shadowing resource available.", url: "#", tag: "Recommended" },
  { name: "iTalki", type: "Speaking", desc: "Find native Japanese tutors for conversation practice.", url: "#", tag: "Recommended" },
  { name: "NHK Web Easy", type: "Reading", desc: "Simplified Japanese news — perfect for N3–N4 level.", url: "#", tag: "Intermediate" },
  { name: "Yomichan", type: "Browser Extension", desc: "Hover over any Japanese word to see its definition.", url: "#", tag: "Tool" },
];

// ─── Priority Badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: Topic["priority"] }) {
  const map = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    high:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
    medium:   "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${map[priority]}`}>
      {priority}
    </span>
  );
}

// ─── Phase Card ───────────────────────────────────────────────────────────────

function PhaseCard({ phase }: { phase: Phase }) {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState(phase.topics);

  const completed = topics.filter((t) => t.done).length;
  const total = topics.length;
  const pct = Math.round((completed / total) * 100);

  const toggleTopic = (id: string) => {
    setTopics((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className={`bg-[#08080e] border border-zinc-800/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-700/60 ${open ? phase.glow : ""}`}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full p-6 flex items-center gap-5 text-left group"
      >
        {/* Kanji */}
        <div className={`text-4xl font-bold ${phase.color} opacity-80 w-10 shrink-0 font-serif`}>
          {phase.kanji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{phase.phase}</span>
            <span className="text-[10px] text-zinc-700">·</span>
            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
              <Clock size={10} /> {phase.duration}
            </span>
          </div>
          <h3 className="text-white font-semibold text-base leading-none">{phase.title}</h3>
          <p className="text-zinc-600 text-xs mt-1">{phase.subtitle}</p>
        </div>

        {/* Progress */}
        <div className="shrink-0 text-right mr-3">
          <div className={`text-lg font-bold ${phase.color}`}>{pct}%</div>
          <div className="text-[10px] text-zinc-700">{completed}/{total} done</div>
          <div className="w-20 h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                phase.color.replace("text-", "bg-")
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Chevron */}
        <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {/* Topics */}
      {open && (
        <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/40">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`px-6 py-4 flex items-start gap-4 transition-all duration-200 ${
                topic.done ? "opacity-50" : "hover:bg-zinc-900/30"
              }`}
            >
              <button onClick={() => toggleTopic(topic.id)} className="mt-0.5 shrink-0">
                {topic.done
                  ? <CheckCircle2 size={16} className={phase.color} />
                  : <Circle size={16} className="text-zinc-700 hover:text-zinc-500 transition-colors" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-sm font-medium ${topic.done ? "line-through text-zinc-600" : "text-zinc-200"}`}>
                    {topic.title}
                  </span>
                  {topic.japanese && (
                    <span className="text-[11px] text-zinc-600">{topic.japanese}</span>
                  )}
                  <PriorityBadge priority={topic.priority} />
                  <span className="text-[10px] text-zinc-700 flex items-center gap-1 ml-auto">
                    <Clock size={9} /> {topic.timeEstimate}
                  </span>
                </div>
                {topic.tip && (
                  <p className="text-[11px] text-zinc-600 leading-relaxed mt-1">
                    💡 {topic.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JapaneseSenseiPage() {
  const [activeTab, setActiveTab] = useState<"roadmap" | "routine" | "resources">("roadmap");

  const totalTopics = ROADMAP.flatMap((p) => p.topics).length;
  const completedTopics = 0; // wire to real state later

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-in fade-in duration-700">

      {/* Header */}
      <section className="py-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🇯🇵</span>
            <span className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.3em]">JP-Sensei</span>
          </div>
          <h1 className="text-4xl font-serif text-white tracking-tight">
            Japanese <span className="text-amber-400/90">Mastery</span> Roadmap
          </h1>
          <p className="text-zinc-600 mt-2 text-sm">
            Everything you need to go from zero to fluent — structured, prioritized, and efficient.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-bold text-amber-400">{Math.round((completedTopics / totalTopics) * 100)}%</div>
          <div className="text-xs text-zinc-600 mt-1">Overall progress</div>
          <div className="text-[10px] text-zinc-700">{completedTopics}/{totalTopics} topics</div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Topics", value: totalTopics.toString(), icon: <Target size={14} />, color: "text-amber-400" },
          { label: "Study Phases", value: "4", icon: <BookOpen size={14} />, color: "text-emerald-400" },
          { label: "Daily Time", value: "2 hrs", icon: <Clock size={14} />, color: "text-blue-400" },
          { label: "To Fluency", value: "12–18 mo", icon: <Zap size={14} />, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#08080e] border border-zinc-800/60 rounded-xl p-4">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#08080e] border border-zinc-800/60 rounded-xl p-1 w-fit">
        {(["roadmap", "routine", "resources"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? "bg-amber-400/15 text-amber-400 border border-amber-400/20"
                : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Roadmap Tab ── */}
      {activeTab === "roadmap" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-600 mb-2">
            Click each phase to expand. Check off topics as you complete them.
          </p>
          {ROADMAP.map((phase) => (
            <PhaseCard key={phase.id} phase={phase} />
          ))}
        </div>
      )}

      {/* ── Daily Routine Tab ── */}
      {activeTab === "routine" && (
        <div className="space-y-4">
          <div className="bg-[#08080e] border border-amber-400/15 rounded-2xl p-6 mb-6">
            <h3 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">The Golden Rule</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              <strong className="text-white">2 hours every day beats 14 hours on Sunday.</strong> Consistency is the only variable that matters in language learning. Miss a day and you lose more than one day's progress.
            </p>
          </div>

          <div className="grid gap-3">
            {DAILY_ROUTINE.map((item, i) => (
              <div key={i} className="bg-[#08080e] border border-zinc-800/60 rounded-xl p-5 flex items-center gap-5 hover:border-zinc-700/60 transition-all">
                <div className="text-2xl w-10 text-center shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-sm font-semibold ${item.color}`}>{item.activity}</span>
                    <span className="text-[10px] text-zinc-700 flex items-center gap-1">
                      <Clock size={9} /> {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">{item.desc}</p>
                </div>
                <div className={`text-lg font-bold ${item.color} opacity-40 shrink-0`}>
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#08080e] border border-zinc-800/60 rounded-xl p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pro Tips</span>
            </div>
            <div className="space-y-2">
              {[
                "Set your phone language to Japanese after reaching N4.",
                "Watch anime with Japanese subtitles, not English.",
                "Think in Japanese — narrate your day internally.",
                "Find a language exchange partner on Tandem or HelloTalk.",
                "The i+1 principle: always consume content slightly above your level.",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-500">
                  <span className="text-amber-400/60 mt-0.5 shrink-0">→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Resources Tab ── */}
      {activeTab === "resources" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RESOURCES.map((r) => (
            <div key={r.name} className="bg-[#08080e] border border-zinc-800/60 rounded-xl p-5 group hover:border-zinc-700/60 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-zinc-200">{r.name}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      r.tag === "Essential"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : r.tag === "Recommended"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    }`}>
                      {r.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{r.type}</span>
                </div>
                <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-amber-400 transition-colors mt-0.5" />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}