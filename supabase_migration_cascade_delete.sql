-- Drop the existing foreign key constraint
ALTER TABLE public.avaliacoes
DROP CONSTRAINT IF EXISTS avaliacoes_student_id_fkey;

-- Re-create the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.avaliacoes
ADD CONSTRAINT avaliacoes_student_id_fkey
FOREIGN KEY (student_id)
REFERENCES public.students (id)
ON DELETE CASCADE;
