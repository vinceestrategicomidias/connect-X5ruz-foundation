-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('atendente', 'coordenacao', 'gestor', 'auditor', 'supervisor');

-- Create empresas table
CREATE TABLE public.empresas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT,
  endereco TEXT,
  logo_url TEXT,
  responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler empresas"
  ON public.empresas FOR SELECT
  USING (true);

CREATE POLICY "Apenas gestores podem inserir empresas"
  ON public.empresas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Apenas gestores podem atualizar empresas"
  ON public.empresas FOR UPDATE
  USING (true);

-- Create unidades table
CREATE TABLE public.unidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  codigo_interno TEXT,
  endereco TEXT,
  fuso_horario TEXT DEFAULT 'America/Sao_Paulo',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler unidades ativas"
  ON public.unidades FOR SELECT
  USING (ativo = true);

CREATE POLICY "Apenas gestores podem inserir unidades"
  ON public.unidades FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Apenas gestores podem atualizar unidades"
  ON public.unidades FOR UPDATE
  USING (true);

-- Update setores to link to unidades
ALTER TABLE public.setores ADD COLUMN unidade_id UUID REFERENCES public.unidades(id) ON DELETE SET NULL;
ALTER TABLE public.setores ADD COLUMN recebe_ligacoes BOOLEAN DEFAULT true;
ALTER TABLE public.setores ADD COLUMN recebe_mensagens BOOLEAN DEFAULT true;

-- Create perfis_de_acesso table
CREATE TABLE public.perfis_de_acesso (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  permissoes JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.perfis_de_acesso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler perfis"
  ON public.perfis_de_acesso FOR SELECT
  USING (true);

CREATE POLICY "Apenas gestores podem gerenciar perfis"
  ON public.perfis_de_acesso FOR ALL
  USING (true);

-- Create user_roles table for security
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios podem ver suas proprias roles"
  ON public.user_roles FOR SELECT
  USING (true);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update atendentes table to link to unidades and perfis
ALTER TABLE public.atendentes ADD COLUMN unidade_id UUID REFERENCES public.unidades(id) ON DELETE SET NULL;
ALTER TABLE public.atendentes ADD COLUMN perfil_id UUID REFERENCES public.perfis_de_acesso(id) ON DELETE SET NULL;
ALTER TABLE public.atendentes ADD COLUMN email TEXT;
ALTER TABLE public.atendentes ADD COLUMN senha TEXT;
ALTER TABLE public.atendentes ADD COLUMN ativo BOOLEAN DEFAULT true;

-- Create ura_config table
CREATE TABLE public.ura_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unidade_id UUID REFERENCES public.unidades(id) ON DELETE CASCADE,
  audio_url TEXT,
  voz_tipo TEXT DEFAULT 'feminino',
  opcoes JSONB DEFAULT '[]',
  horario_funcionamento JSONB,
  mensagem_boas_vindas TEXT,
  mensagem_espera TEXT,
  mensagem_lotacao TEXT,
  mensagem_fora_expediente TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ura_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler configuracoes URA"
  ON public.ura_config FOR SELECT
  USING (true);

CREATE POLICY "Apenas gestores podem gerenciar URA"
  ON public.ura_config FOR ALL
  USING (true);

-- Create mensageria_config table
CREATE TABLE public.mensageria_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unidade_id UUID REFERENCES public.unidades(id) ON DELETE CASCADE,
  robo_ativo BOOLEAN DEFAULT false,
  fluxos_automatizados JSONB DEFAULT '[]',
  respostas_automaticas JSONB DEFAULT '[]',
  ia_ativa BOOLEAN DEFAULT false,
  assistente_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mensageria_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler configuracoes mensageria"
  ON public.mensageria_config FOR SELECT
  USING (true);

CREATE POLICY "Apenas gestores podem gerenciar mensageria"
  ON public.mensageria_config FOR ALL
  USING (true);

-- Create api_config table
CREATE TABLE public.api_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL,
  webhooks JSONB DEFAULT '[]',
  limites_sla JSONB,
  integracoes_externas JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.api_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas gestores podem gerenciar API"
  ON public.api_config FOR ALL
  USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON public.empresas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_unidades_updated_at
  BEFORE UPDATE ON public.unidades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_perfis_updated_at
  BEFORE UPDATE ON public.perfis_de_acesso
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ura_updated_at
  BEFORE UPDATE ON public.ura_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mensageria_updated_at
  BEFORE UPDATE ON public.mensageria_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_updated_at
  BEFORE UPDATE ON public.api_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.empresas (nome, cnpj, responsavel)
VALUES ('Grupo Liruz', '00.000.000/0001-00', 'Administrador');

INSERT INTO public.unidades (empresa_id, nome, codigo_interno)
SELECT id, 'Unidade Principal', 'UN01'
FROM public.empresas
WHERE nome = 'Grupo Liruz'
LIMIT 1;

-- Insert default perfis
INSERT INTO public.perfis_de_acesso (nome, descricao, permissoes)
VALUES 
  ('Atendente', 'Perfil básico de atendimento', '{"acessar_fila": true, "acessar_meus_atendimentos": true, "iniciar_ligacao": true, "discador_manual": true, "transferir_atendimento": true}'),
  ('Coordenação', 'Perfil de coordenação de equipe', '{"acessar_fila": true, "acessar_meus_atendimentos": true, "acessar_todos": true, "iniciar_ligacao": true, "discador_manual": true, "transferir_atendimento": true, "visualizar_unidade": true, "gerenciar_setores": true, "acessar_relatorios": true, "acessar_dashboard": true}'),
  ('Gestor', 'Perfil de gestão completa', '{"acessar_fila": true, "acessar_meus_atendimentos": true, "acessar_todos": true, "iniciar_ligacao": true, "discador_manual": true, "transferir_atendimento": true, "visualizar_unidade": true, "gerenciar_setores": true, "gerenciar_usuarios": true, "acessar_relatorios": true, "acessar_dashboard": true, "configurar_ura": true, "configurar_ia": true, "acessar_api": true, "ver_auditoria": true}');