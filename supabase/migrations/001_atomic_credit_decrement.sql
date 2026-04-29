-- Run this in Supabase SQL Editor → New Query
-- Atomically decrements interview_credits only if credits > 0.
-- Returns TRUE on success, FALSE if no credits remain.
CREATE OR REPLACE FUNCTION decrement_interview_credits(p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE profiles
  SET interview_credits = interview_credits - 1
  WHERE clerk_user_id = p_user_id
    AND plan = 'free'
    AND interview_credits > 0;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$;

-- Atomically decrements cv_credits only if credits > 0.
-- Returns TRUE on success, FALSE if no credits remain.
CREATE OR REPLACE FUNCTION decrement_cv_credits(p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE profiles
  SET cv_credits = cv_credits - 1
  WHERE clerk_user_id = p_user_id
    AND plan = 'free'
    AND cv_credits > 0;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$;
