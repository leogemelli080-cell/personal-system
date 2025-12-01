import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateDiet, Diet, DietMeal, DietFood } from "@/hooks/useDiets";
import { FOOD_DATABASE, MEAL_STRUCTURE } from "@/constants/foodDatabase";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DietCreatorProps {
    studentId: string;
    tdee: number; // Total Daily Energy Expenditure
    onSuccess?: () => void;
}

const DietCreator = ({ studentId, tdee, onSuccess }: DietCreatorProps) => {
    const { toast } = useToast();
    const createDiet = useCreateDiet();
    const [loading, setLoading] = useState(false);

    const [config, setConfig] = useState({
        goal: "cut", // cut, bulk, maintain
        caloriesDiff: 500,
        type: "simple", // simple, varied
        mealsPerDay: 4,
    });

    const [generatedDiet, setGeneratedDiet] = useState<Diet | null>(null);

    const calculateTargets = () => {
        let targetCalories = tdee;
        if (config.goal === "cut") {
            targetCalories -= config.caloriesDiff;
        } else if (config.goal === "bulk") {
            targetCalories += config.caloriesDiff;
        }

        // Standard Macro Split (40/30/30)
        const proteinCals = targetCalories * 0.4; // 4g/kcal -> 40%
        const fatCals = targetCalories * 0.3; // 9g/kcal -> 30%
        const carbCals = targetCalories * 0.3; // 4g/kcal -> 30%

        return {
            calories: Math.round(targetCalories),
            protein: Math.round(proteinCals / 4),
            fats: Math.round(fatCals / 9),
            carbs: Math.round(carbCals / 4),
        };
    };

    const generateDiet = () => {
        setLoading(true);

        // Simulate processing time
        setTimeout(() => {
            const targets = calculateTargets();
            const meals: DietMeal[] = [];
            const mealsCount = config.mealsPerDay;

            // Distribute calories per meal (simplified)
            const calsPerMeal = targets.calories / mealsCount;
            const proteinPerMeal = targets.protein / mealsCount;
            const carbsPerMeal = targets.carbs / mealsCount;
            const fatsPerMeal = targets.fats / mealsCount;

            for (let i = 0; i < mealsCount; i++) {
                // Use modulo to cycle through meal types if mealsCount > 4, but try to map logically
                // 3 meals: Breakfast, Lunch, Dinner
                // 4 meals: Breakfast, Lunch, Snack, Dinner
                // 5 meals: Breakfast, Snack, Lunch, Snack, Dinner
                // 6 meals: Breakfast, Snack, Lunch, Snack, Dinner, Supper

                let structureIndex = 0;
                if (mealsCount === 3) structureIndex = [0, 1, 3][i];
                else if (mealsCount === 4) structureIndex = [0, 1, 2, 3][i];
                else if (mealsCount === 5) structureIndex = [0, 2, 1, 2, 3][i]; // Breakfast, Snack, Lunch, Snack, Dinner (approx)
                else structureIndex = i % MEAL_STRUCTURE.length;

                const structure = MEAL_STRUCTURE[structureIndex] || MEAL_STRUCTURE[i % MEAL_STRUCTURE.length];
                const mealFoods: DietFood[] = [];

                // Select foods based on structure AND allowed_meals
                structure.type.forEach(type => {
                    const options = FOOD_DATABASE.filter(f =>
                        f.category === type &&
                        f.allowed_meals.includes(structure.tag as any)
                    );

                    if (options.length === 0) return; // Skip if no valid food found

                    const food = options[Math.floor(Math.random() * options.length)];

                    let quantity = food.default_quantity;

                    // Adjust quantity based on target calories for this slot
                    const targetSlotCals = calsPerMeal / structure.type.length;

                    if (food.unit === 'g' || food.unit === 'ml') {
                        quantity = Math.round(targetSlotCals / food.calories);
                        // Round to nearest 5 or 10 for cleaner numbers
                        quantity = Math.round(quantity / 5) * 5;
                    } else {
                        quantity = Math.max(0.5, Math.round((targetSlotCals / food.calories) * 2) / 2); // Round to nearest 0.5
                    }

                    mealFoods.push({
                        food_name: food.name,
                        quantity: quantity,
                        unit: food.unit,
                        calories: food.calories * quantity,
                        protein: food.protein * quantity,
                        carbs: food.carbs * quantity,
                        fats: food.fats * quantity,
                    });
                });

                meals.push({
                    name: structure.name,
                    order: i + 1,
                    time: `0${8 + (i * 3)}:00`.slice(-5),
                    foods: mealFoods
                });
            }

            const newDiet: Diet = {
                student_id: studentId,
                name: `Dieta ${config.goal === "cut" ? "Definição" : config.goal === "bulk" ? "Ganho de Massa" : "Manutenção"} - ${new Date().toLocaleDateString()}`,
                goal: config.goal as "cut" | "bulk" | "maintain",
                calories_target: targets.calories,
                protein_target: targets.protein,
                carbs_target: targets.carbs,
                fats_target: targets.fats,
                type: config.type as "simple" | "varied",
                meals: meals
            };

            setGeneratedDiet(newDiet);
            setLoading(false);
            toast({
                title: "Dieta Gerada!",
                description: "Revise os valores e clique em Salvar.",
            });
        }, 1000);
    };

    const handleSave = async () => {
        if (!generatedDiet) return;
        try {
            await createDiet.mutateAsync(generatedDiet);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    const targets = calculateTargets();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gerador de Dieta Inteligente</CardTitle>
                    <CardDescription>Configure os parâmetros para gerar um plano alimentar personalizado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Objetivo</Label>
                            <Select
                                value={config.goal}
                                onValueChange={(val) => setConfig(prev => ({ ...prev, goal: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cut">Emagrecimento (Déficit Calórico)</SelectItem>
                                    <SelectItem value="bulk">Ganho de Massa (Superávit Calórico)</SelectItem>
                                    <SelectItem value="maintain">Manutenção</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>
                                {config.goal === "cut" ? "Déficit" : config.goal === "bulk" ? "Superávit" : "Ajuste"} Calórico: {config.caloriesDiff} kcal
                            </Label>
                            <Slider
                                value={[config.caloriesDiff]}
                                min={0}
                                max={1000}
                                step={50}
                                onValueChange={(val) => setConfig(prev => ({ ...prev, caloriesDiff: val[0] }))}
                                disabled={config.goal === "maintain"}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Variedade do Cardápio</Label>
                            <Select
                                value={config.type}
                                onValueChange={(val) => setConfig(prev => ({ ...prev, type: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="simple">Simples (Mesmo cardápio todos os dias)</SelectItem>
                                    <SelectItem value="varied">Variada (Opções diferentes na semana)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Refeições por Dia: {config.mealsPerDay}</Label>
                            <Slider
                                value={[config.mealsPerDay]}
                                min={3}
                                max={6}
                                step={1}
                                onValueChange={(val) => setConfig(prev => ({ ...prev, mealsPerDay: val[0] }))}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2">Metas Calculadas (Diárias)</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-xs text-muted-foreground">Calorias</p>
                                <p className="text-xl font-bold">{targets.calories}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Proteína</p>
                                <p className="text-xl font-bold text-blue-500">{targets.protein}g</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Carboidratos</p>
                                <p className="text-xl font-bold text-orange-500">{targets.carbs}g</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Gorduras</p>
                                <p className="text-xl font-bold text-yellow-500">{targets.fats}g</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        onClick={generateDiet}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Gerando Cardápio...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Gerar Dieta
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {generatedDiet && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Dieta Gerada</h2>
                        <Button onClick={handleSave} disabled={createDiet.isPending}>
                            {createDiet.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Salvar Dieta
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {generatedDiet.meals?.map((meal) => (
                            <Card key={meal.order}>
                                <CardHeader className="py-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{meal.name}</CardTitle>
                                        <span className="text-sm text-muted-foreground">{meal.time}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="py-3">
                                    <div className="space-y-2">
                                        {meal.foods.map((food, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-border/50 last:border-0 pb-2 last:pb-0">
                                                <span>{food.food_name}</span>
                                                <div className="text-right">
                                                    <span className="font-semibold">{food.quantity} {food.unit}</span>
                                                    <div className="text-xs text-muted-foreground">
                                                        {Math.round(food.protein)}p • {Math.round(food.carbs)}c • {Math.round(food.fats)}g • {Math.round(food.calories)}kcal
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-border flex justify-between items-center text-xs font-medium text-muted-foreground">
                                        <div className="flex gap-2 items-center text-primary/80 italic">
                                            {MEAL_STRUCTURE.find(m => m.name === meal.name)?.visual_guide && (
                                                <>
                                                    <span className="text-[10px] bg-primary/10 px-2 py-1 rounded-full">
                                                        💡 Dica Visual
                                                    </span>
                                                    <span className="hidden sm:inline">{MEAL_STRUCTURE.find(m => m.name === meal.name)?.visual_guide}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            <span>Total: {Math.round(meal.foods.reduce((acc, f) => acc + f.calories, 0))} kcal</span>
                                            <span>{Math.round(meal.foods.reduce((acc, f) => acc + f.protein, 0))}g Prot</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DietCreator;
