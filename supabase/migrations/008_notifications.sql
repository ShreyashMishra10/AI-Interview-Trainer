-- Notifications table for system messages, payment confirmations, etc.
CREATE TABLE IF NOT EXISTS notifications (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT        NOT NULL,
  type          TEXT        NOT NULL DEFAULT 'system'
                            CHECK (type IN ('system', 'payment', 'interview', 'cv')),
  title         TEXT        NOT NULL,
  message       TEXT,
  read          BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON notifications (clerk_user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Auto welcome message when a new profile is created
CREATE OR REPLACE FUNCTION notify_new_user()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO notifications (clerk_user_id, type, title, message)
  VALUES (
    NEW.clerk_user_id,
    'system',
    'Welcome to AI Interview Trainer!',
    'Start your first mock interview or build your CV to get started.'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION notify_new_user();