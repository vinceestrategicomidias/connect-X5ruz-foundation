import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeadFunil {
  id: string;
  paciente_id: string;
  conversa_id: string | null;
  atendente_id: string | null;
  setor_id: string | null;
  produto_servico: string;
  valor_orcamento: number;
  valor_final: number | null;
  etapa: "em_negociacao" | "vendido" | "perdido";
  origem_lead: string | null;
  observacoes: string | null;
  motivo_perda: string | null;
  forma_pagamento: string | null;
  data_envio_orcamento: string;
  data_fechamento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useLeadAtivoPaciente = (pacienteId: string | null) => {
  return useQuery({
    queryKey: ["lead-funil", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return null;
      const { data, error } = await (supabase
        .from("leads_funil" as any)
        .select("*") as any)
        .eq("paciente_id", pacienteId)
        .eq("ativo", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as LeadFunil | null;
    },
    enabled: !!pacienteId,
  });
};

export const useAllLeadsFunil = () => {
  return useQuery({
    queryKey: ["leads-funil-all"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("leads_funil" as any)
        .select("*") as any)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as LeadFunil[];
    },
  });
};

export const useCriarLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lead: {
      paciente_id: string;
      conversa_id?: string;
      atendente_id: string;
      setor_id?: string;
      produto_servico: string;
      valor_orcamento: number;
      origem_lead?: string;
      observacoes?: string;
    }) => {
      const { data, error } = await (supabase
        .from("leads_funil" as any)
        .insert({
          ...lead,
          etapa: "em_negociacao",
          ativo: true,
          data_envio_orcamento: new Date().toISOString(),
        }) as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as LeadFunil;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["lead-funil", vars.paciente_id] });
      queryClient.invalidateQueries({ queryKey: ["leads-funil-all"] });
    },
  });
};

export const useAtualizarEtapaLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      leadId: string;
      pacienteId: string;
      etapa: "em_negociacao" | "vendido" | "perdido";
      valor_final?: number;
      forma_pagamento?: string;
      motivo_perda?: string;
    }) => {
      const updates: Record<string, any> = { etapa: params.etapa };
      if (params.etapa === "vendido") {
        updates.valor_final = params.valor_final;
        updates.forma_pagamento = params.forma_pagamento;
        updates.data_fechamento = new Date().toISOString();
      }
      if (params.etapa === "perdido") {
        updates.motivo_perda = params.motivo_perda;
      }
      const { data, error } = await (supabase
        .from("leads_funil" as any)
        .update(updates) as any)
        .eq("id", params.leadId)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as LeadFunil;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["lead-funil", vars.pacienteId] });
      queryClient.invalidateQueries({ queryKey: ["leads-funil-all"] });
    },
  });
};

export const useReabrirLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { leadId: string; pacienteId: string }) => {
      const { data, error } = await (supabase
        .from("leads_funil" as any)
        .update({ etapa: "em_negociacao", motivo_perda: null, data_fechamento: null }) as any)
        .eq("id", params.leadId)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as LeadFunil;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["lead-funil", vars.pacienteId] });
      queryClient.invalidateQueries({ queryKey: ["leads-funil-all"] });
    },
  });
};
