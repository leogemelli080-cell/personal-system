import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAvaliacao, useAvaliacoes, useAvaliacoesStats } from "@/hooks/useAvaliacoes";
import { useStudent } from "@/hooks/useStudents";
import { useWorkouts } from "@/hooks/useWorkouts";
import DietList from "@/components/DietList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Dumbbell, Utensils, Calendar, User, Download, TrendingUp, TrendingDown, Activity, Scale, Ruler, Zap, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EvolutionChart from "@/components/EvolutionChart";
import { calculateBMR, calculateTDEE, ACTIVITY_LEVELS } from "@/constants/metabolism";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const EvaluationReport = () => {
    const { id } = useParams<{ id: string }>();
    const { data: evaluation, isLoading: isLoadingEval } = useAvaliacao(id);
    const { data: student, isLoading: isLoadingStudent } = useStudent(evaluation?.student_id || "");
    const { data: allEvaluations } = useAvaliacoes(evaluation?.student_id);
    const { data: workouts } = useWorkouts(evaluation?.student_id || "");
    const { data: stats } = useAvaliacoesStats(evaluation?.student_id);

    const reportRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    if (isLoadingEval || isLoadingStudent) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!evaluation || !student) {
        return <div className="p-8 text-center">Avaliação não encontrada.</div>;
    }

    // Find comparison evaluation (previous one)
    const sortedEvaluations = allEvaluations?.sort((a, b) => new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime()) || [];
    const currentIndex = sortedEvaluations.findIndex(e => e.id === evaluation.id);
    const previousEvaluation = currentIndex !== -1 && currentIndex < sortedEvaluations.length - 1
        ? sortedEvaluations[currentIndex + 1]
        : null;

    const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

    // Analysis Data
    const bmr = calculateBMR(evaluation.peso, evaluation.altura, evaluation.idade, evaluation.sexo);
    const tdee = calculateTDEE(bmr, evaluation.activity_level || "moderate");
    const activityLabel = ACTIVITY_LEVELS.find(l => l.value === (evaluation.activity_level || "moderate"))?.label || "Moderado";
    const evolutionData = stats?.evolution || [];

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setIsGeneratingPdf(true);

        try {
            // Remove overflow-hidden temporariamente para capturar conteúdo completo
            const el = reportRef.current;
            const prevOverflow = el.style.overflow;
            const prevMaxH = el.style.maxHeight;
            el.style.overflow = "visible";
            el.style.maxHeight = "none";

            // Aguarda imagens e componentes assíncronos renderizarem
            await new Promise(resolve => setTimeout(resolve, 600));

            const totalHeight = el.scrollHeight;
            const totalWidth = el.scrollWidth;

            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: "#ffffff",
                width: totalWidth,
                height: totalHeight,
                scrollX: 0,
                scrollY: 0,
                windowWidth: totalWidth,
                windowHeight: totalHeight,
            });

            // Restaura estilos
            el.style.overflow = prevOverflow;
            el.style.maxHeight = prevMaxH;

            // Gera PDF em A4 com múltiplas páginas
            const A4_WIDTH_MM = 210;
            const A4_HEIGHT_MM = 297;
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

            const imgData = canvas.toDataURL("image/jpeg", 0.92);
            const imgWidthMM = A4_WIDTH_MM;
            const imgHeightMM = (canvas.height * A4_WIDTH_MM) / canvas.width;

            let posY = 0;
            let pageCount = 0;

            while (posY < imgHeightMM) {
                if (pageCount > 0) pdf.addPage();
                pdf.addImage(imgData, "JPEG", 0, -posY, imgWidthMM, imgHeightMM);
                posY += A4_HEIGHT_MM;
                pageCount++;
            }

            pdf.save(`Avaliacao_${student.name}_${formatDate(evaluation.data_avaliacao)}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Controls */}
            <div className="fixed bottom-6 right-6 z-50 print:hidden">
                <Button onClick={handleDownloadPDF} disabled={isGeneratingPdf} size="lg" className="shadow-xl">
                    {isGeneratingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    Baixar PDF (Celular)
                </Button>
            </div>

            {/* Report Content - This is what gets captured */}
            <div ref={reportRef} className="bg-white text-black max-w-[500px] mx-auto min-h-screen shadow-2xl overflow-visible">

                {/* Header */}
                <div className="bg-[#1a1b4b] text-white py-8 px-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Relatório de Performance</h1>
                            <p className="opacity-80 text-sm">Avaliação Física Completa</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{student.name}</p>
                            <p className="text-xs opacity-75">{formatDate(evaluation.data_avaliacao)}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">

                    {/* 1. Composition Summary */}
                    <section>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#1a1b4b]">
                            <Scale className="w-5 h-5" /> Resumo da Composição
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Weight Card */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Peso</p>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-2xl font-bold text-gray-900">{evaluation.peso}</span>
                                    <span className="text-sm text-gray-500 mb-1">kg</span>
                                </div>
                                {previousEvaluation && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="font-bold text-gray-700">{previousEvaluation.peso} kg</span>
                                        <span className={`flex items-center gap-0.5 ${evaluation.peso < previousEvaluation.peso ? 'text-green-600' : evaluation.peso > previousEvaluation.peso ? 'text-red-500' : 'text-gray-400'}`}>
                                            {evaluation.peso < previousEvaluation.peso ? <TrendingDown className="w-3 h-3" /> : evaluation.peso > previousEvaluation.peso ? <TrendingUp className="w-3 h-3" /> : null}
                                            {Math.abs(evaluation.peso - previousEvaluation.peso).toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Body Fat Card */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">% Gordura</p>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-2xl font-bold text-gray-900">{evaluation.percentual_gordura}</span>
                                    <span className="text-sm text-gray-500 mb-1">%</span>
                                </div>
                                {previousEvaluation ? (
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="font-bold text-gray-700">{previousEvaluation.percentual_gordura}%</span>
                                        <span className={`flex items-center gap-0.5 ${evaluation.percentual_gordura < previousEvaluation.percentual_gordura ? 'text-green-600' : evaluation.percentual_gordura > previousEvaluation.percentual_gordura ? 'text-red-500' : 'text-gray-400'}`}>
                                            {evaluation.percentual_gordura < previousEvaluation.percentual_gordura ? <TrendingDown className="w-3 h-3" /> : evaluation.percentual_gordura > previousEvaluation.percentual_gordura ? <TrendingUp className="w-3 h-3" /> : null}
                                            {Math.abs(evaluation.percentual_gordura - previousEvaluation.percentual_gordura).toFixed(1)}%
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">{evaluation.massa_gorda} kg de gordura</p>
                                )}
                            </div>

                            {/* Lean Mass Card */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 col-span-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Massa Magra</p>
                                        <div className="flex items-end gap-2 mb-1">
                                            <span className="text-3xl font-bold text-green-600">{evaluation.massa_magra}</span>
                                            <span className="text-sm text-gray-500 mb-1">kg</span>
                                        </div>
                                        {previousEvaluation && (
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="font-bold text-gray-700">{previousEvaluation.massa_magra || 0} kg</span>
                                                <span className={`flex items-center gap-0.5 ${evaluation.massa_magra > (previousEvaluation.massa_magra || 0) ? 'text-green-600' : evaluation.massa_magra < (previousEvaluation.massa_magra || 0) ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {evaluation.massa_magra > (previousEvaluation.massa_magra || 0) ? <TrendingUp className="w-3 h-3" /> : evaluation.massa_magra < (previousEvaluation.massa_magra || 0) ? <TrendingDown className="w-3 h-3" /> : null}
                                                    {Math.abs(evaluation.massa_magra - (previousEvaluation.massa_magra || 0)).toFixed(1)} kg
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Analysis & Metabolism */}
                    <section>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#1a1b4b]">
                            <Zap className="w-5 h-5" /> Análise Metabólica
                        </h2>
                        <div className="bg-gradient-to-br from-[#1a1b4b] to-[#2d2e6a] text-white rounded-xl p-5 shadow-lg">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-1 text-orange-300 mb-1">
                                        <Flame className="w-3 h-3" />
                                        <span className="text-xs font-bold uppercase">Basal (TMB)</span>
                                    </div>
                                    <p className="text-2xl font-bold">{bmr.toFixed(0)} <span className="text-xs font-normal opacity-70">kcal</span></p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-blue-300 mb-1">
                                        <Activity className="w-3 h-3" />
                                        <span className="text-xs font-bold uppercase">Total (GCD)</span>
                                    </div>
                                    <p className="text-2xl font-bold">{tdee.toFixed(0)} <span className="text-xs font-normal opacity-70">kcal</span></p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 text-xs opacity-80">
                                Nível de Atividade: <span className="font-semibold text-white">{activityLabel}</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Evolution Charts */}
                    {evolutionData.length > 1 && (
                        <section>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#1a1b4b]">
                                <TrendingUp className="w-5 h-5" /> Evolução
                            </h2>
                            <div className="space-y-4">
                                <EvolutionChart
                                    data={evolutionData}
                                    title="Peso e % Gordura"
                                    dataKeys={[
                                        { key: "peso", name: "Peso (kg)", color: "#3b82f6", yAxisId: "left" },
                                        { key: "percentual_gordura", name: "% Gordura", color: "#ef4444", yAxisId: "right" },
                                    ]}
                                />
                                <EvolutionChart
                                    data={evolutionData}
                                    title="Massa Magra"
                                    dataKeys={[
                                        { key: "massa_magra", name: "Massa Magra (kg)", color: "#10b981", yAxisId: "left" },
                                    ]}
                                />
                            </div>
                        </section>
                    )}

                    {/* 4. Photos */}
                    {(evaluation.foto_frente || evaluation.foto_lateral || evaluation.foto_costas) && (
                        <section>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#1a1b4b]">
                                <User className="w-5 h-5" /> Comparativo Visual
                            </h2>
                            <div className="space-y-6">
                                {['frente', 'lateral', 'costas'].map((view) => {
                                    const key = `foto_${view}` as keyof typeof evaluation;
                                    if (!evaluation[key]) return null;

                                    return (
                                        <div key={view} className="space-y-2">
                                            <h3 className="text-sm font-bold uppercase text-gray-500 text-center">{view}</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {previousEvaluation && previousEvaluation[key] ? (
                                                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                                                        <img src={previousEvaluation[key] as string} className="w-full h-full object-cover" />
                                                        <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-1">
                                                            {formatDate(previousEvaluation.data_avaliacao)}
                                                        </div>
                                                    </div>
                                                ) : <div className="bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">Sem anterior</div>}

                                                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-[#1a1b4b]">
                                                    <img src={evaluation[key] as string} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 w-full bg-[#1a1b4b] text-white text-[10px] text-center py-1">
                                                        Atual
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* 5. Workout Plan */}
                    {workouts && workouts.length > 0 && (
                        <section className="break-before-page">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#1a1b4b]">
                                <Dumbbell className="w-5 h-5" /> Plano de Treino
                            </h2>
                            {workouts.map((workout) => (
                                <div key={workout.id} className="mb-6 last:mb-0">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-1">{workout.name}</h3>
                                        <Badge variant="secondary" className="mb-4 text-xs">{workout.routine_type}</Badge>

                                        <div className="space-y-4">
                                            {workout.days?.map((day: any) => (
                                                <div key={day.id}>
                                                    <h4 className="text-sm font-bold text-[#1a1b4b] mb-2 uppercase border-b pb-1">{day.name}</h4>
                                                    <ul className="space-y-2">
                                                        {day.exercises?.map((ex: any, i: number) => (
                                                            <li key={i} className="text-sm">
                                                                <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
                                                                    <span className="font-medium text-gray-700">{ex.exercise_name}</span>
                                                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 whitespace-nowrap">
                                                                        {ex.sets}x {ex.reps}
                                                                    </span>
                                                                </div>
                                                                {ex.notes && (
                                                                    <p className="text-xs text-gray-500 italic mt-0.5 ml-0">
                                                                        📝 {ex.notes}
                                                                    </p>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* 6. Diet Plan */}
                    <section className="break-before-page">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#1a1b4b]">
                            <Utensils className="w-5 h-5" /> Plano Alimentar
                        </h2>
                        <div className="diet-list-container">
                            <DietList studentId={student.id} isPrintView={true} readOnly={true} />
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="text-center pt-8 pb-4 text-xs text-gray-400 border-t">
                        <p>Gerado por VYK System</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EvaluationReport;
