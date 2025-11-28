import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusBadge } from "./ConnectStatusBadge";

export const ConnectColumn2 = () => {
  return (
    <div className="flex-1 flex flex-col bg-muted/20">
      {/* Header com Avatar e Status */}
      <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between connect-shadow">
        <div className="flex items-center gap-3">
          <ConnectAvatar name="Selecione um paciente" />
          <div>
            <h3 className="font-medium text-sm text-foreground">
              Selecione um paciente
            </h3>
            <ConnectStatusBadge status="offline" />
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            Selecione um paciente para iniciar o atendimento
          </p>
        </div>
      </ScrollArea>

      {/* Input de Mensagem */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            className="flex-1"
            disabled
          />
          <Button variant="outline" size="icon" disabled>
            <Mic className="h-4 w-4" />
          </Button>
          <Button size="icon" disabled>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
