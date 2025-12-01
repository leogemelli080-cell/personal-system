import { z } from "zod";

export const avaliacaoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  data_avaliacao: z.string().min(1, "Data é obrigatória"),
  idade: z.number().min(10, "Idade mínima: 10 anos").max(120, "Idade máxima: 120 anos"),
  sexo: z.enum(["M", "F"], { required_error: "Selecione o sexo" }),
  altura: z.number().min(50, "Altura mínima: 50cm").max(250, "Altura máxima: 250cm"),
  peso: z.number().min(20, "Peso mínimo: 20kg").max(300, "Peso máximo: 300kg"),
  
  // Campos opcionais
  pescoco: z.number().optional(),
  ombros: z.number().optional(),
  torax: z.number().optional(),
  cintura: z.number().optional(),
  abdomen: z.number().optional(),
  quadril: z.number().optional(),
  coxa_proximal: z.number().optional(),
  coxa_medial: z.number().optional(),
  coxa_distal: z.number().optional(),
  panturrilha: z.number().optional(),
  braco_relaxado: z.number().optional(),
  braco_contraido: z.number().optional(),
  antebraco: z.number().optional(),
  punho: z.number().optional(),
  
  tricipital: z.number().optional(),
  subescapular: z.number().optional(),
  bicipital: z.number().optional(),
  axilar_media: z.number().optional(),
  suprailiaca: z.number().optional(),
  abdominal: z.number().optional(),
  coxa_frontal: z.number().optional(),
  panturrilha_medial: z.number().optional(),
});

export type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;
