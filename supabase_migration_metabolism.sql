-- Add activity_level column to avaliacoes table
ALTER TABLE public.avaliacoes 
ADD COLUMN IF NOT EXISTS activity_level text DEFAULT 'moderate';

-- Update existing rows to have a default value (optional but good for consistency)
UPDATE public.avaliacoes 
SET activity_level = 'moderate' 
WHERE activity_level IS NULL;
