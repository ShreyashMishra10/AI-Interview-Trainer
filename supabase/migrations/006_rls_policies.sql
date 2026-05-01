-- Enable Row Level Security on all data tables.
-- This app uses Clerk for auth and the Supabase service role (via API routes)
-- for all data access. The anon key is exposed client-side but never used for
-- DB queries, so RLS with no anon policies = full block on direct anon access.
-- The service_role key bypasses RLS automatically (Supabase built-in behaviour).

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_generations     ENABLE ROW LEVEL SECURITY;

-- No policies are added for the anon or authenticated roles intentionally.
-- All legitimate data access flows through API routes that use the service role.
