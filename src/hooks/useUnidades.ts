import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Unidade {
  id: string;
  empresa_id?: string;
  nome: string;
  codigo_interno?: string;
  endereco?: string;
  fuso_horario?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useUnidades = () => {
  return useQuery({
    queryKey: ["unidades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data as Unidade[];
    },
  });
};

export const useCriarUnidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: Omit<Unidade, "id">) => {
      const { data, error } = await supabase
        .from("unidades")
        .insert(dados)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      toast.success("Unidade criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar unidade");
    },
  });
};

export const useAtualizarUnidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<Unidade> }) => {
      const { data, error } = await supabase
        .from("unidades")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      toast.success("Unidade atualizada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar unidade");
    },
  });
};
