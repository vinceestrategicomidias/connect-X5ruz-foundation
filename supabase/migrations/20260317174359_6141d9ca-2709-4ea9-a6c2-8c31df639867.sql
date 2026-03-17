
-- Motivos de Transferência
CREATE TABLE public.motivos_transferencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.motivos_transferencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler motivos_transferencia" ON public.motivos_transferencia FOR SELECT USING (true);
CREATE POLICY "Gestores podem inserir motivos_transferencia" ON public.motivos_transferencia FOR INSERT WITH CHECK (true);
CREATE POLICY "Gestores podem atualizar motivos_transferencia" ON public.motivos_transferencia FOR UPDATE USING (true);
CREATE POLICY "Gestores podem deletar motivos_transferencia" ON public.motivos_transferencia FOR DELETE USING (true);

-- Relação motivo_transferencia <-> setores (muitos para muitos)
CREATE TABLE public.motivos_transferencia_setores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motivo_id uuid NOT NULL REFERENCES public.motivos_transferencia(id) ON DELETE CASCADE,
  setor_id uuid NOT NULL REFERENCES public.setores(id) ON DELETE CASCADE,
  UNIQUE(motivo_id, setor_id)
);

ALTER TABLE public.motivos_transferencia_setores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler motivos_transferencia_setores" ON public.motivos_transferencia_setores FOR SELECT USING (true);
CREATE POLICY "Gestores podem gerenciar motivos_transferencia_setores" ON public.motivos_transferencia_setores FOR ALL USING (true);

-- Relação motivo_transferencia <-> unidades (muitos para muitos)
CREATE TABLE public.motivos_transferencia_unidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motivo_id uuid NOT NULL REFERENCES public.motivos_transferencia(id) ON DELETE CASCADE,
  unidade_id uuid NOT NULL REFERENCES public.unidades(id) ON DELETE CASCADE,
  UNIQUE(motivo_id, unidade_id)
);

ALTER TABLE public.motivos_transferencia_unidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler motivos_transferencia_unidades" ON public.motivos_transferencia_unidades FOR SELECT USING (true);
CREATE POLICY "Gestores podem gerenciar motivos_transferencia_unidades" ON public.motivos_transferencia_unidades FOR ALL USING (true);

-- Motivos de Finalização
CREATE TABLE public.motivos_finalizacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.motivos_finalizacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler motivos_finalizacao" ON public.motivos_finalizacao FOR SELECT USING (true);
CREATE POLICY "Gestores podem inserir motivos_finalizacao" ON public.motivos_finalizacao FOR INSERT WITH CHECK (true);
CREATE POLICY "Gestores podem atualizar motivos_finalizacao" ON public.motivos_finalizacao FOR UPDATE USING (true);
CREATE POLICY "Gestores podem deletar motivos_finalizacao" ON public.motivos_finalizacao FOR DELETE USING (true);

-- Relação motivo_finalizacao <-> setores
CREATE TABLE public.motivos_finalizacao_setores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motivo_id uuid NOT NULL REFERENCES public.motivos_finalizacao(id) ON DELETE CASCADE,
  setor_id uuid NOT NULL REFERENCES public.setores(id) ON DELETE CASCADE,
  UNIQUE(motivo_id, setor_id)
);

ALTER TABLE public.motivos_finalizacao_setores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler motivos_finalizacao_setores" ON public.motivos_finalizacao_setores FOR SELECT USING (true);
CREATE POLICY "Gestores podem gerenciar motivos_finalizacao_setores" ON public.motivos_finalizacao_setores FOR ALL USING (true);

-- Relação motivo_finalizacao <-> unidades
CREATE TABLE public.motivos_finalizacao_unidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motivo_id uuid NOT NULL REFERENCES public.motivos_finalizacao(id) ON DELETE CASCADE,
  unidade_id uuid NOT NULL REFERENCES public.unidades(id) ON DELETE CASCADE,
  UNIQUE(motivo_id, unidade_id)
);

ALTER TABLE public.motivos_finalizacao_unidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler motivos_finalizacao_unidades" ON public.motivos_finalizacao_unidades FOR SELECT USING (true);
CREATE POLICY "Gestores podem gerenciar motivos_finalizacao_unidades" ON public.motivos_finalizacao_unidades FOR ALL USING (true);
