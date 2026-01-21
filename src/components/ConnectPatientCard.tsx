import { ConnectAvatar } from "./ConnectAvatar";
import { cn } from "@/lib/utils";

interface ConnectPatientCardProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
  unread?: number;
  onClick?: () => void;
  tempoNaFila?: number;
  tempoSemResposta?: number; // Novo: para Meus Atendimentos
  tempoLimiteAlerta?: number;
}

const formatarTempoEspera = (minutos: number): string => {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `${horas}h${mins.toString().padStart(2, '0')}` : `${horas}h`;
};

const getCorBolinha = (minutos: number): string => {
  if (minutos >= 30) {
    return "bg-red-500";
  }
  if (minutos >= 15) {
    return "bg-orange-500";
  }
  // Verde para <= 5 min (ou qualquer valor abaixo de 15)
  return "bg-green-500";
};

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

export const ConnectPatientCard = ({
  name,
  lastMessage,
  lastMessageTime,
  status,
  unread,
  onClick,
  tempoNaFila = 0,
  tempoSemResposta = 0,
}: ConnectPatientCardProps) => {
  const isEspera = status === "espera";
  const isAndamento = status === "andamento";
  
  // Usa tempoNaFila para Fila e tempoSemResposta para Meus Atendimentos
  const tempoExibido = isEspera ? tempoNaFila : (isAndamento ? tempoSemResposta : 0);
  const mostrarTempo = isEspera || isAndamento;
  const mostrarBolinha = mostrarTempo && tempoExibido > 0;
  
  return (
    <div
      onClick={onClick}
      className="p-3 hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-transparent hover:border-border"
    >
      <div className="flex items-start gap-3">
        <ConnectAvatar name={name} size="md" />
        
        <div className="flex-1 min-w-0">
          {/* Linha 1: Bolinha + Nome | Horário */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {mostrarBolinha && (
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full flex-shrink-0",
                  getCorBolinha(tempoExibido)
                )} />
              )}
              <h4 className="font-medium text-sm text-foreground truncate">
                {name}
              </h4>
            </div>
            {lastMessageTime && (
              <span className="text-[11px] text-muted-foreground flex-shrink-0">
                {lastMessageTime}
              </span>
            )}
          </div>
          
          {/* Linha 2: Preview mensagem | Tempo */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground truncate flex-1">
              {formatarPreviewMensagem(lastMessage)}
            </p>
            {mostrarTempo && tempoExibido > 0 && (
              <span className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0",
                tempoExibido >= 30 
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : tempoExibido >= 15
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              )}>
                {formatarTempoEspera(tempoExibido)}
              </span>
            )}
          </div>
          
          {/* Linha 3: Badge de não lidas */}
          {unread && unread > 0 && (
            <div className="flex justify-end mt-1">
              <span className="bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                {unread}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
