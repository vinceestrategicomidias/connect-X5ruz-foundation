import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Atendente {
  id: string;
  nome: string;
  cargo: "atendente" | "coordenacao" | "gestor";
  avatar: string | null;
  setor_id: string;
}

export const useAtendentes = (setorId?: string) => {
  return useQuery({
    queryKey: ["atendentes", setorId],
    queryFn: async () => {
      let query = supabase
        .from("atendentes")
        .select("*")
        .order("nome", { ascending: true });

      if (setorId) {
        query = query.eq("setor_id", setorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Atendente[];
    },
  });
};
