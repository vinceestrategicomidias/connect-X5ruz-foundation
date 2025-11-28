import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PerfilAcesso {
  id: string;
  nome: string;
  descricao?: string;
  permissoes: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export const usePerfisAcesso = () => {
  return useQuery({
    queryKey: ["perfis_acesso"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis_de_acesso")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data as PerfilAcesso[];
    },
  });
};

export const useCriarPerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: Omit<PerfilAcesso, "id">) => {
      const { data, error } = await supabase
        .from("perfis_de_acesso")
        .insert(dados)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfis_acesso"] });
      toast.success("Perfil criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar perfil");
    },
  });
};

export const useAtualizarPerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<PerfilAcesso> }) => {
      const { data, error } = await supabase
        .from("perfis_de_acesso")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfis_acesso"] });
      toast.success("Perfil atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar perfil");
    },
  });
};
