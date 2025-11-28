import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface IAPreditiva {
  id: string;
  unidade_id?: string;
  data_previsao: string;
  volume_esperado?: number;
  horarios_pico?: any;
  setores_alta_demanda?: any;
  risco_sla?: 'baixo' | 'medio' | 'alto';
  recomendacoes?: any;
  acuracia_anterior?: number;
  created_at?: string;
}

export const useIAPreditiva = (dataPrevisao?: string) => {
  return useQuery({
    queryKey: ["ia_preditiva", dataPrevisao],
    queryFn: async () => {
      let query = supabase
        .from("ia_preditiva")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (dataPrevisao) {
        query = query.eq("data_previsao", dataPrevisao);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as IAPreditiva | null;
    },
  });
};

export const useGerarPreditiva = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unidadeId?: string) => {
      const { data, error } = await supabase.functions.invoke('ia-gerar-preditiva', {
        body: { unidade_id: unidadeId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ia_preditiva"] });
      toast.success("Previsão gerada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao gerar previsão");
    },
  });
};
