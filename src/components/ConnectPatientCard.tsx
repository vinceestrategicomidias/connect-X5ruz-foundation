import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusIndicator } from "./ConnectStatusIndicator";

interface ConnectPatientCardProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
  unread?: number;
  onClick?: () => void;
  tempoNaFila?: number;
}

export const ConnectPatientCard = ({
  name,
  lastMessage,
  lastMessageTime,
  status,
  unread,
  onClick,
  tempoNaFila,
}: ConnectPatientCardProps) => {
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
            />
            <h4 className="font-medium text-sm text-foreground truncate flex-1">
              {name}
            </h4>
            {lastMessageTime && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {lastMessageTime}
              </span>
            )}
            {unread && unread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {unread}
              </span>
            )}
          </div>
          {lastMessage && (
            <p className="text-xs text-muted-foreground truncate">
              {lastMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
