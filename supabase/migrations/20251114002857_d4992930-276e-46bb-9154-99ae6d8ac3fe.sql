-- Tabela de avaliações físicas
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Dados Pessoais
  nome TEXT NOT NULL,
  data_avaliacao DATE NOT NULL,
  idade INTEGER NOT NULL,
  sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
  altura DECIMAL(5,2) NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  
  -- Cálculos Automáticos
  imc DECIMAL(5,2),
  percentual_gordura DECIMAL(5,2),
  massa_magra DECIMAL(5,2),
  massa_gorda DECIMAL(5,2),
  
  -- Circunferências (cm)
  pescoco DECIMAL(5,2),
  ombros DECIMAL(5,2),
  torax DECIMAL(5,2),
  cintura DECIMAL(5,2),
  abdomen DECIMAL(5,2),
  quadril DECIMAL(5,2),
  coxa_proximal DECIMAL(5,2),
  coxa_medial DECIMAL(5,2),
  coxa_distal DECIMAL(5,2),
  panturrilha DECIMAL(5,2),
  braco_relaxado DECIMAL(5,2),
  braco_contraido DECIMAL(5,2),
  antebraco DECIMAL(5,2),
  punho DECIMAL(5,2),
  
  -- Dobras Cutâneas (mm)
  tricipital DECIMAL(5,2),
  subescapular DECIMAL(5,2),
  bicipital DECIMAL(5,2),
  axilar_media DECIMAL(5,2),
  suprailiaca DECIMAL(5,2),
  abdominal DECIMAL(5,2),
  coxa_frontal DECIMAL(5,2),
  panturrilha_medial DECIMAL(5,2)
);

-- Tabela de fotos das avaliações
CREATE TABLE IF NOT EXISTS public.fotos_avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  avaliacao_id UUID REFERENCES public.avaliacoes(id) ON DELETE CASCADE,
  posicao TEXT NOT NULL CHECK (posicao IN ('frente', 'lateral', 'costas')),
  url TEXT NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_nome ON public.avaliacoes(nome);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_data ON public.avaliacoes(data_avaliacao DESC);
CREATE INDEX IF NOT EXISTS idx_fotos_avaliacao ON public.fotos_avaliacoes(avaliacao_id);

-- RLS Policies (dados públicos para este sistema)
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos_avaliacoes ENABLE ROW LEVEL SECURITY;

-- Permite acesso público às avaliações
CREATE POLICY "Permitir acesso público às avaliações"
  ON public.avaliacoes
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso público às fotos"
  ON public.fotos_avaliacoes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comentários das tabelas
COMMENT ON TABLE public.avaliacoes IS 'Tabela de avaliações físicas completas com medidas antropométricas';
COMMENT ON TABLE public.fotos_avaliacoes IS 'Tabela de fotos das avaliações para acompanhamento visual';
