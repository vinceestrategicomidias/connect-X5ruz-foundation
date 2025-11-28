-- Criar tabela de atendentes
CREATE TABLE public.atendentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL CHECK (cargo IN ('atendente', 'coordenação', 'gestor')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de pacientes
CREATE TABLE public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('fila', 'em_atendimento', 'finalizado')),
  tempo_na_fila INTEGER DEFAULT 0,
  ultima_mensagem TEXT,
  atendente_responsavel UUID REFERENCES public.atendentes(id),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de conversas
CREATE TABLE public.conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  atendente_id UUID REFERENCES public.atendentes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de mensagens
CREATE TABLE public.mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID NOT NULL REFERENCES public.conversas(id) ON DELETE CASCADE,
  autor TEXT NOT NULL CHECK (autor IN ('paciente', 'atendente')),
  texto TEXT NOT NULL,
  horario TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'imagem', 'arquivo', 'audio')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_pacientes_status ON public.pacientes(status);
CREATE INDEX idx_pacientes_atendente ON public.pacientes(atendente_responsavel);
CREATE INDEX idx_conversas_paciente ON public.conversas(paciente_id);
CREATE INDEX idx_conversas_atendente ON public.conversas(atendente_id);
CREATE INDEX idx_mensagens_conversa ON public.mensagens(conversa_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pacientes_updated_at
  BEFORE UPDATE ON public.pacientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversas_updated_at
  BEFORE UPDATE ON public.conversas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.atendentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Policies para atendentes (leitura pública por enquanto)
CREATE POLICY "Permitir leitura de atendentes"
  ON public.atendentes FOR SELECT
  USING (true);

CREATE POLICY "Permitir insert de atendentes"
  ON public.atendentes FOR INSERT
  WITH CHECK (true);

-- Policies para pacientes (leitura e escrita pública por enquanto)
CREATE POLICY "Permitir leitura de pacientes"
  ON public.pacientes FOR SELECT
  USING (true);

CREATE POLICY "Permitir insert de pacientes"
  ON public.pacientes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir update de pacientes"
  ON public.pacientes FOR UPDATE
  USING (true);

CREATE POLICY "Permitir delete de pacientes"
  ON public.pacientes FOR DELETE
  USING (true);

-- Policies para conversas
CREATE POLICY "Permitir leitura de conversas"
  ON public.conversas FOR SELECT
  USING (true);

CREATE POLICY "Permitir insert de conversas"
  ON public.conversas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir update de conversas"
  ON public.conversas FOR UPDATE
  USING (true);

-- Policies para mensagens
CREATE POLICY "Permitir leitura de mensagens"
  ON public.mensagens FOR SELECT
  USING (true);

CREATE POLICY "Permitir insert de mensagens"
  ON public.mensagens FOR INSERT
  WITH CHECK (true);

-- Habilitar Realtime para atualizações em tempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.pacientes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mensagens;