-- Create Workout Templates table
create table public.workout_templates (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  objective text not null, -- 'Hypertrophy', 'Strength', 'Endurance', 'Weight Loss'
  level text not null, -- 'Beginner', 'Intermediate', 'Advanced'
  routine_type text not null, -- 'Full Body', 'Upper/Lower', 'PPL', etc.
  description text null,
  constraint workout_templates_pkey primary key (id)
);

-- Create Workout Template Days table
create table public.workout_template_days (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  template_id uuid not null,
  name text not null,
  day_order integer not null,
  constraint workout_template_days_pkey primary key (id),
  constraint workout_template_days_template_id_fkey foreign key (template_id) references workout_templates (id) on delete cascade
);

-- Create Workout Template Exercises table
create table public.workout_template_exercises (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  template_day_id uuid not null,
  exercise_name text not null,
  sets integer not null default 3,
  reps text not null default '10-12',
  rest_time text null,
  notes text null,
  exercise_order integer not null,
  constraint workout_template_exercises_pkey primary key (id),
  constraint workout_template_exercises_day_id_fkey foreign key (template_day_id) references workout_template_days (id) on delete cascade
);

-- Enable RLS
alter table public.workout_templates enable row level security;
alter table public.workout_template_days enable row level security;
alter table public.workout_template_exercises enable row level security;

-- Create policies (Read-only for most users, but we'll allow all for now for simplicity in this single-tenant-ish app)
create policy "Enable read access for all users" on public.workout_templates for select using (true);
create policy "Enable read access for all users" on public.workout_template_days for select using (true);
create policy "Enable read access for all users" on public.workout_template_exercises for select using (true);

-- Insert Initial Data (Templates)

-- 1. Beginner Full Body (3 Days)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Iniciante - Corpo Inteiro (3x)', 'Hipertrofia', 'Iniciante', 'Full Body', 'Treino ideal para quem está começando. Trabalha o corpo todo 3 vezes na semana.')
  RETURNING id INTO v_template_id;

  -- Day A
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino A', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Agachamento Livre (Back Squat)', 3, '12-15', '60s', 1),
  (v_day_id, 'Supino Reto (Barra/Halteres/Smith)', 3, '12-15', '60s', 2),
  (v_day_id, 'Puxada Alta (Polia) Frente', 3, '12-15', '60s', 3),
  (v_day_id, 'Desenvolvimento com Halteres (Sentado)', 3, '12-15', '60s', 4),
  (v_day_id, 'Rosca Direta (Barra Reta/W)', 3, '12-15', '60s', 5),
  (v_day_id, 'Tríceps Pulley (Polia)', 3, '12-15', '60s', 6),
  (v_day_id, 'Prancha (Plank)', 3, '30-45s', '60s', 7);

  -- Day B
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino B', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Leg Press 45º', 3, '12-15', '60s', 1),
  (v_day_id, 'Flexão Clássica', 3, 'Max', '60s', 2),
  (v_day_id, 'Remada Baixa (Triângulo/Cabo)', 3, '12-15', '60s', 3),
  (v_day_id, 'Elevação Lateral (Halteres)', 3, '12-15', '60s', 4),
  (v_day_id, 'Rosca Martelo (Hammer Curl)', 3, '12-15', '60s', 5),
  (v_day_id, 'Mergulho no Banco', 3, '12-15', '60s', 6),
  (v_day_id, 'Crunch (Supra)', 3, '15-20', '60s', 7);
  
   -- Day C (Repeat A or Variation)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino C', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Levantamento Terra Romeno (RDL)', 3, '12-15', '60s', 1),
  (v_day_id, 'Supino Inclinado (Barra/Halteres/Smith)', 3, '12-15', '60s', 2),
  (v_day_id, 'Remada Curvada (Barra - Pronada)', 3, '12-15', '60s', 3),
  (v_day_id, 'Elevação Frontal (Halter/Barra/Corda)', 3, '12-15', '60s', 4),
  (v_day_id, 'Rosca Alternada (Halteres)', 3, '12-15', '60s', 5),
  (v_day_id, 'Tríceps Testa (Skullcrusher)', 3, '12-15', '60s', 6),
  (v_day_id, 'Abdominal Bicicleta', 3, '20', '60s', 7);
END $$;

-- 2. Intermediate Upper/Lower (4 Days)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Intermediário - Upper/Lower (4x)', 'Hipertrofia/Força', 'Intermediário', 'Upper/Lower', 'Divisão clássica para ganho de massa e força. 2 dias de superiores e 2 de inferiores.')
  RETURNING id INTO v_template_id;

  -- Upper A
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Upper A (Foco Força)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Reto (Barra/Halteres/Smith)', 4, '6-8', '90s', 1),
  (v_day_id, 'Remada Curvada (Barra - Pronada)', 4, '6-8', '90s', 2),
  (v_day_id, 'Desenvolvimento Militar (OHP)', 3, '8-10', '90s', 3),
  (v_day_id, 'Barra Fixa (Pronada/Aberta)', 3, 'Falha', '90s', 4),
  (v_day_id, 'Supino Fechado', 3, '10-12', '60s', 5),
  (v_day_id, 'Rosca Direta (Barra Reta/W)', 3, '10-12', '60s', 6);

  -- Lower A
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Lower A (Foco Agachamento)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Agachamento Livre (Back Squat)', 4, '6-8', '120s', 1),
  (v_day_id, 'Leg Press 45º', 3, '10-12', '90s', 2),
  (v_day_id, 'Cadeira Extensora', 3, '12-15', '60s', 3),
  (v_day_id, 'Mesa Flexora (Deitado)', 3, '12-15', '60s', 4),
  (v_day_id, 'Gêmeos em Pé (Máquina/Smith)', 4, '15-20', '60s', 5),
  (v_day_id, 'Prancha (Plank)', 3, '60s', '60s', 6);

  -- Upper B
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Upper B (Foco Hipertrofia)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Inclinado (Barra/Halteres/Smith)', 3, '8-12', '60s', 1),
  (v_day_id, 'Puxada Alta (Polia) Frente', 3, '8-12', '60s', 2),
  (v_day_id, 'Crucifixo Reto (Halteres)', 3, '10-15', '60s', 3),
  (v_day_id, 'Remada Baixa (Triângulo/Cabo)', 3, '10-15', '60s', 4),
  (v_day_id, 'Elevação Lateral (Halteres)', 4, '12-15', '45s', 5),
  (v_day_id, 'Tríceps Corda', 3, '12-15', '45s', 6),
  (v_day_id, 'Rosca Scott (Banco)', 3, '12-15', '45s', 7);

  -- Lower B
   INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Lower B (Foco Posterior)', 4) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Levantamento Terra (Deadlift)', 3, '5-8', '120s', 1),
  (v_day_id, 'Agachamento Búlgaro', 3, '8-12', '90s', 2),
  (v_day_id, 'Cadeira Flexora (Sentado)', 3, '12-15', '60s', 3),
  (v_day_id, 'Cadeira Extensora', 3, '15-20', '60s', 4),
  (v_day_id, 'Gêmeos Sentado (Máquina)', 4, '15-20', '60s', 5),
  (v_day_id, 'Elevação de Pernas (Hanging Leg Raise)', 3, '15', '60s', 6);
END $$;

-- 3. Advanced PPL (6 Days)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Avançado - PPL (6x)', 'Hipertrofia', 'Avançado', 'PPL', 'Push/Pull/Legs de alta frequência. Ideal para atletas avançados com boa recuperação.')
  RETURNING id INTO v_template_id;

  -- Push A
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Push A (Peito/Ombro/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Reto (Barra/Halteres/Smith)', 4, '6-8', '90s', 1),
  (v_day_id, 'Desenvolvimento Militar (OHP)', 3, '8-10', '90s', 2),
  (v_day_id, 'Supino Inclinado (Barra/Halteres/Smith)', 3, '10-12', '60s', 3),
  (v_day_id, 'Elevação Lateral (Halteres)', 4, '15', '45s', 4),
  (v_day_id, 'Tríceps Testa (Skullcrusher)', 3, '10-12', '60s', 5),
  (v_day_id, 'Tríceps Pulley (Polia)', 3, '12-15', '45s', 6);

  -- Pull A
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Pull A (Costas/Bíceps)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Levantamento Terra (Deadlift)', 3, '5', '120s', 1),
  (v_day_id, 'Puxada Alta (Polia) Frente', 3, '8-10', '90s', 2),
  (v_day_id, 'Remada Cavalinho (T-Bar Row)', 3, '10-12', '60s', 3),
  (v_day_id, 'Face Pull (Corda)', 3, '15', '45s', 4),
  (v_day_id, 'Rosca Direta (Barra Reta/W)', 3, '10-12', '60s', 5),
  (v_day_id, 'Rosca Martelo (Hammer Curl)', 3, '12-15', '45s', 6);

  -- Legs A
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Legs A (Foco Quadríceps)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Agachamento Livre (Back Squat)', 4, '6-8', '120s', 1),
  (v_day_id, 'Leg Press 45º', 3, '10-12', '90s', 2),
  (v_day_id, 'Passada / Avanço (Walking Lunge)', 3, '12 passos', '60s', 3),
  (v_day_id, 'Cadeira Extensora', 3, '15-20', '45s', 4),
  (v_day_id, 'Gêmeos em Pé (Máquina/Smith)', 4, '15', '45s', 5);

  -- Push B
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Push B (Foco Hipertrofia)', 4) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Inclinado (Barra/Halteres/Smith)', 4, '8-10', '90s', 1),
  (v_day_id, 'Mergulho nas Paralelas (Dips)', 3, 'Falha', '60s', 2),
  (v_day_id, 'Crucifixo Reto (Halteres)', 3, '12-15', '60s', 3),
  (v_day_id, 'Desenvolvimento Arnold', 3, '10-12', '60s', 4),
  (v_day_id, 'Elevação Lateral na Polia (Cabo)', 3, '15-20', '45s', 5),
  (v_day_id, 'Tríceps Francês', 3, '12-15', '45s', 6);

  -- Pull B
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Pull B (Foco Largura)', 5) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Barra Fixa (Pronada/Aberta)', 4, 'Falha', '90s', 1),
  (v_day_id, 'Remada Curvada (Barra - Supinada/Yates Row)', 3, '8-10', '90s', 2),
  (v_day_id, 'Pulldown Articulado (Máquina)', 3, '10-12', '60s', 3),
  (v_day_id, 'Crucifixo Inverso (Halteres)', 3, '15', '45s', 4),
  (v_day_id, 'Rosca Scott (Banco)', 3, '10-12', '60s', 5),
  (v_day_id, 'Rosca Inversa (Barra)', 3, '12-15', '45s', 6);

  -- Legs B
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Legs B (Foco Posterior)', 6) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Levantamento Terra Romeno (RDL)', 4, '8-10', '90s', 1),
  (v_day_id, 'Hack Machine', 3, '10-12', '90s', 2),
  (v_day_id, 'Mesa Flexora (Deitado)', 3, '12-15', '60s', 3),
  (v_day_id, 'Cadeira Flexora (Sentado)', 3, '15-20', '45s', 4),
  (v_day_id, 'Gêmeos Sentado (Máquina)', 4, '15-20', '45s', 5);
END $$;

-- 4. Strength Periodization 2023 (Based on Image)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Periodização Força 2023 (Específico)', 'Força', 'Avançado', 'Personalizado', 'Treino de força baseado em periodização específica. Foco em cargas altas e descanso controlado.')
  RETURNING id INTO v_template_id;

  -- Quinta (Upper Strength)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Quinta - Força Superior', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Reto (Barra/Halteres/Smith)', 5, '5', '35s', 1), -- Note: Image says "Supino reto com elástico", mapped to closest standard
  (v_day_id, 'Supino Inclinado (Barra/Halteres/Smith)', 4, '6', '35s', 2),
  (v_day_id, 'Mergulho nas Paralelas (Dips)', 4, '12', '35s', 3),
  (v_day_id, 'Flexão Clássica', 4, '15', '35s', 4),
  (v_day_id, 'Tríceps Pulley (Polia)', 5, '6', '35s', 5),
  (v_day_id, 'Tríceps Francês', 4, '6', '35s', 6),
  (v_day_id, 'Mergulho nas Paralelas (Dips)', 4, '30', '35s', 7), -- "Infra paralela" mapped to Dips or Leg Raise? "Infra paralela" usually means hanging leg raise on parallel bars. Let's assume Leg Raise.
  (v_day_id, 'Esteira', 3, '3 min', '0s', 8); -- "1 min andando 2 min correndo repetir 3x"

  -- Sexta (Back/Deadlift Strength)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Sexta - Força Costas/Terra', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Barra Fixa (Pronada/Aberta)', 5, '5', '35s', 1),
  (v_day_id, 'Barra Fixa (Neutra)', 4, '5+20s iso', '35s', 2),
  (v_day_id, 'Remada Baixa (Triângulo/Cabo)', 5, '6', '35s', 3), -- "Remada sentado"
  (v_day_id, 'Levantamento Terra Sumô', 5, '8', '35s', 4),
  (v_day_id, 'Rosca Direta (Barra Reta/W)', 5, '6', '35s', 5),
  (v_day_id, 'Rosca Alternada (Halteres)', 5, '8', '35s', 6),
  (v_day_id, 'Hiperextensão Lombar (Banco Romano)', 4, '30', '35s', 7);

  -- Sabado (Circuit)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Sábado - Circuito Killer', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Burpee', 1, 'Circuito', '0s', 1); -- Placeholder for "Circuito na Killer"
END $$;

-- 5. Hipertrofia ABC - Intermediário (Ficha 1)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Hipertrofia ABC - Intermediário', 'Hipertrofia', 'Intermediário', 'ABC', 'Divisão ABC clássica. A: Peito/Tríceps, B: Costas/Bíceps, C: Ombros/Pernas.')
  RETURNING id INTO v_template_id;

  -- Treino A (Peito/Tríceps/Abdômen)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino A (Peito/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Reto (Halteres)', 3, '12-15', '60s', 1),
  (v_day_id, 'Supino Inclinado (Halteres)', 3, '10', '60s', 2),
  (v_day_id, 'Voador / Peck Deck', 3, '15', '60s', 3),
  (v_day_id, 'Tríceps Pulley (Barra Reta)', 3, '12', '60s', 4),
  (v_day_id, 'Tríceps Francês (Halter)', 3, '15', '60s', 5),
  (v_day_id, 'Abdominal Supra (Solo)', 3, '20', '60s', 6);

  -- Treino B (Costas/Bíceps/Abdômen)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino B (Costas/Bíceps)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Puxada Alta (Polia) Frente', 3, '10-12', '60s', 1),
  (v_day_id, 'Remada Unilateral (Serrote)', 3, '15', '60s', 2),
  (v_day_id, 'Remada Baixa (Triângulo)', 3, '10-12', '60s', 3),
  (v_day_id, 'Rosca Direta (Halteres)', 3, '15', '60s', 4),
  (v_day_id, 'Rosca Scott (Barra W)', 3, '12', '60s', 5),
  (v_day_id, 'Abdominal Infra (Solo)', 3, '15', '60s', 6);

  -- Treino C (Ombro/Pernas)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino C (Ombro/Pernas)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Elevação Lateral (Halteres)', 3, '12', '60s', 1),
  (v_day_id, 'Desenvolvimento Máquina', 3, '10', '60s', 2),
  (v_day_id, 'Elevação Frontal', 3, '15', '60s', 3),
  (v_day_id, 'Cadeira Extensora', 3, '12', '60s', 4),
  (v_day_id, 'Cadeira Abdutora', 3, '10', '60s', 5),
  (v_day_id, 'Agachamento (Smith)', 3, '12', '90s', 6);
END $$;

-- 6. Hipertrofia ABC - Avançado (Volume Alto)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Hipertrofia ABC - Avançado (Volume)', 'Hipertrofia', 'Avançado', 'ABC', 'Treino com maior volume de séries e exercícios. Foco em detalhamento muscular.')
  RETURNING id INTO v_template_id;

  -- Treino A (Peito/Tríceps)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino A (Peito/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Inclinado (Barra/Halteres/Smith)', 4, '10-12', '60s', 1),
  (v_day_id, 'Crucifixo Reto (Halteres)', 3, '10-12', '60s', 2),
  (v_day_id, 'Supino Reto (Barra)', 3, '10-12', '60s', 3),
  (v_day_id, 'Voador / Peck Deck', 3, '10-12', '60s', 4),
  (v_day_id, 'Tríceps Francês (Deitado c/ Halter)', 3, '10-12', '60s', 5),
  (v_day_id, 'Tríceps Corda', 4, '10-12', '60s', 6),
  (v_day_id, 'Tríceps Pulley (Barra Reta)', 3, '10-12', '60s', 7),
  (v_day_id, 'Tríceps Testa (Barra)', 4, '10-12', '60s', 8);

  -- Treino B (Costas/Bíceps/Antebraço)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino B (Costas/Bíceps)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Levantamento Terra', 3, '10-12', '120s', 1),
  (v_day_id, 'Puxada Alta (Polia) Frente', 3, '10-12', '60s', 2),
  (v_day_id, 'Puxada Alta (Polia) Atrás', 4, '10-12', '60s', 3),
  (v_day_id, 'Remada Aberta (Polia)', 4, '10-12', '60s', 4),
  (v_day_id, 'Remada Unilateral (Serrote)', 4, '10-12', '60s', 5),
  (v_day_id, 'Rosca Alternada (Banco Inclinado)', 4, '10-12', '60s', 6),
  (v_day_id, 'Rosca Scott (Barra W)', 4, '10-12', '60s', 7),
  (v_day_id, 'Rosca Direta (Barra)', 3, '10-12', '60s', 8),
  (v_day_id, 'Rosca Martelo', 4, '10-12', '60s', 9),
  (v_day_id, 'Rosca Punho (Antebraço)', 4, '10-12', '60s', 10);

  -- Treino C (Pernas/Ombros - Sugerido)
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino C (Pernas/Ombros)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Desenvolvimento Militar (Halteres)', 4, '10-12', '60s', 1),
  (v_day_id, 'Elevação Lateral (Cabo/Halter)', 4, '12-15', '60s', 2),
  (v_day_id, 'Agachamento Livre', 4, '10-12', '120s', 3),
  (v_day_id, 'Leg Press 45º', 4, '10-12', '90s', 4),
  (v_day_id, 'Cadeira Extensora', 4, '12-15', '60s', 5),
  (v_day_id, 'Mesa Flexora', 4, '12-15', '60s', 6),
  (v_day_id, 'Gêmeos em Pé', 4, '15-20', '60s', 7);
END $$;

-- 7. Tecnofit - Variações Completas (5 Dias)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Avançado - Variações Completas', 'Geral', 'Avançado', 'Personalizado', 'Compilado de treinos variados. Inclui variações de pernas, superiores e focos específicos.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Pernas/Tríceps/Ombro) - Image 1
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Pernas/Tríceps/Ombro)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Subida no Banco (Box Uni)', 4, '10', '60s', 1),
  (v_day_id, 'Agachamento Máquina', 4, '12', '90s', 2),
  (v_day_id, 'Leg Press 45º', 4, '12', '90s', 3), -- Note: + Panturrilha 4x12
  (v_day_id, 'Cadeira Extensora', 4, '12', '60s', 4),
  (v_day_id, 'Cadeira Extensora (Unilateral)', 4, '8', '60s', 5),
  (v_day_id, 'Afundo (Halteres)', 4, '10', '60s', 6),
  (v_day_id, 'Tríceps Corda', 4, '12', '45s', 7),
  (v_day_id, 'Mergulho no Banco', 4, '12', '45s', 8),
  (v_day_id, 'Elevação Lateral (+ Adução)', 4, '12', '45s', 9);

  -- Treino 2A (Costas/Bíceps/Antebraço) - Image 3
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2A (Costas/Bíceps)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Levantamento Terra', 3, '10-12', '120s', 1),
  (v_day_id, 'Puxada Alta (Polia) Frente', 3, '10-12', '60s', 2),
  (v_day_id, 'Puxada Alta (Polia) Atrás', 4, '10-12', '60s', 3),
  (v_day_id, 'Remada Aberta (Polia)', 4, '10-12', '60s', 4),
  (v_day_id, 'Remada Unilateral (Serrote)', 4, '10-12', '60s', 5),
  (v_day_id, 'Rosca Alternada (Banco Inclinado)', 4, '10-12', '60s', 6),
  (v_day_id, 'Rosca Scott (Barra W)', 4, '10-12', '60s', 7),
  (v_day_id, 'Rosca Direta', 3, '10-12', '60s', 8),
  (v_day_id, 'Rosca Martelo', 4, '10-12', '60s', 9),
  (v_day_id, 'Rosca Punho', 4, '10-12', '45s', 10);

  -- Treino 2B (Misto/Full Body) - Image 2
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2B (Misto/Full Body)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Mesa Flexora', 3, '12', '60s', 1),
  (v_day_id, 'Stiff', 4, '12', '90s', 2),
  (v_day_id, 'Cadeira Abdutora', 4, '12', '60s', 3),
  (v_day_id, 'Agachamento Sumô', 4, '12', '90s', 4),
  (v_day_id, 'Glúteo no Cabo (Coice)', 4, '12', '60s', 5),
  (v_day_id, 'Rosca Martelo', 3, '12-15', '45s', 6),
  (v_day_id, 'Puxada Alta (Polia) Frente', 4, '10+10', '60s', 7), -- Drop-set implied?
  (v_day_id, 'Voador / Peck Deck', 3, '15', '60s', 8),
  (v_day_id, 'Supino Máquina', 3, '10-12', '60s', 9),
  (v_day_id, 'Tríceps Máquina', 3, '12', '45s', 10),
  (v_day_id, 'Tríceps Corda', 3, '12', '45s', 11),
  (v_day_id, 'Hiperextensão Lombar (Solo)', 3, '15', '45s', 12),
  (v_day_id, 'Abdominal Infra (Solo)', 3, '20', '45s', 13),
  (v_day_id, 'Esteira', 1, '15 min', '0s', 14);

  -- Treino 3 (Ombro/Glúteo) - Image 4
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 3 (Ombro/Glúteo)', 4) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Desenvolvimento com Halteres', 3, '12', '60s', 1),
  (v_day_id, 'Crucifixo Inverso (Voador)', 3, '15', '60s', 2),
  (v_day_id, 'Elevação Pélvica', 3, '12', '90s', 3),
  (v_day_id, 'Cadeira Abdutora', 3, '15', '60s', 4),
  (v_day_id, 'Panturrilha Livre', 3, '20', '45s', 5),
  (v_day_id, 'Esteira/Bike', 1, '15 min', '0s', 6);

  -- Treino 4 (Ombro/Trapézio) - Image 0
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 4 (Ombro/Trapézio)', 5) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Desenvolvimento com Halteres', 4, '10-12', '60s', 1),
  (v_day_id, 'Desenvolvimento Máquina', 3, '10-12', '60s', 2),
  (v_day_id, 'Elevação Frontal (Halter)', 3, '10-12', '60s', 3),
  (v_day_id, 'Elevação Lateral (Sentado)', 4, '10-12', '60s', 4),
  (v_day_id, 'Encolhimento (Halteres)', 4, '10-12', '45s', 5),
  (v_day_id, 'Encolhimento (Barra)', 4, '10-12', '45s', 6);
END $$;

-- 8. Tecnofit - Ficha 2 (ABC - Pirâmide/Bi-set)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Intermediário - Ficha 2 (ABC)', 'Hipertrofia', 'Intermediário', 'ABC', 'Treino ABC com técnicas de intensidade (Pirâmide, Bi-set, Drop-set). Foco em Peito/Tríceps, Pernas, Costas/Bíceps.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Peito/Tríceps/Abd) - Image 2
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Peito/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Cross Over Polia Alta', 3, '15-12-10', '60s', 1),
  (v_day_id, 'Supino Máquina', 3, '15-12-10', '60s', 2),
  (v_day_id, 'Voador', 3, '15-12-10', '60s', 3),
  (v_day_id, 'Tríceps Francês (Halter)', 3, '12-15', '60s', 4),
  (v_day_id, 'Tríceps Inverso Cross (Barra Reta)', 3, '15-12-10', '60s', 5),
  (v_day_id, 'Tríceps Corda', 3, '15-12-10', '60s', 6),
  (v_day_id, 'Abdominal Supra (Bola)', 5, '20', '45s', 7);

  -- Treino 2 (Pernas) - Image 3
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Pernas)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Agachamento Smith (Bi-set: Carga + Corporal)', 4, '12+12', '90s', 1),
  (v_day_id, 'Cadeira Abdutora (Drop-set: Pesado + Leve)', 4, '12+12', '60s', 2),
  (v_day_id, 'Stiff', 4, '10', '90s', 3),
  (v_day_id, 'Cadeira Extensora (Unilateral)', 4, '10', '60s', 4),
  (v_day_id, 'Cadeira Adutora (Bi-set: Adutor + Sumô)', 4, '12+12', '60s', 5);

  -- Treino 3 (Costas/Bíceps/Lombar) - Image 4
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 3 (Costas/Bíceps)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Rosca Cross (Corda)', 4, '10', '60s', 1),
  (v_day_id, 'Rosca Martelo', 4, '10', '60s', 2),
  (v_day_id, 'Remada Baixa (Triângulo)', 3, '15-12-10', '60s', 3),
  (v_day_id, 'Pull Down Cross', 3, '15-12-10', '60s', 4),
  (v_day_id, 'Puxada Alta (Corda/Cross)', 4, '10', '60s', 5),
  (v_day_id, 'Hiperextensão Lombar (Banco Romano)', 4, '15-20', '60s', 6);
END $$;

-- 9. Tecnofit - Ficha 3 (Misto/Adaptativo)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Intermediário - Ficha 3 (Misto)', 'Geral', 'Iniciante/Intermediário', 'Misto', 'Treino misto combinando grupos musculares. Ideal para frequência menor ou adaptação.')
  RETURNING id INTO v_template_id;

  -- Treino 2 (Misto Inferior/Superior) - Image 0
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Misto)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Cadeira Abdutora', 3, '15', '60s', 1),
  (v_day_id, 'Cadeira Flexora', 3, '12', '60s', 2),
  (v_day_id, 'Voador', 3, '15', '60s', 3),
  (v_day_id, 'Supino Máquina', 3, '10-12', '60s', 4),
  (v_day_id, 'Tríceps Máquina', 3, '12', '60s', 5),
  (v_day_id, 'Tríceps Corda', 3, '12', '60s', 6),
  (v_day_id, 'Lombar Solo', 3, '15', '45s', 7),
  (v_day_id, 'Abdominal Infra (Solo)', 3, '20', '45s', 8),
  (v_day_id, 'Esteira', 3, '15 min', '0s', 9);

  -- Treino 3 (Ombro/Glúteo) - Image 1
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 3 (Ombro/Glúteo)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Desenvolvimento com Halteres', 3, '12', '60s', 1),
  (v_day_id, 'Crucifixo Inverso (Voador)', 3, '15', '60s', 2),
  (v_day_id, 'Elevação Pélvica', 3, '12', '60s', 3),
  (v_day_id, 'Cadeira Abdutora', 3, '15', '60s', 4),
  (v_day_id, 'Panturrilha Livre', 3, '20', '45s', 5),
  (v_day_id, 'Aeróbico (Esteira/Bike/Elíptico)', 1, '15 min', '0s', 6);
END $$;

-- 10. Tecnofit - Ficha 4 (ABCDE - Avançado)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Avançado - Ficha 4 (ABCDE)', 'Hipertrofia/Definição', 'Avançado', 'ABCDE', 'Divisão de 5 dias com foco específico por grupo muscular. Alta intensidade e volume.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Pernas/Tríceps/Aeróbico) - Image 0
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Pernas/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Agachamento Smith (+ Recuo)', 4, '10', '60s', 1),
  (v_day_id, 'Cadeira Extensora (+ Bilateral)', 4, '12+12', '60s', 2),
  (v_day_id, 'Mesa Flexora (+ Bilateral)', 4, '12+12', '60s', 3),
  (v_day_id, 'Tríceps Banco (Testa 4x RM)', 4, '12', '60s', 4),
  (v_day_id, 'Tríceps Inverso Cross (+ Drop)', 4, '8', '60s', 5),
  (v_day_id, 'Esteira', 1, '20-30 min', '0s', 6);

  -- Treino 2 (Costas/Abdômen) - Image 1
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Costas/Abdômen)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Pull Down Cross (+ Drop)', 4, '10', '60s', 1),
  (v_day_id, 'Pulley Puxada Frente (+ Fechada Supinada)', 4, '10', '60s', 2),
  (v_day_id, 'Remada Curvada (Aberta Pronada + Fechada Cross)', 4, '10', '60s', 3),
  (v_day_id, 'Abdominal Canivete (RM)', 4, 'Falha', '45s', 4), -- "RM" usually means Repetição Máxima/Falha or a specific count not shown clearly. Assuming Falha/Max.
  (v_day_id, 'Abdominal Canivete (RM)', 4, 'Falha', '45s', 5); -- Duplicate in image?

  -- Treino 3 (Glúteo/Bíceps) - Image 2
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 3 (Glúteo/Bíceps)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Glúteos Box Uni (10 ao 1)', 1, '10-1', '0s', 1), -- Ladder set?
  (v_day_id, 'Glúteo Coice Máquina', 4, '10/10/8/8', '60s', 2),
  (v_day_id, 'Glúteo Coice Cross', 4, '10/10/8/8', '60s', 3),
  (v_day_id, 'Elevação Pélvica', 4, '10/10/8/8', '60s', 4),
  (v_day_id, 'Rosca Cross (+ Martelo Halter)', 4, '10', '60s', 5),
  (v_day_id, 'Rosca 21 (Barra Reta)', 3, '7+7+7', '60s', 6);

  -- Treino 4 (Pernas/Ombro) - Image 3
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 4 (Pernas/Ombro)', 4) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Agachamento Livre (+ Iso 1min)', 4, '10/10/8/8', '90s', 1),
  (v_day_id, 'Leg Press Horizontal (Uni + Bilateral)', 4, '10', '90s', 2),
  (v_day_id, 'Agachamento Máquina (RM)', 4, '1', '90s', 3), -- "4x1" usually implies heavy single or RM test? Or maybe 1 min? Image says "4 x 1". Let's assume heavy or typo.
  (v_day_id, 'Desenvolvimento Arnold', 4, '10/10/8/8', '60s', 4),
  (v_day_id, 'Remada Alta Fechada Cross', 4, '10-10-8-8', '60s', 5);

  -- Treino 5 (Peitoral/Abdômen) - Image 4
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 5 (Peitoral/Abdômen)', 5) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Cross Over Polia Alta', 4, '10+10', '60s', 1),
  (v_day_id, 'Supino Máquina (RM)', 4, '1', '60s', 2), -- Again "4 x 1".
  (v_day_id, 'Abdominal Infra Bola', 5, '20', '45s', 3),
  (v_day_id, 'Abdominal Supra Banco Declinado', 5, '20', '45s', 4);
END $$;

-- 11. Tecnofit - Ficha 5 (ABC - Adaptativo/Frequência)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Iniciante - Ficha 5 (ABC)', 'Adaptação/Geral', 'Iniciante/Intermediário', 'ABC', 'Treino ABC com alta frequência de estímulos (Ombros/Manguito frequentes). Ideal para condicionamento.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Peito/Tríceps/Ombro) - Image 0
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Peito/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Manguito Cross (Aquecimento)', 3, '10', '0s', 1),
  (v_day_id, 'Supino Máquina', 3, '12-15', '60s', 2),
  (v_day_id, 'Supino Reto Barra', 3, '12-15', '60s', 3),
  (v_day_id, 'Crucifixo Inclinado', 3, '12-15', '60s', 4),
  (v_day_id, 'Voador', 3, '12-15', '60s', 5),
  (v_day_id, 'Tríceps Cross Barra Reta', 3, '12-15', '60s', 6),
  (v_day_id, 'Tríceps Corda', 3, '12-15', '60s', 7),
  (v_day_id, 'Aeróbico (Esteira/Bike/Escada)', 1, '15 min', '0s', 8);

  -- Treino 2 (Costas/Bíceps/Trapézio) - Image 1
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Costas/Bíceps)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Manguito Cross (Uni + Bilateral)', 3, '10-12', '0s', 1),
  (v_day_id, 'Pulley Puxada Frente', 3, '12-15', '60s', 2),
  (v_day_id, 'Pulley Remada Triângulo', 3, '12-15', '60s', 3),
  (v_day_id, 'Crucifixo Inverso', 3, '12-15', '60s', 4),
  (v_day_id, 'Pull Down Cross', 3, '12-15', '60s', 5),
  (v_day_id, 'Encolhimento Halteres', 4, '12-15', '45s', 6),
  (v_day_id, 'Rosca Direta', 3, '12-15', '60s', 7),
  (v_day_id, 'Rosca Martelo', 3, '12-15', '60s', 8),
  (v_day_id, 'Infra Prancha', 3, 'Falha', '45s', 9);

  -- Treino 3 (Pernas/Ombro) - Image 2
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 3 (Pernas/Ombro)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Aeróbico (Aquecimento)', 1, '10 min', '0s', 1),
  (v_day_id, 'Agachamento Máquina', 3, '12-15', '90s', 2),
  (v_day_id, 'Passada', 3, '10-12', '60s', 3),
  (v_day_id, 'Cadeira Extensora', 3, '12-15', '60s', 4),
  (v_day_id, 'Cadeira Abdutora', 3, '12-15', '60s', 5),
  (v_day_id, 'Cadeira Flexora', 3, '12-15', '60s', 6),
  (v_day_id, 'Panturrilha em Pé Máquina', 3, '15-20', '45s', 7),
  (v_day_id, 'Elevação Lateral (Halter)', 3, '12-15', '60s', 8),
  (v_day_id, 'Elevação Frontal', 3, '12-15', '60s', 9),
  (v_day_id, 'Desenvolvimento Máquina', 3, '12-15', '60s', 10),
  (v_day_id, 'Abdominal Supra Solo', 3, '12-15', '45s', 11);
END $$;

-- 12. Tecnofit - Ficha 6 (AB - Upper Bi-sets)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Avançado - Ficha 6 (AB Upper)', 'Hipertrofia', 'Avançado', 'AB', 'Treino focado em superiores com uso intensivo de Bi-sets e Combinados.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Peito/Tríceps) - Image 3
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Peito/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Declinado (Barra)', 4, '8', '90s', 1),
  (v_day_id, 'Supino Inclinado Halter', 4, '8', '90s', 2),
  (v_day_id, 'Voador (+ Crucifixo Reto)', 3, '12+12', '60s', 3), -- Bi-set
  (v_day_id, 'Cross Over Polia Alta', 4, '8', '60s', 4),
  (v_day_id, 'Paralela Fechada', 4, '8', '90s', 5),
  (v_day_id, 'Tríceps Testa Halteres', 4, '10', '60s', 6),
  (v_day_id, 'Tríceps Corda (+ Francês Sentado)', 3, '12+12', '60s', 7); -- Bi-set

  -- Treino 2 (Costas/Bíceps) - Image 4
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Costas/Bíceps)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Pulley Puxada Frente (Aberta)', 4, '8', '60s', 1),
  (v_day_id, 'Remada Curvada (Barra)', 4, '8', '60s', 2),
  (v_day_id, 'Pulley Puxada Frente (Fechada Supinada)', 4, '10', '60s', 3),
  (v_day_id, 'Cavalinho (+ Pull Over)', 3, '12+12', '60s', 4), -- Bi-set inferred
  (v_day_id, 'Rosca Direta (Barra W)', 4, '8', '60s', 5),
  (v_day_id, 'Rosca Scott (Halteres)', 4, '10', '60s', 6),
  (v_day_id, 'Rosca Martelo (+ Inversa)', 3, '12+12', '60s', 7), -- Bi-set
  (v_day_id, 'Prancha Iso Lateral', 4, '60s', '45s', 8);
END $$;

-- 13. Tecnofit - Ficha 7 (ABCD - Força/Hipertrofia)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Avançado - Ficha 7 (ABCD)', 'Força/Hipertrofia', 'Avançado', 'ABCD', 'Treino com foco em cargas mais altas (4x8) e exercícios compostos (Terra, Agachamento). Nota: Dia 3 (Peito/Tríceps) não listado nas imagens, sugerido descanso ou inserir manualmente.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Costas/Bíceps) - Image 0
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Costas/Bíceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Pulley Puxada Frente (Aberta)', 4, '8', '90s', 1),
  (v_day_id, 'Remada Curvada (Barra)', 4, '8', '90s', 2),
  (v_day_id, 'Pulley Puxada Frente (Fechada)', 4, '10', '60s', 3),
  (v_day_id, 'Cavalinho (Landmine)', 3, '12', '60s', 4),
  (v_day_id, 'Pull Over (Halter/Corda)', 3, '12', '60s', 5), -- Bi-set with Cavalinho
  (v_day_id, 'Cross Over (Polia Alta)', 3, '12', '60s', 6), -- Listed in image, possibly specific focus
  (v_day_id, 'Rosca Direta (Barra W)', 4, '8', '60s', 7),
  (v_day_id, 'Rosca Scott (Halteres)', 4, '10', '60s', 8),
  (v_day_id, 'Rosca Martelo (+ Inversa)', 3, '12+12', '60s', 9), -- Bi-set
  (v_day_id, 'Prancha Iso Lateral', 4, '60s', '45s', 10);

  -- Treino 2 (Ombros/Trapézio) - Image 1
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Ombros/Trapézio)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Desenvolvimento Barra (Sentado)', 4, '8', '90s', 1),
  (v_day_id, 'Remada Alta (Barra)', 4, '8', '90s', 2),
  (v_day_id, 'Elevação Lateral (Halteres)', 4, '10', '60s', 3),
  (v_day_id, 'Elevação Frontal (Corda + Halter)', 3, '12+12', '60s', 4), -- Bi-set
  (v_day_id, 'Crucifixo Inverso (+ Elevação Post.)', 3, '12+12', '60s', 5), -- Bi-set
  (v_day_id, 'Encolhimento Halteres (Drop na 4ª)', 4, '12+', '45s', 6);

  -- Treino 4 (Pernas/Terra) - Image 2
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 4 (Pernas/Terra)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Agachamento Livre (Barra Alta)', 4, '8', '120s', 1),
  (v_day_id, 'Levantamento Terra', 4, '8', '120s', 2),
  (v_day_id, 'Leg Press 45º', 4, '10', '90s', 3),
  (v_day_id, 'Cadeira Extensora (Drop na 3ª)', 3, '12+', '60s', 4),
  (v_day_id, 'Mesa Flexora (Drop na 3ª)', 3, '12+', '60s', 5),
  (v_day_id, 'Panturrilha Sentada', 4, '12', '45s', 6),
  (v_day_id, 'Panturrilha em Pé', 4, '12', '45s', 7),
  (v_day_id, 'Prancha Iso Ventral (+ Infra)', 4, '60s', '45s', 8);
END $$;

-- 14. Tecnofit - Ficha 8 (AB - Upper/Lower)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Intermediário - Ficha 8 (AB Upper/Lower)', 'Hipertrofia', 'Intermediário', 'AB', 'Divisão Superior/Inferior. Foco em membros inferiores no Treino 1 e superiores misto no Treino 2.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Inferior) - Image 3
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Inferior)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Leg Press 45º (Unilateral)', 4, '8', '60s', 1),
  (v_day_id, 'Leg Press 45º (Bilateral)', 4, '12-15', '90s', 2),
  (v_day_id, 'Cadeira Extensora (Pirâmide)', 4, '15/12/10/8', '60s', 3),
  (v_day_id, 'Agachamento Búlgaro', 4, '12', '60s', 4),
  (v_day_id, 'Cadeira Adutora (+ Sumô)', 4, '15+15', '60s', 5),
  (v_day_id, 'Panturrilha Máquina', 4, '15-20', '45s', 6),
  (v_day_id, 'Abdominal Infra Paralela', 5, '20', '45s', 7);

  -- Treino 2 (Superior Misto) - Image 4
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Superior Misto)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Pulley Puxada Frente (Aberta+Fechada)', 4, '10+10', '60s', 1),
  (v_day_id, 'Remada Alta (Cross/Cabo)', 4, '15', '60s', 2),
  (v_day_id, 'Rosca Cross (21)', 3, '7-7-7', '60s', 3),
  (v_day_id, 'Tríceps Inverso (Unilateral)', 4, '15', '60s', 4),
  (v_day_id, 'Prancha Iso Ventral (+ Supra)', 4, '60s', '45s', 5);
END $$;

-- 15. Tecnofit - Ficha 9 (Especialização Glúteo/Pernas - 3 Dias)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Avançado - Ficha 9 (Glúteo/Pernas)', 'Hipertrofia/Especialização', 'Avançado', 'Personalizado', 'Foco em Glúteos e Pernas com um dia de Upper Body metabólico no meio. Sequência de 3 treinos (ex: Seg/Qua/Sex).')
  RETURNING id INTO v_template_id;

  -- Treino 3 (Glúteo/Abdominal) - Image 0
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino A (Glúteo/Abd)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Abdutor Cross (Cada Lado)', 4, '15', '60s', 1),
  (v_day_id, 'Cross Perna Estendida (Cada Lado)', 4, '15', '60s', 2),
  (v_day_id, 'Glúteo Coice Máquina (Pirâmide)', 4, '15/15/10/10', '60s', 3),
  (v_day_id, 'Elevação Pélvica Solo Unilateral', 4, '15', '60s', 4),
  (v_day_id, 'Cadeira Abdutora (Pirâmide)', 4, '15/12/10/8', '60s', 5),
  (v_day_id, 'Oblíquo Cross Polia Baixa', 5, '20', '45s', 6);

  -- Treino 4 (Superior Completo) - Image 1
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino B (Superior Completo)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Tríceps Francês', 4, '15', '60s', 1),
  (v_day_id, 'Tríceps Barra Curva Cross', 3, '15/12/10', '60s', 2),
  (v_day_id, 'Tríceps Cross', 3, '15/12/10', '60s', 3),
  (v_day_id, 'Voador (Drop)', 4, '10+10', '60s', 4),
  (v_day_id, 'Puxada Lateral Unilateral', 4, '15', '60s', 5),
  (v_day_id, 'Rosca Direta (+ Elev. Frontal)', 4, '12', '60s', 6),
  (v_day_id, 'Desenvolvimento Máquina', 4, '12-15', '60s', 7),
  (v_day_id, 'Abdominal Remador', 5, '50', '60s', 8);

  -- Treino 5 (Pernas/Glúteo) - Image 2
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino C (Pernas/Glúteo)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Bom Dia', 4, '12-15', '90s', 1),
  (v_day_id, 'Stiff (Halteres)', 4, '15', '90s', 2),
  (v_day_id, 'Passada (Halteres)', 4, '10', '90s', 3),
  (v_day_id, 'Mesa Flexora (Pirâmide)', 4, '15/12/10/8', '60s', 4),
  (v_day_id, 'Agachamento Sissy', 4, '15-20', '60s', 5),
  (v_day_id, 'Glúteo 4 Apoios (Banco Reto)', 4, '20', '60s', 6),
  (v_day_id, 'Elevação Pélvica (Banco)', 4, '12-15', '60s', 7);
END $$;

-- 16. Tecnofit - Ficha 10 (AB - Híbrido)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Intermediário - Ficha 10 (AB Híbrido)', 'Geral', 'Intermediário', 'AB', 'Divisão AB sendo A: Empurrar (Peito/Ombro/Tríceps) e B: Puxar + Pernas (Costas/Bíceps/Pernas).')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Peito/Tríceps/Ombro) - Image 3
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Empurrar)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Supino Máquina', 4, '12', '60s', 1),
  (v_day_id, 'Crucifixo no Voador', 4, '12', '60s', 2),
  (v_day_id, 'Cross Over Polia Alta', 4, '12', '60s', 3),
  (v_day_id, 'Tríceps Cross Barra Reta', 4, '12', '60s', 4),
  (v_day_id, 'Tríceps Inverso', 4, '12', '60s', 5),
  (v_day_id, 'Tríceps Testa', 3, '12', '60s', 6),
  (v_day_id, 'Desenvolvimento Máquina', 4, '12', '60s', 7),
  (v_day_id, 'Elevação Lateral', 4, '12', '60s', 8),
  (v_day_id, 'Elevação Frontal Barra', 3, '12', '60s', 9),
  (v_day_id, 'Abdominal (Sequência 2 Rounds)', 1, '20', '60s', 10),
  (v_day_id, 'Aeróbico', 1, '20 min', '0s', 11);

  -- Treino 2 (Pernas/Costas/Bíceps) - Image 4
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Puxar + Pernas)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Panturrilha em Pé Máquina', 5, '30', '30s', 1),
  (v_day_id, 'Agachamento Smith', 4, '12-15', '90s', 2),
  (v_day_id, 'Leg Press 45º', 3, '12-15', '90s', 3),
  (v_day_id, 'Mesa Flexora', 4, '12-15', '60s', 4),
  (v_day_id, 'Cadeira Extensora', 4, '12', '60s', 5),
  (v_day_id, 'Pulley Puxada Frente (Barra Romana)', 4, '12', '60s', 6),
  (v_day_id, 'Transformers (Pegada Neutra)', 4, '12-15', '60s', 7),
  (v_day_id, 'Remada Curvada (Pronada)', 4, '12', '60s', 8),
  (v_day_id, 'Rosca 21', 4, '21', '60s', 9),
  (v_day_id, 'Rosca Scott Máquina', 4, '12-15', '60s', 10),
  (v_day_id, 'Rosca Articulada Máquina', 3, '12-15', '60s', 11),
  (v_day_id, 'Encolhimento Smith', 4, '15', '45s', 12);
END $$;

-- 17. Tecnofit - Ficha 11 (ABCD - Peito/Costas/Pernas/Ombros)
DO $$
DECLARE
  v_template_id uuid;
  v_day_id uuid;
BEGIN
  INSERT INTO public.workout_templates (name, objective, level, routine_type, description)
  VALUES ('Avançado - Ficha 11 (ABCD)', 'Hipertrofia', 'Intermediário/Avançado', 'ABCD', 'Divisão de 4 dias separando Ombros em um dia exclusivo. Foco em volume e isolamento.')
  RETURNING id INTO v_template_id;

  -- Treino 1 (Peito/Tríceps) - Image 0
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 1 (Peito/Tríceps)', 1) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Manguito Rotador (Mobilidade)', 3, '12', '0s', 1),
  (v_day_id, 'Supino Inclinado', 4, '12', '60s', 2),
  (v_day_id, 'Crucifixo Inclinado (Halter)', 3, '10', '60s', 3),
  (v_day_id, 'Supino Máquina (Pico Contração 1s)', 4, '10', '60s', 4),
  (v_day_id, 'Cross Over (Polia Alta)', 3, '15', '60s', 5),
  (v_day_id, 'Tríceps Corda (Cross)', 4, '15', '60s', 6),
  (v_day_id, 'Tríceps Máquina (Drop na última 3x)', 3, '12', '60s', 7);

  -- Treino 2 (Costas/Bíceps) - Image 1
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 2 (Costas/Bíceps)', 2) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Pulley Puxada Frente (Progredindo Carga)', 3, '12', '60s', 1),
  (v_day_id, 'Pulley Remada Triângulo', 3, '12', '60s', 2),
  (v_day_id, 'Remada Máquina (Pegada Aberta Pronada)', 3, '12', '60s', 3),
  (v_day_id, 'Flexora Lombar', 3, '15', '60s', 4),
  (v_day_id, 'Rosca Cross (Drop na última)', 3, '12', '60s', 5),
  (v_day_id, 'Rosca Scott (Drop na última 3x)', 3, '12', '60s', 6),
  (v_day_id, 'Prancha Isométrica', 4, '40s', '45s', 7),
  (v_day_id, 'Esteira', 1, '20 min', '0s', 8);

  -- Treino 3 (Pernas/Glúteo) - Image 2
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 3 (Pernas/Glúteo)', 3) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Cadeira Extensora', 3, '20', '60s', 1),
  (v_day_id, 'Cadeira Flexora', 4, '12', '60s', 2),
  (v_day_id, 'Flexora em Pé', 3, '10', '60s', 3),
  (v_day_id, 'Leg Press 45º (Progredindo Carga)', 4, '10', '90s', 4),
  (v_day_id, 'Panturrilha em Pé Máquina', 3, '15-20', '45s', 5),
  (v_day_id, 'Elevação Pélvica Máquina (Progredindo Carga)', 3, '12', '60s', 6),
  (v_day_id, 'Cadeira Abdutora', 3, '12', '60s', 7),
  (v_day_id, 'Cadeira Extensora (Carga Moderada)', 3, '10', '60s', 8);

  -- Treino 4 (Ombros/Abd) - Image 3
  INSERT INTO public.workout_template_days (template_id, name, day_order) VALUES (v_template_id, 'Treino 4 (Ombros)', 4) RETURNING id INTO v_day_id;
  INSERT INTO public.workout_template_exercises (template_day_id, exercise_name, sets, reps, rest_time, exercise_order) VALUES
  (v_day_id, 'Desenvolvimento Máquina', 2, '15', '60s', 1),
  (v_day_id, 'Desenvolvimento com Halteres (Sentado)', 3, '10+10+10', '60s', 2),
  (v_day_id, 'Elevação Lateral', 3, '12', '60s', 3),
  (v_day_id, 'Elevação Frontal Barra (W no Banco)', 3, '12', '60s', 4),
  (v_day_id, 'Prancha Isométrica (+ Abd Supra)', 3, '40s', '45s', 5),
  (v_day_id, 'Elíptico', 1, '25 min', '0s', 6);
END $$;
