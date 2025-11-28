import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MensageriaConfig {
  id: string;
  unidade_id?: string;
  robo_ativo?: boolean;
  fluxos_automatizados: any[];
  respostas_automaticas: any[];
  ia_ativa?: boolean;
  assistente_config?: any;
  created_at?: string;
  updated_at?: string;
}

export const useMensageriaConfig = (unidadeId?: string) => {
  return useQuery({
    queryKey: ["mensageria_config", unidadeId],
    queryFn: async () => {
      let query = supabase.from("mensageria_config").select("*");
      
      if (unidadeId) {
        query = query.eq("unidade_id", unidadeId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as MensageriaConfig[];
    },
  });
};

export const useAtualizarMensageriaConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<MensageriaConfig> }) => {
      const { data, error } = await supabase
        .from("mensageria_config")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensageria_config"] });
      toast.success("Configuração de mensageria atualizada");
    },
    onError: () => {
      toast.error("Erro ao atualizar mensageria");
    },
  });
};
