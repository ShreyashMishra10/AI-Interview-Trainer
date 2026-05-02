-- Add profile columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url      TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio             TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_role     TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (use CREATE OR REPLACE where supported, else skip if exists)
DO $$ BEGIN
  CREATE POLICY "Public avatar read" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "User avatar upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "User avatar update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "User avatar delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
