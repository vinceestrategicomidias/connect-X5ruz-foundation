import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DocumentoPaciente {
  id: string;
  paciente_id: string;
  nome: string;
  tipo: string;
  url: string;
  data_envio: string;
  enviado_por: string;
  origem: string;
}

export const useDocumentosPaciente = (pacienteId?: string) => {
  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ["documentos-paciente", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return [];

      // Simulação de dados - em produção, viria do banco
      const mockDocumentos: DocumentoPaciente[] = [
        {
          id: "1",
          paciente_id: pacienteId,
          nome: "Carteira do convênio.pdf",
          tipo: "PDF",
          url: "#",
          data_envio: new Date().toISOString(),
          enviado_por: "Paloma Ribeiro",
          origem: "upload",
        },
        {
          id: "2",
          paciente_id: pacienteId,
          nome: "Exame pré-operatório.jpg",
          tipo: "Imagem",
          url: "#",
          data_envio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          enviado_por: "Geovana Costa",
          origem: "conversa",
        },
      ];

      return mockDocumentos;
    },
    enabled: !!pacienteId,
  });

  return {
    documentos,
    isLoading,
  };
};
