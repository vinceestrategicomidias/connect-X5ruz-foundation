import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GerarAvatarResult {
  avatarUrl: string;
  nome: string;
  genero: "feminino" | "masculino";
}

export const useGerarAvatarPaciente = () => {
  const [isLoading, setIsLoading] = useState(false);

  const gerarAvatar = async (nome: string, genero?: "feminino" | "masculino"): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke<GerarAvatarResult>("gerar-avatar-paciente", {
        body: { nome, genero },
      });

      if (error) {
        console.error("Erro ao gerar avatar:", error);
        toast.error("Erro ao gerar foto de perfil");
        return null;
      }

      if (data?.avatarUrl) {
        toast.success(`Foto de perfil gerada para ${nome}`);
        return data.avatarUrl;
      }

      return null;
    } catch (err) {
      console.error("Erro ao chamar função:", err);
      toast.error("Erro ao gerar foto de perfil");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    gerarAvatar,
    isLoading,
  };
};
