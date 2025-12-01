-- Create diets table
CREATE TABLE IF NOT EXISTS public.diets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT NOT NULL, -- 'cut', 'bulk', 'maintain'
    calories_target INTEGER NOT NULL,
    protein_target INTEGER NOT NULL,
    carbs_target INTEGER NOT NULL,
    fats_target INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'simple', 'varied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create diet_meals table
CREATE TABLE IF NOT EXISTS public.diet_meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    diet_id UUID REFERENCES public.diets(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'Café da Manhã', 'Almoço', etc.
    "order" INTEGER NOT NULL,
    time TEXT
);

-- Create diet_foods table
CREATE TABLE IF NOT EXISTS public.diet_foods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meal_id UUID REFERENCES public.diet_meals(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    calories NUMERIC NOT NULL,
    protein NUMERIC NOT NULL,
    carbs NUMERIC NOT NULL,
    fats NUMERIC NOT NULL,
    day_of_week INTEGER -- 0 for simple (all days), 1-7 for varied (Mon-Sun)
);

-- Enable RLS
ALTER TABLE public.diets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_foods ENABLE ROW LEVEL SECURITY;

-- Create policies (permissive for now, similar to other tables)
CREATE POLICY "Enable all access for authenticated users" ON public.diets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.diet_meals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.diet_foods FOR ALL USING (true) WITH CHECK (true);
