import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConnectPatientCardSimpleProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  avatar?: string;
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
  if (mensagem.length > 45) {
    return mensagem.substring(0, 45) + "...";
  }
  return mensagem;
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

// Gera iniciais do nome
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const ConnectPatientCardSimple = ({
  name,
  lastMessage,
  lastMessageTime,
  avatar,
  onClick,
}: ConnectPatientCardSimpleProps) => {
  const avatarColor = getAvatarColor(name);
  
  return (
    <div
      onClick={onClick}
      className="p-3 bg-card hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-border shadow-sm"
    >
      <div className="flex items-center gap-3">
        {/* Avatar do paciente */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className={cn("text-white text-sm font-medium", avatarColor)}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Linha 1: Nome + Horário */}
          <div className="flex items-center justify-between gap-3 mb-0.5">
            <h4 className="font-medium text-sm text-foreground truncate flex-1 min-w-0">
              {name}
            </h4>
            
            {/* Horário com espaçamento adequado */}
            {lastMessageTime && (
              <span className="text-[11px] text-muted-foreground flex-shrink-0 tabular-nums pr-1">
                {lastMessageTime}
              </span>
            )}
          </div>
          
          {/* Linha 2: Preview mensagem */}
          <p className="text-xs text-muted-foreground truncate pr-1">
            {formatarPreviewMensagem(lastMessage)}
          </p>
        </div>
      </div>
    </div>
  );
};
