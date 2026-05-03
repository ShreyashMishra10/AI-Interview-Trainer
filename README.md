# 🤖 AI Interview Trainer

A full-stack SaaS platform that helps software engineers prepare for technical interviews in Japan and globally. Practice with an AI interviewer, generate ATS-friendly CVs, and track your progress over time.

---

## ✨ Features

- **AI Mock Interviews** — 10-question progressive sessions powered by Groq (Llama 3.3-70B). Upload your CV for context-aware, role-specific questions with per-answer feedback and a final score (0–100).
- **AI CV Builder** — Upload an existing CV (PDF/DOCX) or fill in a form; Gemini AI generates an ATS-optimized CV in Google XYZ format, downloadable as PDF.
- **Japanese Sensei** — Structured Japanese language roadmap (Hiragana → JLPT N1) with lessons and spaced-repetition tracking for engineers targeting the Japanese market.
- **Dashboard & Analytics** — Performance readiness gauge, GitHub-style activity heatmap, recent sessions feed, and credit tracking.
- **Settings** — Theme toggle, notifications, privacy controls, subscription management, avatar upload, and full data export.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| Auth | Clerk v7 |
| Database | Supabase (PostgreSQL) |
| AI — Interviews | Groq API (Llama 3.3-70B) |
| AI — CV Builder | Google Gemini (`@google/generative-ai`) |
| Email | Resend |
| Rate Limiting | Upstash Redis |
| Error Tracking | Sentry |
| Package Manager | pnpm |

---

## 📁 Project Structure

```
ai-interview-trainer/
├── app/
│   ├── (marketing)/          # Public site — /, /about, /services, /pricing, /faq, /privacy, /terms
│   ├── (dashboard)/          # Authenticated area — /dashboard and all sub-routes
│   │   └── dashboard/
│   │       ├── interviews/   # Session list, active interview chat, session review
│   │       ├── cv-builder/   # CV upload, AI generation, and PDF preview
│   │       ├── japanese-sensei/
│   │       └── settings/
│   ├── api/                  # REST API routes (all Clerk-protected)
│   ├── sign-in/
│   └── sign-up/
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── settings/             # Settings page tab components
│   └── services/             # Marketing feature/plan cards
├── lib/
│   ├── supabase/             # client.ts · server.ts · admin.ts · profile.ts
│   ├── email.ts              # Resend email helpers (welcome, session complete)
│   └── ratelimit.ts          # Upstash rate limiter
├── supabase/
│   └── migrations/           # SQL migration files (001–008)
├── hooks/                    # Custom React hooks
├── proxy.ts                  # Next.js 16 middleware — Clerk route protection
└── next.config.ts            # Security headers, Sentry config
```

---

## 🗄️ Database Schema

Four core tables in Supabase (PostgreSQL). Clerk `user_id` is the join key — Supabase Auth is not used.

```sql
profiles
  id, clerk_user_id (unique), email, full_name, bio, target_role,
  experience_level, avatar_url, plan, interview_credits, cv_credits,
  notification_prefs (jsonb), privacy_prefs (jsonb)

interview_sessions
  id, clerk_user_id, job_role, experience_level, mode,
  status (in_progress | completed), score (0–100), created_at, completed_at

session_messages
  id, session_id (fk), role (user | assistant), content,
  question_number, created_at

cv_generations
  id, clerk_user_id, target_role, cv_data (jsonb), created_at
```

PL/pgSQL functions handle atomic credit decrements (`decrement_interview_credits`, `decrement_cv_credits`) and aggregated stats (`get_profile_stats`).

---

## 🔌 API Routes

| Route | Methods | Description |
|---|---|---|
| `/api/profile` | GET, PATCH | Get or create profile + usage stats; update name/email/bio |
| `/api/profile/avatar` | POST | Upload user avatar |
| `/api/interviews` | GET, POST | List sessions; send message to Groq AI and save to DB |
| `/api/interviews/sessions` | POST | Create a new session (atomic credit check for Free plan) |
| `/api/interviews/sessions/[id]` | PATCH | Mark session completed or discarded |
| `/api/interviews/[id]` | GET | Session detail with full transcript |
| `/api/parse-cv` | POST | Parse uploaded PDF/DOCX and extract text |
| `/api/generate-cv` | GET, POST | List CV history; generate CV via Gemini |
| `/api/settings/export` | POST | Export all user data as JSON |
| `/api/settings/history` | GET | Activity history timeline |

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- A [Groq](https://console.groq.com) API key
- (Optional) [Resend](https://resend.com), [Upstash](https://upstash.com), [Sentry](https://sentry.io) accounts

### ⚙️ Installation

```bash
git clone https://github.com/ShreyashMishra10/ai-interview-trainer.git
cd ai-interview-trainer
pnpm install
```

### 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AI APIs
GROQ_API_KEY=              # Groq — Interview AI, CV-Builder (Llama 3.3-70B)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# Email (optional — disables welcome/session emails if omitted)
RESEND_API_KEY=

# Rate Limiting (optional — disables rate limits if omitted)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 💾 Database Setup

Apply migrations to your Supabase project in order:

```bash
# Using the Supabase CLI
supabase db push

# Or run manually in the Supabase SQL editor (in order):
# supabase/migrations/001_atomic_credit_decrement.sql
# supabase/migrations/002_profile_stats_fn.sql
# supabase/migrations/003_indexes.sql
# supabase/migrations/004_cleanup_stale_sessions.sql
# supabase/migrations/005_settings_prefs.sql
# supabase/migrations/006_rls_policies.sql
# supabase/migrations/007_avatar_url.sql
# supabase/migrations/008_notifications.sql
```

### 💻 Development

```bash
pnpm dev        # Start dev server at localhost:3000 (Turbopack)
pnpm build      # Production build
pnpm lint       # Run ESLint
```

---

## 🏗️ Architecture Notes

### 🔐 Auth Flow

Clerk handles all authentication. `getOrCreateProfile()` (`lib/supabase/profile.ts`) auto-creates a Supabase profile row on the first dashboard visit. Every API route verifies the Clerk `userId` before touching the database.

### 🔀 Middleware

`proxy.ts` (not `middleware.ts`) is the Next.js 16 middleware file. It blocks unauthenticated access to all `/dashboard` and `/api` routes. Public marketing routes are explicitly whitelisted.

### 📊 Supabase Client Strategy

| File | Usage |
|---|---|
| `lib/supabase/client.ts` | Client components (browser) |
| `lib/supabase/server.ts` | Server components (cookie-aware) |
| `lib/supabase/admin.ts` | API routes only — service role, bypasses RLS |

`admin.ts` must never be imported in client components.

### 🧠 AI Models

- **Interviews:** Groq API (Llama 3.3-70B) — low latency, cost-effective for real-time chat.
- **CV Builder:** Google Gemini — structured output generation for CV auto-fill and formatting.

### 🔒 Security

- Upstash Redis rate limiting (30 req/min on interview endpoints, 10 req/min on CV parse)
- File magic-byte validation on all uploads (PDF/DOCX only, max 5 MB)
- UUID format validation on all session ID path params
- Input sanitization: name/email/role whitelisting, message content trimmed to 2 000 chars
- CSP, HSTS, X-Frame-Options, and Permissions-Policy headers set in `next.config.ts`
- Row-Level Security enabled on Supabase; all writes go through the service-role API only
- Sentry error tracking with PII masking in Session Replay

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is private. All rights reserved.
