import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface DietFood {
    id?: string;
    meal_id?: string;
    food_name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    day_of_week?: number;
}

export interface DietMeal {
    id?: string;
    diet_id?: string;
    name: string;
    order: number;
    time?: string;
    foods: DietFood[];
}

export interface Diet {
    id?: string;
    student_id: string;
    name: string;
    goal: "cut" | "bulk" | "maintain";
    calories_target: number;
    protein_target: number;
    carbs_target: number;
    fats_target: number;
    type: "simple" | "varied";
    created_at?: string;
    meals?: DietMeal[];
}

export const useDiets = (studentId?: string) => {
    return useQuery({
        queryKey: ["diets", studentId],
        queryFn: async () => {
            let query = supabase
                .from("diets")
                .select(`
          *,
          meals:diet_meals(
            *,
            foods:diet_foods(*)
          )
        `)
                .order("created_at", { ascending: false });

            if (studentId) {
                query = query.eq("student_id", studentId);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Sort meals by order
            const diets = data.map((diet: any) => ({
                ...diet,
                meals: diet.meals.sort((a: any, b: any) => a.order - b.order)
            }));

            return diets as Diet[];
        },
        enabled: !!studentId,
    });
};

export const useCreateDiet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (diet: Diet) => {
            // 1. Create Diet
            const { data: dietData, error: dietError } = await supabase
                .from("diets")
                .insert({
                    student_id: diet.student_id,
                    name: diet.name,
                    goal: diet.goal,
                    calories_target: diet.calories_target,
                    protein_target: diet.protein_target,
                    carbs_target: diet.carbs_target,
                    fats_target: diet.fats_target,
                    type: diet.type
                })
                .select()
                .single();

            if (dietError) throw dietError;

            if (diet.meals) {
                for (const meal of diet.meals) {
                    // 2. Create Meal
                    const { data: mealData, error: mealError } = await supabase
                        .from("diet_meals")
                        .insert({
                            diet_id: dietData.id,
                            name: meal.name,
                            order: meal.order,
                            time: meal.time
                        })
                        .select()
                        .single();

                    if (mealError) throw mealError;

                    if (meal.foods) {
                        // 3. Create Foods
                        const foodsToInsert = meal.foods.map(food => ({
                            meal_id: mealData.id,
                            food_name: food.food_name,
                            quantity: food.quantity,
                            unit: food.unit,
                            calories: food.calories,
                            protein: food.protein,
                            carbs: food.carbs,
                            fats: food.fats,
                            day_of_week: food.day_of_week
                        }));

                        const { error: foodsError } = await supabase
                            .from("diet_foods")
                            .insert(foodsToInsert);

                        if (foodsError) throw foodsError;
                    }
                }
            }

            return dietData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["diets"] });
            toast({
                title: "Dieta criada com sucesso!",
                description: "O plano alimentar foi salvo.",
            });
        },
        onError: (error) => {
            toast({
                title: "Erro ao criar dieta",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};

export const useDeleteDiet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("diets")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["diets"] });
            toast({
                title: "Dieta excluída",
                description: "O plano alimentar foi removido.",
            });
        },
        onError: (error) => {
            toast({
                title: "Erro ao excluir",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};
