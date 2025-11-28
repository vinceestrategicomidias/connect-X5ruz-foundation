import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEnviarMensagem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversaId,
      texto,
      autor,
      tipo = "texto",
    }: {
      conversaId: string;
      texto: string;
      autor: "paciente" | "atendente";
      tipo?: "texto" | "imagem" | "arquivo" | "audio";
    }) => {
      const horario = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const { data, error } = await supabase
        .from("mensagens")
        .insert({
          conversa_id: conversaId,
          texto,
          autor,
          tipo,
          horario,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar última mensagem do paciente
      const { data: conversa } = await supabase
        .from("conversas")
        .select("paciente_id")
        .eq("id", conversaId)
        .single();

      if (conversa) {
        await supabase
          .from("pacientes")
          .update({ ultima_mensagem: texto })
          .eq("id", conversa.paciente_id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensagens"] });
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem");
    },
  });
};

export const useAtualizarStatusPaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pacienteId,
      novoStatus,
      atendenteId,
    }: {
      pacienteId: string;
      novoStatus: "fila" | "em_atendimento" | "finalizado";
      atendenteId?: string;
    }) => {
      const updateData: any = {
        status: novoStatus,
      };

      if (novoStatus === "em_atendimento" && atendenteId) {
        updateData.atendente_responsavel = atendenteId;
        updateData.tempo_na_fila = 0;
      }

      const { data, error } = await supabase
        .from("pacientes")
        .update(updateData)
        .eq("id", pacienteId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      toast.success("Status atualizado");
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });
};

export const useTransferirAtendimento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pacienteId,
      novoAtendenteId,
      novoSetorId,
      conversaId,
      voltarParaFila = false,
    }: {
      pacienteId: string;
      novoAtendenteId?: string;
      novoSetorId?: string;
      conversaId: string;
      voltarParaFila?: boolean;
    }) => {
      const updateData: any = {};

      if (voltarParaFila) {
        updateData.status = "fila";
        updateData.atendente_responsavel = null;
      } else if (novoAtendenteId) {
        updateData.atendente_responsavel = novoAtendenteId;
        updateData.status = "em_atendimento";
      }

      if (novoSetorId) {
        updateData.setor_id = novoSetorId;
        updateData.status = "fila";
        updateData.atendente_responsavel = null;
      }

      // Atualizar paciente
      const { error: pacienteError } = await supabase
        .from("pacientes")
        .update(updateData)
        .eq("id", pacienteId);

      if (pacienteError) throw pacienteError;

      // Atualizar conversa se houver novo atendente
      if (novoAtendenteId) {
        const { error: conversaError } = await supabase
          .from("conversas")
          .update({ atendente_id: novoAtendenteId })
          .eq("id", conversaId);

        if (conversaError) throw conversaError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      queryClient.invalidateQueries({ queryKey: ["conversa"] });
      toast.success("Atendimento transferido");
    },
    onError: () => {
      toast.error("Erro ao transferir atendimento");
    },
  });
};
