import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, User, Ruler, Activity, Camera, ArrowLeft } from "lucide-react";
import { useCreateAvaliacao, Avaliacao } from "@/hooks/useAvaliacoes";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "@/hooks/useStudents";
import { supabase } from "@/integrations/supabase/client";

import { ACTIVITY_LEVELS } from "@/constants/metabolism";

const AvaliacaoPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const createAvaliacao = useCreateAvaliacao();
  const { data: student, isLoading: isLoadingStudent } = useStudent(studentId || "");

  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: "",
    dataAvaliacao: new Date().toISOString().split("T")[0],
    idade: "",
    sexo: "M",
    altura: "",
    peso: "",
    activityLevel: "moderate",

    // Circunferências (cm)
    pescoco: "",
    ombros: "",
    torax: "",
    cintura: "",
    abdomen: "",
    quadril: "",
    coxaProximal: "",
    coxaMedial: "",
    coxaDistal: "",
    panturrilha: "",
    bracoRelaxado: "",
    bracoContraido: "",
    antebraco: "",
    punho: "",

    // Dobras Cutâneas (mm)
    tricipital: "",
    subescapular: "",
    bicipital: "",
    axilarMedia: "",
    suprailiaca: "",
    abdominal: "",
    coxaFrontal: "",
    panturrilhaMedial: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    foto_frente: null,
    foto_lateral: null,
    foto_costas: null,
  });

  const [previews, setPreviews] = useState<{ [key: string]: string }>({
    foto_frente: "",
    foto_lateral: "",
    foto_costas: "",
  });

  useEffect(() => {
    if (student) {
      const age = new Date().getFullYear() - new Date(student.birth_date).getFullYear();
      setFormData(prev => ({
        ...prev,
        nome: student.name,
        idade: age.toString(),
        sexo: student.gender,
      }));
    }
  }, [student]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calcularIMC = () => {
    const peso = parseFloat(formData.peso);
    const altura = parseFloat(formData.altura) / 100;

    if (peso && altura) {
      return (peso / (altura * altura)).toFixed(2);
    }
    return "--";
  };

  const calcularPercentualGordura = () => {
    // Fórmula de 7 dobras (Jackson & Pollock)
    const dobras = [
      parseFloat(formData.tricipital || "0"),
      parseFloat(formData.subescapular || "0"),
      parseFloat(formData.axilarMedia || "0"),
      parseFloat(formData.suprailiaca || "0"),
      parseFloat(formData.abdominal || "0"),
      parseFloat(formData.coxaFrontal || "0"),
      parseFloat(formData.panturrilhaMedial || "0"),
    ];

    const somaDobras = dobras.reduce((a, b) => a + b, 0);
    const idade = parseInt(formData.idade || "0");

    if (somaDobras > 0 && idade > 0) {
      const densidadeCorporal = formData.sexo === "M"
        ? 1.112 - (0.00043499 * somaDobras) + (0.00000055 * somaDobras * somaDobras) - (0.00028826 * idade)
        : 1.097 - (0.00046971 * somaDobras) + (0.00000056 * somaDobras * somaDobras) - (0.00012828 * idade);

      const percentualGordura = ((4.95 / densidadeCorporal) - 4.5) * 100;
      return percentualGordura.toFixed(2);
    }
    return "--";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const avaliacaoData: Avaliacao = {
        student_id: studentId,
        nome: formData.nome,
        data_avaliacao: formData.dataAvaliacao,
        idade: parseInt(formData.idade),
        sexo: formData.sexo as "M" | "F",
        altura: parseFloat(formData.altura),
        peso: parseFloat(formData.peso),
        activity_level: formData.activityLevel,

        // Circunferências
        pescoco: formData.pescoco ? parseFloat(formData.pescoco) : undefined,
        ombros: formData.ombros ? parseFloat(formData.ombros) : undefined,
        torax: formData.torax ? parseFloat(formData.torax) : undefined,
        cintura: formData.cintura ? parseFloat(formData.cintura) : undefined,
        abdomen: formData.abdomen ? parseFloat(formData.abdomen) : undefined,
        quadril: formData.quadril ? parseFloat(formData.quadril) : undefined,
        coxa_proximal: formData.coxaProximal ? parseFloat(formData.coxaProximal) : undefined,
        coxa_medial: formData.coxaMedial ? parseFloat(formData.coxaMedial) : undefined,
        coxa_distal: formData.coxaDistal ? parseFloat(formData.coxaDistal) : undefined,
        panturrilha: formData.panturrilha ? parseFloat(formData.panturrilha) : undefined,
        braco_relaxado: formData.bracoRelaxado ? parseFloat(formData.bracoRelaxado) : undefined,
        braco_contraido: formData.bracoContraido ? parseFloat(formData.bracoContraido) : undefined,
        antebraco: formData.antebraco ? parseFloat(formData.antebraco) : undefined,
        punho: formData.punho ? parseFloat(formData.punho) : undefined,

        // Dobras cutâneas
        tricipital: formData.tricipital ? parseFloat(formData.tricipital) : undefined,
        subescapular: formData.subescapular ? parseFloat(formData.subescapular) : undefined,
        bicipital: formData.bicipital ? parseFloat(formData.bicipital) : undefined,
        axilar_media: formData.axilarMedia ? parseFloat(formData.axilarMedia) : undefined,
        suprailiaca: formData.suprailiaca ? parseFloat(formData.suprailiaca) : undefined,
        abdominal: formData.abdominal ? parseFloat(formData.abdominal) : undefined,
        coxa_frontal: formData.coxaFrontal ? parseFloat(formData.coxaFrontal) : undefined,
        panturrilha_medial: formData.panturrilhaMedial ? parseFloat(formData.panturrilhaMedial) : undefined,
      };

      // Upload photos
      const photoFields = ["foto_frente", "foto_lateral", "foto_costas"];
      for (const field of photoFields) {
        const file = files[field];
        if (file) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${field}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("evaluation-photos")
            .upload(filePath, file);

          if (uploadError) {
            console.error(`Error uploading ${field}:`, uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from("evaluation-photos")
            .getPublicUrl(filePath);

          // @ts-ignore
          avaliacaoData[field] = publicUrl;
        }
      }

      await createAvaliacao.mutateAsync(avaliacaoData);

      // Limpa o formulário
      setFormData({
        nome: "",
        dataAvaliacao: new Date().toISOString().split('T')[0],
        idade: "",
        sexo: "",
        altura: "",
        peso: "",
        activityLevel: "moderate",
        pescoco: "",
        ombros: "",
        torax: "",
        cintura: "",
        abdomen: "",
        quadril: "",
        coxaProximal: "",
        coxaMedial: "",
        coxaDistal: "",
        panturrilha: "",
        bracoRelaxado: "",
        bracoContraido: "",
        antebraco: "",
        punho: "",
        tricipital: "",
        subescapular: "",
        bicipital: "",
        axilarMedia: "",
        suprailiaca: "",
        abdominal: "",
        coxaFrontal: "",
        panturrilhaMedial: "",
      });
      setFiles({ foto_frente: null, foto_lateral: null, foto_costas: null });
      setPreviews({ foto_frente: "", foto_lateral: "", foto_costas: "" });

      // Redireciona para o dashboard do aluno ou geral
      setTimeout(() => {
        if (studentId) {
          navigate(`/students/${studentId}`);
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
    }
  };

  if (studentId && isLoadingStudent) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

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

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Avaliação Física
          </h1>
          <p className="text-muted-foreground">
            {student ? `Nova avaliação para ${student.name}` : "Complete sua avaliação antropométrica completa"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="pessoais" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="pessoais" className="gap-1 md:gap-2 text-xs md:text-sm">
                <User className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Dados Pessoais</span>
                <span className="sm:hidden">Dados</span>
              </TabsTrigger>
              <TabsTrigger value="circunferencias" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Ruler className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Circunferências</span>
                <span className="sm:hidden">Circunf.</span>
              </TabsTrigger>
              <TabsTrigger value="dobras" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Activity className="w-3 h-3 md:w-4 md:h-4" />
                <span>Dobras</span>
              </TabsTrigger>
              <TabsTrigger value="fotos" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Camera className="w-3 h-3 md:w-4 md:h-4" />
                <span>Fotos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pessoais">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Informações básicas para a avaliação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        placeholder="Digite seu nome"
                        required
                        disabled={!!studentId} // Disable name edit if linked to student
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataAvaliacao">Data da Avaliação *</Label>
                      <Input
                        id="dataAvaliacao"
                        type="date"
                        value={formData.dataAvaliacao}
                        onChange={(e) => handleChange("dataAvaliacao", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idade">Idade *</Label>
                      <Input
                        id="idade"
                        type="number"
                        value={formData.idade}
                        onChange={(e) => handleChange("idade", e.target.value)}
                        placeholder="Ex: 25"
                        required
                        disabled={!!studentId}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo *</Label>
                      <Select
                        value={formData.sexo}
                        onValueChange={(value) => handleChange("sexo", value)}
                        disabled={!!studentId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="altura">Altura (cm) *</Label>
                      <Input
                        id="altura"
                        type="number"
                        step="0.1"
                        value={formData.altura}
                        onChange={(e) => handleChange("altura", e.target.value)}
                        placeholder="Ex: 175"
                        required
                      />
                    </div>

                    <Label htmlFor="peso">Peso (kg) *</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      value={formData.peso}
                      onChange={(e) => handleChange("peso", e.target.value)}
                      placeholder="Ex: 75.5"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Nível de Atividade *</Label>
                    <Select
                      value={formData.activityLevel}
                      onValueChange={(value) => handleChange("activityLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {ACTIVITY_LEVELS.find(l => l.value === formData.activityLevel)?.description}
                    </p>

                  </div>

                  <div className="grid gap-4 md:grid-cols-2 pt-6 border-t border-border">
                    <Card className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">IMC Calculado</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{calcularIMC()}</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">% Gordura Estimado</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-secondary">{calcularPercentualGordura()}%</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="circunferencias">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Circunferências (cm)</CardTitle>
                  <CardDescription>Medidas de perímetros corporais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { id: "pescoco", label: "Pescoço" },
                      { id: "ombros", label: "Ombros" },
                      { id: "torax", label: "Tórax" },
                      { id: "cintura", label: "Cintura" },
                      { id: "abdomen", label: "Abdômen" },
                      { id: "quadril", label: "Quadril" },
                      { id: "coxaProximal", label: "Coxa Proximal" },
                      { id: "coxaMedial", label: "Coxa Medial" },
                      { id: "coxaDistal", label: "Coxa Distal" },
                      { id: "panturrilha", label: "Panturrilha" },
                      { id: "bracoRelaxado", label: "Braço Relaxado" },
                      { id: "bracoContraido", label: "Braço Contraído" },
                      { id: "antebraco", label: "Antebraço" },
                      { id: "punho", label: "Punho" },
                    ].map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          id={field.id}
                          type="number"
                          step="0.1"
                          value={formData[field.id as keyof typeof formData]}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dobras">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Dobras Cutâneas (mm)</CardTitle>
                  <CardDescription>Medidas de composição corporal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { id: "tricipital", label: "Tricipital" },
                      { id: "subescapular", label: "Subescapular" },
                      { id: "bicipital", label: "Bicipital" },
                      { id: "axilarMedia", label: "Axilar Média" },
                      { id: "suprailiaca", label: "Suprailíaca" },
                      { id: "abdominal", label: "Abdominal" },
                      { id: "coxaFrontal", label: "Coxa Frontal" },
                      { id: "panturrilhaMedial", label: "Panturrilha Medial" },
                    ].map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          id={field.id}
                          type="number"
                          step="0.1"
                          value={formData[field.id as keyof typeof formData]}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fotos">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Fotos da Avaliação</CardTitle>
                  <CardDescription>Upload de fotos para acompanhamento visual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { id: "foto_frente", label: "Frente" },
                      { id: "foto_lateral", label: "Lateral" },
                      { id: "foto_costas", label: "Costas" },
                    ].map((position) => (
                      <div key={position.id} className="space-y-2">
                        <Label>{position.label}</Label>
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer relative aspect-[3/4] flex flex-col items-center justify-center overflow-hidden bg-muted/10"
                          onClick={() => document.getElementById(position.id)?.click()}
                        >
                          {previews[position.id as keyof typeof previews] ? (
                            <img
                              src={previews[position.id as keyof typeof previews]}
                              alt={position.label}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Clique para adicionar</p>
                            </>
                          )}
                          <input
                            type="file"
                            id={position.id}
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileChange(e, position.id)}
                          />
                        </div>
                        {previews[position.id as keyof typeof previews] && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFiles(prev => ({ ...prev, [position.id]: null }));
                              setPreviews(prev => ({ ...prev, [position.id]: "" }));
                            }}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => studentId ? navigate(`/students/${studentId}`) : navigate("/dashboard")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              disabled={createAvaliacao.isPending}
            >
              <Save className="w-4 h-4" />
              {createAvaliacao.isPending ? "Salvando..." : "Salvar Avaliação"}
            </Button>
          </div>
        </form>
      </div>
    </Layout >
  );
};

export default AvaliacaoPage;
