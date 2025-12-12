import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusIndicator } from "./ConnectStatusIndicator";
import { cn } from "@/lib/utils";

interface ConnectPatientCardProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
  unread?: number;
  onClick?: () => void;
  tempoNaFila?: number;
  tempoLimiteAlerta?: number;
}

const formatarTempoEspera = (minutos: number): string => {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

const getCorTempoEspera = (minutos: number, limite: number): string => {
  if (minutos >= limite) {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (minutos >= 10) {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }
  return "bg-green-100 text-green-700 border-green-200";
};

export const ConnectPatientCard = ({
  name,
  lastMessage,
  lastMessageTime,
  status,
  unread,
  onClick,
  tempoNaFila = 0,
  tempoLimiteAlerta = 30,
}: ConnectPatientCardProps) => {
  const mostrarChipTempo = status === "espera" && tempoNaFila > 0;
  
  return (
    <div
      onClick={onClick}
      className="p-3 hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-transparent hover:border-border"
    >
      <div className="flex items-start gap-3">
        <ConnectAvatar name={name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <ConnectStatusIndicator 
              status={status} 
              tempoNaFila={tempoNaFila}
              tempoLimite={tempoLimiteAlerta}
            />
            <h4 className="font-medium text-sm text-foreground truncate flex-1">
              {name}
            </h4>
            {mostrarChipTempo && (
              <span className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap",
                getCorTempoEspera(tempoNaFila, tempoLimiteAlerta)
              )}>
                {formatarTempoEspera(tempoNaFila)}
              </span>
            )}
            {unread && unread > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {unread}
              </span>
            )}
          </div>
          {lastMessage && (
            <p className="text-xs text-muted-foreground truncate">
              {lastMessage}
            </p>
          )}
          {lastMessageTime && (
            <span className="text-[10px] text-muted-foreground">
              {lastMessageTime}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
