import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Mensagem {
  id: string;
  conversa_id: string;
  autor: "paciente" | "atendente";
  texto: string;
  horario: string;
  tipo: "texto" | "imagem" | "arquivo" | "audio";
  tipo_conteudo?: string;
  figurinha_id?: string;
  created_at: string;
}

export interface Conversa {
  id: string;
  paciente_id: string;
  atendente_id: string | null;
  created_at: string;
}

export const useConversaByPaciente = (pacienteId: string | null) => {
  return useQuery({
    queryKey: ["conversa", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return null;

      // Primeiro tenta buscar a conversa existente
      const { data: existente, error: buscarError } = await supabase
        .from("conversas")
        .select("*")
        .eq("paciente_id", pacienteId)
        .maybeSingle();

      if (buscarError) throw buscarError;

      // Se já existe, retorna
      if (existente) return existente as Conversa;

      // Se não existe, cria uma nova
      const { data: nova, error: criarError } = await supabase
        .from("conversas")
        .insert({ paciente_id: pacienteId })
        .select()
        .single();

      if (criarError) throw criarError;
      return nova as Conversa;
    },
    enabled: !!pacienteId,
  });
};

export const useMensagensByConversa = (conversaId: string | null) => {
  const queryClient = useQueryClient();

  // Configurar realtime para mensagens
  useEffect(() => {
    if (!conversaId) return;

    const channel = supabase
      .channel(`realtime-mensagens-${conversaId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mensagens",
          filter: `conversa_id=eq.${conversaId}`,
        },
        () => {
          // Invalida a query para recarregar mensagens
          queryClient.invalidateQueries({ queryKey: ["mensagens", conversaId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversaId, queryClient]);

  return useQuery({
    queryKey: ["mensagens", conversaId],
    queryFn: async () => {
      if (!conversaId) return [];

      const { data, error } = await supabase
        .from("mensagens")
        .select("*")
        .eq("conversa_id", conversaId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Mensagem[];
    },
    enabled: !!conversaId,
    refetchInterval: 5000, // Refetch a cada 5 segundos para garantir atualizações
  });
};
