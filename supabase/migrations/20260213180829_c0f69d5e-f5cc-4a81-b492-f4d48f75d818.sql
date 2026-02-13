
-- Create leads_funil table for the sales funnel mini CRM
CREATE TABLE public.leads_funil (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id),
  conversa_id UUID REFERENCES public.conversas(id),
  atendente_id UUID REFERENCES public.atendentes(id),
  setor_id UUID REFERENCES public.setores(id),
  produto_servico TEXT NOT NULL,
  valor_orcamento NUMERIC NOT NULL DEFAULT 0,
  valor_final NUMERIC,
  etapa TEXT NOT NULL DEFAULT 'em_negociacao' CHECK (etapa IN ('em_negociacao', 'vendido', 'perdido')),
  origem_lead TEXT,
  observacoes TEXT,
  motivo_perda TEXT,
  forma_pagamento TEXT,
  data_envio_orcamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fechamento TIMESTAMP WITH TIME ZONE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads_funil ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Todos podem ler leads_funil" ON public.leads_funil
  FOR SELECT USING (true);

CREATE POLICY "Usuarios podem inserir leads_funil" ON public.leads_funil
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuarios podem atualizar leads_funil" ON public.leads_funil
  FOR UPDATE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_leads_funil_updated_at
  BEFORE UPDATE ON public.leads_funil
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Only one active lead per patient
CREATE UNIQUE INDEX idx_leads_funil_paciente_ativo ON public.leads_funil (paciente_id) WHERE (ativo = true);
