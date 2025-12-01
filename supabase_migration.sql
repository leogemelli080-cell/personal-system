-- Create students table
create table public.students (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  email text null,
  phone text null,
  birth_date date not null,
  gender text not null,
  objective text null,
  constraint students_pkey primary key (id)
);

-- Add student_id to avaliacoes table
alter table public.avaliacoes
add column student_id uuid null;

-- Add foreign key constraint
alter table public.avaliacoes
add constraint avaliacoes_student_id_fkey foreign key (student_id) references students (id);

-- Enable RLS (optional but recommended)
alter table public.students enable row level security;

-- Create policy to allow all access (for development)
create policy "Enable all access for all users" on public.students
as permissive for all
to public
using (true)
with check (true);
