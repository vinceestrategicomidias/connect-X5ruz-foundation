import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Mensagem {
  id: string;
  conversa_id: string;
  autor: "paciente" | "atendente";
  texto: string;
  horario: string;
  tipo: "texto" | "imagem" | "arquivo" | "audio";
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

      const { data, error } = await supabase
        .from("conversas")
        .select("*")
        .eq("paciente_id", pacienteId)
        .single();

      if (error) throw error;
      return data as Conversa;
    },
    enabled: !!pacienteId,
  });
};

export const useMensagensByConversa = (conversaId: string | null) => {
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
  });
};
