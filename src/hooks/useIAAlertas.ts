import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface IAAlerta {
  id: string;
  tipo: string;
  severidade: 'info' | 'warning' | 'critical';
  titulo: string;
  descricao: string;
  dados_contexto?: any;
  acao_recomendada?: string;
  destinatarios?: string[];
  atendido?: boolean;
  atendido_por?: string;
  atendido_em?: string;
  created_at?: string;
}

export const useIAAlertas = (atendido?: boolean) => {
  return useQuery({
    queryKey: ["ia_alertas", atendido],
    queryFn: async () => {
      let query = supabase
        .from("ia_alertas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (atendido !== undefined) {
        query = query.eq("atendido", atendido);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as IAAlerta[];
    },
  });
};

export const useAtenderAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, atendente_id }: { id: string; atendente_id: string }) => {
      const { data, error } = await supabase
        .from("ia_alertas")
        .update({
          atendido: true,
          atendido_por: atendente_id,
          atendido_em: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ia_alertas"] });
      toast.success("Alerta marcado como atendido");
    },
    onError: () => {
      toast.error("Erro ao atender alerta");
    },
  });
};
