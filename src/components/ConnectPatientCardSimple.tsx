import { cn } from "@/lib/utils";

interface ConnectPatientCardSimpleProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  onClick?: () => void;
}

const formatarPreviewMensagem = (mensagem: string | undefined): string => {
  if (!mensagem) return "";
  
  // Detectar tipos de anexo
  if (mensagem.includes("[DOCUMENTO]") || mensagem.includes("[PDF]")) return "📎 Documento";
  if (mensagem.includes("[AUDIO]") || mensagem.includes("[ÁUDIO]")) return "🎤 Áudio";
  if (mensagem.includes("[IMAGEM]") || mensagem.includes("[FOTO]")) return "🖼️ Imagem";
  if (mensagem.includes("[FIGURINHA]") || mensagem.includes("[STICKER]")) return "✨ Figurinha";
  if (mensagem.includes("[VIDEO]") || mensagem.includes("[VÍDEO]")) return "🎬 Vídeo";
  if (mensagem.includes("[CONTATO]")) return "👤 Contato";
  
  // Truncar texto longo
  if (mensagem.length > 50) {
    return mensagem.substring(0, 50) + "...";
  }
  return mensagem;
};

export const ConnectPatientCardSimple = ({
  name,
  lastMessage,
  lastMessageTime,
  onClick,
}: ConnectPatientCardSimpleProps) => {
  return (
    <div
      onClick={onClick}
      className="p-3 bg-card hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-border shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Linha 1: Nome + Horário apenas */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <h4 className="font-medium text-sm text-foreground truncate">
              {name}
            </h4>
            
            {/* Direita: Apenas horário */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {lastMessageTime && (
                <span className="text-[10px] text-muted-foreground">
                  {lastMessageTime}
                </span>
              )}
            </div>
          </div>
          
          {/* Linha 2: Preview mensagem */}
          <p className="text-xs text-muted-foreground truncate">
            {formatarPreviewMensagem(lastMessage)}
          </p>
        </div>
      </div>
    </div>
  );
};
