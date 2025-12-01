import { useState } from "react";
import { useWorkoutTemplates, useApplyTemplate } from "@/hooks/useWorkouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dumbbell, Check, Loader2, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkoutTemplateSelectorProps {
    studentId: string;
    onSuccess?: () => void;
    onSelectTemplate?: (template: any) => void;
}

const WorkoutTemplateSelector = ({ studentId, onSuccess, onSelectTemplate }: WorkoutTemplateSelectorProps) => {
    const { data: templates, isLoading } = useWorkoutTemplates();
    const applyTemplate = useApplyTemplate();
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const [selectedObjective, setSelectedObjective] = useState<string>("all");
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const filteredTemplates = templates?.filter(t => {
        if (selectedLevel !== "all" && t.level !== selectedLevel) return false;
        if (selectedObjective !== "all" && t.objective !== selectedObjective) return false;
        return true;
    });

    const handleApply = async (template: any) => {
        if (onSelectTemplate) {
            onSelectTemplate(template);
            setIsDetailsOpen(false);
            return;
        }

        try {
            await applyTemplate.mutateAsync({
                studentId,
                templateId: template.id,
                templateData: template
            });
            setIsDetailsOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Níveis</SelectItem>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedObjective} onValueChange={setSelectedObjective}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Objetivos</SelectItem>
                        <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                        <SelectItem value="Força">Força</SelectItem>
                        <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredTemplates?.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => {
                        setSelectedTemplate(template);
                        setIsDetailsOpen(true);
                    }}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{template.name}</CardTitle>
                                <Badge variant="secondary">{template.level}</Badge>
                            </div>
                            <CardDescription>{template.objective} • {template.routine_type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                            <div className="mt-2 text-xs font-medium flex items-center text-primary">
                                Ver detalhes <ChevronRight className="w-3 h-3 ml-1" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{selectedTemplate?.name}</DialogTitle>
                        <DialogDescription>{selectedTemplate?.description}</DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-6 py-4">
                            {selectedTemplate?.days?.map((day: any) => (
                                <div key={day.id} className="border rounded-lg p-4 bg-muted/30">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                                            {day.name}
                                        </span>
                                    </h4>
                                    <div className="space-y-2">
                                        {day.exercises?.map((ex: any, idx: number) => (
                                            <div key={ex.id} className="text-sm grid grid-cols-[1fr_auto] gap-4 py-1 border-b last:border-0 border-border/50">
                                                <span>{idx + 1}. {ex.exercise_name}</span>
                                                <span className="text-muted-foreground text-xs">
                                                    {ex.sets}x {ex.reps} ({ex.rest_time})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Cancelar</Button>
                        <Button onClick={() => handleApply(selectedTemplate)} disabled={!onSelectTemplate && applyTemplate.isPending}>
                            {!onSelectTemplate && applyTemplate.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            {onSelectTemplate ? "Importar para o Treino" : "Usar este Template"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default WorkoutTemplateSelector;
