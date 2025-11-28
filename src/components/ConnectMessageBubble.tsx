import { cn } from "@/lib/utils";
import { MessageAttachment } from "./MessageAttachment";
import { useAnexosByMensagem } from "@/hooks/useAnexos";

interface ConnectMessageBubbleProps {
  content: string;
  time: string;
  type: "patient" | "attendant";
  senderName?: string;
  mensagemId?: string;
}

export const ConnectMessageBubblePatient = ({
  content,
  time,
  senderName,
  mensagemId,
}: Omit<ConnectMessageBubbleProps, "type">) => {
  const { data: anexos } = useAnexosByMensagem(mensagemId || null);

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
          {content && (
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
}: Omit<ConnectMessageBubbleProps, "type" | "senderName">) => {
  const { data: anexos } = useAnexosByMensagem(mensagemId || null);

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
          {content && (
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
