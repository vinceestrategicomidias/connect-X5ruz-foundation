import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Orcamento {
  id: string;
  paciente_id: string;
  conversa_id: string | null;
  atendente_id: string | null;
  setor_id: string | null;
  lead_id: string | null;
  numero_sequencial: number;
  produto_nome: string;
  valor_produto: number;
  despesas_adicionais: number;
  valor_total: number;
  valor_com_desconto: number | null;
  observacoes: string | null;
  status_orcamento: string;
  created_at: string;
  updated_at: string;
}

export const useOrcamentosPaciente = (pacienteId: string | null) => {
  return useQuery({
    queryKey: ["orcamentos", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return [];
      const { data, error } = await (supabase
        .from("orcamentos" as any)
        .select("*") as any)
        .eq("paciente_id", pacienteId)
        .order("numero_sequencial", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as Orcamento[];
    },
    enabled: !!pacienteId,
  });
};

export const useCriarOrcamento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      paciente_id: string;
      conversa_id?: string;
      atendente_id?: string;
      setor_id?: string;
      lead_id?: string;
      produto_nome: string;
      valor_produto: number;
      despesas_adicionais: number;
      valor_total: number;
      valor_com_desconto?: number;
      observacoes?: string;
    }) => {
      // Get next sequential number
      const { data: existing } = await (supabase
        .from("orcamentos" as any)
        .select("numero_sequencial") as any)
        .eq("paciente_id", params.paciente_id)
        .order("numero_sequencial", { ascending: false })
        .limit(1);

      const nextNum = existing && existing.length > 0
        ? (existing[0] as any).numero_sequencial + 1
        : 1;

      const { data, error } = await (supabase
        .from("orcamentos" as any)
        .insert({
          ...params,
          numero_sequencial: nextNum,
          status_orcamento: "enviado",
        }) as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Orcamento;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos", vars.paciente_id] });
    },
  });
};

export const useAtualizarOrcamento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      orcamentoId: string;
      pacienteId: string;
      updates: Partial<Pick<Orcamento, "status_orcamento" | "lead_id">>;
    }) => {
      const { data, error } = await (supabase
        .from("orcamentos" as any)
        .update(params.updates) as any)
        .eq("id", params.orcamentoId)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Orcamento;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos", vars.pacienteId] });
    },
  });
};
