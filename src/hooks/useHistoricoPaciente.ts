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

const getPacienteKeyFromNome = (nome: string): string => {
  const nomeNormalizado = nome.toLowerCase();
  if (nomeNormalizado.includes("lúcia") || nomeNormalizado.includes("lucia")) return "lucia";
  if (nomeNormalizado.includes("vanessa")) return "vanessa";
  if (nomeNormalizado.includes("pedro")) return "pedro";
  if (nomeNormalizado.includes("carla")) return "carla";
  if (nomeNormalizado.includes("fernando")) return "fernando";
  return "";
};

// Mock de histórico por paciente
const historicoPorPaciente: Record<string, EventoHistorico[]> = {
  "lucia": [
    {
      id: "1",
      paciente_id: "lucia",
      tipo: "atendimento_aberto",
      titulo: "Atendimento iniciado",
      descricao: "Atendimento iniciado no setor Pré-venda",
      data_hora: new Date().toISOString(),
      origem: "connect",
    },
    {
      id: "2",
      paciente_id: "lucia",
      tipo: "documento_enviado",
      titulo: "Documento enviado",
      descricao: "Paciente enviou foto da carteira do convênio",
      data_hora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "3",
      paciente_id: "lucia",
      tipo: "transferencia",
      titulo: "Transferência de setor",
      descricao: "Transferido de Pré-venda para Convênios",
      data_hora: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "4",
      paciente_id: "lucia",
      tipo: "ligacao",
      titulo: "Ligação realizada",
      descricao: "Ligação de 5 minutos com atendente Paloma",
      data_hora: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "5",
      paciente_id: "lucia",
      tipo: "nps_respondido",
      titulo: "NPS recebido: 10",
      descricao: "Paciente avaliou o atendimento com nota máxima",
      data_hora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
  ],
  "vanessa": [
    {
      id: "v1",
      paciente_id: "vanessa",
      tipo: "atendimento_aberto",
      titulo: "Primeiro contato",
      descricao: "Primeiro contato via WhatsApp",
      data_hora: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "v2",
      paciente_id: "vanessa",
      tipo: "orcamento_enviado",
      titulo: "Orçamento enviado",
      descricao: "Orçamento de R$ 5.500 enviado para paciente",
      data_hora: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "v3",
      paciente_id: "vanessa",
      tipo: "proposta_aceita",
      titulo: "Proposta aceita",
      descricao: "Paciente aceitou proposta comercial",
      data_hora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
  ],
  "pedro": [
    {
      id: "p1",
      paciente_id: "pedro",
      tipo: "atendimento_aberto",
      titulo: "Atendimento iniciado",
      descricao: "Primeiro atendimento - setor Pré-venda",
      data_hora: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "p2",
      paciente_id: "pedro",
      tipo: "duvida_respondida",
      titulo: "Dúvida sobre pagamento",
      descricao: "Esclarecida dúvida sobre formas de pagamento",
      data_hora: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      origem: "connect",
    },
  ],
  "carla": [
    {
      id: "c1",
      paciente_id: "carla",
      tipo: "retorno",
      titulo: "Retorno de paciente",
      descricao: "Paciente VIP retornou para novo procedimento",
      data_hora: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "c2",
      paciente_id: "carla",
      tipo: "ligacao",
      titulo: "Ligação recebida",
      descricao: "Ligação de 12 minutos com atendente Geovana",
      data_hora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "c3",
      paciente_id: "carla",
      tipo: "orcamento_enviado",
      titulo: "Proposta enviada",
      descricao: "Nova proposta de R$ 12.000 enviada",
      data_hora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "c4",
      paciente_id: "carla",
      tipo: "nps_respondido",
      titulo: "NPS recebido: 9",
      descricao: "Excelente avaliação do atendimento",
      data_hora: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
  ],
  "fernando": [
    {
      id: "f1",
      paciente_id: "fernando",
      tipo: "atendimento_urgente",
      titulo: "Caso urgente registrado",
      descricao: "Atendimento marcado como urgente pela equipe",
      data_hora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
    {
      id: "f2",
      paciente_id: "fernando",
      tipo: "negociacao",
      titulo: "Negociação iniciada",
      descricao: "Iniciada negociação comercial",
      data_hora: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      origem: "connect",
    },
  ],
};

export const useHistoricoPaciente = (pacienteId?: string, pacienteNome?: string) => {
  const { data: historico = [], isLoading } = useQuery({
    queryKey: ["historico-paciente", pacienteId, pacienteNome],
    queryFn: async () => {
      if (!pacienteId) return [];

      const pacienteKey = pacienteNome ? getPacienteKeyFromNome(pacienteNome) : "";
      
      if (pacienteKey && historicoPorPaciente[pacienteKey]) {
        return historicoPorPaciente[pacienteKey];
      }

      // Fallback para dados genéricos
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
