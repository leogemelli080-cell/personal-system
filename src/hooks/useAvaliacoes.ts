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
  peitoral?: number;        // Homens JP7
  tricipital?: number;
  subescapular?: number;
  bicipital?: number;       // Mulheres JP7
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

// ─── Fórmulas de composição corporal ────────────────────────────────────────

/**
 * Calcula IMC (kg/m²)
 */
export const calcIMC = (peso: number, alturaM: number): number =>
  parseFloat((peso / (alturaM * alturaM)).toFixed(2));

/**
 * Calcula % de gordura via Jackson & Pollock 7 dobras (protocolo por sexo)
 *
 * Homens  (JP7-M): peitoral, axilar_media, tricipital, subescapular, abdominal, suprailiaca, coxa_frontal
 *   (se peitoral ausente, usa panturrilha_medial como fallback)
 * Mulheres (JP7-F): tricipital, subescapular, bicipital, axilar_media, suprailiaca, abdominal, coxa_frontal
 */
export const calcPercentualGordura = (av: Partial<Avaliacao>): number | null => {
  const n = (v?: number) => v ?? 0;
  let soma = 0;

  if (av.sexo === "M") {
    soma =
      n(av.peitoral ?? av.panturrilha_medial) +
      n(av.axilar_media) +
      n(av.tricipital) +
      n(av.subescapular) +
      n(av.abdominal) +
      n(av.suprailiaca) +
      n(av.coxa_frontal);
    if (soma === 0 || !av.idade) return null;
    const D = 1.112 - 0.00043499 * soma + 0.00000055 * soma ** 2 - 0.00028826 * av.idade;
    return parseFloat(((4.95 / D - 4.5) * 100).toFixed(2));
  }

  if (av.sexo === "F") {
    soma =
      n(av.tricipital) +
      n(av.subescapular) +
      n(av.bicipital) +
      n(av.axilar_media) +
      n(av.suprailiaca) +
      n(av.abdominal) +
      n(av.coxa_frontal);
    if (soma === 0 || !av.idade) return null;
    const D = 1.097 - 0.00046971 * soma + 0.00000056 * soma ** 2 - 0.00012828 * av.idade;
    return parseFloat(((4.95 / D - 4.5) * 100).toFixed(2));
  }

  return null;
};

// ────────────────────────────────────────────────────────────────────────────

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
      const altura_m = avaliacao.altura / 100;
      const imc = calcIMC(avaliacao.peso, altura_m);
      const percentual_gordura = calcPercentualGordura(avaliacao) ?? 0;
      const massa_gorda = parseFloat(((avaliacao.peso * percentual_gordura) / 100).toFixed(2));
      const massa_magra = parseFloat((avaliacao.peso - massa_gorda).toFixed(2));

      const { data, error } = await supabase
        .from("avaliacoes")
        .insert({
          ...avaliacao,
          imc,
          percentual_gordura,
          massa_gorda,
          massa_magra,
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

export const useUpdateAvaliacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avaliacao: Avaliacao & { id: string }) => {
      const altura_m = avaliacao.altura / 100;
      const imc = calcIMC(avaliacao.peso, altura_m);
      const percentual_gordura = calcPercentualGordura(avaliacao) ?? 0;
      const massa_gorda = parseFloat(((avaliacao.peso * percentual_gordura) / 100).toFixed(2));
      const massa_magra = parseFloat((avaliacao.peso - massa_gorda).toFixed(2));

      const { id, student_id, created_at, ...updateData } = avaliacao;

      const { data, error } = await supabase
        .from("avaliacoes")
        .update({
          ...updateData,
          imc: parseFloat(imc.toFixed(2)),
          percentual_gordura: parseFloat(percentual_gordura.toFixed(2)),
          massa_gorda: parseFloat(massa_gorda.toFixed(2)),
          massa_magra: parseFloat(massa_magra.toFixed(2)),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["avaliacoes"] });
      queryClient.invalidateQueries({ queryKey: ["avaliacao", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["avaliacoes-stats"] });
      toast({
        title: "Avaliação atualizada com sucesso!",
        description: "Os dados foram atualizados no sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar avaliação",
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
