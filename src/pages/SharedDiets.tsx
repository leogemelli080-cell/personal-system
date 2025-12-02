import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import DietList from "@/components/DietList";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { useStudent } from "@/hooks/useStudents";

const SharedDiets = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { data: student } = useStudent(studentId || "");

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Utensils className="w-8 h-8 text-primary" />
                        Plano Alimentar
                    </h1>
                    <p className="text-muted-foreground">
                        {student ? `Dieta de ${student.name}` : "Visualização de dieta"}
                    </p>
                </div>

                {studentId ? (
                    <DietList studentId={studentId} readOnly={true} />
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

export default SharedDiets;
