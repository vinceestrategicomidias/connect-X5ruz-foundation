-- Criar tabela de chamadas
CREATE TABLE public.chamadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES public.pacientes(id),
  atendente_id UUID NOT NULL REFERENCES public.atendentes(id),
  numero_discado TEXT NOT NULL,
  horario_inicio TIMESTAMP WITH TIME ZONE DEFAULT now(),
  horario_fim TIMESTAMP WITH TIME ZONE,
  duracao INTEGER,
  status TEXT NOT NULL DEFAULT 'discando',
  tipo TEXT NOT NULL DEFAULT 'manual',
  setor_origem UUID REFERENCES public.setores(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chamadas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para chamadas
CREATE POLICY "Atendentes podem ver suas próprias chamadas"
  ON public.chamadas
  FOR SELECT
  USING (true);

CREATE POLICY "Atendentes podem inserir chamadas"
  ON public.chamadas
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Atendentes podem atualizar suas chamadas"
  ON public.chamadas
  FOR UPDATE
  USING (true);

-- Índices para performance
CREATE INDEX idx_chamadas_atendente ON public.chamadas(atendente_id);
CREATE INDEX idx_chamadas_paciente ON public.chamadas(paciente_id);
CREATE INDEX idx_chamadas_status ON public.chamadas(status);
CREATE INDEX idx_chamadas_horario ON public.chamadas(horario_inicio DESC);

-- Adicionar realtime para chamadas
ALTER PUBLICATION supabase_realtime ADD TABLE public.chamadas;