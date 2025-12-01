import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, TrendingUp, TrendingDown, Activity, Scale, Ruler, ArrowLeft } from "lucide-react";
import { useAvaliacoesStats } from "@/hooks/useAvaliacoes";
import EvolutionChart from "@/components/EvolutionChart";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/hooks/useStudents";
import { Badge } from "@/components/ui/badge";
import { calculateBMR, calculateTDEE, ACTIVITY_LEVELS } from "@/constants/metabolism";
import { Zap, Flame, Camera } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAvaliacoesStats(studentId);
  const { data: student } = useStudent(studentId || "");

  const [photoLeftId, setPhotoLeftId] = useState<string>("");
  const [photoRightId, setPhotoRightId] = useState<string>("");
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "O link do dashboard foi copiado para a área de transferência.",
    });
  };

  const latest = stats?.latest;
  const evolution = stats?.evolution || [];
  const hasData = stats && stats.count > 0;

  // Set default values for photo comparison when data loads
  useEffect(() => {
    if (evolution.length > 0 && !photoLeftId && !photoRightId) {
      setPhotoLeftId(evolution[0].id || "");
      setPhotoRightId(latest?.id || "");
    }
  }, [evolution, latest, photoLeftId, photoRightId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const leftEval = evolution.find(e => e.id === photoLeftId);
  const rightEval = evolution.find(e => e.id === photoRightId);

  const bmr = latest ? calculateBMR(latest.peso, latest.altura, latest.idade, latest.sexo) : 0;
  const tdee = latest ? calculateTDEE(bmr, latest.activity_level || "moderate") : 0;
  const activityLabel = latest ? ACTIVITY_LEVELS.find(l => l.value === (latest.activity_level || "moderate"))?.label : "Moderado";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {studentId && (
          <Button
            variant="ghost"
            className="mb-6 gap-2 pl-0 hover:pl-2 transition-all"
            onClick={() => navigate(`/students/${studentId}`)}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Detalhes do Aluno
          </Button>
        )}



        // ... inside return JSX, near the title
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Dashboard de Performance
            </h1>
            <p className="text-muted-foreground">
              {student
                ? `Acompanhe a evolução de ${student.name}`
                : "Acompanhe sua evolução física e análise de composição corporal"}
            </p>
          </div>
          <Button onClick={handleShare} variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
        </div>

        <Tabs defaultValue="evolution" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="evolution" className="gap-2">
              <LineChart className="w-4 h-4" />
              Evolução
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2">
              <Activity className="w-4 h-4" />
              Fotos
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Análise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evolution" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Evolução Completa - Todos os Registros
              </h2>
              <p className="text-muted-foreground">
                Acompanhe sua evolução ao longo de todos os meses do arquivo de avaliação
              </p>
            </div>

            {hasData && evolution.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Chart 1: Peso e % Gordura */}
                <EvolutionChart
                  data={evolution}
                  title="Peso e % Gordura - Todos os Meses"
                  dataKeys={[
                    { key: "peso", name: "Peso (kg)", color: "#3b82f6", yAxisId: "left" }, // Blue
                    { key: "percentual_gordura", name: "% Gordura Corporal", color: "#ef4444", yAxisId: "right" }, // Red
                  ]}
                />

                {/* Chart 2: Massa Magra */}
                <EvolutionChart
                  data={evolution}
                  title="Massa Magra - Todos os Meses"
                  dataKeys={[
                    { key: "massa_magra", name: "Massa Magra (kg)", color: "#10b981", yAxisId: "left" }, // Green
                  ]}
                />
              </div>
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Gráfico de Evolução</CardTitle>
                  <CardDescription>
                    Acompanhe sua progressão ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Faça sua primeira avaliação para visualizar os gráficos</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasData && evolution.length > 0 && (
              <div className="mt-12 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Activity className="w-6 h-6 text-primary" />
                    {evolution.length > 1 ? "Comparação Detalhada entre Meses" : "Resumo da Avaliação Atual"}
                  </h2>
                  <p className="text-muted-foreground">
                    {evolution.length > 1
                      ? "Análise comparativa entre a primeira e a última avaliação"
                      : "Detalhes da sua composição corporal atual"}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* Card 1: Composição Corporal */}
                  <ComparisonCard
                    title="Composição Corporal"
                    icon={<Scale className="w-5 h-5 text-yellow-500" />}
                    showDiff={evolution.length > 1}
                    items={[
                      { label: "Peso", oldVal: evolution[0].peso, newVal: latest!.peso, unit: "kg", inverse: true },
                      { label: "% Gordura", oldVal: evolution[0].percentual_gordura, newVal: latest!.percentual_gordura, unit: "%", inverse: true },
                      { label: "Massa Magra", oldVal: evolution[0].massa_magra, newVal: latest!.massa_magra, unit: "kg", inverse: false },
                    ]}
                  />

                  {/* Card 2: Circunferências (Principais) */}
                  <ComparisonCard
                    title="Circunferências Principais"
                    icon={<Ruler className="w-5 h-5 text-blue-400" />}
                    showDiff={evolution.length > 1}
                    items={[
                      { label: "Ombros", oldVal: evolution[0].ombros, newVal: latest!.ombros, unit: "cm", inverse: false },
                      { label: "Tórax", oldVal: evolution[0].torax, newVal: latest!.torax, unit: "cm", inverse: false },
                      { label: "Cintura", oldVal: evolution[0].cintura, newVal: latest!.cintura, unit: "cm", inverse: true },
                      { label: "Abdômen", oldVal: evolution[0].abdomen, newVal: latest!.abdomen, unit: "cm", inverse: true },
                      { label: "Quadril", oldVal: evolution[0].quadril, newVal: latest!.quadril, unit: "cm", inverse: false },
                      { label: "Braço Dir.", oldVal: evolution[0].braco_relaxado, newVal: latest!.braco_relaxado, unit: "cm", inverse: false },
                    ]}
                  />

                  {/* Card 3: Dobras Cutâneas */}
                  <ComparisonCard
                    title="Dobras Cutâneas"
                    icon={<Activity className="w-5 h-5 text-blue-300" />}
                    showDiff={evolution.length > 1}
                    items={[
                      { label: "Tríceps", oldVal: evolution[0].tricipital, newVal: latest!.tricipital, unit: "mm", inverse: true },
                      { label: "Subescapular", oldVal: evolution[0].subescapular, newVal: latest!.subescapular, unit: "mm", inverse: true },
                      { label: "Abdominal", oldVal: evolution[0].abdominal, newVal: latest!.abdominal, unit: "mm", inverse: true },
                      { label: "Suprailíaca", oldVal: evolution[0].suprailiaca, newVal: latest!.suprailiaca, unit: "mm", inverse: true },
                    ]}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Comparação de Fotos</CardTitle>
                <CardDescription>
                  Visualize sua transformação física ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {evolution.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Avaliação 1 (Antes)</label>
                        <Select value={photoLeftId} onValueChange={setPhotoLeftId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma data" />
                          </SelectTrigger>
                          <SelectContent>
                            {evolution.map((av) => (
                              <SelectItem key={av.id} value={av.id || ""}>
                                {new Date(av.data_avaliacao).toLocaleDateString("pt-BR")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Avaliação 2 (Depois)</label>
                        <Select value={photoRightId} onValueChange={setPhotoRightId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma data" />
                          </SelectTrigger>
                          <SelectContent>
                            {evolution.map((av) => (
                              <SelectItem key={av.id} value={av.id || ""}>
                                {new Date(av.data_avaliacao).toLocaleDateString("pt-BR")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      {[
                        { title: "Frente", key: "foto_frente" },
                        { title: "Lateral", key: "foto_lateral" },
                        { title: "Costas", key: "foto_costas" },
                      ].map((view) => (
                        <div key={view.key} className="space-y-4">
                          <h3 className="font-semibold text-center">{view.title}</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="aspect-[3/4] bg-muted/20 rounded-lg overflow-hidden relative border border-border/50">
                              {leftEval && leftEval[view.key as keyof typeof leftEval] ? (
                                <img
                                  src={leftEval[view.key as keyof typeof leftEval] as string}
                                  alt={`${view.title} Antes`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                  <Camera className="w-8 h-8 opacity-20" />
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                {leftEval ? new Date(leftEval.data_avaliacao).toLocaleDateString("pt-BR") : "-"}
                              </div>
                            </div>
                            <div className="aspect-[3/4] bg-muted/20 rounded-lg overflow-hidden relative border border-border/50">
                              {rightEval && rightEval[view.key as keyof typeof rightEval] ? (
                                <img
                                  src={rightEval[view.key as keyof typeof rightEval] as string}
                                  alt={`${view.title} Depois`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                  <Camera className="w-8 h-8 opacity-20" />
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                {rightEval ? new Date(rightEval.data_avaliacao).toLocaleDateString("pt-BR") : "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>Adicione fotos nas avaliações para comparar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {hasData && latest ? (
              <>
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Análise de Composição Corporal</CardTitle>
                    <CardDescription>
                      Análise detalhada baseada na última avaliação ({new Date(latest.data_avaliacao).toLocaleDateString("pt-BR")})
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Scale className="w-5 h-5 text-primary" />
                          Dados Básicos
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">Altura</p>
                            <p className="text-lg font-semibold">{latest.altura} cm</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">Peso</p>
                            <p className="text-lg font-semibold">{latest.peso} kg</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">Idade</p>
                            <p className="text-lg font-semibold">{latest.idade} anos</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">IMC</p>
                            <p className="text-lg font-semibold">{latest.imc?.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Activity className="w-5 h-5 text-secondary" />
                          Composição Corporal
                        </h3>
                        <div className="space-y-2">
                          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                            <p className="text-sm text-muted-foreground">Percentual de Gordura</p>
                            <p className="text-2xl font-bold text-primary">{latest.percentual_gordura?.toFixed(1)}%</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-success/10 rounded-lg">
                              <p className="text-xs text-muted-foreground">Massa Magra</p>
                              <p className="text-lg font-semibold text-success">{latest.massa_magra?.toFixed(1)} kg</p>
                            </div>
                            <div className="p-3 bg-destructive/10 rounded-lg">
                              <p className="text-xs text-muted-foreground">Massa Gorda</p>
                              <p className="text-lg font-semibold text-destructive">{latest.massa_gorda?.toFixed(1)} kg</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-border">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Metabolismo e Gasto Calórico
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <p className="text-sm text-muted-foreground">Taxa Metabólica Basal (TMB)</p>
                          </div>
                          <p className="text-2xl font-bold">{bmr.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">kcal/dia</span></p>
                          <p className="text-xs text-muted-foreground mt-1">Gasto em repouso absoluto</p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-orange-500" />
                            <p className="text-sm text-muted-foreground">Gasto Calórico Total (GCD)</p>
                          </div>
                          <p className="text-2xl font-bold text-orange-500">{tdee.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">kcal/dia</span></p>
                          <p className="text-xs text-muted-foreground mt-1">Estimativa real de gasto diário</p>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <p className="text-sm text-muted-foreground">Nível de Atividade</p>
                          </div>
                          <p className="text-lg font-semibold">{activityLabel}</p>
                          <p className="text-xs text-muted-foreground mt-1">Fator de atividade aplicado</p>
                        </div>
                      </div>
                    </div>

                    {(latest.cintura || latest.quadril) && (
                      <div className="space-y-3 pt-6 border-t border-border">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Ruler className="w-5 h-5 text-accent" />
                          Principais Circunferências
                        </h3>
                        <div className="grid gap-3 md:grid-cols-4">
                          {latest.cintura && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-xs text-muted-foreground">Cintura</p>
                              <p className="text-lg font-semibold">{latest.cintura} cm</p>
                            </div>
                          )}
                          {latest.quadril && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-xs text-muted-foreground">Quadril</p>
                              <p className="text-lg font-semibold">{latest.quadril} cm</p>
                            </div>
                          )}
                          {latest.torax && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-xs text-muted-foreground">Tórax</p>
                              <p className="text-lg font-semibold">{latest.torax} cm</p>
                            </div>
                          )}
                          {latest.braco_contraido && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-xs text-muted-foreground">Braço Contraído</p>
                              <p className="text-lg font-semibold">{latest.braco_contraido} cm</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {evolution.length > 1 && (
                      <div className="space-y-3 pt-6 border-t border-border">
                        <h3 className="font-semibold flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-success" />
                          Progresso Total
                        </h3>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="p-4 bg-card rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">Variação de Peso</p>
                            <p className="text-xl font-bold">
                              {(latest.peso - evolution[0].peso).toFixed(1)} kg
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {evolution.length} avaliações registradas
                            </p>
                          </div>
                          {latest.percentual_gordura && evolution[0].percentual_gordura && (
                            <div className="p-4 bg-card rounded-lg border border-border">
                              <p className="text-sm text-muted-foreground">Variação BF%</p>
                              <p className="text-xl font-bold">
                                {(latest.percentual_gordura - evolution[0].percentual_gordura).toFixed(1)}%
                              </p>
                            </div>
                          )}
                          {latest.massa_magra && evolution[0].massa_magra && (
                            <div className="p-4 bg-card rounded-lg border border-border">
                              <p className="text-sm text-muted-foreground">Ganho Massa Magra</p>
                              <p className="text-xl font-bold text-success">
                                {(latest.massa_magra - evolution[0].massa_magra).toFixed(1)} kg
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Análise de Composição Corporal</CardTitle>
                  <CardDescription>
                    Análise detalhada da sua composição corporal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center text-muted-foreground py-12">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Complete uma avaliação para ver sua análise detalhada</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div >
    </Layout >
  );
};

export default Dashboard;

const ComparisonCard = ({ title, icon, items, showDiff = true }: {
  title: string,
  icon: React.ReactNode,
  items: { label: string, oldVal?: number, newVal?: number, unit: string, inverse: boolean }[],
  showDiff?: boolean
}) => {
  return (
    <Card className="border-border/50 bg-[#1a1b4b] text-white border-none shadow-xl overflow-hidden flex flex-col">
      <CardHeader className="pb-4 border-b border-white/10">
        <CardTitle className="text-lg font-medium flex items-center justify-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
        {items.map((item, idx) => {
          if (item.newVal === undefined) return null;

          const diff = (item.oldVal !== undefined && item.newVal !== undefined) ? item.newVal - item.oldVal : 0;
          const isPositive = diff > 0;
          const isNeutral = diff === 0;

          let badgeColor = "bg-gray-700 text-gray-300";
          if (!isNeutral) {
            if (item.inverse) {
              badgeColor = isPositive ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400";
            } else {
              badgeColor = isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400";
            }
          }

          return (
            <div key={idx} className="bg-[#242555] rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-gray-300 font-medium w-1/3">{item.label}</span>
              <div className="flex items-center gap-4 flex-1 justify-end">
                {showDiff && item.oldVal !== undefined && (
                  <span className="text-sm text-gray-400">{item.oldVal.toFixed(1)} {item.unit}</span>
                )}
                <span className="text-sm font-bold">{item.newVal.toFixed(1)} {item.unit}</span>
                {showDiff && !isNeutral && (
                  <Badge className={`${badgeColor} border-none`}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
