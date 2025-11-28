-- Criar tabela de logs de API
CREATE TABLE IF NOT EXISTS public.api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES public.api_config(id),
  endpoint TEXT NOT NULL,
  metodo TEXT NOT NULL,
  ip_origem TEXT,
  status_code INTEGER,
  tempo_resposta_ms INTEGER,
  payload_resumido JSONB,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de webhooks registrados
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id),
  evento TEXT NOT NULL,
  url_destino TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  secret TEXT,
  tentativas_falhas INTEGER DEFAULT 0,
  ultima_tentativa TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de rate limiting
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES public.api_config(id),
  minuto TIMESTAMP WITH TIME ZONE NOT NULL,
  contador INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(api_key_id, minuto)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON public.api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON public.api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_webhooks_evento ON public.webhooks(evento);
CREATE INDEX IF NOT EXISTS idx_rate_limits_api_key_minuto ON public.api_rate_limits(api_key_id, minuto);

-- RLS para api_logs
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gestores podem ver logs"
  ON public.api_logs
  FOR SELECT
  USING (true);

-- RLS para webhooks
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gestores podem gerenciar webhooks"
  ON public.webhooks
  FOR ALL
  USING (true);

CREATE POLICY "Todos podem ler webhooks"
  ON public.webhooks
  FOR SELECT
  USING (true);

-- RLS para rate limits
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sistema pode gerenciar rate limits"
  ON public.api_rate_limits
  FOR ALL
  USING (true);

-- Função para limpar logs antigos (30 dias)
CREATE OR REPLACE FUNCTION public.cleanup_old_api_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.api_logs
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Função para limpar rate limits antigos (1 hora)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.api_rate_limits
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$;

-- Trigger para atualizar updated_at em webhooks
CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();