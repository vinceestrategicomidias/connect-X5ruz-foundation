import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusBadge } from "./ConnectStatusBadge";

interface ConnectPatientCardProps {
  name: string;
  lastMessage?: string;
  time?: string;
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
  unread?: number;
  onClick?: () => void;
}

export const ConnectPatientCard = ({
  name,
  lastMessage,
  time,
  status,
  unread,
  onClick,
}: ConnectPatientCardProps) => {
  return (
    <div
      onClick={onClick}
      className="p-3 hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-transparent hover:border-border"
    >
      <div className="flex items-start gap-3">
        <ConnectAvatar name={name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm text-foreground truncate">
              {name}
            </h4>
            {time && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {time}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <ConnectStatusBadge status={status} />
            {unread && unread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {unread}
              </span>
            )}
          </div>
          {lastMessage && (
            <p className="text-xs text-muted-foreground truncate mt-2">
              {lastMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
