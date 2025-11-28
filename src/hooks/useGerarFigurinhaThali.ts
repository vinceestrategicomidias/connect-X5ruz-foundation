import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GerarFigurinhaParams {
  expressao: string;
  contexto?: string;
  nome: string;
}

export const useGerarFigurinhaThali = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ expressao, contexto, nome }: GerarFigurinhaParams) => {
      const { data, error } = await supabase.functions.invoke('gerar-figurinha-thali', {
        body: { expressao, contexto, nome }
      });

      if (error) {
        console.error('Erro ao chamar função:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['figurinhas'] });
      toast.success(data.message || "Figurinha gerada com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Erro na mutation:', error);
      
      if (error.message.includes('Limite de requisições')) {
        toast.error("Limite de requisições excedido. Aguarde alguns instantes.");
      } else if (error.message.includes('Créditos insuficientes')) {
        toast.error("Créditos insuficientes no Lovable AI. Adicione créditos em Settings → Workspace → Usage.");
      } else {
        toast.error(error.message || "Erro ao gerar figurinha");
      }
    },
  });
};
