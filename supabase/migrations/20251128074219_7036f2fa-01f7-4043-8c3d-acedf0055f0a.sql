-- Criar tabela de pacotes de figurinhas
CREATE TABLE pacotes_figurinhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('institucional', 'thali')),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de figurinhas
CREATE TABLE figurinhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacote_id UUID REFERENCES pacotes_figurinhas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  url_imagem TEXT NOT NULL,
  tags TEXT[],
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar coluna tipo_conteudo na tabela mensagens
ALTER TABLE mensagens 
ADD COLUMN tipo_conteudo TEXT DEFAULT 'texto' CHECK (tipo_conteudo IN ('texto', 'figurinha'));

-- Adicionar coluna figurinha_id na tabela mensagens
ALTER TABLE mensagens 
ADD COLUMN figurinha_id UUID REFERENCES figurinhas(id) ON DELETE SET NULL;

-- RLS Policies para pacotes_figurinhas
ALTER TABLE pacotes_figurinhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler pacotes ativos"
ON pacotes_figurinhas FOR SELECT
USING (ativo = true);

CREATE POLICY "Apenas gestores podem gerenciar pacotes"
ON pacotes_figurinhas FOR ALL
USING (true);

-- RLS Policies para figurinhas
ALTER TABLE figurinhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler figurinhas ativas"
ON figurinhas FOR SELECT
USING (ativo = true);

CREATE POLICY "Apenas gestores podem gerenciar figurinhas"
ON figurinhas FOR ALL
USING (true);

-- Criar bucket para figurinhas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('figurinhas', 'figurinhas', true)
ON CONFLICT DO NOTHING;

-- RLS para storage de figurinhas
CREATE POLICY "Todos podem ver figurinhas"
ON storage.objects FOR SELECT
USING (bucket_id = 'figurinhas');

CREATE POLICY "Gestores podem fazer upload de figurinhas"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'figurinhas');

-- Inserir pacote Thalí
INSERT INTO pacotes_figurinhas (nome, tipo, descricao) 
VALUES ('Figurinhas da Thalí', 'thali', 'Pacote exclusivo de figurinhas da assistente Thalí');

-- Inserir pacote institucional
INSERT INTO pacotes_figurinhas (nome, tipo, descricao) 
VALUES ('Figurinhas Institucionais', 'institucional', 'Figurinhas oficiais do Grupo Liruz');