-- Run this in Supabase SQL Editor → New Query
-- Auto-completes interview sessions that have been in_progress for more than 24 hours.
-- Schedule this via Supabase cron (pg_cron extension) to run daily.

-- Step 1: Create the cleanup function
CREATE OR REPLACE FUNCTION cleanup_stale_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE interview_sessions
  SET
    status       = 'completed',
    completed_at = NOW()
  WHERE
    status     = 'in_progress'
    AND created_at < NOW() - INTERVAL '24 hours';

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated;
END;
$$;

-- Step 2: Enable pg_cron extension (required for scheduling)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 3: Schedule it to run every day at 2 AM UTC
SELECT cron.schedule(
  'cleanup-stale-sessions',
  '0 2 * * *',
  'SELECT cleanup_stale_sessions()'
);
