import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PerfilValidacao {
  id: string;
  usuario_id: string;
  campos_alterados: Record<string, any>;
  valores_novos: Record<string, any>;
  data_solicitacao: string;
  status: "pendente" | "aprovado" | "reprovado";
  coordenador_responsavel?: string;
  data_validacao?: string;
  observacao?: string;
}

export const usePerfilValidacoes = () => {
  return useQuery({
    queryKey: ["perfil-validacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfil_validacoes")
        .select("*")
        .order("data_solicitacao", { ascending: false });

      if (error) throw error;
      return data as PerfilValidacao[];
    },
  });
};

export const useCriarValidacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (validacao: {
      usuario_id: string;
      campos_alterados: Record<string, any>;
      valores_novos: Record<string, any>;
    }) => {
      const { data, error } = await supabase
        .from("perfil_validacoes")
        .insert(validacao)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil-validacoes"] });
      toast({
        title: "Aguardando validação",
        description: "Suas alterações foram enviadas para validação da coordenação.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível enviar suas alterações. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar validação:", error);
    },
  });
};

export const useAprovarValidacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      validacaoId,
      coordenadorId,
    }: {
      validacaoId: string;
      coordenadorId: string;
    }) => {
      // Buscar a validação
      const { data: validacao, error: validacaoError } = await supabase
        .from("perfil_validacoes")
        .select("*")
        .eq("id", validacaoId)
        .single();

      if (validacaoError) throw validacaoError;

      // Atualizar o perfil do atendente
      const updateData: any = validacao.valores_novos;
      const { error: updateError } = await supabase
        .from("atendentes")
        .update(updateData)
        .eq("id", validacao.usuario_id);

      if (updateError) throw updateError;

      // Atualizar status da validação
      const { error: statusError } = await supabase
        .from("perfil_validacoes")
        .update({
          status: "aprovado",
          coordenador_responsavel: coordenadorId,
          data_validacao: new Date().toISOString(),
        })
        .eq("id", validacaoId);

      if (statusError) throw statusError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil-validacoes"] });
      queryClient.invalidateQueries({ queryKey: ["atendentes"] });
      toast({
        title: "Validação aprovada",
        description: "As alterações foram aplicadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar as alterações.",
        variant: "destructive",
      });
      console.error("Erro ao aprovar validação:", error);
    },
  });
};

export const useReprovarValidacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      validacaoId,
      coordenadorId,
      observacao,
    }: {
      validacaoId: string;
      coordenadorId: string;
      observacao?: string;
    }) => {
      const { error } = await supabase
        .from("perfil_validacoes")
        .update({
          status: "reprovado",
          coordenador_responsavel: coordenadorId,
          data_validacao: new Date().toISOString(),
          observacao,
        })
        .eq("id", validacaoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil-validacoes"] });
      toast({
        title: "Validação reprovada",
        description: "As alterações foram recusadas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao reprovar",
        description: "Não foi possível reprovar as alterações.",
        variant: "destructive",
      });
      console.error("Erro ao reprovar validação:", error);
    },
  });
};
