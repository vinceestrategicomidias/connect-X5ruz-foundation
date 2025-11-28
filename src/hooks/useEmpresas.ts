import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  endereco?: string;
  logo_url?: string;
  responsavel?: string;
  created_at?: string;
  updated_at?: string;
}

export const useEmpresas = () => {
  return useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data as Empresa[];
    },
  });
};

export const useAtualizarEmpresa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<Empresa> }) => {
      const { data, error } = await supabase
        .from("empresas")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
      toast.success("Empresa atualizada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar empresa");
    },
  });
};
