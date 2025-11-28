import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusIndicator } from "./ConnectStatusIndicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PerfilPacienteSheet } from "./PerfilPacienteSheet";
import { Paciente } from "@/hooks/usePacientes";

interface ConnectPatientCardProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
  unread?: number;
  onClick?: () => void;
  tempoNaFila?: number;
  paciente?: Paciente;
}

export const ConnectPatientCard = ({
  name,
  lastMessage,
  lastMessageTime,
  status,
  unread,
  onClick,
  tempoNaFila,
  paciente,
}: ConnectPatientCardProps) => {
  const [perfilOpen, setPerfilOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handlePerfilClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPerfilOpen(true);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="p-3 hover:bg-muted/50 cursor-pointer connect-transition rounded-lg border border-transparent hover:border-border group"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handlePerfilClick}>
                    Ver perfil do paciente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {lastMessage && (
              <p className="text-xs text-muted-foreground truncate">
                {lastMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <PerfilPacienteSheet
        open={perfilOpen}
        onOpenChange={setPerfilOpen}
        paciente={paciente || null}
      />
    </>
  );
};
