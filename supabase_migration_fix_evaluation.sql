-- Add activity_level column to avaliacoes table
ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS activity_level TEXT DEFAULT 'moderate';

-- Create storage bucket for evaluation photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('evaluation-photos', 'evaluation-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to evaluation photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'evaluation-photos' );

-- Policy to allow authenticated users to upload evaluation photos
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'evaluation-photos' AND auth.role() = 'authenticated' );

-- Policy to allow authenticated users to update their own photos (optional but good)
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'evaluation-photos' AND auth.role() = 'authenticated' );

-- Policy to allow authenticated users to delete their own photos
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'evaluation-photos' AND auth.role() = 'authenticated' );
