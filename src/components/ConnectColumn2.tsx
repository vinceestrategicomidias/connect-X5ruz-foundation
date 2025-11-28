import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusBadge } from "./ConnectStatusBadge";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useConversaByPaciente, useMensagensByConversa } from "@/hooks/useConversas";
import { ConnectMessageBubblePatient, ConnectMessageBubbleAttendant } from "./ConnectMessageBubble";

export const ConnectColumn2 = () => {
  const { pacienteSelecionado } = usePacienteContext();
  const { data: conversa } = useConversaByPaciente(pacienteSelecionado?.id || null);
  const { data: mensagens } = useMensagensByConversa(conversa?.id || null);

  const getStatusBadge = () => {
    if (!pacienteSelecionado) return "offline";
    
    switch (pacienteSelecionado.status) {
      case "fila":
        return "espera";
      case "em_atendimento":
        return "andamento";
      case "finalizado":
        return "finalizado";
      default:
        return "offline";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/20">
      {/* Header com Avatar e Status */}
      <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between connect-shadow">
        <div className="flex items-center gap-3">
          <ConnectAvatar 
            name={pacienteSelecionado?.nome || "Selecione um paciente"} 
            image={pacienteSelecionado?.avatar || undefined}
          />
          <div>
            <h3 className="font-medium text-sm text-foreground">
              {pacienteSelecionado?.nome || "Selecione um paciente"}
            </h3>
            <ConnectStatusBadge status={getStatusBadge()} />
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-6">
        {!pacienteSelecionado ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              Selecione um paciente para iniciar o atendimento
            </p>
          </div>
        ) : !mensagens || mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              Nenhuma mensagem ainda
            </p>
          </div>
        ) : (
          <div>
            {mensagens.map((mensagem) =>
              mensagem.autor === "paciente" ? (
                <ConnectMessageBubblePatient
                  key={mensagem.id}
                  content={mensagem.texto}
                  time={mensagem.horario}
                  senderName={pacienteSelecionado.nome}
                />
              ) : (
                <ConnectMessageBubbleAttendant
                  key={mensagem.id}
                  content={mensagem.texto}
                  time={mensagem.horario}
                />
              )
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input de Mensagem */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={!pacienteSelecionado}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            className="flex-1"
            disabled={!pacienteSelecionado}
          />
          <Button variant="outline" size="icon" disabled={!pacienteSelecionado}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button size="icon" disabled={!pacienteSelecionado}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
