-- Create Workouts table
create table public.workouts (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  student_id uuid not null,
  name text not null,
  routine_type text not null, -- 'Full Body', 'Upper/Lower', 'PPL', etc.
  description text null,
  constraint workouts_pkey primary key (id),
  constraint workouts_student_id_fkey foreign key (student_id) references students (id) on delete cascade
);

-- Create Workout Days table (e.g., "Day A", "Monday")
create table public.workout_days (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  workout_id uuid not null,
  name text not null,
  day_order integer not null, -- To order days (1, 2, 3...)
  constraint workout_days_pkey primary key (id),
  constraint workout_days_workout_id_fkey foreign key (workout_id) references workouts (id) on delete cascade
);

-- Create Workout Exercises table
create table public.workout_exercises (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  workout_day_id uuid not null,
  exercise_name text not null,
  sets integer not null default 3,
  reps text not null default '10-12', -- Text to allow ranges like "10-12" or "Falha"
  rest_time text null, -- e.g., "60s"
  notes text null,
  exercise_order integer not null, -- To order exercises within a day
  constraint workout_exercises_pkey primary key (id),
  constraint workout_exercises_day_id_fkey foreign key (workout_day_id) references workout_days (id) on delete cascade
);

-- Enable RLS
alter table public.workouts enable row level security;
alter table public.workout_days enable row level security;
alter table public.workout_exercises enable row level security;

-- Create policies (Permissive for now, similar to other tables)
create policy "Enable all access for all users" on public.workouts for all using (true) with check (true);
create policy "Enable all access for all users" on public.workout_days for all using (true) with check (true);
create policy "Enable all access for all users" on public.workout_exercises for all using (true) with check (true);
