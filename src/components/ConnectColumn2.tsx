import { Send, Paperclip, Mic, UserCog, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusIndicator } from "./ConnectStatusIndicator";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useConversaByPaciente, useMensagensByConversa } from "@/hooks/useConversas";
import { ConnectMessageBubblePatient, ConnectMessageBubbleAttendant } from "./ConnectMessageBubble";
import { useEnviarMensagem, useAtualizarStatusPaciente } from "@/hooks/useMutations";
import { useState, useEffect, useRef } from "react";
import { ConnectTransferDialogNew } from "./ConnectTransferDialogNew";
import { supabase } from "@/integrations/supabase/client";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useIniciarChamada } from "@/hooks/useChamadas";
import { useChamadaContext } from "@/contexts/ChamadaContext";
import { toast } from "sonner";

export const ConnectColumn2 = () => {
  const { pacienteSelecionado } = usePacienteContext();
  const { atendenteLogado } = useAtendenteContext();
  const { data: conversa } = useConversaByPaciente(pacienteSelecionado?.id || null);
  const { data: mensagens } = useMensagensByConversa(conversa?.id || null);
  const enviarMensagem = useEnviarMensagem();
  const atualizarStatus = useAtualizarStatusPaciente();
  const iniciarChamada = useIniciarChamada();
  const { setChamadaAtiva } = useChamadaContext();
  const [mensagemTexto, setMensagemTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Realtime para mensagens
  useEffect(() => {
    if (!conversa?.id) return;

    const channel = supabase
      .channel(`mensagens-${conversa.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mensagens",
          filter: `conversa_id=eq.${conversa.id}`,
        },
        () => {
          // Forçar atualização
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversa?.id]);

  const handleEnviarMensagem = async () => {
    if (!mensagemTexto.trim() || !conversa?.id || !pacienteSelecionado) return;

    // Se for a primeira mensagem do atendente e o paciente está na fila, mudar status
    const ehPrimeiraMensagemAtendente = !mensagens?.some(m => m.autor === "atendente");
    if (ehPrimeiraMensagemAtendente && pacienteSelecionado.status === "fila" && atendenteLogado) {
      await atualizarStatus.mutateAsync({
        pacienteId: pacienteSelecionado.id,
        novoStatus: "em_atendimento",
        atendenteId: atendenteLogado.id,
      });
    }

    await enviarMensagem.mutateAsync({
      conversaId: conversa.id,
      texto: mensagemTexto,
      autor: "atendente",
    });

    setMensagemTexto("");
    setDigitando(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleLigar = async () => {
    if (!pacienteSelecionado || !atendenteLogado) return;

    const chamada = await iniciarChamada.mutateAsync({
      numeroDiscado: pacienteSelecionado.telefone,
      atendenteId: atendenteLogado.id,
      setorOrigem: atendenteLogado.setor_id,
      pacienteId: pacienteSelecionado.id,
      tipo: "paciente",
    });

    setChamadaAtiva(chamada);
    toast.success(`Ligando para ${pacienteSelecionado.nome}`);
  };

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
          <div className="flex items-center gap-2">
            <ConnectStatusIndicator 
              status={getStatusBadge()} 
              tempoNaFila={pacienteSelecionado?.tempo_na_fila || 0}
            />
            <div>
              <h3 className="font-medium text-sm text-foreground">
                {pacienteSelecionado?.nome || "Selecione um paciente"}
              </h3>
              {mensagens && mensagens.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {new Date(mensagens[mensagens.length - 1].created_at).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
        {pacienteSelecionado && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleLigar}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransferDialog(true)}
            >
              <UserCog className="h-4 w-4 mr-2" />
              Transferir
            </Button>
          </div>
        )}
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
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
            {digitando && (
              <div className="text-xs text-muted-foreground italic ml-2 mt-2">
                Digitando...
              </div>
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
            value={mensagemTexto}
            onChange={(e) => {
              setMensagemTexto(e.target.value);
              setDigitando(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
          />
          <Button variant="outline" size="icon" disabled={!pacienteSelecionado}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            disabled={!pacienteSelecionado || !mensagemTexto.trim()}
            onClick={handleEnviarMensagem}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dialog de Transferência */}
      {pacienteSelecionado && conversa && (
        <ConnectTransferDialogNew
          open={showTransferDialog}
          onOpenChange={setShowTransferDialog}
          pacienteId={pacienteSelecionado.id}
          conversaId={conversa.id}
          pacienteNome={pacienteSelecionado.nome}
        />
      )}
    </div>
  );
};
