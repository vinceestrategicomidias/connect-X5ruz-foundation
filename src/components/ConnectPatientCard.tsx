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

// Cores de intensidade: verde 0-14min, amarelo 15-29min, vermelho 30+ min
const getCorBolinha = (minutos: number): string => {
  if (minutos >= 30) {
    return "bg-red-500";
  }
  if (minutos >= 15) {
    return "bg-yellow-500";
  }
  // Verde para 0-14 min
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
      className="p-3 bg-card hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-border shadow-sm overflow-hidden"
    >
      <div className="flex items-start gap-3 w-full overflow-hidden">
        <div className="flex-shrink-0">
          <ConnectAvatar name={name} size="md" />
        </div>
        
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Linha 1: Nome do paciente */}
          <div className="mb-0.5">
            <h4 className="font-medium text-sm text-foreground truncate">
              {name}
            </h4>
          </div>
          
          {/* Linha 2: Preview mensagem */}
          <p className="text-xs text-muted-foreground truncate mb-1">
            {formatarPreviewMensagem(lastMessage)}
          </p>
          
          {/* Linha 3: Bolinha tempo + Tempo | Horário | Não lidas */}
          <div className="flex items-center justify-between gap-1">
            {/* Bolinha colorida + tempo de espera */}
            <div className="flex items-center gap-1 min-w-0 flex-shrink">
              {mostrarTempo && tempoExibido > 0 && (
                <>
                  <span className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    tempoExibido >= 30 
                      ? "bg-red-500"
                      : tempoExibido >= 15
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  )} />
                  <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                    {formatarTempoEspera(tempoExibido)}
                  </span>
                </>
              )}
            </div>
            
            {/* Horário da mensagem + Badge não lidas (bolinha azul) */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {lastMessageTime && (
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {lastMessageTime}
                </span>
              )}
              {unread && unread > 0 && (
                <span className="bg-blue-500 text-white text-[9px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full flex-shrink-0">
                  {unread}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
