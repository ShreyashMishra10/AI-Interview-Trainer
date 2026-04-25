"use client";

import React, { useState } from "react";
import { ScrollText, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  { id: "overview",       title: "Overview"                   },
  { id: "acceptance",     title: "Acceptance of Terms"        },
  { id: "accounts",       title: "User Accounts"              },
  { id: "use",            title: "Acceptable Use"             },
  { id: "subscriptions",  title: "Subscriptions & Payments"   },
  { id: "free-plan",      title: "Free Plan Limitations"      },
  { id: "ip",             title: "Intellectual Property"      },
  { id: "ai-content",     title: "AI-Generated Content"       },
  { id: "prohibited",     title: "Prohibited Conduct"         },
  { id: "termination",    title: "Termination"                },
  { id: "liability",      title: "Limitation of Liability"    },
  { id: "disclaimer",     title: "Disclaimer of Warranties"   },
  { id: "governing-law",  title: "Governing Law"              },
  { id: "changes",        title: "Changes to These Terms"     },
  { id: "contact",        title: "Contact Us"                 },
];

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

export default function TermsPage() {
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
              <ScrollText size={18} className="text-amber-400" />
            </div>
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.3em]">Legal</span>
          </div>
          <h1 className="text-4xl font-serif tracking-tight mb-3">Terms of Service</h1>
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

          {/* Content */}
          <div className="flex-1 min-w-0">

            <Section id="overview" title="Overview">
              <Highlight>
                These Terms of Service ("Terms") govern your access to and use of AI-Interview Trainer ("we", "our", "us"), operated by Shreyash Mishra. By accessing or using our platform, you agree to be bound by these Terms.
              </Highlight>
              <p>
                AI-Interview Trainer provides AI-powered mock interview sessions, CV generation, Japanese language learning tools, and performance analytics — collectively referred to as the "Service."
              </p>
              <p>
                Please read these Terms carefully. If you do not agree with any part of them, you may not access the Service.
              </p>
            </Section>

            <Section id="acceptance" title="Acceptance of Terms">
              <p>
                By creating an account, clicking "Get Started", or otherwise accessing the Service, you confirm that:
              </p>
              <List items={[
                "You are at least 13 years of age",
                "You have the legal capacity to enter into a binding agreement",
                "You have read, understood, and agree to be bound by these Terms",
                "You agree to our Privacy Policy, which is incorporated into these Terms by reference",
              ]} />
              <p>
                If you are accessing the Service on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.
              </p>
            </Section>

            <Section id="accounts" title="User Accounts">
              <p>To access most features of the Service, you must create an account. You agree to:</p>
              <List items={[
                "Provide accurate, current, and complete information during registration",
                "Keep your account credentials confidential and not share them with others",
                "Notify us immediately of any unauthorised use of your account",
                "Accept responsibility for all activity that occurs under your account",
              ]} />
              <div className="bg-card border border-border rounded-xl p-4 mt-2">
                <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Account Security</p>
                <p>
                  Authentication is managed through Clerk. We strongly recommend enabling two-factor authentication. We are not liable for losses arising from unauthorised account access caused by your failure to keep credentials secure.
                </p>
              </div>
            </Section>

            <Section id="use" title="Acceptable Use">
              <p>You may use the Service for lawful, personal, or professional interview preparation purposes. You agree not to:</p>
              <List items={[
                "Use the Service for any unlawful or fraudulent purpose",
                "Attempt to reverse-engineer, copy, or scrape the platform or its AI outputs",
                "Circumvent usage limits, access controls, or subscription restrictions",
                "Submit harmful, abusive, or offensive content during interview sessions",
                "Use the Service to impersonate any person or entity",
                "Interfere with or disrupt the integrity or performance of the Service",
              ]} />
            </Section>

            <Section id="subscriptions" title="Subscriptions & Payments">
              <p>
                We offer Free, Pro (₹499/month or ₹399/month billed annually), and Enterprise (₹1,999/month or ₹1,599/month billed annually) plans. All prices are in Indian Rupees (INR) and inclusive of applicable taxes.
              </p>
              <div className="space-y-3 mt-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Billing</p>
                  <List items={[
                    "Pro and Enterprise plans are billed at the start of each billing cycle",
                    "Annual plans are billed in full on the subscription start date",
                    "Payments are processed securely via Razorpay",
                    "You will receive an invoice by email for every successful charge",
                  ]} />
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Cancellations & Refunds</p>
                  <List items={[
                    "You may cancel at any time from Settings → Subscription",
                    "Cancellation takes effect at the end of the current billing period",
                    "We do not offer pro-rated refunds for mid-cycle cancellations",
                    "Annual plan refunds may be considered within 7 days of purchase — contact support",
                  ]} />
                </div>
              </div>
              <Highlight>
                Upgrades are applied immediately and prorated. Downgrades take effect at the next billing cycle. We reserve the right to change pricing with 30 days' notice.
              </Highlight>
            </Section>

            <Section id="free-plan" title="Free Plan Limitations">
              <p>
                The Free plan is provided at no cost and is subject to the following usage limits:
              </p>
              <List items={[
                "5 mock interview sessions per calendar month",
                "2 AI CV generations per calendar month",
                "100 AI chat credits per calendar month",
                "Basic performance analytics only",
                "No access to voice interview mode",
                "No interview history export",
              ]} />
              <p>
                We reserve the right to modify free plan limits at any time. Continued use of the Service after such changes constitutes acceptance of the new limits.
              </p>
            </Section>

            <Section id="ip" title="Intellectual Property">
              <p>
                All content on the platform — including the interface, AI models, branding, code, and documentation — is owned by or licensed to AI-Interview Trainer and protected by applicable intellectual property laws.
              </p>
              <List items={[
                "You may not copy, reproduce, or redistribute platform content without written permission",
                "The AI-Trainer name and logo are trademarks of Shreyash Mishra",
                "Open-source components used in this platform are governed by their respective licences",
              ]} />
              <p>
                Content you submit (interview responses, CV data) remains yours. By submitting it, you grant us a limited, non-exclusive licence to process it solely for delivering the Service.
              </p>
            </Section>

            <Section id="ai-content" title="AI-Generated Content">
              <p>
                The Service uses Anthropic's Claude AI to generate interview questions, feedback, and CV rewrites. You acknowledge that:
              </p>
              <List items={[
                "AI-generated content is provided for practice and informational purposes only",
                "We do not guarantee the accuracy, completeness, or suitability of AI outputs",
                "AI feedback does not constitute professional career or legal advice",
                "You are responsible for any decisions made based on AI-generated content",
                "We do not use your interview or CV content to train AI models without your explicit consent",
              ]} />
              <Highlight>
                Always review AI-generated CVs and feedback critically. AI outputs can contain errors or omissions — use your own judgement before submitting a CV to a prospective employer.
              </Highlight>
            </Section>

            <Section id="prohibited" title="Prohibited Conduct">
              <p>The following actions are strictly prohibited and may result in immediate account termination:</p>
              <div className="bg-card border border-border rounded-xl p-4">
                <List items={[
                  "Attempting to exploit, hack, or probe the platform for vulnerabilities",
                  "Using automated bots or scripts to generate sessions or credits",
                  "Sharing, reselling, or sublicensing your account or subscription benefits",
                  "Uploading malicious files or code through any input field",
                  "Engaging in harassment, hate speech, or abusive behaviour toward platform staff",
                  "Circumventing geographic or access restrictions",
                ]} />
              </div>
            </Section>

            <Section id="termination" title="Termination">
              <p>
                Either party may terminate access to the Service at any time.
              </p>
              <div className="space-y-3 mt-2">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Termination by You</p>
                  <p>Delete your account at any time from Settings → Account. Deletion is permanent and irreversible.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-xs uppercase tracking-wider mb-2">Termination by Us</p>
                  <List items={[
                    "We may suspend or terminate your account for violation of these Terms",
                    "We may terminate the Service entirely with 30 days' notice",
                    "Accounts inactive for more than 24 months may be deleted without notice",
                  ]} />
                </div>
              </div>
              <p>
                Upon termination, your right to use the Service ceases immediately. Provisions that by nature should survive termination (IP, liability, governing law) will continue to apply.
              </p>
            </Section>

            <Section id="liability" title="Limitation of Liability">
              <Highlight>
                To the maximum extent permitted by applicable law, AI-Interview Trainer and its founder shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or opportunities — arising out of your use of the Service.
              </Highlight>
              <p>
                Our total liability to you for any claim arising from or related to these Terms or the Service is limited to the amount you paid us in the 3 months immediately preceding the event giving rise to the claim, or ₹500 — whichever is greater.
              </p>
              <p>
                Some jurisdictions do not allow certain exclusions of liability. In those cases the exclusions above apply only to the extent permitted by law.
              </p>
            </Section>

            <Section id="disclaimer" title="Disclaimer of Warranties">
              <p>
                The Service is provided <strong className="text-foreground">"as is"</strong> and <strong className="text-foreground">"as available"</strong> without warranties of any kind — express or implied — including but not limited to:
              </p>
              <List items={[
                "Merchantability or fitness for a particular purpose",
                "Uninterrupted, error-free, or secure operation of the Service",
                "Accuracy or reliability of AI-generated questions, feedback, or scores",
                "Outcomes such as job placement or interview success",
              ]} />
              <p>
                We will make reasonable efforts to maintain uptime and platform quality, but we do not guarantee any specific service level outside of Enterprise agreements.
              </p>
            </Section>

            <Section id="governing-law" title="Governing Law">
              <p>
                These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts located in <strong className="text-foreground">Jalandhar, Punjab, India</strong>.
              </p>
              <p>
                If any provision of these Terms is found to be unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will remain in full force.
              </p>
            </Section>

            <Section id="changes" title="Changes to These Terms">
              <p>
                We may revise these Terms from time to time. When we make material changes, we will:
              </p>
              <List items={[
                "Post the updated Terms with a new effective date",
                "Notify registered users via email at least 14 days before changes take effect",
                "Show a notice banner in the platform for significant changes",
              ]} />
              <p>
                Continued use of the Service after revised Terms take effect constitutes your acceptance of the new Terms. If you do not agree to the changes, you must stop using the Service and delete your account.
              </p>
            </Section>

            <Section id="contact" title="Contact Us">
              <p>If you have any questions about these Terms, please reach out:</p>
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex gap-4">
                  <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest w-28 shrink-0">Email</span>
                  <span className="text-foreground text-sm font-medium">legal@ai-interview-trainer.com</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest w-28 shrink-0">Founder</span>
                  <span className="text-foreground text-sm">Shreyash Mishra</span>
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
