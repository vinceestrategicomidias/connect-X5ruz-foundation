-- Tabela de produtos e serviços
CREATE TABLE public.produtos_servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria TEXT NOT NULL,
  nome TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos_servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler produtos_servicos"
  ON public.produtos_servicos FOR SELECT
  USING (true);

CREATE POLICY "Gestores podem inserir produtos_servicos"
  ON public.produtos_servicos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Gestores podem atualizar produtos_servicos"
  ON public.produtos_servicos FOR UPDATE
  USING (true);

CREATE POLICY "Gestores podem deletar produtos_servicos"
  ON public.produtos_servicos FOR DELETE
  USING (true);

CREATE TRIGGER update_produtos_servicos_updated_at
  BEFORE UPDATE ON public.produtos_servicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_produtos_servicos_categoria ON public.produtos_servicos(categoria);
CREATE INDEX idx_produtos_servicos_ativo ON public.produtos_servicos(ativo);

-- Tabela de template do orçamento (single-row config)
CREATE TABLE public.orcamento_template (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '📋 *ORÇAMENTO – {descricao}*',
  linha_valor_produto TEXT NOT NULL DEFAULT '💰 Valor do produto: {valor_produto}',
  linha_despesas TEXT NOT NULL DEFAULT '📦 Despesas adicionais: {despesas}',
  separador TEXT NOT NULL DEFAULT '━━━━━━━━━━━━━━━━━━━━',
  linha_total TEXT NOT NULL DEFAULT '*Total: {total}*',
  linha_desconto TEXT NOT NULL DEFAULT '🎁 Com desconto: {desconto}',
  rodape TEXT NOT NULL DEFAULT 'Caso deseje, posso te enviar as opções de pagamento. 😊',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orcamento_template ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler orcamento_template"
  ON public.orcamento_template FOR SELECT
  USING (true);

CREATE POLICY "Gestores podem inserir orcamento_template"
  ON public.orcamento_template FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Gestores podem atualizar orcamento_template"
  ON public.orcamento_template FOR UPDATE
  USING (true);

CREATE TRIGGER update_orcamento_template_updated_at
  BEFORE UPDATE ON public.orcamento_template
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Linha padrão
INSERT INTO public.orcamento_template (id) VALUES (gen_random_uuid());