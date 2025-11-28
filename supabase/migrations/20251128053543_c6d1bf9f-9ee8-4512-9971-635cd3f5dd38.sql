-- Criar tabela de validações de perfil
CREATE TABLE IF NOT EXISTS public.perfil_validacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.atendentes(id) ON DELETE CASCADE,
  campos_alterados JSONB NOT NULL,
  valores_novos JSONB NOT NULL,
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'reprovado')),
  coordenador_responsavel UUID REFERENCES public.atendentes(id),
  data_validacao TIMESTAMP WITH TIME ZONE,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.perfil_validacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver suas próprias validações"
  ON public.perfil_validacoes
  FOR SELECT
  USING (auth.uid()::text = usuario_id::text OR EXISTS (
    SELECT 1 FROM public.atendentes 
    WHERE id::text = auth.uid()::text 
    AND cargo IN ('coordenacao', 'gestor')
  ));

CREATE POLICY "Usuários podem criar validações"
  ON public.perfil_validacoes
  FOR INSERT
  WITH CHECK (auth.uid()::text = usuario_id::text);

CREATE POLICY "Coordenação pode atualizar validações"
  ON public.perfil_validacoes
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.atendentes 
    WHERE id::text = auth.uid()::text 
    AND cargo IN ('coordenacao', 'gestor')
  ));

-- Índices
CREATE INDEX idx_perfil_validacoes_usuario ON public.perfil_validacoes(usuario_id);
CREATE INDEX idx_perfil_validacoes_status ON public.perfil_validacoes(status);