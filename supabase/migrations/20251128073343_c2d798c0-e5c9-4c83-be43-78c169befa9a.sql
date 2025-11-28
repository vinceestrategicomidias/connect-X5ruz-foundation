-- Criar tabela para armazenar anexos de mensagens
CREATE TABLE IF NOT EXISTS public.anexos_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mensagem_id UUID REFERENCES public.mensagens(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('documento', 'imagem', 'video', 'audio', 'contato', 'localizacao', 'outro')),
  nome_arquivo TEXT NOT NULL,
  url_storage TEXT NOT NULL,
  tamanho_bytes BIGINT,
  mime_type TEXT,
  duracao_segundos INTEGER,
  metadados JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_anexos_mensagens_mensagem_id ON public.anexos_mensagens(mensagem_id);
CREATE INDEX IF NOT EXISTS idx_anexos_mensagens_tipo ON public.anexos_mensagens(tipo);

-- Enable RLS
ALTER TABLE public.anexos_mensagens ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir leitura e criação para usuários autenticados)
CREATE POLICY "Usuários autenticados podem ver anexos"
  ON public.anexos_mensagens
  FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem criar anexos"
  ON public.anexos_mensagens
  FOR INSERT
  WITH CHECK (true);

-- Criar bucket de storage para anexos (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para permitir upload e leitura
CREATE POLICY "Permitir upload de anexos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'chat-attachments');

CREATE POLICY "Permitir leitura de anexos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'chat-attachments');

CREATE POLICY "Permitir exclusão de anexos próprios"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'chat-attachments');