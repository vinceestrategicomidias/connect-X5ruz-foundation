import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadAnexoParams {
  mensagemId: string;
  file: File;
  tipo: string;
}

interface AnexoMetadata {
  mensagemId: string;
  tipo: string;
  nomeArquivo: string;
  urlStorage: string;
  tamanhoBytes: number;
  mimeType: string;
  duracaoSegundos?: number;
  transcricao?: string | null;
}

export const useUploadAnexo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mensagemId, file, tipo }: UploadAnexoParams) => {
      // 1. Upload do arquivo para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${mensagemId}_${Date.now()}.${fileExt}`;
      const filePath = `${tipo}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
      }

      // 2. Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      // 3. Registrar anexo no banco de dados
      const { data: anexo, error: dbError } = await supabase
        .from('anexos_mensagens')
        .insert({
          mensagem_id: mensagemId,
          tipo,
          nome_arquivo: file.name,
          url_storage: publicUrl,
          tamanho_bytes: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (dbError) {
        // Tentar limpar o arquivo se falhar o registro no banco
        await supabase.storage
          .from('chat-attachments')
          .remove([filePath]);
        
        throw new Error(`Erro ao registrar anexo: ${dbError.message}`);
      }

      return anexo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos'] });
      toast.success("Arquivo enviado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao enviar arquivo");
    },
  });
};

export const useAnexosByMensagem = (mensagemId: string | null) => {
  return useQuery({
    queryKey: ['anexos', mensagemId],
    queryFn: async () => {
      if (!mensagemId) return [];

      const { data, error } = await supabase
        .from('anexos_mensagens')
        .select('*')
        .eq('mensagem_id', mensagemId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!mensagemId,
  });
};

export const useUpdateAnexoTranscricao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ anexoId, transcricao }: { anexoId: string; transcricao: string }) => {
      const { error } = await supabase
        .from('anexos_mensagens')
        .update({ transcricao })
        .eq('id', anexoId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao salvar transcrição");
    },
  });
};

export const useDeleteAnexo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (anexoId: string) => {
      // 1. Buscar anexo para obter o caminho do arquivo
      const { data: anexo, error: fetchError } = await supabase
        .from('anexos_mensagens')
        .select('url_storage')
        .eq('id', anexoId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // 2. Extrair caminho do arquivo da URL
      const url = new URL(anexo.url_storage);
      const filePath = url.pathname.split('/').slice(-2).join('/');

      // 3. Deletar arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('chat-attachments')
        .remove([filePath]);

      if (storageError) {
        console.error('Erro ao deletar arquivo do storage:', storageError);
      }

      // 4. Deletar registro do banco
      const { error: dbError } = await supabase
        .from('anexos_mensagens')
        .delete()
        .eq('id', anexoId);

      if (dbError) {
        throw new Error(dbError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos'] });
      toast.success("Arquivo excluído");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir arquivo");
    },
  });
};
