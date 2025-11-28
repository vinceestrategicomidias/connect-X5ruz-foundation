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
  setor_id: string;
  created_at: string;
}

export const usePacientes = (status?: PacienteStatus, setorId?: string) => {
  return useQuery({
    queryKey: ["pacientes", status, setorId],
    queryFn: async () => {
      let query = supabase
        .from("pacientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      if (setorId) {
        query = query.eq("setor_id", setorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Paciente[];
    },
  });
};

export const useTodosPacientes = (setorId?: string) => {
  return useQuery({
    queryKey: ["pacientes", "todos", setorId],
    queryFn: async () => {
      let query = supabase
        .from("pacientes")
        .select("*")
        .order("tempo_na_fila", { ascending: false });

      if (setorId) {
        query = query.eq("setor_id", setorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Paciente[];
    },
  });
};
