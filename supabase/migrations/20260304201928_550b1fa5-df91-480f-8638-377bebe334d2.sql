
CREATE TABLE public.orcamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  conversa_id uuid REFERENCES public.conversas(id),
  atendente_id uuid REFERENCES public.atendentes(id),
  setor_id uuid REFERENCES public.setores(id),
  lead_id uuid REFERENCES public.leads_funil(id),
  numero_sequencial integer NOT NULL DEFAULT 1,
  produto_nome text NOT NULL,
  valor_produto numeric NOT NULL DEFAULT 0,
  despesas_adicionais numeric NOT NULL DEFAULT 0,
  valor_total numeric NOT NULL DEFAULT 0,
  valor_com_desconto numeric,
  observacoes text,
  status_orcamento text NOT NULL DEFAULT 'enviado',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler orcamentos" ON public.orcamentos FOR SELECT USING (true);
CREATE POLICY "Usuarios podem inserir orcamentos" ON public.orcamentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuarios podem atualizar orcamentos" ON public.orcamentos FOR UPDATE USING (true);
