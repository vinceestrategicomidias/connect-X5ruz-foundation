import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EventoHistorico {
  id: string;
  paciente_id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  data_hora: string;
  origem: "connect" | "externo";
  referencia_id?: string;
}

export const useHistoricoPaciente = (pacienteId?: string) => {
  const { data: historico = [], isLoading } = useQuery({
    queryKey: ["historico-paciente", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return [];

      // Simulação de dados - em produção, viria do banco
      const mockHistorico: EventoHistorico[] = [
        {
          id: "1",
          paciente_id: pacienteId,
          tipo: "atendimento_aberto",
          titulo: "Atendimento iniciado",
          descricao: "Atendimento iniciado no setor Pré-venda",
          data_hora: new Date().toISOString(),
          origem: "connect",
        },
        {
          id: "2",
          paciente_id: pacienteId,
          tipo: "documento_enviado",
          titulo: "Documento enviado",
          descricao: "Paciente enviou foto da carteira do convênio",
          data_hora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          origem: "connect",
        },
        {
          id: "3",
          paciente_id: pacienteId,
          tipo: "transferencia",
          titulo: "Transferência de setor",
          descricao: "Transferido de Pré-venda para Convênios",
          data_hora: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          origem: "connect",
        },
        {
          id: "4",
          paciente_id: pacienteId,
          tipo: "ligacao",
          titulo: "Ligação realizada",
          descricao: "Ligação de 5 minutos com atendente Paloma",
          data_hora: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          origem: "connect",
        },
        {
          id: "5",
          paciente_id: pacienteId,
          tipo: "nps_respondido",
          titulo: "NPS recebido: 10",
          descricao: "Paciente avaliou o atendimento com nota máxima",
          data_hora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          origem: "connect",
        },
      ];

      return mockHistorico;
    },
    enabled: !!pacienteId,
  });

  return {
    historico,
    isLoading,
  };
};
