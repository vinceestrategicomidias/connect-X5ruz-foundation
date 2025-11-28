-- Criar tabela de configurações de IA por empresa/unidade
CREATE TABLE IF NOT EXISTS public.ia_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id),
  unidade_id UUID REFERENCES public.unidades(id),
  setor_id UUID REFERENCES public.setores(id),
  ia_ativa BOOLEAN DEFAULT true,
  nivel_atuacao TEXT DEFAULT 'assistente' CHECK (nivel_atuacao IN ('observador', 'assistente', 'automatizado_parcial')),
  pre_atendimento_ativo BOOLEAN DEFAULT false,
  analise_intencao_ativa BOOLEAN DEFAULT true,
  preditiva_ativa BOOLEAN DEFAULT true,
  alertas_inteligentes_ativos BOOLEAN DEFAULT true,
  sugestao_respostas_ativa BOOLEAN DEFAULT true,
  feedback_automatico_ativo BOOLEAN DEFAULT false,
  limite_nps_baixo INTEGER DEFAULT 7,
  limite_fila_alta INTEGER DEFAULT 12,
  limite_tma_minutos INTEGER DEFAULT 8,
  sensibilidade_alertas TEXT DEFAULT 'media' CHECK (sensibilidade_alertas IN ('baixa', 'media', 'alta')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de análises de intenção
CREATE TABLE IF NOT EXISTS public.ia_analise_intencao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES public.pacientes(id),
  conversa_id UUID REFERENCES public.conversas(id),
  texto_analisado TEXT NOT NULL,
  intencao_principal TEXT NOT NULL,
  intencoes_secundarias JSONB DEFAULT '[]',
  nivel_urgencia TEXT DEFAULT 'normal' CHECK (nivel_urgencia IN ('normal', 'alta', 'critica')),
  tipo_procedimento TEXT,
  dados_extraidos JSONB,
  confianca NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de previsões preditivas
CREATE TABLE IF NOT EXISTS public.ia_preditiva (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade_id UUID REFERENCES public.unidades(id),
  data_previsao DATE NOT NULL,
  volume_esperado INTEGER,
  horarios_pico JSONB,
  setores_alta_demanda JSONB,
  risco_sla TEXT DEFAULT 'baixo' CHECK (risco_sla IN ('baixo', 'medio', 'alto')),
  recomendacoes JSONB,
  acuracia_anterior NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de classificação de picos
CREATE TABLE IF NOT EXISTS public.ia_classificacao_picos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade_id UUID REFERENCES public.unidades(id),
  setor_id UUID REFERENCES public.setores(id),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  quantidade_mensagens INTEGER,
  quantidade_atendimentos INTEGER,
  tma_medio NUMERIC(5,2),
  tme_medio NUMERIC(5,2),
  classificacao TEXT CHECK (classificacao IN ('muito_baixo', 'baixo', 'medio', 'alto', 'muito_alto')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de alertas inteligentes
CREATE TABLE IF NOT EXISTS public.ia_alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  severidade TEXT CHECK (severidade IN ('info', 'warning', 'critical')),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  dados_contexto JSONB,
  acao_recomendada TEXT,
  destinatarios TEXT[],
  atendido BOOLEAN DEFAULT false,
  atendido_por UUID REFERENCES public.atendentes(id),
  atendido_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de feedbacks gerados pela IA
CREATE TABLE IF NOT EXISTS public.ia_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atendente_id UUID REFERENCES public.atendentes(id),
  tipo TEXT CHECK (tipo IN ('elogio', 'melhoria')),
  titulo TEXT NOT NULL,
  justificativa TEXT NOT NULL,
  mensagem_sugerida TEXT,
  metricas_relacionadas JSONB,
  aprovado BOOLEAN DEFAULT false,
  aprovado_por UUID REFERENCES public.atendentes(id),
  enviado BOOLEAN DEFAULT false,
  enviado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de auditoria de ações da IA
CREATE TABLE IF NOT EXISTS public.ia_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_decisao TEXT NOT NULL,
  setor_id UUID REFERENCES public.setores(id),
  unidade_id UUID REFERENCES public.unidades(id),
  resumo_analise TEXT,
  recomendacao TEXT,
  acao_executada TEXT,
  dados_entrada JSONB,
  dados_saida JSONB,
  executado_automaticamente BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de energia da equipe
CREATE TABLE IF NOT EXISTS public.ia_energia_equipe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade_id UUID REFERENCES public.unidades(id),
  setor_id UUID REFERENCES public.setores(id),
  data DATE NOT NULL,
  hora TIME NOT NULL,
  nivel_energia TEXT CHECK (nivel_energia IN ('muito_baixa', 'baixa', 'regular', 'alta', 'muito_alta')),
  fatores JSONB,
  metricas JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ia_analise_intencao_paciente ON public.ia_analise_intencao(paciente_id);
CREATE INDEX IF NOT EXISTS idx_ia_analise_intencao_conversa ON public.ia_analise_intencao(conversa_id);
CREATE INDEX IF NOT EXISTS idx_ia_preditiva_data ON public.ia_preditiva(data_previsao DESC);
CREATE INDEX IF NOT EXISTS idx_ia_alertas_atendido ON public.ia_alertas(atendido, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ia_feedbacks_atendente ON public.ia_feedbacks(atendente_id);
CREATE INDEX IF NOT EXISTS idx_ia_auditoria_created ON public.ia_auditoria(created_at DESC);

-- RLS Policies
ALTER TABLE public.ia_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_analise_intencao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_preditiva ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_classificacao_picos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_energia_equipe ENABLE ROW LEVEL SECURITY;

-- Policies para gestores
CREATE POLICY "Gestores podem gerenciar config IA"
  ON public.ia_config FOR ALL USING (true);

CREATE POLICY "Todos podem ler análises"
  ON public.ia_analise_intencao FOR SELECT USING (true);

CREATE POLICY "Sistema pode criar análises"
  ON public.ia_analise_intencao FOR INSERT WITH CHECK (true);

CREATE POLICY "Todos podem ler preditiva"
  ON public.ia_preditiva FOR SELECT USING (true);

CREATE POLICY "Sistema pode criar preditiva"
  ON public.ia_preditiva FOR INSERT WITH CHECK (true);

CREATE POLICY "Todos podem ler classificação picos"
  ON public.ia_classificacao_picos FOR SELECT USING (true);

CREATE POLICY "Todos podem ler alertas"
  ON public.ia_alertas FOR SELECT USING (true);

CREATE POLICY "Sistema pode criar alertas"
  ON public.ia_alertas FOR INSERT WITH CHECK (true);

CREATE POLICY "Coordenação pode atualizar alertas"
  ON public.ia_alertas FOR UPDATE USING (true);

CREATE POLICY "Coordenação pode ler feedbacks"
  ON public.ia_feedbacks FOR SELECT USING (true);

CREATE POLICY "Sistema pode criar feedbacks"
  ON public.ia_feedbacks FOR INSERT WITH CHECK (true);

CREATE POLICY "Gestores podem aprovar feedbacks"
  ON public.ia_feedbacks FOR UPDATE USING (true);

CREATE POLICY "Todos podem ler auditoria"
  ON public.ia_auditoria FOR SELECT USING (true);

CREATE POLICY "Todos podem ler energia equipe"
  ON public.ia_energia_equipe FOR SELECT USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_ia_config_updated_at
  BEFORE UPDATE ON public.ia_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();