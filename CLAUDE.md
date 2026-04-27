# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # Start dev server (Turbopack, localhost:3000)
pnpm build      # Production build
pnpm lint       # ESLint
```

No test suite exists yet.

## Stack

- **Next.js 16.2.2** with App Router and Turbopack — `middleware` is renamed to `proxy` (`proxy.ts` at root). Read `node_modules/next/dist/docs/` before using any Next.js API.
- **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**
- **Clerk v7** (`@clerk/nextjs`) — auth. `SignedIn`/`SignedOut` components do not exist in v7; use `useAuth()` hook on the client or `auth()` from `@clerk/nextjs/server` on the server. `afterSignOutUrl` prop was removed from `UserButton`.
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) — Postgres database. Auth is handled by Clerk, not Supabase Auth.
- **Google Gemini** (`@google/generative-ai`) — AI for interview questions and CV generation. Key: `GEMINI_API_KEY`.

## Route Structure

Two route groups share the root layout (`app/layout.tsx`):

- `app/(marketing)/` — public marketing site with its own `layout.tsx` (Navbar + globals.css). Pages: `/`, `/about`, `/services`, `/pricing`, `/faq`, `/privacy`, `/terms`.
- `app/(dashboard)/` — authenticated dashboard with its own `layout.tsx` (Sidebar + header). Pages: `/dashboard`, `/dashboard/interviews`, `/dashboard/cv-builder`, `/dashboard/japanese-sensei`, `/dashboard/settings`.
- `app/sign-in/` and `app/sign-up/` — outside both groups, use root layout only.

## Auth & Routing

`proxy.ts` (Next.js 16 middleware) uses Clerk to protect all non-public routes. Public routes are `/`, `/about`, `/services`, `/pricing`, `/faq`, `/privacy`, `/terms`, `/sign-in`, `/sign-up`. Everything under `/dashboard` and all `/api` routes require a valid Clerk session.

Sign-in and sign-up pages redirect to `/dashboard` if already authenticated (server-side `auth()` check).

## Supabase

Three client helpers in `lib/supabase/`:
- `client.ts` — browser client (use in client components)
- `server.ts` — server client with cookie handling (use in server components)
- `admin.ts` — service role client that bypasses RLS (use only in API routes)

All API routes use `supabaseAdmin` since Supabase Auth is not used — authorization is done by checking Clerk `userId` in the route handler. The `getOrCreateProfile()` helper in `lib/supabase/profile.ts` auto-creates a Supabase profile row on first dashboard visit.

**Schema tables:** `profiles`, `interview_sessions`, `session_messages`, `cv_generations`. The `clerk_user_id` text column is the join key between Clerk and Supabase across all tables.

## API Routes

| Route | Description |
|---|---|
| `GET/PATCH /api/profile` | Get (or create) profile + usage stats; update name/email |
| `GET/POST /api/interviews` | List sessions; send message to Gemini AI and save to DB |
| `POST /api/interviews/sessions` | Create a new interview session with credit check |
| `GET/POST /api/generate-cv` | Fetch CV history; generate CV via Gemini and save to DB |

## Styling Conventions

- **Accent color:** `amber-500` sitewide. Blue is not used as an accent.
- **Marketing pages:** light grey background (`oklch(0.92 0 0)`), white cards, serif headings (`font-serif`) for section titles, `font-bold tracking-tight` for hero headings.
- **Dashboard:** near-black `#08080e` backgrounds, `zinc-800/60` borders, `amber-400` accent.
- **Scroll animations:** use the `<Reveal>` component (`components/Reveal.tsx`) for below-the-fold sections. Hero animations use `animate-reveal` CSS class with `animationDelay` inline styles (CSS-only, works in server components).
- **Tailwind v4:** arbitrary values like `max-w-[1100px]` are preferred over canonical aliases for consistency with existing code.

## Key Constraints

- `proxy.ts` is the middleware file — do not create `middleware.ts` (will conflict).
- `lib/supabase/admin.ts` must only be imported in server-side code (API routes, server components). Never import it in client components.
- The marketing home page (`app/(marketing)/page.tsx`) is a **server component** — do not add `"use client"` to it.
- Client-component pages (`pricing`, `faq`, `privacy`, `terms`) cannot export `metadata` directly — add a `layout.tsx` sibling file to export metadata for those routes.
