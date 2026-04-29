-- Run this in Supabase SQL Editor → New Query
-- Adds indexes for the most frequent query patterns across all API routes.

-- interview_sessions: filtered by user + ordered by date (dashboard, interviews list)
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_created
  ON interview_sessions (clerk_user_id, created_at DESC);

-- interview_sessions: filtered by user + status (completed count, latest session)
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_status
  ON interview_sessions (clerk_user_id, status);

-- session_messages: fetched by session id (detail page transcript)
CREATE INDEX IF NOT EXISTS idx_session_messages_session
  ON session_messages (session_id, created_at ASC);

-- cv_generations: filtered by user + ordered by date (CV history)
CREATE INDEX IF NOT EXISTS idx_cv_generations_user_created
  ON cv_generations (clerk_user_id, created_at DESC);

-- profiles: looked up by clerk_user_id on every authenticated request
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_clerk_user_id
  ON profiles (clerk_user_id);
