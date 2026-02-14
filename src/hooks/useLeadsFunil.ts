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
  fechado_por_id: string | null;
  perdido_por_id: string | null;
  vendedor_nome?: string;
  fechado_por_nome?: string;
  perdido_por_nome?: string;
}

export const useLeadAtivoPaciente = (pacienteId: string | null) => {
  return useQuery({
    queryKey: ["lead-funil", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return null;
      const { data, error } = await (supabase
        .from("leads_funil" as any)
        .select("*, vendedor:atendente_id(nome), fechador:fechado_por_id(nome), perdedor:perdido_por_id(nome)") as any)
        .eq("paciente_id", pacienteId)
        .eq("ativo", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const lead = { ...data } as any;
      lead.vendedor_nome = lead.vendedor?.nome || null;
      lead.fechado_por_nome = lead.fechador?.nome || null;
      lead.perdido_por_nome = lead.perdedor?.nome || null;
      delete lead.vendedor;
      delete lead.fechador;
      delete lead.perdedor;
      return lead as LeadFunil;
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
      fechado_por_id?: string;
      perdido_por_id?: string;
    }) => {
      const updates: Record<string, any> = { etapa: params.etapa };
      if (params.etapa === "vendido") {
        updates.valor_final = params.valor_final;
        updates.forma_pagamento = params.forma_pagamento;
        updates.data_fechamento = new Date().toISOString();
        if (params.fechado_por_id) updates.fechado_por_id = params.fechado_por_id;
      }
      if (params.etapa === "perdido") {
        updates.motivo_perda = params.motivo_perda;
        if (params.perdido_por_id) updates.perdido_por_id = params.perdido_por_id;
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
    mutationFn: async (params: {
      leadId: string;
      pacienteId: string;
      reaberto_por_id: string;
      reaberto_por_nome?: string;
      observacao?: string;
      etapa_anterior: string;
    }) => {
      // First get current lead to preserve history
      const { data: currentLead, error: fetchError } = await (supabase
        .from("leads_funil" as any)
        .select("*") as any)
        .eq("id", params.leadId)
        .single();
      if (fetchError) throw fetchError;

      const historicoAtual = (currentLead as any)?.historico_reaberturas || [];
      const novaEntrada = {
        etapa_anterior: params.etapa_anterior,
        motivo_perda_anterior: (currentLead as any)?.motivo_perda || null,
        valor_final_anterior: (currentLead as any)?.valor_final || null,
        forma_pagamento_anterior: (currentLead as any)?.forma_pagamento || null,
        fechado_por_id_anterior: (currentLead as any)?.fechado_por_id || null,
        perdido_por_id_anterior: (currentLead as any)?.perdido_por_id || null,
        data_fechamento_anterior: (currentLead as any)?.data_fechamento || null,
        reaberto_por_id: params.reaberto_por_id,
        reaberto_por_nome: params.reaberto_por_nome || null,
        reaberto_em: new Date().toISOString(),
        observacao_reabertura: params.observacao || null,
      };

      const { data, error } = await (supabase
        .from("leads_funil" as any)
        .update({
          etapa: "em_negociacao",
          motivo_perda: null,
          data_fechamento: null,
          valor_final: null,
          forma_pagamento: null,
          fechado_por_id: null,
          perdido_por_id: null,
          reaberto_por_id: params.reaberto_por_id,
          reaberto_em: new Date().toISOString(),
          historico_reaberturas: [...historicoAtual, novaEntrada],
        }) as any)
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
