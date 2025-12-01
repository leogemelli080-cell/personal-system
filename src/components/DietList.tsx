import { useDiets, useDeleteDiet } from "@/hooks/useDiets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MEAL_STRUCTURE } from "@/constants/foodDatabase";

interface DietListProps {
    studentId: string;
}

const DietList = ({ studentId }: DietListProps) => {
    const { data: diets, isLoading } = useDiets(studentId);
    const deleteDiet = useDeleteDiet();
    const [expandedDiet, setExpandedDiet] = useState<string | null>(null);

    if (isLoading) {
        return <div className="text-center py-8">Carregando dietas...</div>;
    }

    if (!diets || diets.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
                <p>Nenhuma dieta encontrada.</p>
                <p className="text-sm">Crie um novo plano alimentar acima.</p>
            </div>
        );
    }

    const toggleExpand = (id: string) => {
        setExpandedDiet(expandedDiet === id ? null : id);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta dieta?")) {
            await deleteDiet.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-4">
            {diets.map((diet) => (
                <Card key={diet.id} className="overflow-hidden">
                    <CardHeader className="py-4 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleExpand(diet.id!)}>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg">{diet.name}</CardTitle>
                                    <Badge variant={diet.goal === "cut" ? "destructive" : diet.goal === "bulk" ? "default" : "secondary"}>
                                        {diet.goal === "cut" ? "Definição" : diet.goal === "bulk" ? "Ganho de Massa" : "Manutenção"}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    {diet.calories_target} kcal • {diet.protein_target}g P • {diet.carbs_target}g C • {diet.fats_target}g G
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(diet.id!); }}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                                {expandedDiet === diet.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                        </div>
                    </CardHeader>

                    {expandedDiet === diet.id && (
                        <CardContent className="pt-4 animate-in slide-in-from-top-2">
                            <div className="grid gap-4 md:grid-cols-2">
                                {diet.meals?.map((meal) => (
                                    <div key={meal.id} className="border border-border rounded-lg p-3 bg-card">
                                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-border/50">
                                            <h4 className="font-semibold text-sm">{meal.name}</h4>
                                            <span className="text-xs text-muted-foreground">{meal.time}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {meal.foods.map((food, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span>{food.quantity}{food.unit} {food.food_name}</span>
                                                    <span className="text-muted-foreground text-xs">{Math.round(food.calories)} kcal</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                                            <div className="flex gap-2 items-center text-primary/80 italic">
                                                {MEAL_STRUCTURE.find(m => m.name === meal.name)?.visual_guide && (
                                                    <>
                                                        <span className="text-[10px] bg-primary/10 px-2 py-1 rounded-full">
                                                            💡 Dica
                                                        </span>
                                                        <span className="hidden sm:inline">{MEAL_STRUCTURE.find(m => m.name === meal.name)?.visual_guide}</span>
                                                    </>
                                                )}
                                            </div>
                                            <span>Total: {Math.round(meal.foods.reduce((acc, f) => acc + f.calories, 0))} kcal</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default DietList;
