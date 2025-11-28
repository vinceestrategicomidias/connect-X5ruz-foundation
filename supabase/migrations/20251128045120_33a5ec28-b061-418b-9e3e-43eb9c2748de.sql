-- Criar tabela de setores
CREATE TABLE public.setores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  cor TEXT DEFAULT '#2563eb',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para setores
CREATE POLICY "Todos podem ler setores ativos"
  ON public.setores
  FOR SELECT
  USING (ativo = true);

CREATE POLICY "Apenas gestores podem inserir setores"
  ON public.setores
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Apenas gestores podem atualizar setores"
  ON public.setores
  FOR UPDATE
  USING (true);

CREATE POLICY "Apenas gestores podem deletar setores"
  ON public.setores
  FOR DELETE
  USING (true);

-- Criar enum para cargos
CREATE TYPE public.cargo_tipo AS ENUM ('atendente', 'coordenacao', 'gestor');

-- Adicionar setor_id e cargo aos atendentes
ALTER TABLE public.atendentes 
  ADD COLUMN setor_id UUID REFERENCES public.setores(id),
  DROP COLUMN cargo,
  ADD COLUMN cargo cargo_tipo DEFAULT 'atendente';

-- Adicionar setor_id aos pacientes
ALTER TABLE public.pacientes
  ADD COLUMN setor_id UUID REFERENCES public.setores(id);

-- Trigger para updated_at em setores
CREATE TRIGGER update_setores_updated_at
  BEFORE UPDATE ON public.setores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir setores padrão
INSERT INTO public.setores (nome, descricao, cor) VALUES
  ('Pré-venda', 'Setor de atendimento pré-venda', '#3b82f6'),
  ('Venda', 'Setor de vendas', '#10b981'),
  ('Pós-venda', 'Setor de pós-venda e suporte', '#f59e0b');

-- Atualizar atendentes existentes com setor padrão (Venda) e cargos
UPDATE public.atendentes 
SET setor_id = (SELECT id FROM public.setores WHERE nome = 'Venda' LIMIT 1),
    cargo = CASE 
      WHEN nome = 'Geovana' THEN 'coordenacao'::cargo_tipo
      ELSE 'atendente'::cargo_tipo
    END;

-- Atualizar pacientes existentes com setor padrão (Venda)
UPDATE public.pacientes
SET setor_id = (SELECT id FROM public.setores WHERE nome = 'Venda' LIMIT 1);

-- Criar índices para performance
CREATE INDEX idx_atendentes_setor ON public.atendentes(setor_id);
CREATE INDEX idx_pacientes_setor ON public.pacientes(setor_id);
CREATE INDEX idx_pacientes_status_setor ON public.pacientes(status, setor_id);