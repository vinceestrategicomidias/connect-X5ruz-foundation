import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TipoItem = "produto" | "servico";

export interface ProdutoServico {
  id: string;
  tipo: TipoItem;
  categoria: string;
  nome: string;
  valor: number;
  descricao: string | null;
  ativo: boolean;
  // Específicos de Serviço
  duracao_minutos: number | null;
  profissional: string | null;
  // Específicos de Produto
  sku: string | null;
  estoque: number | null;
  created_at: string;
  updated_at: string;
}

export interface OrcamentoTemplate {
  id: string;
  titulo: string;
  linha_valor_produto: string;
  linha_despesas: string;
  separador: string;
  linha_total: string;
  linha_desconto: string;
  rodape: string;
  created_at: string;
  updated_at: string;
}

export const useProdutosServicos = () => {
  return useQuery({
    queryKey: ["produtos_servicos"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("produtos_servicos" as any)
        .select("*") as any)
        .order("categoria", { ascending: true })
        .order("nome", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as ProdutoServico[];
    },
  });
};

export const useCriarProdutoServico = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: Omit<ProdutoServico, "id" | "created_at" | "updated_at" | "ativo"> & { ativo?: boolean }) => {
      const { data, error } = await (supabase
        .from("produtos_servicos" as any)
        .insert(params) as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produtos_servicos"] }),
  });
};

export const useCriarProdutosServicosLote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: Array<Omit<ProdutoServico, "id" | "created_at" | "updated_at" | "ativo">>) => {
      if (!items.length) return [];
      const { data, error } = await (supabase
        .from("produtos_servicos" as any)
        .insert(items) as any)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produtos_servicos"] }),
  });
};

export const useAtualizarProdutoServico = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProdutoServico> }) => {
      const { data, error } = await (supabase
        .from("produtos_servicos" as any)
        .update(updates) as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produtos_servicos"] }),
  });
};

export const useDeletarProdutoServico = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from("produtos_servicos" as any)
        .delete() as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produtos_servicos"] }),
  });
};

export const useOrcamentoTemplate = () => {
  return useQuery({
    queryKey: ["orcamento_template"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("orcamento_template" as any)
        .select("*") as any)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data || null) as unknown as OrcamentoTemplate | null;
    },
  });
};

export const useAtualizarOrcamentoTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<OrcamentoTemplate> }) => {
      const { data, error } = await (supabase
        .from("orcamento_template" as any)
        .update(updates) as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orcamento_template"] }),
  });
};

/**
 * Renderiza o template de orçamento substituindo as variáveis pelos valores reais.
 * Variáveis suportadas: {descricao}, {valor_produto}, {despesas}, {total}, {desconto}
 */
export const renderTemplateOrcamento = (
  template: OrcamentoTemplate | null,
  vars: { descricao: string; valor_produto: string; despesas: string; total: string; desconto: string }
): string => {
  // Fallback para o template original caso a tabela esteja vazia
  const t = template || {
    titulo: "📋 *ORÇAMENTO – {descricao}*",
    linha_valor_produto: "💰 Valor do produto: {valor_produto}",
    linha_despesas: "📦 Despesas adicionais: {despesas}",
    separador: "━━━━━━━━━━━━━━━━━━━━",
    linha_total: "*Total: {total}*",
    linha_desconto: "🎁 Com desconto: {desconto}",
    rodape: "Caso deseje, posso te enviar as opções de pagamento. 😊",
  } as OrcamentoTemplate;

  const sub = (s: string) =>
    s
      .replace(/\{descricao\}/g, vars.descricao)
      .replace(/\{valor_produto\}/g, vars.valor_produto)
      .replace(/\{despesas\}/g, vars.despesas)
      .replace(/\{total\}/g, vars.total)
      .replace(/\{desconto\}/g, vars.desconto);

  let msg = `${sub(t.titulo)}\n\n`;
  msg += `${sub(t.linha_valor_produto)}\n`;
  msg += `${sub(t.linha_despesas)}\n`;
  msg += `${t.separador}\n`;
  msg += `${sub(t.linha_total)}\n`;
  if (vars.desconto && parseFloat(vars.desconto.replace(/[^\d,.-]/g, "").replace(",", ".")) > 0) {
    msg += `${sub(t.linha_desconto)}\n`;
  }
  msg += `\n${sub(t.rodape)}`;
  return msg;
};
