-- Adiciona coluna 'tipo' para diferenciar Produto e Serviço no catálogo
ALTER TABLE public.produtos_servicos
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'produto';

-- Restringe valores permitidos
ALTER TABLE public.produtos_servicos
  DROP CONSTRAINT IF EXISTS produtos_servicos_tipo_check;
ALTER TABLE public.produtos_servicos
  ADD CONSTRAINT produtos_servicos_tipo_check CHECK (tipo IN ('produto','servico'));

-- Campos opcionais que se aplicam principalmente a SERVIÇO
ALTER TABLE public.produtos_servicos
  ADD COLUMN IF NOT EXISTS duracao_minutos integer,
  ADD COLUMN IF NOT EXISTS profissional text;

-- Campos opcionais que se aplicam principalmente a PRODUTO
ALTER TABLE public.produtos_servicos
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS estoque integer;