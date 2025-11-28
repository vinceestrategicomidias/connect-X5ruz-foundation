import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Webhook {
  id: string;
  empresa_id?: string;
  evento: string;
  url_destino: string;
  ativo?: boolean;
  secret?: string;
  tentativas_falhas?: number;
  ultima_tentativa?: string;
  created_at?: string;
  updated_at?: string;
}

export const useWebhooks = (empresaId?: string) => {
  return useQuery({
    queryKey: ["webhooks", empresaId],
    queryFn: async () => {
      let query = supabase.from("webhooks").select("*");
      
      if (empresaId) {
        query = query.eq("empresa_id", empresaId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Webhook[];
    },
  });
};

export const useCriarWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: Omit<Webhook, "id">) => {
      const { data, error } = await supabase
        .from("webhooks")
        .insert(dados)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar webhook");
    },
  });
};

export const useAtualizarWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<Webhook> }) => {
      const { data, error } = await supabase
        .from("webhooks")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook atualizado");
    },
    onError: () => {
      toast.error("Erro ao atualizar webhook");
    },
  });
};

export const useDeletarWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("webhooks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook removido");
    },
    onError: () => {
      toast.error("Erro ao remover webhook");
    },
  });
};
