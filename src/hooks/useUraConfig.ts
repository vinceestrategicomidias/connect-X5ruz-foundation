import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UraConfig {
  id: string;
  unidade_id?: string;
  audio_url?: string;
  voz_tipo?: string;
  opcoes: any[];
  horario_funcionamento?: any;
  mensagem_boas_vindas?: string;
  mensagem_espera?: string;
  mensagem_lotacao?: string;
  mensagem_fora_expediente?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useUraConfig = (unidadeId?: string) => {
  return useQuery({
    queryKey: ["ura_config", unidadeId],
    queryFn: async () => {
      let query = supabase.from("ura_config").select("*");
      
      if (unidadeId) {
        query = query.eq("unidade_id", unidadeId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as UraConfig[];
    },
  });
};

export const useAtualizarUraConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<UraConfig> }) => {
      const { data, error } = await supabase
        .from("ura_config")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ura_config"] });
      toast.success("Configuração URA atualizada");
    },
    onError: () => {
      toast.error("Erro ao atualizar URA");
    },
  });
};
