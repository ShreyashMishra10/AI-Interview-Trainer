-- Run this in Supabase SQL Editor → New Query
-- Returns total_sessions, completed_sessions, total_cvs, and latest_session
-- in a single round-trip, replacing four separate count queries.
CREATE OR REPLACE FUNCTION get_profile_stats(p_user_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_sessions     INTEGER;
  v_completed_sessions INTEGER;
  v_total_cvs          INTEGER;
  v_latest_session     JSON;
BEGIN
  -- Single scan over interview_sessions for both counts
  SELECT
    COUNT(*)::INTEGER,
    COUNT(*) FILTER (WHERE status = 'completed')::INTEGER
  INTO v_total_sessions, v_completed_sessions
  FROM interview_sessions
  WHERE clerk_user_id = p_user_id;

  -- Latest completed session
  SELECT json_build_object(
    'score',      score,
    'job_role',   job_role,
    'created_at', created_at
  )
  INTO v_latest_session
  FROM interview_sessions
  WHERE clerk_user_id = p_user_id
    AND status = 'completed'
  ORDER BY created_at DESC
  LIMIT 1;

  -- CV count
  SELECT COUNT(*)::INTEGER
  INTO v_total_cvs
  FROM cv_generations
  WHERE clerk_user_id = p_user_id;

  RETURN json_build_object(
    'total_sessions',     v_total_sessions,
    'completed_sessions', v_completed_sessions,
    'total_cvs',          v_total_cvs,
    'latest_session',     v_latest_session
  );
END;
$$;
