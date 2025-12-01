import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Avaliacao {
  id?: string;
  student_id?: string;
  created_at?: string;
  nome: string;
  data_avaliacao: string;
  idade: number;
  sexo: "M" | "F";
  altura: number;
  peso: number;
  imc?: number;
  percentual_gordura?: number;
  massa_magra?: number;
  activity_level?: string;
  massa_gorda?: number;

  // Circunferências
  pescoco?: number;
  ombros?: number;
  torax?: number;
  cintura?: number;
  abdomen?: number;
  quadril?: number;
  coxa_proximal?: number;
  coxa_medial?: number;
  coxa_distal?: number;
  panturrilha?: number;
  braco_relaxado?: number;
  braco_contraido?: number;
  antebraco?: number;
  punho?: number;

  // Dobras cutâneas
  tricipital?: number;
  subescapular?: number;
  bicipital?: number;
  axilar_media?: number;
  suprailiaca?: number;
  abdominal?: number;
  coxa_frontal?: number;
  panturrilha_medial?: number;

  // Fotos
  foto_frente?: string;
  foto_lateral?: string;
  foto_costas?: string;
}

export const useAvaliacoes = (studentId?: string) => {
  return useQuery({
    queryKey: ["avaliacoes", studentId],
    queryFn: async () => {
      let query = supabase
        .from("avaliacoes")
        .select("*")
        .order("data_avaliacao", { ascending: false });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Avaliacao[];
    },
    enabled: !!studentId, // Only fetch if studentId is provided (or remove this if you want to fetch all)
  });
};

export const useAvaliacao = (id?: string) => {
  return useQuery({
    queryKey: ["avaliacao", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Avaliacao;
    },
    enabled: !!id,
  });
};

export const useCreateAvaliacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avaliacao: Avaliacao) => {
      // Calcula valores automáticos
      const altura_m = avaliacao.altura / 100;
      const imc = avaliacao.peso / (altura_m * altura_m);

      // Cálculo do percentual de gordura (fórmula 7 dobras)
      const dobras = [
        avaliacao.tricipital || 0,
        avaliacao.subescapular || 0,
        avaliacao.axilar_media || 0,
        avaliacao.suprailiaca || 0,
        avaliacao.abdominal || 0,
        avaliacao.coxa_frontal || 0,
        avaliacao.panturrilha_medial || 0,
      ];

      const somaDobras = dobras.reduce((a, b) => a + b, 0);

      let percentual_gordura = 0;
      if (somaDobras > 0) {
        const densidadeCorporal = avaliacao.sexo === "M"
          ? 1.112 - (0.00043499 * somaDobras) + (0.00000055 * somaDobras * somaDobras) - (0.00028826 * avaliacao.idade)
          : 1.097 - (0.00046971 * somaDobras) + (0.00000056 * somaDobras * somaDobras) - (0.00012828 * avaliacao.idade);

        percentual_gordura = ((4.95 / densidadeCorporal) - 4.5) * 100;
      }

      const massa_gorda = (avaliacao.peso * percentual_gordura) / 100;
      const massa_magra = avaliacao.peso - massa_gorda;

      const { data, error } = await supabase
        .from("avaliacoes")
        .insert({
          ...avaliacao,
          imc: parseFloat(imc.toFixed(2)),
          percentual_gordura: parseFloat(percentual_gordura.toFixed(2)),
          massa_gorda: parseFloat(massa_gorda.toFixed(2)),
          massa_magra: parseFloat(massa_magra.toFixed(2)),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avaliacoes"] });
      toast({
        title: "Avaliação salva com sucesso!",
        description: "Seus dados foram registrados no sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar avaliação",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAvaliacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("avaliacoes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avaliacoes"] });
      queryClient.invalidateQueries({ queryKey: ["avaliacoes-stats"] });
      toast({
        title: "Avaliação excluída com sucesso!",
        description: "A avaliação foi removida do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir avaliação",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAvaliacoesStats = (studentId?: string) => {
  return useQuery({
    queryKey: ["avaliacoes-stats", studentId],
    queryFn: async () => {
      let query = supabase
        .from("avaliacoes")
        .select("*")
        .order("data_avaliacao", { ascending: true });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          latest: null,
          evolution: [],
          count: 0,
        };
      }

      return {
        latest: data[data.length - 1] as Avaliacao,
        evolution: data as Avaliacao[],
        count: data.length,
      };
    },
    enabled: !!studentId,
  });
};
