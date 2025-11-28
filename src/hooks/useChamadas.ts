import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type StatusChamada =
  | "discando"
  | "chamando"
  | "atendida"
  | "perdida"
  | "encerrada";

export interface Chamada {
  id: string;
  paciente_id: string | null;
  atendente_id: string;
  numero_discado: string;
  horario_inicio: string;
  horario_fim: string | null;
  duracao: number | null;
  status: StatusChamada;
  tipo: "manual" | "paciente";
  setor_origem: string | null;
  observacoes: string | null;
  created_at: string;
}

export const useChamadas = (atendenteId?: string, setorId?: string) => {
  return useQuery({
    queryKey: ["chamadas", atendenteId, setorId],
    queryFn: async () => {
      let query = supabase
        .from("chamadas")
        .select("*")
        .order("horario_inicio", { ascending: false });

      if (atendenteId) {
        query = query.eq("atendente_id", atendenteId);
      }

      if (setorId) {
        query = query.eq("setor_origem", setorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Chamada[];
    },
  });
};

export const useIniciarChamada = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      numeroDiscado,
      atendenteId,
      setorOrigem,
      pacienteId,
      tipo = "manual",
    }: {
      numeroDiscado: string;
      atendenteId: string;
      setorOrigem: string;
      pacienteId?: string;
      tipo?: "manual" | "paciente";
    }) => {
      const { data, error } = await supabase
        .from("chamadas")
        .insert({
          numero_discado: numeroDiscado,
          atendente_id: atendenteId,
          setor_origem: setorOrigem,
          paciente_id: pacienteId || null,
          tipo,
          status: "discando",
        })
        .select()
        .single();

      if (error) throw error;
      return data as Chamada;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chamadas"] });
    },
    onError: () => {
      toast.error("Erro ao iniciar chamada");
    },
  });
};

export const useAtualizarChamada = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chamadaId,
      status,
      observacoes,
    }: {
      chamadaId: string;
      status?: StatusChamada;
      observacoes?: string;
    }) => {
      const updateData: any = {};

      if (status) {
        updateData.status = status;

        if (status === "encerrada") {
          const { data: chamada } = await supabase
            .from("chamadas")
            .select("horario_inicio")
            .eq("id", chamadaId)
            .single();

          if (chamada) {
            const inicio = new Date(chamada.horario_inicio);
            const fim = new Date();
            const duracao = Math.floor((fim.getTime() - inicio.getTime()) / 1000);

            updateData.horario_fim = fim.toISOString();
            updateData.duracao = duracao;
          }
        }
      }

      if (observacoes !== undefined) {
        updateData.observacoes = observacoes;
      }

      const { data, error } = await supabase
        .from("chamadas")
        .update(updateData)
        .eq("id", chamadaId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chamadas"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar chamada");
    },
  });
};
