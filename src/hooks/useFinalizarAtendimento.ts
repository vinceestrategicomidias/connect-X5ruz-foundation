import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DadosFinalizacao {
  pacienteId: string;
  pacienteNome: string;
  atendenteId: string;
  atendenteNome: string;
  motivo: string;
  submotivo?: string;
  observacao?: string;
}

export const useFinalizarAtendimento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: DadosFinalizacao) => {
      // 1. Atualizar status do paciente para finalizado
      const { error: pacienteError } = await supabase
        .from("pacientes")
        .update({
          status: "finalizado",
          atendente_responsavel: null,
        })
        .eq("id", dados.pacienteId);

      if (pacienteError) throw pacienteError;

      // 2. Registrar no histórico (usando notificações como registro)
      const motivoLabel = {
        vendido: "Vendido",
        em_negociacao: "Em negociação",
        objecao: "Objeção",
      }[dados.motivo] || dados.motivo;

      const submotivoLabel = dados.submotivo
        ? {
            financeiro: "Financeiro",
            tempo: "Tempo",
            sem_interesse: "Sem interesse",
            concorrencia: "Fechou com concorrência",
          }[dados.submotivo] || dados.submotivo
        : null;

      const mensagemHistorico = [
        `Atendimento finalizado por ${dados.atendenteNome}`,
        `Motivo: ${motivoLabel}`,
        submotivoLabel ? `Submotivo: ${submotivoLabel}` : null,
        dados.observacao ? `Obs: ${dados.observacao}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      // Criar registro na tabela de notificações como evento de histórico
      const { error: notificacaoError } = await supabase
        .from("notificacoes")
        .insert({
          tipo: "finalizacao_atendimento",
          titulo: "Atendimento finalizado",
          mensagem: mensagemHistorico,
          usuario_destino_id: dados.atendenteId,
          referencia_id: dados.pacienteId,
          lida: true, // Marcar como lida pois é registro de histórico
        });

      if (notificacaoError) {
        console.error("Erro ao registrar histórico:", notificacaoError);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      toast.success("Atendimento finalizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao finalizar:", error);
      toast.error("Erro ao finalizar atendimento");
    },
  });
};
