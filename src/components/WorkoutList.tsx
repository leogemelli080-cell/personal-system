import { useWorkouts, useDeleteWorkout } from "@/hooks/useWorkouts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dumbbell, Trash2, Calendar, Clock, FileText } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WorkoutListProps {
    studentId: string;
    readOnly?: boolean;
}

const WorkoutList = ({ studentId, readOnly = false }: WorkoutListProps) => {
    const { data: workouts, isLoading } = useWorkouts(studentId);
    const deleteWorkout = useDeleteWorkout();

    if (isLoading) {
        return <div className="text-center py-8">Carregando treinos...</div>;
    }

    if (!workouts || workouts.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum treino encontrado</h3>
                <p className="text-muted-foreground">Crie um novo plano de treino para começar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {workouts.map((workout) => (
                <Card key={workout.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Dumbbell className="w-5 h-5 text-primary" />
                                    {workout.name}
                                </CardTitle>
                                <CardDescription className="mt-1 flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                                        {workout.routine_type}
                                    </span>
                                    <span className="text-xs flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(workout.created_at).toLocaleDateString("pt-BR")}
                                    </span>
                                </CardDescription>
                            </div>

                            {!readOnly && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir treino?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Essa ação não pode ser desfeita. O treino será permanentemente removido.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => deleteWorkout.mutate(workout.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Excluir
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                        {workout.description && (
                            <p className="text-sm text-muted-foreground mt-2 flex items-start gap-2">
                                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                {workout.description}
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                            {workout.days?.map((day, index) => (
                                <AccordionItem key={day.id} value={day.id || index.toString()} className="border-b last:border-0">
                                    <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                                        <span className="font-medium">{day.name}</span>
                                        <span className="text-xs text-muted-foreground ml-2 font-normal">
                                            {day.exercises?.length} exercícios
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 pt-2 bg-muted/10">
                                        <div className="space-y-3">
                                            {day.exercises?.map((exercise, exIndex) => (
                                                <div key={exercise.id} className="flex items-start justify-between text-sm p-2 rounded hover:bg-background border border-transparent hover:border-border transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-muted-foreground w-6 text-center">
                                                            {exIndex + 1}
                                                        </span>
                                                        <div>
                                                            <p className="font-medium">{exercise.exercise_name}</p>
                                                            {exercise.notes && (
                                                                <p className="text-xs text-muted-foreground italic">{exercise.notes}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right text-xs text-muted-foreground">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <span className="font-medium text-foreground">{exercise.sets} séries</span>
                                                            <span>x</span>
                                                            <span className="font-medium text-foreground">{exercise.reps} reps</span>
                                                        </div>
                                                        {exercise.rest_time && (
                                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                                <Clock className="w-3 h-3" />
                                                                {exercise.rest_time}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default WorkoutList;
