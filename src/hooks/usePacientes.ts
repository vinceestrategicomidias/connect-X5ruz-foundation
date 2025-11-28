import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PacienteStatus = "fila" | "em_atendimento" | "finalizado";

export interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  status: PacienteStatus;
  tempo_na_fila: number;
  ultima_mensagem: string | null;
  atendente_responsavel: string | null;
  avatar: string | null;
  created_at: string;
}

export const usePacientes = (status?: PacienteStatus) => {
  return useQuery({
    queryKey: ["pacientes", status],
    queryFn: async () => {
      let query = supabase
        .from("pacientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Paciente[];
    },
  });
};

export const useTodosPacientes = () => {
  return useQuery({
    queryKey: ["pacientes", "todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .order("tempo_na_fila", { ascending: false });

      if (error) throw error;
      return data as Paciente[];
    },
  });
};
