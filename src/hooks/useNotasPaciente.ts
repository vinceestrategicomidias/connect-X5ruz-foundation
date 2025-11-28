import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface NotaPaciente {
  id: string;
  paciente_id: string;
  texto: string;
  tag?: string;
  usuario_id: string;
  usuario_nome: string;
  setor: string;
  created_at: string;
}

export const useNotasPaciente = (pacienteId?: string) => {
  const queryClient = useQueryClient();

  const { data: notas = [], isLoading } = useQuery({
    queryKey: ["notas-paciente", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return [];

      // Simulação de dados - em produção, viria do banco
      const mockNotas: NotaPaciente[] = [
        {
          id: "1",
          paciente_id: pacienteId,
          texto: "Paciente demonstrou interesse em cirurgia estética. Solicitar orçamento detalhado.",
          tag: "financeiro",
          usuario_id: "user1",
          usuario_nome: "Paloma Ribeiro",
          setor: "Pré-venda",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          paciente_id: pacienteId,
          texto: "Cliente preferencial. Já realizou 3 procedimentos anteriormente com alta satisfação.",
          tag: "comportamento",
          usuario_id: "user2",
          usuario_nome: "Geovana Costa",
          setor: "Pós-venda",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      return mockNotas;
    },
    enabled: !!pacienteId,
  });

  const adicionarNotaMutation = useMutation({
    mutationFn: async (novaNota: {
      paciente_id: string;
      texto: string;
      tag?: string;
    }) => {
      // Em produção, isso faria um INSERT no banco
      const { data: userData } = await supabase.auth.getUser();
      
      const nota: NotaPaciente = {
        id: Math.random().toString(),
        paciente_id: novaNota.paciente_id,
        texto: novaNota.texto,
        tag: novaNota.tag,
        usuario_id: userData.user?.id || "user1",
        usuario_nome: "Você",
        setor: "Pré-venda",
        created_at: new Date().toISOString(),
      };

      return nota;
    },
    onSuccess: (novaNota) => {
      queryClient.setQueryData(
        ["notas-paciente", novaNota.paciente_id],
        (old: NotaPaciente[] = []) => [novaNota, ...old]
      );
      toast({
        title: "Nota adicionada",
        description: "A nota foi registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a nota.",
        variant: "destructive",
      });
    },
  });

  return {
    notas,
    isLoading,
    adicionarNota: adicionarNotaMutation.mutate,
  };
};
