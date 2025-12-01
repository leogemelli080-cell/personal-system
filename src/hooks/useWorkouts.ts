import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface WorkoutExercise {
    id?: string;
    workout_day_id?: string;
    exercise_name: string;
    sets: number;
    reps: string;
    rest_time?: string;
    notes?: string;
    exercise_order: number;
}

export interface WorkoutDay {
    id?: string;
    workout_id?: string;
    name: string;
    day_order: number;
    exercises: WorkoutExercise[];
}

export interface Workout {
    id: string;
    created_at: string;
    student_id: string;
    name: string;
    routine_type: string;
    description?: string;
    days?: WorkoutDay[];
}

export const useWorkouts = (studentId: string) => {
    return useQuery({
        queryKey: ["workouts", studentId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("workouts")
                .select(`
          *,
          days:workout_days(
            *,
            exercises:workout_exercises(*)
          )
        `)
                .eq("student_id", studentId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Sort days and exercises
            const workouts = data?.map(workout => ({
                ...workout,
                days: workout.days?.sort((a: any, b: any) => a.day_order - b.day_order).map((day: any) => ({
                    ...day,
                    exercises: day.exercises?.sort((a: any, b: any) => a.exercise_order - b.exercise_order)
                }))
            }));

            return workouts as Workout[];
        },
        enabled: !!studentId,
    });
};

export const useCreateWorkout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (workout: {
            student_id: string,
            name: string,
            routine_type: string,
            description?: string,
            days: WorkoutDay[]
        }) => {
            // 1. Create Workout
            const { data: workoutData, error: workoutError } = await supabase
                .from("workouts")
                .insert({
                    student_id: workout.student_id,
                    name: workout.name,
                    routine_type: workout.routine_type,
                    description: workout.description
                })
                .select()
                .single();

            if (workoutError) throw workoutError;

            // 2. Create Days and Exercises
            for (const day of workout.days) {
                const { data: dayData, error: dayError } = await supabase
                    .from("workout_days")
                    .insert({
                        workout_id: workoutData.id,
                        name: day.name,
                        day_order: day.day_order
                    })
                    .select()
                    .single();

                if (dayError) throw dayError;

                if (day.exercises && day.exercises.length > 0) {
                    const exercisesToInsert = day.exercises.map(ex => ({
                        workout_day_id: dayData.id,
                        exercise_name: ex.exercise_name,
                        sets: ex.sets,
                        reps: ex.reps,
                        rest_time: ex.rest_time,
                        notes: ex.notes,
                        exercise_order: ex.exercise_order
                    }));

                    const { error: exercisesError } = await supabase
                        .from("workout_exercises")
                        .insert(exercisesToInsert);

                    if (exercisesError) throw exercisesError;
                }
            }

            return workoutData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workouts"] });
            toast({
                title: "Treino criado com sucesso!",
                description: "O novo plano de treino foi salvo.",
            });
        },
        onError: (error) => {
            toast({
                title: "Erro ao criar treino",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};

export const useDeleteWorkout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("workouts")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workouts"] });
            toast({
                title: "Treino excluído",
                description: "O treino foi removido com sucesso.",
            });
        },
        onError: (error) => {
            toast({
                title: "Erro ao excluir treino",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};

export const useWorkoutTemplates = () => {
    return useQuery({
        queryKey: ["workoutTemplates"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("workout_templates")
                .select(`
                    *,
                    days:workout_template_days(
                        *,
                        exercises:workout_template_exercises(*)
                    )
                `);

            if (error) throw error;

            // Sort days and exercises
            const templates = data?.map(template => ({
                ...template,
                days: template.days?.sort((a: any, b: any) => a.day_order - b.day_order).map((day: any) => ({
                    ...day,
                    exercises: day.exercises?.sort((a: any, b: any) => a.exercise_order - b.exercise_order)
                }))
            }));

            return templates;
        },
    });
};

export const useApplyTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { studentId: string, templateId: string, templateData: any }) => {
            const { studentId, templateData } = params;

            // 1. Create Workout from Template
            const { data: workoutData, error: workoutError } = await supabase
                .from("workouts")
                .insert({
                    student_id: studentId,
                    name: templateData.name,
                    routine_type: templateData.routine_type,
                    description: templateData.description
                })
                .select()
                .single();

            if (workoutError) throw workoutError;

            // 2. Create Days and Exercises
            for (const day of templateData.days) {
                const { data: dayData, error: dayError } = await supabase
                    .from("workout_days")
                    .insert({
                        workout_id: workoutData.id,
                        name: day.name,
                        day_order: day.day_order
                    })
                    .select()
                    .single();

                if (dayError) throw dayError;

                if (day.exercises && day.exercises.length > 0) {
                    const exercisesToInsert = day.exercises.map((ex: any) => ({
                        workout_day_id: dayData.id,
                        exercise_name: ex.exercise_name,
                        sets: ex.sets,
                        reps: ex.reps,
                        rest_time: ex.rest_time,
                        notes: ex.notes,
                        exercise_order: ex.exercise_order
                    }));

                    const { error: exercisesError } = await supabase
                        .from("workout_exercises")
                        .insert(exercisesToInsert);

                    if (exercisesError) throw exercisesError;
                }
            }

            return workoutData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workouts"] });
            toast({
                title: "Template aplicado!",
                description: "O treino foi criado com sucesso a partir do modelo.",
            });
        },
        onError: (error) => {
            toast({
                title: "Erro ao aplicar template",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};
