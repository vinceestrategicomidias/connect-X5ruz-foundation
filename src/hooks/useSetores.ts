import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Setor {
  id: string;
  nome: string;
  descricao: string | null;
  cor: string;
  ativo: boolean;
  recebe_ligacoes: boolean | null;
  recebe_mensagens: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useSetores = () => {
  return useQuery({
    queryKey: ["setores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("setores")
        .select("*")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Setor[];
    },
  });
};

export const useCriarSetor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (setor: {
      nome: string;
      descricao?: string;
      cor?: string;
      unidade_id?: string | null;
      recebe_mensagens?: boolean;
      recebe_ligacoes?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("setores")
        .insert(setor)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setores"] });
      toast.success("Setor criado com sucesso");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar setor");
    },
  });
};

export const useAtualizarSetor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      nome?: string;
      descricao?: string;
      cor?: string;
      ativo?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("setores")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setores"] });
      toast.success("Setor atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar setor");
    },
  });
};

export const useDeletarSetor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete - apenas desativar
      const { error } = await supabase
        .from("setores")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setores"] });
      toast.success("Setor desativado com sucesso");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao desativar setor");
    },
  });
};
