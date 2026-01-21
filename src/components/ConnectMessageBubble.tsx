import { cn } from "@/lib/utils";
import { MessageAttachment } from "./MessageAttachment";
import { useAnexosByMensagem } from "@/hooks/useAnexos";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface ConnectMessageBubbleProps {
  content: string;
  time: string;
  type: "patient" | "attendant";
  senderName?: string;
  mensagemId?: string;
  tipoConteudo?: string;
  figurinhaId?: string | null;
  reacao?: string | null;
  favoritada?: boolean;
  destacada?: boolean;
  onClick?: () => void;
}

export const ConnectMessageBubblePatient = ({
  content,
  time,
  senderName,
  mensagemId,
  tipoConteudo,
  figurinhaId,
  reacao,
  favoritada,
  destacada,
  onClick,
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
    <div 
      className={cn(
        "flex justify-start mb-4 cursor-pointer transition-all",
        destacada && "bg-accent/50 -mx-2 px-2 py-1 rounded-lg"
      )}
      onClick={onClick}
      data-message-id={mensagemId}
    >
      <div className="max-w-[70%] relative">
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
            <div className="bg-card border border-border rounded-lg rounded-tl-none p-3 connect-shadow relative">
              <p className="text-sm text-foreground">{content}</p>
              {favoritada && (
                <Star className="h-3 w-3 text-accent fill-accent absolute -top-1 -right-1" />
              )}
            </div>
          )}
          {reacao && (
            <span className="absolute -bottom-2 left-2 text-sm bg-card border border-border rounded-full px-1.5 shadow-sm">
              {reacao}
            </span>
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
  senderName,
  mensagemId,
  tipoConteudo,
  figurinhaId,
  reacao,
  favoritada,
  destacada,
  onClick,
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
    <div 
      className={cn(
        "flex justify-end mb-4 cursor-pointer transition-all",
        destacada && "bg-accent/50 -mx-2 px-2 py-1 rounded-lg"
      )}
      onClick={onClick}
      data-message-id={mensagemId}
    >
      <div className="max-w-[70%] relative">
        {senderName && (
          <p className="text-xs text-primary font-semibold mb-1 px-1 text-right uppercase tracking-wide">
            {senderName}
          </p>
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
            <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 connect-shadow relative">
              <p className="text-sm">{content}</p>
              {favoritada && (
                <Star className="h-3 w-3 text-accent fill-accent absolute -top-1 -left-1" />
              )}
            </div>
          )}
          {reacao && (
            <span className="absolute -bottom-2 right-2 text-sm bg-card border border-border rounded-full px-1.5 shadow-sm">
              {reacao}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1 text-right">{time}</p>
      </div>
    </div>
  );
};
