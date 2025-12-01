import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Student {
  id: string;
  created_at: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date: string;
  gender: "M" | "F";
  objective?: string;
}

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Student[];
    },
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Student;
    },
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student: Omit<Student, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("students")
        .insert(student)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Aluno cadastrado com sucesso!",
        description: "O aluno foi adicionado à sua lista.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Aluno excluído com sucesso!",
        description: "O aluno foi removido do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
