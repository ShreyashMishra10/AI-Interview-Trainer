"use client";

import React, { useState } from "react";
import { Shield, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  { id: "overview",    title: "Overview"                    },
  { id: "collection",  title: "Data We Collect"             },
  { id: "usage",       title: "How We Use Your Data"        },
  { id: "storage",     title: "Data Storage & Security"     },
  { id: "sharing",     title: "Data Sharing"                },
  { id: "cookies",     title: "Cookies"                     },
  { id: "rights",      title: "Your Rights"                 },
  { id: "retention",   title: "Data Retention"              },
  { id: "children",    title: "Children's Privacy"          },
  { id: "changes",     title: "Changes to This Policy"      },
  { id: "contact",     title: "Contact Us"                  },
];

// --- ADAPTIVE COMPONENTS ---

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mb-12 scroll-mt-24 animate-reveal">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
        <div className="w-1 h-6 bg-amber-400 rounded-full" />
        {title}
      </h2>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed pl-4">
        {children}
      </div>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-400/5 border border-amber-400/15 rounded-xl p-4 text-foreground/90 text-sm leading-relaxed">
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-amber-400 mt-1 shrink-0">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// --- MAIN PAGE ---

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-amber-400/30">
      <div className="max-w-[1100px] mx-auto px-6 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-10">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="mb-12 animate-reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <Shield size={18} className="text-amber-400" />
            </div>
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.3em]">Legal</span>
          </div>
          <h1 className="text-4xl font-serif tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">
            Effective date: <span className="text-foreground/70">January 1, 2025</span> &nbsp;·&nbsp; Last updated: <span className="text-foreground/70">April 2026</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar TOC */}
          <div className="w-full lg:w-52 shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4">Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                      activeSection === s.id
                        ? "text-amber-400 bg-amber-400/10 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                    }`}
                  >
                    {activeSection === s.id && <ChevronRight size={11} className="shrink-0" />}
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Full Content Area */}
          <div className="flex-1 min-w-0">

            <Section id="overview" title="Overview">
              <Highlight>
                AI-Interview Trainer ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your information when you use our platform at <strong>ai-interview-trainer.com</strong>.
              </Highlight>
              <p>
                By using our service, you agree to the collection and use of information in accordance with this policy. We built this platform to help you prepare for job interviews through AI-powered mock sessions, CV generation, and language learning tools — and we take the trust you place in us seriously.
              </p>
              <p>
                This policy applies to all users of the AI-Interview Trainer web application, including free and paid plan subscribers.
              </p>
            </Section>

            <Section id="collection" title="Data We Collect">
              <p>We collect the following categories of information:</p>
              <div className="space-y-4 mt-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Account Information</p>
                  <List items={[
                    "Name, email address, and username provided during sign-up",
                    "Profile picture (if uploaded)",
                    "Authentication data managed securely through Clerk",
                    "Target job role and experience level (for personalization)",
                  ]} />
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Interview & Usage Data</p>
                  <List items={[
                    "Interview session transcripts and responses (text and voice)",
                    "AI feedback scores and performance metrics",
                    "CV content submitted for AI generation",
                    "Session timestamps, durations, and completion status",
                  ]} />
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Camera & Microphone Data</p>
                  <List items={[
                    "Webcam feed is processed locally in your browser only — we do not record video",
                    "Voice input is transcribed using Web Speech API — audio is not sent to our servers",
                    "Transcribed text is stored as part of your session transcript",
                  ]} />
                </div>
              </div>
            </Section>

            <Section id="usage" title="How We Use Your Data">
              <p>We use the data we collect for the following purposes:</p>
              <List items={[
                "To provide and improve AI-powered mock interview sessions tailored to your role",
                "To generate personalized CVs based on information you submit",
                "To calculate and display your performance scores and streaks",
                "To send you notifications about session reminders and updates",
                "To authenticate your identity securely via Clerk",
                "To detect and prevent fraud, abuse, or security vulnerabilities",
              ]} />
              <div className="mt-4">
                <Highlight>
                  We do <strong>not</strong> use your interview content or CV data to train our AI models without your explicit consent.
                </Highlight>
              </div>
            </Section>

            <Section id="storage" title="Data Storage & Security">
              <p>
                Your data is stored on secure cloud infrastructure. We implement the following measures:
              </p>
              <List items={[
                "All data is encrypted in transit using TLS 1.2+",
                "Passwords are never stored — managed entirely by Clerk",
                "Database access is restricted to authorized personnel only",
                "Regular security audits and automated backups",
              ]} />
            </Section>

            <Section id="sharing" title="Data Sharing">
              <Highlight>
                We do <strong>not</strong> sell your personal data to third parties. Ever.
              </Highlight>
              <p className="mt-4">We share data only with trusted providers necessary for operation:</p>
              <div className="bg-card border border-border rounded-xl p-4 mt-2">
                <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Third-Party Services</p>
                <List items={[
                  "Clerk — Authentication and user management",
                  "Anthropic Claude API — AI question generation",
                  "Vercel — Hosting and deployment infrastructure",
                  "Stripe — Payment processing (for paid plans)",
                ]} />
              </div>
            </Section>

            <Section id="cookies" title="Cookies">
              <p>We use cookies to operate our service:</p>
              <div className="space-y-3 mt-4">
                {[
                  { type: "Essential", desc: "Required for authentication. Cannot be disabled.", color: "text-red-400" },
                  { type: "Preferences", desc: "Remembers your theme and language settings.", color: "text-amber-400" },
                  { type: "Analytics", desc: "Helps us improve platform performance.", color: "text-blue-400" },
                ].map((c) => (
                  <div key={c.type} className="bg-card border border-border rounded-xl p-4">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${c.color}`}>{c.type}</p>
                    <p className="text-muted-foreground text-xs">{c.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="rights" title="Your Rights">
              <List items={[
                "Right to Access — Request a copy of your data",
                "Right to Rectification — Correct inaccurate data",
                "Right to Erasure — Delete your account and data",
                "Right to Portability — Export your data as JSON",
                "Right to Object — Opt out of analytics",
              ]} />
              <div className="mt-4">
                <Highlight>
                  Exercise these rights in <strong>Settings → Privacy</strong> or email <strong>privacy@ai-interview-trainer.com</strong>.
                </Highlight>
              </div>
            </Section>

            <Section id="retention" title="Data Retention">
              <List items={[
                "Account data is kept until you delete your account",
                "Interview transcripts are kept for 12 months then deleted",
                "Usage logs are kept for 6 months",
                "Billing records are kept for 7 years as per tax law",
              ]} />
            </Section>

            <Section id="children" title="Children's Privacy">
              <p>
                Our service is not intended for anyone under **13 years**. We do not knowingly collect data from children.
              </p>
            </Section>

            <Section id="changes" title="Changes to This Policy">
              <p>
                We may update this policy. We will notify you via email or a prominent notice on our platform for material changes.
              </p>
            </Section>

            <Section id="contact" title="Contact Us">
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex gap-4">
                  <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest w-28 shrink-0">Email</span>
                  <span className="text-foreground text-sm font-medium">privacy@ai-interview-trainer.com</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest w-28 shrink-0">Location</span>
                  <span className="text-foreground text-sm">Jalandhar, Punjab, India</span>
                </div>
              </div>
            </Section>

            <footer className="border-t border-border pt-8 mt-12 mb-20 text-center">
              <p className="text-xs text-muted-foreground">
                © 2026 AI-Interview Trainer · Build v2.4
              </p>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}