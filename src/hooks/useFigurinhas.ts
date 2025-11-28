import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Figurinha {
  id: string;
  pacote_id: string;
  nome: string;
  descricao: string | null;
  url_imagem: string;
  tags: string[] | null;
  ordem: number;
  ativo: boolean;
}

export interface PacoteFigurinhas {
  id: string;
  nome: string;
  tipo: 'institucional' | 'thali';
  descricao: string | null;
  ativo: boolean;
}

export const usePacotesFigurinhas = () => {
  return useQuery({
    queryKey: ['pacotes-figurinhas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pacotes_figurinhas')
        .select('*')
        .eq('ativo', true)
        .order('tipo', { ascending: true });

      if (error) throw error;
      return data as PacoteFigurinhas[];
    },
  });
};

export const useFigurinhasByPacote = (pacoteId: string | null) => {
  return useQuery({
    queryKey: ['figurinhas', pacoteId],
    queryFn: async () => {
      if (!pacoteId) return [];

      const { data, error } = await supabase
        .from('figurinhas')
        .select('*')
        .eq('pacote_id', pacoteId)
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Figurinha[];
    },
    enabled: !!pacoteId,
  });
};

export const useUploadFigurinha = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pacoteId,
      nome,
      descricao,
      file,
      tags,
    }: {
      pacoteId: string;
      nome: string;
      descricao?: string;
      file: File;
      tags?: string[];
    }) => {
      // Upload da imagem
      const fileExt = file.name.split('.').pop();
      const fileName = `${pacoteId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('figurinhas')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('figurinhas')
        .getPublicUrl(filePath);

      // Registrar figurinha no banco
      const { data, error: dbError } = await supabase
        .from('figurinhas')
        .insert({
          pacote_id: pacoteId,
          nome,
          descricao,
          url_imagem: publicUrl,
          tags,
        })
        .select()
        .single();

      if (dbError) {
        // Limpar arquivo se falhar
        await supabase.storage.from('figurinhas').remove([filePath]);
        throw dbError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['figurinhas'] });
      toast.success("Figurinha adicionada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar figurinha");
    },
  });
};
