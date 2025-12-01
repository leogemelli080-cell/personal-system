import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Save, X, Download } from "lucide-react";
import { EXERCISE_CATEGORIES, ROUTINE_TYPES } from "@/constants/exercises";
import { useCreateWorkout, WorkoutDay, WorkoutExercise } from "@/hooks/useWorkouts";
import WorkoutTemplateSelector from "@/components/WorkoutTemplateSelector";

interface WorkoutCreatorProps {
    studentId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const WorkoutCreator = ({ studentId, onSuccess, onCancel }: WorkoutCreatorProps) => {
    const createWorkout = useCreateWorkout();
    const [step, setStep] = useState(1);
    const [basicInfo, setBasicInfo] = useState({
        name: "",
        routine_type: "",
        description: "",
    });
    const [days, setDays] = useState<WorkoutDay[]>([]);
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

    // Exercise Modal State
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("Peitoral");
    const [newExercise, setNewExercise] = useState<WorkoutExercise>({
        exercise_name: "",
        sets: 3,
        reps: "10-12",
        rest_time: "60s",
        notes: "",
        exercise_order: 0,
    });

    // Template Modal State
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

    const handleAddDay = () => {
        const newDay: WorkoutDay = {
            name: `Treino ${String.fromCharCode(65 + days.length)}`, // A, B, C...
            day_order: days.length + 1,
            exercises: [],
        };
        setDays([...days, newDay]);
    };

    const handleRemoveDay = (index: number) => {
        const newDays = days.filter((_, i) => i !== index);
        setDays(newDays);
    };

    const handleOpenExerciseModal = (dayIndex: number) => {
        setCurrentDayIndex(dayIndex);
        setNewExercise({
            exercise_name: "",
            sets: 3,
            reps: "10-12",
            rest_time: "60s",
            notes: "",
            exercise_order: days[dayIndex].exercises.length + 1,
        });
        setIsExerciseModalOpen(true);
    };

    const handleAddExercise = () => {
        if (currentDayIndex === null || !newExercise.exercise_name) return;

        const updatedDays = [...days];
        updatedDays[currentDayIndex].exercises.push({ ...newExercise });
        setDays(updatedDays);
        setIsExerciseModalOpen(false);
    };

    const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
        const updatedDays = [...days];
        updatedDays[dayIndex].exercises = updatedDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex);
        setDays(updatedDays);
    };

    const handleSaveWorkout = async () => {
        try {
            await createWorkout.mutateAsync({
                student_id: studentId,
                name: basicInfo.name,
                routine_type: basicInfo.routine_type,
                description: basicInfo.description,
                days: days,
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving workout:", error);
        }
    };

    const handleTemplateSelect = (template: any) => {
        // If basic info is empty, fill it
        if (!basicInfo.name) {
            setBasicInfo({
                name: template.name,
                routine_type: template.routine_type,
                description: template.description || ""
            });
        }

        // Append days
        const newDays = template.days.map((day: any, index: number) => ({
            name: day.name,
            day_order: days.length + index + 1,
            exercises: day.exercises.map((ex: any) => ({
                exercise_name: ex.exercise_name,
                sets: ex.sets,
                reps: ex.reps,
                rest_time: ex.rest_time,
                notes: ex.notes,
                exercise_order: ex.exercise_order
            }))
        }));

        setDays([...days, ...newDays]);
        setIsTemplateModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {step === 1 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4 p-4 bg-muted/30 rounded-lg border border-dashed">
                        <div>
                            <h4 className="font-medium">Começar com um Modelo?</h4>
                            <p className="text-sm text-muted-foreground">Importe um treino pronto e personalize como quiser.</p>
                        </div>
                        <Button variant="secondary" onClick={() => setIsTemplateModalOpen(true)} className="gap-2">
                            <Download className="w-4 h-4" /> Importar Modelo
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Nome do Treino</Label>
                        <Input
                            placeholder="Ex: Hipertrofia Iniciante"
                            value={basicInfo.name}
                            onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de Rotina</Label>
                        <Select
                            value={basicInfo.routine_type}
                            onValueChange={(value) => setBasicInfo({ ...basicInfo, routine_type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROUTINE_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {basicInfo.routine_type && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {ROUTINE_TYPES.find(t => t.value === basicInfo.routine_type)?.description}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Descrição / Observações</Label>
                        <Textarea
                            placeholder="Ex: Focar na execução lenta..."
                            value={basicInfo.description}
                            onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                        <Button
                            onClick={() => setStep(2)}
                            disabled={!basicInfo.name || !basicInfo.routine_type}
                        >
                            Próximo: Montar Treino
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">{basicInfo.name}</h3>
                            <p className="text-sm text-muted-foreground">{basicInfo.routine_type}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)} className="gap-2">
                                <Download className="w-4 h-4" /> Importar / Mesclar
                            </Button>
                            <Button onClick={handleAddDay} variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" /> Adicionar Dia
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {days.map((day, dayIndex) => (
                            <Card key={dayIndex} className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemoveDay(dayIndex)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <CardHeader className="pb-2">
                                    <Input
                                        value={day.name}
                                        onChange={(e) => {
                                            const newDays = [...days];
                                            newDays[dayIndex].name = e.target.value;
                                            setDays(newDays);
                                        }}
                                        className="font-semibold text-lg border-none px-0 h-auto focus-visible:ring-0"
                                    />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 min-h-[100px]">
                                        {day.exercises.map((exercise, exIndex) => (
                                            <div key={exIndex} className="bg-muted/50 p-2 rounded text-sm relative group">
                                                <div className="font-medium pr-6">{exercise.exercise_name}</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {exercise.sets} x {exercise.reps} • {exercise.rest_time}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleRemoveExercise(dayIndex, exIndex)}
                                                >
                                                    <Trash2 className="w-3 h-3 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                        {day.exercises.length === 0 && (
                                            <div className="text-center text-muted-foreground text-sm py-4 border-2 border-dashed rounded-lg">
                                                Sem exercícios
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="w-full gap-2"
                                        onClick={() => handleOpenExerciseModal(dayIndex)}
                                    >
                                        <Plus className="w-4 h-4" /> Adicionar Exercício
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-between pt-6 border-t">
                        <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                        <div className="gap-2 flex">
                            <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                            <Button
                                onClick={handleSaveWorkout}
                                disabled={days.length === 0 || createWorkout.isPending}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {createWorkout.isPending ? "Salvando..." : "Salvar Treino"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Template Selection Modal */}
            <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Importar Modelo de Treino</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                        <WorkoutTemplateSelector
                            studentId={studentId}
                            onSelectTemplate={handleTemplateSelect}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Exercise Modal */}
            <Dialog open={isExerciseModalOpen} onOpenChange={setIsExerciseModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar Exercício</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Grupo Muscular</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(EXERCISE_CATEGORIES).map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Exercício</Label>
                                <Select
                                    value={newExercise.exercise_name}
                                    onValueChange={(val) => setNewExercise({ ...newExercise, exercise_name: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <ScrollArea className="h-[200px]">
                                            {EXERCISE_CATEGORIES[selectedCategory as keyof typeof EXERCISE_CATEGORIES].map((ex) => (
                                                <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                                            ))}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Séries</Label>
                                <Input
                                    type="number"
                                    value={newExercise.sets}
                                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Repetições</Label>
                                <Input
                                    value={newExercise.reps}
                                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Descanso</Label>
                                <Input
                                    value={newExercise.rest_time}
                                    onChange={(e) => setNewExercise({ ...newExercise, rest_time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Observações (Opcional)</Label>
                            <Input
                                placeholder="Ex: Drop-set na última série"
                                value={newExercise.notes}
                                onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                            />
                        </div>

                        <Button onClick={handleAddExercise} disabled={!newExercise.exercise_name} className="w-full mt-4">
                            Adicionar ao Treino
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default WorkoutCreator;
