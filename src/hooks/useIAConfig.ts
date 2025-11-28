import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface IAConfig {
  id: string;
  empresa_id?: string;
  unidade_id?: string;
  setor_id?: string;
  ia_ativa?: boolean;
  nivel_atuacao?: 'observador' | 'assistente' | 'automatizado_parcial';
  pre_atendimento_ativo?: boolean;
  analise_intencao_ativa?: boolean;
  preditiva_ativa?: boolean;
  alertas_inteligentes_ativos?: boolean;
  sugestao_respostas_ativa?: boolean;
  feedback_automatico_ativo?: boolean;
  limite_nps_baixo?: number;
  limite_fila_alta?: number;
  limite_tma_minutos?: number;
  sensibilidade_alertas?: 'baixa' | 'media' | 'alta';
  created_at?: string;
  updated_at?: string;
}

export const useIAConfig = () => {
  return useQuery({
    queryKey: ["ia_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ia_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as IAConfig | null;
    },
  });
};

export const useAtualizarIAConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: Partial<IAConfig>) => {
      const { data: existing } = await supabase
        .from("ia_config")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("ia_config")
          .update(dados)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("ia_config")
          .insert(dados)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ia_config"] });
      toast.success("Configurações da Thalí atualizadas");
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações da Thalí");
    },
  });
};
