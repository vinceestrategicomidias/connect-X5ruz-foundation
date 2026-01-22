import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Atendente {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cargo: "atendente" | "coordenacao" | "gestor";
  avatar: string | null;
  setor_id: string | null;
  setor_nome?: string | null;
  unidade_id?: string | null;
  perfil_id?: string | null;
  ativo: boolean;
}

export const useAtendentes = (setorId?: string) => {
  return useQuery({
    queryKey: ["atendentes", setorId],
    queryFn: async () => {
      let query = supabase
        .from("atendentes")
        .select(`
          *,
          setores:setor_id (
            nome
          )
        `)
        .order("nome", { ascending: true });

      if (setorId) {
        query = query.eq("setor_id", setorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Mapear para incluir setor_nome diretamente
      return (data || []).map((atendente: any) => ({
        ...atendente,
        setor_nome: atendente.setores?.nome || null,
      })) as Atendente[];
    },
  });
};
