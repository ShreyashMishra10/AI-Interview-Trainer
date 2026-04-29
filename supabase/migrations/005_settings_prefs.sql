-- Run this in Supabase SQL Editor → New Query
-- Adds persistent notification and privacy preference columns to profiles.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS notification_prefs JSONB NOT NULL DEFAULT '{
    "interviewReminders": true,
    "weeklyReport": true,
    "sessionComplete": true,
    "tips": false,
    "marketing": false,
    "email": true,
    "sound": true
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS privacy_prefs JSONB NOT NULL DEFAULT '{
    "analytics": true,
    "crashReports": true
  }'::jsonb;
