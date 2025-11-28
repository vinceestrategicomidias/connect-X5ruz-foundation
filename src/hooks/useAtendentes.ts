import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Atendente {
  id: string;
  nome: string;
  cargo: string;
  avatar: string | null;
}

export const useAtendentes = () => {
  return useQuery({
    queryKey: ["atendentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendentes")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Atendente[];
    },
  });
};
