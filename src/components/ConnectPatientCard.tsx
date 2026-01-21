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
  
  const tempoExibido = isEspera ? tempoNaFila : (isAndamento ? tempoSemResposta : 0);
  const mostrarTempo = isEspera || isAndamento;
  const mostrarBolinha = mostrarTempo && tempoExibido > 0;
  const avatarColor = getAvatarColor(name);
  
  return (
    <div
      onClick={onClick}
      className="p-3 bg-card hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-border shadow-sm"
    >
      <div className="flex items-center gap-3">
        {/* Avatar do paciente */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className={cn("text-white text-sm font-medium", avatarColor)}>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Bolinha de status sobreposta ao avatar */}
          {mostrarBolinha && (
            <span className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card",
              tempoExibido >= 30 
                ? "bg-destructive"
                : tempoExibido >= 15
                  ? "bg-yellow-500"
                  : "bg-green-500"
            )} />
          )}
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Linha 1: Nome e metadados */}
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm text-foreground truncate flex-1 min-w-0">
              {name}
            </h4>
            
            {/* Horário e Tempo */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {lastMessageTime && (
                <span className="text-[11px] text-muted-foreground whitespace-nowrap tabular-nums">
                  {lastMessageTime}
                </span>
              )}
              {mostrarTempo && tempoExibido > 0 && (
                <>
                  <span className="text-[10px] text-muted-foreground">|</span>
                  <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap tabular-nums">
                    {formatarTempoEspera(tempoExibido)}
                  </span>
                </>
              )}
              {/* Badge de não lidas */}
              {unread && unread > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 ml-1">
                  {unread}
                </span>
              )}
            </div>
          </div>
          
          {/* Linha 2: Preview mensagem */}
          <p className="text-xs text-muted-foreground truncate mt-0.5 pr-1">
            {formatarPreviewMensagem(lastMessage)}
          </p>
        </div>
      </div>
    </div>
  );
};
