
-- Tipos de serviço (Consulta, Exame, Cirurgia, Procedimento, etc.)
CREATE TABLE public.service_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id),
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler service_types" ON public.service_types FOR SELECT USING (true);
CREATE POLICY "Gestores podem gerenciar service_types" ON public.service_types FOR ALL USING (true);

-- Motivos de perda
CREATE TABLE public.loss_reasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id),
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.loss_reasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler loss_reasons" ON public.loss_reasons FOR SELECT USING (true);
CREATE POLICY "Gestores podem gerenciar loss_reasons" ON public.loss_reasons FOR ALL USING (true);

-- Provedores/Médicos
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id),
  nome TEXT NOT NULL,
  especialidade TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Gestores podem gerenciar providers" ON public.providers FOR ALL USING (true);

-- Casos comerciais (núcleo do funil)
CREATE TABLE public.commercial_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversa_id UUID REFERENCES public.conversas(id),
  empresa_id UUID REFERENCES public.empresas(id),
  service_type_id UUID REFERENCES public.service_types(id),
  provider_id UUID REFERENCES public.providers(id),
  stage TEXT NOT NULL DEFAULT 'NEW' CHECK (stage IN ('NEW','IN_SERVICE','BUDGET_SENT','NEGOTIATION','WON','LOST')),
  value_estimated NUMERIC(12,2),
  value_closed NUMERIC(12,2),
  loss_reason_id UUID REFERENCES public.loss_reasons(id),
  next_followup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.commercial_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler commercial_cases" ON public.commercial_cases FOR SELECT USING (true);
CREATE POLICY "Usuarios podem inserir commercial_cases" ON public.commercial_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuarios podem atualizar commercial_cases" ON public.commercial_cases FOR UPDATE USING (true);

CREATE INDEX idx_commercial_cases_stage ON public.commercial_cases(stage);
CREATE INDEX idx_commercial_cases_created ON public.commercial_cases(created_at);
CREATE INDEX idx_commercial_cases_conversa ON public.commercial_cases(conversa_id);

-- Eventos comerciais (auditoria)
CREATE TABLE public.commercial_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commercial_case_id UUID NOT NULL REFERENCES public.commercial_cases(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('STAGE_CHANGED','VALUE_UPDATED','LOSS_REASON_SET','FOLLOWUP_SET','ASSIGNED_CHANGED')),
  from_value TEXT,
  to_value TEXT,
  created_by UUID REFERENCES public.atendentes(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.commercial_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler commercial_events" ON public.commercial_events FOR SELECT USING (true);
CREATE POLICY "Usuarios podem inserir commercial_events" ON public.commercial_events FOR INSERT WITH CHECK (true);

CREATE INDEX idx_commercial_events_case ON public.commercial_events(commercial_case_id);

-- Trigger para updated_at
CREATE TRIGGER update_commercial_cases_updated_at
  BEFORE UPDATE ON public.commercial_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: tipos de serviço padrão (saúde)
INSERT INTO public.service_types (nome, ordem) VALUES
  ('Consulta', 1),
  ('Exame', 2),
  ('Cirurgia', 3),
  ('Procedimento', 4);

-- Seed: motivos de perda padrão
INSERT INTO public.loss_reasons (nome, ordem) VALUES
  ('Valor', 1),
  ('Convênio negou', 2),
  ('Sem retorno', 3),
  ('Fez com outro profissional', 4),
  ('Adiou/Desistiu', 5);
