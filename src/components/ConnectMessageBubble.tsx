import { cn } from "@/lib/utils";
import { MessageAttachment } from "./MessageAttachment";
import { useAnexosByMensagem } from "@/hooks/useAnexos";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ConnectMessageBubbleProps {
  content: string;
  time: string;
  type: "patient" | "attendant";
  senderName?: string;
  mensagemId?: string;
  tipoConteudo?: string;
  figurinhaId?: string | null;
}

export const ConnectMessageBubblePatient = ({
  content,
  time,
  senderName,
  mensagemId,
  tipoConteudo,
  figurinhaId,
}: Omit<ConnectMessageBubbleProps, "type">) => {
  const { data: anexos } = useAnexosByMensagem(mensagemId || null);
  
  const { data: figurinha } = useQuery({
    queryKey: ['figurinha', figurinhaId],
    queryFn: async () => {
      if (!figurinhaId) return null;
      
      const { data, error } = await supabase
        .from('figurinhas')
        .select('*')
        .eq('id', figurinhaId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!figurinhaId && tipoConteudo === 'figurinha',
  });

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%]">
        {senderName && (
          <p className="text-xs text-muted-foreground mb-1 px-1">{senderName}</p>
        )}
        <div className="space-y-2">
          {anexos && anexos.length > 0 && (
            <div className="space-y-2">
          {anexos.map((anexo) => (
            <MessageAttachment
              key={anexo.id}
              id={anexo.id}
              tipo={anexo.tipo}
              nomeArquivo={anexo.nome_arquivo}
              urlStorage={anexo.url_storage}
              tamanhoBytes={anexo.tamanho_bytes || 0}
              mimeType={anexo.mime_type || ''}
              transcricao={anexo.transcricao}
            />
          ))}
            </div>
          )}
          {tipoConteudo === 'figurinha' && figurinha ? (
            <div className="inline-block">
              <img
                src={figurinha.url_imagem}
                alt={figurinha.nome}
                className="w-32 h-32 object-contain rounded-lg"
                title={figurinha.nome}
              />
            </div>
          ) : content && (
            <div className="bg-card border border-border rounded-lg rounded-tl-none p-3 connect-shadow">
              <p className="text-sm text-foreground">{content}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">{time}</p>
      </div>
    </div>
  );
};

export const ConnectMessageBubbleAttendant = ({
  content,
  time,
  mensagemId,
  tipoConteudo,
  figurinhaId,
}: Omit<ConnectMessageBubbleProps, "type" | "senderName">) => {
  const { data: anexos } = useAnexosByMensagem(mensagemId || null);
  
  const { data: figurinha } = useQuery({
    queryKey: ['figurinha', figurinhaId],
    queryFn: async () => {
      if (!figurinhaId) return null;
      
      const { data, error } = await supabase
        .from('figurinhas')
        .select('*')
        .eq('id', figurinhaId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!figurinhaId && tipoConteudo === 'figurinha',
  });

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[70%]">
        <div className="space-y-2">
          {anexos && anexos.length > 0 && (
            <div className="space-y-2">
              {anexos.map((anexo) => (
                <MessageAttachment
                  key={anexo.id}
                  id={anexo.id}
                  tipo={anexo.tipo}
                  nomeArquivo={anexo.nome_arquivo}
                  urlStorage={anexo.url_storage}
                  tamanhoBytes={anexo.tamanho_bytes || 0}
                  mimeType={anexo.mime_type || ''}
                  transcricao={anexo.transcricao}
                />
              ))}
            </div>
          )}
          {tipoConteudo === 'figurinha' && figurinha ? (
            <div className="inline-block">
              <img
                src={figurinha.url_imagem}
                alt={figurinha.nome}
                className="w-32 h-32 object-contain rounded-lg"
                title={figurinha.nome}
              />
            </div>
          ) : content && (
            <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 connect-shadow">
              <p className="text-sm">{content}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1 text-right">{time}</p>
      </div>
    </div>
  );
};
