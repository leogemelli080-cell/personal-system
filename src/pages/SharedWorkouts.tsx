import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import WorkoutList from "@/components/WorkoutList";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useStudent } from "@/hooks/useStudents";

const SharedWorkouts = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { data: student } = useStudent(studentId || "");

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Dumbbell className="w-8 h-8 text-primary" />
                        Plano de Treino
                    </h1>
                    <p className="text-muted-foreground">
                        {student ? `Treinos de ${student.name}` : "Visualização de treinos"}
                    </p>
                </div>

                {studentId ? (
                    <WorkoutList studentId={studentId} readOnly={true} />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Erro</CardTitle>
                            <CardDescription>Aluno não encontrado.</CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default SharedWorkouts;
