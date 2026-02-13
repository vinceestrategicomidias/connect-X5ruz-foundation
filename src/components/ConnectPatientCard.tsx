import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConnectPatientCardProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
  unread?: number;
  onClick?: () => void;
  tempoNaFila?: number;
  tempoSemResposta?: number;
  tempoLimiteAlerta?: number;
  avatar?: string;
}

const formatarTempoEspera = (minutos: number): string => {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `${horas}h${mins.toString().padStart(2, '0')}` : `${horas}h`;
};

const formatarPreviewMensagem = (mensagem: string | undefined): string => {
  if (!mensagem) return "";
  
  if (mensagem.includes("[DOCUMENTO]") || mensagem.includes("[PDF]")) return "📎 Documento";
  if (mensagem.includes("[AUDIO]") || mensagem.includes("[ÁUDIO]")) return "🎤 Áudio";
  if (mensagem.includes("[IMAGEM]") || mensagem.includes("[FOTO]")) return "🖼️ Imagem";
  if (mensagem.includes("[FIGURINHA]") || mensagem.includes("[STICKER]")) return "✨ Figurinha";
  if (mensagem.includes("[VIDEO]") || mensagem.includes("[VÍDEO]")) return "🎬 Vídeo";
  if (mensagem.includes("[CONTATO]")) return "👤 Contato";
  
  if (mensagem.length > 40) {
    return mensagem.substring(0, 40) + "...";
  }
  return mensagem;
};

// Gera iniciais do nome
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Gera uma cor de fundo baseada no nome para o avatar
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-rose-500",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
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
  avatar,
}: ConnectPatientCardProps) => {
  const isEspera = status === "espera";
  const isAndamento = status === "andamento";
  const isFinalizado = status === "finalizado";
  
  const tempoExibido = isEspera ? tempoNaFila : (isAndamento ? tempoSemResposta : 0);
  const mostrarTempo = isEspera || isAndamento;
  const mostrarBolinha = mostrarTempo && tempoExibido > 0;
  const avatarColor = getAvatarColor(name);
  
  return (
    <div
      onClick={onClick}
      className="p-2.5 bg-card hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-border shadow-sm"
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar do paciente */}
        <div className="relative flex-shrink-0 mt-0.5">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className={cn("text-white text-xs font-medium", avatarColor)}>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          {/* Linha 1: Nome completo */}
          <h4 className="font-medium text-sm text-foreground truncate">
            {name}
          </h4>
          
          {/* Linha 2: Preview mensagem (finalizados: horário antes da mensagem) */}
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {isFinalizado && lastMessageTime ? (
              <><span className="tabular-nums">{lastMessageTime}</span> {formatarPreviewMensagem(lastMessage)}</>
            ) : (
              formatarPreviewMensagem(lastMessage)
            )}
          </p>

          {/* Linha 3: Horário | Tempo de espera | Badge não lidas (oculto em finalizados) */}
          {!isFinalizado && (
            <div className="flex items-center gap-1.5 mt-1">
              {lastMessageTime && (
                <span className="text-[11px] text-muted-foreground whitespace-nowrap tabular-nums">
                  {lastMessageTime}
                </span>
              )}
              {mostrarTempo && tempoExibido > 0 && (
                <>
                  <span className="text-[10px] text-muted-foreground">|</span>
                  <span className={cn(
                    "text-[11px] font-medium whitespace-nowrap tabular-nums",
                    tempoExibido >= 30
                      ? "text-destructive"
                      : tempoExibido >= 15
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                  )}>
                    {formatarTempoEspera(tempoExibido)}
                  </span>
                </>
              )}
              {!!unread && unread > 0 && (
                <>
                  <span className="text-[10px] text-muted-foreground">|</span>
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {unread}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
