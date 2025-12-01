import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudent, useDeleteStudent } from "@/hooks/useStudents";
import { useAvaliacoes, useDeleteAvaliacao } from "@/hooks/useAvaliacoes";
import { User, Calendar, Activity, ArrowLeft, Plus, LayoutDashboard, Trash2, Dumbbell, Utensils, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import WorkoutCreator from "@/components/WorkoutCreator";
import WorkoutList from "@/components/WorkoutList";
import DietCreator from "@/components/DietCreator";
import DietList from "@/components/DietList";
import { useAvaliacoesStats } from "@/hooks/useAvaliacoes";
import { calculateBMR, calculateTDEE } from "@/constants/metabolism";

const StudentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: student, isLoading: isLoadingStudent } = useStudent(id || "");
    const { data: avaliacoes, isLoading: isLoadingAvaliacoes } = useAvaliacoes(id);
    const { data: stats } = useAvaliacoesStats(id);
    const deleteStudent = useDeleteStudent();
    const deleteAvaliacao = useDeleteAvaliacao();

    const latestEval = stats?.latest;
    const bmr = latestEval ? calculateBMR(latestEval.peso, latestEval.altura, latestEval.idade, latestEval.sexo) : 0;
    const tdee = latestEval ? calculateTDEE(bmr, latestEval.activity_level || "moderate") : 2000; // Default 2000 if no data

    const handleDeleteStudent = async () => {
        if (id) {
            await deleteStudent.mutateAsync(id);
            navigate("/students");
        }
    };

    const handleDeleteAvaliacao = async (avaliacaoId: string) => {
        await deleteAvaliacao.mutateAsync(avaliacaoId);
    };

    if (isLoadingStudent || isLoadingAvaliacoes) {
        return (
            <Layout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    if (!student) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Aluno não encontrado</h1>
                    <Button onClick={() => navigate("/students")}>Voltar para Lista</Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate("/students")}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Alunos
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {new Date().getFullYear() - new Date(student.birth_date).getFullYear()} anos
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Nasc: {new Date(student.birth_date).toLocaleDateString("pt-BR")}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Excluir Aluno
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Isso excluirá permanentemente o aluno
                                        e todas as suas avaliações associadas.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Excluir
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => navigate(`/dashboard/${student.id}`)}
                            disabled={!avaliacoes || avaliacoes.length === 0}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Ver Dashboard
                        </Button>
                        <Button
                            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                            onClick={() => navigate(`/avaliacao/${student.id}`)}
                        >
                            <Plus className="w-4 h-4" />
                            Nova Avaliação
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="workouts" className="gap-2">
                            <Dumbbell className="w-4 h-4" />
                            Treinos
                        </TabsTrigger>
                        <TabsTrigger value="diets" className="gap-2">
                            <Utensils className="w-4 h-4" />
                            Dietas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Objetivo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium">{student.objective || "Não definido"}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Contato</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{student.email || "Sem email"}</p>
                                    <p className="text-sm">{student.phone || "Sem telefone"}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Avaliações</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{avaliacoes?.length || 0}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Histórico de Avaliações
                        </h2>

                        {!avaliacoes || avaliacoes.length === 0 ? (
                            <Card className="border-dashed bg-muted/30">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <Activity className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação registrada</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Realize a primeira avaliação física deste aluno para começar a acompanhar sua evolução.
                                    </p>
                                    <Button onClick={() => navigate(`/avaliacao/${student.id}`)}>
                                        Realizar Primeira Avaliação
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {avaliacoes.map((avaliacao) => (
                                    <Card key={avaliacao.id} className="hover:bg-muted/50 transition-colors group relative">
                                        <CardContent className="flex items-center justify-between p-6">
                                            <div className="grid gap-1">
                                                <p className="font-semibold text-lg">
                                                    {new Date(avaliacao.data_avaliacao).toLocaleDateString("pt-BR")}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {avaliacao.peso} kg • {avaliacao.percentual_gordura}% Gordura • IMC {avaliacao.imc}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-sm font-medium text-success">
                                                        MM: {avaliacao.massa_magra} kg
                                                    </p>
                                                    <p className="text-sm font-medium text-destructive">
                                                        MG: {avaliacao.massa_gorda} kg
                                                    </p>
                                                </div>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Essa ação não pode ser desfeita.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteAvaliacao(avaliacao.id!)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Excluir
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <Button variant="outline" size="sm" asChild>
                                                    <Link to={`/dashboard/${id}`}>Ver Dashboard</Link>
                                                </Button>
                                                <Button variant="secondary" size="sm" asChild>
                                                    <Link to={`/report/${avaliacao.id}`} target="_blank">
                                                        <Share2 className="w-4 h-4 mr-2" />
                                                        Compartilhar
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>



                    <TabsContent value="workouts" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Criar Novo Treino</h2>
                                <WorkoutCreator studentId={id!} onSuccess={() => {
                                    // Refresh logic if needed, or just let React Query handle it
                                }} />
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Treinos Atuais</h2>
                                <WorkoutList studentId={id!} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="diets" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-5">
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-2xl font-bold">Gerador de Dieta</h2>
                                <DietCreator studentId={id!} tdee={tdee} onSuccess={() => { }} />
                            </div>
                            <div className="lg:col-span-3 space-y-6">
                                <h2 className="text-2xl font-bold">Planos Alimentares</h2>
                                <DietList studentId={id!} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default StudentDetails;
