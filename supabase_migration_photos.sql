-- Add photo columns to avaliacoes table
ALTER TABLE public.avaliacoes 
ADD COLUMN IF NOT EXISTS foto_frente text,
ADD COLUMN IF NOT EXISTS foto_lateral text,
ADD COLUMN IF NOT EXISTS foto_costas text;
